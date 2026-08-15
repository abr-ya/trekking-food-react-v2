## Why

The Hiking detail page shell is now documented, but the Overview tab itself is
still only summarized as part of that shell. This change backfills the Overview
tab contract so group-size and hiking-admin behavior can be closed over in
OpenSpec before the tab's text is localized in a separate story.

## What Changes

- Document the current Overview tab states: invalid id, loading, error,
  not-found, and populated hiking info.
- Capture the displayed hiking fields: days total, members total, vegetarians
  total, optional timestamps, creator id, and admins.
- Capture the existing Overview actions: edit members total and add hiking
  admin, including their dialog boundaries and backend-authorized behavior.
- Review directly represented `docs/` files and archive those fully covered by
  accepted specs after sync.

## Non-goals

- Do not localize Overview tab text in this change; that remains
  `hiking-overview-tab-i18n`.
- Do not change group-size, hiking-admin, permission, or backend behavior.
- Do not add frontend owner/admin gating.
- Do not touch Food plan, Shopping List, Packs by Days, or Packs by Users tab
  internals.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `hikings`: Adds the accepted Hiking Overview tab contract inside
  `/hikings/:id`, including displayed fields, members-total editing entry point,
  and hiking-admin add/display behavior.

## Impact

- Affected OpenSpec: `openspec/specs/hikings/spec.md`.
- Runtime code: no intended behavior changes; this is a screen/tab audit.
- Docs/archive candidates: members-total plan/report/reference docs if fully
  represented after accepted-spec sync; `docs/BUSINESS_LOGIC.md` remains
  authoritative.
- API/dependencies: no backend changes and no dependency changes.
