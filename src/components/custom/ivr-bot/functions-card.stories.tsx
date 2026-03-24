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
| \`onEditFunction\` | \`(id: string) => void\` | — | Edit handler. **Omit to hide** the edit button entirely |
| \`onDeleteFunction\` | \`(id: string) => void\` | — | Delete handler. **Omit to hide** the delete button entirely |
| \`editDisabled\` | \`boolean\` | \`false\` | Independently disables the edit button |
| \`deleteDisabled\` | \`boolean\` | \`false\` | Independently disables the delete button |
| \`disabled\` | \`boolean\` | \`false\` | Disables the "Add Functions" button (view mode) |
| \`infoTooltip\` | \`string\` | \`undefined\` | Hover text on the info icon next to the "Functions" title |

Each \`FunctionItem\` accepts an optional \`tooltip?: string\` for per-function info icon hover text.

> **Visibility vs disabled**: Omitting \`onEditFunction\`/\`onDeleteFunction\` **hides** the button. Providing the handler but setting \`editDisabled\`/\`deleteDisabled\` shows it **grayed out**. Use this to differentiate "no permission to see" vs "visible but not allowed right now".

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

/** View mode — Add button disabled, edit enabled (opens read-only modal), delete disabled. */
export const ViewMode: Story = {
  name: "View Mode (disabled)",
  args: {
    functions: SAMPLE_FUNCTIONS,
    onEditFunction: fn(),
    onDeleteFunction: fn(),
    infoTooltip: "Functions extend the bot's capabilities beyond conversation",
    disabled: true,
    deleteDisabled: true,
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <FunctionsCard {...args} />
    </div>
  ),
};

/** Edit only — user can edit functions but has no delete permission. */
export const EditOnlyPermission: Story = {
  name: "Edit Only (no delete)",
  args: {
    functions: SAMPLE_FUNCTIONS,
    onEditFunction: fn(),
    // onDeleteFunction omitted → delete button hidden
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <FunctionsCard {...args} />
    </div>
  ),
};

/** Delete only — user can delete functions but has no edit permission. */
export const DeleteOnlyPermission: Story = {
  name: "Delete Only (no edit)",
  render: function Render() {
    const [fns, setFns] = useState<FunctionItem[]>(SAMPLE_FUNCTIONS);
    return (
      <div className="max-w-[500px]">
        <FunctionsCard
          functions={fns}
          // onEditFunction omitted → edit button hidden
          onDeleteFunction={(id) => setFns((prev) => prev.filter((f) => f.id !== id))}
        />
      </div>
    );
  },
};

/** Both actions visible but independently disabled — shows grayed out buttons. */
export const BothDisabled: Story = {
  name: "Both Actions Disabled",
  args: {
    functions: SAMPLE_FUNCTIONS,
    onEditFunction: fn(),
    onDeleteFunction: fn(),
    editDisabled: true,
    deleteDisabled: true,
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <FunctionsCard {...args} />
    </div>
  ),
};

/** Hover over the info icons to see tooltips — header tooltip via `infoTooltip` prop, per-function tooltips via `FunctionItem.tooltip`. */
export const WithTooltips: Story = {
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
