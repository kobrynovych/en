import { notFound } from "next/navigation";
import { WordDetailClient } from "@/features/vocabulary/word-detail-client";
import { getAllWords, getWordBySlug } from "@/infrastructure/content/word-repository";
import { PageShell } from "@/shared/ui/page-shell";

export async function generateStaticParams() {
  const words = await getAllWords();
  return words.map((word) => ({ slug: word.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const word = await getWordBySlug(slug);
  return {
    title: word ? `${word.headword} — English Path` : "Слово — English Path",
  };
}

export default async function WordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const word = await getWordBySlug(slug);

  if (!word) notFound();

  return (
    <PageShell>
      <WordDetailClient word={word} />
    </PageShell>
  );
}
