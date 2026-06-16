import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { wordEntrySchema } from "@/domain/learning/schemas";
import { ACTIVE_LEVELS, type ActiveCefrLevel, type PartOfSpeech, type WordEntry } from "@/domain/learning/types";
import { sortWordsForStudy } from "@/domain/learning/search";
import type { StatsWordMeta } from "@/domain/learning/stats";

const CONTENT_ROOT = path.join(process.cwd(), "content", "words");

async function readJsonl(filePath: string) {
  const content = await readFile(filePath, "utf8");
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => wordEntrySchema.parse(JSON.parse(line)));
}

export const getAllWords = cache(async (): Promise<WordEntry[]> => {
  const grouped = await Promise.all(
    ACTIVE_LEVELS.map((level) => readJsonl(path.join(CONTENT_ROOT, `${level.toLowerCase()}.jsonl`))),
  );

  return sortWordsForStudy(grouped.flat());
});

export const getWordsByLevel = cache(async (level: ActiveCefrLevel): Promise<WordEntry[]> => {
  const words = await readJsonl(path.join(CONTENT_ROOT, `${level.toLowerCase()}.jsonl`));
  return sortWordsForStudy(words);
});

function stripExamples(word: WordEntry): WordEntry {
  return {
    ...word,
    examples: [],
  };
}

function stripForStats(word: WordEntry): StatsWordMeta {
  return {
    id: word.id,
    cefr: word.cefr,
    categories: word.categories,
  };
}

export const getAllWordStatsMetas = cache(async (): Promise<StatsWordMeta[]> => {
  const words = await getAllWords();
  return words.map(stripForStats);
});

export const getWordListByLevel = cache(async (level: ActiveCefrLevel): Promise<WordEntry[]> => {
  const words = await getWordsByLevel(level);
  return words.map(stripExamples);
});

export const getPracticeWords = cache(async (): Promise<WordEntry[]> => {
  const words = await getAllWords();
  return words.map((word) => ({
    ...stripExamples(word),
    examples: word.examples.slice(0, 1),
  }));
});

export const getWordBySlug = cache(async (slug: string) => {
  const words = await getAllWords();
  return words.find((word) => word.slug === slug);
});

export const getContentSummary = cache(async () => {
  const words = await getAllWords();
  const categories = [...new Set(words.flatMap((word) => word.categories))].sort();
  const partsOfSpeech = [...new Set(words.map((word) => word.pos))].sort() as PartOfSpeech[];
  const enrichedWords = words.filter((word) => word.translationsUk.length > 0 && word.examples.length > 0).length;

  return {
    totalWords: words.length,
    enrichedWords,
    levels: ACTIVE_LEVELS.map((level) => ({
      level,
      total: words.filter((word) => word.cefr === level).length,
    })),
    categories,
    partsOfSpeech,
  };
});
