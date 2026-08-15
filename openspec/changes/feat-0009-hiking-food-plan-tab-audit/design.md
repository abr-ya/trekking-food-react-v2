## Context

The Hiking detail page already renders a Food plan tab from the hiking detail payload. The tab combines the hiking query, add-from-recipe controls, a recipes-by-days summary, day tabs, per-day comments, meal-slot cards, and slot-level add/edit/delete actions.

`food-planning` is implemented in the UI but has no accepted OpenSpec capability yet. This change backfills the current contract so later localization and UX slices can rely on a stable baseline.

## Goals / Non-Goals

**Goals:**

- Document the existing Food plan tab behavior for `/hikings/:id`.
- Capture how hiking detail, recipes, eating times, day comments, and hiking product mutations interact through existing API and hook patterns.
- Preserve directly represented legacy docs by moving them to `docs/archive/` during implementation after the delta spec covers their behavior.
- Keep any runtime edits limited to documentation-backed corrections found while auditing the existing screen.

**Non-Goals:**

- No Food plan localization.
- No layout redesign for the tab, day tabs, meal cards, recipe summary, or dialogs.
- No backend/API contract changes.
- No new dependencies.
- No changes to other Hiking detail tabs.

## Decisions

- Treat this as an audit/backfill change, not a feature redesign.
  - Rationale: the UI already implements the Food plan surface, and the main gap is missing accepted OpenSpec coverage.
  - Alternative considered: redesign the Food plan tab while documenting it. Rejected because follow-up UX work should be proposed separately.

- Scope the capability delta to `food-planning`.
  - Rationale: the tab's primary behavior is recipe/product distribution across hiking days and eating times, including day comments and food-line mutations.
  - Alternative considered: split day comments into a separate capability. Rejected for this backfill because comments are rendered and mutated inside the Food plan tab contract.

- Reuse existing `src/api/*`, `src/hooks/*`, Zod, and TanStack Query patterns.
  - Rationale: all server access already goes through the API layer and hooks, and mutations already invalidate hiking detail queries.
  - Alternative considered: direct component API calls or a new state layer. Rejected because it would violate project conventions and broaden scope.

- Keep API normalization behavior as-is.
  - Rationale: `getHiking` already normalizes hiking product rows from snake_case or camelCase API payloads into the client shape used by the Food plan components.
  - Alternative considered: normalize every nested field into camelCase types now. Rejected because this audit should avoid model churn unless a concrete bug appears.

- Treat docs migration as implementation cleanup.
  - Rationale: legacy docs about recipes-by-days and day comments can move to `docs/archive/` only after their represented behavior exists in the OpenSpec delta.
  - Alternative considered: leave all legacy docs in place. Rejected because it would keep duplicate sources of truth after accepted spec sync.

## Risks / Trade-offs

- Backfill may accidentally bless a UI bug as intended behavior -> Mitigate by checking the live components and legacy docs before writing requirements, and by limiting runtime changes to documented corrections.
- Existing day-comment docs include API details from an earlier implementation date -> Mitigate by treating them as migration candidates only where current source files still match.
- `food-planning` has no accepted spec yet -> Mitigate with ADDED requirements in the delta spec and accepted-spec sync only after explicit user approval.
- Full DOM behavior tests would require React Testing Library, which is not in scope -> Mitigate with existing TypeScript, lint, and Vitest checks, plus focused helper tests where applicable.

## Migration Plan

1. Complete the OpenSpec delta for the current Food plan behavior.
2. Audit the current source against the delta and make only narrow corrections if required.
3. Move directly represented legacy food-planning docs to `docs/archive/`.
4. Run `npm run tsc`, `npm run lint`, and `npm run test`.
5. Stop before accepted-spec sync and ask for explicit approval.

## Open Questions

- None for the current audit/backfill scope.
