import * as React from "react";
import { cn } from "@/shared/lib/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700",
        className,
      )}
      {...props}
    />
  );
}
