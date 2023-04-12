<?php

$EM_CONF[$_EXTKEY] = [
    'title'          => 'DA-Lex',
    'description'    => 'Create and manage lexicographic data in TYPO3',
    'category'       => 'misc',
    'author'         => 'Jonatan Jalle Steller',
    'author_email'   => 'jonatan.steller@adwmainz.de',
    'author_company' => 'Academy of Sciences and Literature Mainz',
    'state'          => 'alpha',
    'version'        => '0.0.1',
    'constraints'    => [
        'depends'   => [
            'typo3' => '12.0.0-12.4.99',
            'php'   => '8.1.0-8.2.99'
        ],
        'conflicts' => [
        ],
        'suggests'  => [
        ],
    ],
    'autoload'       => [
        'psr-4' => [
           'Digicademy\\DALex\\' => 'Classes/'
        ]
     ]
];

?>