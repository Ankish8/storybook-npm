import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState } from "react";
import { ChatListItem } from "./chat-list-item";

const meta: Meta<typeof ChatListItem> = {
  title: "Custom/Chat/ChatListItem",
  component: ChatListItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A conversation preview item for inbox-style chat lists.

### Installation

\`\`\`bash
npx myoperator-ui add chat-list-item
\`\`\`

### Import

\`\`\`tsx
import { ChatListItem } from "@/components/custom/chat-list-item"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Name text | \`--text/text-primary\` | Contact name | <span style="color:#181d27">■</span> \`#181D27\` |
| Message text | \`--text/text-muted\` | Message preview | <span style="color:#717680">■</span> \`#717680\` |
| Timestamp | — | Time display | <span style="color:#a2a6b1">■</span> \`#A2A6B1\` |
| Unread badge | \`--secondary/200\` | Unread count bg | <span style="color:#9de0e7">■</span> \`#9DE0E7\` |
| SLA warning bg | \`--warning/warning-surface\` | Timer tag bg | <span style="color:#fffaeb">■</span> \`#FFFAEB\` |
| SLA warning text | \`--warning/warning-text\` | Timer text | <span style="color:#b54708">■</span> \`#B54708\` |
| Read checkmark | — | Read status | <span style="color:#47b5bc">■</span> \`#47B5BC\` |
| Deleted agent | \`--error/error-text\` | Error text | <span style="color:#b42318">■</span> \`#B42318\` |
| Border | \`--border/border-layout\` | Item separator | <span style="color:#e9eaeb">■</span> \`#E9EAEB\` |
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 356, background: "white" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatListItem>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    name: "Aditi Kumar",
    message: "Have a look at this document",
    timestamp: "2:30 PM",
    channel: "MY01",
    agentName: "Alex Smith",
  },
};

export const SentStatus: Story = {
  name: "Status: Sent",
  args: {
    name: "Aditi Kumar",
    message: "Have a look at this document",
    timestamp: "2:30 PM",
    messageStatus: "sent",
    messageType: "document",
    channel: "MY01",
    agentName: "Alex Smith",
  },
};

export const DeliveredStatus: Story = {
  name: "Status: Delivered",
  args: {
    name: "Arsh Raj",
    message: "Authentication message sent",
    timestamp: "2:29 PM",
    messageStatus: "delivered",
    channel: "MY01",
  },
};

export const ReadStatus: Story = {
  name: "Status: Read",
  args: {
    name: "+91 98765 43210",
    message: "Authentication message sent",
    timestamp: "2:29 PM",
    messageStatus: "read",
    channel: "MY01",
  },
};

export const WithUnreadCount: Story = {
  name: "Unread Messages",
  args: {
    name: "Sushant Arya",
    message: "I am super excited!",
    timestamp: "Saturday",
    unreadCount: 1,
    channel: "MY01",
  },
};

export const WithSlaTimer: Story = {
  name: "SLA Timer Warning",
  args: {
    name: "Nitin Rajput",
    message: "I am super excited",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "2h",
    channel: "MY01",
    agentName: "IVR voice bot",
    isBot: true,
  },
};

export const WithDeletedAgent: Story = {
  name: "Deleted Agent",
  args: {
    name: "Rohit Gupta",
    message: "We get many food delivery orders. Can we...",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "50m",
    channel: "MY01",
    agentName: "Deleted User",
    isAgentDeleted: true,
  },
};

export const DocumentMessage: Story = {
  args: {
    name: "Aditi Kumar",
    message: "Have a look at this document",
    timestamp: "2:30 PM",
    messageStatus: "sent",
    messageType: "document",
    channel: "MY01",
    agentName: "Alex Smith",
  },
};

export const ImageMessage: Story = {
  args: {
    name: "Priya Nair",
    message: "Sent you a photo",
    timestamp: "3:15 PM",
    messageStatus: "read",
    messageType: "image",
    channel: "MY01",
    agentName: "Alex Smith",
  },
};

export const Selected: Story = {
  name: "Selected State",
  args: {
    name: "Nitin Rajput",
    message: "I am super excited",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "2h",
    channel: "MY01",
    agentName: "IVR voice bot",
    isBot: true,
    isSelected: true,
  },
};

export const HighlightedSearch: Story = {
  name: "Search Highlight",
  args: {
    name: (
      <>
        Adi<strong className="font-semibold text-semantic-text-primary">ti</strong> Kumar
      </>
    ),
    message: (
      <>
        Have a look at <strong className="font-semibold text-semantic-text-primary">this</strong> document
      </>
    ),
    timestamp: "2:30 PM",
    messageStatus: "sent",
    messageType: "document",
    channel: "MY01",
    agentName: "Alex Smith",
  },
};

/* ── Full Inbox Example ── */

const chatData = [
  {
    id: "1",
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
    name: "+91 98765 43210",
    message: "Authentication message sent",
    timestamp: "2:29 PM",
    messageStatus: "read" as const,
    channel: "MY01",
  },
  {
    id: "3",
    name: "Arsh Raj",
    message: "Authentication message sent",
    timestamp: "2:29 PM",
    messageStatus: "delivered" as const,
    channel: "MY01",
  },
  {
    id: "4",
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
    name: "Sushmit",
    message: "Hi",
    timestamp: "Yesterday",
    unreadCount: 1,
    slaTimer: "2h",
    channel: "MY01",
  },
  {
    id: "6",
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
    name: "Sushant Arya",
    message: "I am super excited!",
    timestamp: "Saturday",
    unreadCount: 1,
    channel: "MY01",
  },
];

function InboxList() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <div>
      {chatData.map((chat) => (
        <ChatListItem
          key={chat.id}
          {...chat}
          isSelected={selectedId === chat.id}
          onClick={() => setSelectedId(chat.id)}
        />
      ))}
    </div>
  );
}

export const FullInbox: Story = {
  name: "Full Inbox List",
  render: () => <InboxList />,
};
