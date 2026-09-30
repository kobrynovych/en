"use client";

import { useSyncExternalStore } from "react";
import { ROADMAP_STORAGE_KEY } from "./progress";
import { createRoadmapProgressStore } from "./progress-store";

const roadmapProgressStore = createRoadmapProgressStore(ROADMAP_STORAGE_KEY);

const subscribeToNothing = () => () => {};

/**
 * Roadmap checklist state persisted in localStorage.
 * The server render and hydration use empty progress; `hydrated` turns true once the
 * browser-owned progress is shown, which avoids hydration mismatches without effects.
 */
export function useRoadmapProgress() {
  const completed = useSyncExternalStore(
    roadmapProgressStore.subscribe,
    roadmapProgressStore.getSnapshot,
    roadmapProgressStore.getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false);

  return {
    completed,
    hydrated,
    toggle: roadmapProgressStore.toggle,
    clear: roadmapProgressStore.clear,
  };
}
