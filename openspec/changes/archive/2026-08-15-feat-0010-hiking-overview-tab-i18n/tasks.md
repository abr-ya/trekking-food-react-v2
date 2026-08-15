## 1. Translation Resources

- [x] 1.1 Add English Overview tab translation keys under `pages.hikingDetail.overview`.
- [x] 1.2 Add Russian Overview tab translation keys with the same key structure.
- [x] 1.3 Cover state messages, summary labels, admins copy, dialog copy, form labels/placeholders, fallback errors, and toasts.

## 2. Runtime Wiring

- [x] 2.1 Update `HikingInfo` to render Overview state messages, labels, admins copy, and fallback errors through `useTranslation()`.
- [x] 2.2 Update `EditMembersTotalDialog` to render all user-facing copy and success toasts through i18n keys.
- [x] 2.3 Update `AddHikingAdminDialog` to render all user-facing copy through i18n keys.
- [x] 2.4 Preserve existing form behavior, mutation payloads, loading states, disabled states, and cache invalidation.

## 3. Tests

- [x] 3.1 Extend i18n resource tests to require the new Overview keys in English and Russian.
- [x] 3.2 Add targeted interpolation coverage where practical for the dynamic Overview strings.

## 4. Validation

- [x] 4.1 Run `npm run tsc`.
- [x] 4.2 Run `npm run lint`.
- [x] 4.3 Run `npm run test`.
- [x] 4.4 Stop before accepted-spec sync and ask the user for explicit approval.
