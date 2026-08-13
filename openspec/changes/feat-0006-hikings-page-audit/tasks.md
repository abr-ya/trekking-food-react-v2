## 1. OpenSpec Planning

- [ ] 1.1 Review the current `/hikings` implementation and keep the spec aligned with the actual list/create screen.
- [ ] 1.2 Add the `hikings` delta spec for page layout, list states, detail navigation, create form behavior, and scope boundaries.
- [ ] 1.3 Add the `i18n` delta spec for Hikings page title localization and the updated localization scope boundary.
- [ ] 1.4 Update backlog/capability planning with follow-up features for `/hikings/:id` detail/tab audits and broader Hikings screen localization.

## 2. Implementation

- [ ] 2.1 Localize the `/hikings` page title through the existing i18n resource pattern.
- [ ] 2.2 Add or update focused i18n tests covering the Hikings page title resource.
- [ ] 2.3 Keep list/card/form copy unchanged outside this slice.

## 3. Docs And Sync

- [ ] 3.1 Review directly related `docs/` files and identify which, if any, are fully represented by this `/hikings` list/create screen spec.
- [ ] 3.2 Move only fully represented `/hikings` list/create docs to `docs/archive/`; leave hiking detail/tab docs active for later audit features.
- [ ] 3.3 Sync the `hikings` and `i18n` delta specs into accepted specs before archive.
- [ ] 3.4 Update the Build log status during closeout.

## 4. Verification

- [ ] 4.1 Run `openspec validate --changes --strict`.
- [ ] 4.2 Run `openspec validate --specs --strict` after accepted-spec sync.
- [ ] 4.3 Run `npm run tsc && npm run lint && npm run test`.
