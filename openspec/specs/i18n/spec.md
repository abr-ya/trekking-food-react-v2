# i18n Specification

## Purpose

Define the app's UI language switching behavior and localization scope.

## Requirements

### Requirement: Supported UI locales

The app SHALL support English (`en`) and Russian (`ru`) as selectable UI
languages, with English as the default and fallback language.

#### Scenario: App starts with no saved language

- **WHEN** the app starts and no supported language is saved
- **THEN** the UI language is English

#### Scenario: Saved unsupported language is ignored

- **WHEN** the app starts and localStorage contains an unsupported language value
- **THEN** the UI language falls back to English

### Requirement: Persisted language selection

The app SHALL persist the selected UI language in localStorage so the same
browser keeps the user's choice across reloads.

#### Scenario: User changes language

- **WHEN** the user selects Russian from the language switcher
- **THEN** the app stores `ru` as the selected language
- **AND** the app uses Russian after a reload

### Requirement: Top-menu localization

The top navigation menu SHALL render its labels through the i18n system.

#### Scenario: English menu labels

- **WHEN** the selected language is English
- **THEN** the top menu shows English labels for Home, Products, Recipes,
  Categories, Hikings, About, and Admin

#### Scenario: Russian menu labels

- **WHEN** the selected language is Russian
- **THEN** the top menu shows Russian labels for Home, Products, Recipes,
  Categories, Hikings, About, and Admin

#### Scenario: Existing menu behavior is preserved

- **WHEN** the selected language changes
- **THEN** menu paths, active-link styling, anonymous visibility, and admin-only
  gating keep the same behavior as before

### Requirement: Localization scope boundary

This change SHALL localize only the top navigation menu and SHALL NOT migrate
other app UI strings.

#### Scenario: Non-menu strings are unchanged

- **WHEN** the selected language changes
- **THEN** labels outside the top navigation menu remain outside the scope of this
  change
