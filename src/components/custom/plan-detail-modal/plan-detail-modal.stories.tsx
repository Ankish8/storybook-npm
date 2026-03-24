import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { PlanDetailModal } from "./plan-detail-modal";
import type { PlanFeature } from "./types";

const meta: Meta<typeof PlanDetailModal> = {
  title: "Custom/Plan & Payment/Plan & Pricing/PlanDetailModal",
  component: PlanDetailModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A read-only modal that displays the feature breakdown of a plan, including free allowances and per-unit rates for each feature.

### Installation

\`\`\`bash
npx myoperator-ui add plan-detail-modal
\`\`\`

### Import

\`\`\`tsx
import { PlanDetailModal } from "@/components/custom/plan-detail-modal"
import type { PlanDetailModalProps, PlanFeature } from "@/components/custom/plan-detail-modal"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|---|---|---|---|
| Modal Surface | \`--semantic-bg-primary\` | Modal background | <span style="color:#FFFFFF">■</span> |
| Table Header | \`--semantic-bg-ui\` | Table header & alternate rows | <span style="color:#F3F5F6">■</span> |
| Primary Text | \`--semantic-text-primary\` | Title, section heading, table headers | <span style="color:#1A1A1A">■</span> |
| Secondary Text | \`--semantic-text-secondary\` | Table cell content | <span style="color:#333333">■</span> |
| Layout Border | \`--semantic-border-layout\` | Modal, table, and row borders | <span style="color:#E4E4E4">■</span> |
| Muted Text | \`--semantic-text-muted\` | Close icon color | <span style="color:#717680">■</span> |
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
      action: "onOpenChange",
    },
    title: {
      control: "text",
      description: "Modal heading text",
    },
    features: {
      control: "object",
      description: "Array of features to display in the table",
    },
    planPrice: {
      control: "text",
      description: "Plan price label shown in the footer (e.g. ₹ 2,500.00/month)",
    },
    onClose: {
      description: "Called when the close button is clicked",
      action: "onClose",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFeatures: PlanFeature[] = [
  { name: "WhatsApp Service", free: "0 Message(s)", rate: "₹ 0" },
  { name: "Incoming (Missed)", free: "0 Minute(s)", rate: "₹ 0" },
  { name: "WhatsApp Marketing", free: "0 Message(s)", rate: "₹ 0.86" },
  { name: "Fix did(s)", free: "0 DID(s)", rate: "₹ 200.00" },
  { name: "WhatsApp Utility", free: "0 Message(s)", rate: "₹ 0.13" },
  { name: "User(s)", free: "3 User(s)", rate: "₹ 150.00" },
  { name: "Pro license(s)", free: "3 License(s)", rate: "₹ 300.00" },
  { name: "WhatsApp Authentication", free: "0 Unit(s)", rate: "₹ 0.13" },
  { name: "Department(s)", free: "2 Department(s)", rate: "₹ 300.00" },
  { name: "Channel(s)", free: "1 Pair(s)", rate: "₹ 300.00" },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          View Plan Details
        </Button>
        <PlanDetailModal
          open={open}
          onOpenChange={setOpen}
          title="Plan detail"
          features={defaultFeatures}
          planPrice="₹ 2,500.00/month"
          onClose={fn()}
        />
      </div>
    );
  },
};

export const WithoutPrice: Story = {
  name: "Without Plan Price",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          View Plan Details (No Price)
        </Button>
        <PlanDetailModal
          open={open}
          onOpenChange={setOpen}
          title="Plan detail"
          features={defaultFeatures}
        />
      </div>
    );
  },
};

export const FewFeatures: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const features: PlanFeature[] = [
      { name: "User(s)", free: "5 User(s)", rate: "₹ 150.00" },
      { name: "Department(s)", free: "3 Department(s)", rate: "₹ 300.00" },
      { name: "Channel(s)", free: "2 Pair(s)", rate: "₹ 300.00" },
    ];
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          View Plan Details (Few Features)
        </Button>
        <PlanDetailModal
          open={open}
          onOpenChange={setOpen}
          title="Basic Plan detail"
          features={features}
          planPrice="₹ 999.00/month"
        />
      </div>
    );
  },
};

export const CustomTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          View Enterprise Plan
        </Button>
        <PlanDetailModal
          open={open}
          onOpenChange={setOpen}
          title="Enterprise Plan detail"
          features={defaultFeatures}
          planPrice="₹ 10,000.00/month"
        />
      </div>
    );
  },
};
