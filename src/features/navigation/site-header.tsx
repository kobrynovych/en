"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useId, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BookOpen, ChevronDown, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { cn } from "@/shared/lib/cn";
import { useDismiss } from "@/shared/lib/use-dismiss";
import {
  MENU_SECTIONS,
  PRIMARY_NAV,
  isGroupActive,
  isLinkActive,
  normalizePathname,
  type NavGroup,
  type NavLink,
} from "./nav-config";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600";

const headerItemClass = (active: boolean) =>
  cn(
    "inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors",
    focusRing,
    active
      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  );

export function SiteHeader() {
  const pathname = normalizePathname(usePathname());

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/" className={cn("flex min-w-0 items-center gap-2 rounded-md font-black text-slate-950 dark:text-white", focusRing)}>
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-emerald-600 text-white">
            <BookOpen className="size-5" aria-hidden="true" />
          </span>
          <span className="truncate">English Path</span>
        </Link>

        <nav className="ml-auto hidden lg:block" aria-label="Головна навігація">
          <ul className="flex items-center gap-1">
            {PRIMARY_NAV.map((entry) =>
              entry.kind === "link" ? (
                <li key={entry.href}>
                  <HeaderLink link={entry} pathname={pathname} />
                </li>
              ) : (
                <li key={entry.label}>
                  <NavDropdown group={entry} pathname={pathname} />
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-1">
          <ThemeToggle />
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ link, pathname }: { link: NavLink; pathname: string }) {
  const Icon = link.icon;
  const active = isLinkActive(pathname, link);

  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      title={link.shortLabel ? link.label : undefined}
      className={headerItemClass(active)}
    >
      <Icon className="hidden size-4 xl:block" aria-hidden="true" />
      {link.shortLabel ?? link.label}
    </Link>
  );
}

/** Disclosure-style dropdown (WAI-ARIA disclosure navigation pattern, not an app menu). */
function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const active = isGroupActive(pathname, group);
  const Icon = group.icon;
  const close = useCallback(() => setOpen(false), []);
  const closeWhenFocusLeaves = useDismiss({ open, onDismiss: close, containerRef, triggerRef: buttonRef });

  return (
    <div ref={containerRef} className="relative" onBlur={closeWhenFocusLeaves}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={headerItemClass(active)}
      >
        <Icon className="hidden size-4 xl:block" aria-hidden="true" />
        {group.label}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      <div
        id={panelId}
        hidden={!open}
        // Focusable so a click on the panel's padding keeps focus inside instead of closing it.
        tabIndex={-1}
        className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-2 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-900"
      >
        <ul className="space-y-1">
          {group.items.map((item) => {
            const ItemIcon = item.icon;
            const itemActive = isLinkActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={itemActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                    focusRing,
                    itemActive
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                  )}
                >
                  <ItemIcon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{item.shortLabel ?? item.label}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{item.description}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Відкрити меню"
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-md border transition-colors lg:hidden",
            "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950",
            "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white",
            focusRing,
          )}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,22rem)] flex-col border-l border-slate-200 bg-white shadow-2xl outline-none data-[state=closed]:animate-drawer-out data-[state=open]:animate-drawer-in dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <Dialog.Title className="text-lg font-black text-slate-950 dark:text-white">Меню</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Закрити меню"
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                  focusRing,
                )}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Навігація сторінками English Path</Dialog.Description>
          <nav aria-label="Мобільне меню" className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
            <div className="space-y-5">
              {MENU_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3 className="px-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {section.title}
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isLinkActive(pathname, item);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors",
                              focusRing,
                              active
                                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                            )}
                          >
                            <span
                              className={cn(
                                "grid size-9 shrink-0 place-items-center rounded-md",
                                active
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                              )}
                            >
                              <Icon className="size-4" aria-hidden="true" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-bold">{item.label}</span>
                              <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{item.description}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
