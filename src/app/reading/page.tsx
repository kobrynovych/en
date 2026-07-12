import type { Metadata } from "next";
import { ReadingTrainer } from "@/features/reading/reading-trainer";
import { PageShell } from "@/shared/ui/page-shell";

export const metadata: Metadata = {
  title: "Читання англійською — English Path",
  description: "Тренажер вимови англійських слів, речень та абзаців.",
};

export default function ReadingPage() {
  return (
    <PageShell>
      <ReadingTrainer />
    </PageShell>
  );
}
