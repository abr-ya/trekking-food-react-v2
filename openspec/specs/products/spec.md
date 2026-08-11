# Products Specification

## Purpose

Define the product catalog screen behavior, including route access, list
retrieval controls, product card content, create/edit/delete actions, ownership
rules, and documentation archive hygiene for processed Products source docs.

## Requirements

### Requirement: Products route access

The system SHALL require authentication before rendering the Products screen content.

#### Scenario: Anonymous user opens Products

- **WHEN** an unauthenticated user opens `/products`
- **THEN** the system shows the protected-page authentication prompt
- **AND** product list and create form content are not rendered

#### Scenario: Authenticated user opens Products

- **WHEN** an authenticated user opens `/products`
- **THEN** the system renders the Products page content

### Requirement: Products page composition

The Products screen SHALL present a page title, a products list/table surface, and a product creation form.

#### Scenario: Products page renders primary regions

- **WHEN** an authenticated user opens `/products`
- **THEN** the page shows the Products page title
- **AND** the page shows a products list/table surface
- **AND** the page shows a create-product form

#### Scenario: Products page keeps current layout scope

- **WHEN** this change is implemented
- **THEN** the existing two-column Products page structure is preserved
- **AND** no new table replacement is required for the current product card list

### Requirement: Products list query controls

The Products list/table surface SHALL support category filtering, debounced name search, and server-backed pagination.

#### Scenario: User searches products

- **WHEN** the user types a product name search
- **THEN** the system sends the trimmed search value to the products list query after the debounce interval
- **AND** the current page resets to page 1

#### Scenario: User filters by categories

- **WHEN** the user changes selected product categories
- **THEN** the system sends the selected category IDs to the products list query
- **AND** the current page resets to page 1

#### Scenario: Multiple pages exist

- **WHEN** the products response metadata reports more than one total page
- **THEN** the system shows pagination controls
- **AND** changing pages updates the products list query page

#### Scenario: One page exists

- **WHEN** the products response metadata reports one or zero total pages
- **THEN** the system does not show useless previous/next pagination controls
- **AND** the system may show a compact product count summary

### Requirement: Products list states

The Products list/table surface SHALL expose loading, background-fetching, error, empty, and page-empty states.

#### Scenario: Initial products load

- **WHEN** the products query is loading
- **THEN** the system shows loading placeholders in the list/table surface

#### Scenario: Background products refetch

- **WHEN** the products query is refetching while previous list data is available
- **THEN** the system keeps the previous data visible
- **AND** shows a background loading indicator or overlay

#### Scenario: Products query fails

- **WHEN** the products query returns an error
- **THEN** the system shows an error message in the list/table surface

#### Scenario: No products exist for the current query

- **WHEN** the products query succeeds with no products for the current filters
- **THEN** the system shows an empty-state message instead of product rows/cards

### Requirement: Product card content

Each product entry in the Products list/table surface SHALL show product identity, nutrition, price, category when present, and vegetarian status when true.

#### Scenario: Product entry renders product details

- **WHEN** the list contains a product
- **THEN** the product entry shows the product name
- **AND** shows calories, proteins, fats, carbohydrates, and price

#### Scenario: Product has category and vegetarian flag

- **WHEN** a product has a category and `isVegetarian` is true
- **THEN** the product entry shows the category name
- **AND** shows a vegetarian indicator

### Requirement: Product creation

The Products screen SHALL allow authenticated users to create products with validated product attributes and a required category.

#### Scenario: User creates a product

- **WHEN** an authenticated user submits valid product data from the create-product form
- **THEN** the system sends a create-product mutation through the product hook/API layer
- **AND** invalidates product list queries after success
- **AND** resets the create form after success

#### Scenario: Category options are unavailable

- **WHEN** product categories are loading, fail to load, or are empty
- **THEN** the create-product form shows the corresponding loading, error, or empty guidance for the category field

### Requirement: Product edit and delete permissions

The Products screen SHALL show product edit, category-edit, and delete controls only for personal products owned by the authenticated user.

#### Scenario: Owner sees personal product actions

- **WHEN** the authenticated user views a personal product whose `userId` matches the current user ID
- **THEN** the system shows controls to edit the product, edit its category when category data is present, and delete the product

#### Scenario: Non-owner views personal product

- **WHEN** the authenticated user views a personal product whose `userId` does not match the current user ID
- **THEN** the system does not show edit, category-edit, or delete controls for that product

#### Scenario: User views shared product

- **WHEN** the authenticated user views a shared product
- **THEN** the system does not show edit, category-edit, or delete controls for that product

#### Scenario: Product ownership is unknown

- **WHEN** a product does not include an owner user ID
- **THEN** the system treats the product as not editable in the UI

### Requirement: Product edit and delete mutations

Product edit and delete actions SHALL use existing product mutation hooks and preserve product list cache consistency.

#### Scenario: User edits an owned product

- **WHEN** the owner submits valid edits from the edit-product dialog
- **THEN** the system sends an update-product mutation through the product hook/API layer
- **AND** invalidates product list queries after success
- **AND** closes the dialog after success

#### Scenario: User deletes an owned product

- **WHEN** the owner confirms product deletion
- **THEN** the system sends a delete-product mutation through the product hook/API layer
- **AND** invalidates product list queries after success
- **AND** closes the dialog after success

### Requirement: Processed Products docs archive

The project SHALL move Products source docs into `docs/archive/` only after their behavior has been represented in OpenSpec.

#### Scenario: Products pagination docs are processed

- **WHEN** Products pagination behavior is captured in the Products spec
- **THEN** the existing Products pagination plan and implementation report are moved from `docs/` to `docs/archive/`

#### Scenario: Unrelated docs are not processed

- **WHEN** this Products change is implemented
- **THEN** unrelated plans and reports in `docs/` remain in place
