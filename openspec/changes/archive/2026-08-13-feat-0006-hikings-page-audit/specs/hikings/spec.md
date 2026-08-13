## ADDED Requirements

### Requirement: Authenticated Hikings page layout

The system SHALL render `/hikings` as an authenticated Hikings page with a list
area and a create-hiking area.

#### Scenario: Authenticated user opens Hikings

- **WHEN** an authenticated user opens `/hikings`
- **THEN** the page shows the Hikings page title
- **AND** the page shows a Hikings list area
- **AND** the page shows a Create hiking form area

### Requirement: Hikings list states

The system SHALL fetch hikings through the hikings hook/API layer and render the
list loading, error, empty, and populated states.

#### Scenario: Hikings are loading

- **WHEN** the hikings list request is pending
- **THEN** the list area shows loading placeholders

#### Scenario: Hikings request fails

- **WHEN** the hikings list request fails
- **THEN** the list area shows an error message with the failure reason when one
  is available

#### Scenario: Hikings list is empty

- **WHEN** the hikings list request succeeds with no hikings
- **THEN** the list area tells the user there are no hikings yet

#### Scenario: Hikings list has data

- **WHEN** the hikings list request succeeds with hikings
- **THEN** the list area renders one card per hiking
- **AND** each card shows the hiking name, days total, members total, and
  vegetarians total

#### Scenario: Hikings list includes metadata

- **WHEN** the hikings list response includes pagination metadata
- **THEN** the list area shows the current page, total pages, total count, and
  page limit as informational copy

### Requirement: Hiking detail navigation from list

The system SHALL allow users to navigate from a hiking card to that hiking's
detail route.

#### Scenario: User chooses a hiking

- **WHEN** the user activates a hiking name in the Hikings list
- **THEN** the app navigates to `/hikings/:id` for that hiking

### Requirement: Create hiking form

The system SHALL let authenticated users create a hiking from `/hikings` using
the create-hiking form.

#### Scenario: User submits a valid hiking

- **WHEN** the user submits a valid name, days total, members total, and
  vegetarians total
- **THEN** the app sends the create request through the hikings hook/API layer
- **AND** the hikings list cache is invalidated after success
- **AND** the form is reset after success

#### Scenario: User submits invalid hiking data

- **WHEN** the user submits a hiking with invalid create values
- **THEN** the form validation prevents the create request

#### Scenario: Hiking create request is pending

- **WHEN** the create request is pending
- **THEN** the submit control is disabled and shows the pending state

### Requirement: Hikings screen scope boundary

The `/hikings` screen SHALL only cover hiking discovery, creation, and
navigation into detail pages.

#### Scenario: User needs recipe planning actions

- **WHEN** the user needs to distribute recipes or products across hiking days
- **THEN** those actions are handled outside `/hikings` on the hiking detail
  experience

#### Scenario: User needs detail tab actions

- **WHEN** the user needs food-plan, packing, shopping-list, admin, day-comment,
  or group-size actions
- **THEN** those actions are handled outside this `/hikings` list/create screen
  specification
