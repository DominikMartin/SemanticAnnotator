/**
 * Annotator Extension Module Script
 * Author: DominikMartin
 */

( function () {
	var url = mw.config.get('wgScriptPath')+'/api.php?action=ask&query=[[Category:AnnotationCategory]][[Category:TextAnnotationCategory]][[AnnotationType::'+mw.config.get('wgPageName')+']]|?AnnotationComment|?AnnotationMetadata&format=json';
	$.getJSON(url, function(json) {
		var annotations = util.parseAskApiCall(json);
		annotationsStore.init(annotations);
	})
		.done(function() {
			/* start annotator if loading successfully */
			console.log("loading annotations completed");

			if (typeof $.fn.annotator !== 'function') {
				console.error("annotator not found");
			} else {
				var content = $('#content').annotator();

				content.annotator('addPlugin', 'MediaWiki');
			}
		})
		.fail(function() {
			console.log("loading annotations error");
		})
}() );

function closeIframe() {
    $.featherlight.current().close();
}