import * as React from "react";
import { UploadCloud, FileText, X } from "lucide-react";
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
    const input = React.useRef<HTMLInputElement>(null);
    const id = React.useId();
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
    return (
      <div
        ref={ref}
        className={cn(
          "w-full font-[family-name:var(--font-v2,Inter,sans-serif)] text-[var(--v2-text-secondary,#5E5E5E)]",
          className
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
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
          type="button"
          disabled={disabled}
          aria-label={`Choose ${label.toLowerCase()}`}
          aria-describedby={id + "-helper"}
          onClick={() => input.current?.click()}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-semantic-border-layout bg-semantic-bg-primary p-6 text-center transition-colors hover:bg-semantic-bg-hover focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary disabled:cursor-not-allowed disabled:bg-semantic-bg-ui disabled:text-[var(--v2-text-muted,#707070)]",
            dragging &&
              !disabled &&
              "border-semantic-border-accent bg-semantic-brand-surface",
            (error || message) && "border-semantic-error-primary"
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary">
            <UploadCloud
              className="size-5 text-[var(--v2-text-secondary,#5E5E5E)]"
              aria-hidden="true"
            />
          </span>
          <span className="text-sm font-medium text-semantic-text-link">
            Click to upload
            <span className="font-normal text-[var(--v2-text-muted,#707070)]">
              {" "}
              or drag and drop
            </span>
          </span>
          <span className="text-xs text-[var(--v2-text-muted,#707070)]">
            {accept || "Any file type"} · up to{" "}
            {Math.round(maxSize / 1024 / 1024)} MB
          </span>
        </button>
        <p
          id={id + "-helper"}
          role={error || message ? "alert" : undefined}
          className={cn(
            "m-0 mt-2 text-xs",
            error || message
              ? "text-semantic-error-text"
              : "text-[var(--v2-text-muted,#707070)]"
          )}
        >
          {error || message || helperText}
        </p>
        {files.length > 0 && (
          <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0">
            {files.map((file, index) => (
              <li
                key={file.name + file.size + index}
                className="flex min-w-0 items-center gap-3 rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-3"
              >
                <FileText
                  aria-hidden="true"
                  className="size-5 shrink-0 text-[var(--v2-text-muted,#707070)]"
                />
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {file.name}
                  </span>
                  <span className="block text-xs text-[var(--v2-text-muted,#707070)]">
                    {Math.ceil(file.size / 1024)} KB
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  aria-label={`Remove ${file.name}`}
                  onClick={() => {
                    change(files.filter((_, i) => i !== index));
                    setMessage("");
                  }}
                >
                  <X />
                </Button>
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
