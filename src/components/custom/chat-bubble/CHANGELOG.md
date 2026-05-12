# chat-bubble — visual behavior changelog

A short log of visual / behavior changes that consumers might read as regressions
when upgrading. Bumps without a callout here are pure bug fixes or non-visual
refactors.

## `myoperator-ui@0.0.340-beta.x` (2026-05-11 → 2026-05-12)

### Sender indicator: moved inside the bubble (visual change)

**Affects:** both message mode (`message.sentBy` / `message.senderName`) and manual
mode (`senderIndicator` prop on `ChatBubbleManualProps`).

**Before:** `senderIndicator` and `senderName` rendered as a pill **above** the
bubble, right-aligned for agent rows (`tw-mb-1 tw-justify-end tw-px-1`).

**After:** They render **inside** the bubble as a top header row (`tw-px-3
tw-pt-2.5 tw-pb-1` for media bubbles, `tw-pt-0 tw-pb-1` for text-only). Icon on
the left, name on the right of the icon, both left-aligned within the bubble.

**Why:** Aligns with the WABA Figma sender-indicator spec and matches Slack /
Teams / Discord conventions where the identity row lives inside the message
container.

**Migration:** No API change. If a consumer styled the old above-bubble pill
externally, those styles no longer apply.

### Reply icon: anchored to the bubble's outer edge (visual change)

**Affects:** any consumer passing `onReplyTo` to `<ChatBubble>` or
`<ChatBubble.MessageList>`.

**Before:** The reply icon sat as a sibling of the bubble's column container,
so for short customer messages with a long `senderName`, the icon followed the
column's edge — far from the bubble.

**After:** The bubble + reply icon now share an inner flex row inside the
column. Icon sits immediately adjacent to the bubble's outer edge regardless
of column width.

**Why:** Closes Bug #11 — the reply-far-from-bubble report.

### `onReplyTo` is now bilateral via `showReplyOn` (new API surface)

**Affects:** consumers wanting Reply on agent (outgoing) messages.

**Before:** `onReplyTo` rendered the reply icon only on `msg.sender === "customer"`
messages (in message mode) or `variant === "receiver"` (in manual mode).

**After:** New optional prop `showReplyOn?: "customer" | "agent" | "both"`
(default `"customer"`, fully backwards-compatible). Set to `"both"` for WhatsApp-
style bilateral reply. The icon is mirrored (left of agent bubbles, right of
customer bubbles).

The `onReplyTo` callback's `sender` field is populated from the message's own
sender name when replying to an agent message (vs. `replyParticipantName` for
customer replies in a thread).

### New `queued` delivery status (additive)

**Affects:** consumers using the `status` prop.

**Added:** `DeliveryStatus = "queued" | "sent" | "delivered" | "read" | "failed"`
— `"queued"` renders a `Clock` icon + "Queued" label in muted text.

**Consumer mapper note:** if your app maps a server status like `"queue"` to
the bubble's `status`, you need to add `case "queue": return "queued";` in
your mapper for this to surface.

### Manual-mode footer now uses inline timestamp for text-only bubbles

**Affects:** `<ChatBubble variant="..." timestamp="...">text</ChatBubble>` (manual
mode), text-only case.

**Before:** Footer (timestamp + status) rendered as a separate block below the
text. Short messages caused the timestamp to wrap to multiple lines because the
bubble shrank to the text width.

**After:** Footer trails the text inline at the end of the paragraph
(WhatsApp pattern). The timestamp span has `whitespace-nowrap` so it never wraps
within itself. Bubble sizes to fit text + footer on the same line when possible.

**Why:** Closes Bug #8 — `Bhjg` / `03:43 am` collapse-and-wrap repro.

### Manual-mode reply button now self-contains its `TooltipProvider`

**Affects:** consumers using manual-mode `onReplyTo` outside a `TooltipProvider`.

**Before:** Adding `onReplyTo` to a manual-mode bubble required the consumer
to wrap the tree in `<TooltipProvider>`; otherwise the Radix Tooltip threw at
mount.

**After:** Manual mode wraps its reply Tooltip in a local `TooltipProvider`.
Consumers don't need to add one. Nested providers are safe in Radix.

### `<p>` paddings refactored to `cn()` (silent fix, no behavior change visible in dev)

**Affects:** consumers running in Bootstrap / `tw-` prefixed environments.

**Before:** Template-literal class strings in `chat-bubble-base.tsx` and
`message-renderers.tsx` were not picked up by the CLI's `tw-` prefix transformer
— `px-3`, `pt-3`, `pt-2`, etc. shipped unprefixed and therefore did nothing in
consumer builds. The bubble's media + text content had no horizontal/top
padding in production.

**After:** All affected `className` template literals were refactored to `cn()`
calls so the prefixer recognizes them. Padding now renders correctly.

**Why:** Closes Bug #2.
