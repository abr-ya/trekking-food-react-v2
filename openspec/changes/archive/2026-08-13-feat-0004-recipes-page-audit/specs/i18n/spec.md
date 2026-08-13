## ADDED Requirements

### Requirement: Recipes page title localization
The Recipes page title SHALL render through the i18n system.

#### Scenario: English Recipes page title
- **WHEN** the selected language is English
- **THEN** the Recipes page title is shown in English

#### Scenario: Russian Recipes page title
- **WHEN** the selected language is Russian
- **THEN** the Recipes page title is shown in Russian

#### Scenario: Recipes title behavior is preserved
- **WHEN** the selected language changes
- **THEN** Recipes route access and page content behavior remain unchanged

## MODIFIED Requirements

### Requirement: Localization scope boundary
The app SHALL localize only the top navigation menu, Products page title, and Recipes page title until later OpenSpec changes expand the localization scope.

#### Scenario: Other non-menu strings are unchanged
- **WHEN** the selected language changes
- **THEN** labels outside the top navigation menu, Products page title, and Recipes page title remain outside the current localization scope
