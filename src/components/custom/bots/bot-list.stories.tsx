import type { Meta, StoryObj } from "@storybook/react";
import { BotList } from "./bot-list";
import { overview } from "./docs/overview";
import { botListArgTypes } from "./docs/props";

const meta: Meta<typeof BotList> = {
  title: "Custom/AI Bot/BotList",
  component: BotList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: overview,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: { ...botListArgTypes },
};

export default meta;

type Story = StoryObj<typeof BotList>;

const sampleBots = [
  {
    id: "1",
    name: "Lead validation bot",
    type: "voicebot" as const,
    conversationCount: 342,
    lastPublishedBy: "Nandan Raikwar",
    lastPublishedDate: "15 Jan, 2025",
  },
  {
    id: "2",
    name: "Support chatbot",
    type: "chatbot" as const,
    conversationCount: 128,
    lastPublishedBy: "User",
    lastPublishedDate: "1 Mar, 2025",
  },
];

export const Default: Story = {
  args: {
    bots: sampleBots,
  },
};
