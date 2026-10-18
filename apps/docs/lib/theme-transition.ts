import type { ResolvedTheme } from "./theme";

const CHANNEL = "myoperator-v2-docs";
const DURATION = 500;
type Transition = {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
};
type TransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => Transition;
};
let active: { transition: Transition; cancel: AbortController } | undefined;

/** Wait for visible previews to apply their theme before the new snapshot.
 * Cross-origin previews acknowledge the same authenticated theme protocol;
 * frozen v1 examples acknowledge without changing their original appearance.
 */
function syncPreviews(theme: ResolvedTheme, signal: AbortSignal) {
  const pending = new Map<Window, string>();
  for (const frame of document.querySelectorAll("iframe")) {
    try {
      const url = new URL(frame.src, location.href);
      const rect = frame.getBoundingClientRect();
      if (
        /\/preview\/(index|example)\.html$/.test(url.pathname) &&
        frame.contentWindow &&
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < innerHeight &&
        rect.right > 0 &&
        rect.left < innerWidth
      )
        pending.set(frame.contentWindow, url.origin);
    } catch {
      /* An unrelated iframe is outside the preview protocol. */
    }
  }
  if (!pending.size || signal.aborted) return Promise.resolve();
  const transitionId = crypto.randomUUID();
  return new Promise<void>((resolve) => {
    const done = () => {
      clearTimeout(timeout);
      window.removeEventListener("message", received);
      signal.removeEventListener("abort", done);
      resolve();
    };
    const received = (event: MessageEvent) => {
      if (
        event.data?.channel !== CHANNEL ||
        event.data?.type !== "theme-applied" ||
        event.data?.transitionId !== transitionId ||
        event.data?.theme !== theme ||
        pending.get(event.source as Window) !== event.origin
      )
        return;
      pending.delete(event.source as Window);
      if (!pending.size) done();
    };
    // An unloaded or suspended frame must never hold the theme switch open.
    const timeout = setTimeout(done, 250);
    window.addEventListener("message", received);
    signal.addEventListener("abort", done, { once: true });
    for (const [target, origin] of pending)
      target.postMessage(
        { channel: CHANNEL, type: "set-theme", theme, transitionId },
        origin
      );
  });
}

/** Arc-style reveal, including iframe pixels and body-portalled overlays in the
 * root snapshots. Theme and story state remain in their existing documents.
 */
export function transitionTheme(
  theme: ResolvedTheme,
  trigger: HTMLElement,
  apply: () => void
) {
  active?.cancel.abort();
  active?.transition.skipTransition();
  active = undefined;
  const root = document.documentElement;
  delete root.dataset.themeTransition;
  const start = (document as TransitionDocument).startViewTransition;
  if (!start || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }
  const { left, top, width, height } = trigger.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );
  const cancel = new AbortController();
  root.dataset.themeTransition = "reveal";
  let transition: Transition;
  try {
    transition = start.call(document, async () => {
      if (cancel.signal.aborted) return;
      apply();
      await syncPreviews(theme, cancel.signal);
    });
  } catch {
    delete root.dataset.themeTransition;
    apply();
    return;
  }
  active = { transition, cancel };
  void transition.ready
    .then(() => {
      if (cancel.signal.aborted) return;
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: DURATION,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => {
      /* Hidden tabs and interrupted captures can skip snapshots. */
    });
  void transition.finished
    .catch(() => {})
    .finally(() => {
      if (active?.transition !== transition) return;
      cancel.abort();
      active = undefined;
      delete root.dataset.themeTransition;
    });
}
