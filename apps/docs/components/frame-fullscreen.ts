"use client";
import { useLayoutEffect } from "react";
/** Keep the docs page in place while the native portal in an existing iframe covers its viewport. */
export function useFrameFullscreen(fullscreen: boolean) {
  useLayoutEffect(() => {
    if (!fullscreen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [fullscreen]);
}
export const fullscreenFrameStyle = {
  position: "fixed",
  inset: 0,
  width: "100vw",
  maxWidth: "none",
  height: "100dvh",
  borderRadius: 0,
  margin: 0,
  border: 0,
  minWidth: 0,
  transition: "none",
  clipPath: "none",
  zIndex: 100,
} as const;
