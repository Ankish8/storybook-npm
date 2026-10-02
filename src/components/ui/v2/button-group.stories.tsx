import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { useState } from "react";
import { LayoutGrid, List, Calendar } from "lucide-react";
import { ButtonGroup, type ButtonGroupProps } from "./button-group";
import { v2ComponentDocs } from "./story-docs";
import { gallery } from "../../../storybook/v2-preview";
const items = [
  { value: "grid", label: "Grid", icon: <LayoutGrid /> },
  { value: "list", label: "List", icon: <List /> },
  { value: "calendar", label: "Calendar", icon: <Calendar /> },
];
const meta: Meta<typeof ButtonGroup> = {
  title: "V2/Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: ["value", "variant", "iconOnly", "disabled", "onValueChange"],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "button-group",
          hasV1: false,
          summary:
            "Related actions and single-choice view controls in a shared container.",
          changes: [
            ["Pill", "—", "48px container; 36px radius; 0.4px border"],
            ["Toggle", "—", "32px controls; 8px padding and gap; 16px radius"],
            ["Shadow", "—", "0 2px 8px rgba(0,0,0,.06)"],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Toggle surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Selected", "--semantic-primary", "#343E55", "#343E55"],
          ],
          guidance:
            "Give icon-only actions meaningful labels. value/onValueChange are controlled; defaultValue initializes uncontrolled selection. Each item needs a distinct value.",
        }),
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=932-19755",
    },
  },
  args: {
    items,
    value: "grid",
    variant: "default",
    alignment: "start",
    iconOnly: false,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: "select", options: items.map((item) => item.value) },
    variant: { control: "select", options: ["default", "primary", "toggle"] },
    alignment: { control: "inline-radio", options: ["start", "end"] },
    iconOnly: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <ButtonGroup
        {...args}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          updateArgs({ value });
        }}
      />
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Toggle: Story = {
  args: { variant: "toggle", iconOnly: true, items: items.slice(0, 2) },
  argTypes: { value: { options: ["grid", "list"] } },
  parameters: {
    controls: {
      include: ["value", "alignment", "iconOnly", "disabled", "onValueChange"],
    },
    docs: {
      description: {
        story:
          "Two toggle actions in the recorded 180px minimum container. Start/end alignment changes their position within the available space.",
      },
    },
  },
};
export const ToggleLabels: Story = { args: { variant: "toggle" } };
export const IconsOnly: Story = { args: { iconOnly: true } };
export const LabelsOnly: Story = {
  args: { items: items.map(({ value, label }) => ({ value, label })) },
};
export const Disabled: Story = { args: { disabled: true } };
function Sample(args: ButtonGroupProps) {
  const [value, setValue] = useState(args.value);
  return (
    <ButtonGroup
      {...args}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        args.onValueChange?.(next);
      }}
    />
  );
}
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "Pill, primary and toggle containers. Other controls affect every independently selectable sample."
  ),
  render: (args) => (
    <div className="max-w-full space-y-6">
      {(["default", "primary", "toggle"] as const).map((variant) => (
        <section key={variant}>
          <h3 className="m-0 mb-3 text-base font-semibold capitalize">
            {variant}
          </h3>
          <Sample key={variant + args.value} {...args} variant={variant} />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["disabled"],
    "Enabled and disabled controls. Selected value and presentation apply to both."
  ),
  render: (args) => (
    <div className="max-w-full space-y-6">
      {[false, true].map((disabled) => (
        <section key={String(disabled)}>
          <h3 className="m-0 mb-3 text-base font-semibold">
            {disabled ? "Disabled" : "Enabled"}
          </h3>
          <Sample
            key={String(disabled) + args.value}
            {...args}
            disabled={disabled}
          />
        </section>
      ))}
    </div>
  ),
};
function ViewChooser(args: ButtonGroupProps) {
  const value = args.value || "grid";
  return (
    <section className="w-[520px] max-w-full space-y-4">
      <div>
        <h3 className="m-0 text-base font-semibold">Your conversations</h3>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          Choose a view for this example.
        </p>
      </div>
      <ButtonGroup {...args} value={value} />
      <div
        role="status"
        className="rounded-lg border border-solid border-semantic-border-layout p-4 text-sm"
      >
        Showing the {value} view
      </div>
    </section>
  );
}
export const Usage: Story = {
  parameters: gallery(
    [],
    "Choose a view to update the example below. Presentation, disabled and selected value remain editable."
  ),
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <ViewChooser
        {...args}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          updateArgs({ value });
        }}
      />
    );
  },
};
