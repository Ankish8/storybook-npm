import type { Meta } from "@storybook/react";
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
