import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  FrustrationHandoverCard,
  type FrustrationHandoverData,
} from "./frustration-handover-card";

const meta: Meta<typeof FrustrationHandoverCard> = {
  title: "Custom/AI Bot/Frustration Handover Card",
  component: FrustrationHandoverCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Accordion card for configuring frustration-based escalation. Toggle to enable, then select an escalation department.

**Install**
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

**Import**
\`\`\`tsx
import { FrustrationHandoverCard } from "@/components/custom/ivr-bot/frustration-handover-card"
\`\`\``,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<FrustrationHandoverData>>({
      frustrationHandoverEnabled: true,
      escalationDepartment: "support",
    });
    return (
      <div className="max-w-[500px]">
        <FrustrationHandoverCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<FrustrationHandoverData>>({
      frustrationHandoverEnabled: false,
    });
    return (
      <div className="max-w-[500px]">
        <FrustrationHandoverCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

/** Custom department options from API or config. */
export const CustomDepartments: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<FrustrationHandoverData>>({
      frustrationHandoverEnabled: true,
      escalationDepartment: "tier-2",
    });
    return (
      <div className="max-w-[500px]">
        <FrustrationHandoverCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          departmentOptions={[
            { value: "tier-2", label: "Tier 2 Support" },
            { value: "engineering", label: "Engineering" },
            { value: "account-mgmt", label: "Account Management" },
            { value: "escalation", label: "Escalation Team" },
          ]}
        />
      </div>
    );
  },
};
