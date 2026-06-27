"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Languages, Shuffle } from "lucide-react";
import type { WordEntry } from "@/domain/learning/types";
import { useHydratedProgress, useProgressStore } from "@/features/progress/use-progress-store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { Select } from "@/shared/ui/select";
import { SpeakButton } from "@/shared/ui/speak-button";

type Direction = "word-to-translation" | "translation-to-word" | "random";

export function FlashcardsClient({ words }: { words: WordEntry[] }) {
  useHydratedProgress();
  const recordReview = useProgressStore((state) => state.recordReview);
  const [direction, setDirection] = useState<Direction>("word-to-translation");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const studyWords = useMemo(() => words.filter((word) => word.translationsUk.length > 0), [words]);
  const word = studyWords[index % Math.max(studyWords.length, 1)];
  const effectiveDirection = direction === "random" ? (index % 2 === 0 ? "word-to-translation" : "translation-to-word") : direction;

  function next() {
    setRevealed(false);
    setIndex((current) => (current + 1) % Math.max(studyWords.length, 1));
  }

  async function answer(correct: boolean) {
    if (!word) return;
    await recordReview(word.id, correct);
    next();
  }

  if (studyWords.length === 0) {
    return (
      <EmptyState
        icon={<Languages className="size-5" aria-hidden="true" />}
        title="Потрібні збагачені слова"
        text="Флеш-картки беруть тільки записи з українським перекладом. Додай entries у content/enrichment/*.jsonl і запусти імпорт."
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-20 lg:pb-0">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Active recall</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Флеш-картки</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Спочатку спробуй пригадати відповідь, потім відкрий картку і оціни себе.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Select value={direction} onChange={(event) => setDirection(event.target.value as Direction)}>
            <option value="word-to-translation">слово → переклад</option>
            <option value="translation-to-word">переклад → слово</option>
            <option value="random">випадковий порядок</option>
          </Select>
          <Button type="button" variant="secondary" onClick={next}>
            <Shuffle className="size-4" aria-hidden="true" />
            Наступна
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span>Картка {index + 1}</span>
            <Badge>{word.cefr}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="min-h-48 rounded-md bg-slate-50 p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
              {effectiveDirection === "word-to-translation" ? "Англійське слово" : "Український переклад"}
            </p>
            <p className="mt-5 text-4xl font-black text-slate-950">
              {effectiveDirection === "word-to-translation" ? word.headword : word.translationsUk[0]}
            </p>
            {effectiveDirection === "word-to-translation" ? (
              <div className="mt-3 flex justify-center">
                <SpeakButton word={word.headword} size="md" />
              </div>
            ) : null}
            {revealed ? (
              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Відповідь</p>
                <p className="mt-2 text-2xl font-black text-emerald-700">
                  {effectiveDirection === "word-to-translation" ? word.translationsUk.join(", ") : word.headword}
                </p>
                {effectiveDirection === "translation-to-word" ? (
                  <div className="mt-2 flex justify-center">
                    <SpeakButton word={word.headword} size="md" />
                  </div>
                ) : null}
                {word.ipa ? <p className="mt-2 text-sm font-semibold text-slate-500">{word.ipa}</p> : null}
              </div>
            ) : null}
          </div>

          {!revealed ? (
            <Button type="button" size="lg" onClick={() => setRevealed(true)}>
              <Eye className="size-4" aria-hidden="true" />
              Показати відповідь
            </Button>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              <Button type="button" variant="secondary" onClick={() => void answer(false)}>
                Ще повторити
              </Button>
              <Button type="button" onClick={() => void answer(true)}>
                Згадав правильно
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Button asChild variant="ghost">
        <Link href={`/words/${word.slug}`}>
          Відкрити слово
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
