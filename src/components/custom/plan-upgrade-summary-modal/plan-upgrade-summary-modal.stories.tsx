import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { fn } from "storybook/test";
import { Button } from "../../ui/button";
import { PlanUpgradeSummaryModal } from "./plan-upgrade-summary-modal";

const meta: Meta<typeof PlanUpgradeSummaryModal> = {
  title: "Custom/Plan & Payment/PlanUpgradeSummaryModal",
  component: PlanUpgradeSummaryModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A billing summary modal for confirming plan upgrades and downgrades before the user proceeds.

### Installation

\`\`\`bash
npx myoperator-ui add plan-upgrade-summary-modal
\`\`\`

### Import

\`\`\`tsx
import { PlanUpgradeSummaryModal } from "@/components/custom/plan-upgrade-summary-modal"
import type { PlanUpgradeSummaryModalProps } from "@/components/custom/plan-upgrade-summary-modal"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|---|---|---|---|
| Primary action | \`--semantic-primary\` | Primary CTA button | <span style="color:#343E55">■</span> |
| Modal surface | \`--semantic-bg-primary\` | Main modal background | <span style="color:#FFFFFF">■</span> |
| Panel surface | \`--semantic-bg-ui\` | Summary card background | <span style="color:#F5F5F5">■</span> |
| Muted text | \`--semantic-text-muted\` | Description and close icon | <span style="color:#717680">■</span> |
| Warning text | \`--semantic-warning-text\` | Upgrade status message | <span style="color:#B54708">■</span> |
| Success text | \`--semantic-success-text\` | Downgrade credit state | <span style="color:#067647">■</span> |
| Layout border | \`--semantic-border-layout\` | Modal and summary borders | <span style="color:#E9EAEB">■</span> |
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onOpenChange: fn(),
    onPrimaryAction: fn(),
    onCancel: fn(),
    onClose: fn(),
  },
  argTypes: {
    open: {
      control: false,
      description:
        "Controls modal visibility and is managed inside the story render function.",
    },
    onOpenChange: {
      description: "Called when the modal open state changes.",
    },
    mode: {
      control: "select",
      options: ["upgrade", "downgrade"],
      description: "Preset content mode for the billing summary.",
    },
    title: {
      control: "text",
      description: "Optional override for the modal title.",
    },
    description: {
      control: "text",
      description: "Supporting text displayed below the title.",
    },
    status: {
      control: "object",
      description:
        "Status title, optional message, and tone shown in the summary panel.",
    },
    rows: {
      control: "object",
      description: "Line items rendered in the summary panel.",
    },
    totalLabel: {
      control: "text",
      description: "Label shown for the total row.",
    },
    totalValue: {
      control: "text",
      description: "Value shown for the total row.",
    },
    cancelLabel: {
      control: "text",
      description: "Text shown in the cancel button.",
    },
    primaryActionLabel: {
      control: "text",
      description: "Text shown in the primary action button.",
    },
    onPrimaryAction: {
      description: "Called when the primary CTA is clicked.",
    },
    onCancel: {
      description: "Called when cancel is clicked.",
    },
    onClose: {
      description: "Called when the close icon is clicked.",
    },
    className: {
      control: "text",
      description: "Additional classes for the modal root element.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ModalPreview(
  args: Partial<React.ComponentProps<typeof PlanUpgradeSummaryModal>>
) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Plan Upgrade Summary Modal
      </Button>
      <PlanUpgradeSummaryModal
        open={open}
        onOpenChange={setOpen}
        onPrimaryAction={fn()}
        onCancel={fn()}
        onClose={fn()}
        {...args}
      />
    </div>
  );
}

export const Default: Story = {
  name: "Default",
  render: (args) => <ModalPreview {...args} />,
};

export const UpgradeState: Story = {
  name: "Upgrade State",
  render: (args) => <ModalPreview mode="upgrade" {...args} />,
};

export const DowngradeState: Story = {
  name: "Downgrade State",
  render: (args) => <ModalPreview mode="downgrade" {...args} />,
};

export const CustomAmounts: Story = {
  name: "Custom Amounts",
  args: {
    title: "Plan upgrade, Sedan ₹ 11,000.00/month",
    status: {
      title: "Payable Amount",
      message: "A payment of ₹ 12,980.00 is required to upgrade.",
      tone: "warning",
    },
    rows: [
      { label: "Prepaid amount", value: "(₹ 2,500.00)" },
      { label: "Difference in rental", value: "₹ 10,000.00" },
      { label: "Taxes", value: "₹ 2,980.00" },
    ],
    totalValue: "₹ 12,980.00",
    primaryActionLabel: "Pay & Confirm Upgrade",
  },
  render: (args) => <ModalPreview {...args} />,
};
