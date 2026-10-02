import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NOTE_MAX_LENGTH } from "./notes";
import { TaskNoteEditor, TaskNotePreview } from "./task-note";

function renderEditor(initialText = "", onSave = vi.fn(() => true)) {
  const onDone = vi.fn();
  const onDelete = vi.fn();
  const view = render(
    <TaskNoteEditor id="note" taskTitle="Дієслово to be" initialText={initialText} onSave={onSave} onDone={onDone} onDelete={onDelete} />,
  );
  const textarea = screen.getByRole("textbox", { name: "Нотатка до пункту «Дієслово to be»" });
  return { ...view, textarea, onSave, onDone, onDelete };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("TaskNoteEditor", () => {
  it("focuses the text and saves it after a pause in typing", () => {
    const { textarea, onSave } = renderEditor("I am");
    expect(textarea).toHaveFocus();
    expect(textarea).toHaveAttribute("maxLength", String(NOTE_MAX_LENGTH));

    fireEvent.change(textarea, { target: { value: "I am a student" } });
    expect(screen.getByText("Зберігаю…")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1000));
    expect(onSave).toHaveBeenCalledExactlyOnceWith("I am a student");
    expect(screen.getByText("Збережено")).toBeInTheDocument();
    expect(screen.getByText("14 / 2000")).toBeInTheDocument();
  });

  it("saves pending text immediately on blur and on Escape, then closes", () => {
    const { textarea, onSave, onDone } = renderEditor();
    fireEvent.change(textarea, { target: { value: "first" } });
    fireEvent.blur(textarea);
    expect(onSave).toHaveBeenLastCalledWith("first");

    fireEvent.change(textarea, { target: { value: "second" } });
    fireEvent.keyDown(textarea, { key: "Escape" });
    expect(onSave).toHaveBeenLastCalledWith("second");
    expect(onDone).toHaveBeenCalledOnce();

    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(onDone).toHaveBeenCalledTimes(2);
    expect(onSave).toHaveBeenCalledTimes(2);
  });

  it("saves unsaved text when it unmounts", () => {
    const { textarea, onSave, unmount } = renderEditor();
    fireEvent.change(textarea, { target: { value: "draft" } });
    unmount();
    expect(onSave).toHaveBeenCalledExactlyOnceWith("draft");
  });

  it("hands the latest text to delete and cancels the pending autosave", () => {
    const { textarea, onSave, onDelete } = renderEditor("old");
    fireEvent.change(textarea, { target: { value: "old and new" } });
    fireEvent.click(screen.getByRole("button", { name: "Видалити нотатку" }));
    expect(onDelete).toHaveBeenCalledExactlyOnceWith("old and new");
    act(() => vi.advanceTimersByTime(1000));
    expect(onSave).not.toHaveBeenCalled();
  });

  it("alerts when the browser refuses to store the note", () => {
    const { textarea } = renderEditor("", vi.fn(() => false));
    fireEvent.change(textarea, { target: { value: "text" } });
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole("alert")).toHaveTextContent("Не вдалося зберегти");
  });
});

describe("TaskNotePreview", () => {
  it("shows the note with its date and clamps long notes behind a toggle", () => {
    const text = Array.from({ length: 6 }, (_, index) => `Line ${index + 1}`).join("\n");
    render(<TaskNotePreview note={{ text, updatedAt: "2026-10-02T09:30:00.000Z" }} />);

    expect(screen.getByText(/2026/)).toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: "Показати повністю" });
    expect(screen.getByText(/Line 6/)).toHaveClass("line-clamp-4");
    fireEvent.click(toggle);
    expect(screen.getByText(/Line 6/)).not.toHaveClass("line-clamp-4");
    expect(toggle).toHaveTextContent("Згорнути");
  });

  it("shows the whole note when a search highlights it", () => {
    render(<TaskNotePreview note={{ text: "word\n".repeat(10) + "target", updatedAt: "" }} terms={["target"]} />);
    expect(screen.queryByRole("button", { name: "Показати повністю" })).toBeNull();
    expect(screen.getByText("target").tagName).toBe("MARK");
  });
});
