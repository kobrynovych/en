import { describe, expect, it } from "vitest";
import { pluralUk } from "./plural-uk";

const forms = ["пункт", "пункти", "пунктів"] as const;

describe("pluralUk", () => {
  it("chooses the Ukrainian plural form", () => {
    expect([1, 21, 101].map((count) => pluralUk(count, forms))).toEqual(["пункт", "пункт", "пункт"]);
    expect([2, 4, 22, 34].map((count) => pluralUk(count, forms))).toEqual(["пункти", "пункти", "пункти", "пункти"]);
    expect([0, 5, 11, 14, 25].map((count) => pluralUk(count, forms))).toEqual(["пунктів", "пунктів", "пунктів", "пунктів", "пунктів"]);
  });
});
