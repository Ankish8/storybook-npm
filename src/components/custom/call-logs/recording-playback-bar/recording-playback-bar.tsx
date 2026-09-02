import * as React from "react";
import { Pause, Play, X } from "lucide-react";

import { cn } from "../../../../lib/utils";
import type { RecordingPlaybackBarProps } from "./types";

/**
 * RecordingPlaybackBar shows above a call logs table while a call recording
 * is playing, with a play/pause control and a way to dismiss it. Typically
 * shown in place of the call detail sidebar once it's closed, so the
 * timestamp and duration stay visible even with the sidebar hidden.
 *
 * @example
 * ```tsx
 * <RecordingPlaybackBar
 *   phoneNumber="+91 98201 45632"
 *   callerName="Priya Sharma"
 *   timestamp="05:00 PM, 04 Aug"
 *   duration="6m 48s"
 *   isPlaying
 *   onTogglePlay={() => setPlaying((v) => !v)}
 *   onClose={() => stopPlayback()}
 * />
 * ```
 */
const RecordingPlaybackBar = React.forwardRef(
  (
    {
      phoneNumber,
      callerName,
      timestamp,
      duration,
      isPlaying = false,
      onTogglePlay,
      onClose,
      className,
      ...props
    }: RecordingPlaybackBarProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-center gap-5 rounded-md bg-semantic-info-surface px-4 py-2.5",
          className
        )}
        {...props}
      >
        <button
          type="button"
          aria-label={isPlaying ? "Pause recording" : "Play recording"}
          onClick={onTogglePlay}
          className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-semantic-primary hover:bg-semantic-primary-hover"
        >
          {isPlaying ? (
            <Pause
              className="size-3 fill-semantic-text-inverted text-semantic-text-inverted"
              aria-hidden="true"
            />
          ) : (
            <Play
              className="size-3 fill-semantic-text-inverted text-semantic-text-inverted"
              aria-hidden="true"
            />
          )}
        </button>
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-sm">
          <span className="truncate">
            <span className="font-semibold text-semantic-text-primary">{phoneNumber}</span>
            {callerName && <span className="text-semantic-text-muted"> ({callerName})</span>}
          </span>
          {timestamp && (
            <span className="shrink-0 text-semantic-text-muted">
              <span className="text-semantic-text-placeholder">|</span> {timestamp}
            </span>
          )}
          {duration && (
            <span className="shrink-0 text-semantic-text-muted">
              <span className="text-semantic-text-placeholder">|</span> {duration}
            </span>
          )}
        </span>
        {onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-6 shrink-0 items-center justify-center rounded-full hover:bg-semantic-bg-hover"
          >
            <X className="size-4 text-semantic-text-muted" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);
RecordingPlaybackBar.displayName = "RecordingPlaybackBar";

export { RecordingPlaybackBar };
