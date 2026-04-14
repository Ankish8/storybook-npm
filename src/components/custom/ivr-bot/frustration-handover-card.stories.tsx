import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  FrustrationHandoverCard,
  type FrustrationHandoverData,
} from "./frustration-handover-card";

const meta: Meta<typeof FrustrationHandoverCard> = {
  title: "Custom/AI Bot/Escalate to Human Card",
  component: FrustrationHandoverCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Accordion card for human escalation when callers are frustrated. The **Escalate to Human** title has an info icon with tooltip (same pattern as Knowledge Base), via \`infoTooltip\` — pass \`""\` for a non-interactive icon only. Toggle **Escalate when caller is unhappy** to show the **Prompt** textarea (shared Textarea with character count and soft max via \`promptMaxLength\`), then choose **Transfer to department**. Use \`promptValidation\` for parent-driven errors (e.g. on save). \`onEscalationPromptBlur\` fires when the Prompt field loses focus (current value passed).

For paginated department APIs, pass \`onDepartmentOptionsScrollEnd\` and append new pages to \`departmentOptions\`. Use \`departmentOptionsHasMore={false}\` when there are no further pages, and \`departmentOptionsLoadingMore\` while fetching to avoid duplicate requests.

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
      escalationPrompt: "",
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
      escalationPrompt: "",
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

/** Simulates page size 10: scroll the dropdown to the end to load the next page (see Actions panel in devtools). */
export const PaginatedDepartments: Story = {
  render: function Render() {
    const pageSize = 10;
    const allDepartments = Array.from({ length: 27 }, (_, i) => ({
      value: `dept-${i + 1}`,
      label: `Department ${i + 1}`,
    }));
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const loaded = allDepartments.slice(0, page * pageSize);
    const hasMore = loaded.length < allDepartments.length;

    const [data, setData] = useState<Partial<FrustrationHandoverData>>({
      frustrationHandoverEnabled: true,
      escalationPrompt: "",
      escalationDepartment: "",
    });

    return (
      <div className="max-w-[500px]">
        <FrustrationHandoverCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          departmentOptions={loaded}
          departmentOptionsHasMore={hasMore}
          departmentOptionsLoadingMore={loading}
          onDepartmentOptionsScrollEnd={() => {
            if (!hasMore || loading) return;
            setLoading(true);
            window.setTimeout(() => {
              setPage((p) => p + 1);
              setLoading(false);
            }, 400);
          }}
        />
      </div>
    );
  },
};
