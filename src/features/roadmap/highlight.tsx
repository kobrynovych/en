import { useMemo, type ReactNode } from "react";

const APOSTROPHES = "['’ʼ‘`´]";

/** A case-insensitive pattern that captures any of the search terms; apostrophe variants match each other. */
export function buildHighlightPattern(terms: readonly string[] | undefined): RegExp | null {
  if (!terms?.length) return null;
  const source = [...terms]
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, APOSTROPHES))
    .join("|");
  return new RegExp(`(${source})`, "giu");
}

/** Splits text into plain and matched parts; matched parts sit at odd indices. */
export function splitByPattern(text: string, pattern: RegExp | null): string[] {
  return pattern ? text.split(pattern) : [text];
}

/** Renders `text` with the search terms wrapped in <mark>. */
export function Highlight({ text, terms }: { text: string; terms?: readonly string[] }): ReactNode {
  const pattern = useMemo(() => buildHighlightPattern(terms), [terms]);
  const parts = splitByPattern(text, pattern);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      // An explicit text colour: inherited muted or struck-through colours fall below 4.5:1 on the highlight.
      <mark key={index} className="rounded-sm bg-amber-200 px-0.5 text-slate-950 dark:bg-amber-400/30 dark:text-white">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
