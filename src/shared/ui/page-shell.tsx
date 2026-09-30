import type { ReactNode } from "react";
import { MobileTabBar } from "@/features/navigation/mobile-tab-bar";
import { SiteHeader } from "@/features/navigation/site-header";
import { cn } from "@/shared/lib/cn";

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <SiteHeader />
      <main className={cn("mx-auto w-full max-w-7xl px-4 py-5 sm:py-8", className)}>{children}</main>
      <MobileTabBar />
    </div>
  );
}
