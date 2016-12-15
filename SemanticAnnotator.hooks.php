<?php
/**
 * Hooks for Annotator extension
 *
 * @file
 * @ingroup Extensions
 */

class SemanticAnnotatorHooks {
	
	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) { 
		if($out->getTitle()->getNamespace() == 0) {		//0 is the Aricle's Namespace
			$out->addModules( 'ext.annotator' );
		}
		return true;
	}

}
