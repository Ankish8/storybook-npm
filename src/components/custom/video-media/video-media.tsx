import * as React from "react";
import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../ui/dropdown-menu";
import type { VideoMediaProps } from "./types";

const DEFAULT_SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const VideoMedia = React.forwardRef<HTMLDivElement, VideoMediaProps>(
  (
    {
      className,
      thumbnailUrl,
      duration,
      speedOptions = DEFAULT_SPEED_OPTIONS,
      progress = 0,
      onPlayChange,
      onSpeedChange,
      onClick,
      ...props
    },
    ref
  ) => {
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [volume, setVolume] = useState(75);

    const handleRootClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const nextPlaying = !playing;
      setPlaying(nextPlaying);
      onPlayChange?.(nextPlaying);
      onClick?.(e);
    };

    const handleSpeedChange = (value: string) => {
      const newSpeed = Number(value);
      setSpeed(newSpeed);
      onSpeedChange?.(newSpeed);
    };

    const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.round(Math.min(100, Math.max(0, (x / rect.width) * 100)));
      setVolume(pct);
      if (muted && pct > 0) setMuted(false);
    };

    const effectiveVolume = muted ? 0 : volume;

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-t overflow-hidden cursor-pointer group",
          className
        )}
        onClick={handleRootClick}
        {...props}
      >
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="w-full object-cover"
          style={{ aspectRatio: "16/10" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d12]/70 via-[#0a0d12]/10 to-transparent" />

        {/* Center play/pause */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            playing
              ? "opacity-0 group-hover:opacity-100"
              : "opacity-100"
          )}
        >
          <div className="size-[56px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
            {playing ? (
              <Pause className="size-7 text-white fill-white" />
            ) : (
              <Play className="size-7 text-white fill-white ml-0.5" />
            )}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-8">
          {/* Seek bar */}
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1 h-[3px] rounded-full bg-white/30">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-white shadow-md"
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-white tabular-nums">
              {duration || "0:00"}
            </span>

            <div className="flex items-center gap-2.5">
              {/* Speed dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors px-2 py-0.5 rounded-full"
                  >
                    {speed}x
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[160px]"
                  onClick={(e) => e.stopPropagation()}
                >
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

              {/* Volume */}
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setMuted(!muted)}
                  className="hover:opacity-70 transition-opacity"
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="size-4 text-white/50" />
                  ) : (
                    <Volume2 className="size-4 text-white" />
                  )}
                </button>
                <div
                  className="relative w-[60px] h-4 flex items-center cursor-pointer"
                  onClick={handleVolumeClick}
                >
                  <div className="w-full h-[3px] rounded-full bg-white/30">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${effectiveVolume}%` }}
                    />
                  </div>
                  <div
                    className="absolute top-1/2 size-2.5 rounded-full bg-white"
                    style={{
                      left: `${effectiveVolume}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreen(!fullscreen);
                }}
                className="hover:opacity-70 transition-opacity"
              >
                {fullscreen ? (
                  <Minimize className="size-4 text-white" />
                ) : (
                  <Maximize className="size-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VideoMedia.displayName = "VideoMedia";

export { VideoMedia };
