"use client";

import { create } from "zustand";
import type { PartOfSpeech, VocabularyFilters } from "@/domain/learning/types";

const defaultFilters: VocabularyFilters = {
  query: "",
  learned: "all",
  categories: [],
  partsOfSpeech: [],
};

interface VocabularyFilterState {
  filtersByLevel: Record<string, VocabularyFilters>;
  getFilters: (level: string) => VocabularyFilters;
  setQuery: (level: string, query: string) => void;
  setLearned: (level: string, learned: VocabularyFilters["learned"]) => void;
  toggleCategory: (level: string, category: string) => void;
  togglePartOfSpeech: (level: string, pos: PartOfSpeech) => void;
  resetFilters: (level: string) => void;
}

export const useVocabularyStore = create<VocabularyFilterState>((set, get) => ({
  filtersByLevel: {},
  getFilters: (level) => get().filtersByLevel[level] ?? defaultFilters,
  setQuery: (level, query) =>
    set((state) => ({
      filtersByLevel: {
        ...state.filtersByLevel,
        [level]: { ...(state.filtersByLevel[level] ?? defaultFilters), query },
      },
    })),
  setLearned: (level, learned) =>
    set((state) => ({
      filtersByLevel: {
        ...state.filtersByLevel,
        [level]: { ...(state.filtersByLevel[level] ?? defaultFilters), learned },
      },
    })),
  toggleCategory: (level, category) =>
    set((state) => {
      const filters = state.filtersByLevel[level] ?? defaultFilters;
      const categories = filters.categories.includes(category)
        ? filters.categories.filter((item) => item !== category)
        : [...filters.categories, category];
      return { filtersByLevel: { ...state.filtersByLevel, [level]: { ...filters, categories } } };
    }),
  togglePartOfSpeech: (level, pos) =>
    set((state) => {
      const filters = state.filtersByLevel[level] ?? defaultFilters;
      const partsOfSpeech = filters.partsOfSpeech.includes(pos)
        ? filters.partsOfSpeech.filter((item) => item !== pos)
        : [...filters.partsOfSpeech, pos];
      return { filtersByLevel: { ...state.filtersByLevel, [level]: { ...filters, partsOfSpeech } } };
    }),
  resetFilters: (level) =>
    set((state) => ({
      filtersByLevel: {
        ...state.filtersByLevel,
        [level]: defaultFilters,
      },
    })),
}));
