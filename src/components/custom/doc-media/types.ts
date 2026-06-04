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
  /** Remote or blob URL to download (variant="file" only). Shows a loader while fetching. */
  downloadUrl?: string;
  /** Suggested filename when using `downloadUrl` */
  downloadFilename?: string;
  /**
   * Custom download handler (variant="file" only). May return a Promise; a loader is
   * shown until it settles. Prefer `downloadUrl` for the default `downloadMediaFile` flow.
   */
  onDownload?: () => void | Promise<void>;
}
