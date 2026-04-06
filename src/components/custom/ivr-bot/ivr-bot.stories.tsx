import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { defaultHowItBehavesTooltip } from "./bot-behavior-card";
import {
  defaultAgentBusyPromptTooltip,
  defaultNoExtensionFoundPromptTooltip,
} from "./fallback-prompts-card";
import { IvrBotConfig } from "./ivr-bot-config";
import { BOT_KNOWLEDGE_STATUS } from "./types";

// ─── IvrBotConfig stories ────────────────────────────────────────────────────
const ivrBotMeta: Meta<typeof IvrBotConfig> = {
  title: "Custom/AI Bot/Voice bot Config",
  component: IvrBotConfig,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **IvrBotConfig** is the full-page configuration view for an IVR/Voicebot. It organises settings into two columns:

**Left column (always open)**
- **Who The Bot Is** — Bot name, primary role, tone, voice, language
- **How It Behaves** — System prompt with session variable chips (info tooltip on section title via \`howItBehavesTooltip\`)

**Left column (accordion)**
- **Fallback Prompts** — Agent busy prompt & no-extension fallback (info tooltips on each field via \`agentBusyPromptTooltip\`, \`noExtensionFoundPromptTooltip\`)

**Right column (always open)**
- **Knowledge Base** — File list with training status
- **Functions** — Built-in & custom function list

**Right column (accordion)**
- **Escalate to Human** — Auto-escalation toggle + transfer department selector
- **Advanced Settings** — Silence timeout, call-end threshold, interruption handling

### Install
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

### Import
\`\`\`tsx
import { IvrBotConfig } from "@/components/custom/ivr-bot";
\`\`\`

### Tooltip props (\`IvrBotConfig\`)

| Prop | Target |
|------|--------|
| \`howItBehavesTooltip\` | Info icon next to **How It Behaves** |
| \`agentBusyPromptTooltip\` | Info icon next to **Agent Busy Prompt** |
| \`noExtensionFoundPromptTooltip\` | Info icon next to **No Extension Found** |

Omit a prop to use the built-in default copy. Pass an empty string (\`""\`) to hide that info icon.

### Design Tokens

| Token | Purpose |
|-------|---------|
| \`bg-semantic-bg-primary\` | Card & input backgrounds |
| \`bg-semantic-bg-ui\` | Page background, table header |
| \`border-semantic-border-layout\` | Card, input, divider borders |
| \`text-semantic-text-primary\` | Section headings, field values |
| \`text-semantic-text-secondary\` | Labels, secondary headings |
| \`text-semantic-text-muted\` | Placeholder, helper text |
| \`bg-semantic-primary\` | Publish Bot button |
| \`bg-semantic-success-surface\` | Training/Trained status badge |
| \`bg-semantic-error-surface\` | Error status badge |
        `,
      },
    },
  },
  args: {
    howItBehavesTooltip: defaultHowItBehavesTooltip,
    agentBusyPromptTooltip: defaultAgentBusyPromptTooltip,
    noExtensionFoundPromptTooltip: defaultNoExtensionFoundPromptTooltip,
  },
  argTypes: {
    botTitle: { control: "text", description: "Page title shown in header" },
    botType: { control: "text", description: "Bot type badge label" },
    onSaveAsDraft: { action: "saveAsDraft" },
    onPublish: { action: "publish" },
    onDownloadKnowledgeFile: { action: "downloadKnowledgeFile" },
    onDeleteKnowledgeFile: { action: "deleteKnowledgeFile" },
    knowledgeDownloadDisabled: { control: "boolean", description: "Independently disables knowledge file download buttons" },
    knowledgeDeleteDisabled: { control: "boolean", description: "Independently disables knowledge file delete buttons" },
    onCreateFunction: { action: "createFunction" },
    onDeleteFunction: { action: "deleteFunction" },
    functionEditDisabled: { control: "boolean", description: "Independently disables function edit buttons" },
    functionDeleteDisabled: { control: "boolean", description: "Independently disables function delete buttons" },
    onSystemPromptBlur: { action: "systemPromptBlur" },
    onBack: { action: "back" },
    onPlayVoice: { action: "playVoice" },
    onPauseVoice: { action: "pauseVoice" },
    howItBehavesTooltip: {
      control: "text",
      description:
        "Tooltip for the How It Behaves section info icon. Use \"\" to hide the icon; omit (reset) for built-in default.",
    },
    agentBusyPromptTooltip: {
      control: "text",
      description:
        "Tooltip for the Agent Busy Prompt label. Use \"\" to hide; omit for built-in default.",
    },
    noExtensionFoundPromptTooltip: {
      control: "text",
      description:
        "Tooltip for the No Extension Found label. Use \"\" to hide; omit for built-in default.",
    },
  },
};

export default ivrBotMeta;
type Story = StoryObj<typeof IvrBotConfig>;

export const Overview: Story = {
  render: function Render(args) {
    const [playingVoice, setPlayingVoice] = useState<string | undefined>();
    return (
      <IvrBotConfig
        botTitle="IVR bot"
        botType="Voicebot"
        playingVoice={playingVoice}
        onPlayVoice={(v) => setPlayingVoice(v)}
        onPauseVoice={() => setPlayingVoice(undefined)}
        howItBehavesTooltip={args.howItBehavesTooltip}
        agentBusyPromptTooltip={args.agentBusyPromptTooltip}
        noExtensionFoundPromptTooltip={args.noExtensionFoundPromptTooltip}
        initialData={{
          botName: "Rhea",
          primaryRole: "customer-support",
          tone: ["Conversational"],
          voice: "rhea-female",
          language: "en-in",
          systemPrompt:
            "You are a helpful assistant. Always start by greeting the user politely: 'Hello! Welcome to CaratLane. How can I assist you today?'\n\nIf the caller mentions order tracking, ask for their order ID and look it up via the get_order_status function.",
          knowledgeBaseFiles: [
            { id: "kb-1", name: "Lead validation bot", status: BOT_KNOWLEDGE_STATUS.PROCESSING },
            { id: "kb-2", name: "FAQ_2025.pdf",         status: BOT_KNOWLEDGE_STATUS.READY      },
          ],
          functions: [
            {
              id: "fn-1",
              name: "transfer_to_extension (extension_number)",
              isBuiltIn: true,
            },
            { id: "fn-2", name: "end_call()", isBuiltIn: true },
            { id: "fn-3", name: "get_order_status (order_id)" },
          ],
          frustrationHandoverEnabled: false,
          escalationDepartment: "",
          silenceTimeout: 15,
          callEndThreshold: 3,
          interruptionHandling: true,
        }}
      />
    );
  },
};

export const EmptyState: Story = {
  args: {
    botTitle: "New Voicebot",
    botType: "Voicebot",
    initialData: {
      knowledgeBaseFiles: [],
      functions: [],
    },
  },
};

export const FrustrationHandoverEnabled: Story = {
  name: "Escalate to Human — Enabled",
  args: {
    botTitle: "Support Bot",
    botType: "Voicebot",
    initialData: {
      frustrationHandoverEnabled: true,
      escalationDepartment: "support",
      silenceTimeout: 10,
      callEndThreshold: 2,
      interruptionHandling: false,
    },
  },
};

export const WithErrorFile: Story = {
  name: "Knowledge Base — Error File",
  args: {
    initialData: {
      knowledgeBaseFiles: [
        { id: "kb-1", name: "Lead validation bot", status: BOT_KNOWLEDGE_STATUS.PROCESSING },
        { id: "kb-2", name: "Corrupted_data.pdf",  status: BOT_KNOWLEDGE_STATUS.FAILED     },
        { id: "kb-3", name: "FAQ_2025.pdf",         status: BOT_KNOWLEDGE_STATUS.READY      },
      ],
    },
  },
};

/** Demonstrates overriding all dropdown options — voices, languages, departments, session variables. */
export const CustomDropdownOptions: Story = {
  render: function Render(args) {
    const [playingVoice, setPlayingVoice] = useState<string | undefined>();
    return (
      <IvrBotConfig
        botTitle="US Region Bot"
        botType="Voicebot"
        playingVoice={playingVoice}
        onPlayVoice={(v) => setPlayingVoice(v)}
        onPauseVoice={() => setPlayingVoice(undefined)}
        howItBehavesTooltip={args.howItBehavesTooltip}
        agentBusyPromptTooltip={args.agentBusyPromptTooltip}
        noExtensionFoundPromptTooltip={args.noExtensionFoundPromptTooltip}
        voiceOptions={[
          { value: "emma-us", label: "Emma - US Female" },
          { value: "james-us", label: "James - US Male" },
          { value: "sophia-uk", label: "Sophia - UK Female" },
        ]}
        languageOptions={[
          { value: "en-us", label: "English (US)" },
          { value: "en-gb", label: "English (UK)" },
          { value: "es-us", label: "Spanish (US)" },
        ]}
        roleOptions={[
          { value: "helpdesk", label: "Help Desk Agent" },
          { value: "onboarding", label: "Onboarding Assistant" },
        ]}
        toneOptions={[
          { value: "Warm and approachable", label: "Warm and approachable" },
          { value: "Strictly professional", label: "Strictly professional" },
        ]}
        sessionVariables={[
          "{{Caller number}}",
          "{{Account ID}}",
          "{{Region}}",
          "{{Plan Type}}",
        ]}
        escalationDepartmentOptions={[
          { value: "tier-2", label: "Tier 2 Support" },
          { value: "engineering", label: "Engineering" },
          { value: "account-mgmt", label: "Account Management" },
        ]}
        silenceTimeoutMax={120}
        callEndThresholdMax={20}
        initialData={{
          botName: "Emma",
          primaryRole: "helpdesk",
          voice: "emma-us",
          language: "en-us",
          functions: [
            { id: "fn-1", name: "transfer_to_extension (extension_number)", isBuiltIn: true },
            { id: "fn-2", name: "end_call()", isBuiltIn: true },
            { id: "fn-3", name: "lookup_account (account_id)" },
          ],
        }}
      />
    );
  },
};
