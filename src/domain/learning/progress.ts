import type { ReviewBox, WordProgress } from "./types";

export const LEITNER_INTERVAL_DAYS: Record<ReviewBox, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

export function createDefaultProgress(wordId: string): WordProgress {
  return {
    wordId,
    learned: false,
    reviewBox: 1,
    correctCount: 0,
    incorrectCount: 0,
  };
}

export function clampReviewBox(value: number): ReviewBox {
  return Math.min(5, Math.max(1, value)) as ReviewBox;
}

export function nextDueDate(box: ReviewBox, fromDate = new Date()) {
  const due = new Date(fromDate);
  due.setDate(due.getDate() + LEITNER_INTERVAL_DAYS[box]);
  return due.toISOString();
}

export function markLearned(progress: WordProgress | undefined, now = new Date()): WordProgress {
  const current = progress ?? createDefaultProgress("");
  const wordId = current.wordId;
  return {
    ...current,
    wordId,
    learned: true,
    learnedAt: current.learnedAt ?? now.toISOString(),
    reviewBox: current.reviewBox || 1,
    dueAt: current.dueAt ?? nextDueDate(current.reviewBox || 1, now),
  };
}

export function toggleLearned(wordId: string, progress: WordProgress | undefined, now = new Date()): WordProgress {
  const current = progress ?? createDefaultProgress(wordId);

  if (current.learned) {
    return {
      ...current,
      learned: false,
      learnedAt: undefined,
      dueAt: undefined,
    };
  }

  return {
    ...current,
    learned: true,
    learnedAt: now.toISOString(),
    dueAt: nextDueDate(current.reviewBox, now),
  };
}

export function recordReviewResult(
  wordId: string,
  progress: WordProgress | undefined,
  correct: boolean,
  now = new Date(),
) {
  const current = progress ?? createDefaultProgress(wordId);
  const fromBox = current.reviewBox;
  const toBox = correct ? clampReviewBox(fromBox + 1) : 1;

  const nextProgress: WordProgress = {
    ...current,
    wordId,
    learned: correct ? true : current.learned,
    learnedAt: correct ? current.learnedAt ?? now.toISOString() : current.learnedAt,
    reviewBox: toBox,
    dueAt: correct ? nextDueDate(toBox, now) : now.toISOString(),
    correctCount: current.correctCount + (correct ? 1 : 0),
    incorrectCount: current.incorrectCount + (correct ? 0 : 1),
    lastReviewedAt: now.toISOString(),
  };

  return { progress: nextProgress, fromBox, toBox };
}

export function isDue(progress: WordProgress | undefined, now = new Date()) {
  if (!progress?.dueAt) return false;
  return new Date(progress.dueAt).getTime() <= now.getTime();
}

export function percentage(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}
