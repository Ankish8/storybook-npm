/** Forced review states use the same pseudo-state CSS compiler as state stories. */
type ComparisonState = "none" | "focus" | "stagger";
const previous = new WeakMap<HTMLElement, (() => void)[]>();
/** Keep autofocus and focus restoration inside a comparison iframe from scrolling the host review page. */
export function containComparisonFocus(
  scope: Window & typeof globalThis = window
) {
  const prototype = scope.HTMLElement.prototype;
  const original = prototype.focus;
  prototype.focus = function (options?: FocusOptions) {
    original.call(this, { ...options, preventScroll: true });
  };
  return () => {
    prototype.focus = original;
  };
}
export function applyComparisonState(
  frame: HTMLElement,
  state: ComparisonState
) {
  previous.get(frame)?.forEach((cleanup) => cleanup());
  const cleanup: (() => void)[] = [];
  previous.set(frame, cleanup);
  if (state === "focus") {
    const selectors = [
      "input:not([disabled]):not([type=hidden])",
      "textarea:not([disabled])",
      '[role="combobox"]:not([aria-disabled="true"])',
      "button:not([disabled])",
    ];
    const target = selectors
      .map((selector) => frame.querySelector<HTMLElement>(selector))
      .find(Boolean);
    if (!target) return;
    const add = (node: HTMLElement, cls: string) => {
      if (node.classList.contains(cls)) return;
      node.classList.add(cls);
      cleanup.push(() => node.classList.remove(cls));
    };
    add(target, "pseudo-focus");
    add(target, "pseudo-focus-visible");
    for (
      let parent: HTMLElement | null = target;
      parent && frame.contains(parent);
      parent = parent.parentElement
    )
      add(parent, "pseudo-focus-within");
  } else if (state === "stagger") {
    frame
      .querySelectorAll<HTMLElement>('[class*="pulse"],[class*="v2-shimmer"]')
      .forEach((node, index) => {
        const before = node.style.getPropertyValue("--v2-skeleton-delay");
        node.style.setProperty("--v2-skeleton-delay", `${index * 160}ms`);
        cleanup.push(() =>
          before
            ? node.style.setProperty("--v2-skeleton-delay", before)
            : node.style.removeProperty("--v2-skeleton-delay")
        );
      });
  }
}
export function isComparisonState(value: unknown): value is ComparisonState {
  return value === "none" || value === "focus" || value === "stagger";
}
