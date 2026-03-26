import React, { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/text-field"
import { SelectField } from "@/components/ui/select-field"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { Panel } from "@/components/ui/panel"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tag } from "@/components/ui/tag"
import { Spinner } from "@/components/ui/spinner"
import { Avatar } from "@/components/ui/avatar"
import { ChatListItem } from "@/components/custom/chat-list-item"
import { ChatComposer } from "@/components/custom/chat-composer"
import { ChatTimelineDivider } from "@/components/custom/chat-timeline-divider"
import { DocMedia } from "@/components/custom/doc-media"
import { ChatHeader } from "@/components/custom/chat-header"
import {
  Search,
  Plus,
  ChevronDown,
  Check,
  Users,
  Radio,
  User,
  Send,
  Paperclip,
  Smile,
  CheckCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Reply,
  File,
  ArrowLeft,
  UserPlus,
  X,
  Trash2,
  Upload,
  Eye,
  Pencil,
  Info,
  Bot,
  ArrowDown,
  LayoutGrid,
  CircleAlert,
  Megaphone,
  Code,
  MessageSquare,
  Image as LucideImage,
  Music,
  FileText,
} from "lucide-react"
import noTemplateSelectedImg from "./assets/no-template-selected.svg"

/* ── Custom Icons ── */

const FilterIcon = () => (
  <svg
    aria-hidden="true"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="text-semantic-text-primary"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="10" y1="17" x2="14" y2="17" />
  </svg>
)

/* ── Types & Data ── */

type Tab = "open" | "assigned" | "resolved"

const tabs: { id: Tab; label: string; count: number }[] = [
  { id: "open", label: "Open", count: 10 },
  { id: "assigned", label: "Assigned", count: 2 },
  { id: "resolved", label: "Resolved", count: 5 },
]

/* ── Filter Data ── */

type AssigneeItem = {
  id: string
  label: string
  type: "all" | "unassigned" | "bot" | "agent"
}

type ChannelItem = {
  id: string
  name: string
  phone: string
  badge: string
}

const assignees: AssigneeItem[] = [
  { id: "all", label: "All", type: "all" },
  { id: "unassigned", label: "Unassigned", type: "unassigned" },
  { id: "ivr-voice-bot", label: "IVR voice bot", type: "bot" },
  { id: "whatsapp-bot", label: "WhatsApp bot", type: "bot" },
  { id: "support-bot", label: "Support bot", type: "bot" },
  { id: "alex-smith", label: "Alex Smith", type: "agent" },
  { id: "jane-doe", label: "Jane Doe", type: "agent" },
  { id: "sam-lee", label: "Sam Lee", type: "agent" },
  { id: "priya-sharma", label: "Priya Sharma", type: "agent" },
  { id: "rahul-verma", label: "Rahul Verma", type: "agent" },
  { id: "neha-gupta", label: "Neha Gupta", type: "agent" },
  { id: "vikram-singh", label: "Vikram Singh", type: "agent" },
  { id: "anita-desai", label: "Anita Desai", type: "agent" },
  { id: "mohit-kumar", label: "Mohit Kumar", type: "agent" },
  { id: "deepika-patel", label: "Deepika Patel", type: "agent" },
  { id: "arjun-reddy", label: "Arjun Reddy", type: "agent" },
  { id: "kavita-nair", label: "Kavita Nair", type: "agent" },
]

const channels: ChannelItem[] = [
  { id: "my01", name: "MyOperator Sales", phone: "+91 9212992129", badge: "MY01" },
  { id: "my02", name: "MyOperator", phone: "+91 8069200945", badge: "MY02" },
  { id: "my03", name: "MyOperator", phone: "+91 9319358395", badge: "MY03" },
  { id: "my04", name: "MyOperator Support", phone: "+91 9876543210", badge: "MY04" },
  { id: "my05", name: "MyOperator Billing", phone: "+91 8765432109", badge: "MY05" },
  { id: "my06", name: "Partner Channel", phone: "+91 7654321098", badge: "MY06" },
  { id: "my07", name: "Enterprise Sales", phone: "+91 6543210987", badge: "MY07" },
  { id: "my08", name: "APAC Support", phone: "+91 5432109876", badge: "MY08" },
]

/* ── Chat Data ── */

const chatItems = [
  {
    id: "1",
    tab: "open" as Tab,
    name: "Aditi Kumar",
    message: "Have a look at this document",
    timestamp: "2:30 PM",
    messageStatus: "sent" as const,
    messageType: "document" as const,
    channel: "MY01",
    agentName: "Alex Smith",
  },
  {
    id: "2",
    tab: "open" as Tab,
    name: "+91 98765 43210",
    message: "Authentication message sent",
    timestamp: "2:29 PM",
    messageStatus: "read" as const,
    channel: "MY01",
  },
  {
    id: "3",
    tab: "open" as Tab,
    name: "Arsh Raj",
    message: "Authentication message sent",
    timestamp: "2:29 PM",
    channel: "MY01",
    isFailed: true,
  },
  {
    id: "4",
    tab: "open" as Tab,
    name: "Nitin Rajput",
    message: "I am super excited",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "2h",
    channel: "MY01",
    agentName: "IVR voice bot",
    isBot: true,
  },
  {
    id: "5",
    tab: "open" as Tab,
    name: "Sushmit",
    message: "Hi",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "2h",
    channel: "MY01",
  },
  {
    id: "6",
    tab: "open" as Tab,
    name: "Rohit Gupta",
    message: "We get many food delivery orders. Can we...",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "50m",
    channel: "MY01",
    agentName: "Deleted User",
    isAgentDeleted: true,
  },
  {
    id: "7",
    tab: "open" as Tab,
    name: "Sushant Arya",
    message: "I am super excited!",
    timestamp: "Saturday",
    unreadCount: 1,
    channel: "MY01",
    isWindowExpired: true,
  },
  {
    id: "8",
    tab: "assigned" as Tab,
    name: "Priya Sharma",
    message: "When will my order be delivered?",
    timestamp: "1:15 PM",
    messageStatus: "sent" as const,
    channel: "MY02",
    agentName: "Jane Doe",
  },
  {
    id: "9",
    tab: "assigned" as Tab,
    name: "Vikram Singh",
    message: "Please share the invoice",
    timestamp: "12:40 PM",
    messageStatus: "delivered" as const,
    channel: "MY01",
    agentName: "Alex Smith",
  },
  {
    id: "10",
    tab: "resolved" as Tab,
    name: "Deepika Patel",
    message: "Thank you for your help!",
    timestamp: "Monday",
    messageStatus: "read" as const,
    channel: "MY01",
    agentName: "Sam Lee",
  },
  {
    id: "11",
    tab: "resolved" as Tab,
    name: "Mohit Kumar",
    message: "Issue resolved, thanks.",
    timestamp: "Sunday",
    messageStatus: "read" as const,
    channel: "MY03",
    agentName: "Priya Sharma",
  },
  {
    id: "12",
    tab: "resolved" as Tab,
    name: "Anita Desai",
    message: "Got it, will proceed.",
    timestamp: "Saturday",
    messageStatus: "read" as const,
    channel: "MY02",
  },
]

/* ── Template Data ── */

type TemplateCategory = "all" | "marketing" | "utility" | "authentication"
type TemplateType = "text" | "image" | "carousel"
type TemplateCardDef = { cardIndex: number; bodyVariables: string[]; buttonVariables: string[] }
type TemplateDef = {
  id: string
  name: string
  category: "marketing" | "utility" | "authentication"
  type: TemplateType
  body: string
  footer?: string
  button?: string
  bodyVariables: string[]
  cards?: TemplateCardDef[]
  /** One image URL per card (for carousel preview) */
  cardImages?: string[]
}
type VarMap = Record<string, string>
type CardVarMap = Record<number, { body: VarMap; button: VarMap }>

const templateCategoryOptions: { id: TemplateCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "marketing", label: "Marketing" },
  { id: "utility", label: "Utility" },
  { id: "authentication", label: "Authentication" },
]

const templateList: TemplateDef[] = [
  {
    id: "book-free-demo",
    name: "Book Free Demo",
    category: "marketing",
    type: "text",
    body: "Hi {{name}}! Book a free demo of our platform today and discover how MyOperator can transform your business.",
    bodyVariables: ["{{name}}"],
  },
  {
    id: "enterprise-plan",
    name: "Enterprise Plan",
    category: "marketing",
    type: "text",
    body: "Hi {{name}}! We have a special enterprise plan tailored for {{company}}. Get in touch today.",
    bodyVariables: ["{{name}}", "{{company}}"],
  },
  {
    id: "suv-plan",
    name: "SUV Plan",
    category: "utility",
    type: "image",
    body: "Hi {{name}}! Have a look at this document.",
    bodyVariables: ["{{name}}"],
    button: "Interested",
  },
  {
    id: "carousel",
    name: "Shopify Order Update",
    category: "marketing",
    type: "carousel",
    body: "Hi {{customer_name}}! Your order {{order_id}} has been confirmed.",
    footer: "MyOperator — Order Notifications",
    bodyVariables: ["{{customer_name}}", "{{order_id}}"],
    cardImages: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=200&fit=crop",
    ],
    cards: [
      {
        cardIndex: 1,
        bodyVariables: ["{{product_name}}", "{{quantity}}", "{{price}}"],
        buttonVariables: ["{{tracking_url}}"],
      },
      {
        cardIndex: 2,
        bodyVariables: ["{{product_name}}", "{{quantity}}", "{{price}}"],
        buttonVariables: ["{{tracking_url}}"],
      },
      {
        cardIndex: 3,
        bodyVariables: ["{{product_name}}", "{{quantity}}"],
        buttonVariables: [],
      },
    ],
  },
  {
    id: "option-5",
    name: "Option 5",
    category: "authentication",
    type: "text",
    body: "Your verification code is {{code}}. This code is valid for 10 minutes. Do not share it with anyone.",
    bodyVariables: ["{{code}}"],
  },
]

/* ── Message Data ── */

type MediaPayload = {
  url: string
  thumbnailUrl?: string
  filename?: string
  fileType?: string
  fileSize?: string
  pageCount?: number
  duration?: string
  caption?: string
  images?: Array<{
    url: string
    title: string
    buttons?: Array<{ label: string; icon?: string }>
  }>
}

type SentByType = "agent" | "bot" | "campaign" | "api"

type ChatMessage = {
  id: string
  text: string
  time: string
  sender: "customer" | "agent"
  senderName?: string
  type?: "text" | "image" | "video" | "audio" | "document" | "docPreview" | "carousel" | "otherDoc" | "loading" | "system"
  status?: "sent" | "delivered" | "read" | "failed"
  replyTo?: { sender: string; text: string; messageId?: string }
  media?: MediaPayload
  error?: string
  /** Who sent this outbound message — rendered as sender indicator outside the bubble */
  sentBy?: { type: SentByType; name?: string }
}

/* ── Sender Indicator Helper ── */

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function SenderIndicatorBadge({ sentBy }: { sentBy: { type: SentByType; name?: string } }) {
  const iconClass = "size-3.5 text-semantic-text-muted"
  if (sentBy.type === "agent" && sentBy.name) {
    return <span className="text-[10px] font-medium text-semantic-text-secondary leading-none">{getInitials(sentBy.name)}</span>
  }
  if (sentBy.type === "bot") return <Bot className={iconClass} />
  if (sentBy.type === "campaign") return <Megaphone className={iconClass} />
  return <Code className={iconClass} />
}

/* ── Media Sub-Renderers ── */

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

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

function VideoMedia({ media }: { media: MediaPayload }) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [volume, setVolume] = useState(75)
  return (
    <div className="relative rounded-t overflow-hidden cursor-pointer group" onClick={() => setPlaying(!playing)}>
      <img
        src={media.thumbnailUrl || media.url}
        alt="Video thumbnail"
        className="w-full object-cover"
        style={{ aspectRatio: "16/10" }}
      />
      {/* Gradient overlay — stronger for visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {/* Center play/pause — visible on hover or when paused */}
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

function AudioMedia({ media }: { media: MediaPayload }) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

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
        {/* Play / Pause — circular button */}
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

        {/* Waveform with scrubber — single SVG fills available width */}
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



function CarouselMedia({ media }: { media: MediaPayload }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState((media.images?.length || 0) > 1)
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
          <div key={i} className="shrink-0 bg-white rounded border border-semantic-border-layout overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]" style={{ width: 260 }}>
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
                className="flex items-center justify-center gap-2 w-full border-t border-semantic-border-layout text-[13px] font-normal text-semantic-text-muted hover:bg-semantic-bg-hover transition-colors"
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
      {/* Navigation arrows — show/hide based on scroll position */}
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

function LoadingMedia({ error }: { error?: string }) {
  return (
    <div className="overflow-hidden">
      {/* White preview area — aspect ~442:308 matching doc previews */}
      <div className="bg-white flex items-center justify-center" style={{ aspectRatio: "442 / 308" }}>
        <Spinner size="xl" variant="muted" />
      </div>
      {/* Error banner */}
      {error && (
        <div className="border-t border-semantic-error-primary bg-semantic-error-surface px-4 py-3">
          <p className="m-0 text-[14px] leading-5 text-semantic-error-primary">
            {error}
          </p>
        </div>
      )}
    </div>
  )
}

/* ── Message Data ── */

const chatMessages: Record<string, ChatMessage[]> = {
  "1": [
    // Text messages (with reply quote)
    { id: "m1", text: "Hi, I need help with my account settings", time: "2:15 PM", sender: "customer" },
    { id: "m1b", text: "Assigned to **Alex Smith** by **Alex Smith**", time: "", sender: "agent", type: "system" },
    { id: "m2", text: "Sure, I'd be happy to help!", time: "2:16 PM", sender: "agent", senderName: "Alex Smith", status: "read", sentBy: { type: "agent", name: "Alex Smith" }, replyTo: { sender: "Aditi Kumar", text: "Hi, I need help with my account settings", messageId: "m1" } },
    // Image
    { id: "m3", text: "", time: "2:18 PM", sender: "customer", type: "image", media: { url: "https://picsum.photos/seed/chat1/683/546", caption: "Here is a screenshot of the issue I'm facing" } },
    // Audio (both directions)
    { id: "m4", text: "", time: "2:20 PM", sender: "customer", type: "audio", media: { url: "#", duration: "0:10" } },
    { id: "m5", text: "", time: "2:21 PM", sender: "agent", senderName: "Alex Smith", status: "delivered", sentBy: { type: "agent", name: "Alex Smith" }, type: "audio", media: { url: "#", duration: "1:35" } },
    // Video
    { id: "m6", text: "", time: "2:23 PM", sender: "agent", senderName: "Alex Smith", status: "delivered", sentBy: { type: "agent", name: "Alex Smith" }, type: "video", media: { url: "https://picsum.photos/seed/vid1/683/400", thumbnailUrl: "https://picsum.photos/seed/vid1/683/400", duration: "3:45", caption: "WhatsApp API Setup Tutorial" } },
    // Document preview (PDF)
    { id: "m7", text: "Have a look at this document", time: "2:30 PM", sender: "agent", senderName: "Alex Smith", status: "failed", sentBy: { type: "agent", name: "Alex Smith" }, type: "docPreview", media: { url: "https://picsum.photos/seed/doc1/442/308", thumbnailUrl: "https://picsum.photos/seed/doc1/442/308", filename: "Introduction to Live Chat.pdf", fileType: "PDF", pageCount: 46, fileSize: "5MB" } },
    // Document with download
    { id: "m8", text: "", time: "2:27 PM", sender: "customer", type: "document", media: { url: "https://picsum.photos/seed/doc2/442/308", thumbnailUrl: "https://picsum.photos/seed/doc2/442/308", filename: "Monthly_Report_Feb.pdf", fileType: "PDF", pageCount: 12, fileSize: "3.1MB" } },
    // Other doc (XLS)
    { id: "m9", text: "Have a look at this document", time: "2:28 PM", sender: "customer", type: "otherDoc", media: { url: "#", filename: "Order_Data_Q4.xlsx", fileType: "XLS", pageCount: 46, fileSize: "2.3MB" } },
    // Carousel
    { id: "m10", text: "Check out our latest products!", time: "2:29 PM", sender: "agent", senderName: "Alex Smith", status: "delivered", sentBy: { type: "campaign" }, type: "carousel", media: { url: "#", images: [
      { url: "https://picsum.photos/seed/c1/300/240", title: "Product Catalog 2025", buttons: [{ label: "View Details", icon: "link" }, { label: "Share", icon: "reply" }] },
      { url: "https://picsum.photos/seed/c2/300/240", title: "New Arrivals Collection", buttons: [{ label: "Shop Now", icon: "link" }] },
      { url: "https://picsum.photos/seed/c3/300/240", title: "Special Offers & Deals", buttons: [{ label: "Learn More", icon: "link" }, { label: "Share", icon: "reply" }] },
    ] } },
    // Loading / Error
    { id: "m11", text: "", time: "2:30 PM", sender: "agent", senderName: "Alex Smith", status: "sent", sentBy: { type: "campaign" }, type: "loading", error: "Template message could not be delivered. The message template has been rejected." },
  ],
  "2": [
    { id: "m1", text: "Hello, I'd like to know about your enterprise plans", time: "2:10 PM", sender: "customer" },
    { id: "m2", text: "Welcome! I'll share our enterprise pricing details with you.", time: "2:15 PM", sender: "agent", status: "read", sentBy: { type: "agent", name: "Kavita Nair" } },
    { id: "m3", text: "", time: "2:20 PM", sender: "customer", type: "audio", media: { url: "#", duration: "0:10" } },
    { id: "m4", text: "", time: "2:22 PM", sender: "agent", status: "delivered", sentBy: { type: "agent", name: "Kavita Nair" }, type: "audio", media: { url: "#", duration: "1:35" } },
    { id: "m5", text: "Authentication message sent", time: "2:29 PM", sender: "agent", status: "read", sentBy: { type: "api" } },
  ],
  "3": [
    { id: "m1", text: "Can you help me set up the API integration?", time: "1:45 PM", sender: "customer" },
    { id: "m2", text: "Of course! Here's a quick video tutorial.", time: "1:50 PM", sender: "agent", status: "delivered", sentBy: { type: "bot" } },
    { id: "m3", text: "", time: "1:52 PM", sender: "agent", status: "delivered", sentBy: { type: "bot" }, type: "video", media: { url: "https://picsum.photos/seed/vid1/683/400", thumbnailUrl: "https://picsum.photos/seed/vid1/683/400", duration: "3:45", caption: "WhatsApp API Setup Tutorial" } },
    { id: "m4", text: "The WhatsApp Business API", time: "2:00 PM", sender: "customer" },
    { id: "m5", text: "Authentication message sent", time: "2:29 PM", sender: "agent", status: "failed", sentBy: { type: "api" } },
  ],
  "4": [
    { id: "m1", text: "I am super excited", time: "Yesterday", sender: "customer" },
    { id: "m2", text: "", time: "Yesterday", sender: "customer", type: "carousel", media: { url: "#", images: [
      { url: "https://picsum.photos/seed/c1/300/240", title: "Product Catalog 2025", buttons: [{ label: "View Details", icon: "link" }, { label: "Share", icon: "reply" }] },
      { url: "https://picsum.photos/seed/c2/300/240", title: "New Arrivals Collection", buttons: [{ label: "Shop Now", icon: "link" }] },
      { url: "https://picsum.photos/seed/c3/300/240", title: "Special Offers & Deals", buttons: [{ label: "Learn More", icon: "link" }, { label: "Share", icon: "reply" }] },
    ] } },
  ],
  "5": [
    { id: "m1", text: "Hi, can you share the proposal?", time: "Yesterday", sender: "customer" },
    { id: "m2", text: "Sure, here's the PDF.", time: "Yesterday", sender: "agent", status: "read", sentBy: { type: "agent", name: "Jane Doe" } },
    { id: "m3", text: "", time: "Yesterday", sender: "agent", status: "read", sentBy: { type: "agent", name: "Jane Doe" }, type: "docPreview", media: { url: "https://picsum.photos/seed/doc1/442/308", thumbnailUrl: "https://picsum.photos/seed/doc1/442/308", filename: "Project_Proposal_2025.pdf", fileType: "PDF", pageCount: 46, fileSize: "5MB" } },
  ],
  "6": [
    { id: "m1", text: "We get many food delivery orders. Can we set up an automated response for those?", time: "Yesterday", sender: "customer" },
    { id: "m2", text: "Here's the order data from last quarter", time: "Yesterday", sender: "customer", type: "otherDoc", media: { url: "#", filename: "Order_Data_Q4.xlsx", fileType: "XLS", pageCount: 12, fileSize: "2.3MB" } },
    { id: "m3", text: "", time: "Yesterday", sender: "agent", status: "sent", sentBy: { type: "campaign" }, type: "loading", error: "Template message could not be delivered. The message template has been rejected." },
  ],
  "7": [
    { id: "m1", text: "I am super excited!", time: "Saturday", sender: "customer" },
    { id: "m2", text: "Here's the report you requested!", time: "Saturday", sender: "agent", status: "delivered", sentBy: { type: "agent", name: "Alex Smith" } },
    { id: "m3", text: "", time: "Saturday", sender: "agent", status: "delivered", sentBy: { type: "agent", name: "Alex Smith" }, type: "document", media: { url: "https://picsum.photos/seed/doc2/442/308", thumbnailUrl: "https://picsum.photos/seed/doc2/442/308", filename: "Monthly_Report_Feb.pdf", fileType: "PDF", pageCount: 12, fileSize: "3.1MB" } },
  ],
}

/* ── New Chat Contact Data ── */

type Contact = {
  id: string
  name: string
  phone: string
  channel?: string
}

const contacts: Contact[] = [
  { id: "c1", name: "Aditi Kumar", phone: "+91 98765 43210", channel: "MY01" },
  { id: "c2", name: "Arsh Raj", phone: "+91 91234 56789", channel: "MY01" },
  { id: "c3", name: "Deepika Patel", phone: "+91 87654 32109", channel: "MY01" },
  { id: "c4", name: "Jane Doe", phone: "+91 76543 21098", channel: "MY02" },
  { id: "c5", name: "Kavita Nair", phone: "+91 65432 10987", channel: "MY03" },
  { id: "c6", name: "Mohit Kumar", phone: "+91 99887 76655", channel: "MY01" },
  { id: "c7", name: "Neha Gupta", phone: "+91 88776 65544", channel: "MY02" },
  { id: "c8", name: "Nitin Rajput", phone: "+91 77665 54433", channel: "MY01" },
  { id: "c9", name: "Priya Sharma", phone: "+91 66554 43322", channel: "MY03" },
  { id: "c10", name: "Rahul Verma", phone: "+91 55443 32211", channel: "MY01" },
  { id: "c11", name: "Rohit Gupta", phone: "+91 44332 21100", channel: "MY02" },
  { id: "c12", name: "Sam Lee", phone: "+91 93300 11122", channel: "MY01" },
  { id: "c13", name: "Sushmit", phone: "+91 92200 33344", channel: "MY03" },
  { id: "c14", name: "Sushant Arya", phone: "+91 91100 55566", channel: "MY01" },
  { id: "c15", name: "Vikram Singh", phone: "+91 90000 77788", channel: "MY02" },
]

// getInitials is now available from the Avatar component library
// import { getInitials } from "@/components/ui/avatar"

/* ── Add New Contact Modal ── */

function AddNewContactModal({
  defaultChannel,
  onClose,
}: {
  defaultChannel: ChannelItem
  onClose: () => void
}) {
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [channel, setChannel] = useState(defaultChannel)

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent size="default" className="w-[480px] max-w-[90vw] p-0 gap-0" hideCloseButton>
        <DialogDescription className="sr-only">Add a new contact to start a conversation</DialogDescription>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <DialogTitle>Add New Contact</DialogTitle>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {channel.badge}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px]">
                {channels.map((ch) => (
                  <DropdownMenuItem
                    key={ch.id}
                    onSelect={() => setChannel(channels.find((c) => c.id === ch.id)!)}
                    description={ch.phone}
                    suffix={ch.badge}
                    className={cn(channel.id === ch.id && "bg-semantic-primary-surface text-semantic-primary font-medium")}
                  >
                    {ch.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="add-contact-phone" className="text-[14px] font-medium text-semantic-text-primary">
              Phone<span className="text-semantic-error-primary">*</span>
            </label>
            <div className="flex items-center border border-semantic-border-layout rounded focus-within:border-semantic-border-focus transition-colors">
              <div className="flex items-center gap-1.5 pl-3 pr-2 h-9 shrink-0">
                <span className="text-[14px]">🇮🇳</span>
                <span className="text-[14px] text-semantic-text-secondary">+91</span>
              </div>
              <div className="w-px h-5 bg-semantic-border-layout shrink-0" />
              <input
                id="add-contact-phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-required="true"
                className="flex-1 h-9 px-3 text-[14px] text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Save contact as */}
          <TextField
            label="Save contact as"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="sm"
          />

          {/* Start Conversation button */}
          <div className="flex justify-end pt-2">
            <Button>Start Conversation</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ── New Chat Panel ── */

function NewChatPanel({
  onBack,
  onOpenAddContact,
}: {
  onBack: () => void
  onOpenAddContact: () => void
}) {
  const [contactSearch, setContactSearch] = useState("")
  const [selectedChannel, setSelectedChannel] = useState(channels[0])

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone.includes(contactSearch)
  )

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-semantic-border-layout shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <span className="text-[16px] font-semibold text-semantic-text-primary">New Chat</span>
        </div>

        {/* Channel selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedChannel.badge}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px]">
            {channels.map((ch) => (
              <DropdownMenuItem
                key={ch.id}
                onSelect={() => setSelectedChannel(channels.find((c) => c.id === ch.id)!)}
                description={ch.phone}
                suffix={ch.badge}
                className={cn(selectedChannel.id === ch.id && "bg-semantic-primary-surface text-semantic-primary font-medium")}
              >
                {ch.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search row */}
      <div role="search" aria-label="Search contacts" className="flex items-center gap-2 px-3 py-2.5 border-b border-semantic-border-layout shrink-0">
        <TextField
          placeholder="Search contacts"
          aria-label="Search contacts"
          value={contactSearch}
          onChange={(e) => setContactSearch(e.target.value)}
          leftIcon={<Search className="size-4" />}
          wrapperClassName="flex-1 min-w-0"
          size="default"
          clearable={!!contactSearch}
          onClear={() => setContactSearch("")}
        />
        <Button variant="outline" size="icon-lg" onClick={onOpenAddContact} className="shrink-0" aria-label="Add new contact">
          <UserPlus className="size-4" />
        </Button>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-[13px] text-semantic-text-muted">
            No contacts found
          </div>
        ) : (
          filtered.map((contact, i) => (
            <button
              type="button"
              key={contact.id}
              className={`flex items-center gap-3 px-3 py-3 hover:bg-semantic-bg-hover cursor-pointer transition-colors text-left w-full ${
                i < filtered.length - 1 ? "border-b border-semantic-border-layout" : ""
              }`}
            >
              <Avatar name={contact.name} size="sm" />
              {/* Info */}
              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-medium text-semantic-text-primary leading-5 truncate">
                    {contactSearch ? highlightMatch(contact.name, contactSearch) : contact.name}
                  </span>
                  <span className="text-[12px] text-semantic-text-muted">
                    {contactSearch ? highlightMatch(contact.phone, contactSearch) : contact.phone}
                  </span>
                </div>
                {contact.channel && (
                  <span className="text-[12px] font-medium text-semantic-text-muted shrink-0 ml-2">
                    {contact.channel}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

/* ── Filter Panel Content (renders below the search bar) ── */

function FilterPanel({
  onClose,
  onApply,
}: {
  onClose: () => void
  onApply: (assignees: Set<string>, channels: Set<string>) => void
}) {
  const [filterSearch, setFilterSearch] = useState("")
  const [showAllBots, setShowAllBots] = useState(false)
  const [showAllAgents, setShowAllAgents] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const COLLAPSED_COUNT = 4

  const initialAssignees = useRef(new Set(["all", "unassigned", "ivr-voice-bot", "alex-smith", "jane-doe"]))
  const initialChannels = useRef(new Set(["my01"]))

  const [selectedAssignees, setSelectedAssignees] = useState<Set<string>>(
    () => new Set(["all", "unassigned", "ivr-voice-bot", "alex-smith", "jane-doe"])
  )
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(
    () => new Set(["my01"])
  )

  const isDirty = () => {
    if (selectedAssignees.size !== initialAssignees.current.size) return true
    if (selectedChannels.size !== initialChannels.current.size) return true
    for (const id of selectedAssignees) if (!initialAssignees.current.has(id)) return true
    for (const id of selectedChannels) if (!initialChannels.current.has(id)) return true
    return false
  }

  const handleBack = () => {
    if (isDirty()) {
      setShowDiscardDialog(true)
    } else {
      onClose()
    }
  }

  const bots = assignees.filter((a) => a.type === "bot")
  const agents = assignees.filter((a) => a.type === "agent")
  const topLevel = assignees.filter((a) => a.type === "all" || a.type === "unassigned")

  const query = filterSearch.toLowerCase()
  const filteredBots = bots.filter((b) => b.label.toLowerCase().includes(query))
  const filteredAgents = agents.filter((a) => a.label.toLowerCase().includes(query))
  const filteredChannels = channels.filter(
    (c) => c.name.toLowerCase().includes(query) || c.phone.includes(filterSearch)
  )

  const toggleAssignee = (id: string) => {
    setSelectedAssignees((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header — matches NewChat pattern */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-semantic-border-layout shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <span className="text-[16px] font-semibold text-semantic-text-primary">Filters</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm"
          onClick={() => {
            setSelectedAssignees(new Set())
            setSelectedChannels(new Set())
          }}
        >
          Reset
        </Button>
      </div>

      {/* Search row */}
      <div role="search" aria-label="Search filters" className="flex items-center gap-2 px-3 py-2.5 border-b border-semantic-border-layout shrink-0">
        <TextField
          placeholder="Search filters..."
          aria-label="Search filters"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          leftIcon={<Search className="size-4" />}
          wrapperClassName="flex-1 min-w-0"
          clearable
          onClear={() => setFilterSearch("")}
        />
      </div>

      {/* Scrollable filter sections */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* ── Assignment Section ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="size-4 text-semantic-text-muted" />
            <span className="text-[13px] font-semibold text-semantic-text-primary">
              Assignment
            </span>
            <span className="text-[12px] text-semantic-text-muted tabular-nums">
              {selectedAssignees.size}/{assignees.length}
            </span>
            <span className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-semantic-error-primary hover:bg-semantic-error-surface hover:text-semantic-error-primary"
              onClick={() => setSelectedAssignees(new Set())}
            >
              Clear All
            </Button>
          </div>

          <div className="border border-semantic-border-layout rounded-lg overflow-hidden">
            {topLevel.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors border-b border-semantic-border-layout"
              >
                <Checkbox
                  size="sm"
                  checked={selectedAssignees.has(item.id)}
                  onCheckedChange={() => toggleAssignee(item.id)}
                />
                <span className="text-[14px] text-semantic-text-primary">{item.label}</span>
              </label>
            ))}

            {filteredBots.length > 0 && (() => {
              const isSearching = filterSearch.trim().length > 0
              const visibleBots = isSearching || showAllBots ? filteredBots : filteredBots.slice(0, COLLAPSED_COUNT)
              const hiddenCount = filteredBots.length - COLLAPSED_COUNT
              return (
              <>
                <div className="px-3 py-2 bg-semantic-bg-ui border-b border-semantic-border-layout">
                  <span className="text-[13px] font-semibold text-semantic-text-secondary">
                    Bots ({bots.length})
                  </span>
                </div>
                {visibleBots.map((bot) => (
                  <label
                    key={bot.id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors border-b border-semantic-border-layout"
                  >
                    <Checkbox
                      size="sm"
                      checked={selectedAssignees.has(bot.id)}
                      onCheckedChange={() => toggleAssignee(bot.id)}
                    />
                    <span className="text-[14px] text-semantic-text-primary flex-1">{bot.label}</span>
                    <Bot className="size-4 text-semantic-text-muted" />
                  </label>
                ))}
                {!isSearching && hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAllBots((p) => !p)}
                    className="w-full px-3 py-2 text-[13px] font-medium text-semantic-text-link hover:bg-semantic-bg-hover transition-colors text-left border-b border-semantic-border-layout"
                  >
                    {showAllBots ? "Show less" : `Show more (+${hiddenCount})`}
                  </button>
                )}
              </>
              )
            })()}

            {filteredAgents.length > 0 && (() => {
              const isSearching = filterSearch.trim().length > 0
              const visibleAgents = isSearching || showAllAgents ? filteredAgents : filteredAgents.slice(0, COLLAPSED_COUNT)
              const hiddenCount = filteredAgents.length - COLLAPSED_COUNT
              return (
              <>
                <div className="px-3 py-2 bg-semantic-bg-ui border-b border-semantic-border-layout">
                  <span className="text-[13px] font-semibold text-semantic-text-secondary">
                    Agents ({agents.length})
                  </span>
                </div>
                {visibleAgents.map((agent, i) => (
                  <label
                    key={agent.id}
                    className={`flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors ${
                      i < visibleAgents.length - 1 || (!isSearching && hiddenCount > 0) ? "border-b border-semantic-border-layout" : ""
                    }`}
                  >
                    <Checkbox
                      size="sm"
                      checked={selectedAssignees.has(agent.id)}
                      onCheckedChange={() => toggleAssignee(agent.id)}
                    />
                    <span className="text-[14px] text-semantic-text-primary">{agent.label}</span>
                  </label>
                ))}
                {!isSearching && hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAllAgents((p) => !p)}
                    className="w-full px-3 py-2 text-[13px] font-medium text-semantic-text-link hover:bg-semantic-bg-hover transition-colors text-left"
                  >
                    {showAllAgents ? "Show less" : `Show more (+${hiddenCount})`}
                  </button>
                )}
              </>
              )
            })()}
          </div>
        </div>

        {/* ── Channels Section ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="size-4 text-semantic-text-muted" />
            <span className="text-[13px] font-semibold text-semantic-text-primary">
              Channels
            </span>
            <span className="text-[12px] text-semantic-text-muted tabular-nums">
              {selectedChannels.size}/{channels.length}
            </span>
            <span className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-semantic-error-primary hover:bg-semantic-error-surface hover:text-semantic-error-primary"
              onClick={() => setSelectedChannels(new Set())}
            >
              Clear All
            </Button>
          </div>

          <div className="border border-semantic-border-layout rounded-lg overflow-hidden">
            {filteredChannels.map((ch, i) => (
              <label
                key={ch.id}
                className={`flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors ${
                  i < filteredChannels.length - 1 ? "border-b border-semantic-border-layout" : ""
                }`}
              >
                <Checkbox
                  size="sm"
                  checked={selectedChannels.has(ch.id)}
                  onCheckedChange={() => toggleChannel(ch.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-semantic-text-primary truncate">
                      {ch.name}
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold text-semantic-text-muted bg-semantic-bg-hover px-1.5 py-0.5 rounded">
                      {ch.badge}
                    </span>
                  </div>
                  <span className="text-[13px] text-semantic-text-muted">{ch.phone}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-semantic-border-layout px-4 py-3">
        <p className="m-0 text-[13px] text-semantic-text-muted mb-3 text-center">
          Maximum selections allowed per category: 50
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => onApply(selectedAssignees, selectedChannels)}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Discard unsaved filters confirmation */}
      {showDiscardDialog && (
        <Dialog open onOpenChange={(open) => { if (!open) setShowDiscardDialog(false) }}>
          <DialogContent size="default" className="w-[400px] max-w-[90vw]">
            <DialogTitle>Discard filter changes?</DialogTitle>
            <DialogDescription>
              You have unsaved filter changes. Do you want to apply them or discard?
            </DialogDescription>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => { setShowDiscardDialog(false); onClose() }}>
                Discard
              </Button>
              <Button className="flex-1" onClick={() => { setShowDiscardDialog(false); onApply(selectedAssignees, selectedChannels) }}>
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

/* ── Select Template Modal ── */

function resolveVars(text: string, vars: VarMap): React.ReactNode {
  const parts = text.split(/(\{\{[^}]+\}\})/g)
  return parts.map((part, i) =>
    /^\{\{[^}]+\}\}$/.test(part) ? (
      <span key={i} className="text-semantic-text-link font-medium">{vars[part] || part}</span>
    ) : (
      part
    )
  )
}

function TemplatePreviewEmpty() {
  return (
    <div className="flex flex-col items-center gap-5 pt-20 pb-8 px-6">
      <img src={noTemplateSelectedImg} alt="" className="size-[140px]" />
      <p className="m-0 text-[18px] font-semibold text-semantic-text-primary">No template selected</p>
    </div>
  )
}

function TemplateCarouselPreview({
  template,
  varValues,
  DeliveryRow,
}: {
  template: TemplateDef
  varValues: VarMap
  DeliveryRow: () => React.ReactElement
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState((template.cards?.length || 0) > 1)

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
    <div className="bg-semantic-info-surface border border-semantic-border-layout rounded overflow-hidden w-full max-w-[360px]">
      {/* Body text */}
      <div className="px-3 pt-3">
        <p className="text-[14px] leading-5 text-semantic-text-primary m-0">{resolveVars(template.body, varValues)}</p>
      </div>

      {/* Cards — same structure as CarouselMedia */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-3 overflow-x-auto px-3 pt-2 pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {(template.cards || []).map((card, i) => {
            const imgUrl = template.cardImages?.[i]
            return (
              <div
                key={card.cardIndex}
                className="shrink-0 bg-white rounded border border-semantic-border-layout overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]"
                style={{ width: 260 }}
              >
                {imgUrl ? (
                  <img src={imgUrl} alt={`Card ${card.cardIndex}`} className="w-full object-cover" style={{ height: 200 }} />
                ) : (
                  <div className="w-full bg-semantic-bg-ui flex items-center justify-center" style={{ height: 200 }}>
                    <FileSpreadsheet className="size-10 text-semantic-text-muted" />
                  </div>
                )}
                <div className="px-3 pt-2.5 pb-2">
                  <p className="text-[14px] font-semibold text-semantic-text-primary m-0">
                    {card.bodyVariables.length > 0
                      ? resolveVars(card.bodyVariables[0], varValues)
                      : `Card ${card.cardIndex}`}
                  </p>
                  {card.bodyVariables.slice(1).map((v) => (
                    <p key={v} className="text-[13px] text-semantic-text-muted m-0 mt-0.5">{resolveVars(v, varValues)}</p>
                  ))}
                </div>
                {card.buttonVariables.map((v, j) => (
                  <button
                    key={j}
                    className="flex items-center justify-center gap-2 w-full border-t border-semantic-border-layout text-[13px] font-semibold text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
                    style={{ height: 40 }}
                  >
                    <ExternalLink className="size-4" />
                    {resolveVars(v, varValues) || "View details"}
                  </button>
                ))}
                {card.buttonVariables.length === 0 && (
                  <button
                    className="flex items-center justify-center gap-2 w-full border-t border-semantic-border-layout text-[13px] font-semibold text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
                    style={{ height: 40 }}
                  >
                    <Reply className="size-4" />
                    Interested
                  </button>
                )}
              </div>
            )
          })}
        </div>
        {canScrollLeft && (
          <button aria-label="Scroll template preview left" onClick={scroll("left")} className="absolute left-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center hover:bg-semantic-bg-hover transition-colors">
            <ChevronLeft className="size-4 text-semantic-text-primary" />
          </button>
        )}
        {canScrollRight && (
          <button aria-label="Scroll template preview right" onClick={scroll("right")} className="absolute right-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center hover:bg-semantic-bg-hover transition-colors">
            <ChevronRight className="size-4 text-semantic-text-primary" />
          </button>
        )}
      </div>

      {/* Footer + delivery */}
      <div className="px-3 pb-2">
        {template.footer && (
          <p className="text-[12px] text-semantic-text-muted m-0 mb-1">{template.footer}</p>
        )}
        <DeliveryRow />
      </div>
    </div>
  )
}

const DeliveryRow = () => (
  <div className="flex items-center justify-end gap-1.5 mt-1.5">
    <CheckCheck className="size-4 text-semantic-text-muted" />
    <span className="text-[12px] text-semantic-text-muted">Delivered</span>
    <span className="text-[10px] font-bold text-semantic-text-muted">•</span>
    <span className="text-[12px] text-semantic-text-muted">2:30 PM</span>
    <Avatar initials="AS" size="xs" variant="filled" />
  </div>
)

function TemplatePreviewBubble({ template, varValues }: { template: TemplateDef; varValues: VarMap }) {

  if (template.type === "text") {
    return (
      <div className="bg-semantic-info-surface rounded-lg px-3 pt-3 pb-2 max-w-[280px] w-full">
        <p className="m-0 text-[14px] leading-[1.4] text-semantic-text-primary">{resolveVars(template.body, varValues)}</p>
        {template.button && (
          <div className="border-t border-semantic-border-layout mt-2 pt-2 flex items-center justify-center gap-1.5 text-semantic-text-primary text-[13px] font-semibold">
            <Reply className="size-3.5" />
            {template.button}
          </div>
        )}
        <DeliveryRow />
      </div>
    )
  }

  if (template.type === "image") {
    return (
      <div className="bg-semantic-info-surface rounded-lg overflow-hidden max-w-[280px] w-full">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=560&h=320&fit=crop"
          alt="Template image"
          className="w-full h-[160px] object-cover"
        />
        <div className="px-3 pt-2.5 pb-2">
          <p className="m-0 text-[14px] leading-[1.4] text-semantic-text-primary">{resolveVars(template.body, varValues)}</p>
          {template.button && (
            <div className="border-t border-semantic-border-layout mt-2 pt-2 flex items-center justify-center gap-1.5 text-semantic-text-primary text-[13px] font-semibold">
              <Reply className="size-3.5" />
              {template.button}
            </div>
          )}
          <DeliveryRow />
        </div>
      </div>
    )
  }

  if (template.type === "carousel") {
    return <TemplateCarouselPreview template={template} varValues={varValues} DeliveryRow={DeliveryRow} />
  }

  return null
}

function VarRow({
  varName,
  value,
  onChange,
}: {
  varName: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-[13px] text-semantic-text-secondary w-[148px] shrink-0 truncate font-mono">{varName}</span>
      <TextField
        wrapperClassName="flex-1"
        placeholder="Enter value"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

function VarSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 text-[11px] font-semibold text-semantic-text-muted uppercase tracking-[0.4px] mt-4 mb-1">{children}</p>
  )
}

function VariablesTab({
  template,
  varValues,
  setVarValues,
  cardVarValues,
  setCardVarValues,
}: {
  template: TemplateDef
  varValues: VarMap
  setVarValues: React.Dispatch<React.SetStateAction<VarMap>>
  cardVarValues: CardVarMap
  setCardVarValues: React.Dispatch<React.SetStateAction<CardVarMap>>
}) {
  const hasNoVars =
    template.bodyVariables.length === 0 &&
    (template.cards ?? []).every(
      (c) => c.bodyVariables.length === 0 && c.buttonVariables.length === 0
    )

  if (hasNoVars) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="m-0 text-[14px] font-semibold text-semantic-text-secondary">No variables</p>
        <p className="m-0 text-[13px] text-semantic-text-muted">This template has no dynamic variables to fill in.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-3">
      {/* Top-level body variables */}
      {template.bodyVariables.length > 0 && (
        <>
          <VarSectionLabel>Body variables</VarSectionLabel>
          {template.bodyVariables.map((v) => (
            <VarRow
              key={v}
              varName={v}
              value={varValues[v] || ""}
              onChange={(e) => setVarValues((p) => ({ ...p, [v]: e.target.value }))}
            />
          ))}
        </>
      )}

      {/* Per-card variables (carousel) */}
      {template.cards?.map((card) => (
        <div key={card.cardIndex}>
          <div className="flex items-center gap-3 mt-5 mb-1">
            <span className="text-[13px] font-semibold text-semantic-text-primary shrink-0">Card {card.cardIndex}</span>
            <div className="flex-1 h-px bg-semantic-border-layout" />
          </div>
          {card.bodyVariables.length > 0 && (
            <>
              <VarSectionLabel>Body variables</VarSectionLabel>
              {card.bodyVariables.map((v) => (
                <VarRow
                  key={v}
                  varName={v}
                  value={cardVarValues[card.cardIndex]?.body?.[v] || ""}
                  onChange={(e) =>
                    setCardVarValues((p) => ({
                      ...p,
                      [card.cardIndex]: {
                        body: { ...(p[card.cardIndex]?.body || {}), [v]: e.target.value },
                        button: p[card.cardIndex]?.button || {},
                      },
                    }))
                  }
                />
              ))}
            </>
          )}
          {card.buttonVariables.length > 0 && (
            <>
              <VarSectionLabel>Button variables</VarSectionLabel>
              {card.buttonVariables.map((v) => (
                <VarRow
                  key={v}
                  varName={v}
                  value={cardVarValues[card.cardIndex]?.button?.[v] || ""}
                  onChange={(e) =>
                    setCardVarValues((p) => ({
                      ...p,
                      [card.cardIndex]: {
                        body: p[card.cardIndex]?.body || {},
                        button: { ...(p[card.cardIndex]?.button || {}), [v]: e.target.value },
                      },
                    }))
                  }
                />
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

function MediaTab({
  template,
  uploadedMedia,
  setUploadedMedia,
}: {
  template: TemplateDef
  uploadedMedia: Record<number, File | null>
  setUploadedMedia: React.Dispatch<React.SetStateAction<Record<number, File | null>>>
}) {
  const cards = template.cards || [{ cardIndex: 1, bodyVariables: [], buttonVariables: [] }]

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      {cards.map((card) => (
        <div key={card.cardIndex} className="mb-5">
          {template.type === "carousel" && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[13px] font-semibold text-semantic-text-primary shrink-0">Card {card.cardIndex}</span>
              <div className="flex-1 h-px bg-semantic-border-layout" />
            </div>
          )}
          {uploadedMedia[card.cardIndex] ? (
            <div className="flex items-center gap-3 px-3 py-2.5 border border-semantic-border-layout rounded">
              <div className="size-10 shrink-0 rounded overflow-hidden bg-semantic-bg-ui flex items-center justify-center">
                <img
                  src={URL.createObjectURL(uploadedMedia[card.cardIndex]!)}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="m-0 text-[13px] font-semibold text-semantic-text-primary truncate">{uploadedMedia[card.cardIndex]!.name}</p>
                <p className="m-0 text-[12px] text-semantic-text-muted">
                  {(uploadedMedia[card.cardIndex]!.size / (1024 * 1024)).toFixed(1)} MB size
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMediaDeleteIndex(card.cardIndex)}
                className="shrink-0 hover:bg-semantic-error-surface text-semantic-error-primary"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 px-4 py-5 border border-dashed border-semantic-border-layout rounded cursor-pointer hover:bg-semantic-bg-hover transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                aria-label={`Upload media for card ${card.cardIndex}`}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setUploadedMedia((p) => ({ ...p, [card.cardIndex]: file }))
                }}
              />
              <div className="flex items-center gap-2 text-[14px] font-semibold text-semantic-text-primary">
                <Upload className="size-4" />
                Upload from device
              </div>
              <p className="m-0 text-[13px] text-semantic-text-muted">or drag and drop file here</p>
              <p className="m-0 text-[11px] text-semantic-text-muted">Supported file types: JPG/PNG with 5 MB size</p>
            </label>
          )}
        </div>
      ))}
    </div>
  )
}

function SelectTemplateModal({ onClose, onSend }: { onClose: () => void; onSend: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDef | null>(null)
  const [activeTab, setActiveTab] = useState<"variables" | "media">("variables")
  const [tabSlideDir, setTabSlideDir] = useState<"left" | "right">("right")
  const [varValues, setVarValues] = useState<VarMap>({})
  const [cardVarValues, setCardVarValues] = useState<CardVarMap>({})
  const [uploadedMedia, setUploadedMedia] = useState<Record<number, File | null>>({})
  const [mediaDeleteIndex, setMediaDeleteIndex] = useState<number | null>(null)

  const handleSelectTemplate = (t: TemplateDef) => {
    setSelectedTemplate(t)
    setVarValues({})
    setCardVarValues({})
    setUploadedMedia({})
    setActiveTab("variables")
  }

  return (
  <>
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent size="xl" className="max-w-[1100px] h-[88vh] max-h-[800px] p-0 gap-0 flex flex-col" hideCloseButton>
        <DialogDescription className="sr-only">Select from pre-approved message templates</DialogDescription>

        {/* ── Header: title + close ── */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-semantic-border-layout shrink-0">
          <div>
            <DialogTitle>Select Template</DialogTitle>
            <p className="text-[13px] text-semantic-text-muted mt-0.5 m-0">Select from pre-approved message templates</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-[18px]" />
          </Button>
        </div>

        {/* ── Body: LEFT (selectors + variables) | RIGHT (preview) ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ── Left column ── */}
          <div className="flex-[1.25] border-r border-semantic-border-layout flex flex-col min-h-0">

            {/* Selectors section */}
            <div className="px-5 pt-5 pb-4 border-b border-semantic-border-layout shrink-0">
              <div className="flex items-start gap-3">
                {/* Category */}
                <div className="w-[160px] shrink-0">
                  <SelectField
                    label="Category"
                    options={templateCategoryOptions.map((c) => ({ value: c.id, label: c.label }))}
                    value={selectedCategory}
                    onValueChange={(v) => {
                      setSelectedCategory(v as TemplateCategory)
                      setSelectedTemplate(null)
                    }}
                  />
                </div>

                {/* Template selector */}
                <div className="flex-1 min-w-0">
                  <SelectField
                    label="Template"
                    required
                    searchable
                    searchPlaceholder="Search templates..."
                    placeholder="Select a template"
                    options={templateList
                      .filter((t) => selectedCategory === "all" || t.category === selectedCategory)
                      .map((t) => ({ value: t.id, label: t.name }))}
                    value={selectedTemplate?.id ?? ""}
                    onValueChange={(id) => {
                      const t = templateList.find((t) => t.id === id)
                      if (t) handleSelectTemplate(t)
                    }}
                  />
                </div>
              </div>
              <p className="m-0 text-[13px] text-semantic-text-muted mt-2">
                Template not found?{" "}
                <button type="button" className="text-semantic-text-link underline font-medium hover:text-semantic-text-link bg-transparent border-none p-0 cursor-pointer text-[13px]" onClick={() => {}}>
                  Create new
                </button>
              </p>
            </div>

            {/* Variables / Media section */}
            {selectedTemplate ? (
              <div className="flex flex-col flex-1 min-h-0">
                {/* Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => {
                    const tab = v as "variables" | "media"
                    setTabSlideDir(tab === "media" ? "right" : "left")
                    setActiveTab(tab)
                  }}
                >
                  <TabsList className="shrink-0 px-5">
                    <TabsTrigger value="variables">Template variables</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div key={activeTab} className={`animate-in ${tabSlideDir === "right" ? "slide-in-from-right-3" : "slide-in-from-left-3"} fade-in duration-200 ease-out flex flex-col flex-1 min-h-0 overflow-hidden`}>
                  {activeTab === "variables" ? (
                    <VariablesTab
                      template={selectedTemplate}
                      varValues={varValues}
                      setVarValues={setVarValues}
                      cardVarValues={cardVarValues}
                      setCardVarValues={setCardVarValues}
                    />
                  ) : (
                    <MediaTab
                      template={selectedTemplate}
                      uploadedMedia={uploadedMedia}
                      setUploadedMedia={setUploadedMedia}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="size-14 rounded-xl bg-semantic-bg-ui flex items-center justify-center">
                  <FileSpreadsheet className="size-7 text-semantic-text-muted" />
                </div>
                <div>
                  <p className="m-0 text-[14px] font-semibold text-semantic-text-secondary">No template selected</p>
                  <p className="m-0 text-[13px] text-semantic-text-muted mt-0.5">Choose a template above to map variables</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Right column: preview + send button ── */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-5 pt-5 pb-3 shrink-0 border-b border-semantic-border-layout flex items-center gap-2">
              <Eye className="size-[14px] text-semantic-text-secondary" />
              <p className="m-0 text-[12px] font-semibold tracking-wide uppercase text-semantic-text-secondary">Preview</p>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 bg-semantic-bg-ui">
              {selectedTemplate ? (
                <div className="w-full flex flex-col items-end">
                  <TemplatePreviewBubble template={selectedTemplate} varValues={varValues} />
                </div>
              ) : (
                <TemplatePreviewEmpty />
              )}
            </div>
            <div className="px-5 py-4 shrink-0 border-t-2 border-semantic-border-layout bg-white shadow-[0_-4px_12px_0_rgba(10,13,18,0.06)]">
              <Button
                onClick={() => { onSend(); onClose() }}
                disabled={!selectedTemplate}
                className="w-full gap-2"
              >
                Send Template
                <Send className="size-[16px]" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <ConfirmationModal
      open={mediaDeleteIndex !== null}
      onOpenChange={(open) => { if (!open) setMediaDeleteIndex(null) }}
      title="Remove uploaded media?"
      description="This media file will be removed from the template."
      variant="destructive"
      confirmButtonText="Remove"
      onConfirm={() => {
        if (mediaDeleteIndex !== null) {
          setUploadedMedia((p) => ({ ...p, [mediaDeleteIndex]: null }))
        }
        setMediaDeleteIndex(null)
      }}
    />
  </>
  )
}

/* ── Contact Details Panel ── */

function ContactDetailsPanel({ name, open, onClose }: { name: string; open: boolean; onClose: () => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(true)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const editFooter = (
    <>
      <Button variant="outline" className="flex-1" onClick={() => setShowDiscardConfirm(true)}>
        Cancel
      </Button>
      <Button className="flex-1" leftIcon={<Check className="size-4" />} onClick={() => setIsEditing(false)}>
        Save Details
      </Button>
    </>
  )

  return (
  <>
    <Panel
      open={open}
      title={isEditing ? "Edit Details" : "Contact Details"}
      onClose={() => { setIsEditing(false); onClose() }}
      footer={isEditing ? editFooter : undefined}
    >
      {isEditing ? (
        /* ── Edit View ── */
        <div key="edit" className="animate-in fade-in duration-200 ease-out">
          {/* Name field */}
          <div className="px-4 py-4 border-b border-semantic-border-layout">
            <TextField
              label="Name"
              required
              defaultValue={name}
              leftIcon={<User className="size-[18px]" />}
              size="sm"
              autoFocus
            />
          </div>

          <Accordion type="multiple" defaultValue={["basic", "custom"]} variant="bordered" className="rounded-none border-x-0">
            {/* Basic Information */}
            <AccordionItem value="basic">
              <AccordionTrigger>
                <span className="text-sm font-semibold text-semantic-text-primary">Basic Information</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4">
                  {/* Phone */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="edit-phone" className="text-sm font-medium text-semantic-text-muted">
                      Phone<span className="text-semantic-error-primary ml-0.5">*</span>
                    </label>
                    <div className="flex items-center border border-semantic-border-layout rounded bg-semantic-bg-ui opacity-60 cursor-not-allowed">
                      <div className="flex items-center gap-1.5 pl-3 pr-2 h-9 shrink-0">
                        <span className="text-sm">🇮🇳</span>
                        <span className="text-sm text-semantic-text-secondary">+91</span>
                      </div>
                      <div className="w-px h-5 bg-semantic-border-layout shrink-0" />
                      <input
                        id="edit-phone"
                        type="tel"
                        defaultValue="98765 43210"
                        disabled
                        aria-required="true"
                        className="flex-1 h-9 px-3 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent min-w-0"
                      />
                    </div>
                  </div>
                  <TextField label="Email" placeholder="Enter Email" size="sm" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-semantic-text-muted">Marketing Opt In</span>
                      <Info className="size-3.5 text-semantic-text-muted shrink-0" />
                    </div>
                    <Switch checked={marketingOptIn} onCheckedChange={setMarketingOptIn} />
                  </div>
                  <TextField label="Source" value="Chat" disabled size="sm" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Custom Fields */}
            <AccordionItem value="custom">
              <AccordionTrigger>
                <span className="text-sm font-semibold text-semantic-text-primary">Custom Fields</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-semantic-text-muted">Tags</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <div className="flex gap-1.5 flex-1 min-w-0">
                            <Tag variant="default" size="sm">VIP Customer</Tag>
                            <Tag variant="default" size="sm">Enterprise</Tag>
                          </div>
                          <ChevronDown className="size-4 shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                        <DropdownMenuItem>VIP Customer</DropdownMenuItem>
                        <DropdownMenuItem>Enterprise</DropdownMenuItem>
                        <DropdownMenuItem>New Lead</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {[
                    { label: "Location", placeholder: "Enter Location" },
                    { label: "Secondary Phone", placeholder: "XXXXX XXXXX" },
                    { label: "DOB", placeholder: "DD / MM / YYYY" },
                  ].map(({ label, placeholder }) => (
                    <TextField key={label} label={label} placeholder={placeholder} size="sm" />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ) : (
        /* ── View Mode (two-column layout) ── */
        <div key="view" className="animate-in fade-in duration-200 ease-out">
          {/* Name + Edit button */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout">
            <span className="text-base font-semibold text-semantic-text-primary">{name}</span>
            <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
              <Pencil className="size-4" />
            </Button>
          </div>

          {/* Basic Information */}
          <div className="px-4 pt-3 pb-2 border-t border-semantic-border-layout">
            <span className="text-[13px] font-semibold text-semantic-text-primary">Basic Information</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center py-2.5 px-4">
              <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">Phone</span>
              <span className="text-sm text-semantic-text-primary flex-1">🇮🇳 +91 98765 43210</span>
            </div>
            <div className="flex items-center py-2.5 px-4">
              <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">Email</span>
              <span className="text-sm text-semantic-text-primary flex-1">email@example.com</span>
            </div>
            <div className="flex items-center py-2.5 px-4">
              <span className="text-sm text-semantic-text-muted w-[120px] shrink-0 flex items-center gap-1">
                Marketing Opt In
                <Info className="size-3.5 text-semantic-text-muted shrink-0" />
              </span>
              <div className="flex-1">
                <Switch checked={marketingOptIn} onCheckedChange={setMarketingOptIn} size="sm" />
              </div>
            </div>
            <div className="flex items-center py-2.5 px-4">
              <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">Source</span>
              <span className="text-sm text-semantic-text-primary flex-1">Chat</span>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="px-4 pt-3 pb-2 border-t border-semantic-border-layout">
            <span className="text-[13px] font-semibold text-semantic-text-primary">Custom Fields</span>
          </div>
          <div className="flex flex-col pb-2 border-b border-semantic-border-layout">
            <div className="flex items-start py-2.5 px-4">
              <span className="text-sm text-semantic-text-muted w-[120px] shrink-0 pt-0.5">Tags</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                <Tag variant="default" size="sm">VIP Customer</Tag>
                <Tag variant="default" size="sm">Enterprise</Tag>
              </div>
            </div>
            <div className="flex items-center py-2.5 px-4">
              <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">Location</span>
              <span className="text-sm text-semantic-text-primary flex-1">XYZ, place</span>
            </div>
            <div className="flex items-center py-2.5 px-4">
              <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">Secondary Phone</span>
              <span className="text-sm text-semantic-text-placeholder flex-1">XXXXX XXXXX</span>
            </div>
            <div className="flex items-center py-2.5 px-4">
              <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">DOB</span>
              <span className="text-sm text-semantic-text-placeholder flex-1">DD / MM / YYYY</span>
            </div>
          </div>
        </div>
      )}
    </Panel>
    <ConfirmationModal
      open={showDiscardConfirm}
      onOpenChange={setShowDiscardConfirm}
      title="Discard changes?"
      description="Your unsaved edits will be lost."
      variant="destructive"
      confirmButtonText="Discard"
      onConfirm={() => {
        setIsEditing(false)
        setShowDiscardConfirm(false)
      }}
    />
  </>
  )
}

/* ── Assignment Dropdown & Resolve Button — extracted to chat-header module ── */

/* ── Composer Attachment Preview ── */

function ComposerAttachmentPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const url = React.useMemo(() => URL.createObjectURL(file), [file])
  const isImage = file.type.startsWith("image/")
  const isVideo = file.type.startsWith("video/")
  const isAudio = file.type.startsWith("audio/")
  const [showConfirm, setShowConfirm] = useState(false)

  React.useEffect(() => {
    return () => URL.revokeObjectURL(url)
  }, [url])

  return (
    <div className="relative border-b border-semantic-border-layout">
      <button
        aria-label="Remove attachment"
        onClick={() => setShowConfirm(true)}
        className="absolute top-2 right-2 z-10 size-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
      >
        <X className="size-4 text-white" />
      </button>
      <ConfirmationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Remove attachment?"
        description={`"${file.name}" will be removed from this message.`}
        variant="destructive"
        confirmButtonText="Remove"
        onConfirm={() => {
          onRemove()
          setShowConfirm(false)
        }}
      />
      {isImage ? (
        <div className="h-[200px] bg-semantic-bg-ui">
          <img src={url} alt={file.name} className="w-full h-full object-cover" />
        </div>
      ) : isVideo ? (
        <div className="relative bg-black h-[200px]">
          <video src={url} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-[56px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Play className="size-7 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>
      ) : isAudio ? (
        <div className="bg-semantic-bg-ui px-4 py-6 flex items-center gap-3 h-[80px]">
          <div className="size-10 rounded-full bg-semantic-primary flex items-center justify-center shrink-0">
            <Play className="size-5 text-white fill-white ml-0.5" />
          </div>
          <div className="flex-1 h-1 bg-semantic-border-layout rounded-full">
            <div className="w-0 h-full bg-semantic-primary rounded-full" />
          </div>
          <span className="text-[12px] text-semantic-text-muted tabular-nums shrink-0">0:00</span>
        </div>
      ) : (
        /* PDF / other document preview */
        <div className="bg-semantic-bg-ui flex flex-col items-center justify-center h-[200px]">
          <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
            <File className="size-8 text-semantic-text-muted" />
          </div>
          <p className="text-[14px] font-semibold text-semantic-text-primary truncate max-w-[80%] px-4 m-0">{file.name}</p>
          <p className="text-[12px] text-semantic-text-muted mt-1 m-0">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
        </div>
      )}
    </div>
  )
}

/* ── Canned Messages Data ── */

const cannedMessages = [
  { id: "cm1", title: "Test", body: "hello {{contact.name}}, how can I help you today?" },
  { id: "cm2", title: "Greeting", body: "👋 Hi there! Thank you for reaching out to MyOperator." },
]

/* ── Helpers ── */

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-semantic-text-primary">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  )
}

/* ── Main App ── */

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("open")
  const [search, setSearch] = useState("")
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showContactDetails, setShowContactDetails] = useState(false)
  const [appliedAssignees, setAppliedAssignees] = useState<Set<string> | null>(null)
  const [appliedChannels, setAppliedChannels] = useState<Set<string> | null>(null)
  const [composerAttachment, setComposerAttachment] = useState<File | null>(null)
  const [replyingTo, setReplyingTo] = useState<{ messageId: string; sender: string; text: string } | null>(null)
  const [composerText, setComposerText] = useState("")
  const [cannedIndex, setCannedIndex] = useState(-1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatAreaRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const openNewChat = () => {
    setShowFilters(false)
    setSearch("")
    setShowNewChat(true)
  }


  const hasActiveFilters = appliedAssignees !== null || appliedChannels !== null

  const filteredChats = chatItems.filter((c) => {
    if (c.tab !== activeTab) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.message.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <TooltipProvider delayDuration={200}>
    <div className="flex h-screen bg-semantic-bg-ui">
      {/* ── Left Panel ── */}
      <nav aria-label="Inbox" className="flex flex-col w-[356px] h-full bg-white shrink-0 border-r border-semantic-border-layout">
        {/* Swappable content area */}
        {showNewChat ? (
          <div key="newchat" className="flex flex-col flex-1 min-h-0 animate-in slide-in-from-right-3 fade-in duration-200">
            <NewChatPanel onBack={() => setShowNewChat(false)} onOpenAddContact={() => setShowAddContact(true)} />
          </div>
        ) : showFilters ? (
          <div key="filters" className="flex flex-col flex-1 min-h-0 animate-in slide-in-from-right-3 fade-in duration-200">
            <FilterPanel
              onClose={() => {
                setShowFilters(false)
                setSearch("")
              }}
              onApply={(assigneeSet, channelSet) => {
                setAppliedAssignees(assigneeSet.size > 0 ? assigneeSet : null)
                setAppliedChannels(channelSet.size > 0 ? channelSet : null)
                setShowFilters(false)
                setSearch("")
              }}
            />
          </div>
        ) : (
          <div key="inbox" className="flex flex-col flex-1 min-h-0 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 h-[72px] shrink-0">
              <h1 className="text-[24px] font-semibold text-semantic-text-primary leading-8">
                Inbox
              </h1>
              <Button
                variant="outline"
                className="h-10"
                leftIcon={<Plus className="size-5" />}
                onClick={openNewChat}
              >
                New Chat
              </Button>
            </div>

            {/* Search + Filter button */}
            <div role="search" aria-label="Search conversations" className="flex gap-2 px-4 shrink-0">
              <TextField
                placeholder="Search conversations"
                aria-label="Search conversations"
                leftIcon={<Search className="size-[18px]" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                clearable
                onClear={() => setSearch("")}
                wrapperClassName="flex-1"
                size="default"
              />
              <Button
                variant="outline"
                size="icon-lg"
                onClick={() => {
                  setShowFilters(true)
                  setSearch("")
                }}
                className={cn("relative", hasActiveFilters && "border-semantic-primary text-semantic-primary")}
              >
                <FilterIcon />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-semantic-border-accent animate-in zoom-in duration-200 ring-1 ring-semantic-border-layout" />
                )}
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
              <TabsList fullWidth className="shrink-0 mt-1">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                    <Badge
                      variant={activeTab === tab.id ? "primary" : "default"}
                      size="sm"
                    >
                      {tab.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Chat List */}
            <div className="sr-only" aria-live="polite">
              {`${filteredChats.length} conversations`}
            </div>
            <div key={activeTab} className="flex-1 overflow-y-auto animate-in fade-in duration-150 ease-out">
              {filteredChats.map((chat) => (
                <div key={chat.id} className="relative">
                  <ChatListItem
                    {...chat}
                    message={search ? highlightMatch(chat.message, search) : chat.message}
                    messageStatus={chat.isFailed ? undefined : chat.messageStatus}
                    isSelected={selectedChatId === chat.id}
                    onClick={() => {
                      setSelectedChatId(chat.id)
                      setShowContactDetails(false)
                      requestAnimationFrame(() => chatAreaRef.current?.focus())
                    }}
                  />
                  {chat.isFailed && (
                    <div className="absolute top-5 right-4">
                      <CircleAlert className="size-4 text-semantic-error-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── Right Panel ── */}
      {selectedChatId ? (() => {
        const selectedChat = chatItems.find((c) => c.id === selectedChatId)!
        const messages = chatMessages[selectedChatId] || []
        return (
          <main className="flex-[1_0_0] min-h-0 min-w-0 flex" ref={chatAreaRef} tabIndex={-1}>
            {/* Chat Window */}
            <div
              className="flex-1 flex flex-col min-w-0 relative"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={(e) => { if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false) }}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                const file = e.dataTransfer.files?.[0]
                if (file) setComposerAttachment(file)
              }}
            >
              <h2 className="sr-only">{selectedChat.name} — Chat</h2>
              <div className="sr-only" aria-live="assertive">
                {isDragging ? "Drop zone active. Release to attach file." : ""}
              </div>
              {/* ── Chat Header ── */}
              <ChatHeader />

              {/* ── Chat Messages Area ── */}
              <div className="flex-1 relative">
              <div key={selectedChatId} className="absolute inset-0 overflow-y-auto bg-semantic-bg-ui px-6 py-4 animate-in fade-in duration-200 ease-out">
                {/* Date Divider */}
                <ChatTimelineDivider className="my-4" aria-label="Today">Today</ChatTimelineDivider>

                {/* Messages */}
                <div className="flex flex-col gap-4">
                  {messages.map((msg, msgIdx) => {
                    // Show unread separator before the last N messages (based on chat's unreadCount)
                    const unreadCount = selectedChat.unreadCount || 0
                    const unreadStartIdx = messages.length - unreadCount
                    const showUnreadSeparator = unreadCount > 0 && msgIdx === unreadStartIdx
                    const hasMedia = msg.type && msg.type !== "text"
                    const mediaCaption = msg.media?.caption
                    const hasText = msg.text || mediaCaption
                    const isDocWithMeta = msg.type === "otherDoc" && msg.media

                    // Media types get different bubble widths
                    const bubbleWidth = msg.type === "carousel"
                      ? "max-w-[466px] w-full"
                      : msg.type === "image" || msg.type === "video" || msg.type === "docPreview" || msg.type === "document" || msg.type === "otherDoc" || msg.type === "loading"
                        ? "max-w-[380px] w-full"
                        : msg.type === "audio"
                          ? "max-w-[340px] w-[340px]"
                          : "max-w-[65%]"

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const replyButton = (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setReplyingTo({ messageId: msg.id, sender: msg.sender === "customer" ? selectedChat.name : (msg.senderName || "Agent"), text: msg.text || msg.media?.caption || "" })}
                              className="opacity-0 group-hover/msg:opacity-100 transition-opacity shrink-0 rounded-full text-semantic-text-muted hover:text-semantic-text-secondary hover:bg-semantic-bg-hover"
                            >
                              <Reply className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="m-0">Reply</p>
                            <TooltipArrow />
                          </TooltipContent>
                        </Tooltip>
                    )

                    // System messages (e.g., assignment actions)
                    if (msg.type === "system") {
                      return (
                        <React.Fragment key={msg.id}>
                          {showUnreadSeparator && (
                            <ChatTimelineDivider variant="unread" aria-label={`${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`}>
                              {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
                            </ChatTimelineDivider>
                          )}
                          <ChatTimelineDivider variant="system">
                            {msg.text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                              part.startsWith("**") ? (
                                <span key={i} className="text-semantic-text-link font-medium">{part.slice(2, -2)}</span>
                              ) : part
                            )}
                          </ChatTimelineDivider>
                        </React.Fragment>
                      )
                    }

                    return (
                      <React.Fragment key={msg.id}>
                      {showUnreadSeparator && (
                        <ChatTimelineDivider variant="unread" aria-label={`${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`}>
                          {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
                        </ChatTimelineDivider>
                      )}
                      <div className={`flex items-start gap-1.5 group/msg ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                      <div
                        id={`msg-${msg.id}`}
                        className={`flex flex-col ${bubbleWidth} ${
                          msg.sender === "agent" ? "items-end" : "items-start"
                        }`}
                      >
                        {msg.senderName && (
                          <span className="text-[12px] text-semantic-text-muted mb-1 px-1">
                            {msg.senderName}
                          </span>
                        )}
                        <div
                          className={`rounded-lg overflow-hidden ${
                            hasMedia ? "" : "px-3 pt-3 pb-1.5"
                          } ${
                            msg.type === "audio" || msg.type === "otherDoc" || msg.type === "carousel" || msg.type === "loading" ? "w-full" : ""
                          } ${
                            msg.sender === "agent"
                              ? "bg-semantic-info-surface border-[0.2px] border-semantic-border-layout text-semantic-text-primary"
                              : "bg-white border-[0.2px] border-semantic-border-layout text-semantic-text-primary shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
                          }`}
                        >
                          {/* Carousel: body text goes ABOVE cards */}
                          {msg.type === "carousel" && hasText && (
                            <div className="px-3 pt-3">
                              <p className="text-[14px] leading-5 m-0">{msg.text || mediaCaption}</p>
                            </div>
                          )}

                          {/* Media area (full-bleed) */}
                          {msg.type === "image" && msg.media && <ImageMedia media={msg.media} />}
                          {msg.type === "video" && msg.media && <VideoMedia media={msg.media} />}
                          {msg.type === "audio" && msg.media && <AudioMedia media={msg.media} />}
                          {msg.type === "docPreview" && msg.media && <DocMedia variant="preview" thumbnailUrl={msg.media.thumbnailUrl || msg.media.url} filename={msg.media.filename} fileType={msg.media.fileType} pageCount={msg.media.pageCount} fileSize={msg.media.fileSize} />}
                          {msg.type === "document" && msg.media && <DocMedia variant="download" thumbnailUrl={msg.media.thumbnailUrl || msg.media.url} filename={msg.media.filename} fileType={msg.media.fileType} pageCount={msg.media.pageCount} fileSize={msg.media.fileSize} />}
                          {msg.type === "otherDoc" && msg.media && <DocMedia variant="file" filename={msg.media.filename} fileType={msg.media.fileType} />}
                          {msg.type === "carousel" && msg.media && <CarouselMedia media={msg.media} />}
                          {msg.type === "loading" && <LoadingMedia error={msg.error} />}

                          {/* Text + footer area (with padding) */}
                          <div className={hasMedia ? `px-3 pb-1.5 ${msg.type === "audio" ? "pt-0" : msg.type === "otherDoc" ? "pt-3 mt-1" : "pt-2"}` : ""}>
                            {msg.replyTo && (
                              <button
                                type="button"
                                className="w-full bg-white border-l-[3px] border-semantic-border-accent rounded-sm px-4 py-1.5 mb-2 h-[56px] flex flex-col justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors text-left border-t-0 border-r-0 border-b-0"
                                aria-label={`Jump to quoted message from ${msg.replyTo.sender}`}
                                onClick={() => {
                                  if (msg.replyTo?.messageId) {
                                    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
                                    const el = document.getElementById(`msg-${msg.replyTo.messageId}`)
                                    if (el) {
                                      el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" })
                                      el.style.outline = "2px solid var(--semantic-border-accent)"
                                      el.style.outlineOffset = "2px"
                                      el.style.transition = "outline-color 0.3s ease-out"
                                      setTimeout(() => {
                                        el.style.outlineColor = "transparent"
                                        setTimeout(() => { el.style.outline = ""; el.style.outlineOffset = ""; el.style.transition = "" }, 300)
                                      }, 1700)
                                    }
                                  }
                                }}
                              >
                                <p className="text-[14px] font-semibold text-semantic-text-primary truncate leading-5 tracking-[0.014px] m-0">
                                  {msg.replyTo.sender}
                                </p>
                                <p className="text-[14px] text-semantic-text-muted truncate m-0">
                                  {msg.replyTo.text}
                                </p>
                              </button>
                            )}
                            {hasText && msg.type !== "carousel" && (
                              <p className="text-[14px] leading-5 m-0">
                                {msg.text || mediaCaption}
                              </p>
                            )}
                            {/* File metadata row for download-type docs */}
                            {isDocWithMeta && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <File className="size-3.5 text-semantic-text-muted" />
                                <span className="text-[13px] text-semantic-text-muted">
                                  {[msg.media!.fileType, msg.media!.pageCount && `${msg.media!.pageCount} pages`, msg.media!.fileSize].filter(Boolean).join(" · ")}
                                </span>
                              </div>
                            )}
                            {/* Delivery footer */}
                            <div className={`flex items-center mt-1.5 ${msg.type === "audio" ? "justify-between" : msg.sender === "agent" ? "justify-end gap-1.5" : "justify-start gap-1.5"}`} style={msg.type === "audio" ? { paddingLeft: 0 } : undefined}>
                              {/* Audio duration on the left */}
                              {msg.type === "audio" && msg.media && (
                                <span className="font-semibold text-semantic-text-muted tabular-nums" style={{ fontSize: 12, letterSpacing: 0.05 }}>{msg.media.duration || "0:00"}</span>
                              )}
                              {/* Delivery status + time */}
                              <div className="flex items-center gap-1.5">
                                {msg.sender === "agent" && msg.status && (
                                  <>
                                    {msg.status === "failed" ? (
                                      <span role="alert" className="inline-flex items-center gap-1.5">
                                        <CircleAlert className="size-4 text-semantic-error-primary shrink-0" />
                                        <span className="text-[13px] text-semantic-error-primary font-medium">Failed</span>
                                        <button
                                          onClick={(e) => { e.stopPropagation() }}
                                          className="text-[13px] font-semibold text-semantic-text-link underline hover:no-underline"
                                        >
                                          Retry
                                        </button>
                                      </span>
                                    ) : (
                                      <>
                                        {msg.status === "sent" ? (
                                          <Check className="size-4 text-semantic-text-muted shrink-0" />
                                        ) : (
                                          <CheckCheck className={`size-4 shrink-0 ${msg.status === "read" ? "text-semantic-text-link" : "text-semantic-text-muted"}`} />
                                        )}
                                        <span style={{ fontSize: 12 }} className="text-semantic-text-muted">
                                          {msg.status === "sent" ? "Sent" : msg.status === "delivered" ? "Delivered" : "Read"}
                                        </span>
                                      </>
                                    )}
                                    <span className="font-semibold text-semantic-text-muted" style={{ fontSize: 10 }}>•</span>
                                  </>
                                )}
                                <span style={{ fontSize: 12 }} className="text-semantic-text-muted">{msg.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Sender indicator for outbound messages */}
                      {msg.sender === "agent" && msg.sentBy && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="self-end mb-1 shrink-0 size-7 rounded-full bg-white border border-semantic-border-layout flex items-center justify-center cursor-default">
                              <SenderIndicatorBadge sentBy={msg.sentBy} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p className="m-0">
                              {msg.sentBy.type === "agent" ? msg.sentBy.name
                                : msg.sentBy.type === "bot" ? (msg.sentBy.name || "Bot")
                                : msg.sentBy.type === "campaign" ? "Campaign"
                                : "API"}
                            </p>
                            <TooltipArrow />
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {msg.sender === "customer" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setReplyingTo({ messageId: msg.id, sender: selectedChat.name, text: msg.text || msg.media?.caption || "" })}
                                className="opacity-0 group-hover/msg:opacity-100 transition-opacity shrink-0 rounded-full text-semantic-text-muted hover:text-semantic-text-secondary hover:bg-semantic-bg-hover"
                              >
                                <Reply className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="m-0">Reply</p>
                              <TooltipArrow />
                            </TooltipContent>
                          </Tooltip>
                      )}
                      </div>
                    </React.Fragment>
                    )
                  })}
                </div>
              </div>

              {/* Scroll to bottom button */}
              <Button variant="outline" size="icon-lg" aria-label={(selectedChat.unreadCount || 0) > 0 ? `Scroll to bottom, ${selectedChat.unreadCount} unread messages` : "Scroll to bottom"} className="absolute bottom-4 left-1/2 -translate-x-1/2 shadow-md bg-white">
                <ArrowDown className="size-5" />
                {(selectedChat.unreadCount || 0) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center size-5 rounded-full bg-semantic-border-accent text-white text-[11px] font-semibold">
                    {selectedChat.unreadCount}
                  </span>
                )}
              </Button>
              {/* New messages live region */}
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {messages.length > 0 ? `${messages[messages.length - 1].sender === 'customer' ? selectedChat.name : 'Agent'}: ${messages[messages.length - 1].text || 'sent media'}` : ''}
              </div>
              </div>

              {/* ── Message Input Area ── */}
              <div className="relative">
                {/* Canned message count live region */}
                <div className="sr-only" aria-live="polite">
                  {composerText.startsWith("/") ? `${cannedMessages.filter(cm => cm.title.toLowerCase().includes(composerText.slice(1).toLowerCase()) || cm.body.toLowerCase().includes(composerText.slice(1).toLowerCase())).length} canned message${cannedMessages.filter(cm => cm.title.toLowerCase().includes(composerText.slice(1).toLowerCase()) || cm.body.toLowerCase().includes(composerText.slice(1).toLowerCase())).length !== 1 ? "s" : ""} found` : ""}
                </div>
                {/* Canned messages dropdown (above composer) */}
                {composerText.startsWith("/") && !(selectedChat.isWindowExpired || selectedChat.tab === "resolved") && (() => {
                  const query = composerText.slice(1).toLowerCase()
                  const filtered = cannedMessages.filter(cm =>
                    cm.title.toLowerCase().includes(query) || cm.body.toLowerCase().includes(query)
                  )
                  if (filtered.length === 0) {
                    return (
                      <div className="absolute bottom-full left-4 right-4 mb-1 bg-semantic-bg-primary rounded-lg shadow-[0px_4px_16px_0px_rgba(10,13,18,0.15)] border border-semantic-border-layout overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2 duration-150 ease-out">
                        <div className="px-4 py-3 text-[13px] text-semantic-text-muted text-center">
                          No canned messages found
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div id="canned-listbox" role="listbox" aria-label="Canned messages" className="absolute bottom-full left-4 right-4 mb-1 bg-semantic-bg-primary rounded-lg shadow-[0px_4px_16px_0px_rgba(10,13,18,0.15)] border border-semantic-border-layout overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2 duration-150 ease-out">
                      {filtered.map((cm, i) => (
                        <button
                          type="button"
                          role="option"
                          id={`canned-${cm.id}`}
                          aria-selected={cannedIndex === i}
                          key={cm.id}
                          className={`px-4 py-3 hover:bg-semantic-bg-ui cursor-pointer transition-colors text-left w-full ${cannedIndex === i ? "bg-semantic-bg-ui" : ""} ${i < filtered.length - 1 ? "border-b border-semantic-border-layout" : ""}`}
                          onClick={() => { setComposerText(cm.body); setCannedIndex(-1) }}
                        >
                          <p className="text-[13px] font-semibold text-semantic-text-primary m-0">{cm.title}</p>
                          <p className="text-[13px] text-semantic-text-muted truncate m-0 mt-0.5">{cm.body}</p>
                        </button>
                      ))}
                    </div>
                  )
                })()}

                <ChatComposer
                  sendLabel={<><Send className="size-4" />Send</>}
                  expired={selectedChat.isWindowExpired || selectedChat.tab === "resolved"}
                  expiredMessage={`${selectedChat.tab === "resolved" ? "This chat is closed." : "This chat has expired."} Send a template to continue.`}
                  onTemplateClick={() => setShowTemplateModal(true)}
                  value={composerText}
                  onChange={(val) => { setComposerText(val); setCannedIndex(-1) }}
                  onSend={() => {
                    setComposerText("")
                    setComposerAttachment(null)
                    setReplyingTo(null)
                    setCannedIndex(-1)
                  }}
                  onKeyDown={(e) => {
                    // Enter to send (when not in canned menu)
                    if (e.key === "Enter" && !e.shiftKey && !composerText.startsWith("/")) {
                      e.preventDefault()
                      if (composerText.trim()) {
                        setComposerText("")
                        setComposerAttachment(null)
                        setReplyingTo(null)
                      }
                      return
                    }
                    // Canned message keyboard navigation
                    if (composerText.startsWith("/")) {
                      const query = composerText.slice(1).toLowerCase()
                      const filtered = cannedMessages.filter(cm =>
                        cm.title.toLowerCase().includes(query) || cm.body.toLowerCase().includes(query)
                      )
                      if (filtered.length === 0) return
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setCannedIndex((prev) => (prev + 1) % filtered.length)
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault()
                        setCannedIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1))
                      } else if (e.key === "Enter" && cannedIndex >= 0 && cannedIndex < filtered.length) {
                        e.preventDefault()
                        setComposerText(filtered[cannedIndex].body)
                        setCannedIndex(-1)
                      } else if (e.key === "Escape") {
                        e.preventDefault()
                        setComposerText("")
                        setCannedIndex(-1)
                      }
                    }
                  }}
                  placeholder="Type '/' for canned message"
                  reply={replyingTo ? {
                    sender: replyingTo.sender,
                    message: replyingTo.text,
                    messageId: replyingTo.messageId,
                  } : undefined}
                  onDismissReply={() => setReplyingTo(null)}
                  onReplyClick={() => {
                    if (replyingTo) {
                      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
                      const el = document.getElementById(`msg-${replyingTo.messageId}`)
                      if (el) {
                        el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" })
                        el.classList.add("ring-2", "ring-semantic-border-accent", "ring-offset-2")
                        setTimeout(() => el.classList.remove("ring-2", "ring-semantic-border-accent", "ring-offset-2"), 2000)
                      }
                    }
                  }}
                  attachment={composerAttachment ? (
                    <ComposerAttachmentPreview
                      file={composerAttachment}
                      onRemove={() => setComposerAttachment(null)}
                    />
                  ) : undefined}
                  leftActions={
                    <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <Paperclip className="size-[18px]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="top" align="start">
                            <DropdownMenuLabel>Attach Media</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => { if (fileInputRef.current) { fileInputRef.current.accept = "image/*"; fileInputRef.current.click() } }}>
                              <LucideImage className="size-4" /> Image
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => { if (fileInputRef.current) { fileInputRef.current.accept = "video/*"; fileInputRef.current.click() } }}>
                              <Play className="size-4" /> Video
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => { if (fileInputRef.current) { fileInputRef.current.accept = "audio/*"; fileInputRef.current.click() } }}>
                              <Music className="size-4" /> Audio
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => { if (fileInputRef.current) { fileInputRef.current.accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"; fileInputRef.current.click() } }}>
                              <FileText className="size-4" /> Document
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm" onClick={() => setShowTemplateModal(true)}>
                              <LayoutGrid className="size-[18px]" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="m-0">Templates</p>
                            <TooltipArrow />
                          </TooltipContent>
                        </Tooltip>
                    </>
                  }
                  rightActions={
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <Smile className="size-[18px]" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="m-0">Emoji</p>
                          <TooltipArrow />
                        </TooltipContent>
                      </Tooltip>
                  }
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setComposerAttachment(file)
                    e.target.value = ""
                  }}
                />
              </div>

              {/* Drag & drop overlay */}
              {isDragging && (
                <div role="region" aria-label="Drop zone — drop file to attach" className="absolute inset-0 z-50 bg-semantic-primary/5 backdrop-blur-[1px] flex items-center justify-center border-2 border-dashed border-semantic-primary rounded-lg animate-in fade-in duration-200 ease-out">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="size-10 text-semantic-primary" />
                    <span className="text-[16px] font-semibold text-semantic-primary">Drop file to attach</span>
                    <span className="text-[13px] text-semantic-text-muted">Images, videos, documents</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Contact Details Panel ── */}
            <ContactDetailsPanel
              name={selectedChat.name}
              open={showContactDetails}
              onClose={() => setShowContactDetails(false)}
            />

            {/* ── Right Sidebar ── */}
            <aside aria-label="Actions" className="w-[56px] bg-white border-l border-semantic-border-layout flex flex-col items-center py-2 gap-4 shrink-0">
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Contact details"
                onClick={() => setShowContactDetails(!showContactDetails)}
                className={cn("transition-colors duration-200", showContactDetails && "bg-semantic-bg-hover text-semantic-primary")}
              >
                <User className="size-6" />
              </Button>
            </aside>
          </main>
        )
      })() : (
        <div className="flex-[1_0_0] min-h-0 min-w-0 bg-semantic-bg-ui shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] flex flex-col items-center justify-center p-4">
          {showNewChat ? (
            /* Empty state when New Chat panel is open */
            <div className="flex flex-col items-center gap-5 w-[300px] shrink-0">
              <div className="size-[100px] shrink-0 rounded-full bg-white border border-semantic-border-layout flex items-center justify-center shadow-sm">
                <MessageSquare className="size-12 text-semantic-text-muted" />
              </div>
              <div className="flex flex-col items-center gap-[6px]">
                <h2 className="text-[24px] font-semibold text-semantic-text-primary leading-8">
                  Start New Conversation
                </h2>
                <p className="text-[16px] text-semantic-text-muted text-center m-0">
                  Select a contact or add new contact.
                </p>
              </div>
              <Button
                className="w-full h-12"
                leftIcon={<Plus className="w-6 h-6" />}
                onClick={() => setShowAddContact(true)}
              >
                Add New Contact
              </Button>
            </div>
          ) : (
            /* Default empty state */
            <div className="flex flex-col items-center gap-5 w-[276px] shrink-0">
              <div className="size-[100px] shrink-0 rounded-full bg-white border border-semantic-border-layout flex items-center justify-center shadow-sm">
                <MessageSquare className="size-12 text-semantic-text-muted" />
              </div>
              <div className="flex flex-col items-center gap-[6px]">
                <h2 className="text-[24px] font-semibold text-semantic-text-primary leading-8">
                  No conversation selected
                </h2>
                <p className="text-[16px] text-semantic-text-muted text-center m-0">
                  Select a chat from inbox or start new chat
                </p>
              </div>
              <Button
                className="w-full h-12"
                leftIcon={<Plus className="w-6 h-6" />}
                onClick={openNewChat}
              >
                Start New Chat
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Add New Contact Modal ── */}
      {showAddContact && (
        <AddNewContactModal
          defaultChannel={channels[0]}
          onClose={() => setShowAddContact(false)}
        />
      )}

      {/* ── Select Template Modal ── */}
      {showTemplateModal && (
        <SelectTemplateModal
          onClose={() => setShowTemplateModal(false)}
          onSend={() => setShowTemplateModal(false)}
        />
      )}
    </div>
    </TooltipProvider>
  )
}
