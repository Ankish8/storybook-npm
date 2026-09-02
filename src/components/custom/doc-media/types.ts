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
  /**
   * URL of the actual document (as opposed to `thumbnailUrl`, which is just
   * a static cover image). For `fileType === "PDF"`, this replaces the
   * static thumbnail with the real document embedded inline (the browser's
   * native PDF viewer in an `<iframe>`, sized the same as the thumbnail) —
   * hovering it and scrolling moves through the PDF's pages right there in
   * the card, no click or separate view needed. Ignored for every other
   * file type and for `variant="file"`, which keeps its plain icon card.
   */
  documentUrl?: string;
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
