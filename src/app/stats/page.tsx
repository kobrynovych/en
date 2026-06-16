import { StatsClient } from "@/features/stats/stats-client";
import { getAllWords } from "@/infrastructure/content/word-repository";
import { PageShell } from "@/shared/ui/page-shell";

export const metadata = {
  title: "Статистика — English Path",
};

export default async function StatsPage() {
  const words = await getAllWords();

  return (
    <PageShell>
      <StatsClient words={words} />
    </PageShell>
  );
}
