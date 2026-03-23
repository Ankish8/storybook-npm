import type { Meta, StoryObj } from "@storybook/react";
import { BotListAction } from "./bot-list-action";

const meta: Meta<typeof BotListAction> = {
  title: "Custom/AI Bot/BotList/BotListAction",
  component: BotListAction,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Context menu for bot card actions: Edit and Delete (with separator).
Uses semantic tokens; Delete is styled as destructive (red).

### Installation

\`\`\`bash
npx myoperator-ui add bot-list-action
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onEdit: { action: "onEdit", description: "Fired when Edit is selected" },
    onDelete: { action: "onDelete", description: "Fired when Delete is selected" },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Menu alignment",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    onEdit: () => {},
    onDelete: () => {},
  },
};

export const WithCallbacks: Story = {
  args: {
    onEdit: () => console.log("Edit"),
    onDelete: () => console.log("Delete"),
  },
};

export const AlignEnd: Story = {
  args: { align: "end" },
};

export const AlignStart: Story = {
  args: { align: "start" },
};

export const CustomTrigger: Story = {
  args: {
    trigger: (
      <button
        type="button"
        className="rounded border border-semantic-border-layout bg-semantic-bg-primary px-3 py-2 text-sm text-semantic-text-primary"
      >
        Open menu
      </button>
    ),
  },
};
