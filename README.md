# Namenforschung

- Description: Sitepackage for the Portal für Namenforschung in TYPO3
- Author: Jonatan Jalle Steller ([jonatan.steller@adwmainz.de](mailto:jonatan.steller@adwmainz.de))
- Requirements: `typo3/cms-core` 12, `digicademy/da-bib`, `digicademy/da-ingest`, `digicademy/da-lex`, `digicademy/da-map`, `digicademy/da-quality`, `digicademy/lod`, `georgringer/news`
- License: GPL 3
- Version: 0.0.2

This component provides all frontend elements and configuration needed by the *Portal für Namenforschung*, which also contains the Digital Dictionary of Surnames in Germany (*Digitales Famieliennamenwörterbuch Deutschlands*, DFD). In addition, it orchestrates other Digicademy extensions and provides additional templates where necessary. The layout is designed to be accessible, provide a sense of control, and benefit from being used as a web app. The extension does not depend on a CSS or JavaScript framework because it is part of an academic long-term project. As such, it benefits from conservative infrastructure choices and code that is relatively easy to maintain without compromising on frontend features that present-day users (both academic and non-academic) have come to expect.

## Features

- HTML: accessibility, web app, semantic tags
- CSS: responsive, components, variables, dark mode, transitions
- JS: supporting CSS, no frameworks, sharing API
- Layouts: hub, page, entry (dictionary, encyclopedia, glossary)

Older version:

- One colour per topic hub, dictionary as entry page
- 5 hubs, many dependent article pages, new maps
- Accessible and with decorations/animations for various target audiences
- Search includes suggestions, similar results, and an expert mode
- Embedded metadata for Zotero, search engines, and social networks
- Footnotes and contextual information via in-text info buttons
- Adapts to user devices (screen size, dark modes, sharing)
- Can be installed as a web app and collects as little data as possible
- API to include the dictionary into, for example, the Elexis Dictionary Matrix
- Preparations for a new data model, a new import routine and an up-to-date Typo3

Further technical features:

- Semantic and accessible markup, HTML components where possible
- GDPR compliant without Google fonts, cookies only when really necessary, no tracking
- No frameworks or preprocessors, no package management
- Leaflet.js is the only dynamic dependency and OpenStreetMap the only client API call

## Setup

## Usage

## Development

## Roadmap

**Initial content**

- First version of DA Lex
- Initial implementation of the frontend
- Basic content in the new system, revised
- Docker environment

**Maps, serialisations, bibliography**

- Add TEI Lex-0 and OntoLex Lemon
- Add embedded metadata (based on OntoLex Lemon?)
- First version of DA Maps
- First version of DA Bib
- Revise frontend and DA Lex accordingly

**Frontpage and ingest**

- Implement all frontpage elements
- First version of DA Ingest
- Import bibliography via Git
- Import entries, glossary, and articles via Git
- Show glossary in entries and articles

**Finishing touches**

- Import missing, recent news items
- Finish English translations
- Frontend revisions as necessary
- Set up proper API page and content negotation
- Implement search
- Implement statistics
- Check SEO and XML sitemap

**Nice to have**

- Import DA Bib data straight from Zotero
- Add visualisations to search results
- Implement expert mode in search
- Improve use of (and links to) external APIs such as Wikidata
- Work on DA Quality
- Find a good way to compile data dumps and activate the page
- Add historical map data
- Add a bibliography page
- Add network visualisations
- Make taxonomies available in the frontend

## Known issues

- Safari does not redraw scrollbars after the transitions in suggestions and selects

## Credit

This project uses the font [Adobe Source Sans](https://github.com/adobe-fonts/source-sans), availabe under the SIL Open Font License 1.1. It further uses the [Leaflet.js library](https://leafletjs.com/) (curently at version 1.9.2) to display maps, available under the Simplified BSD License. The artwork was produced specifically for this project.