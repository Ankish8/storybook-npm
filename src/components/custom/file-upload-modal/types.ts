export type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  errorMessage?: string;
}

export interface UploadProgressHandlers {
  onProgress: (progress: number) => void;
  onError: (message: string) => void;
}

export interface FileUploadModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSave"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called for each file to handle the actual upload. If not provided, uses fake progress (demo mode). */
  onUpload?: (file: File, handlers: UploadProgressHandlers) => Promise<void>;
  onSave?: (files: File[]) => void;
  onCancel?: () => void;
  onSampleDownload?: () => void;
  sampleDownloadLabel?: string;
  showSampleDownload?: boolean;
  acceptedFormats?: string;
  /**
   * Full helper line under the drop zone (max size + copy). When omitted, the line is built from
   * {@link maxFileSizeMB} and {@link allowedFileTypesDescription}.
   */
  formatDescription?: string;
  /**
   * Shown inside the default format line as: `Max file size {n} MB ({allowedFileTypesDescription})`.
   * Ignored when {@link formatDescription} is set.
   */
  allowedFileTypesDescription?: string;
  /** Toast title when the user selects a file whose extension is not in {@link acceptedFormats}. */
  disallowedFileTypeToastTitle?: string;
  /**
   * Toast description when the user selects a disallowed file type.
   * If several files in one selection are invalid, a single toast is shown and this string is
   * appended after a count prefix (e.g. "3 files are not in a supported format. …").
   */
  disallowedFileTypeToastDescription?: string;
  maxFileSizeMB?: number;
  /** Maximum number of files allowed in the list at once. Defaults to 5. */
  maxUpload?: number;
  /**
   * Shown inline (and in the max-upload toast) when the list already has {@link maxUpload} files and the user tries to add more.
   * Defaults to copy derived from `maxUpload`.
   */
  maxUploadAtCapacityMessage?: string;
  /**
   * Shown inline (and in the toast) when a selection exceeds remaining slots.
   * `{count}` → rejected count; `{max}` → {@link maxUpload}. Omit placeholders to use the string as-is.
   */
  maxUploadOverflowMessage?: string;
  multiple?: boolean;
  title?: string;
  uploadButtonLabel?: string;
  dropDescription?: string;
  saveLabel?: string;
  cancelLabel?: string;
  /** Shows a loading spinner on the save button (e.g. while processing files server-side) */
  loading?: boolean;
}
