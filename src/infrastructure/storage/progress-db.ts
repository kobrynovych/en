"use client";

import Dexie, { type Table } from "dexie";
import type { ReviewEvent, TestAttempt, TestSession, WordProgress } from "@/domain/learning/types";

export interface UserPreference {
  key: string;
  value: string;
}

class LearningDatabase extends Dexie {
  progress!: Table<WordProgress, string>;
  reviewEvents!: Table<ReviewEvent, number>;
  testSessions!: Table<TestSession, string>;
  testAttempts!: Table<TestAttempt, number>;
  preferences!: Table<UserPreference, string>;

  constructor() {
    super("englishSelfStudy");
    this.version(1).stores({
      progress: "wordId, learned, dueAt, reviewBox",
      reviewEvents: "++id, wordId, reviewedAt, result",
      testSessions: "id, startedAt, completedAt, level",
      testAttempts: "++id, sessionId, wordId, kind, correct, createdAt",
      preferences: "key",
    });
  }
}

export const learningDb = new LearningDatabase();

export async function getProgressMap() {
  const records = await learningDb.progress.toArray();
  return Object.fromEntries(records.map((record) => [record.wordId, record]));
}
