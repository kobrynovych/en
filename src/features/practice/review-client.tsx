"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, RotateCcw, XCircle } from "lucide-react";
import { isDue } from "@/domain/learning/progress";
import type { WordEntry } from "@/domain/learning/types";
import { useHydratedProgress, useProgressStore } from "@/features/progress/use-progress-store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";

export function ReviewClient({ words }: { words: WordEntry[] }) {
  useHydratedProgress();
  const progressByWord = useProgressStore((state) => state.progressByWord);
  const recordReview = useProgressStore((state) => state.recordReview);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const dueWords = useMemo(() => {
    const enriched = words.filter((word) => word.translationsUk.length > 0);
    const due = enriched.filter((word) => isDue(progressByWord[word.id]));
    return due.length > 0 ? due : enriched.filter((word) => !progressByWord[word.id]?.learned).slice(0, 20);
  }, [progressByWord, words]);

  const word = dueWords[index % Math.max(dueWords.length, 1)];

  async function answer(correct: boolean) {
    if (!word) return;
    await recordReview(word.id, correct);
    setRevealed(false);
    setIndex((current) => (current + 1) % Math.max(dueWords.length, 1));
  }

  if (!word) {
    return (
      <EmptyState
        icon={<RotateCcw className="size-5" aria-hidden="true" />}
        title="Немає слів до повторення"
        text="Познач слова як вивчені або додай enrichment-пакет з перекладами, щоб запустити Leitner-сесію."
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-20 lg:pb-0">
      <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Leitner system</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-slate-100">Повторення</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Правильна відповідь піднімає слово до наступної коробки, помилка повертає його до першої.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span>{word.headword}</span>
            <Badge>Box {progressByWord[word.id]?.reviewBox ?? 1}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md bg-slate-50 p-6 text-center dark:bg-slate-800">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Пригадай переклад</p>
            <p className="mt-5 text-4xl font-black text-slate-950 dark:text-slate-100">{word.headword}</p>
            {revealed ? (
              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{word.translationsUk.join(", ")}</p>
                {word.examples[0] ? <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{word.examples[0].text}</p> : null}
              </div>
            ) : null}
          </div>
          {!revealed ? (
            <Button type="button" size="lg" onClick={() => setRevealed(true)} className="w-full">
              <Eye className="size-4" aria-hidden="true" />
              Показати
            </Button>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              <Button type="button" variant="secondary" onClick={() => void answer(false)}>
                <XCircle className="size-4" aria-hidden="true" />
                Не згадав
              </Button>
              <Button type="button" onClick={() => void answer(true)}>
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Згадав
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Button asChild variant="ghost">
        <Link href={`/words/${word.slug}`}>Відкрити повну картку слова</Link>
      </Button>
    </div>
  );
}
