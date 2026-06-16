import { describe, expect, it } from "vitest";
import { createDefaultProgress, isDue, percentage, recordReviewResult, toggleLearned } from "./progress";

describe("learning progress", () => {
  it("toggles learned state and persists review metadata shape", () => {
    const learned = toggleLearned("word-1", undefined, new Date("2026-06-16T10:00:00.000Z"));

    expect(learned.learned).toBe(true);
    expect(learned.wordId).toBe("word-1");
    expect(learned.learnedAt).toBe("2026-06-16T10:00:00.000Z");
    expect(learned.dueAt).toBe("2026-06-17T10:00:00.000Z");

    const unlearned = toggleLearned("word-1", learned);
    expect(unlearned.learned).toBe(false);
    expect(unlearned.dueAt).toBeUndefined();
  });

  it("moves correct reviews forward and incorrect reviews back to box one", () => {
    const base = { ...createDefaultProgress("word-1"), reviewBox: 3 as const };
    const correct = recordReviewResult("word-1", base, true, new Date("2026-06-16T10:00:00.000Z"));
    const incorrect = recordReviewResult("word-1", correct.progress, false, new Date("2026-06-16T11:00:00.000Z"));

    expect(correct.toBox).toBe(4);
    expect(correct.progress.dueAt).toBe("2026-06-23T10:00:00.000Z");
    expect(incorrect.toBox).toBe(1);
    expect(incorrect.progress.incorrectCount).toBe(1);
    expect(isDue(incorrect.progress, new Date("2026-06-16T11:00:01.000Z"))).toBe(true);
  });

  it("calculates rounded percentages", () => {
    expect(percentage(1, 3)).toBe(33);
    expect(percentage(0, 0)).toBe(0);
  });
});
