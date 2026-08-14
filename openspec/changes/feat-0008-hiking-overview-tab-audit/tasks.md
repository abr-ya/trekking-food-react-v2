## 1. Overview Audit

- [ ] 1.1 Confirm `HikingInfo`, `EditMembersTotalDialog`, and `AddHikingAdminDialog` match the planned Overview tab requirements.
- [ ] 1.2 Verify no runtime code changes are needed for this audit slice.

## 2. Docs Archive Review

- [ ] 2.1 Review Overview-related docs for members-total and hiking-admin behavior.
- [ ] 2.2 Move only docs fully represented by accepted specs into `docs/archive/`; leave authoritative or partial docs active.

## 3. Validation And Closeout

- [ ] 3.1 Run `npm run tsc && npm run lint && npm run test`.
- [ ] 3.2 Validate OpenSpec changes in strict mode.
- [ ] 3.3 Stop before accepted-spec sync and ask the user for explicit approval.
- [ ] 3.4 After approval, sync the `hikings` delta into `openspec/specs/hikings/spec.md`.
- [ ] 3.5 Stop before archive and ask the user for explicit approval.
- [ ] 3.6 After approval, archive the change and update the Build log status.
