import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"
import React, { useState } from "react"
import { Puzzle } from "lucide-react"
import { BotIntegrations } from "./bot-integrations"
import type {
  IntegrationItem,
  IntegrationItemWithRequiredDescription,
} from "./types"

/** Static row data — add \`onEdit\` / \`onDelete\` when passing to the component. */
type IntegrationRowSeed = Omit<IntegrationItem, "onEdit" | "onDelete">

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
        component: `Integrations section for bot configuration. Each row shows an icon, a single-line label, optional two-line description (with ellipsis when overflowing), and edit/delete actions — or a compact empty state placeholder. Hovering the label or description shows the full text via the native \`title\` tooltip.

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
| \`integrations\` | \`IntegrationItem[]\` | — | List of integrations; each row supplies its own handlers (see below) |
| \`descriptionRequirement\` | \`"optional" \\| "required"\` | \`"optional"\` | When \`"required"\`, TypeScript requires \`description\` on every item |
| \`onAdd\` | \`() => void\` | — | Called when user clicks "Add integration" |
| \`emptyStateTitle\` | \`string\` | \`"No integrations yet"\` | Title in empty state |
| \`emptyStateDescription\` | \`string\` | — | Description in empty state |
| \`emptyStateIcon\` | \`ReactNode\` | Blocks icon | Custom icon for empty state |
| \`infoTooltip\` | \`string\` | — | Tooltip text on the info icon |
| \`disabled\` | \`boolean\` | \`false\` | Disables add and row edit/delete buttons |

### IntegrationItem (per row)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| \`id\` | \`string\` | Yes | Unique key for the row |
| \`label\` | \`string\` | Yes | Title (single line + ellipsis; full text on hover via \`title\`) |
| \`icon\` | \`ReactNode\` | Yes | Logo / icon in the rounded tile |
| \`onEdit\` | \`() => void\` | Yes | Edit action for this row |
| \`onDelete\` | \`() => void\` | Yes | Delete action for this row |
| \`description\` | \`string\` | Optional* | Body copy (max two lines + ellipsis) — *required in TypeScript when \`descriptionRequirement="required"\` on the section |

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|---|---|---|---|
| Surface | \`--semantic-bg-primary\` | Icon circle background | <span style="color:#FFFFFF">■</span> |
| Empty surface | \`--semantic-bg-ui\` | Empty state container | <span style="color:#F5F5F5">■</span> |
| Empty border | \`--semantic-border-layout\` | Empty state border | <span style="color:#E9EAEB">■</span> |
| Icon tile | \`--semantic-info-surface-subtle\` | Integration icon container | <span style="color:#F6F8FD">■</span> |
| Border | \`--semantic-border-layout\` | Section dividers | <span style="color:#E9EAEB">■</span> |
| Title | \`--semantic-text-primary\` | Section title, item names | <span style="color:#181D27">■</span> |
| Muted | \`--semantic-text-muted\` | Description | <span style="color:#717680">■</span> |`,
      },
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof BotIntegrations>

const SIMPLE_SEEDS: IntegrationRowSeed[] = [
  {
    id: "int-1",
    label: "Google Sheets",
    icon: <IntegrationIcon src={logos.googleSheets} alt="Google Sheets" />,
  },
  {
    id: "int-2",
    label: "Slack",
    icon: <IntegrationIcon src={logos.slack} alt="Slack" />,
  },
  {
    id: "int-3",
    label: "HubSpot CRM",
    icon: <IntegrationIcon src={logos.hubspot} alt="HubSpot" />,
  },
]

const RICH_SEEDS: IntegrationRowSeed[] = [
  {
    id: "int-1",
    label: "Lead Capture Sheet",
    icon: <IntegrationIcon src={logos.googleSheets} alt="Google Sheets" />,
    description:
      "Log all incoming patient leads to the centralized Hospital Leads sheet. Captures new lead information directly from the chat interface and appends it as a new row.",
  },
  {
    id: "int-2",
    label: "CRM Sync",
    icon: <IntegrationIcon src={logos.hubspot} alt="HubSpot" />,
    description: "Sync contacts and deals to HubSpot automatically.",
  },
  {
    id: "int-3",
    label: "Team Notifications",
    icon: <IntegrationIcon src={logos.slack} alt="Slack" />,
    description: "Send real-time alerts to the support channel.",
  },
]

function attachRowHandlers(
  rows: IntegrationRowSeed[],
  onRemove: (id: string) => void
): IntegrationItem[] {
  return rows.map((row) => ({
    ...row,
    onEdit: fn(),
    onDelete: () => onRemove(row.id),
  }))
}

const REQUIRED_DESCRIPTION_ROWS: IntegrationItemWithRequiredDescription[] = [
  {
    id: "int-1",
    label: "Google Sheets",
    icon: <IntegrationIcon src={logos.googleSheets} alt="Google Sheets" />,
    description: "Spreadsheet sync is configured for this workspace.",
    onEdit: fn(),
    onDelete: fn(),
  },
  {
    id: "int-2",
    label: "Slack",
    icon: <IntegrationIcon src={logos.slack} alt="Slack" />,
    description: "Notifications go to #support when a lead is captured.",
    onEdit: fn(),
    onDelete: fn(),
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
    <div className="w-full max-w-[750px]">
      <BotIntegrations {...args} />
    </div>
  ),
}

/** Shows integration rows with icons, label, optional description, and actions (matches [Figma — Integrations](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=42771-56666)). */
export const WithIntegrations: Story = {
  render: function Render() {
    const [rows, setRows] = useState<IntegrationRowSeed[]>(RICH_SEEDS)
    const integrations = attachRowHandlers(rows, (id) =>
      setRows((prev) => prev.filter((row) => row.id !== id))
    )
    return (
      <div className="w-full max-w-[750px]">
        <BotIntegrations
          integrations={integrations}
          infoTooltip="Connect external apps to extend your bot's capabilities"
          onAdd={fn()}
        />
      </div>
    )
  },
}

/** Simple rows: icon + label only (no description). */
export const SimpleIntegrations: Story = {
  render: function Render() {
    const [rows, setRows] = useState<IntegrationRowSeed[]>(SIMPLE_SEEDS)
    const integrations = attachRowHandlers(rows, (id) =>
      setRows((prev) => prev.filter((row) => row.id !== id))
    )
    return (
      <div className="w-full max-w-[750px]">
        <BotIntegrations
          integrations={integrations}
          infoTooltip="Connect external apps to extend your bot's capabilities"
          onAdd={fn()}
        />
      </div>
    )
  },
}

/** Every row must include \`description\` when \`descriptionRequirement="required"\`. */
export const RequiredDescriptions: Story = {
  render: () => (
    <div className="w-full max-w-[750px]">
      <BotIntegrations
        descriptionRequirement="required"
        integrations={REQUIRED_DESCRIPTION_ROWS}
        infoTooltip="Connect external apps to extend your bot's capabilities"
        onAdd={fn()}
      />
    </div>
  ),
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
    <div className="w-full max-w-[750px]">
      <BotIntegrations {...args} />
    </div>
  ),
}

/** All interactions disabled. Add, edit, and delete controls are non-interactive. */
export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-[750px]">
      <BotIntegrations
        integrations={RICH_SEEDS.map((row) => ({
          ...row,
          onEdit: fn(),
          onDelete: fn(),
        }))}
        onAdd={fn()}
        infoTooltip="Connect external apps to extend your bot's capabilities"
        disabled
      />
    </div>
  ),
}
