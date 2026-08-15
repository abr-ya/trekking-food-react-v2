## Why

The Hiking detail page already exposes a Food plan tab, but its deeper behavior is only partially represented in accepted OpenSpec. This change backfills the current tab contract so later localization and UX work can build on a stable, screen-level source of truth.

## What Changes

- Capture the Food plan tab behavior for `/hikings/:id`, including the add-recipe form, recipes-by-days summary, per-day tabs, day comments, and meal-slot entries.
- Document loading, empty, and error states for the tab and its nested data dependencies.
- Identify directly represented legacy food-planning docs that can be moved to `docs/archive/` during implementation after their behavior is represented in OpenSpec.
- Keep this as an audit/backfill change; runtime UI changes should be limited to documentation-backed corrections found during implementation.

## Non-goals

- Do not localize the Food plan tab. The follow-up `hiking-food-plan-tab-i18n` covers user-facing copy.
- Do not redesign the Food plan layout, day tabs, meal cards, or add-recipe controls.
- Do not change backend/API contracts or add new dependencies.
- Do not touch Shopping List, Packs by Days, Packs by Users, or Overview tab internals.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `food-planning`: Backfill requirements for the existing Hiking Food plan tab surface and its current product/recipe/day-comment behavior.

## Impact

- Capability: `food-planning`.
- Affected source areas: `src/components/hiking-page/food-plan.tsx`, `day-tabs.tsx`, `recipes-by-days.tsx`, `day-comment.tsx`, `day-eatings.tsx`, `eating-card.tsx`, `src/components/forms/add-recipe-to-hiking-form.tsx`, `src/components/dialogs/day-comment-dialog.tsx`, `src/api/hikings.ts`, `src/hooks/use-hikings.ts`, `src/hooks/use-eating-times.ts`, and related type/schema files.
- Documentation migration candidates: `docs/recipes-by-days-plan.md`, `docs/recipes-by-days-implementation-report.md`, `docs/FEATURE_DAY_COMMENTS_API_EN.md`, and `docs/IMPLEMENTATION_DAY_COMMENTS_API_EN.md`.
- Backend/API changes: none expected; this frontend-only change documents existing endpoints and client behavior.
