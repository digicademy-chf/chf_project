<?php

declare(strict_types=1);

# This file is part of the extension Namenforschung for TYPO3.
#
# For the full copyright and license information, please read the
# LICENSE.txt file that was distributed with this source code.


namespace Digicademy\Namenforschung\Import;

/**
 * Import routine for DFD data
 * TODO: possibly generalise and move to DA Lex
 */
class ImportDfdData
{
    /**
     * Main function to orchestrate a full import of DFD data from
     * a Git folder on the same server.
     */
    public function go()
    {
        // TODO Import various registers
        // Retrieve contributors
        // Retrieve countries
        // Retrieve regions
        // Retrieve languages
        // Retrieve taxonomies

        // TODO Import bibliographic data
        // Retrieve bibliography

        // TODO Prepare relations
        // Compile a list of all UUIDs (entries and senses, infoboxes, glossary entries)

        // TODO Import main data
        // Retrieve glossary entries
        // Retrieve infoboxes
        // Retrieve entries

        // TODO Save import state (e.g. tag of Git backup?)
    }
}

?>
