import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { useState } from "react";
import { Stepper, type StepperProps } from "./stepper";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const steps = [
  { title: "Details", description: "Add your workspace details" },
  { title: "Team", description: "Choose the people to invite" },
  { title: "Review", description: "Confirm your settings" },
];
const meta: Meta<typeof Stepper> = {
  title: "V2/Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "steps",
        "currentStep",
        "size",
        "orientation",
        "marker",
        "disabled",
        "onStepChange",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "stepper",
          hasV1: false,
          summary:
            "Progressive steps with numbered or icon markers in horizontal and vertical layouts.",
          changes: [
            ["Small marker", "—", "20 ×20px; 0.4px border"],
            ["Medium marker", "—", "24 ×24px; 0.4px border"],
            ["Connector", "—", "2px; rounded ends"],
            ["Labels", "—", "Semibold titles and regular supporting text"],
          ],
          tokens: [
            [
              "Marker/connector",
              "--semantic-border-layout",
              "#E9EAEB",
              "#E9EAEB",
            ],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Supporting text", "--semantic-text-muted", "#717680", "#717680"],
          ],
          guidance:
            "currentStep is a zero-based index exposed as aria-current=step. Without onStepChange this is a read-only progress display; supplying it enables native keyboard-accessible step actions. Mark unavailable steps disabled.",
        }),
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2705-35397",
    },
  },
  args: {
    steps,
    currentStep: 0,
    size: "md",
    orientation: "horizontal",
    marker: "numbered",
    disabled: false,
    onStepChange: fn(),
  },
  argTypes: {
    steps: { control: "object" },
    currentStep: { control: { type: "number", min: 0, max: 2, step: 1 } },
    size: { control: "radio", options: ["sm", "md"] },
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
    marker: { control: "radio", options: ["numbered", "icon"] },
    disabled: { control: "boolean" },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <div
        className={
          args.orientation === "vertical"
            ? "w-80 max-w-full"
            : "w-[760px] max-w-full"
        }
      >
        <Stepper
          {...args}
          onStepChange={(index) => {
            args.onStepChange?.(index);
            updateArgs({ currentStep: index });
          }}
        />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };
export const Small: Story = { args: { size: "sm" } };
export const Icons: Story = { args: { marker: "icon", currentStep: 1 } };
export const Disabled: Story = { args: { disabled: true } };
function Sample(args: StepperProps) {
  const [index, setIndex] = useState(args.currentStep);
  return (
    <Stepper
      {...args}
      currentStep={index}
      onStepChange={(n) => {
        setIndex(n);
        args.onStepChange?.(n);
      }}
    />
  );
}
export const AllVariants: Story = {
  parameters: gallery(
    ["orientation", "marker"],
    "Four fixed combinations of orientation and marker. Steps, size, disabled and initial current step update every example."
  ),
  render: (args) => (
    <div className="grid w-[1000px] max-w-full gap-8 lg:grid-cols-2">
      {(["horizontal", "vertical"] as const).flatMap((orientation) =>
        (["numbered", "icon"] as const).map((marker) => (
          <section key={orientation + marker} className="min-w-0 space-y-4">
            <h3 className="m-0 text-base font-semibold capitalize">
              {orientation} · {marker}
            </h3>
            <Sample
              key={args.currentStep}
              {...args}
              orientation={orientation}
              marker={marker}
            />
          </section>
        ))
      )}
    </div>
  ),
};
export const AllSizes: Story = {
  parameters: gallery(
    ["size"],
    "Small and medium marker/text sizes. Every other control applies."
  ),
  render: (args) => (
    <div className="grid w-[1000px] max-w-full gap-8 lg:grid-cols-2">
      {(["sm", "md"] as const).map((size) => (
        <section key={size} className="space-y-4">
          <h3 className="m-0 text-base font-semibold">
            {size === "sm" ? "Small" : "Medium"}
          </h3>
          <Sample key={args.currentStep} {...args} size={size} />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["currentStep", "disabled"],
    "Start, intermediate, final and disabled displays. Layout, marker, size and labels apply to all."
  ),
  render: (args) => (
    <div className="grid w-[1000px] max-w-full gap-8 lg:grid-cols-2">
      {[0, 1, 2, 3].map((index) => (
        <section key={index} className="space-y-4">
          <h3 className="m-0 text-base font-semibold">
            {index === 3 ? "Disabled" : `Current step ${index + 1}`}
          </h3>
          <Sample
            {...args}
            currentStep={Math.min(2, index)}
            disabled={index === 3}
          />
        </section>
      ))}
    </div>
  ),
};
function Onboarding(args: StepperProps) {
  const index = Math.max(
    0,
    Math.min(args.steps.length - 1, args.currentStep || 0)
  );
  const [complete, setComplete] = useState(false);
  return (
    <section className="w-[760px] max-w-full space-y-6">
      <div>
        <h3 className="m-0 text-base font-semibold">Create a workspace</h3>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          Navigate the local setup flow with step labels or actions.
        </p>
      </div>
      <Stepper
        {...args}
        currentStep={index}
        onStepChange={(n) => {
          setComplete(false);
          args.onStepChange?.(n);
        }}
      />
      <div className="rounded-lg border border-solid border-semantic-border-layout p-4">
        <h4 className="m-0 text-sm font-semibold">
          {args.steps[index]?.title || "Review"}
        </h4>
        <p className="m-0 mt-2 text-sm text-semantic-text-secondary">
          {args.steps[index]?.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled={args.disabled || index === 0}
          onClick={() => {
            args.onStepChange?.(index - 1);
            setComplete(false);
          }}
        >
          Back
        </Button>
        <Button
          disabled={args.disabled}
          onClick={() =>
            index < args.steps.length - 1
              ? args.onStepChange?.(index + 1)
              : setComplete(true)
          }
        >
          {index === args.steps.length - 1 ? "Finish" : "Continue"}
        </Button>
      </div>
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {complete
          ? "Workspace setup completed."
          : `Step ${index + 1} of ${args.steps.length}`}
      </p>
    </section>
  );
}
export const Usage: Story = {
  parameters: gallery(
    [],
    "A local setup flow. Step actions stay synchronized with currentStep Controls; all layout and content controls apply."
  ),
  render: function UsageRender(args) {
    const [, updateArgs] = useArgs();
    return (
      <Onboarding
        {...args}
        onStepChange={(currentStep) => {
          args.onStepChange?.(currentStep);
          updateArgs({ currentStep });
        }}
      />
    );
  },
};
