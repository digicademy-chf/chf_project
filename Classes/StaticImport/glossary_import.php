<?php
# Load xml file

if (file_exists('glossary/Altenglisch.xml')) {
    $glossary_orig = simplexml_load_file('glossary/Altenglisch.xml');

    print_r($glossary_orig);
} else {
    exit('Konnte Glossarartikel nicht öffnen.');
}

## Clean file from processing instructions with xsl


// XSL
$xsl = simplexml_load_file("remove_processing_instructions.xsl");

// Processor
$proc = new XSLTProcessor();
$proc->importStyleSheet($xsl);

// Transform XML
$glossary = $proc->transformToXML($glossary_orig);
$glossary = simplexml_load_string($glossary);

##############
#############
// Name of glossary article
$glossary_name = $glossary->text->body->entry->form->orth;

// ID of glossary article
$id = $glossary->xpath('@xml:id')[0]->id;

// Array with author name
$authors = array();
foreach ($glossary->teiHeader->fileDesc->titleStmt->author as $author) {
    $author = array (
        'surname' => (string) $author->surname,
        'forename' => (string) $author->forename
      );
    array_push($authors, $author);
}

// Editor name
$editor = array (
    'surname' => (string) $glossary->teiHeader->fileDesc->titleStmt->editor->surname,
    'forename' => (string) $glossary->teiHeader->fileDesc->titleStmt->editor->forename
);

// Array with all referenced weblinks
if (isset($glossary->text->body->cit->xr->ref)) {
    $weblinks = array();
    foreach ($glossary->text->body->cit->xr->ref as $weblink) {
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
foreach ($glossary->teiHeader->xpath('//ref[@type="bibliography"]/bibl[@corresp][not(/author)]') as $further_literature) {
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
    }
    return $innerXML;
  };

// Retrieve xml text of glossary article sense
$glossary_sense = array (
        'text' => dom_import_simplexml($glossary->text->body->entry->sense)->textContent,
        'xml' => SimpleXMLElement_innerXML($glossary->text->body->entry->sense)
      );   

// Array with all linked infoboxes      
$infoboxes = array();
foreach ($glossary->xpath('text/body/entry/note[@type]') as $infobox) {
    $infobox_id = $infobox->xpath("@xml:id");
    $infobox_data = array (
        'id' => (string) $infobox_id[0]->id,
        'title' => (string) $infobox->title
      );
    array_push($infoboxes, $infobox_data);
}


##################################
##################################


# Initialize object Contributor
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

// Initialize object Example
$allInfoboxes = array();
foreach ($infoboxes as $infobox_data){
    $infobox = new Example();
    $infobox -> text = $infobox_data['title'];
    $infobox -> source = $infobox['id'];
    $contributorAuthor -> surname = $author['surname'];
    $contributorAuthor -> label = 'author';
    array_push($allInfoboxes, $infobox);
}

// Initialize object Entry
$entry = new Entry();

$entry -> id = $id;
$entry -> type = 'glossaryEntry';
$entry -> title = $glossary_name;
$entry -> publicationSteps = $publicationSteps;

$entry -> example = $allInfoboxes;
$entry -> contentElements = $glossary_sense['xml'];

foreach ($editingSteps as $editingStep){
    ####### editingNotes, editingSteps, revisionNumber, revisionDate, publicationDate?
    $entry -> editingSteps = $editingStep;
    $entry -> editingNotes = $editingNote;
    $entry -> publicationDate = $publicationDate;
}


?>