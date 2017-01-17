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
    $( "#sa-categories" ).empty();
    $( "#sa-categories" ).append( '<table id="categories-table" class="table table-sm table-hover" style="margin-bottom: 0px;"><tr></tr></table>' );
    // TODO: localization
    $( "#categories-table tr" ).append( '<th>'+mw.msg('category')+'</th><th>'+mw.msg('pageforms-form')+'</th><th>'+mw.msg('color')+'</th><th></th>' );
    categories.forEach(function(category) {
        var row = $( "<tr></tr>" );
        $( "#categories-table" ).append(row);

        $( row ).append( '<td>' + category.name + '</td>' );
        $( row ).append( '<td><a href="' + category.form_url + '">' + category.form + '</a></td>' );
		$( row ).append( '<td><span class="special-color-preview-'+category.color+'"></span></td>' );

        var button = $( '<button class="btn btn-danger">'+mw.msg('delete')+'</button>' );
        button.click(function() {
            deleteCategoryPageFormAssignment(category.name, category.form, category.color);
        });
        var button_col = $( '<td style="text-align: right;"></td>' ).append( button );
        $( row ).append( button_col );
    });

    var row = $( "<tr></tr>" );
    $( "#categories-table" ).append(row);

    $( row ).append( '<td><input id="new_category_name" class="form-control" type="text"></td>' );
    $( row ).append( '<td><select id="new_category_form" class="form-control"></select></td>' );

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
	// set all color options
    $( row ).append( '<td><select id="new_category_color" class="form-control">'+
		'<option class="special-color-preview-red" value="red">red</option>'+
		'<option class="special-color-preview-green" value="green">green</option>'+
		'<option class="special-color-preview-yellow" value="yellow">yellow</option>'+
		'<option class="special-color-preview-blue" value="blue">blue</option>'+
		'<option class="special-color-preview-grey" value="grey">grey</option>'+
		'<option class="special-color-preview-box" value="box">box</option>'+
		'</select></td>' );
	
    var button = $( '<button class="btn btn-primary">'+mw.msg('add')+'</button>' );
    button.click(function() {
        var name = $( "#new_category_name" ).val();
        var form = $( "#new_category_form" ).val();
		var temp = document.getElementById("new_category_color");
		var color = temp.options[temp.selectedIndex].value;
		buildCategoryPageFormAssignment(name, form, color);
    });
    var button_col = $( '<td style="text-align: right;"></td>' ).append( button );
    $( row ).append( button_col );
}

function deleteCategoryPageFormAssignment(name, form, color){
    api.getPageContent(form, function (old_form_content) {
        old_form_content = old_form_content.replace('[[Form Type::SemanticAnnotator]][[SA Category Name::'+name+']][[SA Category Color::'+color+']]\n', '');
        // TODO: remove text annotation template
        api.createPage(form, old_form_content, function () {
            window.location.reload(true);
        });
    });
}

function buildCategoryPageFormAssignment(name, form, color){
    if(name.length < 1 || form.length < 1){
        return;
    }
    api.getPageContent(form, function (new_form_content) {
        api.getPageContent('Form:TextAnnotation', function (sa_form_content) {
            var regex_start = /\{\{\{for template\|TextAnnotation}}}/g;
            var regex_end = /\{\{\{end template}}}/g;
            var text_annotation_form_content = util.extractTextBetweenRegexes(sa_form_content, regex_start, regex_end);

            new_form_content = new_form_content.replace(/'''[\w\s]+:'''/g, text_annotation_form_content + '\n\'\'\'Free text:\'\'\'');
            new_form_content = new_form_content.replace('</noinclude>', '[[Form Type::SemanticAnnotator]][[SA Category Name::'+name+']][[SA Category Color::'+color+']]\n</noinclude>');

            api.createPage(form, new_form_content, function () {
                window.location.reload(true);
            });
        });
    });
}