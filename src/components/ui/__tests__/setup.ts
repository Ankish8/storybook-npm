import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Desktop-like media: primary input can hover (so Tooltip stays hover-driven in tests).
// Individual tests can override `window.matchMedia` for touch/tablet behavior.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === "(hover: hover)",
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  })),
});

// Mock pointer capture methods not supported in JSDOM (needed for Radix UI)
if (typeof Element !== "undefined") {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
}

// motion measures height:auto keyframes and calls window.scrollTo, which JSDOM only logs as
// "Not implemented".
if (typeof window !== "undefined") {
  window.scrollTo = (() => {}) as typeof window.scrollTo;
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
