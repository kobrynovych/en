# Architecture Notes

## Application Layers

- `domain/learning`: pure TypeScript rules for CEFR types, filters, progress, Leitner scheduling, stats, and test answer checking.
- `infrastructure/content`: server-side JSONL repository for generated dictionary files.
- `infrastructure/storage`: Dexie database adapter for browser-local progress data.
- `features`: client-facing feature modules that compose domain logic with React UI.
- `shared`: small UI primitives and cross-feature helpers.

## Data Flow

1. `scripts/import-cefrj.mjs` downloads CEFR-J, normalizes A1-B1 entries, applies spelling overrides and enrichment packs, then writes `content/words/*.jsonl`.
2. Server Components load JSONL with `getAllWords`, `getWordsByLevel`, and `getWordBySlug`.
3. Client Components hydrate IndexedDB progress through `useProgressStore`.
4. Screens compute derived stats locally from dictionary data plus progress records.

## Navigation

`features/navigation/nav-config.ts` is the single list of site pages. `SiteHeader` renders it as a horizontal menu with dropdowns from `lg`, and as a burger button with a Radix Dialog drawer below `lg`; `MobileTabBar` shows five shortcuts on small screens. Add new pages to the config, not to the components.

## Roadmap

`features/roadmap` holds the zero-to-B2 study plan. Content is static TypeScript in `content/`, progress rules are pure functions in `progress.ts`, and `progress-store.ts` is a `useSyncExternalStore` store backed by `localStorage` that syncs between tabs.

`local-store.ts` is the shared store behind both browser-owned datasets: memory is the source of truth for rendering, `localStorage` persists it, the `storage` event syncs other tabs, and a failed write keeps the data for the session and reports `false`. `progress-store.ts` (checklist) and `notes-store.ts` (per-task notes; rules and the Markdown export in `notes.ts`) are thin wrappers around it.

`filters.ts` holds search and filtering as pure functions: a search index built once from the content, `filterRoadmap` (notes are matched at query time because they change) and the URL parameter mapping. `roadmap-client.tsx` owns the filter state, restores it from the address after hydration, writes it back with a debounced `history.replaceState` and defers the query with `useDeferredValue` so typing stays responsive. Search results reuse `ModuleCard`; `TaskItem` is memoised, so checking a task or typing a note re-renders one task. A task with an open note editor or a pending undo is pinned for the filters it was opened with, so editing never makes it disappear, while a new search shows exactly what matches.

`ai-study.ts` turns a task into a study prompt and lists the AI assistants with their deep-link formats; `ai-study-menu.tsx` is the per-task disclosure (a popover from `sm`, a bottom sheet below). Opening an assistant copies the prompt synchronously with `copyTextSync` from `shared/lib/copy-text.ts`, because the new tab takes focus before the async Clipboard API resolves. `shared/lib/use-dismiss.ts` closes both this menu and the header dropdowns on outside click, Escape and focus loss.

## Content Expansion

To add B2, C1, or C2:

1. Add the level to `ACTIVE_LEVELS`.
2. Let the importer write the new level JSONL.
3. Add enrichment packs for the new level.
4. Re-run strict validation and build.

Manual enrichment should be added as new files in `content/enrichment/`, for example `core-b1-reviewed.jsonl`. Manual files override `auto-a1-b1.jsonl`.
