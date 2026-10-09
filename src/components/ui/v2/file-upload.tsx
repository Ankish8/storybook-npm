import * as React from "react";
import { ArrowUp, CircleAlert, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
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
      className,
      ...props
    },
    ref
  ) => {
    const [local, setLocal] = React.useState(defaultValue);
    const [message, setMessage] = React.useState("");
    const [dragging, setDragging] = React.useState(false);
    const [dragReject, setDragReject] = React.useState(false);
    // dragenter/dragleave also fire for every child the pointer crosses; the zone is left only when the count
    // of entered elements is back to zero (a bare onDragLeave made the highlight flicker over the icon and text).
    const dragDepth = React.useRef(0);
    const input = React.useRef<HTMLInputElement>(null);
    const id = React.useId();
    const zone = React.useRef<HTMLButtonElement>(null);
    const edge = React.useRef<SVGRectElement>(null);
    // The edge is a drawn stroke fitted to its perimeter (pathLength = 2 x the dash count), so the dashes meet evenly and a
    // drag can close them into one line. 120 is the estimate until the first measurement.
    const [edgeUnits, setEdgeUnits] = React.useState(120);
    const files = value ?? local;
    const change = (next: File[]) => {
      if (value === undefined) setLocal(next);
      onFilesChange?.(next);
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
      setMessage(problem);
      if (!valid.length) return;
      const combined = multiple ? [...files, ...valid] : valid.slice(0, 1);
      const unique = combined.filter(
        (file, index, list) =>
          list.findIndex(
            (other) =>
              other.name === file.name &&
              other.size === file.size &&
              other.lastModified === file.lastModified
          ) === index
      );
      change(unique);
    };
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
    const invalid = Boolean(error || message);
    return (
      <div
        ref={ref}
        className={cn(
          "w-full font-[family-name:var(--font-v2,Inter,sans-serif)] text-[var(--v2-text-secondary,#5E5E5E)]",
          className
        )}
        onDragEnter={() => {
          dragDepth.current += 1;
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (disabled) return;
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
          onClick={() => input.current?.click()}
          className={cn(
            // Arc target: 26px above / 34px below / 20px sides; the edge is the SVG stroke below, not a CSS border. Hover and press
            // lift the surface (press never scales); a file over it tints it and closes the dashes.
            "group/dz relative flex w-full flex-col items-stretch justify-center rounded-xl bg-semantic-bg-primary px-5 pb-[34px] pt-[26px] text-center [--arc-spring:linear(0,.0258,.09,.1763,.2732,.3724,.4683,.5573,.6376,.7082,.7689,.8202,.8628,.8976,.9256,.9476,.9648,.9778,.9875,.9945,.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)] [&>*]:pointer-events-none [transition:background-color_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:none] enabled:[@media(hover:hover)]:hover:bg-semantic-bg-hover enabled:active:bg-semantic-bg-hover focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary disabled:cursor-not-allowed disabled:bg-semantic-bg-ui disabled:text-[var(--v2-text-muted,#707070)]",
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
              className="fill-none stroke-semantic-border-layout [stroke-dasharray:1_1] [stroke-dashoffset:0] [stroke-width:1] [transition:stroke_160ms_cubic-bezier(0.22,1,0.36,1),stroke-dasharray_240ms_cubic-bezier(0.22,1,0.36,1),stroke-dashoffset_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:none] [@media(hover:hover)]:[button:enabled:not([data-drag]):hover_&]:stroke-[var(--color-primary-100)] [button[data-invalid]_&]:stroke-semantic-error-primary [button[data-drag=over]_&]:stroke-semantic-border-accent [button[data-drag=reject]_&]:stroke-semantic-error-primary [button[data-drag]_&]:[stroke-dasharray:2_0] [button[data-drag]_&]:[stroke-dashoffset:0.25]"
            />
          </svg>
          <span
            aria-hidden="true"
            className="relative mx-auto mb-3.5 mt-2.5 block h-11 w-9"
          >
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
          <span className="block text-sm font-medium leading-[1.4] text-semantic-text-link">
            Click to upload
          </span>
          <span className="mt-1.5 block text-sm leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)]">
            or drag and drop
          </span>
          <span className="block pt-1.5 text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)]">
            {accept || "Any file type"} · up to{" "}
            {Math.round(maxSize / 1024 / 1024)} MB
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
        {files.length > 0 && (
          <ul className="m-0 flex list-none flex-col p-0 [--arc-smooth:linear(0,.0729,.2134,.3711,.5148,.6316,.7277,.8015,.8554,.8966,.9266,.9477,.9632,.974,.9819,.9874,.9912,.9939,.9958,.9971,1)]">
            {files.map((file, index) => (
              <li
                key={file.name + file.size + index}
                // The row opens its height from zero (grid-template-rows 0fr -> 1fr, smooth spring) while it drops in with a short
                // fade and rise; the gap above each row lives inside the clipped li so it opens from a true zero.
                className="grid min-w-0 grid-rows-[1fr] [transition:grid-template-rows_650ms_var(--arc-smooth)] [@starting-style]:grid-rows-[0fr] motion-reduce:[transition:none]"
              >
                <div className="min-h-0 min-w-0 overflow-hidden">
                  <div className="mt-2 grid min-h-[58px] min-w-0 grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-3 rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary py-2 pl-[9px] pr-2 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-[22px] motion-safe:zoom-in-[0.94] motion-safe:[animation-duration:420ms] motion-safe:[animation-timing-function:var(--arc-smooth)]">
                    <span className="grid size-10 place-items-center text-[var(--v2-text-secondary,#5E5E5E)]">
                      <FileText
                        aria-hidden="true"
                        size={20}
                        strokeWidth={1.75}
                      />
                    </span>
                    <div className="min-w-0">
                      <span
                        className="block truncate text-sm font-medium leading-[1.4]"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <span className="mt-px block text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)] [font-variant-numeric:tabular-nums]">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={disabled}
                      aria-label={`Remove ${file.name}`}
                      className="h-8 w-8"
                      onClick={() => {
                        change(files.filter((_, i) => i !== index));
                        setMessage("");
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";
export { FileUpload };
