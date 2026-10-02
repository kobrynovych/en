import type { RoadmapStage } from "./types";

export const ROADMAP_NOTES_STORAGE_KEY = "english-path-roadmap-notes";
/** Keeps a single note readable and the whole collection far below the ~5 MB localStorage quota. */
export const NOTE_MAX_LENGTH = 2000;
const NOTES_VERSION = 1;

export interface TaskNote {
  text: string;
  /** ISO timestamp of the last change. */
  updatedAt: string;
}

/** Task id → the learner's note. */
export type TaskNotes = Readonly<Record<string, TaskNote>>;

/** Saves or replaces a note; blank text removes it. Unchanged text returns the same object (no write). */
export function setTaskNote(notes: TaskNotes, taskId: string, text: string, now = new Date()): TaskNotes {
  const value = text.slice(0, NOTE_MAX_LENGTH);
  if (!value.trim()) {
    if (!notes[taskId]) return notes;
    const next = { ...notes };
    delete next[taskId];
    return next;
  }
  if (notes[taskId]?.text === value) return notes;
  return { ...notes, [taskId]: { text: value, updatedAt: now.toISOString() } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Tolerant reader: malformed storage yields no notes, malformed entries are dropped one by one. */
export function parseStoredNotes(raw: string | null): TaskNotes {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data) || data.version !== NOTES_VERSION || !isRecord(data.notes)) return {};

    const notes: Record<string, TaskNote> = {};
    for (const [taskId, entry] of Object.entries(data.notes)) {
      if (!taskId || !isRecord(entry) || typeof entry.text !== "string" || !entry.text.trim()) continue;
      notes[taskId] = {
        text: entry.text.slice(0, NOTE_MAX_LENGTH),
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : "",
      };
    }
    return notes;
  } catch {
    return {};
  }
}

export function serializeNotes(notes: TaskNotes): string {
  return JSON.stringify({ version: NOTES_VERSION, notes });
}

function formatDate(value: string | Date, withTime: boolean) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("uk-UA", withTime ? { dateStyle: "long", timeStyle: "short" } : { dateStyle: "long" }).format(date);
}

/**
 * All notes as a Markdown document in roadmap order, so learners can keep a copy outside the browser.
 * Notes whose task no longer exists are kept at the end instead of being lost.
 */
export function notesToMarkdown(stages: readonly RoadmapStage[], notes: TaskNotes, exportedAt = new Date()): string {
  const lines = ["# Нотатки до дорожньої карти English Path", "", `Експортовано: ${formatDate(exportedAt, true)}`];
  const exported = new Set<string>();

  function addNote(heading: string, note: TaskNote) {
    const updated = formatDate(note.updatedAt, true);
    lines.push("", `### ${heading}`, "", note.text.trim());
    if (updated) lines.push("", `_Оновлено: ${updated}_`);
  }

  for (const stage of stages) {
    const stageNotes = stage.modules.flatMap((roadmapModule) =>
      roadmapModule.tasks.filter((task) => notes[task.id]).map((task) => ({ roadmapModule, task })),
    );
    if (stageNotes.length === 0) continue;
    lines.push("", `## ${stage.code === stage.title ? stage.title : `${stage.code} · ${stage.title}`}`);
    for (const { roadmapModule, task } of stageNotes) {
      exported.add(task.id);
      addNote(`${roadmapModule.title}: ${task.title}`, notes[task.id]);
    }
  }

  const orphans = Object.keys(notes).filter((taskId) => !exported.has(taskId));
  if (orphans.length > 0) {
    lines.push("", "## Інші нотатки");
    for (const taskId of orphans) addNote(taskId, notes[taskId]);
  }

  return `${lines.join("\n")}\n`;
}
