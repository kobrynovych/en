import { describe, expect, it } from "vitest";
import {
  buildSearchIndex,
  countActiveFilters,
  DEFAULT_FILTERS,
  filterRoadmap,
  filtersFromSearchParams,
  filtersToSearchParams,
  isSearchMode,
  MODULE_KINDS,
  normalizeSearchText,
  sameFilters,
  searchTerms,
  toggleListItem,
  type RoadmapFilters,
} from "./filters";
import type { TaskNotes } from "./notes";
import type { CompletedTasks } from "./progress";
import type { RoadmapStage, RoadmapStageId } from "./types";

function stage(id: RoadmapStageId, code: string, title: string, modules: RoadmapStage["modules"]): RoadmapStage {
  return {
    id,
    code,
    title,
    cefrName: "",
    tagline: "",
    summary: "",
    stageHours: "",
    totalHours: "",
    pace: "",
    vocabulary: "",
    certification: "",
    learningPath: [],
    outcomes: [],
    functions: [],
    topics: [],
    pitfalls: [],
    resources: [],
    modules,
  };
}

const STAGES: RoadmapStage[] = [
  stage("a1", "A1", "Початковий", [
    {
      id: "a1-grammar",
      kind: "grammar",
      title: "Граматика",
      tasks: [
        { id: "a1-be", title: "Дієслово to be", details: "Стверджувальні речення.", examples: ["I am a student."] },
        { id: "a1-plural", title: "Множина іменників", details: "Закінчення -s, -es." },
      ],
    },
    {
      id: "a1-speaking",
      kind: "speaking",
      title: "Говоріння",
      tasks: [
        {
          id: "a1-intro",
          title: "Розкажіть про себе",
          details: "Ім’я, місто, робота.",
          links: [{ label: "BBC Learning English", href: "https://example.com" }],
        },
      ],
    },
  ]),
  stage("b1", "B1", "Середній", [
    {
      id: "b1-grammar",
      kind: "grammar",
      title: "Граматика",
      tasks: [{ id: "b1-perfect", title: "Present Perfect чи Past Simple", details: "Досвід і результат." }],
    },
  ]),
];

const INDEX = buildSearchIndex(STAGES);
const STAGE_IDS: RoadmapStageId[] = ["start", "a1", "a2", "b1", "b2"];

function filters(patch: Partial<RoadmapFilters>): RoadmapFilters {
  return { ...DEFAULT_FILTERS, ...patch };
}

function matchingIds(
  patch: Partial<RoadmapFilters>,
  completed: CompletedTasks = {},
  notes: TaskNotes = {},
  pinned?: ReadonlySet<string>,
) {
  return filterRoadmap(INDEX, filters(patch), completed, notes, pinned).stages.flatMap((group) =>
    group.modules.flatMap((moduleGroup) => moduleGroup.tasks.map((task) => task.id)),
  );
}

describe("search text", () => {
  it("normalises case, apostrophes and whitespace", () => {
    expect(normalizeSearchText("  Ім’я   ТА\tпрізвище ")).toBe("ім'я та прізвище");
    expect(normalizeSearchText("Ім`я Імʼя")).toBe("ім'я ім'я");
  });

  it("splits a query into distinct words", () => {
    expect(searchTerms("  Present  perfect present ")).toEqual(["present", "perfect"]);
    expect(searchTerms("   ")).toEqual([]);
  });
});

describe("filter state", () => {
  it("knows when the plan is replaced by search results", () => {
    expect(isSearchMode(DEFAULT_FILTERS)).toBe(false);
    expect(isSearchMode(filters({ query: "  " }))).toBe(false);
    expect(isSearchMode(filters({ status: "todo" }))).toBe(false);
    expect(isSearchMode(filters({ query: "be" }))).toBe(true);
    expect(isSearchMode(filters({ stages: ["a1"] }))).toBe(true);
    expect(isSearchMode(filters({ kinds: ["grammar"] }))).toBe(true);
    expect(isSearchMode(filters({ withNotes: true }))).toBe(true);
  });

  it("counts the filters chosen in the panel", () => {
    expect(countActiveFilters(filters({ query: "be" }))).toBe(0);
    expect(countActiveFilters(filters({ stages: ["a1", "b1"], kinds: ["grammar"], status: "done", withNotes: true }))).toBe(5);
  });

  it("toggles list items in canonical order", () => {
    expect(toggleListItem(["b1"], "a1", STAGE_IDS)).toEqual(["a1", "b1"]);
    expect(toggleListItem(["a1", "b1"], "a1", STAGE_IDS)).toEqual(["b1"]);
  });
});

describe("filterRoadmap", () => {
  it("matches every word of the query across titles, details, examples and links", () => {
    expect(matchingIds({ query: "дієслово" })).toEqual(["a1-be"]);
    expect(matchingIds({ query: "student" })).toEqual(["a1-be"]);
    expect(matchingIds({ query: "bbc" })).toEqual(["a1-intro"]);
    expect(matchingIds({ query: "PRESENT досвід" })).toEqual(["b1-perfect"]);
    expect(matchingIds({ query: "present дієслово" })).toEqual([]);
  });

  it("matches level codes, level titles and section titles", () => {
    expect(matchingIds({ query: "b1" })).toEqual(["b1-perfect"]);
    expect(matchingIds({ query: "говоріння" })).toEqual(["a1-intro"]);
  });

  it("treats apostrophe variants as the same character", () => {
    expect(matchingIds({ query: "ім'я" })).toEqual(["a1-intro"]);
    expect(matchingIds({ query: "імʼя" })).toEqual(["a1-intro"]);
  });

  it("searches the learner's notes", () => {
    const notes: TaskNotes = { "a1-plural": { text: "Children — не childs!", updatedAt: "" } };
    expect(matchingIds({ query: "childs" }, {}, notes)).toEqual(["a1-plural"]);
    expect(matchingIds({ withNotes: true }, {}, notes)).toEqual(["a1-plural"]);
  });

  it("filters by level, section and status", () => {
    expect(matchingIds({ stages: ["b1"] })).toEqual(["b1-perfect"]);
    expect(matchingIds({ kinds: ["grammar"] })).toEqual(["a1-be", "a1-plural", "b1-perfect"]);
    expect(matchingIds({ kinds: ["grammar"], status: "done" }, { "a1-be": "2026-10-01" })).toEqual(["a1-be"]);
    expect(matchingIds({ kinds: ["grammar"], status: "todo" }, { "a1-be": "2026-10-01" })).toEqual([
      "a1-plural",
      "b1-perfect",
    ]);
  });

  it("groups matches by level and section in roadmap order with counts", () => {
    const result = filterRoadmap(INDEX, filters({ query: "а" }), {}, {});
    expect(result.count).toBe(4);
    expect(result.stages.map((group) => [group.stage.id, group.count, group.modules.length])).toEqual([
      ["a1", 3, 2],
      ["b1", 1, 1],
    ]);
  });

  it("keeps pinned tasks visible while they are being edited", () => {
    const notes: TaskNotes = {};
    expect(matchingIds({ withNotes: true }, {}, notes, new Set(["a1-plural"]))).toEqual(["a1-plural"]);
    // Pinning does not bypass the level and section filters.
    expect(matchingIds({ stages: ["b1"], query: "x" }, {}, notes, new Set(["a1-plural"]))).toEqual([]);
  });
});

describe("URL parameters", () => {
  it("round-trips filters and keeps unrelated parameters", () => {
    const value = filters({ query: " to be ", stages: ["a1", "b1"], kinds: ["grammar"], status: "todo", withNotes: true });
    const params = filtersToSearchParams(value, new URLSearchParams("utm=1"));
    expect(params.toString()).toBe("utm=1&q=to+be&level=a1%2Cb1&section=grammar&status=todo&notes=1");
    expect(filtersFromSearchParams(params, STAGE_IDS, MODULE_KINDS)).toEqual({ ...value, query: "to be" });
  });

  it("drops default values", () => {
    expect(filtersToSearchParams(DEFAULT_FILTERS, new URLSearchParams("q=old&level=a1")).toString()).toBe("");
  });

  it("ignores unknown or malformed values", () => {
    const params = new URLSearchParams("level=a1,c2,,a1&section=grammar,magic&status=maybe&notes=yes");
    expect(filtersFromSearchParams(params, STAGE_IDS, MODULE_KINDS)).toEqual(
      filters({ stages: ["a1"], kinds: ["grammar"] }),
    );
  });

  it("compares filters by their meaning", () => {
    expect(sameFilters(filters({ query: " be " }), filters({ query: "be" }))).toBe(true);
    expect(sameFilters(filters({ status: "done" }), DEFAULT_FILTERS)).toBe(false);
  });
});
