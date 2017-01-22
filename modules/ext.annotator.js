/**
 * Annotator Extension Main Script
 * Author: DominikMartin, BenjaminHosenfeld
 */
mw.notify( $('<span>Hallo ' + mediaWiki.user.getName() + ',<br>Sie können Annotator nun benutzen indem Sie auf '+mw.msg('annotate-button-text')+' klicken...</span>') );

// flag representing the status of annotator mode
var loaded = false;

( function () {
	// append annotate button and status to menu
	$('#p-views>ul').append('<li id="ca-annotate"><span><a href="#" title="'+mw.msg('annotate-button-desc')+'" accesskey="a">'+mw.msg('annotate-button-text')+'</a><i class="fa fa-check" aria-hidden="true"></i></span></li>');

	// do if annotate button is clicked
	$('#ca-annotate').click(function() {
		loaded = !loaded;
		
		if(loaded){
			mw.loader.using( 'ext.annotator.module' ).then( function () {
                $( '#ca-annotate' ).addClass( 'selected' );
				// if module is loaded message will pop up
				mw.notify( mw.message('annotate-welcome-message') );
			} );
		}else{
			//$('#content').annotator('destroy');
            $( '#ca-annotate' ).removeClass( 'selected' );
			mw.notify( mw.message('annotate-godbye-message') );
			location.reload();
		}
	});
}() );