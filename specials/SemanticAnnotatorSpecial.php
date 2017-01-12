<?php
/**
 * SpecialPage for SemanticAnnotator extension
 *
 * @file
 * @ingroup Extensions
 */

class SemanticAnnotatorSpecial extends SpecialPage {
	public function __construct() {
		parent::__construct( 'SemanticAnnotator' );
	}

	/**
	 * Show the page to the user
	 *
	 * @param string $sub The subpage string argument (if any).
	 *  [[Special:HelloWorld/subpage]].
	 */
	public function execute( $sub ) {
		
		$out = $this->getOutput();

		$out->setPageTitle( $this->msg( 'annotator-special-title' ) );

		//$out->addHelpLink( $this->msg( 'help' ) );

		$out->addWikiMsg( 'annotator-special-intro' );

        if( !self::pageExists( 'Form:TextAnnotation' ) )
        {
            $out->addWikiMsg( 'install-description' );

            $installForm = HTMLForm::factory( 'ooui', [], $this->getContext(), 'install-form' );
            $installForm->setSubmitTextMsg( 'install-button-submit' );
            $installForm->setSubmitCallback( [ 'SemanticAnnotatorSpecial', 'install' ] );

            $installForm->show();
        }
        else
        {
            $out->addHTML('<h2>Annotation Categories:</h2>');
            $out->addHTML('<div id="sa-categories" class="oo-ui-layout"></div>');

            $formDescriptor = [
                'name_field' => [
                    'section' => 'section1',
                    'label-message' => 'form-field-name',
                    'type' => 'text',
                    'default' => 'Name',
                ],
                'select_field' => [
                    'class' => 'HTMLSelectField',
                    'section' => 'section1',
                    'label-message' => 'form-field-select',
                    'options' => [
                        'Support Task' => 'support_task',
                        'Help Task' => 'help_task',
                        'Special Task' => 'speial_task'
                    ],
                ]
            ];

            $htmlForm = HTMLForm::factory( 'ooui', $formDescriptor, $this->getContext(), 'form' );

            $htmlForm->setSubmitTextMsg( 'form-button-submit' );
            $htmlForm->setSubmitCallback( [ 'SemanticAnnotatorSpecial', 'trySubmit' ] );

            $htmlForm->show();
        }

        $out->addModules( 'ext.annotator.special' );
	}

    static function install( $formData ) {
        // # Create Properties
        // - Annotation of:Page
        $text = '[[Has type::Page]]';
        self::editPage( 'Property:Annotation_of', $text );
        // - AnnotationComment:Text
        $text = '[[Has type::Text]]';
        self::editPage( 'Property:AnnotationComment', $text );
        // - AnnotationMetadata:Sourcecode
        $text = '[[Has type::Code]]';
        self::editPage( 'Property:AnnotationMetadata', $text );

        // # Create Category
        // - Annotation
        $text = 'This is the Annotation category used by SemanticAnnotator.';
        self::editPage( 'Category:Annotation', $text );
        //   - TextAnnotation (subcategory)
        $text = 'This is the TextAnnotation category used by SemanticAnnotator.'."\n\n";
        $text .= '[[Category:Annotation]]';
        self::editPage( 'Category:TextAnnotation', $text );

        // # Create Template
        // - TextAnnotationTemplate
        $text = '<noinclude>'."\n";
        $text .= 'This is the "TextAnnotation" template.'."\n";
        $text .= 'It should be called in the following format:'."\n";
        $text .= '<pre>'."\n";
        $text .= '{{TextAnnotation'."\n";
        $text .= '|AnnotationOf='."\n";
        $text .= '|AnnotationComment='."\n";
        $text .= '|AnnotationMetadata='."\n";
        $text .= '}}'."\n";
        $text .= '</pre>'."\n";
        $text .= 'Edit the page to see the template text.'."\n";
        $text .= '</noinclude><includeonly>{| class="wikitable"'."\n";
        $text .= '! Annotation of'."\n";
        $text .= '| [[Annotation of::{{{AnnotationOf|}}}]] '."\n";
        $text .= '|-'."\n";
        $text .= '! Annotation Comment'."\n";
        $text .= '| [[AnnotationComment::{{{AnnotationComment|}}}]] '."\n";
        $text .= '|-'."\n";
        $text .= '! Annotation Metadata'."\n";
        $text .= '| [[AnnotationMetadata::{{{AnnotationMetadata|}}}]] '."\n";
        $text .= '|}'."\n";
        $text .= ''."\n";
        $text .= '[[Category:TextAnnotation]]'."\n";
        $text .= '</includeonly>';
        self::editPage( 'Template:TextAnnotation', $text );

        // # Create Form
        // - TextAnnotationForm
        $text = '<noinclude>'."\n";
        $text .= 'Please do not use or modify this form because it belongs to SemanticAnnotator Extension.'."\n";
        $text .= '</noinclude><includeonly>'."\n";
        $text .= '{{{for template|TextAnnotation}}}'."\n";
        $text .= '{| class="formtable"'."\n";
        $text .= '! AnnotationOf: '."\n";
        $text .= '| {{{field|AnnotationOf|hidden}}}'."\n";
        $text .= '|-'."\n";
        $text .= '! AnnotationComment: '."\n";
        $text .= '| {{{field|AnnotationComment}}}'."\n";
        $text .= '|-'."\n";
        $text .= '! AnnotationMetadata: '."\n";
        $text .= '| {{{field|AnnotationMetadata|hidden}}}'."\n";
        $text .= '|}'."\n";
        $text .= '{{{end template}}}'."\n";
        $text .= '\'\'\'Free text:\'\'\''."\n";
        $text .= '{{{standard input|free text|rows=3}}}'."\n";
        $text .= '{{{standard input|save}}} {{{standard input|preview}}} {{{standard input|cancel}}}'."\n";
        $text .= '</includeonly>';
        self::editPage( 'Form:TextAnnotation', $text );

        return wfMessage( 'install-success' )->inContentLanguage()->text();
    }

    static function editPage( $pagename, $text ) {
        $title = Title::newFromText($pagename);
        $wikiPage = new WikiPage( $title );
        $summary = wfMessage( 'autogenerate-summary' )->inContentLanguage()->text();
        $content = ContentHandler::makeContent( $text, $title );
        $wikiPage->doEditContent( $content, $summary, 0 );

        return true;
    }

    static function pageExists( $pagename ) {
        $title = Title::newFromText($pagename);
        $wikiPage = new WikiPage( $title );
        return $wikiPage->exists();
    }
}
