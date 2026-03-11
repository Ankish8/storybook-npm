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
\`\`\``,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_FUNCTIONS: FunctionItem[] = [
  { id: "fn-1", name: "transfer_to_extension (extension_number)", isBuiltIn: true },
  { id: "fn-2", name: "end_call()", isBuiltIn: true },
  { id: "fn-3", name: "check_order_status(order_id)" },
];

export const Overview: Story = {
  args: {
    functions: SAMPLE_FUNCTIONS,
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
