# Hikings Specification

## Purpose

Define the authenticated Hikings list/create screen behavior.

## Requirements

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

### Requirement: Hiking detail page shell

The system SHALL render `/hikings/:id` as an authenticated Hiking detail page
that loads the selected hiking through the hiking hook/API layer.

#### Scenario: Authenticated user opens a hiking detail page

- **WHEN** an authenticated user opens `/hikings/:id`
- **THEN** the page fetches the hiking detail for that id through the hiking
  hook/API layer
- **AND** the page title shows the loaded hiking name when available
- **AND** the page title falls back to a generic Hiking detail title before the
  hiking name is available

#### Scenario: User returns to the Hikings list

- **WHEN** the Hiking detail page is shown
- **THEN** the page provides a back navigation link to `/hikings`

### Requirement: Hiking detail top-level tabs

The system SHALL expose the current Hiking detail workspace through top-level
tabs for overview, food planning, shopping list, day-pack organization, and
member-pack organization.

#### Scenario: User sees detail tabs

- **WHEN** the Hiking detail page is shown
- **THEN** the page shows top-level tabs for Overview, Food plan, Shopping List,
  Packs by Days, and Packs by Users
- **AND** the Overview tab is selected by default

#### Scenario: User opens the overview tab

- **WHEN** the user selects the Overview tab
- **THEN** the page shows the hiking info surface for days total, members total,
  vegetarians total, timestamps when present, admins, and group-size/admin
  actions provided by the current UI

#### Scenario: User opens the food plan tab

- **WHEN** the user selects the Food plan tab
- **THEN** the page shows the food-planning surface for adding recipes to the
  hiking, reviewing recipes by day, day comments, and day eating entries

#### Scenario: User opens the shopping list tab

- **WHEN** the user selects the Shopping List tab
- **THEN** the page shows aggregated product totals for the hiking shopping list
  when items exist

#### Scenario: User opens the Packs by Days tab

- **WHEN** the user selects the Packs by Days tab
- **THEN** the page shows per-day pack organization for hiking products

#### Scenario: User opens the Packs by Users tab

- **WHEN** the user selects the Packs by Users tab
- **THEN** the page shows member-oriented pack organization and export surfaces

### Requirement: Hiking detail scope boundary

The Hiking detail page shell specification SHALL capture only the top-level
composition of `/hikings/:id`; deeper tab behavior SHALL be specified in
separate OpenSpec changes.

#### Scenario: Food-planning internals need changes

- **WHEN** food plan, recipes-by-days, day eating, or day-comment behavior needs
  to be changed or localized
- **THEN** that work is handled by follow-up food-planning or day-comment
  changes, not by this shell specification

#### Scenario: Pack internals need changes

- **WHEN** packs-by-days, packs-by-users, trip-pack, drag-and-drop, save, or
  export behavior needs to be changed or localized
- **THEN** that work is handled by follow-up packing changes, not by this shell
  specification

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
