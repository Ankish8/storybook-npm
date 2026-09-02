import type * as React from "react";

export interface BulkSelectionAction {
  /** Action label, e.g. "Download Recordings" */
  label: string;
  /** Called when this action is clicked */
  onClick: () => void;
}

export interface BulkSelectionToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of currently selected rows */
  selectedCount: number;
  /** Trailing text-link actions available for the current selection */
  actions?: BulkSelectionAction[];
  /** Called when the close (clear selection) button is clicked */
  onClose?: () => void;
}
