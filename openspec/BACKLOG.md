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

**Priorities:** `P0` (urgent) · `P1` (next up) · `P2` (later) · `P3` (nice to have).

---

## Idea pool

Candidates, no numbers. Pick by meaning.

| Slug                    | Feature                                   | Capability      | Prio | Ready? | Depends (slug) | Notes |
|-------------------------|-------------------------------------------|-----------------|------|--------|----------------|-------|
| edit-vegetarians-count  | Edit vegetarians count after create       | hikings         | P1   | yes    | —              | TODO in `docs/BUSINESS_LOGIC.md` ("Future: edit vegetarians count") |
| global-error-boundary   | Global React error boundary               | (infra)         | P2   | yes    | —              | Gap noted in `docs/PROJECT_ANALYSIS.md` |
| apifetch-retry          | Retry logic in `apiFetch` for network errs| (infra)         | P2   | yes    | —              | Gap noted in `docs/PROJECT_ANALYSIS.md` |
| dependency-audit-followup | Review npm audit vulnerabilities        | (infra)         | P2   | yes    | —              | Follow up on `esbuild` Windows dev-server advisory (fix available via `npm audit fix`) and transitive `js-yaml` via `@mdxeditor/editor` (no fix available at report time); avoid `npm audit fix --force` without review. |
| critical-hooks-tests    | Tests for critical hooks (`use-*`)        | (infra)         | P1   | yes    | —              | Vitest set up, coverage thin |
| react-testing-library-setup | Add React Testing Library for component behavior tests | (infra) | P2 | yes | — | Add `@testing-library/react`, `@testing-library/user-event`, and `@testing-library/jest-dom` only when we want DOM-level behavior tests; examples: render `TopMenu` in `MemoryRouter` and assert EN/RU labels, click the language switcher and assert menu labels update without reload, verify Admin visibility still follows auth role, verify active `NavLink` styling remains correct after locale changes. |
| loading-skeletons       | Loading skeletons across pages            | (infra)         | P3   | yes    | —              | Skeleton exists, not used everywhere |
| recipes-page-audit      | Backfill Recipes page spec and title i18n | recipes         | P1   | yes    | —              | Cover `/recipes` page composition, list pagination, create form, recipe action permission model, link to detail page as navigation only, processed docs archive, and plan later screen-localization slices. |
| recipe-detail-page-audit | Backfill Recipe detail page spec         | recipes         | P2   | yes    | recipes-page-audit | Separate `/recipes/:id` feature; cover detail composition, metadata/category edit flows, ingredient actions, permissions, and archive directly represented detail-page docs such as `edit-recipe-metadata-*`. |
| products-list-i18n      | Localize Products list/card surface       | i18n            | P2   | yes    | products-page-audit | Includes list heading, search/filter UI, pagination copy, card nutrition labels, empty/loading/error/page-empty states. |
| products-create-form-i18n | Localize Products create form           | i18n            | P2   | yes    | products-page-audit | Includes create column title/description, field labels/help text, category loading/error/empty states, checkbox labels, submit pending/success copy. |
| products-dialogs-i18n   | Localize Products edit/delete dialogs     | i18n            | P2   | yes    | products-page-audit | Includes edit product dialog, category edit dialog, delete confirmation, action aria labels, and pending button labels. |

---

## Build log

Append-only. Number = order implementation started. Next number = **0004**.

| #    | Slug           | Capability | Started (YYYY-MM-DD) | Change / Status              |
|------|----------------|------------|----------------------|-----------------------------|
| 0001 | top-menu-audit | navigation | 2026-08-09           | archived (feat-0001-top-menu-audit) |
| 0002 | switch-language | i18n       | 2026-08-09           | archived (feat-0002-switch-language) |
| 0003 | products-page-audit | products | 2026-08-10           | archived (feat-0003-products-page-audit) |
