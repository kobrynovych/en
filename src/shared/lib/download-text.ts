/** Saves text as a file through a temporary object URL (works in static exports, no server needed). */
export function downloadTextFile(fileName: string, text: string, type = "text/markdown;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke later: some browsers read the URL asynchronously after the click.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
