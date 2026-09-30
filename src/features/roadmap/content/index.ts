import type { RoadmapResource, RoadmapStage } from "../types";
import { EXTERNAL } from "./links";
import { STAGE_A1 } from "./stage-a1";
import { STAGE_A2 } from "./stage-a2";
import { STAGE_B1 } from "./stage-b1";
import { STAGE_B2 } from "./stage-b2";
import { STAGE_START } from "./stage-start";

/**
 * Roadmap from zero to B2. Level content follows the British Council / EAQUALS Core Inventory
 * for General English; outcomes paraphrase the CEFR descriptors; hours follow Cambridge English
 * guided learning hours. See ROADMAP_SOURCES for links.
 */
export const ROADMAP_STAGES: RoadmapStage[] = [STAGE_START, STAGE_A1, STAGE_A2, STAGE_B1, STAGE_B2];

export const ROADMAP_PRINCIPLES: Array<{ title: string; text: string }> = [
  {
    title: "Навички — паралельно",
    text: "Рівні проходьте послідовно, а навички розвивайте разом: щотижня має бути граматика, лексика, аудіювання, читання, говоріння й письмо.",
  },
  {
    title: "Відмічайте за результатом",
    text: "Пункт виконано, коли ви вживаєте тему у власному мовленні без підказок, а не коли просто прочитали правило.",
  },
  {
    title: "Повторюйте з інтервалами",
    text: "Без повторення нові слова забуваються за кілька днів. Картки й система Leitner повертають їх саме тоді, коли час освіжити пам’ять.",
  },
  {
    title: "Багато зрозумілого матеріалу",
    text: "Щодня слухайте й читайте тексти, які розумієте майже повністю: так граматика й лексика засвоюються природно.",
  },
  {
    title: "Говоріть і пишіть з першого дня",
    text: "Власне мовлення з виправленням помилок закріплює знання: самозаписи, розмовна практика, короткі тексти.",
  },
];

export const DAILY_ROUTINE: Array<{ minutes: number; activity: string }> = [
  { minutes: 10, activity: "Повторення слів: картки або Leitner" },
  { minutes: 15, activity: "Граматика чи лексика з модуля рівня" },
  { minutes: 15, activity: "Аудіювання або читання" },
  { minutes: 10, activity: "Говоріння: shadowing чи самозапис" },
  { minutes: 10, activity: "Письмо: кілька речень або короткий текст" },
];

export const ROADMAP_SOURCES: RoadmapResource[] = [
  {
    label: "Council of Europe: CEFR — рівні володіння мовою",
    href: "https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions",
    note: "Офіційні описи рівнів A1–C2",
  },
  {
    label: "Council of Europe: дескриптори CEFR (Companion Volume, 2020)",
    href: "https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors",
    note: "Шкали «можу…» для кожної навички",
  },
  {
    label: "British Council / EAQUALS: Core Inventory for General English",
    href: "https://www.teachingenglish.org.uk/article/british-council-eaquals-core-inventory-general-english",
    note: "Граматика, функції, лексика й теми для рівнів A1–C1",
  },
  {
    label: "Cambridge English: guided learning hours",
    href: "https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours",
    note: "Орієнтовна кількість годин навчання до кожного рівня",
  },
  {
    ...EXTERNAL.oxfordWordlists,
    note: "Ключові слова англійської з розподілом за рівнями CEFR",
  },
  {
    label: "Vocabulary, the CEFR levels and word family size (P. Nation; J. Milton, T. Alexiou)",
    href: "https://www.wgtn.ac.nz/lals/resources/paul-nations-resources/vocabulary-lists/vocabulary-cefr-and-word-family-size/vocabulary-and-the-cefr-docx",
    note: "Дослідження обсягу словникового запасу на кожному рівні",
  },
  {
    label: "IELTS and the CEFR",
    href: "https://ielts.org/organisations/ielts-for-organisations/compare-ielts/ielts-and-the-cefr",
    note: "Відповідність балів IELTS рівням CEFR",
  },
];
