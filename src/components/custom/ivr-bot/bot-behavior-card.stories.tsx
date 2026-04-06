import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BotBehaviorCard, type BotBehaviorData } from "./bot-behavior-card";

const meta: Meta<typeof BotBehaviorCard> = {
  title: "Custom/AI Bot/Bot Behavior Card",
  component: BotBehaviorCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `The "How It Behaves" card for configuring a bot's system prompt with character counter, \`{{\` variable autocomplete dropdown, and session variable chips. The section title includes an **info icon** (hover for tooltip); override via \`howItBehavesTooltip\` or pass \`""\` to hide it.

### onSystemPromptBlur — section-level blur

\`onSystemPromptBlur\` fires when focus leaves the **entire section** (textarea + chips), **not** when the textarea alone loses focus. This means:

- Clicking a session variable chip → **does NOT** fire the callback (focus stays inside the section)
- Clicking the instruction text → **does NOT** fire the callback
- Clicking anywhere outside the section → **fires** the callback with the complete prompt value

This ensures your API call always receives the full prompt text, including any variables the user just inserted via chips.

**Install**
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

**Import**
\`\`\`tsx
import { BotBehaviorCard } from "@/components/custom/ivr-bot/bot-behavior-card"
\`\`\``,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BotBehaviorCard>;

export const Overview: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<BotBehaviorData>>({
      systemPrompt:
        "You are a helpful assistant. Always start by greeting the user politely.",
    });
    return (
      <div className="max-w-[800px]">
        <BotBehaviorCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<BotBehaviorData>>({});
    return (
      <div className="max-w-[800px]">
        <BotBehaviorCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
        />
      </div>
    );
  },
};

export const CustomVariables: Story = {
  render: function Render() {
    const [data, setData] = useState<Partial<BotBehaviorData>>({
      systemPrompt: "Greet the caller by name.",
    });
    return (
      <div className="max-w-[800px]">
        <BotBehaviorCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          sessionVariables={[
            "{{Caller number}}",
            "{{Time}}",
            "{{Contact Details}}",
            "{{Account ID}}",
          ]}
        />
      </div>
    );
  },
};

/**
 * Demonstrates `onSystemPromptBlur` — the callback fires only when focus
 * leaves the **entire** section (textarea + chips). Try this:
 *
 * 1. Click the textarea and type something
 * 2. Click a session variable chip → notice the log does NOT fire (focus stays inside)
 * 3. Click outside the card → the log fires with the full prompt value
 */
export const WithBlurCallback: Story = {
  name: "With onSystemPromptBlur",
  render: function Render() {
    const [data, setData] = useState<Partial<BotBehaviorData>>({
      systemPrompt: "Hello! You are a helpful assistant.",
    });
    const [blurLog, setBlurLog] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-6 max-w-[800px]">
        <BotBehaviorCard
          data={data}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          onSystemPromptBlur={(value) => {
            setBlurLog((prev) => [
              `[${new Date().toLocaleTimeString()}] API call with: "${value.slice(0, 80)}${value.length > 80 ? "…" : ""}"`,
              ...prev.slice(0, 4),
            ]);
          }}
          sessionVariables={[
            "{{caller_number}}",
            "{{bot_display_number}}",
            "{{bot_did}}",
            "{{time}}",
            "{{Morning/Afternoon/Evening}}",
            "{{caller_name}}",
          ]}
        />
        <div className="rounded border border-semantic-border-layout bg-semantic-bg-ui p-4">
          <p className="m-0 text-xs font-semibold text-semantic-text-secondary mb-2">
            onSystemPromptBlur log (simulated API calls)
          </p>
          {blurLog.length === 0 ? (
            <p className="m-0 text-xs text-semantic-text-muted">
              No blur events yet. Type in the textarea, click a chip, then click outside the card.
            </p>
          ) : (
            <ul className="m-0 p-0 list-none flex flex-col gap-1">
              {blurLog.map((entry, i) => (
                <li key={i} className="text-xs text-semantic-text-primary font-mono">
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
};

/** All fields are disabled in view mode. */
export const Disabled: Story = {
  render: () => (
    <div className="max-w-[800px]">
      <BotBehaviorCard
        data={{
          systemPrompt:
            "You are a helpful assistant. Always start by greeting the user politely.",
        }}
        onChange={() => {}}
        disabled
      />
    </div>
  ),
};
