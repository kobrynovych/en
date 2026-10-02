"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { StickyNote, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { Highlight } from "./highlight";
import { NOTE_MAX_LENGTH, type TaskNote } from "./notes";

type SaveStatus = "idle" | "pending" | "saved" | "error";

const SAVE_DELAY_MS = 700;

const STATUS_TEXT: Record<SaveStatus, string> = {
  idle: "Зберігається автоматично в цьому браузері",
  pending: "Зберігаю…",
  saved: "Збережено",
  error: "Не вдалося зберегти в браузері — нотатка доступна лише до закриття вкладки",
};

const PLACEHOLDER = "Мої приклади: …\nПомилка → як правильно: …\nПитання до викладача чи ШІ: …";

interface TaskNoteEditorProps {
  id: string;
  taskTitle: string;
  initialText: string;
  /** Persists the text; returns false if it could not be written to localStorage. */
  onSave: (text: string) => boolean;
  onDone: () => void;
  onDelete: (text: string) => void;
}

/** Inline note editor with debounced autosave; pending text is flushed on blur, close and unmount. */
export function TaskNoteEditor({ id, taskTitle, initialText, onSave, onDone, onDelete }: TaskNoteEditorProps) {
  const [draft, setDraft] = useState(initialText);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const draftRef = useRef(initialText);
  const savedRef = useRef(initialText);
  const timerRef = useRef<number | undefined>(undefined);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea?.focus();
    textarea?.setSelectionRange(textarea.value.length, textarea.value.length);
  }, []);

  function flush() {
    window.clearTimeout(timerRef.current);
    if (draftRef.current === savedRef.current) return;
    savedRef.current = draftRef.current;
    setStatus(onSaveRef.current(draftRef.current) ? "saved" : "error");
  }

  // Never lose the last keystrokes when the editor unmounts (closing, filtering, leaving the page).
  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
      if (draftRef.current !== savedRef.current) onSaveRef.current(draftRef.current);
    },
    [],
  );

  function change(value: string) {
    setDraft(value);
    draftRef.current = value;
    setStatus("pending");
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(flush, SAVE_DELAY_MS);
  }

  function done() {
    flush();
    onDone();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape" || (event.key === "Enter" && (event.ctrlKey || event.metaKey))) {
      event.preventDefault();
      done();
    }
  }

  const statusId = `${id}-status`;
  const counterId = `${id}-counter`;
  const nearLimit = draft.length >= NOTE_MAX_LENGTH * 0.9;

  return (
    <div id={id} className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/60 dark:bg-amber-950/20">
      <label htmlFor={`${id}-text`} className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
        <StickyNote className="size-3.5" aria-hidden="true" />
        Нотатка до пункту «{taskTitle}»
      </label>
      <textarea
        ref={textareaRef}
        id={`${id}-text`}
        value={draft}
        onChange={(event) => change(event.target.value)}
        onBlur={flush}
        onKeyDown={handleKeyDown}
        maxLength={NOTE_MAX_LENGTH}
        rows={4}
        placeholder={PLACEHOLDER}
        aria-describedby={`${statusId} ${counterId}`}
        className="mt-2 min-h-24 w-full resize-y rounded-md border border-amber-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-amber-900 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
      />
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Not a live region: "saving… saved" after every pause would interrupt screen reader users; failures are alerts. */}
        {status === "error" ? (
          <span id={statusId} role="alert" className="font-semibold text-rose-700 dark:text-rose-400">
            {STATUS_TEXT.error}
          </span>
        ) : (
          <span id={statusId} className="text-slate-600 dark:text-slate-400">
            {STATUS_TEXT[status]}
          </span>
        )}
        <span
          id={counterId}
          className={cn("tabular-nums", nearLimit ? "font-semibold text-amber-800 dark:text-amber-300" : "text-slate-500 dark:text-slate-400")}
        >
          {draft.length} / {NOTE_MAX_LENGTH}
          <span className="sr-only"> символів</span>
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" onClick={done}>
          Готово
        </Button>
        {draft.trim() ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              window.clearTimeout(timerRef.current);
              draftRef.current = savedRef.current = "";
              onDelete(draft);
            }}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Видалити нотатку
          </Button>
        ) : null}
        <span className="ml-auto hidden text-xs text-slate-500 sm:inline dark:text-slate-400">Esc або Ctrl/⌘+Enter — закрити</span>
      </div>
    </div>
  );
}

const PREVIEW_LIMIT = 280;

/** The saved note under a task; long notes are clamped unless a search is highlighting them. */
export function TaskNotePreview({ note, terms }: { note: TaskNote; terms?: readonly string[] }) {
  const [expanded, setExpanded] = useState(false);
  const long = note.text.length > PREVIEW_LIMIT || note.text.split("\n").length > 4;
  const clamped = long && !expanded && !terms?.length;
  const updated = formatShortDate(note.updatedAt);

  return (
    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2 dark:border-amber-900/60 dark:bg-amber-950/20">
      <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
        <StickyNote className="size-3.5" aria-hidden="true" />
        Моя нотатка
        {updated ? <span className="font-normal text-amber-800 dark:text-amber-300">· {updated}</span> : null}
      </p>
      <p className={cn("mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800 dark:text-slate-200", clamped && "line-clamp-4")}>
        <Highlight text={note.text} terms={terms} />
      </p>
      {long && !terms?.length ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-1 rounded text-xs font-semibold text-amber-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-300"
        >
          {expanded ? "Згорнути" : "Показати повністю"}
        </button>
      ) : null}
    </div>
  );
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
