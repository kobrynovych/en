"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Eraser, Headphones, Pause, Play, Square, Volume2 } from "lucide-react";
import { type SpeechSegment, useSpeech } from "@/shared/lib/use-speech";
import { Button } from "@/shared/ui/button";
import {
  buildReadingDocument,
  type ReadingSentence,
  resolveBoundaryWord,
} from "./reading-text";

const SAMPLE_TEXT = `Learning a language takes time, but every small step matters. Read a little every day and listen carefully to the sounds of English.

When you hear a new word, repeat it aloud. This simple habit can make your pronunciation clearer and your speaking more confident.`;
const READING_TEXT_STORAGE_KEY = "english-path-reading-text";

function toSpeechSegments(sentences: readonly ReadingSentence[]): SpeechSegment[] {
  return sentences.map(({ id, text }) => ({ id, text }));
}

export function ReadingTrainer() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [mounted, setMounted] = useState(false);
  const {
    speak,
    status,
    paused,
    activeSegmentId,
    progress,
    wordBoundaryReliable,
    pause,
    resume,
    stop,
    supported,
  } = useSpeech("en-US");
  const speechAvailable = mounted && supported;
  const readingDocument = useMemo(() => buildReadingDocument(text), [text]);
  const readingIndex = useMemo(() => {
    const sentences = new Map(readingDocument.sentences.map((sentence) => [sentence.id, sentence]));
    const words = new Map(
      readingDocument.sentences.flatMap((sentence) => sentence.words).map((word) => [word.id, word]),
    );
    return { sentences, words };
  }, [readingDocument]);
  const activeWordId = useMemo(() => {
    if (!activeSegmentId) return null;
    if (readingIndex.words.has(activeSegmentId)) return activeSegmentId;
    if (!progress || !wordBoundaryReliable || progress.segmentId !== activeSegmentId) return null;

    const sentence = readingIndex.sentences.get(progress.segmentId);
    if (!sentence) return null;
    return resolveBoundaryWord(sentence, progress)?.id ?? null;
  }, [activeSegmentId, progress, readingIndex, wordBoundaryReliable]);
  const wordCount = readingIndex.words.size;

  function startSentences(sentences: readonly ReadingSentence[]) {
    const segments = toSpeechSegments(sentences);
    if (segments.length > 0) speak(segments);
  }

  function updateText(nextText: string) {
    if (status !== "idle") stop();
    setText(nextText);
  }

  useEffect(() => {
    let savedText: string | null = null;
    try { savedText = localStorage.getItem(READING_TEXT_STORAGE_KEY); } catch {}
    if (savedText !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore browser-owned draft after hydration
      setText(savedText);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(READING_TEXT_STORAGE_KEY, text); } catch {}
  }, [mounted, text]);

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <header className="max-w-3xl">
        <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          <Headphones className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-black text-slate-950 sm:text-4xl dark:text-white">Читання з правильною вимовою</h1>
        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          Вставте англійський текст. Наведіть курсор або перейдіть клавішею Tab до слова, речення чи абзацу — і натисніть кнопку озвучення.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900">
        <label htmlFor="reading-text" className="text-sm font-bold text-slate-800 dark:text-slate-200">Англійський текст</label>
        <textarea
          id="reading-text"
          value={text}
          data-hydrated={mounted}
          onChange={(event) => updateText(event.target.value)}
          placeholder="Paste or type your English text here..."
          spellCheck
          className="mt-2 min-h-48 w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-base leading-7 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">{wordCount > 0 ? `${wordCount} слів` : "Текст ще не додано"}</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => updateText(SAMPLE_TEXT)}>Приклад</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => updateText("")} disabled={!text}>
              <Eraser className="size-4" aria-hidden="true" /> Очистити
            </Button>
          </div>
        </div>
      </section>

      <section aria-live="polite" className="rounded-xl border border-slate-200 bg-white p-4 sm:p-7 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Текст для читання</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Кнопки з’являються при наведенні та фокусі.</p>
          </div>
          {readingDocument.sentences.length > 0 && speechAvailable ? (
            <SpeechButton label="Озвучити весь текст" onClick={() => startSentences(readingDocument.sentences)} visible />
          ) : null}
        </div>

        {mounted && !supported ? <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">Цей браузер не підтримує синтез мовлення. Спробуйте актуальну версію Chrome, Edge або Safari.</p> : null}
        {readingDocument.paragraphs.length === 0 ? (
          <div className="grid min-h-40 place-items-center text-center text-slate-500 dark:text-slate-400">Вставте текст у поле вище, щоб почати тренування.</div>
        ) : (
          <div className="space-y-7">
            {readingDocument.paragraphs.map((paragraph) => (
              <div key={paragraph.id} className="group/paragraph relative rounded-lg border border-transparent p-3 pr-12 transition hover:border-emerald-200 hover:bg-emerald-50/40 focus-within:border-emerald-200 focus-within:bg-emerald-50/40 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20 dark:focus-within:border-emerald-900 dark:focus-within:bg-emerald-950/20">
                {speechAvailable ? (
                  <SpeechButton
                    label={`Озвучити абзац ${paragraph.index + 1}`}
                    onClick={() => startSentences(paragraph.sentences)}
                    className="absolute right-2 top-2 opacity-0 group-hover/paragraph:opacity-100 group-focus-within/paragraph:opacity-100"
                  />
                ) : null}
                <div>
                  {paragraph.sentences.map((sentence) => {
                    const sentenceActive = activeSegmentId === sentence.id && activeWordId === null;
                    return (
                      <span
                        data-sentence
                        data-sentence-id={sentence.id}
                        data-active={sentenceActive ? "true" : undefined}
                        aria-current={sentenceActive ? "true" : undefined}
                        key={sentence.id}
                        className={`group/sentence relative inline rounded px-1 py-1 text-lg leading-9 text-slate-800 transition hover:bg-sky-100/70 focus-within:bg-sky-100/70 dark:text-slate-200 dark:hover:bg-sky-950/60 dark:focus-within:bg-sky-950/60 ${sentenceActive ? "bg-sky-200 text-sky-950 dark:bg-sky-800 dark:text-white" : ""}`}
                      >
                        {sentence.tokens.map((token) => token.kind === "word" ? (() => {
                          const active = activeWordId === token.id;
                          return (
                            <span
                              data-word-id={token.id}
                              data-active={active ? "true" : undefined}
                              aria-current={active ? "true" : undefined}
                              key={token.id}
                              className={`group/word relative inline-block rounded px-0.5 transition-colors hover:bg-amber-100 focus-within:bg-amber-100 dark:hover:bg-amber-950 dark:focus-within:bg-amber-950 ${active ? "bg-emerald-200 text-emerald-950 dark:bg-emerald-700 dark:text-white" : ""}`}
                            >
                              {token.text}
                              {speechAvailable ? (
                                <SpeechButton
                                  label={`Озвучити слово ${token.text}`}
                                  onClick={() => speak([{ id: token.id, text: token.text }])}
                                  className="absolute bottom-full left-1/2 z-30 mb-1 -translate-x-1/2 opacity-0 shadow-md group-hover/word:opacity-100 group-focus-within/word:opacity-100"
                                />
                              ) : null}
                            </span>
                          );
                        })() : <span key={token.id}>{token.text}</span>)}
                        <span data-sentence-end aria-hidden="true" className="relative inline-block size-0 align-baseline">
                          {speechAvailable ? (
                            <SpeechButton
                              label={`Озвучити речення ${sentence.index + 1}`}
                              onClick={() => startSentences([sentence])}
                              className="absolute bottom-full right-0 z-20 mb-1 opacity-0 shadow-md group-hover/sentence:opacity-100 group-focus-within/sentence:opacity-100"
                            />
                          ) : null}
                        </span>{" "}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {mounted && status !== "idle" ? createPortal(
        <div role="status" aria-live="polite" className="fixed bottom-20 right-4 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:right-6 lg:bottom-6 dark:border-emerald-900 dark:bg-slate-900/95">
          <span className="hidden min-w-32 sm:block">
            <span className="block text-sm font-bold text-slate-900 dark:text-white">
              {paused ? "Читання призупинено" : status === "starting" ? "Готуємо читання" : "Текст читається"}
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {paused ? "Можна продовжити з цього місця" : status === "starting" ? "Запускаємо озвучення" : "Керуйте відтворенням"}
            </span>
          </span>
          <button type="button" onClick={paused ? resume : pause} aria-label={paused ? "Продовжити читання" : "Призупинити читання"} title={paused ? "Продовжити" : "Пауза"} className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
            {paused ? <Play className="size-4" fill="currentColor" aria-hidden="true" /> : <Pause className="size-4" fill="currentColor" aria-hidden="true" />}
          </button>
          <button type="button" onClick={stop} aria-label="Зупинити читання" title="Зупинити" className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-rose-800 dark:hover:bg-rose-950 dark:hover:text-rose-300">
            <Square className="size-4" fill="currentColor" aria-hidden="true" />
          </button>
        </div>
      , document.body) : null}
    </div>
  );
}

function SpeechButton({ label, onClick, className = "", visible = false }: { label: string; onClick: () => void; className?: string; visible?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`inline-flex size-8 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-600 hover:text-white focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-emerald-800 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white ${visible ? "" : "pointer-events-none focus:pointer-events-auto group-hover/word:pointer-events-auto group-hover/sentence:pointer-events-auto group-hover/paragraph:pointer-events-auto"} ${className}`}>
      <Volume2 className="size-4" aria-hidden="true" />
    </button>
  );
}
