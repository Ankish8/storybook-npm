import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BotBehaviorCard, type BotBehaviorData } from "./bot-behavior-card";

const meta: Meta<typeof BotBehaviorCard> = {
  title: "Custom/AI Bot/Bot Behavior Card",
  component: BotBehaviorCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `The "How It Behaves" card for configuring a bot's system prompt with character counter and session variable chips.

**Install**
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

**Import**
\`\`\`tsx
import { BotBehaviorCard } from "@/components/custom/ivr-bot/bot-behavior-card"
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
    const [data, setData] = useState<Partial<BotBehaviorData>>({
      systemPrompt:
        "You are a helpful assistant. Always start by greeting the user politely.",
    });
    return (
      <div className="max-w-[800px]">
        <BotBehaviorCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<BotBehaviorData>>({});
    return (
      <div className="max-w-[800px]">
        <BotBehaviorCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

export const CustomVariables: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<BotBehaviorData>>({
      systemPrompt: "Greet the caller by name.",
    });
    return (
      <div className="max-w-[800px]">
        <BotBehaviorCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          sessionVariables={[
            "{{Caller number}}",
            "{{Time}}",
            "{{Contact Details}}",
            "{{Account ID}}",
          ]}
        />
      </div>
    );
  },
};
