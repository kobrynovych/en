import type { Metadata } from "next";
import { DAILY_ROUTINE, ROADMAP_PRINCIPLES, ROADMAP_SOURCES, ROADMAP_STAGES } from "@/features/roadmap/content";
import { RoadmapClient } from "@/features/roadmap/roadmap-client";
import { PageShell } from "@/shared/ui/page-shell";

export const metadata: Metadata = {
  title: "Дорожня карта: англійська з нуля до B2 — English Path",
  description:
    "Покроковий план вивчення англійської за шкалою CEFR: граматика, лексика, вимова, навички й контрольні точки для рівнів Pre-A1, A1, A2, B1 і B2 з відстеженням прогресу.",
};

export default function RoadmapPage() {
  return (
    <PageShell>
      <RoadmapClient
        stages={ROADMAP_STAGES}
        principles={ROADMAP_PRINCIPLES}
        routine={DAILY_ROUTINE}
        sources={ROADMAP_SOURCES}
      />
    </PageShell>
  );
}
