"use client";

import Link from "next/link";
import { Check, ChevronRight, Volume2 } from "lucide-react";
import type { WordEntry, WordProgress } from "@/domain/learning/types";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { SpeakButton } from "@/shared/ui/speak-button";
import { cn } from "@/shared/lib/cn";

export function WordCard({
  word,
  progress,
  onToggleLearned,
}: {
  word: WordEntry;
  progress?: WordProgress;
  onToggleLearned: (wordId: string) => void;
}) {
  const learned = Boolean(progress?.learned);

  return (
    <article className="grid min-h-24 grid-cols-[1fr_auto] gap-3 border-b border-slate-100 bg-white px-4 py-3 transition hover:bg-slate-50">
      <Link href={`/words/${word.slug}`} className="min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-base font-black text-slate-950">{word.headword}</h2>
          <Badge className="bg-emerald-50 text-emerald-800">{word.cefr}</Badge>
          <Badge>{word.pos}</Badge>
          {word.translationsUk.length === 0 ? <Badge className="bg-amber-50 text-amber-800">base</Badge> : null}
        </div>
        <p className="mt-1 text-sm text-slate-600">
          {word.translationsUk.length > 0 ? word.translationsUk.join(", ") : "Базовий CEFR-запис, очікує українське збагачення"}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {word.categories.slice(0, 3).map((category) => (
            <span key={category} className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
              {category}
            </span>
          ))}
        </div>
      </Link>
      <div className="flex items-center gap-1">
        {word.ipa ? (
          <span className="hidden items-center gap-1 text-xs font-semibold text-slate-500 sm:inline-flex">
            <Volume2 className="size-3.5" aria-hidden="true" />
            {word.ipa}
          </span>
        ) : null}
        <SpeakButton word={word.headword} />
        <Button
          type="button"
          size="icon"
          variant={learned ? "primary" : "secondary"}
          aria-label={learned ? `Зняти позначку з ${word.headword}` : `Позначити ${word.headword} як вивчене`}
          title={learned ? "Вивчено" : "Позначити як вивчене"}
          onClick={() => onToggleLearned(word.id)}
          className={cn("shrink-0", learned && "bg-emerald-600")}
        >
          <Check className="size-4" aria-hidden="true" />
        </Button>
        <Button asChild size="icon" variant="ghost" aria-label={`Відкрити ${word.headword}`}>
          <Link href={`/words/${word.slug}`}>
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
