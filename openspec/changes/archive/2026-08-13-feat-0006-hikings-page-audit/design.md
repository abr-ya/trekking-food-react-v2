## Context

`/hikings` currently renders `HikingsPage` as a protected page with two columns:
`HikingsList` and `CreateHikingForm`. The list uses `useHikings()`, which wraps
the `src/api/hikings.ts` API layer and normalizes API data from snake_case to
camelCase. The create form uses React Hook Form, `createHikingSchema`, and
`useCreateHiking()`, then invalidates the hikings query and resets the form after
success.

This change is mostly an OpenSpec backfill plus one narrow runtime localization
step for the page title. It does not introduce new API calls, query keys, schema
changes, dependencies, or a new UI pattern.

## Goals / Non-Goals

**Goals:**

- Document the current `/hikings` list/create screen as a first accepted
  `hikings` capability contract.
- Keep the runtime code change limited to localizing the page title through the
  existing i18n resource pattern.
- Review `docs/` for directly related `/hikings` screen material and archive
  only docs whose behavior is represented in OpenSpec after accepted-spec sync.
- Leave explicit follow-ups for `/hikings/:id` detail/tab audits and broader
  Hikings screen localization.

**Non-Goals:**

- Do not audit or implement hiking detail tabs in this slice.
- Do not add recipe/product planning actions to `/hikings`; those belong to
  `/hikings/:id`.
- Do not redesign the list into a table or add pagination/search controls.
- Do not alter API normalization, cache keys, validation rules, or mutation
  invalidation behavior except to document the existing behavior.

## Decisions

- **Spec against the actual card-list screen.** The current UI renders cards and
  pagination metadata copy, not a table with interactive pagination controls.
  The spec should describe the live behavior so later redesign work can be
  planned as a separate change.
- **Keep page-title i18n as the only runtime change.** Prior screen backfills
  localized just the page title and left list/form/dialog text for follow-up
  features. Reusing that pattern keeps the slice small and reviewable.
- **Reuse existing data and mutation patterns.** `GET /hikings` and
  `POST /hikings` stay behind `src/api/hikings.ts` and `src/hooks/use-hikings.ts`;
  snake_case to camelCase normalization and cache invalidation remain unchanged.
- **Archive docs only after representation in OpenSpec.** `docs/BUSINESS_LOGIC.md`
  remains authoritative. Detail-tab docs stay active until their corresponding
  detail/tab audit changes.

## Risks / Trade-offs

- **Risk: The spec overstates pagination.** Mitigation: describe only metadata
  copy currently rendered by `HikingsList`, and leave table/pagination controls
  out of scope.
- **Risk: Detail-page behavior leaks into this slice.** Mitigation: document
  only navigation to `/hikings/:id` and create explicit follow-up backlog rows
  for detail/tab audits.
- **Risk: Useful docs are archived too early.** Mitigation: archive only docs
  directly covered by the `/hikings` list/create screen and leave food plan,
  packing, shopping list, members-total, admin, and day-comment docs active.
