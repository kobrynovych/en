"use client";

import { useCallback, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, BookOpenCheck, Check, EyeOff, Lightbulb, PartyPopper, RotateCcw, Route } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { cn } from "@/shared/lib/cn";
import { downloadTextFile } from "@/shared/lib/download-text";
import { pluralUk } from "@/shared/lib/plural-uk";
import {
  buildSearchIndex,
  DEFAULT_FILTERS,
  filterRoadmap,
  filtersFromSearchParams,
  filtersToSearchParams,
  isSearchMode,
  matchesStatus,
  MODULE_KINDS,
  sameFilters,
  searchTerms,
  type RoadmapFilters,
} from "./filters";
import { notesToMarkdown } from "./notes";
import {
  findNextTask,
  getStageStatus,
  getStageTasks,
  summarizeRoadmap,
  summarizeStage,
  type TaskLocation,
} from "./progress";
import { RoadmapFilterBar } from "./roadmap-filters";
import { RoadmapResults, TASK_FORMS } from "./roadmap-results";
import { ResourceList, STAGE_ACCENTS, StageSection, stageHeading, type TaskListProps } from "./roadmap-stage";
import type { RoadmapResource, RoadmapStage, RoadmapStageId } from "./types";
import { useRoadmapNotes } from "./use-roadmap-notes";
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

interface Pins {
  /** The filters the pins were made under: a new search or filter shows exactly what matches. */
  key: string;
  ids: ReadonlySet<string>;
}

const NO_PINS: ReadonlySet<string> = new Set();
const MATCH_FORMS = ["збіг", "збіги", "збігів"] as const;
const URL_SYNC_DELAY_MS = 300;

/** Leaves search mode but keeps the status filter, which also applies to the plan itself. */
function withoutSearch(filters: RoadmapFilters): RoadmapFilters {
  return isSearchMode(filters) ? { ...DEFAULT_FILTERS, status: filters.status } : filters;
}

function isEditable(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select") !== null);
}

/** The stage that contains a `#stage-…` or `#module-…` anchor. */
function findLinkedStage(stages: RoadmapStage[], hash: string) {
  return stages.find(
    (stage) => hash === `#stage-${stage.id}` || stage.modules.some((roadmapModule) => hash === `#module-${roadmapModule.id}`),
  );
}

export function RoadmapClient({ stages, principles, routine, sources }: RoadmapClientProps) {
  const { completed, hydrated, toggle, clear } = useRoadmapProgress();
  const { notes, setNote } = useRoadmapNotes();
  // null until the saved progress is known; then the learner's current stage is opened once.
  const [expanded, setExpanded] = useState<ReadonlySet<RoadmapStageId> | null>(null);
  const [filters, setFilters] = useState<RoadmapFilters>(DEFAULT_FILTERS);
  const [pins, setPins] = useState<Pins>({ key: "", ids: NO_PINS });
  const [resetOpen, setResetOpen] = useState(false);
  const stageListRef = useRef<HTMLOListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const initialAnchorHandled = useRef(false);
  const filtersRestored = useRef(false);

  const summary = useMemo(() => summarizeRoadmap(stages, completed), [stages, completed]);
  const nextTask = useMemo(() => findNextTask(stages, completed), [stages, completed]);
  const taskCount = useMemo(() => stages.reduce((sum, stage) => sum + getStageTasks(stage).length, 0), [stages]);
  const currentStageId = nextTask?.stage.id ?? stages[stages.length - 1].id;
  const expandedStages = expanded ?? new Set<RoadmapStageId>([stages[0].id]);

  // Typing re-renders the results in the background; clearing the query applies at once, which navigation relies on.
  const deferredQuery = useDeferredValue(filters.query);
  const query = filters.query ? deferredQuery : "";
  const stale = query !== filters.query;
  const appliedFilters = useMemo<RoadmapFilters>(
    () => ({ query, stages: filters.stages, kinds: filters.kinds, status: filters.status, withNotes: filters.withNotes }),
    [query, filters.stages, filters.kinds, filters.status, filters.withNotes],
  );
  const searchIndex = useMemo(() => buildSearchIndex(stages), [stages]);
  const searchMode = isSearchMode(appliedFilters);
  // An open note editor or a pending undo keeps its task visible under the filters it was opened with.
  const filtersKey = filtersToSearchParams(appliedFilters).toString();
  const filtersKeyRef = useRef(filtersKey);
  const pinned = pins.key === filtersKey ? pins.ids : NO_PINS;
  const result = useMemo(
    () => (searchMode ? filterRoadmap(searchIndex, appliedFilters, completed, notes, pinned) : null),
    [searchMode, searchIndex, appliedFilters, completed, notes, pinned],
  );
  const terms = useMemo(() => searchTerms(query), [query]);
  const matchCounts = useMemo(() => new Map(result?.stages.map((group) => [group.stage.id, group.count])), [result]);
  const notesCount = Object.keys(notes).length;

  let resultSummary = "";
  if (result) {
    resultSummary = result.count === 0 ? "Нічого не знайдено" : `Знайдено ${result.count} ${pluralUk(result.count, TASK_FORMS)}`;
  } else if (filters.status !== "all") {
    const shown = searchIndex.filter((entry) => matchesStatus(Boolean(completed[entry.task.id]), filters.status)).length;
    resultSummary = `${filters.status === "todo" ? "Невиконаних" : "Виконаних"} пунктів: ${shown}`;
  }

  const updateFilters = useCallback(
    (patch: Partial<RoadmapFilters>) => setFilters((current) => ({ ...current, ...patch })),
    [],
  );
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const setTaskPinned = useCallback((taskId: string, isPinned: boolean) => {
    const key = filtersKeyRef.current;
    setPins((previous) => {
      const ids = previous.key === key ? previous.ids : NO_PINS;
      if (ids.has(taskId) === isPinned) return ids === previous.ids ? previous : { key, ids };
      const next = new Set(ids);
      if (isPinned) next.add(taskId);
      else next.delete(taskId);
      return { key, ids: next };
    });
  }, []);

  // Layout effects run before the tasks' passive effects, so a pin request always sees the current filters.
  useLayoutEffect(() => {
    filtersKeyRef.current = filtersKey;
  }, [filtersKey]);

  const taskList: TaskListProps = {
    completed,
    notes,
    pinned,
    onToggleTask: toggle,
    onSaveNote: setNote,
    onPinChange: setTaskPinned,
  };

  // Filters live in the address (?q=…&level=…), so a filtered view survives a reload and can be bookmarked.
  useEffect(() => {
    if (filtersRestored.current) return;
    filtersRestored.current = true;
    const restored = filtersFromSearchParams(
      new URLSearchParams(window.location.search),
      stages.map((stage) => stage.id),
      MODULE_KINDS,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the address can only be read after hydration
    if (!sameFilters(restored, DEFAULT_FILTERS)) setFilters(restored);
  }, [stages]);

  useEffect(() => {
    if (!filtersRestored.current) return;
    const timer = window.setTimeout(() => {
      const { pathname, search, hash } = window.location;
      const params = filtersToSearchParams(filters, new URLSearchParams(search)).toString();
      const next = `${pathname}${params ? `?${params}` : ""}${hash}`;
      if (next !== `${pathname}${search}${hash}`) window.history.replaceState(null, "", next);
    }, URL_SYNC_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [filters]);

  // "/" jumps to the search field, as on GitHub or MDN; the physical key works in the Ukrainian layout too.
  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key !== "/" && !(event.code === "Slash" && !event.shiftKey)) return;
      if (isEditable(event.target) || (event.target instanceof Element && event.target.closest("[role='dialog']"))) return;
      const input = searchInputRef.current;
      if (!input) return;
      event.preventDefault();
      input.focus({ preventScroll: true });
      input.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      input.select();
    }
    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    if (!hydrated || expanded !== null) return;
    const linkedStage = findLinkedStage(stages, window.location.hash);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- open the current (or linked) stage once saved progress is restored
    setExpanded(new Set([linkedStage?.id ?? currentStageId]));
  }, [hydrated, expanded, stages, currentStageId]);

  useEffect(() => {
    if (!hydrated || expanded === null || initialAnchorHandled.current) return;
    initialAnchorHandled.current = true;
    const hash = window.location.hash;
    if (hash.startsWith("#module-")) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hydrated, expanded]);

  // Hash changes without a reload (an edited address, browser history) must open the linked level as well.
  useEffect(() => {
    function revealHashTarget() {
      const linkedStage = findLinkedStage(stages, window.location.hash);
      if (!linkedStage) return;
      flushSync(() => {
        setFilters(withoutSearch);
        setExpanded((previous) => new Set(previous ?? [stages[0].id]).add(linkedStage.id));
      });
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" });
    }
    window.addEventListener("hashchange", revealHashTarget);
    return () => window.removeEventListener("hashchange", revealHashTarget);
  }, [stages]);

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

  /** Scrolls to a level: to its search results if it has any, otherwise to the level in the plan. */
  function goToStage(stageId: RoadmapStageId) {
    if (searchMode && !matchCounts.has(stageId)) flushSync(() => setFilters(withoutSearch));
    openStage(stageId);
    document.getElementById(`stage-${stageId}`)?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  /** "Відкрити рівень" in the search results: back to the plan, focused on that level. */
  function showStageInPlan(stageId: RoadmapStageId) {
    flushSync(() => setFilters(withoutSearch));
    openStage(stageId);
    const section = document.getElementById(`stage-${stageId}`);
    section?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    section?.querySelector<HTMLButtonElement>("h2 button")?.focus({ preventScroll: true });
  }

  function goToTask(location: TaskLocation) {
    if (!document.getElementById(`task-${location.task.id}`)) {
      // A search or the "done" filter may hide the task: show it in the plan.
      flushSync(() =>
        setFilters((current) => ({ ...withoutSearch(current), status: current.status === "done" ? "all" : current.status })),
      );
    }
    openStage(location.stage.id);
    const element = document.getElementById(`task-${location.task.id}`);
    if (!element) return;
    element.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
    element.querySelector<HTMLInputElement>("input[type='checkbox']")?.focus({ preventScroll: true });
  }

  function setAllExpanded(open: boolean) {
    setExpanded(new Set(open ? stages.map((stage) => stage.id) : []));
  }

  function exportNotes() {
    const now = new Date();
    const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((part) => String(part).padStart(2, "0")).join("-");
    downloadTextFile(`english-path-notes-${date}.md`, notesToMarkdown(stages, notes, now));
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-0" data-hydrated={hydrated}>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2">
          <Badge variant="emerald">CEFR</Badge>
          <Badge variant="sky">Від нуля до B2</Badge>
          <Badge variant="amber">До B2: ≈ 500–600 год від нуля</Badge>
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl dark:text-white">
          Дорожня карта англійської: від нуля до B2
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Покроковий план за міжнародною шкалою CEFR: для кожного рівня — цілі, граматика, лексика, вимова, чотири мовні
          навички, типові помилки й контрольні точки. Відмічайте виконані пункти й додавайте власні нотатки: усе
          зберігається в цьому браузері.
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Відсоток показує виконання плану. Рівень перевіряйте окремо за слуханням, читанням, говорінням і письмом.
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
                  План виконано — перевірте свої навички за контрольною точкою B2.
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
            {/* The same state as "Невиконані" in the filters; a toggle keeps its label and reports aria-pressed. */}
            <Button
              type="button"
              variant="secondary"
              aria-pressed={filters.status === "todo"}
              onClick={() => updateFilters({ status: filters.status === "todo" ? "all" : "todo" })}
              className="aria-pressed:border-emerald-600 aria-pressed:bg-emerald-50 aria-pressed:text-emerald-900 dark:aria-pressed:border-emerald-500 dark:aria-pressed:bg-emerald-950/60 dark:aria-pressed:text-emerald-200"
            >
              {filters.status === "todo" ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <EyeOff className="size-4" aria-hidden="true" />
              )}
              Сховати виконані
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
              Мало часу? Скоротіть кожен блок удвічі. Довшу розмову чи письмову роботу можна виконати замість
              кількох блоків. Тривалості в завданнях — варіанти практики, їх не потрібно додавати всі до щоденної години.
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
            <div className={cn("flex gap-1 text-xs font-semibold", searchMode && "invisible")}>
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
              const matches = matchCounts.get(stage.id) ?? 0;
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
                          {searchMode
                            ? matches > 0
                              ? `${matches} ${pluralUk(matches, MATCH_FORMS)}`
                              : "Немає збігів"
                            : isCurrent
                              ? "Ви тут"
                              : status === "done"
                                ? "Завершено"
                                : `${stage.totalHours} від нуля`}
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
          <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {taskCount} пунктів, з них опційні не впливають на відсоток. Години «від нуля» — накопичувальні орієнтири
            Cambridge для занять і навчання під керівництвом викладача. Їх не потрібно додавати між рівнями.
          </p>
        </aside>

        <div className="min-w-0 space-y-4">
          <RoadmapFilterBar
            stages={stages}
            filters={filters}
            summary={hydrated ? resultSummary : ""}
            notesCount={notesCount}
            searchInputRef={searchInputRef}
            onChange={updateFilters}
            onReset={resetFilters}
            onExportNotes={exportNotes}
          />

          <div className={cn("space-y-4 transition-opacity", stale && "opacity-60")} aria-busy={stale || undefined}>
            {result ? (
              <RoadmapResults
                result={result}
                status={appliedFilters.status}
                terms={terms}
                onOpenStage={showStageInPlan}
                onReset={resetFilters}
                {...taskList}
              />
            ) : (
              stages.map((stage) => (
                <StageSection
                  key={stage.id}
                  stage={stage}
                  expanded={expandedStages.has(stage.id)}
                  status={filters.status}
                  onToggleExpanded={toggleStage}
                  {...taskList}
                />
              ))
            )}
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
                <BookOpenCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">На чому ґрунтується карта</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Цілі рівнів переказують дескриптори CEFR, граматика й теми — British Council / EAQUALS Core Inventory,
                  години від нуля — рекомендації Cambridge English. Розподіл тем, темп етапів і обсяг практики —
                  навчальні орієнтири цієї карти, які можна адаптувати під свою мету.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  CEFR описує вміння, а не обов’язкову кількість слів чи єдиний список граматики. Лексичні діапазони
                  приблизні й накопичувальні; впізнавати слово та вживати його — різні вміння. Стартові 20–30 год
                  включено до A1. Час самостійної практики індивідуальний. Довжини текстів і тривалості розмов —
                  тренувальні цілі; формат іспиту застосовується лише там, де його прямо зазначено.
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
              Усі позначки на дорожній карті буде видалено з цього браузера. Нотатки до пунктів, прогрес у словнику,
              повтореннях і тестах залишаться.
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
