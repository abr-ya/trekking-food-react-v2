# navigation

## Purpose

Top navigation menu: config-driven items, route consistency, visibility rules
(anonymous vs admin), active-section indication, and docs that match real guards.

## Requirements

### Requirement: Menu-to-route consistency

Every top navigation menu item SHALL link to a route that exists in the
application, and the item's path SHALL match the declared route path exactly,
with no trailing-slash divergence.

#### Scenario: Each menu path resolves to a real route

- **WHEN** the app renders the top menu
- **THEN** every item's `path` matches exactly one route declared in the router
- **AND** navigating to that path renders the corresponding page (not a 404 / fallback)

#### Scenario: No trailing-slash mismatch

- **WHEN** a menu item path and its route path are compared
- **THEN** they are byte-for-byte equal (e.g. both `/products`, never `/products` vs `/products/`)

### Requirement: Menu visibility

The top menu SHALL show all navigation items to every user regardless of
authentication state, except app-admin-only items, which SHALL be shown only to
app admins. Authentication SHALL NOT hide non-admin items; instead, opening an
auth-required page shows that page's authentication prompt.

#### Scenario: Anonymous user sees all non-admin items

- **WHEN** an unauthenticated user views the top menu
- **THEN** all non-admin items are shown (none are hidden due to missing auth)

#### Scenario: Opening a protected page prompts for auth (item not hidden)

- **WHEN** an unauthenticated user opens an auth-required page from the menu
- **THEN** the page shows the "please authenticate" prompt
- **AND** the item remains visible in the menu

#### Scenario: Admin-only item hidden from non-admins

- **WHEN** a user who is not an app admin views the top menu
- **THEN** the `Admin` item is not shown
- **AND** directly visiting `/admin` shows the access-denied state

#### Scenario: Admin sees the admin item

- **WHEN** an app admin views the top menu
- **THEN** the `Admin` item is shown and opens the admin area

### Requirement: Active section indication

The top menu SHALL visually indicate the item that corresponds to the currently
active route.

#### Scenario: Current route is highlighted

- **WHEN** the user is on a page reachable from the menu
- **THEN** the matching menu item is rendered in its active style
- **AND** at most one item is marked active at a time

### Requirement: Single-source admin check

Admin gating for both the menu item and the `/admin` route SHALL be derived from a
single shared predicate, so the two can never disagree.

#### Scenario: Menu and route agree on admin access

- **WHEN** the admin predicate returns a value for the current user
- **THEN** the menu item visibility and the route guard both use that same value

### Requirement: Docs reflect actual guard behavior

The access table in `docs/BUSINESS_LOGIC.md` SHALL describe the access behavior the
app actually enforces via its route/page guards.

#### Scenario: Auth-required destination is documented as auth-required

- **WHEN** a destination is wrapped in an auth guard (`ProtectedPage`)
- **THEN** `docs/BUSINESS_LOGIC.md` marks that destination as requiring authentication

#### Scenario: Public destination is documented as public

- **WHEN** a destination has no auth guard (e.g. About)
- **THEN** `docs/BUSINESS_LOGIC.md` marks that destination as publicly accessible
