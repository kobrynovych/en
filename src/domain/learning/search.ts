import type { VocabularyFilters, WordEntry, WordProgress } from "./types";

export function normalizeSearchValue(value: string) {
  return value
    .toLocaleLowerCase("uk-UA")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export function matchesVocabularyFilters(
  word: WordEntry,
  progress: WordProgress | undefined,
  filters: VocabularyFilters,
) {
  const query = normalizeSearchValue(filters.query);
  const haystack = normalizeSearchValue(
    [
      word.headword,
      word.americanSpelling,
      word.britishSpelling,
      word.ipa,
      word.pos,
      word.cefr,
      ...word.categories,
      ...word.translationsUk,
    ]
      .filter(Boolean)
      .join(" "),
  );

  if (query && !haystack.includes(query)) return false;
  if (filters.learned === "learned" && !progress?.learned) return false;
  if (filters.learned === "unlearned" && progress?.learned) return false;
  if (filters.categories.length > 0 && !filters.categories.some((category) => word.categories.includes(category))) {
    return false;
  }
  if (filters.partsOfSpeech.length > 0 && !filters.partsOfSpeech.includes(word.pos)) return false;

  return true;
}

export function sortWordsForStudy(words: WordEntry[]) {
  return [...words].sort((a, b) => {
    const level = a.cefr.localeCompare(b.cefr);
    if (level !== 0) return level;
    return a.headword.localeCompare(b.headword) || a.pos.localeCompare(b.pos);
  });
}
