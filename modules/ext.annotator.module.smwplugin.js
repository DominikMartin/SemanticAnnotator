Annotator.Plugin.MediaWiki = function (element) {
    var plugin = {};

    plugin.pluginInit = function () {
        /* Load existing annotations */
        plugin.loadAnnotationsFromLocalVar();

        this.annotator
            .subscribe("beforeAnnotationCreated", function (annotation) {
                // TODO: SET ANNOTATION METADATA BEFORE CREATION
                annotation.id = util.randomName(10);
            })
            .subscribe("annotationCreated", function (annotation) {
                tempAnnotation = annotation;

                var category_form = categoriesMap[annotation.category].replace(/\w+:/g, '');
                var url = mw.config.get('wgScript')
                    + '/Special:FormEdit/'
                    + category_form
                    + '/Annotation:'
                    + mw.config.get('wgPageName')
                    + '/' + annotation.id;

                plugin.openPopup(url, function () {
                    plugin.afterCreation(annotation);
                });

                // TODO: check if tempAnnotation was created correctly
            })
            .subscribe("annotationUpdated", function (annotation) {
                tempAnnotation = annotation;

                var category_form = categoriesMap[annotation.category].replace(/\w+:/g, '');
                var url = mw.config.get('wgScript')
                    + '/Special:FormEdit/'
                    + category_form
                    + '/Annotation:'
                    + mw.config.get('wgPageName')
                    + '/' + annotation.id;

                plugin.openPopup(url, function () {
                    plugin.afterUpdate(annotation);
                });

                // TODO: check if tempAnnotation was updated correctly
            })
            .subscribe("annotationDeleted", function (annotation) {
                var getTokenUrl = mw.config.get('wgScriptPath')+'/api.php?action=query&meta=tokens&format=json';
                $.getJSON(getTokenUrl, function(json) {
                    var postDeleteUrl = mw.config.get('wgScriptPath')+'/api.php?action=delete&title=Annotation:'+mw.config.get('wgPageName')+'/'+annotation.id;
                    $.post(postDeleteUrl, { token: json.query.tokens.csrftoken });
                });
            });
    };

    plugin.afterCreation = function (annotation) {
        var iframeContent = $("iframe").contents();
        // Replace body content by only the form part
		iframeContent.find("body").html( iframeContent.find("#content") );
        // CSS adjustments
		iframeContent.find("#content").css("border", "none");
		iframeContent.find("#content").css("margin", 0);
        // auto scale popup
		$("iframe").width(iframeContent.find("#content").width());
		$("iframe").height(iframeContent.find("#content").height()+40);
        // TODO: append comment, category, annotation metadata and annotation type
        //iframeContent.find("#comment").val(annotation.text);
        iframeContent.find('input[name="TextAnnotation[AnnotationOf]"]').val(mw.config.get('wgPageName'));
        iframeContent.find('textarea[name="TextAnnotation[AnnotationComment]"]').val(annotation.text);
        iframeContent.find('textarea[name="TextAnnotation[AnnotationMetadata]"]').val(util.fromJsonToEscaped(annotation));
        // append save functionality
		iframeContent.find("#wpSave").click(function() {
			closeIframe();
		});
    };

    plugin.afterUpdate = function (annotation) {
        var iframeContent = $("iframe").contents();
        // Replace body content by only the form part
        iframeContent.find("body").html( iframeContent.find("#content") );
        // CSS adjustments
        iframeContent.find("#content").css("border", "none");
        iframeContent.find("#content").css("margin", 0);
        // auto scale popup
        $("iframe").width(iframeContent.find("#content").width());
        $("iframe").height(iframeContent.find("#content").height()+40);
        // TODO: append comment, category, annotation metadata and annotation type
        //iframeContent.find("#comment").val(annotation.text);
        iframeContent.find('input[name="TextAnnotation[AnnotationOf]"]').val(mw.config.get('wgPageName'));
        iframeContent.find('textarea[name="TextAnnotation[AnnotationComment]"]').val(annotation.text);
        iframeContent.find('textarea[name="TextAnnotation[AnnotationMetadata]"]').val(util.fromJsonToEscaped(annotation));
        // append save functionality
        iframeContent.find("#wpSave").click(function() {
            closeIframe();
        });
    };

    plugin.loadAnnotationsFromLocalVar = function () {
        console.info("Load existing annotations...");
        if(annotationsStore.annotations != null && annotationsStore.annotations.length > 0){
            var clone = $.extend(true, [], annotationsStore.annotations);
            this.annotator.loadAnnotations(clone);
        }
    };

    plugin.openPopup = function(url, afterContentFunction) {
        $.featherlight(
            {
                iframe: url,
                iframeMaxWidth: '100%',
                iframeWidth: 800,
                iframeHeight: 600,
                // SET CONFIG HERE
                afterContent: afterContentFunction
            });
    };

    return plugin;
};

var tempAnnotation = {};