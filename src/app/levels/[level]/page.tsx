import { notFound } from "next/navigation";
import { ACTIVE_LEVELS, type ActiveCefrLevel } from "@/domain/learning/types";
import { LevelVocabularyClient } from "@/features/vocabulary/level-vocabulary-client";
import { getContentSummary, getWordsByLevel } from "@/infrastructure/content/word-repository";
import { PageShell } from "@/shared/ui/page-shell";

export function generateStaticParams() {
  return ACTIVE_LEVELS.map((level) => ({ level }));
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  return {
    title: `Словник ${level} — English Path`,
  };
}

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: rawLevel } = await params;
  const level = rawLevel.toUpperCase() as ActiveCefrLevel;

  if (!ACTIVE_LEVELS.includes(level)) notFound();

  const [words, summary] = await Promise.all([getWordsByLevel(level), getContentSummary()]);

  return (
    <PageShell>
      <LevelVocabularyClient
        level={level}
        words={words}
        categories={summary.categories}
        partsOfSpeech={summary.partsOfSpeech}
      />
    </PageShell>
  );
}
