"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, BookOpenCheck, Eye, EyeOff, Lightbulb, PartyPopper, RotateCcw, Route } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { cn } from "@/shared/lib/cn";
import {
  findNextTask,
  getStageStatus,
  getStageTasks,
  summarizeRoadmap,
  summarizeStage,
  type TaskLocation,
} from "./progress";
import { ResourceList, STAGE_ACCENTS, StageSection, stageHeading } from "./roadmap-stage";
import type { RoadmapResource, RoadmapStage, RoadmapStageId } from "./types";
import { useRoadmapProgress } from "./use-roadmap-progress";

interface RoadmapClientProps {
  stages: RoadmapStage[];
  principles: Array<{ title: string; text: string }>;
  routine: Array<{ minutes: number; activity: string }>;
  sources: RoadmapResource[];
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export function RoadmapClient({ stages, principles, routine, sources }: RoadmapClientProps) {
  const { completed, hydrated, toggle, clear } = useRoadmapProgress();
  // null until the saved progress is known; then the learner's current stage is opened once.
  const [expanded, setExpanded] = useState<ReadonlySet<RoadmapStageId> | null>(null);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const stageListRef = useRef<HTMLOListElement>(null);

  const summary = useMemo(() => summarizeRoadmap(stages, completed), [stages, completed]);
  const nextTask = useMemo(() => findNextTask(stages, completed), [stages, completed]);
  const taskCount = useMemo(() => stages.reduce((sum, stage) => sum + getStageTasks(stage).length, 0), [stages]);
  const currentStageId = nextTask?.stage.id ?? stages[stages.length - 1].id;
  const expandedStages = expanded ?? new Set<RoadmapStageId>([stages[0].id]);

  useEffect(() => {
    if (!hydrated || expanded !== null) return;
    const linkedStage = stages.find((stage) => window.location.hash === `#stage-${stage.id}`);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- open the current (or linked) stage once saved progress is restored
    setExpanded(new Set([linkedStage?.id ?? currentStageId]));
  }, [hydrated, expanded, stages, currentStageId]);

  // On narrow screens the stage list scrolls horizontally: keep the current stage in view.
  useEffect(() => {
    const list = stageListRef.current;
    const current = list?.querySelector<HTMLElement>("[aria-current='step']");
    if (!hydrated || !list || !current || list.scrollWidth <= list.clientWidth) return;
    list.scrollLeft += current.getBoundingClientRect().left - list.getBoundingClientRect().left - 16;
  }, [hydrated, currentStageId]);

  function toggleStage(stageId: RoadmapStageId) {
    setExpanded((previous) => {
      const next = new Set(previous ?? expandedStages);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  }

  function openStage(stageId: RoadmapStageId) {
    flushSync(() => setExpanded((previous) => new Set(previous ?? expandedStages).add(stageId)));
  }

  function goToStage(stageId: RoadmapStageId) {
    openStage(stageId);
    document.getElementById(`stage-${stageId}`)?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  function goToTask(location: TaskLocation) {
    openStage(location.stage.id);
    const element = document.getElementById(`task-${location.task.id}`);
    if (!element) return;
    element.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
    element.querySelector<HTMLInputElement>("input[type='checkbox']")?.focus({ preventScroll: true });
  }

  function setAllExpanded(open: boolean) {
    setExpanded(new Set(open ? stages.map((stage) => stage.id) : []));
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-0" data-hydrated={hydrated}>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2">
          <Badge variant="emerald">CEFR</Badge>
          <Badge variant="sky">Від нуля до B2</Badge>
          <Badge variant="amber">≈ 500–600 навчальних годин</Badge>
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl dark:text-white">
          Дорожня карта англійської: від нуля до B2
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Покроковий план за міжнародною шкалою CEFR: для кожного рівня — цілі, граматика, лексика, вимова, чотири мовні
          навички, типові помилки й контрольні точки. Відмічайте виконані пункти: прогрес зберігається в цьому браузері.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span>Загальний прогрес</span>
              <span>
                {summary.done} з {summary.total} · <span className="font-black text-slate-950 dark:text-white">{summary.percent}%</span>
              </span>
            </div>
            <Progress value={summary.percent} label="Загальний прогрес дорожньої карти" />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {nextTask ? (
                <>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Наступний крок:</span>{" "}
                  {stageHeading(nextTask.stage)} → {nextTask.module.title} → {nextTask.task.title}
                </>
              ) : (
                <span className="inline-flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                  <PartyPopper className="size-4" aria-hidden="true" />
                  Усі обов’язкові пункти виконано — вітаємо з рівнем B2!
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {nextTask ? (
              <Button type="button" onClick={() => goToTask(nextTask)}>
                Продовжити
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              aria-pressed={hideCompleted}
              onClick={() => setHideCompleted((value) => !value)}
            >
              {hideCompleted ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
              {hideCompleted ? "Показати виконані" : "Сховати виконані"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setResetOpen(true)} disabled={Object.keys(completed).length === 0}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Скинути прогрес
            </Button>
          </div>
        </div>
      </section>

      <details className="group rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:px-6 [&::-webkit-details-marker]:hidden">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
            <Lightbulb className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-black text-slate-950 dark:text-white">Як працювати з картою</span>
            <span className="block text-sm text-slate-600 dark:text-slate-400">Принципи ефективного навчання та щоденна рутина на 60 хвилин</span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" aria-hidden="true" />
        </summary>
        <div className="grid gap-6 border-t border-slate-200 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] dark:border-slate-700">
          <ol className="space-y-3">
            {principles.map((principle, index) => (
              <li key={principle.title} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-sm font-black text-white">
                  {index + 1}
                </span>
                <span className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-950 dark:text-white">{principle.title}.</span> {principle.text}
                </span>
              </li>
            ))}
          </ol>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
            <p className="font-bold text-slate-950 dark:text-white">Щоденна рутина (60 хв)</p>
            <ul className="mt-3 space-y-2">
              {routine.map((step) => (
                <li key={step.activity} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-12 shrink-0 font-black tabular-nums text-emerald-700 dark:text-emerald-400">{step.minutes} хв</span>
                  {step.activity}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Мало часу? Скоротіть кожен блок удвічі, але займайтеся щодня.
            </p>
          </div>
        </div>
      </details>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start" aria-label="Етапи дорожньої карти">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <Route className="size-4" aria-hidden="true" />
              Етапи
            </h2>
            <div className="flex gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAllExpanded(true)}
                className="rounded px-1.5 py-1 text-emerald-700 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
              >
                Розгорнути все
              </button>
              <button
                type="button"
                onClick={() => setAllExpanded(false)}
                className="rounded px-1.5 py-1 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Згорнути
              </button>
            </div>
          </div>
          <ol
            ref={stageListRef}
            className="-mx-4 mt-3 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-2 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {stages.map((stage) => {
              const stageSummary = summarizeStage(stage, completed);
              const status = getStageStatus(stageSummary);
              const isCurrent = hydrated && stage.id === currentStageId && nextTask !== null;
              return (
                <li key={stage.id} className="w-44 shrink-0 snap-start lg:w-auto">
                  <a
                    href={`#stage-${stage.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      goToStage(stage.id);
                    }}
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "block rounded-lg border bg-white p-3 transition hover:border-emerald-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:bg-slate-900 dark:hover:border-emerald-800",
                      isCurrent ? "border-emerald-400 ring-1 ring-emerald-400 dark:border-emerald-700 dark:ring-emerald-700" : "border-slate-200 dark:border-slate-700",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "grid h-8 min-w-8 shrink-0 place-items-center rounded-md px-1.5 text-xs font-black",
                          STAGE_ACCENTS[stage.id],
                        )}
                      >
                        {stage.code}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-slate-950 dark:text-white">{stage.title}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          {isCurrent ? "Ви тут" : status === "done" ? "Завершено" : `${stage.totalHours} від нуля`}
                        </span>
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Progress value={stageSummary.percent} label={`Прогрес етапу ${stage.code}`} className="h-1.5" />
                      <span className="w-9 shrink-0 text-right text-xs font-bold tabular-nums text-slate-600 dark:text-slate-300">
                        {stageSummary.percent}%
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 hidden text-xs leading-5 text-slate-500 lg:block dark:text-slate-400">
            {taskCount} пунктів, з них опційні не впливають на відсоток. Години — орієнтир Cambridge English для навчання з
            викладачем; самостійно може знадобитися більше.
          </p>
        </aside>

        <div className="min-w-0 space-y-4">
          {stages.map((stage) => (
            <StageSection
              key={stage.id}
              stage={stage}
              completed={completed}
              expanded={expandedStages.has(stage.id)}
              hideCompleted={hideCompleted}
              onToggleExpanded={toggleStage}
              onToggleTask={toggle}
            />
          ))}

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
                <BookOpenCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">На чому ґрунтується карта</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Цілі рівнів переказують дескриптори CEFR, граматика й теми — British Council / EAQUALS Core Inventory,
                  години — рекомендації Cambridge English, обсяг лексики — Oxford 3000/5000 і дослідження словникового запасу.
                </p>
              </div>
            </div>
            <div className="mt-5">
              <ResourceList title="Джерела" resources={sources} />
            </div>
          </section>
        </div>
      </div>

      <Dialog.Root open={resetOpen} onOpenChange={setResetOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in dark:border-slate-700 dark:bg-slate-900">
            <Dialog.Title className="text-lg font-black text-slate-950 dark:text-white">Скинути прогрес дорожньої карти?</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Усі позначки на дорожній карті буде видалено з цього браузера. Прогрес у словнику, повтореннях і тестах не
              зміниться.
            </Dialog.Description>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary">
                  Скасувати
                </Button>
              </Dialog.Close>
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  clear();
                  setResetOpen(false);
                }}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Скинути
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
