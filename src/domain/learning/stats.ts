import { ACTIVE_LEVELS, type ActiveCefrLevel, type LearningStats, type WordEntry, type WordProgress } from "./types";
import { isDue, percentage } from "./progress";

export function computeLearningStats(words: WordEntry[], progressByWord: Record<string, WordProgress>, now = new Date()): LearningStats {
  const learnedWords = words.filter((word) => progressByWord[word.id]?.learned).length;
  const dueWords = words.filter((word) => isDue(progressByWord[word.id], now)).length;
  const correct = Object.values(progressByWord).reduce((sum, progress) => sum + progress.correctCount, 0);
  const incorrect = Object.values(progressByWord).reduce((sum, progress) => sum + progress.incorrectCount, 0);

  const levels = ACTIVE_LEVELS.map((level) => {
    const levelWords = words.filter((word) => word.cefr === level);
    const learned = levelWords.filter((word) => progressByWord[word.id]?.learned).length;
    const due = levelWords.filter((word) => isDue(progressByWord[word.id], now)).length;

    return {
      level: level as ActiveCefrLevel,
      total: levelWords.length,
      learned,
      due,
      progressPercent: percentage(learned, levelWords.length),
    };
  });

  const categoryTotals = new Map<string, { total: number; learned: number }>();
  for (const word of words) {
    for (const category of word.categories) {
      const item = categoryTotals.get(category) ?? { total: 0, learned: 0 };
      item.total += 1;
      item.learned += progressByWord[word.id]?.learned ? 1 : 0;
      categoryTotals.set(category, item);
    }
  }

  const categories = [...categoryTotals.entries()]
    .map(([category, item]) => ({
      category,
      total: item.total,
      learned: item.learned,
      progressPercent: percentage(item.learned, item.total),
    }))
    .sort((a, b) => b.total - a.total || a.category.localeCompare(b.category));

  return {
    totalWords: words.length,
    learnedWords,
    unlearnedWords: words.length - learnedWords,
    dueWords,
    overallProgressPercent: percentage(learnedWords, words.length),
    levels,
    categories,
    accuracyPercent: percentage(correct, correct + incorrect),
  };
}
