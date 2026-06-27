"use client";

import Link from "next/link";
import { ArrowLeft, Check, Database, ExternalLink, RotateCcw, Volume2 } from "lucide-react";
import { EXAMPLE_KIND_LABELS, type WordEntry } from "@/domain/learning/types";
import { useHydratedProgress, useProgressStore } from "@/features/progress/use-progress-store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { SpeakButton } from "@/shared/ui/speak-button";

export function WordDetailClient({ word }: { word: WordEntry }) {
  useHydratedProgress();
  const progress = useProgressStore((state) => state.progressByWord[word.id]);
  const toggleLearned = useProgressStore((state) => state.toggleLearned);
  const learned = Boolean(progress?.learned);

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <Button asChild variant="ghost">
        <Link href={`/levels/${word.cefr}`}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          До рівня {word.cefr}
        </Link>
      </Button>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-50 text-emerald-800">{word.cefr}</Badge>
            <Badge>{word.pos}</Badge>
            {word.categories.map((category) => (
              <Badge key={category} className="capitalize">
                {category}
              </Badge>
            ))}
          </div>
          <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-6xl">{word.headword}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600">
            <SpeakButton word={word.headword} size="md" />
            {word.ipa ? (
              <span className="inline-flex items-center gap-2">
                <Volume2 className="size-4" aria-hidden="true" />
                {word.ipa}
              </span>
            ) : (
              <span className="text-amber-700">IPA очікує enrichment</span>
            )}
            {word.britishSpelling ? <span>British: {word.britishSpelling}</span> : null}
          </div>
          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Переклад</p>
            <p className="mt-2 text-2xl font-black text-slate-950">
              {word.translationsUk.length > 0 ? word.translationsUk.join(", ") : "Очікує українське збагачення"}
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={() => void toggleLearned(word.id)} variant={learned ? "primary" : "secondary"}>
              <Check className="size-4" aria-hidden="true" />
              {learned ? "Вивчено" : "Вивчив"}
            </Button>
            <Button asChild variant="secondary">
              <Link href="/practice/flashcards">
                <RotateCcw className="size-4" aria-hidden="true" />
                До практики
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Дані запису</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <InfoRow label="American" value={word.americanSpelling} />
            <InfoRow label="British" value={word.britishSpelling ?? "не відрізняється або не задано"} />
            <InfoRow label="Review box" value={String(progress?.reviewBox ?? 1)} />
            <InfoRow label="Correct" value={String(progress?.correctCount ?? 0)} />
            <InfoRow label="Incorrect" value={String(progress?.incorrectCount ?? 0)} />
            <div>
              <p className="font-bold text-slate-950">Sources</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {word.sourceRefs.map((source) => (
                  <Badge key={source}>{source}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-black text-slate-950">Приклади речень</h2>
          <Badge>{word.examples.length}/5</Badge>
        </div>

        {word.examples.length > 0 ? (
          <div className="grid gap-3">
            {word.examples.map((example) => (
              <Card key={example.kind}>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-sky-50 text-sky-800">{EXAMPLE_KIND_LABELS[example.kind]}</Badge>
                    <Badge>{example.maxCefr}</Badge>
                  </div>
                  <p className="text-lg font-bold text-slate-950">{example.text}</p>
                  <p className="text-base text-slate-700">{example.translationUk}</p>
                  <p className="text-sm leading-6 text-slate-600">{example.contextExplanationUk}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Database className="size-5" aria-hidden="true" />}
            title="Це базовий CEFR-запис"
            text="Слово вже доступне у словнику та фільтрах. IPA, українські переклади й приклади додаються через content/enrichment/*.jsonl без зміни UI."
          />
        )}
      </section>

      <Card>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-600">
            Для повного release-контролю запусти strict validator: він перевірить IPA, переклади, 5 типів речень і джерела для кожного слова.
          </p>
          <Button asChild variant="secondary">
            <a href="https://github.com/openlanguageprofiles/olp-en-cefrj" target="_blank" rel="noreferrer">
              CEFR-J
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
      <span className="font-bold text-slate-950">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
