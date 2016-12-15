/**
 * Annotator Extension Module Script
 * Author: DominikMartin
 */

( function () {
	if (typeof $.fn.annotator !== 'function') {
		console.error("annotator not found");
	} else {
		var content = $('#content').annotator();

		content.annotator('addPlugin', 'MediaWiki');
	}
}() );

function closeIframe() {
    $.featherlight.current().close();
}