import * as React from "react";

export interface AudioMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Audio duration text (e.g., "0:30", "2:15") */
  duration?: string;
  /** Array of bar heights for the waveform visualization. Defaults to a built-in pattern */
  waveform?: number[];
  /** Number of bars that are "played" (colored). Defaults to 0 */
  playedBars?: number;
  /** Total number of bars to render. Defaults to 55 */
  barCount?: number;
  /** Color for played bars. Defaults to "#27ABB8" (teal) */
  playedColor?: string;
  /** Color for unplayed bars. Defaults to "#C0C3CA" (gray) */
  unplayedColor?: string;
  /** Available speed options. Defaults to [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] */
  speedOptions?: number[];
  /** Callback when play state changes */
  onPlayChange?: (playing: boolean) => void;
  /** Callback when speed changes */
  onSpeedChange?: (speed: number) => void;
}
