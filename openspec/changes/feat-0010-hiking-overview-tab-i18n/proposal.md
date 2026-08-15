## Why

The Hiking Overview tab is now documented as part of `/hikings/:id`, but its
own labels, state messages, action buttons, dialogs, validation-facing text, and
success/error copy still render as hard-coded English. Localizing this tab keeps
the Hiking detail page coherent after the shell and top-level tabs already
respond to the app language switcher.

## What Changes

- Render Overview tab state messages and summary labels through the i18n system.
- Localize the admins display copy, including the empty admins state.
- Localize the Edit members total entry point, dialog title/description, field
  label, pending/disabled buttons, decrease-confirmation dialog, warning bullet
  copy, fallback request error, and success toasts.
- Localize the Add admin entry point, dialog title/description, user-id field
  label/placeholder, pending button, and fallback request error.
- Extend i18n resource tests so English and Russian contain the required
  Overview tab keys.

## Non-goals

- Do not change Overview tab behavior, layout, permissions, validation rules,
  API payloads, cache invalidation, or toast timing.
- Do not localize Food plan, Shopping List, Packs by Days, or Packs by Users
  tab internals.
- Do not redesign the dialogs or replace existing form components.
- Do not add backend/API changes or dependencies.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `i18n`: Expands localization scope to the Hiking Overview tab surface and its
  related dialogs.

## Impact

- Affected OpenSpec: `openspec/specs/i18n/spec.md`.
- Affected runtime code: `src/components/hiking-page/hiking-info.tsx`,
  `src/components/dialogs/edit-members-total-dialog.tsx`,
  `src/components/dialogs/add-hiking-admin-dialog.tsx`,
  `src/i18n/resources.ts`, and related i18n tests.
- API/dependencies: no backend changes and no dependency changes.
