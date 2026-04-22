import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"
import { useEffect } from "react"
import { ChatProvider, useChatContext } from "../chat-provider"
import { MockTransport } from "../chat-transport"
import { ChatMessageList } from "../chat-bubble/chat-message-list"

function MessageListLoader({
  chatId,
  children,
}: {
  chatId: string
  children: React.ReactNode
}) {
  const { selectChat } = useChatContext()
  useEffect(() => {
    selectChat(chatId)
  }, [chatId, selectChat])
  return <>{children}</>
}

const meta: Meta<typeof ChatMessageList> = {
  title: "Custom/Chat/Chat Message List",
  component: ChatMessageList,
  args: {
    onReplyTo: fn(),
  },
  argTypes: {
    onReplyTo: {
      action: "onReplyTo",
      table: { category: "ChatMessageList" },
      description:
        "Fires when the customer-message reply control is activated (customer bubble only). Payload: `{ messageId, sender, text }`.",
    },
    className: {
      control: "text",
      table: { category: "ChatMessageList" },
      description:
        "Merged onto the **outer** scroll root (with `flex-1 relative`, etc.).",
    },
    id: { control: "text", table: { category: "Root (HTML div)" } },
    style: { control: "object", table: { category: "Root (HTML div)" } },
    role: { control: "text", table: { category: "Root (HTML div)" } },
    "aria-label": { control: "text", table: { category: "Root (HTML div)" } },
    ref: { control: false, table: { category: "Root (HTML div)" } },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Scrollable message thread. **Implementation and types live in \`chat-bubble\`** — use \`ChatBubble.MessageList\` or import \`{ ChatMessageList }\` from \`@/components/custom/chat-bubble\`.

**Message-type demos** (referral, location, contact, list reply, mock threads) are all under **Custom → Chat → Chat Bubble** so installing \`chat-bubble\` is enough to explore them.

### Installation (recommended)

\`\`\`bash
npx myoperator-ui add chat-bubble
\`\`\`

### Compatibility import path

\`\`\`bash
npx myoperator-ui add chat-message-list
\`\`\`

\`\`\`tsx
import { ChatMessageList } from "@/components/custom/chat-message-list"
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ChatProvider transport={new MockTransport()}>
        <Story />
      </ChatProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatMessageList>

/** Smokes the scroll list with mock chat 1. Full message-type catalog: see Chat Bubble stories. */
export const Overview: Story = {
  decorators: [
    (Story) => (
      <MessageListLoader chatId="1">
        <div style={{ height: 500, display: "flex", flexDirection: "column" }}>
          <Story />
        </div>
      </MessageListLoader>
    ),
  ],
}
