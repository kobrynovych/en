# English Path

Mobile-first self-study platform for learning English with a CEFR-aligned dictionary, Ukrainian translations, IPA, examples, flashcards, Leitner spaced repetition, mini-tests, and local progress tracking.

Live site after GitHub Pages deployment:

```text
https://kobrynovych.github.io/en/
```

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS, Radix primitives, lucide-react
- Dexie/IndexedDB for local progress
- Zustand for client state
- Zod for content validation
- Vitest and Playwright
- Persisted light/dark/system theme with dark fallback

## Content

The dictionary is stored outside UI components:

- `content/raw/cefrj-vocabulary-profile-1.5.csv`
- `content/words/a1.jsonl`
- `content/words/a2.jsonl`
- `content/words/b1.jsonl`
- `content/enrichment/*.jsonl`
- `content/overrides/spelling-variants.json`
- `content/cache/translations-en-uk.json`

Current strict coverage:

- A1: 1,164 words
- A2: 1,411 words
- B1: 2,446 words
- Total: 5,021 words

Every released word has a Ukrainian translation, IPA field, CEFR level, category, part of speech, spelling data, and five example sentence records. Manual enrichment files override generated enrichment. The generated file `content/enrichment/auto-a1-b1.jsonl` is machine-assisted and should be gradually improved by adding reviewed entries to separate manual enrichment files.

## Commands

```bash
npm install
npm run dev
npm run content:import
npm run content:enrich
npm run content:validate:release
npm run lint
npm run test
npm run build
npm run build:pages
npm run deploy:pages
```

`npm run build` creates a static export in `out/`.

`npm run deploy:pages` runs validation, lint, unit tests, a GitHub Pages build with `/en` as the base path, then pushes the current branch. GitHub Actions performs the actual Pages deployment after the push.

## GitHub Pages

Deployment is configured in `.github/workflows/pages.yml`.

Important repository setting:

1. Open `Settings -> Pages`.
2. Set `Build and deployment -> Source` to `GitHub Actions`.
3. Push to `master` or `main`.

The workflow validates content, lints, builds the static export, uploads `out/`, and deploys it to GitHub Pages. `next.config.ts` uses `/en` as `basePath` only inside GitHub Actions, so local development still runs at `/`.

Theme preference is stored in `localStorage` under `english-path-theme`. The default preference is `system`; if the browser cannot report a system color scheme, the app resolves to dark mode.

## Architecture

```text
src/
  app/                    Next.js routes
  domain/learning/         framework-independent entities and rules
  features/                vocabulary, progress, practice, stats UI
  infrastructure/          content loaders and IndexedDB adapters
  shared/                  reusable UI and utilities
content/
  raw/                     source datasets
  words/                   generated release JSONL
  enrichment/              manual and generated enrichment packs
  overrides/               spelling variants and future corrections
scripts/
  import-cefrj.mjs         source import and normalization
  enrich-content.mjs       IPA and Ukrainian enrichment
  validate-content.mjs     release validation
```

Progress is local-first: learned flags, Leitner boxes, review events, test sessions, and attempts are persisted in IndexedDB and survive browser reloads.

## Sources

- CEFR: https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale
- CEFR-J/Open Language Profiles: https://github.com/openlanguageprofiles/olp-en-cefrj
- English Vocabulary Profile: https://englishprofile.org/?menu=english-vocabulary-profile
- IPA dictionary package: https://github.com/Kotarski/ipa-dict
- GitHub Pages custom workflow guidance: https://docs.github.com/en/pages
