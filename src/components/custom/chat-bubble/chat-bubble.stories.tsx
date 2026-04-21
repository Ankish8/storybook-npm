import { useEffect, type ReactNode } from "react";
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

/** Select a chat in mock provider so the message thread renders (same helper as Chat Message List stories). */
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

/** Renders the same `ChatMessage` rows as the matching Chat Message List story (mock thread). */
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

const meta: Meta<typeof ChatBubble> = {
  title: "Custom/Chat/Chat Bubble",
  component: ChatBubble,
  subcomponents: { MessageList: ChatMessageList },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Single bubble** — sender/receiver alignment, reply quote, media slot, text, delivery footer, and timestamp. Pass \`message={…}\` (\`ChatMessage\`) for full template media (same rows as the thread view).

**Thread (list)** — use \`ChatBubble.MessageList\` (alias: import \`{ ChatMessageList }\` from the same package). Requires \`ChatProvider\`. Props: \`onReplyTo\` (customer reply control), \`className\` (merged on the **root** scroll wrapper), plus standard div attributes.

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
  name: "From ChatMessage (list parity)",
  render: () => (
    <TooltipProvider delayDuration={200}>
      <ChatBubble
        message={sampleTemplateMessage}
        onReplyTo={fn()}
      />
    </TooltipProvider>
  ),
};

/** Same surface as **Chat Message List** — `onReplyTo` and root `className` on `ChatBubble.MessageList`. */
export const MessageListScrollThread: Story = {
  name: "MessageList (provider / onReplyTo / className)",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Full scroll thread via **`ChatBubble.MessageList`**; `className` and `onReplyTo` match the Chat Message List docs. Uses mock chat **1**.",
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

const listParityDecorators = [
  (Story) => (
    <div className="w-full max-w-[580px] min-h-[200px] p-4 bg-semantic-bg-ui rounded-lg">
      <TooltipProvider delayDuration={200}>
        <Story />
      </TooltipProvider>
    </div>
  ),
];

/** Same mock data as Chat Message List → `MinimalConversation` (chat id `2`). */
export const MinimalConversationListParity: Story = {
  name: "Minimal Conversation",
  decorators: listParityDecorators,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Uses `chatMessageListStoryThreadMessages.minimalConversation` — identical payloads to **Chat Message List → Minimal Conversation** (chat `2`).",
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

/** Same mock data as Chat Message List → `ReferralView`. */
export const ReferralAllPayloadShapesListParity: Story = {
  name: "Referral · All payload shapes",
  decorators: listParityDecorators,
  parameters: {
    docs: {
      description: {
        story:
          "Uses `referralAllPayloadShapes` — same as **Chat Message List → Referral · All payload shapes**.",
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

/** Same mock data as Chat Message List → `LocationMessage`. */
export const LocationNameVsCoordsListParity: Story = {
  name: "Location · Name + address vs coordinates only",
  decorators: listParityDecorators,
  parameters: {
    docs: {
      description: {
        story:
          "Uses `locationNameVsCoords` — same as **Chat Message List → Location · Name + address vs coordinates only**.",
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

/** Same mock data as Chat Message List → `ContactMessage`. */
export const ContactFullVsMinimalListParity: Story = {
  name: "Contact · Full card vs minimal",
  decorators: listParityDecorators,
  parameters: {
    docs: {
      description: {
        story:
          "Uses `contactFullVsMinimal` — same as **Chat Message List → Contact · Full card vs minimal**.",
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

/** Same mock data as Chat Message List → `ListMessage`. */
export const ListReplyFullVsMinimalListParity: Story = {
  name: "List reply · Full vs minimal",
  decorators: listParityDecorators,
  parameters: {
    docs: {
      description: {
        story:
          "Uses `listReplyFullVsMinimal` — same as **Chat Message List → List reply · Full vs minimal**.",
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
