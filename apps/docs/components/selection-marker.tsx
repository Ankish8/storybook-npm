"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useSpring } from "motion/react";

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(listener: () => void) {
  const media = window.matchMedia(reducedQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const spring = { stiffness: 380, damping: 38, mass: 0.85 };

/** One persistent spring keeps its velocity when selection changes mid-flight. */
export function SelectionMarker({
  selector,
  variant,
  track,
}: {
  selector: string;
  variant: "underline" | "rail" | "surface";
  track: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const initialized = useRef(false);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedQuery).matches,
    () => true
  );
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const width = useSpring(0, spring);
  const height = useSpring(0, spring);
  useLayoutEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    let scheduled = 0;
    let alive = true;
    const measure = () => {
      const selected = parent.querySelector<HTMLElement>(selector);
      if (!selected || !selected.getClientRects().length) {
        setVisible(false);
        initialized.current = false;
        return;
      }
      const container = parent.getBoundingClientRect();
      const rect = selected.getBoundingClientRect();
      const geometry = [
        [
          x,
          variant === "rail"
            ? -1
            : rect.left - container.left + parent.scrollLeft,
        ],
        [
          y,
          variant === "underline"
            ? rect.bottom - container.top + parent.scrollTop - 2
            : rect.top -
              container.top +
              parent.scrollTop +
              (variant === "rail" ? 3 : 0),
        ],
        [width, variant === "rail" ? 2 : rect.width],
        [
          height,
          variant === "underline"
            ? 2
            : rect.height - (variant === "rail" ? 6 : 0),
        ],
      ] as const;
      for (const [value, target] of geometry) {
        if (!initialized.current || reduced) value.jump(target);
        else value.set(target);
      }
      initialized.current = true;
      setVisible(true);
    };
    const schedule = () => {
      if (!alive) return;
      cancelAnimationFrame(scheduled);
      scheduled = requestAnimationFrame(measure);
    };
    measure();
    const resize = new ResizeObserver(schedule);
    resize.observe(parent);
    const mutations = new MutationObserver(schedule);
    mutations.observe(parent, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-active", "aria-selected", "hidden"],
    });
    document.fonts.ready.then(schedule);
    return () => {
      alive = false;
      resize.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(scheduled);
    };
  }, [selector, variant, track, reduced, x, y, width, height]);
  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className={`selection-marker selection-marker-${variant}`}
      data-ready={visible}
      style={{ x, y, width, height, opacity: visible ? 1 : 0 }}
    />
  );
}
