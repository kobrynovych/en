const WORD_PATTERN = /[\p{L}\p{M}]+(?:[’'-][\p{L}\p{M}]+)*/gu;
const SENTENCE_FALLBACK_PATTERN = /[^.!?]+(?:[.!?]+[”"']?|$)\s*/gu;

export interface ReadingDocument {
  readonly text: string;
  readonly paragraphs: readonly ReadingParagraph[];
  readonly sentences: readonly ReadingSentence[];
}

export interface ReadingParagraph {
  readonly id: string;
  readonly index: number;
  readonly text: string;
  readonly start: number;
  readonly end: number;
  readonly sentences: readonly ReadingSentence[];
}

export interface ReadingSentence {
  readonly id: string;
  readonly index: number;
  readonly paragraphId: string;
  readonly paragraphIndex: number;
  readonly text: string;
  readonly start: number;
  readonly end: number;
  readonly paragraphStart: number;
  readonly paragraphEnd: number;
  readonly tokens: readonly ReadingToken[];
  readonly words: readonly ReadingWord[];
}

export interface ReadingWord {
  readonly kind: "word";
  readonly id: string;
  readonly text: string;
  readonly start: number;
  readonly end: number;
  readonly globalStart: number;
  readonly globalEnd: number;
}

export type ReadingToken =
  | ReadingWord
  | {
      readonly kind: "text";
      readonly id: string;
      readonly text: string;
      readonly start: number;
      readonly end: number;
      readonly globalStart: number;
      readonly globalEnd: number;
    };

interface IndexedSentence {
  readonly text: string;
  readonly index: number;
}

interface SpeechBoundary {
  readonly charIndex: number;
  readonly charLength?: number;
}

function normalizeParagraphs(input: string) {
  const trimmedInput = input.replace(/\r\n?/g, "\n").trim();
  if (!trimmedInput) return [];

  return trimmedInput
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

function getIndexedSentences(text: string): IndexedSentence[] {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
    return Array.from(segmenter.segment(text), ({ segment, index }) => ({
      text: segment,
      index,
    }));
  }

  const matches = Array.from(text.matchAll(SENTENCE_FALLBACK_PATTERN), (match) => ({
    text: match[0],
    index: match.index,
  }));

  return matches.length > 0 ? matches : [{ text, index: 0 }];
}

function buildTokens(sentenceText: string, sentenceStart: number) {
  const tokens: ReadingToken[] = [];
  const words: ReadingWord[] = [];
  let cursor = 0;

  for (const match of sentenceText.matchAll(WORD_PATTERN)) {
    const start = match.index;

    if (start > cursor) {
      const globalStart = sentenceStart + cursor;
      tokens.push({
        kind: "text",
        id: `text-${globalStart}`,
        text: sentenceText.slice(cursor, start),
        start: cursor,
        end: start,
        globalStart,
        globalEnd: sentenceStart + start,
      });
    }

    const text = match[0];
    const end = start + text.length;
    const globalStart = sentenceStart + start;
    const word: ReadingWord = {
      kind: "word",
      id: `word-${globalStart}`,
      text,
      start,
      end,
      globalStart,
      globalEnd: sentenceStart + end,
    };

    tokens.push(word);
    words.push(word);
    cursor = end;
  }

  if (cursor < sentenceText.length) {
    const globalStart = sentenceStart + cursor;
    tokens.push({
      kind: "text",
      id: `text-${globalStart}`,
      text: sentenceText.slice(cursor),
      start: cursor,
      end: sentenceText.length,
      globalStart,
      globalEnd: sentenceStart + sentenceText.length,
    });
  }

  return { tokens, words };
}

function buildSentences(
  paragraphText: string,
  paragraphStart: number,
  paragraphId: string,
  paragraphIndex: number,
) {
  return getIndexedSentences(paragraphText).flatMap((entry, index) => {
    const leadingWhitespaceLength = entry.text.length - entry.text.trimStart().length;
    const text = entry.text.trim();
    if (!text) return [];

    const sentenceParagraphStart = entry.index + leadingWhitespaceLength;
    const start = paragraphStart + sentenceParagraphStart;
    const { tokens, words } = buildTokens(text, start);

    return [{
      id: `sentence-${start}`,
      index,
      paragraphId,
      paragraphIndex,
      text,
      start,
      end: start + text.length,
      paragraphStart: sentenceParagraphStart,
      paragraphEnd: sentenceParagraphStart + text.length,
      tokens,
      words,
    } satisfies ReadingSentence];
  });
}

export function buildReadingDocument(input: string): ReadingDocument {
  const paragraphTexts = normalizeParagraphs(input);
  const text = paragraphTexts.join("\n\n");
  const paragraphs: ReadingParagraph[] = [];
  const sentences: ReadingSentence[] = [];
  let start = 0;

  paragraphTexts.forEach((paragraphText, index) => {
    const id = `paragraph-${start}`;
    const paragraphSentences = buildSentences(paragraphText, start, id, index);
    const paragraph: ReadingParagraph = {
      id,
      index,
      text: paragraphText,
      start,
      end: start + paragraphText.length,
      sentences: paragraphSentences,
    };

    paragraphs.push(paragraph);
    sentences.push(...paragraphSentences);
    start = paragraph.end + 2;
  });

  return { text, paragraphs, sentences };
}

export function resolveBoundaryWord(
  sentence: ReadingSentence,
  { charIndex, charLength = 0 }: SpeechBoundary,
): ReadingWord | null {
  if (!Number.isFinite(charIndex) || charIndex < 0 || charIndex >= sentence.text.length) {
    return null;
  }

  if (Number.isFinite(charLength) && charLength > 0) {
    const boundaryEnd = charIndex + charLength;
    return sentence.words.find((word) => word.start < boundaryEnd && word.end > charIndex) ?? null;
  }

  return sentence.words.find((word) => (
    (word.start <= charIndex && charIndex < word.end)
    || word.start >= charIndex
  )) ?? null;
}
