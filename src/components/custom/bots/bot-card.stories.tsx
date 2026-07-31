import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
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
An individual bot card showing the bot's type badge, icon, name, and last published info. Used inside **BotList** but can also be used standalone.

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
    numbersAttached: 32,
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

export const VoicebotWithNumbersMapped: Story = {
  args: {
    bot: sampleBots[0],
    numbersAttached: 32,
    onEdit: fn(),
    onDelete: fn(),
    onNumbersClick: fn(),
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Voicebots show a "Numbers mapped" row. Pass the count via the `numbersAttached` prop. When `numbersAttached > 0` and `onNumbersClick` is provided, the pill is clickable — use it to redirect to the numbers page.',
      },
    },
  },
};

export const VoicebotWithNoNumbersMapped: Story = {
  args: {
    bot: sampleBots[0],
    numbersAttached: 0,
    onEdit: fn(),
    onDelete: fn(),
    onNumbersClick: fn(),
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'With zero mapped numbers the row renders "-" and is not clickable.',
      },
    },
  },
};

export const VoicebotFetchingNumbers: Story = {
  args: {
    bot: sampleBots[0],
    isFetchingNumbers: true,
    onEdit: fn(),
    onDelete: fn(),
    onNumbersClick: fn(),
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Set `isFetchingNumbers` while the mapped-number count is still loading — the row shows a small spinner instead of the count. The rest of the card renders normally.',
      },
    },
  },
};

export const VoicebotWithNoNumberMessage: Story = {
  args: {
    bot: sampleBots[0],
    numbersAttached: 0,
    noNumberMessage: "No numbers mapped",
    onEdit: fn(),
    onDelete: fn(),
    onNumbersClick: fn(),
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use `noNumberMessage` to replace the default "-" with custom copy when no numbers are mapped.',
      },
    },
  },
};

export const VoicebotWithoutNumbersMappedSection: Story = {
  args: {
    bot: sampleBots[0],
    numbersAttached: 32,
    showNumbersMapped: false,
    onEdit: fn(),
    onDelete: fn(),
    onNumbersClick: fn(),
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BotCard {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Set `showNumbersMapped={false}` to remove the "Numbers mapped" section entirely. The footer stays pinned to the bottom of the card.',
      },
    },
  },
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

export const VoicebotCardWithPartnerPortal: Story = {
  args: {
    bot: sampleBots[0],
    PartnerPortal: true,
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

export const ChatbotCardWithPartnerPortal: Story = {
  args: {
    bot: sampleBots[1],
    PartnerPortal: true,
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

export const ChatbotCardDisabled: Story = {
  args: {
    bot: sampleBots[1],
    botCardDisabled: true,
    disabledTooltip: "Disable the current chatbot before creating another one.",
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

export const DisableDelete: Story = {
  name: "Delete disabled",
  parameters: {
    docs: {
      description: {
        story:
          'Open the ⋮ menu: Delete is disabled while Edit and the card itself stay interactive. Hover the Delete row to see `TooltipDelete`. The tooltip is hover-only — disabled menu items are skipped by keyboard navigation.',
      },
    },
  },
  args: {
    bot: sampleBots[0],
    DisableDelete: true,
    TooltipDelete: "Published bots can't be deleted. Unpublish it first.",
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
