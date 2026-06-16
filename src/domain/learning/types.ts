export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export const ACTIVE_LEVELS = ["A1", "A2", "B1"] as const;

export type CefrLevel = (typeof CEFR_LEVELS)[number];
export type ActiveCefrLevel = (typeof ACTIVE_LEVELS)[number];

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "pronoun"
  | "determiner"
  | "conjunction"
  | "modal"
  | "phrase"
  | "other";

export type ExampleKind = "affirmative" | "negative" | "question" | "daily" | "contextual";

export interface ExampleSentence {
  kind: ExampleKind;
  text: string;
  translationUk: string;
  contextExplanationUk: string;
  maxCefr: CefrLevel;
}

export interface WordEntry {
  id: string;
  slug: string;
  headword: string;
  americanSpelling: string;
  britishSpelling?: string;
  ipa: string;
  pos: PartOfSpeech;
  cefr: CefrLevel;
  categories: string[];
  translationsUk: string[];
  examples: ExampleSentence[];
  sourceRefs: string[];
}

export type ReviewBox = 1 | 2 | 3 | 4 | 5;

export interface WordProgress {
  wordId: string;
  learned: boolean;
  learnedAt?: string;
  reviewBox: ReviewBox;
  dueAt?: string;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt?: string;
}

export interface ReviewEvent {
  id?: number;
  wordId: string;
  reviewedAt: string;
  result: "correct" | "incorrect";
  fromBox: ReviewBox;
  toBox: ReviewBox;
}

export type TestQuestionKind = "multiple-choice" | "type-translation" | "type-word" | "sentence-builder";

export interface TestAttempt {
  id?: number;
  sessionId: string;
  wordId: string;
  kind: TestQuestionKind;
  answer: string;
  correct: boolean;
  createdAt: string;
}

export interface TestSession {
  id: string;
  startedAt: string;
  completedAt?: string;
  level?: ActiveCefrLevel;
}

export interface VocabularyFilters {
  query: string;
  learned: "all" | "learned" | "unlearned";
  categories: string[];
  partsOfSpeech: PartOfSpeech[];
}

export interface LevelSummary {
  level: ActiveCefrLevel;
  total: number;
  learned: number;
  due: number;
  progressPercent: number;
}

export interface LearningStats {
  totalWords: number;
  learnedWords: number;
  unlearnedWords: number;
  dueWords: number;
  overallProgressPercent: number;
  levels: LevelSummary[];
  categories: Array<{
    category: string;
    total: number;
    learned: number;
    progressPercent: number;
  }>;
  accuracyPercent: number;
}

export const EXAMPLE_KIND_LABELS: Record<ExampleKind, string> = {
  affirmative: "Стверджувальне",
  negative: "Заперечне",
  question: "Питальне",
  daily: "Повсякденне",
  contextual: "Інший контекст",
};

export const POS_LABELS: Record<PartOfSpeech, string> = {
  noun: "noun",
  verb: "verb",
  adjective: "adjective",
  adverb: "adverb",
  preposition: "preposition",
  pronoun: "pronoun",
  determiner: "determiner",
  conjunction: "conjunction",
  modal: "modal",
  phrase: "phrase",
  other: "other",
};
