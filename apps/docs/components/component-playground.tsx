"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Eye,
  Code2,
  RectangleHorizontal,
  Smartphone,
  Copy,
  SlidersHorizontal,
  X,
  RotateCcw,
} from "lucide-react";
import { SelectionMarker } from "./selection-marker";
import { DocsSelect } from "./docs-select";
import { featuredExamples } from "@docs/lib/featured-examples";
import { MigrationSection } from "./migration-comparison";
import { fullscreenFrameStyle, useFrameFullscreen } from "./frame-fullscreen";
import {
  auditedMigrationDocs,
  migrationComparisons,
} from "@docs/lib/migration-comparisons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const docsSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span ?? []), "dataSwatch"],
  },
};
function prepareDocs(text: string) {
  return text
    .replace(/\\#/g, "#")
    .replace(
      /<div style="width:32px;height:32px;background:([^;]+);[^"]*"><\/div>/g,
      (_, color: string) =>
        /^#[0-9a-f]{3,8}$/i.test(color.trim())
          ? `<span data-swatch="${color.trim()}"></span>`
          : ""
    );
}

const channel = "myoperator-v2-docs";
// Origin is fixed for this document. The server snapshot keeps hydration's
// first render identical before React reads the actual browser origin.
const subscribeOrigin = () => () => {};
const getBrowserOrigin = () => window.location.origin;
const getServerOrigin = () => "";
function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
type Args = Record<string, unknown>;
type Control = {
  name?: string;
  description?: string;
  control?:
    | string
    | { type?: string; min?: number; max?: number; step?: number };
  options?: unknown[];
  type?: { name?: string };
  table?: { defaultValue?: { summary?: string } };
};
type Example = { id: string; name: string; description?: string };
type Metadata = {
  component: string;
  title: string;
  story: string;
  stories: Example[];
  args: Args;
  argTypes: Record<string, Control>;
  description?: string;
  docs?:
    | string
    | {
        description?: string;
        storyDescription?: string;
        interactionRunner?: boolean;
      };
};

function JsonControl({
  value,
  onChange,
  id,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  id: string;
}) {
  const serialized = JSON.stringify(value ?? null, null, 2);
  const [editor, setEditor] = useState({
    serialized,
    draft: serialized,
    error: "",
  });
  if (editor.serialized !== serialized) {
    setEditor({ serialized, draft: serialized, error: "" });
  }
  return (
    <div>
      <textarea
        id={id}
        className="control-field"
        rows={3}
        value={editor.draft}
        onChange={(event) => {
          const draft = event.target.value;
          try {
            const next = JSON.parse(draft);
            setEditor({ serialized, draft, error: "" });
            onChange(next);
          } catch {
            setEditor({ serialized, draft, error: "Enter valid JSON." });
          }
        }}
      />
      {editor.error && (
        <p className="control-error" role="status">
          {editor.error}
        </p>
      )}
    </div>
  );
}
function ArgumentControl({
  name,
  control,
  value,
  onChange,
}: {
  name: string;
  control: Control;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = `control-${name}`;
  const config =
    typeof control.control === "object" ? control.control : undefined;
  const type =
    typeof control.control === "string"
      ? control.control
      : (config?.type ?? control.type?.name);
  let input: ReactNode;
  if (type === "boolean")
    input = (
      <input
        id={id}
        type="checkbox"
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
      />
    );
  else if (control.options?.length) {
    input = (
      <DocsSelect
        id={id}
        label={control.name ?? name}
        className="control-field"
        value={JSON.stringify(value) ?? ""}
        onValueChange={(next) => onChange(JSON.parse(next))}
        options={control.options.map((option) => ({
          value: JSON.stringify(option),
          label: typeof option === "string" ? option : JSON.stringify(option),
        }))}
      />
    );
  } else if (type === "number" || type === "range")
    input = (
      <input
        id={id}
        className="control-field"
        type="number"
        value={typeof value === "number" ? value : ""}
        min={config?.min}
        max={config?.max}
        step={config?.step ?? 1}
        onChange={(event) =>
          onChange(
            event.target.value === "" ? undefined : Number(event.target.value)
          )
        }
      />
    );
  else if (type === "object" || typeof value === "object")
    input = <JsonControl id={id} value={value} onChange={onChange} />;
  else
    input = (
      <input
        id={id}
        className="control-field"
        type={type === "color" ? "text" : "text"}
        value={value == null ? "" : String(value)}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  return (
    <div className="control-row">
      <div>
        <label htmlFor={id}>{control.name ?? name}</label>
        {control.description && <small>{control.description}</small>}
      </div>
      {input}
    </div>
  );
}

export function ComponentPlayground({
  slug,
  title,
  anatomy = false,
  examples = [],
  tokenDocumentation,
  children,
}: {
  slug: string;
  title: string;
  /** The page has an Anatomy block (from `children`), listed in the reading guide. */
  anatomy?: boolean;
  /** Curated examples rendered by `children`, listed under "Examples" in the reading guide. */
  examples?: Array<{ id: string; title: string }>;
  /** Source-derived tokens for refreshed pages whose story helper normalizes text colors. */
  tokenDocumentation?: string;
  /** Rendered between the preview and the written documentation: the Anatomy and Examples sections. */
  children?: ReactNode;
}) {
  const curated = examples.length > 0;
  const frame = useRef<HTMLIFrameElement>(null);
  const expectedStory = useRef<string | null>(null);
  const pendingEdits = useRef<Args>({});
  const browserOrigin = useSyncExternalStore(
    subscribeOrigin,
    getBrowserOrigin,
    getServerOrigin
  );
  const preview = useMemo(() => {
    if (!browserOrigin) return { src: "", origin: "", story: "Overview" };
    const origin = process.env.NEXT_PUBLIC_PREVIEW_ORIGIN || browserOrigin;
    const url = new URL("/preview/index.html", origin);
    const story =
      new URL(window.location.href).searchParams.get("example") ||
      featuredExamples[slug] ||
      "Overview";
    url.searchParams.set("component", slug);
    url.searchParams.set("parentOrigin", browserOrigin);
    url.searchParams.set("story", story);
    return { src: url.href, origin: url.origin, story };
  }, [browserOrigin, slug]);
  const { src, origin: frameOrigin } = preview;
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [args, setArgs] = useState<Args>({});
  const [height, setHeight] = useState(300);
  // Pixels the iframe is taller than the card, for an open popup to overflow into; popupOpen unclips them.
  const [room, setRoom] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  useFrameFullscreen(fullscreen);
  const [error, setError] = useState("");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [sourceMode, setSourceMode] = useState<"component" | "story">(
    "component"
  );
  const sourceKey = `${slug}:${sourceMode}`;
  const [sourceResult, setSourceResult] = useState<{
    key: string;
    source: string;
    filename: string;
  } | null>(null);
  const source =
    sourceResult?.key === sourceKey ? sourceResult.source : "Loading source…";
  const filename = sourceResult?.key === sourceKey ? sourceResult.filename : "";
  const [copied, setCopied] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const playgroundRef = useRef<HTMLElement>(null);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const controlsTrigger = useRef<HTMLButtonElement>(null);
  function openControls() {
    setPlaceholderHeight(
      playgroundRef.current?.getBoundingClientRect().height ?? 0
    );
    setView("preview");
    setControlsOpen(true);
  }
  const controlsPanel = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  function closeControls() {
    setControlsOpen(false);
    controlsTrigger.current?.focus({ preventScroll: true });
  }
  useLayoutEffect(() => {
    if (!controlsOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.controlsOpen = "true";
    controlsPanel.current?.focus({ preventScroll: true });
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) {
        setControlsOpen(false);
        controlsTrigger.current?.focus({ preventScroll: true });
      }
    }
    window.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.controlsOpen;
      window.removeEventListener("keydown", escape);
    };
  }, [controlsOpen]);
  const [previewSize, setPreviewSize] = useState<"fit" | "mobile">("fit");
  // The inline preview lets popups overflow its card; the phone frame and the Customize workspace keep the frame's own
  // height (room included) because their canvas scrolls.
  const overflowPreview = previewSize === "fit" && !controlsOpen;
  const cardHeight = Math.max(240, Math.min(height, 880));
  const [activeSection, setActiveSection] = useState("preview");
  // A clicked contents entry stays selected until the reader scrolls or presses a key: a section too close to the page
  // end never reaches the top, so scroll position alone would highlight a neighbour.
  const clickedSection = useRef<string | null>(null);
  const [markdownCopied, setMarkdownCopied] = useState(false);
  const [selectedStory, setSelectedStory] = useState("Overview");
  useLayoutEffect(() => {
    expectedStory.current = preview.story;
  }, [preview]);
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== frameOrigin ||
        event.data?.channel !== channel
      )
        return;
      const message = event.data;
      if (message.component && message.component !== slug) return;
      if (
        (message.type === "metadata" || message.type === "args-updated") &&
        expectedStory.current &&
        message.story !== expectedStory.current
      )
        return;
      if (message.type === "ready")
        frame.current?.contentWindow?.postMessage(
          { channel, type: "request-metadata" },
          frameOrigin
        );
      else if (message.type === "metadata") {
        pendingEdits.current = {};
        setMetadata(message);
        setArgs(message.args ?? {});
        setSelectedStory(message.story);
        setError("");
      } else if (message.type === "args-updated") {
        const received = message.args ?? {};
        for (const [name, value] of Object.entries(pendingEdits.current)) {
          if (JSON.stringify(received[name]) === JSON.stringify(value))
            delete pendingEdits.current[name];
        }
        setArgs({ ...received, ...pendingEdits.current });
        if (message.argTypes)
          setMetadata((previous) =>
            previous ? { ...previous, argTypes: message.argTypes } : previous
          );
      } else if (message.type === "resize" && Number.isFinite(message.height)) {
        setHeight(Math.min(1100, Math.max(200, message.height)));
        setRoom(
          Number.isFinite(message.room)
            ? Math.min(900, Math.max(0, message.room))
            : 0
        );
        setPopupOpen(message.open === true);
        setDialogOpen(message.dialogOpen === true);
        setFullscreen(message.fullscreen === true);
      } else if (message.type === "error") setError(String(message.message));
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [frameOrigin, slug]);
  useEffect(() => {
    if (view !== "code") return;
    const controller = new AbortController();
    fetch(`/api/source?slug=${encodeURIComponent(slug)}&mode=${sourceMode}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Source is unavailable.");
        return response.json();
      })
      .then((data) => {
        if (!controller.signal.aborted)
          setSourceResult({
            key: sourceKey,
            source: data.source,
            filename: data.filename,
          });
      })
      .catch((error) => {
        if (!controller.signal.aborted && error.name !== "AbortError")
          setSourceResult({
            key: sourceKey,
            source: error.message,
            filename: "",
          });
      });
    return () => controller.abort();
  }, [slug, view, sourceMode, sourceKey]);
  function send(type: string, payload: Args = {}) {
    frame.current?.contentWindow?.postMessage(
      { channel, type, component: slug, story: selectedStory, ...payload },
      frameOrigin
    );
  }
  function selectStory(story: string) {
    pendingEdits.current = {};
    expectedStory.current = story;
    send("select-story", { story });
    setSelectedStory(story);
    const url = new URL(window.location.href);
    url.searchParams.set("example", story);
    window.history.replaceState(null, "", url);
  }
  function updateArgument(name: string, value: unknown) {
    pendingEdits.current[name] = value;
    setArgs((previous) => ({ ...previous, [name]: value }));
    send("update-args", { args: { [name]: value } });
  }
  const current = metadata?.stories.find(
    (example) => example.id === selectedStory
  );
  const entries = Object.entries(metadata?.argTypes ?? {});
  const storyDocText =
    typeof metadata?.docs === "string"
      ? metadata.docs
      : (metadata?.docs?.description ?? metadata?.description ?? "");
  const distributionDocs =
    "## Unprefixed Tailwind\n\nv2 installs with unprefixed Tailwind classes. If a screen also uses v1, keep its existing `tw-` stylesheet and compile the v2 paths with an unprefixed Tailwind configuration. Both stylesheets and the semantic theme variables must be available. Changing an import path does not rebuild your host CSS.\n";
  const tokenDocs = tokenDocumentation
    ? storyDocText
        .replace(/## Text hierarchy[\s\S]*?(?=\n## |$)/, "")
        .replace(
          /## Design Tokens[\s\S]*?(?=\n## |$)/i,
          tokenDocumentation + "\n"
        )
    : storyDocText;
  const distributionText = tokenDocumentation
    ? /## Unprefixed Tailwind/.test(tokenDocs)
      ? tokenDocs.replace(
          /## Unprefixed Tailwind[\s\S]*?(?=\n## |$)/,
          distributionDocs
        )
      : tokenDocs + "\n\n" + distributionDocs
    : tokenDocs;
  const migration = auditedMigrationDocs(
    distributionText,
    migrationComparisons[slug]
  );
  const docText = migration.full;
  const headings = [...docText.matchAll(/^## (.+)$/gm)].map((match) => ({
    title: match[1].replace(/[`*_]/g, ""),
    id: headingId(match[1]),
  }));
  useEffect(() => {
    if (!metadata) return;
    let scheduled = 0;
    const update = () => {
      // Read the headings fresh each time: nodes captured once go stale when the page re-renders, and a detached node
      // reports top 0, which made a late section (Design Tokens) look already scrolled past.
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(
          "[data-doc-heading],#preview,#examples,#related"
        )
      ).filter((element) => element.getClientRects().length > 0);
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4;
      const current = atBottom
        ? sections.at(-1)
        : sections
            .filter((element) => element.getBoundingClientRect().top <= 150)
            .at(-1);
      setActiveSection(clickedSection.current ?? current?.id ?? "preview");
    };
    const release = () => {
      clickedSection.current = null;
    };
    const schedule = () => {
      cancelAnimationFrame(scheduled);
      scheduled = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", release);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", release);
      cancelAnimationFrame(scheduled);
    };
  }, [metadata, view]);
  return (
    <>
      {controlsOpen && (
        <div
          aria-hidden="true"
          style={{ height: placeholderHeight, marginTop: 30 }}
        />
      )}
      <section
        ref={playgroundRef}
        data-customizing={controlsOpen}
        id="preview"
        aria-label="Preview"
        className="playground"
      >
        {controlsOpen && (
          <div className="customize-workspace-title">
            <span>{title}</span>
            <span>Live preview</span>
          </div>
        )}
        <div className="playground-toolbar">
          <div
            className="preview-tabs"
            role="tablist"
            aria-label="Example view"
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? "preview"
                  : event.key === "End"
                    ? "code"
                    : view === "preview"
                      ? "code"
                      : "preview";
              setView(next);
              event.currentTarget
                .querySelector<HTMLButtonElement>(`#${next}-tab`)
                ?.focus();
            }}
          >
            <SelectionMarker
              selector='[aria-selected="true"]'
              variant="underline"
              track={view}
            />
            <button
              className="doc-button"
              role="tab"
              id="preview-tab"
              tabIndex={view === "preview" ? 0 : -1}
              aria-controls="preview-panel"
              aria-selected={view === "preview"}
              onClick={() => setView("preview")}
            >
              <Eye aria-hidden="true" /> Preview
            </button>
            <button
              className="doc-button"
              role="tab"
              id="code-tab"
              tabIndex={view === "code" ? 0 : -1}
              aria-controls="code-panel"
              aria-selected={view === "code"}
              onClick={() => setView("code")}
            >
              <Code2 aria-hidden="true" /> Code
            </button>
          </div>
          <div className="preview-tools">
            <button
              ref={controlsTrigger}
              className="doc-button doc-button-bordered controls-trigger"
              aria-expanded={controlsOpen}
              aria-controls="example-controls"
              disabled={!metadata}
              onClick={controlsOpen ? closeControls : openControls}
            >
              <SlidersHorizontal size={14} aria-hidden="true" /> Customize
            </button>
            <div
              className="preview-size"
              role="group"
              aria-label="Preview size"
            >
              <button
                aria-label="Fit preview"
                aria-pressed={previewSize === "fit"}
                onClick={() => setPreviewSize("fit")}
              >
                <RectangleHorizontal />
              </button>
              <button
                aria-label="Mobile preview"
                aria-pressed={previewSize === "mobile"}
                onClick={() => setPreviewSize("mobile")}
              >
                <Smartphone />
              </button>
            </div>
          </div>
        </div>
        <div
          id="preview-panel"
          role="tabpanel"
          aria-labelledby="preview-tab"
          hidden={view !== "preview"}
          className="preview-wrap"
          data-size={previewSize}
          data-overflow={overflowPreview || undefined}
          // The card is as tall as the content (the border adds 2px); the iframe is taller and clipped to it.
          style={overflowPreview ? { height: cardHeight + 2 } : undefined}
        >
          {!metadata && !error && (
            <p className="preview-status" role="status">
              Loading {title}…
            </p>
          )}
          {error && (
            <p className="preview-status" role="alert">
              {error}
            </p>
          )}
          {src && (
            <iframe
              ref={frame}
              title={`${title} interactive preview`}
              className="preview-frame"
              data-preview-fullscreen={fullscreen || undefined}
              src={src}
              onLoad={() =>
                frame.current?.contentWindow?.postMessage(
                  { channel, type: "request-metadata" },
                  frameOrigin
                )
              }
              style={
                fullscreen
                  ? {
                      ...fullscreenFrameStyle,
                      visibility: metadata ? "visible" : "hidden",
                    }
                  : overflowPreview
                    ? {
                        height: cardHeight + room,
                        visibility: metadata ? "visible" : "hidden",
                        // Clipped to the card (and click-through below it) until a popup opens, then the popup shows
                        // over the page instead of leaving blank canvas for it.
                        clipPath:
                          room && !popupOpen
                            ? `inset(0 0 ${room}px 0)`
                            : undefined,
                        zIndex: popupOpen ? 30 : 1,
                      }
                    : {
                        height: Math.max(200, Math.min(cardHeight + room, 880)),
                        visibility: metadata ? "visible" : "hidden",
                        position: metadata ? "static" : "absolute",
                      }
              }
            />
          )}
          {dialogOpen && !fullscreen && (
            <button
              type="button"
              className="doc-button doc-button-bordered migration-fullscreen"
              onClick={() => {
                frame.current?.focus({ preventScroll: true });
                send("show-fullscreen");
              }}
            >
              Open fullscreen
            </button>
          )}
        </div>
        {view === "code" && (
          <div
            id="code-panel"
            role="tabpanel"
            aria-labelledby="code-tab"
            className="source-panel"
          >
            <div className="source-toolbar">
              <span>{filename}</span>
              <div>
                <DocsSelect
                  label="Source file"
                  value={sourceMode}
                  onValueChange={(next) =>
                    setSourceMode(next as typeof sourceMode)
                  }
                  options={[
                    { value: "component", label: "Component source" },
                    { value: "story", label: "Example definitions" },
                  ]}
                />{" "}
                <button
                  className="doc-button doc-button-bordered"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(source);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  {copied ? "Copied" : "Copy code"}
                </button>
              </div>
            </div>
            <pre>
              <code>{source}</code>
            </pre>
          </div>
        )}
        <div
          className="example-summary"
          id={curated ? "current-example" : "examples"}
        >
          <span>Example</span>
          <strong>{current?.name ?? "Loading…"}</strong>
          {current?.description && (
            <div className="example-note">
              <Markdown remarkPlugins={[remarkGfm]}>
                {current.description}
              </Markdown>
            </div>
          )}
        </div>
      </section>
      {children}
      {metadata && (
        <section
          className="documentation"
          aria-label={`${title} documentation`}
        >
          {[migration.before, migration.after].map((text, index) => (
            <div key={index}>
              {index === 1 && <MigrationSection slug={slug} title={title} />}
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, docsSchema]]}
                components={{
                  h2: ({ children }) => (
                    <h2 id={headingId(String(children))} data-doc-heading>
                      {children}
                    </h2>
                  ),
                  span: ({ node, children, ...props }) => {
                    const color = node?.properties?.dataSwatch;
                    return typeof color === "string" &&
                      /^#[0-9a-f]{3,8}$/i.test(color) ? (
                      <span
                        className="token-swatch"
                        style={{ background: color }}
                        aria-label={color}
                      />
                    ) : (
                      <span {...props}>{children}</span>
                    );
                  },
                  table: ({ children }) => (
                    <div className="table-scroll">
                      <table>{children}</table>
                    </div>
                  ),
                }}
              >
                {prepareDocs(text)}
              </Markdown>
            </div>
          ))}
        </section>
      )}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {controlsOpen && (
              <motion.div
                ref={controlsPanel}
                id="example-controls"
                className="controls-drawer"
                role="dialog"
                aria-modal="false"
                aria-labelledby="controls-title"
                aria-describedby="controls-description"
                tabIndex={-1}
                initial={{ opacity: 0, x: reduceMotion ? 0 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
                transition={{
                  duration: reduceMotion ? 0.12 : 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <header className="controls-drawer-header">
                  <div>
                    <span className="controls-eyebrow">{title}</span>
                    <h2 id="controls-title">Customize preview</h2>
                  </div>
                  <button
                    className="controls-close"
                    aria-label="Close controls"
                    onClick={closeControls}
                  >
                    <X size={18} />
                  </button>
                </header>
                <div className="controls-drawer-body">
                  <p id="controls-description">
                    Changes appear live. Keep interacting with the preview while
                    you adjust it.
                  </p>
                  <div className="controls-example">
                    <label htmlFor="controls-example">Example</label>
                    <DocsSelect
                      id="controls-example"
                      label="Example"
                      value={selectedStory}
                      onValueChange={selectStory}
                      options={
                        metadata?.stories.map((example) => ({
                          value: example.id,
                          label:
                            example.name +
                            (metadata.stories.filter(
                              (item) => item.name === example.name
                            ).length > 1
                              ? ` · ${example.id}`
                              : ""),
                        })) ?? []
                      }
                    />
                    {current?.description && (
                      <div className="example-note">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {current.description}
                        </Markdown>
                      </div>
                    )}
                  </div>
                  <h3 className="controls-section-title">
                    Properties <span>{entries.length}</span>
                  </h3>
                  {entries.length ? (
                    entries.map(([name, control]) => (
                      <ArgumentControl
                        key={`${selectedStory}-${name}`}
                        name={name}
                        control={control}
                        value={args[name]}
                        onChange={(value) => updateArgument(name, value)}
                      />
                    ))
                  ) : (
                    <p className="controls-empty">
                      This example has no editable properties. Try another
                      example or interact with the preview.
                    </p>
                  )}
                </div>
                <footer className="controls-drawer-footer">
                  <button
                    className="doc-button doc-button-bordered"
                    onClick={() => {
                      pendingEdits.current = {};
                      send("reset");
                    }}
                  >
                    <RotateCcw size={14} aria-hidden="true" /> Reset example
                  </button>
                  <span>Only affects this preview</span>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      <aside className="arc-toc" aria-label="On this page">
        <h2>On this page</h2>
        <nav>
          <SelectionMarker
            selector='[data-active="true"]'
            variant="rail"
            track={activeSection}
          />
          {[
            { title: "Preview", id: "preview", level: 2 },
            ...(anatomy ? [{ title: "Anatomy", id: "anatomy", level: 2 }] : []),
            { title: "Examples", id: "examples", level: 2 },
            ...examples.map((example) => ({
              title: example.title,
              id: `example-${example.id}`,
              level: 3,
            })),
            ...headings.map((heading) => ({ ...heading, level: 2 })),
            { title: "Related", id: "related", level: 2 },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-level={item.level}
              data-active={activeSection === item.id}
              onClick={() => {
                clickedSection.current = item.id;
                // After the browser has started its anchor scroll: a re-render inside the click cancels that scroll.
                window.setTimeout(() => setActiveSection(item.id), 0);
              }}
            >
              {item.title}
            </a>
          ))}
        </nav>
        <div className="arc-toc-footer">
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(`# ${title}\n\n${docText}`);
                setMarkdownCopied(true);
                setTimeout(() => setMarkdownCopied(false), 1500);
              } catch {
                setMarkdownCopied(false);
              }
            }}
          >
            <Copy size={12} aria-hidden="true" />{" "}
            {markdownCopied ? "Copied Markdown" : "Copy as Markdown"}
          </button>
          <a href="#arc-main">Back to top ↑</a>
        </div>
      </aside>
    </>
  );
}
