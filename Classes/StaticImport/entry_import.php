<?php
# Load xml file
if (file_exists('names/a Brassard.xml')) {
    $entry_orig = simplexml_load_file('names/a Brassard.xml');

    print_r($entry_orig);
} else {
    exit('Konnte a Brassard.xml nicht öffnen.');
}

## Clean file from processing instructions with xsl

// XSL
$xsl = simplexml_load_file("remove_processing_instructions.xsl");

// Processor
$proc = new XSLTProcessor();
$proc->importStyleSheet($xsl);

// Transform XML
$entry = $proc->transformToXML($entry_orig);
$entry = simplexml_load_string($entry);

#############
#############
// Name of article
$article = $entry->xpath('teiHeader/fileDesc/titleStmt/title[@type="item"]')[0];

// ID of article
$id = $entry->xpath('@xml:id')[0]->id;

// Type of article (e.g. main, variant)
$entry_type = $entry->xpath('//entry/@type')[0]->type;

// Array with author names
$authors = array();
foreach ($entry->teiHeader->fileDesc->titleStmt->author as $author) {
    $author = array (
        'surname' => (string) $author->surname,
        'forename' => (string) $author->forename
      );
    array_push($authors, $author);
}

// Editor name
$editor = array (
    'surname' => (string) $entry->teiHeader->fileDesc->titleStmt->editor->surname,
    'forename' => (string) $entry->teiHeader->fileDesc->titleStmt->editor->forename
);

// Database query
$query = $entry->xpath('//profileDesc/creation/listChange/change[@type="query"]')[0];
echo ' DB-Abfrage: ', $query;

// Publication steps
$publicationSteps = array();
foreach ($entry->teiHeader->profileDesc->creation->listChange->xpath('change[position()>=16][@status="done"]') as $change) {
    array_push($publicationSteps, (string) $change[0]);
}

// Array with all editing steps
$editingSteps = array();
foreach ($entry->teiHeader->profileDesc->creation->listChange->change as $change) {
    if ($change->xpath(".[position()=1][@status='done']")) {
        $editingStep = 'checkDatabase';
        array_push($editingSteps, $editingStep);
    }
    if ($change->xpath(".[position()=5][@status='done']")) {
        $editingStep = 'checkForeignLanguage';
        array_push($editingSteps, $editingStep);
    }
    if ($change->xpath(".[position()=6][@status='done']")) {
        $editingStep = 'checkRegional';
        array_push($editingSteps, $editingStep);
    }
    if ($change->xpath(".[position()=7][@status='done']")) {
        $editingStep = 'checkPrevious';
        array_push($editingSteps, $editingStep);
    }
    if ($change->xpath(".[@type='further_literature'][@status='done']")) {
        $editingStep = 'checkFurther';
        array_push($editingSteps, $editingStep);
    }
    if ($change->xpath(".[@type='query_neighboring_countries'][@status='done']") and $change->xpath(".[@type='query_countries_of_origin'][@status='done']") and $change->xpath(".[@type='query_other_countries'][@status='done']")) {
        $editingStep = 'checkMaps';
        array_push($editingSteps, $editingStep);
    }
}

// Rating of article
$rating_scale = $entry->xpath('//keywords[@scheme="rating_scale"]/term')[0];

// Tokens and rank
foreach ($entry->text->body->entry->usg as $usg) {
    switch((string) $usg['type']) {
    case 'token':
        $token = $usg;
        break;
    case 'rank':
        $rank = $usg;
        break;
    }
}

// Array with all languages
$languages = array();
foreach ($entry->text->body->entry->etym->xpath('lang/@xml:lang') as $language) {
    array_push($languages, (string) $language[0]);
}

// Array with all countries
$countries = array();
foreach ($entry->text->body->entry->etym->xpath('country/@key') as $country) {
    array_push($countries, (string) $country[0]);
}

// Array with all regions
$regions = array();
foreach ($entry->text->body->entry->etym->region as $region) {
    array_push($regions, $region);
}

// Retrieve all data from senses
$senses = array();

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

// Array with all sense data, label of sense, taxonomy
foreach ($entry->text->body->entry->sense as $sense_group) {
    $group_label = $sense_group->xpath("@expand");
    
    foreach ($sense_group->sense as $sense) {
        $taxonomy = $sense->xpath("@ana");
        $sense_id = $sense->xpath("anchor/@xml:id");
        $sense_no = $sense->xpath("@n");
        $sense_languages = array();
        $sense_reference = array();
        
        foreach ($sense->xpath(".//lang[ancestor::sense]") as $sense_language) {
            $sense_language_key = $sense_language->xpath("@xml:lang");
            $sense_languages[(string) $sense_language_key[0]] = (string) $sense_language[0];
        }

        foreach ($sense->xpath(".//ref[ancestor::sense]") as $sense_ref) {
            $sense_ref_type = $sense_ref->xpath("@type");
            $sense_ref_target = $sense_ref->xpath("@target");
            $ref_data = array(
                'type' => (string) $sense_ref_type[0]->type,
                'target' => (string) $sense_ref_target[0]->target,
                'ref' => (string) $sense_ref
            );
            array_push($sense_reference, $ref_data);
        }
        
        $sense_data = array(
            'taxonomy' => (string) $taxonomy[0]->ana,
            'id' => (string) $sense_id[0]->id,
            'no' => (string) $sense_no[0]->n,
            'label' => (string) $group_label[0]->expand,
            'definition' => dom_import_simplexml($sense)->textContent,
            'xml' => SimpleXMLElement_innerXML($sense),
            'languages' => $sense_languages,
            'references' => $sense_reference
        );
        
        array_push($senses, $sense_data);
    }
    

}

// Array with all variants of article
$variants = array();
foreach ($entry->xpath('text/body/entry/form[@type]/ref') as $variant) {
        $variant_target = $variant->xpath("@target");
        $variant_data = array (
            'target' => (string) $variant_target[0]->target,
            'ref' => (string) $variant
          );
        array_push($variants, $variant_data);
}

// Array with all referenced weblinks
$weblinks = array();
foreach ($entry->text->body->entry->xr->ref as $weblink) {
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
 
// Array with all linked infoboxes
$infoboxes = array();
foreach ($entry->xpath('text/body/entry/note[@type]') as $infobox) {
    $infobox_id = $infobox->xpath("@xml:id");
    $infobox_data = array (
        'id' => (string) $infobox_id[0]->id,
        'title' => (string) $infobox->title
      );
    array_push($infoboxes, $infobox_data);
}

// Array with all data for historical evidences
$historical_evidences = array();
foreach ($entry->xpath('text/body/entry/cit[@type]/q') as $historical_evidence) {
    $date = $historical_evidence->xpath("date/@when");
    $person = $historical_evidence->persName;
    $place = $historical_evidence->placeName;
    $target =  $historical_evidence->xpath("bibl/ref/@target");
    $access =  $historical_evidence->xpath("bibl/date/@when");
    $bibl = array (
        'target' => (string) $target[0]->target,
        'access' => (string) $access[0]->when
    );
    $historical_evidence_data = array (
        'person' => (string) $person,
        'place' => (string) $place,
        'date' => (string) $date[0]->when,
        'bibl' => $bibl
      );
    array_push($historical_evidences, $historical_evidence_data);
}

// Array with strandard references
$standard_references = array();
foreach ($entry->teiHeader->xpath('//listBibl[@type="standard_references"]/bibl[biblScope/text()]') as $standard_reference) {
    $corresp = $standard_reference->xpath("@corresp");
    $biblScope = $standard_reference->biblScope;
    $standard_reference_data = array (
        'corresp' => (string) $corresp[0]->corresp,
        'biblScope' => (string) $biblScope
      );
    array_push($standard_references, $standard_reference_data);
}

// Array with further references
$further_references = array();
foreach ($entry->teiHeader->xpath('//listBibl[not(@type="standard_references")][@type]/bibl[biblScope/text()]') as $further_literature) {
    $corresp = $further_literature->xpath("@corresp");
    $biblScope = $further_literature->biblScope;
    $further_literature_data = array (
        'corresp' => (string) $corresp[0]->corresp,
        'biblScope' => (string) $biblScope
      );
    array_push($further_references, $further_literature_data);
}

// Array with data of all international distributions
$international_distributions = array();
foreach ($entry->xpath('text/body/entry/usg[@type="international_distribution"]') as $international_distribution) {
    $country = $international_distribution->xpath("country/@key");
    $token = $international_distribution->country->num;
    $type = $international_distribution->xpath("bibl/@type");
    $date = $international_distribution->xpath("bibl/date[not(@type)]/@when");
    $target = $international_distribution->xpath("bibl/ref/@target");
    $access = $international_distribution->xpath('bibl/date[@type="last_access"]/@when');
    $ref = $international_distribution->bibl->ref;
    $international_distribution_data = array (
        'country' => (string) $country[0]->key,
        'token' => (string) $token,
        'type' => (string) $type[0]->type,
        'date' => (string) $date[0]->when
      );
    if ('' !== dom_import_simplexml($ref)->textContent) {
        $international_distribution_data['ref'] = (string) $ref;
    }
    if (isset($ref->attributes()->target)) {
        $international_distribution_data['target'] = (string) $target[0]->target;
    }
    if (isset($international_distribution->bibl->date->attributes()->type)) {
        $international_distribution_data['access'] = (string) $access[0]->when;
    }
    array_push($international_distributions, $international_distribution_data);
}

#####################
#####################


// Initialize object Tag type language
$allLanguages = array();
foreach ($languages as $language){
    $languageTag = new Tag();
    $languageTag -> tag = $language;
    $languageTag -> type = 'language';
    array_push($allLanguages, $languageTag);
}

// Initialize object Tag type country
$allCountries = array();
foreach ($countries as $country){
    $countryTag = new Tag();
    $countryTag -> tag = $country;
    $countryTag -> type = 'country';
    array_push($allCountries, $countryTag);
}

// Initialize object Tag type region
$allRegions = array();
foreach ($regions as $region){
    $regionTag = new Tag();
    $regionTag -> tag = $region;
    $regionTag -> type = 'region';
    array_push($allRegions, $regionTag);
}

// Initialize object Frequency
$frequency = new Frequency();
$frequency -> tokens = $token;

// Initialize object Frequency type International Distribution
$allFrequencies = array();
foreach ($international_distributions as $international_distribution){
    $internationalDistribution = new Frequency();
    $internationalDistribution -> type = $international_distribution['type'];
    $internationalDistribution -> tokens = $international_distribution['token'];
    $internationalDistribution -> date = $international_distribution['date'];
    $internationalDistribution -> source = $international_distribution['$$'];
    array_push($allFrequencies, $internationalDistribution);
}

array_push($allFrequencies, $frequency);

// Initialize object Contributor
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


$allDefinitions = array();
$allSenses = array();
foreach ($senses as $thisSense){
    // Initialize object Definition
    $definition = new Definition();
    $definition -> text = $thisSense['definition'];
    array_push($allDefinitions, $definition);

    ###################
    // Initialize object Sense
    $sense = new Sense(); 
    #$sense -> id = ;
    $sense -> uuid = $thisSense['id'];
    $sense -> definition = $definition;
    $sense -> structuredIndicator = $thisSense['taxonomy'];
    $sense -> label = $thisSense['label'];
    array_push($allSenses, $sense);
}

// Initialize new object Example with Object Storage
// Note: Test and edit other properties with multiple values
$allExamples = new ObjectStorage();
foreach ($historical_evidences as $historical_evidence){
    $historicalEvidence = new Example();
    $historicalEvidence -> text = $historical_evidence['person'];
    $historicalEvidence -> date = $historical_evidence['date'];
    $historicalEvidence -> location = $historical_evidence['place'];
    $historicalEvidence -> source = $historical_evidence['bibl'];
    $allExamples = addExample($historicalEvidence);
}

// Initialize object Entry DaBib as property source
$allSources = array();

// Initialize object Entry
$entry = new Entry();

$entry -> id = $id;
$entry -> type = 'entry';
$entry -> headword = $article;
$entry -> databaseQuery = $query;
$entry -> publicationSteps = $publicationSteps;


$allEditingSteps = '';
foreach ($editingSteps as $editingStep){
    ####### editingNotes, editingSteps, revisionNumber, revisionDate, publicationDate?
    $allEditingSteps = (string) $editingStep[0] . ', ';
}
$entry -> editingSteps = $allEditingSteps;

$entry -> classification = $rating_scale + ', ' + $entry_type;

# Note: How do you assign multiple values to one property?
# Attach() Object Storage to property
$entry -> sense = $allSenses;
$entry -> example = $allExamples;

$entry -> distributionLanguage = $allLanguages;
$entry -> distributionCountry = $allCountries;
$entry -> distributionRegion = $allRegions;
$entry -> frequency = $allFrequencies;
$entry -> source = $allSources;


?>