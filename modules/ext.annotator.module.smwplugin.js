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

                openPopup(wgScriptPath+'/index.php/Special:FormEdit/TextAnnotation/'+annotation.id, function () {
                    plugin.afterCreation(annotation);
                });
            })
            .subscribe("annotationUpdated", function (annotation) {
                tempAnnotation = annotation;

                openPopup(wgScriptPath+'/index.php/Special:FormEdit/TextAnnotation/'+annotation.id, function () {
                    plugin.afterUpdate(annotation);
                });
            })
            .subscribe("annotationDeleted", function (annotation) {
                console.info("The annotation: %o has just been deleted!", annotation);
            });
    };

    plugin.afterCreation = function (annotation) {
        var iframeContent = $("iframe").contents();
		iframeContent.find("body").html( iframeContent.find("#content") );
		iframeContent.find("#content").css("border", "none");
		iframeContent.find("#content").css("margin", 0);
		$("iframe").width(iframeContent.find("#content").width());
		$("iframe").height(iframeContent.find("#content").height()+40);
		iframeContent.find("#wpSave").click(function() {
			closeIframe();
		});
        //iframeContent.find("h1").html("NEW: "+ annotation.id);
        //iframeContent.find("#comment").val(annotation.text);
        //iframeContent.find("#annotation-metadata").val(toJSON(annotation));
    };

    plugin.afterUpdate = function (annotation) {
        /*var iframeContent = $("iframe").contents();
        iframeContent.find("h1").html("Update: "+ annotation.id);
        iframeContent.find("#comment").val(annotation.text);
        iframeContent.find("#annotation-metadata").val(toJSON(annotation));*/
    };

    plugin.loadAnnotationsFromLocalVar = function () {
        console.info("Load existing annotations...");
        if(annotationsStore.annotations != null && annotationsStore.annotations.length > 0){
            var clone = jQuery.extend(true, [], annotationsStore.annotations);
            this.annotator.loadAnnotations(clone);
        }
    };

    return plugin;
};

var tempAnnotation = {};