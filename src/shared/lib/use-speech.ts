"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechStatus = "idle" | "starting" | "speaking" | "paused";

export interface SpeechSegment {
  id: string;
  text: string;
}

export interface SpeechProgress {
  segmentId: string;
  charIndex: number;
  charLength: number;
}

interface UtteranceRecord {
  utterance: SpeechSynthesisUtterance;
  segment: SpeechSegment;
  index: number;
  lastWordBoundaryIndex: number | null;
  wordBoundaryReliable: boolean;
}

interface SpeechSession {
  id: number;
  records: UtteranceRecord[];
  activeRecordIndex: number;
}

interface ActiveSpeechOwner {
  ownerId: symbol;
  sessionId: number;
  invalidate: () => void;
}

// speechSynthesis is global to the document. Coordinating ownership here keeps
// one hook instance from cancelling speech that a newer instance has started.
let activeSpeechOwner: ActiveSpeechOwner | null = null;

const STRING_SEGMENT_ID = "speech";
const SPEECH_RATE = 0.75;

function getSpeechSynthesis() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

/**
 * Session-based Web Speech API controller.
 *
 * String input remains a single utterance. Segment input is queued immediately
 * as one utterance per segment, preserving natural rhythm inside each segment.
 */
export function useSpeech(defaultLang = "en-US") {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [progress, setProgress] = useState<SpeechProgress | null>(null);
  const [wordBoundaryReliable, setWordBoundaryReliable] = useState(false);

  const ownerIdRef = useRef(Symbol("useSpeech"));
  const sessionSequenceRef = useRef(0);
  const sessionRef = useRef<SpeechSession | null>(null);
  const statusRef = useRef<SpeechStatus>("idle");
  const pauseRequestedRef = useRef(false);
  const mountedRef = useRef(true);

  const supported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  const publishStatus = useCallback((nextStatus: SpeechStatus) => {
    statusRef.current = nextStatus;
    if (mountedRef.current) setStatus(nextStatus);
  }, []);

  const clearLocalSession = useCallback(
    (sessionId: number, publish = true) => {
      if (sessionRef.current?.id !== sessionId) return;

      sessionSequenceRef.current += 1;
      sessionRef.current = null;
      pauseRequestedRef.current = false;
      statusRef.current = "idle";

      if (publish && mountedRef.current) {
        setStatus("idle");
        setActiveSegmentId(null);
        setProgress(null);
        setWordBoundaryReliable(false);
      }
    },
    [],
  );

  const ownsSession = useCallback((session: SpeechSession) => {
    return (
      sessionRef.current === session &&
      activeSpeechOwner?.ownerId === ownerIdRef.current &&
      activeSpeechOwner.sessionId === session.id
    );
  }, []);

  const terminateOwnedSession = useCallback(
    (session: SpeechSession, cancelNative: boolean) => {
      if (!ownsSession(session)) return;

      activeSpeechOwner = null;
      clearLocalSession(session.id);

      if (cancelNative) {
        const synthesis = getSpeechSynthesis();
        synthesis?.cancel();
        // cancel() does not consistently reset the global paused state.
        synthesis?.resume();
      }
    },
    [clearLocalSession, ownsSession],
  );

  const speak = useCallback(
    (input: string | readonly SpeechSegment[], lang = defaultLang) => {
      if (!supported) return;

      const segments: SpeechSegment[] = (
        typeof input === "string"
          ? [{ id: STRING_SEGMENT_ID, text: input }]
          : input
      ).filter((segment) => segment.text.trim().length > 0);

      if (segments.length === 0) return;

      // Invalidate the previous owner's callbacks and UI before cancel() can
      // synchronously dispatch events from its utterances.
      activeSpeechOwner?.invalidate();

      const sessionId = sessionSequenceRef.current + 1;
      sessionSequenceRef.current = sessionId;
      const session: SpeechSession = {
        id: sessionId,
        records: [],
        activeRecordIndex: -1,
      };

      const records = segments.map((segment, index): UtteranceRecord => {
        const utterance = new SpeechSynthesisUtterance(segment.text);
        utterance.lang = lang;
        utterance.rate = SPEECH_RATE;

        const record: UtteranceRecord = {
          utterance,
          segment,
          index,
          lastWordBoundaryIndex: null,
          wordBoundaryReliable: false,
        };

        utterance.onstart = () => {
          if (!ownsSession(session) || session.records[index] !== record) return;
          if (index < session.activeRecordIndex) return;

          session.activeRecordIndex = index;
          if (mountedRef.current) {
            setActiveSegmentId(segment.id);
            setProgress(null);
            setWordBoundaryReliable(record.wordBoundaryReliable);
          }

          if (pauseRequestedRef.current) {
            publishStatus("paused");
            // A pause click can land while the first utterance is starting.
            getSpeechSynthesis()?.pause();
          } else {
            publishStatus("speaking");
          }
        };

        utterance.onboundary = (event) => {
          if (!ownsSession(session) || session.records[index] !== record) return;
          if (session.activeRecordIndex !== index) return;
          if (pauseRequestedRef.current || statusRef.current === "paused") return;
          if (event.name !== "word") return;

          const charIndex = event.charIndex;
          if (!Number.isFinite(charIndex) || charIndex < 0) return;
          const charLength =
            Number.isFinite(event.charLength) && event.charLength > 0
              ? event.charLength
              : 0;
          if (
            record.lastWordBoundaryIndex !== null &&
            (
              charIndex < record.lastWordBoundaryIndex
              || (
                charIndex === record.lastWordBoundaryIndex
                && (record.wordBoundaryReliable || charLength === 0)
              )
            )
          ) {
            return;
          }

          const hadEarlierWordBoundary =
            record.lastWordBoundaryIndex !== null &&
            charIndex > record.lastWordBoundaryIndex;
          record.lastWordBoundaryIndex = charIndex;

          if (!record.wordBoundaryReliable) {
            if (charLength > 0 || hadEarlierWordBoundary) {
              record.wordBoundaryReliable = true;
              if (mountedRef.current) setWordBoundaryReliable(true);
            } else {
              // A lone charIndex=0 event is emitted by some engines even when
              // they do not provide meaningful word boundaries.
              return;
            }
          }

          if (mountedRef.current) {
            setProgress({ segmentId: segment.id, charIndex, charLength });
          }
        };

        utterance.onpause = () => {
          if (!ownsSession(session) || session.records[index] !== record) return;
          if (session.activeRecordIndex !== index) return;
          // Native events can arrive after a newer resume request. Only the
          // latest user intent may change the controller state.
          if (!pauseRequestedRef.current) return;
          publishStatus("paused");
        };

        utterance.onresume = () => {
          if (!ownsSession(session) || session.records[index] !== record) return;
          if (session.activeRecordIndex !== index) return;
          // Ignore a stale resume event if the user has paused again.
          if (pauseRequestedRef.current) return;
          publishStatus("speaking");
        };

        utterance.onend = () => {
          if (!ownsSession(session) || session.records[index] !== record) return;
          // Intermediate endings must not make the playlist controls disappear.
          if (index !== session.records.length - 1) return;
          terminateOwnedSession(session, false);
        };

        utterance.onerror = () => {
          if (!ownsSession(session) || session.records[index] !== record) return;
          terminateOwnedSession(session, true);
        };

        return record;
      });

      session.records = records;
      sessionRef.current = session;
      pauseRequestedRef.current = false;
      activeSpeechOwner = {
        ownerId: ownerIdRef.current,
        sessionId,
        invalidate: () => clearLocalSession(sessionId),
      };

      publishStatus("starting");
      setActiveSegmentId(null);
      setProgress(null);
      setWordBoundaryReliable(false);

      const synthesis = window.speechSynthesis;
      synthesis.cancel();
      // Reset a paused global synthesizer before adding the new playlist.
      synthesis.resume();

      for (const record of records) {
        if (!ownsSession(session)) break;
        synthesis.speak(record.utterance);
      }
    },
    [
      clearLocalSession,
      defaultLang,
      ownsSession,
      publishStatus,
      supported,
      terminateOwnedSession,
    ],
  );

  const pause = useCallback(() => {
    const session = sessionRef.current;
    if (!session || !ownsSession(session) || pauseRequestedRef.current) return;

    pauseRequestedRef.current = true;
    publishStatus("paused");
    getSpeechSynthesis()?.pause();
  }, [ownsSession, publishStatus]);

  const resume = useCallback(() => {
    const session = sessionRef.current;
    if (!session || !ownsSession(session) || statusRef.current !== "paused") return;

    pauseRequestedRef.current = false;
    getSpeechSynthesis()?.resume();
    publishStatus(session.activeRecordIndex >= 0 ? "speaking" : "starting");
  }, [ownsSession, publishStatus]);

  const stop = useCallback(() => {
    const session = sessionRef.current;
    if (!session || !ownsSession(session)) return;
    terminateOwnedSession(session, true);
  }, [ownsSession, terminateOwnedSession]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      const session = sessionRef.current;
      if (!session) return;

      const ownsActiveSpeech = ownsSession(session);
      if (ownsActiveSpeech) activeSpeechOwner = null;
      clearLocalSession(session.id, false);

      if (ownsActiveSpeech) {
        const synthesis = getSpeechSynthesis();
        synthesis?.cancel();
        synthesis?.resume();
      }
    };
  }, [clearLocalSession, ownsSession]);

  const speaking = status === "speaking";
  const paused = status === "paused";

  return {
    speak,
    status,
    speaking,
    paused,
    activeSegmentId,
    progress,
    wordBoundaryReliable,
    /** @deprecated Use progress?.charIndex instead. */
    activeCharIndex: progress?.charIndex ?? null,
    pause,
    resume,
    stop,
    supported,
  };
}
