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
        component: `Human handover section for bot configuration. Shows a toggle switch to enable connecting to a human agent when the bot cannot answer. Optionally shows an info tooltip next to the title (only when \`infoTooltip\` is passed) and an optional edit action.

**Install**
\`\`\`bash
npx myoperator-ui add bot-human-handover
\`\`\`

**Import**
\`\`\`tsx
import { BotHumanHandover } from "@/components/custom/bot-human-handover"
\`\`\`

### Props

| Prop | Type | Description |
|------|------|-------------|
| \`enabled\` | \`boolean\` | Whether the handover toggle is on |
| \`label\` | \`string\` | Label text next to the switch |
| \`onToggle\` | \`(enabled: boolean) => void\` | Fires when the switch is toggled |
| \`onEdit\` | \`() => void\` | **Optional.** When provided, shows a pencil edit button on the right. Omit to hide it. |
| \`infoTooltip\` | \`string\` | **Optional.** Tooltip text for the info icon next to the title. The icon is hidden by default and only renders when a non-empty string is provided. |
| \`disabled\` | \`boolean\` | Disables the switch |

### Design Tokens

| Token | Usage |
|-------|-------|
| \`--semantic-text-primary\` | Title and label text |
| \`--semantic-text-muted\` | Info icon color |
| \`--semantic-border-layout\` | Bottom border divider |
| \`--semantic-primary\` | Tooltip background |
| \`--semantic-text-inverted\` | Tooltip text |
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
        <BotHumanHandover enabled={enabled} onToggle={setEnabled} />
      </div>
    );
  },
};

export const Enabled: Story = {
  render: function Render() {
    const [enabled, setEnabled] = useState(true);
    return (
      <div className="max-w-[500px]">
        <BotHumanHandover enabled={enabled} onToggle={setEnabled} />
      </div>
    );
  },
};

export const WithEditButton: Story = {
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
          label="Transfer to agent when bot is stuck"
        />
      </div>
    );
  },
};

export const WithTooltip: Story = {
  render: function Render() {
    const [enabled, setEnabled] = useState(false);
    return (
      <div className="max-w-[500px]">
        <BotHumanHandover
          enabled={enabled}
          onToggle={setEnabled}
          infoTooltip="Route the conversation to a live agent whenever the bot is unsure or the customer asks for one."
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="max-w-[500px]">
        <BotHumanHandover enabled={false} disabled />
      </div>
    );
  },
};
