import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSpeech } from "./use-speech";

interface BoundaryEvent {
  name: string;
  charIndex: number;
  charLength?: number;
}

class MockUtterance {
  lang = "";
  rate = 1;
  onstart: ((event: Event) => void) | null = null;
  onpause: ((event: Event) => void) | null = null;
  onresume: ((event: Event) => void) | null = null;
  onboundary: ((event: BoundaryEvent) => void) | null = null;
  onend: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(public text: string) {}
}

class SpeechSynthesisHarness {
  utterances: MockUtterance[] = [];
  queue: MockUtterance[] = [];
  paused = false;

  speak = vi.fn((utterance: MockUtterance) => {
    this.utterances.push(utterance);
    this.queue.push(utterance);
  });

  pause = vi.fn(() => {
    this.paused = true;
  });

  resume = vi.fn(() => {
    this.paused = false;
  });

  cancel = vi.fn(() => {
    this.queue = [];
    // The real API may preserve its global paused state after cancel().
  });
}

describe("useSpeech", () => {
  let synthesis: SpeechSynthesisHarness;

  beforeEach(() => {
    synthesis = new SpeechSynthesisHarness();
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockUtterance,
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: synthesis,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("queues every non-empty segment synchronously with one language and rate", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => {
      result.current.speak(
        [
          { id: "sentence-1", text: "A smooth first sentence." },
          { id: "empty", text: "   " },
          { id: "sentence-2", text: "A smooth second sentence." },
        ],
        "en-GB",
      );
    });

    expect(synthesis.cancel).toHaveBeenCalledOnce();
    expect(synthesis.resume).toHaveBeenCalledOnce();
    expect(synthesis.speak).toHaveBeenCalledTimes(2);
    expect(synthesis.utterances.map(({ text }) => text)).toEqual([
      "A smooth first sentence.",
      "A smooth second sentence.",
    ]);
    expect(synthesis.utterances.every(({ lang }) => lang === "en-GB")).toBe(true);
    expect(synthesis.utterances.every(({ rate }) => rate === 0.75)).toBe(true);
    expect(result.current.status).toBe("starting");
    expect(result.current.speaking).toBe(false);
    expect(result.current.paused).toBe(false);
    expect(result.current.activeSegmentId).toBeNull();

    const [first, second] = synthesis.utterances;
    act(() => first.onstart?.(new Event("start")));
    expect(result.current.status).toBe("speaking");
    expect(result.current.speaking).toBe(true);
    expect(result.current.activeSegmentId).toBe("sentence-1");

    act(() => first.onend?.(new Event("end")));
    expect(result.current.status).toBe("speaking");
    expect(result.current.activeSegmentId).toBe("sentence-1");

    act(() => second.onstart?.(new Event("start")));
    expect(result.current.activeSegmentId).toBe("sentence-2");

    act(() => second.onend?.(new Event("end")));
    expect(result.current.status).toBe("idle");
    expect(result.current.activeSegmentId).toBeNull();
    expect(result.current.progress).toBeNull();
  });

  it("keeps string input as one utterance with a stable internal segment id", () => {
    const { result } = renderHook(() => useSpeech("en-AU"));

    act(() => result.current.speak("Hello there."));

    expect(synthesis.utterances).toHaveLength(1);
    expect(synthesis.utterances[0]).toMatchObject({
      text: "Hello there.",
      lang: "en-AU",
      rate: 0.75,
    });
    expect(result.current.activeSegmentId).toBeNull();
    act(() => synthesis.utterances[0].onstart?.(new Event("start")));
    expect(result.current.activeSegmentId).toBe("speech");
  });

  it("publishes progress only after word boundaries prove reliable", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak([{ id: "sentence", text: "Hello smooth world" }]));
    const utterance = synthesis.utterances[0];
    act(() => utterance.onstart?.(new Event("start")));

    act(() => utterance.onboundary?.({ name: "sentence", charIndex: 0, charLength: 18 }));
    expect(result.current.wordBoundaryReliable).toBe(false);
    expect(result.current.progress).toBeNull();

    act(() => utterance.onboundary?.({ name: "word", charIndex: 0 }));
    expect(result.current.wordBoundaryReliable).toBe(false);
    expect(result.current.progress).toBeNull();

    act(() => utterance.onboundary?.({ name: "word", charIndex: 6 }));
    expect(result.current.wordBoundaryReliable).toBe(true);
    expect(result.current.progress).toEqual({
      segmentId: "sentence",
      charIndex: 6,
      charLength: 0,
    });

    act(() => utterance.onboundary?.({ name: "word", charIndex: 0, charLength: 5 }));
    expect(result.current.progress?.charIndex).toBe(6);
    expect(result.current.activeCharIndex).toBe(6);
  });

  it("trusts a positive charLength even after a duplicate zero-length boundary", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak([{ id: "sentence", text: "Hello world" }]));
    const utterance = synthesis.utterances[0];
    act(() => utterance.onstart?.(new Event("start")));
    act(() => utterance.onboundary?.({ name: "word", charIndex: 0 }));
    expect(result.current.wordBoundaryReliable).toBe(false);
    act(() => utterance.onboundary?.({ name: "word", charIndex: 0, charLength: 5 }));

    expect(result.current.wordBoundaryReliable).toBe(true);
    expect(result.current.progress).toEqual({
      segmentId: "sentence",
      charIndex: 0,
      charLength: 5,
    });
  });

  it("proves word-boundary reliability independently for each segment", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak([
      { id: "first", text: "First sentence" },
      { id: "second", text: "Second sentence" },
    ]));
    const [first, second] = synthesis.utterances;

    act(() => first.onstart?.(new Event("start")));
    act(() => first.onboundary?.({ name: "word", charIndex: 0, charLength: 5 }));
    expect(result.current.wordBoundaryReliable).toBe(true);

    act(() => second.onstart?.(new Event("start")));
    expect(result.current.wordBoundaryReliable).toBe(false);
    expect(result.current.progress).toBeNull();

    act(() => second.onboundary?.({ name: "word", charIndex: 0 }));
    expect(result.current.wordBoundaryReliable).toBe(false);
    expect(result.current.progress).toBeNull();

    act(() => second.onboundary?.({ name: "word", charIndex: 7 }));
    expect(result.current.wordBoundaryReliable).toBe(true);
    expect(result.current.progress).toEqual({
      segmentId: "second",
      charIndex: 7,
      charLength: 0,
    });
  });

  it("pauses while starting, freezes late boundaries, and resumes the same queue", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak([{ id: "sentence", text: "Hello smooth world" }]));
    const utterance = synthesis.utterances[0];
    act(() => result.current.pause());

    expect(result.current.status).toBe("paused");
    expect(synthesis.pause).toHaveBeenCalledOnce();
    expect(synthesis.cancel).toHaveBeenCalledOnce();

    act(() => utterance.onstart?.(new Event("start")));
    expect(synthesis.pause).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe("paused");

    act(() => utterance.onboundary?.({ name: "word", charIndex: 0, charLength: 5 }));
    expect(result.current.progress).toBeNull();

    act(() => result.current.resume());
    expect(synthesis.resume).toHaveBeenCalledTimes(2);
    expect(synthesis.speak).toHaveBeenCalledOnce();
    expect(result.current.status).toBe("speaking");

    act(() => utterance.onboundary?.({ name: "word", charIndex: 6, charLength: 6 }));
    expect(result.current.progress?.charIndex).toBe(6);
  });

  it("keeps existing progress fixed when a boundary arrives after pause", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak([{ id: "sentence", text: "Hello smooth world" }]));
    const utterance = synthesis.utterances[0];
    act(() => utterance.onstart?.(new Event("start")));
    act(() => utterance.onboundary?.({ name: "word", charIndex: 0, charLength: 5 }));
    act(() => result.current.pause());
    act(() => utterance.onboundary?.({ name: "word", charIndex: 6, charLength: 6 }));

    expect(result.current.progress?.charIndex).toBe(0);
    expect(result.current.status).toBe("paused");
  });

  it("ignores native pause and resume events that arrive after newer user intent", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak([{ id: "sentence", text: "Hello smooth world" }]));
    const utterance = synthesis.utterances[0];
    act(() => utterance.onstart?.(new Event("start")));

    act(() => result.current.pause());
    act(() => result.current.resume());
    act(() => utterance.onpause?.(new Event("pause")));
    expect(result.current.status).toBe("speaking");

    act(() => result.current.pause());
    act(() => utterance.onresume?.(new Event("resume")));
    expect(result.current.status).toBe("paused");

    act(() => utterance.onboundary?.({ name: "word", charIndex: 6, charLength: 6 }));
    expect(result.current.progress).toBeNull();
  });

  it("resets a native pause on stop and ignores stale events after restart", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak([{ id: "old", text: "Old sentence." }]));
    const oldUtterance = synthesis.utterances[0];
    act(() => oldUtterance.onstart?.(new Event("start")));
    act(() => result.current.pause());
    expect(synthesis.paused).toBe(true);

    act(() => result.current.stop());
    expect(synthesis.cancel).toHaveBeenCalledTimes(2);
    expect(synthesis.resume).toHaveBeenCalledTimes(2);
    expect(synthesis.paused).toBe(false);
    expect(result.current.status).toBe("idle");

    act(() => result.current.speak([{ id: "new", text: "New sentence." }]));
    const newUtterance = synthesis.utterances[1];
    act(() => {
      oldUtterance.onresume?.(new Event("resume"));
      oldUtterance.onboundary?.({ name: "word", charIndex: 4, charLength: 3 });
      oldUtterance.onend?.(new Event("end"));
    });

    expect(result.current.status).toBe("starting");
    expect(result.current.activeSegmentId).toBeNull();
    expect(result.current.progress).toBeNull();

    act(() => newUtterance.onstart?.(new Event("start")));
    expect(result.current.status).toBe("speaking");
    expect(result.current.activeSegmentId).toBe("new");
  });

  it("invalidates every callback from a replaced session", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak([{ id: "first", text: "First." }]));
    const first = synthesis.utterances[0];
    act(() => result.current.speak([{ id: "second", text: "Second." }]));
    const second = synthesis.utterances[1];

    act(() => {
      first.onstart?.(new Event("start"));
      first.onboundary?.({ name: "word", charIndex: 0, charLength: 5 });
      first.onerror?.(new Event("error"));
      first.onend?.(new Event("end"));
    });

    expect(result.current.status).toBe("starting");
    expect(result.current.activeSegmentId).toBeNull();
    expect(result.current.progress).toBeNull();

    act(() => second.onstart?.(new Event("start")));
    expect(result.current.status).toBe("speaking");
    expect(result.current.activeSegmentId).toBe("second");
  });

  it("terminates the whole owned playlist when any utterance errors", () => {
    const { result } = renderHook(() => useSpeech());

    act(() =>
      result.current.speak([
        { id: "first", text: "First." },
        { id: "second", text: "Second." },
      ]),
    );
    const [first, second] = synthesis.utterances;
    act(() => first.onstart?.(new Event("start")));
    act(() => first.onerror?.(new Event("error")));

    expect(result.current.status).toBe("idle");
    expect(result.current.activeSegmentId).toBeNull();
    expect(synthesis.cancel).toHaveBeenCalledTimes(2);
    expect(synthesis.resume).toHaveBeenCalledTimes(2);

    act(() => second.onstart?.(new Event("start")));
    expect(result.current.status).toBe("idle");
  });

  it("transfers global ownership without letting old cleanup cancel new speech", () => {
    const firstHook = renderHook(() => useSpeech());
    const secondHook = renderHook(() => useSpeech());

    act(() => firstHook.result.current.speak([{ id: "first", text: "First." }]));
    act(() => secondHook.result.current.speak([{ id: "second", text: "Second." }]));

    expect(firstHook.result.current.status).toBe("idle");
    expect(secondHook.result.current.status).toBe("starting");
    expect(synthesis.cancel).toHaveBeenCalledTimes(2);

    firstHook.unmount();
    expect(synthesis.cancel).toHaveBeenCalledTimes(2);

    secondHook.unmount();
    expect(synthesis.cancel).toHaveBeenCalledTimes(3);
    expect(synthesis.resume).toHaveBeenCalledTimes(3);
  });
});
