import type { TestQuestionKind, WordEntry } from "./types";
import { normalizeSearchValue } from "./search";

export function normalizeAnswer(value: string) {
  return normalizeSearchValue(value).replace(/[.,!?;:]+$/g, "");
}

export function isCorrectTranslation(word: WordEntry, answer: string) {
  const normalized = normalizeAnswer(answer);
  return word.translationsUk.some((translation) => normalizeAnswer(translation) === normalized);
}

export function isCorrectWord(word: WordEntry, answer: string) {
  const normalized = normalizeAnswer(answer);
  return [word.headword, word.americanSpelling, word.britishSpelling]
    .filter(Boolean)
    .some((candidate) => normalizeAnswer(candidate ?? "") === normalized);
}

export function pickDistractors(word: WordEntry, words: WordEntry[], count = 3) {
  const preferred = words.filter(
    (candidate) =>
      candidate.id !== word.id &&
      candidate.cefr === word.cefr &&
      candidate.pos === word.pos &&
      candidate.translationsUk.length > 0,
  );
  const fallback = words.filter((candidate) => candidate.id !== word.id && candidate.translationsUk.length > 0);

  return [...preferred, ...fallback]
    .filter((candidate, index, array) => array.findIndex((item) => item.id === candidate.id) === index)
    .slice(0, count);
}

export function createQuestionPrompt(kind: TestQuestionKind, word: WordEntry) {
  switch (kind) {
    case "multiple-choice":
      return `Оберіть переклад слова "${word.headword}"`;
    case "type-translation":
      return `Введіть український переклад: ${word.headword}`;
    case "type-word":
      return `Введіть англійське слово: ${word.translationsUk[0] ?? word.headword}`;
    case "sentence-builder":
      return "Складіть речення з поданих частин";
    default:
      return "Дайте відповідь";
  }
}
