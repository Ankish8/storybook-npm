"use client";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { ThemeSwitch } from "./theme-switch";
import { transitionTheme } from "../lib/theme-transition";
import {
  THEME_KEY,
  isThemeMode,
  resolveTheme,
  type ThemeMode,
  type ResolvedTheme,
} from "../lib/theme";
const CHANGE = "myoperator-theme-change";
const channel = "myoperator-v2-docs";
const ThemeContext = createContext<{
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}>({ mode: "system", resolved: "light", setMode: () => {} });
let memoryMode: ThemeMode | undefined;
function getMode(): ThemeMode {
  if (memoryMode !== undefined) return memoryMode;
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (isThemeMode(value)) return value;
  } catch {
    /* Private browsing can disable storage. */
  }
  return memoryMode ?? "system";
}
function subscribeMode(callback: () => void) {
  const stored = (event: StorageEvent) => {
    if (event.key === null || event.key === THEME_KEY) {
      memoryMode = undefined;
      callback();
    }
  };
  window.addEventListener("storage", stored);
  window.addEventListener(CHANGE, callback);
  return () => {
    window.removeEventListener("storage", stored);
    window.removeEventListener(CHANGE, callback);
  };
}
function subscribeSystem(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function systemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function setMode(mode: ThemeMode) {
  if (!isThemeMode(mode)) return;
  try {
    localStorage.setItem(THEME_KEY, mode);
    memoryMode = undefined;
  } catch {
    memoryMode = mode;
    /* Keep the session preference usable. */
  }
  window.dispatchEvent(new Event(CHANGE));
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(
    subscribeMode,
    getMode,
    () => "system" as ThemeMode
  );
  const dark = useSyncExternalStore(
    subscribeSystem,
    systemDark,
    () =>
      typeof document !== "undefined" &&
      document.documentElement.dataset.theme === "dark"
  );
  const resolved = resolveTheme(mode, dark);
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
    const publish = (frame: HTMLIFrameElement) => {
      try {
        const url = new URL(frame.src, location.href);
        if (!/\/preview\/(index|example)\.html$/.test(url.pathname)) return;
        frame.contentWindow?.postMessage(
          { channel, type: "set-theme", theme: resolved },
          url.origin
        );
      } catch {
        /* An unrelated iframe is outside the docs preview protocol. */
      }
    };
    const all = () =>
      document.querySelectorAll<HTMLIFrameElement>("iframe").forEach(publish);
    const loaded = (event: Event) => {
      if (event.target instanceof HTMLIFrameElement) publish(event.target);
    };
    const ready = (event: MessageEvent) => {
      if (event.data?.channel !== channel || event.data?.type !== "ready")
        return;
      document
        .querySelectorAll<HTMLIFrameElement>("iframe")
        .forEach((frame) => {
          if (
            frame.contentWindow === event.source &&
            new URL(frame.src, location.href).origin === event.origin
          )
            publish(frame);
        });
    };
    all();
    document.addEventListener("load", loaded, true);
    window.addEventListener("message", ready);
    return () => {
      document.removeEventListener("load", loaded, true);
      window.removeEventListener("message", ready);
    };
  }, [resolved]);
  useEffect(() => {
    document.documentElement.dataset.themeMode = mode;
  }, [mode]);
  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useDocsTheme() {
  return useContext(ThemeContext);
}
export function ThemeControl() {
  const { resolved, setMode } = useDocsTheme();
  return (
    <ThemeSwitch
      theme={resolved}
      onThemeChange={(next, trigger) =>
        transitionTheme(next, trigger, () => flushSync(() => setMode(next)))
      }
    />
  );
}
