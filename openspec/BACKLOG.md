# Backlog

Two separate registers:

- **Idea pool** — candidate features, **no numbers**. Identified by a stable
  `slug`. Pick the next one *by meaning* (priority / value / dependencies).
- **Build log** — append-only, **numbered**. A feature gets its number the moment
  you *start* implementing it. The number is the build order (not the order ideas
  were added) and is the through-line: `#0042` → change dir `0042-<slug>` →
  accepted-spec sync → archive `YYYY-MM-DD-0042-<slug>`.

Capabilities referenced below are defined in [`CAPABILITIES.md`](./CAPABILITIES.md).

---

## Workflow

**Numbering**
- Format: 4 digits, zero-padded (`0042`).
- Source of truth for the next number = **last row of the Build log + 1**
  (don't parse folder names — archived changes are date-prefixed).
- First real OpenSpec change is `0001`.
- OpenSpec change names must start with a letter, so the change name is
  `<type>-<NNNN>-<slug>` (mirrors the branch with `-` instead of `/`), e.g.
  `feat-0001-top-menu-audit`.

**Adding an idea**
- Append a row to the Idea pool with a unique, stable `slug` (kebab-case).
- `slug` is the idea's identity until it gets a number — reference it in
  `Depends` and don't rename it after work starts.

**Branching**
- One feature = one branch.
- Naming: `<type>/<NNNN>-<slug>` where `type` is `feat` / `fix` / `chore`,
  `NNNN` is the build number, `slug` matches the change/idea slug.
  Example: `feat/0001-top-menu-audit`.
- Commits use the short project area / capability as scope, not the build number:
  `feat(navigation): …`, `docs(i18n): …`.
- Creating the branch is the "pull" moment — it's when the number is assigned.

**Pulling a task (start implementing)**
1. From the Idea pool, take the most valuable row with `Ready? = yes` and no open
   `Depends`.
2. `next = last # in Build log + 1` (e.g. `0043`).
3. Create the branch: `git checkout -b <type>/0043-<slug>`.
4. `openspec new change "<type>-0043-<slug>"` (name must start with a letter).
5. Append a row to the Build log: `#`, `slug`, `capability`, today's date,
   `in-progress`.
6. Remove the idea from the Idea pool.
7. Run the change through `propose → apply`.
8. Before archive, always check whether delta specs are synced into
   `openspec/specs/<capability>/spec.md`; if the CLI is unavailable, do the sync
   check manually.
9. Archive only after accepted specs are synced or an explicit decision is made
   to archive without syncing, then set the Build log row to `archived`.

**Temporary docs archive flow**
- This is a temporary migration rule while OpenSpec specs are being backfilled
  screen-by-screen.
- When a change audits or extends a screen, review only the `docs/` plans/reports
  that are directly relevant to that screen or capability.
- After their current behavior or decisions are represented in OpenSpec
  (`openspec/changes/.../specs/**` and later accepted specs), move those processed
  source docs to `docs/archive/`.
- Do not archive unrelated docs as part of the same change.
- Keep `docs/BUSINESS_LOGIC.md` and other intentionally authoritative docs active
  unless a later change explicitly replaces their role.
- This flow can be removed or relaxed after all screens, or at least most screens
  and legacy `docs/` plans/reports, have been reviewed and folded into OpenSpec.

**Living reference docs**
- Use `docs/reference/` for active technical references that complement accepted
  OpenSpec specs instead of replacing them: endpoint contracts, payload/response
  examples, hook/API/schema mappings, cache invalidation notes, and other
  implementation-facing lookup material.
- When processing an old `docs/` feature document, decide whether it is a
  historical plan/report or a living reference:
  - Move historical plans/reports to `docs/archive/` after the represented
    behavior is captured in accepted specs.
  - Move living references to `docs/reference/` with a stable, capability-scoped
    kebab-case name, for example
    `docs/reference/hikings-members-total-api.md`.
- Accepted specs may include a short `Reference:` line to a relevant
  `docs/reference/` file when the technical details are useful but too detailed
  for requirement scenarios. Keep OpenSpec as the product/behavior source of
  truth; keep reference docs as technical supplements.
- Do not move `docs/BUSINESS_LOGIC.md` into `docs/reference/`; it remains the
  authoritative domain model unless a separate change explicitly replaces that
  role.

**Priorities:** `P0` (urgent) · `P1` (next up) · `P2` (later) · `P3` (nice to have).

---

## Idea pool

Candidates, no numbers. Pick by meaning.

### Hiking detail remaining tab audits

High-priority block for the remaining `/hikings/:id` tab audit/backfill work.

| Slug                    | Feature                                   | Capability      | Prio | Ready? | Depends (slug) | Notes |
|-------------------------|-------------------------------------------|-----------------|------|--------|----------------|-------|
| hiking-shopping-list-tab-audit | Backfill Hiking shopping list tab spec | shopping-list   | P1   | yes    | hiking-detail-page-audit | Cover product totals loading/empty/populated states, table columns/totals, pack-kind display, and promote-to-trip-pack action boundary. |
| hiking-packs-by-days-tab-audit | Backfill Hiking Packs by Days tab spec | packing         | P1   | yes    | hiking-detail-page-audit | Cover per-day nested tabs, unassigned/day-pack columns, drag-and-drop assignment, auto-distribute, trip-pack display, and related pack docs. |
| hiking-packs-by-users-tab-audit | Backfill Hiking Packs by Users tab spec | packing        | P1   | yes    | hiking-detail-page-audit | Cover member-oriented pack layout, trip-pack row, drag-and-drop member slots, save mutations, unsaved state, per-column TXT export, and related pack docs. |

### Other candidates

| Slug                    | Feature                                   | Capability      | Prio | Ready? | Depends (slug) | Notes |
|-------------------------|-------------------------------------------|-----------------|------|--------|----------------|-------|
| edit-vegetarians-count  | Edit vegetarians count after create       | hikings         | P1   | yes    | —              | TODO in `docs/BUSINESS_LOGIC.md` ("Future: edit vegetarians count") |
| global-error-boundary   | Global React error boundary               | (infra)         | P2   | yes    | —              | Gap noted in `docs/PROJECT_ANALYSIS.md` |
| apifetch-retry          | Retry logic in `apiFetch` for network errs| (infra)         | P2   | yes    | —              | Gap noted in `docs/PROJECT_ANALYSIS.md` |
| dependency-audit-followup | Review npm audit vulnerabilities        | (infra)         | P2   | yes    | —              | Follow up on `esbuild` Windows dev-server advisory (fix available via `npm audit fix`) and transitive `js-yaml` via `@mdxeditor/editor` (no fix available at report time); avoid `npm audit fix --force` without review. |
| critical-hooks-tests    | Tests for critical hooks (`use-*`)        | (infra)         | P1   | yes    | —              | Vitest set up, coverage thin |
| react-testing-library-setup | Add React Testing Library for component behavior tests | (infra) | P2 | yes | — | Add `@testing-library/react`, `@testing-library/user-event`, and `@testing-library/jest-dom` only when we want DOM-level behavior tests; examples: render `TopMenu` in `MemoryRouter` and assert EN/RU labels, click the language switcher and assert menu labels update without reload, verify Admin visibility still follows auth role, verify active `NavLink` styling remains correct after locale changes. |
| loading-skeletons       | Loading skeletons across pages            | (infra)         | P3   | yes    | —              | Skeleton exists, not used everywhere |
| recipe-detail-page-audit | Backfill Recipe detail page spec         | recipes         | P2   | yes    | recipes-page-audit | Separate `/recipes/:id` feature; cover detail composition, metadata/category edit flows, ingredient actions, permissions, and archive directly represented detail-page docs such as `edit-recipe-metadata-*`. |
| categories-table-pagination | Redesign Categories lists as paginated tables | categories | P2 | no | categories-page-audit | Clarify backend readiness first: whether product/recipe category list endpoints support pagination metadata and page/limit parameters. |
| categories-lists-i18n   | Localize Categories list and column copy  | i18n            | P2   | yes    | categories-page-audit | Includes product/recipe column titles, endpoint descriptions, loading/error/empty states, and card item-count copy. |
| categories-actions-i18n | Localize Categories action labels         | i18n            | P2   | yes    | categories-page-audit | Includes create buttons and edit/delete action aria labels for product and recipe category cards. |
| categories-dialogs-i18n | Localize Categories dialogs and forms     | i18n            | P2   | yes    | categories-page-audit | Includes create/edit category dialog titles/descriptions/form labels/pending buttons and delete confirmation copy. |
| products-list-i18n      | Localize Products list/card surface       | i18n            | P2   | yes    | products-page-audit | Includes list heading, search/filter UI, pagination copy, card nutrition labels, empty/loading/error/page-empty states. |
| products-create-form-i18n | Localize Products create form           | i18n            | P2   | yes    | products-page-audit | Includes create column title/description, field labels/help text, category loading/error/empty states, checkbox labels, submit pending/success copy. |
| products-dialogs-i18n   | Localize Products edit/delete dialogs     | i18n            | P2   | yes    | products-page-audit | Includes edit product dialog, category edit dialog, delete confirmation, action aria labels, and pending button labels. |
| hiking-food-plan-tab-i18n | Localize Hiking food plan tab surface    | i18n            | P2   | yes    | hiking-food-plan-tab-audit | Includes add recipe form copy, recipes-by-days copy, nested day tabs, day comments, day eating labels/states, and related dialogs. |
| hiking-shopping-list-tab-i18n | Localize Hiking shopping list tab surface | i18n          | P2   | yes    | hiking-shopping-list-tab-audit | Includes empty/loading copy, table headings, totals copy, pack-kind labels, and promote-to-trip-pack dialog copy. |
| hiking-packs-by-days-tab-i18n | Localize Hiking Packs by Days tab surface | i18n          | P2   | yes    | hiking-packs-by-days-tab-audit | Includes day/pack labels, unassigned copy, auto-distribute copy, loading/error states, and day-pack card text. |
| hiking-packs-by-users-tab-i18n | Localize Hiking Packs by Users tab surface | i18n         | P2   | yes    | hiking-packs-by-users-tab-audit | Includes headers, row/cell labels, save/export buttons, unsaved/pending/error states, empty states, and trip-pack row copy. |
| hikings-list-i18n       | Localize Hikings list/card surface        | i18n            | P2   | yes    | hikings-page-audit | Includes list column title, loading/error/empty states, pagination metadata copy, card summary labels/plurals, and detail navigation text. |
| hikings-create-form-i18n | Localize Hikings create form             | i18n            | P2   | yes    | hikings-page-audit | Includes create column title/description, form labels/help text/placeholders, validation-facing copy where local, submit pending button, and success/reset-adjacent copy if present. |
| hiking-add-admin-by-identity | Add hiking admin by email (and/or name) instead of raw user id | hikings | P2 | no | hiking-overview-tab-audit | Replace `AddHikingAdminDialog` user-id field with a safer identity lookup. Prefer exact email match first; optional name search only with strict limits (min query length, result cap, no broad directory dump). Confirm backend user-lookup contract before coding. Do not invent free-text fuzzy search that leaks user lists. Invitations for unknown emails are out of scope here — see `hiking-admin-invitations`. |
| hiking-admin-invitations | Invite non-existing users as hiking admins by email | hikings | P3 | no | hiking-add-admin-by-identity | Later layer: if email is not an existing account, send/create an invitation instead of failing. Needs product rules (expiry, accept flow, permissions) and backend support — design carefully before Ready=yes. |

---

## Build log

Append-only. Number = order implementation started. Next number = **0011**.

| #    | Slug           | Capability | Started (YYYY-MM-DD) | Change / Status              |
|------|----------------|------------|----------------------|-----------------------------|
| 0001 | top-menu-audit | navigation | 2026-08-09           | archived (feat-0001-top-menu-audit) |
| 0002 | switch-language | i18n       | 2026-08-09           | archived (feat-0002-switch-language) |
| 0003 | products-page-audit | products | 2026-08-10           | archived (feat-0003-products-page-audit) |
| 0004 | recipes-page-audit | recipes | 2026-08-12           | archived (feat-0004-recipes-page-audit) |
| 0005 | categories-page-audit | categories | 2026-08-13           | archived (feat-0005-categories-page-audit) |
| 0006 | hikings-page-audit | hikings | 2026-08-13           | archived (feat-0006-hikings-page-audit) |
| 0007 | hiking-detail-page-audit | hikings | 2026-08-14           | archived (feat-0007-hiking-detail-page-audit) |
| 0008 | hiking-overview-tab-audit | hikings | 2026-08-14           | archived (feat-0008-hiking-overview-tab-audit) |
| 0009 | hiking-food-plan-tab-audit | food-planning | 2026-08-15           | archived (feat-0009-hiking-food-plan-tab-audit) |
| 0010 | hiking-overview-tab-i18n | i18n | 2026-08-15           | archived (feat-0010-hiking-overview-tab-i18n) |
