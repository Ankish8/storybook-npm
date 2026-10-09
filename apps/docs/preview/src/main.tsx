import * as React from "react";
import { createRoot } from "react-dom/client";
import { PreviewContext, type Args } from "./preview-api";
import { createStoryRenderer } from "./story-renderer";
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
import {
  applyComparisonState,
  isComparisonState,
  containComparisonFocus,
} from "./comparison-state";

/**
 * Pixels a component's open menu reaches below its story's content, so the preview can reserve them up front and
 * opening a menu never resizes the card or moves what is in it. Measured in real Chrome on each hero story with
 * the trigger nearest the bottom (the menu's bottom edge minus the content's bottom edge), plus 24px of slack and
 * rounded up to 8. Split button and Button group keep their own fixed 420px reserve; Tooltip opens inside its
 * content and needs none.
 */
const popupRoom: Record<string, number> = {
  select: 208,
  "select-field": 184,
  "creatable-select": 216,
  "multi-select": 144,
  "creatable-multi-select": 200,
  "search-filter": 232,
  "dropdown-menu": 80,
};

const query = new URLSearchParams(location.search);
if (query.get("comparison") === "1") containComparisonFocus();
const modules =
  query.get("review") === "before"
    ? import.meta.glob("../before/*.review.tsx")
    : import.meta.glob("../../../../src/components/ui/v2/*.stories.tsx");
const loaders = Object.fromEntries(
  Object.entries(modules).map(([path, load]) => [
    path
      .split("/")
      .at(-1)!
      .replace(/\.(stories|review)\.tsx$/, ""),
    load,
  ])
);
const parentOrigin = expectedParentOrigin(location, query.get("parentOrigin"));
function send(type: string, payload: Record<string, unknown> = {}) {
  if (window.parent !== window)
    window.parent.postMessage(
      { channel: CHANNEL, type, ...serializable(payload) },
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

function App() {
  const comparing = query.get("comparison") === "1";
  const initialComparison = query.get("compareState");
  const [comparisonState, setComparisonState] = React.useState(
    isComparisonState(initialComparison) ? initialComparison : "none"
  );
  const [resetGeneration, setResetGeneration] = React.useState(0);
  const [selection, setSelection] = React.useState({
    component: query.get("component") || "button",
    story: query.get("story") || "Overview",
  });
  const [prepared, setPrepared] = React.useState<any>(null);
  const [args, setArgs] = React.useState<Args>({});
  const [loadingError, setLoadingError] = React.useState("");
  const frame = React.useRef<HTMLDivElement>(null);
  const active = React.useRef<any>(null);
  const raw = React.useRef(args);
  raw.current = args;

  React.useEffect(() => {
    let alive = true;
    active.current = null;
    setPrepared(null);
    setLoadingError("");
    const load = loaders[selection.component];
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
          const result = prepareStory(
            module,
            selection.story,
            selection.component
          );
          active.current = result;
          setArgs({ ...result.initialArgs });
          setPrepared(result);
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
          !loaders[component] ||
          (component === selection.component &&
            active.current &&
            !active.current.entries.some(
              (item: any) => item.id === message.story
            ))
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
        const patch = safePatch(message.args, allowed);
        if (patch) updateArgs(patch);
      } else if (message.type === "reset") {
        if (
          !active.current ||
          (message.component &&
            message.component !== active.current.component) ||
          (message.story && message.story !== active.current.id)
        )
          return;
        resetArgs();
        if (comparing) setResetGeneration((value) => value + 1);
      } else if (message.type === "request-metadata" && active.current)
        publishMetadata(active.current, raw.current);
    };
    window.addEventListener("message", receive);
    send("ready", { component: selection.component, story: selection.story });
    return () => window.removeEventListener("message", receive);
  }, [selection.component, resetArgs, updateArgs, comparing]);

  React.useEffect(() => {
    if (!prepared) return;
    publishMetadata(prepared, args);
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
    // Content that reserves room for a menu stays at the top of the frame (see preview.css).
    document.documentElement.toggleAttribute(
      "data-popup",
      (popupRoom[selection.component] ?? 0) > 0
    );
    let last = 0;
    let scheduled = 0;
    const observedDialogs = new Set<HTMLElement>();
    const report = () => {
      cancelAnimationFrame(scheduled);
      scheduled = requestAnimationFrame(() => {
        const natural = Math.ceil(
          frame.current?.getBoundingClientRect().height || 140
        );
        // Fixed portal overlays require a useful viewport but never resize from viewport height itself.
        const overlay = [
          "modal",
          "panel",
          "toast",
          "date-range-picker",
          "date-time-picker",
        ].includes(selection.component);
        const popup = [
          "select",
          "select-field",
          "creatable-select",
          "multi-select",
          "creatable-multi-select",
          "search-filter",
          "dropdown-menu",
          "split-button",
          "phone-input",
          "tooltip",
        ].includes(selection.component);
        const dialogs = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[role="dialog"], [role="alertdialog"]'
          )
        );
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
        // Size compact dialogs around their actual panel rather than a blanket
        // 640px viewport. Full-height panels retain a stable viewport to avoid
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
        const openPopup = !!document.querySelector(
          '[role="listbox"], [role="menu"], [data-state="open"][data-radix-popper-content-wrapper]'
        );
        const room = popupRoom[selection.component] ?? 0;
        let height = Math.max(
          // Reserve menu space before opening so the trigger and popup don't
          // move halfway through their animation as the iframe grows.
          ["split-button", "button-group"].includes(selection.component)
            ? 420
            : overlay && openDialog
              ? Math.min(dialogHeight, 880)
              : popup && openPopup && !room
                ? 480
                : 200,
          // The content, plus the room its menu needs below it, so opening never resizes the preview.
          Math.min(natural + room, 1800)
        );
        // A menu taller than the reserve (more options through Customize) still fits: the document is as tall as it reaches.
        if (room && openPopup)
          height = Math.max(
            height,
            Math.min(document.documentElement.scrollHeight, 1800)
          );
        if (height !== last) {
          last = height;
          send("resize", { height });
        }
      });
    };
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
      resize.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(scheduled);
    };
  }, [prepared, selection.component]);

  const Render = React.useMemo(
    () => (prepared ? createStoryRenderer(prepared) : null),
    [prepared]
  );
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
      ) : prepared && Render ? (
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

function publishMetadata(prepared: any, args: Args) {
  const description = prepared.parameters.docs?.description?.component || "";
  send("metadata", {
    component: prepared.component,
    title: prepared.title,
    story: prepared.id,
    stories: prepared.entries.map((entry: any) => ({
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
