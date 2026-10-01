"use client";

import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink, Sparkles, X } from "lucide-react";
import { copyText, copyTextSync } from "@/shared/lib/copy-text";
import { cn } from "@/shared/lib/cn";
import { useDismiss } from "@/shared/lib/use-dismiss";
import { AI_ASSISTANTS, buildStudyPrompt, type AiAssistantId, type AiPromptDelivery } from "./ai-study";
import type { RoadmapModule, RoadmapStage, RoadmapTask } from "./types";

const DELIVERY_HINTS: Record<AiPromptDelivery, string> = {
  send: "Відкриється з готовим запитом",
  prefill: "Запит з’явиться в полі — надішліть його",
  paste: "Вставте скопійований запит у поле",
};

const MARK_COLORS: Record<AiAssistantId, string> = {
  chatgpt: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  claude: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  gemini: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  perplexity: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
  copilot: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  grok: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
};

type CopyState = "idle" | "copied" | "failed";

/** Popovers stay below the sticky site header. */
const VIEWPORT_TOP = 80;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600";

interface AiStudyMenuProps {
  stage: RoadmapStage;
  roadmapModule: RoadmapModule;
  task: RoadmapTask;
}

/**
 * "Study with AI" disclosure for one roadmap task: opens the chosen assistant in a new tab with a
 * detailed prompt and copies the same prompt to the clipboard as a fallback.
 * Below `sm` the panel is a bottom sheet so it never overflows a narrow screen.
 */
export function AiStudyMenu({ stage, roadmapModule, task }: AiStudyMenuProps) {
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  const dismissWhenFocusLeaves = useDismiss({ open, onDismiss: close, containerRef, triggerRef });
  const prompt = useMemo(
    () => (open ? buildStudyPrompt(stage, roadmapModule, task) : ""),
    [open, stage, roadmapModule, task],
  );

  // Fit the popover into the larger free area; its content can grow when the prompt preview opens.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    function placePanel() {
      if (!panel || !containerRef.current || !window.matchMedia("(min-width: 640px)").matches) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportTop = VIEWPORT_TOP;
      const viewportBottom = Math.max(viewportTop, window.innerHeight - 8);
      const belowTop = Math.min(viewportBottom, Math.max(viewportTop, rect.bottom + 8));
      const aboveBottom = Math.max(viewportTop, Math.min(viewportBottom, rect.top - 8));
      const below = viewportBottom - belowTop;
      const above = aboveBottom - viewportTop;
      const upwards = panel.scrollHeight > below && above > below;
      const availableHeight = upwards ? above : below;
      const top = upwards ? aboveBottom - Math.min(panel.scrollHeight + 2, availableHeight) : belowTop;
      panel.style.setProperty("--ai-panel-max-height", `${availableHeight}px`);
      panel.style.setProperty("--ai-panel-top", `${top - rect.top}px`);
    }

    // Once the trigger has scrolled out of view, keep the last placement so the panel scrolls away with it
    // instead of being clamped into the viewport and floating over unrelated tasks.
    function placeOnScroll() {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && (rect.bottom < VIEWPORT_TOP || rect.top > window.innerHeight)) return;
      placePanel();
    }

    placePanel();
    const observer = new ResizeObserver(placePanel);
    observer.observe(panel);
    window.addEventListener("resize", placePanel);
    window.addEventListener("scroll", placeOnScroll, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", placePanel);
      window.removeEventListener("scroll", placeOnScroll, true);
    };
  }, [open]);

  function closeAndFocusTrigger() {
    close();
    triggerRef.current?.focus();
  }

  async function copyPrompt() {
    setCopyState((await copyText(prompt)) ? "copied" : "failed");
  }

  // The assistant's tab takes focus immediately, which can reject the async Clipboard API, so copy synchronously first.
  function copyBeforeLeaving() {
    if (copyTextSync(prompt)) setCopyState("copied");
    else void copyPrompt();
  }

  function toggle() {
    setCopyState("idle");
    setOpen((value) => !value);
  }

  return (
    <div ref={containerRef} className="relative" onBlur={dismissWhenFocusLeaves}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={`Вивчити з ШІ: ${task.title}`}
        onClick={toggle}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors",
          "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100",
          "dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-950",
          focusRing,
        )}
      >
        <Sparkles className="size-3.5" aria-hidden="true" />
        Вивчити з ШІ
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open ? (
        <>
          {/* z-45 dims the sticky header and the tab bar (z-40); the sheet itself sits at z-50. */}
          <div className="fixed inset-0 z-[45] bg-slate-950/30 sm:hidden" aria-hidden="true" onClick={closeAndFocusTrigger} />
          <div
            ref={panelRef}
            id={panelId}
            // Focusable so a click on plain text inside keeps focus within the menu instead of closing it.
            tabIndex={-1}
            className={cn(
              "fixed inset-x-3 bottom-20 z-50 max-h-[70vh] overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-2 shadow-2xl outline-none animate-fade-in",
              "sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-[var(--ai-panel-top)] sm:max-h-[var(--ai-panel-max-height)] sm:w-[22rem]",
              "dark:border-slate-700 dark:bg-slate-900",
            )}
          >
            <div className="px-2 pb-2 pt-1">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-sm font-black text-slate-950 dark:text-white">
                  <Sparkles className="size-4 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                  Вивчити з ШІ
                </p>
                <button
                  type="button"
                  aria-label="Закрити меню ШІ"
                  onClick={closeAndFocusTrigger}
                  className={cn("grid size-8 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800", focusRing)}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">{stage.code} · {task.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Відкриється нова вкладка. Запит також копіюється: вставте його з буфера, якщо сервіс не підставить текст автоматично.
              </p>
            </div>

            <ul className="space-y-0.5" aria-label="ШІ-сервіси">
              {AI_ASSISTANTS.map((assistant) => (
                <li key={assistant.id}>
                  <a
                    href={assistant.buildUrl(prompt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={copyBeforeLeaving}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2 py-1.5 text-slate-800 transition-colors hover:bg-violet-50 dark:text-slate-100 dark:hover:bg-violet-950/50",
                      focusRing,
                    )}
                  >
                    <span
                      className={cn("grid size-8 shrink-0 place-items-center rounded-md text-xs font-black", MARK_COLORS[assistant.id])}
                      aria-hidden="true"
                    >
                      {assistant.mark}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">
                        {assistant.name}
                        <span className="font-normal text-slate-500 dark:text-slate-400"> · {assistant.vendor}</span>
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">{DELIVERY_HINTS[assistant.delivery]}</span>
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <span className="sr-only"> (відкриється в новій вкладці)</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-2 space-y-2 border-t border-slate-200 px-2 pb-1 pt-2 dark:border-slate-700">
              <button
                type="button"
                onClick={() => void copyPrompt()}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800",
                  focusRing,
                )}
              >
                {copyState === "copied" ? (
                  <Check className="size-4 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )}
                {copyState === "copied" ? "Запит скопійовано" : "Скопіювати запит"}
              </button>
              <p className="sr-only" role="status">
                {copyState === "copied" ? "Запит скопійовано в буфер обміну" : copyState === "failed" ? "Не вдалося скопіювати запит" : ""}
              </p>
              {copyState === "failed" ? (
                <p className="text-xs text-rose-700 dark:text-rose-400">
                  Не вдалося скопіювати автоматично — виділіть текст запиту нижче й скопіюйте вручну.
                </p>
              ) : null}
              <details className="group" open={copyState === "failed" || undefined}>
                <summary className={cn("cursor-pointer rounded text-xs font-semibold text-violet-700 dark:text-violet-400", focusRing)}>
                  Переглянути запит
                </summary>
                <pre
                  tabIndex={0}
                  role="region"
                  aria-label="Текст запиту до ШІ"
                  className={cn("mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-2 font-sans text-xs leading-5 text-slate-700 dark:bg-slate-800 dark:text-slate-300", focusRing)}
                >
                  {prompt}
                </pre>
              </details>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
