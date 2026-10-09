import * as React from "react";
import { createRoot } from "react-dom/client";
import { CHANNEL, expectedParentOrigin } from "./model.mjs";
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
    let last = 0;
    let scheduled = 0;
    const observed = new Set<HTMLElement>();
    const report = () => {
      cancelAnimationFrame(scheduled);
      scheduled = requestAnimationFrame(() => {
        // An open modal is fixed to the frame, so the frame has to grow to fit it; everything else is content-sized.
        const dialogs = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[role="dialog"], [role="alertdialog"]'
          )
        );
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
        const natural = Math.ceil(node.getBoundingClientRect().height);
        const height = Math.min(
          Math.max(minHeight, natural, dialogHeight, 120),
          1800
        );
        if (height !== last) {
          last = height;
          send("resize", { height });
        }
      });
    };
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
        event.data?.channel !== CHANNEL ||
        event.data?.type !== "request-size"
      )
        return;
      last = 0;
      report();
    };
    window.addEventListener("message", receive);
    report();
    document.fonts?.ready.then(report);
    send("ready");
    return () => {
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
