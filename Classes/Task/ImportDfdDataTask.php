<?php

declare(strict_types=1);

# This file is part of the extension Namenforschung for TYPO3.
#
# For the full copyright and license information, please read the
# LICENSE.txt file that was distributed with this source code.


namespace Digicademy\Namenforschung\Task;

use \TYPO3\CMS\Scheduler\Task\AbstractTask;

/**
 * Task to manage the import of DFD data
 * TODO: possibly generalise and move to DA Ingest
 * 
 * Tasks like this are usually kept to a minimum with the business
 * logic encapsulated in a separate class.
 */
class ImportDfdDataTask extends AbstractTask
{
    /**
     * {@inheritdoc}
     */
    public function execute()
    {
        // Call and start main import class
        $existImport = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(Digicademy\Namenforschung\Import\ImportDfdData::class);
        $existImport->go();
    }
}

?>
