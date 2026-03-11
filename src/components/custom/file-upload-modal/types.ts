import * as React from "react";

export type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface UploadItem {
  /** Unique identifier */
  id: string;
  /** The file being uploaded */
  file: File;
  /** Upload progress 0-100 */
  progress: number;
  /** Current status */
  status: UploadStatus;
  /** Error message when status is "error" */
  errorMessage?: string;
}

export interface UploadProgressHandlers {
  /** Call to update progress (0-100) */
  onProgress: (progress: number) => void;
  /** Call to report an error */
  onError: (message: string) => void;
}

export interface FileUploadModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSave"> {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Called for each file to handle the actual upload. If not provided, uses fake progress (demo mode). */
  onUpload?: (file: File, handlers: UploadProgressHandlers) => Promise<void>;
  /** Called when Save is clicked with successfully uploaded files */
  onSave?: (files: File[]) => void;
  /** Called when Cancel is clicked or modal is closed */
  onCancel?: () => void;
  /** Called when "Download sample file" link is clicked */
  onSampleDownload?: () => void;
  /** Label for the sample download link */
  sampleDownloadLabel?: string;
  /** Whether to show the sample download link (default: true if onSampleDownload is provided) */
  showSampleDownload?: boolean;
  /** Accepted file formats (default: .doc,.docx,.pdf,.csv,.xls,.xlsx,.txt) */
  acceptedFormats?: string;
  /** Human-readable format description shown in the drop zone */
  formatDescription?: string;
  /** Max file size in MB (default: 100) */
  maxFileSizeMB?: number;
  /** Whether to allow multiple files (default: true) */
  multiple?: boolean;
  /** Modal title (default: "File Upload") */
  title?: string;
  /** Drop zone button label (default: "Upload from device") */
  uploadButtonLabel?: string;
  /** Drop zone description (default: "or drag and drop file here") */
  dropDescription?: string;
  /** Save button label (default: "Save") */
  saveLabel?: string;
  /** Cancel button label (default: "Cancel") */
  cancelLabel?: string;
  /** Whether the Save button shows loading state */
  saving?: boolean;
}
