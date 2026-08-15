# food-planning Specification

## Purpose

Define the Hiking Food plan tab behavior for distributing recipes and products across hiking days and eating times, including day comments and food-line mutations.

## Requirements

### Requirement: Food plan tab loads hiking detail
The system SHALL render the Hiking detail Food plan tab from the selected hiking detail payload.

#### Scenario: Hiking detail is loading
- **WHEN** the Food plan tab is opened while the hiking detail request is loading
- **THEN** the system displays a loading skeleton instead of the Food plan controls

#### Scenario: Hiking detail fails
- **WHEN** the hiking detail request fails
- **THEN** the system displays an error message that identifies the Food plan load failure

#### Scenario: Hiking detail is unavailable
- **WHEN** the hiking detail request completes without a hiking
- **THEN** the system displays a not-found message instead of the Food plan controls

#### Scenario: Hiking id is invalid
- **WHEN** the Food plan tab receives an empty or invalid hiking id
- **THEN** the system displays a hiking-id error message

### Requirement: Food plan day navigation
The system SHALL derive Food plan day tabs from the hiking `daysTotal` value.

#### Scenario: Hiking has multiple days
- **WHEN** a hiking has `daysTotal` greater than one
- **THEN** the system displays one tab for each day number in ascending order

#### Scenario: Hiking has no positive day count
- **WHEN** a hiking has no positive `daysTotal` value
- **THEN** the system still renders at least Day 1 as the Food plan tab content

#### Scenario: Food plan opens
- **WHEN** the Food plan tab renders day tabs
- **THEN** the first day tab is selected by default

### Requirement: Add recipe to Food plan
The system SHALL allow users to add a recipe to a hiking day and eating time from the Food plan tab.

#### Scenario: Add recipe dependencies are loading
- **WHEN** the recipe list, eating-time list, or hiking detail needed by the add-recipe form is loading
- **THEN** the system displays loading feedback for the affected form area

#### Scenario: Add recipe dependencies fail
- **WHEN** the recipe list, eating-time list, or hiking detail needed by the add-recipe form fails to load
- **THEN** the system displays an error message for the affected dependency

#### Scenario: Add recipe dependencies are empty
- **WHEN** there are no recipes or no eating times available
- **THEN** the system displays an empty-state message for the missing selection

#### Scenario: Add recipe form is submitted
- **WHEN** a user selects a recipe, enters a day number within the hiking day range, selects an eating time, and submits
- **THEN** the system posts the selected recipe, day number, and eating time to the hiking add-from-recipe endpoint

#### Scenario: Add recipe succeeds
- **WHEN** the add-from-recipe mutation succeeds
- **THEN** the system invalidates hiking queries so the Food plan reflects the added recipe products

### Requirement: Recipes by days summary
The system SHALL summarize recipes already scheduled in the Food plan by the days where they appear.

#### Scenario: Food plan has recipe-backed products
- **WHEN** hiking products include recipe identifiers, recipe names, and day numbers
- **THEN** the system displays each recipe once with the unique scheduled days sorted in ascending order

#### Scenario: Food plan has no recipe-backed products
- **WHEN** no hiking products include a recipe identifier
- **THEN** the system does not render the recipes-by-days summary block

#### Scenario: Recipes summary is collapsed
- **WHEN** the user collapses the recipes-by-days summary
- **THEN** the system keeps the summary header visible and does not render the list body

#### Scenario: User hides a recipe from the summary
- **WHEN** the user hides a recipe in the recipes-by-days summary
- **THEN** the system removes that recipe from the visible summary list and persists the hidden recipe for the current hiking

#### Scenario: User restores hidden recipes
- **WHEN** one or more recipes are hidden and the user chooses the show-all action
- **THEN** the system clears the hidden recipes for the current hiking and displays the full summary list again

#### Scenario: All recipes are hidden
- **WHEN** every recipe in the recipes-by-days summary is hidden
- **THEN** the system displays an all-hidden message inside the expanded summary

### Requirement: Day comments
The system SHALL display and edit one comment per hiking day inside the Food plan day content.

#### Scenario: Day has an existing comment
- **WHEN** the selected day has a comment in the hiking detail payload
- **THEN** the system displays that comment as an editable control for the day

#### Scenario: Day has no comment
- **WHEN** the selected day has no comment in the hiking detail payload
- **THEN** the system displays an add-comment action for the day

#### Scenario: User creates a day comment
- **WHEN** the user enters a valid comment for a day without a comment and submits
- **THEN** the system creates the comment and invalidates the hiking detail query

#### Scenario: User updates a day comment
- **WHEN** the user edits an existing day comment and submits
- **THEN** the system updates the comment for that day and invalidates the hiking detail query

#### Scenario: Day comment validation fails
- **WHEN** the user submits a comment shorter than 3 characters or longer than 500 characters
- **THEN** the system prevents submission and displays the validation message

### Requirement: Meal-slot food entries
The system SHALL display hiking products for the selected day grouped by eating time and recipe.

#### Scenario: Eating times are loading
- **WHEN** the selected day's eating-time list is loading
- **THEN** the system displays meal-slot skeletons

#### Scenario: Eating times fail
- **WHEN** the eating-time request fails
- **THEN** the system displays an eating-times error message

#### Scenario: No eating times are configured
- **WHEN** the eating-time request succeeds with no eating times
- **THEN** the system displays a no-eating-times message

#### Scenario: Selected day has food entries
- **WHEN** hiking products exist for the selected day and eating time
- **THEN** the system displays grouped food cards with recipe name, product name, personal quantity, and total quantity

#### Scenario: User edits a food entry quantity
- **WHEN** the user opens quantity editing for a food entry and saves changes
- **THEN** the system updates the hiking product and invalidates the hiking detail query

#### Scenario: User deletes a food entry
- **WHEN** the user confirms deletion of a food entry
- **THEN** the system deletes that hiking product and invalidates the hiking detail query

#### Scenario: User adds food to a meal slot
- **WHEN** the user opens a meal-slot add action
- **THEN** the system provides actions to add either a recipe or a product to that hiking day and eating time

### Requirement: Food plan API boundaries
The system SHALL use existing frontend API and hook boundaries for Food plan data and mutations.

#### Scenario: Food plan reads hiking detail
- **WHEN** the Food plan needs hiking data
- **THEN** the system reads it through the hiking detail hook and API layer

#### Scenario: Food plan mutates hiking products
- **WHEN** the Food plan adds, updates, or deletes hiking products
- **THEN** the system performs the mutation through the hiking hooks and invalidates affected hiking queries

#### Scenario: Food plan mutates day comments
- **WHEN** the Food plan creates or updates day comments
- **THEN** the system performs the mutation through the day-comment hooks and invalidates the hiking detail query
