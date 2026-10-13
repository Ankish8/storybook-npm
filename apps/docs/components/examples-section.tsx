"use client";

import { docsPath } from "../lib/paths";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { fullscreenFrameStyle, useFrameFullscreen } from "./frame-fullscreen";

const channel = "myoperator-v2-docs";

export type ExampleItem = {
  id: string;
  title: string;
  description?: string;
  minHeight?: number;
  code: string;
  html: string;
};

/** Descriptions are plain sentences with `code` spans; nothing else needs a Markdown parser. */
function InlineText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  text.split(/(`[^`]+`)/g).forEach((part, index) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2)
      parts.push(<code key={index}>{part.slice(1, -1)}</code>);
    else if (part) parts.push(part);
  });
  return <>{parts}</>;
}

/**
 * A highlighted source block with a copy button and consistent Expand/Collapse control for each live example.
 */
function CodeBlock({
  code,
  html,
  label,
  collapsible = true,
}: {
  code: string;
  html: string;
  label: string;
  collapsible?: boolean;
}) {
  const bodyId = useId();
  const cut = collapsible;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <div className="example-code" data-cut={cut && !open}>
      <button
        type="button"
        className="example-copy"
        aria-label={`Copy ${label} code`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}
      </button>
      <div
        id={bodyId}
        className="example-code-body"
        // Highlighted on the server by shiki from a file in this repository.
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {cut && (
        <button
          type="button"
          className="example-expand"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Collapse code" : "Expand code"}
        </button>
      )}
    </div>
  );
}

/**
 * One live example in its own iframe. The frame only loads once it is near the viewport, so a page with twenty
 * examples does not start twenty copies of the preview app at once, and it reports its own height.
 */
function ExampleFrame({
  slug,
  example,
}: {
  slug: string;
  example: ExampleItem;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState("");
  const [origin, setOrigin] = useState("");
  const [height, setHeight] = useState(160);
  // Pixels the iframe is taller than the card, for an open popup to overflow into; open unclips them.
  const [room, setRoom] = useState(
    example.minHeight ? example.minHeight - 160 : 0
  );
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  useFrameFullscreen(fullscreen);
  const [error, setError] = useState("");

  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    const start = () => {
      const previewOrigin =
        process.env.NEXT_PUBLIC_PREVIEW_ORIGIN || window.location.origin;
      const url = new URL(docsPath("/preview/example.html"), previewOrigin);
      url.searchParams.set("component", slug);
      url.searchParams.set("example", example.id);
      url.searchParams.set("parentOrigin", window.location.origin);
      if (example.minHeight)
        url.searchParams.set("minHeight", String(example.minHeight));
      setOrigin(url.origin);
      setSrc(url.href);
    };
    if (typeof IntersectionObserver === "undefined") return start();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [slug, example.id, example.minHeight]);

  useEffect(() => {
    if (!origin) return;
    function receive(event: MessageEvent) {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== origin ||
        event.data?.channel !== channel ||
        event.data.component !== slug ||
        event.data.example !== example.id
      )
        return;
      const message = event.data;
      if (message.type === "resize" && Number.isFinite(message.height)) {
        setHeight(Math.min(1100, Math.max(120, message.height)));
        setRoom(
          Number.isFinite(message.room)
            ? Math.min(900, Math.max(0, message.room))
            : 0
        );
        setOpen(message.open === true);
        setDialogOpen(message.dialogOpen === true);
        setFullscreen(message.fullscreen === true);
        setReady(true);
      } else if (message.type === "ready") {
        frame.current?.contentWindow?.postMessage(
          { channel, type: "request-size" },
          origin
        );
      } else if (message.type === "error") setError(String(message.message));
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [origin, slug, example.id]);

  return (
    <div ref={holder} className="example-preview" style={{ height }}>
      {!ready && !error && (
        <p className="example-status" role="status">
          Loading example…
        </p>
      )}
      {error && (
        <p className="example-status" role="alert">
          {error}
        </p>
      )}
      {src && (
        <iframe
          ref={frame}
          title={`${example.title} example`}
          className="example-frame"
          data-preview-fullscreen={fullscreen || undefined}
          src={src}
          loading="lazy"
          onLoad={() =>
            frame.current?.contentWindow?.postMessage(
              { channel, type: "request-size" },
              origin
            )
          }
          style={{
            height: height + room,
            visibility: ready && !error ? "visible" : "hidden",
            // Clipped to the card (and click-through below it) until a popup opens, then the popup shows over the page.
            clipPath: room && !open ? `inset(0 0 ${room}px 0)` : undefined,
            zIndex: open ? 30 : 1,
            ...(fullscreen ? fullscreenFrameStyle : {}),
          }}
        />
      )}
      {dialogOpen && !fullscreen && (
        <button
          type="button"
          className="doc-button doc-button-bordered migration-fullscreen"
          onClick={() => {
            frame.current?.focus({ preventScroll: true });
            frame.current?.contentWindow?.postMessage(
              {
                channel,
                type: "show-fullscreen",
                component: slug,
                example: example.id,
              },
              origin
            );
          }}
        >
          Open fullscreen
        </button>
      )}
    </div>
  );
}

export function ExamplesSection({
  slug,
  title,
  anatomy,
  examples,
}: {
  slug: string;
  title: string;
  anatomy?: { code: string; html: string };
  examples: ExampleItem[];
}) {
  return (
    <div className="example-sections">
      {anatomy && (
        <section aria-label={`${title} anatomy`}>
          <h2 id="anatomy" data-doc-heading>
            Anatomy
          </h2>
          <p className="example-description">
            Import the parts you need and compose them, or use the props version
            and let the component draw everything.
          </p>
          <div className="example-card">
            <CodeBlock
              code={anatomy.code}
              html={anatomy.html}
              label={`${title} anatomy`}
              collapsible={false}
            />
          </div>
        </section>
      )}
      <section aria-label={`${title} examples`}>
        <h2 id="examples" data-doc-heading>
          Examples
        </h2>
        {examples.map((example) => (
          <div key={example.id} className="example">
            <h3 id={`example-${example.id}`} data-doc-heading>
              {example.title}
            </h3>
            {example.description && (
              <p className="example-description">
                <InlineText text={example.description} />
              </p>
            )}
            <div className="example-card">
              <ExampleFrame slug={slug} example={example} />
              <CodeBlock
                code={example.code}
                html={example.html}
                label={example.title}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
