import * as React from "react";
import { cn } from "@/shared/lib/cn";

type BadgeVariant = "default" | "emerald" | "sky" | "amber" | "rose";

const variantClass: Record<BadgeVariant, string> = {
  default:  "border-slate-200 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
  emerald:  "border-transparent bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
  sky:      "border-transparent bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-400",
  amber:    "border-transparent bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-400",
  rose:     "border-transparent bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-400",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-md border px-2.5 text-xs font-semibold",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
