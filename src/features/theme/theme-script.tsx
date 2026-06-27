const THEME_STORAGE_KEY = "english-path-theme";

// Runs synchronously before first paint to set the correct theme class and
// prevent a flash of wrong color scheme.
const themeCode = `(function(){var k="${THEME_STORAGE_KEY}",r=document.documentElement,s;try{s=localStorage.getItem(k)}catch(e){}var t=(s==="light"||s==="dark")?s:((window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light");r.classList.toggle("dark",t==="dark");r.dataset.theme=t;})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeCode }} suppressHydrationWarning />;
}
