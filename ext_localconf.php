<?php
defined('TYPO3') or die();

# This file is part of the extension DA Bib for TYPO3.
#
# For the full copyright and license information, please read the
# LICENSE.txt file that was distributed with this source code.


// Use statements
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

// Prevent script from being called directly
defined( 'TYPO3' ) or die();

// Register content for this extension
( function( $extKey='namenforschung' ) {

    // Backend customisation
    $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['backend'] = [
        'backendFavicon'       => 'EXT:' . $extKey . '/Resources/Public/Images/favicon-small.svg',
        'backendLogo'          => 'EXT:' . $extKey . '/Resources/Public/Icons/Backend.svg',
        'loginBackgroundImage' => 'EXT:' . $extKey . '/Resources/Public/Icons/Background.svg',
        'loginLogo'            => 'EXT:' . $extKey . '/Resources/Public/Icons/Login.svg',
        'loginLogoAlt'         => 'Portal für Namenforschung',
        'loginHighlightColor'  => '#389000'
    ];

} )();
