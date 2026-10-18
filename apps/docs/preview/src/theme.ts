import { CHANNEL } from "./model.mjs";
import { isThemeMode, resolveTheme, THEME_KEY } from "../../lib/theme";
/** Theme changes never remount a story or alter its args. V1 remains the frozen light reference. */
export function installPreviewTheme(parentOrigin: string, legacy = false) {
  const query = new URLSearchParams(location.search);
  const apply = (theme: "light" | "dark") => {
    const actual = legacy ? "light" : theme;
    document.documentElement.classList.toggle("dark", actual === "dark");
    document.documentElement.dataset.theme = actual;
    document.documentElement.style.colorScheme = actual;
  };
  let initial = query.get("theme");
  if (!isThemeMode(initial)) {
    try {
      initial = localStorage.getItem(THEME_KEY);
    } catch {
      /* Cross-origin/storage-disabled previews still accept the parent protocol. */
    }
  }
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const initialMode = isThemeMode(initial) ? initial : "system";
  apply(resolveTheme(initialMode, media.matches));
  window.addEventListener("message", (event) => {
    if (
      event.source !== window.parent ||
      event.origin !== parentOrigin ||
      event.data?.channel !== CHANNEL ||
      event.data?.type !== "set-theme"
    )
      return;
    if (event.data.theme === "light" || event.data.theme === "dark") {
      const { theme, transitionId } = event.data;
      apply(theme);
      if (typeof transitionId === "string") {
        // Acknowledge the committed root styles before the new snapshot.
        // Do not wait for a paint: view transitions pause rendering while
        // their update callback runs.
        window.parent.postMessage(
          { channel: CHANNEL, type: "theme-applied", theme, transitionId },
          parentOrigin
        );
      }
    }
  });
  if (window.parent === window) {
    media.addEventListener("change", () => {
      if (initialMode === "system")
        apply(resolveTheme("system", media.matches));
    });
  }
}
