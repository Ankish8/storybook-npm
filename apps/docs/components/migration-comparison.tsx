"use client";

import { docsPath } from "../lib/paths";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { RotateCcw } from "lucide-react";
import { DocsSelect } from "./docs-select";
import { migrationComparisons } from "../lib/migration-comparisons";
import { fullscreenFrameStyle, useFrameFullscreen } from "./frame-fullscreen";

const channel = "myoperator-v2-docs";
const subscribeEnvironment = () => () => {};
const browserOrigin = () => window.location.origin;
const serverOrigin = () => "";
const supportsObserver = () => typeof IntersectionObserver !== "undefined";
const serverObserver = () => true;
type StoryOption = { id: string; name: string };
type Version = "v1" | "v2";
type Mode = "legacy";

function ComparisonFrame({
  component,
  title,
  version,
  mode,
  initialStory,
  story,
  reset,
  active,
  onStories,
}: {
  component: string;
  title: string;
  version: Version;
  mode: Mode;
  initialStory: string;
  story: string;
  reset: number;
  active: boolean;
  onStories: (stories: StoryOption[]) => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const expectedStory = useRef(story);
  const origin = useSyncExternalStore(
    subscribeEnvironment,
    browserOrigin,
    serverOrigin
  );
  const [measurement, setMeasurement] = useState({
    height: 240,
    room: 0,
    open: false,
    dialogOpen: false,
    fullscreen: false,
  });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const source = useMemo(() => {
    if (!active || !origin) return null;
    const url = new URL(
      docsPath("/preview/index.html"),
      process.env.NEXT_PUBLIC_PREVIEW_ORIGIN || origin
    );
    url.searchParams.set("component", component);
    url.searchParams.set("story", initialStory);
    url.searchParams.set("version", version === "v1" ? "v1" : "v2");
    url.searchParams.set("comparison", mode);
    url.searchParams.set("parentOrigin", origin);
    return { href: url.href, origin: url.origin };
  }, [active, component, initialStory, mode, version, origin]);

  useEffect(() => {
    if (!source) return;
    expectedStory.current = story;
    frame.current?.contentWindow?.postMessage(
      { channel, type: "select-story", component, story },
      source.origin
    );
  }, [story, source, component]);
  useEffect(() => {
    if (!source || !reset) return;
    frame.current?.contentWindow?.postMessage(
      { channel, type: "reset", component, story },
      source.origin
    );
  }, [reset, source, component, story]);
  useEffect(() => {
    if (!source) return;
    const receive = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== source.origin ||
        event.data?.channel !== channel ||
        event.data?.version !== (version === "v1" ? "v1" : "v2")
      )
        return;
      const message = event.data;
      if (message.component && message.component !== component) return;
      if (message.type === "metadata") {
        if (message.story !== expectedStory.current) return;
        setReady(true);
        setError("");
        const stories = Array.isArray(message.stories)
          ? message.stories.filter(
              (entry: StoryOption) =>
                typeof entry?.id === "string" && typeof entry?.name === "string"
            )
          : [];
        onStories(
          component === "login-otp-input"
            ? stories.filter((entry: StoryOption) => entry.id !== "AllLengths")
            : stories
        );
      } else if (message.type === "resize" && Number.isFinite(message.height)) {
        setMeasurement({
          height: Math.min(1800, Math.max(240, message.height)),
          room: Number.isFinite(message.room)
            ? Math.min(900, Math.max(0, message.room))
            : 0,
          open: message.open === true,
          dialogOpen: message.dialogOpen === true,
          fullscreen: message.fullscreen === true,
        });
      } else if (message.type === "error") setError(String(message.message));
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [source, component, version, onStories]);
  useFrameFullscreen(measurement.fullscreen);
  const height = Math.min(measurement.height, 880);
  const label = version;
  return (
    <div className="migration-pane" data-version={version}>
      <div className="migration-pane-label">
        <strong>{label}</strong>
        <span>Same legacy example</span>
      </div>
      <div
        className="migration-canvas"
        style={{ height }}
        data-open={measurement.open || undefined}
        data-fullscreen={measurement.fullscreen || undefined}
      >
        {!ready && !error && (
          <p className="migration-status" role="status">
            {active
              ? `Loading ${label}…`
              : "Live preview loads near this section."}
          </p>
        )}
        {error && (
          <p className="migration-status" role="alert">
            {error}
          </p>
        )}
        {source && (
          <iframe
            ref={frame}
            src={source.href}
            title={`${title} ${version} live comparison`}
            data-comparison-frame={version}
            data-preview-fullscreen={measurement.fullscreen || undefined}
            onLoad={() =>
              frame.current?.contentWindow?.postMessage(
                { channel, type: "request-metadata" },
                source.origin
              )
            }
            style={{
              height: height + measurement.room,
              visibility: ready ? "visible" : "hidden",
              clipPath:
                measurement.room && !measurement.open
                  ? `inset(0 0 ${measurement.room}px 0)`
                  : undefined,
              zIndex: measurement.open ? 30 : 1,
              ...(measurement.fullscreen ? fullscreenFrameStyle : {}),
            }}
          />
        )}
        {measurement.dialogOpen && !measurement.fullscreen && (
          <button
            type="button"
            className="doc-button doc-button-bordered migration-fullscreen"
            onClick={() => {
              frame.current?.focus({ preventScroll: true });
              frame.current?.contentWindow?.postMessage(
                { channel, type: "show-fullscreen", component, story },
                source?.origin ?? origin
              );
            }}
          >
            Open fullscreen
          </button>
        )}
      </div>
    </div>
  );
}

function LiveComparison({ slug, title }: { slug: string; title: string }) {
  const info = migrationComparisons[slug];
  const [family, setFamily] = useState(0);
  const counterpart = info.counterparts[family];
  const mode: Mode = "legacy";
  const component = counterpart.slug;
  const initialStory = counterpart.story;
  const [story, setStory] = useState(initialStory);
  const [stories, setStories] = useState<StoryOption[]>([]);
  const [reset, setReset] = useState(0);
  const [nearby, setNearby] = useState(false);
  const observable = useSyncExternalStore(
    subscribeEnvironment,
    supportsObserver,
    serverObserver
  );
  const active = nearby || !observable;
  const holder = useRef<HTMLDivElement>(null);
  const receiveStories = useCallback(
    (next: StoryOption[]) =>
      setStories((current) =>
        JSON.stringify(current) === JSON.stringify(next) ? current : next
      ),
    []
  );
  useEffect(() => {
    if (!holder.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearby(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(holder.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={holder}
      className="migration-live"
      data-migration-comparison={slug}
      data-has-v1={Boolean(counterpart)}
    >
      <div className="migration-toolbar">
        {info.counterparts.length > 1 && (
          <DocsSelect
            label="Legacy API"
            value={String(family)}
            options={info.counterparts.map((item, index) => ({
              value: String(index),
              label: item.label,
            }))}
            onValueChange={(value) => {
              const next = Number(value);
              setFamily(next);
              setStory(info.counterparts[next].story);
              setStories([]);
              setReset(0);
            }}
          />
        )}
        <DocsSelect
          label="Comparison example"
          value={story}
          disabled={!stories.length}
          options={
            stories.length
              ? stories.map((item) => ({ value: item.id, label: item.name }))
              : [{ value: story, label: story }]
          }
          onValueChange={setStory}
        />
        <button
          type="button"
          className="doc-button doc-button-bordered"
          onClick={() => setReset((value) => value + 1)}
          disabled={!active}
        >
          <RotateCcw aria-hidden="true" size={14} /> Reset both
        </button>
      </div>
      <p className="migration-caption">
        {`One unchanged ${counterpart.adapted ? "legacy story with the documented API adapter" : "v1 story"}, the same starting content and props. Interact with each version independently.`}
      </p>
      <div className="migration-pair">
        <ComparisonFrame
          key={`${component}:v1`}
          component={component}
          title={title}
          version="v1"
          mode={mode}
          initialStory={initialStory}
          story={story}
          reset={reset}
          active={active}
          onStories={receiveStories}
        />
        <ComparisonFrame
          key={`${component}:v2`}
          component={component}
          title={title}
          version="v2"
          mode={mode}
          initialStory={initialStory}
          story={story}
          reset={reset}
          active={active}
          onStories={receiveStories}
        />
      </div>
      <p className="migration-source">
        {counterpart.slug === "login-otp-input"
          ? "src/components/custom/login/otp-input.stories.tsx"
          : `src/components/ui/${counterpart.slug}.stories.tsx`}{" "}
        · {story}
      </p>
    </div>
  );
}
export function MigrationSection({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const info = migrationComparisons[slug];
  if (!info) return null;
  return (
    <section
      className="migration-section"
      aria-label={`${title} migration from v1`}
    >
      <h2 id="what-changes-from-v1" data-doc-heading>
        What changes from v1
      </h2>
      <ul>
        {info.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      {info.counterparts.length ? (
        <LiveComparison slug={slug} title={title} />
      ) : (
        <p className="migration-caption" data-has-v1="false">
          Added in v2. There was no version 1 of this component.
        </p>
      )}
    </section>
  );
}
