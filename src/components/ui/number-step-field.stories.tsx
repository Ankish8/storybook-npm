import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NumberStepField } from "./number-step-field";

const meta: Meta<typeof NumberStepField> = {
  title: "Components/NumberStepField",
  component: NumberStepField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Numeric field with a trailing suffix chip. **Chevron up/down** controls sit on the right inside the white field (before the unit label), matching Figma; native spinners are hidden for a consistent look.

**Install**
\`\`\`bash
npx myoperator-ui add number-step-field
\`\`\`

**Import**
\`\`\`tsx
import { NumberStepField } from "@/components/ui/number-step-field"
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
    const [hours, setHours] = useState(1);
    const [minutes, setMinutes] = useState(30);

    return (
      <div className="flex max-w-md items-center gap-2">
        <NumberStepField
          value={hours}
          onValueChange={setHours}
          min={0}
          max={23}
          suffix="hour"
          aria-label="Delay hours"
        />
        <span className="text-sm font-medium text-semantic-text-primary select-none">
          :
        </span>
        <NumberStepField
          value={minutes}
          onValueChange={setMinutes}
          min={0}
          max={59}
          suffix="minutes"
          aria-label="Delay minutes"
        />
      </div>
    );
  },
};

export const HoursOnly: Story = {
  render: function Render() {
    const [value, setValue] = useState(1);
    return (
      <div className="w-48">
        <NumberStepField
          value={value}
          onValueChange={setValue}
          min={0}
          max={23}
          suffix="hour"
          aria-label="Hours"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-48">
      <NumberStepField
        value={5}
        onValueChange={() => {}}
        min={0}
        max={59}
        suffix="minutes"
        disabled
        aria-label="Minutes"
      />
    </div>
  ),
};
