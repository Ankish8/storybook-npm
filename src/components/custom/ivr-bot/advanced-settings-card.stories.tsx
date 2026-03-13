import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  AdvancedSettingsCard,
  type AdvancedSettingsData,
} from "./advanced-settings-card";

const meta: Meta<typeof AdvancedSettingsCard> = {
  title: "Custom/AI Bot/Advanced Settings Card",
  component: AdvancedSettingsCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Accordion card for advanced bot settings: silence timeout, call end threshold, and interruption handling toggle.

**Install**
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

**Import**
\`\`\`tsx
import { AdvancedSettingsCard } from "@/components/custom/ivr-bot/advanced-settings-card"
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
    const [data, setData] = useState<Partial<AdvancedSettingsData>>({
      silenceTimeout: 15,
      callEndThreshold: 3,
      interruptionHandling: true,
    });
    return (
      <div className="max-w-[500px]">
        <AdvancedSettingsCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

export const CustomValues: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<AdvancedSettingsData>>({
      silenceTimeout: 30,
      callEndThreshold: 5,
      interruptionHandling: false,
    });
    return (
      <div className="max-w-[500px]">
        <AdvancedSettingsCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

/** All fields are disabled in view mode. */
export const Disabled: Story = {
  render: () => (
    <div className="max-w-[500px]">
      <AdvancedSettingsCard
        data={{
          silenceTimeout: 15,
          callEndThreshold: 3,
          interruptionHandling: true,
        }}
        onChange={() => {}}
        disabled
      />
    </div>
  ),
};
