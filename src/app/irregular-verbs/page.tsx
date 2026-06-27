import type { Metadata } from "next";
import { IRREGULAR_VERBS } from "@/features/irregular-verbs/data";
import { IrregularVerbsClient } from "@/features/irregular-verbs/irregular-verbs-client";
import { PageShell } from "@/shared/ui/page-shell";

export const metadata: Metadata = {
  title: "Неправильні дієслова — English Path",
};

export default async function IrregularVerbsPage() {
  return (
    <PageShell>
      <IrregularVerbsClient verbs={IRREGULAR_VERBS} />
    </PageShell>
  );
}
