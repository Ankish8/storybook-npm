import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React from "react";
import { BotCard } from "./bot-card";
import { botCardArgTypes } from "./docs/props";

const sampleBots = [
  {
    id: "bot-1",
    name: "Lead validation bot",
    type: "voicebot" as const,
    conversationCount: 342,
    lastPublishedBy: "Nandan Raikwar",
    lastPublishedDate: "15 Jan, 2025",
  },
  {
    id: "bot-2",
    name: "Excepteur sint occaecat cupidatat...",
    type: "chatbot" as const,
    conversationCount: 56,
    lastPublishedBy: "Nandan Raikwar",
    lastPublishedDate: "15 Jan, 2025",
  },
];

const meta: Meta<typeof BotCard> = {
  title: "Custom/AI Bot/BotList/BotCard",
  component: BotCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
An individual bot card showing the bot's type badge, icon, name, conversation count, and last published info. Used inside **BotList** but can also be used standalone.

## Installation

\`\`\`bash
npx myoperator-ui add bots
\`\`\`

## Import

\`\`\`tsx
import { BotCard } from "@/components/custom/bots"
import type { BotCardProps, Bot } from "@/components/custom/bots"
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: { ...botCardArgTypes },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const VoicebotCard: Story = {
  args: {
    bot: sampleBots[0],
    typeLabels: undefined,
    onEdit: fn(),
    onDelete: fn(),
    className: undefined,
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
};

export const ChatbotCard: Story = {
  args: {
    bot: sampleBots[1],
    typeLabels: undefined,
    onEdit: fn(),
    onDelete: fn(),
    className: undefined,
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
};

export const CardWithoutPublishInfo: Story = {
  args: {
    bot: {
      id: "bot-draft",
      name: "Draft bot",
      type: "chatbot" as const,
      conversationCount: 0,
    },
    typeLabels: undefined,
    onEdit: fn(),
    onDelete: fn(),
    className: undefined,
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
};

export const DraftUnpublishedChanges: Story = {
  name: "Draft (Unpublished changes)",
  args: {
    bot: {
      id: "bot-draft",
      name: "Draft voice bot",
      type: "voicebot" as const,
      conversationCount: 0,
      status: "draft",
      lastPublishedBy: "Nandan Raikwar",
      lastPublishedDate: "15 Jan, 2025",
    },
    typeLabels: undefined,
    onEdit: fn(),
    onDelete: fn(),
    className: undefined,
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
};

export const CardWithLongName: Story = {
  name: "Card With Long Name (Truncated)",
  args: {
    bot: {
      id: "bot-long",
      name: "Excepteur sint occaecat cupidatat non proident sunt in culpa",
      type: "chatbot" as const,
      conversationCount: 56,
      lastPublishedBy: "Nandan Raikwar",
      lastPublishedDate: "15 Jan, 2025",
    },
    typeLabels: undefined,
    onEdit: fn(),
    onDelete: fn(),
    className: undefined,
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
};

export const CardWithCustomTypeLabels: Story = {
  args: {
    bot: sampleBots[0],
    typeLabels: { voicebot: "Voice", chatbot: "Chat" },
    onEdit: fn(),
    onDelete: fn(),
    className: undefined,
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
};
