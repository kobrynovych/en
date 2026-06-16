import { z } from "zod";
import { CEFR_LEVELS } from "./types";

const cefrLevelSchema = z.enum(CEFR_LEVELS);

export const exampleSentenceSchema = z.object({
  kind: z.enum(["affirmative", "negative", "question", "daily", "contextual"]),
  text: z.string().min(1),
  translationUk: z.string().min(1),
  contextExplanationUk: z.string().min(1),
  maxCefr: cefrLevelSchema,
});

export const wordEntrySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  headword: z.string().min(1),
  americanSpelling: z.string().min(1),
  britishSpelling: z.string().optional(),
  ipa: z.string(),
  pos: z.enum([
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
  ]),
  cefr: cefrLevelSchema,
  categories: z.array(z.string().min(1)).min(1),
  translationsUk: z.array(z.string().min(1)),
  examples: z.array(exampleSentenceSchema),
  sourceRefs: z.array(z.string().min(1)).min(1),
});

export const wordProgressSchema = z.object({
  wordId: z.string().min(1),
  learned: z.boolean(),
  learnedAt: z.string().optional(),
  reviewBox: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  dueAt: z.string().optional(),
  correctCount: z.number().int().nonnegative(),
  incorrectCount: z.number().int().nonnegative(),
  lastReviewedAt: z.string().optional(),
});
