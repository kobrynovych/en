import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const WORDS_DIR = path.join(ROOT, "content", "words");
const LEVELS = ["a1", "a2", "b1"];
const REQUIRED_EXAMPLES = ["affirmative", "negative", "question", "daily", "contextual"];
const STRICT = process.argv.includes("--strict");

const VALID_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const VALID_POS = new Set([
  "noun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "pronoun",
  "determiner",
  "conjunction",
  "modal",
  "phrase",
  "other",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateEntry(entry, seen) {
  assert(typeof entry.id === "string" && entry.id.length > 0, "Missing id");
  assert(typeof entry.slug === "string" && entry.slug.length > 0, `Missing slug for ${entry.id}`);
  assert(!seen.has(entry.slug), `Duplicate slug: ${entry.slug}`);
  seen.add(entry.slug);
  assert(typeof entry.headword === "string" && entry.headword.length > 0, `Missing headword for ${entry.slug}`);
  assert(typeof entry.americanSpelling === "string" && entry.americanSpelling.length > 0, `Missing US spelling for ${entry.slug}`);
  assert(VALID_LEVELS.has(entry.cefr), `Invalid CEFR for ${entry.slug}: ${entry.cefr}`);
  assert(VALID_POS.has(entry.pos), `Invalid POS for ${entry.slug}: ${entry.pos}`);
  assert(Array.isArray(entry.categories) && entry.categories.length > 0, `Missing categories for ${entry.slug}`);
  assert(Array.isArray(entry.translationsUk), `translationsUk must be an array for ${entry.slug}`);
  assert(Array.isArray(entry.examples), `examples must be an array for ${entry.slug}`);
  assert(Array.isArray(entry.sourceRefs) && entry.sourceRefs.length > 0, `Missing source refs for ${entry.slug}`);

  if (STRICT) {
    assert(entry.ipa.length > 0, `Missing IPA for ${entry.slug}`);
    assert(entry.translationsUk.length > 0, `Missing Ukrainian translations for ${entry.slug}`);
    const exampleKinds = new Set(entry.examples.map((example) => example.kind));
    for (const kind of REQUIRED_EXAMPLES) {
      assert(exampleKinds.has(kind), `Missing ${kind} example for ${entry.slug}`);
    }
  }

  for (const example of entry.examples) {
    assert(REQUIRED_EXAMPLES.includes(example.kind), `Invalid example kind for ${entry.slug}`);
    assert(typeof example.text === "string" && example.text.length > 0, `Missing example text for ${entry.slug}`);
    assert(typeof example.translationUk === "string" && example.translationUk.length > 0, `Missing example translation for ${entry.slug}`);
    assert(
      typeof example.contextExplanationUk === "string" && example.contextExplanationUk.length > 0,
      `Missing context explanation for ${entry.slug}`,
    );
    assert(VALID_LEVELS.has(example.maxCefr), `Invalid example CEFR for ${entry.slug}`);
  }
}

async function main() {
  const seen = new Set();
  const totals = {};

  for (const level of LEVELS) {
    const filePath = path.join(WORDS_DIR, `${level}.jsonl`);
    const content = await readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/).filter(Boolean);
    totals[level.toUpperCase()] = lines.length;

    for (const line of lines) {
      validateEntry(JSON.parse(line), seen);
    }
  }

  console.log(`Validated ${seen.size} content entries${STRICT ? " in strict release mode" : ""}.`);
  console.table(totals);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
