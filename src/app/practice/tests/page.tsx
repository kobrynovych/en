import { TestsClient } from "@/features/practice/tests-client";
import { getAllWords } from "@/infrastructure/content/word-repository";
import { PageShell } from "@/shared/ui/page-shell";

export const metadata = {
  title: "Міні-тести — English Path",
};

export default async function TestsPage() {
  const words = await getAllWords();

  return (
    <PageShell>
      <TestsClient words={words} />
    </PageShell>
  );
}
