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

### Requirement: Hiking Overview tab localization

The Hiking Overview tab SHALL render its state messages, field labels, admins
copy, action labels, dialogs, validation-adjacent text, fallback errors, and
success toasts through the i18n system.

#### Scenario: English Overview tab copy

- **WHEN** the selected language is English
- **AND** the user views or interacts with the Hiking Overview tab
- **THEN** Overview state messages, summary labels, admins copy, Edit members
  total copy, Add admin copy, fallback errors, and success toasts are shown in
  English

#### Scenario: Russian Overview tab copy

- **WHEN** the selected language is Russian
- **AND** the user views or interacts with the Hiking Overview tab
- **THEN** Overview state messages, summary labels, admins copy, Edit members
  total copy, Add admin copy, fallback errors, and success toasts are shown in
  Russian

#### Scenario: Overview behavior is preserved

- **WHEN** the selected language changes
- **THEN** hiking detail loading, displayed data values, dialog open/close
  behavior, form validation, mutation payloads, disabled states, cache
  invalidation, and backend authorization behavior remain unchanged

### Requirement: Localization scope boundary

The app SHALL localize only the top navigation menu, Products page title,
Recipes page title, Categories page title, Hikings page title, Hiking detail
page chrome, and Hiking Overview tab until later OpenSpec changes expand the
localization scope.

#### Scenario: Other non-menu strings are unchanged

- **WHEN** the selected language changes
- **THEN** labels outside the top navigation menu, Products page title, Recipes
  page title, Categories page title, Hikings page title, Hiking detail page
  chrome, and Hiking Overview tab remain outside the current localization scope
