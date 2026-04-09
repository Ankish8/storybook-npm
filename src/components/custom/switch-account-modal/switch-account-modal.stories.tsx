import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"
import React, { useState } from "react"
import { Button } from "../../ui/button"
import { SwitchAccountModal } from "./switch-account-modal"
import type { AffectedIntegration } from "./types"

const sampleIntegrations: AffectedIntegration[] = [
  { id: "int_1", name: "Google Sheets – Sales Data" },
  { id: "int_2", name: "Google Sheets – Support Tickets" },
  { id: "int_3", name: "Google Sheets – Reporting Bot" },
  { id: "int_4", name: "Google Sheets – Lead Capture" },
]

const longIntegrationList: AffectedIntegration[] = [
  ...sampleIntegrations,
  { id: "int_5", name: "Google Sheets – Onboarding Data" },
  { id: "int_6", name: "Google Sheets – Customer Feedback" },
  { id: "int_7", name: "Google Sheets – Inventory Tracker" },
  { id: "int_8", name: "Google Sheets – Order Processing" },
]

const meta: Meta<typeof SwitchAccountModal> = {
  title: "Custom/AI Bot/Composio/SwitchAccountModal",
  component: SwitchAccountModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A confirmation dialog shown when a user switches to a different connected account for a Composio toolkit.
Lists all currently-active integrations that will be affected by the switch.

### Installation

\`\`\`bash
npx myoperator-ui add switch-account-modal
\`\`\`

### Import

\`\`\`tsx
import { SwitchAccountModal } from "@/components/custom/switch-account-modal"
import type {
  AffectedIntegration,
  SwitchAccountModalProps,
} from "@/components/custom/switch-account-modal"
\`\`\`

### When to use

Pair this with \`AddIntegration\`. When the user clicks "Switch" on an inactive account, route the \`onSwitchAccount\` callback to open this modal. On Confirm, perform the switch and then update the \`connectedAccounts\` array so the new account has \`isActive: true\`.

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|---|---|---|---|
| Info Surface | \`--semantic-info-surface\` | Warning banner background | <span style="color:#ECF1FB">■</span> |
| Info Border | \`--semantic-info-border\` | Warning banner border | <span style="color:#A8C0EC">■</span> |
| Info Text | \`--semantic-info-text\` | Warning banner text + icon | <span style="color:#2F5398">■</span> |
| Layout Border | \`--semantic-border-layout\` | Modal border, integration list border | <span style="color:#E9EAEB">■</span> |
| Muted Text | \`--semantic-text-muted\` | Description, "Affected Integrations" label | <span style="color:#717680">■</span> |
| Primary | \`--semantic-primary\` | Confirm button | <span style="color:#343E55">■</span> |
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: false,
      description: "Controls modal visibility (handled internally in stories)",
    },
    onOpenChange: {
      description: "Called when modal open state changes",
    },
    accountId: {
      control: "text",
      description: "ID of the account being switched to (shown in description)",
    },
    affectedIntegrations: {
      control: "object",
      description: "List of integrations affected by the switch",
    },
    cancelLabel: {
      control: "text",
    },
    confirmLabel: {
      control: "text",
    },
    isConfirming: {
      control: "boolean",
      description: "Shows loading state on confirm button",
    },
    onCancel: { description: "Called when Cancel is clicked" },
    onConfirm: { description: "Called when Confirm is clicked" },
  },
  args: {
    accountId: "acc_z2sitok",
    affectedIntegrations: sampleIntegrations,
    onCancel: fn(),
    onConfirm: fn(),
    onOpenChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

function ModalPreview(
  args: Partial<React.ComponentProps<typeof SwitchAccountModal>>
) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Switch Account Modal
      </Button>
      <SwitchAccountModal
        accountId="acc_z2sitok"
        affectedIntegrations={sampleIntegrations}
        {...args}
        open={open}
        onOpenChange={setOpen}
        onCancel={() => {
          args.onCancel?.()
          setOpen(false)
        }}
        onConfirm={() => {
          args.onConfirm?.()
          setOpen(false)
        }}
      />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <ModalPreview {...args} />,
}

export const WithManyIntegrations: Story = {
  args: {
    affectedIntegrations: longIntegrationList,
  },
  render: (args) => <ModalPreview {...args} />,
}

export const NoAffectedIntegrations: Story = {
  args: {
    affectedIntegrations: [],
  },
  render: (args) => <ModalPreview {...args} />,
}

export const Confirming: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [isConfirming, setIsConfirming] = useState(false)
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Switch Account Modal
        </Button>
        <SwitchAccountModal
          accountId="acc_z2sitok"
          affectedIntegrations={sampleIntegrations}
          {...args}
          open={open}
          onOpenChange={setOpen}
          isConfirming={isConfirming}
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            setIsConfirming(true)
            setTimeout(() => {
              setIsConfirming(false)
              setOpen(false)
            }, 2000)
          }}
        />
      </div>
    )
  },
}

export const CustomLabels: Story = {
  args: {
    cancelLabel: "Keep current",
    confirmLabel: "Switch anyway",
  },
  render: (args) => <ModalPreview {...args} />,
}
