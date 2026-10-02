"use client";

import { useSyncExternalStore } from "react";
import { ROADMAP_NOTES_STORAGE_KEY } from "./notes";
import { createRoadmapNotesStore } from "./notes-store";

const roadmapNotesStore = createRoadmapNotesStore(ROADMAP_NOTES_STORAGE_KEY);

/** The learner's per-task notes, persisted in localStorage and synced between tabs. */
export function useRoadmapNotes() {
  const notes = useSyncExternalStore(
    roadmapNotesStore.subscribe,
    roadmapNotesStore.getSnapshot,
    roadmapNotesStore.getServerSnapshot,
  );
  return { notes, setNote: roadmapNotesStore.setNote };
}
