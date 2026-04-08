import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState } from "react";
import { BotFunctions } from "./bot-functions";
import type { FunctionItem } from "./types";

const meta: Meta<typeof BotFunctions> = {
  title: "Custom/AI Bot/Bot Config/BotFunctions",
  component: BotFunctions,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Functions section for bot configuration. Displays a list of bot functions with edit and delete actions.

**Install**
\`\`\`bash
npx myoperator-ui add bot-functions
\`\`\`

**Import**
\`\`\`tsx
import { BotFunctions } from "@/components/custom/bot-functions"
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`functions\` | \`FunctionItem[]\` | \`[]\` | List of functions to display |
| \`onAdd\` | \`() => void\` | — | Called when "+ Functions" button is clicked |
| \`onEdit\` | \`(id: string) => void\` | — | Called when edit button is clicked. **Omit to hide** edit buttons |
| \`onDelete\` | \`(id: string) => void\` | — | Called when delete button is clicked. **Omit to hide** delete buttons |
| \`infoTooltip\` | \`string\` | — | Hover text on the info icon next to "Functions" title |
| \`disabled\` | \`boolean\` | \`false\` | Disables add, edit, and delete buttons |

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|---|---|---|---|
| Border | \`--semantic-border-layout\` | Section bottom border | <span style="color:#E9EAEB">&#9632;</span> |
| Title | \`--semantic-text-primary\` | Section title | <span style="color:#181D27">&#9632;</span> |
| Function text | \`--semantic-text-secondary\` | Function names | <span style="color:#414651">&#9632;</span> |
| Muted | \`--semantic-text-muted\` | Info icon, action icon default | <span style="color:#717680">&#9632;</span> |
| Empty state | \`--semantic-text-muted\` | "No functions added yet" text | <span style="color:#717680">&#9632;</span> |
| Error hover | \`--semantic-error-primary\` | Delete icon hover | <span style="color:#F04438">&#9632;</span> |
| Tooltip bg | \`--semantic-primary\` | Tooltip background | <span style="color:#343E55">&#9632;</span> |`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_FUNCTIONS: FunctionItem[] = [
  { id: "fn-1", name: "check_order_status(order_id)" },
  { id: "fn-2", name: "get_weather(city)" },
  { id: "fn-3", name: "send_email(to, subject, body)" },
];

export const Default: Story = {
  args: {
    functions: SAMPLE_FUNCTIONS,
    onAdd: fn(),
    onEdit: fn(),
    onDelete: fn(),
    infoTooltip: "Functions extend the bot's capabilities beyond conversation",
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <BotFunctions {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    functions: [],
    onAdd: fn(),
    infoTooltip: "Functions extend the bot's capabilities beyond conversation",
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <BotFunctions {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    functions: SAMPLE_FUNCTIONS,
    onAdd: fn(),
    onEdit: fn(),
    onDelete: fn(),
    infoTooltip: "Functions extend the bot's capabilities beyond conversation",
    disabled: true,
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <BotFunctions {...args} />
    </div>
  ),
};

export const WithEditAndDelete: Story = {
  name: "Interactive (Edit & Delete)",
  render: function Render() {
    const [fns, setFns] = useState<FunctionItem[]>(SAMPLE_FUNCTIONS);
    return (
      <div className="max-w-[500px]">
        <BotFunctions
          functions={fns}
          onAdd={fn()}
          onEdit={fn()}
          onDelete={(id) => setFns((prev) => prev.filter((f) => f.id !== id))}
          infoTooltip="Functions extend the bot's capabilities beyond conversation"
        />
      </div>
    );
  },
};

export const NoActions: Story = {
  name: "No Action Buttons",
  args: {
    functions: SAMPLE_FUNCTIONS,
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <BotFunctions {...args} />
    </div>
  ),
};
