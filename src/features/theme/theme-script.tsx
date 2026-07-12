const THEME_STORAGE_KEY = "english-path-theme";

// Runs synchronously before first paint to set the correct theme class and
// prevent a flash of wrong color scheme.
const themeCode = `(function(){var k="${THEME_STORAGE_KEY}",r=document.documentElement,s;try{s=localStorage.getItem(k)}catch(e){}var p=(s==="light"||s==="dark")?s:"system";var t=p==="system"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":p==="system"?"light":p;r.classList.toggle("dark",t==="dark");r.dataset.theme=t;r.dataset.themePreference=p;})();`;

export function ThemeScript() {
  return <Script id="english-path-theme" strategy="beforeInteractive">{themeCode}</Script>;
}
import Script from "next/script";
