## ADDED Requirements

### Requirement: Categories page title localization
The Categories page title SHALL render through the i18n system.

#### Scenario: English Categories page title
- **WHEN** the selected language is English
- **THEN** the Categories page title is shown in English

#### Scenario: Russian Categories page title
- **WHEN** the selected language is Russian
- **THEN** the Categories page title is shown in Russian

#### Scenario: Categories title behavior is preserved
- **WHEN** the selected language changes
- **THEN** Categories route access and page content behavior remain unchanged

## MODIFIED Requirements

### Requirement: Localization scope boundary
The app SHALL localize only the top navigation menu, Products page title, Recipes page title, and Categories page title until later OpenSpec changes expand the localization scope.

#### Scenario: Other non-menu strings are unchanged
- **WHEN** the selected language changes
- **THEN** labels outside the top navigation menu, Products page title, Recipes page title, and Categories page title remain outside the current localization scope
