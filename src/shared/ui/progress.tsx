"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/shared/lib/cn";

export function Progress({ value, className, label }: { value: number; className?: string; label?: string }) {
  return (
    <ProgressPrimitive.Root
      className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700", className)}
      value={value}
      aria-label={label}
    >
      <ProgressPrimitive.Indicator
        className="h-full rounded-full bg-emerald-500 transition-transform"
        style={{ transform: `translateX(-${100 - Math.max(0, Math.min(100, value))}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
