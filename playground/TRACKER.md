# Playground Tracker

## Purpose
Temporary playground app for building and testing myOperator UI components against Figma designs before adding them to the library.

## Current Screen: Chatscreen (Inbox)
**Figma**: Chatscreen design — two-panel layout (Inbox sidebar + Chat Window)

### Implementation Status

| Section | Status | Notes |
|---------|--------|-------|
| Header (Inbox + New Chat) | Done | Uses `Button` component |
| Search bar | Done | Uses `TextField` component |
| Filter icon button | Done | Uses `Button` (icon-lg, outline) + custom FilterIcon SVG |
| Tabs (Open/Assigned/Resolved) | Done | Custom tab bar with badges |
| Sort bar + dropdown | Done | Uses `DropdownMenu` component |
| Chat list | Done | Uses new `ChatListItem` component (7 items, all variants) |
| Chat item selected state | Done | Left teal border + gray bg from Figma |
| Right panel (Chat Window) | Done | "No conversation selected" empty state — 180px illustration circle, title, subtitle, Start New Chat button (Figma node 830-16004) |
| Filter panel | Done | Partial content swap below search bar — Assignment (agents/bots) + Channels sections with checkboxes, Apply/Cancel footer |
| Chat message variants | Done | 8 message types: image, video, audio, docPreview, document (download), otherDoc (XLS), carousel, loading/error |

## New Components Created

### 1. ChatListItem (Custom)
**Path**: `src/components/custom/chat-list-item/`
**Files**: `chat-list-item.tsx`, `index.ts`, `chat-list-item.stories.tsx`, `__tests__/chat-list-item.test.tsx`
**Tests**: 14 passing
**Storybook**: 11 stories (individual variants + full inbox list)
**Exported in**: `src/index.ts`

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Contact name |
| `message` | string | Yes | Last message preview |
| `timestamp` | string | Yes | Time display |
| `channel` | string | Yes | Channel identifier (e.g. "MY01") |
| `messageStatus` | "sent" \| "delivered" \| "read" | No | Outbound message delivery status (checkmarks) |
| `unreadCount` | number | No | Inbound unread count badge (caps at 99+) |
| `slaTimer` | string | No | SLA warning timer (e.g. "2h", "50m") |
| `messageType` | "text" \| "document" \| "image" | No | Icon prefix for last message |
| `agentName` | string | No | Assigned agent name in channel pill |
| `isAgentDeleted` | boolean | No | Error styling (red text) for deleted agent |
| `isBot` | boolean | No | Sparkle icon for AI/IVR bot |
| `isSelected` | boolean | No | Active/selected state with left accent border |
| `onClick` | function | No | Click handler |
| `className` | string | No | Custom className override |

**Visual states (from Figma node 761-35149):**
| State | Background | Border | Figma Token |
|-------|-----------|--------|-------------|
| Default | `#ffffff` (white) | bottom `#e9eaeb` | `--bg-primary` |
| Hover | `#fafafa` | bottom `#e9eaeb` | — |
| Selected | `#f5f5f5` | left 3px `#27abb8` | `--bg-ui`, `--border-accent` |

**Key design decisions:**
- `messageStatus` and `unreadCount` are mutually exclusive (outbound vs inbound)
- `slaTimer` only makes sense for unread/inbound conversations
- `isAgentDeleted` turns the entire channel pill text red (`#b42318`)
- Selected state uses left accent border (3px teal) instead of bottom border
- Keyboard accessible (Enter/Space triggers onClick, role="button", tabIndex=0)

## Library Components Used

| Component | Where Used | Variant/Size |
|-----------|-----------|--------------|
| Button | "New Chat" button | outline, default size, leftIcon |
| Button | Filter icon button | outline, icon-lg, teal highlight when active |
| Button | "Start New Chat" (right panel) | custom bg-[#343e55], full width, leftIcon (Plus) |
| TextField | Search input | with leftIcon (Search), shared between inbox & filter search |
| DropdownMenu | Sort options | Newest/Urgent/Unread First |
| ChatListItem | Chat list | All 7 Figma variants |
| Checkbox | Filter panel | size="sm" (16px), used for assignees & channels |

## Custom Elements (potential new components)

| Element | Description | Extract to library? |
|---------|-------------|-------------------|
| FilterIcon | Custom SVG — 3 horizontal lines (Figma's filter icon, doesn't match lucide's ListFilter) | No — use as inline SVG |
| Tab bar | Horizontal tabs with count badges, active state border | Maybe — could be a `Tabs` component |
| Sort bar | Full-width sort trigger with dropdown | Maybe — could be part of a list/filter pattern |
| FilterContent | Partial content swap panel — checkboxes for assignees (agents/bots groups) + channels, Apply/Cancel/Reset | Maybe — could be a reusable filter pattern |

## Figma References

| Screen | Node ID | Status |
|--------|---------|--------|
| Chatscreen (full) | 1551-9144 | Done (left panel, right panel empty state, chat window with all message variants) |
| Inbox panel | 1551-9145 | Done |
| Tabs | 1325-11434 | Done |
| Sort bar | 1306-9644 | Done |
| Chat item (Aditi - sent + doc) | 1314-10497 | Done |
| Chat item (+91 - read) | 1314-10495 | Done |
| Chat item (Nitin - timer + unread) | 1314-10498 | Done |
| Chat item (Sushmit - timer) | 1314-10499 | Done |
| Chat item (Rohit - deleted agent) | 1314-10500 | Done |
| Chat items (full list) | 1314-10494 | Done |
| Chat item selected state | 761-35149 | Done |
| Right panel empty state | 830-16004 | Done |
| Image message | 928:7381 | Done |
| Video message | 947:94555 | Done |
| Audio message | 930:59520 | Done |
| Document preview (PDF) | 928:7383 | Done |
| Document download | 930:59480 | Done |
| Other document (XLS) | 1710:12458 | Done |
| Carousel message | 1121:8213 | Done |
| Loading/Error state | 1127:9118 | Done |

## Key Decisions

- **Filter icon**: Lucide's `ListFilter` doesn't match Figma — using custom SVG
- **Tab badges**: 20px circle, 12px font, `bg-[#EBECEE]` (maps to `--semantic-primary-surface`)
- **Sort dropdown**: Full panel width (356px), checkmark for selected item
- **Playground is gitignored** in main repo, has its own repo at https://github.com/Ankish8/chatApp.git
- **ChatListItem**: Created as custom component, not UI primitive — it's domain-specific to chat/inbox
- **Selected state**: 3px left teal border (`#27abb8`) + `#f5f5f5` bg, no bottom border — matches Figma exactly
- **Filter panel UX**: Partial content swap — header + search bar stay visible, only area below swaps between inbox content and filter content. Search field is shared (placeholder changes contextually)
- **Filter panel structure**: Assignment section groups items into top-level (All, Unassigned), Bots, and Agents — each group has a `bg-[#f5f5f5]` header strip inside a single bordered card. Channels section uses the same card pattern.
- **Filter state management**: Draft → commit pattern using `Set<string>`. Local state in FilterContent, only applied to parent on "Apply" click. Reset clears all selections.
- **Mock data**: 17 assignees (2 top-level + 3 bots + 12 agents) and 8 channels to test scrolling and search filtering
- **Right panel empty state**: 180px white circle with illustration, 276px content wrapper, vertically centered in `#f5f5f5` panel — verified pixel-perfect against Figma node 830-16004
- **Tailwind gotcha**: Playground's Vite config (`root: __dirname`) can cause Tailwind JIT to miss playground-specific classes. Fix: ensure `./playground/**/*.{js,ts,jsx,tsx}` is in `tailwind.config.js` content AND restart/touch CSS if Vite was running before the path was added
- **Message type architecture**: `ChatMessage.type` discriminant field drives media rendering. Sub-renderer components (ImageMedia, VideoMedia, etc.) handle only the media area — the bubble container and delivery footer are shared. Media area renders full-bleed (no padding), text/footer area gets `px-3 pt-2 pb-1.5`.
- **Two document variants**: `docPreview` shows filename + metadata in an overlay bar (read-only preview). `document` shows filename + download button in the overlay, with file metadata in the text footer area. `otherDoc` uses a self-contained card (border + margin inside bubble) with a green icon badge, file type pill, and `#e9eaeb` filename bar.
- **Audio/Video play state**: Uses local `useState` in sub-renderer components — not wired to actual playback (playground is for visual testing only).
- **Carousel scrolling**: Native CSS `overflow-x: auto` with functional left/right ChevronLeft/ChevronRight arrow buttons. Arrows show/hide based on scroll position (`canScrollLeft`/`canScrollRight` state via `onScroll` + `useRef`). Scrolls by 272px per click with smooth behavior.
- **Mock data distribution**: Each chat ID showcases a different message type to make it easy to click through and verify each variant. Chat "1" (Aditi Kumar) has all 8 types for a full visual test.
- **Loading/Error state**: White preview area (aspect 442:308) with 60px spinning Loader2 at 40% opacity. Error banner is full-width with `#fef3f2` bg, `#fecdca` border-t, `#b42318` text at 14px.
- **Chat window header**: Shows contact name, SLA timer, agent assignment dropdown, and Resolve button. Agent dropdown uses `DropdownMenu` with 5 agents/bots.
