# Implementation Plan: Irregular Verbs Page

## Overview

Four tasks implement the irregular verbs feature in dependency order: static data first, then the navigation update and client component in parallel, and finally the page route that wires everything together. Each task maps directly to a file change and has granular sub-tasks.

## Tasks

- [x] 1. Create static data module
  - Create `src/features/irregular-verbs/data.ts`
  - Export `CefrLevel` type (`"A1" | "A2" | "B1"`)
  - Export `IrregularVerbEntry` interface with fields: `base: string`, `pastSimple: string[]`, `pastParticiple: string[]`, `translationUk: string`, `cefr: CefrLevel`
  - Export `IRREGULAR_VERBS` array with ≥150 entries covering the 30 A1 verbs (be, become, begin, break, bring, buy, come, do, drink, drive, eat, find, get, give, go, have, know, leave, make, read, run, say, see, speak, take, tell, think, understand, wear, write), ~45 A2 verbs (bite, blow, build, burn, catch, choose, cut, draw, fall, feel, fight, fly, forget, grow, hang, hear, hide, hit, hold, keep, lay, learn, let, light, lose, meet, pay, put, send, shake, shine, shoot, show, shut, sing, sit, sleep, stand, steal, sweep, swim, teach, throw, wake, win), and ~60 B1 verbs (arise, bear, bend, bet, bid, bind, bleed, bow, breed, burst, cast, cling, creep, deal, dig, flee, fling, forbid, forgive, freeze, grind, leap, lend, mean, mislead, overcome, rid, ring, rise, seek, sell, set, shed, shrink, slide, smell, sow, spell, spend, spill, split, spread, spring, sting, stink, stride, strike, swear, swell, swing, tear, tread, undergo, upset, weave, weep, wind, withdraw, wring)
  - Store multiple Past Simple / Past Participle variants as multi-element arrays; single variants as single-element arrays
  - Each entry has a non-empty `translationUk` string of ≤60 characters
  - Sort array alphabetically by `base` form at definition time

- [x] 2. Update PageShell navigation
  - Open `src/shared/ui/page-shell.tsx`
  - Add `BookMarked` to the `lucide-react` import
  - Add `{ href: "/irregular-verbs", label: "Неправильні дієслова", icon: BookMarked }` to the `navItems` array at index 4 (after the three level links)
  - Update mobile bottom nav container from `grid-cols-5` to `grid-cols-6`
  - Update mobile bottom nav slice from `navItems.slice(0, 5)` to `navItems.slice(0, 6)`
  - Verify desktop nav items don't overflow at the `lg` breakpoint; reduce link font size to `text-xs` if needed

- [x] 3. Create client component
  - Create `src/features/irregular-verbs/irregular-verbs-client.tsx` with `"use client"` directive
  - Define and use props interface `{ verbs: IrregularVerbEntry[] }`
  - Add `useState<Set<CefrLevel>>` for `activeLevels` initialised to `new Set()` (empty = show all)
  - Add `useMemo` for `filteredVerbs`: return all verbs when set is empty, otherwise filter by `activeLevels.has(v.cefr)`
  - Implement `ukrainianVerbCount(n)` helper: "1 дієслово" / "2–4 дієслова" / "5+ дієслів" using mod10/mod100 rules
  - Render filter bar with three toggle buttons (A1, A2, B1 in that order); active button: emerald background + white text; inactive: muted background; clicking toggles the level in/out of `activeLevels`
  - Render count label below filter bar: `ukrainianVerbCount(filteredVerbs.length)` prefixed with "Показано"
  - Render `<div className="overflow-x-auto …">` wrapper around `<table className="… min-w-[600px]">` inside a max-width 960 px container
  - Render `<thead>` with four `<th scope="col">` headers: "Base form", "Past Simple", "Past Participle", "Переклад"
  - Render `<tbody>` rows: base-form `<td>` contains `Badge` (emerald=A1, sky=A2, amber=B1) + word text + `SpeakButton`; Past Simple `<td>` maps each variant to an inline `<span>` with text + `SpeakButton` (variants separated by " / " visually); Past Participle `<td>` same pattern; last `<td>` shows `translationUk`
  - When `filteredVerbs.length === 0`, render `<EmptyState>` with non-empty `title` and `text` props instead of `<tbody>` rows

- [x] 4. Create page route
  - Create `src/app/irregular-verbs/page.tsx` as a Server Component (no `"use client"` directive)
  - Add `export const metadata = { title: "Неправильні дієслова — English Path" }`
  - Import `IRREGULAR_VERBS` from `@/features/irregular-verbs/data`
  - Import `IrregularVerbsClient` from `@/features/irregular-verbs/irregular-verbs-client`
  - Import `PageShell` from `@/shared/ui/page-shell`
  - Render `<PageShell><IrregularVerbsClient verbs={IRREGULAR_VERBS} /></PageShell>` in the default export function
  - Run `npm run build` and confirm no TypeScript errors and the static export succeeds

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": [
        { "id": 1, "label": "Create static data module" },
        { "id": 2, "label": "Update PageShell navigation" }
      ]
    },
    {
      "wave": 2,
      "tasks": [
        { "id": 3, "label": "Create client component", "dependsOn": [1] }
      ]
    },
    {
      "wave": 3,
      "tasks": [
        { "id": 4, "label": "Create page route", "dependsOn": [2, 3] }
      ]
    }
  ]
}
```

- Task 2 has no dependencies — can be done in parallel with Task 1
- Task 3 depends on Task 1 (needs `IrregularVerbEntry` types and `IRREGULAR_VERBS` array)
- Task 4 depends on Task 2 and Task 3

## Notes

- All required packages (`lucide-react`, `react`, `next`) are already present in `package.json` — no new dependencies needed.
- The project uses `output: "export"` in `next.config.ts`; no server-side runtime, so all data must be bundled at build time.
- `SpeakButton` already handles the `speechSynthesis` unavailability case by returning `null` — no extra guard needed in the table.
- Row keys in the table use `verb.base` since base forms are unique within the dataset.
