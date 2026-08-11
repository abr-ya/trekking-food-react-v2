## Why

The Products screen is implemented but does not yet have an accepted OpenSpec contract for its page structure, product actions, access rules, or localization roadmap. Capturing that contract now gives future localization work a stable boundary and lets the first small UI localization change happen without turning the whole screen migration into one oversized task.

## What Changes

- Create the initial `products` capability spec for the `/products` screen, covering the protected page, two-column layout, products list, pagination, filters/search, product cards, create form, edit dialog, delete dialog, and category edit action as currently implemented.
- Document product action permissions from the existing business rules: authenticated users can create products; owners can edit/delete personal products; shared products are read-only/system-controlled from the user UI.
- Localize the Products page title through the existing i18n foundation, keeping other Products screen strings in English for follow-up changes.
- Add future backlog items for localizing the remaining Products screen surfaces in smaller changes: list/table/card area, create form, edit/delete dialogs, and supporting states.
- Treat already-processed source docs as candidates for `docs/archive/` after their content is represented in OpenSpec. For this change, the product pagination plan/report are the relevant candidates.

## Non-goals

- Do not localize every Products screen string in this change.
- Do not redesign the Products screen layout or replace product cards with a new table component.
- Do not change backend authorization rules or API contracts.
- Do not add new product CRUD capabilities beyond documenting and preserving the current behavior.
- Do not mass-archive unrelated `docs/` plans and reports.

## Capabilities

### New Capabilities

- `products`: Product catalog screen behavior, including list retrieval, pagination/filter/search UX, create/edit/delete UI, product ownership/editing rules, and documentation/archive hygiene for source docs that have been folded into OpenSpec.

### Modified Capabilities

- `i18n`: Extend localization coverage from the top navigation foundation to the Products page title only.

## Impact

- Affected UI/code: `src/pages/products-page.tsx`, `src/i18n/resources.ts`, and any existing typing/helpers needed to read the localized title.
- Affected specs/docs: new delta spec under `openspec/changes/feat-0003-products-page-audit/specs/products/spec.md`, delta spec for `i18n`, `openspec/CAPABILITIES.md`, `openspec/BACKLOG.md`, and selected `docs/` files moved to `docs/archive/` only after their content is captured.
- Backend/API changes: none expected. The frontend will keep using existing product APIs and TanStack Query hooks.
- Dependencies: none expected.
