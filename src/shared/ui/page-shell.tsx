import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, BookOpen, Brain, ClipboardCheck, Layers3, Library, RotateCcw } from "lucide-react";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { cn } from "@/shared/lib/cn";

const navItems = [
  { href: "/", label: "Головна", icon: Layers3 },
  { href: "/levels/A1", label: "A1", icon: Library },
  { href: "/levels/A2", label: "A2", icon: Library },
  { href: "/levels/B1", label: "B1", icon: Library },
  { href: "/practice/review", label: "Повторення", icon: RotateCcw },
  { href: "/practice/flashcards", label: "Картки", icon: Brain },
  { href: "/practice/tests", label: "Тести", icon: ClipboardCheck },
  { href: "/stats", label: "Статистика", icon: BarChart3 },
];

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2 font-black text-slate-950 dark:text-white">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-emerald-600 text-white">
              <BookOpen className="size-5" aria-hidden="true" />
            </span>
            <span className="truncate">English Path</span>
          </Link>
          <div className="ml-auto lg:hidden">
            <ThemeToggle />
          </div>
          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Головна навігація">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className={cn("mx-auto w-full max-w-7xl px-4 py-5 sm:py-8", className)}>{children}</main>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden"
        aria-label="Мобільна навігація"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
