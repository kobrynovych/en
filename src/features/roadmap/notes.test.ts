import { describe, expect, it } from "vitest";
import { NOTE_MAX_LENGTH, notesToMarkdown, parseStoredNotes, serializeNotes, setTaskNote, type TaskNotes } from "./notes";
import type { RoadmapStage } from "./types";

const NOW = new Date("2026-10-02T09:30:00.000Z");

function stage(id: RoadmapStage["id"], code: string, title: string, modules: RoadmapStage["modules"]): RoadmapStage {
  return {
    id,
    code,
    title,
    cefrName: "",
    tagline: "",
    summary: "",
    stageHours: "",
    totalHours: "",
    pace: "",
    vocabulary: "",
    certification: "",
    learningPath: [],
    outcomes: [],
    functions: [],
    topics: [],
    pitfalls: [],
    resources: [],
    modules,
  };
}

const STAGES = [
  stage("start", "Pre-A1", "Старт", [
    { id: "start-sounds", kind: "pronunciation", title: "Звуки", tasks: [{ id: "start-th", title: "Звук th", details: "" }] },
  ]),
  stage("a1", "A1", "A1", [
    {
      id: "a1-grammar",
      kind: "grammar",
      title: "Граматика",
      tasks: [
        { id: "a1-be", title: "Дієслово to be", details: "" },
        { id: "a1-have", title: "Have got", details: "" },
      ],
    },
  ]),
];

describe("setTaskNote", () => {
  it("adds and replaces notes with a timestamp", () => {
    const notes = setTaskNote({}, "a1-be", "I am, you are", NOW);
    expect(notes).toEqual({ "a1-be": { text: "I am, you are", updatedAt: NOW.toISOString() } });

    const later = new Date("2026-10-03T10:00:00.000Z");
    expect(setTaskNote(notes, "a1-be", "I'm, you're", later)["a1-be"]).toEqual({
      text: "I'm, you're",
      updatedAt: later.toISOString(),
    });
  });

  it("returns the same object when nothing changes", () => {
    const notes = setTaskNote({}, "a1-be", "text", NOW);
    expect(setTaskNote(notes, "a1-be", "text")).toBe(notes);
    expect(setTaskNote(notes, "a1-have", "   ")).toBe(notes);
  });

  it("removes a note when its text is blank and keeps the other notes untouched", () => {
    const notes = setTaskNote(setTaskNote({}, "a1-be", "one", NOW), "a1-have", "two", NOW);
    const next = setTaskNote(notes, "a1-be", " \n ");
    expect(Object.keys(next)).toEqual(["a1-have"]);
    expect(next["a1-have"]).toBe(notes["a1-have"]);
  });

  it("cuts the text to the maximum length", () => {
    const notes = setTaskNote({}, "a1-be", "x".repeat(NOTE_MAX_LENGTH + 50), NOW);
    expect(notes["a1-be"].text).toHaveLength(NOTE_MAX_LENGTH);
  });
});

describe("parseStoredNotes", () => {
  it("round-trips serialized notes", () => {
    const notes: TaskNotes = { "a1-be": { text: "note", updatedAt: NOW.toISOString() } };
    expect(parseStoredNotes(serializeNotes(notes))).toEqual(notes);
  });

  it.each([null, "", "not json", "[]", '{"version":2,"notes":{}}', '{"version":1,"notes":[]}'])(
    "returns no notes for %j",
    (raw) => {
      expect(parseStoredNotes(raw)).toEqual({});
    },
  );

  it("drops malformed entries one by one and repairs missing timestamps", () => {
    const raw = JSON.stringify({
      version: 1,
      notes: {
        good: { text: "keep", updatedAt: "2026-10-02T09:30:00.000Z" },
        noDate: { text: "keep too" },
        blank: { text: "   " },
        number: { text: 5 },
        list: ["x"],
        long: { text: "y".repeat(NOTE_MAX_LENGTH + 1), updatedAt: "" },
      },
    });
    const notes = parseStoredNotes(raw);
    expect(Object.keys(notes)).toEqual(["good", "noDate", "long"]);
    expect(notes.noDate.updatedAt).toBe("");
    expect(notes.long.text).toHaveLength(NOTE_MAX_LENGTH);
  });
});

describe("notesToMarkdown", () => {
  it("exports notes in roadmap order with level and section headings", () => {
    const notes: TaskNotes = {
      "a1-have": { text: "Have you got a pen?", updatedAt: NOW.toISOString() },
      "start-th": { text: "  think / this  ", updatedAt: NOW.toISOString() },
      "a1-be": { text: "I'm = I am", updatedAt: "" },
    };
    const markdown = notesToMarkdown(STAGES, notes, NOW);
    const lines = markdown.split("\n");

    expect(lines[0]).toBe("# Нотатки до дорожньої карти English Path");
    expect(lines[2]).toMatch(/^Експортовано: .*2026/);
    const headings = lines.filter((line) => line.startsWith("#"));
    expect(headings).toEqual([
      "# Нотатки до дорожньої карти English Path",
      "## Pre-A1 · Старт",
      "### Звуки: Звук th",
      "## A1",
      "### Граматика: Дієслово to be",
      "### Граматика: Have got",
    ]);
    expect(markdown).toContain("### Звуки: Звук th\n\nthink / this\n\n_Оновлено: ");
    // A note without a valid timestamp has no "updated" line.
    expect(markdown).toContain("### Граматика: Дієслово to be\n\nI'm = I am\n\n### Граматика: Have got");
    expect(markdown.endsWith("\n")).toBe(true);
  });

  it("keeps notes of tasks that no longer exist", () => {
    const markdown = notesToMarkdown(STAGES, { "removed-task": { text: "old note", updatedAt: "" } }, NOW);
    expect(markdown).toContain("## Інші нотатки\n\n### removed-task\n\nold note\n");
    expect(markdown).not.toContain("## A1");
  });
});
