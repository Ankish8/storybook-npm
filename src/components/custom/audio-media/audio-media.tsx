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

const AudioMedia = React.forwardRef(
  (
    {
      className,
      duration,
      waveform = DEFAULT_WAVEFORM,
      playedBars = 0,
      barCount = 55,
      playedColor = "#27ABB8",
      unplayedColor = "#C0C3CA",
      speedOptions = DEFAULT_SPEED_OPTIONS,
      onPlayChange,
      onSpeedChange,
      ...props
    }: AudioMediaProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [playing, setPlaying] = React.useState(false);
    const [speed, setSpeed] = React.useState(1);

    const svgWidth = barCount * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

    const handlePlayPause = (e: React.MouseEvent) => {
      e.stopPropagation();
      const next = !playing;
      setPlaying(next);
      onPlayChange?.(next);
    };

    const handleSpeedChange = (value: string) => {
      const newSpeed = Number(value);
      setSpeed(newSpeed);
      onSpeedChange?.(newSpeed);
    };

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        style={{ padding: "10px 14px 0 14px" }}
        {...props}
      >
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

          {/* Waveform */}
          <div className="flex-1 min-w-0" style={{ height: SVG_HEIGHT }}>
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
                  fill={i < playedBars ? playedColor : unplayedColor}
                />
              ))}
            </svg>
            {duration && (
              <p className="m-0 text-[10px] text-semantic-text-muted leading-none mt-1">
                {duration}
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
