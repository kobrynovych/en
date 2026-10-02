export interface LocalStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  /** Replaces the state. Returns false when it could not be written to localStorage (it is kept in memory). */
  set: (next: T) => boolean;
  /** Applies a change; returning the same value from `recipe` is a no-op. */
  update: (recipe: (current: T) => T) => boolean;
}

interface LocalStoreOptions<T> {
  key: string;
  empty: T;
  parse: (raw: string | null) => T;
  serialize: (value: T) => string;
  isEmpty: (value: T) => boolean;
}

/**
 * External store for `useSyncExternalStore`: memory is the source of truth for rendering,
 * localStorage is the persistence layer, and the `storage` event keeps other tabs in sync.
 * If storage is unavailable (private mode, blocked site data, full quota) the data still works for the session.
 */
export function createLocalStore<T>({ key, empty, parse, serialize, isEmpty }: LocalStoreOptions<T>): LocalStore<T> {
  let state: T | undefined;
  const listeners = new Set<() => void>();

  function readStorage() {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function load() {
    if (state === undefined) state = parse(readStorage());
    return state;
  }

  function emit() {
    for (const listener of listeners) listener();
  }

  function set(next: T) {
    state = next;
    let persisted = true;
    try {
      if (isEmpty(next)) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, serialize(next));
    } catch {
      persisted = false;
    }
    emit();
    return persisted;
  }

  function handleStorage(event: StorageEvent) {
    // key === null means another tab cleared the whole storage.
    if (event.key !== null && event.key !== key) return;
    state = parse(event.key === null ? readStorage() : event.newValue);
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
    getServerSnapshot: () => empty,
    set,
    update(recipe) {
      const current = load();
      const next = recipe(current);
      return next === current ? true : set(next);
    },
  };
}
