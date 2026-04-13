import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BotFollowUps } from "./bot-follow-ups";
import type { NudgeItem } from "./types";
import { DEFAULT_MAX_TOTAL_MINUTES } from "./types";

const meta: Meta<typeof BotFollowUps> = {
  title: "Custom/AI Bot/Bot Config/Bot Follow-ups",
  component: BotFollowUps,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Follow-ups section for bot configuration. Delay uses \`NumberStepField\` (hour/minute with **chevron steppers inside** the white field and suffix chips). Row labels default to **Followup 1**, **Followup 2**, …; override with \`getItemLabel\`. Combined delay is 0–23h 59m by default, with optional blur on the message field.

**Install**
\`\`\`bash
npx myoperator-ui add bot-follow-ups
\`\`\`

**Import**
\`\`\`tsx
import { BotFollowUps, DEFAULT_MAX_TOTAL_MINUTES } from "@/components/custom/bot-follow-ups"
\`\`\`

### Design Tokens

| Token | Description | Preview |
|-------|-------------|---------|
| \`--semantic-text-primary\` | Section title, row label, field labels | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-primary);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-text-muted\` | Tooltip control, secondary suffix labels | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-muted);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-bg-ui\` | Suffix chips (hour/minutes), tooltip button | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-bg-ui);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-bg-primary\` | Input/textarea background | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-bg-primary);border-radius:2px;vertical-align:middle" /> |
| \`--semantic-border-layout\` | Card border | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-border-layout);border-radius:2px;vertical-align:middle" /> |`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Section heading" },
    tooltip: { control: "text", description: "Tooltip next to the title" },
    maxHours: { control: { type: "number", min: 0, max: 23 } },
    maxMinutes: { control: { type: "number", min: 0, max: 59 } },
    minTotalMinutes: { control: { type: "number", min: 0 } },
    maxTotalMinutes: { control: { type: "number", min: 0 } },
    disabled: { control: "boolean" },
    getItemLabel: {
      description:
        "Optional override for row label (default: Followup 1, Followup 2, …)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SINGLE_NUDGE: NudgeItem[] = [
  {
    id: "1",
    name: "Followup 1",
    enabled: true,
    delayHours: 1,
    delayMinutes: 30,
    message:
      "I'm still here if you need anything. Feel free to ask any questions!",
  },
];

const MULTIPLE_NUDGES: NudgeItem[] = [
  {
    id: "1",
    name: "Followup 1",
    enabled: true,
    delayHours: 1,
    delayMinutes: 30,
    message:
      "I'm still here if you need anything. Feel free to ask any questions!",
  },
  {
    id: "2",
    name: "Followup 2",
    enabled: true,
    delayHours: 1,
    delayMinutes: 30,
    message:
      "I'm still here if you need anything. Feel free to ask any questions!",
  },
];

export const Default: Story = {
  render: function Render() {
    const [nudges, setNudges] = useState<NudgeItem[]>(SINGLE_NUDGE);

    return (
      <div className="max-w-[500px]">
        <BotFollowUps
          title="Follow-ups"
          tooltip="Configure automated follow-up messages when the user is inactive for the delay you set."
          maxHours={23}
          maxMinutes={59}
          minTotalMinutes={0}
          maxTotalMinutes={DEFAULT_MAX_TOTAL_MINUTES}
          nudges={nudges}
          onToggle={(id, enabled) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, enabled } : n))
            )
          }
          onDelayHoursChange={(id, delayHours) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, delayHours } : n))
            )
          }
          onDelayMinutesChange={(id, delayMinutes) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, delayMinutes } : n))
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

export const WithMultipleFollowUps: Story = {
  name: "With Multiple Follow-ups",
  render: function Render() {
    const [nudges, setNudges] = useState<NudgeItem[]>(MULTIPLE_NUDGES);

    return (
      <div className="max-w-[500px]">
        <BotFollowUps
          title="Follow-ups"
          tooltip="Configure automated follow-up messages when the user is inactive for the delay you set."
          maxHours={23}
          maxMinutes={59}
          minTotalMinutes={0}
          maxTotalMinutes={DEFAULT_MAX_TOTAL_MINUTES}
          nudges={nudges}
          onToggle={(id, enabled) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, enabled } : n))
            )
          }
          onDelayHoursChange={(id, delayHours) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, delayHours } : n))
            )
          }
          onDelayMinutesChange={(id, delayMinutes) =>
            setNudges((prev) =>
              prev.map((n) => (n.id === id ? { ...n, delayMinutes } : n))
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
      <BotFollowUps nudges={[]} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-[500px]">
      <BotFollowUps nudges={MULTIPLE_NUDGES} disabled />
    </div>
  ),
};
