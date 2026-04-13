import type { Meta, StoryObj } from "@storybook/react"
import { SenderIndicator } from "./sender-indicator"
import { TooltipProvider } from "../../ui/tooltip"

const meta: Meta<typeof SenderIndicator> = {
  title: "Custom/Chat/Sender Indicator",
  component: SenderIndicator,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A circular badge that identifies who sent a message. Displays agent initials, a bot icon, a campaign megaphone, or an API plug icon depending on the sender type. Includes an optional tooltip showing the full sender name.

### Sender types

| Type | Display |
|------|---------|
| \`agent\` | Two-letter initials from the agent's name |
| \`bot\` | Bot icon |
| \`campaign\` | Megaphone icon |
| \`api\` | Plug icon |

### Installation

\`\`\`bash
npx myoperator-ui add sender-indicator
\`\`\`

### Import

\`\`\`tsx
import { SenderIndicator } from "@/components/custom/sender-indicator"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------:|
| Badge background | \`bg-white\` | Badge circle | <span style="color:#ffffff;background:#000;padding:0 4px">\\u25a0</span> \`#FFFFFF\` |
| Badge border | \`--semantic-border-layout\` | Circle outline | <span style="color:#e9eaeb">\\u25a0</span> \`#E9EAEB\` |
| Icon color | \`--semantic-text-muted\` | Bot/Campaign/API icons | <span style="color:#717680">\\u25a0</span> \`#717680\` |
| Initials text | \`--semantic-text-secondary\` | Agent initials | <span style="color:#414651">\\u25a0</span> \`#414651\` |
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div style={{ padding: 40 }}>
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SenderIndicator>

export const Agent: Story = {
  args: {
    sentBy: { type: "agent", name: "Alex Smith" },
    withTooltip: true,
  },
}

export const Bot: Story = {
  args: {
    sentBy: { type: "bot", name: "SalesBot" },
    withTooltip: true,
  },
}

export const Campaign: Story = {
  args: {
    sentBy: { type: "campaign" },
    withTooltip: true,
  },
}

export const API: Story = {
  args: {
    sentBy: { type: "api", name: "Zapier" },
    withTooltip: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <SenderIndicator sentBy={{ type: "agent", name: "Rahul Sharma" }} withTooltip />
        <span className="text-[11px] text-semantic-text-muted">Agent</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SenderIndicator sentBy={{ type: "bot", name: "IVR Bot" }} withTooltip />
        <span className="text-[11px] text-semantic-text-muted">Bot</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SenderIndicator sentBy={{ type: "campaign" }} withTooltip />
        <span className="text-[11px] text-semantic-text-muted">Campaign</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SenderIndicator sentBy={{ type: "api", name: "Zapier" }} withTooltip />
        <span className="text-[11px] text-semantic-text-muted">API</span>
      </div>
    </div>
  ),
}

export const WithoutTooltip: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SenderIndicator sentBy={{ type: "agent", name: "Priya Sharma" }} />
      <SenderIndicator sentBy={{ type: "bot" }} />
      <SenderIndicator sentBy={{ type: "campaign" }} />
      <SenderIndicator sentBy={{ type: "api" }} />
    </div>
  ),
}
