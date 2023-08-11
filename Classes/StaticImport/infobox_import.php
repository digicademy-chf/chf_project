<?php
# Load xml file
if (file_exists('infoboxes/Arabisches Namensystem.xml')) {
    $infobox_orig = simplexml_load_file('infoboxes/Arabisches Namensystem.xml');

    print_r($infobox_orig);
} else {
    exit('Konnte Infobox nicht öffnen.');
}

## Clean file from processing instructions with xsl

// XSL
$xsl = simplexml_load_file("remove_processing_instructions.xsl");

// Processor
$proc = new XSLTProcessor();
$proc->importStyleSheet($xsl);

// Transform XML
$infobox = $proc->transformToXML($infobox_orig);
$infobox = simplexml_load_string($infobox);

##############
##############
// Name of infobox article
$infobox_name = $infobox->xpath('teiHeader/fileDesc/titleStmt/title[@type="info"]')[0];

// ID of infobox article
$id = $infobox->xpath('@xml:id')[0]->id;

// Array with author names
$authors = array();
foreach ($infobox->teiHeader->fileDesc->titleStmt->author as $author) {
    $author = array (
        'surname' => (string) $author->surname,
        'forename' => (string) $author->forename
      );
    array_push($authors, $author);
}

// Editor name
$editor = array (
    'surname' => (string) $infobox->teiHeader->fileDesc->titleStmt->editor->surname,
    'forename' => (string) $infobox->teiHeader->fileDesc->titleStmt->editor->forename
);

// Array with all referenced weblinks
if (isset($infobox->text->body->cit->xr->ref)) {
    $weblinks = array();
    foreach ($infobox->text->body->cit->xr->ref as $weblink) {
        $weblink_target = $weblink->xpath("@target");
        $weblink_access = $weblink->xpath("date/@when");
        $weblink_title = $weblink->xpath("title[string()]");
        $weblink_data = array (
            'target' => (string) $weblink_target[0]->target,
            'access' => (string) $weblink_access[0]->when,
            'title' => (string) dom_import_simplexml($weblink)->textContent
        );
        array_push($weblinks, $weblink_data);
    }

}

// Array with further references
$further_references = array();
foreach ($infobox->teiHeader->xpath('//ref[@type="bibliography"]/bibl[@corresp]') as $further_literature) {
    $corresp = $further_literature->xpath("@corresp");
    $biblScope = $further_literature->biblScope;
    $further_literature_data = array (
        'corresp' => (string) $corresp[0]->corresp,
        'biblScope' => (string) $biblScope
      );
    array_push($further_references, $further_literature_data);
}

// Function to get text with xml elements without parent node
function SimpleXMLElement_innerXML($xml)
  {
    $innerXML= '';
    foreach (dom_import_simplexml($xml)->childNodes as $child)
    {
        $innerXML .= $child->ownerDocument->saveXML( $child );
        unset($innerXML->anchor);
    }
    return $innerXML;
  };

// Retrieve xml text and plaion text of paragraphs, save data in array  
$paragraphs = array();
foreach ($infobox->text->body->p as $paragraph) {
    $paragraph_data = array (
        'text' => dom_import_simplexml($paragraph)->textContent,
        'xml' => SimpleXMLElement_innerXML($paragraph)
      );
    array_push($paragraphs, $paragraph_data);
}

##################################
##################################

// Initialize object Contributor
// Note:
$allContributors = array();
foreach ($authors as $author){
    $contributorAuthor = new Contributor();
    $contributorAuthor -> uid = $author['id'];
    $contributorAuthor -> forename = $author['forename'];
    $contributorAuthor -> surname = $author['surname'];
    $contributorAuthor -> label = 'author';
    array_push($allContributors, $contributorAuthor);
}
$contributorEditor = new Contributor();
$contributorAuthor -> uid = $editor['id'];
$contributorEditor -> forename = $editor['forename'];
$contributorEditor -> surname = $editor['surname'];
$contributorEditor -> label = 'editor';
array_push($allContributors, $contributorEditor);

# Initialize object Entry
$entry = new Entry();

#$entry -> id = $;
$entry -> id = $id;
$entry -> type = 'encyclopedicEntry';
$entry -> title = $infobox_name;

$entry -> publicationSteps = $publicationSteps;

$entry -> contentElements = $allParagraphs['xml'];

foreach ($editingSteps as $editingStep){
    ####### editingNotes, editingSteps, revisionNumber, revisionDate, publicationDate?
    $entry -> editingSteps = $editingStep;
    $entry -> editingNotes = $editingNote;
    $entry -> publicationDate = $publicationDate;
}


?>