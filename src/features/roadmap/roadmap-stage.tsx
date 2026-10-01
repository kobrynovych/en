"use client";

import Link from "next/link";
import { useId, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  AudioLines,
  BookA,
  BookOpenText,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock,
  Compass,
  Ear,
  ExternalLink,
  Flag,
  GraduationCap,
  Lightbulb,
  Mic,
  MessagesSquare,
  PenLine,
  SpellCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { SpeakButton } from "@/shared/ui/speak-button";
import { cn } from "@/shared/lib/cn";
import { getStageStatus, summarizeStage, summarizeTasks, type CompletedTasks, type StageStatus } from "./progress";
import type {
  RoadmapLink,
  RoadmapModule,
  RoadmapModuleKind,
  RoadmapResource,
  RoadmapSkill,
  RoadmapStage,
  RoadmapStageId,
  RoadmapTask,
} from "./types";

export const STAGE_ACCENTS: Record<RoadmapStageId, string> = {
  start: "bg-slate-700 text-white dark:bg-slate-600",
  a1: "bg-emerald-600 text-white",
  a2: "bg-sky-600 text-white",
  b1: "bg-amber-500 text-slate-950",
  b2: "bg-violet-600 text-white",
};

export const STATUS_LABELS: Record<StageStatus, string> = {
  "not-started": "Не розпочато",
  "in-progress": "У процесі",
  done: "Завершено",
};

const MODULE_ICONS: Record<RoadmapModuleKind, LucideIcon> = {
  setup: Compass,
  grammar: SpellCheck,
  vocabulary: BookA,
  pronunciation: AudioLines,
  listening: Ear,
  reading: BookOpenText,
  speaking: MessagesSquare,
  writing: PenLine,
  checkpoint: Flag,
};

const SKILLS: Record<RoadmapSkill, { label: string; icon: LucideIcon }> = {
  interaction: { label: "Спілкування", icon: MessagesSquare },
  production: { label: "Монологічне мовлення", icon: Mic },
  listening: { label: "Аудіювання", icon: Ear },
  reading: { label: "Читання", icon: BookOpenText },
  writing: { label: "Письмо", icon: PenLine },
  strategies: { label: "Стратегії", icon: Lightbulb },
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

export function stageHeading(stage: RoadmapStage) {
  return stage.code === stage.title ? stage.title : `${stage.code} · ${stage.title}`;
}

export function StatusBadge({ status }: { status: StageStatus }) {
  const variant = status === "done" ? "emerald" : status === "in-progress" ? "amber" : "default";
  return (
    <Badge variant={variant} className="shrink-0 gap-1">
      {status === "done" ? <CircleCheck className="size-3.5" aria-hidden="true" /> : null}
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function RoadmapLinkChip({ link }: { link: RoadmapLink }) {
  const className = cn(
    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors",
    focusRing,
  );

  if (link.href.startsWith("/")) {
    return (
      <Link
        href={link.href}
        className={cn(
          className,
          "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950",
        )}
      >
        {link.label}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        className,
        "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
      )}
    >
      {link.label}
      <ExternalLink className="size-3.5" aria-hidden="true" />
      <span className="sr-only"> (відкриється в новій вкладці)</span>
    </a>
  );
}

interface StageSectionProps {
  stage: RoadmapStage;
  completed: CompletedTasks;
  expanded: boolean;
  hideCompleted: boolean;
  onToggleExpanded: (stageId: RoadmapStageId) => void;
  onToggleTask: (taskId: string) => void;
}

export function StageSection({
  stage,
  completed,
  expanded,
  hideCompleted,
  onToggleExpanded,
  onToggleTask,
}: StageSectionProps) {
  const summary = summarizeStage(stage, completed);
  const status = getStageStatus(summary);
  const contentId = `stage-${stage.id}-content`;

  return (
    <section
      id={`stage-${stage.id}`}
      aria-labelledby={`stage-${stage.id}-title`}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="relative p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "grid h-14 min-w-14 shrink-0 place-items-center rounded-lg px-2 text-base font-black sm:text-lg",
              STAGE_ACCENTS[stage.id],
            )}
            aria-hidden="true"
          >
            {stage.code}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{stage.cefrName}</p>
            <h2 id={`stage-${stage.id}-title`} className="mt-0.5 text-xl font-black text-slate-950 sm:text-2xl dark:text-white">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={expanded ? contentId : undefined}
                onClick={() => onToggleExpanded(stage.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md text-left after:absolute after:inset-0 after:content-['']",
                  focusRing,
                )}
              >
                <span className="min-w-0">{stageHeading(stage)}</span>
                <ChevronDown
                  className={cn("size-5 shrink-0 text-slate-400 transition-transform", expanded && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{stage.tagline}</p>
          </div>
          <span className="hidden sm:block">
            <StatusBadge status={status} />
          </span>
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {summary.done} з {summary.total} пунктів
            </span>
            <span className="flex items-center gap-2">
              <span className="sm:hidden">
                <StatusBadge status={status} />
              </span>
              <span className="font-bold text-slate-950 dark:text-white">{summary.percent}%</span>
            </span>
          </div>
          <Progress value={summary.percent} label={`Прогрес етапу ${stage.code}`} />
        </div>
      </div>

      {expanded ? (
        <div id={contentId} className="space-y-6 border-t border-slate-200 px-3 py-4 sm:p-6 dark:border-slate-700">
          <p className="text-base leading-7 text-slate-700 dark:text-slate-300">{stage.summary}</p>

          <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Fact
              icon={Clock}
              label="Навчальні години"
              value={stage.stageHours}
              hint={stage.totalHours === stage.stageHours ? undefined : `Разом від нуля: ${stage.totalHours}`}
            />
            <Fact icon={CalendarDays} label="Темп цього етапу" value={stage.pace} />
            <Fact icon={BookA} label="Лексичний орієнтир" value={stage.vocabulary} />
            <Fact icon={GraduationCap} label="Перевірка рівня" value={stage.certification} />
          </dl>

          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
            <SubsectionTitle>Як проходити цей рівень</SubsectionTitle>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {stage.learningPath.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              На кожному кроці поєднуйте слухання, читання, говоріння й письмо. Теми нижче — довідник для цього маршруту.
            </p>
          </div>

          <Outcomes stage={stage} />

          <div className="grid gap-4 md:grid-cols-2">
            <ChipList title="Мовні функції" items={stage.functions} />
            <ChipList title="Теми для розмов" items={stage.topics} />
          </div>

          {status === "done" ? (
            <p className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <CircleCheck className="size-5 shrink-0" aria-hidden="true" />
              Чекліст етапу завершено. Оцініть навички за контрольною точкою й повторіть те, що ще потребує практики.
            </p>
          ) : null}

          <nav aria-label={`Розділи ${stage.code}`} className="flex flex-wrap gap-2">
            {stage.modules.map((module) => (
              <a
                key={module.id}
                href={`#module-${module.id}`}
                className={cn("rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-slate-700 dark:text-emerald-400 dark:hover:bg-emerald-950/50", focusRing)}
              >
                {module.title}
              </a>
            ))}
          </nav>

          <div className="space-y-4">
            {stage.modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                completed={completed}
                hideCompleted={hideCompleted}
                onToggleTask={onToggleTask}
              />
            ))}
          </div>

          <Pitfalls stage={stage} />
          <ResourceList title="Ресурси рівня" resources={stage.resources} />
        </div>
      ) : null}
    </section>
  );
}

function Fact({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
        {value}
        {hint ? <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">{hint}</span> : null}
      </dd>
    </div>
  );
}

function SubsectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-black text-slate-950 dark:text-white">{children}</h3>;
}

function Outcomes({ stage }: { stage: RoadmapStage }) {
  return (
    <div>
      <SubsectionTitle>Що ви зможете наприкінці етапу</SubsectionTitle>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {stage.outcomes.map((outcome) => {
          const { label, icon: Icon } = SKILLS[outcome.skill];
          return (
            <div key={outcome.skill} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                <span className="grid size-8 place-items-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {label}
              </p>
              <ul className="mt-3 space-y-2">
                {outcome.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    <Check className="mt-1 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChipList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <SubsectionTitle>{title}</SubsectionTitle>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <Badge>{item}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModuleCard({
  module,
  completed,
  hideCompleted,
  onToggleTask,
}: {
  module: RoadmapModule;
  completed: CompletedTasks;
  hideCompleted: boolean;
  onToggleTask: (taskId: string) => void;
}) {
  const Icon = MODULE_ICONS[module.kind];
  const summary = summarizeTasks(module.tasks, completed);
  const tasks = hideCompleted ? module.tasks.filter((task) => !completed[task.id]) : module.tasks;

  return (
    <section
      aria-labelledby={`module-${module.id}`}
      className="rounded-lg border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50/80 px-3 py-3 sm:px-4 dark:border-slate-700 dark:bg-slate-800/40">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={`module-${module.id}`} tabIndex={-1} className="scroll-mt-24 font-black text-slate-950 dark:text-white">
            {module.title}
          </h3>
          {module.intro ? <p className="mt-0.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{module.intro}</p> : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-1 text-xs font-bold tabular-nums",
            summary.total > 0 && summary.done === summary.total
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300",
          )}
        >
          {summary.done}/{summary.total}
        </span>
      </div>
      {tasks.length > 0 ? (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} done={Boolean(completed[task.id])} onToggle={onToggleTask} />
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-emerald-700 sm:px-4 dark:text-emerald-400">
          <CircleCheck className="size-4" aria-hidden="true" />
          Усі пункти модуля виконано
        </p>
      )}
    </section>
  );
}

function TaskItem({ task, done, onToggle }: { task: RoadmapTask; done: boolean; onToggle: (taskId: string) => void }) {
  const inputId = useId();
  const detailsId = `${inputId}-details`;

  return (
    <li
      id={`task-${task.id}`}
      className={cn("px-3 py-4 transition-colors sm:px-4", done && "bg-emerald-50/50 dark:bg-emerald-950/20")}
    >
      <div className="flex gap-3">
        <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
          <input
            id={inputId}
            type="checkbox"
            checked={done}
            onChange={() => onToggle(task.id)}
            aria-describedby={detailsId}
            className={cn(
              "peer size-6 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white transition-colors checked:border-emerald-600 checked:bg-emerald-600 hover:border-emerald-500 dark:border-slate-600 dark:bg-slate-950 dark:checked:border-emerald-500 dark:checked:bg-emerald-500",
              focusRing,
            )}
          />
          <Check
            className="pointer-events-none absolute size-4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            strokeWidth={3}
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={inputId}
              className={cn(
                "cursor-pointer font-bold leading-6",
                done
                  ? "text-slate-500 line-through decoration-emerald-600/50 dark:text-slate-400"
                  : "text-slate-950 dark:text-slate-100",
              )}
            >
              {task.title}
            </label>
            {task.optional ? <Badge variant="sky">опційно</Badge> : null}
          </div>
          <p id={detailsId} className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {task.details}
          </p>
          {task.examples?.length ? (
            <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1" aria-label="Приклади">
              {task.examples.map((example) => (
                <li key={example} className="flex items-center gap-1">
                  <span
                    lang="en"
                    className="rounded bg-slate-100 px-2 py-1 text-sm font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {example}
                  </span>
                  <SpeakButton word={example} className="size-8" />
                </li>
              ))}
            </ul>
          ) : null}
          {task.links?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {task.links.map((link) => (
                <RoadmapLinkChip key={link.href} link={link} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function Pitfalls({ stage }: { stage: RoadmapStage }) {
  return (
    <div>
      <SubsectionTitle>
        <span className="inline-flex items-center gap-2">
          <TriangleAlert className="size-5 text-amber-500" aria-hidden="true" />
          Типові помилки україномовних
        </span>
      </SubsectionTitle>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {stage.pitfalls.map((pitfall) => (
          <li key={pitfall.wrong} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <p className="flex items-start gap-2 text-sm">
              <X className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />
              <span className="sr-only">Неправильно: </span>
              <span className="text-rose-700 line-through decoration-rose-400 dark:text-rose-400">{pitfall.wrong}</span>
            </p>
            <p className="mt-1 flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span className="sr-only">Правильно: </span>
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">{pitfall.right}</span>
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">{pitfall.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResourceList({ title, resources }: { title: string; resources: RoadmapResource[] }) {
  return (
    <div>
      <SubsectionTitle>{title}</SubsectionTitle>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {resources.map((resource) => (
          <li key={resource.label} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            {resource.href ? (
              resource.href.startsWith("/") ? (
                <Link
                  href={resource.href}
                  className={cn("inline-flex items-center gap-1.5 rounded font-bold text-emerald-700 hover:underline dark:text-emerald-400", focusRing)}
                >
                  {resource.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : (
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("inline-flex items-center gap-1.5 rounded font-bold text-emerald-700 hover:underline dark:text-emerald-400", focusRing)}
                >
                  {resource.label}
                  <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                  <span className="sr-only"> (відкриється в новій вкладці)</span>
                </a>
              )
            ) : (
              <span className="font-bold text-slate-900 dark:text-slate-100">{resource.label}</span>
            )}
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{resource.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
