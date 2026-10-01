import type { RoadmapModule, RoadmapModuleKind, RoadmapStage, RoadmapStageId, RoadmapTask } from "./types";

export type AiAssistantId = "chatgpt" | "claude" | "gemini" | "perplexity" | "copilot" | "grok";

/**
 * How the prompt reaches the assistant:
 * - "send": the link opens a conversation that is already answering (chatgpt.com, perplexity.ai);
 * - "prefill": the prompt waits in the input for the learner to send it (claude.ai, grok.com);
 * - "paste": the service ignores URL prompts, so the learner pastes the copied prompt.
 */
export type AiPromptDelivery = "send" | "prefill" | "paste";

export interface AiAssistant {
  id: AiAssistantId;
  name: string;
  vendor: string;
  /** Two-letter monogram shown instead of a brand logo. */
  mark: string;
  delivery: AiPromptDelivery;
  buildUrl: (prompt: string) => string;
}

const withQuery = (base: string, key: string) => (prompt: string) => `${base}${key}=${encodeURIComponent(prompt)}`;

export const AI_ASSISTANTS: AiAssistant[] = [
  { id: "chatgpt", name: "ChatGPT", vendor: "OpenAI", mark: "Ch", delivery: "send", buildUrl: withQuery("https://chatgpt.com/?", "q") },
  { id: "claude", name: "Claude", vendor: "Anthropic", mark: "Cl", delivery: "prefill", buildUrl: withQuery("https://claude.ai/new?", "q") },
  // Gemini has no URL parameter for prompts.
  { id: "gemini", name: "Gemini", vendor: "Google", mark: "Ge", delivery: "paste", buildUrl: () => "https://gemini.google.com/app" },
  { id: "perplexity", name: "Perplexity", vendor: "Perplexity", mark: "Pe", delivery: "send", buildUrl: withQuery("https://www.perplexity.ai/search?", "q") },
  // Copilot drops ?q= for signed-out visitors, so pasting is the reliable path; the parameter still helps signed-in users.
  { id: "copilot", name: "Copilot", vendor: "Microsoft", mark: "Co", delivery: "paste", buildUrl: withQuery("https://copilot.microsoft.com/?", "q") },
  { id: "grok", name: "Grok", vendor: "xAI", mark: "Gr", delivery: "prefill", buildUrl: withQuery("https://grok.com/?", "q") },
];

/** Length of the practice texts the assistant writes, by level. */
const TEXT_LENGTH: Record<RoadmapStageId, string> = {
  start: "40–70 слів",
  a1: "80–120 слів",
  a2: "120–180 слів",
  b1: "200–280 слів",
  b2: "300–400 слів",
};

const TASK_PLANS: Record<RoadmapModuleKind, (level: string, textLength: string) => string[]> = {
  setup: () => [
    "Поясни, навіщо цей крок і як виконати його покроково.",
    "Постав мені 3–5 уточнювальних запитань по одному, щоб адаптувати поради під мене.",
    "Лише після моїх відповідей склади персональний план на тиждень і поясни, як відстежувати прогрес.",
  ],
  grammar: (level) => [
    "Суть простими словами: що це і коли вживається.",
    "Правило: форми, схеми й таблиця (ствердження, заперечення, запитання, якщо доречно).",
    `10 прикладів рівня ${level} з перекладом.`,
    "Типові помилки україномовних і як їх уникати.",
    "Коротка пам’ятка для повторення.",
    "Потім 8 вправ від легших до складніших: по одній, чекай моєї відповіді й пояснюй помилки.",
  ],
  vocabulary: (level) => [
    `15–20 найкорисніших слів і фраз до теми: транскрипція, переклад, приклад рівня ${level}.`,
    "Згрупуй їх за значенням і покажи типові сполучення слів.",
    "Слова, які україномовні часто плутають, і хибні друзі перекладача.",
    "Прийоми, як запам’ятати ці слова.",
    "Короткий діалог із цими словами.",
    "Потім 8 вправ: питай слова й фрази по одному, чекай моєї відповіді та виправляй помилки.",
  ],
  pronunciation: () => [
    "Що саме тренуємо і чому це важливо для розуміння.",
    "Як вимовляти: положення язика й губ, голос, транскрипція IPA.",
    "Порівняння з українськими звуками й типові помилки україномовних.",
    "Слова, пари слів і фрази для тренування — від простих до складніших.",
    "План тренування на 10 хвилин на день і як перевірити себе за допомогою запису голосу та словника з аудіо.",
    "Ти не чуєш мене в текстовому чаті: дай завдання для самоперевірки, а якщо маєш голосовий режим — запропонуй потренуватися голосом.",
  ],
  listening: (level, textLength) => [
    "Які навички слухання тренуємо і як слухати ефективно: до, під час і після прослуховування.",
    "5 запитань на розуміння.",
    `Сценарій діалогу чи монологу рівня ${level} на цю тему (${textLength}) — я прослухаю його в синтезаторі мовлення.`,
    "Корисні фрази зі сценарію з перекладом.",
    "Дочекайся моїх відповідей, потім перевір їх і поясни помилки.",
    "Порадь, де знайти схожі аудіо, і план практики на тиждень.",
  ],
  reading: (level, textLength) => [
    "Які стратегії читання тут допоможуть: загальний зміст, пошук деталей, здогадка за контекстом.",
    `Адаптований текст рівня ${level} на цю тему (${textLength}).`,
    "Словничок: 8–10 нових слів із перекладом.",
    "6 запитань на розуміння: став по одному й чекай моєї відповіді.",
    "Завдання після читання: коротко переказати текст або відповісти на нього.",
    "Потім перевір мої відповіді й переказ.",
  ],
  speaking: (level) => [
    "Корисні фрази й шаблони для цієї ситуації з перекладом.",
    `Зразок діалогу або розповіді рівня ${level}.`,
    "Типові помилки україномовних у такій розмові.",
    "Потім стань моїм співрозмовником: став запитання по одному й чекай на відповідь (я писатиму або говоритиму в голосовому режимі).",
    "Після кожної відповіді коротко виправ помилки й запропонуй природніший варіант, а наприкінці дай загальний відгук.",
  ],
  writing: (level) => [
    "Яким має бути такий текст: мета, структура, обсяг, стиль.",
    "Корисні фрази й зв’язки з перекладом.",
    `Зразок тексту рівня ${level} з коментарями.`,
    "Чек-лист для самоперевірки.",
    "Потім дай мені схоже завдання. Коли я надішлю текст, перевір зміст, структуру, лексику й граматику: виправлення, пояснення й покращена версія.",
  ],
  checkpoint: (level) => [
    `Що саме потрібно показати на рівні ${level} і за якими критеріями це оцінюють.`,
    "Склади для мене таке завдання (або кілька коротких) з чіткими інструкціями.",
    "Чек-лист для самооцінки.",
    "Після мого виконання оціни результат за критеріями, назви сильні сторони й теми для повторення. Це навчальний відгук, не підтвердження рівня CEFR.",
  ],
};

function levelLines(stage: RoadmapStage) {
  const level = `Рівень матеріалу: ${stage.code} (${stage.title.toLowerCase()}).`;
  return stage.id === "start" ? [level, "Я починаю вивчати англійську з нуля."] : [level];
}

/**
 * A self-contained study prompt for one roadmap task, in Ukrainian. It carries the level, the section, the
 * task description and the examples, plus a module-specific lesson plan and an interactive follow-up.
 * Kept compact: it travels in a URL, where Cyrillic takes ~6 characters per letter.
 */
export function buildStudyPrompt(stage: RoadmapStage, roadmapModule: RoadmapModule, task: RoadmapTask): string {
  const plan = TASK_PLANS[roadmapModule.kind](stage.code, TEXT_LENGTH[stage.id]);
  const lines = [
    "Ти — викладач англійської для україномовних. Допоможи детально вивчити цей пункт дорожньої карти CEFR.",
    "",
    ...levelLines(stage),
    `Розділ: ${roadmapModule.title}.`,
    `Пункт: ${task.title}.`,
    `Опис у плані: ${task.details}`,
  ];
  if (task.examples?.length) lines.push(`Приклади з плану: ${task.examples.join(" | ")}`);
  lines.push("", "Що зробити:", ...plan.map((step, index) => `${index + 1}. ${step}`));
  lines.push(
    "",
    "У вправах не показуй готових відповідей до моєї спроби або явного прохання показати відповідь.",
    `Пиши українською, англійські приклади й тексти — рівня ${stage.code}. Познач відмінності BrE / AmE. Використовуй заголовки й списки.`,
  );
  return lines.join("\n");
}
