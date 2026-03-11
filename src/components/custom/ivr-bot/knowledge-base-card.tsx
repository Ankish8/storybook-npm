import * as React from "react";
import { Download, Trash2, Plus, Info, X, XCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import type { KnowledgeBaseFile } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface KnowledgeBaseCardProps {
  /** List of knowledge base files */
  files: KnowledgeBaseFile[];
  /** Called when files are uploaded and saved */
  onSaveFiles?: (uploadedFiles: File[]) => void;
  /** Called when user clicks "Download sample file" */
  onSampleDownload?: () => void;
  /** Called when user clicks the download button on a file */
  onDownload?: (id: string) => void;
  /** Called when user clicks the delete button on a file */
  onDelete?: (id: string) => void;
  /** Additional className */
  className?: string;
}

// ─── Status config ──────────────────────────────────────────────────────────

type BadgeVariant = "active" | "destructive";
const STATUS_CONFIG: Record<string, { label: string; variant: BadgeVariant }> =
  {
    training: { label: "Training", variant: "active" },
    trained: { label: "Trained", variant: "active" },
    error: { label: "Error", variant: "destructive" },
  };

// ─── File Upload Modal ──────────────────────────────────────────────────────

type UploadStatus = "uploading" | "error" | "done";

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  errorMessage?: string;
}

function FileUploadModal({
  open,
  onOpenChange,
  onSampleDownload,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSampleDownload?: () => void;
  onSave?: (files: File[]) => void;
}) {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const intervalsRef = React.useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const startProgress = React.useCallback((id: string) => {
    const interval = setInterval(() => {
      setItems((prev) => {
        let done = false;
        const updated = prev.map((item) => {
          if (item.id !== id || item.status !== "uploading") return item;
          const next = Math.min(item.progress + 15, 100);
          if (next === 100) done = true;
          return { ...item, progress: next, status: (next === 100 ? "done" : "uploading") as UploadStatus };
        });
        if (done) {
          clearInterval(interval);
          delete intervalsRef.current[id];
        }
        return updated;
      });
    }, 500);
    intervalsRef.current[id] = interval;
  }, []);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach((file) => {
      const id = Math.random().toString(36).slice(2, 9);
      setItems((prev) => [
        ...prev,
        { id, file, progress: 0, status: "uploading" },
      ]);
      startProgress(id);
    });
  };

  const removeItem = (id: string) => {
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClose = () => {
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};
    setItems([]);
    onOpenChange(false);
  };

  const handleSave = () => {
    onSave?.(items.filter((i) => i.status === "done").map((i) => i.file));
    handleClose();
  };

  const getTimeRemaining = (progress: number) => {
    const steps = Math.ceil((100 - progress) / 15);
    const secs = steps * 3;
    return secs > 60
      ? `${Math.ceil(secs / 60)} minutes remaining`
      : `${secs} seconds remaining`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="default"
        hideCloseButton
        className="max-w-[min(660px,calc(100vw-2rem))] rounded-xl p-4 gap-0 sm:p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="m-0 text-base font-semibold text-semantic-text-primary">
            File Upload
          </DialogTitle>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-semantic-text-primary disabled:pointer-events-none"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 items-end w-full">
          {/* Download sample file */}
          <button
            type="button"
            onClick={onSampleDownload}
            className="flex items-center gap-1.5 text-sm font-semibold text-semantic-text-link hover:opacity-80 transition-opacity"
          >
            <Download className="size-3.5" />
            Download sample file
          </button>

          {/* Drop zone */}
          <div
            className="w-full border border-dashed border-semantic-border-layout bg-semantic-bg-ui rounded p-4"
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-[42px] px-4 rounded border border-semantic-border-layout bg-semantic-bg-primary text-base font-semibold text-semantic-text-secondary shrink-0 hover:bg-semantic-bg-hover transition-colors w-full sm:w-auto"
              >
                Upload from device
              </button>
              <div className="flex flex-col gap-1">
                <p className="m-0 text-sm text-semantic-text-secondary tracking-[0.035px]">
                  or drag and drop file here
                </p>
                <p className="m-0 text-xs text-semantic-text-muted tracking-[0.048px]">
                  Max file size 100 MB (Supported Format: .docs, .pdf, .csv,
                  .xls, .xlxs, .txt)
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".doc,.docx,.pdf,.csv,.xls,.xlsx,.txt"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Upload item list */}
          {items.length > 0 && (
            <div className="flex flex-col gap-2.5 w-full">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-semantic-bg-primary border border-semantic-border-layout rounded px-4 py-3 flex flex-col gap-2"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <p className="m-0 text-sm text-semantic-text-primary tracking-[0.035px] truncate">
                        {item.status === "uploading"
                          ? "Uploading..."
                          : item.file.name}
                      </p>
                      {item.status === "uploading" && (
                        <p className="m-0 text-xs text-semantic-text-muted tracking-[0.048px]">
                          {item.progress}%&nbsp;&bull;&nbsp;
                          {getTimeRemaining(item.progress)}
                        </p>
                      )}
                      {item.status === "error" && (
                        <p className="m-0 text-xs text-semantic-error-primary tracking-[0.048px]">
                          {item.errorMessage ??
                            "Something went wrong, Upload Failed."}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={
                        item.status === "uploading"
                          ? "Cancel upload"
                          : "Remove file"
                      }
                      className={cn(
                        "shrink-0 mt-0.5 transition-colors",
                        item.status === "uploading"
                          ? "text-semantic-error-primary"
                          : "text-semantic-text-muted hover:text-semantic-error-primary"
                      )}
                    >
                      {item.status === "uploading" ? (
                        <XCircle className="size-5" />
                      ) : (
                        <Trash2 className="size-5" />
                      )}
                    </button>
                  </div>
                  {item.status === "uploading" && (
                    <div className="h-2 bg-semantic-bg-ui rounded-full overflow-hidden">
                      <div
                        className="h-full bg-semantic-success-primary rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 mt-4 sm:mt-6 sm:flex-row sm:justify-end sm:gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const KnowledgeBaseCard = React.forwardRef<HTMLDivElement, KnowledgeBaseCardProps>(
  (
    {
      files,
      onSaveFiles,
      onSampleDownload,
      onDownload,
      onDelete,
      className,
    },
    ref
  ) => {
    const [uploadOpen, setUploadOpen] = React.useState(false);

    return (
      <>
        <div
          ref={ref}
          className={cn(
            "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout sm:px-6">
            <div className="flex items-center gap-1.5">
              <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
                Knowledge Base
              </h2>
              <Info className="size-3.5 text-semantic-text-muted shrink-0" />
            </div>
            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold text-semantic-text-secondary bg-semantic-primary-surface hover:bg-semantic-bg-hover transition-colors"
            >
              <Plus className="size-3.5" />
              Files
            </button>
          </div>
          {/* File list */}
          <div className="px-4 sm:px-6">
            {files.length === 0 ? (
              <p className="m-0 text-sm text-semantic-text-muted text-center py-5">
                No files added yet. Click &ldquo;+ Files&rdquo; to upload.
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-semantic-border-layout">
                {files.map((file) => {
                  const status = STATUS_CONFIG[file.status] ?? STATUS_CONFIG.training;
                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm text-semantic-text-primary truncate">
                          File {file.name}
                        </span>
                        <Badge
                          variant={status.variant}
                          size="sm"
                          className="px-3 font-normal shrink-0 whitespace-nowrap"
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => onDownload?.(file.id)}
                          className="p-2 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
                          aria-label="Download file"
                        >
                          <Download className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(file.id)}
                          className="p-2 rounded text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors"
                          aria-label="Delete file"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <FileUploadModal
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          onSampleDownload={onSampleDownload}
          onSave={onSaveFiles}
        />
      </>
    );
  }
);
KnowledgeBaseCard.displayName = "KnowledgeBaseCard";

export { KnowledgeBaseCard };
