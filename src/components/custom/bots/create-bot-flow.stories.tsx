import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React from "react";
import { CreateBotFlow } from "./create-bot-flow";
import { createBotFlowArgTypes } from "./docs/props";

const meta: Meta<typeof CreateBotFlow> = {
  title: "Custom/AI Bot/BotList/CreateBotFlow",
  component: CreateBotFlow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**Create Bot Modal** flow: "Create new bot" card only (no header). Click the create card to open the modal.

## Installation

\`\`\`bash
npx myoperator-ui add create-bot-flow
\`\`\`

## Import

\`\`\`tsx
import { CreateBotFlow } from "@/components/custom/bots"
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: { ...createBotFlowArgTypes },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "With Create Bot Modal",
  args: {
    createCardLabel: "Create new bot",
    onSubmit: fn(),
  },
};

export const CustomLabel: Story = {
  name: "Custom Label",
  args: {
    createCardLabel: "Add your first bot",
    onSubmit: fn(),
  },
};
