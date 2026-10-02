import type { CompletedTasks } from "./progress";
import type { TaskNotes } from "./notes";
import type { RoadmapModule, RoadmapModuleKind, RoadmapStage, RoadmapStageId, RoadmapTask } from "./types";

export type StatusFilter = "all" | "todo" | "done";

export interface RoadmapFilters {
  query: string;
  /** Empty means every level. */
  stages: readonly RoadmapStageId[];
  /** Empty means every section. */
  kinds: readonly RoadmapModuleKind[];
  status: StatusFilter;
  withNotes: boolean;
}

export const DEFAULT_FILTERS: RoadmapFilters = { query: "", stages: [], kinds: [], status: "all", withNotes: false };

export const MODULE_KIND_LABELS: Record<RoadmapModuleKind, string> = {
  setup: "Налаштування",
  grammar: "Граматика",
  vocabulary: "Лексика",
  pronunciation: "Вимова",
  listening: "Аудіювання",
  reading: "Читання",
  speaking: "Говоріння",
  writing: "Письмо",
  checkpoint: "Контрольні точки",
};

export const MODULE_KINDS = Object.keys(MODULE_KIND_LABELS) as RoadmapModuleKind[];

export const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  all: "Усі",
  todo: "Невиконані",
  done: "Виконані",
};

export const STATUS_FILTERS = Object.keys(STATUS_FILTER_LABELS) as StatusFilter[];

/** Lower case, one kind of apostrophe (’ ʼ ‘ ` ´ → '), single spaces. */
export function normalizeSearchText(text: string) {
  return text.toLocaleLowerCase("uk").replace(/[’ʼ‘`´]/g, "'").replace(/\s+/g, " ").trim();
}

/** Distinct words of the query; a task matches when it contains every one of them. */
export function searchTerms(query: string): string[] {
  return [...new Set(normalizeSearchText(query).split(" ").filter(Boolean))];
}

/** Search mode replaces the guided plan with a list of matching tasks; the status filter alone does not. */
export function isSearchMode(filters: RoadmapFilters) {
  return searchTerms(filters.query).length > 0 || filters.stages.length > 0 || filters.kinds.length > 0 || filters.withNotes;
}

/** Number of filters chosen in the panel (the query is visible in its own field). */
export function countActiveFilters(filters: RoadmapFilters) {
  return filters.stages.length + filters.kinds.length + (filters.status === "all" ? 0 : 1) + (filters.withNotes ? 1 : 0);
}

export function matchesStatus(done: boolean, status: StatusFilter) {
  return status === "all" || (status === "done") === done;
}

/** Adds or removes `item`, keeping the canonical order of `allowed` (stable URLs and chip order). */
export function toggleListItem<T extends string>(list: readonly T[], item: T, allowed: readonly T[]): T[] {
  const next = new Set(list);
  if (next.has(item)) next.delete(item);
  else next.add(item);
  return allowed.filter((value) => next.has(value));
}

export interface SearchEntry {
  stage: RoadmapStage;
  roadmapModule: RoadmapModule;
  task: RoadmapTask;
  /** Normalised level, section and task text; notes are added at match time because they change. */
  text: string;
}

export function buildSearchIndex(stages: readonly RoadmapStage[]): SearchEntry[] {
  return stages.flatMap((stage) =>
    stage.modules.flatMap((roadmapModule) =>
      roadmapModule.tasks.map((task) => ({
        stage,
        roadmapModule,
        task,
        text: normalizeSearchText(
          [
            stage.code,
            stage.title,
            roadmapModule.title,
            task.title,
            task.details,
            ...(task.examples ?? []),
            ...(task.links ?? []).map((link) => link.label),
          ].join(" "),
        ),
      })),
    ),
  );
}

export interface FilteredModule {
  roadmapModule: RoadmapModule;
  tasks: RoadmapTask[];
}

export interface FilteredStage {
  stage: RoadmapStage;
  modules: FilteredModule[];
  count: number;
}

export interface FilterResult {
  stages: FilteredStage[];
  count: number;
}

const NO_TASKS: ReadonlySet<string> = new Set();

/**
 * Matching tasks grouped by level and section, in roadmap order.
 * `pinned` tasks (an open note editor) skip the status, note and text checks, so editing never makes them vanish.
 */
export function filterRoadmap(
  index: readonly SearchEntry[],
  filters: RoadmapFilters,
  completed: CompletedTasks,
  notes: TaskNotes,
  pinned: ReadonlySet<string> = NO_TASKS,
): FilterResult {
  const terms = searchTerms(filters.query);
  const stageIds = new Set(filters.stages);
  const kinds = new Set(filters.kinds);
  const stages: FilteredStage[] = [];
  let count = 0;

  for (const { stage, roadmapModule, task, text } of index) {
    if (stageIds.size > 0 && !stageIds.has(stage.id)) continue;
    if (kinds.size > 0 && !kinds.has(roadmapModule.kind)) continue;
    if (!pinned.has(task.id)) {
      if (!matchesStatus(Boolean(completed[task.id]), filters.status)) continue;
      const note = notes[task.id]?.text;
      if (filters.withNotes && !note) continue;
      if (terms.length > 0) {
        const haystack = note ? `${text} ${normalizeSearchText(note)}` : text;
        if (!terms.every((term) => haystack.includes(term))) continue;
      }
    }

    let stageGroup = stages.at(-1);
    if (stageGroup?.stage !== stage) {
      stageGroup = { stage, modules: [], count: 0 };
      stages.push(stageGroup);
    }
    let moduleGroup = stageGroup.modules.at(-1);
    if (moduleGroup?.roadmapModule !== roadmapModule) {
      moduleGroup = { roadmapModule, tasks: [] };
      stageGroup.modules.push(moduleGroup);
    }
    moduleGroup.tasks.push(task);
    stageGroup.count += 1;
    count += 1;
  }

  return { stages, count };
}

const PARAMS = { query: "q", stages: "level", kinds: "section", status: "status", withNotes: "notes" } as const;

function readList<T extends string>(value: string | null, allowed: readonly T[]): T[] {
  if (!value) return [];
  const wanted = new Set(value.split(","));
  return allowed.filter((item) => wanted.has(item));
}

/** Filters from the page URL; unknown or malformed values are ignored. */
export function filtersFromSearchParams(
  params: URLSearchParams,
  stageIds: readonly RoadmapStageId[],
  kinds: readonly RoadmapModuleKind[],
): RoadmapFilters {
  const status = params.get(PARAMS.status);
  return {
    query: params.get(PARAMS.query) ?? "",
    stages: readList(params.get(PARAMS.stages), stageIds),
    kinds: readList(params.get(PARAMS.kinds), kinds),
    status: status === "todo" || status === "done" ? status : "all",
    withNotes: params.get(PARAMS.withNotes) === "1",
  };
}

/** Writes the filters into a copy of `base`, keeping unrelated parameters and dropping defaults. */
export function filtersToSearchParams(filters: RoadmapFilters, base = new URLSearchParams()): URLSearchParams {
  const params = new URLSearchParams(base);
  const values: Record<(typeof PARAMS)[keyof typeof PARAMS], string> = {
    q: filters.query.trim(),
    level: filters.stages.join(","),
    section: filters.kinds.join(","),
    status: filters.status === "all" ? "" : filters.status,
    notes: filters.withNotes ? "1" : "",
  };
  for (const [key, value] of Object.entries(values)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  return params;
}

export function sameFilters(a: RoadmapFilters, b: RoadmapFilters) {
  return filtersToSearchParams(a).toString() === filtersToSearchParams(b).toString();
}
