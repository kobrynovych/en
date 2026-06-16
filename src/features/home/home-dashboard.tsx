"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BarChart3, BookOpenCheck, Brain, ClipboardCheck, Database, RotateCcw, Sparkles } from "lucide-react";
import { computeLearningStats, type StatsWordMeta } from "@/domain/learning/stats";
import { useHydratedProgress, useProgressStore } from "@/features/progress/use-progress-store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";

export function HomeDashboard({
  words,
  enrichedWords,
}: {
  words: StatsWordMeta[];
  enrichedWords: number;
}) {
  useHydratedProgress();
  const progressByWord = useProgressStore((state) => state.progressByWord);
  const stats = computeLearningStats(words, progressByWord);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-50 text-emerald-800">CEFR A1-B1</Badge>
            <Badge className="bg-sky-50 text-sky-800">Local-first</Badge>
            <Badge className="bg-amber-50 text-amber-800">Spaced repetition</Badge>
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
            Самостійне вивчення англійської через словник, приклади і повторення
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Платформа поєднує CEFR-словник, активне пригадування, флеш-картки, міні-тести й локальне відстеження прогресу без облікового запису.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/levels/A1">
                Почати з A1
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/practice/review">
                <RotateCcw className="size-4" aria-hidden="true" />
                Повторення
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Загальний прогрес</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>{stats.learnedWords.toLocaleString("uk-UA")} вивчено</span>
                <span>{stats.overallProgressPercent}%</span>
              </div>
              <Progress value={stats.overallProgressPercent} label="Загальний прогрес" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric icon={<Database className="size-4" />} label="Слів у базі" value={stats.totalWords.toLocaleString("uk-UA")} />
              <Metric icon={<BookOpenCheck className="size-4" />} label="Збагачено" value={enrichedWords.toLocaleString("uk-UA")} />
              <Metric icon={<RotateCcw className="size-4" />} label="До повторення" value={stats.dueWords.toLocaleString("uk-UA")} />
              <Metric icon={<BarChart3 className="size-4" />} label="Точність" value={`${stats.accuracyPercent}%`} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.levels.map((level) => (
          <Link
            key={level.level}
            href={`/levels/${level.level}`}
            className="rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Рівень</p>
                <h2 className="mt-1 text-3xl font-black text-slate-950">{level.level}</h2>
              </div>
              <span className="grid size-12 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              {level.total.toLocaleString("uk-UA")} слів, {level.learned.toLocaleString("uk-UA")} вивчено
            </p>
            <div className="mt-4">
              <Progress value={level.progressPercent} label={`Прогрес ${level.level}`} />
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Навчальні режими</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <ModeLink href="/practice/flashcards" icon={<Brain className="size-5" />} label="Флеш-картки" />
            <ModeLink href="/practice/review" icon={<RotateCcw className="size-5" />} label="Leitner" />
            <ModeLink href="/practice/tests" icon={<ClipboardCheck className="size-5" />} label="Міні-тести" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Категорії з найбільшим покриттям</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.categories.slice(0, 6).map((category) => (
              <div key={category.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold capitalize text-slate-800">{category.category}</span>
                  <span className="text-slate-500">{category.progressPercent}%</span>
                </div>
                <Progress value={category.progressPercent} label={`Прогрес категорії ${category.category}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function ModeLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-28 flex-col justify-between rounded-md border border-slate-200 bg-slate-50 p-4 font-bold text-slate-950 transition hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
    >
      <span className="text-emerald-700">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
