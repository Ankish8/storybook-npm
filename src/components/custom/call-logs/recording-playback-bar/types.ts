import type * as React from "react";

export interface RecordingPlaybackBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Phone number of the call whose recording is playing */
  phoneNumber: string;
  /** Caller's display name, shown in parentheses next to the phone number */
  callerName?: string;
  /** When the call happened, e.g. "05:00 PM, 04 Aug" — shown after the phone number */
  timestamp?: string;
  /** Call duration, e.g. "6m 48s" — shown after the timestamp */
  duration?: string;
  /** Whether playback is currently active */
  isPlaying?: boolean;
  /** Called when the play/pause button is clicked */
  onTogglePlay?: () => void;
  /** Called when the close button is clicked */
  onClose?: () => void;
}
