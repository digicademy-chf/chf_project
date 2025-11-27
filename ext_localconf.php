<?php
declare(strict_types=1);

# This file is part of the sitepackage CHF Project for TYPO3.
#
# For the full copyright and license information, please read the
# LICENSE.txt file that was distributed with this source code.


defined('TYPO3') or die();

// Backend customisation
$GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['backend'] = [
    'backendFavicon'       => 'EXT:chf_project/Resources/Public/Images/favicon-small.svg',
    'backendLogo'          => 'EXT:chf_project/Resources/Public/Icons/Backend.svg',
    'loginLogo'            => 'EXT:chf_project/Resources/Public/Icons/Login.svg',
    'loginLogoAlt'         => 'Cultural Heritage Framework',
    'loginHighlightColor'  => '#9b1526',
    'loginBackgroundImage' => 'EXT:chf_project/Resources/Public/Icons/Background.svg'
];
