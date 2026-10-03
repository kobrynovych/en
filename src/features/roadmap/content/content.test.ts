import { describe, expect, it } from "vitest";
import { ROADMAP_SOURCES, ROADMAP_STAGES } from ".";
import type { RoadmapLink } from "../types";

const SITE_ROUTES = new Set([
  "/",
  "/roadmap",
  "/levels/A1",
  "/levels/A2",
  "/levels/B1",
  "/levels/B2",
  "/irregular-verbs",
  "/reading",
  "/practice/review",
  "/practice/flashcards",
  "/practice/tests",
  "/stats",
]);

const tasks = ROADMAP_STAGES.flatMap((stage) => stage.modules.flatMap((module) => module.tasks.map((task) => ({ stage, module, task }))));

function expectUnique(values: string[]) {
  expect(values.filter((value, index) => values.indexOf(value) !== index)).toEqual([]);
}

function expectValidLink(link: Pick<RoadmapLink, "href">) {
  if (link.href.startsWith("/")) expect(SITE_ROUTES).toContain(link.href);
  else expect(link.href).toMatch(/^https:\/\/[^\s]+$/);
}

describe("roadmap content", () => {
  it("goes from zero to B2 in order", () => {
    expect(ROADMAP_STAGES.map((stage) => stage.id)).toEqual(["start", "a1", "a2", "b1", "b2"]);
  });

  it("uses unique, stage-scoped ids because progress is stored by them", () => {
    expectUnique(tasks.map(({ task }) => task.id));
    expectUnique(ROADMAP_STAGES.flatMap((stage) => stage.modules.map((module) => module.id)));

    for (const { stage, module, task } of tasks) {
      expect(module.id.startsWith(`${stage.id}-`)).toBe(true);
      expect(task.id.startsWith(`${module.id}-`)).toBe(true);
      expect(task.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("gives every stage complete information", () => {
    for (const stage of ROADMAP_STAGES) {
      for (const field of [stage.summary, stage.stageHours, stage.totalHours, stage.pace, stage.vocabulary, stage.certification]) {
        expect(field.trim()).not.toBe("");
      }
      expect(stage.learningPath.length).toBeGreaterThanOrEqual(3);
      for (const step of stage.learningPath) {
        expect(step.trim()).not.toBe("");
      }
      expect(stage.outcomes.map((outcome) => outcome.skill)).toEqual(
        expect.arrayContaining(["interaction", "production", "listening", "reading", "writing"]),
      );
      expect(stage.pitfalls.length).toBeGreaterThanOrEqual(4);
      expect(stage.resources.length).toBeGreaterThanOrEqual(3);
      expect(stage.modules.at(-1)?.kind).toBe("checkpoint");
    }
  });

  it("covers every language skill from A1 upwards", () => {
    for (const stage of ROADMAP_STAGES.filter((item) => item.id !== "start")) {
      expect(stage.modules.map((module) => module.kind)).toEqual([
        "grammar",
        "vocabulary",
        "pronunciation",
        "listening",
        "reading",
        "speaking",
        "writing",
        "checkpoint",
      ]);
    }
  });

  it("describes every task and keeps at least one required task per module", () => {
    for (const { task } of tasks) {
      expect(task.title.trim()).not.toBe("");
      expect(task.details.trim()).not.toBe("");
    }
    for (const stage of ROADMAP_STAGES) {
      for (const stageModule of stage.modules) {
        expect(stageModule.tasks.some((task) => !task.optional)).toBe(true);
      }
    }
  });

  it("links only to existing site routes or https resources", () => {
    for (const { task } of tasks) task.links?.forEach(expectValidLink);
    for (const stage of ROADMAP_STAGES) {
      stage.resources.forEach((resource) => resource.href && expectValidLink({ href: resource.href }));
    }
    ROADMAP_SOURCES.forEach((source) => source.href && expectValidLink({ href: source.href }));
  });

  it("keeps list items unique so they can be rendered with stable keys", () => {
    for (const { task } of tasks) {
      expectUnique(task.examples ?? []);
      expectUnique((task.links ?? []).map((link) => link.href));
    }
    for (const stage of ROADMAP_STAGES) {
      expectUnique(stage.resources.map((resource) => resource.label));
      expectUnique(stage.pitfalls.map((pitfall) => pitfall.wrong));
      expectUnique(stage.outcomes.map((outcome) => outcome.skill));
      stage.outcomes.forEach((outcome) => expectUnique(outcome.items));
      expectUnique(stage.functions);
      expectUnique(stage.topics);
      expectUnique(stage.learningPath);
    }
    expectUnique(ROADMAP_SOURCES.map((source) => source.label));
  });
});
