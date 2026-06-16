"use client";

import { useMemo, useRef } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { matchesVocabularyFilters } from "@/domain/learning/search";
import type { ActiveCefrLevel, PartOfSpeech, WordEntry } from "@/domain/learning/types";
import { percentage } from "@/domain/learning/progress";
import { useHydratedProgress, useProgressStore } from "@/features/progress/use-progress-store";
import { useVocabularyStore } from "@/features/vocabulary/use-vocabulary-store";
import { WordCard } from "@/features/vocabulary/word-card";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { Input } from "@/shared/ui/input";
import { Progress } from "@/shared/ui/progress";
import { Select } from "@/shared/ui/select";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/cn";

export function LevelVocabularyClient({
  level,
  words,
  categories,
  partsOfSpeech,
}: {
  level: ActiveCefrLevel;
  words: WordEntry[];
  categories: string[];
  partsOfSpeech: PartOfSpeech[];
}) {
  useHydratedProgress();
  const parentRef = useRef<HTMLDivElement | null>(null);
  const progressByWord = useProgressStore((state) => state.progressByWord);
  const toggleLearned = useProgressStore((state) => state.toggleLearned);
  const filters = useVocabularyStore((state) => state.getFilters(level));
  const setQuery = useVocabularyStore((state) => state.setQuery);
  const setLearned = useVocabularyStore((state) => state.setLearned);
  const toggleCategory = useVocabularyStore((state) => state.toggleCategory);
  const togglePartOfSpeech = useVocabularyStore((state) => state.togglePartOfSpeech);
  const resetFilters = useVocabularyStore((state) => state.resetFilters);

  const levelProgressPercent = useMemo(() => {
    const learned = words.filter((word) => progressByWord[word.id]?.learned).length;
    return percentage(learned, words.length);
  }, [progressByWord, words]);
  const filteredWords = useMemo(
    () => words.filter((word) => matchesVocabularyFilters(word, progressByWord[word.id], filters)),
    [filters, progressByWord, words],
  );

  // TanStack Virtual intentionally returns imperative helpers; the hook is safe here because rows are not memoized across stores.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: filteredWords.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 102,
    overscan: 8,
  });

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="min-w-0 space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Рівень {level}</p>
              <h1 className="mt-1 text-2xl font-black text-slate-950">Словник {level}</h1>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {words.length.toLocaleString("uk-UA")} слів CEFR-J, {filteredWords.length.toLocaleString("uk-UA")} показано за фільтрами.
              </p>
            </div>
            <div className="min-w-48">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Прогрес</span>
                <span>{levelProgressPercent}%</span>
              </div>
              <Progress value={levelProgressPercent} label={`Прогрес рівня ${level}`} />
            </div>
          </div>
        </div>

        <div className="sticky top-[65px] z-30 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="grid gap-2 sm:grid-cols-[1fr_180px_auto]">
            <label className="relative block">
              <span className="sr-only">Пошук слова або перекладу</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <Input
                value={filters.query}
                onChange={(event) => setQuery(level, event.target.value)}
                placeholder="Пошук англійською або українською"
                className="pl-9"
              />
            </label>
            <Select value={filters.learned} onChange={(event) => setLearned(level, event.target.value as typeof filters.learned)}>
              <option value="all">Всі слова</option>
              <option value="learned">Вивчені</option>
              <option value="unlearned">Не вивчені</option>
            </Select>
            <Button type="button" variant="secondary" onClick={() => resetFilters(level)}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Скинути
            </Button>
          </div>
        </div>

        {filteredWords.length > 0 ? (
          <div ref={parentRef} className="h-[68vh] overflow-auto rounded-lg border border-slate-200 bg-white">
            <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const word = filteredWords[virtualItem.index];
                return (
                  <div
                    key={word.id}
                    className="absolute left-0 top-0 w-full"
                    style={{ transform: `translateY(${virtualItem.start}px)` }}
                  >
                    <WordCard word={word} progress={progressByWord[word.id]} onToggleLearned={(wordId) => void toggleLearned(wordId)} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<SlidersHorizontal className="size-5" aria-hidden="true" />}
            title="Нічого не знайдено"
            text="Спробуй змінити пошук або прибрати частину фільтрів."
          />
        )}
      </section>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Категорії</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = filters.categories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(level, category)}
                  className={cn(
                    "rounded-md border px-2.5 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                    active ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Частини мови</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {partsOfSpeech.map((pos) => {
              const active = filters.partsOfSpeech.includes(pos);
              return (
                <button
                  key={pos}
                  type="button"
                  onClick={() => togglePartOfSpeech(level, pos)}
                  className={cn(
                    "rounded-md border px-2.5 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                    active ? "border-sky-600 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {pos}
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Стан контенту</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              <Badge className="mr-2 bg-amber-50 text-amber-800">base</Badge>
              означає імпортований CEFR-запис, який чекає на повне IPA/переклад/приклади у enrichment JSONL.
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
