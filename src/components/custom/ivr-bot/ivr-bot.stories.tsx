import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { defaultHowItBehavesTooltip } from "./bot-behavior-card";
import {
  defaultAgentBusyPromptTooltip,
  defaultNoExtensionFoundPromptTooltip,
  defaultFallbackPromptsInfoTooltip,
} from "./fallback-prompts-card";
import { defaultEscalateToHumanInfoTooltip } from "./frustration-handover-card";
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
| \`fallbackPromptsInfoTooltip\` | Info icon next to **Fallback Prompts** (accordion title) |
| \`agentBusyPromptTooltip\` | Info icon next to **Agent Busy Prompt** |
| \`noExtensionFoundPromptTooltip\` | Info icon next to **No Extension Found** |
| \`escalateToHumanInfoTooltip\` | Info icon next to **Escalate to Human** (accordion title) |
| \`botIdentityMinLengthValidation\` | Enables built-in identity validation, shown one mandatory field at a time |
| \`primaryRoleOptional\` | Skips built-in validation for **Primary Role** |
| \`voiceOptional\` | Skips built-in validation for **How It Sounds** |
| \`languageOptional\` | Skips built-in validation for **What Language It Speaks** |
| \`botNameMinLengthMessage\` | Min-length message below **Bot Name & Identity** |
| \`primaryRoleMinLengthMessage\` | Min-length message below **Primary Role** |
| \`toneMinLengthMessage\` | Min-length message below **Tone** |
| \`voiceRequiredMessage\` | Required message below **How It Sounds** |
| \`languageRequiredMessage\` | Required message below **What Language It Speaks** |
| \`fallbackPromptsRequiredValidation\` | Enables built-in required validation for both fallback fields |
| \`agentBusyPromptRequiredMessage\` | Required message below **Agent Busy Prompt** |
| \`noExtensionFoundPromptRequiredMessage\` | Required message below **No Extension Found** |
| \`agentBusyPromptValidation\` | Validation below **Agent Busy Prompt** |
| \`noExtensionFoundPromptValidation\` | Validation below **No Extension Found** |
| \`escalationPromptMinLengthValidation\` | Enables built-in min-length validation for **Escalate to Human → Prompt** |
| \`escalationPromptOptional\` | Skips built-in validation for **Escalate to Human → Prompt** |
| \`escalationPromptMinLengthMessage\` | Min-length message below **Escalate to Human → Prompt** |
| \`escalationPromptValidation\` | Validation below **Escalate to Human → Prompt** |
| \`escalationDepartmentValidation\` | Enables validation for **Transfer to Department** |
| \`escalationDepartmentOptional\` | Skips built-in validation for **Transfer to Department** |
| \`escalationDepartmentValidationMessage\` | Validation message below **Transfer to Department** |

Omit a prop to use the built-in default copy. Pass \`""\` to hide a label field’s info icon, or (for section titles) to show a non-interactive icon only—same pattern as Knowledge Base.

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
    fallbackPromptsInfoTooltip: defaultFallbackPromptsInfoTooltip,
    agentBusyPromptTooltip: defaultAgentBusyPromptTooltip,
    noExtensionFoundPromptTooltip: defaultNoExtensionFoundPromptTooltip,
    escalateToHumanInfoTooltip: defaultEscalateToHumanInfoTooltip,
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
    fallbackPromptsInfoTooltip: {
      control: "text",
      description:
        "Tooltip for the Fallback Prompts accordion title info icon. Use \"\" for non-interactive icon; omit for built-in default.",
    },
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
    botNameMinLengthMessage: {
      control: "text",
      description: "Min-length validation message shown below Bot Name & Identity.",
    },
    primaryRoleMinLengthMessage: {
      control: "text",
      description: "Min-length validation message shown below Primary Role.",
    },
    toneMinLengthMessage: {
      control: "text",
      description: "Min-length validation message shown below Tone.",
    },
    voiceRequiredMessage: {
      control: "text",
      description: "Required validation message shown below How It Sounds.",
    },
    languageRequiredMessage: {
      control: "text",
      description: "Required validation message shown below What Language It Speaks.",
    },
    botNameValidation: {
      control: "text",
      description: "External validation message shown below Bot Name & Identity.",
    },
    primaryRoleValidation: {
      control: "text",
      description: "External validation message shown below Primary Role.",
    },
    toneValidation: {
      control: "text",
      description: "External validation message shown below Tone.",
    },
    voiceValidation: {
      control: "text",
      description: "External validation message shown below How It Sounds.",
    },
    languageValidation: {
      control: "text",
      description: "External validation message shown below What Language It Speaks.",
    },
    fallbackPromptsRequiredValidation: {
      control: "boolean",
      description:
        "Shows required validation messages when Agent Busy Prompt or No Extension Found is empty. Defaults to true.",
    },
    agentBusyPromptRequiredMessage: {
      control: "text",
      description: "Required validation message shown below Agent Busy Prompt.",
    },
    noExtensionFoundPromptRequiredMessage: {
      control: "text",
      description: "Required validation message shown below No Extension Found.",
    },
    agentBusyPromptValidation: {
      control: "text",
      description: "Validation message shown below Agent Busy Prompt.",
    },
    noExtensionFoundPromptValidation: {
      control: "text",
      description: "Validation message shown below No Extension Found.",
    },
    escalateToHumanInfoTooltip: {
      control: "text",
      description:
        "Tooltip for the Escalate to Human accordion title info icon. Use \"\" for non-interactive icon; omit for built-in default.",
    },
    escalationPromptValidation: {
      control: "text",
      description: "Validation message shown below Escalate to Human Prompt.",
    },
    escalationPromptMinLength: {
      control: "number",
      description: "Minimum text length for Escalate to Human Prompt.",
    },
    escalationPromptMinLengthValidation: {
      control: "boolean",
      description:
        "Shows min-length validation for Escalate to Human Prompt after interaction. Defaults to true.",
    },
    escalationPromptOptional: {
      control: "boolean",
      description:
        "Skips built-in Escalate to Human Prompt validation when true.",
    },
    escalationPromptMinLengthMessage: {
      control: "text",
      description:
        "Min-length validation message shown below Escalate to Human Prompt.",
    },
    escalationDepartmentValidation: {
      control: "boolean",
      description: "Enables validation for Transfer to Department.",
    },
    escalationDepartmentValidationMessage: {
      control: "text",
      description: "Validation message shown below Transfer to Department.",
    },
    escalationDepartmentMinLength: {
      control: "number",
      description: "Minimum text length for Transfer to Department.",
    },
    escalationDepartmentOptional: {
      control: "boolean",
      description: "Skips built-in Transfer to Department validation when true.",
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
        fallbackPromptsInfoTooltip={args.fallbackPromptsInfoTooltip}
        agentBusyPromptTooltip={args.agentBusyPromptTooltip}
        noExtensionFoundPromptTooltip={args.noExtensionFoundPromptTooltip}
        escalateToHumanInfoTooltip={args.escalateToHumanInfoTooltip}
        botIdentityMinLengthValidation={args.botIdentityMinLengthValidation}
        botNameMinLength={args.botNameMinLength}
        primaryRoleMinLength={args.primaryRoleMinLength}
        toneMinLength={args.toneMinLength}
        primaryRoleOptional={args.primaryRoleOptional}
        voiceOptional={args.voiceOptional}
        languageOptional={args.languageOptional}
        botNameMinLengthMessage={args.botNameMinLengthMessage}
        primaryRoleMinLengthMessage={args.primaryRoleMinLengthMessage}
        toneMinLengthMessage={args.toneMinLengthMessage}
        voiceRequiredMessage={args.voiceRequiredMessage}
        languageRequiredMessage={args.languageRequiredMessage}
        botNameValidation={args.botNameValidation}
        primaryRoleValidation={args.primaryRoleValidation}
        toneValidation={args.toneValidation}
        voiceValidation={args.voiceValidation}
        languageValidation={args.languageValidation}
        escalationPromptValidation={args.escalationPromptValidation}
        escalationPromptMinLength={args.escalationPromptMinLength}
        escalationPromptMinLengthValidation={
          args.escalationPromptMinLengthValidation
        }
        escalationPromptOptional={args.escalationPromptOptional}
        escalationPromptMinLengthMessage={args.escalationPromptMinLengthMessage}
        escalationDepartmentValidation={args.escalationDepartmentValidation}
        escalationDepartmentValidationMessage={
          args.escalationDepartmentValidationMessage
        }
        escalationDepartmentMinLength={args.escalationDepartmentMinLength}
        escalationDepartmentOptional={args.escalationDepartmentOptional}
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
          escalationPrompt: "",
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
      escalationPrompt: "Executives are busy at the moment, we will connect you soon.",
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
        fallbackPromptsInfoTooltip={args.fallbackPromptsInfoTooltip}
        agentBusyPromptTooltip={args.agentBusyPromptTooltip}
        noExtensionFoundPromptTooltip={args.noExtensionFoundPromptTooltip}
        escalateToHumanInfoTooltip={args.escalateToHumanInfoTooltip}
        botIdentityMinLengthValidation={args.botIdentityMinLengthValidation}
        botNameMinLength={args.botNameMinLength}
        primaryRoleMinLength={args.primaryRoleMinLength}
        toneMinLength={args.toneMinLength}
        primaryRoleOptional={args.primaryRoleOptional}
        voiceOptional={args.voiceOptional}
        languageOptional={args.languageOptional}
        botNameMinLengthMessage={args.botNameMinLengthMessage}
        primaryRoleMinLengthMessage={args.primaryRoleMinLengthMessage}
        toneMinLengthMessage={args.toneMinLengthMessage}
        voiceRequiredMessage={args.voiceRequiredMessage}
        languageRequiredMessage={args.languageRequiredMessage}
        botNameValidation={args.botNameValidation}
        primaryRoleValidation={args.primaryRoleValidation}
        toneValidation={args.toneValidation}
        voiceValidation={args.voiceValidation}
        languageValidation={args.languageValidation}
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
