"use client";

import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink, Sparkles } from "lucide-react";
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

  // On wider screens the panel is a popover under the trigger; open it upwards when there is no room below.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    delete panel.dataset.side;
    const rect = panel.getBoundingClientRect();
    const triggerTop = triggerRef.current?.getBoundingClientRect().top ?? 0;
    if (rect.bottom > window.innerHeight - 8 && triggerTop - rect.height > 80) panel.dataset.side = "top";
  }, [open]);

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
          <div className="fixed inset-0 z-[45] bg-slate-950/30 sm:hidden" aria-hidden="true" onClick={close} />
          <div
            ref={panelRef}
            id={panelId}
            className={cn(
              "fixed inset-x-3 bottom-20 z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-2xl animate-fade-in",
              "sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:mt-2 sm:max-h-none sm:w-[22rem]",
              "sm:data-[side=top]:top-auto sm:data-[side=top]:bottom-full sm:data-[side=top]:mb-2 sm:data-[side=top]:mt-0",
              "dark:border-slate-700 dark:bg-slate-900",
            )}
          >
            <div className="px-2 pb-2 pt-1">
              <p className="flex items-center gap-1.5 text-sm font-black text-slate-950 dark:text-white">
                <Sparkles className="size-4 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                Вивчити з ШІ
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Нова вкладка з детальним запитом про цей пункт: пояснення, приклади, вправи й тренування. Запит також
                копіюється в буфер обміну.
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
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-2 font-sans text-xs leading-5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
