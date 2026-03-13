import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState } from "react";
import { FunctionsCard } from "./functions-card";
import type { FunctionItem } from "./types";

const meta: Meta<typeof FunctionsCard> = {
  title: "Custom/AI Bot/Functions Card",
  component: FunctionsCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `The Functions card displaying available bot functions with built-in badges. Includes an "Add Functions" button for creating custom functions.

**Install**
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

**Import**
\`\`\`tsx
import { FunctionsCard } from "@/components/custom/ivr-bot/functions-card"
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`functions\` | \`FunctionItem[]\` | — | List of functions to display |
| \`infoTooltip\` | \`string\` | \`undefined\` | Hover text on the info icon next to the "Functions" title |
| \`disabled\` | \`boolean\` | \`false\` | Disables all interactive elements (view mode) |

Each \`FunctionItem\` accepts an optional \`tooltip?: string\` for per-function info icon hover text.

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|---|---|---|---|
| Surface | \`--semantic-bg-primary\` | Card & row background | <span style="color:#FFFFFF">■</span> |
| Border | \`--semantic-border-layout\` | Card border, row borders | <span style="color:#E9EAEB">■</span> |
| Title | \`--semantic-text-primary\` | Card title, function names | <span style="color:#181D27">■</span> |
| Muted | \`--semantic-text-muted\` | Info icon default color | <span style="color:#717680">■</span> |
| Add button | \`--semantic-primary-surface\` | "+ Functions" button bg | <span style="color:#EBF8F9">■</span> |
| Error hover | \`--semantic-error-primary\` | Delete icon hover | <span style="color:#F04438">■</span> |
| Tooltip bg | \`--semantic-primary\` | Tooltip background | <span style="color:#343E55">■</span> |`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_FUNCTIONS: FunctionItem[] = [
  { id: "fn-1", name: "transfer_to_extension (extension_number)", isBuiltIn: true, tooltip: "Transfers the call to a specific extension number" },
  { id: "fn-2", name: "end_call()", isBuiltIn: true, tooltip: "Ends the current call gracefully" },
  { id: "fn-3", name: "check_order_status(order_id)", tooltip: "Looks up order status by order ID" },
];

export const Overview: Story = {
  args: {
    functions: SAMPLE_FUNCTIONS,
    infoTooltip: "Functions extend the bot's capabilities beyond conversation",
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <FunctionsCard {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    functions: [],
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <FunctionsCard {...args} />
    </div>
  ),
};

export const BuiltInOnly: Story = {
  args: {
    functions: [
      { id: "fn-1", name: "transfer_to_extension (extension_number)", isBuiltIn: true },
      { id: "fn-2", name: "end_call()", isBuiltIn: true },
    ],
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <FunctionsCard {...args} />
    </div>
  ),
};

/** Shows edit and delete buttons on custom functions. Built-in functions have neither. */
export const WithEditAndDelete: Story = {
  name: "With Edit & Delete",
  render: function Render() {
    const [fns, setFns] = useState<FunctionItem[]>(SAMPLE_FUNCTIONS);
    return (
      <div className="max-w-[500px]">
        <FunctionsCard
          functions={fns}
          onAddFunction={fn()}
          onEditFunction={fn()}
          onDeleteFunction={(id) => setFns((prev) => prev.filter((f) => f.id !== id))}
        />
      </div>
    );
  },
};

/** All interactive elements are disabled in view mode. */
export const Disabled: Story = {
  args: {
    functions: SAMPLE_FUNCTIONS,
    infoTooltip: "Functions extend the bot's capabilities beyond conversation",
    disabled: true,
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <FunctionsCard {...args} />
    </div>
  ),
};

/** Hover over the info icons to see tooltips — header tooltip via `infoTooltip` prop, per-function tooltips via `FunctionItem.tooltip`. */
export const WithTooltips: Story = {
  name: "With Tooltips",
  args: {
    functions: [
      { id: "fn-1", name: "transfer_to_extension (extension_number)", isBuiltIn: true, tooltip: "Transfers the call to a specific extension number" },
      { id: "fn-2", name: "end_call()", isBuiltIn: true, tooltip: "Ends the current call gracefully" },
      { id: "fn-3", name: "check_order_status(order_id)", tooltip: "Looks up order status by order ID" },
      { id: "fn-4", name: "get_weather(city)" },
    ],
    infoTooltip: "Functions extend the bot's capabilities beyond conversation",
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <FunctionsCard {...args} />
    </div>
  ),
};
