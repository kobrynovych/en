import { FlashcardsClient } from "@/features/practice/flashcards-client";
import { getPracticeWords } from "@/infrastructure/content/word-repository";
import { PageShell } from "@/shared/ui/page-shell";

export const metadata = {
  title: "Флеш-картки — English Path",
};

export default async function FlashcardsPage() {
  const words = await getPracticeWords();

  return (
    <PageShell>
      <FlashcardsClient words={words} />
    </PageShell>
  );
}
