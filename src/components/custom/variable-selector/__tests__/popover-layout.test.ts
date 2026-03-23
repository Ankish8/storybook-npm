import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { computeAnchoredPopoverLayout } from "../popover-layout";

describe("computeAnchoredPopoverLayout", () => {
  beforeEach(() => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(400);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(700);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clamps width to viewport padding", () => {
    const rect = new DOMRect(0, 100, 50, 24);
    const L = computeAnchoredPopoverLayout(rect, {
      preferredWidth: 427,
      minWidth: 260,
      maxHeight: 248,
      offset: 4,
    });
    expect(L.width).toBeLessThanOrEqual(400 - 16);
    expect(L.left).toBeGreaterThanOrEqual(8);
  });

  it("positions below anchor when space below is sufficient", () => {
    const rect = new DOMRect(20, 100, 200, 24);
    const L = computeAnchoredPopoverLayout(rect, {
      preferredWidth: 300,
      minWidth: 200,
      maxHeight: 248,
      offset: 4,
    });
    expect(L.top).toBe(rect.bottom + 4);
    expect(L.maxHeight).toBeLessThanOrEqual(700 - L.top - 8);
  });
});
