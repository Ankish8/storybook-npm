import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { useState } from "react";
import {
  NumberStepField,
  type NumberStepFieldProps,
} from "./number-step-field";
import { NumberStepField as V1 } from "../number-step-field";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const meta: Meta<typeof NumberStepField> = {
  title: "V2/Components/NumberStepField",
  component: NumberStepField,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2185-15837",
    },
    layout: "centered",
    controls: {
      include: [
        "value",
        "min",
        "max",
        "step",
        "suffix",
        "disabled",
        "onValueChange",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "number-step-field",
          summary:
            "A constrained numeric field with custom step controls and a unit suffix.",
          changes: [
            ["Field", "4px corners", "8px corners; 40px height"],
            ["Focus", "1px halo", "Teal border and 4px glow"],
            ["Typography", "Inherited", "Inter; 16px numeric value"],
          ],
          tokens: [
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Focus", "--semantic-border-accent", "#27ABB8", "#27ABB8"],
            ["Suffix", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
          ],
          guidance:
            "Give the field an accessible name. Values stay integral and are clamped to min/max; step controls preserve focus so validation still runs on blur.",
        }),
      },
    },
  },
  args: {
    value: 1,
    min: 0,
    max: 23,
    step: 1,
    suffix: "hours",
    disabled: false,
    "aria-label": "Delay",
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    suffix: { control: "text" },
    disabled: { control: "boolean" },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <div className="w-72 max-w-full">
        <NumberStepField
          {...args}
          onValueChange={(value) => {
            args.onValueChange(value);
            updateArgs({ value });
          }}
        />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Minutes: Story = {
  args: { value: 30, max: 59, suffix: "minutes" },
};
export const Disabled: Story = { args: { disabled: true } };
export const AtMinimum: Story = { args: { value: 0 } };
export const AtMaximum: Story = { args: { value: 23 } };
function Sample(args: NumberStepFieldProps) {
  const [value, setValue] = useState(args.value);
  return (
    <NumberStepField
      {...args}
      value={value}
      onValueChange={(n) => {
        setValue(n);
        args.onValueChange(n);
      }}
    />
  );
}
export const AllVariants: Story = {
  parameters: gallery(
    ["suffix", "min", "max", "value"],
    "Hours and minutes have fixed limits and initial values. Step and disabled controls apply to both."
  ),
  render: (args) => (
    <div className="grid w-[640px] max-w-full gap-6 sm:grid-cols-2">
      {[
        { suffix: "hours", max: 23, value: 1 },
        { suffix: "minutes", max: 59, value: 30 },
      ].map((field) => (
        <section key={field.suffix} className="min-w-0 space-y-3">
          <h3 className="m-0 text-base font-semibold capitalize">
            {field.suffix}
          </h3>
          <Sample {...args} {...field} min={0} aria-label={field.suffix} />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["disabled", "value"],
    "Enabled, hover, focus and disabled. Limits, step and suffix remain editable."
  ),
  render: (args) => (
    <div className="grid w-[640px] max-w-full gap-5 sm:grid-cols-2">
      {["Enabled", "Hover", "Focus", "Disabled"].map((state) => (
        <section key={state} className="space-y-3">
          <h3 className="m-0 text-sm font-semibold">{state}</h3>
          <Sample
            {...args}
            value={2}
            disabled={state === "Disabled"}
            className={
              state === "Hover"
                ? "pseudo-hover"
                : state === "Focus"
                  ? "pseudo-focus-within"
                  : undefined
            }
            aria-label={state}
          />
        </section>
      ))}
    </div>
  ),
};
export const V1VsV2: Story = {
  parameters: gallery(
    [],
    "Both versions use the same public numeric field API. Value updates apply to both."
  ),
  render: function Comparison(args) {
    const [, updateArgs] = useArgs();
    return (
      <div className="grid w-[640px] max-w-full gap-6 sm:grid-cols-2">
        {[V1, NumberStepField].map((Component, i) => (
          <section key={i} className="space-y-3">
            <h3 className="m-0 text-base font-semibold">{i ? "v2" : "v1"}</h3>
            <Component
              {...args}
              onValueChange={(value) => {
                args.onValueChange(value);
                updateArgs({ value });
              }}
            />
          </section>
        ))}
      </div>
    );
  },
};
function Retry(args: NumberStepFieldProps) {
  const value = args.value;
  const [saved, setSaved] = useState<number>();
  return (
    <form
      className="w-80 max-w-full space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(value);
      }}
    >
      <div>
        <h3 className="m-0 text-base font-semibold">Retry delay</h3>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          Choose a delay and save it locally.
        </p>
      </div>
      <NumberStepField
        {...args}
        value={value}
        onValueChange={args.onValueChange}
      />
      <Button type="submit" disabled={args.disabled}>
        Save delay
      </Button>
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {saved === undefined
          ? "No delay saved yet."
          : `Saved ${saved} ${args.suffix}.`}
      </p>
    </form>
  );
}
export const Usage: Story = {
  parameters: gallery(
    [],
    "A local retry setting. Typing and stepping stay synchronized with value Controls. All field controls remain live."
  ),
  render: function UsageRender(args) {
    const [, updateArgs] = useArgs();
    return (
      <Retry
        {...args}
        onValueChange={(value) => {
          args.onValueChange(value);
          updateArgs({ value });
        }}
      />
    );
  },
};
