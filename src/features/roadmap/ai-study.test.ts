import { describe, expect, it } from "vitest";
import { AI_ASSISTANTS, buildStudyPrompt } from "./ai-study";
import { ROADMAP_STAGES } from "./content";
import type { RoadmapModuleKind } from "./types";

const entries = ROADMAP_STAGES.flatMap((stage) =>
  stage.modules.flatMap((roadmapModule) => roadmapModule.tasks.map((task) => ({ stage, roadmapModule, task }))),
);

function find(taskId: string) {
  const entry = entries.find(({ task }) => task.id === taskId);
  if (!entry) throw new Error(`Unknown task ${taskId}`);
  return entry;
}

function promptFor(taskId: string) {
  const { stage, roadmapModule, task } = find(taskId);
  return buildStudyPrompt(stage, roadmapModule, task);
}

describe("buildStudyPrompt", () => {
  it("carries the level, section, task description and examples", () => {
    const prompt = promptFor("a1-grammar-to-be");

    expect(prompt).toContain("Мій рівень: A1 (початковий).");
    expect(prompt).toContain("Розділ: Граматика.");
    expect(prompt).toContain("Пункт: Дієслово to be: am / is / are.");
    expect(prompt).toContain("Опис у плані: Ствердження, заперечення й запитання");
    expect(prompt).toContain("Приклади з плану: I'm a student. | She isn't at home.");
    expect(prompt).toContain("Пиши українською, англійські приклади й тексти — рівня A1.");
  });

  it("tells the assistant that a Pre-A1 learner starts from zero", () => {
    expect(promptFor("start-phrases-greetings")).toContain("Pre-A1 (старт), починаю вивчати англійську з нуля");
  });

  it("adapts the lesson plan to the module", () => {
    const sampleTask: Record<RoadmapModuleKind, string> = {
      setup: "start-setup-goal",
      grammar: "b1-grammar-passive",
      vocabulary: "a2-vocabulary-travel",
      pronunciation: "a2-pronunciation-schwa",
      listening: "b1-listening-podcasts",
      reading: "a2-reading-graded",
      speaking: "b2-speaking-discussion",
      writing: "b1-writing-email",
      checkpoint: "b2-checkpoint-write",
    };
    const marker: Record<RoadmapModuleKind, string> = {
      setup: "уточнювальних запитань",
      grammar: "8 вправ від легших до складніших",
      vocabulary: "15–20 найкорисніших слів і фраз",
      pronunciation: "транскрипція IPA",
      listening: "Сценарій діалогу чи монологу рівня B1",
      reading: "Адаптований текст рівня A2 на цю тему (120–180 слів)",
      speaking: "стань моїм співрозмовником",
      writing: "Чек-лист для самоперевірки",
      checkpoint: "оціни результат за критеріями",
    };

    for (const kind of Object.keys(sampleTask) as RoadmapModuleKind[]) {
      expect(find(sampleTask[kind]).roadmapModule.kind).toBe(kind);
      expect(promptFor(sampleTask[kind])).toContain(marker[kind]);
    }
  });

  it("omits the examples line when a task has no examples", () => {
    expect(promptFor("start-setup-goal")).not.toContain("Приклади з плану");
  });

  it("keeps every prompt short enough to travel in a URL", () => {
    for (const { stage, roadmapModule, task } of entries) {
      const prompt = buildStudyPrompt(stage, roadmapModule, task);
      expect(prompt.length, task.id).toBeLessThanOrEqual(1500);
      for (const assistant of AI_ASSISTANTS) {
        // Cyrillic is percent-encoded to ~6 characters per letter; long URLs get rejected by some servers.
        expect(assistant.buildUrl(prompt).length, `${assistant.id} ${task.id}`).toBeLessThanOrEqual(7500);
      }
    }
  });
});

describe("AI_ASSISTANTS", () => {
  const prompt = promptFor("b2-grammar-wish");

  it("passes the exact prompt to assistants that accept it in the URL", () => {
    for (const assistant of AI_ASSISTANTS.filter((item) => item.id !== "gemini")) {
      const url = new URL(assistant.buildUrl(prompt));
      expect(url.protocol).toBe("https:");
      expect(url.searchParams.get("q"), assistant.id).toBe(prompt);
    }
  });

  it("opens Gemini without a prompt parameter because it has none", () => {
    const gemini = AI_ASSISTANTS.find((assistant) => assistant.id === "gemini");
    expect(gemini?.delivery).toBe("paste");
    expect(gemini?.buildUrl(prompt)).toBe("https://gemini.google.com/app");
  });

  it("lists every assistant once", () => {
    const ids = AI_ASSISTANTS.map((assistant) => assistant.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(["chatgpt", "claude", "gemini", "perplexity"]));
  });
});
