import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { BouncingLoader } from "../../ui/bouncing-loader"
import { ChatTypingPill } from "./chat-typing-pill"

const meta: Meta<typeof BouncingLoader> = {
  title: "Custom/AI Bot/Composio/SetupIntegration/UI Components",
  component: BouncingLoader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Reusable pieces used inside Setup Integration. **BouncingLoader** is the canonical three-dot indicator from UI components; **ChatTypingPill** wraps it in the chat bubble pill used for typing states.

\`\`\`bash
npx myoperator-ui add setup-integration
\`\`\`

## Import (barrel)

\`\`\`tsx
import {
  BouncingLoader,
  ChatTypingPill,
} from "@/components/custom/setup-integration"
\`\`\`

## Import (UI primitive only)

\`\`\`tsx
import { BouncingLoader } from "@/components/ui/bouncing-loader"
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "number",
      description: "Dot size in pixels (or a string length)",
    },
    spacing: {
      control: "number",
      description: "Gap between dots in pixels (or a string length)",
    },
    color: {
      control: "text",
      description: "Dot fill (CSS color or token)",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** Same primitive as \`Components/BouncingLoader\`; re-exported from the setup-integration package for convenience. */
export const BouncingLoaderOverview: Story = {
  name: "BouncingLoader",
  args: {
    size: 8,
    spacing: 6,
    color: "var(--semantic-text-placeholder)",
  },
}

/** Typing state in the transcript: pill + dots (uses \`BouncingLoader\` internally). */
export const ChatTypingPillStory: Story = {
  name: "ChatTypingPill",
  render: () => <ChatTypingPill />,
  parameters: {
    docs: {
      description: {
        story:
          "Used when `isLoading: true` (or `variant: \"loading\"`) on a user or assistant message. Right- or left-aligned by the parent row in `ChatMessageBubble`.",
      },
    },
  },
}
