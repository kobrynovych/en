"use client";

import { useMemo, useRef, useState } from "react";
import { BookMarked, Info, Search, X } from "lucide-react";
import type { CefrLevel, IrregularVerbEntry } from "./data";
import { Badge } from "@/shared/ui/badge";
import type { BadgeProps } from "@/shared/ui/badge";
import { EmptyState } from "@/shared/ui/empty-state";
import { SpeakButton } from "@/shared/ui/speak-button";
import { cn } from "@/shared/lib/cn";

const CEFR_LEVELS: CefrLevel[] = ["A1", "A2", "B1"];

const cefrBadgeVariant: Record<CefrLevel, BadgeProps["variant"]> = {
  A1: "emerald",
  A2: "sky",
  B1: "amber",
};

function ukrainianVerbCount(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} дієслово`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} дієслова`;
  return `${n} дієслів`;
}

/** Renders a list of verb forms, each with its own SpeakButton. */
function VerbForms({
  forms,
  speakOverride,
  isBase = false,
}: {
  forms: string[];
  speakOverride?: Record<string, string>;
  isBase?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-y-1">
      {forms.map((form, i) => (
        <span key={form} className="inline-flex items-center gap-0.5">
          {i > 0 && <span className="mx-1.5 text-slate-400">/</span>}
          <span className={isBase ? "font-medium" : undefined}>{form}</span>
          <SpeakButton word={speakOverride?.[form] ?? form} />
        </span>
      ))}
    </div>
  );
}

export function IrregularVerbsClient({ verbs }: { verbs: IrregularVerbEntry[] }) {
  const [activeLevels, setActiveLevels] = useState<Set<CefrLevel>>(new Set());
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredVerbs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return verbs.filter((v) => {
      // CEFR level filter
      if (activeLevels.size > 0 && !activeLevels.has(v.cefr)) return false;
      // Search: match base, any past simple/participle form, or translation
      if (q) {
        const inBase = v.base.toLowerCase().includes(q);
        const inSimple = v.pastSimple.some((f) => f.toLowerCase().includes(q));
        const inParticiple = v.pastParticiple.some((f) => f.toLowerCase().includes(q));
        const inTranslation = v.translationUk.toLowerCase().includes(q);
        if (!inBase && !inSimple && !inParticiple && !inTranslation) return false;
      }
      return true;
    });
  }, [verbs, activeLevels, query]);

  function toggleLevel(level: CefrLevel) {
    setActiveLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  }

  function clearSearch() {
    setQuery("");
    searchRef.current?.focus();
  }

  return (
    <div className="space-y-4">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">Неправильні дієслова</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Повний список неправильних дієслів англійської мови з перекладом і вимовою
        </p>
      </div>

      {/* Controls row: search + level filter */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук по дієслову або перекладу…"
            aria-label="Пошук дієслів"
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Очистити пошук"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:text-slate-300"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Level toggle buttons + count */}
        <div className="flex flex-wrap items-center gap-2">
          {CEFR_LEVELS.map((level) => {
            const active = activeLevels.has(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggleLevel(level)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                  active
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800",
                )}
              >
                {level}
              </button>
            );
          })}
          <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">
            {"Показано " + ukrainianVerbCount(filteredVerbs.length)}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-[1040px]">
        {filteredVerbs.length === 0 ? (
          <EmptyState
            icon={<BookMarked className="size-5" aria-hidden="true" />}
            title="Нічого не знайдено"
            text="Зміни пошук або скасуй фільтр рівня, щоб побачити дієслова."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-700 dark:bg-slate-800">
                  <th scope="col" className="w-24 px-3 py-3 font-semibold text-slate-500 dark:text-slate-400">
                    #
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                    Base form
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                    Past Simple
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                    Past Participle
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                    Переклад
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVerbs.map((verb, index) => (
                  <tr
                    key={verb.base}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    {/* # — row number + CEFR badge */}
                    <td className="px-3 py-3 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="w-6 shrink-0 text-right text-xs font-mono tabular-nums text-slate-400 dark:text-slate-300">
                          {index + 1}
                        </span>
                        <Badge variant={cefrBadgeVariant[verb.cefr]}>{verb.cefr}</Badge>
                      </div>
                    </td>

                    {/* Base form */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <VerbForms forms={[verb.base]} isBase />
                        {verb.pronunciationNote && (
                          <span
                            className="group relative inline-flex shrink-0 cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            aria-label={verb.pronunciationNote}
                            title={verb.pronunciationNote}
                          >
                            <Info className="size-3.5" aria-hidden="true" />
                            <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 w-64 -translate-x-1/2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-700 opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              {verb.pronunciationNote}
                            </span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Past Simple */}
                    <td className="px-4 py-3">
                      <VerbForms forms={verb.pastSimple} speakOverride={verb.speakOverride} />
                    </td>

                    {/* Past Participle */}
                    <td className="px-4 py-3">
                      <VerbForms forms={verb.pastParticiple} speakOverride={verb.speakOverride} />
                    </td>

                    {/* Translation */}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{verb.translationUk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
