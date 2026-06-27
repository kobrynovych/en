# Requirements Document

## Introduction

Окрема сторінка `/irregular-verbs` у додатку English Path, яка показує повний список неправильних дієслів англійської мови в алфавітному порядку. Кожен рядок містить базову форму, Past Simple, Past Participle та переклад українською. Біля кожної форми розміщено кнопку SpeakButton для прослуховування вимови. Сторінка має мультиселект-фільтр за рівнями CEFR (A1, A2, B1), що дозволяє одночасно переглядати слова кількох рівнів. Дані про дієслова вбудовані статично в TypeScript-модулі та не потребують завантаження з JSONL-файлів.

## Glossary

- **Irregular_Verbs_Page**: сторінка, розташована за маршрутом `/irregular-verbs`, що відображає таблицю неправильних дієслів.
- **Irregular_Verb_Entry**: запис, що містить базову форму, Past Simple (одну або кілька форм), Past Participle (одну або кілька форм), переклад українською та рівень CEFR.
- **CEFR_Level_Filter**: UI-компонент мультиселекту, що дозволяє вибрати один або кілька рівнів (A1, A2, B1) для фільтрації таблиці.
- **SpeakButton**: наявний компонент `src/shared/ui/speak-button.tsx`, що вимовляє передане слово через Web Speech API.
- **Verb_Table**: таблична розмітка, яка відображає відфільтровані `Irregular_Verb_Entry` в алфавітному порядку за базовою формою.
- **Static_Data_Module**: TypeScript-файл `src/features/irregular-verbs/data.ts`, що містить масив усіх `Irregular_Verb_Entry`.

---

## Requirements

### Requirement 1: Статичні дані неправильних дієслів із рівнями CEFR

**User Story:** Як розробник, я хочу мати статичний масив усіх неправильних дієслів англійської мови з рівнями CEFR, щоб сторінка не залежала від зовнішніх джерел даних під час відображення.

#### Acceptance Criteria

1. THE `Static_Data_Module` SHALL contain an array of at least 150 `Irregular_Verb_Entry` records covering the irregular verbs enumerated in criteria 3, 4, and 5.
2. THE `Static_Data_Module` SHALL assign each `Irregular_Verb_Entry` exactly one CEFR level from the set `{ "A1", "A2", "B1" }`.
3. THE `Static_Data_Module` SHALL assign A1 level to the 30 highest-frequency irregular verbs: be, become, begin, break, bring, buy, come, do, drink, drive, eat, find, get, give, go, have, know, leave, make, read, run, say, see, speak, take, tell, think, understand, wear, write.
4. THE `Static_Data_Module` SHALL assign A2 level to the next tier of common irregular verbs including: bite, blow, build, burn, catch, choose, cut, draw, fall, feel, fight, fly, forget, grow, hang, hear, hide, hit, hold, keep, lay, learn, let, light, lose, meet, pay, put, send, shake, shine, shoot, show, shut, sing, sit, sleep, stand, steal, sweep, swim, teach, throw, wake, win.
5. THE `Static_Data_Module` SHALL assign B1 level to the following irregular verbs: arise, bear, bend, bet, bid, bind, bleed, bow, breed, burst, cast, cling, creep, deal, dig, flee, fling, forbid, forgive, freeze, grind, leap, lend, mean, mislead, overcome, rid, ring, rise, seek, sell, set, shed, shrink, slide, smell, sow, spell, spend, spill, split, spread, spring, sting, stink, stride, strike, swear, swell, swing, tear, tread, undergo, upset, weave, weep, wind, withdraw, wring.
6. IF a `Irregular_Verb_Entry` has multiple Past Simple or Past Participle variants (e.g. "burned / burnt"), THEN THE `Static_Data_Module` SHALL store them as an array of two or more strings; entries with a single variant SHALL store that variant as a single-element array.
7. THE `Static_Data_Module` SHALL store each `Irregular_Verb_Entry` with the TypeScript shape: `{ base: string; pastSimple: string[]; pastParticiple: string[]; translationUk: string; cefr: "A1" | "A2" | "B1" }` where `translationUk` is a non-empty string of no more than 60 characters.

---

### Requirement 2: Маршрут та серверний компонент сторінки

**User Story:** Як відвідувач, я хочу відкрити сторінку неправильних дієслів за адресою `/irregular-verbs`, щоб отримати до неї прямий доступ.

#### Acceptance Criteria

1. THE `Irregular_Verbs_Page` SHALL be accessible at the route `/irregular-verbs`.
2. THE `Irregular_Verbs_Page` SHALL be implemented as a Next.js App Router Server Component at path `src/app/irregular-verbs/page.tsx`.
3. THE `Irregular_Verbs_Page` SHALL export `export const metadata = { title: "Неправильні дієслова — English Path" }` as a static named export.
4. THE `Irregular_Verbs_Page` SHALL render the `PageShell` component, which provides the shared application header, navigation bar, and main content wrapper.
5. THE `Irregular_Verbs_Page` SHALL pass the complete, unfiltered static verb array from `Static_Data_Module` to the client component; the passed array SHALL have the same length as the total count of entries in `Static_Data_Module`; no server-side filtering or transformation SHALL be applied before passing.

---

### Requirement 3: Відображення таблиці дієслів

**User Story:** Як учень, я хочу бачити неправильні дієслова у вигляді таблиці з колонками Базова форма / Past Simple / Past Participle / Переклад, щоб легко порівнювати форми.

#### Acceptance Criteria

1. THE `Verb_Table` SHALL display `Irregular_Verb_Entry` records in alphabetical order by base form at all times, including after filter changes.
2. THE `Verb_Table` SHALL render four visible columns with headers: "Base form", "Past Simple", "Past Participle", "Переклад".
3. WHEN a `Irregular_Verb_Entry` has multiple Past Simple variants, THE `Verb_Table` SHALL display them separated by " / ".
4. WHEN a `Irregular_Verb_Entry` has multiple Past Participle variants, THE `Verb_Table` SHALL display them separated by " / ".
5. THE `Verb_Table` SHALL render a `Badge` component in the first (base form) column cell of each row displaying the row's CEFR level (A1, A2, or B1).
6. WHEN no `Irregular_Verb_Entry` records match the active CEFR_Level_Filter, THE `Verb_Table` SHALL display an `EmptyState` component with non-empty `title` and `text` props and SHALL NOT render any `<tr>` elements in `<tbody>`.
7. THE `Verb_Table` SHALL be implemented as an HTML `<table>` element with a `<thead>` containing `<th scope="col">` elements for each column header, and a `<tbody>` containing the data rows; the table container SHALL have a maximum width of 960 px.
8. WHILE the viewport width is below 640 px, THE `Verb_Table` container SHALL have `overflow-x: auto` applied so the table is horizontally scrollable without truncating cell content.

---

### Requirement 4: Кнопки SpeakButton у кожному рядку

**User Story:** Як учень, я хочу почути вимову кожної форми дієслова, щоб правильно запам'ятати звучання.

#### Acceptance Criteria

1. THE `Verb_Table` SHALL render a `SpeakButton` component within the same `<td>` as the base form text of each row.
2. THE `Verb_Table` SHALL render a `SpeakButton` component within the same `<td>` as each Past Simple variant of each row.
3. THE `Verb_Table` SHALL render a `SpeakButton` component within the same `<td>` as each Past Participle variant of each row.
4. WHEN a user activates a `SpeakButton`, the browser SHALL emit an audible English-language pronunciation of the associated word form.
5. WHEN a `SpeakButton` is actively speaking, it SHALL display a visual indicator (e.g. animated icon or colour change) that distinguishes it from its idle state.
6. WHEN `speechSynthesis` is unavailable in the browser, THE `SpeakButton` SHALL NOT be rendered; no placeholder or disabled button SHALL appear in its place.

---

### Requirement 5: Фільтр за рівнями CEFR з мультиселектом

**User Story:** Як учень, я хочу фільтрувати таблицю за рівнями A1, A2, B1 і вибирати кілька рівнів одночасно, щоб бачити слова, актуальні для мого поточного етапу навчання.

#### Acceptance Criteria

1. THE `CEFR_Level_Filter` SHALL display three toggle buttons, one for each level: A1, A2, B1, in that order.
2. WHEN a user activates a level toggle, THE `CEFR_Level_Filter` SHALL add that level to the set of active levels.
3. WHEN a user deactivates an already-active level toggle, THE `CEFR_Level_Filter` SHALL remove that level from the set of active levels.
4. WHEN multiple levels are active simultaneously, THE `Verb_Table` SHALL display all `Irregular_Verb_Entry` records whose `cefr` value is in the active set; rows whose level is not in the active set SHALL be absent from the DOM.
5. WHEN all level toggles are deactivated (active set is empty), THE `Verb_Table` SHALL display all `Irregular_Verb_Entry` records regardless of level.
6. THE `CEFR_Level_Filter` SHALL render active toggle buttons with the application's primary/emerald background colour and white text; inactive toggle buttons SHALL render with a muted background and default text colour.
7. THE `CEFR_Level_Filter` SHALL be implemented using `useState` within the irregular verbs client component; the initial state on page load SHALL have all three levels deactivated (empty set), causing all verb entries to be visible.
8. THE `CEFR_Level_Filter` SHALL display a count label showing the number of currently visible verb entries using Ukrainian plural inflection: "1 дієслово", "2–4 дієслова", "5+ дієслів".

---

### Requirement 6: Навігаційне посилання на сторінку

**User Story:** Як відвідувач, я хочу знаходити сторінку неправильних дієслів через навігаційне меню, щоб легко до неї переходити.

#### Acceptance Criteria

1. THE `PageShell` `navItems` array SHALL include an entry `{ href: "/irregular-verbs", label: "Неправильні дієслова", icon: BookMarked }` using the `BookMarked` icon from `lucide-react`.
2. THE `PageShell` mobile bottom navigation SHALL be updated to display 6 columns instead of 5, and SHALL include the `/irregular-verbs` link in the visible set.
3. THE desktop navigation SHALL render all items in `navItems` in a single horizontal flex row without wrapping or truncation; IF the items do not fit, THEN the desktop breakpoint or font size SHALL be adjusted so that all items remain visible without overflow.
