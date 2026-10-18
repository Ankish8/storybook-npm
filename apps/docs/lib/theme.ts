export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export const THEME_KEY = "myoperator-docs-theme";
export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}
export function resolveTheme(
  mode: ThemeMode,
  systemDark: boolean
): ResolvedTheme {
  return mode === "system" ? (systemDark ? "dark" : "light") : mode;
}
// Runs before hydration, with no dependence on localStorage availability.
export const themeBootstrap = `(function(){var m="system";try{var s=localStorage.getItem("${THEME_KEY}");if(s==="light"||s==="dark"||s==="system")m=s}catch(e){}var d=m==="dark"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.dataset.theme=d?"dark":"light";document.documentElement.style.colorScheme=d?"dark":"light"})()`;
