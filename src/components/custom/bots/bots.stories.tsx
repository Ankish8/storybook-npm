import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import React, { useState } from "react";
import { BotList } from "./bot-list";
import { BotCard } from "./bot-card";
import { CreateBotModal } from "./create-bot-modal";
import { IvrBotConfig } from "../ivr-bot/ivr-bot-config";
import { Button } from "../../ui/button";
import { Toaster, toast } from "../../ui/toast";
import type { Bot } from "./types";

const sampleBots: Bot[] = [
  {
    id: "bot-1",
    name: "Lead validation bot",
    type: "voicebot",
    conversationCount: 342,
    lastPublishedBy: "Nandan Raikwar",
    lastPublishedDate: "15 Jan, 2025",
  },
  {
    id: "bot-2",
    name: "Excepteur sint occaecat cupidatat...",
    type: "chatbot",
    conversationCount: 56,
    lastPublishedBy: "Nandan Raikwar",
    lastPublishedDate: "15 Jan, 2025",
  },
  {
    id: "bot-3",
    name: "Excepteur sint occaecat cupidatat...",
    type: "chatbot",
    conversationCount: 56,
    lastPublishedBy: "Nandan Raikwar",
    lastPublishedDate: "15 Jan, 2025",
  },
  {
    id: "bot-4",
    name: "Lead validation bot",
    type: "voicebot",
    conversationCount: 342,
    lastPublishedBy: "Nandan Raikwar",
    lastPublishedDate: "15 Jan, 2025",
  },
];

const meta: Meta<typeof BotList> = {
  title: "Custom/AI Bot/BotList",
  component: BotList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A full-page bot management view for the AI Bot feature. Displays a page header with title, subtitle, and search bar, followed by a responsive 3-column grid of bot cards. Includes a "Create new bot" card that triggers a modal.

## Installation

\`\`\`bash
npx myoperator-ui add bots
\`\`\`

## Import

\`\`\`tsx
import { BotList, BotCard, CreateBotModal } from "@/components/custom/bots"
import type { Bot, BotType } from "@/components/custom/bots"
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Usage</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Info Surface</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-info-surface</code></td>
      <td style="padding: 12px 16px;">Create new bot card bg, bot icon bg</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F6F8FD; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Layout</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Card borders, dividers, header border</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Bot name, page title</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Secondary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px;">Create new bot label, "Last Published" label</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Conversation count, page subtitle, last published value</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Border Focus</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-focus</code></td>
      <td style="padding: 12px 16px;">Selected bot type card border, input focus ring</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #2BBCCA; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Page title" },
    subtitle: { control: "text", description: "Page subtitle" },
    bots: { control: false, description: "Array of bot objects to display" },
    onCreateBot: { action: "onCreateBot", description: "Called when the Create new bot card is clicked (modal opens)" },
    onCreateBotSubmit: { action: "onCreateBotSubmit", description: "Called with { name, type } when the Create Bot modal is submitted" },
    onBotEdit: { action: "onBotEdit", description: "Called with bot id when Edit is selected" },
    onBotPublish: { action: "onBotPublish", description: "Called with bot id when Publish is selected" },
    onBotDelete: { action: "onBotDelete", description: "Called with bot id when Delete is selected" },
    onSearch: { action: "onSearch", description: "Called with the current search query" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Overview",
  render: () => {
    const [view, setView] = useState<"list" | "config">("list");
    const [editingBot, setEditingBot] = useState<Bot | null>(null);

    const getBotLabel = (bot: Bot | undefined) =>
      bot ? (bot.type === "voicebot" ? "Voicebot" : "Chatbot") : "Bot";

    const handlePublish = (botId: string) => {
      const bot = sampleBots.find((b) => b.id === botId);
      toast.success({
        title: `${getBotLabel(bot)} published successfully!`,
        description: `Your ${getBotLabel(bot).toLowerCase()} is ready.`,
      });
    };

    const handleEdit = (botId: string) => {
      const bot = sampleBots.find((b) => b.id === botId);
      if (bot) { setEditingBot(bot); setView("config"); }
    };

    if (view === "config" && editingBot) {
      return (
        <>
          <IvrBotConfig
            botTitle={editingBot.name}
            botType={editingBot.type === "voicebot" ? "Voicebot" : "Chatbot"}
            lastUpdatedAt="02:45 PM"
            onBack={() => { setView("list"); setEditingBot(null); }}
            onSaveAsDraft={() => { setView("list"); setEditingBot(null); }}
            onPublish={() => {
              handlePublish(editingBot.id);
              setView("list");
              setEditingBot(null);
            }}
            initialData={{ botName: editingBot.name }}
          />
          <Toaster />
        </>
      );
    }

    return (
      <>
        <BotList
          bots={sampleBots}
          title="AI Bot"
          subtitle="Create & manage AI bots"
          onCreateBotSubmit={fn()}
          onBotEdit={handleEdit}
          onBotPublish={handlePublish}
          onBotDelete={fn()}
          onSearch={fn()}
        />
        <Toaster />
      </>
    );
  },
};

export const Empty: Story = {
  name: "Empty State",
  args: {
    bots: [],
    onCreateBot: fn(),
  },
};

export const WithCreateModal: Story = {
  name: "With Create Bot Modal",
  render: () => {
    const handlePublish = (botId: string) => {
      const bot = sampleBots.find((b) => b.id === botId);
      const botLabel = bot
        ? bot.type === "voicebot"
          ? "Voicebot"
          : "Chatbot"
        : "Bot";
      toast.success({
        title: `${botLabel} published successfully!`,
        description: `Your ${botLabel.toLowerCase()} is ready.`,
      });
    };
    return (
      <>
        <BotList
          bots={sampleBots}
          title="AI Bot"
          subtitle="Create & manage AI bots"
          onCreateBotSubmit={(data) => console.log("Bot created:", data)}
          onBotEdit={fn()}
          onBotPublish={handlePublish}
          onBotDelete={fn()}
          onSearch={fn()}
        />
        <Toaster />
      </>
    );
  },
};

export const EditBotFlow: Story = {
  name: "Edit Bot → Config",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: `Clicking **Edit** on a bot card navigates to the full **Voice bot Config** page for that bot.
The config page header shows the bot name, type badge, and a **Back** arrow that returns to the bot list.

\`\`\`tsx
<BotList
  bots={bots}
  onBotEdit={(botId) => {
    const bot = bots.find(b => b.id === botId);
    navigate(\`/bots/\${botId}/config\`); // or manage view state
  }}
/>

// Config page
<IvrBotConfig
  botTitle={bot.name}
  botType="Voicebot"
  lastUpdatedAt="02:45 PM"
  onBack={() => navigate('/bots')}
/>
\`\`\`
        `,
      },
    },
  },
  render: () => {
    const [view, setView] = useState<"list" | "config">("list");
    const [editingBot, setEditingBot] = useState<Bot | null>(null);

    const getBotLabel = (bot: Bot | undefined) =>
      bot ? (bot.type === "voicebot" ? "Voicebot" : "Chatbot") : "Bot";

    const handlePublish = (botId: string) => {
      const bot = sampleBots.find((b) => b.id === botId);
      toast.success({
        title: `${getBotLabel(bot)} published successfully!`,
        description: `Your ${getBotLabel(bot).toLowerCase()} is ready.`,
      });
    };

    const handleEdit = (botId: string) => {
      const bot = sampleBots.find((b) => b.id === botId);
      if (bot) { setEditingBot(bot); setView("config"); }
    };

    if (view === "config" && editingBot) {
      return (
        <>
          <IvrBotConfig
            botTitle={editingBot.name}
            botType={editingBot.type === "voicebot" ? "Voicebot" : "Chatbot"}
            lastUpdatedAt="02:45 PM"
            onBack={() => { setView("list"); setEditingBot(null); }}
            onSaveAsDraft={() => { setView("list"); setEditingBot(null); }}
            onPublish={() => {
              handlePublish(editingBot.id);
              setView("list");
              setEditingBot(null);
            }}
            initialData={{
              botName: editingBot.name,
              knowledgeBaseFiles: [
                { id: "kb-1", name: "File Lead validation bot", status: "training" },
                { id: "kb-2", name: "FAQ_2025.pdf", status: "trained" },
              ],
              functions: [
                { id: "fn-1", name: "transfer_to_extension (extension_number)", isBuiltIn: true },
                { id: "fn-2", name: "end_call()", isBuiltIn: true },
              ],
              frustrationHandoverEnabled: false,
              silenceTimeout: 15,
              callEndThreshold: 3,
              interruptionHandling: true,
            }}
          />
          <Toaster />
        </>
      );
    }

    return (
      <>
        <div className="flex flex-col gap-2 p-6 pb-0">
          <p className="m-0 text-sm text-semantic-text-muted">
            Click the <strong>⋮</strong> menu on any bot card and select{" "}
            <strong>Edit</strong> to open its configuration page.
          </p>
        </div>
        <BotList
          bots={sampleBots}
          title="AI Bot"
          subtitle="Create & manage AI bots"
          onBotEdit={handleEdit}
          onBotPublish={handlePublish}
          onBotDelete={fn()}
          onCreateBotSubmit={fn()}
          onSearch={fn()}
        />
        <Toaster />
      </>
    );
  },
};

// ——— BotCard stories ———

const botCardMeta: Meta<typeof BotCard> = {
  title: "Custom/AI Bot/BotCard",
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
  argTypes: {
    bot: { control: false, description: "Bot data object" },
    onEdit: { action: "onEdit", description: "Called with bot id when Edit is selected" },
    onPublish: { action: "onPublish", description: "Called with bot id when Publish is selected" },
    onDelete: { action: "onDelete", description: "Called with bot id when Delete is selected" },
  },
};

export const BotCardVoicebot: StoryObj<typeof BotCard> = {
  ...({ component: BotCard, ...botCardMeta } as object),
  name: "Voicebot Card",
  render: () => (
    <div style={{ width: 375 }}>
      <BotCard bot={sampleBots[0]} onEdit={fn()} onPublish={fn()} onDelete={fn()} />
    </div>
  ),
};

export const BotCardChatbot: StoryObj<typeof BotCard> = {
  ...({ component: BotCard, ...botCardMeta } as object),
  name: "Chatbot Card",
  render: () => (
    <div style={{ width: 375 }}>
      <BotCard bot={sampleBots[1]} onEdit={fn()} onPublish={fn()} onDelete={fn()} />
    </div>
  ),
};

export const BotCardNoPublishInfo: StoryObj<typeof BotCard> = {
  ...({ component: BotCard, ...botCardMeta } as object),
  name: "Card Without Publish Info",
  render: () => (
    <div style={{ width: 375 }}>
      <BotCard
        bot={{
          id: "bot-draft",
          name: "Draft bot",
          type: "chatbot",
          conversationCount: 0,
        }}
        onEdit={fn()}
        onPublish={fn()}
        onDelete={fn()}
      />
    </div>
  ),
};

export const BotCardLongName: StoryObj<typeof BotCard> = {
  ...({ component: BotCard, ...botCardMeta } as object),
  name: "Card With Long Name (Truncated)",
  render: () => (
    <div style={{ width: 375 }}>
      <BotCard
        bot={{
          id: "bot-long",
          name: "Excepteur sint occaecat cupidatat non proident sunt in culpa",
          type: "chatbot",
          conversationCount: 56,
          lastPublishedBy: "Nandan Raikwar",
          lastPublishedDate: "15 Jan, 2025",
        }}
        onEdit={fn()}
        onPublish={fn()}
        onDelete={fn()}
      />
    </div>
  ),
};

// ——— CreateBotModal stories ———

export const CreateBotModalDefault: StoryObj<typeof CreateBotModal> = {
  ...({ component: CreateBotModal } as object),
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

export const CreateBotModalChatbotSelected: StoryObj<typeof CreateBotModal> = {
  ...({ component: CreateBotModal } as object),
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
