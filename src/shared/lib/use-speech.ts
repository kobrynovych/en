"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook that exposes a `speak(text)` function backed by the Web Speech API.
 * Returns `{ speak, speaking, supported }`.
 *
 * - `speak(text, lang?)` – cancels any current utterance and speaks `text`.
 * - `speaking` – true while the utterance is being played.
 * - `supported` – false in environments where speechSynthesis is unavailable
 *   (SSR, some older browsers).
 */
export function useSpeech(defaultLang = "en-US") {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up on unmount.
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = useCallback(
    (text: string, lang = defaultLang) => {
      if (!supported) return;

      // Cancel previous utterance before starting a new one.
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.75; // slower for learner clarity

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [defaultLang, supported],
  );

  return { speak, speaking, supported };
}
