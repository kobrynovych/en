import { describe, expect, it } from "vitest";
import { matchesVocabularyFilters, normalizeSearchValue } from "./search";
import type { VocabularyFilters, WordEntry } from "./types";

const word: WordEntry = {
  id: "a1-apple-noun",
  slug: "apple-noun",
  headword: "apple",
  americanSpelling: "apple",
  ipa: "/ˈæpəl/",
  pos: "noun",
  cefr: "A1",
  categories: ["food"],
  translationsUk: ["яблуко"],
  examples: [],
  sourceRefs: ["test"],
};

const defaultFilters: VocabularyFilters = {
  query: "",
  learned: "all",
  categories: [],
  partsOfSpeech: [],
};

describe("vocabulary search", () => {
  it("normalizes case and diacritics", () => {
    expect(normalizeSearchValue(" Café ")).toBe("cafe");
  });

  it("matches English and Ukrainian query text", () => {
    expect(matchesVocabularyFilters(word, undefined, { ...defaultFilters, query: "app" })).toBe(true);
    expect(matchesVocabularyFilters(word, undefined, { ...defaultFilters, query: "яблу" })).toBe(true);
    expect(matchesVocabularyFilters(word, undefined, { ...defaultFilters, query: "banana" })).toBe(false);
  });

  it("combines progress, category, and part-of-speech filters", () => {
    expect(
      matchesVocabularyFilters(word, { wordId: word.id, learned: true, reviewBox: 1, correctCount: 0, incorrectCount: 0 }, {
        ...defaultFilters,
        learned: "learned",
        categories: ["food"],
        partsOfSpeech: ["noun"],
      }),
    ).toBe(true);

    expect(matchesVocabularyFilters(word, undefined, { ...defaultFilters, learned: "learned" })).toBe(false);
  });
});
