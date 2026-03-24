import type { Meta, StoryObj } from "@storybook/react";
import { ChatTimelineDivider } from "./chat-timeline-divider";

const meta: Meta<typeof ChatTimelineDivider> = {
  title: "Custom/Chat/ChatTimelineDivider",
  component: ChatTimelineDivider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A timeline divider for chat message lists. Renders centered content between two horizontal lines.

Use it to separate messages by date, mark unread boundaries, or display system events like agent assignments and conversation resolutions.

### Installation

\`\`\`bash
npx myoperator-ui add chat-timeline-divider
\`\`\`

### Import

\`\`\`tsx
import { ChatTimelineDivider } from "@/components/custom/chat-timeline-divider"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Line color | \`--border/border-layout\` | Horizontal lines | <span style="color:#e9eaeb">■</span> \`#E9EAEB\` |
| Default text | \`--text/text-muted\` | Date labels | <span style="color:#717680">■</span> \`#717680\` |
| Unread text | \`--text/text-primary\` | Unread count | <span style="color:#181d27">■</span> \`#181D27\` |
| System text | \`--text/text-muted\` | System events | <span style="color:#717680">■</span> \`#717680\` |
| Container bg | white | Pill background | <span style="color:#ffffff; text-shadow: 0 0 1px #999">■</span> \`#FFFFFF\` |
| Container border | \`--border/border-layout\` | Pill border | <span style="color:#e9eaeb">■</span> \`#E9EAEB\` |
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 500, background: "#f5f5f5", padding: "24px 16px", borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatTimelineDivider>;

/* ── Individual Stories ── */

export const Overview: Story = {
  args: {
    children: "Today",
    variant: "default",
  },
};

export const DateSeparator: Story = {
  name: "Date Separator",
  args: {
    children: "Today",
  },
};

export const UnreadCount: Story = {
  name: "Unread Count",
  args: {
    variant: "unread",
    children: "3 unread messages",
  },
};

export const SystemEvent: Story = {
  name: "System Event",
  render: () => (
    <ChatTimelineDivider variant="system">
      Assigned to{" "}
      <span className="text-semantic-text-link font-medium">Alex Smith</span>
      {" "}by{" "}
      <span className="text-semantic-text-link font-medium">Alex Smith</span>
    </ChatTimelineDivider>
  ),
};

export const ConversationResolved: Story = {
  name: "Conversation Resolved",
  render: () => (
    <ChatTimelineDivider variant="system">
      Conversation resolved by{" "}
      <span className="text-semantic-text-link font-medium">Jane Doe</span>
    </ChatTimelineDivider>
  ),
};

/* ── All Variants ── */

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="m-0 text-xs text-semantic-text-muted mb-2">default — date labels</p>
        <ChatTimelineDivider>Today</ChatTimelineDivider>
      </div>
      <div>
        <p className="m-0 text-xs text-semantic-text-muted mb-2">unread — unread message count</p>
        <ChatTimelineDivider variant="unread">1 unread message</ChatTimelineDivider>
      </div>
      <div>
        <p className="m-0 text-xs text-semantic-text-muted mb-2">system — action events</p>
        <ChatTimelineDivider variant="system">
          Assigned to{" "}
          <span className="text-semantic-text-link font-medium">Alex Smith</span>
          {" "}by{" "}
          <span className="text-semantic-text-link font-medium">Alex Smith</span>
        </ChatTimelineDivider>
      </div>
    </div>
  ),
};

/* ── In Context ── */

export const InChatTimeline: Story = {
  name: "In Chat Timeline",
  parameters: {
    docs: {
      description: {
        story: "Shows how dividers look between chat messages in a typical timeline.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Simulated message */}
      <div className="self-start bg-white rounded-lg px-3 py-2 shadow-sm max-w-[260px]">
        <p className="m-0 text-sm">I am super excited!</p>
        <span className="text-[11px] text-semantic-text-muted">Yesterday</span>
      </div>

      <ChatTimelineDivider>Today</ChatTimelineDivider>

      <ChatTimelineDivider variant="system">
        Assigned to{" "}
        <span className="text-semantic-text-link font-medium">Alex Smith</span>
        {" "}by{" "}
        <span className="text-semantic-text-link font-medium">Admin</span>
      </ChatTimelineDivider>

      <ChatTimelineDivider variant="unread">1 unread message</ChatTimelineDivider>

      {/* Simulated message */}
      <div className="self-start bg-white rounded-lg px-3 py-2 shadow-sm max-w-[260px]">
        <p className="m-0 text-sm">Hey, can you help me with my order?</p>
        <span className="text-[11px] text-semantic-text-muted">10:30 AM</span>
      </div>
    </div>
  ),
};
