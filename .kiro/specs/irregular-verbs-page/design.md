# Design Document: Irregular Verbs Page

## Overview

A static reference page that displays a filterable, audio-enabled table of English irregular verbs grouped by CEFR level (A1/A2/B1). The page is a pure static export — all data is bundled at build time as a TypeScript module; no server reads occur at request time.

---

## Component Architecture

```
src/app/irregular-verbs/page.tsx          ← Server Component (metadata + data fetch)
│
└── <PageShell>                           ← existing shared layout shell
    └── <IrregularVerbsClient verbs={…} /> ← "use client" — all interactivity lives here
         ├── Filter bar (3 toggle buttons: A1 / A2 / B1)
         └── <table>
              └── <tbody>
                   └── <tr> per verb
                        ├── <td> base form  — Badge(CEFR) + word text + SpeakButton
                        ├── <td> past simple — form(s) text + SpeakButton per form
                        ├── <td> past participle — form(s) text + SpeakButton per form
                        └── <td> Переклад (Ukrainian)
```

Data source:

```
src/features/irregular-verbs/data.ts      ← static TS array, imported by page.tsx
```

---

## Data Flow

```
Build time
──────────
  data.ts (static array)
       │
       ▼
  page.tsx (Server Component)
    • imports IRREGULAR_VERBS array directly
    • exports metadata (static)
    • renders <PageShell><IrregularVerbsClient verbs={IRREGULAR_VERBS} /></PageShell>
       │
       ▼
  IrregularVerbsClient (Client Component, hydrated in browser)
    • useState: activelevels — Set<CefrLevel> (empty = show all)
    • derives filteredVerbs via useMemo
    • renders filter bar + verb table
```

No API calls. No runtime fs reads. The full verb array travels from build-time import → RSC props → client component props.

---

## TypeScript Interfaces

```typescript
// src/features/irregular-verbs/data.ts

export type CefrLevel = "A1" | "A2" | "B1";

export interface IrregularVerbEntry {
  /** Base (infinitive) form, e.g. "be" */
  base: string;
  /** One or more Past Simple forms, e.g. ["was", "were"] or ["went"] */
  pastSimple: string[];
  /** One or more Past Participle forms, e.g. ["been"] or ["gone"] */
  pastParticiple: string[];
  /** Ukrainian translation displayed in the last column */
  translationUk: string;
  /** CEFR level — determines badge colour and filter behaviour */
  cefr: CefrLevel;
}

export const IRREGULAR_VERBS: IrregularVerbEntry[] = [
  // ≥150 entries: ~30 A1, ~45 A2, ~60 B1
  // sorted alphabetically by base form at definition time
];
```

```typescript
// src/features/irregular-verbs/irregular-verbs-client.tsx

interface IrregularVerbsClientProps {
  verbs: IrregularVerbEntry[];   // full array passed from Server Component
}

// Internal state
const [activeLevels, setActiveLevels] = useState<Set<CefrLevel>>(new Set());
// empty Set → show all; non-empty Set → show only matching levels
```

---

## Key Design Decisions

### 1. Static TS module instead of JSONL

The project uses `output: "export"` in `next.config.ts`. There is no Node.js runtime at request time — only static HTML/JS is served from GitHub Pages. The existing `word-repository.ts` reads JSONL files using `fs` at build time inside async Server Components. Irregular verbs don't need that pipeline (no enrichment, no per-word detail pages), so a plain TypeScript array is the simplest correct approach: zero infrastructure, fully type-checked, tree-shakeable.

### 2. Server Component passes full array to client

Filtering is client-side only (3 CEFR buttons, no search). Passing the full array (~150 entries, small) avoids any serialization complexity. This mirrors the pattern used by `LevelPage` → `LevelVocabularyClient`.

### 3. Filter state: empty Set = show all

Toggling a level adds/removes it from a `Set<CefrLevel>`. When the set is empty every verb is visible — this is the natural initial state and avoids an "all selected" toggle that would need extra logic to stay in sync. A level button is visually "active" when `activeLevels.has(level)`, and "inactive" (but not filtered out) when the set is empty.

```typescript
const filteredVerbs = useMemo(
  () =>
    activeLevels.size === 0
      ? verbs
      : verbs.filter((v) => activeLevels.has(v.cefr)),
  [verbs, activeLevels],
);
```

### 4. SpeakButton placement

Each word form occupies the same `<td>` as its `SpeakButton`. For columns with multiple forms (e.g. `pastSimple: ["was", "were"]`) each form gets its own `SpeakButton` inline. Lang is always `"en-US"`.

```tsx
<td>
  {verb.pastSimple.map((form) => (
    <span key={form} className="inline-flex items-center gap-1">
      {form}
      <SpeakButton word={form} />
    </span>
  ))}
</td>
```

### 5. Badge colour by CEFR level

Matches the app's existing colour system (emerald for A1, sky for A2, amber for B1), using the same `className` override pattern as the existing `Badge` usage in `level-vocabulary-client.tsx`:

| Level | className override |
|-------|--------------------|
| A1    | `bg-emerald-50 text-emerald-800 border-emerald-200` |
| A2    | `bg-sky-50 text-sky-800 border-sky-200` |
| B1    | `bg-amber-50 text-amber-800 border-amber-200` |

### 6. Mobile scroll

A `<div className="overflow-x-auto">` wrapper around the `<table>` provides horizontal scroll on narrow viewports. The table itself has `min-w-[600px]` so columns don't collapse below a readable width.

### 7. Ukrainian plural (pluralisation helper)

```typescript
function ukrainianVerbCount(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} дієслово`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} дієслова`;
  return `${n} дієслів`;
}
```

Displayed below the filter buttons: e.g. "Показано 30 дієслів".

---

## File Structure

```
src/
├── app/
│   └── irregular-verbs/
│       └── page.tsx                         ← NEW — Server Component + metadata
├── features/
│   └── irregular-verbs/
│       ├── data.ts                          ← NEW — IrregularVerbEntry[] (≥150 items)
│       └── irregular-verbs-client.tsx       ← NEW — "use client" filter + table
└── shared/
    └── ui/
        └── page-shell.tsx                   ← MODIFY — add nav item + 6-col mobile grid
```

---

## PageShell Navigation Changes

Two targeted edits to `src/shared/ui/page-shell.tsx`:

**1. Add nav item to the `navItems` array** (9 items total after addition):

```typescript
import { BarChart3, BookMarked, BookOpen, Brain, ClipboardCheck, Layers3, Library, RotateCcw } from "lucide-react";

const navItems = [
  { href: "/", label: "Головна", icon: Layers3 },
  { href: "/levels/A1", label: "A1", icon: Library },
  { href: "/levels/A2", label: "A2", icon: Library },
  { href: "/levels/B1", label: "B1", icon: Library },
  { href: "/irregular-verbs", label: "Неправильні дієслова", icon: BookMarked }, // NEW
  { href: "/practice/review", label: "Повторення", icon: RotateCcw },
  { href: "/practice/flashcards", label: "Картки", icon: Brain },
  { href: "/practice/tests", label: "Тести", icon: ClipboardCheck },
  { href: "/stats", label: "Статистика", icon: BarChart3 },
];
```

**2. Mobile nav: expand to 6-column grid and increase slice**:

```tsx
// Before: grid-cols-5, navItems.slice(0, 5)
// After:  grid-cols-6, navItems.slice(0, 6)
<div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
  {navItems.slice(0, 6).map(…)}
</div>
```

The new "Неправильні дієслова" item is placed at index 4 so it appears in the mobile bar. Its label is long for mobile — the `<span>` inside the mobile nav link uses `text-[10px]` (one step down from the existing `text-[11px]`) or a shortened label "Дієслова" can be used for the mobile slot if it overflows.

Desktop nav already wraps via `flex` and `gap-1`, so the ninth item fits naturally. If horizontal space is tight at `lg` breakpoint, the desktop link font size can drop from `text-sm` to `text-xs` — this is a minor responsive tweak and can be evaluated during implementation.

---

## Verb Table Structure

```tsx
<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
  <table className="w-full min-w-[600px] text-sm">
    <thead>
      <tr className="border-b border-slate-200 bg-slate-50 text-left">
        <th>Base form</th>
        <th>Past Simple</th>
        <th>Past Participle</th>
        <th>Переклад</th>
      </tr>
    </thead>
    <tbody>
      {filteredVerbs.map((verb) => (
        <tr key={verb.base} className="border-b border-slate-100">
          <td>
            <Badge className={cefrBadgeClass[verb.cefr]}>{verb.cefr}</Badge>
            <span>{verb.base}</span>
            <SpeakButton word={verb.base} />
          </td>
          <td>
            {verb.pastSimple.map((form) => (
              <span key={form}>
                {form} <SpeakButton word={form} />
              </span>
            ))}
          </td>
          <td>
            {verb.pastParticiple.map((form) => (
              <span key={form}>
                {form} <SpeakButton word={form} />
              </span>
            ))}
          </td>
          <td>{verb.translationUk}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

Row key is `verb.base` — base forms are unique within the dataset.

---

## Error / Edge Cases

| Scenario | Handling |
|----------|----------|
| `speechSynthesis` unavailable (SSR, unsupported browser) | `SpeakButton` returns `null` — graceful no-op |
| All levels filtered → 0 rows | Render `<EmptyState>` with `icon=<BookMarked>`, title="Нічого не знайдено", text="Скасуй фільтр, щоб побачити всі дієслова." |
| Multiple forms in pastSimple / pastParticiple | Rendered as separate inline `<span>` elements, each with its own `SpeakButton` |

---

## Dependencies

All required packages are already present in the project:

- `next` — static export, Server Components, metadata
- `react` — `useState`, `useMemo`
- `lucide-react` — `BookMarked` icon (already in bundle)
- `@/shared/ui/badge` — colour-variant badge
- `@/shared/ui/speak-button` — audio playback
- `@/shared/ui/empty-state` — zero-results state
- `@/shared/ui/page-shell` — layout wrapper
- `@/shared/lib/cn` — class merging utility
