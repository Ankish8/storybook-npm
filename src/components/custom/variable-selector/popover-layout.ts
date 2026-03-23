/**
 * Shared layout for portaled variable popovers (selector + selected-variables).
 * Keeps width within the viewport, clamps horizontal position, and prefers below-anchor
 * placement with reduced max-height or flips above when there is not enough room.
 */

export const POPOVER_VIEWPORT_PADDING = 8;

export interface AnchoredPopoverLayout {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

export function computeAnchoredPopoverLayout(
  anchorRect: DOMRect,
  options: {
    preferredWidth: number;
    /** Minimum width when there is space (readability on narrow anchors). */
    minWidth?: number;
    maxHeight: number;
    offset?: number;
  }
): AnchoredPopoverLayout {
  const pad = POPOVER_VIEWPORT_PADDING;
  const offset = options.offset ?? 4;
  const vw =
    typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh =
    typeof window !== "undefined" ? window.innerHeight : 768;

  const minW = options.minWidth ?? 240;
  const maxW = Math.max(0, vw - 2 * pad);
  const preferred = options.preferredWidth;
  const anchorW = Math.max(anchorRect.width, 1);

  /** Prefer design width, cap by viewport, at least minW vs anchor so narrow fields still get a usable panel. */
  const width = Math.min(
    preferred,
    maxW,
    Math.max(minW, anchorW)
  );

  let left = anchorRect.left;
  if (left + width > vw - pad) {
    left = vw - width - pad;
  }
  if (left < pad) {
    left = pad;
  }

  const spaceBelow = vh - anchorRect.bottom - offset - pad;
  const spaceAbove = anchorRect.top - offset - pad;
  const wantBelow =
    spaceBelow >= 120 ||
    spaceBelow >= spaceAbove;

  let top: number;
  let maxHeight: number;

  if (wantBelow) {
    top = anchorRect.bottom + offset;
    maxHeight = Math.min(options.maxHeight, Math.max(80, spaceBelow));
  } else {
    maxHeight = Math.min(options.maxHeight, Math.max(80, spaceAbove));
    top = Math.max(pad, anchorRect.top - offset - maxHeight);
  }

  return { top, left, width, maxHeight };
}
