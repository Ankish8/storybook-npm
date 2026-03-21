import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React, { useState } from "react";
import { CreateBotModal } from "./create-bot-modal";
import { Button } from "../../ui/button";
import { createBotModalArgTypes } from "./docs/props";

const meta: Meta<typeof CreateBotModal> = {
  title: "Custom/AI Bot/BotList/CreateBotModal",
  component: CreateBotModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Modal to create a new bot: name input and bot type (Chat / Voice) selection. Used by **BotList** when the Create new bot card is clicked.

## Import

\`\`\`tsx
import { CreateBotModal } from "@/components/custom/bots"
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: { ...createBotModalArgTypes },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Create Bot Modal",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="default" onClick={() => setOpen(true)}>
          Open Create Bot Modal
        </Button>
        <CreateBotModal
          open={open}
          onOpenChange={setOpen}
          onSubmit={(data) => {
            console.log("Submitted:", data);
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  name: "Create Bot Modal — Loading",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="default" onClick={() => setOpen(true)}>
          Open (Loading State)
        </Button>
        <CreateBotModal
          open={open}
          onOpenChange={setOpen}
          onSubmit={fn()}
          isLoading
        />
      </div>
    );
  },
};

export const ChatbotPreselected: Story = {
  name: "Create Bot Modal — Chatbot Pre-selected",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="default" onClick={() => setOpen(true)}>
          Open (Chatbot Pre-selected)
        </Button>
        <CreateBotModal open={open} onOpenChange={setOpen} onSubmit={fn()} />
      </div>
    );
  },
};
