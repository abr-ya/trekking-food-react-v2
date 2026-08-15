## 1. Audit Current Food Plan

- [ ] 1.1 Compare the Food plan tab source against the delta spec for loading, empty, error, add-recipe, recipes-summary, day-comment, and meal-slot behavior.
- [ ] 1.2 Make only narrow documentation-backed runtime corrections if the audit finds behavior that contradicts the existing implementation notes.

## 2. Preserve Legacy Documentation

- [ ] 2.1 Move directly represented recipes-by-days docs from `docs/` to `docs/archive/`.
- [ ] 2.2 Move directly represented day-comments docs from `docs/` to `docs/archive/`.
- [ ] 2.3 Leave unrelated hiking, packing, shopping-list, or future-planning docs in place.

## 3. Capability Map

- [ ] 3.1 Update `openspec/CAPABILITIES.md` so `food-planning` is marked spec-backed after this change is ready for accepted-spec sync.

## 4. Validation

- [ ] 4.1 Run `openspec validate --changes --strict`.
- [ ] 4.2 Run `npm run tsc`.
- [ ] 4.3 Run `npm run lint`.
- [ ] 4.4 Run `npm run test`.
- [ ] 4.5 Stop before accepted-spec sync and ask the user for explicit approval.
