import { afterEach, describe, expect, it } from "vitest";
import { buildReadingDocument, resolveBoundaryWord } from "./reading-text";

const nativeSegmenter = Intl.Segmenter;

afterEach(() => {
  Object.defineProperty(Intl, "Segmenter", {
    configurable: true,
    value: nativeSegmenter,
  });
});

describe("buildReadingDocument", () => {
  it("returns an empty canonical model for whitespace-only input", () => {
    expect(buildReadingDocument(" \n\t ")).toEqual({
      text: "",
      paragraphs: [],
      sentences: [],
    });
  });

  it("normalizes line endings, paragraphs, and intra-paragraph newlines", () => {
    const document = buildReadingDocument(
      "  First line\r\n  continues. Same again.\r\n\r\n  Second paragraph!  ",
    );

    expect(document.text).toBe("First line continues. Same again.\n\nSecond paragraph!");
    expect(document.paragraphs).toHaveLength(2);
    expect(document.paragraphs[0]).toMatchObject({
      id: "paragraph-0",
      index: 0,
      text: "First line continues. Same again.",
      start: 0,
      end: "First line continues. Same again.".length,
    });

    const secondParagraphStart = document.text.indexOf("Second paragraph!");
    expect(document.paragraphs[1]).toMatchObject({
      id: `paragraph-${secondParagraphStart}`,
      index: 1,
      text: "Second paragraph!",
      start: secondParagraphStart,
      end: document.text.length,
    });
    expect(document.paragraphs[1].sentences[0].words[0]).toMatchObject({
      id: `word-${secondParagraphStart}`,
      start: 0,
      globalStart: secondParagraphStart,
    });
    expect(document.sentences.map(({ text, start, end }) => ({ text, start, end }))).toEqual([
      {
        text: "First line continues.",
        start: document.text.indexOf("First line continues."),
        end: document.text.indexOf("First line continues.") + "First line continues.".length,
      },
      {
        text: "Same again.",
        start: document.text.indexOf("Same again."),
        end: document.text.indexOf("Same again.") + "Same again.".length,
      },
      {
        text: "Second paragraph!",
        start: secondParagraphStart,
        end: document.text.length,
      },
    ]);
  });

  it("uses positional IDs and offsets for repeated words and sentences", () => {
    const document = buildReadingDocument("Go now. Go now.");
    const [firstSentence, secondSentence] = document.sentences;

    expect(firstSentence.text).toBe("Go now.");
    expect(secondSentence.text).toBe("Go now.");
    expect(firstSentence).toMatchObject({
      id: "sentence-0",
      start: 0,
      paragraphStart: 0,
    });
    expect(secondSentence).toMatchObject({
      id: "sentence-8",
      start: 8,
      paragraphStart: 8,
    });
    expect(firstSentence.words.map(({ id, start, globalStart }) => ({ id, start, globalStart }))).toEqual([
      { id: "word-0", start: 0, globalStart: 0 },
      { id: "word-3", start: 3, globalStart: 3 },
    ]);
    expect(secondSentence.words.map(({ id, start, globalStart }) => ({ id, start, globalStart }))).toEqual([
      { id: "word-8", start: 0, globalStart: 8 },
      { id: "word-11", start: 3, globalStart: 11 },
    ]);
  });

  it("precomputes alternating render tokens for Unicode words, contractions, and hyphens", () => {
    const [sentence] = buildReadingDocument("Don't re-enter cafe\u0301—rock’n’roll.").sentences;

    expect(sentence.words.map(({ text, start, end }) => ({ text, start, end }))).toEqual([
      { text: "Don't", start: 0, end: 5 },
      { text: "re-enter", start: 6, end: 14 },
      { text: "cafe\u0301", start: 15, end: 20 },
      { text: "rock’n’roll", start: 21, end: 32 },
    ]);
    expect(sentence.tokens.map(({ kind, text }) => ({ kind, text }))).toEqual([
      { kind: "word", text: "Don't" },
      { kind: "text", text: " " },
      { kind: "word", text: "re-enter" },
      { kind: "text", text: " " },
      { kind: "word", text: "cafe\u0301" },
      { kind: "text", text: "—" },
      { kind: "word", text: "rock’n’roll" },
      { kind: "text", text: "." },
    ]);
    expect(sentence.tokens.map((token) => token.text).join("")).toBe(sentence.text);
  });

  it("uses indexed fallback matches without confusing repeated sentences", () => {
    Object.defineProperty(Intl, "Segmenter", {
      configurable: true,
      value: undefined,
    });

    const document = buildReadingDocument("Same. Same.");

    expect(document.sentences.map(({ text, start, end }) => ({ text, start, end }))).toEqual([
      { text: "Same.", start: 0, end: 5 },
      { text: "Same.", start: 6, end: 11 },
    ]);
  });
});

describe("resolveBoundaryWord", () => {
  const [sentence] = buildReadingDocument("One, two three.").sentences;

  it("resolves exact and inside-word indices", () => {
    expect(resolveBoundaryWord(sentence, { charIndex: 0 })?.text).toBe("One");
    expect(resolveBoundaryWord(sentence, { charIndex: 1 })?.text).toBe("One");
    expect(resolveBoundaryWord(sentence, { charIndex: 5 })?.text).toBe("two");
    expect(resolveBoundaryWord(sentence, { charIndex: 12 })?.text).toBe("three");
  });

  it("advances zero-length boundaries across punctuation, whitespace, and word ends", () => {
    expect(resolveBoundaryWord(sentence, { charIndex: 3 })?.text).toBe("two");
    expect(resolveBoundaryWord(sentence, { charIndex: 4 })?.text).toBe("two");
    expect(resolveBoundaryWord(sentence, { charIndex: 8 })?.text).toBe("three");
    expect(resolveBoundaryWord(sentence, { charIndex: 14 })).toBeNull();
    expect(resolveBoundaryWord(sentence, { charIndex: sentence.text.length })).toBeNull();
  });

  it("uses positive charLength as an overlap range instead of advancing", () => {
    expect(resolveBoundaryWord(sentence, { charIndex: 3, charLength: 3 })?.text).toBe("two");
    expect(resolveBoundaryWord(sentence, { charIndex: 3, charLength: 2 })).toBeNull();
    expect(resolveBoundaryWord(sentence, { charIndex: 7, charLength: 3 })?.text).toBe("two");
    expect(resolveBoundaryWord(sentence, { charIndex: 14, charLength: 1 })).toBeNull();
  });

  it("returns null for invalid or out-of-range positions", () => {
    expect(resolveBoundaryWord(sentence, { charIndex: -1 })).toBeNull();
    expect(resolveBoundaryWord(sentence, { charIndex: Number.NaN })).toBeNull();
    expect(resolveBoundaryWord(sentence, { charIndex: 100 })).toBeNull();
  });
});
