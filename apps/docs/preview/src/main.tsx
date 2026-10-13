import * as React from "react";
import { createRoot } from "react-dom/client";
import { PreviewContext, type Args, type PreparedStory } from "./preview-api";
import { createStoryRenderer } from "./story-renderer";
import { createDialogPresentation } from "./dialog-presentation";
import { setActionSink } from "./storybook-test";
import {
  CHANNEL,
  controlArgTypes,
  expectedParentOrigin,
  mapArgs,
  mergeParameters,
  prepareStory,
  safePatch,
  serializable,
} from "./model.mjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../src/index.css";
import "../../../../src/storybook/typography.css";
import "../../../../src/storybook/design-tokens.css";
import "../../../../src/storybook/v2-text-hierarchy.css";
import "../../node_modules/@fontsource/inter/400.css";
import "../../node_modules/@fontsource/inter/500.css";
import "../../node_modules/@fontsource/inter/600.css";
import "../../node_modules/@fontsource/inter/700.css";
import "./preview.css";
import "virtual:docs-legacy-preview.css";
import {
  v1 as legacyV1,
  v2 as legacyV2,
  earlier,
  refreshed,
} from "virtual:docs-legacy-stories";
import {
  applyComparisonState,
  isComparisonState,
  containComparisonFocus,
} from "./comparison-state";

/**
 * Pixels a component's open popup reaches below the preview card, so the iframe can be that much taller than the card
 * and the popup can overflow it (the docs page clips the extra height until a popup is open, so nothing is left as
 * empty canvas). Measured in real Chrome on each hero story with the trigger nearest the bottom (the popup's bottom
 * edge minus the card's bottom edge), plus 24px of slack and rounded up to 8. A popup that turns out taller (more
 * options through Customize) still fits: the room grows to the popup's actual bottom while it is open.
 */
const popupRoom: Record<string, number> = {
  select: 208,
  "select-field": 184,
  "creatable-select": 216,
  "multi-select": 288,
  "creatable-multi-select": 152,
  "search-filter": 176,
  "dropdown-menu": 80,
  "split-button": 56,
  breadcrumbs: 96,
  "date-range-picker": 328,
  "date-time-picker": 304,
  "phone-input": 304,
};
// What counts as an open popup: menus, listboxes, Radix popper content and the non-modal dialogs the pickers use.
const POPUP_SELECTOR =
  '[role="listbox"], [role="menu"], [data-radix-popper-content-wrapper], [role="dialog"][aria-modal="false"]';

const query = new URLSearchParams(location.search);
const legacyComparison = query.get("comparison") === "legacy";
const version = query.get("version") ?? "v2";
if (query.has("comparison")) containComparisonFocus();
const modules =
  query.get("review") === "before"
    ? import.meta.glob("../before/*.review.tsx")
    : import.meta.glob("../../../../src/components/ui/v2/*.stories.tsx");
const currentLoaders = Object.fromEntries(
  Object.entries(modules).map(([path, load]) => [
    path
      .split("/")
      .at(-1)!
      .replace(/\.(stories|review)\.tsx$/, ""),
    load,
  ])
);
const loaders: Record<string, () => Promise<unknown>> =
  query.get("comparison") === "earlier"
    ? version !== "v2"
      ? {}
      : query.get("review") === "before"
        ? earlier
        : refreshed
    : legacyComparison || version === "v1"
      ? version === "v1"
        ? legacyV1
        : version === "v2"
          ? legacyV2
          : {}
      : version === "v2"
        ? currentLoaders
        : {};
const parentOrigin = expectedParentOrigin(location, query.get("parentOrigin"));
document.documentElement.dataset.previewVersion = version;
if (query.has("comparison"))
  document.documentElement.dataset.liveComparison = "true";
function send(type: string, payload: Record<string, unknown> = {}) {
  if (window.parent !== window)
    window.parent.postMessage(
      {
        channel: CHANNEL,
        type,
        version,
        comparison: query.get("comparison"),
        ...serializable(payload),
      },
      parentOrigin
    );
}

class RenderBoundary extends React.Component<
  { children: React.ReactNode },
  { message: string }
> {
  state = { message: "" };
  static getDerivedStateFromError(error: Error) {
    return { message: error.message };
  }
  componentDidCatch(error: Error) {
    send("error", { message: error.message });
  }
  render() {
    return this.state.message ? (
      <p role="alert" className="preview-error">
        This example could not render: {this.state.message}
      </p>
    ) : (
      this.props.children
    );
  }
}

type LoadedStory = {
  prepared: PreparedStory;
  Render: ReturnType<typeof createStoryRenderer>;
};

function App() {
  const comparing = query.has("comparison");
  const initialComparison = query.get("compareState");
  const [comparisonState, setComparisonState] = React.useState(
    isComparisonState(initialComparison) ? initialComparison : "none"
  );
  const [resetGeneration, setResetGeneration] = React.useState(0);
  const [selection, setSelection] = React.useState({
    component: query.get("component") || "button",
    story: query.get("story") || "Overview",
  });
  const [loaded, setLoaded] = React.useState<LoadedStory | null>(null);
  const prepared = loaded?.prepared ?? null;
  const Render = loaded?.Render ?? null;
  const [args, setArgs] = React.useState<Args>({});
  const [loadingError, setLoadingError] = React.useState("");
  const frame = React.useRef<HTMLDivElement>(null);
  const active = React.useRef<PreparedStory | null>(null);
  const raw = React.useRef(args);
  React.useLayoutEffect(() => {
    raw.current = args;
  }, [args]);

  React.useEffect(() => {
    let alive = true;
    active.current = null;
    setLoaded(null);
    setLoadingError("");
    const load = Object.hasOwn(loaders, selection.component)
      ? loaders[selection.component]
      : undefined;
    if (!load) {
      const message = `Unknown component: ${selection.component}`;
      setLoadingError(message);
      send("error", { message });
      return;
    }
    load()
      .then((module) => {
        if (!alive) return;
        try {
          const result: PreparedStory = prepareStory(
            module,
            selection.story,
            selection.component
          );
          active.current = result;
          setArgs({ ...result.initialArgs });
          // Build each selected story once after loading, outside React's render phase.
          setLoaded({ prepared: result, Render: createStoryRenderer(result) });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          setLoadingError(message);
          send("error", { message });
        }
      })
      .catch((error: Error) => {
        if (alive) {
          setLoadingError(error.message);
          send("error", { message: error.message });
        }
      });
    return () => {
      alive = false;
    };
  }, [selection.component, selection.story]);

  React.useEffect(() => {
    const node = frame.current;
    if (!comparing || !prepared || !node) return;
    const apply = () => applyComparisonState(node, comparisonState);
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(node, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      applyComparisonState(node, "none");
    };
  }, [comparing, prepared, comparisonState, resetGeneration]);

  const updateArgs = React.useCallback(
    (patch: Args) => setArgs((previous) => ({ ...previous, ...patch })),
    []
  );
  const resetArgs = React.useCallback((names?: string[]) => {
    const current = active.current;
    if (!current) return;
    setArgs((previous) =>
      names?.length
        ? {
            ...previous,
            ...Object.fromEntries(
              names.map((name) => [name, current.initialArgs[name]])
            ),
          }
        : { ...current.initialArgs }
    );
  }, []);

  React.useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.source !== window.parent ||
        event.origin !== parentOrigin ||
        event.data?.channel !== CHANNEL
      )
        return;
      const message = event.data;
      if (
        comparing &&
        message.type === "review-state" &&
        isComparisonState(message.state)
      ) {
        setComparisonState(message.state);
        return;
      }
      if (
        message.type === "select-story" &&
        typeof message.story === "string"
      ) {
        const component =
          typeof message.component === "string"
            ? message.component
            : selection.component;
        // Existing component/story metadata is the command whitelist.
        if (
          !Object.hasOwn(loaders, component) ||
          (component === selection.component &&
            active.current &&
            !active.current.entries.some((item) => item.id === message.story))
        ) {
          send("error", { message: "Unknown component or story selection." });
          return;
        }
        setSelection({ component, story: message.story });
      } else if (message.type === "update-args" && active.current) {
        if (
          (message.component &&
            message.component !== active.current.component) ||
          (message.story && message.story !== active.current.id)
        )
          return;
        const allowed = new Set(
          Object.keys(controlArgTypes(active.current, raw.current))
        );
        // safePatch validates the JSON record and rejects blocked or unknown control keys.
        const patch = safePatch(message.args, allowed) as Args | null;
        if (patch) updateArgs(patch);
      } else if (message.type === "reset") {
        if (
          !active.current ||
          (message.component &&
            message.component !== active.current.component) ||
          (message.story && message.story !== active.current.id)
        )
          return;
        if (
          query.get("comparison") === "legacy" ||
          query.get("comparison") === "live" ||
          query.get("comparison") === "earlier"
        ) {
          // A module-level legacy store (Toast) survives a React remount. Restart the isolated document,
          // retaining its iframe element and selected example, to reset every component's real starting state.
          const next = new URL(location.href);
          next.searchParams.set("story", active.current.id);
          history.replaceState(null, "", next);
          location.reload();
          return;
        }
        resetArgs();
        if (comparing) setResetGeneration((value) => value + 1);
      } else if (message.type === "request-metadata" && active.current)
        publishMetadata(active.current, raw.current);
    };
    window.addEventListener("message", receive);
    send("ready", { component: selection.component, story: selection.story });
    return () => window.removeEventListener("message", receive);
  }, [selection.component, selection.story, resetArgs, updateArgs, comparing]);

  React.useEffect(() => {
    if (!prepared) return;
    publishMetadata(prepared, raw.current);
  }, [prepared]);
  React.useEffect(() => {
    if (!prepared) return;
    send("args-updated", {
      component: prepared.component,
      story: prepared.id,
      args,
      argTypes: controlArgTypes(prepared, args),
    });
  }, [args, prepared]);
  React.useEffect(() => {
    setActionSink((name, values) =>
      send("action", {
        component: active.current?.component,
        story: active.current?.id,
        name,
        args: values,
      })
    );
    return () => setActionSink(undefined);
  }, []);

  React.useEffect(() => {
    if (!frame.current) return;
    const dialogPresentation = createDialogPresentation();
    let last = "";
    let scheduled = 0;
    const observedDialogs = new Set<HTMLElement>();
    const report = () => {
      cancelAnimationFrame(scheduled);
      scheduled = requestAnimationFrame(() => {
        const natural = Math.ceil(
          frame.current?.getBoundingClientRect().height || 140
        );
        // Fixed portal overlays (modals, panels, toasts) need a useful viewport, so the frame itself grows for them;
        // popups do not: they overflow the card (see popupRoom).
        const dialogs = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[role="dialog"]:not([aria-modal="false"]), [role="alertdialog"]'
          )
        ).filter((dialog) => dialog.getBoundingClientRect().height > 0);
        for (const dialog of observedDialogs) {
          if (!dialogs.includes(dialog)) {
            resize.unobserve(dialog);
            observedDialogs.delete(dialog);
          }
        }
        for (const dialog of dialogs) {
          if (!observedDialogs.has(dialog)) {
            observedDialogs.add(dialog);
            resize.observe(dialog);
          }
        }
        const openDialog = dialogs.length > 0;
        const presentation = dialogPresentation.update(dialogs);
        // Size compact dialogs around their actual panel rather than a blanket
        // 640px viewport. Full-height panels retain a stable 480px viewport to avoid
        // feeding viewport-relative dimensions back into the resize protocol.
        const dialogHeight =
          selection.component === "panel"
            ? 480
            : Math.max(
                320,
                ...dialogs.map(
                  (dialog) =>
                    Math.ceil(dialog.getBoundingClientRect().height) + 80
                )
              );
        const popups = Array.from(
          document.querySelectorAll<HTMLElement>(POPUP_SELECTOR)
        ).filter((popup) => popup.getBoundingClientRect().height > 0);
        const open = popups.length > 0;
        const baseRoom = popupRoom[selection.component] ?? 0;
        const height = Math.min(
          Math.max(200, openDialog ? Math.min(dialogHeight, 880) : 0, natural),
          1800
        );
        // The card is what the docs page shows; the content centres inside it whatever the iframe's height is.
        const card = Math.max(240, Math.min(height, 880));
        document.documentElement.style.setProperty(
          "--preview-card",
          `${card}px`
        );
        const popupBottom = open
          ? Math.max(
              // scrollHeight, not the box: a popup capped to the viewport scrolls inside, and it is the full
              // height that decides how much room it wants.
              ...popups.map((popup) => {
                const box = popup.getBoundingClientRect();
                return (
                  box.top +
                  Math.max(box.height, popup.scrollHeight) +
                  window.scrollY
                );
              })
            )
          : 0;
        // A popup with no measured room (or a taller one than measured) makes the iframe taller once it is open.
        const room = Math.min(
          Math.max(baseRoom, open ? Math.ceil(popupBottom - card) + 16 : 0),
          900
        );
        const key = `${height}|${room}|${open}|${openDialog}|${presentation.fullscreen}`;
        if (key !== last) {
          last = key;
          send("resize", { height, room, open, ...presentation });
        }
      });
    };
    // A popup the reader leaves open and then clicks away from (in the docs page, outside this frame) would stay
    // open over the page: closing it is what a click outside does everywhere else.
    const dismiss = () => {
      if (document.querySelector(POPUP_SELECTOR))
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
        );
    };
    window.addEventListener("blur", dismiss);
    const activate = (event: Event) => {
      if (event.isTrusted) dialogPresentation.activate();
    };
    document.addEventListener("pointerdown", activate, true);
    document.addEventListener("keydown", activate, true);
    const requestFullscreen = (event: MessageEvent) => {
      if (
        event.source === window.parent &&
        event.origin === parentOrigin &&
        event.data?.channel === CHANNEL &&
        event.data.type === "show-fullscreen"
      ) {
        dialogPresentation.requestFullscreen();
        report();
      }
    };
    window.addEventListener("message", requestFullscreen);
    const resize = new ResizeObserver(report);
    resize.observe(frame.current);
    const mutations = new MutationObserver(report);
    mutations.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-state", "aria-expanded", "hidden"],
    });
    report();
    document.fonts?.ready.then(report);
    return () => {
      window.removeEventListener("blur", dismiss);
      document.removeEventListener("pointerdown", activate, true);
      document.removeEventListener("keydown", activate, true);
      window.removeEventListener("message", requestFullscreen);
      resize.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(scheduled);
    };
  }, [prepared, selection.component]);

  const context = prepared
    ? {
        id: `${prepared.component}--${prepared.id}`,
        title: prepared.title,
        name: prepared.story.name || prepared.id,
        args: mapArgs(args, prepared.argTypes),
        initialArgs: prepared.initialArgs,
        argTypes: prepared.argTypes,
        parameters: prepared.parameters,
        globals: {},
        viewMode: "story",
        hooks: {},
        component: prepared.meta.component,
        loaded: {},
        tags: prepared.story.tags || prepared.meta.tags || [],
      }
    : null;
  return (
    <div
      ref={frame}
      data-v2-preview=""
      data-component={prepared?.component}
      data-story={prepared?.id}
      data-layout={prepared?.parameters.layout || "padded"}
      className="preview-frame"
    >
      {loadingError ? (
        <p className="preview-error" role="alert">
          {loadingError}
        </p>
      ) : prepared && Render && context ? (
        <PreviewContext.Provider
          value={{ args, updateArgs, resetArgs, context }}
        >
          <RenderBoundary
            key={`${selection.component}/${selection.story}/${resetGeneration}`}
          >
            <Render />
          </RenderBoundary>
        </PreviewContext.Provider>
      ) : (
        <p className="preview-status" role="status">
          Loading component preview…
        </p>
      )}
    </div>
  );
}

function publishMetadata(prepared: PreparedStory, args: Args) {
  const description = prepared.parameters.docs?.description?.component || "";
  send("metadata", {
    component: prepared.component,
    title: prepared.title,
    story: prepared.id,
    stories: prepared.entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      description:
        mergeParameters(prepared.meta.parameters, entry.story.parameters).docs
          ?.description?.story || "",
      hasPlay: typeof entry.story.play === "function",
    })),
    args,
    argTypes: controlArgTypes(prepared, args),
    description,
    docs: {
      description,
      storyDescription: prepared.parameters.docs?.description?.story || "",
      interactionRunner: false,
    },
    layout: prepared.parameters.layout || "padded",
  });
}
// Vite re-runs this module on every hot update. A second createRoot on the same container makes React warn, so the
// root is kept across updates and only re-rendered.
const container = document.getElementById("preview-root")!;
const root = import.meta.hot?.data.root ?? createRoot(container);
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(<App />);
