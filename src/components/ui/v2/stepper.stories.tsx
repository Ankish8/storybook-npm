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
        "navigation",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "stepper",
          hasV1: false,
          summary:
            "Progress steps with drawn completion checks, directional connectors and horizontal or vertical layouts. This component is new in v2; existing v2 imports and defaults remain supported.",
          changes: [
            ["Small marker", "—", "24 ×24px; 1px inset border"],
            [
              "Medium marker",
              "—",
              "28 ×28px; 1px inset border, 4px halo on the current step",
            ],
            [
              "Connector",
              "—",
              "2px; fills or drains in sequence with progress, including right-to-left layouts",
            ],
            [
              "Labels",
              "—",
              "14px titles and 12px supporting text; numbers shrink into a smoothly drawn check",
            ],
            [
              "Step navigation",
              "—",
              "All enabled steps by default; opt-in completed-only navigation with Arrow and Home/End focus movement",
            ],
            [
              "Reduced motion",
              "—",
              "Checks, connectors and marker changes apply immediately",
            ],
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
            "currentStep is zero-based; steps.length completes the flow. Without onStepChange this is a read-only ordered list. By default all enabled steps remain clickable. Use navigation=completed for a strict flow; current and upcoming steps then cannot activate. Step actions are native type=button controls; Arrow keys and Home/End move focus without changing progress. Supply external Back/Continue actions and a live status for a complete flow.",
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
    navigation: { control: "radio", options: ["all", "completed"] },
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
            <h3 className="m-0 text-base font-medium capitalize">
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
          <h3 className="m-0 text-base font-medium">
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
          <h3 className="m-0 text-base font-medium">
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
        <h3 className="m-0 text-base font-medium">Create a workspace</h3>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
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
        <h4 className="m-0 text-sm font-medium">
          {args.steps[index]?.title || "Review"}
        </h4>
        <p className="m-0 mt-2 text-sm text-[var(--v2-text-secondary,#5E5E5E)]">
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
      <p
        role="status"
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
      >
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

function ProgressionHero({
  args,
  changeOrientation,
}: {
  args: StepperProps;
  changeOrientation: (value: "horizontal" | "vertical") => void;
}) {
  const index = Math.max(0, Math.min(args.steps.length, args.currentStep ?? 0));
  const done = index === args.steps.length;
  return (
    <section className="w-[520px] max-w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-semantic-text-primary">
          Workspace setup
        </span>
        <div
          role="group"
          aria-label="Stepper orientation"
          className="inline-flex gap-1 rounded-lg border border-solid border-semantic-border-layout p-1"
        >
          {(["horizontal", "vertical"] as const).map((orientation) => (
            <Button
              key={orientation}
              type="button"
              size="sm"
              variant={args.orientation === orientation ? "secondary" : "ghost"}
              aria-pressed={args.orientation === orientation}
              onClick={() => changeOrientation(orientation)}
              className="h-7 px-2 text-xs capitalize"
            >
              {orientation}
            </Button>
          ))}
        </div>
      </div>
      <Stepper {...args} navigation="completed" currentStep={index} />
      <div className="rounded-xl border border-solid border-semantic-border-layout bg-semantic-bg-primary px-4 py-3">
        <p className="m-0 text-sm font-medium text-semantic-text-primary">
          {done ? "You're ready to go" : args.steps[index]?.title}
        </p>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          {done
            ? "All setup steps are complete. Restart to replay the transitions."
            : args.steps[index]?.description}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="m-0 text-xs text-semantic-text-muted">
          {done
            ? "All steps complete"
            : `Step ${index + 1} of ${args.steps.length}`}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={args.disabled || index === 0}
            onClick={() => args.onStepChange?.(index - 1)}
          >
            Back
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={args.disabled || !args.steps.length}
            onClick={() => args.onStepChange?.(done ? 0 : index + 1)}
          >
            {done
              ? "Restart"
              : index === args.steps.length - 1
                ? "Finish"
                : "Continue"}
          </Button>
        </div>
      </div>
    </section>
  );
}

export const DocsPreview: Story = {
  parameters: gallery(
    [],
    "A compact workspace flow. Continue completes a step with a drawn check and flowing connector; Back reverses it. Revisit completed steps or switch orientation."
  ),
  render: function DocsPreviewRender(args) {
    const [, updateArgs] = useArgs();
    return (
      <ProgressionHero
        args={{
          ...args,
          onStepChange: (currentStep) => {
            args.onStepChange?.(currentStep);
            updateArgs({ currentStep });
          },
        }}
        changeOrientation={(orientation) => updateArgs({ orientation })}
      />
    );
  },
};
