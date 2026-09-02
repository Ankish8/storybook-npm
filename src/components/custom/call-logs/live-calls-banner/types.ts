import type * as React from "react";

export interface LiveCallsBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of calls currently live */
  count: number;
  /** Whether the live calls section below the banner is currently expanded */
  expanded?: boolean;
  /** Called when the Hide/Show toggle is clicked. Omit to render the banner without a toggle. */
  onToggle?: () => void;
}
