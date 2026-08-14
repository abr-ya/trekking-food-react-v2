## Context

`/hikings/:id` is currently rendered by `src/pages/hiking-detail-page.tsx`.
It uses `ProtectedPage`, fetches the hiking through `useHiking(id)` for the
page title, renders a back link to `/hikings`, and exposes five top-level tabs:
Overview, Food plan, Shopping List, Packs by Days, and Packs by Users.

The tab contents are already split into existing components under
`src/components/hiking-page/`. This change is a screen-level backfill: it
captures the current detail shell and plans deeper tab work, while keeping the
runtime implementation intentionally small.

## Goals / Non-Goals

**Goals:**

- Capture the `/hikings/:id` detail shell and top-level tab composition in
  OpenSpec.
- Localize only the Hiking detail page chrome: title fallback, back link, and
  top-level tab labels.
- Review directly related `docs/` files and archive only those fully represented
  by accepted specs after sync.
- Add follow-up backlog rows for individual tab/content audits and localization.

**Non-Goals:**

- No API, hook, Zod schema, query-key, or cache invalidation changes.
- No data normalization changes; existing `src/api/hikings.ts` and `useHiking`
  behavior remains the source of hydrated Hiking detail data.
- No tab redesign, route changes, or full tab-content localization.

## Decisions

- Keep the change on the existing `hikings` capability rather than introducing a
  new `hiking-detail` capability.
  Alternative considered: a new capability for the detail route. Rejected
  because `openspec/CAPABILITIES.md` already defines `hikings` as including
  list, create, detail, and group-size behavior.
- Add only page-chrome i18n keys for the detail page.
  Alternative considered: localize all detail-tab copy now. Rejected because the
  tab content spans food planning, packing, shopping list, admins, day comments,
  and group-size behavior; each needs its own audit boundary.
- Treat docs/archive as a closeout gate, not a proposal-time cleanup.
  Alternative considered: move every hiking-related document at once. Rejected
  because some docs describe deeper tab behavior that this screen-level shell
  spec will intentionally leave to follow-up stories.

## Risks / Trade-offs

- Broad detail page scope could absorb tab internals -> keep requirements at the
  top-level shell and add explicit follow-up backlog rows for deeper tab work.
- Existing page title uses the loaded hiking name -> localize only the fallback
  used before/without data, preserving real hiking names.
- Docs may partially overlap with this feature -> archive only docs whose
  behavior is represented by accepted specs after sync; leave partial docs active.
