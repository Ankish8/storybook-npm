import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BotIdentityCard, type BotIdentityData } from "./bot-identity-card";

const meta: Meta<typeof BotIdentityCard> = {
  title: "Custom/AI Bot/Bot Identity Card",
  component: BotIdentityCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `The "Who The Bot Is" card for configuring a bot's identity — name, role, tone, voice profile, and language.

Uses CreatableSelect for role (type-to-create), CreatableMultiSelect for tone (multi-chip + type-to-create), and Select with PlayCircle icons for voice profiles.

**Install**
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

**Import**
\`\`\`tsx
import { BotIdentityCard } from "@/components/custom/ivr-bot/bot-identity-card"
\`\`\``,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<BotIdentityData>>({
      botName: "Rhea",
      primaryRole: "customer-support",
      tone: ["Conversational"],
      voice: "rhea-female",
      language: "en-in",
    });
    return (
      <div className="max-w-[800px]">
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<BotIdentityData>>({});
    return (
      <div className="max-w-[800px]">
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

export const CustomOptions: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<BotIdentityData>>({
      botName: "Max",
      primaryRole: "Sales Bot",
      tone: ["Direct and efficient", "Professional and highly concise"],
      voice: "vikram-male",
      language: "hi-in",
    });
    return (
      <div className="max-w-[800px]">
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          voiceOptions={[
            { value: "rhea-female", label: "Rhea - Female" },
            { value: "vikram-male", label: "Vikram - Male" },
          ]}
          languageOptions={[
            { value: "en-in", label: "English (India)" },
            { value: "hi-in", label: "Hindi" },
            { value: "ta-in", label: "Tamil" },
            { value: "te-in", label: "Telugu" },
          ]}
        />
      </div>
    );
  },
};
