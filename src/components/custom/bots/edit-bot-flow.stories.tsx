import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React from "react";
import { EditBotFlow } from "./edit-bot-flow";
import { IvrBotConfig } from "../ivr-bot/ivr-bot-config";
import { Toaster, toast } from "../../ui/toast";
import type { Bot } from "./types";
import { editBotFlowArgTypes } from "./docs/props";

const sampleBots: Bot[] = [
  {
    id: "bot-1",
    name: "Lead validation bot",
    type: "voicebot",
    conversationCount: 342,
    lastPublishedBy: "Nandan Raikwar",
    lastPublishedDate: "15 Jan, 2025",
  },
];


const meta: Meta<typeof EditBotFlow> = {
  title: "Custom/AI Bot/BotList/EditBotFlow",
  component: EditBotFlow,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
**Edit Bot → Config** as a standalone component: bot list and config view when Edit is clicked. Supply the config view via \`renderConfig(bot, onBack)\`.

## Installation

\`\`\`bash
npx myoperator-ui add edit-bot-flow
\`\`\`

## Import

\`\`\`tsx
import { EditBotFlow } from "@/components/custom/bots"
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: { ...editBotFlowArgTypes },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Edit Bot → Config",
  args: {
    bots: sampleBots,
    title: "AI Bot",
    subtitle: "Create & manage AI bots",
    onBotDelete: fn(),
    onCreateBotSubmit: fn(),
    onSearch: fn(),
    instructionText: (
      <p className="m-0 text-sm text-semantic-text-muted">
        Click the <strong>⋮</strong> menu on any bot card and select <strong>Edit</strong> to open
        its configuration page.
      </p>
    ),
  },
  render: (args) => {
    const getBotLabel = (bot: Bot | undefined) =>
      bot ? (bot.type === "voicebot" ? "Voicebot" : "Chatbot") : "Bot";

    return (
      <>
        <EditBotFlow
          {...args}
          renderConfig={(bot, onBack) => (
            <>
              <IvrBotConfig
                botTitle={bot.name}
                botType={bot.type === "voicebot" ? "Voicebot" : "Chatbot"}
                lastUpdatedAt="02:45 PM"
                onBack={onBack}
                onSaveAsDraft={onBack}
                onPublish={() => {
                  toast.success({
                    title: `${getBotLabel(bot)} published successfully!`,
                    description: `Your ${getBotLabel(bot).toLowerCase()} is ready.`,
                  });
                  onBack();
                }}
                initialData={{ botName: bot.name }}
              />
              <Toaster />
            </>
          )}
        />
      </>
    );
  },
};
