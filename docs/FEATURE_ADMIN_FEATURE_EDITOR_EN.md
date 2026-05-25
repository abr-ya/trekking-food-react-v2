# Admin feature detail and editor

## Goals

- Add admin routes for viewing, creating, and editing application features.
- Reuse one form component for both create and edit flows.
- Keep the API contract based on Markdown strings (`fullText`) so the public read-only renderer can keep using `MarkdownContent`.
- Keep `/admin/features` as the list page with filters and pagination.

## Route shape

Use two explicit routes under the existing `/admin` layout:

| URL | Purpose |
|-----|---------|
| `/admin/features` | List and filter existing features |
| `/admin/features/:id` | View one feature in the admin area |
| `/admin/features/new` | Create a new feature |
| `/admin/features/:id/edit` | Edit an existing feature |

Separate create/edit URLs keep the flows clear:

- create mode has no feature id and uses empty defaults;
- edit mode requires loading a specific feature and handling loading/error/not-found states.

Both routes should reuse the same feature form.

## Navigation

Admin navigation into feature editing stays inside the Features section:

- add a `New feature` button to the `/admin/features` page header;
- link that button to `/admin/features/new`;
- make the feature name in each card link to `/admin/features/:id`;
- add an `Edit` action to each feature card in the list;
- link that action to `/admin/features/:id/edit`;
- do not add `New feature` as a separate sidebar item, because it is an action inside the Features section rather than a top-level admin area.

## Shared form

Create a reusable form component, for example:

```ts
type FeatureFormProps = {
  defaultValues: FeatureFormData;
  onSubmit: SubmitHandler<FeatureFormData>;
  isSaving?: boolean;
  submitLabel: string;
};
```

The form owns UI and validation only. Page components decide whether submission calls create or update mutations.

Fields:

- `name` — required text input.
- `description` — required short textarea.
- `fullText` — Markdown editor value.
- `status` — `DRAFT`, `TODO`, `IN_PROGRESS`, `IN_TEST`, `DONE`.
- `lang` — `EN` or `RU`.
- `isMain` — boolean switch/checkbox.

Add a schema in `src/schemas/feature.ts` and keep the form data shape aligned with `CreateFeaturePayload`.

## API and hooks

Current feature API already has:

- `GET /features`
- `POST /features`

Add:

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `getFeature(id)` | `GET /features/:id` | Load one feature for edit mode |
| `patchFeature(id, payload)` | `PATCH /features/:id` | Update an existing feature |

Add query keys and hooks:

- `featureQueryKeys.detail(id)`
- `useFeature(id)`
- `useUpdateFeature()`

After create or update, invalidate feature queries so the list refreshes.

## Markdown editor

Use a small wrapper around the chosen editor (MDXEditor) instead of coupling editor internals directly to `FeatureForm`.

Admin preview should use the existing `MarkdownContent` component so admin preview matches public rendering.

## Page behavior

### Create page

- Render empty/default form values:
  - `name: ""`
  - `description: ""`
  - `fullText: ""`
  - `status: "DRAFT"`
  - `lang: "EN"`
  - `isMain: false`
- Submit through `useCreateFeature()`.
- On success, navigate back to `/admin/features`.

### Detail page

- Read `id` from route params.
- Load the feature through `useFeature(id)`.
- Show loading/error/not-found states.
- Render feature metadata and `fullText` through `MarkdownContent`.
- Provide an `Edit` action linking to `/admin/features/:id/edit`.

### Edit page

- Read `id` from route params.
- Load the feature through `useFeature(id)`.
- Show loading/error/not-found states.
- Render the same `FeatureForm` with loaded values.
- Submit through `useUpdateFeature()`.
- On success, invalidate feature queries and keep or leave the edit page depending on the UX decision.

## Verification

- `npm run build`
- Admin can open `/admin/features/new` and see an empty form.
- Admin can open `/admin/features/:id` and see feature details.
- Admin can open `/admin/features/:id/edit` and see a populated form.
- Create submits `POST /features` with camelCase body.
- Edit submits `PATCH /features/:id` with camelCase body.
- Feature list refreshes after create/update.
- Existing `AdminLayout` still guards all new admin routes.

## Implementation report

After implementation, add `docs/IMPLEMENTATION_ADMIN_FEATURE_EDITOR_EN.md` with:

- summary of user-facing changes;
- key files created/changed;
- verification results;
- remaining follow-ups or backend contract notes.
