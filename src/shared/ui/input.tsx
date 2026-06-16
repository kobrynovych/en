import * as React from "react";
import { cn } from "@/shared/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
