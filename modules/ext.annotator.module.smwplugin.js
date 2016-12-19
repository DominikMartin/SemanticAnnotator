Annotator.Plugin.MediaWiki = function (element) {
    var plugin = {};

    plugin.pluginInit = function () {
        /* Load existing annotations */
        plugin.loadAnnotationsFromLocalVar();

        this.annotator
            .subscribe("beforeAnnotationCreated", function (annotation) {
                // TODO: SET ANNOTATION METADATA BEFORE CREATION
                annotation.id = randomName(10);
            })
            .subscribe("annotationCreated", function (annotation) {
                tempAnnotation = annotation;

                openPopup(mw.config.get('wgScript')+'/Special:FormEdit/AnnotationForm/Annotation:'+mw.config.get('wgPageName')+'/'+annotation.id, function () {
                    plugin.afterCreation(annotation);
                });
            })
            .subscribe("annotationUpdated", function (annotation) {
                tempAnnotation = annotation;

                openPopup(mw.config.get('wgScript')+'/Special:FormEdit/AnnotationForm/Annotation:'+mw.config.get('wgPageName')+'/'+annotation.id, function () {
                    plugin.afterUpdate(annotation);
                });
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
        iframeContent.find('textarea[name="AnnotationTemplate[AnnotationComment]"]').val(annotation.text);
        iframeContent.find('textarea[name="AnnotationTemplate[AnnotationMetadata]"]').val(util.fromJsonToEscaped(annotation));
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
        iframeContent.find('textarea[name="AnnotationTemplate[AnnotationComment]"]').val(annotation.text);
        iframeContent.find('textarea[name="AnnotationTemplate[AnnotationMetadata]"]').val(util.fromJsonToEscaped(annotation));
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

    return plugin;
};

var tempAnnotation = {};