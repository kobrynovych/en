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

## Content Expansion

To add B2, C1, or C2:

1. Add the level to `ACTIVE_LEVELS`.
2. Let the importer write the new level JSONL.
3. Add enrichment packs for the new level.
4. Re-run strict validation and build.

Manual enrichment should be added as new files in `content/enrichment/`, for example `core-b1-reviewed.jsonl`. Manual files override `auto-a1-b1.jsonl`.
