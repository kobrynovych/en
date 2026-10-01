/**
 * Synchronous copy through `execCommand("copy")`. Use it when the page is about to lose focus right
 * after the click (e.g. a link that opens a new tab), where the async Clipboard API may be rejected
 * with "Document is not focused". The exact text is written from the `copy` event, so the result does
 * not depend on how the browser serialises the temporary selection. Keyboard focus never moves.
 */
export function copyTextSync(text: string): boolean {
  const selection = window.getSelection();
  const holder = document.createElement("span");
  holder.textContent = text;
  holder.style.position = "fixed";
  holder.style.opacity = "0";
  holder.style.whiteSpace = "pre";
  holder.style.userSelect = "text";
  document.body.appendChild(holder);

  // Some browsers only fire the copy event when something is selected.
  const range = document.createRange();
  range.selectNodeContents(holder);
  selection?.removeAllRanges();
  selection?.addRange(range);

  let written = false;
  const writeExactText = (event: ClipboardEvent) => {
    if (!event.clipboardData) return;
    event.clipboardData.setData("text/plain", text);
    event.preventDefault();
    written = true;
  };
  document.addEventListener("copy", writeExactText);
  try {
    return document.execCommand("copy") && written;
  } catch {
    return false;
  } finally {
    document.removeEventListener("copy", writeExactText);
    selection?.removeAllRanges();
    holder.remove();
  }
}

/** Copies text with the async Clipboard API and falls back to `copyTextSync`. Resolves to false if nothing worked. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or document not focused: try the legacy path below.
  }
  return copyTextSync(text);
}
