import type { ReactNode } from "react";
import { Card, CardContent } from "@/shared/ui/card";

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="grid size-12 place-items-center rounded-md bg-slate-100 text-slate-600">{icon}</div>
        <div>
          <h2 className="text-base font-bold text-slate-950">{title}</h2>
          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-600">{text}</p>
        </div>
      </CardContent>
    </Card>
  );
}
