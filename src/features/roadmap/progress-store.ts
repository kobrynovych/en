import { createLocalStore } from "./local-store";
import { parseStoredProgress, serializeProgress, toggleTask, type CompletedTasks } from "./progress";

export interface RoadmapProgressStore {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => CompletedTasks;
  getServerSnapshot: () => CompletedTasks;
  toggle: (taskId: string) => void;
  clear: () => void;
}

const EMPTY_PROGRESS: CompletedTasks = Object.freeze({});

/** Checklist progress persisted in localStorage; see `createLocalStore` for the storage rules. */
export function createRoadmapProgressStore(storageKey: string): RoadmapProgressStore {
  const store = createLocalStore<CompletedTasks>({
    key: storageKey,
    empty: EMPTY_PROGRESS,
    parse: parseStoredProgress,
    serialize: serializeProgress,
    isEmpty: (completed) => Object.keys(completed).length === 0,
  });

  return {
    subscribe: store.subscribe,
    getSnapshot: store.getSnapshot,
    getServerSnapshot: store.getServerSnapshot,
    toggle: (taskId) => {
      store.update((completed) => toggleTask(completed, taskId));
    },
    clear: () => {
      store.set(EMPTY_PROGRESS);
    },
  };
}
