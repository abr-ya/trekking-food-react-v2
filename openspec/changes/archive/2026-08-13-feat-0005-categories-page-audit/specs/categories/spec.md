## ADDED Requirements

### Requirement: Categories route access
The system SHALL require authentication before rendering the Categories screen content.

#### Scenario: Anonymous user opens Categories
- **WHEN** an unauthenticated user opens `/categories`
- **THEN** the system shows the protected-page authentication prompt
- **AND** product and recipe category list content is not rendered

#### Scenario: Authenticated user opens Categories
- **WHEN** an authenticated user opens `/categories`
- **THEN** the system renders the Categories page content

### Requirement: Categories page composition
The Categories screen SHALL present a page title, a product categories surface, and a recipe categories surface.

#### Scenario: Categories page renders primary regions
- **WHEN** an authenticated user opens `/categories`
- **THEN** the page shows the Categories page title
- **AND** the page shows a product categories region
- **AND** the page shows a recipe categories region

#### Scenario: Categories page keeps current layout scope
- **WHEN** this change is implemented
- **THEN** the existing two-column Categories page structure is preserved
- **AND** category table and pagination behavior remains outside this screen-level scope

### Requirement: Product category list
The product categories surface SHALL retrieve product categories through the categories hook/API layer and render them as category cards.

#### Scenario: Product categories load
- **WHEN** the product categories surface renders
- **THEN** the system requests product categories through the product categories hook/API layer
- **AND** the product category endpoint response is normalized to a `{ data }` list shape

#### Scenario: Product category card renders details
- **WHEN** the product categories response contains a category
- **THEN** the system shows the category name
- **AND** the system shows a product count summary based on that category's nested products

### Requirement: Recipe category list
The recipe categories surface SHALL retrieve recipe categories through the categories hook/API layer and render them as category cards.

#### Scenario: Recipe categories load
- **WHEN** the recipe categories surface renders
- **THEN** the system requests recipe categories through the recipe categories hook/API layer
- **AND** the recipe category endpoint response is normalized to a `{ data }` list shape

#### Scenario: Recipe category card renders details
- **WHEN** the recipe categories response contains a category
- **THEN** the system shows the category name
- **AND** the system shows a recipe count summary based on that category's nested recipes

### Requirement: Category list states
Each category list surface SHALL expose loading, error, and empty states.

#### Scenario: Category list is loading
- **WHEN** a category list query is loading
- **THEN** the system shows loading placeholders in that category list surface

#### Scenario: Category list query fails
- **WHEN** a category list query returns an error
- **THEN** the system shows an error message in that category list surface

#### Scenario: Category list is empty
- **WHEN** a category list query succeeds with no categories
- **THEN** the system shows an empty category list message instead of category cards

### Requirement: Category creation
The Categories screen SHALL allow authenticated users to create product and recipe categories by name.

#### Scenario: User opens product category creation
- **WHEN** an authenticated user clicks the new product category control
- **THEN** the system opens the category dialog configured for product category creation

#### Scenario: User opens recipe category creation
- **WHEN** an authenticated user clicks the new recipe category control
- **THEN** the system opens the category dialog configured for recipe category creation

#### Scenario: User submits a new category
- **WHEN** an authenticated user submits a valid category name from the category dialog
- **THEN** the system sends the matching product or recipe category create mutation through the hook/API layer
- **AND** the system invalidates the matching category queries after success
- **AND** the system closes the dialog after success

### Requirement: Category editing
The Categories screen SHALL allow authenticated users to edit product and recipe category names.

#### Scenario: User opens category editing
- **WHEN** an authenticated user activates a category card edit control
- **THEN** the system opens the category dialog configured for the selected category kind
- **AND** the dialog is prefilled with the selected category name

#### Scenario: User submits an edited category
- **WHEN** an authenticated user submits a valid changed category name
- **THEN** the system sends the matching product or recipe category update mutation through the hook/API layer
- **AND** the system invalidates the matching category queries after success
- **AND** the system closes the dialog after success

### Requirement: Category deletion
The Categories screen SHALL allow authenticated users to delete product and recipe categories after confirmation.

#### Scenario: User opens category deletion
- **WHEN** an authenticated user activates a category card delete control
- **THEN** the system opens a delete confirmation dialog for the selected category

#### Scenario: User confirms category deletion
- **WHEN** an authenticated user confirms category deletion
- **THEN** the system sends the matching product or recipe category delete mutation through the hook/API layer
- **AND** the system invalidates the matching category queries after success
- **AND** the system closes the confirmation dialog after success

#### Scenario: Delete confirmation explains associated items
- **WHEN** the delete confirmation dialog is shown
- **THEN** the dialog explains that associated products or recipes remain without the deleted category

### Requirement: Category action permission boundary
The Categories screen SHALL expose category create, edit, and delete controls only inside the authenticated page.

#### Scenario: Anonymous user cannot invoke category actions
- **WHEN** an unauthenticated user opens `/categories`
- **THEN** category create, edit, and delete controls are not rendered

#### Scenario: Authenticated user sees category actions
- **WHEN** an authenticated user opens `/categories`
- **THEN** the system renders category create controls
- **AND** category cards render edit and delete controls

#### Scenario: Backend rejects category mutation
- **WHEN** a category mutation is rejected by the backend authorization or validation rules
- **THEN** the system keeps the user on the Categories screen
- **AND** the mutation failure is handled by the existing API-client and mutation error behavior

### Requirement: Processed Categories docs archive
The project SHALL move Categories source docs into `docs/archive/` only after their behavior has been represented in OpenSpec.

#### Scenario: Direct Categories docs are processed
- **WHEN** implementation finds `docs/` source documents directly describing current Categories screen or category CRUD behavior
- **THEN** those documents are moved to `docs/archive/` only after the represented behavior is captured in the Categories spec

#### Scenario: No direct Categories docs exist
- **WHEN** implementation does not find dedicated Categories screen source docs
- **THEN** no docs archive move is required for this change

#### Scenario: Authoritative and unrelated docs remain active
- **WHEN** this Categories screen audit is implemented
- **THEN** authoritative docs such as `docs/BUSINESS_LOGIC.md` remain active
- **AND** unrelated or broader source docs remain outside this archive move
