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

	public static function onCanonicalNamespaces( array &$namespaces ) {
        global $wgNamespacesWithSubpages;

        if ( !defined( 'NS_ANNOTATION' ) ) {
            define( 'NS_ANNOTATION', 248 );
            define( 'NS_ANNOTATION_TALK', 249 );
        }

        $namespaces[NS_ANNOTATION] = 'Annotation';
        $namespaces[NS_ANNOTATION_TALK] = 'Annotation_talk';

        $wgNamespacesWithSubpages[NS_ANNOTATION] = true;

        return true;
    }

    public static function afterInit( ) {
        global $smwgNamespacesWithSemanticLinks;

        if ( !defined( 'NS_ANNOTATION' ) ) {
            define( 'NS_ANNOTATION', 248 );
            define( 'NS_ANNOTATION_TALK', 249 );
        }

        $smwgNamespacesWithSemanticLinks[NS_ANNOTATION] = true;

        return true;
    }

}
