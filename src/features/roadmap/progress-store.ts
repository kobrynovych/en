import { parseStoredProgress, serializeProgress, toggleTask, type CompletedTasks } from "./progress";

export interface RoadmapProgressStore {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => CompletedTasks;
  getServerSnapshot: () => CompletedTasks;
  toggle: (taskId: string) => void;
  clear: () => void;
}

const EMPTY_PROGRESS: CompletedTasks = Object.freeze({});

/**
 * External store for `useSyncExternalStore`: memory is the source of truth for rendering,
 * localStorage is the persistence layer, and the `storage` event keeps other tabs in sync.
 * If storage is unavailable (private mode, blocked site data) progress still works for the session.
 */
export function createRoadmapProgressStore(storageKey: string): RoadmapProgressStore {
  let state: CompletedTasks | null = null;
  const listeners = new Set<() => void>();

  function readStorage() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function load() {
    state ??= parseStoredProgress(readStorage());
    return state;
  }

  function emit() {
    for (const listener of listeners) listener();
  }

  function commit(next: CompletedTasks) {
    state = next;
    try {
      if (Object.keys(next).length === 0) window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, serializeProgress(next));
    } catch {
      // Keep the in-memory state so the page still reacts even when storage is blocked.
    }
    emit();
  }

  function handleStorage(event: StorageEvent) {
    // key === null means another tab cleared the whole storage.
    if (event.key !== null && event.key !== storageKey) return;
    state = parseStoredProgress(event.key === null ? readStorage() : event.newValue);
    emit();
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", handleStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
      };
    },
    getSnapshot: load,
    getServerSnapshot: () => EMPTY_PROGRESS,
    toggle: (taskId) => commit(toggleTask(load(), taskId)),
    clear: () => commit({}),
  };
}
