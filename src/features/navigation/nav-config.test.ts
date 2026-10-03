import { describe, expect, it } from "vitest";
import {
  MENU_SECTIONS,
  PRIMARY_NAV,
  TAB_BAR_ITEMS,
  isGroupActive,
  isLinkActive,
  normalizePathname,
  type NavGroup,
} from "./nav-config";

const dictionaryGroup = PRIMARY_NAV.find((entry) => entry.kind === "group" && entry.label === "Словник") as NavGroup;
const practiceGroup = PRIMARY_NAV.find((entry) => entry.kind === "group" && entry.label === "Практика") as NavGroup;

describe("normalizePathname", () => {
  it("removes the trailing slash added by the static export", () => {
    expect(normalizePathname("/roadmap/")).toBe("/roadmap");
    expect(normalizePathname("/levels/A1/")).toBe("/levels/A1");
    expect(normalizePathname("/")).toBe("/");
    expect(normalizePathname("")).toBe("/");
    expect(normalizePathname(null)).toBe("/");
  });
});

describe("isLinkActive", () => {
  it("matches exact routes with or without the trailing slash", () => {
    expect(isLinkActive("/roadmap/", { href: "/roadmap" })).toBe(true);
    expect(isLinkActive("/roadmap", { href: "/roadmap" })).toBe(true);
    expect(isLinkActive("/reading/", { href: "/roadmap" })).toBe(false);
  });

  it("keeps the home link active only on the home page", () => {
    expect(isLinkActive("/", { href: "/" })).toBe(true);
    expect(isLinkActive("/stats/", { href: "/" })).toBe(false);
  });

  it("uses path prefixes on segment boundaries only", () => {
    const practiceTab = { href: "/practice/review", activePrefixes: ["/practice"] };
    expect(isLinkActive("/practice/tests/", practiceTab)).toBe(true);
    expect(isLinkActive("/practice-extra", practiceTab)).toBe(false);
  });
});

describe("isGroupActive", () => {
  it("marks the dictionary group active for level and word pages", () => {
    expect(isGroupActive("/levels/B1/", dictionaryGroup)).toBe(true);
    expect(isGroupActive("/words/apple/", dictionaryGroup)).toBe(true);
    expect(isGroupActive("/irregular-verbs/", dictionaryGroup)).toBe(false);
  });

  it("marks the practice group active for every practice mode", () => {
    expect(isGroupActive("/practice/flashcards/", practiceGroup)).toBe(true);
    expect(isGroupActive("/stats/", practiceGroup)).toBe(false);
  });
});

describe("navigation config", () => {
  const menuHrefs = MENU_SECTIONS.flatMap((section) => section.items.map((item) => item.href));

  it("lists every page of the site in the full menu exactly once", () => {
    expect(menuHrefs).toEqual(
      expect.arrayContaining([
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
      ]),
    );
    expect(new Set(menuHrefs).size).toBe(menuHrefs.length);
  });

  it("offers the same destinations in the desktop header", () => {
    const headerHrefs = PRIMARY_NAV.flatMap((entry) => (entry.kind === "link" ? [entry.href] : entry.items.map((item) => item.href)));
    expect([...headerHrefs].sort()).toEqual([...menuHrefs].sort());
  });

  it("keeps the mobile tab bar short and links the roadmap", () => {
    expect(TAB_BAR_ITEMS).toHaveLength(5);
    expect(TAB_BAR_ITEMS.map((item) => item.href)).toContain("/roadmap");
  });
});
