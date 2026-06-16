import { describe, expect, it } from "vitest";
import { isCorrectTranslation, isCorrectWord, normalizeAnswer, pickDistractors } from "./tests";
import type { WordEntry } from "./types";

function makeWord(id: string, headword: string, translation: string, pos: WordEntry["pos"] = "noun"): WordEntry {
  return {
    id,
    slug: id,
    headword,
    americanSpelling: headword,
    ipa: "/test/",
    pos,
    cefr: "A1",
    categories: ["general"],
    translationsUk: [translation],
    examples: [],
    sourceRefs: ["test"],
  };
}

describe("test helpers", () => {
  it("normalizes punctuation and checks answers", () => {
    const word = makeWord("apple", "apple", "яблуко");

    expect(normalizeAnswer(" Яблуко! ")).toBe("яблуко");
    expect(isCorrectTranslation(word, "яблуко")).toBe(true);
    expect(isCorrectWord(word, "Apple")).toBe(true);
  });

  it("prefers same-level same-POS distractors", () => {
    const target = makeWord("apple", "apple", "яблуко");
    const words = [target, makeWord("book", "book", "книга"), makeWord("work", "work", "робота", "verb")];

    expect(pickDistractors(target, words, 1)[0]?.id).toBe("book");
  });
});
