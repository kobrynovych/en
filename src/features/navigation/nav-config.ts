import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookMarked,
  Brain,
  ClipboardCheck,
  Headphones,
  Layers3,
  Library,
  RotateCcw,
  Route,
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  /** Compact label for the desktop header and dropdowns; `label` is used when absent. */
  shortLabel?: string;
  description: string;
  icon: LucideIcon;
  /** Extra path prefixes that also mark the link as active, e.g. every `/practice/*` page. */
  activePrefixes?: string[];
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavLink[];
  /** Pages that belong to the group without being listed in it, e.g. word detail pages. */
  activePrefixes?: string[];
}

export type NavEntry = ({ kind: "link" } & NavLink) | ({ kind: "group" } & NavGroup);

const home: NavLink = {
  href: "/",
  label: "Головна",
  description: "Прогрес і швидкий старт",
  icon: Layers3,
};

const roadmap: NavLink = {
  href: "/roadmap",
  label: "Дорожня карта",
  description: "План від нуля до B2 з чеклістами",
  icon: Route,
};

const dictionary: NavLink[] = [
  { href: "/levels/A1", label: "Словник A1", shortLabel: "A1", description: "Початковий рівень", icon: Library },
  { href: "/levels/A2", label: "Словник A2", shortLabel: "A2", description: "Елементарний рівень", icon: Library },
  { href: "/levels/B1", label: "Словник B1", shortLabel: "B1", description: "Середній рівень", icon: Library },
  { href: "/levels/B2", label: "Словник B2", shortLabel: "B2", description: "Вище середнього", icon: Library },
];

const irregularVerbs: NavLink = {
  href: "/irregular-verbs",
  label: "Неправильні дієслова",
  shortLabel: "Дієслова",
  description: "Три форми з перекладом і вимовою",
  icon: BookMarked,
};

const reading: NavLink = {
  href: "/reading",
  label: "Читання",
  description: "Озвучення тексту з підсвічуванням",
  icon: Headphones,
};

const practice: NavLink[] = [
  { href: "/practice/review", label: "Повторення", description: "Інтервальне повторення Leitner", icon: RotateCcw },
  { href: "/practice/flashcards", label: "Картки", description: "Флеш-картки для запам’ятовування", icon: Brain },
  { href: "/practice/tests", label: "Тести", description: "Міні-тести на переклад і вибір", icon: ClipboardCheck },
];

const stats: NavLink = {
  href: "/stats",
  label: "Статистика",
  description: "Ваш прогрес у словнику",
  icon: BarChart3,
};

/** Desktop header: frequently used pages inline, related pages grouped in dropdowns. */
export const PRIMARY_NAV: NavEntry[] = [
  { kind: "link", ...home },
  { kind: "link", ...roadmap },
  { kind: "group", label: "Словник", icon: Library, items: dictionary, activePrefixes: ["/levels", "/words"] },
  { kind: "link", ...irregularVerbs },
  { kind: "link", ...reading },
  { kind: "group", label: "Практика", icon: RotateCcw, items: practice, activePrefixes: ["/practice"] },
  { kind: "link", ...stats },
];

/** Full menu for small screens: every page, grouped by purpose. */
export const MENU_SECTIONS: Array<{ title: string; items: NavLink[] }> = [
  { title: "Навчання", items: [home, roadmap, irregularVerbs, reading] },
  { title: "Словник CEFR", items: dictionary },
  { title: "Практика", items: practice },
  { title: "Прогрес", items: [stats] },
];

/** Mobile bottom bar: the five most used destinations with labels short enough for narrow screens. */
export const TAB_BAR_ITEMS: NavLink[] = [
  home,
  { ...roadmap, label: "Карта" },
  { ...dictionary[0], label: "Словник", activePrefixes: ["/levels", "/words"] },
  reading,
  { ...practice[0], label: "Практика", activePrefixes: ["/practice"] },
];

/** Strips the trailing slash that `trailingSlash: true` adds to every exported route. */
export function normalizePathname(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isLinkActive(pathname: string, link: Pick<NavLink, "href" | "activePrefixes">): boolean {
  const current = normalizePathname(pathname);
  if (current === normalizePathname(link.href)) return true;
  return link.activePrefixes?.some((prefix) => matchesPrefix(current, prefix)) ?? false;
}

export function isGroupActive(pathname: string, group: Pick<NavGroup, "items" | "activePrefixes">): boolean {
  const current = normalizePathname(pathname);
  if (group.items.some((item) => isLinkActive(current, item))) return true;
  return group.activePrefixes?.some((prefix) => matchesPrefix(current, prefix)) ?? false;
}
