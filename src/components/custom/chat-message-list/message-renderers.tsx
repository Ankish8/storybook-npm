import * as React from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Reply,
  Bot,
  Megaphone,
  Code,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../ui/dropdown-menu"
import { Spinner } from "../../ui/spinner"
import type { MediaPayload, SentByType } from "../chat-types"

/* ── Constants ── */

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

/* ── Helper: getInitials ── */

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

/* ── SenderIndicatorBadge ── */

function SenderIndicatorBadge({ sentBy }: { sentBy: { type: SentByType; name?: string } }) {
  const iconClass = "size-3.5 text-semantic-text-muted"
  if (sentBy.type === "agent" && sentBy.name) {
    return <span className="text-[10px] font-medium text-semantic-text-secondary leading-none">{getInitials(sentBy.name)}</span>
  }
  if (sentBy.type === "bot") return <Bot className={iconClass} />
  if (sentBy.type === "campaign") return <Megaphone className={iconClass} />
  return <Code className={iconClass} />
}

/* ── ImageMedia ── */

function ImageMedia({ media }: { media: MediaPayload }) {
  return (
    <div className="relative">
      <img
        src={media.url}
        alt={media.caption || "Image"}
        className="w-full rounded-t object-cover max-h-[280px]"
      />
    </div>
  )
}

/* ── VideoMedia ── */

function VideoMedia({ media }: { media: MediaPayload }) {
  const [playing, setPlaying] = React.useState(false)
  const [muted, setMuted] = React.useState(false)
  const [fullscreen, setFullscreen] = React.useState(false)
  const [speed, setSpeed] = React.useState(1)
  const [volume, setVolume] = React.useState(75)
  return (
    <div className="relative rounded-t overflow-hidden cursor-pointer group" onClick={() => setPlaying(!playing)}>
      <img
        src={media.thumbnailUrl || media.url}
        alt="Video thumbnail"
        className="w-full object-cover"
        style={{ aspectRatio: "16/10" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {/* Center play/pause */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
        <button type="button" aria-label={playing ? "Pause video" : "Play video"} className="size-[56px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors border-none cursor-pointer">
          {playing ? (
            <Pause className="size-7 text-white fill-white" />
          ) : (
            <Play className="size-7 text-white fill-white ml-0.5" />
          )}
        </button>
      </div>
      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-8">
        {/* Seek bar */}
        <div className="flex items-center gap-2 mb-2">
          <div
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={15}
            tabIndex={0}
            className="relative flex-1 h-[3px] rounded-full bg-white/30"
          >
            <div className="absolute left-0 top-0 h-full w-[15%] rounded-full bg-white" />
            <div className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-white shadow-md" style={{ left: "15%" }} />
          </div>
        </div>
        {/* Controls row */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-white tabular-nums">{media.duration || "0:00"}</span>
          <div className="flex items-center gap-2.5">
            {/* Speed dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label={`Playback speed ${speed}x`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors px-2 py-0.5 rounded-full"
                >
                  {speed}x
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={String(speed)} onValueChange={(v) => setSpeed(Number(v))}>
                  {SPEED_OPTIONS.map((s) => (
                    <DropdownMenuRadioItem key={s} value={String(s)}>
                      {s === 1 ? "1x (Normal)" : `${s}x`}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Volume control */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button aria-label={muted || volume === 0 ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)} className="hover:opacity-70 transition-opacity">
                {muted || volume === 0 ? <VolumeX className="size-4 text-white/50" /> : <Volume2 className="size-4 text-white" />}
              </button>
              <div
                role="slider"
                aria-label="Volume"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={muted ? 0 : volume}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                    e.preventDefault(); e.stopPropagation(); setVolume(v => Math.min(100, v + 5)); setMuted(false)
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                    e.preventDefault(); e.stopPropagation(); setVolume(v => Math.max(0, v - 5)); setMuted(false)
                  }
                }}
                className="relative w-[60px] h-4 flex items-center cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100)
                  setVolume(Math.max(0, Math.min(100, pct)))
                  setMuted(false)
                }}
              >
                <div className="w-full h-[3px] rounded-full bg-white/30">
                  <div className="h-full rounded-full bg-white" style={{ width: `${muted ? 0 : volume}%` }} />
                </div>
                <div
                  className="absolute top-1/2 size-2.5 rounded-full bg-white"
                  style={{ left: `${muted ? 0 : volume}%`, transform: "translate(-50%, -50%)" }}
                />
              </div>
            </div>
            <button aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={(e) => { e.stopPropagation(); setFullscreen(!fullscreen) }} className="hover:opacity-70 transition-opacity">
              {fullscreen ? <Minimize className="size-4 text-white" /> : <Maximize className="size-4 text-white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── AudioMedia ── */

function AudioMedia({ media: _media }: { media: MediaPayload }) {
  const [playing, setPlaying] = React.useState(false)
  const [speed, setSpeed] = React.useState(1)

  // Waveform bar heights (deterministic pseudo-random pattern)
  const waveform = [
    4, 8, 14, 6, 20, 10, 4, 16, 7, 24, 5, 12, 18, 6, 10, 4,
    14, 22, 7, 5, 16, 10, 6, 19, 8, 4, 14, 7, 12, 5, 18, 9,
    4, 14, 6, 10, 22, 5, 13, 7, 4, 16, 9, 6, 19, 5, 12, 7,
    6, 14, 10, 4, 17, 7, 12,
  ]
  const barCount = 55
  const playedBars = 11
  const barW = 2
  const gap = 1.5
  const svgW = barCount * (barW + gap) - gap
  const svgH = 32

  return (
    <div className="w-full" style={{ padding: "10px 14px 0 14px" }}>
      <div className="flex items-center gap-3">
        {/* Play / Pause */}
        <button
          aria-label={playing ? "Pause audio" : "Play audio"}
          onClick={(e) => { e.stopPropagation(); setPlaying(!playing) }}
          className="shrink-0 size-10 rounded-full bg-semantic-primary flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          {playing ? (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <rect x="0" y="0" width="4" height="14" rx="1.2" fill="white" />
              <rect x="8" y="0" width="4" height="14" rx="1.2" fill="white" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" style={{ marginLeft: 2 }}>
              <path d="M1 1.87v12.26a1 1 0 001.5.86l10.5-6.13a1 1 0 000-1.72L2.5 1.01A1 1 0 001 1.87z" fill="white" />
            </svg>
          )}
        </button>

        {/* Waveform */}
        <div className="flex-1 min-w-0" style={{ height: svgH }}>
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${svgW} ${svgH}`}
            preserveAspectRatio="none"
            width="100%"
            height="100%"
            style={{ overflow: "visible" }}
          >
            {waveform.slice(0, barCount).map((h, i) => (
              <rect
                key={i}
                x={i * (barW + gap)}
                y={(svgH - h) / 2}
                width={barW}
                height={h}
                rx={1.5}
                fill={i < playedBars ? "var(--semantic-brand-hover, #1F858F)" : "var(--semantic-text-muted, #C0C3CA)"}
              />
            ))}
          </svg>
        </div>

        {/* Speed dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label={`Playback speed ${speed}x`}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 min-w-[34px] h-[22px] px-2 flex items-center justify-center rounded-full bg-black/40 hover:opacity-80 transition-opacity"
            >
              <span className="text-[11px] font-semibold text-white leading-none">{speed}x</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={String(speed)} onValueChange={(v) => setSpeed(Number(v))}>
              {SPEED_OPTIONS.map((s) => (
                <DropdownMenuRadioItem key={s} value={String(s)}>
                  {s === 1 ? "1x (Normal)" : `${s}x`}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

/* ── CarouselMedia ── */

function CarouselMedia({ media }: { media: MediaPayload }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState((media.images?.length || 0) > 1)
  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }
  const scroll = (dir: "left" | "right") => (e: React.MouseEvent) => {
    e.stopPropagation()
    scrollRef.current?.scrollBy({ left: dir === "right" ? 272 : -272, behavior: "smooth" })
    setTimeout(updateScrollState, 350)
  }
  return (
    <div className="relative">
      {/* Scrollable card row */}
      <div ref={scrollRef} onScroll={updateScrollState} tabIndex={0} role="region" aria-label="Carousel" aria-roledescription="carousel" className="flex gap-3 overflow-x-auto px-3 pt-2 pb-3" style={{ scrollbarWidth: "none" }}>
        {media.images?.map((img, i) => (
          <div key={i} className="shrink-0 bg-white rounded border border-solid border-semantic-border-layout overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]" style={{ width: 260 }}>
            {/* Card image */}
            <img
              src={img.url}
              alt={img.title}
              className="w-full object-cover"
              style={{ height: 200 }}
            />
            {/* Card title */}
            <div className="px-3 pt-2.5 pb-2">
              <p className="m-0 text-[14px] font-medium text-semantic-text-primary line-clamp-2">{img.title}</p>
            </div>
            {/* Card buttons */}
            {img.buttons?.map((btn, j) => (
              <button
                key={j}
                className="flex items-center justify-center gap-2 w-full border-t border-solid border-semantic-border-layout text-[13px] font-normal text-semantic-text-muted hover:bg-semantic-bg-hover transition-colors"
                style={{ height: 40 }}
              >
                {btn.icon === "reply" && <Reply className="size-3.5" />}
                {btn.icon === "link" && <ExternalLink className="size-3.5" />}
                {btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      {/* Navigation arrows */}
      {canScrollLeft && (
        <button aria-label="Scroll carousel left" onClick={scroll("left")} className="absolute left-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors">
          <ChevronLeft className="size-4 text-semantic-text-primary" />
        </button>
      )}
      {canScrollRight && (
        <button aria-label="Scroll carousel right" onClick={scroll("right")} className="absolute right-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors">
          <ChevronRight className="size-4 text-semantic-text-primary" />
        </button>
      )}
    </div>
  )
}

/* ── LoadingMedia ── */

function LoadingMedia({ error }: { error?: string }) {
  return (
    <div className="overflow-hidden">
      {/* White preview area */}
      <div className="bg-white flex items-center justify-center" style={{ aspectRatio: "442 / 308" }}>
        <Spinner size="xl" variant="muted" />
      </div>
      {/* Error banner */}
      {error && (
        <div className="border-t border-solid border-semantic-error-primary bg-semantic-error-surface px-4 py-3">
          <p className="m-0 text-[14px] leading-5 text-semantic-error-primary">
            {error}
          </p>
        </div>
      )}
    </div>
  )
}

export {
  SPEED_OPTIONS,
  getInitials,
  SenderIndicatorBadge,
  ImageMedia,
  VideoMedia,
  AudioMedia,
  CarouselMedia,
  LoadingMedia,
}
