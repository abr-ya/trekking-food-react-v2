# Recipes Specification

## Purpose

Define the Recipes catalog screen behavior, including route access, page
composition, list retrieval and states, recipe-card navigation, recipe creation,
recipe category creation entry point, and documentation archive hygiene for
processed Recipes source docs.

## Requirements

### Requirement: Recipes route access
The system SHALL require authentication before rendering the Recipes screen content.

#### Scenario: Anonymous user opens Recipes
- **WHEN** an unauthenticated user opens `/recipes`
- **THEN** the system shows the protected-page authentication prompt
- **AND** recipes list and create form content are not rendered

#### Scenario: Authenticated user opens Recipes
- **WHEN** an authenticated user opens `/recipes`
- **THEN** the system renders the Recipes page content

### Requirement: Recipes page composition
The Recipes screen SHALL present a page title, a recipes list surface, a recipe creation form, and a recipe category creation entry point.

#### Scenario: Recipes page renders primary regions
- **WHEN** an authenticated user opens `/recipes`
- **THEN** the page shows the Recipes page title
- **AND** the page shows a recipes list surface
- **AND** the page shows a create-recipe form
- **AND** the page provides a way to open recipe category creation

#### Scenario: Recipes page keeps current layout scope
- **WHEN** this change is implemented
- **THEN** the existing two-column Recipes page structure is preserved
- **AND** the recipe detail screen remains outside this screen-level scope

### Requirement: Recipes list retrieval and pagination
The Recipes list surface SHALL retrieve recipes through the recipes hook/API layer with server-backed pagination.

#### Scenario: Initial recipes list query
- **WHEN** the Recipes list renders
- **THEN** the system requests recipes through the recipes hook/API layer
- **AND** the request includes the current page and a fixed list limit

#### Scenario: Multiple pages exist
- **WHEN** the recipes response metadata reports more than one total page
- **THEN** the system shows pagination controls
- **AND** changing pages updates the recipes list query page

#### Scenario: One page exists
- **WHEN** the recipes response metadata reports one or zero total pages
- **THEN** the system does not show useless previous/next pagination controls
- **AND** the system may show a compact recipe count summary

### Requirement: Recipes list states
The Recipes list surface SHALL expose loading, background-fetching, error, empty catalog, and page-empty states.

#### Scenario: Initial recipes load
- **WHEN** the recipes query is loading without cached list data
- **THEN** the system shows loading placeholders in the list surface

#### Scenario: Background recipes refetch
- **WHEN** the recipes query is refetching while previous list data is available
- **THEN** the system keeps the previous data visible
- **AND** shows a background loading indicator or overlay

#### Scenario: Recipes query fails
- **WHEN** the recipes query returns an error
- **THEN** the system shows an error message in the list surface

#### Scenario: No recipes exist
- **WHEN** the recipes query succeeds with no recipes for the current query
- **THEN** the system shows an empty catalog message instead of recipe cards

#### Scenario: Requested recipes page is empty
- **WHEN** the recipes query succeeds with no recipes on the requested page while placeholder data is not being shown
- **THEN** the system shows a page-empty message instead of recipe cards

### Requirement: Recipe card content and navigation
Each recipe entry in the Recipes list surface SHALL show recipe identity, summary metadata, shared status when present, and navigation to the recipe detail page.

#### Scenario: Recipe entry renders details
- **WHEN** the list contains a recipe
- **THEN** the recipe entry shows the recipe name
- **AND** shows the recipe description when present
- **AND** shows the number of ingredients

#### Scenario: Recipe is shared
- **WHEN** a recipe has `isCommon` set
- **THEN** the recipe entry shows a shared/common indicator

#### Scenario: User opens recipe detail
- **WHEN** the user activates a recipe link or edit/navigation icon from the list
- **THEN** the system navigates to `/recipes/:id` for that recipe

### Requirement: Recipe creation
The Recipes screen SHALL allow authenticated users to create recipes with validated metadata, category selection, ingredients, quantities, and shared status.

#### Scenario: User creates a recipe
- **WHEN** an authenticated user submits valid recipe data from the create-recipe form
- **THEN** the system sends a create-recipe mutation through the recipe hook/API layer
- **AND** invalidates recipe queries after success
- **AND** resets the create form after success

#### Scenario: Ingredient product options are unavailable
- **WHEN** products are loading, fail to load, or are empty
- **THEN** the create-recipe form shows the corresponding loading, error, or empty guidance for ingredient product selection

#### Scenario: Recipe category options are unavailable
- **WHEN** recipe categories are loading, fail to load, or are empty
- **THEN** the create-recipe form shows the corresponding loading, error, or empty guidance for category selection

#### Scenario: User searches ingredient products
- **WHEN** the user searches for a product while selecting recipe ingredients
- **THEN** the system searches products through the product API/query layer
- **AND** maps matching products into select options without bypassing the hook/API conventions

### Requirement: Recipe category creation entry point
The Recipes screen SHALL provide an authenticated entry point for creating recipe categories.

#### Scenario: User opens recipe category creation
- **WHEN** an authenticated user clicks the recipe category creation control on `/recipes`
- **THEN** the system opens the recipe category dialog
- **AND** the dialog is configured for recipe categories

### Requirement: Recipes page action scope
The Recipes list screen SHALL keep edit actions scoped to navigation to the recipe detail page.

#### Scenario: List screen does not edit recipe metadata inline
- **WHEN** the Recipes list renders a recipe card
- **THEN** metadata, category, ingredient edit, and delete workflows are not performed inline on the list screen
- **AND** the recipe card links to the recipe detail page for those workflows

### Requirement: Processed Recipes docs archive
The project SHALL move Recipes source docs into `docs/archive/` only after their behavior has been represented in OpenSpec.

#### Scenario: Recipes list pagination docs are processed
- **WHEN** Recipes list pagination behavior is captured in the Recipes spec
- **THEN** the existing Recipes list pagination plan and implementation report are moved from `docs/` to `docs/archive/`

#### Scenario: Recipe detail docs are not processed
- **WHEN** this `/recipes` screen audit is implemented
- **THEN** recipe detail source docs remain active until a recipe detail OpenSpec change represents them
