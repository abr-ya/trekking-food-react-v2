# Admin feature editor — implementation report

## Summary

Added create and edit flows for application features in the admin area. Both flows reuse the shared `FeatureForm`, send camelCase payloads to the feature API, and return to `/admin/features` after a successful save. Feature body editing now uses MDXEditor through a local wrapper component.

## User-facing behavior

- `/admin/features/new` opens an empty feature form.
- `/admin/features/:id/edit` loads the selected feature and opens the same form with populated values.
- Create submits `POST /features`.
- Edit submits `PATCH /features/:id`.
- Both create and edit invalidate feature queries through their mutations.
- Both create and edit navigate back to `/admin/features` after success.
- The edit page shows loading skeletons and separate load/update error messages.

## Key files changed

| File | Change |
|------|--------|
| `src/components/forms/feature-form.tsx` | Shared validated feature form wired to the Markdown editor |
| `src/components/common/markdown-editor.tsx` | MDXEditor wrapper for RHF-controlled Markdown editing |
| `src/pages/admin/feature-create-page.tsx` | Create page wired to `useCreateFeature()` |
| `src/pages/admin/feature-edit-page.tsx` | Edit page wired to `useFeature()` and `useUpdateFeature()` |
| `src/api/features.ts` | Feature detail and update API helpers |
| `src/hooks/use-features.ts` | Detail query and update mutation hooks |
| `src/schemas/feature.ts` | Feature form validation schema |
| `package.json` | Added `@mdxeditor/editor` |

## Verification

- Not run in this environment: `npm` and `node` are unavailable (`npm: command not found`).

## Follow-ups

- Implement `/admin/features/:id` detail rendering; it currently has route/navigation wiring but still needs to load and display feature data.
- Add manual browser verification once a Node/npm environment and backend are available.
