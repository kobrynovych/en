const rules = new Intl.PluralRules("uk");

/**
 * Picks the Ukrainian plural form for a count: one (1, 21…), few (2–4, 22–24…) or many (0, 5–20, 25…).
 * Example: `${count} ${pluralUk(count, ["пункт", "пункти", "пунктів"])}`.
 */
export function pluralUk(count: number, [one, few, many]: readonly [string, string, string]) {
  const rule = rules.select(count);
  if (rule === "one") return one;
  if (rule === "few") return few;
  return many;
}
