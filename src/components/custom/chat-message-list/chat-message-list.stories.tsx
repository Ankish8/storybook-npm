import type { Meta, StoryObj } from "@storybook/react"
import { useEffect } from "react"
import { ChatProvider, useChatContext } from "../chat-provider"
import { MockTransport } from "../chat-transport"
import { ChatMessageList } from "./chat-message-list"

/* Auto-select a chat so messages are visible */
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
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Message list that renders all supported media types inside chat bubbles. Each message type has a dedicated renderer.

### Supported message types

| Type | Renderer | Description |
|------|----------|-------------|
| \`text\` | — | Plain text bubble |
| \`image\` | ImageMedia | Full-bleed photo |
| \`video\` | VideoMedia | Thumbnail with play controls |
| \`audio\` | AudioMedia | Waveform player |
| \`document\` | DocMedia | PDF/file download card |
| \`docPreview\` | DocMedia | PDF preview with thumbnail |
| \`carousel\` | CarouselMedia | Scrollable card carousel |
| \`referral\` | ReferralMedia | CTWA ad attribution card |
| \`location\` | LocationMedia | Map pin with place name |
| \`contact\` | ContactMedia | vCard with phone/email |
| \`listReply\` | ListReplyMedia | Interactive list with options button |
| \`system\` | — | Timeline divider |
| \`loading\` | LoadingMedia | Spinner or error banner |

### Installation

Part of the chat template — install the full chat:

\`\`\`bash
npx myoperator-ui add chat-template
\`\`\`

### Import

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

export const Overview: Story = {
  decorators: [
    (Story) => (
      <MessageListLoader chatId="1">
        <div style={{ height: 700, display: "flex", flexDirection: "column" }}>
          <Story />
        </div>
      </MessageListLoader>
    ),
  ],
}

export const WithNewMessageTypes: Story = {
  name: "Referral + Location + Contact + List",
  decorators: [
    (Story) => (
      <MessageListLoader chatId="1">
        <div style={{ height: 700, display: "flex", flexDirection: "column" }}>
          <Story />
        </div>
      </MessageListLoader>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Scroll to the bottom to see the 4 new message types: Referral (CTWA ad card), Location (map pin), Contact (vCard), and List Reply (interactive list with options button).",
      },
    },
  },
}

export const MinimalConversation: Story = {
  decorators: [
    (Story) => (
      <MessageListLoader chatId="2">
        <div style={{ height: 500, display: "flex", flexDirection: "column" }}>
          <Story />
        </div>
      </MessageListLoader>
    ),
  ],
}
