import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BotHumanHandover } from "./bot-human-handover";

const meta: Meta<typeof BotHumanHandover> = {
  title: "Custom/AI Bot/Bot Config/BotHumanHandover",
  component: BotHumanHandover,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Human handover section for bot configuration. Shows a toggle switch to enable connecting to a human agent when the bot cannot answer.

**Install**
\`\`\`bash
npx myoperator-ui add bot-human-handover
\`\`\`

**Import**
\`\`\`tsx
import { BotHumanHandover } from "@/components/custom/bot-human-handover"
\`\`\`

### Design Tokens

| Token | Usage |
|-------|-------|
| \`--semantic-text-primary\` | Title and label text |
| \`--semantic-border-layout\` | Bottom border divider |
`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [enabled, setEnabled] = useState(false);
    return (
      <div className="max-w-[500px]">
        <BotHumanHandover
          enabled={enabled}
          onToggle={setEnabled}
          onEdit={() => alert("Edit clicked")}
        />
      </div>
    );
  },
};

export const Enabled: Story = {
  render: function Render() {
    const [enabled, setEnabled] = useState(true);
    return (
      <div className="max-w-[500px]">
        <BotHumanHandover
          enabled={enabled}
          onToggle={setEnabled}
          onEdit={() => alert("Edit clicked")}
        />
      </div>
    );
  },
};

export const WithCustomLabel: Story = {
  render: function Render() {
    const [enabled, setEnabled] = useState(false);
    return (
      <div className="max-w-[500px]">
        <BotHumanHandover
          enabled={enabled}
          onToggle={setEnabled}
          onEdit={() => alert("Edit clicked")}
          label="Transfer to agent when bot is stuck"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="max-w-[500px]">
        <BotHumanHandover
          enabled={false}
          disabled
          onEdit={() => alert("Edit clicked")}
        />
      </div>
    );
  },
};
