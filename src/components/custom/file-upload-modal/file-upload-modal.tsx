import * as React from "react";
import { Download, Trash2, X, XCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { toast } from "../../ui/toast";
import type {
  FileUploadModalProps,
  UploadItem,
  UploadStatus,
} from "./types";
import { isFileExtensionAllowed } from "./file-upload-accept";

const DEFAULT_ACCEPTED = ".doc,.docx,.pdf,.csv,.xls,.xlsx,.txt";
const DEFAULT_ALLOWED_FILE_TYPES_DESC =
  "Supported format: .doc, .docx, .pdf, .csv, .xls, .xlsx, .txt";
const DEFAULT_DISALLOWED_TYPE_TOAST_TITLE = "Unsupported file type";
const DEFAULT_DISALLOWED_TYPE_TOAST_DESCRIPTION =
  "Only files in the supported formats can be uploaded.";
const DEFAULT_MAX_UPLOAD_TOAST_TITLE = "Too many files";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function useFakeProgress() {
  const intervalsRef = React.useRef<
    Record<string, ReturnType<typeof setInterval>>
  >({});

  const start = React.useCallback(
    (
      id: string,
      setItems: React.Dispatch<React.SetStateAction<UploadItem[]>>
    ) => {
      const interval = setInterval(() => {
        setItems((prev) => {
          let done = false;
          const updated = prev.map((item) => {
            if (item.id !== id || item.status !== "uploading") return item;
            const next = Math.min(item.progress + 15, 100);
            if (next === 100) done = true;
            return {
              ...item,
              progress: next,
              status: (next === 100 ? "done" : "uploading") as UploadStatus,
            };
          });
          if (done) {
            clearInterval(interval);
            delete intervalsRef.current[id];
          }
          return updated;
        });
      }, 500);
      intervalsRef.current[id] = interval;
    },
    []
  );

  const cancel = React.useCallback((id: string) => {
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
  }, []);

  const cancelAll = React.useCallback(() => {
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};
  }, []);

  return { start, cancel, cancelAll };
}

const FileUploadModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      onUpload,
      onSave,
      onCancel,
      onSampleDownload,
      sampleDownloadLabel = "Download Sample File",
      showSampleDownload,
      acceptedFormats = DEFAULT_ACCEPTED,
      formatDescription,
      allowedFileTypesDescription = DEFAULT_ALLOWED_FILE_TYPES_DESC,
      disallowedFileTypeToastTitle = DEFAULT_DISALLOWED_TYPE_TOAST_TITLE,
      disallowedFileTypeToastDescription = DEFAULT_DISALLOWED_TYPE_TOAST_DESCRIPTION,
      maxFileSizeMB = 100,
      maxUpload = 5,
      maxUploadAtCapacityMessage,
      maxUploadOverflowMessage,
      multiple = true,
      title = "File Upload",
      uploadButtonLabel = "Upload from Device",
      dropDescription = "or drag and drop file here",
      saveLabel = "Save",
      cancelLabel = "Cancel",
      loading = false,
      className,
      ...props
    }: FileUploadModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [items, setItems] = React.useState<UploadItem[]>([]);
    const [maxUploadValidationMessage, setMaxUploadValidationMessage] =
      React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const maxUploadErrorId = React.useId();
    const fakeProgress = useFakeProgress();
    const maxUploadToastDismissRef = React.useRef<(() => void) | null>(null);
    const prevItemsLengthRef = React.useRef(0);

    const dismissMaxUploadToast = React.useCallback(() => {
      maxUploadToastDismissRef.current?.();
      maxUploadToastDismissRef.current = null;
    }, []);

    React.useEffect(() => {
      if (items.length < prevItemsLengthRef.current) {
        dismissMaxUploadToast();
        setMaxUploadValidationMessage(null);
      }
      prevItemsLengthRef.current = items.length;
    }, [items.length, dismissMaxUploadToast]);

    React.useEffect(() => {
      if (!open) {
        setMaxUploadValidationMessage(null);
      }
    }, [open]);

    const showMaxUploadToast = React.useCallback(
      (description: string) => {
        dismissMaxUploadToast();
        const handle = toast.error({
          title: DEFAULT_MAX_UPLOAD_TOAST_TITLE,
          description,
        });
        maxUploadToastDismissRef.current = handle.dismiss;
      },
      [dismissMaxUploadToast]
    );

    const shouldShowSampleDownload =
      showSampleDownload ?? !!onSampleDownload;

    const resolvedFormatDescription =
      formatDescription ??
      `Max file size ${maxFileSizeMB} MB · Up to ${maxUpload} files (${allowedFileTypesDescription})`;

    const getAtCapacityCopy = React.useCallback(() => {
      return (
        maxUploadAtCapacityMessage ??
        `You can upload up to ${maxUpload} file${maxUpload === 1 ? "" : "s"}. Remove a file to add another.`
      );
    }, [maxUpload, maxUploadAtCapacityMessage]);

    const getOverflowCopy = React.useCallback(
      (rejected: number) => {
        const maxPhrase = `${maxUpload} file${maxUpload === 1 ? "" : "s"}`;
        const remainingPhrase = `${rejected} file${rejected === 1 ? "" : "s"}`;
        const verb = rejected === 1 ? "was" : "were";
        const built = `Max ${maxPhrase} allowed. Remaining ${remainingPhrase} ${verb} not added.`;
        if (!maxUploadOverflowMessage) return built;
        let out = maxUploadOverflowMessage;
        if (out.includes("{max}")) {
          out = out.replaceAll("{max}", String(maxUpload));
        }
        if (out.includes("{count}")) {
          out = out.replaceAll("{count}", String(rejected));
        }
        return out;
      },
      [maxUpload, maxUploadOverflowMessage]
    );

    const addFiles = React.useCallback(
      (fileList: FileList | null) => {
        if (!fileList) return;

        const files = Array.from(fileList);
        const disallowed = files.filter(
          (file) => !isFileExtensionAllowed(file.name, acceptedFormats)
        );
        if (disallowed.length > 0) {
          if (disallowed.length === 1) {
            toast.error({
              title: disallowedFileTypeToastTitle,
              description: disallowedFileTypeToastDescription,
            });
          } else {
            toast.error({
              title: disallowedFileTypeToastTitle,
              description: `${disallowed.length} files are not in a supported format. ${disallowedFileTypeToastDescription}`,
            });
          }
        }

        const allowed = files.filter((file) =>
          isFileExtensionAllowed(file.name, acceptedFormats)
        );

        let needsAtCapacityToast = false;
        let overflowRejected = 0;
        const uploadJobs: { id: string; file: File }[] = [];
        const idsToStartFakeProgress: string[] = [];

        setItems((prev) => {
          const remainingSlots = Math.max(0, maxUpload - prev.length);

          if (allowed.length > 0 && remainingSlots <= 0) {
            needsAtCapacityToast = true;
            return prev;
          }

          const allowedToQueue = allowed.slice(0, remainingSlots);
          if (allowed.length > allowedToQueue.length) {
            overflowRejected = allowed.length - allowedToQueue.length;
          }

          const additions: UploadItem[] = [];

          for (const file of allowedToQueue) {
            const id = generateId();
            if (file.size > maxFileSizeMB * 1024 * 1024) {
              additions.push({
                id,
                file,
                progress: 0,
                status: "error",
                errorMessage: `File exceeds ${maxFileSizeMB} MB limit`,
              });
            } else {
              additions.push({
                id,
                file,
                progress: 0,
                status: "uploading",
              });
              uploadJobs.push({ id, file });
              if (!onUpload) {
                idsToStartFakeProgress.push(id);
              }
            }
          }

          return [...prev, ...additions];
        });

        if (needsAtCapacityToast) {
          const msg = getAtCapacityCopy();
          setMaxUploadValidationMessage(msg);
          showMaxUploadToast(msg);
        } else if (overflowRejected > 0) {
          const msg = getOverflowCopy(overflowRejected);
          setMaxUploadValidationMessage(msg);
          showMaxUploadToast(msg);
        } else if (allowed.length > 0) {
          setMaxUploadValidationMessage(null);
        }

        uploadJobs.forEach(({ id, file }) => {
          if (onUpload) {
            onUpload(file, {
              onProgress: (progress) => {
                setItems((prev) =>
                  prev.map((item) =>
                    item.id === id
                      ? {
                          ...item,
                          progress: Math.min(progress, 100),
                          status:
                            progress >= 100
                              ? ("done" as UploadStatus)
                              : ("uploading" as UploadStatus),
                        }
                      : item
                  )
                );
              },
              onError: (message) => {
                setItems((prev) =>
                  prev.map((item) =>
                    item.id === id
                      ? { ...item, status: "error" as UploadStatus, errorMessage: message }
                      : item
                  )
                );
              },
            }).then(() => {
              setItems((prev) =>
                prev.map((item) =>
                  item.id === id && item.status === "uploading"
                    ? { ...item, progress: 100, status: "done" as UploadStatus }
                    : item
                )
              );
            }).catch((err) => {
              setItems((prev) =>
                prev.map((item) =>
                  item.id === id && item.status !== "error"
                    ? {
                        ...item,
                        status: "error" as UploadStatus,
                        errorMessage:
                          err instanceof Error
                            ? err.message
                            : "Upload failed",
                      }
                    : item
                )
              );
            });
          }
        });

        idsToStartFakeProgress.forEach((id) =>
          fakeProgress.start(id, setItems)
        );
      },
      [
        onUpload,
        maxFileSizeMB,
        fakeProgress,
        acceptedFormats,
        disallowedFileTypeToastTitle,
        disallowedFileTypeToastDescription,
        maxUpload,
        showMaxUploadToast,
        getAtCapacityCopy,
        getOverflowCopy,
      ]
    );

    const removeItem = (id: string) => {
      fakeProgress.cancel(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const handleClose = () => {
      dismissMaxUploadToast();
      setMaxUploadValidationMessage(null);
      fakeProgress.cancelAll();
      setItems([]);
      onCancel?.();
      onOpenChange(false);
    };

    const handleSave = () => {
      const completedFiles = items
        .filter((i) => i.status === "done")
        .map((i) => i.file);
      onSave?.(completedFiles);
      dismissMaxUploadToast();
      setMaxUploadValidationMessage(null);
      fakeProgress.cancelAll();
      setItems([]);
      onOpenChange(false);
    };

    const hasCompleted = items.some((i) => i.status === "done");
    const hasUploading = items.some((i) => i.status === "uploading");

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="default"
          hideCloseButton
          className={cn(
            "max-w-[min(660px,calc(100vw-2rem))] min-w-0 rounded-xl p-4 gap-0 sm:p-6 overflow-x-hidden",
            className
          )}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-6 min-w-0">
            <DialogTitle className="m-0 text-base font-semibold text-semantic-text-primary truncate min-w-0 pr-2">
              {title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Upload files by clicking the button or dragging and dropping.
            </DialogDescription>
            <button
              type="button"
              onClick={handleClose}
              className="shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-semantic-text-primary"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body — stretch so children respect modal width; long filenames need min-w-0 chain */}
          <div className="flex flex-col gap-4 items-stretch w-full min-w-0 max-w-full">
            {shouldShowSampleDownload && (
              <button
                type="button"
                onClick={onSampleDownload}
                className="self-end flex items-center gap-1.5 text-sm font-semibold text-semantic-text-link hover:opacity-80 transition-opacity"
              >
                <Download className="size-3.5" />
                {sampleDownloadLabel}
              </button>
            )}

            {/* Drop zone — validation reads like a form field: red border + message below the box */}
            <div className="flex flex-col gap-1.5 w-full min-w-0 max-w-full">
              <div
                className={cn(
                  "w-full min-w-0 max-w-full border bg-semantic-bg-ui rounded p-4",
                  maxUploadValidationMessage
                    ? "border-solid border-semantic-error-primary"
                    : "border-dashed border-semantic-border-layout"
                )}
                aria-invalid={maxUploadValidationMessage ? true : undefined}
                aria-describedby={
                  maxUploadValidationMessage ? maxUploadErrorId : undefined
                }
                onDrop={(e) => {
                  e.preventDefault();
                  addFiles(e.dataTransfer.files);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 min-w-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-[42px] px-4 rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary text-base font-semibold text-semantic-text-secondary shrink-0 hover:bg-semantic-bg-hover transition-colors w-full sm:w-auto"
                  >
                    {uploadButtonLabel}
                  </button>
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <p className="m-0 text-sm text-semantic-text-secondary tracking-[0.035px] break-words">
                      {dropDescription}
                    </p>
                    <p className="m-0 text-xs text-semantic-text-muted tracking-[0.048px] break-words">
                      {resolvedFormatDescription}
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={multiple}
                  accept={acceptedFormats}
                  className="hidden"
                  aria-describedby={
                    maxUploadValidationMessage ? maxUploadErrorId : undefined
                  }
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>
              {maxUploadValidationMessage ? (
                <p
                  id={maxUploadErrorId}
                  role="alert"
                  className="m-0 text-sm font-normal text-semantic-error-primary tracking-[0.035px] leading-5 break-words"
                >
                  {maxUploadValidationMessage}
                </p>
              ) : null}
            </div>

            {/* Upload item list */}
            {items.length > 0 && (
              <div className="flex flex-col gap-2.5 w-full min-w-0 max-w-full">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded px-4 py-3 flex flex-col gap-2 min-w-0 max-w-full overflow-hidden"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden">
                        <p
                          className="m-0 text-sm text-semantic-text-primary tracking-[0.035px] truncate max-w-full"
                          title={item.file.name}
                        >
                          {item.status === "uploading"
                            ? "Uploading..."
                            : item.file.name}
                        </p>
                        {item.status === "uploading" && (
                          <p className="m-0 text-xs text-semantic-text-muted tracking-[0.048px]">
                            {item.progress}%
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
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleClose}
            >
              {cancelLabel}
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleSave}
              disabled={!hasCompleted || hasUploading}
              loading={loading}
            >
              {saveLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

FileUploadModal.displayName = "FileUploadModal";

export { FileUploadModal };
