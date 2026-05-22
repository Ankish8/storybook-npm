import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
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

Bot Name, Primary Role, and Tone validation appears for all invalid mandatory fields by default. Set an individual field validation prop like \`primaryRoleErrorMessageValidation={false}\` to make that field optional. Customize the required messages with \`botNameValidation\`, \`primaryRoleValidation\`, and \`toneValidation\`.

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
  argTypes: {
    botNameErrorMessageValidation: {
      control: "boolean",
      description:
        "Enables Bot Name & Identity error-message validation. Pass false to make Bot Name & Identity optional.",
    },
    botNameValidation: {
      control: "text",
      description: "Required message for Bot Name & Identity.",
    },
    primaryRoleValidation: {
      control: "text",
      description: "Required message for Primary Role.",
    },
    toneValidation: {
      control: "text",
      description: "Required message for Tone.",
    },
    primaryRoleErrorMessageValidation: {
      control: "boolean",
      description:
        "Enables Primary Role error-message validation. Pass false to make Primary Role optional.",
    },
    toneErrorMessageValidation: {
      control: "boolean",
      description:
        "Enables Tone error-message validation. Pass false to make Tone optional.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Helper that simulates play/pause toggling for stories. */
function useVoicePlayback() {
  const [playing, setPlaying] = useState<string | undefined>();
  return {
    playingVoice: playing,
    onPlayVoice: (v: string) => setPlaying(v),
    onPauseVoice: () => setPlaying(undefined),
  };
}

export const Overview: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<BotIdentityData>>({
      botName: "Rhea",
      primaryRole: "customer-support",
      tone: ["Conversational"],
      voice: "rhea-female",
      language: "en-in",
    });
    const voice = useVoicePlayback();
    return (
      <div className="max-w-[800px]">
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          {...voice}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<BotIdentityData>>({});
    const voice = useVoicePlayback();
    return (
      <div className="max-w-[800px]">
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          {...voice}
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
    const voice = useVoicePlayback();
    return (
      <div className="max-w-[800px]">
        <BotIdentityCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          {...voice}
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

/** All fields disabled — view mode. */
export const Disabled: Story = {
  render: function Render() {
    const data: Partial<BotIdentityData> = {
      botName: "Rhea from CaratLane",
      primaryRole: "customer-support",
      tone: ["Professional and highly concise", "Friendly and conversational"],
      voice: "rhea-female",
      language: "en-in",
    };
    return (
      <div className="max-w-[800px]">
        <BotIdentityCard
          data={data}
          onChange={() => {}}
          disabled
        />
      </div>
    );
  },
};
