## Context

The Overview tab for `/hikings/:id` is rendered by `HikingInfo`. It fetches the
hiking detail via `useHiking(id)`, handles invalid id/loading/error/not-found
states, and renders the summary fields plus two action entry points:
`EditMembersTotalDialog` and `AddHikingAdminDialog`.

The supporting behavior for group-size edits already lives in the API, hook,
Zod schema, and dialog layers. Hiking admin addition is also already routed
through the hook/API layer. This change captures those existing behaviors in
OpenSpec rather than changing runtime code.

## Goals / Non-Goals

**Goals:**

- Specify the Overview tab state handling and populated summary fields.
- Specify the group-size edit entry point and decrease-confirmation boundary.
- Specify hiking admins display and add-admin entry point.
- Review Overview-related docs and archive only those fully represented by
  accepted specs after sync.

**Non-Goals:**

- No runtime UI, API, hook, schema, query-key, or normalization changes.
- No localization; `hiking-overview-tab-i18n` remains the follow-up.
- No frontend owner/admin gating; backend authorization remains authoritative.
- No sync to accepted specs or archive without explicit user approval.

## Decisions

- Keep this as a `hikings` delta instead of a new capability.
  Alternative considered: a dedicated overview capability. Rejected because the
  Overview tab is part of Hiking detail and uses Hiking detail data/actions.
- Treat existing members-total docs as archive candidates only after the
  accepted spec includes the user-facing contract.
  Alternative considered: archive all members-total docs immediately. Rejected
  because `docs/BUSINESS_LOGIC.md` remains authoritative and deeper pack effects
  may still be useful for later tab audits.
- Specify add-admin behavior at the UI boundary and backend-auth boundary.
  Alternative considered: define full permission logic here. Rejected because
  permission rules already live in business logic and backend enforcement.

## Risks / Trade-offs

- Overview audit could drift into localization -> keep all UI text migration in
  `hiking-overview-tab-i18n`.
- Members-total behavior affects pack tabs -> capture the Overview entry point
  and confirmation, leaving pack-specific consequences for pack tab audits.
- Docs/archive may be partial -> archive only files fully represented by synced
  accepted specs; otherwise keep them active.
