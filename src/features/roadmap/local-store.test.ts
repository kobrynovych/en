import { afterEach, describe, expect, it, vi } from "vitest";
import { createLocalStore } from "./local-store";

const KEY = "local-store-test";

function createStore() {
  return createLocalStore<string[]>({
    key: KEY,
    empty: [],
    parse: (raw) => (raw ? (JSON.parse(raw) as string[]) : []),
    serialize: (value) => JSON.stringify(value),
    isEmpty: (value) => value.length === 0,
  });
}

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("createLocalStore", () => {
  it("reads storage lazily and keeps a stable snapshot", () => {
    localStorage.setItem(KEY, JSON.stringify(["a"]));
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    const store = createStore();
    expect(getItem).not.toHaveBeenCalled();

    const snapshot = store.getSnapshot();
    expect(snapshot).toEqual(["a"]);
    expect(store.getSnapshot()).toBe(snapshot);
    expect(getItem).toHaveBeenCalledTimes(1);
    expect(store.getServerSnapshot()).toEqual([]);
  });

  it("persists changes, removes the key for empty values and notifies subscribers", () => {
    const store = createStore();
    const listener = vi.fn();
    store.subscribe(listener);

    expect(store.set(["a", "b"])).toBe(true);
    expect(localStorage.getItem(KEY)).toBe('["a","b"]');
    expect(listener).toHaveBeenCalledTimes(1);

    expect(store.set([])).toBe(true);
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("treats an update that returns the same value as a no-op", () => {
    const store = createStore();
    const listener = vi.fn();
    store.subscribe(listener);
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    expect(store.update((current) => current)).toBe(true);
    expect(listener).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();

    expect(store.update((current) => [...current, "c"])).toBe(true);
    expect(store.getSnapshot()).toEqual(["c"]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps the value in memory and reports failure when storage rejects the write", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    const store = createStore();
    const listener = vi.fn();
    store.subscribe(listener);

    expect(store.set(["a"])).toBe(false);
    expect(store.getSnapshot()).toEqual(["a"]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("follows changes from other tabs and ignores unrelated keys", () => {
    const store = createStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: '["x"]' }));
    expect(store.getSnapshot()).toEqual(["x"]);

    window.dispatchEvent(new StorageEvent("storage", { key: "other", newValue: "[]" }));
    expect(listener).toHaveBeenCalledTimes(1);

    // key === null: another tab cleared the whole storage.
    window.dispatchEvent(new StorageEvent("storage", { key: null }));
    expect(store.getSnapshot()).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: '["y"]' }));
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
