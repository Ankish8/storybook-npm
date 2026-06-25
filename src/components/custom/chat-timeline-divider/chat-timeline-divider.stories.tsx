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

For string children, wrap names or keywords in \`**\` for semibold action-feedback highlights (e.g. \`Assigned to **Alex Smith** by **Admin**\`).

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
| System text | \`--semantic-text-secondary\` | Action feedback | <span style="color:#343e55">■</span> \`#343E55\` |
| Container bg | \`--semantic-bg-primary\` | Action tag background | <span style="color:#ffffff; text-shadow: 0 0 1px #999">■</span> \`#FFFFFF\` |
| Container shadow | \`shadow-sm\` | Action tag elevation | Figma shadow-sm |
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          width: 500,
          background: "#f5f5f5",
          padding: "24px 16px",
          borderRadius: 8,
        }}
      >
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
  args: {
    children: "Today",
  },
};

export const UnreadCount: Story = {
  args: {
    variant: "unread",
    children: "3 unread messages",
  },
};

export const SystemEvent: Story = {
  render: () => (
    <ChatTimelineDivider variant="system">
      Assigned to **Alex Smith** by **Admin**
    </ChatTimelineDivider>
  ),
};

export const ConversationResolved: Story = {
  render: () => (
    <ChatTimelineDivider variant="system">
      Conversation resolved by{" "}
      <span className="font-semibold tracking-[0.06px] text-semantic-text-secondary">
        Jane Doe
      </span>
    </ChatTimelineDivider>
  ),
};

export const SystemEventMobileWrap: Story = {
  name: "System Event — Mobile Wrap",
  parameters: {
    docs: {
      description: {
        story:
          "On mobile (< 640px), long system events wrap instead of truncating, centre-aligned with 20px left/right padding. At `sm` and up they revert to a compact single-line truncated pill. Resize the viewport (or use the toolbar viewport addon) to see the breakpoint.",
      },
    },
  },
  render: () => (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <ChatTimelineDivider variant="system">
        Conversation transferred to **Alex Smith** from **Priya Patel** by
        **Workflow Automation**
      </ChatTimelineDivider>
    </div>
  ),
};

/* ── All Variants ── */

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="m-0 text-xs text-semantic-text-muted mb-2">
          default — date labels
        </p>
        <ChatTimelineDivider>Today</ChatTimelineDivider>
      </div>
      <div>
        <p className="m-0 text-xs text-semantic-text-muted mb-2">
          unread — unread message count
        </p>
        <ChatTimelineDivider variant="unread">
          1 unread message
        </ChatTimelineDivider>
      </div>
      <div>
        <p className="m-0 text-xs text-semantic-text-muted mb-2">
          system — action events
        </p>
        <ChatTimelineDivider variant="system">
          Assigned to **Alex Smith** by **Admin**
        </ChatTimelineDivider>
      </div>
    </div>
  ),
};

/* ── In Context ── */

export const InChatTimeline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Shows how dividers look between chat messages in a typical timeline.",
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
        Assigned to **Alex Smith** by **Admin**
      </ChatTimelineDivider>

      <ChatTimelineDivider variant="unread">
        1 unread message
      </ChatTimelineDivider>

      {/* Simulated message */}
      <div className="self-start bg-white rounded-lg px-3 py-2 shadow-sm max-w-[260px]">
        <p className="m-0 text-sm">Hey, can you help me with my order?</p>
        <span className="text-[11px] text-semantic-text-muted">10:30 AM</span>
      </div>
    </div>
  ),
};
