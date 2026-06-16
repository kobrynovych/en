const THEME_STORAGE_KEY = "english-path-theme";

export function ThemeScript() {
  const code = `
(() => {
  const storageKey = "${THEME_STORAGE_KEY}";
  const root = document.documentElement;
  let stored = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {}
  const preference = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  const systemDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)").matches : true;
  const resolved = preference === "system" ? (systemDark ? "dark" : "light") : preference;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
  root.dataset.themePreference = preference;
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
