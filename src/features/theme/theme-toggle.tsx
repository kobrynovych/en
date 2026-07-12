"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/cn";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "english-path-theme";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = theme;
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch {}
  window.dispatchEvent(new CustomEvent<Theme>("english-path-theme-change", { detail: theme }));
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    let stored: string | null = null;
    try { stored = localStorage.getItem(THEME_STORAGE_KEY); } catch {}

    const initialTheme: Theme = stored === "light" || stored === "dark"
      ? stored
      : media.matches ? "dark" : "light";
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    document.documentElement.dataset.theme = initialTheme;
    document.documentElement.dataset.themePreference = stored === "light" || stored === "dark" ? stored : "system";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate browser-owned theme state
    setTheme(initialTheme);
    setReady(true);

    const syncToggleInstances = (event: Event) => {
      setTheme((event as CustomEvent<Theme>).detail);
    };
    const syncSystemTheme = () => {
      let preference: string | null = null;
      try { preference = localStorage.getItem(THEME_STORAGE_KEY); } catch {}
      if (preference !== "light" && preference !== "dark") {
        const systemTheme: Theme = media.matches ? "dark" : "light";
        document.documentElement.classList.toggle("dark", media.matches);
        document.documentElement.dataset.theme = systemTheme;
        document.documentElement.dataset.themePreference = "system";
        setTheme(systemTheme);
      }
    };

    window.addEventListener("english-path-theme-change", syncToggleInstances);
    media.addEventListener("change", syncSystemTheme);
    return () => {
      window.removeEventListener("english-path-theme-change", syncToggleInstances);
      media.removeEventListener("change", syncSystemTheme);
    };
  }, []);

  function toggle() {
    const currentIsDark = document.documentElement.classList.contains("dark");
    applyTheme(currentIsDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      data-theme-ready={ready}
      aria-label={isDark ? "Перемкнути на світлу тему" : "Перемкнути на темну тему"}
      title={isDark ? "Перемкнути на світлу тему" : "Перемкнути на темну тему"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
        "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100",
        compact && "w-full",
      )}
    >
      {isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
    </button>
  );
}
