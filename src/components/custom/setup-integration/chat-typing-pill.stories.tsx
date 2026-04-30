import type { Meta, StoryObj } from "@storybook/react"
import { ChatTypingPill } from "./chat-typing-pill"

const meta: Meta<typeof ChatTypingPill> = {
  title: "Custom/AI Bot/Composio/SetupIntegration/ChatTypingPill",
  component: ChatTypingPill,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Three-dot typing indicator wrapped in the chat bubble pill used by Setup Integration. Renders when a chat message is in a loading state (\`isLoading: true\` or \`variant: "loading"\`). The dots themselves are the canonical \`BouncingLoader\` from \`@/components/ui/bouncing-loader\`.

\`\`\`tsx
import { ChatTypingPill } from "@/components/custom/setup-integration"
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
