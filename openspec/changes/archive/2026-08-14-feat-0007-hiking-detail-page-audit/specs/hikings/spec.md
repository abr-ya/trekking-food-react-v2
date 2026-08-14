## ADDED Requirements

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
