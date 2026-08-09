# Backlog

Two separate registers:

- **Idea pool** — candidate features, **no numbers**. Identified by a stable
  `slug`. Pick the next one *by meaning* (priority / value / dependencies).
- **Build log** — append-only, **numbered**. A feature gets its number the moment
  you *start* implementing it. The number is the build order (not the order ideas
  were added) and is the through-line: `#0042` → change dir `0042-<slug>` →
  archive `YYYY-MM-DD-0042-<slug>` → commits `feat(#0042): …`.

Capabilities referenced below are defined in [`CAPABILITIES.md`](./CAPABILITIES.md).

---

## Workflow

**Numbering**
- Format: 4 digits, zero-padded (`0042`).
- Source of truth for the next number = **last row of the Build log + 1**
  (don't parse folder names — archived changes are date-prefixed).
- First real OpenSpec change is `0001`.

**Adding an idea**
- Append a row to the Idea pool with a unique, stable `slug` (kebab-case).
- `slug` is the idea's identity until it gets a number — reference it in
  `Depends` and don't rename it after work starts.

**Pulling a task (start implementing)**
1. From the Idea pool, take the most valuable row with `Ready? = yes` and no open
   `Depends`.
2. `next = last # in Build log + 1` (e.g. `0043`).
3. `openspec new change "0043-<slug>"`.
4. Append a row to the Build log: `#`, `slug`, `capability`, today's date,
   `in-progress`.
5. Remove the idea from the Idea pool.
6. Run the change through `propose → apply → archive`, then set the Build log row
   to `archived`.

**Priorities:** `P0` (urgent) · `P1` (next up) · `P2` (later) · `P3` (nice to have).

---

## Idea pool

Candidates, no numbers. Pick by meaning.

| Slug                    | Feature                                   | Capability      | Prio | Ready? | Depends (slug) | Notes |
|-------------------------|-------------------------------------------|-----------------|------|--------|----------------|-------|
| top-menu-audit          | Audit & fix top navigation menu           | navigation      | P1   | yes    | —              | Inventory every item, target route, and access gate; fix mismatches. Known suspects: `MAIN_NAV` path `/products` vs route `/products/` (trailing slash); no active-link highlight (`Link` not `NavLink`); verify `requiresAppAdmin`/`isAppAdmin` gating vs actual admin routes. Code: `src/config/nav/main-nav.ts`, `src/components/layout/top-menu.tsx`, `src/App.tsx` |
| switch-language         | UI language switcher (i18n)               | i18n            | P1   | no     | top-menu-audit | Choose approach in proposal (react-i18next vs react-intl vs lightweight custom); add locale state + switcher control; extract strings. First surface to localize = top menu. Blocked until nav is clean. |
| edit-vegetarians-count  | Edit vegetarians count after create       | hikings         | P1   | yes    | —              | TODO in `docs/BUSINESS_LOGIC.md` ("Future: edit vegetarians count") |
| global-error-boundary   | Global React error boundary               | (infra)         | P2   | yes    | —              | Gap noted in `docs/PROJECT_ANALYSIS.md` |
| apifetch-retry          | Retry logic in `apiFetch` for network errs| (infra)         | P2   | yes    | —              | Gap noted in `docs/PROJECT_ANALYSIS.md` |
| critical-hooks-tests    | Tests for critical hooks (`use-*`)        | (infra)         | P1   | yes    | —              | Vitest set up, coverage thin |
| loading-skeletons       | Loading skeletons across pages            | (infra)         | P3   | yes    | —              | Skeleton exists, not used everywhere |

---

## Build log

Append-only. Number = order implementation started. Next number = **0001**.

| #    | Slug | Capability | Started (YYYY-MM-DD) | Change / Status |
|------|------|------------|----------------------|-----------------|
| —    | —    | —          | —                    | *(empty — first pulled feature becomes `0001`)* |
