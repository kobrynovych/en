"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/shared/lib/cn";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "english-path-theme";

// ── Shared external store so all ThemeToggle instances stay in sync ─────────

const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) fn();
}

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getThemeServerSnapshot(): Theme {
  return "dark"; // safe SSR default — ThemeScript corrects it before paint
}

function subscribeTheme(callback: () => void) {
  listeners.add(callback);
  return () => { listeners.delete(callback); };
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch {}
  notify();
}

// ─────────────────────────────────────────────────────────────────────────────

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  const isDark = theme === "dark";

  function toggle() {
    applyTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Перемкнути на світлу тему" : "Перемкнути на темну тему"}
      title={isDark ? "Перемкнути на світлу тему" : "Перемкнути на темну тему"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
        "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100",
        compact && "w-full",
      )}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
