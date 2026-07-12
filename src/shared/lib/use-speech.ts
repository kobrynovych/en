"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Web Speech API controller.
 *
 * A single utterance preserves the voice's natural rhythm and intonation.
 * When the browser provides word-boundary events, charIndex tracks the word
 * that is actually being spoken.
 */
export function useSpeech(defaultLang = "en-US") {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sessionRef = useRef(0);
  const pauseRequestedRef = useRef(false);

  const stop = useCallback(() => {
    if (!supported) return;
    sessionRef.current += 1;
    pauseRequestedRef.current = false;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
    setPaused(false);
    setActiveCharIndex(null);
  }, [supported]);

  useEffect(() => {
    return () => {
      sessionRef.current += 1;
      pauseRequestedRef.current = false;
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  const speak = useCallback(
    (text: string, lang = defaultLang) => {
      if (!supported || !text.trim()) return;

      sessionRef.current += 1;
      const session = sessionRef.current;
      pauseRequestedRef.current = false;
      utteranceRef.current = null;
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
      setActiveCharIndex(null);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.75;
      utterance.onstart = () => {
        if (sessionRef.current !== session) return;
        setSpeaking(true);
        setPaused(false);
        setActiveCharIndex(0);
        // Honour a pause click that arrived while the new utterance started.
        if (pauseRequestedRef.current) {
          setPaused(true);
          window.speechSynthesis.pause();
        }
      };
      utterance.onboundary = (event) => {
        if (sessionRef.current !== session) return;
        setActiveCharIndex(event.charIndex);
        // A boundary can follow immediately after a pause click in Chromium.
        if (pauseRequestedRef.current) {
          setPaused(true);
          window.speechSynthesis.pause();
        }
      };
      utterance.onpause = () => {
        if (sessionRef.current === session) setPaused(true);
      };
      utterance.onresume = () => {
        if (sessionRef.current === session) {
          setSpeaking(true);
          setPaused(false);
        }
      };
      utterance.onend = () => {
        if (sessionRef.current !== session) return;
        utteranceRef.current = null;
        pauseRequestedRef.current = false;
        setSpeaking(false);
        setPaused(false);
        setActiveCharIndex(null);
      };
      utterance.onerror = () => {
        if (sessionRef.current !== session) return;
        utteranceRef.current = null;
        pauseRequestedRef.current = false;
        setSpeaking(false);
        setPaused(false);
        setActiveCharIndex(null);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [defaultLang, supported],
  );

  const pause = useCallback(() => {
    if (!supported || !utteranceRef.current || pauseRequestedRef.current) return;
    // Keep the intent separately because browser flags can lag during start.
    pauseRequestedRef.current = true;
    setPaused(true);
    window.speechSynthesis.pause();
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported || !utteranceRef.current) return;
    pauseRequestedRef.current = false;
    // Calling resume is safe even when Chromium has not updated its paused flag.
    window.speechSynthesis.resume();
    setPaused(false);
    setSpeaking(true);
  }, [supported]);

  return { speak, speaking, paused, activeCharIndex, pause, resume, stop, supported };
}
