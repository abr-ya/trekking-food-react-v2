## ADDED Requirements

### Requirement: Products page title localization

The Products page title SHALL render through the i18n system.

#### Scenario: English Products page title

- **WHEN** the selected language is English
- **THEN** the Products page title is shown in English

#### Scenario: Russian Products page title

- **WHEN** the selected language is Russian
- **THEN** the Products page title is shown in Russian

#### Scenario: Products title behavior is preserved

- **WHEN** the selected language changes
- **THEN** Products route access and page content behavior remain unchanged

## MODIFIED Requirements

### Requirement: Localization scope boundary

This change SHALL localize only the top navigation menu and Products page title and SHALL NOT migrate other app UI strings.

#### Scenario: Other non-menu strings are unchanged

- **WHEN** the selected language changes
- **THEN** labels outside the top navigation menu and Products page title remain outside the scope of this change
