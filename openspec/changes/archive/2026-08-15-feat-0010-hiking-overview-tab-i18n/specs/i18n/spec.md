## ADDED Requirements

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
