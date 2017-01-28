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
                plugin.afterCreation(annotation);
            })
            .subscribe("annotationUpdated", function (annotation) {
                plugin.afterUpdate(annotation);
            })
            .subscribe("annotationDeleted", function (annotation) {
                var postDeleteUrl = mw.config.get('wgScriptPath')+'/api.php?action=delete&title=Annotation:'
                    +mw.config.get('wgPageName')+'/'+annotation.id;
                api.deletePage(postDeleteUrl);
            });
    };

    plugin.afterCreation = function (annotation) {
        plugin.annotationPageForm(annotation);

        api.getPageContent('Annotation:'+mw.config.get('wgPageName'), function (content) {
            if(content.length < 1){
                var page_content = mw.msg('annotation-main-page-description')
                    +' [['+mw.config.get('wgPageName')+']].\n\n'
                    +'=='+mw.msg('annotations')+'==\n'
                    +'{{#ask:\n'
                    +'[[Category:TextAnnotation]]\n'
                    +'|?AnnotationComment\n'
                    +'|?LastModificationUser\n'
                    +'|?LastModificationDate\n'
                    +'|?Category\n'
                    +'|mainlabel=Annotation\n'
                    +'|format=table\n'
                    +'}}';

                api.createPage('Annotation:'+mw.config.get('wgPageName'), page_content);
            }
        })
    };

    plugin.afterUpdate = function (annotation) {
        plugin.annotationPageForm(annotation);
    };

    plugin.afterPopupCancel = function (annotation) {
        if(!plugin.annotationSaved){
            this.annotator.deleteAnnotation(annotation);
        }
    };

    plugin.loadAnnotationsFromLocalVar = function () {
        console.info("Load existing annotations...");
        if(annotationsStore.annotations != null && annotationsStore.annotations.length > 0){
            var clone = $.extend(true, [], annotationsStore.annotations);
            this.annotator.loadAnnotations(clone);
        }
    };

    plugin.annotationPageForm = function(annotation) {
        var category_form = categoriesMap[annotation.category].replace(/\w+:/g, '');
        var url = mw.config.get('wgScript')
            + '/Special:FormEdit/'
            + category_form
            + '/Annotation:'
            + mw.config.get('wgPageName')
            + '/' + annotation.id;

        plugin.openPopup(url, annotation);
    };

    plugin.openPopup = function(url, annotation) {
        $.featherlight(
            {
                iframe: url,
                iframeMaxWidth: '100%',
                iframeWidth: 800,
                iframeHeight: 400,
                // SET CONFIG HERE
                afterContent: function () {
                    plugin.setPopupContent(annotation);
                },
                afterClose: function () {
                    plugin.afterPopupCancel(annotation);
                }
            });
    };

    plugin.setPopupContent = function(annotation) {
        var iframeContent = $("iframe").contents();
        // Replace body content by only the form part
        iframeContent.find("body").html( iframeContent.find("#content") );
        // CSS adjustments
        iframeContent.find("#content").css("border", "none");
        iframeContent.find("#content").css("margin", 0);

        // TODO: append comment, category, annotation metadata and annotation type
        //iframeContent.find("#comment").val(annotation.text);
        //iframeContent.find('input[name="TextAnnotation[AnnotationOf]"]').val(mw.config.get('wgPageName'));

        var annotationOfField = iframeContent.find('input[name="TextAnnotation[AnnotationOf]"]');
        annotationOfField.val(mw.config.get('wgPageName'));
        annotationOfField.closest('tr').css('display', 'none');

        var annotationCommentField = iframeContent.find('input[name="TextAnnotation[AnnotationComment]"]');
        annotationCommentField.val(annotation.text);
        annotationCommentField.closest('tr').css('display', 'none');

        var annotationOfField = iframeContent.find('input[name="TextAnnotation[LastModificationDate]"]');
        annotationOfField.val(new Date(new Date(mw.now()).getTime() - (new Date(mw.now()).getTimezoneOffset() * 60000)).toISOString());
        annotationOfField.closest('tr').css('display', 'none');

        var annotationOfField = iframeContent.find('input[name="TextAnnotation[LastModificationUser]"]');
        annotationOfField.val('User:'+mw.user.getName());
        annotationOfField.closest('tr').css('display', 'none');

        var annotationMetadataField = iframeContent.find('input[name="TextAnnotation[AnnotationMetadata]"]');
        annotationMetadataField.val(util.fromJsonToEscaped(annotation));
        annotationMetadataField.closest('tr').css('display', 'none');

        // auto scale popup
        $("iframe").width(iframeContent.find("#content").width());
        $("iframe").height(iframeContent.find("#content").height()+75);

        // append save functionality
        iframeContent.find("#wpSave").click(function() {
            plugin.annotationSaved = true;
            $.featherlight.current().close();
        });
        iframeContent.find(".editHelp > a").click(function() {
            $.featherlight.current().close();
        });
    };

    plugin.annotationSaved = false;

    return plugin;
};