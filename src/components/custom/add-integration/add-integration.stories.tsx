import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"
import React, { useState } from "react"
import { Plus } from "lucide-react"
import { AddIntegration } from "./add-integration"
import { SwitchAccountModal } from "../switch-account-modal"
import type { AffectedIntegration } from "../switch-account-modal"
import { Button } from "../../ui/button"
import type {
  ComposioToolkit,
  ComposioConnectedAccount,
  AddIntegrationProps,
  AddIntegrationStep,
  ConnectionStatus,
  ConnectionErrorVariant,
} from "./types"

/* ------------------------------------------------------------------ */
/* Official brand SVG logos via data URIs (Simple Icons, brand colors) */
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
  googleDrive: svgUri(
    '<path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z"/>',
    "#4285F4"
  ),
  hubspot: svgUri(
    '<path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z"/>',
    "#FF7A59"
  ),
  salesforce: svgUri(
    '<path d="M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8"/>',
    "#00A1E0"
  ),
  slack: svgUri(
    '<path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>',
    "#4A154B"
  ),
  gmail: svgUri(
    '<path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>',
    "#EA4335"
  ),
  googleCalendar: svgUri(
    '<path d="M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z"/>',
    "#4285F4"
  ),
}

const sampleToolkits: ComposioToolkit[] = [
  {
    id: "tk_1",
    slug: "googlesheets",
    name: "Google Sheets",
    logo: logos.googleSheets,
    description: "Read and write data to Google Sheets spreadsheets",
  },
  {
    id: "tk_2",
    slug: "googledrive",
    name: "Google Drive",
    logo: logos.googleDrive,
    description: "Access files from Google Drive",
  },
  {
    id: "tk_3",
    slug: "hubspot",
    name: "HubSpot",
    logo: logos.hubspot,
    description: "Manage contacts, deals, and CRM data",
  },
  {
    id: "tk_4",
    slug: "salesforce",
    name: "Salesforce",
    logo: logos.salesforce,
    description: "Interact with Salesforce CRM data",
  },
  {
    id: "tk_5",
    slug: "slack",
    name: "Slack",
    logo: logos.slack,
    description: "Send messages and notifications to Slack channels",
  },
  {
    id: "tk_6",
    slug: "gmail",
    name: "Gmail",
    logo: logos.gmail,
    description: "Send and read emails via Gmail",
  },
  {
    id: "tk_7",
    slug: "googlecalendar",
    name: "Google Calendar",
    logo: logos.googleCalendar,
    description: "Manage calendar events and schedules",
  },
]

const sampleAccounts: ComposioConnectedAccount[] = [
  {
    id: "acc_89xv2m9",
    label: "acc_89xv2m9",
    createdBy: "Ankish Khatari",
    createdAt: "Jan 12, 2026",
    isActive: true,
  },
  {
    id: "acc_34pq7n1",
    label: "acc_34pq7n1",
    createdBy: "Ankish Khatari",
    createdAt: "Jan 10, 2026",
  },
]

/** Matches WABA Figma “Connect your Account” — Active, Expired, Initialized (spinner) */
const sampleAccountsFigmaStates: ComposioConnectedAccount[] = [
  {
    id: "acc_89xv2m9",
    label: "acc_89xv2m9",
    createdBy: "Ankish Khatri",
    createdAt: "Jan 12, 2026",
    accountStatus: "active",
  },
  {
    id: "acr_65xv532",
    label: "acr_65xv532",
    createdBy: "Ankish Khatri",
    createdAt: "Jan 10, 2026",
    accountStatus: "expired",
  },
  {
    id: "acr_init_1",
    label: "acr_65xv532",
    createdBy: "Ankish Khatri",
    createdAt: "Jan 10, 2026",
    accountStatus: "initialized",
  },
]

// Accounts where none is marked active — first clicked acts as "Continue"
const sampleAccountsNoActive: ComposioConnectedAccount[] = [
  {
    id: "acc_solo1",
    label: "acc_solo1",
    createdBy: "Ankish Khatari",
    createdAt: "Jan 12, 2026",
  },
]

// Sample affected integrations for the Switch Account confirmation flow
const sampleAffectedIntegrations: AffectedIntegration[] = [
  { id: "int_1", name: "Google Sheets – Sales Data" },
  { id: "int_2", name: "Google Sheets – Support Tickets" },
  { id: "int_3", name: "Google Sheets – Reporting Bot" },
  { id: "int_4", name: "Google Sheets – Lead Capture" },
]

/* ================================================================== */
/* Trigger button used in all stories                                  */
/* ================================================================== */

const IntegrationsTrigger = ({ onClick }: { onClick: () => void }) => (
  <Button variant="outline" onClick={onClick}>
    <Plus className="size-4" />
    Integrations
  </Button>
)

const meta: Meta<typeof AddIntegration> = {
  title: "Custom/AI Bot/Composio/AddIntegration",
  component: AddIntegration,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Multi-step integration wizard for connecting Composio toolkits. Opens as a modal dialog. Supports toolkit selection, account connection with existing accounts, auth loading, and success states.

\`\`\`bash
npx myoperator-ui add add-integration
\`\`\`

## Import

\`\`\`tsx
import { AddIntegration } from "@/components/custom/add-integration"
import type {
  ComposioToolkit,
  ComposioConnectedAccount,
  AddIntegrationStep,
  ConnectionStatus,
} from "@/components/custom/add-integration"
\`\`\`

## Usage

\`\`\`tsx
const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>+ Integrations</Button>
<AddIntegration
  open={open}
  onOpenChange={setOpen}
  toolkits={toolkits}
  onClose={() => setOpen(false)}
  onNext={(data) => { /* advance to step 2 */ }}
/>
\`\`\`

## Design Tokens

<table>
  <thead>
    <tr>
      <th>Token</th>
      <th>CSS Variable</th>
      <th>Usage</th>
      <th>Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Brand Border</td>
      <td><code>--semantic-brand</code></td>
      <td>Selected toolkit card border</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-brand);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Background UI</td>
      <td><code>--semantic-bg-ui</code></td>
      <td>Toolkit icon circle background</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-bg-ui);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Success Surface</td>
      <td><code>--semantic-success-surface</code></td>
      <td>Success checkmark background</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-success-surface);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Text Primary</td>
      <td><code>--semantic-text-primary</code></td>
      <td>Headings and labels</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-text-primary);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Text Muted</td>
      <td><code>--semantic-text-muted</code></td>
      <td>Descriptions and subtitles</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-text-muted);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Border Layout</td>
      <td><code>--semantic-border-layout</code></td>
      <td>Card borders and dividers</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-border-layout);border:1px solid #e5e7eb" /></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: false },
    onOpenChange: { control: false },
    step: {
      control: "select",
      options: ["select-toolkit", "connect-account", "success"],
    },
    connectionStatus: {
      control: "select",
      options: ["idle", "connecting", "success", "error"],
    },
    integrationName: { control: "text" },
    searchQuery: { control: "text" },
    isLoadingToolkits: { control: "boolean" },
    isToolkitLoadError: { control: "boolean" },
    integrationNameError: { control: "text" },
    connectionErrorVariant: {
      control: "select",
      options: ["platform", "redirect", "inline"],
    },
  },
  args: {
    onClose: fn(),
    onNext: fn(),
    onBack: fn(),
    onToolkitSelect: fn(),
    onIntegrationNameChange: fn(),
    onSearchChange: fn(),
    onConnectNewAccount: fn(),
    onContinueAccount: fn(),
    onSwitchAccount: fn(),
    onRetryLoadToolkits: fn(),
    onRetryConnection: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

/* ================================================================== */
/* Reusable modal wrapper for args-based stories                       */
/* ================================================================== */

const ModalStory = (props: AddIntegrationProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IntegrationsTrigger onClick={() => setOpen(true)} />
      <AddIntegration
        {...props}
        open={open}
        onOpenChange={setOpen}
        onClose={() => {
          props.onClose?.()
          setOpen(false)
        }}
      />
    </>
  )
}

/* ================================================================== */
/* Individual State Stories                                            */
/* ================================================================== */

// ---------- Default (Interactive Step 1) ----------
const DefaultExample = () => {
  const [open, setOpen] = useState(false)
  const [selectedToolkit, setSelectedToolkit] =
    useState<ComposioToolkit | null>(null)
  const [integrationName, setIntegrationName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <IntegrationsTrigger onClick={() => setOpen(true)} />
      <AddIntegration
        open={open}
        onOpenChange={setOpen}
        toolkits={sampleToolkits}
        step="select-toolkit"
        selectedToolkit={selectedToolkit}
        integrationName={integrationName}
        searchQuery={searchQuery}
        onToolkitSelect={setSelectedToolkit}
        onIntegrationNameChange={setIntegrationName}
        onSearchChange={setSearchQuery}
        onNext={(data) =>
          console.log(
            "Next:",
            data.integrationName,
            data.selectedToolkit?.name ?? "(no toolkit selected)"
          )
        }
        onClose={() => setOpen(false)}
      />
    </>
  )
}

export const Default: Story = {
  render: () => <DefaultExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive Step 1 — click "+ Integrations" to open the modal. Select a toolkit and enter an integration name to enable Next.',
      },
    },
  },
}

// ---------- Step 1: Pre-selected ----------
export const SelectToolkitWithSelection: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "select-toolkit",
    selectedToolkit: sampleToolkits[0],
    integrationName: "My Google Sheets Integration",
    searchQuery: "",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Step 1 with Google Sheets pre-selected and name filled. Next button is enabled.",
      },
    },
  },
}

// ---------- Step 2: Connect (empty) ----------
export const ConnectAccountEmpty: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "connect-account",
    connectionStatus: "idle",
    connectedAccounts: [],
    selectedToolkit: sampleToolkits[0],
    currentStepNumber: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 2 — no existing accounts. Only the "+ Connect a New Account" button is shown.',
      },
    },
  },
}

// ---------- Step 2: Connect (existing accounts — Figma states) ----------
export const ConnectAccountWithExisting: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "connect-account",
    connectionStatus: "idle",
    connectedAccounts: sampleAccountsFigmaStates,
    selectedToolkit: sampleToolkits[0],
    currentStepNumber: 2,
    totalSteps: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Step 2 — matches [WABA Figma](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=41911-35107): **Active** (Continue), **Expired** (Reconnect), **Initialized** (spinner). Use `accountStatus` on each `ComposioConnectedAccount`, or omit it and rely on `isActive` for Active / Switch / Continue.",
      },
    },
  },
}

/** Two-account legacy flow: one active, one inactive (Switch) */
export const ConnectAccountWithExistingLegacy: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "connect-account",
    connectionStatus: "idle",
    connectedAccounts: sampleAccounts,
    selectedToolkit: sampleToolkits[0],
    currentStepNumber: 2,
    totalSteps: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Same as before explicit `accountStatus`: one `isActive: true` row (Continue + Active badge) and one inactive row (Switch).",
      },
    },
  },
}

export const ConnectAccountHideNewAccountButton: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "connect-account",
    connectionStatus: "idle",
    connectedAccounts: sampleAccountsFigmaStates,
    selectedToolkit: sampleToolkits[0],
    currentStepNumber: 2,
    totalSteps: 3,
    showConnectNewAccountButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: "`showConnectNewAccountButton={false}` hides the “Connect a New Account” footer.",
      },
    },
  },
}

// ---------- Step 2: Connect (single account, no active) ----------
export const ConnectAccountSingleNoActive: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "connect-account",
    connectionStatus: "idle",
    connectedAccounts: sampleAccountsNoActive,
    selectedToolkit: sampleToolkits[0],
    currentStepNumber: 2,
    totalSteps: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 2 — a single existing account with no `isActive` flag. Because no other account is active, the sole account shows a **Continue** action (treated as the active one).',
      },
    },
  },
}

// ---------- Step 1: Loading Toolkits ----------
export const ToolkitLoading: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: [],
    step: "select-toolkit",
    isLoadingToolkits: true,
    totalSteps: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 1 — Toolkits are being fetched. Shows a spinner with "Loading..." text.',
      },
    },
  },
}

// ---------- Step 1: Toolkit Load Error ----------
export const ToolkitLoadError: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: [],
    step: "select-toolkit",
    isToolkitLoadError: true,
    totalSteps: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 1 — Toolkit fetch failed. Shows error message with a "Please Try Again" retry button.',
      },
    },
  },
}

// ---------- Step 1: Integration Name Error ----------
export const IntegrationNameError: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "select-toolkit",
    selectedToolkit: sampleToolkits[0],
    integrationName: "Lead score",
    integrationNameError:
      '"Integration test 1" already exists. Please enter a unique name.',
    totalSteps: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Step 1 — Integration name validation error. Red border on input with error message below.",
      },
    },
  },
}

// ---------- Step 2: Auth Loading ----------
export const AuthLoading: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "connect-account",
    connectionStatus: "connecting",
    selectedToolkit: sampleToolkits[0],
    currentStepNumber: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Auth in progress — spinner while the user authorises in the external OAuth window.",
      },
    },
  },
}

// ---------- Step 2: Auth Error — Platform ----------
export const AuthErrorPlatform: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "connect-account",
    connectionStatus: "error",
    connectionErrorVariant: "platform",
    selectedToolkit: sampleToolkits[0],
    currentStepNumber: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Auth failed — "Connection Failed" error banner with red surface, XCircle icon, and full-width "Please Try Again" button.',
      },
    },
  },
}

// ---------- Step 2: Auth Error — Redirect ----------
export const AuthErrorRedirect: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "connect-account",
    connectionStatus: "error",
    connectionErrorVariant: "redirect",
    selectedToolkit: sampleToolkits[0],
    currentStepNumber: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Auth failed in a new tab — centered warning triangle icon with "Connection Failed" heading and compact retry button.',
      },
    },
  },
}

// ---------- Step 2: Auth Error — Inline ----------
export const AuthErrorInline: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "connect-account",
    connectionStatus: "error",
    connectionErrorVariant: "inline",
    connectedAccounts: sampleAccounts,
    selectedToolkit: sampleToolkits[0],
    currentStepNumber: 2,
    totalSteps: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Auth failed while existing accounts are visible — the "+ Connect a New Account" button is replaced with a "Connection Failed" error banner and a light "Retry Connection" button. The accounts list stays visible and interactive.',
      },
    },
  },
}

// ---------- Step 3: Success ----------
export const Success: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    toolkits: sampleToolkits,
    step: "success",
    selectedToolkit: sampleToolkits[0],
    currentStepNumber: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Success — green checkmark and confirmation after a successful connection.",
      },
    },
  },
}

/* ================================================================== */
/* Scenario Flow Stories                                               */
/* ================================================================== */

// ---------- Scenario 1: Happy Path — New Account ----------
const Scenario1Example = () => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<AddIntegrationStep>("select-toolkit")
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle")
  const [selectedToolkit, setSelectedToolkit] =
    useState<ComposioToolkit | null>(null)
  const [integrationName, setIntegrationName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleNext = () => {
    setStep("connect-account")
    setConnectionStatus("idle")
  }

  const handleConnectNewAccount = () => {
    setConnectionStatus("connecting")
    setTimeout(() => {
      setConnectionStatus("idle")
      setStep("success")
    }, 2000)
  }

  const handleBack = () => {
    if (step === "connect-account") {
      setStep("select-toolkit")
      setConnectionStatus("idle")
    } else if (step === "success") {
      setStep("connect-account")
      setConnectionStatus("idle")
    }
  }

  const handleClose = () => {
    setOpen(false)
    setStep("select-toolkit")
    setConnectionStatus("idle")
    setSelectedToolkit(null)
    setIntegrationName("")
    setSearchQuery("")
  }

  return (
    <>
      <IntegrationsTrigger onClick={() => setOpen(true)} />
      <AddIntegration
        open={open}
        onOpenChange={setOpen}
        toolkits={sampleToolkits}
        connectedAccounts={[]}
        step={step}
        connectionStatus={connectionStatus}
        selectedToolkit={selectedToolkit}
        integrationName={integrationName}
        searchQuery={searchQuery}
        totalSteps={4}
        onToolkitSelect={setSelectedToolkit}
        onIntegrationNameChange={setIntegrationName}
        onSearchChange={setSearchQuery}
        onNext={handleNext}
        onConnectNewAccount={handleConnectNewAccount}
        onBack={handleBack}
        onClose={handleClose}
      />
    </>
  )
}

export const Scenario1_HappyPath_NewAccount: Story = {
  render: () => <Scenario1Example />,
  parameters: {
    docs: {
      description: {
        story: `**Scenario 1 — Happy Path (New Account)**

Flow: Select Toolkit → Connect Account (empty) → Auth Loading (2s) → Success

1. Click **"+ Integrations"** to open the modal
2. Select a toolkit and enter an integration name
3. Click **Next** to go to Step 2
4. Click **"+ Connect a New Account"** to start auth
5. Spinner shows for 2 seconds, then success screen`,
      },
    },
  },
}

// ---------- Scenario 2: Happy Path — Existing Account ----------
const Scenario2Example = () => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<AddIntegrationStep>("select-toolkit")
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle")
  const [selectedToolkit, setSelectedToolkit] =
    useState<ComposioToolkit | null>(null)
  const [integrationName, setIntegrationName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [accounts, setAccounts] =
    useState<ComposioConnectedAccount[]>(sampleAccounts)
  const [pendingSwitchAccount, setPendingSwitchAccount] =
    useState<ComposioConnectedAccount | null>(null)

  const handleNext = () => {
    setStep("connect-account")
    setConnectionStatus("idle")
  }

  const handleContinueAccount = () => {
    setStep("success")
  }

  const handleSwitchAccount = (account: ComposioConnectedAccount) => {
    setPendingSwitchAccount(account)
  }

  const handleConfirmSwitch = () => {
    if (!pendingSwitchAccount) return
    setAccounts((prev) =>
      prev.map((a) => ({ ...a, isActive: a.id === pendingSwitchAccount.id }))
    )
    setPendingSwitchAccount(null)
  }

  const handleConnectNewAccount = () => {
    setConnectionStatus("connecting")
    setTimeout(() => {
      setConnectionStatus("idle")
      setStep("success")
    }, 2000)
  }

  const handleBack = () => {
    if (step === "connect-account") {
      setStep("select-toolkit")
      setConnectionStatus("idle")
    } else if (step === "success") {
      setStep("connect-account")
      setConnectionStatus("idle")
    }
  }

  const handleClose = () => {
    setOpen(false)
    setStep("select-toolkit")
    setConnectionStatus("idle")
    setSelectedToolkit(null)
    setIntegrationName("")
    setSearchQuery("")
    setAccounts(sampleAccounts)
    setPendingSwitchAccount(null)
  }

  return (
    <>
      <IntegrationsTrigger onClick={() => setOpen(true)} />
      <AddIntegration
        open={open}
        onOpenChange={setOpen}
        toolkits={sampleToolkits}
        connectedAccounts={accounts}
        step={step}
        connectionStatus={connectionStatus}
        selectedToolkit={selectedToolkit}
        integrationName={integrationName}
        searchQuery={searchQuery}
        totalSteps={3}
        onToolkitSelect={setSelectedToolkit}
        onIntegrationNameChange={setIntegrationName}
        onSearchChange={setSearchQuery}
        onNext={handleNext}
        onConnectNewAccount={handleConnectNewAccount}
        onContinueAccount={handleContinueAccount}
        onSwitchAccount={handleSwitchAccount}
        onBack={handleBack}
        onClose={handleClose}
      />
      <SwitchAccountModal
        open={pendingSwitchAccount !== null}
        onOpenChange={(next) => {
          if (!next) setPendingSwitchAccount(null)
        }}
        accountId={pendingSwitchAccount?.id ?? ""}
        affectedIntegrations={sampleAffectedIntegrations}
        onCancel={() => setPendingSwitchAccount(null)}
        onConfirm={handleConfirmSwitch}
      />
    </>
  )
}

export const Scenario2_HappyPath_ExistingAccount: Story = {
  render: () => <Scenario2Example />,
  parameters: {
    docs: {
      description: {
        story: `**Scenario 2 — Happy Path (Existing Account, Switch Flow)**

Flow: Select Toolkit → Connect Account (accounts list with one active) → either **Continue** the active one or **Switch** to a different account via the confirmation modal.

1. Click **"+ Integrations"** to open the modal
2. Select a toolkit and enter an integration name, click **Next**
3. On step 2, the first account has \`isActive: true\` (green border + Active badge)
4. Click **Continue** on the active account to go straight to success
5. Click **Switch** on an inactive account to open the \`SwitchAccountModal\` confirmation
6. Confirm the switch — the \`isActive\` flag moves to the newly-chosen account`,
      },
    },
  },
}

// ---------- Scenario 3: Toolkit Load Failure ----------
const Scenario3Example = () => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<AddIntegrationStep>("select-toolkit")
  const [selectedToolkit, setSelectedToolkit] =
    useState<ComposioToolkit | null>(null)
  const [integrationName, setIntegrationName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [loadedToolkits, setLoadedToolkits] = useState<ComposioToolkit[]>([])
  const [nameError, setNameError] = useState("")
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle")

  const handleOpen = () => {
    setOpen(true)
    setIsLoading(true)
    setIsError(false)
    // Simulate initial load failure
    setTimeout(() => {
      setIsLoading(false)
      setIsError(true)
    }, 1500)
  }

  const handleRetry = () => {
    setIsError(false)
    setIsLoading(true)
    // Simulate successful retry
    setTimeout(() => {
      setIsLoading(false)
      setLoadedToolkits(sampleToolkits)
    }, 1500)
  }

  const handleNameChange = (name: string) => {
    setIntegrationName(name)
    // Simulate name validation — "Lead score" triggers error
    if (name.toLowerCase() === "lead score") {
      setNameError(
        '"Integration test 1" already exists. Please enter a unique name.'
      )
    } else {
      setNameError("")
    }
  }

  const handleNext = () => {
    if (nameError) return
    setStep("connect-account")
    setConnectionStatus("idle")
  }

  const handleConnectNewAccount = () => {
    setConnectionStatus("connecting")
    setTimeout(() => {
      setConnectionStatus("idle")
      setStep("success")
    }, 2000)
  }

  const handleBack = () => {
    if (step === "connect-account") {
      setStep("select-toolkit")
      setConnectionStatus("idle")
    } else if (step === "success") {
      setStep("connect-account")
      setConnectionStatus("idle")
    }
  }

  const handleClose = () => {
    setOpen(false)
    setStep("select-toolkit")
    setConnectionStatus("idle")
    setSelectedToolkit(null)
    setIntegrationName("")
    setSearchQuery("")
    setNameError("")
    setLoadedToolkits([])
  }

  return (
    <>
      <IntegrationsTrigger onClick={handleOpen} />
      <AddIntegration
        open={open}
        onOpenChange={setOpen}
        toolkits={loadedToolkits}
        step={step}
        connectionStatus={connectionStatus}
        selectedToolkit={selectedToolkit}
        integrationName={integrationName}
        searchQuery={searchQuery}
        isLoadingToolkits={isLoading}
        isToolkitLoadError={isError}
        integrationNameError={nameError}
        totalSteps={3}
        onToolkitSelect={setSelectedToolkit}
        onIntegrationNameChange={handleNameChange}
        onSearchChange={setSearchQuery}
        onRetryLoadToolkits={handleRetry}
        onNext={handleNext}
        onConnectNewAccount={handleConnectNewAccount}
        onBack={handleBack}
        onClose={handleClose}
      />
    </>
  )
}

export const Scenario3_ToolkitLoadFailure: Story = {
  render: () => <Scenario3Example />,
  parameters: {
    docs: {
      description: {
        story: `**Scenario 3 — Toolkit Load Failure**

Flow: Loading (1.5s) → Failed → Retry → Loading (1.5s) → Toolkits loaded → Name error → Fix name → Next → Connect → Success

1. Click **"+ Integrations"** — modal opens with loading state
2. Toolkits fail after 1.5s — click **"Please Try Again"** to retry
3. Type **"Lead score"** as integration name to trigger a validation error
4. Change the name to something else to clear the error
5. Select a toolkit and click **Next** to continue the flow`,
      },
    },
  },
}

// ---------- Scenario 4: Auth Failure ----------
const Scenario4Example = () => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<AddIntegrationStep>("select-toolkit")
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle")
  const [connectionErrorVariant, setConnectionErrorVariant] =
    useState<ConnectionErrorVariant>("platform")
  const [selectedToolkit, setSelectedToolkit] =
    useState<ComposioToolkit | null>(null)
  const [integrationName, setIntegrationName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  const handleNext = () => {
    setStep("connect-account")
    setConnectionStatus("idle")
  }

  const handleConnectNewAccount = () => {
    setConnectionStatus("connecting")
    // First attempt fails with platform error
    setTimeout(() => {
      setConnectionStatus("error")
      setConnectionErrorVariant("platform")
    }, 2000)
  }

  const handleRetryConnection = () => {
    setRetryCount((c) => c + 1)
    setConnectionStatus("connecting")

    if (retryCount === 0) {
      // Second attempt fails with redirect error
      setTimeout(() => {
        setConnectionStatus("error")
        setConnectionErrorVariant("redirect")
      }, 2000)
    } else {
      // Third attempt succeeds
      setTimeout(() => {
        setConnectionStatus("idle")
        setStep("success")
      }, 2000)
    }
  }

  const handleBack = () => {
    if (step === "connect-account") {
      setStep("select-toolkit")
      setConnectionStatus("idle")
      setRetryCount(0)
    } else if (step === "success") {
      setStep("connect-account")
      setConnectionStatus("idle")
    }
  }

  const handleClose = () => {
    setOpen(false)
    setStep("select-toolkit")
    setConnectionStatus("idle")
    setSelectedToolkit(null)
    setIntegrationName("")
    setSearchQuery("")
    setRetryCount(0)
  }

  return (
    <>
      <IntegrationsTrigger onClick={() => setOpen(true)} />
      <AddIntegration
        open={open}
        onOpenChange={setOpen}
        toolkits={sampleToolkits}
        connectedAccounts={sampleAccounts}
        step={step}
        connectionStatus={connectionStatus}
        connectionErrorVariant={connectionErrorVariant}
        selectedToolkit={selectedToolkit}
        integrationName={integrationName}
        searchQuery={searchQuery}
        totalSteps={4}
        onToolkitSelect={setSelectedToolkit}
        onIntegrationNameChange={setIntegrationName}
        onSearchChange={setSearchQuery}
        onNext={handleNext}
        onConnectNewAccount={handleConnectNewAccount}
        onRetryConnection={handleRetryConnection}
        onBack={handleBack}
        onClose={handleClose}
        onContinueAccount={() => console.log("Continue existing")}
        onSwitchAccount={(account) =>
          console.log("Switch account:", account.id)
        }
      />
    </>
  )
}

export const Scenario4_AuthFailure: Story = {
  render: () => <Scenario4Example />,
  parameters: {
    docs: {
      description: {
        story: `**Scenario 4 — Auth Failure**

Flow: Select Toolkit → Connect Account → Auth Loading (2s) → Platform Error → Retry → Auth Loading (2s) → Redirect Error → Retry → Auth Loading (2s) → Success

1. Click **"+ Integrations"** to open the modal
2. Select a toolkit and enter an integration name, click **Next**
3. Click **"+ Connect a New Account"** to start auth
4. Auth fails after 2s — shows **platform error** with red error banner
5. Click **"Please Try Again"** — auth fails again with **redirect error** (warning triangle)
6. Click **"Please Try Again"** again — auth succeeds this time`,
      },
    },
  },
}
