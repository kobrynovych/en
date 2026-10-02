"use client";

import { useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { flushSync } from "react-dom";
import { Check, Download, Search, SlidersHorizontal, StickyNote, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { useDebouncedValue } from "@/shared/lib/use-debounced-value";
import {
  countActiveFilters,
  MODULE_KIND_LABELS,
  MODULE_KINDS,
  STATUS_FILTER_LABELS,
  STATUS_FILTERS,
  toggleListItem,
  type RoadmapFilters,
} from "./filters";
import type { RoadmapStage } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

const chip = "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors";
const chipOff =
  "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:bg-slate-800";
// emerald-700 keeps white text above 4.5:1; the check icon marks the state without relying on colour.
const chipOn = "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800";

function ToggleChip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className={cn(chip, pressed ? chipOn : chipOff, focusRing)}>
      {pressed ? <Check className="size-3.5" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

function FilterGroup({ legend, className, children }: { legend: string; className?: string; children: ReactNode }) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

interface RoadmapFilterBarProps {
  stages: readonly RoadmapStage[];
  filters: RoadmapFilters;
  /** What the filters currently show; empty when nothing is filtered. */
  summary: string;
  notesCount: number;
  searchInputRef: RefObject<HTMLInputElement | null>;
  onChange: (patch: Partial<RoadmapFilters>) => void;
  onReset: () => void;
  onExportNotes: () => void;
}

/** Search field, filter panel, applied-filter chips and the notes tools above the roadmap. */
export function RoadmapFilterBar({
  stages,
  filters,
  summary,
  notesCount,
  searchInputRef,
  onChange,
  onReset,
  onExportNotes,
}: RoadmapFilterBarProps) {
  const id = useId();
  const [panelOpen, setPanelOpen] = useState(false);
  const panelButtonRef = useRef<HTMLButtonElement>(null);
  const appliedListRef = useRef<HTMLUListElement>(null);
  // Screen readers hear the result count once typing pauses, not after every keystroke.
  const announcement = useDebouncedValue(summary, 600);
  const activeCount = countActiveFilters(filters);
  const stageIds = stages.map((stage) => stage.id);
  const panelId = `${id}-panel`;

  const applied = [
    ...filters.stages.map((stageId) => ({
      key: `level-${stageId}`,
      label: stages.find((stage) => stage.id === stageId)?.code ?? stageId,
      remove: () => onChange({ stages: filters.stages.filter((value) => value !== stageId) }),
    })),
    ...filters.kinds.map((kind) => ({
      key: `section-${kind}`,
      label: MODULE_KIND_LABELS[kind],
      remove: () => onChange({ kinds: filters.kinds.filter((value) => value !== kind) }),
    })),
    ...(filters.status === "all"
      ? []
      : [{ key: "status", label: STATUS_FILTER_LABELS[filters.status], remove: () => onChange({ status: "all" }) }]),
    ...(filters.withNotes ? [{ key: "notes", label: "З нотатками", remove: () => onChange({ withNotes: false }) }] : []),
  ];

  // The removed chip disappears, so keep the keyboard focus on a neighbour instead of losing it.
  function removeApplied(index: number) {
    flushSync(applied[index].remove);
    const buttons = appliedListRef.current?.querySelectorAll<HTMLButtonElement>("button");
    (buttons?.[index] ?? buttons?.[index - 1] ?? panelButtonRef.current)?.focus();
  }

  function resetAll() {
    flushSync(onReset);
    searchInputRef.current?.focus();
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    if (filters.query) onChange({ query: "" });
    else event.currentTarget.blur();
  }

  // Results update while typing; on touch screens Enter also hides the keyboard to reveal them.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (window.matchMedia("(pointer: coarse)").matches) searchInputRef.current?.blur();
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    setPanelOpen(false);
    panelButtonRef.current?.focus();
  }

  return (
    <div
      role="search"
      aria-label="Пошук по дорожній карті"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form className="relative min-w-0 flex-1" onSubmit={handleSubmit}>
          <label htmlFor={`${id}-query`} className="sr-only">
            Пошук пунктів
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            id={`${id}-query`}
            type="search"
            value={filters.query}
            onChange={(event) => onChange({ query: event.target.value })}
            onKeyDown={handleSearchKeyDown}
            placeholder="Тема, слово, приклад або нотатка"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-keyshortcuts="/"
            className="h-11 w-full rounded-md border border-slate-200 bg-white pl-9 pr-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {filters.query ? (
            <button
              type="button"
              onClick={() => {
                onChange({ query: "" });
                searchInputRef.current?.focus();
              }}
              aria-label="Очистити пошук"
              className={cn(
                "absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700",
                focusRing,
              )}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <kbd
              className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-xs text-slate-500 [@media(hover:hover)]:block dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              aria-hidden="true"
            >
              /
            </kbd>
          )}
        </form>
        <Button
          ref={panelButtonRef}
          type="button"
          variant="secondary"
          aria-expanded={panelOpen}
          aria-controls={panelOpen ? panelId : undefined}
          onClick={() => setPanelOpen((value) => !value)}
          className="shrink-0 aria-expanded:border-emerald-600 aria-expanded:bg-emerald-50 dark:aria-expanded:border-emerald-500 dark:aria-expanded:bg-emerald-950/60"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Фільтри
          {activeCount > 0 ? (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-700 px-1 text-xs font-bold text-white">
              {activeCount}
              <span className="sr-only"> активних</span>
            </span>
          ) : null}
        </Button>
      </div>

      {panelOpen ? (
        <div
          id={panelId}
          onKeyDown={handlePanelKeyDown}
          className="mt-4 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-[auto_minmax(0,1fr)] md:gap-x-8 dark:border-slate-700"
        >
          <FilterGroup legend="Рівень">
            {stages.map((stage) => (
              <ToggleChip
                key={stage.id}
                pressed={filters.stages.includes(stage.id)}
                onClick={() => onChange({ stages: toggleListItem(filters.stages, stage.id, stageIds) })}
              >
                {stage.code}
              </ToggleChip>
            ))}
          </FilterGroup>
          <FilterGroup legend="Статус">
            {STATUS_FILTERS.map((status) => (
              <label key={status} className="relative">
                <input
                  type="radio"
                  name={`${id}-status`}
                  value={status}
                  checked={filters.status === status}
                  onChange={() => onChange({ status })}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    chip,
                    "cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-slate-900",
                    filters.status === status ? chipOn : chipOff,
                  )}
                >
                  {filters.status === status ? <Check className="size-3.5" aria-hidden="true" /> : null}
                  {STATUS_FILTER_LABELS[status]}
                </span>
              </label>
            ))}
          </FilterGroup>
          <FilterGroup legend="Розділ" className="md:col-span-2">
            {MODULE_KINDS.map((kind) => (
              <ToggleChip
                key={kind}
                pressed={filters.kinds.includes(kind)}
                onClick={() => onChange({ kinds: toggleListItem(filters.kinds, kind, MODULE_KINDS) })}
              >
                {MODULE_KIND_LABELS[kind]}
              </ToggleChip>
            ))}
          </FilterGroup>
          <FilterGroup legend="Нотатки" className="md:col-span-2">
            <ToggleChip pressed={filters.withNotes} onClick={() => onChange({ withNotes: !filters.withNotes })}>
              <StickyNote className="size-3.5" aria-hidden="true" />
              Лише з нотатками
              <span className="font-normal tabular-nums">({notesCount})</span>
            </ToggleChip>
          </FilterGroup>
        </div>
      ) : null}

      {applied.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Обрано:</span>
          <ul ref={appliedListRef} className="flex flex-wrap gap-2">
            {applied.map((item, index) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => removeApplied(index)}
                  aria-label={`${item.label} — прибрати фільтр`}
                  className={cn(
                    "inline-flex min-h-8 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 py-1 pl-3 pr-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-950",
                    focusRing,
                  )}
                >
                  {item.label}
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={resetAll}
            className={cn("rounded px-1.5 py-1 text-xs font-semibold text-slate-600 underline-offset-2 hover:underline dark:text-slate-400", focusRing)}
          >
            Скинути все
          </button>
        </div>
      ) : null}

      {summary || notesCount > 0 ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
          {/* The visible summary updates instantly; the debounced copy below is what gets announced. */}
          <p aria-hidden="true" className="font-semibold text-slate-700 dark:text-slate-300">
            {summary}
          </p>
          {notesCount > 0 ? (
            <div
              role="group"
              aria-labelledby={`${id}-notes`}
              className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-400"
            >
              <span id={`${id}-notes`} className="inline-flex items-center gap-1.5">
                <StickyNote className="size-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                Мої нотатки: {notesCount}
              </span>
              {filters.withNotes ? null : (
                <Button type="button" size="sm" variant="ghost" onClick={() => onChange({ withNotes: true })}>
                  Показати
                </Button>
              )}
              <Button type="button" size="sm" variant="ghost" onClick={onExportNotes}>
                <Download className="size-4" aria-hidden="true" />
                Завантажити (.md)
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
