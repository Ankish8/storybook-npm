import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { expect, fn, userEvent, within } from "storybook/test";
import { useState } from "react";
import { Radio, RadioGroup } from "./radio";
import { Button } from "./button";
import { v2ComponentDocs } from "./story-docs";
import { gallery } from "../../../storybook/v2-preview";
const meta: Meta<typeof Radio> = {
  title: "V2/Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "label",
        "description",
        "checked",
        "disabled",
        "onCheckedChange",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2650-18296",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "radio",
          hasV1: false,
          exportName: "Radio, RadioGroup",
          summary:
            "Single-choice selection with native radio semantics and optional labels.",
          changes: [
            ["Control", "—", "16px circle, 1.2px border, 6px selected dot"],
            ["Focus", "—", "2px primary surface highlight"],
            ["Labels", "—", "14px medium Inter; 12px helper"],
          ],
          tokens: [
            ["Border", "--semantic-border-layout", "E9EAEB", "#E9EAEB"],
            ["Selected", "--semantic-primary", "343E55", "#343E55"],
            ["Focus", "--semantic-primary-surface", "EBECEE", "#EBECEE"],
            ["Disabled", "--semantic-disabled-primary", "A2A6B1", "#A2A6B1"],
          ],
          guidance:
            "Group options inside RadioGroup with a visible label or aria-label. Every option needs a distinct value. Native name groups provide arrow-key navigation, form submission and mutual exclusion.",
        }),
      },
    },
  },
  args: {
    label: "Send a weekly summary",
    description: "A digest of your activity",
    checked: false,
    disabled: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Radio
        {...args}
        onCheckedChange={(checked) => {
          args.onCheckedChange?.(checked);
          updateArgs({ checked });
        }}
      />
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Selected: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
function Sample(args: Parameters<typeof Radio>[0]) {
  const [checked, setChecked] = useState(args.checked || false);
  return (
    <Radio
      {...args}
      checked={checked}
      onCheckedChange={(next) => {
        setChecked(next);
        args.onCheckedChange?.(next);
      }}
    />
  );
}
export const AllVariants: Story = {
  parameters: gallery(
    ["checked"],
    "Selected and unselected samples. Label and disabled controls update both."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap gap-8">
      {[false, true].map((checked) => (
        <Sample
          key={String(checked) + args.label + args.disabled}
          {...args}
          checked={checked}
        />
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["checked", "disabled"],
    "Default, hover, focus and disabled states for both selection values."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-4 gap-6">
        {[false, true].flatMap((checked) =>
          ["Default", "Hover", "Focus", "Disabled"].map((state) => (
            <section key={String(checked) + state} className="space-y-3">
              <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
                {checked ? "Selected" : "Unselected"} · {state}
              </p>
              <Radio
                {...args}
                checked={checked}
                disabled={state === "Disabled"}
                className={
                  state === "Hover"
                    ? "pseudo-hover"
                    : state === "Focus"
                      ? "pseudo-focus-visible"
                      : undefined
                }
              />
            </section>
          ))
        )}
      </div>
    </div>
  ),
};
function Preferences(args: Parameters<NonNullable<Story["render"]>>[0]) {
  const [value, setValue] = useState("weekly");
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="w-[420px] max-w-full space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        Summary frequency
      </h3>
      <RadioGroup
        name="frequency"
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setSaved(false);
        }}
        disabled={args.disabled}
        aria-label="Summary frequency"
      >
        {["daily", "weekly", "monthly"].map((option) => (
          <Radio
            key={option}
            {...args}
            checked={undefined}
            value={option}
            label={option[0].toUpperCase() + option.slice(1)}
            description={args.description}
          />
        ))}
      </RadioGroup>
      <Button type="submit" disabled={args.disabled}>
        Save preference
      </Button>
      <p
        role="status"
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
      >
        {saved ? `Saved: ${value}` : `Selected: ${value}`}
      </p>
    </form>
  );
}
export const Usage: Story = {
  parameters: gallery(
    ["checked", "label"],
    "Choose one cadence and save. The disabled and description controls affect every option."
  ),
  render: (args) => <Preferences {...args} />,
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  // A lone radio cannot be unselected, so the group example (it keeps its own
  // state) is the one that can be played again from the start.
  render: Usage.render,
  parameters: {
    docs: {
      description: {
        story:
          "Plays real keyboard and mouse input against the radio group: arrow keys, label clicks and submitting. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const daily = canvas.getByRole("radio", { name: "Daily" });
    const weekly = canvas.getByRole("radio", { name: "Weekly" });
    const monthly = canvas.getByRole("radio", { name: "Monthly" });
    const status = canvas.getByRole("status");

    await step("Tab enters the group on the selected option", async () => {
      await userEvent.tab();
      await expect(weekly).toHaveFocus();
      await expect(weekly).toBeChecked();
    });

    await step("An arrow key moves focus and selection together", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await expect(monthly).toHaveFocus();
      await expect(monthly).toBeChecked();
      await expect(weekly).not.toBeChecked();
      await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
      await expect(status).toHaveTextContent("Selected: monthly");
    });

    await step("Clicking a label selects only that option", async () => {
      await userEvent.click(canvas.getByText("Daily"));
      await expect(daily).toBeChecked();
      await expect(monthly).not.toBeChecked();
      await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
      await expect(status).toHaveTextContent("Selected: daily");
    });

    await step(
      "Clicking the selected option again changes nothing",
      async () => {
        await userEvent.click(daily);
        await expect(daily).toBeChecked();
        await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
      }
    );

    await step("Saving reports the selected option", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Save preference" })
      );
      await expect(status).toHaveTextContent("Saved: daily");
    });
  },
};
