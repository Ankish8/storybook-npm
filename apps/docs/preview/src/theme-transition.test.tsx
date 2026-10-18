import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { transitionTheme } from "../../lib/theme-transition";

const CHANNEL = "myoperator-v2-docs";
let finish: () => void;
let update: () => Promise<void>;
let ready: () => void;
let skip: ReturnType<typeof vi.fn>;
let start: ReturnType<typeof vi.fn>;
let animate: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false }))
  );
  skip = vi.fn();
  animate = vi.fn();
  vi.stubGlobal("innerWidth", 1000);
  vi.stubGlobal("innerHeight", 800);
  vi.stubGlobal("document", document);
  start = vi.fn((callback: () => Promise<void>) => {
    update = callback;
    return {
      ready: new Promise<void>((resolve) => {
        ready = resolve;
      }),
      finished: new Promise<void>((resolve) => {
        finish = resolve;
      }),
      skipTransition: skip,
    };
  });
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: start,
  });
  Object.defineProperty(document.documentElement, "animate", {
    configurable: true,
    value: animate,
  });
});
afterEach(async () => {
  finish?.();
  await Promise.resolve();
  await Promise.resolve();
  document.body.replaceChildren();
  delete document.documentElement.dataset.themeTransition;
  delete (document as unknown as Record<string, unknown>).startViewTransition;
  delete (document.documentElement as unknown as Record<string, unknown>)
    .animate;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
function trigger() {
  const button = document.createElement("button");
  vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
    left: 900,
    top: 20,
    width: 40,
    height: 40,
  } as DOMRect);
  return button;
}
function frame(visible = true) {
  const iframe = document.createElement("iframe");
  iframe.src = "https://preview.example.test/design-system/preview/index.html";
  document.body.append(iframe);
  vi.spyOn(iframe, "getBoundingClientRect").mockReturnValue({
    left: 100,
    right: 500,
    top: visible ? 100 : 900,
    bottom: visible ? 400 : 1200,
    width: 400,
    height: 300,
  } as DOMRect);
  return iframe;
}

test("captures the old page before applying the theme, then reveals from the button center", async () => {
  const apply = vi.fn();
  transitionTheme("dark", trigger(), apply);
  expect(apply).not.toHaveBeenCalled();
  await update();
  expect(apply).toHaveBeenCalledTimes(1);
  ready();
  await Promise.resolve();
  expect(animate).toHaveBeenCalledWith(
    {
      clipPath: [
        "circle(0px at 920px 40px)",
        `circle(${Math.hypot(920, 760)}px at 920px 40px)`,
      ],
    },
    {
      duration: 500,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      pseudoElement: "::view-transition-new(root)",
    }
  );
  finish();
  await vi.runAllTimersAsync();
  expect(document.documentElement.dataset.themeTransition).toBeUndefined();
});

test.each(["unsupported", "reduced", "capture failure"])(
  "applies immediately for %s",
  (reason) => {
    if (reason === "unsupported")
      Object.defineProperty(document, "startViewTransition", {
        value: undefined,
      });
    if (reason === "reduced")
      vi.stubGlobal(
        "matchMedia",
        vi.fn(() => ({ matches: true }))
      );
    if (reason === "capture failure")
      start.mockImplementation(() => {
        throw new Error("Unavailable");
      });
    const apply = vi.fn();
    transitionTheme("light", trigger(), apply);
    expect(apply).toHaveBeenCalledTimes(1);
    expect(animate).not.toHaveBeenCalled();
    expect(document.documentElement.dataset.themeTransition).toBeUndefined();
  }
);

test("waits for authenticated visible preview acknowledgements before capturing the new theme", async () => {
  const visible = frame();
  const hidden = frame(false);
  const post = vi.spyOn(visible.contentWindow!, "postMessage");
  const hiddenPost = vi.spyOn(hidden.contentWindow!, "postMessage");
  transitionTheme("dark", trigger(), vi.fn());
  let captured = false;
  const capturedPromise = update().then(() => {
    captured = true;
  });
  const message = post.mock.calls[0][0];
  expect(message).toMatchObject({
    channel: CHANNEL,
    type: "set-theme",
    theme: "dark",
  });
  expect(post.mock.calls[0][1]).toBe("https://preview.example.test");
  expect(hiddenPost).not.toHaveBeenCalled();
  const ack = { ...message, type: "theme-applied" };
  const send = (source: Window, origin: string, data = ack) =>
    window.dispatchEvent(new MessageEvent("message", { source, origin, data }));
  send(visible.contentWindow!, "https://spoof.example");
  send(window, "https://preview.example.test");
  send(visible.contentWindow!, "https://preview.example.test", {
    ...ack,
    transitionId: "stale",
  });
  await Promise.resolve();
  expect(captured).toBe(false);
  send(visible.contentWindow!, "https://preview.example.test");
  await capturedPromise;
  expect(captured).toBe(true);
});

test("a suspended preview cannot block theme switching", async () => {
  frame();
  transitionTheme("dark", trigger(), vi.fn());
  const captured = update();
  await vi.advanceTimersByTimeAsync(250);
  await captured;
});

test("a new selection cancels a pending capture and never applies the superseded theme", async () => {
  const earlier = vi.fn();
  transitionTheme("dark", trigger(), earlier);
  const staleUpdate = update;
  const latest = vi.fn();
  transitionTheme("light", trigger(), latest);
  expect(skip).toHaveBeenCalledTimes(1);
  await staleUpdate();
  await update();
  expect(earlier).not.toHaveBeenCalled();
  expect(latest).toHaveBeenCalledTimes(1);
});
