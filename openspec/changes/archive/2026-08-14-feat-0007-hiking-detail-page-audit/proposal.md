## Why

The `/hikings/:id` page contains the real trip workspace, but its detail layout,
top-level tabs, permissions-sensitive actions, and docs/archive boundary are not
captured in accepted OpenSpec yet. This change backfills that contract now so
later tab-specific and localization stories can be planned cleanly instead of
being bundled into one large feature.

## What Changes

- Document the current Hiking detail page composition: authenticated wrapper,
  hiking-name title fallback, back navigation, and five top-level tabs.
- Localize only the Hiking detail page chrome: title fallback, back link, and
  top-level tab labels.
- Review related `docs/` files and move only documents whose behavior is fully
  represented by accepted specs into `docs/archive/`.
- Add follow-up backlog stories for separate tab/content audits and their
  localization work.

## Non-goals

- Do not redesign the Hiking detail page or change tab structure.
- Do not localize the full contents of the detail tabs in this change.
- Do not implement new hiking, food-planning, packing, shopping-list, admin, or
  day-comment behavior.
- Do not change backend/API contracts.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `hikings`: Adds the accepted `/hikings/:id` detail page contract and its
  top-level tab composition.
- `i18n`: Expands localization scope to the Hiking detail page title fallback,
  back link, and top-level tab labels.

## Impact

- Affected UI: `src/pages/hiking-detail-page.tsx`.
- Affected localization resources/tests: `src/i18n/resources.ts`,
  `src/i18n/index.test.ts`.
- Affected planning/docs: `openspec/BACKLOG.md`, `openspec/specs/hikings`,
  `openspec/specs/i18n`, and directly represented `docs/` files if any qualify
  for archive.
- API/dependencies: no backend changes and no dependency changes.
