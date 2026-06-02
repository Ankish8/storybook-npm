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
  ListOrdered,
  Megaphone as MegaphoneIcon,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Spinner } from "../../ui/spinner"
import { cn } from "../../../lib/utils"
import type {
  MediaPayload,
  LocationPayload,
  ContactCardItem,
  ContactListModalConfig,
  ContactPayload,
  ReferralPayload,
  ListReplyModalConfig,
  ListReplyPayload,
} from "./types"
import {
  SenderIndicator,
  SenderBadgeIcon,
  getInitials,
} from "../sender-indicator"

/* Re-export SenderIndicator so existing imports from this file keep working */
const SenderIndicatorBadge = SenderBadgeIcon

/* ── Constants ── */

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

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
      <div className="absolute inset-0 bg-gradient-to-t from-semantic-bg-inverted/70 via-semantic-bg-inverted/10 to-transparent" />
      {/* Center play/pause */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-opacity",
        playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
      )}>
        <button type="button" aria-label={playing ? "Pause video" : "Play video"} className="size-[56px] rounded-full bg-semantic-bg-inverted/40 backdrop-blur-sm flex items-center justify-center hover:bg-semantic-bg-inverted/50 transition-colors border-none cursor-pointer">
          {playing ? (
            <Pause className="size-7 text-semantic-text-inverted fill-semantic-text-inverted" />
          ) : (
            <Play className="size-7 text-semantic-text-inverted fill-semantic-text-inverted ml-0.5" />
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
            className="relative flex-1 h-[3px] rounded-full bg-semantic-text-inverted/30"
          >
            <div className="absolute left-0 top-0 h-full w-[15%] rounded-full bg-semantic-text-inverted" />
            <div className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-semantic-text-inverted shadow-md" style={{ left: "15%" }} />
          </div>
        </div>
        {/* Controls row */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-semantic-text-inverted tabular-nums">{media.duration || "0:00"}</span>
          <div className="flex items-center gap-2.5">
            {/* Speed dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label={`Playback speed ${speed}x`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] font-semibold text-semantic-text-inverted bg-semantic-text-inverted/20 hover:bg-semantic-text-inverted/30 transition-colors px-2 py-0.5 rounded-full"
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
                {muted || volume === 0 ? <VolumeX className="size-4 text-semantic-text-inverted/50" /> : <Volume2 className="size-4 text-semantic-text-inverted" />}
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
                <div className="w-full h-[3px] rounded-full bg-semantic-text-inverted/30">
                  <div className="h-full rounded-full bg-semantic-text-inverted" style={{ width: `${muted ? 0 : volume}%` }} />
                </div>
                <div
                  className="absolute top-1/2 size-2.5 rounded-full bg-semantic-text-inverted"
                  style={{ left: `${muted ? 0 : volume}%`, transform: "translate(-50%, -50%)" }}
                />
              </div>
            </div>
            <button aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={(e) => { e.stopPropagation(); setFullscreen(!fullscreen) }} className="hover:opacity-70 transition-opacity">
              {fullscreen ? <Minimize className="size-4 text-semantic-text-inverted" /> : <Maximize className="size-4 text-semantic-text-inverted" />}
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
              <rect x="0" y="0" width="4" height="14" rx="1.2" fill="var(--semantic-text-inverted)" />
              <rect x="8" y="0" width="4" height="14" rx="1.2" fill="var(--semantic-text-inverted)" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" style={{ marginLeft: 2 }}>
              <path d="M1 1.87v12.26a1 1 0 001.5.86l10.5-6.13a1 1 0 000-1.72L2.5 1.01A1 1 0 001 1.87z" fill="var(--semantic-text-inverted)" />
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
                fill={i < playedBars ? "var(--semantic-brand-hover)" : "var(--semantic-text-muted)"}
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
              className="shrink-0 min-w-[34px] h-[22px] px-2 flex items-center justify-center rounded-full bg-semantic-bg-inverted/40 hover:opacity-80 transition-opacity"
            >
              <span className="text-[11px] font-semibold text-semantic-text-inverted leading-none">{speed}x</span>
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

type CarouselCardItem = NonNullable<MediaPayload["images"]>[number]

function CarouselCardMedia({ item }: { item: CarouselCardItem }) {
  const isVideo = item.mediaType === "video"
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = React.useState(false)

  if (!isVideo) {
    return (
      <img
        src={item.url}
        alt={item.title}
        className="w-full object-cover"
        style={{ height: 200 }}
      />
    )
  }

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
      <video
        ref={videoRef}
        src={item.url}
        poster={item.thumbnailUrl}
        playsInline
        muted
        onEnded={() => setPlaying(false)}
        aria-label={item.title}
        className="w-full h-full object-cover pointer-events-none"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className={cn(
          "absolute inset-0 flex items-center justify-center cursor-pointer border-none bg-transparent p-0 transition-opacity",
          playing ? "opacity-0 hover:opacity-100" : "opacity-100"
        )}
      >
        <span className="size-11 rounded-full bg-semantic-bg-inverted/40 backdrop-blur-sm flex items-center justify-center">
          {playing ? (
            <Pause className="size-5 text-semantic-text-inverted fill-semantic-text-inverted" />
          ) : (
            <Play className="size-5 text-semantic-text-inverted fill-semantic-text-inverted ml-0.5" />
          )}
        </span>
      </button>
    </div>
  )
}

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
        {media.images?.map((item, i) => (
          <div key={i} className="shrink-0 bg-semantic-bg-primary rounded border border-solid border-semantic-border-layout overflow-hidden shadow-xs" style={{ width: 260 }}>
            {/* Card media — image or video */}
            <CarouselCardMedia item={item} />
            {/* Card title */}
            <div className="px-3 pt-2.5 pb-2">
              <p className="m-0 text-[14px] font-medium text-semantic-text-primary line-clamp-2">{item.title}</p>
            </div>
            {/* Card buttons */}
            {item.buttons?.map((btn, j) => (
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
        <button aria-label="Scroll carousel left" onClick={scroll("left")} className="absolute left-2 top-[calc(50%-12px)] size-7 rounded-full bg-semantic-bg-primary shadow-md flex items-center justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors">
          <ChevronLeft className="size-4 text-semantic-text-primary" />
        </button>
      )}
      {canScrollRight && (
        <button aria-label="Scroll carousel right" onClick={scroll("right")} className="absolute right-2 top-[calc(50%-12px)] size-7 rounded-full bg-semantic-bg-primary shadow-md flex items-center justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors">
          <ChevronRight className="size-4 text-semantic-text-primary" />
        </button>
      )}
    </div>
  )
}

/* ── ReferralMedia ── */

function ReferralMedia({ referral }: { referral: ReferralPayload }) {
  return (
    <div className="border-l-[3px] border-solid border-semantic-border-accent bg-semantic-bg-hover rounded-sm mx-3 mt-3 mb-1 overflow-hidden">
      <div className="flex gap-3 p-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <MegaphoneIcon className="size-3 text-semantic-text-muted shrink-0" />
            <span className="text-[11px] text-semantic-text-muted uppercase font-semibold tracking-wider">
              {referral.sourceType === "post"
                ? "Post"
                : referral.sourceType === "ad"
                  ? "Ad"
                  : "Referral"}
            </span>
          </div>
          <p className="m-0 text-[14px] font-semibold text-semantic-text-primary leading-5 line-clamp-2">
            {referral.headline}
          </p>
          {referral.body && (
            <p className="m-0 mt-0.5 text-[13px] text-semantic-text-muted leading-[1.4] line-clamp-2">
              {referral.body}
            </p>
          )}
          {referral.sourceUrl && (
            <p className="m-0 mt-1 text-[12px] text-semantic-text-link truncate">
              {referral.sourceUrl}
            </p>
          )}
        </div>
        {referral.thumbnailUrl && (
          <img
            src={referral.thumbnailUrl}
            alt=""
            className="size-[60px] rounded object-cover shrink-0"
          />
        )}
      </div>
    </div>
  )
}

/* ── LocationMedia ── */

function StaticMapPreview() {
  const filterId = React.useId().replace(/:/g, "")

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 388 303"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="388" height="303" fill="var(--semantic-bg-ui)" />
      <path d="M-22 168h58v36l85 52 58-70-49-64-99 48H-22z" fill="#D9E9B3" />
      <path d="M243 109h101v51l-84-2-17-49z" fill="#F6E4CB" />
      <path d="M176 67h54l17-41-54 13-17 28z" fill="#D7D6D6" />
      <path d="M126 255 36 204v-34l99-48 49 64-58 69z" fill="#D7D6D6" />
      <path
        d="M-30 62h88l53 2h117l35-86 39-6v-40l35-25M-20 170h55l101-49 50 64 132 28 110 61M31 110l97-66v-92L66-134M36 204l89 51 116-16 65 77h102M118 357l107-12 12-106"
        fill="none"
        stroke="var(--semantic-bg-primary)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M-30 62h88l53 2h117l35-86 39-6v-40l35-25M-20 170h55l101-49 50 64 132 28 110 61M31 110l97-66v-92L66-134M36 204l89 51 116-16 65 77h102M118 357l107-12 12-106"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g filter={`url(#${filterId})`}>
        <path
          d="M194 84c-22 0-40 18-40 40 0 30 40 78 40 78s40-48 40-78c0-22-18-40-40-40z"
          fill="#F04438"
        />
        <circle cx="194" cy="124" r="14" fill="var(--semantic-bg-primary)" />
      </g>
      <defs>
        <filter
          id={filterId}
          x="138"
          y="76"
          width="112"
          height="142"
          filterUnits="userSpaceOnUse"
        >
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.22" />
        </filter>
      </defs>
    </svg>
  )
}

function LocationMedia({ location }: { location: LocationPayload }) {
  const openGoogleMaps = React.useCallback(() => {
    const query = encodeURIComponent(`${location.latitude},${location.longitude}`)
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(url, "_blank", "noopener,noreferrer")
  }, [location.latitude, location.longitude])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        openGoogleMaps()
      }
    },
    [openGoogleMaps]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open location in Google Maps"
      onClick={openGoogleMaps}
      onKeyDown={handleKeyDown}
      className="cursor-pointer"
    >
      <div
        className="w-full bg-semantic-bg-ui flex items-center justify-center relative overflow-hidden"
        style={{ height: 180 }}
      >
        <StaticMapPreview />
      </div>
      <div className="px-3 pt-2.5 pb-1">
        {location.name && (
          <p className="m-0 text-[14px] font-semibold text-semantic-text-primary leading-5">
            {location.name}
          </p>
        )}
        {location.address && (
          <p className="m-0 mt-0.5 text-[13px] text-semantic-text-muted leading-[1.4]">
            {location.address}
          </p>
        )}
        {!location.name && !location.address && (
          <p className="m-0 text-[13px] text-semantic-text-muted">
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </p>
        )}
      </div>
    </div>
  )
}

/* ── ContactMedia ── */

function resolveContactList(contact: ContactPayload): ContactCardItem[] {
  return contact.contacts?.length ? contact.contacts : [contact]
}

function getContactModalConfig(
  modal: ContactPayload["modal"]
): ContactListModalConfig {
  if (modal === false) {
    return { enabled: false }
  }

  if (modal && typeof modal === "object") {
    return modal
  }

  return { enabled: true }
}

function getContactViewLabel(
  contact: ContactPayload,
  contacts: ContactCardItem[],
  modalConfig: ContactListModalConfig
) {
  return (
    contact.viewLabel ??
    modalConfig.viewLabel ??
    (contacts.length > 1 ? "View Contacts" : "View Contact")
  )
}

function ContactAvatar({
  contact,
  size = "md",
  className,
}: {
  contact: ContactCardItem
  size?: "sm" | "md"
  className?: string
}) {
  const initials = contact.initials ?? getInitials(contact.name)
  return (
    <div
      className={cn(
        "rounded-full bg-semantic-primary text-semantic-text-inverted flex items-center justify-center shrink-0 overflow-hidden",
        size === "sm" ? "size-10 text-[13px]" : "size-12 text-[14px]",
        className
      )}
      aria-hidden="true"
    >
      {contact.avatarUrl ? (
        <img
          src={contact.avatarUrl}
          alt=""
          className="size-full object-cover"
        />
      ) : (
        <span className="font-semibold leading-none">{initials}</span>
      )}
    </div>
  )
}

function ContactAvatarStack({ contacts }: { contacts: ContactCardItem[] }) {
  if (contacts.length <= 1) {
    return <ContactAvatar contact={contacts[0]} />
  }

  const visibleContacts = contacts.slice(0, 3)
  const hiddenCount = contacts.length - visibleContacts.length

  return (
    <div className="relative flex items-center -space-x-2">
      {visibleContacts.map((item, index) => (
        <ContactAvatar
          key={item.id ?? `${item.name}-${index}`}
          contact={item}
          size="sm"
          className="border-2 border-solid border-semantic-bg-ui"
        />
      ))}
      {hiddenCount > 0 && (
        <div className="pointer-events-none absolute -bottom-0.5 -right-1 z-20 flex h-4 min-w-4 items-center justify-center rounded-full border border-solid border-semantic-bg-ui bg-semantic-bg-primary px-1 text-[8px] font-semibold leading-none text-semantic-text-primary shadow-sm">
          +{hiddenCount}
        </div>
      )}
    </div>
  )
}

function getContactSummary(contacts: ContactCardItem[]) {
  if (contacts.length === 1) {
    return contacts[0].name
  }

  const visibleNames = contacts.slice(0, 3).map((item) => item.name).join(", ")
  const hiddenCount = contacts.length - 3

  return hiddenCount > 0
    ? `${visibleNames} + ${hiddenCount} more`
    : visibleNames
}

function ContactListModal({
  open,
  onOpenChange,
  contacts,
  title,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  contacts: ContactCardItem[]
  title: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="sm"
        hideCloseButton
        className="gap-0 border-semantic-border-layout bg-semantic-bg-primary p-0"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-semantic-bg-primary px-6 pb-4 pt-6">
          <DialogTitle className="text-[16px] font-semibold leading-6 text-semantic-text-primary">
            {title}
          </DialogTitle>
          <DialogClose className="inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-semantic-text-muted transition-colors hover:text-semantic-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-semantic-bg-primary disabled:pointer-events-none">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div className="px-6 pb-6 pt-4">
          {contacts.map((item, index) => (
            <div
              key={item.id ?? `${item.name}-${index}`}
              className="flex items-center gap-3 border-b border-solid border-semantic-border-layout py-4 first:pt-0 last:border-b-0"
            >
              <ContactAvatar
                contact={item}
                size="sm"
                className="bg-semantic-bg-ui text-semantic-text-muted"
              />
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[14px] font-semibold leading-5 text-semantic-text-primary">
                  {item.name}
                </p>
                <p className="m-0 truncate text-[12px] leading-4 text-semantic-text-muted">
                  {item.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ContactMedia({ contact }: { contact: ContactPayload }) {
  const contacts = resolveContactList(contact)
  const modalConfig = getContactModalConfig(contact.modal)
  const modalEnabled = modalConfig.enabled !== false
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const summary = getContactSummary(contacts)
  const viewLabel = getContactViewLabel(contact, contacts, modalConfig)

  const handleViewContacts = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    contact.onViewContacts?.(contacts)
    if (modalEnabled) {
      setIsModalOpen(true)
    }
  }

  return (
    <div className="px-3 pt-3 pb-1">
      <div className="flex items-center justify-between gap-4 rounded bg-semantic-bg-ui px-4 py-3">
        <div className="flex min-w-0 items-center gap-4">
          <ContactAvatarStack contacts={contacts} />
          <div className="min-w-0 flex-1">
            <p className="m-0 line-clamp-2 text-[14px] font-semibold leading-5 text-semantic-text-primary">
              {summary}
            </p>
            {contacts.length === 1 && (
              <p className="m-0 mt-1 truncate text-[12px] leading-4 text-semantic-text-muted">
                {contacts[0].phone}
              </p>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto min-w-0 shrink-0 bg-transparent px-0 py-0 text-[14px] font-semibold leading-5 text-semantic-text-muted hover:bg-transparent hover:text-semantic-text-primary focus-visible:ring-semantic-border-focus"
          onClick={handleViewContacts}
        >
          {viewLabel}
        </Button>
      </div>
      {modalEnabled && (
        <ContactListModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          contacts={contacts}
          title={modalConfig.title ?? "Contact List"}
        />
      )}
    </div>
  )
}

/* ── ListReplyMedia ── */

function getListReplyModalConfig(
  modal: ListReplyPayload["modal"]
): { enabled: boolean } & ListReplyModalConfig {
  if (modal === false) {
    return { enabled: false }
  }

  if (modal && typeof modal === "object") {
    return { enabled: true, ...modal }
  }

  return { enabled: true }
}

function ListReplyRows({
  listReply,
  presentation = "inline",
}: {
  listReply: ListReplyPayload
  presentation?: "inline" | "modal"
}) {
  if (presentation === "modal") {
    return (
      <div className="flex flex-col gap-5">
        {listReply.sections?.map((section, sectionIndex) => (
          <div key={`${section.title}-${sectionIndex}`}>
            {section.title && (
              <div className="flex items-center gap-3">
                <p className="m-0 shrink-0 text-[13px] font-semibold uppercase leading-5 tracking-[0.02em] text-semantic-text-primary">
                  {section.title}
                </p>
                <span className="h-px flex-1 bg-semantic-border-layout" />
              </div>
            )}
            <div className={cn("flex flex-col", section.title ? "mt-3" : "")}>
              {section.rows.map((row) => (
                <Button
                  key={row.id}
                  type="button"
                  variant="ghost"
                  className="h-auto min-w-0 w-full flex-col items-start justify-start whitespace-normal rounded px-3 py-1.5 text-left font-normal text-semantic-text-primary hover:bg-semantic-bg-hover hover:text-semantic-text-primary"
                >
                  <span className="break-words text-[14px] font-normal leading-5">
                    {row.title}
                  </span>
                  {row.description && (
                    <span className="mt-0.5 break-words text-[12px] leading-4 text-semantic-text-muted">
                      {row.description}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary">
      {listReply.sections?.map((section, sectionIndex) => (
        <div
          key={`${section.title}-${sectionIndex}`}
          className="border-b border-solid border-semantic-border-layout last:border-b-0"
        >
          {section.title && (
            <p className="m-0 bg-semantic-bg-ui px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-semantic-text-muted">
              {section.title}
            </p>
          )}
          <div className="divide-y divide-solid divide-semantic-border-layout">
            {section.rows.map((row) => (
              <Button
                key={row.id}
                type="button"
                variant="ghost"
                className="h-auto min-w-0 w-full flex-col items-start justify-start whitespace-normal rounded-none px-3 py-3 text-left font-normal text-semantic-text-primary hover:bg-semantic-bg-hover hover:text-semantic-text-primary"
              >
                <span className="break-words text-[14px] font-medium leading-5">
                  {row.title}
                </span>
                {row.description && (
                  <span className="mt-0.5 break-words text-[12px] leading-4 text-semantic-text-muted">
                    {row.description}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ListReplyModal({
  open,
  onOpenChange,
  listReply,
  title,
  description,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  listReply: ListReplyPayload
  title: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="sm"
        className="max-h-[456px] gap-0 overflow-hidden rounded border-semantic-border-layout bg-semantic-bg-primary p-0"
      >
        <div className="px-6 pb-4 pt-5">
          <DialogTitle className="text-[18px] font-semibold leading-6 text-semantic-text-primary">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="m-0 mt-1 text-[13px] leading-5 text-semantic-text-muted">
              {description}
            </DialogDescription>
          )}
        </div>
        <div className="max-h-[384px] overflow-y-auto px-6 pb-6 pr-3 [scrollbar-color:var(--semantic-text-muted)_transparent]">
          <div className="pr-3">
            <ListReplyRows listReply={listReply} presentation="modal" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ListReplyMedia({ listReply }: { listReply: ListReplyPayload }) {
  const [isListOpen, setIsListOpen] = React.useState(Boolean(listReply.showList))
  const modalConfig = getListReplyModalConfig(listReply.modal)
  const modalEnabled = modalConfig.enabled
  const hasSections = Boolean(
    listReply.sections?.some((section) => section.rows.length > 0)
  )
  const shouldShowInlineSections = hasSections && isListOpen && !modalEnabled
  const modalTitle =
    modalConfig.title ?? listReply.header ?? listReply.buttonText ?? "Select an option"
  const modalDescription = modalConfig.description

  React.useEffect(() => {
    setIsListOpen(Boolean(listReply.showList))
  }, [listReply.showList])

  return (
    <div className="px-3 pt-3 pb-1">
      {listReply.header && (
        <p className="m-0 text-[14px] font-semibold text-semantic-text-primary leading-5 mb-1">
          {listReply.header}
        </p>
      )}
      <p className="m-0 text-[14px] text-semantic-text-primary leading-5">
        {listReply.body}
        {listReply.required && (
          <span className="ml-0.5 text-semantic-error-primary" aria-label="required">
            *
          </span>
        )}
      </p>
      {listReply.footer && (
        <p className="m-0 mt-1.5 text-[12px] text-semantic-text-muted">
          {listReply.footer}
        </p>
      )}
      {/* Action button */}
      <button
        type="button"
        aria-expanded={hasSections && isListOpen}
        aria-haspopup={modalEnabled ? "dialog" : undefined}
        disabled={!hasSections}
        onClick={() => {
          if (hasSections) {
            setIsListOpen((current) => (modalEnabled ? true : !current))
          }
        }}
        className="w-full mt-2 flex items-center justify-center gap-2 h-10 rounded border border-solid border-semantic-border-layout text-[13px] font-semibold text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors cursor-pointer disabled:cursor-default disabled:opacity-80"
      >
        <ListOrdered className="size-4" />
        {listReply.buttonText}
      </button>
      {shouldShowInlineSections && (
        <div className="mt-2">
          <ListReplyRows listReply={listReply} />
        </div>
      )}
      {modalEnabled && hasSections && (
        <ListReplyModal
          open={isListOpen}
          onOpenChange={setIsListOpen}
          listReply={listReply}
          title={modalTitle}
          description={modalDescription}
        />
      )}
    </div>
  )
}

/* ── LoadingMedia ── */

function LoadingMedia({ error }: { error?: string }) {
  return (
    <div className="overflow-hidden">
      {/* Preview area */}
      <div className="bg-semantic-bg-primary flex items-center justify-center" style={{ aspectRatio: "442 / 308" }}>
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
  SenderIndicator,
  ImageMedia,
  VideoMedia,
  AudioMedia,
  CarouselMedia,
  ReferralMedia,
  LocationMedia,
  ContactMedia,
  ListReplyMedia,
  LoadingMedia,
}
