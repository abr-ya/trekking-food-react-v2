## ADDED Requirements

### Requirement: Hiking detail page chrome localization

The Hiking detail page SHALL render its generic title fallback, back link, and
top-level tab labels through the i18n system.

#### Scenario: English Hiking detail page chrome

- **WHEN** the selected language is English
- **THEN** the generic Hiking detail title fallback is shown in English
- **AND** the back link to the Hikings list is shown in English
- **AND** the top-level tab labels are shown in English

#### Scenario: Russian Hiking detail page chrome

- **WHEN** the selected language is Russian
- **THEN** the generic Hiking detail title fallback is shown in Russian
- **AND** the back link to the Hikings list is shown in Russian
- **AND** the top-level tab labels are shown in Russian

#### Scenario: Hiking detail behavior is preserved

- **WHEN** the selected language changes
- **THEN** the route, hiking data loading, loaded hiking-name title, selected tab
  values, and tab contents remain otherwise unchanged

## MODIFIED Requirements

### Requirement: Localization scope boundary

The app SHALL localize only the top navigation menu, Products page title,
Recipes page title, Categories page title, Hikings page title, and Hiking detail
page chrome until later OpenSpec changes expand the localization scope.

#### Scenario: Other non-menu strings are unchanged

- **WHEN** the selected language changes
- **THEN** labels outside the top navigation menu, Products page title, Recipes
  page title, Categories page title, Hikings page title, and Hiking detail page
  chrome remain outside the current localization scope
