import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_URL =
  "https://raw.githubusercontent.com/openlanguageprofiles/olp-en-cefrj/master/cefrj-vocabulary-profile-1.5.csv";
const RAW_PATH = path.join(ROOT, "content", "raw", "cefrj-vocabulary-profile-1.5.csv");
const WORDS_DIR = path.join(ROOT, "content", "words");
const OVERRIDES_DIR = path.join(ROOT, "content", "overrides");
const ENRICHMENT_DIR = path.join(ROOT, "content", "enrichment");

const LEVELS = ["A1", "A2", "B1"];
const EXAMPLE_KINDS = ["affirmative", "negative", "question", "daily", "contextual"];

const CATEGORY_RULES = [
  ["food", /\b(food|drink|fruit|vegetable|bread|meat|fish|coffee|tea|water|milk|cake|apple|banana|egg|cheese|rice|meal|restaurant|kitchen|cook|eat|dinner|lunch|breakfast)\b/i],
  ["travel", /\b(travel|trip|airport|station|train|bus|ticket|hotel|passport|flight|journey|road|street|car|bike|city|country|map|visit|arrive|leave)\b/i],
  ["work", /\b(work|job|office|business|company|manager|meeting|customer|career|project|task|team|email|employee|employer)\b/i],
  ["family", /\b(family|mother|father|parent|brother|sister|child|daughter|son|aunt|uncle|cousin|husband|wife|baby|grand)\b/i],
  ["technology", /\b(computer|internet|online|phone|app|email|video|digital|software|website|screen|device|machine|camera|technology)\b/i],
  ["education", /\b(school|class|lesson|student|teacher|learn|study|exam|homework|university|college|book|dictionary|language|grammar|course)\b/i],
  ["health", /\b(health|doctor|hospital|medicine|pain|sick|ill|body|head|hand|heart|sleep|tired|disease|nurse)\b/i],
  ["home", /\b(home|house|room|bed|bath|bathroom|kitchen|garden|door|window|table|chair|floor|apartment)\b/i],
  ["people", /\b(person|people|friend|man|woman|boy|girl|adult|neighbor|member|group|name|everyone|anyone)\b/i],
  ["time", /\b(time|day|week|month|year|hour|minute|morning|evening|night|today|tomorrow|yesterday|monday|january|spring|summer|winter|autumn)\b/i],
  ["communication", /\b(say|tell|speak|talk|ask|answer|call|message|word|sentence|question|conversation|explain|describe|discuss)\b/i],
  ["feelings", /\b(happy|sad|angry|afraid|bored|excited|interesting|love|hate|hope|feel|feeling|worry|surprise)\b/i],
  ["shopping", /\b(shop|store|buy|sell|money|price|pay|cost|cheap|expensive|market|bill|card|customer)\b/i],
  ["places", /\b(place|city|town|village|country|area|park|bank|beach|building|museum|library|restaurant|office)\b/i],
];

const POS_MAP = new Map([
  ["noun", "noun"],
  ["verb", "verb"],
  ["adjective", "adjective"],
  ["adverb", "adverb"],
  ["preposition", "preposition"],
  ["pronoun", "pronoun"],
  ["determiner", "determiner"],
  ["conjunction", "conjunction"],
  ["modal", "modal"],
  ["auxiliary verb", "verb"],
  ["exclamation", "other"],
  ["number", "other"],
  ["phrase", "phrase"],
]);

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];
    const next = csv[i + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), record[index]?.trim() ?? ""])),
  );
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeHeadword(headword) {
  return headword.replace(/\s+/g, " ").trim();
}

function normalizePos(pos) {
  const cleaned = pos.toLowerCase().trim();
  return POS_MAP.get(cleaned) ?? (cleaned.includes("phrase") ? "phrase" : "other");
}

function categoryFor(headword, pos) {
  const categories = new Set();
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(headword)) categories.add(category);
  }

  if (categories.size === 0) {
    if (pos === "verb") categories.add("actions");
    else if (pos === "adjective" || pos === "adverb") categories.add("descriptions");
    else if (pos === "preposition" || pos === "determiner" || pos === "pronoun" || pos === "conjunction") {
      categories.add("grammar");
    } else {
      categories.add("general");
    }
  }

  return [...categories].sort();
}

function createBaseEntry(row, index) {
  const headword = normalizeHeadword(row.headword);
  const pos = normalizePos(row.pos);
  const baseSlug = slugify(headword) || `entry-${index + 1}`;
  const slug = `${baseSlug}-${pos}`;
  const id = `${row.CEFR.toLowerCase()}-${slug}`;

  return {
    id,
    slug,
    headword,
    americanSpelling: headword,
    britishSpelling: undefined,
    ipa: "",
    pos,
    cefr: row.CEFR,
    categories: categoryFor(headword, pos),
    translationsUk: [],
    examples: [],
    sourceRefs: ["cefr-j-1.5"],
  };
}

async function loadJsonIfExists(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function loadEnrichment() {
  await mkdir(ENRICHMENT_DIR, { recursive: true });
  const entries = new Map();
  const seedPath = path.join(ENRICHMENT_DIR, "core-a1.jsonl");

  try {
    const lines = (await readFile(seedPath, "utf8"))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    for (const line of lines) {
      const entry = JSON.parse(line);
      entries.set(entry.slug, entry);
    }
  } catch {
    await writeFile(seedPath, `${DEFAULT_ENRICHMENT_LINES.join("\n")}\n`, "utf8");
    return loadEnrichment();
  }

  return entries;
}

function mergeEntry(base, spellingVariants, enrichment) {
  const spelling = spellingVariants[base.headword] ?? {};
  const extra = enrichment.get(base.slug) ?? enrichment.get(slugify(base.headword));
  const sourceRefs = new Set(base.sourceRefs);

  if (extra?.sourceRefs) {
    for (const ref of extra.sourceRefs) sourceRefs.add(ref);
  }

  const examples = Array.isArray(extra?.examples)
    ? extra.examples.filter((example) => EXAMPLE_KINDS.includes(example.kind))
    : [];

  return {
    ...base,
    americanSpelling: spelling.americanSpelling ?? extra?.americanSpelling ?? base.americanSpelling,
    britishSpelling: spelling.britishSpelling ?? extra?.britishSpelling ?? base.britishSpelling,
    ipa: extra?.ipa ?? base.ipa,
    categories: Array.from(new Set([...(base.categories ?? []), ...(extra?.categories ?? [])])).sort(),
    translationsUk: extra?.translationsUk ?? base.translationsUk,
    examples,
    sourceRefs: [...sourceRefs],
  };
}

async function main() {
  await mkdir(path.dirname(RAW_PATH), { recursive: true });
  await mkdir(WORDS_DIR, { recursive: true });
  await mkdir(OVERRIDES_DIR, { recursive: true });

  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(`Failed to download CEFR-J dataset: ${response.status} ${response.statusText}`);
  }

  const csv = await response.text();
  await writeFile(RAW_PATH, csv, "utf8");

  const spellingVariantsPath = path.join(OVERRIDES_DIR, "spelling-variants.json");
  const spellingVariants = await loadJsonIfExists(spellingVariantsPath, {});
  if (Object.keys(spellingVariants).length === 0) {
    await writeFile(spellingVariantsPath, JSON.stringify(DEFAULT_SPELLING_VARIANTS, null, 2), "utf8");
  }

  const rows = parseCsv(csv).filter((row) => LEVELS.includes(row.CEFR));
  const enrichment = await loadEnrichment();
  const unique = new Map();

  const bases = rows.map((row, index) => createBaseEntry(row, index));
  const slugTotals = bases.reduce((counts, entry) => {
    counts.set(entry.slug, (counts.get(entry.slug) ?? 0) + 1);
    return counts;
  }, new Map());
  const slugSeen = new Map();

  bases.forEach((base) => {
    const count = slugTotals.get(base.slug) ?? 0;
    if (count > 1) {
      const seen = (slugSeen.get(base.slug) ?? 0) + 1;
      slugSeen.set(base.slug, seen);
      base.slug = `${base.slug}-${base.cefr.toLowerCase()}-${seen}`;
      base.id = `${base.cefr.toLowerCase()}-${base.slug}`;
    }

    if (!unique.has(base.id)) {
      unique.set(base.id, mergeEntry(base, spellingVariants, enrichment));
    }
  });

  const byLevel = new Map(LEVELS.map((level) => [level, []]));
  for (const entry of unique.values()) {
    byLevel.get(entry.cefr)?.push(entry);
  }

  const summary = {};
  for (const level of LEVELS) {
    const entries = byLevel.get(level).sort((a, b) => a.headword.localeCompare(b.headword) || a.pos.localeCompare(b.pos));
    summary[level] = entries.length;
    const jsonl = entries.map((entry) => JSON.stringify(entry)).join("\n");
    await writeFile(path.join(WORDS_DIR, `${level.toLowerCase()}.jsonl`), `${jsonl}\n`, "utf8");
  }

  await writeFile(
    path.join(ROOT, "content", "sources.md"),
    SOURCES_MD,
    "utf8",
  );

  console.log(`Imported ${unique.size} CEFR-J A1-B1 entries`);
  console.table(summary);
}

const DEFAULT_SPELLING_VARIANTS = {
  color: { britishSpelling: "colour" },
  favorite: { britishSpelling: "favourite" },
  gray: { britishSpelling: "grey" },
  center: { britishSpelling: "centre" },
  theater: { britishSpelling: "theatre" },
  traveler: { britishSpelling: "traveller" },
  organize: { britishSpelling: "organise" },
  realize: { britishSpelling: "realise" },
  behavior: { britishSpelling: "behaviour" },
};

const DEFAULT_ENRICHMENT_LINES = [
  JSON.stringify({
    slug: "ability-noun",
    ipa: "/əˈbɪləti/",
    translationsUk: ["здатність", "уміння"],
    categories: ["education", "work"],
    sourceRefs: ["manual-core-uk"],
    examples: [
      { kind: "affirmative", text: "She has the ability to learn fast.", translationUk: "Вона має здатність швидко вчитися.", contextExplanationUk: "Ability означає здатність або вміння щось робити.", maxCefr: "A2" },
      { kind: "negative", text: "He does not have the ability to drive yet.", translationUk: "Він ще не має вміння водити.", contextExplanationUk: "Тут ability описує практичну навичку.", maxCefr: "A2" },
      { kind: "question", text: "Do you have the ability to help me?", translationUk: "Ти маєш змогу допомогти мені?", contextExplanationUk: "У питанні слово вказує на можливість або вміння.", maxCefr: "A2" },
      { kind: "daily", text: "Reading every day improves your ability.", translationUk: "Щоденне читання покращує твої вміння.", contextExplanationUk: "Ability пов'язане з розвитком навички.", maxCefr: "A2" },
      { kind: "contextual", text: "The test checks your listening ability.", translationUk: "Тест перевіряє твою здатність слухати.", contextExplanationUk: "У навчальному контексті це мовна компетенція.", maxCefr: "A2" }
    ],
  }),
  JSON.stringify({
    slug: "about-preposition",
    ipa: "/əˈbaʊt/",
    translationsUk: ["про", "приблизно"],
    categories: ["grammar", "communication"],
    sourceRefs: ["manual-core-uk"],
    examples: [
      { kind: "affirmative", text: "This book is about food.", translationUk: "Ця книга про їжу.", contextExplanationUk: "About показує тему.", maxCefr: "A1" },
      { kind: "negative", text: "The lesson is not about work.", translationUk: "Урок не про роботу.", contextExplanationUk: "About вказує, чого тема не стосується.", maxCefr: "A1" },
      { kind: "question", text: "What is the story about?", translationUk: "Про що ця історія?", contextExplanationUk: "У питанні about питає про тему.", maxCefr: "A1" },
      { kind: "daily", text: "We talk about our family.", translationUk: "Ми говоримо про нашу сім'ю.", contextExplanationUk: "About вводить тему розмови.", maxCefr: "A1" },
      { kind: "contextual", text: "It is about five dollars.", translationUk: "Це приблизно п'ять доларів.", contextExplanationUk: "About може означати приблизну кількість.", maxCefr: "A1" }
    ],
  }),
  JSON.stringify({
    slug: "accept-verb",
    ipa: "/əkˈsept/",
    translationsUk: ["приймати", "погоджуватися"],
    categories: ["work", "communication"],
    sourceRefs: ["manual-core-uk"],
    examples: [
      { kind: "affirmative", text: "I accept your answer.", translationUk: "Я приймаю твою відповідь.", contextExplanationUk: "Accept означає погодитися з чимось або прийняти це.", maxCefr: "A2" },
      { kind: "negative", text: "She does not accept the offer.", translationUk: "Вона не приймає пропозицію.", contextExplanationUk: "Тут accept означає сказати 'так' пропозиції.", maxCefr: "A2" },
      { kind: "question", text: "Will you accept this job?", translationUk: "Ти приймеш цю роботу?", contextExplanationUk: "У питанні йдеться про згоду.", maxCefr: "A2" },
      { kind: "daily", text: "The shop accepts cards.", translationUk: "Магазин приймає картки.", contextExplanationUk: "Accept використано для способу оплати.", maxCefr: "A2" },
      { kind: "contextual", text: "Good friends accept different ideas.", translationUk: "Добрі друзі приймають різні ідеї.", contextExplanationUk: "У ширшому контексті це означає бути відкритим.", maxCefr: "A2" }
    ],
  }),
  JSON.stringify({
    slug: "apple-noun",
    ipa: "/ˈæpəl/",
    translationsUk: ["яблуко"],
    categories: ["food"],
    sourceRefs: ["manual-core-uk"],
    examples: [
      { kind: "affirmative", text: "I eat an apple.", translationUk: "Я їм яблуко.", contextExplanationUk: "Apple означає фрукт.", maxCefr: "A1" },
      { kind: "negative", text: "She does not want an apple.", translationUk: "Вона не хоче яблуко.", contextExplanationUk: "Слово називає предмет їжі.", maxCefr: "A1" },
      { kind: "question", text: "Do you have an apple?", translationUk: "У тебе є яблуко?", contextExplanationUk: "У питанні apple є річ, яку шукають.", maxCefr: "A1" },
      { kind: "daily", text: "An apple is in my bag.", translationUk: "Яблуко в моїй сумці.", contextExplanationUk: "Повсякденне використання для їжі.", maxCefr: "A1" },
      { kind: "contextual", text: "The apple is red and sweet.", translationUk: "Яблуко червоне й солодке.", contextExplanationUk: "Тут описуються властивості фрукта.", maxCefr: "A1" }
    ],
  }),
  JSON.stringify({
    slug: "book-noun",
    ipa: "/bʊk/",
    translationsUk: ["книга", "підручник"],
    categories: ["education"],
    sourceRefs: ["manual-core-uk"],
    examples: [
      { kind: "affirmative", text: "This book is new.", translationUk: "Ця книга нова.", contextExplanationUk: "Book означає друковану або електронну книгу.", maxCefr: "A1" },
      { kind: "negative", text: "I do not have the book.", translationUk: "У мене немає книги.", contextExplanationUk: "Тут book є предметом.", maxCefr: "A1" },
      { kind: "question", text: "Is your book on the table?", translationUk: "Твоя книга на столі?", contextExplanationUk: "У питанні шукають місце книги.", maxCefr: "A1" },
      { kind: "daily", text: "I read a book every night.", translationUk: "Я читаю книгу щовечора.", contextExplanationUk: "Повсякденна дія з книгою.", maxCefr: "A1" },
      { kind: "contextual", text: "The English book has easy words.", translationUk: "Англійський підручник має легкі слова.", contextExplanationUk: "У навчанні book може бути підручником.", maxCefr: "A1" }
    ],
  }),
  JSON.stringify({
    slug: "work-noun",
    ipa: "/wɝːk/",
    translationsUk: ["робота", "праця"],
    categories: ["work"],
    sourceRefs: ["manual-core-uk"],
    examples: [
      { kind: "affirmative", text: "My work starts at nine.", translationUk: "Моя робота починається о дев'ятій.", contextExplanationUk: "Work означає місце або процес роботи.", maxCefr: "A1" },
      { kind: "negative", text: "This is not my work.", translationUk: "Це не моя робота.", contextExplanationUk: "Слово вказує на завдання або результат.", maxCefr: "A1" },
      { kind: "question", text: "Do you like your work?", translationUk: "Тобі подобається твоя робота?", contextExplanationUk: "Питають про роботу людини.", maxCefr: "A1" },
      { kind: "daily", text: "I go to work by bus.", translationUk: "Я їду на роботу автобусом.", contextExplanationUk: "Повсякденне значення: місце роботи.", maxCefr: "A1" },
      { kind: "contextual", text: "Hard work helps you learn.", translationUk: "Наполеглива праця допомагає вчитися.", contextExplanationUk: "Тут work означає зусилля.", maxCefr: "A1" }
    ],
  }),
];

const SOURCES_MD = `# Content Sources

- Council of Europe CEFR global scale: https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale
- Open Language Profiles CEFR-J vocabulary profile: https://github.com/openlanguageprofiles/olp-en-cefrj
- English Vocabulary Profile reference: https://englishprofile.org/?menu=english-vocabulary-profile
- Cambridge A2 Key vocabulary list: https://www.cambridgeenglish.org/images/506886-a2-key-2020-vocabulary-list.pdf
- Cambridge B1 Preliminary vocabulary list: https://www.cambridgeenglish.org/Images/506887-b1-preliminary-vocabulary-list.pdf
- American Oxford 3000: https://www.oxfordlearnersdictionaries.com/external/pdf/wordlists/oxford-3000-5000/American_Oxford_3000.pdf

The generated dictionary imports CEFR-J A1-B1 entries as the base vocabulary. Enrichment files add Ukrainian translations, IPA, examples, spelling variants, and human-curated categories without changing UI code.
`;

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
