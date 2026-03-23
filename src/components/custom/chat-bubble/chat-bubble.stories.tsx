import type { Meta, StoryObj } from "@storybook/react";
import { ChatBubble } from "./chat-bubble";

const meta: Meta<typeof ChatBubble> = {
  title: "Custom/Chat/Chat Bubble",
  component: ChatBubble,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A chat message bubble with sender/receiver alignment, optional sender name, reply quote, media slot, text content, delivery status footer, and timestamp. The core building block for chat message rendering.

### Installation

\`\`\`bash
npx myoperator-ui add chat-bubble
\`\`\`

### Import

\`\`\`tsx
import { ChatBubble } from "@/components/custom/chat-bubble"
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
  name: "With Sender Name",
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
  name: "Failed Message",
  args: {
    variant: "sender",
    timestamp: "2:20 PM",
    status: "failed",
    children: "This message could not be delivered due to a network error.",
  },
};

export const Conversation: Story = {
  name: "Conversation",
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
