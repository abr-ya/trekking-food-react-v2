## ADDED Requirements

### Requirement: Hiking Overview tab states

The system SHALL render the Hiking Overview tab from the selected hiking detail
id and show clear states for invalid id, loading, failed, missing, and populated
data.

#### Scenario: Overview receives no hiking id

- **WHEN** the Overview tab is rendered without a hiking id
- **THEN** the tab shows an invalid-id message

#### Scenario: Overview is loading

- **WHEN** the hiking detail request is pending
- **THEN** the tab shows a loading placeholder

#### Scenario: Overview request fails

- **WHEN** the hiking detail request fails
- **THEN** the tab shows an error message with the failure reason when one is
  available

#### Scenario: Overview hiking is missing

- **WHEN** the hiking detail request completes without a hiking
- **THEN** the tab shows a not-found message

### Requirement: Hiking Overview summary fields

The system SHALL show the current hiking summary fields in the Overview tab
when hiking detail data is available.

#### Scenario: Overview shows required summary fields

- **WHEN** the Overview tab has hiking detail data
- **THEN** the tab shows days total, members total, and vegetarians total

#### Scenario: Overview shows optional metadata

- **WHEN** the hiking detail includes created, updated, or creator metadata
- **THEN** the tab shows that metadata in the Overview summary

### Requirement: Hiking Overview members-total action

The system SHALL expose the existing group-size edit action from the Overview
tab next to the members total value.

Reference: `docs/reference/hikings-members-total-api.md` covers the endpoint,
payload, response, authorization, and frontend hook/API/schema mapping.

#### Scenario: User opens group-size edit

- **WHEN** the Overview tab has hiking detail data
- **THEN** the tab shows an entry point to change members total
- **AND** the edit dialog starts from the current members total
- **AND** the dialog enforces a minimum value that is at least the current
  vegetarians total

#### Scenario: User increases group size

- **WHEN** the user submits a valid members total greater than the current value
- **THEN** the system sends the dedicated members-total update through the
  hiking hook/API layer
- **AND** hiking detail, hiking list, and product totals queries are refreshed
  after success

#### Scenario: User decreases group size

- **WHEN** the user submits a valid members total less than the current value
- **THEN** the system shows a confirmation step before sending the update
- **AND** the confirmation describes total recalculation, day-pack deletion,
  unassigned meals, and member-slot clearing consequences

#### Scenario: Members-total update fails

- **WHEN** the members-total update request fails
- **THEN** the dialog shows an inline error message when one is available

### Requirement: Hiking Overview admins action

The system SHALL show current hiking admins and expose the existing add-admin
action from the Overview tab.

#### Scenario: Overview shows existing admins

- **WHEN** the Overview tab has hiking detail data with admins
- **THEN** the tab shows the admin names as a comma-separated list

#### Scenario: Overview has no admins

- **WHEN** the Overview tab has hiking detail data with no admins
- **THEN** the tab shows an empty-admins message

#### Scenario: User adds a hiking admin

- **WHEN** the user opens the add-admin action and submits a user id
- **THEN** the system sends the add-admin request through the hiking hook/API
  layer
- **AND** backend authorization determines whether the current user may add the
  admin

#### Scenario: Add-admin request fails

- **WHEN** the add-admin request fails
- **THEN** the dialog shows an inline error message when one is available
