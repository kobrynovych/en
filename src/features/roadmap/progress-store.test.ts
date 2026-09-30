import { afterEach, describe, expect, it, vi } from "vitest";
import { serializeProgress } from "./progress";
import { createRoadmapProgressStore } from "./progress-store";

const KEY = "roadmap-progress-test";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("createRoadmapProgressStore", () => {
  it("reads saved progress lazily and returns a stable snapshot", () => {
    localStorage.setItem(KEY, serializeProgress({ "a1-one": "2026-09-30T10:00:00.000Z" }));
    const store = createRoadmapProgressStore(KEY);

    const snapshot = store.getSnapshot();
    expect(snapshot).toEqual({ "a1-one": "2026-09-30T10:00:00.000Z" });
    expect(store.getSnapshot()).toBe(snapshot);
    expect(store.getServerSnapshot()).toEqual({});
  });

  it("persists toggles and notifies subscribers", () => {
    const store = createRoadmapProgressStore(KEY);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.toggle("a1-one");
    expect(listener).toHaveBeenCalledTimes(1);
    expect(Object.keys(store.getSnapshot())).toEqual(["a1-one"]);
    expect(JSON.parse(localStorage.getItem(KEY) ?? "{}").completed).toHaveProperty("a1-one");

    store.toggle("a1-one");
    expect(store.getSnapshot()).toEqual({});
    expect(localStorage.getItem(KEY)).toBeNull();

    unsubscribe();
    store.toggle("a1-two");
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("clears all progress", () => {
    const store = createRoadmapProgressStore(KEY);
    store.toggle("a1-one");
    store.toggle("a1-two");

    store.clear();
    expect(store.getSnapshot()).toEqual({});
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("syncs changes made in another tab", () => {
    const store = createRoadmapProgressStore(KEY);
    const listener = vi.fn();
    store.subscribe(listener);

    const newValue = serializeProgress({ "b1-one": "2026-09-30T10:00:00.000Z" });
    window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue }));
    expect(store.getSnapshot()).toEqual({ "b1-one": "2026-09-30T10:00:00.000Z" });

    window.dispatchEvent(new StorageEvent("storage", { key: "unrelated", newValue: "x" }));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps working in memory when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    const store = createRoadmapProgressStore(KEY);

    expect(store.getSnapshot()).toEqual({});
    store.toggle("a1-one");
    expect(Object.keys(store.getSnapshot())).toEqual(["a1-one"]);
  });
});
