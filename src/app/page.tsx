import { HomeDashboard } from "@/features/home/home-dashboard";
import { getAllWords, getContentSummary } from "@/infrastructure/content/word-repository";
import { PageShell } from "@/shared/ui/page-shell";

export default async function Home() {
  const [words, summary] = await Promise.all([getAllWords(), getContentSummary()]);

  return (
    <PageShell>
      <HomeDashboard words={words} enrichedWords={summary.enrichedWords} />
    </PageShell>
  );
}
