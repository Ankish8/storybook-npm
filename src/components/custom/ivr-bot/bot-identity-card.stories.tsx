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

Built-in validation is enabled by default and appears one mandatory field at a time in section order. Use \`botIdentityMinLengthValidation={false}\` to disable all built-in identity validation, or mark individual fields optional with props like \`primaryRoleOptional\`, \`voiceOptional\`, and \`languageOptional\`.

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
    botIdentityMinLengthValidation: {
      control: "boolean",
      description:
        "Shows min-length validation for Bot Name & Identity, Primary Role, and Tone. Defaults to true.",
    },
    botNameMinLength: {
      control: "number",
      description: "Minimum text length for Bot Name & Identity.",
    },
    primaryRoleMinLength: {
      control: "number",
      description: "Minimum text length for Primary Role.",
    },
    toneMinLength: {
      control: "number",
      description: "Minimum text length across selected or draft Tone text.",
    },
    botNameValidation: {
      control: "text",
      description: "External validation message for Bot Name & Identity.",
    },
    primaryRoleValidation: {
      control: "text",
      description: "External validation message for Primary Role.",
    },
    toneValidation: {
      control: "text",
      description: "External validation message for Tone.",
    },
    voiceValidation: {
      control: "text",
      description: "External validation message for How It Sounds.",
    },
    languageValidation: {
      control: "text",
      description: "External validation message for What Language It Speaks.",
    },
    botNameMinLengthMessage: {
      control: "text",
      description: "Custom min-length validation message for Bot Name & Identity.",
    },
    primaryRoleMinLengthMessage: {
      control: "text",
      description: "Custom min-length validation message for Primary Role.",
    },
    toneMinLengthMessage: {
      control: "text",
      description: "Custom min-length validation message for Tone.",
    },
    primaryRoleOptional: {
      control: "boolean",
      description: "Skips built-in Primary Role validation when true.",
    },
    voiceOptional: {
      control: "boolean",
      description: "Skips built-in How It Sounds validation when true.",
    },
    languageOptional: {
      control: "boolean",
      description: "Skips built-in What Language It Speaks validation when true.",
    },
    voiceRequiredMessage: {
      control: "text",
      description: "Custom required validation message for How It Sounds.",
    },
    languageRequiredMessage: {
      control: "text",
      description: "Custom required validation message for What Language It Speaks.",
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
