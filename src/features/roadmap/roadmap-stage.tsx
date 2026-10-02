"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
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
  PencilLine,
  SpellCheck,
  StickyNote,
  TriangleAlert,
  Undo2,
  X,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { SpeakButton } from "@/shared/ui/speak-button";
import { cn } from "@/shared/lib/cn";
import { AiStudyMenu } from "./ai-study-menu";
import { matchesStatus, type StatusFilter } from "./filters";
import { Highlight } from "./highlight";
import type { TaskNote, TaskNotes } from "./notes";
import { getStageStatus, summarizeStage, summarizeTasks, type CompletedTasks, type StageStatus } from "./progress";
import { TaskNoteEditor, TaskNotePreview } from "./task-note";
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
  // -700 shades keep white text above the WCAG AA 4.5:1 contrast ratio.
  a1: "bg-emerald-700 text-white",
  a2: "bg-sky-700 text-white",
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

export function RoadmapLinkChip({ link, terms }: { link: RoadmapLink; terms?: readonly string[] }) {
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
        <Highlight text={link.label} terms={terms} />
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
      <Highlight text={link.label} terms={terms} />
      <ExternalLink className="size-3.5" aria-hidden="true" />
      <span className="sr-only"> (відкриється в новій вкладці)</span>
    </a>
  );
}

/** Checklist state and handlers shared by every list of tasks (the plan and the search results). */
export interface TaskListProps {
  completed: CompletedTasks;
  notes: TaskNotes;
  /** Tasks with an open note editor or a pending undo stay visible whatever the filters say. */
  pinned: ReadonlySet<string>;
  onToggleTask: (taskId: string) => void;
  /** Returns false when the note could not be written to localStorage. */
  onSaveNote: (taskId: string, text: string) => boolean;
  onPinChange: (taskId: string, pinned: boolean) => void;
}

interface StageSectionProps extends TaskListProps {
  stage: RoadmapStage;
  expanded: boolean;
  status: StatusFilter;
  onToggleExpanded: (stageId: RoadmapStageId) => void;
}

export function StageSection({ stage, expanded, status: statusFilter, onToggleExpanded, ...taskList }: StageSectionProps) {
  const { completed } = taskList;
  const summary = summarizeStage(stage, completed);
  const status = getStageStatus(summary);
  const contentId = `stage-${stage.id}-content`;

  return (
    <section
      id={`stage-${stage.id}`}
      aria-labelledby={`stage-${stage.id}-title`}
      className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
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
            {stage.modules.map((roadmapModule) => (
              <ModuleCard
                key={roadmapModule.id}
                stage={stage}
                roadmapModule={roadmapModule}
                status={statusFilter}
                {...taskList}
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

interface ModuleCardProps extends TaskListProps {
  stage: RoadmapStage;
  roadmapModule: RoadmapModule;
  status: StatusFilter;
  /** Search results pass the matching tasks; otherwise the status filter decides. */
  visibleTasks?: readonly RoadmapTask[];
  highlightTerms?: readonly string[];
}

export function ModuleCard({
  stage,
  roadmapModule,
  status,
  visibleTasks,
  highlightTerms,
  completed,
  notes,
  pinned,
  onToggleTask,
  onSaveNote,
  onPinChange,
}: ModuleCardProps) {
  const Icon = MODULE_ICONS[roadmapModule.kind];
  const summary = summarizeTasks(roadmapModule.tasks, completed);
  const tasks =
    visibleTasks ??
    roadmapModule.tasks.filter((task) => pinned.has(task.id) || matchesStatus(Boolean(completed[task.id]), status));

  // A plain container: dozens of module regions named "Граматика", "Лексика"… would make landmark navigation ambiguous.
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50/80 px-3 py-3 sm:px-4 dark:border-slate-700 dark:bg-slate-800/40">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={`module-${roadmapModule.id}`} tabIndex={-1} className="font-black text-slate-950 dark:text-white">
            <Highlight text={roadmapModule.title} terms={highlightTerms} />
          </h3>
          {roadmapModule.intro ? (
            <p className="mt-0.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{roadmapModule.intro}</p>
          ) : null}
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
            <TaskItem
              key={task.id}
              stage={stage}
              roadmapModule={roadmapModule}
              task={task}
              done={Boolean(completed[task.id])}
              note={notes[task.id]}
              highlightTerms={highlightTerms}
              onToggle={onToggleTask}
              onSaveNote={onSaveNote}
              onPinChange={onPinChange}
            />
          ))}
        </ul>
      ) : status === "done" ? (
        <p className="px-3 py-3 text-sm font-semibold text-slate-600 sm:px-4 dark:text-slate-400">
          Виконаних пунктів у модулі ще немає
        </p>
      ) : (
        <p className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-emerald-700 sm:px-4 dark:text-emerald-400">
          <CircleCheck className="size-4" aria-hidden="true" />
          Усі пункти модуля виконано
        </p>
      )}
    </div>
  );
}

const chipButton = cn(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors",
  focusRing,
);

interface TaskItemProps {
  stage: RoadmapStage;
  roadmapModule: RoadmapModule;
  task: RoadmapTask;
  done: boolean;
  note: TaskNote | undefined;
  highlightTerms: readonly string[] | undefined;
  onToggle: (taskId: string) => void;
  onSaveNote: (taskId: string, text: string) => boolean;
  onPinChange: (taskId: string, pinned: boolean) => void;
}

// Memoised: checking one task or typing a note must not re-render the other ~200 tasks.
const TaskItem = memo(function TaskItem({
  stage,
  roadmapModule,
  task,
  done,
  note,
  highlightTerms,
  onToggle,
  onSaveNote,
  onPinChange,
}: TaskItemProps) {
  const inputId = useId();
  const detailsId = `${inputId}-details`;
  const noteId = `${inputId}-note`;
  const [editingNote, setEditingNote] = useState(false);
  // The text of a just-deleted note while its undo control is shown.
  const [deletedNote, setDeletedNote] = useState<string | null>(null);
  const noteButtonRef = useRef<HTMLButtonElement>(null);
  const undoButtonRef = useRef<HTMLButtonElement>(null);
  const keepVisible = editingNote || deletedNote !== null;
  const noteLabel = note ? "Редагувати нотатку" : "Додати нотатку";

  useEffect(() => {
    if (!keepVisible) return;
    onPinChange(task.id, true);
    return () => onPinChange(task.id, false);
  }, [keepVisible, task.id, onPinChange]);

  useEffect(() => {
    if (deletedNote !== null) undoButtonRef.current?.focus();
  }, [deletedNote]);

  const saveNote = useCallback((text: string) => onSaveNote(task.id, text), [onSaveNote, task.id]);

  function toggleNoteEditor() {
    setDeletedNote(null);
    setEditingNote((value) => !value);
  }

  function closeNoteEditor() {
    setEditingNote(false);
    noteButtonRef.current?.focus();
  }

  function deleteNote(text: string) {
    onSaveNote(task.id, "");
    setEditingNote(false);
    setDeletedNote(text);
  }

  function closeUndo(restore: boolean) {
    if (restore && deletedNote) onSaveNote(task.id, deletedNote);
    setDeletedNote(null);
    noteButtonRef.current?.focus();
  }

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
              <Highlight text={task.title} terms={highlightTerms} />
            </label>
            {task.optional ? <Badge variant="sky">опційно</Badge> : null}
          </div>
          <p id={detailsId} className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            <Highlight text={task.details} terms={highlightTerms} />
          </p>
          {task.examples?.length ? (
            <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1" aria-label="Приклади">
              {task.examples.map((example) => (
                // min-h-8 reserves the speak button's height, so rows do not jump when it mounts after hydration.
                <li key={example} className="flex min-h-8 items-center gap-1">
                  <span
                    lang="en"
                    className="rounded bg-slate-100 px-2 py-1 text-sm font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Highlight text={example} terms={highlightTerms} />
                  </span>
                  <SpeakButton word={example} className="size-8" />
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <AiStudyMenu stage={stage} roadmapModule={roadmapModule} task={task} />
            <button
              ref={noteButtonRef}
              type="button"
              aria-expanded={editingNote}
              aria-controls={editingNote ? noteId : undefined}
              aria-label={`${noteLabel}: ${task.title}`}
              onClick={toggleNoteEditor}
              className={cn(
                chipButton,
                "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
                "dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950",
              )}
            >
              {note ? (
                <PencilLine className="size-3.5" aria-hidden="true" />
              ) : (
                <StickyNote className="size-3.5" aria-hidden="true" />
              )}
              {noteLabel}
            </button>
            {task.links?.map((link) => (
              <RoadmapLinkChip key={link.href} link={link} terms={highlightTerms} />
            ))}
          </div>
          {editingNote ? (
            <TaskNoteEditor
              id={noteId}
              taskTitle={task.title}
              initialText={note?.text ?? ""}
              onSave={saveNote}
              onDone={closeNoteEditor}
              onDelete={deleteNote}
            />
          ) : note ? (
            <TaskNotePreview note={note} terms={highlightTerms} />
          ) : null}
          {deletedNote !== null ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <span>Нотатку видалено.</span>
              <button
                ref={undoButtonRef}
                type="button"
                aria-label="Відновити нотатку"
                onClick={() => closeUndo(true)}
                className={cn("inline-flex items-center gap-1 rounded font-semibold text-emerald-700 hover:underline dark:text-emerald-400", focusRing)}
              >
                <Undo2 className="size-4" aria-hidden="true" />
                Відновити
              </button>
              <button
                type="button"
                aria-label="Закрити повідомлення"
                onClick={() => closeUndo(false)}
                className={cn("ml-auto grid size-8 place-items-center rounded-md text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700", focusRing)}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
});

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
