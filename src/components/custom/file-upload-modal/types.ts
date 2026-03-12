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
  formatDescription?: string;
  maxFileSizeMB?: number;
  multiple?: boolean;
  title?: string;
  uploadButtonLabel?: string;
  dropDescription?: string;
  saveLabel?: string;
  cancelLabel?: string;
  saving?: boolean;
}
