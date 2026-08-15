## Context

The Overview tab for `/hikings/:id` is rendered by `HikingInfo` and uses
`useHiking(id)` for detail data. It displays invalid-id/loading/error/not-found
states, hiking summary fields, admins, `EditMembersTotalDialog`, and
`AddHikingAdminDialog`.

The page shell and top-level tabs already use i18n keys under
`pages.hikingDetail`. This change extends that namespace with an `overview`
subtree for tab-specific copy while preserving the existing API, hook, schema,
and query behavior.

## Goals / Non-Goals

**Goals:**

- Add English and Russian translation keys for the Overview tab text surface.
- Update `HikingInfo` to call `useTranslation()` for state messages, labels,
  admins empty copy, and error fallbacks.
- Update `EditMembersTotalDialog` to localize button labels, dialog copy,
  decrease warning copy, fallback error text, and success toasts.
- Update `AddHikingAdminDialog` to localize button labels, dialog copy, field
  metadata, pending label, and fallback error text.
- Extend i18n tests so missing Overview keys fail in both locales.

**Non-Goals:**

- No API, hook, Zod schema, query-key, cache invalidation, or normalization
  changes.
- No permission or backend authorization changes.
- No localization for other Hiking detail tabs.
- No accepted-spec sync or archive without explicit user approval.

## Decisions

- Keep Overview keys under `pages.hikingDetail.overview`.
  Alternative considered: a top-level `overview` namespace. Rejected because the
  copy is specific to the Hiking detail page and its Overview tab.
- Use interpolation for dynamic values such as error messages, vegetarian count,
  pending decrease total, and success-toast values.
  Alternative considered: string concatenation around translated fragments.
  Rejected because full sentences should remain translatable.
- Keep server-provided error messages as runtime details, with only fallback
  text localized.
  Alternative considered: map backend messages client-side. Rejected because
  this slice is UI-copy localization, not API error normalization.

## Risks / Trade-offs

- The members-total dialog contains longer warning text; translations must keep
  the destructive consequences clear without changing behavior.
- Toast messages include business effects that touch packing tabs; this change
  localizes the existing Overview entry-point copy only.
- The Add admin user-id placeholder is technical copy; translating the examples
  should not alter the expected UUID-like input.
