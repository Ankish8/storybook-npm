import { useEffect, type ComponentType, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import type { ChatMessage } from "../chat-types";
import { ChatProvider, useChatContext } from "../chat-provider";
import {
  MockTransport,
  chatMessageListStoryThreadMessages,
} from "../chat-transport";
import { TooltipProvider } from "../../ui/tooltip";
import { ChatBubble } from ".";
import { ChatMessageList } from "./chat-message-list";
import {
  ChatBubbleAgentMessageFromApi,
  ChatBubbleAgentMessageFromBot,
  ChatBubbleAgentMessageFromCampaign,
} from "./agent-source-samples";

/** Select a chat in mock provider so the message thread renders. */
function MessageListLoader({
  chatId,
  children,
}: {
  chatId: string;
  children: ReactNode;
}) {
  const { selectChat } = useChatContext();
  useEffect(() => {
    selectChat(chatId);
  }, [chatId, selectChat]);
  return <>{children}</>;
}

/** Renders a column of `ChatMessage` rows from mock data (see `chatMessageListStoryThreadMessages`). */
function MessageListParityColumn({
  messages,
  replyParticipantName,
}: {
  messages: readonly ChatMessage[];
  replyParticipantName: string;
}) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[560px]">
      {messages.map((msg) => (
        <ChatBubble
          key={msg.id}
          message={msg}
          replyParticipantName={replyParticipantName}
          onReplyTo={fn()}
        />
      ))}
    </div>
  );
}

const listParityDecorators = [
  (Story: ComponentType) => (
    <div className="w-full max-w-[580px] min-h-[200px] p-4 bg-semantic-bg-ui rounded-lg">
      <TooltipProvider delayDuration={200}>
        <Story />
      </TooltipProvider>
    </div>
  ),
];

const meta: Meta<typeof ChatBubble> = {
  title: "Custom/Chat/Chat Bubble",
  component: ChatBubble,
  subcomponents: { MessageList: ChatMessageList },
  argTypes: {
    variant: {
      control: "select",
      options: ["sender", "receiver"],
      table: { category: "Manual bubble" },
      description:
        "Agent (right) vs customer (left). Omit when using `message` (alignment comes from `message.sender`).",
    },
    timestamp: {
      control: "text",
      table: { category: "Manual bubble" },
      description: "Footer time label (e.g. `2:15 PM`). Not used when `message` is set (`message.time` is used).",
    },
    status: {
      control: "select",
      options: ["sent", "delivered", "read", "failed"],
      table: { category: "Manual bubble" },
      description: "Delivery row — **sender** only. Ignored when `message` is set (`message.status`).",
    },
    senderName: {
      control: "text",
      table: { category: "Manual bubble" },
      description: "Name above the bubble (manual mode).",
    },
    reply: {
      control: "object",
      table: { category: "Manual bubble" },
      description:
        "Quote block: `{ sender, message, messageId? }`. Clicks call `onReplyClick(messageId)` when `messageId` is set.",
    },
    onReplyClick: {
      action: "onReplyClick",
      table: { category: "Manual bubble" },
      description: "Fires when the reply quote is clicked and `reply.messageId` is defined.",
    },
    media: {
      control: false,
      table: { category: "Manual bubble" },
      description: "Full-bleed slot above the text (manual mode).",
    },
    maxWidth: {
      control: "select",
      options: ["text", "media", "audio", "carousel"],
      table: { category: "Manual bubble" },
      description: "Bubble max width: text ≈ 65%, media 380px, audio 340px, carousel 466px.",
    },
    senderIndicator: {
      control: false,
      table: { category: "Manual bubble" },
      description: "Element shown beside **sender** bubbles (e.g. avatar).",
    },
    children: {
      control: "text",
      table: { category: "Manual bubble" },
      description: "Message body in manual mode (plain text in stories).",
    },
    message: {
      control: false,
      table: { category: "Message mode" },
      description:
        "Full `ChatMessage` from `../chat-types` (template, media, referral, location, contact, list reply, etc.). **Mutually exclusive** with manual props (`variant`, `timestamp`, …).",
    },
    replyParticipantName: {
      control: "text",
      table: { category: "Message mode" },
      description:
        "Shown in the **Reply** action payload for **customer** messages (defaults to an empty string if omitted).",
    },
    onReplyTo: {
      action: "onReplyTo",
      table: { category: "Message mode" },
      description:
        "Customer row only: fires `{ messageId, sender, text }` when the reply control is used. No-op for agent messages.",
    },
    className: {
      control: "text",
      table: { category: "Root" },
      description: "Merged onto the outer row `div` (layout / alignment).",
    },
    ref: { table: { category: "Root" }, control: false },
    id: { control: "text", table: { category: "Root" } },
    style: { control: "object", table: { category: "Root" } },
    role: { control: "text", table: { category: "Root" } },
    "aria-label": { control: "text", table: { category: "Root" } },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Two ways to use \`ChatBubble\`**

1. **Manual** — do not pass \`message\`. Set \`variant\`, \`timestamp\`, optional \`status\`, \`senderName\`, \`reply\` / \`onReplyClick\`, \`media\`, \`maxWidth\`, \`senderIndicator\`, and \`children\`.
2. **Payload** — pass \`message={…}\` (\`ChatMessage\`) for full template and media (same as list rows). Optional \`replyParticipantName\` and \`onReplyTo\` for customer rows.

**Root** — \`className\` and all standard \`HTMLDivElement\` attributes spread to the outer row. \`ref\` targets that row.

**Thread (list)** — \`ChatBubble.MessageList\` (alias: \`ChatMessageList\` from the same module). Needs \`ChatProvider\`. **Props:** \`onReplyTo?: (payload) => void\`, \`className?\` (merged on the **scroll root**), plus all **\`div\`** attributes (\`id\`, \`role\`, \`data-*\`, \`style\`, …). Message rows use \`message\` from context, with \`replyParticipantName\` from the selected chat.

**Storybook** — the stories named *All new types (in one thread)*, *Minimal Conversation*, and the referral / location / contact / list reply entries exercise every \`ChatMessage\` shape from \`../chat-types\`.

| Type | Message \`type\` | Data field | Optional fields |
|------|------------------|------------|-----------------|
| Referral (CTWA) | \`referral\` | \`referral\` | \`body\`, \`sourceUrl\`, \`thumbnailUrl\`, \`sourceType\` (\`ad\` \\| \`post\` \\| \`unknown\`) |
| Location | \`location\` | \`location\` | \`name\`, \`address\` (lat/long always used) |
| Contact | \`contact\` | \`contactCard\` | \`email\`, \`organization\` |
| List reply | \`listReply\` | \`listReply\` | \`header\`, \`footer\`, \`sections\` (list UI shows header/body/footer/button) |

### \`ChatMessage\` fields (payload mode)

| Field | Notes |
| --- | --- |
| \`id\`, \`text\`, \`time\` | ids and display time string |
| \`sender\`, \`senderName\` | \`customer\` or \`agent\`; name above bubble when set |
| \`type\` | Drives media / referral / location / contact / list UI (see types) |
| \`status\` | Delivery footer for agent messages |
| \`replyTo\` | Quoted message above body |
| \`media\`, \`referral\`, \`location\`, \`contactCard\`, \`listReply\` | Per-type payloads |
| \`sentBy\` | On **agent** rows, a circular badge (Bot / megaphone / plug / initials) appears **in the header** next to \`senderName\`. See stories **Agent source · Bot / Campaign / API**. |
| \`error\` | For \`loading\` / failed template state |

### Installation

\`\`\`bash
npx myoperator-ui add chat-bubble
\`\`\`

### Import

\`\`\`tsx
import { ChatBubble, ChatMessageList } from "@/components/custom/chat-bubble";
// <ChatBubble.MessageList onReplyTo={...} className="..." />
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Sender bg | \`--semantic-info-surface\` | Agent bubble background | <span style="color:#eff8ff">&#9632;</span> \`info-surface\` |
| Receiver bg | \`white\` | Customer bubble background | <span style="color:#ffffff; background:#eee">&#9632;</span> \`white\` |
| Text | \`--semantic-text-primary\` | Message text | <span style="color:#181d27">&#9632;</span> \`#181D27\` |
| Muted text | \`--semantic-text-muted\` | Status labels, timestamp | <span style="color:#717680">&#9632;</span> \`#717680\` |
| Link text | \`--semantic-text-link\` | Read status icon | <span style="color:#47b5bc">&#9632;</span> \`#47B5BC\` |
| Error text | \`--semantic-error-primary\` | Failed status | <span style="color:#f04438">&#9632;</span> \`#F04438\` |
| Border | \`--semantic-border-layout\` | Bubble border | <span style="color:#e9eaeb">&#9632;</span> \`#E9EAEB\` |
| Sender name | \`--semantic-text-muted\` | Name above bubble | <span style="color:#717680">&#9632;</span> \`#717680\` |
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 500, padding: 16, background: "#fafafa" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const SenderMessage: Story = {
  name: "Sender (Agent)",
  args: {
    variant: "sender",
    timestamp: "2:15 PM",
    status: "sent",
    children: "Hello! How can I help you today?",
  },
};

export const ReceiverMessage: Story = {
  name: "Receiver (Customer)",
  args: {
    variant: "receiver",
    timestamp: "2:16 PM",
    children: "I need help with my recent order. The tracking shows it was delivered but I haven't received it yet.",
  },
};

export const WithSenderName: Story = {
  args: {
    variant: "sender",
    timestamp: "2:15 PM",
    status: "delivered",
    senderName: "Alex Smith",
    children: "Let me check your order status right away.",
  },
};

export const WithReply: Story = {
  name: "With Reply Quote",
  args: {
    variant: "sender",
    timestamp: "2:17 PM",
    status: "sent",
    reply: {
      sender: "Aditi Kumar",
      message: "I need help with my recent order.",
      messageId: "msg-1",
    },
    children: "Sure, I can help you with that. Let me look into it.",
  },
};

export const WithMedia: Story = {
  name: "With Media Slot",
  args: {
    variant: "sender",
    timestamp: "2:18 PM",
    status: "delivered",
    maxWidth: "media",
    media: (
      <div
        style={{
          width: "100%",
          height: 200,
          background: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
          fontSize: 14,
        }}
      >
        Media Placeholder (Image / Video)
      </div>
    ),
    children: "Check out this photo!",
  },
};

export const AllStatuses: Story = {
  name: "All Delivery Statuses",
  render: () => (
    <div className="flex flex-col gap-4">
      <ChatBubble variant="sender" timestamp="2:15 PM" status="sent">
        This message was sent.
      </ChatBubble>
      <ChatBubble variant="sender" timestamp="2:16 PM" status="delivered">
        This message was delivered.
      </ChatBubble>
      <ChatBubble variant="sender" timestamp="2:17 PM" status="read">
        This message was read.
      </ChatBubble>
      <ChatBubble variant="sender" timestamp="2:18 PM" status="failed">
        This message failed to send.
      </ChatBubble>
    </div>
  ),
};

export const FailedMessage: Story = {
  args: {
    variant: "sender",
    timestamp: "2:20 PM",
    status: "failed",
    children: "This message could not be delivered due to a network error.",
  },
};

const sampleTemplateMessage: ChatMessage = {
  id: "story-msg-1",
  text: "Your appointment is confirmed for tomorrow at 10 AM.",
  time: "9:41 AM",
  sender: "agent",
  type: "template",
  status: "read",
  senderName: "Support Bot",
  sentBy: { type: "bot", name: "Bot" },
};

export const FromChatMessagePayload: Story = {
  name: "From ChatMessage (template)",
  render: () => (
    <TooltipProvider delayDuration={200}>
      <ChatBubble
        message={sampleTemplateMessage}
        onReplyTo={fn()}
      />
    </TooltipProvider>
  ),
};

/** `sentBy.type: bot` — Bot icon in the header row (same row as `senderName`). */
export const AgentMessageSourceBot: Story = {
  name: "Agent source · Bot",
  decorators: listParityDecorators,
  render: () => <ChatBubbleAgentMessageFromBot />,
};

/** `sentBy.type: campaign` — Megaphone (campaign) icon next to the sender name. */
export const AgentMessageSourceCampaign: Story = {
  name: "Agent source · Campaign",
  decorators: listParityDecorators,
  render: () => <ChatBubbleAgentMessageFromCampaign />,
};

/** `sentBy.type: api` — Plug (API) icon; optional `name` in tooltip (e.g. integration name). */
export const AgentMessageSourceApi: Story = {
  name: "Agent source · API",
  decorators: listParityDecorators,
  render: () => <ChatBubbleAgentMessageFromApi />,
};

/** Full threaded view: all supported bubble rows in one conversation (mock chat **1**). */
export const MessageListScrollThread: Story = {
  name: "All new types (in one thread)",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Scroll to the bottom for referral, location, contact, and list reply in a single thread. Root **`className`** and **`onReplyTo`** are supported on **`ChatBubble.MessageList`** (same as this demo).",
      },
    },
  },
  decorators: [
    (Story) => (
      <ChatProvider transport={new MockTransport()}>
        <div className="flex h-[min(700px,90vh)] w-full max-w-xl mx-auto flex-col bg-semantic-bg-ui">
          <MessageListLoader chatId="1">
            <Story />
          </MessageListLoader>
        </div>
      </ChatProvider>
    ),
  ],
  render: () => (
    <ChatBubble.MessageList onReplyTo={fn()} className="flex-1 min-h-0" />
  ),
};

export const MinimalConversationListParity: Story = {
  name: "Minimal Conversation",
  decorators: listParityDecorators,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Uses `chatMessageListStoryThreadMessages.minimalConversation` (mock chat id `2`).",
      },
    },
  },
  render: () => (
    <MessageListParityColumn
      messages={chatMessageListStoryThreadMessages.minimalConversation}
      replyParticipantName="+91 98765 43210"
    />
  ),
};

export const ReferralAllPayloadShapesListParity: Story = {
  name: "Referral · All payload shapes",
  decorators: listParityDecorators,
  parameters: {
    docs: {
      description: {
        story:
          "Three customer bubbles: full ad, post, and unknown referral (`referralAllPayloadShapes`).",
      },
    },
  },
  render: () => (
    <MessageListParityColumn
      messages={chatMessageListStoryThreadMessages.referralAllPayloadShapes}
      replyParticipantName="Story: Referral (CTWA)"
    />
  ),
};

export const LocationNameVsCoordsListParity: Story = {
  name: "Location · Name + address vs coordinates only",
  decorators: listParityDecorators,
  parameters: {
    docs: {
      description: {
        story:
          "**First message:** `name`, `address`, `latitude`, `longitude`. **Second:** coordinates only (`locationNameVsCoords`).",
      },
    },
  },
  render: () => (
    <MessageListParityColumn
      messages={chatMessageListStoryThreadMessages.locationNameVsCoords}
      replyParticipantName="Story: Location pin"
    />
  ),
};

export const ContactFullVsMinimalListParity: Story = {
  name: "Contact · Full card vs minimal",
  decorators: listParityDecorators,
  parameters: {
    docs: {
      description: {
        story:
          "Full vCard fields vs `name` + `phone` only (`contactFullVsMinimal`).",
      },
    },
  },
  render: () => (
    <MessageListParityColumn
      messages={chatMessageListStoryThreadMessages.contactFullVsMinimal}
      replyParticipantName="Story: Contact card"
    />
  ),
};

export const ListReplyFullVsMinimalListParity: Story = {
  name: "List reply · Full vs minimal",
  decorators: listParityDecorators,
  parameters: {
    docs: {
      description: {
        story:
          "Full list reply (header, body, footer, button) vs minimal body + button (`listReplyFullVsMinimal`).",
      },
    },
  },
  render: () => (
    <MessageListParityColumn
      messages={chatMessageListStoryThreadMessages.listReplyFullVsMinimal}
      replyParticipantName="Story: List reply"
    />
  ),
};

export const Conversation: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ChatBubble variant="receiver" timestamp="2:10 PM">
        Hi, I placed an order yesterday and I was wondering about the delivery
        timeline.
      </ChatBubble>
      <ChatBubble
        variant="sender"
        timestamp="2:11 PM"
        status="read"
        senderName="Alex Smith"
      >
        Hello! Let me check your order details.
      </ChatBubble>
      <ChatBubble
        variant="sender"
        timestamp="2:12 PM"
        status="read"
        senderName="Alex Smith"
        reply={{
          sender: "Customer",
          message:
            "Hi, I placed an order yesterday and I was wondering about the delivery timeline.",
          messageId: "msg-1",
        }}
      >
        Your order #12345 is currently being processed and should be shipped
        within 24 hours.
      </ChatBubble>
      <ChatBubble variant="receiver" timestamp="2:13 PM">
        Great, thank you so much!
      </ChatBubble>
      <ChatBubble
        variant="sender"
        timestamp="2:14 PM"
        status="delivered"
        senderName="Alex Smith"
      >
        You are welcome! Is there anything else I can help with?
      </ChatBubble>
    </div>
  ),
};
