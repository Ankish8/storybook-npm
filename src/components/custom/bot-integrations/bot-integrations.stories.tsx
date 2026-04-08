import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"
import { useState } from "react"
import { Puzzle } from "lucide-react"
import { BotIntegrations } from "./bot-integrations"
import type { IntegrationItem } from "./types"

/* ------------------------------------------------------------------ */
/* Official brand SVG logos via data URIs (same as Composio stories)   */
/* ------------------------------------------------------------------ */
const svgUri = (path: string, fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}">${path}</svg>`
  )}`

const logos = {
  googleSheets: svgUri(
    '<path d="M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z"/>',
    "#0F9D58"
  ),
  hubspot: svgUri(
    '<path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z"/>',
    "#FF7A59"
  ),
  slack: svgUri(
    '<path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>',
    "#4A154B"
  ),
}

const IntegrationIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="size-[30px] object-contain" />
)

const meta: Meta<typeof BotIntegrations> = {
  title: "Custom/AI Bot/Bot Config/BotIntegrations",
  component: BotIntegrations,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Integrations section for bot configuration. Shows connected integrations with icon, status, subtitle, description, and configure/edit/delete actions — or a compact empty state placeholder.

**Install**
\`\`\`bash
npx myoperator-ui add bot-integrations
\`\`\`

**Import**
\`\`\`tsx
import { BotIntegrations } from "@/components/custom/bot-integrations"
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`integrations\` | \`IntegrationItem[]\` | — | List of integrations to display |
| \`onAdd\` | \`() => void\` | — | Called when user clicks "+ Integrations" |
| \`onConfigure\` | \`(id: string) => void\` | — | Configure handler. Omit to hide configure buttons |
| \`onEdit\` | \`(id: string) => void\` | — | Edit handler. Omit to hide edit buttons |
| \`onDelete\` | \`(id: string) => void\` | — | Delete handler. Omit to hide delete buttons |
| \`configureLabel\` | \`string\` | \`"Configure"\` | Label for the configure button |
| \`emptyStateTitle\` | \`string\` | \`"No integrations yet"\` | Title in empty state |
| \`emptyStateDescription\` | \`string\` | — | Description in empty state |
| \`emptyStateIcon\` | \`ReactNode\` | Blocks icon | Custom icon for empty state |
| \`infoTooltip\` | \`string\` | — | Tooltip text on the info icon |
| \`disabled\` | \`boolean\` | \`false\` | Disables add/configure/edit/delete buttons |

### IntegrationItem

| Field | Type | Description |
|-------|------|-------------|
| \`id\` | \`string\` | Unique identifier |
| \`name\` | \`string\` | Integration name |
| \`icon\` | \`ReactNode\` | Integration logo / icon |
| \`status\` | \`string\` | Status badge text (e.g., "Connected") |
| \`statusVariant\` | \`"active" \\| "default" \\| "destructive" \\| "disabled"\` | Badge color variant |
| \`subtitle\` | \`string\` | Subtitle (e.g., "Google Sheets • 1 tool configured") |
| \`description\` | \`string\` | Description, truncated to one line |

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|---|---|---|---|
| Surface | \`--semantic-bg-primary\` | Icon circle background | <span style="color:#FFFFFF">■</span> |
| Empty bg | \`--color-neutral-50\` | Empty state container | <span style="color:#FAFAFA">■</span> |
| Empty border | \`--color-neutral-100\` | Empty state border | <span style="color:#F5F5F5">■</span> |
| Icon bg | \`--semantic-info-surface-subtle\` | Integration icon container | <span style="color:#F6F8FD">■</span> |
| Border | \`--semantic-border-layout\` | Section dividers | <span style="color:#E9EAEB">■</span> |
| Title | \`--semantic-text-primary\` | Section title, item names | <span style="color:#181D27">■</span> |
| Muted | \`--semantic-text-muted\` | Subtitle, description | <span style="color:#717680">■</span> |`,
      },
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

const SIMPLE_INTEGRATIONS: IntegrationItem[] = [
  { id: "int-1", name: "Google Sheets" },
  { id: "int-2", name: "Slack" },
  { id: "int-3", name: "HubSpot CRM" },
]

const RICH_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "int-1",
    name: "Lead Capture Sheet",
    icon: <IntegrationIcon src={logos.googleSheets} alt="Google Sheets" />,
    status: "Connected",
    statusVariant: "active",
    subtitle: "Google Sheets • 1 tool configured",
    description:
      'Log all incoming patient leads to the centralized Hospital Leads sheet.',
  },
  {
    id: "int-2",
    name: "CRM Sync",
    icon: <IntegrationIcon src={logos.hubspot} alt="HubSpot" />,
    status: "Connected",
    statusVariant: "active",
    subtitle: "HubSpot CRM • 2 tools configured",
    description: "Sync contacts and deals to HubSpot automatically.",
  },
  {
    id: "int-3",
    name: "Team Notifications",
    icon: <IntegrationIcon src={logos.slack} alt="Slack" />,
    status: "Connected",
    statusVariant: "active",
    subtitle: "Slack • 1 tool configured",
    description: "Send real-time alerts to the support channel.",
  },
]

/** Default empty state with no integrations connected. */
export const Default: Story = {
  args: {
    integrations: [],
    infoTooltip:
      "Connect external apps to extend your bot's capabilities",
    onAdd: fn(),
  },
  render: (args) => (
    <div className="max-w-[750px]">
      <BotIntegrations {...args} />
    </div>
  ),
}

/** Shows rich integration items with real brand icons, status, subtitle, description, and actions. */
export const WithIntegrations: Story = {
  render: function Render() {
    const [items, setItems] = useState<IntegrationItem[]>(RICH_INTEGRATIONS)
    return (
      <div className="max-w-[750px]">
        <BotIntegrations
          integrations={items}
          infoTooltip="Connect external apps to extend your bot's capabilities"
          onAdd={fn()}
          onConfigure={fn()}
          onEdit={fn()}
          onDelete={(id) =>
            setItems((prev) => prev.filter((item) => item.id !== id))
          }
        />
      </div>
    )
  },
}

/** Simple integrations without icons or metadata — backward compatible with basic IntegrationItem. */
export const SimpleIntegrations: Story = {
  render: function Render() {
    const [items, setItems] = useState<IntegrationItem[]>(SIMPLE_INTEGRATIONS)
    return (
      <div className="max-w-[750px]">
        <BotIntegrations
          integrations={items}
          infoTooltip="Connect external apps to extend your bot's capabilities"
          onAdd={fn()}
          onEdit={fn()}
          onDelete={(id) =>
            setItems((prev) => prev.filter((item) => item.id !== id))
          }
        />
      </div>
    )
  },
}

/** Empty state with custom title, description, and icon. */
export const CustomEmptyState: Story = {
  args: {
    integrations: [],
    emptyStateTitle: "No apps connected",
    emptyStateDescription:
      "Link your favourite tools to automate workflows.",
    emptyStateIcon: <Puzzle className="size-6 text-semantic-text-muted" />,
    onAdd: fn(),
  },
  render: (args) => (
    <div className="max-w-[750px]">
      <BotIntegrations {...args} />
    </div>
  ),
}

/** All interactions disabled. Add, configure, edit, and delete buttons are non-interactive. */
export const Disabled: Story = {
  args: {
    integrations: RICH_INTEGRATIONS,
    onAdd: fn(),
    onConfigure: fn(),
    onEdit: fn(),
    onDelete: fn(),
    infoTooltip: "Connect external apps to extend your bot's capabilities",
    disabled: true,
  },
  render: (args) => (
    <div className="max-w-[750px]">
      <BotIntegrations {...args} />
    </div>
  ),
}
