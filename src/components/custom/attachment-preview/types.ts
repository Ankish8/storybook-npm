import * as React from "react";

export interface AttachmentPreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The file to preview */
  file: File;
  /** Called when the remove/close button is clicked */
  onRemove: () => void;
}
