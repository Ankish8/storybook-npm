import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"
import { useEffect } from "react"
import { ChatProvider, useChatContext } from "../chat-provider"
import { MockTransport } from "../chat-transport"
import { ChatMessageList } from "../chat-bubble/chat-message-list"

/** Auto-select a chat so `fetchMessages` runs and the list renders */
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

const listShell = (chatId: string, height: number) => [
  (Story: React.ComponentType) => (
    <MessageListLoader chatId={chatId}>
      <div style={{ height, display: "flex", flexDirection: "column" }}>
        <Story />
      </div>
    </MessageListLoader>
  ),
]

const meta: Meta<typeof ChatMessageList> = {
  title: "Custom/Chat/Chat Message List",
  component: ChatMessageList,
  args: {
    onReplyTo: fn(),
  },
  argTypes: {
    onReplyTo: {
      description:
        "Fires when the customer-message reply control is activated (customer bubble only).",
    },
    className: {
      description: "Merged onto the root scroll container.",
      control: "text",
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Message list that renders all supported media types inside chat bubbles. Each message type maps to data on \`ChatMessage\` in \`../chat-types\`.

### Installation

Part of the chat template — install the full chat:

\`\`\`bash
npx myoperator-ui add chat-template
\`\`\`

### Import

\`\`\`tsx
import { ChatMessageList } from "@/components/custom/chat-message-list"
\`\`\`

### Payload reference (focused stories below)

| Type | Message \`type\` | Data field | Optional fields |
|------|------------------|------------|-----------------|
| Referral (CTWA) | \`referral\` | \`referral\` | \`body\`, \`sourceUrl\`, \`thumbnailUrl\`, \`sourceType\` (\`ad\` \\| \`post\` \\| \`unknown\`) |
| Location | \`location\` | \`location\` | \`name\`, \`address\` (lat/long always used) |
| Contact | \`contact\` | \`contactCard\` | \`email\`, \`organization\` |
| List reply | \`listReply\` | \`listReply\` | \`header\`, \`footer\`, \`sections\` (list UI shows header/body/footer/button; \`sections\` kept for API parity) |
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
  decorators: listShell("1", 700),
}

export const WithNewMessageTypes: Story = {
  name: "All new types (in one thread)",
  decorators: listShell("1", 700),
  parameters: {
    docs: {
      description: {
        story:
          "Uses chat **1** — scroll to the bottom for referral, location, contact, and list reply in a single conversation.",
      },
    },
  },
}

export const MinimalConversation: Story = {
  decorators: listShell("2", 500),
}

/* ── Referral (ReferralPayload / “Referral view”) ── */

export const ReferralView: Story = {
  name: "Referral · All payload shapes",
  decorators: listShell("msg-story-referral", 520),
  parameters: {
    docs: {
      description: {
        story:
          "Three customer bubbles: **full ad** (headline, body, sourceUrl, thumbnailUrl, sourceType `ad`), **post** (with image + URL), **unknown** (headline + `sourceType: unknown` — badge reads “Referral”).",
      },
    },
  },
}

/* ── Location (LocationPayload) ── */

export const LocationMessage: Story = {
  name: "Location · Name + address vs coordinates only",
  decorators: listShell("msg-story-location", 560),
  parameters: {
    docs: {
      description: {
        story:
          "**First message:** `name`, `address`, `latitude`, `longitude`. **Second:** only coordinates — UI shows formatted lat/long when name and address are absent.",
      },
    },
  },
}

/* ── Contact (ContactPayload) ── */

export const ContactMessage: Story = {
  name: "Contact · Full card vs minimal",
  decorators: listShell("msg-story-contact", 480),
  parameters: {
    docs: {
      description: {
        story:
          "**Full:** `name`, `phone`, `email`, `organization`. **Minimal:** `name` and `phone` only (email/org rows hidden).",
      },
    },
  },
}

/* ── List reply (ListReplyPayload) ── */

export const ListMessage: Story = {
  name: "List reply · Full vs minimal",
  decorators: listShell("msg-story-list", 440),
  parameters: {
    docs: {
      description: {
        story:
          "**Full:** `header`, `body`, `footer`, `buttonText`, and `sections` in mock data (interactive list rows are stored for API parity). **Minimal:** required `body` + `buttonText` only.",
      },
    },
  },
}
