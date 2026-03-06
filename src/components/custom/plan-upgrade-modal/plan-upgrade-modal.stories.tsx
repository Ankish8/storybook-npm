import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { PlanUpgradeModal } from "./plan-upgrade-modal";

const meta: Meta<typeof PlanUpgradeModal> = {
  title: "Custom/Plan & Payment/Plan & Pricing/PlanUpgradeModal",
  component: PlanUpgradeModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A modal for selecting when a plan upgrade should be applied in the billing cycle.

### Installation

\`\`\`bash
npx myoperator-ui add plan-upgrade-modal
\`\`\`

### Import

\`\`\`tsx
import { PlanUpgradeModal } from "@/components/custom/plan-upgrade-modal"
import type { PlanUpgradeModalProps } from "@/components/custom/plan-upgrade-modal"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|---|---|---|---|
| Primary Action | \`--semantic-primary\` | Next button background | <span style="color:#343E55">■</span> |
| Modal Surface | \`--semantic-bg-primary\` | Modal background surface | <span style="color:#FFFFFF">■</span> |
| Muted Text | \`--semantic-text-muted\` | Subtitle and close icon | <span style="color:#717680">■</span> |
| Selected Border | \`--semantic-border-input-focus\` | Active billing-cycle option border | <span style="color:#2BBCCA">■</span> |
| Layout Border | \`--semantic-border-layout\` | Modal and option borders | <span style="color:#E9EAEB">■</span> |
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
    title: {
      control: "text",
      description: "Modal heading text",
    },
    description: {
      control: "text",
      description: "Supporting text below heading",
    },
    options: {
      control: "object",
      description: "Selectable billing-cycle options",
    },
    selectedOptionId: {
      control: "text",
      description: "Controlled selected option id",
    },
    defaultSelectedOptionId: {
      control: "text",
      description: "Initial selected option id in uncontrolled mode",
    },
    onOptionChange: {
      description: "Called when the selected option changes",
    },
    nextLabel: {
      control: "text",
      description: "Next button label",
    },
    onNext: {
      description: "Called when Next is clicked",
    },
    onClose: {
      description: "Called when close icon is clicked",
    },
    className: {
      control: "text",
      description: "Additional className for modal root container",
    },
  },
  args: {
    onClose: fn(),
    onNext: fn(),
    onOpenChange: fn(),
    onOptionChange: fn(),
    onSelect: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ModalPreview(args: Partial<React.ComponentProps<typeof PlanUpgradeModal>>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Plan Upgrade Modal
      </Button>
      <PlanUpgradeModal
        open={open}
        onOpenChange={setOpen}
        onOptionChange={fn()}
        onNext={fn()}
        onClose={fn()}
        {...args}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <ModalPreview {...args} />,
};

export const UpcomingBillingSelected: Story = {
  name: "Upcoming Billing Selected",
  args: {
    defaultSelectedOptionId: "upcoming-billing-cycle",
  },
  render: (args) => <ModalPreview {...args} />,
};

export const CustomCopy: Story = {
  name: "Custom Copy",
  args: {
    title: "Plan upgrade, SUV ₹ 18,000.00/month",
    description: "Choose when to activate your updated monthly subscription.",
    nextLabel: "Confirm",
  },
  render: (args) => <ModalPreview {...args} />,
};
