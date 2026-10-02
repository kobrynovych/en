"use client";

import { ArrowRight, RotateCcw, SearchX } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { pluralUk } from "@/shared/lib/plural-uk";
import type { FilterResult, StatusFilter } from "./filters";
import { Highlight } from "./highlight";
import { ModuleCard, STAGE_ACCENTS, stageHeading, type TaskListProps } from "./roadmap-stage";
import type { RoadmapStageId } from "./types";

export const TASK_FORMS = ["пункт", "пункти", "пунктів"] as const;

interface RoadmapResultsProps extends TaskListProps {
  result: FilterResult;
  status: StatusFilter;
  terms: readonly string[];
  onOpenStage: (stageId: RoadmapStageId) => void;
  onReset: () => void;
}

/** Matching tasks grouped by level and section; replaces the guided plan while a search or filter is active. */
export function RoadmapResults({ result, status, terms, onOpenStage, onReset, ...taskList }: RoadmapResultsProps) {
  if (result.count === 0) {
    return (
      <section
        aria-labelledby="roadmap-no-results"
        className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          <SearchX className="size-6" aria-hidden="true" />
        </span>
        <h2 id="roadmap-no-results" className="mt-3 text-lg font-black text-slate-950 dark:text-white">
          Нічого не знайдено
        </h2>
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
          Перевірте написання, спробуйте коротше слово або приберіть частину фільтрів. Шукати можна українською та
          англійською, зокрема у ваших нотатках.
        </p>
        <Button type="button" variant="secondary" className="mt-4" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Скинути пошук і фільтри
        </Button>
      </section>
    );
  }

  return result.stages.map(({ stage, modules, count }) => (
    <section
      key={stage.id}
      id={`stage-${stage.id}`}
      aria-labelledby={`stage-${stage.id}-title`}
      className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-center gap-3 p-4 sm:px-6">
        <span
          className={cn("grid h-10 min-w-10 shrink-0 place-items-center rounded-lg px-2 text-sm font-black", STAGE_ACCENTS[stage.id])}
          aria-hidden="true"
        >
          {stage.code}
        </span>
        {/* basis-48 moves the button to its own line on phones instead of squeezing the title. */}
        <div className="min-w-0 flex-1 basis-48">
          <h2 id={`stage-${stage.id}-title`} className="text-lg font-black text-slate-950 dark:text-white">
            <Highlight text={stageHeading(stage)} terms={terms} />
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Знайдено {count} {pluralUk(count, TASK_FORMS)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`Відкрити рівень ${stage.code} повністю`}
          onClick={() => onOpenStage(stage.id)}
        >
          Відкрити рівень
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="space-y-4 border-t border-slate-200 px-3 py-4 sm:p-6 dark:border-slate-700">
        {modules.map(({ roadmapModule, tasks }) => (
          <ModuleCard
            key={roadmapModule.id}
            stage={stage}
            roadmapModule={roadmapModule}
            status={status}
            visibleTasks={tasks}
            highlightTerms={terms}
            {...taskList}
          />
        ))}
      </div>
    </section>
  ));
}
