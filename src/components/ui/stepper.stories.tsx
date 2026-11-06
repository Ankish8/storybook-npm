import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Stepper } from "./stepper";
import { Button } from "./button";

const steps = [{ label: "Call Flow" }, { label: "Campaign Details" }];

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Horizontal multi-step progress indicator. Steps before \`currentStep\` render as completed (check icon), the step at \`currentStep\` is current, the rest are pending.

**Install**
\`\`\`bash
npx myoperator-ui add stepper
\`\`\`

**Import**
\`\`\`tsx
import { Stepper } from "@/components/ui/stepper"
\`\`\`

**Usage**
\`\`\`tsx
<Stepper steps={[{ label: "Call Flow" }, { label: "Campaign Details" }]} currentStep={1} />
\`\`\`

**Design Tokens**

<table>
<thead><tr><th>Token</th><th>CSS Variable</th><th>Usage</th><th>Preview</th></tr></thead>
<tbody>
<tr><td>bg-semantic-bg-primary</td><td>--semantic-bg-primary</td><td>Bar background</td><td><div style="width:16px;height:16px;border-radius:4px;border:1px solid #ddd;background:var(--semantic-bg-primary)"></div></td></tr>
<tr><td>border-semantic-border-layout</td><td>--semantic-border-layout</td><td>Bar bottom border, connector</td><td><div style="width:16px;height:16px;border-radius:4px;background:var(--semantic-border-layout)"></div></td></tr>
<tr><td>bg-semantic-text-placeholder</td><td>--semantic-text-placeholder</td><td>Pending/current circle, label</td><td><div style="width:16px;height:16px;border-radius:4px;background:var(--semantic-text-placeholder)"></div></td></tr>
<tr><td>text-semantic-text-primary</td><td>--semantic-text-primary</td><td>Completed label</td><td><div style="width:16px;height:16px;border-radius:4px;background:var(--semantic-text-primary)"></div></td></tr>
<tr><td>bg-semantic-success-surface</td><td>--semantic-success-surface</td><td>Completed circle</td><td><div style="width:16px;height:16px;border-radius:4px;background:var(--semantic-success-surface)"></div></td></tr>
<tr><td>text-semantic-success-primary</td><td>--semantic-success-primary</td><td>Check icon</td><td><div style="width:16px;height:16px;border-radius:4px;background:var(--semantic-success-primary)"></div></td></tr>
</tbody>
</table>`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    currentStep: { control: { type: "number", min: 0, max: 2 } },
  },
  args: { steps, currentStep: 0 },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const FirstStepCurrent: Story = { args: { currentStep: 0 } };

export const FirstStepCompleted: Story = { args: { currentStep: 1 } };

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Stepper steps={steps} currentStep={0} />
      <Stepper steps={steps} currentStep={1} />
    </div>
  ),
};

export const ThreeSteps: Story = {
  args: {
    steps: [...steps, { label: "Review" }],
    currentStep: 2,
  },
};

export const Interactive: Story = {
  render: function Render() {
    const [step, setStep] = useState(0);
    return (
      <div className="flex flex-col gap-4">
        <Stepper steps={steps} currentStep={step} />
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </Button>
          <Button
            disabled={step === steps.length - 1}
            onClick={() => setStep((s) => s + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  },
};
