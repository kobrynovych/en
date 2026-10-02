import { afterEach, describe, expect, it, vi } from "vitest";
import { serializeNotes } from "./notes";
import { createRoadmapNotesStore } from "./notes-store";

const KEY = "roadmap-notes-test";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("createRoadmapNotesStore", () => {
  it("saves, updates and deletes notes in localStorage", () => {
    const store = createRoadmapNotesStore(KEY);
    const listener = vi.fn();
    store.subscribe(listener);

    expect(store.setNote("a1-be", "first")).toBe(true);
    expect(store.getSnapshot()["a1-be"].text).toBe("first");
    expect(JSON.parse(localStorage.getItem(KEY) ?? "{}")).toMatchObject({
      version: 1,
      notes: { "a1-be": { text: "first" } },
    });

    store.setNote("a1-be", "second");
    expect(store.getSnapshot()["a1-be"].text).toBe("second");

    store.setNote("a1-be", "");
    expect(store.getSnapshot()).toEqual({});
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("does not write or notify when the text is unchanged", () => {
    const store = createRoadmapNotesStore(KEY);
    store.setNote("a1-be", "same");
    const listener = vi.fn();
    store.subscribe(listener);

    expect(store.setNote("a1-be", "same")).toBe(true);
    expect(listener).not.toHaveBeenCalled();
  });

  it("reports when the browser refuses to store the note", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    const store = createRoadmapNotesStore(KEY);

    expect(store.setNote("a1-be", "text")).toBe(false);
    expect(store.getSnapshot()["a1-be"].text).toBe("text");
  });

  it("picks up notes written in another tab", () => {
    const store = createRoadmapNotesStore(KEY);
    store.subscribe(() => {});
    const newValue = serializeNotes({ "b1-one": { text: "from another tab", updatedAt: "" } });

    window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue }));
    expect(store.getSnapshot()["b1-one"].text).toBe("from another tab");
  });
});
