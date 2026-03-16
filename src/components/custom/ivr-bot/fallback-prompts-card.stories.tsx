import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  FallbackPromptsCard,
  type FallbackPromptsData,
} from "./fallback-prompts-card";

const meta: Meta<typeof FallbackPromptsCard> = {
  title: "Custom/AI Bot/Fallback Prompts",
  component: FallbackPromptsCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Accordion card for configuring voicebot fallback prompts. Contains editable textarea fields for "Agent Busy" and "No Extension Found" scenarios, each with a live character counter.

**Install**
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

**Import**
\`\`\`tsx
import { FallbackPromptsCard } from "@/components/custom/ivr-bot/fallback-prompts-card"
\`\`\`

### Design Tokens

| Token | CSS Variable | Value | Preview |
|-------|-------------|-------|---------|
| Card background | \`--semantic-bg-primary\` | #FFFFFF | <span style="display:inline-block;width:16px;height:16px;background:#FFFFFF;border:1px solid #E9EAEB;border-radius:3px;vertical-align:middle"></span> |
| Card border | \`--semantic-border-layout\` | #E9EAEB | <span style="display:inline-block;width:16px;height:16px;background:#E9EAEB;border-radius:3px;vertical-align:middle"></span> |
| Title text | \`--semantic-text-primary\` | #181D27 | <span style="display:inline-block;width:16px;height:16px;background:#181D27;border-radius:3px;vertical-align:middle"></span> |
| Label text | \`--semantic-text-secondary\` | #343E55 | <span style="display:inline-block;width:16px;height:16px;background:#343E55;border-radius:3px;vertical-align:middle"></span> |
| Placeholder / counter | \`--semantic-text-muted\` | #717680 | <span style="display:inline-block;width:16px;height:16px;background:#717680;border-radius:3px;vertical-align:middle"></span> |`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<FallbackPromptsData>>({
      agentBusyPrompt:
        "Executives are busy at the moment, we will connect you soon.",
      noExtensionFoundPrompt:
        "Sorry, the requested extension is currently unavailable. Let me help you directly.",
    });
    return (
      <div className="max-w-[600px]">
        <FallbackPromptsCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          defaultOpen
        />
      </div>
    );
  },
};

/** Accordion is closed by default — click the header to expand. */
export const Collapsed: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<FallbackPromptsData>>({});
    return (
      <div className="max-w-[600px]">
        <FallbackPromptsCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

/** All fields are disabled in view/read-only mode. */
export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="max-w-[600px]">
        <FallbackPromptsCard
          data={{
            agentBusyPrompt:
              "Executives are busy at the moment, we will connect you soon.",
            noExtensionFoundPrompt:
              "Sorry, the requested extension is currently unavailable. Let me help you directly.",
          }}
          onChange={() => {}}
          disabled
          defaultOpen
        />
      </div>
    );
  },
};

/** Empty state with placeholders visible. */
export const Empty: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<FallbackPromptsData>>({
      agentBusyPrompt: "",
      noExtensionFoundPrompt: "",
    });
    return (
      <div className="max-w-[600px]">
        <FallbackPromptsCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          defaultOpen
        />
      </div>
    );
  },
};

/** Demonstrates onBlur callbacks — blur a field to see the fired value in the Actions panel. */
export const WithBlurCallbacks: Story = {
  name: "With onBlur Callbacks",
  render: function Render() {
    const [data, setData] = useState<Partial<FallbackPromptsData>>({
      agentBusyPrompt:
        "Executives are busy at the moment, we will connect you soon.",
      noExtensionFoundPrompt:
        "Sorry, the requested extension is currently unavailable. Let me help you directly.",
    });
    return (
      <div className="max-w-[600px]">
        <FallbackPromptsCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          onAgentBusyPromptBlur={(v) => console.log("onAgentBusyPromptBlur", v)}
          onNoExtensionFoundPromptBlur={(v) => console.log("onNoExtensionFoundPromptBlur", v)}
          defaultOpen
        />
      </div>
    );
  },
};

/** Custom character limit per field. */
export const CustomMaxLength: Story = {
  name: "Custom Max Length (500)",
  render: function Render() {
    const [data, setData] = useState<Partial<FallbackPromptsData>>({
      agentBusyPrompt: "Please wait.",
      noExtensionFoundPrompt: "Extension not available.",
    });
    return (
      <div className="max-w-[600px]">
        <FallbackPromptsCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          maxLength={500}
          defaultOpen
        />
      </div>
    );
  },
};
