## 1. Page Chrome Localization

- [ ] 1.1 Add Hiking detail page i18n keys for the generic title fallback, back link, and top-level tab labels.
- [ ] 1.2 Update `src/pages/hiking-detail-page.tsx` to render only those page-chrome strings through `useTranslation()`.
- [ ] 1.3 Extend i18n resource tests to cover the new Hiking detail page chrome keys.

## 2. Docs And Follow-Up Planning

- [ ] 2.1 Review directly related `docs/` files for Hiking detail behavior and identify which are fully represented by accepted specs after this change.
- [ ] 2.2 Move only fully represented docs into `docs/archive/`; leave partial tab-specific docs active for follow-up stories.
- [ ] 2.3 Confirm `openspec/BACKLOG.md` includes separate follow-up audit and i18n stories for Overview, Food plan, Shopping List, Packs by Days, and Packs by Users.

## 3. Spec Sync And Closeout

- [ ] 3.1 Sync the `hikings` delta spec into `openspec/specs/hikings/spec.md`.
- [ ] 3.2 Sync the `i18n` delta spec into `openspec/specs/i18n/spec.md`.
- [ ] 3.3 Update capability/backlog status as needed before archive.
- [ ] 3.4 Run `npm run tsc && npm run lint && npm run test`.
- [ ] 3.5 Validate OpenSpec specs and changes in strict mode.
- [ ] 3.6 Archive the change only after accepted specs are synced.
