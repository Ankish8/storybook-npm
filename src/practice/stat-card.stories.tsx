import type { Meta, StoryObj } from "@storybook/react";
import { Users, MessageSquare, CreditCard, Activity } from "lucide-react";

import { StatCard } from "./stat-card";

const meta: Meta<typeof StatCard> = {
  title: "Practice/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A **practice** component — a compact KPI tile for dashboards, with a label, a big value, and an optional trend delta.

> ℹ️ This lives in \`src/practice/\` and is **not** part of the published \`myoperator-ui\` library.

## Import

\`\`\`tsx
import { StatCard } from "@/practice/stat-card"
\`\`\`

## What to try in Storybook

- Change **trend** to \`up\` / \`down\` / \`neutral\` and watch the delta color + arrow change.
- Edit **label**, **value**, and **delta** live in the controls.
- See the **Dashboard** story for a realistic grid of tiles.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Metric name" },
    value: { control: "text", description: "Headline figure" },
    delta: { control: "text", description: "Change indicator, e.g. +12%" },
    trend: {
      control: "inline-radio",
      options: ["up", "down", "neutral"],
      description: "Direction — colors the delta",
    },
    icon: { control: false, description: "Optional corner icon" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    label: "Active chats",
    value: "1,248",
    delta: "+12.5%",
    trend: "up",
  },
  render: (args) => (
    <div className="w-64">
      <StatCard {...args} />
    </div>
  ),
};

export const TrendUp: Story = {
  args: { label: "Revenue", value: "$12.4k", delta: "+8.2%", trend: "up" },
  render: (args) => <div className="w-64"><StatCard {...args} /></div>,
};

export const TrendDown: Story = {
  args: { label: "Bounce rate", value: "37%", delta: "-4.1%", trend: "down" },
  render: (args) => <div className="w-64"><StatCard {...args} /></div>,
};

export const Neutral: Story = {
  args: { label: "Open tickets", value: "56", delta: "No change", trend: "neutral" },
  render: (args) => <div className="w-64"><StatCard {...args} /></div>,
};

export const WithIcon: Story = {
  args: {
    label: "Contacts",
    value: "8,932",
    delta: "+320 this week",
    trend: "up",
    icon: <Users />,
  },
  render: (args) => <div className="w-64"><StatCard {...args} /></div>,
};

export const NoDelta: Story = {
  args: { label: "Bots online", value: "4" },
  render: (args) => <div className="w-64"><StatCard {...args} /></div>,
};

export const Dashboard: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-4">
      <StatCard label="Active chats" value="1,248" delta="+12.5%" trend="up" icon={<MessageSquare />} />
      <StatCard label="Revenue" value="$12.4k" delta="+8.2%" trend="up" icon={<CreditCard />} />
      <StatCard label="Bounce rate" value="37%" delta="-4.1%" trend="down" icon={<Activity />} />
      <StatCard label="Contacts" value="8,932" delta="+320" trend="up" icon={<Users />} />
    </div>
  ),
};
