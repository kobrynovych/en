"use client";

import { useEffect } from "react";
import { create } from "zustand";
import type { ReviewEvent, TestAttempt, TestSession, WordProgress } from "@/domain/learning/types";
import { getProgressMap, learningDb } from "@/infrastructure/storage/progress-db";
import { recordReviewResult, toggleLearned } from "@/domain/learning/progress";

interface ProgressState {
  hydrated: boolean;
  progressByWord: Record<string, WordProgress>;
  hydrate: () => Promise<void>;
  toggleLearned: (wordId: string) => Promise<void>;
  recordReview: (wordId: string, correct: boolean) => Promise<void>;
  recordTestAttempt: (session: TestSession, attempt: Omit<TestAttempt, "createdAt">) => Promise<void>;
  resetAllProgress: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  hydrated: false,
  progressByWord: {},
  hydrate: async () => {
    const progressByWord = await getProgressMap();
    set({ progressByWord, hydrated: true });
  },
  toggleLearned: async (wordId) => {
    const current = get().progressByWord[wordId];
    const next = toggleLearned(wordId, current);
    await learningDb.progress.put(next);
    set((state) => ({
      progressByWord: {
        ...state.progressByWord,
        [wordId]: next,
      },
    }));
  },
  recordReview: async (wordId, correct) => {
    const current = get().progressByWord[wordId];
    const result = recordReviewResult(wordId, current, correct);
    const event: ReviewEvent = {
      wordId,
      reviewedAt: result.progress.lastReviewedAt ?? new Date().toISOString(),
      result: correct ? "correct" : "incorrect",
      fromBox: result.fromBox,
      toBox: result.toBox,
    };

    await learningDb.transaction("rw", learningDb.progress, learningDb.reviewEvents, async () => {
      await learningDb.progress.put(result.progress);
      await learningDb.reviewEvents.add(event);
    });

    set((state) => ({
      progressByWord: {
        ...state.progressByWord,
        [wordId]: result.progress,
      },
    }));
  },
  recordTestAttempt: async (session, attempt) => {
    const createdAt = new Date().toISOString();
    await learningDb.transaction("rw", learningDb.testSessions, learningDb.testAttempts, async () => {
      await learningDb.testSessions.put(session);
      await learningDb.testAttempts.add({ ...attempt, createdAt });
    });
  },
  resetAllProgress: async () => {
    await learningDb.transaction("rw", learningDb.progress, learningDb.reviewEvents, learningDb.testSessions, learningDb.testAttempts, async () => {
      await learningDb.progress.clear();
      await learningDb.reviewEvents.clear();
      await learningDb.testSessions.clear();
      await learningDb.testAttempts.clear();
    });
    set({ progressByWord: {} });
  },
}));

export function useHydratedProgress() {
  const hydrated = useProgressStore((state) => state.hydrated);
  const hydrate = useProgressStore((state) => state.hydrate);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);
}
