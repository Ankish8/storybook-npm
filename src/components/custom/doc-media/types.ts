import * as React from "react";

export type DocMediaVariant = "preview" | "download" | "file";

export interface DocMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Display variant */
  variant?: DocMediaVariant;
  /** Thumbnail or preview image URL */
  thumbnailUrl?: string;
  /** Document filename */
  filename?: string;
  /** File type label (e.g., "PDF", "XLS", "XLSX", "DOC") */
  fileType?: string;
  /** Number of pages (for PDFs) */
  pageCount?: number;
  /** File size text (e.g., "2.4 MB") */
  fileSize?: string;
  /** Caption text */
  caption?: string;
  /** Handler for download button click (variant="file" only) */
  onDownload?: () => void;
}
