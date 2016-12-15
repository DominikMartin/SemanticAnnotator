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
		
		//$out->addModules( 'ext.annotator' );

		$out->setPageTitle( $this->msg( 'annotator-special-title' ) );

		$out->addHelpLink( $this->msg( 'help' ) );

		$out->addWikiMsg( 'annotator-special-intro' );

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
		$htmlForm->setSubmitCallback( [ 'AnnotatorSpecial', 'trySubmit' ] );

		$htmlForm->show();
	}

	static function trySubmit( $formData ) {
		if ( $formData['name_field'] == 'Name' ) {
			return true;
		}

		return 'HAHA FAIL';
	}
}
