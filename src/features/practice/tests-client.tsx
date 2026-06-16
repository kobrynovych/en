"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ListChecks, XCircle } from "lucide-react";
import { createQuestionPrompt, isCorrectTranslation, isCorrectWord, pickDistractors } from "@/domain/learning/tests";
import type { TestQuestionKind, WordEntry } from "@/domain/learning/types";
import { useHydratedProgress, useProgressStore } from "@/features/progress/use-progress-store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

const questionKinds: TestQuestionKind[] = ["multiple-choice", "type-translation", "type-word", "sentence-builder"];

export function TestsClient({ words }: { words: WordEntry[] }) {
  useHydratedProgress();
  const recordReview = useProgressStore((state) => state.recordReview);
  const recordTestAttempt = useProgressStore((state) => state.recordTestAttempt);
  const [index, setIndex] = useState(0);
  const [kind, setKind] = useState<TestQuestionKind>("multiple-choice");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const studyWords = useMemo(() => words.filter((word) => word.translationsUk.length > 0), [words]);
  const word = studyWords[index % Math.max(studyWords.length, 1)];
  const distractors = word ? pickDistractors(word, studyWords, 3) : [];
  const options = word ? [word, ...distractors].sort((a, b) => a.headword.localeCompare(b.headword)) : [];

  function next() {
    setAnswer("");
    setResult(null);
    setKind(questionKinds[(index + 1) % questionKinds.length]);
    setIndex((current) => (current + 1) % Math.max(studyWords.length, 1));
  }

  async function submit(value = answer) {
    if (!word) return;
    let correct = false;

    if (kind === "multiple-choice") correct = value === word.translationsUk[0];
    if (kind === "type-translation") correct = isCorrectTranslation(word, value);
    if (kind === "type-word") correct = isCorrectWord(word, value);
    if (kind === "sentence-builder") correct = value.trim().length > 0 && value.toLowerCase().includes(word.headword.toLowerCase());

    setResult(correct);
    await recordReview(word.id, correct);
    await recordTestAttempt(
      { id: sessionId, startedAt: new Date().toISOString() },
      {
        sessionId,
        wordId: word.id,
        kind,
        answer: value,
        correct,
      },
    );
  }

  if (!word) {
    return (
      <EmptyState
        icon={<ListChecks className="size-5" aria-hidden="true" />}
        title="Потрібні збагачені слова"
        text="Тести використовують записи з перекладами та прикладами. Додай enrichment JSONL і повтори імпорт."
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-20 lg:pb-0">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Practice testing</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Міні-тести</h1>
        <div className="mt-4 max-w-xs">
          <Select value={kind} onChange={(event) => setKind(event.target.value as TestQuestionKind)}>
            <option value="multiple-choice">Вибір відповіді</option>
            <option value="type-translation">Введення перекладу</option>
            <option value="type-word">Введення слова</option>
            <option value="sentence-builder">Складання речення</option>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span>Питання</span>
            <Badge>{word.cefr}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-lg font-bold text-slate-950">{createQuestionPrompt(kind, word)}</p>

          {kind === "multiple-choice" ? (
            <div className="grid gap-2">
              {options.map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  variant="secondary"
                  className="justify-start"
                  onClick={() => void submit(option.translationsUk[0])}
                  disabled={result !== null}
                >
                  {option.translationsUk[0]}
                </Button>
              ))}
            </div>
          ) : (
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void submit();
              }}
            >
              <Input
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder={kind === "sentence-builder" ? `Напиши речення зі словом ${word.headword}` : "Введи відповідь"}
              />
              <Button type="submit">Перевірити</Button>
            </form>
          )}

          {result !== null ? (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="flex items-center gap-2 font-bold text-slate-950">
                {result ? <CheckCircle2 className="size-5 text-emerald-600" /> : <XCircle className="size-5 text-rose-600" />}
                {result ? "Правильно" : "Потрібне повторення"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Відповідь: <span className="font-semibold">{word.translationsUk.join(", ")}</span>
              </p>
              <Button type="button" className="mt-4" onClick={next}>
                Наступне питання
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
