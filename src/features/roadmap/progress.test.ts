import { describe, expect, it } from "vitest";
import {
  findNextTask,
  getStageStatus,
  parseStoredProgress,
  serializeProgress,
  summarizeRoadmap,
  summarizeStage,
  toggleTask,
} from "./progress";
import type { RoadmapStage } from "./types";

function stage(id: RoadmapStage["id"], tasks: Array<{ id: string; optional?: boolean }>): RoadmapStage {
  return {
    id,
    code: id.toUpperCase(),
    title: id,
    cefrName: id,
    tagline: "",
    summary: "",
    stageHours: "",
    totalHours: "",
    pace: "",
    vocabulary: "",
    certification: "",
    outcomes: [],
    functions: [],
    topics: [],
    pitfalls: [],
    resources: [],
    modules: [
      {
        id: `${id}-module`,
        kind: "grammar",
        title: "Module",
        tasks: tasks.map((task) => ({ title: task.id, details: "", ...task })),
      },
    ],
  };
}

const stages = [
  stage("a1", [{ id: "a1-one" }, { id: "a1-two" }, { id: "a1-exam", optional: true }]),
  stage("a2", [{ id: "a2-one" }]),
];

describe("roadmap progress summaries", () => {
  it("counts only required tasks", () => {
    const completed = { "a1-one": "2026-09-01T00:00:00.000Z", "a1-exam": "2026-09-02T00:00:00.000Z" };

    expect(summarizeStage(stages[0], completed)).toEqual({ done: 1, total: 2, percent: 50 });
    expect(summarizeRoadmap(stages, completed)).toEqual({ done: 1, total: 3, percent: 33 });
  });

  it("ignores stale ids that are no longer in the roadmap", () => {
    expect(summarizeRoadmap(stages, { "removed-task": "2026-09-01T00:00:00.000Z" }).done).toBe(0);
  });

  it("derives the stage status", () => {
    expect(getStageStatus({ done: 0, total: 2, percent: 0 })).toBe("not-started");
    expect(getStageStatus({ done: 1, total: 2, percent: 50 })).toBe("in-progress");
    expect(getStageStatus({ done: 2, total: 2, percent: 100 })).toBe("done");
  });
});

describe("findNextTask", () => {
  it("returns the first unfinished required task in roadmap order", () => {
    expect(findNextTask(stages, {})?.task.id).toBe("a1-one");
    expect(findNextTask(stages, { "a1-one": "x" })?.task.id).toBe("a1-two");
  });

  it("skips optional tasks and moves on to the next stage", () => {
    const next = findNextTask(stages, { "a1-one": "x", "a1-two": "x" });
    expect(next?.stage.id).toBe("a2");
    expect(next?.task.id).toBe("a2-one");
  });

  it("returns null when every required task is done", () => {
    expect(findNextTask(stages, { "a1-one": "x", "a1-two": "x", "a2-one": "x" })).toBeNull();
  });
});

describe("toggleTask", () => {
  it("stores the completion time and removes it on the second toggle", () => {
    const checked = toggleTask({}, "a1-one", new Date("2026-09-30T10:00:00.000Z"));
    expect(checked).toEqual({ "a1-one": "2026-09-30T10:00:00.000Z" });
    expect(toggleTask(checked, "a1-one")).toEqual({});
  });

  it("does not mutate the previous state", () => {
    const previous = Object.freeze({ "a1-one": "x" });
    toggleTask(previous, "a1-two");
    toggleTask(previous, "a1-one");
    expect(previous).toEqual({ "a1-one": "x" });
  });
});

describe("stored progress", () => {
  it("round-trips through serialization", () => {
    const completed = { "a1-one": "2026-09-30T10:00:00.000Z" };
    expect(parseStoredProgress(serializeProgress(completed))).toEqual(completed);
  });

  it("returns empty progress for missing, broken or foreign data", () => {
    expect(parseStoredProgress(null)).toEqual({});
    expect(parseStoredProgress("not json")).toEqual({});
    expect(parseStoredProgress("[]")).toEqual({});
    expect(parseStoredProgress(JSON.stringify({ version: 2, completed: { a: "x" } }))).toEqual({});
    expect(parseStoredProgress(JSON.stringify({ version: 1, completed: [] }))).toEqual({});
  });

  it("drops malformed entries but keeps valid ones", () => {
    const raw = JSON.stringify({ version: 1, completed: { good: "2026-09-30T10:00:00.000Z", bad: 42, nope: null } });
    expect(parseStoredProgress(raw)).toEqual({ good: "2026-09-30T10:00:00.000Z" });
  });
});
