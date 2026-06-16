"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/shared/lib/cn";

type ThemePreference = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "english-path-theme";

const options: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof Monitor;
}> = [
  { value: "system", label: "Системна тема", icon: Monitor },
  { value: "light", label: "Світла тема", icon: Sun },
  { value: "dark", label: "Темна тема", icon: Moon },
];

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === "system" ? getSystemTheme() : preference;
}

function applyTheme(preference: ThemePreference) {
  const resolved = resolveTheme(preference);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
  root.dataset.themePreference = preference;
}

function readStoredTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  } catch {
    return "system";
  }
}

function writeStoredTheme(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {}
}

const listeners = new Set<() => void>();

function emitThemeChange() {
  for (const listener of listeners) listener();
}

function getThemeSnapshot(): ThemePreference {
  if (typeof document === "undefined") return "system";
  const current = document.documentElement.dataset.themePreference;
  return current === "light" || current === "dark" || current === "system" ? current : readStoredTheme();
}

function subscribeToTheme(callback: () => void) {
  listeners.add(callback);

  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (readStoredTheme() === "system") {
      applyTheme("system");
      emitThemeChange();
    }
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      applyTheme(readStoredTheme());
      emitThemeChange();
    }
  };

  media?.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(callback);
    media?.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const preference = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "system");
  const activeLabel = options.find((option) => option.value === preference)?.label ?? "Тема";

  function chooseTheme(next: ThemePreference) {
    writeStoredTheme(next);
    applyTheme(next);
    emitThemeChange();
  }

  return (
    <div
      className={cn(
        "inline-grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-900",
        compact ? "w-full" : "w-auto",
      )}
      role="radiogroup"
      aria-label="Перемикач теми"
      title={activeLabel}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = preference === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => chooseTheme(option.value)}
            className={cn(
              "grid size-9 place-items-center rounded-md text-slate-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-300",
              active && "bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
