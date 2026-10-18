import { installPreviewTheme } from "./theme";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { CHANNEL, expectedParentOrigin } from "./model.mjs";
import { createDialogPresentation } from "./dialog-presentation";
// Both entries share the same CSS order in production chunks.
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
import "./example.css";

type ExampleModule = { default: React.ComponentType };

const query = new URLSearchParams(location.search);
const component = query.get("component") ?? "";
const example = query.get("example") ?? "";
const minHeight = Math.min(
  Math.max(Number(query.get("minHeight")) || 0, 0),
  900
);
const parentOrigin = expectedParentOrigin(location, query.get("parentOrigin"));
installPreviewTheme(parentOrigin);
// What counts as an open popup: menus, listboxes, Radix popper content and the non-modal dialogs the pickers use.
const POPUP_SELECTOR =
  '[role="listbox"], [role="menu"], [data-radix-popper-content-wrapper], [role="dialog"][aria-modal="false"]';

// Only a demo file that exists can be loaded: this glob is the whitelist for ?component= and ?example=.
const loaders = import.meta.glob("../../examples/*/*.tsx") as Record<
  string,
  () => Promise<ExampleModule>
>;
const loader = loaders[`../../examples/${component}/${example}.tsx`];

function send(type: string, payload: Record<string, unknown> = {}) {
  if (window.parent !== window)
    window.parent.postMessage(
      { channel: CHANNEL, type, component, example, ...payload },
      parentOrigin
    );
}

class Boundary extends React.Component<
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
      <p role="alert" className="example-error">
        This example could not render: {this.state.message}
      </p>
    ) : (
      this.props.children
    );
  }
}

function App() {
  const [Demo, setDemo] = React.useState<React.ComponentType | null>(null);
  const [failure, setFailure] = React.useState("");
  const stage = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!loader) {
      const message = `Unknown example: ${component}/${example}`;
      setFailure(message);
      send("error", { message });
      return;
    }
    let alive = true;
    loader()
      .then((module) => alive && setDemo(() => module.default))
      .catch((error: Error) => {
        if (!alive) return;
        setFailure(error.message);
        send("error", { message: error.message });
      });
    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const dialogPresentation = createDialogPresentation();
    let last = "";
    let scheduled = 0;
    const observed = new Set<HTMLElement>();
    const report = () => {
      cancelAnimationFrame(scheduled);
      scheduled = requestAnimationFrame(() => {
        // An open modal is fixed to the frame, so the frame has to grow to fit it; everything else is content-sized.
        const dialogs = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[role="dialog"]:not([aria-modal="false"]), [role="alertdialog"]'
          )
        ).filter((dialog) => dialog.getBoundingClientRect().height > 0);
        for (const dialog of observed) {
          if (!dialogs.includes(dialog)) {
            resize.unobserve(dialog);
            observed.delete(dialog);
          }
        }
        for (const dialog of dialogs) {
          if (!observed.has(dialog)) {
            observed.add(dialog);
            resize.observe(dialog);
          }
        }
        const dialogHeight = dialogs.length
          ? Math.max(
              320,
              ...dialogs.map(
                (dialog) =>
                  Math.ceil(dialog.getBoundingClientRect().height) + 80
              )
            )
          : 0;
        const presentation = dialogPresentation.update(dialogs);
        const natural = Math.ceil(node.getBoundingClientRect().height);
        // The card the page shows is as tall as the content. A popup overflows it into `room`: the iframe is taller by
        // that much (the manifest's minHeight is the viewport the demo needs) and the page clips it until one opens.
        const height = Math.min(Math.max(natural, dialogHeight, 120), 1800);
        const popups = Array.from(
          document.querySelectorAll<HTMLElement>(POPUP_SELECTOR)
        ).filter((popup) => popup.getBoundingClientRect().height > 0);
        const open = popups.length > 0;
        const reserve = Math.max(0, minHeight - height);
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
        const room = Math.min(
          Math.max(reserve, open ? Math.ceil(popupBottom - height) + 16 : 0),
          900
        );
        const key = `${height}|${room}|${open}|${presentation.dialogOpen}|${presentation.fullscreen}`;
        if (key !== last) {
          last = key;
          send("resize", { height, room, open, ...presentation });
        }
      });
    };
    // A popup left open while the reader clicks elsewhere on the page (outside this frame) closes, as a click outside
    // does everywhere else.
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
    const resize = new ResizeObserver(report);
    resize.observe(node);
    const mutations = new MutationObserver(report);
    mutations.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-state", "aria-expanded", "hidden"],
    });
    const receive = (event: MessageEvent) => {
      if (
        event.source !== window.parent ||
        event.origin !== parentOrigin ||
        event.data?.channel !== CHANNEL
      )
        return;
      if (event.data.type === "show-fullscreen")
        dialogPresentation.requestFullscreen();
      else if (event.data.type !== "request-size") return;
      last = "";
      report();
    };
    window.addEventListener("message", receive);
    report();
    document.fonts?.ready.then(report);
    send("ready");
    return () => {
      window.removeEventListener("blur", dismiss);
      document.removeEventListener("pointerdown", activate, true);
      document.removeEventListener("keydown", activate, true);
      resize.disconnect();
      mutations.disconnect();
      window.removeEventListener("message", receive);
      cancelAnimationFrame(scheduled);
    };
  }, []);

  return (
    <div ref={stage} className="example-stage" data-example-stage="">
      {failure ? (
        <p role="alert" className="example-error">
          {failure}
        </p>
      ) : Demo ? (
        <Boundary>
          <Demo />
        </Boundary>
      ) : null}
    </div>
  );
}

// Vite re-runs this module on every hot update. A second createRoot on the same container makes React warn, so the
// root is kept across updates and only re-rendered.
const container = document.getElementById("example-root")!;
const root = import.meta.hot?.data.root ?? createRoot(container);
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(<App />);
