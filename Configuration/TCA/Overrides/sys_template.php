<?php
defined('TYPO3') or die();

# This file is part of the extension DA Bib for TYPO3.
#
# For the full copyright and license information, please read the
# LICENSE.txt file that was distributed with this source code.


// Add overrides for this extension and table
( function( $extKey='namenforschung' ) {

    // Add a default TypoScript, including constants and setup
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
        $extKey,
        'Configuration/TypoScript/',
        'Namenforschung'
    );

} )();
