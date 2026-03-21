import React, { useState, useRef } from "react"
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
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChatListItem } from "@/components/custom/chat-list-item"
import {
  Search,
  Plus,
  ArrowDownUp,
  ChevronDown,
  Check,
  Users,
  Radio,
  Clock,
  User,
  Keyboard,
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
  ArrowDownToLine,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Reply,
  Loader2,
  File,
  ArrowLeft,
  UserPlus,
  X,
  Trash2,
  Upload,
  Eye,
  Pencil,
  Info,
} from "lucide-react"
import noConversationImg from "./assets/no-conversation.png"
import noTemplateSelectedImg from "./assets/no-template-selected.svg"

/* ── Custom Icons ── */

const FilterIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#343e55"
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
type SortOption = "newest" | "urgent" | "unread"

const tabs: { id: Tab; label: string; count: number }[] = [
  { id: "open", label: "Open", count: 10 },
  { id: "assigned", label: "Assigned", count: 2 },
  { id: "resolved", label: "Resolved", count: 5 },
]

const sortOptions: { id: SortOption; label: string }[] = [
  { id: "newest", label: "Newest First" },
  { id: "urgent", label: "Urgent First" },
  { id: "unread", label: "Unread First" },
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
    messageStatus: "delivered" as const,
    channel: "MY01",
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

type ChatMessage = {
  id: string
  text: string
  time: string
  sender: "customer" | "agent"
  senderName?: string
  type?: "text" | "image" | "video" | "audio" | "document" | "docPreview" | "carousel" | "otherDoc" | "loading"
  status?: "sent" | "delivered" | "read"
  replyTo?: { sender: string; text: string }
  media?: MediaPayload
  error?: string
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

const SPEED_OPTIONS = [1, 1.5, 2, 3] as const

function VideoMedia({ media }: { media: MediaPayload }) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(0)
  const speed = SPEED_OPTIONS[speedIdx]
  return (
    <div className="relative rounded-t overflow-hidden cursor-pointer group" onClick={() => setPlaying(!playing)}>
      <img
        src={media.thumbnailUrl || media.url}
        alt="Video thumbnail"
        className="w-full object-cover"
        style={{ aspectRatio: "16/10" }}
      />
      {/* Gradient overlay — stronger for visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d12]/70 via-[#0a0d12]/10 to-transparent" />
      {/* Center play/pause — visible on hover or when paused */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
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
            <div className="absolute left-0 top-0 h-full w-[15%] rounded-full bg-white" />
            <div className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-white shadow-md" style={{ left: "15%" }} />
          </div>
        </div>
        {/* Controls row */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-white tabular-nums">{media.duration || "0:00"}</span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={(e) => { e.stopPropagation(); setSpeedIdx((speedIdx + 1) % SPEED_OPTIONS.length) }}
              className="text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors px-2 py-0.5 rounded-full"
            >{speed}x</button>
            <button onClick={(e) => { e.stopPropagation(); setMuted(!muted) }} className="hover:opacity-70 transition-opacity">
              {muted ? <VolumeX className="size-4 text-white/50" /> : <Volume2 className="size-4 text-white" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); setFullscreen(!fullscreen) }} className="hover:opacity-70 transition-opacity">
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
  const [speedIdx, setSpeedIdx] = useState(0)
  const speed = SPEED_OPTIONS[speedIdx]

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
          onClick={(e) => { e.stopPropagation(); setPlaying(!playing) }}
          className="shrink-0 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
          style={{ width: 40, height: 40, backgroundColor: "#343e55" }}
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
                fill={i < playedBars ? "#27ABB8" : "#C0C3CA"}
              />
            ))}
          </svg>
        </div>

        {/* Speed pill — cycles through 1x → 1.5x → 2x → 3x */}
        <button
          onClick={(e) => { e.stopPropagation(); setSpeedIdx((speedIdx + 1) % SPEED_OPTIONS.length) }}
          className="shrink-0 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
          style={{ minWidth: 34, height: 22, backgroundColor: "rgba(65,70,81,0.6)", padding: "0 8px" }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: "white", lineHeight: 1 }}>{speed}x</span>
        </button>
      </div>
    </div>
  )
}

function DocPreviewMedia({ media }: { media: MediaPayload }) {
  return (
    <div className="relative rounded-t overflow-hidden">
      <img
        src={media.thumbnailUrl || media.url}
        alt={media.filename || "Document preview"}
        className="w-full object-cover"
        style={{ aspectRatio: "442/308" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1d222f] via-[#343e55]/30 to-transparent" />
      {/* Bottom overlay bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
        <p className="text-[14px] font-semibold text-white truncate">{media.filename || "Document"}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <File className="size-3.5 text-white/80" />
          <span className="text-[12px] text-white/80">
            {[media.fileType, media.pageCount && `${media.pageCount} pages`, media.fileSize].filter(Boolean).join("  ·  ")}
          </span>
        </div>
      </div>
    </div>
  )
}

function DocDownloadMedia({ media }: { media: MediaPayload }) {
  return (
    <div className="relative rounded-t overflow-hidden">
      <img
        src={media.thumbnailUrl || media.url}
        alt={media.filename || "Document"}
        className="w-full object-cover"
        style={{ aspectRatio: "442/308" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1d222f] via-[#343e55]/30 to-transparent" />
      {/* Bottom overlay bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between">
        <p className="text-[14px] font-semibold text-white truncate flex-1">{media.filename || "Document"}</p>
        <button className="size-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 ml-2 hover:bg-white/30 transition-colors">
          <ArrowDownToLine className="size-4 text-white" />
        </button>
      </div>
    </div>
  )
}

function OtherDocMedia({ media }: { media: MediaPayload }) {
  const isSpreadsheet = media.fileType === "XLS" || media.fileType === "XLSX"
  const accent = isSpreadsheet ? "#217346" : "#535862"
  const accentLight = isSpreadsheet ? "#dcfae6" : "#e9eaeb"
  const label = media.fileType || "FILE"
  return (
    <div className="mx-2.5 mt-2.5 rounded overflow-hidden border border-[#d5d7da]">
      {/* Preview area */}
      <div className="bg-[#f5f5f5] flex items-center justify-center w-full" style={{ padding: "36px 0" }}>
        <div className="flex flex-col items-center">
          <div className="rounded-2xl flex items-center justify-center" style={{ width: 72, height: 72, backgroundColor: accentLight }}>
            <FileSpreadsheet style={{ width: 32, height: 32, color: accent }} />
          </div>
          <div className="mt-2.5 rounded-full px-3 py-0.5" style={{ backgroundColor: accent }}>
            <span className="text-[11px] font-bold text-white tracking-wide">{label}</span>
          </div>
        </div>
      </div>
      {/* Filename bar */}
      <div className="bg-[#e9eaeb] flex items-center gap-2" style={{ padding: "12px 16px" }}>
        <span className="text-[14px] font-semibold text-[#343e55] truncate flex-1 tracking-[0.1px]">{media.filename || "File"}</span>
        <button className="shrink-0 size-8 rounded-full flex items-center justify-center hover:bg-[#d5d7da] transition-colors">
          <ArrowDownToLine className="size-[18px] text-[#535862]" />
        </button>
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
      <div ref={scrollRef} onScroll={updateScrollState} className="flex gap-3 overflow-x-auto px-3 pt-2 pb-3" style={{ scrollbarWidth: "none" }}>
        {media.images?.map((img, i) => (
          <div key={i} className="shrink-0 bg-white rounded border border-[#e9eaeb] overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]" style={{ width: 260 }}>
            {/* Card image */}
            <img
              src={img.url}
              alt={img.title}
              className="w-full object-cover"
              style={{ height: 200 }}
            />
            {/* Card title */}
            <div className="px-3 pt-2.5 pb-2">
              <p className="text-[14px] font-semibold text-[#181d27] line-clamp-2">{img.title}</p>
            </div>
            {/* Card buttons */}
            {img.buttons?.map((btn, j) => (
              <button
                key={j}
                className="flex items-center justify-center gap-2 w-full border-t border-[#e9eaeb] text-[13px] font-semibold text-[#343e55] hover:bg-[#fafafa] transition-colors"
                style={{ height: 40 }}
              >
                {btn.icon === "reply" && <Reply className="size-4" />}
                {btn.icon === "link" && <ExternalLink className="size-4" />}
                {btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      {/* Navigation arrows — show/hide based on scroll position */}
      {canScrollLeft && (
        <button onClick={scroll("left")} className="absolute left-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center cursor-pointer hover:bg-[#fafafa] transition-colors">
          <ChevronLeft className="size-4 text-[#343e55]" />
        </button>
      )}
      {canScrollRight && (
        <button onClick={scroll("right")} className="absolute right-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center cursor-pointer hover:bg-[#fafafa] transition-colors">
          <ChevronRight className="size-4 text-[#343e55]" />
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
        <Loader2 className="size-[60px] text-[#717680] opacity-40 animate-spin" />
      </div>
      {/* Error banner */}
      {error && (
        <div className="border-t border-[#fecdca] bg-[#fef3f2] px-4 py-3">
          <p className="text-[14px] leading-5 text-[#b42318]">
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
    { id: "m2", text: "Sure, I'd be happy to help!", time: "2:16 PM", sender: "agent", senderName: "Alex Smith", status: "read", replyTo: { sender: "Aditi Kumar", text: "Hi, I need help with my account settings" } },
    // Image
    { id: "m3", text: "", time: "2:18 PM", sender: "customer", type: "image", media: { url: "https://picsum.photos/seed/chat1/683/546", caption: "Here is a screenshot of the issue I'm facing" } },
    // Audio (both directions)
    { id: "m4", text: "", time: "2:20 PM", sender: "customer", type: "audio", media: { url: "#", duration: "0:10" } },
    { id: "m5", text: "", time: "2:21 PM", sender: "agent", senderName: "Alex Smith", status: "delivered", type: "audio", media: { url: "#", duration: "1:35" } },
    // Video
    { id: "m6", text: "", time: "2:23 PM", sender: "agent", senderName: "Alex Smith", status: "delivered", type: "video", media: { url: "https://picsum.photos/seed/vid1/683/400", thumbnailUrl: "https://picsum.photos/seed/vid1/683/400", duration: "3:45", caption: "WhatsApp API Setup Tutorial" } },
    // Document preview (PDF)
    { id: "m7", text: "", time: "2:25 PM", sender: "agent", senderName: "Alex Smith", status: "read", type: "docPreview", media: { url: "https://picsum.photos/seed/doc1/442/308", thumbnailUrl: "https://picsum.photos/seed/doc1/442/308", filename: "Project_Proposal_2025.pdf", fileType: "PDF", pageCount: 46, fileSize: "5MB" } },
    // Document with download
    { id: "m8", text: "", time: "2:27 PM", sender: "customer", type: "document", media: { url: "https://picsum.photos/seed/doc2/442/308", thumbnailUrl: "https://picsum.photos/seed/doc2/442/308", filename: "Monthly_Report_Feb.pdf", fileType: "PDF", pageCount: 12, fileSize: "3.1MB" } },
    // Other doc (XLS)
    { id: "m9", text: "Have a look at this document", time: "2:28 PM", sender: "customer", type: "otherDoc", media: { url: "#", filename: "Order_Data_Q4.xlsx", fileType: "XLS", pageCount: 46, fileSize: "2.3MB" } },
    // Carousel
    { id: "m10", text: "Check out our latest products!", time: "2:29 PM", sender: "agent", senderName: "Alex Smith", status: "delivered", type: "carousel", media: { url: "#", images: [
      { url: "https://picsum.photos/seed/c1/300/240", title: "Product Catalog 2025", buttons: [{ label: "View Details", icon: "link" }, { label: "Share", icon: "reply" }] },
      { url: "https://picsum.photos/seed/c2/300/240", title: "New Arrivals Collection", buttons: [{ label: "Shop Now", icon: "link" }] },
      { url: "https://picsum.photos/seed/c3/300/240", title: "Special Offers & Deals", buttons: [{ label: "Learn More", icon: "link" }, { label: "Share", icon: "reply" }] },
    ] } },
    // Loading / Error
    { id: "m11", text: "", time: "2:30 PM", sender: "agent", senderName: "Alex Smith", status: "sent", type: "loading", error: "Template message could not be delivered. The message template has been rejected." },
  ],
  "2": [
    { id: "m1", text: "Hello, I'd like to know about your enterprise plans", time: "2:10 PM", sender: "customer" },
    { id: "m2", text: "Welcome! I'll share our enterprise pricing details with you.", time: "2:15 PM", sender: "agent", status: "read" },
    { id: "m3", text: "", time: "2:20 PM", sender: "customer", type: "audio", media: { url: "#", duration: "0:10" } },
    { id: "m4", text: "", time: "2:22 PM", sender: "agent", status: "delivered", type: "audio", media: { url: "#", duration: "1:35" } },
    { id: "m5", text: "Authentication message sent", time: "2:29 PM", sender: "agent", status: "read" },
  ],
  "3": [
    { id: "m1", text: "Can you help me set up the API integration?", time: "1:45 PM", sender: "customer" },
    { id: "m2", text: "Of course! Here's a quick video tutorial.", time: "1:50 PM", sender: "agent", status: "delivered" },
    { id: "m3", text: "", time: "1:52 PM", sender: "agent", status: "delivered", type: "video", media: { url: "https://picsum.photos/seed/vid1/683/400", thumbnailUrl: "https://picsum.photos/seed/vid1/683/400", duration: "3:45", caption: "WhatsApp API Setup Tutorial" } },
    { id: "m4", text: "The WhatsApp Business API", time: "2:00 PM", sender: "customer" },
    { id: "m5", text: "Authentication message sent", time: "2:29 PM", sender: "agent", status: "sent" },
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
    { id: "m2", text: "Sure, here's the PDF.", time: "Yesterday", sender: "agent", status: "read" },
    { id: "m3", text: "", time: "Yesterday", sender: "agent", status: "read", type: "docPreview", media: { url: "https://picsum.photos/seed/doc1/442/308", thumbnailUrl: "https://picsum.photos/seed/doc1/442/308", filename: "Project_Proposal_2025.pdf", fileType: "PDF", pageCount: 46, fileSize: "5MB" } },
  ],
  "6": [
    { id: "m1", text: "We get many food delivery orders. Can we set up an automated response for those?", time: "Yesterday", sender: "customer" },
    { id: "m2", text: "Here's the order data from last quarter", time: "Yesterday", sender: "customer", type: "otherDoc", media: { url: "#", filename: "Order_Data_Q4.xlsx", fileType: "XLS", pageCount: 12, fileSize: "2.3MB" } },
    { id: "m3", text: "", time: "Yesterday", sender: "agent", status: "sent", type: "loading", error: "Template message could not be delivered. The message template has been rejected." },
  ],
  "7": [
    { id: "m1", text: "I am super excited!", time: "Saturday", sender: "customer" },
    { id: "m2", text: "Here's the report you requested!", time: "Saturday", sender: "agent", status: "delivered" },
    { id: "m3", text: "", time: "Saturday", sender: "agent", status: "delivered", type: "document", media: { url: "https://picsum.photos/seed/doc2/442/308", thumbnailUrl: "https://picsum.photos/seed/doc2/442/308", filename: "Monthly_Report_Feb.pdf", fileType: "PDF", pageCount: 12, fileSize: "3.1MB" } },
  ],
}

/* ── New Chat Contact Data ── */

type Contact = {
  id: string
  name: string
  phone: string
}

const contacts: Contact[] = [
  { id: "c1", name: "Aditi Kumar", phone: "+91 98765 43210" },
  { id: "c2", name: "Arsh Raj", phone: "+91 91234 56789" },
  { id: "c3", name: "Deepika Patel", phone: "+91 87654 32109" },
  { id: "c4", name: "Jane Doe", phone: "+91 76543 21098" },
  { id: "c5", name: "Kavita Nair", phone: "+91 65432 10987" },
  { id: "c6", name: "Mohit Kumar", phone: "+91 99887 76655" },
  { id: "c7", name: "Neha Gupta", phone: "+91 88776 65544" },
  { id: "c8", name: "Nitin Rajput", phone: "+91 77665 54433" },
  { id: "c9", name: "Priya Sharma", phone: "+91 66554 43322" },
  { id: "c10", name: "Rahul Verma", phone: "+91 55443 32211" },
  { id: "c11", name: "Rohit Gupta", phone: "+91 44332 21100" },
  { id: "c12", name: "Sam Lee", phone: "+91 93300 11122" },
  { id: "c13", name: "Sushmit", phone: "+91 92200 33344" },
  { id: "c14", name: "Sushant Arya", phone: "+91 91100 55566" },
  { id: "c15", name: "Vikram Singh", phone: "+91 90000 77788" },
]

function getInitials(name: string) {
  const parts = name.trim().split(" ")
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

/* ── New Chat Panel ── */

function NewChatPanel({
  onBack,
}: {
  onBack: () => void
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
      <div className="flex items-center justify-between px-3 py-3 border-b border-[#e9eaeb] shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center justify-center size-8 rounded hover:bg-[#f5f5f5] transition-colors text-[#343e55]"
          >
            <ArrowLeft className="size-5" />
          </button>
          <span className="text-[16px] font-semibold text-[#181d27]">New Chat</span>
        </div>

        {/* Channel selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 h-8 px-2.5 border border-[#d5d7da] rounded bg-white hover:bg-[#fafafa] transition-colors">
              <span className="text-[13px] font-semibold text-[#181d27]">
                {selectedChannel.badge}
              </span>
              <ChevronDown className="size-4 text-[#717680]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px]">
            {channels.map((ch) => (
              <DropdownMenuItem
                key={ch.id}
                onClick={() => setSelectedChannel(ch)}
                className="flex items-center justify-between text-[13px] cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-[#181d27]">{ch.name}</span>
                  <span className="text-[#717680] text-[12px]">{ch.phone}</span>
                </div>
                {selectedChannel.id === ch.id && (
                  <Check className="size-4 text-[#181d27] shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search row */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#e9eaeb] shrink-0">
        <div className="flex-1 flex items-center gap-2 h-9 px-3 border border-[#d5d7da] rounded-lg bg-white focus-within:border-[#27abb8] transition-colors">
          <Search className="size-4 text-[#a4a7ae] shrink-0" />
          <input
            type="text"
            placeholder="Search contacts"
            value={contactSearch}
            onChange={(e) => setContactSearch(e.target.value)}
            className="flex-1 text-[13px] text-[#181d27] placeholder:text-[#a4a7ae] outline-none bg-transparent"
          />
        </div>
        <button className="flex items-center justify-center size-9 border border-[#d5d7da] rounded-lg bg-white hover:bg-[#fafafa] transition-colors text-[#343e55] shrink-0">
          <UserPlus className="size-4" />
        </button>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-[13px] text-[#a4a7ae]">
            No contacts found
          </div>
        ) : (
          filtered.map((contact, i) => (
            <div
              key={contact.id}
              className={`flex items-center gap-3 px-3 py-3 hover:bg-[#fafafa] cursor-pointer transition-colors ${
                i < filtered.length - 1 ? "border-b border-[#e9eaeb]" : ""
              }`}
            >
              {/* Avatar */}
              <div className="size-9 rounded-full bg-[#e9eaeb] flex items-center justify-center shrink-0">
                <span className="text-[12px] font-semibold text-[#535862]">
                  {getInitials(contact.name)}
                </span>
              </div>
              {/* Info */}
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-medium text-[#181d27] leading-5 truncate">
                  {contact.name}
                </span>
                <span className="text-[12px] text-[#717680]">{contact.phone}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ── Filter Panel Content (renders below the search bar) ── */

function FilterContent({
  filterSearch,
  onClose,
  onApply,
}: {
  filterSearch: string
  onClose: () => void
  onApply: (assignees: Set<string>, channels: Set<string>) => void
}) {
  const [selectedAssignees, setSelectedAssignees] = useState<Set<string>>(
    () => new Set(["all", "unassigned", "ivr-voice-bot", "alex-smith", "jane-doe"])
  )
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(
    () => new Set(["my01"])
  )

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
    <>
      {/* Filter header bar (replaces tabs) */}
      <div className="flex items-center h-10 px-4 border-b border-[#e9eaeb] shrink-0">
        <span className="text-[14px] font-semibold text-[#181d27] flex-1">
          Filters
        </span>
        <button
          onClick={() => {
            setSelectedAssignees(new Set())
            setSelectedChannels(new Set())
          }}
          className="text-[12px] font-semibold text-[#717680] hover:text-[#343e55] transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Scrollable filter sections */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* ── Assignment Section ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="size-4 text-[#717680]" />
            <span className="text-[13px] font-semibold text-[#181d27] flex-1">
              Assignment
            </span>
            <span className="text-[12px] text-[#717680] tabular-nums">
              {selectedAssignees.size}/{assignees.length}
            </span>
            <button
              onClick={() => setSelectedAssignees(new Set())}
              className="text-[12px] font-semibold text-[#717680] hover:text-[#343e55] ml-1"
            >
              Clear All
            </button>
          </div>

          <div className="border border-[#e9eaeb] rounded-lg overflow-hidden">
            {topLevel.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#fafafa] cursor-pointer transition-colors border-b border-[#e9eaeb]"
              >
                <Checkbox
                  size="sm"
                  checked={selectedAssignees.has(item.id)}
                  onCheckedChange={() => toggleAssignee(item.id)}
                />
                <span className="text-[14px] text-[#181d27]">{item.label}</span>
              </label>
            ))}

            {filteredBots.length > 0 && (
              <>
                <div className="px-3 py-2 bg-[#f5f5f5] border-b border-[#e9eaeb]">
                  <span className="text-[13px] font-semibold text-[#535862]">
                    Bots ({bots.length})
                  </span>
                </div>
                {filteredBots.map((bot) => (
                  <label
                    key={bot.id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#fafafa] cursor-pointer transition-colors border-b border-[#e9eaeb]"
                  >
                    <Checkbox
                      size="sm"
                      checked={selectedAssignees.has(bot.id)}
                      onCheckedChange={() => toggleAssignee(bot.id)}
                    />
                    <span className="text-[14px] text-[#181d27]">{bot.label}</span>
                  </label>
                ))}
              </>
            )}

            {filteredAgents.length > 0 && (
              <>
                <div className="px-3 py-2 bg-[#f5f5f5] border-b border-[#e9eaeb]">
                  <span className="text-[13px] font-semibold text-[#535862]">
                    Agents ({agents.length})
                  </span>
                </div>
                {filteredAgents.map((agent, i) => (
                  <label
                    key={agent.id}
                    className={`flex items-center gap-3 px-3 py-2.5 hover:bg-[#fafafa] cursor-pointer transition-colors ${
                      i < filteredAgents.length - 1 ? "border-b border-[#e9eaeb]" : ""
                    }`}
                  >
                    <Checkbox
                      size="sm"
                      checked={selectedAssignees.has(agent.id)}
                      onCheckedChange={() => toggleAssignee(agent.id)}
                    />
                    <span className="text-[14px] text-[#181d27]">{agent.label}</span>
                  </label>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── Channels Section ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="size-4 text-[#717680]" />
            <span className="text-[13px] font-semibold text-[#181d27] flex-1">
              Channels
            </span>
            <span className="text-[12px] text-[#717680] tabular-nums">
              {selectedChannels.size}/{channels.length}
            </span>
            <button
              onClick={() => setSelectedChannels(new Set())}
              className="text-[12px] font-semibold text-[#717680] hover:text-[#343e55] ml-1"
            >
              Clear All
            </button>
          </div>

          <div className="border border-[#e9eaeb] rounded-lg overflow-hidden">
            {filteredChannels.map((ch, i) => (
              <label
                key={ch.id}
                className={`flex items-center gap-3 px-3 py-2.5 hover:bg-[#fafafa] cursor-pointer transition-colors ${
                  i < filteredChannels.length - 1 ? "border-b border-[#e9eaeb]" : ""
                }`}
              >
                <Checkbox
                  size="sm"
                  checked={selectedChannels.has(ch.id)}
                  onCheckedChange={() => toggleChannel(ch.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-[#181d27] truncate">
                      {ch.name}
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold text-[#717680] bg-[#f0f0f0] px-1.5 py-0.5 rounded">
                      {ch.badge}
                    </span>
                  </div>
                  <span className="text-[13px] text-[#a2a6b1]">{ch.phone}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-[#e9eaeb] px-4 py-3">
        <p className="text-[13px] text-[#a2a6b1] mb-3 text-center">
          Maximum selections allowed per category: 50
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-10 border-[#c0c3ca] text-[14px] text-[#343e55]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-10 bg-[#343e55] text-white text-[14px] font-semibold hover:bg-[#2a3245]"
            onClick={() => onApply(selectedAssignees, selectedChannels)}
          >
            Apply
          </Button>
        </div>
      </div>
    </>
  )
}

/* ── Select Template Modal ── */

function resolveVars(text: string, vars: VarMap): React.ReactNode {
  const parts = text.split(/(\{\{[^}]+\}\})/g)
  return parts.map((part, i) =>
    /^\{\{[^}]+\}\}$/.test(part) ? (
      <span key={i} className="text-[#4A90D9] font-medium">{vars[part] || part}</span>
    ) : (
      part
    )
  )
}

function TemplatePreviewEmpty() {
  return (
    <div className="flex flex-col items-center gap-5 pt-20 pb-8 px-6">
      <img src={noTemplateSelectedImg} alt="" className="size-[140px]" />
      <p className="m-0 text-[18px] font-semibold text-[#181d27]">No template selected</p>
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
    <div className="bg-semantic-info-surface border border-[#e9eaeb] rounded overflow-hidden w-full max-w-[360px]">
      {/* Body text */}
      <div className="px-3 pt-3">
        <p className="text-[14px] leading-5 text-[#181d27] m-0">{resolveVars(template.body, varValues)}</p>
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
                className="shrink-0 bg-white rounded border border-[#e9eaeb] overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]"
                style={{ width: 260 }}
              >
                {imgUrl ? (
                  <img src={imgUrl} alt={`Card ${card.cardIndex}`} className="w-full object-cover" style={{ height: 200 }} />
                ) : (
                  <div className="w-full bg-[#f5f5f5] flex items-center justify-center" style={{ height: 200 }}>
                    <FileSpreadsheet className="size-10 text-[#c0c3ca]" />
                  </div>
                )}
                <div className="px-3 pt-2.5 pb-2">
                  <p className="text-[14px] font-semibold text-[#181d27] m-0">
                    {card.bodyVariables.length > 0
                      ? resolveVars(card.bodyVariables[0], varValues)
                      : `Card ${card.cardIndex}`}
                  </p>
                  {card.bodyVariables.slice(1).map((v) => (
                    <p key={v} className="text-[13px] text-[#717680] m-0 mt-0.5">{resolveVars(v, varValues)}</p>
                  ))}
                </div>
                {card.buttonVariables.map((v, j) => (
                  <button
                    key={j}
                    className="flex items-center justify-center gap-2 w-full border-t border-[#e9eaeb] text-[13px] font-semibold text-[#343e55] hover:bg-[#fafafa] transition-colors"
                    style={{ height: 40 }}
                  >
                    <ExternalLink className="size-4" />
                    {resolveVars(v, varValues) || "View details"}
                  </button>
                ))}
                {card.buttonVariables.length === 0 && (
                  <button
                    className="flex items-center justify-center gap-2 w-full border-t border-[#e9eaeb] text-[13px] font-semibold text-[#343e55] hover:bg-[#fafafa] transition-colors"
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
          <button onClick={scroll("left")} className="absolute left-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center hover:bg-[#fafafa] transition-colors">
            <ChevronLeft className="size-4 text-[#343e55]" />
          </button>
        )}
        {canScrollRight && (
          <button onClick={scroll("right")} className="absolute right-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center hover:bg-[#fafafa] transition-colors">
            <ChevronRight className="size-4 text-[#343e55]" />
          </button>
        )}
      </div>

      {/* Footer + delivery */}
      <div className="px-3 pb-2">
        {template.footer && (
          <p className="text-[12px] text-[#717680] m-0 mb-1">{template.footer}</p>
        )}
        <DeliveryRow />
      </div>
    </div>
  )
}

function TemplatePreviewBubble({ template, varValues }: { template: TemplateDef; varValues: VarMap }) {
  const DeliveryRow = () => (
    <div className="flex items-center justify-end gap-1.5 mt-1.5">
      <CheckCheck className="size-4 text-[#717680]" />
      <span className="text-[12px] text-[#717680]">Delivered</span>
      <span className="text-[10px] font-bold text-[#717680]">•</span>
      <span className="text-[12px] text-[#717680]">2:30 PM</span>
      <span className="size-6 rounded-full bg-[#343e55] text-white text-[10px] font-bold flex items-center justify-center shrink-0">AS</span>
    </div>
  )

  if (template.type === "text") {
    return (
      <div className="bg-[#ECF1FB] rounded-lg px-3 pt-3 pb-2 max-w-[280px] w-full">
        <p className="text-[14px] leading-[1.4] text-[#181d27]">{resolveVars(template.body, varValues)}</p>
        {template.button && (
          <div className="border-t border-[#c5d5f0] mt-2 pt-2 flex items-center justify-center gap-1.5 text-[#343e55] text-[13px] font-semibold">
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
      <div className="bg-[#ECF1FB] rounded-lg overflow-hidden max-w-[280px] w-full">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=560&h=320&fit=crop"
          alt="Template image"
          className="w-full h-[160px] object-cover"
        />
        <div className="px-3 pt-2.5 pb-2">
          <p className="text-[14px] leading-[1.4] text-[#181d27]">{resolveVars(template.body, varValues)}</p>
          {template.button && (
            <div className="border-t border-[#c5d5f0] mt-2 pt-2 flex items-center justify-center gap-1.5 text-[#343e55] text-[13px] font-semibold">
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
      <span className="text-[13px] text-[#535862] w-[148px] shrink-0 truncate font-mono">{varName}</span>
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
    <p className="text-[11px] font-semibold text-[#a2a6b1] uppercase tracking-[0.4px] mt-4 mb-1">{children}</p>
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
        <p className="text-[14px] font-semibold text-[#535862]">No variables</p>
        <p className="text-[13px] text-[#a2a6b1]">This template has no dynamic variables to fill in.</p>
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
            <span className="text-[13px] font-semibold text-[#181d27] shrink-0">Card {card.cardIndex}</span>
            <div className="flex-1 h-px bg-[#e9eaeb]" />
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
              <span className="text-[13px] font-semibold text-[#1a1a1a] shrink-0">Card {card.cardIndex}</span>
              <div className="flex-1 h-px bg-[#e9eaeb]" />
            </div>
          )}
          {uploadedMedia[card.cardIndex] ? (
            <div className="flex items-center gap-3 px-3 py-2.5 border border-[#e9eaeb] rounded">
              <div className="size-10 shrink-0 rounded overflow-hidden bg-[#f5f5f5] flex items-center justify-center">
                <img
                  src={URL.createObjectURL(uploadedMedia[card.cardIndex]!)}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#181d27] truncate">{uploadedMedia[card.cardIndex]!.name}</p>
                <p className="text-[12px] text-[#717680]">
                  {(uploadedMedia[card.cardIndex]!.size / (1024 * 1024)).toFixed(1)} MB size
                </p>
              </div>
              <button
                onClick={() => setUploadedMedia((p) => ({ ...p, [card.cardIndex]: null }))}
                className="shrink-0 p-1.5 rounded hover:bg-[#fef3f2] text-[#f04438] transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 px-4 py-5 border border-dashed border-[#d5d7da] rounded cursor-pointer hover:bg-[#fafafa] transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setUploadedMedia((p) => ({ ...p, [card.cardIndex]: file }))
                }}
              />
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#343e55]">
                <Upload className="size-4" />
                Upload from device
              </div>
              <p className="text-[13px] text-[#717680]">or drag and drop file here</p>
              <p className="text-[11px] text-[#a2a6b1]">Supported file types: JPG/PNG with 5 MB size</p>
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

  const handleSelectTemplate = (t: TemplateDef) => {
    setSelectedTemplate(t)
    setVarValues({})
    setCardVarValues({})
    setUploadedMedia({})
    setActiveTab("variables")
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl w-full max-w-[1100px] flex flex-col shadow-[0px_24px_48px_-12px_rgba(10,13,18,0.25)]" style={{ height: "88vh", maxHeight: 800 }}>

        {/* ── Header: title + close ── */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#e9eaeb] shrink-0">
          <div>
            <h2 className="text-[18px] font-semibold text-[#181d27] leading-6">Select Template</h2>
            <p className="text-[13px] text-[#717680] mt-0.5">Select from pre-approved message templates</p>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-md hover:bg-[#f5f5f5] text-[#717680] hover:text-[#343e55] transition-colors mt-0.5"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* ── Body: LEFT (selectors + variables) | RIGHT (preview) ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ── Left column ── */}
          <div className="flex-[1.25] border-r border-[#e9eaeb] flex flex-col min-h-0 overflow-y-auto">

            {/* Selectors section */}
            <div className="px-5 pt-5 pb-4 border-b border-[#e9eaeb] shrink-0">
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
              <p className="text-[13px] text-[#717680] mt-2">
                Template not found?{" "}
                <a href="#" className="text-[#4A90D9] underline font-medium hover:text-[#4275D6]" onClick={(e) => e.preventDefault()}>
                  Create new
                </a>
              </p>
            </div>

            {/* Variables / Media section */}
            {selectedTemplate ? (
              <div className="flex flex-col flex-1 min-h-0">
                {/* Tabs */}
                <div className="shrink-0 border-b border-[#e9eaeb]">
                  <div className="flex px-5">
                    {(["variables", "media"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => { setTabSlideDir(tab === "media" ? "right" : "left"); setActiveTab(tab) }}
                        className={`py-3 px-3 mr-4 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                          activeTab === tab
                            ? "text-[#343e55] border-[#343e55]"
                            : "text-[#a2a6b1] border-transparent hover:text-[#717680]"
                        }`}
                      >
                        {tab === "variables" ? "Template variables" : "Media"}
                      </button>
                    ))}
                  </div>
                </div>
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
                <div className="size-14 rounded-xl bg-[#f5f5f5] flex items-center justify-center">
                  <FileSpreadsheet className="size-7 text-[#c0c3ca]" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#535862]">No template selected</p>
                  <p className="text-[13px] text-[#a2a6b1] mt-0.5">Choose a template above to map variables</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Right column: preview + send button ── */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-5 pt-5 pb-3 shrink-0 border-b border-[#e9eaeb] flex items-center gap-2">
              <Eye className="size-[14px] text-[#535862]" />
              <p className="m-0 text-[12px] font-semibold tracking-wide uppercase text-[#535862]">Preview</p>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 bg-[#f5f5f5]">
              {selectedTemplate ? (
                <div className="w-full flex flex-col items-end">
                  <TemplatePreviewBubble template={selectedTemplate} varValues={varValues} />
                </div>
              ) : (
                <TemplatePreviewEmpty />
              )}
            </div>
            <div className="px-5 py-4 shrink-0 border-t-2 border-[#e9eaeb] bg-white shadow-[0_-4px_12px_0_rgba(10,13,18,0.06)]">
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
      </div>
    </div>
  )
}

/* ── Contact Details Panel ── */

function ContactDetailsPanel({ name, open, onClose }: { name: string; open: boolean; onClose: () => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [basicExpanded, setBasicExpanded] = useState(true)
  const [customExpanded, setCustomExpanded] = useState(true)
  const [marketingOptIn, setMarketingOptIn] = useState(true)

  const fieldClass = "flex-1 h-10 border border-[#e9eaeb] rounded px-3 text-[14px] text-[#181d27] placeholder:text-[#a2a6b1] bg-white focus:outline-none focus:border-[#343e55]"
  const labelClass = "w-[120px] shrink-0 text-[14px] font-semibold text-[#717680]"

  return (
    <div
      className={`border-l border-[#e9eaeb] bg-white flex flex-col overflow-hidden transition-all duration-300 ease-in-out shrink-0 ${open ? "w-[320px]" : "w-0 border-l-0"}`}
    >
    <div className="w-[320px] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-[72px] border-b border-[#e9eaeb] shrink-0">
        <span className="flex-1 text-[18px] font-semibold text-[#343e55]">
          {isEditing ? "Edit Details" : "Contact Details"}
        </span>
        <button
          onClick={() => { setIsEditing(false); onClose() }}
          className="size-6 flex items-center justify-center text-[#717680] hover:text-[#181d27] transition-colors"
        >
          <X className="size-5" />
        </button>
      </div>

      {isEditing ? (
        /* ── Edit View ── */
        <>
          <div className="flex-1 overflow-y-auto">
            {/* Name field */}
            <div className="px-4 py-4 border-b border-[#e9eaeb]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#181d27]">
                  Name<span className="text-[#b42318] ml-0.5">*</span>
                </label>
                <div className="flex items-center h-10 border border-[#27abb8] rounded px-3 gap-2 bg-white focus-within:border-[#343e55]">
                  <User className="size-[18px] text-[#a2a6b1] shrink-0" />
                  <input
                    defaultValue={name}
                    className="flex-1 text-[14px] text-[#343e55] bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="border-b border-[#e9eaeb]">
              <button
                onClick={() => setBasicExpanded(!basicExpanded)}
                className="flex items-center justify-between w-full px-4 py-3"
              >
                <span className="text-[12px] font-semibold text-[#343e55]">Basic Information</span>
                <ChevronDown className={`size-4 text-[#343e55] transition-transform duration-200 ${basicExpanded ? "" : "-rotate-90"}`} />
              </button>
              {basicExpanded && (
                <div className="flex flex-col gap-4 px-4 pb-4">
                  {/* Phone */}
                  <div className="flex gap-4 items-center">
                    <span className={labelClass}>
                      Phone<span className="text-[#b42318] ml-0.5">*</span>
                    </span>
                    <div className="flex flex-1 gap-2">
                      <button className="flex items-center gap-1.5 h-10 px-2.5 border border-[#e9eaeb] rounded bg-[#f5f5f5] text-[12px] text-[#717680] shrink-0">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </button>
                      <input
                        defaultValue="98765 43210"
                        className="flex-1 h-10 border border-[#e9eaeb] rounded px-3 text-[14px] text-[#a2a6b1] bg-[#f5f5f5] outline-none min-w-0"
                      />
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex gap-4 items-center">
                    <span className={labelClass}>Email</span>
                    <input placeholder="Enter Email" className={fieldClass} />
                  </div>
                  {/* Marketing Opt In */}
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-1 w-[120px] shrink-0">
                      <span className="text-[14px] font-semibold text-[#717680]">Marketing Opt In</span>
                      <Info className="size-[14px] text-[#a2a6b1] shrink-0" />
                    </div>
                    <Switch checked={marketingOptIn} onCheckedChange={setMarketingOptIn} />
                  </div>
                </div>
              )}
            </div>

            {/* Custom Fields */}
            <div className="border-b border-[#e9eaeb]">
              <button
                onClick={() => setCustomExpanded(!customExpanded)}
                className="flex items-center justify-between w-full px-4 py-3"
              >
                <span className="text-[12px] font-semibold text-[#343e55]">Custom Fields</span>
                <ChevronDown className={`size-4 text-[#343e55] transition-transform duration-200 ${customExpanded ? "" : "-rotate-90"}`} />
              </button>
              {customExpanded && (
                <div className="flex flex-col gap-4 px-4 pb-4">
                  {/* Tags */}
                  <div className="flex gap-4 items-center">
                    <span className={labelClass}>Tags</span>
                    <button className="flex-1 h-10 border border-[#e9eaeb] rounded px-3 flex items-center justify-between text-[14px] text-[#a2a6b1] bg-white">
                      <span>Select options</span>
                      <ChevronDown className="size-4 shrink-0" />
                    </button>
                  </div>
                  {[
                    { label: "Location", placeholder: "Enter Location" },
                    { label: "Secondary Phone", placeholder: "XXXXX XXXXX" },
                    { label: "DOB", placeholder: "DD / MM / YYYY" },
                  ].map(({ label, placeholder }) => (
                    <div key={label} className="flex gap-4 items-center">
                      <span className={labelClass}>{label}</span>
                      <input placeholder={placeholder} className={fieldClass} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-4 py-4 shrink-0 border-t border-[#e9eaeb]">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 h-10 border border-[#d5d7da] rounded text-[14px] font-semibold text-[#343e55] bg-white hover:bg-[#f5f5f5] transition-colors shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 h-10 rounded text-[14px] font-semibold text-white bg-[#343e55] hover:bg-[#2a3245] transition-colors flex items-center justify-center gap-2 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            >
              <Check className="size-4" />
              Save Details
            </button>
          </div>
        </>
      ) : (
        /* ── View Mode ── */
        <div className="flex-1 overflow-y-auto">
          {/* Name + Edit button */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#e9eaeb]">
            <span className="text-[16px] font-semibold text-[#181d27]">{name}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="size-10 flex items-center justify-center border border-[#d5d7da] rounded shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:bg-[#f5f5f5] transition-colors text-[#343e55]"
            >
              <Pencil className="size-[18px]" />
            </button>
          </div>

          {/* Basic Information */}
          <div className="border-b border-[#e9eaeb]">
            <button
              onClick={() => setBasicExpanded(!basicExpanded)}
              className="flex items-center justify-between w-full px-4 py-3"
            >
              <span className="text-[12px] font-semibold tracking-[0.06px] text-[#343e55] uppercase">Basic Information</span>
              <ChevronDown className={`size-[16px] text-[#343e55] transition-transform duration-200 ${basicExpanded ? "" : "-rotate-90"}`} />
            </button>
            {basicExpanded && (
              <div className="flex flex-col gap-4 px-4 pb-4">
                <div className="flex gap-6 items-center">
                  <span className="w-[120px] shrink-0 text-[14px] font-semibold text-[#717680]">Phone</span>
                  <span className="text-[14px] text-[#181d27] flex items-center gap-1.5">
                    +91 98765 43210 <span>🇮🇳</span>
                  </span>
                </div>
                <div className="flex gap-6 items-center">
                  <span className="w-[120px] shrink-0 text-[14px] font-semibold text-[#717680]">Email</span>
                  <span className="text-[14px] text-[#181d27]">email@example.com</span>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="flex items-center gap-1 w-[120px] shrink-0">
                    <span className="text-[14px] font-semibold text-[#717680]">Marketing Opt In</span>
                    <Info className="size-[14px] text-[#a2a6b1] shrink-0" />
                  </div>
                  <Switch checked={marketingOptIn} onCheckedChange={setMarketingOptIn} />
                </div>
              </div>
            )}
          </div>

          {/* Custom Fields */}
          <div className="border-b border-[#e9eaeb]">
            <button
              onClick={() => setCustomExpanded(!customExpanded)}
              className="flex items-center justify-between w-full px-4 py-3"
            >
              <span className="text-[12px] font-semibold tracking-[0.06px] text-[#343e55] uppercase">Custom Fields</span>
              <ChevronDown className={`size-[16px] text-[#343e55] transition-transform duration-200 ${customExpanded ? "" : "-rotate-90"}`} />
            </button>
            {customExpanded && (
              <div className="flex flex-col gap-4 px-4 pb-4">
                <div className="flex gap-4 items-center">
                  <span className="w-[120px] shrink-0 text-[14px] font-semibold text-[#717680]">Tags</span>
                  <div className="flex-1 border border-[#e9eaeb] rounded px-3 py-2 flex items-center gap-2">
                    <span className="bg-[#f5f5f5] text-[12px] text-[#181d27] px-2 py-0.5 rounded flex items-center gap-1">
                      New
                      <button className="text-[#a2a6b1] hover:text-[#343e55] transition-colors">
                        <X className="size-[10px]" />
                      </button>
                    </span>
                  </div>
                </div>
                {[
                  { label: "Location", value: "XYZ, place" },
                  { label: "Secondary Phone", value: "XXXXX XXXXX" },
                  { label: "DOB", value: "DD/MM/YYYY" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-6 items-start">
                    <span className="w-[120px] shrink-0 text-[14px] font-semibold text-[#717680]">{label}</span>
                    <span className="text-[14px] text-[#181d27]">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

/* ── Main App ── */

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("open")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showContactDetails, setShowContactDetails] = useState(false)
  const [appliedAssignees, setAppliedAssignees] = useState<Set<string> | null>(null)
  const [appliedChannels, setAppliedChannels] = useState<Set<string> | null>(null)

  const openNewChat = () => {
    setShowFilters(false)
    setSearch("")
    setShowNewChat(true)
  }

  const activeSortLabel = sortOptions.find((o) => o.id === sortBy)?.label

  const hasActiveFilters = appliedAssignees !== null || appliedChannels !== null

  return (
    <div className="flex h-screen bg-[#e9eaeb]">
      {/* ── Left Panel ── */}
      <div className="flex flex-col w-[356px] h-full bg-white shrink-0 border-r border-[#d0d3db]">
        {/* Swappable content area */}
        {showNewChat ? (
          <NewChatPanel onBack={() => setShowNewChat(false)} />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 h-[72px] shrink-0">
              <h1 className="text-[24px] font-semibold text-[#181d27] leading-8">
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
            <div className="flex gap-2 px-4 shrink-0">
              <TextField
                placeholder={showFilters ? "Search filters..." : "Search conversations"}
                leftIcon={<Search className="size-[18px]" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                wrapperClassName="flex-1"
              />
              <Button
                variant="outline"
                size="icon-lg"
                onClick={() => {
                  setShowFilters(!showFilters)
                  setSearch("")
                }}
                className={showFilters || hasActiveFilters ? "bg-[#f0f0f0]" : ""}
              >
                <FilterIcon />
              </Button>
            </div>
          </>
        )}

        {/* Filter / chat list area */}
        {!showNewChat && (showFilters ? (
          <FilterContent
            filterSearch={search}
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
        ) : (
          <>
            {/* Tabs */}
            <div className="flex items-end border-b border-[#e9eaeb] shrink-0 w-full mt-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 h-10 px-4 py-2 text-[14px] font-semibold tracking-[0.1px] leading-5 transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? "text-[#343e55] border-[#343e55]"
                      : "text-[#717680] border-transparent hover:text-[#535862]"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`shrink-0 inline-flex items-center justify-center rounded-full font-semibold transition-colors ${
                      activeTab === tab.id ? "bg-[#343e55] text-white" : "bg-[#EBECEE] text-[#414651]"
                    }`}
                    style={{ width: 20, height: 20, fontSize: 12, lineHeight: 1 }}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort Bar with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-[10px] h-[44px] pl-4 py-3 bg-[#fafafa] border-b border-[#e9eaeb] shrink-0 w-full cursor-pointer hover:bg-[#f0f0f0] transition-colors">
                  <ArrowDownUp className="size-[18px] text-[#343e55] shrink-0" />
                  <span className="text-[12px] font-semibold text-[#343e55] tracking-[0.5px] shrink-0">
                    Sort by:
                  </span>
                  <span className="flex-1 text-[12px] font-semibold text-[#343e55] tracking-[0.5px] text-left">
                    {activeSortLabel}
                  </span>
                  <ChevronDown className="size-5 text-[#717680] shrink-0 mr-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[356px]">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className="flex items-center justify-between text-[13px] cursor-pointer text-[#343e55]"
                  >
                    {option.label}
                    {sortBy === option.id && (
                      <Check className="size-4 text-[#181d27]" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {chatItems.filter((c) => c.tab === activeTab).map((chat) => (
                <ChatListItem
                  key={chat.id}
                  {...chat}
                  isSelected={selectedChatId === chat.id}
                  onClick={() => { setSelectedChatId(chat.id); setShowContactDetails(false) }}
                />
              ))}
            </div>
          </>
        ))}
      </div>

      {/* ── Right Panel ── */}
      {selectedChatId ? (() => {
        const selectedChat = chatItems.find((c) => c.id === selectedChatId)!
        const messages = chatMessages[selectedChatId] || []
        return (
          <div className="flex-[1_0_0] min-h-0 min-w-0 flex">
            {/* Chat Window */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* ── Chat Header ── */}
              <div className="flex items-center justify-between px-4 h-[72px] bg-white border-b border-[#e9eaeb] shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-[18px] font-semibold text-[#181d27]">
                    {selectedChat.name}
                  </span>
                  {selectedChat.slaTimer && (
                    <div className="flex items-center gap-2 bg-[#fffaeb] rounded px-1.5 py-0.5">
                      <Clock className="size-3 text-[#b54708]" />
                      <span className="text-[12px] text-[#b54708]">
                        {selectedChat.slaTimer}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {/* Assignment Dropdown */}
                  <Select defaultValue={selectedChat.agentName || "unassigned"}>
                    <SelectTrigger className="w-[160px] h-10">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {assignees
                        .filter((a) => a.type === "agent" || a.type === "bot")
                        .map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {/* Resolve Button */}
                  <Button
                    className="h-10 bg-[#343e55] text-white text-[14px] font-semibold tracking-[0.014px] hover:bg-[#2a3245] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
                    leftIcon={<Check className="size-[18px]" />}
                  >
                    Resolve
                  </Button>
                </div>
              </div>

              {/* ── Chat Messages Area ── */}
              <div className="flex-1 overflow-y-auto bg-[#f5f5f5] px-6 py-4">
                {/* Date Divider */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-[#e9eaeb]" />
                  <span className="text-[12px] text-[#717680] shrink-0">Today</span>
                  <div className="flex-1 h-px bg-[#e9eaeb]" />
                </div>

                {/* Messages */}
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => {
                    const hasMedia = msg.type && msg.type !== "text"
                    const mediaCaption = msg.media?.caption
                    const hasText = msg.text || mediaCaption
                    const isDocWithMeta = (msg.type === "document" || msg.type === "otherDoc") && msg.media

                    // Media types get different bubble widths
                    const bubbleWidth = msg.type === "carousel"
                      ? "max-w-[466px] w-full"
                      : msg.type === "image" || msg.type === "video" || msg.type === "docPreview" || msg.type === "document" || msg.type === "otherDoc" || msg.type === "loading"
                        ? "max-w-[380px] w-full"
                        : msg.type === "audio"
                          ? "max-w-[340px] w-[340px]"
                          : "max-w-[65%]"

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${bubbleWidth} ${
                          msg.sender === "agent" ? "self-end items-end" : "self-start items-start"
                        }`}
                      >
                        {msg.senderName && (
                          <span className="text-[12px] text-[#717680] mb-1 px-1">
                            {msg.senderName}
                          </span>
                        )}
                        <div
                          className={`rounded overflow-hidden ${
                            hasMedia ? "" : "px-3 pt-3 pb-1.5"
                          } ${
                            msg.type === "audio" || msg.type === "otherDoc" || msg.type === "carousel" || msg.type === "loading" ? "w-full" : ""
                          } ${
                            msg.sender === "agent"
                              ? "bg-semantic-info-surface border-[0.2px] border-[#e9eaeb] text-[#181d27]"
                              : "bg-white border-[0.2px] border-[#e9eaeb] text-[#181d27] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
                          }`}
                        >
                          {/* Carousel: body text goes ABOVE cards */}
                          {msg.type === "carousel" && hasText && (
                            <div className="px-3 pt-3">
                              <p className="text-[14px] leading-5">{msg.text || mediaCaption}</p>
                            </div>
                          )}

                          {/* Media area (full-bleed) */}
                          {msg.type === "image" && msg.media && <ImageMedia media={msg.media} />}
                          {msg.type === "video" && msg.media && <VideoMedia media={msg.media} />}
                          {msg.type === "audio" && msg.media && <AudioMedia media={msg.media} />}
                          {msg.type === "docPreview" && msg.media && <DocPreviewMedia media={msg.media} />}
                          {msg.type === "document" && msg.media && <DocDownloadMedia media={msg.media} />}
                          {msg.type === "otherDoc" && msg.media && <OtherDocMedia media={msg.media} />}
                          {msg.type === "carousel" && msg.media && <CarouselMedia media={msg.media} />}
                          {msg.type === "loading" && <LoadingMedia error={msg.error} />}

                          {/* Text + footer area (with padding) */}
                          <div className={hasMedia ? `px-3 pb-1.5 ${msg.type === "audio" ? "pt-0" : msg.type === "otherDoc" || msg.type === "document" ? "pt-3 mt-1" : "pt-2"}` : ""}>
                            {msg.replyTo && (
                              <div className="w-full bg-[#f5f5f5] border-l-[3px] border-[#4275D6] rounded-sm px-4 py-1.5 mb-2 h-[56px] flex flex-col justify-center">
                                <p className="text-[14px] font-semibold text-[#343e55] truncate leading-5 tracking-[0.014px]">
                                  {msg.replyTo.sender}
                                </p>
                                <p className="text-[14px] text-[#717680] truncate">
                                  {msg.replyTo.text}
                                </p>
                              </div>
                            )}
                            {hasText && msg.type !== "carousel" && (
                              <p className="text-[14px] leading-5">
                                {msg.text || mediaCaption}
                              </p>
                            )}
                            {/* File metadata row for download-type docs */}
                            {isDocWithMeta && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <File className="size-3.5 text-[#717680]" />
                                <span className="text-[13px] text-[#717680]">
                                  {[msg.media!.fileType, msg.media!.pageCount && `${msg.media!.pageCount} pages`, msg.media!.fileSize].filter(Boolean).join(" · ")}
                                </span>
                              </div>
                            )}
                            {/* Delivery footer */}
                            <div className={`flex items-center mt-1.5 ${msg.type === "audio" ? "justify-between" : msg.sender === "agent" ? "justify-end gap-1.5" : "justify-start gap-1.5"}`} style={msg.type === "audio" ? { paddingLeft: 0 } : undefined}>
                              {/* Audio duration on the left */}
                              {msg.type === "audio" && msg.media && (
                                <span className="font-semibold text-[#717680] tabular-nums" style={{ fontSize: 12, letterSpacing: 0.05 }}>{msg.media.duration || "0:00"}</span>
                              )}
                              {/* Delivery status + time */}
                              <div className="flex items-center gap-1.5">
                                {msg.sender === "agent" && msg.status && (
                                  <>
                                    {msg.status === "sent" ? (
                                      <Check className="size-4 text-[#717680] shrink-0" />
                                    ) : (
                                      <CheckCheck className={`size-4 shrink-0 ${msg.status === "read" ? "text-[#4275D6]" : "text-[#717680]"}`} />
                                    )}
                                    <span style={{ fontSize: 12 }} className="text-[#717680]">
                                      {msg.status === "sent" ? "Sent" : msg.status === "delivered" ? "Delivered" : "Read"}
                                    </span>
                                    <span className="font-semibold text-[#717680]" style={{ fontSize: 10 }}>•</span>
                                  </>
                                )}
                                <span style={{ fontSize: 12 }} className="text-[#717680]">{msg.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── Message Input Area ── */}
              {selectedChat.isWindowExpired ? (
                <div className="shrink-0 bg-[#f5f5f5] p-4">
                  <div className="bg-white rounded shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_0px_rgba(10,13,18,0.06)] px-4 py-3 flex items-center justify-center gap-4">
                    <span className="text-[14px] text-[#717680]">
                      Send a template to continue.
                    </span>
                    <button
                      className="bg-[#343e55] text-white h-9 px-4 rounded text-[14px] font-semibold flex items-center justify-center hover:bg-[#2a3245] transition-colors shrink-0 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
                      onClick={() => setShowTemplateModal(true)}
                    >
                      Select Template
                    </button>
                  </div>
                </div>
              ) : (
                <div className="shrink-0 bg-white border-t border-[#e9eaeb] px-4 py-3">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 flex items-end border border-[#d5d7da] rounded-lg bg-white focus-within:border-[#27abb8] focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)] transition-all">
                      <textarea
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 resize-none px-3 py-2.5 text-[14px] text-[#181d27] placeholder:text-[#a4a7ae] outline-none bg-transparent min-h-[40px] max-h-[120px]"
                      />
                      <div className="flex items-center gap-1 px-2 py-2">
                        <button className="p-1 rounded hover:bg-[#f5f5f5] transition-colors text-[#717680]">
                          <Paperclip className="size-[18px]" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#f5f5f5] transition-colors text-[#717680]">
                          <Smile className="size-[18px]" />
                        </button>
                      </div>
                    </div>
                    <button className="flex items-center justify-center size-10 rounded-lg bg-[#343e55] text-white hover:bg-[#2a3245] transition-colors shrink-0">
                      <Send className="size-[18px]" />
                    </button>
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
            <div className="w-[56px] bg-white border-l border-[#e9eaeb] flex flex-col items-center py-2 gap-4 shrink-0">
              <button
                onClick={() => setShowContactDetails(!showContactDetails)}
                className={`flex items-center justify-center size-[48px] rounded transition-colors ${showContactDetails ? "bg-[#f0f0f0] text-[#181d27]" : "hover:bg-[#f5f5f5] text-[#343e55]"}`}
              >
                <User className="size-6" />
              </button>
              <button className="flex items-center justify-center size-[48px] rounded hover:bg-[#f5f5f5] transition-colors text-[#343e55]">
                <Keyboard className="size-6" />
              </button>
            </div>
          </div>
        )
      })() : (
        <div className="flex-[1_0_0] min-h-0 min-w-0 bg-[#f5f5f5] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-5 w-[276px] shrink-0">
            <div className="w-[180px] h-[180px] shrink-0 rounded-full bg-white overflow-hidden">
              <img
                src={noConversationImg}
                alt="No conversation"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-[6px]">
              <h2 className="text-[24px] font-semibold text-[#181d27] leading-8">
                No conversation selected
              </h2>
              <p className="text-[16px] text-[#717680] text-center">
                Select a chat from inbox or start new chat
              </p>
            </div>
            <Button
              className="w-full h-12 rounded bg-[#343e55] text-white text-[14px] font-semibold tracking-[0.014px] hover:bg-[#2a3245]"
              leftIcon={<Plus className="w-6 h-6" />}
              onClick={openNewChat}
            >
              Start New Chat
            </Button>
          </div>
        </div>
      )}

      {/* ── Select Template Modal ── */}
      {showTemplateModal && (
        <SelectTemplateModal
          onClose={() => setShowTemplateModal(false)}
          onSend={() => setShowTemplateModal(false)}
        />
      )}
    </div>
  )
}
