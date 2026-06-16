import { HomeDashboard } from "@/features/home/home-dashboard";
import { getAllWordStatsMetas, getContentSummary } from "@/infrastructure/content/word-repository";
import { PageShell } from "@/shared/ui/page-shell";

export default async function Home() {
  const [words, summary] = await Promise.all([getAllWordStatsMetas(), getContentSummary()]);

  return (
    <PageShell>
      <HomeDashboard words={words} enrichedWords={summary.enrichedWords} />
    </PageShell>
  );
}
