import { percentage } from "@/domain/learning/progress";
import type { RoadmapModule, RoadmapStage, RoadmapTask } from "./types";

export const ROADMAP_STORAGE_KEY = "english-path-roadmap-progress";
const STORAGE_VERSION = 1;

/** Task id → ISO timestamp of the moment the task was checked. */
export type CompletedTasks = Readonly<Record<string, string>>;

export interface ProgressSummary {
  done: number;
  total: number;
  percent: number;
}

export type StageStatus = "not-started" | "in-progress" | "done";

export interface TaskLocation {
  stage: RoadmapStage;
  module: RoadmapModule;
  task: RoadmapTask;
}

/**
 * Rounded percentage that never reads 0% once a task is done or 100% while one is left:
 * with 230 tasks, plain rounding shows 0% after the first check and 100% before the last one.
 */
function progressPercent(done: number, total: number) {
  if (done <= 0 || total <= 0) return 0;
  if (done >= total) return 100;
  return Math.min(99, Math.max(1, percentage(done, total)));
}

/** Optional tasks never count towards progress, so a learner can reach 100% without an official exam. */
export function summarizeTasks(tasks: readonly RoadmapTask[], completed: CompletedTasks): ProgressSummary {
  let done = 0;
  let total = 0;
  for (const task of tasks) {
    if (task.optional) continue;
    total += 1;
    if (completed[task.id]) done += 1;
  }
  return { done, total, percent: progressPercent(done, total) };
}

export function getStageTasks(stage: RoadmapStage): RoadmapTask[] {
  return stage.modules.flatMap((stageModule) => stageModule.tasks);
}

export function summarizeStage(stage: RoadmapStage, completed: CompletedTasks): ProgressSummary {
  return summarizeTasks(getStageTasks(stage), completed);
}

export function summarizeRoadmap(stages: readonly RoadmapStage[], completed: CompletedTasks): ProgressSummary {
  return summarizeTasks(stages.flatMap(getStageTasks), completed);
}

export function getStageStatus(summary: ProgressSummary): StageStatus {
  if (summary.total > 0 && summary.done === summary.total) return "done";
  return summary.done > 0 ? "in-progress" : "not-started";
}

/** The first required task that is not done yet, in roadmap order. */
export function findNextTask(stages: readonly RoadmapStage[], completed: CompletedTasks): TaskLocation | null {
  for (const stage of stages) {
    for (const stageModule of stage.modules) {
      for (const task of stageModule.tasks) {
        if (!task.optional && !completed[task.id]) return { stage, module: stageModule, task };
      }
    }
  }
  return null;
}

export function toggleTask(completed: CompletedTasks, taskId: string, now = new Date()): CompletedTasks {
  if (!completed[taskId]) return { ...completed, [taskId]: now.toISOString() };
  const next = { ...completed };
  delete next[taskId];
  return next;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Tolerant reader: malformed storage yields empty progress, malformed entries are dropped one by one. */
export function parseStoredProgress(raw: string | null): CompletedTasks {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data) || data.version !== STORAGE_VERSION || !isRecord(data.completed)) return {};

    const completed: Record<string, string> = {};
    for (const [taskId, checkedAt] of Object.entries(data.completed)) {
      if (taskId && typeof checkedAt === "string") completed[taskId] = checkedAt;
    }
    return completed;
  } catch {
    return {};
  }
}

export function serializeProgress(completed: CompletedTasks): string {
  return JSON.stringify({ version: STORAGE_VERSION, completed });
}
