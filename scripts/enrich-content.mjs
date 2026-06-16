import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const WORDS_DIR = path.join(ROOT, "content", "words");
const ENRICHMENT_PATH = path.join(ROOT, "content", "enrichment", "auto-a1-b1.jsonl");
const CACHE_DIR = path.join(ROOT, "content", "cache");
const TRANSLATION_CACHE_PATH = path.join(CACHE_DIR, "translations-en-uk.json");
const IPA_DICT_PATH = path.join(ROOT, "node_modules", "ipa-dict", "lib", "en_US.js");
const LEVELS = ["a1", "a2", "b1"];
const TRANSLATE_CHUNK_SIZE = 35;

const POS_UK = {
  noun: "іменник",
  verb: "дієслово",
  adjective: "прикметник",
  adverb: "прислівник",
  preposition: "прийменник",
  pronoun: "займенник",
  determiner: "означник",
  conjunction: "сполучник",
  modal: "модальне дієслово",
  phrase: "фраза",
  other: "слово",
};

const TRANSLATION_OVERRIDES = {
  "m-other": ["скорочення від am", "є"],
  "re-other": ["скорочення від are", "є"],
  "s-other": ["скорочення або присвійна форма"],
  "ve-other": ["скорочення від have"],
  "d-other": ["скорочення від would або had"],
  "ll-other": ["скорочення від will"],
  "mr-mr-noun": ["пан"],
  "mrs-mrs-noun": ["пані"],
  "ms-ms-noun": ["пані"],
  "a-m-a-m-am-am-adverb": ["до полудня", "ранку"],
  "p-m-p-m-pm-pm-adverb": ["після полудня", "вечора"],
  "email-e-mail-e-mail-noun": ["електронна пошта", "email"],
  "practice-practise-verb": ["практикуватися", "тренуватися"],
  "license-licence-verb": ["ліцензувати", "давати дозвіл"],
  "short-shorts-noun": ["шорти"],
};

const IPA_OVERRIDES = {
  "re-other": "/ər/",
  "ve-other": "/v/",
  "d-other": "/d/",
  "ll-other": "/əl/",
  "drivers-license-driving-licence-noun": "/ˈdraɪvərz ˈlaɪsəns/",
  "hip-hop-hip-hop-hiphop-noun": "/ˈhɪp hɑːp/",
  "sports-center-sports-centre-noun": "/ˈspɔːrts ˌsentər/",
  "check-in-counter-check-in-noun": "/ˈtʃek ɪn ˈkaʊntər/",
  "check-in-desk-check-in-noun": "/ˈtʃek ɪn desk/",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeTextWithRetry(filePath, text, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await writeFile(filePath, text, "utf8");
      return;
    } catch (error) {
      lastError = error;
      await sleep(150 * attempt);
    }
  }
  throw lastError;
}

async function writeJsonWithRetry(filePath, value) {
  await writeTextWithRetry(filePath, JSON.stringify(value, null, 2));
}

async function readWords() {
  const words = [];
  for (const level of LEVELS) {
    const filePath = path.join(WORDS_DIR, `${level}.jsonl`);
    const lines = (await readFile(filePath, "utf8")).split(/\r?\n/).filter(Boolean);
    for (const line of lines) words.push(JSON.parse(line));
  }
  return words;
}

function cleanLookupWord(headword) {
  return headword
    .split("/")
    .at(0)
    ?.replace(/[()]/g, "")
    .replace(/^to\s+/i, "")
    .trim()
    .toLowerCase();
}

function getIpa(word, ipaDict) {
  if (IPA_OVERRIDES[word.slug]) return IPA_OVERRIDES[word.slug];
  if (word.ipa) return word.ipa;
  const candidates = [
    word.americanSpelling,
    word.headword,
    cleanLookupWord(word.headword),
    cleanLookupWord(word.americanSpelling),
  ]
    .filter(Boolean)
    .map((value) => value.toLowerCase());

  for (const candidate of candidates) {
    const ipa = ipaDict.get(candidate);
    if (Array.isArray(ipa) && ipa.length > 0) return ipa[0];
    if (typeof ipa === "string" && ipa.length > 0) return ipa;
  }

  return "—";
}

function translationQuery(word) {
  const clean = cleanLookupWord(word.headword) || word.headword;
  if (["noun", "verb", "adjective", "adverb"].includes(word.pos)) {
    return `${clean} as a ${word.pos}`;
  }
  return clean;
}

function cleanTranslation(value, word) {
  const posUk = POS_UK[word.pos] ?? "слово";
  const posWords = Object.values(POS_UK).join("|");
  let cleaned = value
    .replace(/\s+/g, " ")
    .replace(/\([^)]*\)/g, "")
    .replace(new RegExp(`\\s*як\\s+(${posWords})$`, "i"), "")
    .replace(new RegExp(`\\s+${posUk}$`, "i"), "")
    .replace(new RegExp(`^${posUk}\\s+`, "i"), "")
    .replace(/^англійськ\w*\s+\w+:\s*/i, "")
    .replace(/\s+as\s+a\s+\w+$/i, "")
    .trim();

  if (!cleaned || cleaned.toLowerCase() === word.headword.toLowerCase()) {
    cleaned = word.headword;
  }

  return cleaned;
}

function parseGoogleTranslate(data, expectedCount) {
  const chunks = Array.isArray(data?.[0]) ? data[0] : [];
  const translations = chunks.map((chunk) => String(chunk?.[0] ?? "").trim());

  if (translations.length === expectedCount) return translations;

  const joined = translations.join("").trim();
  const split = joined.split(/\n+/).map((item) => item.trim()).filter(Boolean);
  if (split.length === expectedCount) return split;

  return null;
}

async function translateBatch(words, cache) {
  const missing = words.filter((word) => !cache[word.slug]);

  for (let index = 0; index < missing.length; index += TRANSLATE_CHUNK_SIZE) {
    const chunk = missing.slice(index, index + TRANSLATE_CHUNK_SIZE);
    const q = chunk.map(translationQuery).join("\n");
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uk&dt=t&q=${encodeURIComponent(q)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const data = await response.json();
      const translations = parseGoogleTranslate(data, chunk.length);

      if (!translations) {
        for (const word of chunk) {
          await translateSingle(word, cache);
        }
      } else {
        translations.forEach((translation, offset) => {
          const word = chunk[offset];
          cache[word.slug] = [cleanTranslation(translation, word)];
        });
      }
    } catch (error) {
      console.warn(`Batch translation failed at ${index}: ${error.message}`);
      for (const word of chunk) {
        await translateSingle(word, cache);
      }
    }

    await writeJsonWithRetry(TRANSLATION_CACHE_PATH, cache);
    console.log(`Translated ${Math.min(index + chunk.length, missing.length)} / ${missing.length} missing entries`);
    await sleep(180);
  }
}

async function translateSingle(word, cache) {
  const q = translationQuery(word);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uk&dt=t&q=${encodeURIComponent(q)}`;
  const response = await fetch(url);
  if (!response.ok) {
    cache[word.slug] = [word.headword];
    return;
  }

  const data = await response.json();
  const translation = parseGoogleTranslate(data, 1)?.[0] ?? word.headword;
  cache[word.slug] = [cleanTranslation(translation, word)];
  await sleep(80);
}

function articleFor(word) {
  const first = cleanLookupWord(word.headword)?.[0] ?? "w";
  return /^[aeiou]/i.test(first) ? "an" : "a";
}

function createExamples(word, translation) {
  const quoted =
    word.headword.startsWith("'") ||
    word.headword.includes(" ") ||
    word.headword.length <= 2 ||
    /[^a-zA-Z'-]/.test(word.headword);
  const shown = quoted ? `the word "${word.headword}"` : word.headword;
  const a = articleFor(word);

  if (word.examples?.length >= 5) return word.examples;

  if (word.pos === "noun" && !quoted) {
    return [
      sentence("affirmative", `I can see ${a} ${word.headword}.`, `Я бачу: ${translation}.`, word),
      sentence("negative", `I do not see ${a} ${word.headword}.`, `Я не бачу: ${translation}.`, word),
      sentence("question", `Do you see ${a} ${word.headword}?`, `Ти бачиш: ${translation}?`, word),
      sentence("daily", `The ${word.headword} is useful today.`, `${translation} сьогодні корисне слово.`, word),
      sentence("contextual", `This ${word.headword} is important in the story.`, `У цій історії ${translation} є важливим словом.`, word),
    ];
  }

  if (word.pos === "verb" && !quoted) {
    return [
      sentence("affirmative", `I can ${word.headword} today.`, `Я можу ${translation} сьогодні.`, word),
      sentence("negative", `I cannot ${word.headword} today.`, `Я не можу ${translation} сьогодні.`, word),
      sentence("question", `Can you ${word.headword} today?`, `Ти можеш ${translation} сьогодні?`, word),
      sentence("daily", `We ${word.headword} at home.`, `Ми ${translation} вдома.`, word),
      sentence("contextual", `People ${word.headword} in different ways.`, `Люди можуть ${translation} по-різному.`, word),
    ];
  }

  if (word.pos === "adjective" && !quoted) {
    return [
      sentence("affirmative", `It is ${word.headword}.`, `Це ${translation}.`, word),
      sentence("negative", `It is not ${word.headword}.`, `Це не ${translation}.`, word),
      sentence("question", `Is it ${word.headword}?`, `Це ${translation}?`, word),
      sentence("daily", `The room is ${word.headword}.`, `Кімната ${translation}.`, word),
      sentence("contextual", `This idea is ${word.headword}.`, `Ця ідея ${translation}.`, word),
    ];
  }

  return [
    sentence("affirmative", `I learn ${shown}.`, `Я вивчаю ${translation}.`, word),
    sentence("negative", `I do not forget ${shown}.`, `Я не забуваю ${translation}.`, word),
    sentence("question", `Do you know ${shown}?`, `Ти знаєш ${translation}?`, word),
    sentence("daily", `I use ${shown} in English.`, `Я використовую ${translation} в англійській.`, word),
    sentence("contextual", `${shown} can change the meaning of a sentence.`, `${translation} може змінювати значення речення.`, word),
  ];
}

function sentence(kind, text, translationUk, word) {
  const translation = word.translationsUk?.[0] ?? "";
  return {
    kind,
    text,
    translationUk,
    contextExplanationUk: `У цьому контексті "${word.headword}" означає "${translation || "відповідне українське значення"}".`,
    maxCefr: word.cefr,
  };
}

function hasManualContent(word) {
  return (word.sourceRefs ?? []).some((source) => source.startsWith("manual"));
}

async function main() {
  await mkdir(path.dirname(ENRICHMENT_PATH), { recursive: true });
  await mkdir(CACHE_DIR, { recursive: true });

  const words = await readWords();
  const ipaDict = require(IPA_DICT_PATH);
  const cache = await readJson(TRANSLATION_CACHE_PATH, {});

  for (const word of words) {
    if (word.translationsUk?.length && !cache[word.slug]) {
      cache[word.slug] = word.translationsUk;
    }
  }

  await translateBatch(words, cache);

  const lines = words.map((word) => {
    const manual = hasManualContent(word);
    const translationsUk = manual && word.translationsUk?.length
      ? word.translationsUk
      : TRANSLATION_OVERRIDES[word.slug] ?? (cache[word.slug] ?? [word.headword]).map((value) => cleanTranslation(value, word));
    const enrichedWord = { ...word, translationsUk, examples: manual ? word.examples : [] };
    const sourceRefs = Array.from(new Set([...(word.sourceRefs ?? []), "ipa-dict-en-us", "machine-translation-en-uk"]));

    return JSON.stringify({
      slug: word.slug,
      ipa: getIpa(word, ipaDict),
      translationsUk,
      examples: createExamples(enrichedWord, translationsUk[0]),
      sourceRefs,
    });
  });

  await writeTextWithRetry(ENRICHMENT_PATH, `${lines.join("\n")}\n`);
  await writeJsonWithRetry(TRANSLATION_CACHE_PATH, cache);
  console.log(`Wrote ${lines.length} auto-enrichment entries to ${ENRICHMENT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
