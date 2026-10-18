"use client";

// Adapted from Arc UI's public theme-switch component:
// https://uiarc.dev/components/theme-switch
// The docs use their own native button and surface tokens.
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import type { ResolvedTheme } from "../lib/theme";

const subscribe = () => () => {};
const iconSpring = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  opacity: { duration: 0.14 },
  filter: { duration: 0.14 },
} as const;

function useSettled() {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setSettled(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);
  return settled;
}

export function ThemeSwitch({
  theme,
  onThemeChange,
}: {
  theme: ResolvedTheme;
  onThemeChange: (theme: ResolvedTheme) => void;
}) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const reduced = useReducedMotion() ?? false;
  const settled = useSettled();
  const next = theme === "light" ? "dark" : "light";
  const Icon = theme === "light" ? Sun : Moon;
  const angle = theme === "light" ? 30 : -30;
  const label = hydrated ? `Switch to ${next} mode` : "Switch color theme";
  return (
    <button
      type="button"
      className="arc-theme-switch"
      data-theme={hydrated ? theme : undefined}
      data-settled={settled ? "true" : undefined}
      aria-label={label}
      title={label}
      aria-pressed={hydrated && theme === "dark"}
      // Pointer activation keeps focus in an open preview popup. Keyboard
      // activation and Tab navigation retain native button behavior.
      onPointerDown={(event) => event.preventDefault()}
      onClick={() => onThemeChange(next)}
    >
      <span className="arc-theme-icon-wrap" aria-hidden="true">
        {hydrated ? (
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={theme}
              className="arc-theme-icon"
              initial={
                !settled
                  ? false
                  : reduced
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.7,
                        rotate: angle,
                        filter: "blur(2px)",
                      }
              }
              animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
              exit={
                !settled || reduced
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      scale: 0.7,
                      rotate: angle,
                      filter: "blur(2px)",
                      transition: { duration: 0.14 },
                    }
              }
              transition={reduced ? { duration: 0 } : iconSpring}
            >
              <Icon size={16} strokeWidth={1.75} />
            </motion.span>
          </AnimatePresence>
        ) : (
          <span className="arc-theme-icon arc-theme-initial">
            <Sun className="arc-theme-sun" size={16} strokeWidth={1.75} />
            <Moon className="arc-theme-moon" size={16} strokeWidth={1.75} />
          </span>
        )}
      </span>
    </button>
  );
}
