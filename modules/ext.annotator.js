/**
 * Annotator Extension Main Script
 * Author: DominikMartin, BenjaminHosenfeld
 */
mw.notify( $('<span>Hallo ' + mediaWiki.user.getName() + ',<br>Sie können Annotator nun benutzen indem Sie auf '+mw.msg('annotate-button-text')+' klicken...</span>') );

// flag representing the status of annotator mode
var loaded = false;

( function () {
	// append annotate button and status to menu
	$('#p-views>ul').append('<li id="ca-annotate"><span><a href="#" title="'+mw.msg('annotate-button-desc')+'" accesskey="a">'+mw.msg('annotate-button-text')+'</a></span></li>');
	$('#p-views>ul').append('<li id="ca-annotate_icon"><span><a href="#" title="'+mw.msg('annotate-icon-desc')+'" accesskey="a" class="status_'+loaded+'"></a></span></li>');
	
	// do if annotate button is clicked
	$('#ca-annotate').click(function() {
		loaded = !loaded;
		
		if(loaded){
			mw.loader.using( 'ext.annotator.module' ).then( function () {
				// refresh the status icon TODO: fix the refresh
				document.getElementById('ca-annotate_icon').refresh;
				// if module is loaded message will pop up
				mw.notify( mw.message('annotate-welcome-message') );
			} );
		}else{
			//$('#content').annotator('destroy');
			mw.notify( mw.message('annotate-godbye-message') );
			location.reload();
		}
	});
	
	// do if annotate icon is clicked
	$('#ca-annotate_icon').click(function() {
		
		if(loaded){
			mw.notify( $(mw.msg('status-on')) );
		} else{
			mw.notify( $(mw.msg('status-off')) );
		}
	});
}() );