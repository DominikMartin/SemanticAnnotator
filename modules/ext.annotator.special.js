api.getAllCategoryPageForms(function(results) {
    var categories = [];
    Object.keys(results).forEach(function(prop) {
        var category = {};
        category['form'] = results[prop].fulltext;
        category['form_url'] = results[prop].fullurl;
        category['name'] = results[prop].printouts['SA Category Name'][0];
        category['color'] = results[prop].printouts['SA Category Color'][0];
        categories.push(category);
    });

    printTable(categories);
});

function printTable(categories) {
    $( "#sa-categories" ).append( '<table id="categories-table"><tr></tr></table>' );
    // TODO: localization
    $( "#categories-table tr" ).append( '<th>Category</th><th>PageForms Form</th><th>Color</th><th></th>' );
    categories.forEach(function(category) {
        var row = $( "<tr></tr>" );
        $( "#categories-table" ).append(row);

        $( row ).append( '<td>' + category.name + '</td>' );
        $( row ).append( '<td><a href="' + category.form_url + '">' + category.form + '</a></td>' );
        $( row ).append( '<td>' + category.color + '</td>' );

        var button = $( "<button>Delete</button>" );
        button.click(function() {
            deleteCategoryPageFormRelation(category.name, category.form, category.color);
        });
        $( row ).append( button );
    });

    var row = $( "<tr></tr>" );
    $( "#categories-table" ).append(row);

    $( row ).append( '<td><input id="new_category_name" type="text"></td>' );
    $( row ).append( '<td><select id="new_category_form" ></select></td>' );

    var categories_form = categories.map(function (item) {
        return item.form;
    });
    categories_form.push('Form:TextAnnotation');

    api.getAllPageFormPages(function(allpages) {
        allpages.forEach(function(item) {
            if(categories_form.indexOf(item.title) == -1){
                $( "#new_category_form" ).append( '<option>' + item.title + '</option>' );
            }
        });
    });
    $( row ).append( '<td>..</td>' );

    var button = $( "<button>Add</button>" );
    button.click(function() {
        var name = $( "#new_category_name" ).val();
        var form = $( "#new_category_form" ).val();
        buildCategoryPageFormRelation(name, form);
    });
    $( row ).append( button );
}

function deleteCategoryPageFormRelation(name, form, color){
    api.getPageContent(form, function (old_form_content) {
        old_form_content = old_form_content.replace('[[Form Type::SemanticAnnotator]][[SA Category Name::'+name+']][[SA Category Color::'+color+']]\n', '');
        // TODO: remove text annotation template
        api.createPage(form, old_form_content, function () {
            window.location.reload(true);
        });
    });
}

function buildCategoryPageFormRelation(name, form, color){
    if(name.length < 1 || form.length < 1){
        return;
    }
    api.getPageContent(form, function (new_form_content) {
        api.getPageContent('Form:TextAnnotation', function (sa_form_content) {
            var regex_start = /\{\{\{for template\|TextAnnotation}}}/g;
            var regex_end = /\{\{\{end template}}}/g;
            var text_annotation_form_content = util.extractTextBetweenRegexes(sa_form_content, regex_start, regex_end);

            new_form_content = new_form_content.replace('\'\'\'Free text:\'\'\'', text_annotation_form_content + '\n\'\'\'Free text:\'\'\'');
            new_form_content = new_form_content.replace('</noinclude>', '[[Form Type::SemanticAnnotator]][[SA Category Name::'+name+']][[SA Category Color::'+color+']]\n</noinclude>');

            api.createPage(form, new_form_content, function () {
                window.location.reload(true);
            });
        });
    });
}