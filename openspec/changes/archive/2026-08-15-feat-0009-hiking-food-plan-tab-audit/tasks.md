## 1. Audit Current Food Plan

- [x] 1.1 Compare the Food plan tab source against the delta spec for loading, empty, error, add-recipe, recipes-summary, day-comment, and meal-slot behavior.
- [x] 1.2 Make only narrow documentation-backed runtime corrections if the audit finds behavior that contradicts the existing implementation notes.

## 2. Preserve Legacy Documentation

- [x] 2.1 Move directly represented recipes-by-days docs from `docs/` to `docs/archive/`.
- [x] 2.2 Move directly represented day-comments docs from `docs/` to `docs/archive/`.
- [x] 2.3 Leave unrelated hiking, packing, shopping-list, or future-planning docs in place.

## 3. Capability Map

- [x] 3.1 Update `openspec/CAPABILITIES.md` so `food-planning` is marked spec-backed after this change is ready for accepted-spec sync.

## 4. Validation

- [x] 4.1 Run `openspec validate --changes --strict`.
- [x] 4.2 Run `npm run tsc`.
- [x] 4.3 Run `npm run lint`.
- [x] 4.4 Run `npm run test`.
- [x] 4.5 Stop before accepted-spec sync and ask the user for explicit approval.
