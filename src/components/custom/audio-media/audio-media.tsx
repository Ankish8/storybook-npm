import * as React from "react";
import { cn } from "../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import type { AudioMediaProps } from "./types";

const DEFAULT_WAVEFORM = [
  4, 8, 14, 6, 20, 10, 4, 16, 7, 24, 5, 12, 18, 6, 10, 4, 14, 22, 7, 5, 16,
  10, 6, 19, 8, 4, 14, 7, 12, 5, 18, 9, 4, 14, 6, 10, 22, 5, 13, 7, 4, 16, 9,
  6, 19, 5, 12, 7, 6, 14, 10, 4, 17, 7, 12,
];

const DEFAULT_SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const BAR_WIDTH = 2;
const BAR_GAP = 1.5;
const SVG_HEIGHT = 32;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Format a number of seconds as "m:ss" (e.g. 75 → "1:15"). */
const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/** Parse a "m:ss" / "h:mm:ss" duration string into seconds. Returns 0 if invalid. */
const parseTime = (value?: string) => {
  if (!value) return 0;
  const parts = value.split(":").map(Number);
  if (parts.some((n) => !Number.isFinite(n))) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
};

const AudioMedia = React.forwardRef(
  (
    {
      className,
      src,
      duration,
      waveform = DEFAULT_WAVEFORM,
      playedBars = 0,
      barCount = 55,
      playedColor = "#27ABB8",
      unplayedColor = "#C0C3CA",
      speedOptions = DEFAULT_SPEED_OPTIONS,
      onPlayChange,
      onSpeedChange,
      onSeek,
      ...props
    }: AudioMediaProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [playing, setPlaying] = React.useState(false);
    const [speed, setSpeed] = React.useState(1);
    // Playback position (0..1). Seeded from `playedBars`, then advanced by real
    // playback (timeupdate) or user seeks (click / drag / keyboard).
    const [progress, setProgress] = React.useState(playedBars / barCount);
    // Live fraction while the user is dragging the waveform; null when idle.
    const [scrubFraction, setScrubFraction] = React.useState<number | null>(
      null
    );
    // Total audio length in seconds, learned from the <audio> metadata.
    const [audioDuration, setAudioDuration] = React.useState(0);

    const audioRef = React.useRef<HTMLAudioElement>(null);
    const waveformRef = React.useRef<HTMLDivElement>(null);

    const svgWidth = barCount * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

    // Keep position in sync when the controlled `playedBars` prop changes.
    React.useEffect(() => {
      setProgress(clamp01(playedBars / barCount));
    }, [playedBars, barCount]);

    // A live drag wins; otherwise the bar reflects the current position.
    const filledFraction = clamp01(scrubFraction ?? progress);
    const filledBars = Math.round(filledFraction * barCount);

    // Total length in seconds: prefer the real audio metadata, otherwise parse
    // the `duration` prop (e.g. "0:30") so the timer still works without a
    // loaded audio file.
    const totalSeconds = audioDuration > 0 ? audioDuration : parseTime(duration);

    // Time label under the waveform. When a total length is known, show the
    // live current time that moves as it plays or seeks; otherwise fall back to
    // the static `duration` text.
    const timeLabel =
      totalSeconds > 0 ? formatTime(filledFraction * totalSeconds) : duration;

    // Keep the <audio> element's playback rate in sync with the speed control.
    React.useEffect(() => {
      if (audioRef.current) audioRef.current.playbackRate = speed;
    }, [speed]);

    const handlePlayPause = (e: React.MouseEvent) => {
      e.stopPropagation();
      const next = !playing;
      const audio = audioRef.current;
      if (audio) {
        if (next) {
          audio.playbackRate = speed;
          void audio.play().catch(() => setPlaying(false));
        } else {
          audio.pause();
        }
      }
      setPlaying(next);
      onPlayChange?.(next);
    };

    const handleSpeedChange = (value: string) => {
      const newSpeed = Number(value);
      setSpeed(newSpeed);
      onSpeedChange?.(newSpeed);
    };

    // Translate a pointer/keyboard position into a 0..1 fraction of the bar.
    const fractionFromClientX = (clientX: number) => {
      const el = waveformRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return 0;
      return clamp01((clientX - rect.left) / rect.width);
    };

    // Apply a seek: move the real audio if present, update visuals, notify.
    const commitSeek = (fraction: number) => {
      const f = clamp01(fraction);
      const audio = audioRef.current;
      if (audio && Number.isFinite(audio.duration)) {
        audio.currentTime = f * audio.duration;
      }
      setProgress(f);
      onSeek?.(f);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const f = fractionFromClientX(e.clientX);
      setScrubFraction(f);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (scrubFraction === null) return;
      setScrubFraction(fractionFromClientX(e.clientX));
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (scrubFraction === null) return;
      const f = fractionFromClientX(e.clientX);
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      setScrubFraction(null);
      commitSeek(f);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const step = 1 / barCount;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        commitSeek(filledFraction + step);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        commitSeek(filledFraction - step);
      } else if (e.key === "Home") {
        e.preventDefault();
        commitSeek(0);
      } else if (e.key === "End") {
        e.preventDefault();
        commitSeek(1);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        style={{ padding: "10px 14px 0 14px" }}
        {...props}
      >
        {src && (
          <audio
            ref={audioRef}
            src={src}
            preload="metadata"
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              if (Number.isFinite(d)) setAudioDuration(d);
            }}
            onTimeUpdate={(e) => {
              const a = e.currentTarget;
              if (scrubFraction === null && a.duration > 0) {
                setProgress(clamp01(a.currentTime / a.duration));
              }
            }}
            onEnded={() => {
              setPlaying(false);
              onPlayChange?.(false);
            }}
            data-testid="audio-element"
          />
        )}

        <div className="flex items-center gap-3">
          {/* Play / Pause button */}
          <button
            type="button"
            onClick={handlePlayPause}
            aria-label={playing ? "Pause" : "Play"}
            className="shrink-0 size-10 rounded-full bg-semantic-primary flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {playing ? (
              <svg
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height="14"
                  rx="1.2"
                  fill="white"
                />
                <rect
                  x="8"
                  y="0"
                  width="4"
                  height="14"
                  rx="1.2"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                style={{ marginLeft: 2 }}
                aria-hidden="true"
              >
                <path
                  d="M1 1.87v12.26a1 1 0 001.5.86l10.5-6.13a1 1 0 000-1.72L2.5 1.01A1 1 0 001 1.87z"
                  fill="white"
                />
              </svg>
            )}
          </button>

          {/* Waveform — click or drag to seek */}
          <div className="flex-1 min-w-0" style={{ height: SVG_HEIGHT }}>
            <div
              ref={waveformRef}
              role="slider"
              tabIndex={0}
              aria-label="Seek audio position"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(clamp01(filledFraction) * 100)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onKeyDown={handleKeyDown}
              className="cursor-pointer touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus rounded-sm"
              style={{ height: SVG_HEIGHT }}
              data-testid="waveform-track"
            >
              <svg
                viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT}`}
                preserveAspectRatio="none"
                width="100%"
                height="100%"
                style={{ overflow: "visible" }}
                aria-hidden="true"
                data-testid="waveform-svg"
              >
                {waveform.slice(0, barCount).map((h, i) => (
                  <rect
                    key={i}
                    x={i * (BAR_WIDTH + BAR_GAP)}
                    y={(SVG_HEIGHT - h) / 2}
                    width={BAR_WIDTH}
                    height={h}
                    rx={1.5}
                    fill={i < filledBars ? playedColor : unplayedColor}
                  />
                ))}
              </svg>
            </div>
            {timeLabel && (
              <p className="m-0 text-[10px] text-semantic-text-muted leading-none mt-1">
                {timeLabel}
              </p>
            )}
          </div>

          {/* Speed dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 min-w-[34px] h-[22px] px-2 flex items-center justify-center rounded-full bg-black/40 hover:opacity-80 transition-opacity"
              >
                <span className="text-[11px] font-semibold text-white leading-none">
                  {speed}x
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={String(speed)}
                onValueChange={handleSpeedChange}
              >
                {speedOptions.map((s) => (
                  <DropdownMenuRadioItem key={s} value={String(s)}>
                    {s === 1 ? "1x (Normal)" : `${s}x`}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
);
AudioMedia.displayName = "AudioMedia";

export { AudioMedia };
