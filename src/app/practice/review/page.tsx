import { ReviewClient } from "@/features/practice/review-client";
import { getAllWords } from "@/infrastructure/content/word-repository";
import { PageShell } from "@/shared/ui/page-shell";

export const metadata = {
  title: "Повторення — English Path",
};

export default async function ReviewPage() {
  const words = await getAllWords();

  return (
    <PageShell>
      <ReviewClient words={words} />
    </PageShell>
  );
}
