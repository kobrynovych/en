"use client";

import { AlertTriangle, BarChart3, RefreshCcw } from "lucide-react";
import { computeLearningStats, type StatsWordMeta } from "@/domain/learning/stats";
import { useHydratedProgress, useProgressStore } from "@/features/progress/use-progress-store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";

export function StatsClient({ words }: { words: StatsWordMeta[] }) {
  useHydratedProgress();
  const progressByWord = useProgressStore((state) => state.progressByWord);
  const resetAllProgress = useProgressStore((state) => state.resetAllProgress);
  const stats = computeLearningStats(words, progressByWord);

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Learning analytics</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Статистика</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Усі дані зберігаються локально в IndexedDB цього браузера.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Вивчено" value={stats.learnedWords.toLocaleString("uk-UA")} />
        <Metric label="Не вивчено" value={stats.unlearnedWords.toLocaleString("uk-UA")} />
        <Metric label="До повторення" value={stats.dueWords.toLocaleString("uk-UA")} />
        <Metric label="Точність" value={`${stats.accuracyPercent}%`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-emerald-700" aria-hidden="true" />
              Прогрес по рівнях
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {stats.levels.map((level) => (
              <div key={level.level}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-black text-slate-950">{level.level}</span>
                  <span className="font-semibold text-slate-600">
                    {level.learned}/{level.total} · {level.progressPercent}%
                  </span>
                </div>
                <Progress value={level.progressPercent} label={`Прогрес ${level.level}`} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Найбільші категорії</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.categories.slice(0, 10).map((category) => (
              <div key={category.category}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold capitalize text-slate-950">{category.category}</span>
                  <span className="text-slate-600">
                    {category.learned}/{category.total}
                  </span>
                </div>
                <Progress value={category.progressPercent} label={`Прогрес категорії ${category.category}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-600" aria-hidden="true" />
            Локальні дані
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm leading-6 text-slate-600">
              Очищення видалить позначки “вивчено”, історію повторень і результати тестів у цьому браузері.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>IndexedDB</Badge>
              <Badge>offline-ready</Badge>
              <Badge>no account</Badge>
            </div>
          </div>
          <Button type="button" variant="danger" onClick={() => void resetAllProgress()}>
            <RefreshCcw className="size-4" aria-hidden="true" />
            Очистити прогрес
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}
