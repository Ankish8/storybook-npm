import type { Meta, StoryObj } from "@storybook/react";
import { IvrBotConfig } from "./ivr-bot-config";

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
- **How It Behaves** — System prompt with session variable chips

**Left column (accordion)**
- **Fallback Prompts** — Agent busy prompt & no-extension fallback

**Right column (always open)**
- **Knowledge Base** — File list with training status
- **Functions** — Built-in & custom function list

**Right column (accordion)**
- **Frustration Handover** — Enable toggle + escalation dept selector
- **Advanced Settings** — Silence timeout, call-end threshold, interruption handling

### Install
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

### Import
\`\`\`tsx
import { IvrBotConfig } from "@/components/custom/ivr-bot";
\`\`\`

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
  argTypes: {
    botTitle: { control: "text", description: "Page title shown in header" },
    botType: { control: "text", description: "Bot type badge label" },
    onSaveAsDraft: { action: "saveAsDraft" },
    onPublish: { action: "publish" },
    onAddKnowledgeFile: { action: "addKnowledgeFile" },
    onDownloadKnowledgeFile: { action: "downloadKnowledgeFile" },
    onDeleteKnowledgeFile: { action: "deleteKnowledgeFile" },
    onCreateFunction: { action: "createFunction" },
    onBack: { action: "back" },
  },
};

export default ivrBotMeta;
type Story = StoryObj<typeof IvrBotConfig>;

export const Overview: Story = {
  args: {
    botTitle: "IVR bot",
    botType: "Voicebot",
    initialData: {
      botName: "Rhea",
      primaryRole: "customer-support",
      tone: ["Conversational"],
      voice: "rhea-female",
      language: "en-in",
      systemPrompt:
        "You are a helpful assistant. Always start by greeting the user politely: 'Hello! Welcome to CaratLane. How can I assist you today?'\n\nIf the caller mentions order tracking, ask for their order ID and look it up via the get_order_status function.",
      knowledgeBaseFiles: [
        { id: "kb-1", name: "Lead validation bot", status: "training" },
        { id: "kb-2", name: "FAQ_2025.pdf", status: "trained" },
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
    },
  },
};

export const EmptyState: Story = {
  name: "Empty State",
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
  name: "Frustration Handover — Enabled",
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
        { id: "kb-1", name: "Lead validation bot", status: "training" },
        { id: "kb-2", name: "Corrupted_data.pdf", status: "error" },
        { id: "kb-3", name: "FAQ_2025.pdf", status: "trained" },
      ],
    },
  },
};


