## ADDED Requirements

### Requirement: Hikings page title localization

The Hikings page title SHALL render through the i18n system.

#### Scenario: English Hikings page title

- **WHEN** the selected language is English
- **THEN** the Hikings page title is shown in English

#### Scenario: Russian Hikings page title

- **WHEN** the selected language is Russian
- **THEN** the Hikings page title is shown in Russian

#### Scenario: Hikings title behavior is preserved

- **WHEN** the selected language changes
- **THEN** Hikings route access and page content behavior remain unchanged

## MODIFIED Requirements

### Requirement: Localization scope boundary

The app SHALL localize only the top navigation menu, Products page title,
Recipes page title, Categories page title, and Hikings page title until later
OpenSpec changes expand the localization scope.

#### Scenario: Other non-menu strings are unchanged

- **WHEN** the selected language changes
- **THEN** labels outside the top navigation menu, Products page title, Recipes
  page title, Categories page title, and Hikings page title remain outside the
  current localization scope
