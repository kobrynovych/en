import { createLocalStore } from "./local-store";
import { parseStoredNotes, serializeNotes, setTaskNote, type TaskNotes } from "./notes";

export interface RoadmapNotesStore {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => TaskNotes;
  getServerSnapshot: () => TaskNotes;
  /** Returns false when the note could not be written to localStorage (it stays in memory for this tab). */
  setNote: (taskId: string, text: string) => boolean;
}

const EMPTY_NOTES: TaskNotes = Object.freeze({});

export function createRoadmapNotesStore(storageKey: string): RoadmapNotesStore {
  const store = createLocalStore<TaskNotes>({
    key: storageKey,
    empty: EMPTY_NOTES,
    parse: parseStoredNotes,
    serialize: serializeNotes,
    isEmpty: (notes) => Object.keys(notes).length === 0,
  });

  return {
    subscribe: store.subscribe,
    getSnapshot: store.getSnapshot,
    getServerSnapshot: store.getServerSnapshot,
    setNote: (taskId, text) => store.update((notes) => setTaskNote(notes, taskId, text)),
  };
}
