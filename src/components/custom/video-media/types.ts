import * as React from "react";

export interface VideoMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL for the video thumbnail image */
  thumbnailUrl: string;
  /** Video duration text (e.g., "2:30", "1:05:30") */
  duration?: string;
  /** Available speed options. Defaults to [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] */
  speedOptions?: number[];
  /** Initial progress percentage (0-100). Defaults to 0 */
  progress?: number;
  /** Callback when play state changes */
  onPlayChange?: (playing: boolean) => void;
  /** Callback when speed changes */
  onSpeedChange?: (speed: number) => void;
}
