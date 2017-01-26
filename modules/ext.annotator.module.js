/**
 * Annotator Extension Module Script
 * Author: DominikMartin, BenjaminHosenfeld
 */

( function () {
	var url = mw.config.get('wgScriptPath')+'/api.php?action=ask&query=[[Category:TextAnnotation]][[Annotation of::'+mw.config.get('wgPageName')+']]|?AnnotationComment|?AnnotationMetadata&format=json';
	$.getJSON(url, function(json) {
		var annotations = util.parseAskApiCall(json);
		annotationsStore.init(annotations);
	})
		.done(function() {
			/* start annotator if loading successfully */
			console.log("loading annotations completed");

			api.getAllCategoryPageForms(function(results) {
				var categories = new Object();
				Object.keys(results).forEach(function(prop) {
					categoriesMap[results[prop].printouts['SA Category Name'][0]] = results[prop].fulltext;
					categories[results[prop].printouts['SA Category Name'][0]] = 'annotator-hl-'+results[prop].printouts['SA Category Color'][0];
				});
				initAnnotator(categories);

				// Execute after COMPLETE Annotator is loaded so annotation-wrapper node exists!
				util.checkAnnotationPosition(annotationsStore.annotations);
			});
		})
		.fail(function() {
			console.log("loading annotations error");
		})
}() );

function initAnnotator(categories){
	if (typeof $.fn.annotator !== 'function') {
		console.error("annotator not found");
	} else {
		var content = $('#content').annotator();


		//content.annotator('addPlugin', 'AnnotatorViewer');
		content.annotator('addPlugin', 'Categories', categories);
		content.annotator('addPlugin', 'MediaWiki');
	}
}

var categoriesMap = new Object();

function closeIframe() {
    $.featherlight.current().close();
}