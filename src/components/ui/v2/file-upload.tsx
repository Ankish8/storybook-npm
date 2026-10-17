import * as React from "react";
import {
  ArrowUp,
  CircleAlert,
  File as FileGlyph,
  FileArchive,
  FileImage,
  FilePlay,
  FileText,
  RotateCw,
  X,
} from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/** Where a file is in its upload. A row without a status is a plain selection. */
export type FileUploadStatus = "uploading" | "uploaded" | "failed";

/** One row of the file list, as `onUpload` and `defaultItems` see it. */
export interface FileUploadItem {
  /** Stable id of the row. */
  id: string;
  name: string;
  /** Size in bytes. */
  size: number;
  status?: FileUploadStatus;
  /** Upload percent, 0 to 100. */
  progress?: number;
  /** Why the upload failed, shown on the row. */
  error?: string;
  /** Set to `false` to hide the Retry button on a failed row. */
  retryable?: boolean;
  /** The file the visitor chose. Rows from `defaultItems` have none. */
  file?: File;
  /** Thumbnail URL shown instead of the type icon. Image files the visitor adds get one automatically. */
  preview?: string;
}

/**
 * Uploads one file. Report 0 to 100 through `onProgress`, resolve when the file has landed, or reject with an Error
 * whose message becomes the row's reason. Removing the row aborts the signal.
 */
export type FileUploadHandler = (
  item: FileUploadItem,
  options: { onProgress: (percent: number) => void; signal: AbortSignal }
) => Promise<void>;

export interface FileUploadProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: File[];
  defaultValue?: File[];
  onFilesChange?: (files: File[]) => void;
  onReject?: (message: string, file: File) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  name?: string;
  /** Uploads each file as it is added, with a progress bar per row, a reason when it fails and a Retry button. */
  onUpload?: FileUploadHandler;
  /** Most files the list holds. Further files are refused with a message. */
  maxFiles?: number;
  /** Rows present at mount, such as files uploaded earlier. They are not part of `value` or `onFilesChange`. */
  defaultItems?: FileUploadItem[];
  /** Replaces the small line under the prompt (the accepted types and size limit). */
  note?: string;
  /** Prompt shown in place of "Click to upload" while files are dragged over the target. */
  dropLabel?: string;
  /** Once the list holds this many rows the prompt folds to a slim bar, so the list has room. */
  compactAt?: number;
}

function accepts(file: File, accept: string) {
  return (
    !accept ||
    accept.split(",").some((rule) => {
      const type = rule.trim().toLowerCase();
      return type.startsWith(".")
        ? file.name.toLowerCase().endsWith(type)
        : type.endsWith("/*")
          ? file.type.toLowerCase().startsWith(type.slice(0, -1))
          : file.type.toLowerCase() === type;
    })
  );
}
/**
 * While dragging only the MIME types are readable (file names and sizes are hidden until drop). An item is
 * flagged only when every accept rule is a MIME rule and none matches: with an extension rule (.csv) the
 * type alone cannot prove a mismatch, so those drags stay neutral.
 */
function dragWillBeRejected(
  items: DataTransferItemList | undefined,
  accept: string
) {
  const rules = accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  if (!items || !rules.length || rules.some((rule) => rule.startsWith("."))) {
    return false;
  }
  return Array.from(items).some((item) => {
    const type = item.type.toLowerCase();
    return (
      item.kind === "file" &&
      type !== "" &&
      !rules.some((rule) =>
        rule.endsWith("/*") ? type.startsWith(rule.slice(0, -1)) : type === rule
      )
    );
  });
}
const MB = 1024 * 1024;
/** Arc's size format: bytes under 1 KB, whole KB under 1 MB, then MB with one decimal under 10. */
function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  const mb = bytes / MB;
  return `${mb >= 10 ? Math.round(mb) : Number(mb.toFixed(1))} MB`;
}
const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);
// A file has no id, so identity is name, size and modified time: the same triple the duplicate check already uses.
const keyOf = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

function TypeIcon({ name }: { name: string }) {
  const props = { size: 20, strokeWidth: 1.75, "aria-hidden": true } as const;
  const extension = name.toLowerCase().split(".").pop() ?? "";
  if (
    ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "heic"].includes(
      extension
    )
  )
    return <FileImage {...props} />;
  if (["mov", "mp4", "webm", "m4v", "avi"].includes(extension))
    return <FilePlay {...props} />;
  if (["zip", "gz", "tar", "rar", "7z"].includes(extension))
    return <FileArchive {...props} />;
  if (["pdf", "md", "txt", "doc", "docx", "rtf", "csv"].includes(extension))
    return <FileText {...props} />;
  return <FileGlyph {...props} />;
}

/** The thumbnail of an image row, or the type icon when there is none (or the image fails to load). */
function Thumb({ name, preview }: { name: string; preview?: string }) {
  const [broken, setBroken] = React.useState(false);
  if (!preview || broken) {
    return (
      <span className="grid size-10 place-items-center text-[var(--v2-text-secondary,#5E5E5E)]">
        <TypeIcon name={name} />
      </span>
    );
  }
  return (
    <span className="block size-10 overflow-hidden rounded-[10px] bg-semantic-bg-ui shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
      <img
        src={preview}
        alt=""
        width={40}
        height={40}
        decoding="async"
        className="block size-full object-cover"
        onError={() => setBroken(true)}
      />
    </span>
  );
}

interface RowModel extends FileUploadItem {
  /** Whether the row came from a File the visitor chose (and so is part of `value`). */
  owned: boolean;
}

interface RowProps {
  row: RowModel;
  disabled: boolean;
  canRetry: boolean;
  narrow: boolean;
  tiny: boolean;
  onRemove: () => void;
  onRetry: () => void;
}

/**
 * One row. The upload bar opens with the upload, fills on a smooth curve, then folds away just after the count reads
 * 100% and the plain Uploaded label appears; a failure tints the border, shakes the row once and offers Retry.
 */
function FileRow({
  row,
  disabled,
  canRetry,
  narrow,
  tiny,
  onRemove,
  onRetry,
}: RowProps) {
  const { status } = row;
  const target = status === "uploaded" ? 100 : clampPercent(row.progress ?? 0);
  // A finished upload keeps its bar until the fill reaches the end, so 100% is seen before the label turns to Uploaded.
  const [barOpen, setBarOpen] = React.useState(status === "uploading");
  const [phase, setPhase] = React.useState<FileUploadStatus | undefined>(
    status
  );
  React.useEffect(() => {
    if (status === "uploading") {
      setBarOpen(true);
      setPhase("uploading");
      return;
    }
    if (status === "uploaded" && barOpen) {
      // Let the fill finish its curve (400ms) before the label turns and the bar folds.
      const timer = window.setTimeout(() => {
        setPhase("uploaded");
        setBarOpen(false);
      }, 420);
      return () => window.clearTimeout(timer);
    }
    setPhase(status);
    setBarOpen(false);
    // barOpen is read only to decide whether a bar was showing when the upload landed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const failed = status === "failed";
  const rowRef = React.useRef<HTMLDivElement>(null);
  // A failure shakes the row once; a row that arrives already failed (from defaultItems) stays still.
  const shaken = React.useRef<FileUploadStatus | undefined>(status);
  React.useEffect(() => {
    if (shaken.current === status) return;
    shaken.current = status;
    const node = rowRef.current;
    if (
      status !== "failed" ||
      !node ||
      typeof node.animate !== "function" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;
    node.animate(
      {
        transform: [
          "none",
          "translateX(-7px)",
          "translateX(6px)",
          "translateX(-4px)",
          "translateX(3px)",
          "translateX(-1.5px)",
          "none",
        ],
      },
      { duration: 420, easing: "ease-out" }
    );
  }, [status]);

  const shownPhase = phase ?? status;
  const retry = failed && canRetry && row.retryable !== false;
  return (
    <li
      // The row opens its height from zero (grid-template-rows 0fr -> 1fr, smooth spring) while it drops in with a short
      // fade and rise; the gap above each row lives inside the clipped li so it opens from a true zero.
      className="grid min-w-0 grid-rows-[1fr] [transition:grid-template-rows_650ms_var(--arc-smooth)] [@starting-style]:grid-rows-[0fr] motion-reduce:[transition:none]"
    >
      <div className="min-h-0 min-w-0 overflow-hidden">
        <div
          ref={rowRef}
          data-status={status}
          className={cn(
            "mt-2 grid min-h-[58px] min-w-0 items-center gap-x-3 rounded-lg border border-solid bg-semantic-bg-primary py-2 pr-2 [transition:border-color_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:none] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-[22px] motion-safe:zoom-in-[0.94] motion-safe:[animation-duration:420ms] motion-safe:[animation-timing-function:var(--arc-smooth)]",
            tiny
              ? "grid-cols-[minmax(0,1fr)_auto] pl-3.5"
              : "grid-cols-[40px_minmax(0,1fr)_auto] pl-[9px]",
            failed
              ? "border-[color-mix(in_oklab,var(--semantic-error-primary)_26%,var(--semantic-border-layout))]"
              : "border-semantic-border-layout"
          )}
        >
          {!tiny && <Thumb name={row.name} preview={row.preview} />}
          <div className="min-w-0">
            <span
              className="block truncate text-sm font-medium leading-[1.4]"
              title={row.name}
            >
              {row.name}
            </span>
            <span className="mt-px flex min-w-0 items-center whitespace-nowrap text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)] [font-variant-numeric:tabular-nums]">
              <span>{formatFileSize(row.size)}</span>
              {shownPhase && (
                <>
                  <span className="px-1.5" aria-hidden="true">
                    ·
                  </span>
                  <span
                    key={shownPhase}
                    className={cn(
                      "inline-flex min-w-0 items-center gap-[5px] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-[0.3em] motion-safe:[animation-duration:240ms] motion-safe:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                      shownPhase === "uploaded" &&
                        "text-[var(--v2-text-secondary,#5E5E5E)]",
                      shownPhase === "failed" && "text-semantic-error-text"
                    )}
                  >
                    {shownPhase === "uploading" ? (
                      <span>Uploading {Math.round(target)}%</span>
                    ) : shownPhase === "uploaded" ? (
                      <span>Uploaded</span>
                    ) : (
                      <>
                        <CircleAlert
                          className="shrink-0"
                          size={14}
                          strokeWidth={2.25}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 truncate" title={row.error}>
                          <span className="sr-only">Failed: </span>
                          {row.error || "Upload failed"}
                        </span>
                      </>
                    )}
                  </span>
                </>
              )}
            </span>
            {/* The bar's frame opens and folds on the same grid-rows curve the rows use. */}
            <span
              aria-hidden={!barOpen}
              className={cn(
                "grid [transition:grid-template-rows_300ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:none]",
                barOpen
                  ? "[grid-template-rows:1fr] [@starting-style]:grid-rows-[0fr]"
                  : "[grid-template-rows:0fr]"
              )}
            >
              <span className="block min-h-0 overflow-hidden">
                <span
                  role="progressbar"
                  aria-label={`Uploading ${row.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(target)}
                  className="mb-0.5 mt-[7px] block h-1 overflow-hidden rounded-full bg-semantic-border-layout"
                >
                  {/* The fill slides in from the left instead of scaling, so its rounded end keeps its shape. */}
                  <span
                    className="block size-full rounded-[inherit] bg-semantic-primary [transition:transform_420ms_var(--arc-smooth)] motion-reduce:[transition:none]"
                    style={{ transform: `translateX(${target - 100}%)` }}
                  />
                </span>
              </span>
            </span>
          </div>
          <span className="flex items-center">
            {/* Retry opens its own width, so the name column narrows on a curve instead of losing space in one frame. */}
            <span
              aria-hidden={!retry}
              className={cn(
                "grid [transition:grid-template-columns_300ms_cubic-bezier(0.22,1,0.36,1),opacity_160ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:none]",
                retry
                  ? "[grid-template-columns:1fr] opacity-100"
                  : "[grid-template-columns:0fr] opacity-0"
              )}
            >
              <span className="flex min-w-0 overflow-hidden">
                <span className="flex py-[3px] pl-[3px] pr-1.5">
                  <button
                    type="button"
                    data-action="retry"
                    tabIndex={retry ? 0 : -1}
                    disabled={disabled || !retry}
                    aria-label={`Retry ${row.name}`}
                    title="Retry"
                    onClick={onRetry}
                    className={cn(
                      "flex h-[30px] items-center gap-[5px] whitespace-nowrap rounded-full border border-solid border-semantic-border-layout bg-semantic-bg-primary text-xs font-medium text-[var(--v2-text-primary,#484848)] [transition-property:background-color,border-color,transform] [transition-duration:160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] enabled:active:scale-[0.97] enabled:active:[transition-duration:160ms,160ms,120ms] motion-reduce:[transition-property:background-color,border-color] motion-reduce:enabled:active:scale-100 [@media(hover:hover)]:enabled:hover:border-[var(--color-primary-100)] [@media(hover:hover)]:enabled:hover:bg-semantic-bg-hover focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary",
                      narrow ? "w-[30px] justify-center px-0" : "pl-2.5 pr-3"
                    )}
                  >
                    <RotateCw size={14} strokeWidth={2} aria-hidden="true" />
                    {!narrow && <span>Retry</span>}
                  </button>
                </span>
              </span>
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              data-action="remove"
              disabled={disabled}
              aria-label={`Remove ${row.name}`}
              className="h-8 w-8 border-0 bg-transparent shadow-none"
              onClick={onRemove}
            >
              <X />
            </Button>
          </span>
        </div>
      </div>
    </li>
  );
}

/**
 * Arc's three sheets of paper, the target's one illustration. The sheets fan out on hover and wider while a file is over the
 * target; the arrow on the front sheet lifts. Arc's spring (bounce .15, 580ms) is sampled as --arc-spring on the target.
 */
const sheetBase =
  "absolute inset-0 box-border grid place-items-end justify-items-center rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary pb-[5px] text-[var(--v2-text-muted,#707070)] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_3px_8px_rgba(0,0,0,0.04)] [transform-origin:50%_100%] [transform:translate(var(--x),var(--y))_rotate(var(--r))] [transition:transform_580ms_var(--arc-spring),color_240ms_cubic-bezier(0.22,1,0.36,1),border-color_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:none] before:absolute before:left-[7px] before:top-2 before:h-0.5 before:w-4 before:rounded-sm before:bg-current before:opacity-30 before:content-[''] after:absolute after:left-[7px] after:top-[13px] after:h-0.5 after:w-[11px] after:rounded-sm after:bg-current after:opacity-30 after:content-[''] [button[data-drag=over]_&]:text-[var(--v2-text-secondary,#5E5E5E)] [button[data-drag=over]_&]:border-[var(--color-primary-100)]";
const hoverFan =
  "[@media(hover:hover)]:[button:enabled:not([data-drag]):hover_&]:";
const sheetBack = `${sheetBase} [--r:-10deg] [--x:-9px] [--y:2px] ${hoverFan}[--r:-15deg] ${hoverFan}[--x:-13px] [button[data-drag=over]_&]:[--r:-22deg] [button[data-drag=over]_&]:[--x:-20px] [button[data-drag=over]_&]:[--y:-2px]`;
const sheetSide = `${sheetBase} [--r:10deg] [--x:9px] [--y:2px] ${hoverFan}[--r:15deg] ${hoverFan}[--x:13px] [button[data-drag=over]_&]:[--r:22deg] [button[data-drag=over]_&]:[--x:20px] [button[data-drag=over]_&]:[--y:-2px]`;
const sheetFront = `${sheetBase} [--r:0deg] [--x:0px] [--y:0px] ${hoverFan}[--y:-2px] [button[data-drag=over]_&]:[--y:-8px]`;

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      value,
      defaultValue = [],
      onFilesChange,
      onReject,
      accept = "",
      multiple = false,
      maxSize = 10 * 1024 * 1024,
      disabled = false,
      label = "Upload files",
      helperText = "Drag and drop or choose files",
      error,
      name,
      onUpload,
      maxFiles,
      defaultItems,
      note,
      dropLabel,
      compactAt,
      className,
      ...props
    },
    ref
  ) => {
    const [local, setLocal] = React.useState(defaultValue);
    const [extra, setExtra] = React.useState<FileUploadItem[]>(
      () => defaultItems ?? []
    );
    const [message, setMessage] = React.useState("");
    const [announcement, setAnnouncement] = React.useState("");
    const [dragging, setDragging] = React.useState(false);
    const [dragReject, setDragReject] = React.useState(false);
    // Upload state by file key. The files themselves stay in `value` / local state, so a controlled list keeps working.
    const [statuses, setStatuses] = React.useState<
      Record<
        string,
        Pick<FileUploadItem, "status" | "progress" | "error" | "retryable">
      >
    >({});
    const controllers = React.useRef(new Map<string, AbortController>());
    // Thumbnails of image files, as object URLs released when their row goes or the component unmounts.
    const previews = React.useRef(new Map<string, string>());
    // dragenter/dragleave also fire for every child the pointer crosses; the zone is left only when the count
    // of entered elements is back to zero (a bare onDragLeave made the highlight flicker over the icon and text).
    const dragDepth = React.useRef(0);
    const input = React.useRef<HTMLInputElement>(null);
    const id = React.useId();
    const root = React.useRef<HTMLDivElement | null>(null);
    const zone = React.useRef<HTMLButtonElement>(null);
    const edge = React.useRef<SVGRectElement>(null);
    const list = React.useRef<HTMLUListElement>(null);
    const hovered = React.useRef(false);
    // The edge is a drawn stroke fitted to its perimeter (pathLength = 2 x the dash count), so the dashes meet evenly and a
    // drag can close them into one line. 120 is the estimate until the first measurement.
    const [edgeUnits, setEdgeUnits] = React.useState(120);
    const [listWidth, setListWidth] = React.useState(Infinity);
    const files = value ?? local;
    const change = (next: File[]) => {
      if (value === undefined) setLocal(next);
      onFilesChange?.(next);
    };

    const previewFor = (file: File) => {
      const key = keyOf(file);
      const cached = previews.current.get(key);
      if (cached) return cached;
      if (
        !file.type.startsWith("image/") ||
        typeof URL === "undefined" ||
        typeof URL.createObjectURL !== "function"
      )
        return undefined;
      const url = URL.createObjectURL(file);
      previews.current.set(key, url);
      return url;
    };

    const patchStatus = (
      key: string,
      next: Pick<FileUploadItem, "status" | "progress" | "error" | "retryable">
    ) =>
      setStatuses((current) => ({
        ...current,
        [key]: { ...current[key], ...next },
      }));

    const startUpload = (item: FileUploadItem, key: string) => {
      if (!onUpload) return;
      controllers.current.get(key)?.abort();
      const controller = new AbortController();
      controllers.current.set(key, controller);
      patchStatus(key, {
        status: "uploading",
        progress: 0,
        error: undefined,
        retryable: undefined,
      });
      onUpload(
        { ...item, status: "uploading", progress: 0, error: undefined },
        {
          signal: controller.signal,
          onProgress: (percent) => {
            if (controller.signal.aborted) return;
            setStatuses((current) =>
              current[key]?.status === "uploading"
                ? {
                    ...current,
                    [key]: {
                      ...current[key],
                      progress: Math.max(
                        current[key].progress ?? 0,
                        clampPercent(percent)
                      ),
                    },
                  }
                : current
            );
          },
        }
      ).then(
        () => {
          if (controller.signal.aborted) return;
          patchStatus(key, { status: "uploaded", progress: 100 });
          setAnnouncement(`${item.name} uploaded`);
        },
        (reason: unknown) => {
          if (controller.signal.aborted) return;
          const text =
            reason instanceof Error && reason.message
              ? reason.message
              : "Upload failed";
          patchStatus(key, {
            status: "failed",
            error: text,
            retryable: true,
          });
          setAnnouncement(`${item.name} failed. ${text}`);
        }
      );
    };

    const add = (candidates: File[]) => {
      if (disabled) return;
      let problem = "";
      const valid = candidates.filter((file) => {
        const reason = !accepts(file, accept)
          ? `File type not accepted: ${file.name}`
          : file.size > maxSize
            ? `File exceeds the size limit: ${file.name}`
            : "";
        if (reason) {
          problem = reason;
          onReject?.(reason, file);
          return false;
        }
        return true;
      });
      let combined = multiple ? [...files, ...valid] : valid.slice(0, 1);
      combined = combined.filter(
        (file, index, all) =>
          all.findIndex(
            (other) =>
              other.name === file.name &&
              other.size === file.size &&
              other.lastModified === file.lastModified
          ) === index
      );
      if (maxFiles !== undefined && combined.length + extra.length > maxFiles) {
        const room = Math.max(0, maxFiles - extra.length);
        const dropped = combined.slice(room);
        combined = combined.slice(0, room);
        problem = `You can add up to ${maxFiles} file${maxFiles === 1 ? "" : "s"}`;
        dropped.forEach((file) => onReject?.(problem, file));
      }
      setMessage(problem);
      if (!valid.length) return;
      const known = new Set(files.map(keyOf));
      const added = combined.filter((file) => !known.has(keyOf(file)));
      if (added.length) {
        setAnnouncement(
          added.length === 1
            ? `${added[0].name} added`
            : `${added.length} files added`
        );
      }
      change(combined);
      added.forEach((file) =>
        startUpload(
          {
            id: keyOf(file),
            name: file.name,
            size: file.size,
            file,
            preview: previewFor(file),
          },
          keyOf(file)
        )
      );
    };

    // Rows whose file left the list (removed, or replaced in single mode) stop uploading and drop their state.
    const fileKeys = files.map(keyOf).join("|");
    React.useEffect(() => {
      const present = new Set(files.map(keyOf));
      controllers.current.forEach((controller, key) => {
        if (!present.has(key)) {
          controller.abort();
          controllers.current.delete(key);
        }
      });
      previews.current.forEach((url, key) => {
        if (!present.has(key)) {
          URL.revokeObjectURL(url);
          previews.current.delete(key);
        }
      });
      setStatuses((current) => {
        const kept = Object.keys(current).filter((key) => present.has(key));
        return kept.length === Object.keys(current).length
          ? current
          : Object.fromEntries(kept.map((key) => [key, current[key]]));
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileKeys]);
    React.useEffect(() => {
      const active = controllers.current;
      const urls = previews.current;
      return () => {
        active.forEach((controller) => controller.abort());
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }, []);

    React.useLayoutEffect(() => {
      const rect = edge.current;
      if (!rect || typeof rect.getTotalLength !== "function") return;
      const fit = () => {
        const length = rect.getTotalLength();
        if (length > 0) setEdgeUnits(2 * Math.max(1, Math.round(length / 7)));
      };
      fit();
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(fit);
      observer.observe(rect.ownerSVGElement ?? rect);
      return () => observer.disconnect();
    }, []);
    // While a file is over the target it breathes (scale 1 -> 1.012, 2.2s, repeating); reduced motion keeps it still.
    const breathing = dragging && !dragReject && !disabled;
    React.useEffect(() => {
      const node = zone.current;
      if (
        !breathing ||
        !node ||
        typeof node.animate !== "function" ||
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const animation = node.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.012)" },
          { transform: "scale(1)" },
        ],
        {
          duration: 2200,
          iterations: Infinity,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        }
      );
      return () => animation.cancel();
    }, [breathing]);

    // The drag glow: a faint wash inside and a brighter stretch of the edge that follow the pointer on a spring, so the outline
    // leans toward the file. The springs only run while a drag is over the target.
    const pointerX = useMotionValue(50);
    const pointerY = useMotionValue(50);
    const glowX = useSpring(pointerX, {
      stiffness: 260,
      damping: 32,
      mass: 0.8,
    });
    const glowY = useSpring(pointerY, {
      stiffness: 260,
      damping: 32,
      mass: 0.8,
    });
    const accentVar = dragReject
      ? "var(--semantic-error-primary)"
      : "var(--semantic-border-accent)";
    const edgeLight = useMotionTemplate`radial-gradient(180px circle at ${glowX}% ${glowY}%, ${accentVar}, transparent 70%)`;
    const washLight = useMotionTemplate`radial-gradient(260px circle at ${glowX}% ${glowY}%, color-mix(in oklab, ${accentVar} 8%, transparent), transparent 70%)`;
    const track = (event: React.DragEvent) => {
      const node = zone.current;
      if (!node) return;
      const box = node.getBoundingClientRect();
      const x = ((event.clientX - box.left) / Math.max(1, box.width)) * 100;
      const y = ((event.clientY - box.top) / Math.max(1, box.height)) * 100;
      if (!dragging) {
        pointerX.jump(x);
        pointerY.jump(y);
        glowX.jump(x);
        glowY.jump(y);
      } else {
        pointerX.set(x);
        pointerY.set(y);
      }
    };

    // Paste: files on the clipboard (a screenshot, say) are added while the pointer is over the component or focus is
    // inside it. Text fields keep their own paste.
    const addRef = React.useRef(add);
    addRef.current = add;
    React.useEffect(() => {
      if (disabled) return;
      const onPaste = (event: ClipboardEvent) => {
        const target = event.target as HTMLElement | null;
        if (target?.closest("input, textarea, [contenteditable='true']"))
          return;
        const inside =
          hovered.current ||
          (root.current?.contains(document.activeElement) ?? false);
        if (!inside) return;
        const pasted = Array.from(event.clipboardData?.files ?? []);
        if (!pasted.length) return;
        event.preventDefault();
        addRef.current(pasted);
      };
      document.addEventListener("paste", onPaste);
      return () => document.removeEventListener("paste", onPaste);
    }, [disabled]);

    const rows: RowModel[] = [
      ...extra.map((item) => ({ ...item, owned: false })),
      ...files.map((file) => {
        const key = keyOf(file);
        return {
          id: key,
          name: file.name,
          size: file.size,
          file,
          preview: previewFor(file),
          ...statuses[key],
          owned: true,
        };
      }),
    ];
    // Retry keeps only its icon on a narrow list (380px), and the type icon steps aside on the narrowest (300px), so the reason can be read.
    const hasRows = rows.length > 0;
    React.useEffect(() => {
      const node = list.current;
      if (!node || typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(([entry]) => {
        if (entry) setListWidth(entry.contentRect.width);
      });
      observer.observe(node);
      return () => observer.disconnect();
    }, [hasRows]);
    const compact =
      compactAt !== undefined &&
      rows.length >= compactAt &&
      !(dragging && !disabled);
    const invalid = Boolean(error || message);
    const [focusAfter, setFocusAfter] = React.useState<number | null>(null);
    React.useEffect(() => {
      if (focusAfter === null) return;
      const buttons = list.current?.querySelectorAll<HTMLElement>(
        '[data-action="remove"]'
      );
      const target = buttons?.[Math.min(focusAfter, buttons.length - 1)];
      (target ?? zone.current)?.focus();
      setFocusAfter(null);
    }, [focusAfter]);

    const removeRow = (row: RowModel, index: number) => {
      controllers.current.get(row.id)?.abort();
      controllers.current.delete(row.id);
      if (row.owned && row.file) {
        change(files.filter((file) => keyOf(file) !== row.id));
      } else {
        setExtra((current) => current.filter((item) => item.id !== row.id));
      }
      setMessage("");
      setAnnouncement(`${row.name} removed`);
      setFocusAfter(index);
    };

    return (
      <div
        ref={(node) => {
          root.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        className={cn(
          "w-full font-[family-name:var(--font-v2,Inter,sans-serif)] text-[var(--v2-text-secondary,#5E5E5E)] [--arc-smooth:linear(0,.0729,.2134,.3711,.5148,.6316,.7277,.8015,.8554,.8966,.9266,.9477,.9632,.974,.9819,.9874,.9912,.9939,.9958,.9971,1)]",
          className
        )}
        onPointerEnter={() => {
          hovered.current = true;
        }}
        onPointerLeave={() => {
          hovered.current = false;
        }}
        onDragEnter={() => {
          dragDepth.current += 1;
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (disabled) return;
          track(e);
          setDragging(true);
          setDragReject(dragWillBeRejected(e.dataTransfer?.items, accept));
        }}
        onDragLeave={() => {
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) {
            setDragging(false);
            setDragReject(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          setDragReject(false);
          add(Array.from(e.dataTransfer.files));
        }}
        {...props}
      >
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-[var(--v2-text-primary,#484848)]"
        >
          {label}
        </label>
        <input
          ref={input}
          id={id}
          name={name}
          type="file"
          tabIndex={-1}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={id + "-helper"}
          aria-invalid={Boolean(error || message) || undefined}
          className="sr-only"
          onChange={(e) => {
            add(Array.from(e.currentTarget.files || []));
            e.currentTarget.value = "";
          }}
        />
        <button
          ref={zone}
          type="button"
          disabled={disabled}
          aria-label={`Choose ${label.toLowerCase()}`}
          aria-describedby={id + "-helper"}
          data-drag={
            dragging && !disabled ? (dragReject ? "reject" : "over") : undefined
          }
          data-invalid={invalid || undefined}
          data-compact={compact || undefined}
          onClick={() => input.current?.click()}
          className={cn(
            // Arc target: 26px above / 34px below / 20px sides; the edge is the SVG stroke below, not a CSS border. Hover and press
            // lift the surface (press never scales); a file over it tints it, closes the dashes and lights the edge toward the pointer.
            "group/dz relative flex w-full flex-col items-stretch justify-center rounded-xl bg-semantic-bg-primary px-5 pb-[34px] pt-[26px] text-center [--arc-spring:linear(0,.0258,.09,.1763,.2732,.3724,.4683,.5573,.6376,.7082,.7689,.8202,.8628,.8976,.9256,.9476,.9648,.9778,.9875,.9945,.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)] [&>*]:pointer-events-none [transition:background-color_240ms_cubic-bezier(0.22,1,0.36,1),padding_580ms_var(--arc-spring)] motion-reduce:[transition:none] enabled:[@media(hover:hover)]:hover:bg-semantic-bg-hover enabled:active:bg-semantic-bg-hover focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary disabled:cursor-not-allowed disabled:bg-semantic-bg-ui disabled:text-[var(--v2-text-muted,#707070)] data-[compact]:pb-3 data-[compact]:pt-3",
            dragging &&
              !disabled &&
              (dragReject
                ? "bg-semantic-error-surface"
                : "bg-semantic-brand-surface")
          )}
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-[0.5px] top-[0.5px] h-[calc(100%-1px)] w-[calc(100%-1px)] overflow-visible"
          >
            <rect
              ref={edge}
              width="100%"
              height="100%"
              rx={11.5}
              pathLength={edgeUnits}
              className="fill-none stroke-[var(--color-primary-100,#C0C3CA)] [stroke-dasharray:1_1] [stroke-dashoffset:0] [stroke-width:1] [transition:stroke_160ms_cubic-bezier(0.22,1,0.36,1),stroke-dasharray_240ms_cubic-bezier(0.22,1,0.36,1),stroke-dashoffset_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:none] [@media(hover:hover)]:[button:enabled:not([data-drag]):hover_&]:stroke-semantic-text-muted [button[data-invalid]_&]:stroke-semantic-error-primary [button[data-drag=over]_&]:stroke-semantic-border-accent [button[data-drag=reject]_&]:stroke-semantic-error-primary [button[data-drag]_&]:[stroke-dasharray:2_0] [button[data-drag]_&]:[stroke-dashoffset:0.25]"
            />
          </svg>
          {/* The wash and the edge light only show while a file is over the target, and follow the pointer. */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 [transition:opacity_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:hidden group-data-[drag]/dz:opacity-100"
            style={{ background: washLight }}
          />
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 [transition:opacity_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:hidden group-data-[drag]/dz:opacity-100"
            style={{
              background: edgeLight,
              padding: 1.5,
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
            }}
          />
          {/* The illustration and the note fold away (grid rows to zero) in the slim bar, and return for a drag. */}
          <span
            aria-hidden="true"
            className={cn(
              "grid [transition:grid-template-rows_580ms_var(--arc-spring)] motion-reduce:[transition:none]",
              compact ? "[grid-template-rows:0fr]" : "[grid-template-rows:1fr]"
            )}
          >
            <span className="min-h-0">
              <span className="relative mx-auto mb-3.5 mt-2.5 block h-11 w-9">
                <span className={sheetBack} />
                <span className={sheetSide} />
                <span className={sheetFront}>
                  <ArrowUp
                    size={14}
                    strokeWidth={2}
                    className="[transition:transform_580ms_var(--arc-spring)] motion-reduce:[transition:none] [button[data-drag=over]_&]:-translate-y-[3px]"
                  />
                </span>
              </span>
            </span>
          </span>
          <span
            key={dragging && dropLabel ? "drop" : "click"}
            className={cn(
              "block text-sm font-medium leading-[1.4] text-semantic-text-link",
              dragging &&
                dropLabel &&
                "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-[0.3em] motion-safe:[animation-duration:240ms]"
            )}
          >
            {dragging && !disabled && dropLabel ? dropLabel : "Click to upload"}
          </span>
          <span
            className={cn(
              "grid [transition:grid-template-rows_580ms_var(--arc-spring)] motion-reduce:[transition:none]",
              compact ? "[grid-template-rows:0fr]" : "[grid-template-rows:1fr]"
            )}
          >
            <span className="min-h-0 overflow-hidden">
              <span className="mt-1.5 block text-sm leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)]">
                or drag and drop
              </span>
              <span className="block pt-1.5 text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)]">
                {note ??
                  `${accept || "Any file type"} · up to ${Math.round(maxSize / 1024 / 1024)} MB`}
              </span>
            </span>
          </span>
        </button>
        <p
          id={id + "-helper"}
          role={invalid ? "alert" : undefined}
          className={cn(
            "m-0",
            invalid
              ? "flex items-start gap-1.5 pt-3 text-sm leading-[1.4] text-semantic-error-text motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-[0.35em] motion-safe:[animation-duration:240ms] motion-safe:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)]"
              : "mt-2 text-xs text-[var(--v2-text-muted,#707070)]"
          )}
        >
          {invalid && (
            <CircleAlert
              className="mt-[3px] shrink-0"
              size={14}
              strokeWidth={2.25}
              aria-hidden="true"
            />
          )}
          <span className="min-w-0 flex-1">
            {error || message || helperText}
          </span>
        </p>
        {/* Additions, completions and failures, read politely; validation errors above use role=alert. */}
        <p role="status" aria-live="polite" className="m-0 sr-only">
          {announcement}
        </p>
        {rows.length > 0 && (
          <ul
            ref={list}
            className="m-0 flex list-none flex-col p-0"
            onKeyDown={(event) => {
              const action = (event.target as HTMLElement).closest<HTMLElement>(
                "[data-action]"
              );
              if (!action) return;
              const item = action.closest("li");
              if (!item) return;
              const index = Array.from(list.current?.children ?? []).indexOf(
                item
              );
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                // The same action on the neighbouring row (Remove when that row has no Retry).
                const sibling =
                  event.key === "ArrowUp"
                    ? item.previousElementSibling
                    : item.nextElementSibling;
                const next =
                  sibling?.querySelector<HTMLElement>(
                    `[data-action="${action.dataset.action}"]:not(:disabled)`
                  ) ??
                  sibling?.querySelector<HTMLElement>(
                    '[data-action="remove"]:not(:disabled)'
                  );
                if (next) {
                  event.preventDefault();
                  next.focus();
                }
              } else if (
                (event.key === "Delete" || event.key === "Backspace") &&
                !disabled &&
                rows[index]
              ) {
                event.preventDefault();
                removeRow(rows[index], index);
              }
            }}
          >
            {rows.map((row, index) => (
              <FileRow
                key={row.id}
                row={row}
                disabled={disabled}
                canRetry={Boolean(onUpload)}
                narrow={listWidth <= 380}
                tiny={listWidth <= 300}
                onRemove={() => removeRow(row, index)}
                onRetry={() =>
                  startUpload(
                    {
                      id: row.id,
                      name: row.name,
                      size: row.size,
                      file: row.file,
                      preview: row.preview,
                    },
                    row.id
                  )
                }
              />
            ))}
          </ul>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";
export { FileUpload };
