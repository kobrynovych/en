import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildHighlightPattern, Highlight, splitByPattern } from "./highlight";

describe("buildHighlightPattern", () => {
  it("returns null without terms", () => {
    expect(buildHighlightPattern(undefined)).toBeNull();
    expect(buildHighlightPattern([])).toBeNull();
  });

  it("matches terms case-insensitively, Cyrillic included, and puts matches at odd indices", () => {
    const parts = splitByPattern("Дієслово TO BE: I am", buildHighlightPattern(["дієслово", "be"]));
    expect(parts).toEqual(["", "Дієслово", " TO ", "BE", ": I am"]);
  });

  it("prefers longer terms and escapes regular expression characters", () => {
    expect(splitByPattern("present perfect", buildHighlightPattern(["present", "pre"]))).toEqual(["", "present", " perfect"]);
    expect(splitByPattern("a (b) c", buildHighlightPattern(["(b)"]))).toEqual(["a ", "(b)", " c"]);
  });

  it("treats apostrophe variants as equal", () => {
    expect(splitByPattern("Ім’я та Імʼя", buildHighlightPattern(["ім'я"]))).toEqual(["", "Ім’я", " та ", "Імʼя", ""]);
  });
});

describe("Highlight", () => {
  it("wraps matches in <mark> and keeps the text intact", () => {
    const { container } = render(
      <p>
        <Highlight text="I have lived here" terms={["lived"]} />
      </p>,
    );
    expect(container.textContent).toBe("I have lived here");
    expect([...container.querySelectorAll("mark")].map((mark) => mark.textContent)).toEqual(["lived"]);
  });

  it("renders plain text without terms or matches", () => {
    const { container } = render(
      <p>
        <Highlight text="No match here" terms={["xyz"]} />
      </p>,
    );
    expect(container.querySelector("mark")).toBeNull();
    expect(container.textContent).toBe("No match here");
  });
});
