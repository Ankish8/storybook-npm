import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BotNudges } from "./bot-nudges";
import type { NudgeItem } from "./types";

const meta: Meta<typeof BotNudges> = {
  title: "Custom/AI Bot/Bot Config/BotNudges",
  component: BotNudges,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Nudges section for bot configuration. Displays nudge items with toggle, delay configuration, and message input.

**Install**
\`\`\`bash
npx myoperator-ui add bot-nudges
\`\`\`

**Import**
\`\`\`tsx
import { BotNudges } from "@/components/custom/bot-nudges"
\`\`\`

### Design Tokens

| Token | Description | Preview |
|-------|-------------|---------|
| \`--semantic-text-primary\` | Section title, nudge name, field labels | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-primary);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-text-muted\` | Empty state text, info icon | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-muted);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-bg-ui\` | Nudge card background | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-bg-ui);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-bg-primary\` | Input/textarea background | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-bg-primary);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-border-layout\` | Card border | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-border-layout);border-radius:2px;vertical-align:middle" /> |`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const SINGLE_NUDGE: NudgeItem[] = [
  {
    id: "1",
    name: "Nudge 1",
    enabled: true,
    delayValue: 15,
    delayUnit: "minutes",
    message: "Hi! Are you still there? Let me know if you need any help.",
  },
];

const MULTIPLE_NUDGES: NudgeItem[] = [
  {
    id: "1",
    name: "Nudge 1",
    enabled: true,
    delayValue: 15,
    delayUnit: "minutes",
    message: "Hi! Are you still there? Let me know if you need any help.",
  },
  {
    id: "2",
    name: "Nudge 2",
    enabled: false,
    delayValue: 30,
    delayUnit: "minutes",
    message: "We noticed you have been inactive. Can we assist you further?",
  },
  {
    id: "3",
    name: "Nudge 3",
    enabled: true,
    delayValue: 1,
    delayUnit: "hours",
    message:
      "This conversation will be closed soon due to inactivity. Reply to keep it open.",
  },
];

export const Default: Story = {
  render: function Render() {
    const [nudges, setNudges] = useState<NudgeItem[]>(SINGLE_NUDGE);

    return (
      <div className="max-w-[500px]">
        <BotNudges
          nudges={nudges}
          onToggle={(id, enabled) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, enabled } : n))
            )
          }
          onDelayValueChange={(id, delayValue) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, delayValue } : n))
            )
          }
          onDelayUnitChange={(id, delayUnit) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, delayUnit } : n))
            )
          }
          onMessageChange={(id, message) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, message } : n))
            )
          }
        />
      </div>
    );
  },
};

export const WithMultipleNudges: Story = {
  name: "With Multiple Nudges",
  render: function Render() {
    const [nudges, setNudges] = useState<NudgeItem[]>(MULTIPLE_NUDGES);

    return (
      <div className="max-w-[500px]">
        <BotNudges
          nudges={nudges}
          onToggle={(id, enabled) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, enabled } : n))
            )
          }
          onDelayValueChange={(id, delayValue) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, delayValue } : n))
            )
          }
          onDelayUnitChange={(id, delayUnit) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, delayUnit } : n))
            )
          }
          onMessageChange={(id, message) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, message } : n))
            )
          }
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="max-w-[500px]">
      <BotNudges nudges={[]} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-[500px]">
      <BotNudges nudges={MULTIPLE_NUDGES} disabled />
    </div>
  ),
};
