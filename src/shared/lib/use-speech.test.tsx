import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSpeech } from "./use-speech";

class MockUtterance {
  lang = "";
  rate = 1;
  onstart: ((event: Event) => void) | null = null;
  onpause: ((event: Event) => void) | null = null;
  onresume: ((event: Event) => void) | null = null;
  onboundary: ((event: { name: string; charIndex: number }) => void) | null = null;
  onend: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(public text: string) {}
}

describe("useSpeech", () => {
  const pause = vi.fn();
  const resume = vi.fn();
  const cancel = vi.fn();
  let utterance: MockUtterance | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    utterance = null;
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: MockUtterance });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speaking: false,
        paused: false,
        cancel,
        pause,
        resume,
        speak: vi.fn((nextUtterance: MockUtterance) => { utterance = nextUtterance; }),
      },
    });
  });

  it("resumes the active utterance even when the native paused flag is stale", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak("Hello"));
    act(() => utterance?.onstart?.(new Event("start")));
    act(() => result.current.pause());
    act(() => utterance?.onpause?.(new Event("pause")));
    act(() => result.current.resume());

    expect(pause).toHaveBeenCalledOnce();
    expect(resume).toHaveBeenCalledOnce();
    expect(result.current.paused).toBe(false);
    expect(result.current.speaking).toBe(true);
  });

  it("uses the browser word-boundary position for the active highlight", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak("Hello world"));
    act(() => utterance?.onstart?.(new Event("start")));
    expect(result.current.activeCharIndex).toBe(0);

    act(() => utterance?.onboundary?.({ name: "word", charIndex: 6 }));

    expect(result.current.activeCharIndex).toBe(6);
  });

  it("honours a pause click that lands while speech is starting", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => result.current.speak("Hello"));
    act(() => result.current.pause());
    act(() => utterance?.onstart?.(new Event("start")));

    expect(pause).toHaveBeenCalledTimes(2);
    expect(result.current.paused).toBe(true);
  });
});
