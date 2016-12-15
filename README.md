#SemanticAnnotator

This is an Extension for Semantic Media Wiki.

## Installation

Clone this Repository to your MediaWiki extensions folder.

	cd extensions
	git clone https://github.com/DominikMartin/SemanticAnnotator.git

Append the following line to the end of your `LocalSettings.php`

	wfLoadExtension( 'SemanticAnnotator' );

## Code Checking (optional)

This automates the recommended code checkers for PHP and JavaScript code in Wikimedia projects
(see https://www.mediawiki.org/wiki/Continuous_integration/Entry_points).
To take advantage of this automation.
 - install nodejs, npm, and PHP composer
 - change to the extension's directory
 - npm install
 - composer install

Once set up, running `npm test` and `composer test` will run automated code checks.
