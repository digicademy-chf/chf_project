<?php

$EM_CONF[$_EXTKEY] = [
    'title'          => 'Namenforschung',
    'description'    => 'Sitepackage for the Portal für Namenforschung in TYPO3',
    'category'       => 'templates',
    'author'         => 'Jonatan Jalle Steller',
    'author_email'   => 'jonatan.steller@adwmainz.de',
    'author_company' => 'Academy of Sciences and Literature Mainz',
    'state'          => 'alpha',
    'version'        => '0.0.2',
    'constraints'    => [
        'depends'   => [
            'typo3'                => '12.0.0-12.99.99',
            'fluid_styled_content' => '12.0.0-12.99.99',
            'php'                  => '8.1.0-8.2.99'
        ],
        'conflicts' => [
        ],
        'suggests'  => [
        ],
    ],
    'autoload'       => [
        'psr-4' => [
           'Digicademy\\Namenforschung\\' => 'Classes/'
        ]
     ]
];

?>