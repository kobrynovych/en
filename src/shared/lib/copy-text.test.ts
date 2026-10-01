import { afterEach, describe, expect, it, vi } from "vitest";
import { copyText, copyTextSync } from "./copy-text";

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");

function setClipboard(value: unknown) {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value });
}

/** jsdom has no execCommand: emulate one that dispatches a copy event with a writable clipboard. */
function mockExecCommand(result = true) {
  const clipboard: Record<string, string> = {};
  const execCommand = vi.fn((command: string) => {
    if (command !== "copy") return false;
    const event = new Event("copy", { cancelable: true });
    Object.defineProperty(event, "clipboardData", {
      value: { setData: (type: string, value: string) => (clipboard[type] = value) },
    });
    document.dispatchEvent(event);
    return result;
  });
  Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand });
  return { clipboard, execCommand };
}

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
  else Reflect.deleteProperty(navigator, "clipboard");
  Reflect.deleteProperty(document, "execCommand");
  vi.restoreAllMocks();
});

describe("copyTextSync", () => {
  it("writes the exact text and leaves focus and the DOM untouched", () => {
    const { clipboard } = mockExecCommand();
    const button = document.createElement("button");
    document.body.appendChild(button);
    button.focus();

    expect(copyTextSync("line one\nline two")).toBe(true);
    expect(clipboard["text/plain"]).toBe("line one\nline two");
    expect(document.activeElement).toBe(button);
    expect(document.body.childElementCount).toBe(1);
    expect(window.getSelection()?.toString()).toBe("");
    button.remove();
  });

  it("reports failure when the browser refuses to copy", () => {
    mockExecCommand(false);
    expect(copyTextSync("nope")).toBe(false);
  });
});

describe("copyText", () => {
  it("uses the async Clipboard API when it is available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    const { execCommand } = mockExecCommand();

    await expect(copyText("hello")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
    expect(execCommand).not.toHaveBeenCalled();
  });

  it("falls back to the synchronous copy when the Clipboard API is rejected", async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new DOMException("Document is not focused", "NotAllowedError")) });
    const { clipboard } = mockExecCommand();

    await expect(copyText("fallback")).resolves.toBe(true);
    expect(clipboard["text/plain"]).toBe("fallback");
  });

  it("reports failure when nothing can copy", async () => {
    setClipboard(undefined);
    mockExecCommand(false);

    await expect(copyText("nope")).resolves.toBe(false);
  });
});
