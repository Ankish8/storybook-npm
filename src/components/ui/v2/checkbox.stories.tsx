import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { gallery, PreviewCheckbox } from "../../../storybook/v2-preview";
import {
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  type CheckedState,
  type CheckboxProps,
} from "./checkbox";
import { Button } from "./button";
import { Checkbox as CheckboxV1 } from "../checkbox";
import { v2ComponentDocs } from "./story-docs";

const SIZES = ["sm", "default", "lg"] as const;
const CHECKED_STATES = [
  { label: "Unchecked", checked: false },
  { label: "Checked", checked: true },
  { label: "Indeterminate", checked: "indeterminate" },
] as const;
const STATE_COLUMNS = [
  { label: "Default", className: undefined, disabled: false },
  { label: "Hover", className: "pseudo-hover", disabled: false },
  { label: "Focus", className: "pseudo-focus-visible", disabled: false },
  { label: "Disabled", className: undefined, disabled: true },
  { label: "Disabled + hover", className: "pseudo-hover", disabled: true },
] as const;

const meta: Meta<typeof Checkbox> = {
  title: "V2/Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "checked",
        "size",
        "label",
        "description",
        "labelPosition",
        "variant",
        "error",
        "invalid",
        "disabled",
        "separateLabel",
        "id",
        "checkboxClassName",
        "labelClassName",
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
          name: "checkbox",
          exportName: "Checkbox, CheckboxGroup, Radio, RadioGroup",
          summary:
            "Checkboxes and radios in one family. Checkbox is for independent choices (checked, unchecked, indeterminate); Radio, inside a RadioGroup, is for one choice from a list. Both take a label, description, error and selectable-card variant, both have a group with its own label and error, and both compose from the same parts (Content, Control, Description, Error), as in HeroUI.",
          changes: [
            [
              "Feedback",
              "Tick appears",
              "The fill grows from 60% on a spring and the mark draws in (350ms); press scales to 95%",
            ],
            [
              "Pointer target",
              "20px box",
              "32 × 32 invisible target around the 20px box",
            ],
            [
              "Description",
              "—",
              "Optional 12px supporting text under the label",
            ],
            [
              "Box sizes",
              "16 / 20 / 24px",
              "sm 16 / default 18 (Arc) / lg 24px",
            ],
            ["Radius", "4px", "4px"],
            [
              "Hover",
              "No distinct hover treatment",
              "Darker unchecked border only; the checked box does not change",
            ],
            ["Focus", "2px ring with 2px offset", "2px grey shadow, no offset"],
            [
              "Disabled",
              "Reduced opacity",
              "Solid disabled tokens; label opacity is preserved",
            ],
            [
              "Labels",
              "Inherited font",
              "Timeless Sans (Inter fallback) 500 labels, 1.4 line height, 14px from the box (Arc spacing)",
            ],
            [
              "Behavior",
              "Tri-state selection, separate label and form props",
              "Unchanged",
            ],
            [
              "Errors",
              "—",
              "error / invalid on Checkbox, Radio and both groups: red control, message linked with aria-describedby",
            ],
            [
              "Cards",
              "—",
              'variant="card" on Checkbox and Radio: the whole option is a bordered, clickable card that keeps a white surface with a clear border when selected',
            ],
            [
              "Groups",
              "—",
              "CheckboxGroup (a list of values) and RadioGroup (one value), each with label, description and error",
            ],
            [
              "Radio",
              "A separate component",
              "Part of this page and file: Radio and RadioGroup, 17px circle with a springing 7px dot",
            ],
            [
              "Parts",
              "—",
              "Give Checkbox or Radio children to compose Checkbox.Content / .Control / .Indicator / .Description / .Error (Radio has no Indicator: the dot is the input)",
            ],
          ],
          tokens: [
            ["Selected surface", "--semantic-primary", "#343E55", "#343E55"],
            [
              "Selected hover",
              "--semantic-primary-hover",
              "#2F384D",
              "#2F384D",
            ],
            [
              "Focus shadow",
              "--semantic-primary-surface",
              "#EBECEE",
              "#EBECEE",
            ],
            [
              "Unchecked surface",
              "--semantic-bg-primary",
              "#FFFFFF",
              "#FFFFFF",
            ],
            ["Unchecked hover", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Border", "--semantic-border-input", "#E9EAEB", "#E9EAEB"],
            ["Hover border", "--color-primary-100", "#C0C3CA", "#C0C3CA"],
            [
              "Disabled selection",
              "--semantic-disabled-primary",
              "#A2A6B1",
              "#A2A6B1",
            ],
            [
              "Check and minus",
              "--semantic-text-inverted",
              "#FFFFFF",
              "#FFFFFF",
            ],
            ["Label", "--v2-text-primary", "#484848", "#484848"],
            ["Font", "--font-v2", "Timeless Sans (Inter fallback) 500"],
          ],
          guidance:
            'Use Checkbox for independent choices or multi-selection and Radio for exactly one choice from a visible list; group radios in a RadioGroup and related checkboxes in a CheckboxGroup (give each Checkbox a `value`). Put an error on the group when the problem is with the set. Props mode (label, description, error) covers most cases; compose the parts when you need a custom layout or indicator. Pass `checked="indeterminate"` to represent a partially selected group. A visible `label` supplies an accessible name; use `aria-label` for a standalone box. With `separateLabel`, supply an `id` to link the label to the control.',
        }),
      },
    },
  },
  args: {
    checked: false,
    disabled: false,
    separateLabel: false,
    labelPosition: "right",
    id: "",
    checkboxClassName: "",
    labelClassName: "",
    label: "Select conversation",
    size: "default",
    onCheckedChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const generatedId = React.useId();
    return (
      <Checkbox
        {...args}
        id={args.id || generatedId}
        onCheckedChange={(checked) => {
          args.onCheckedChange?.(checked);
          updateArgs({ checked });
        }}
      />
    );
  },
  argTypes: {
    checked: {
      control: "radio",
      options: [false, true, "indeterminate"],
      description:
        "Controlled selection; indeterminate represents a partially selected group.",
    },
    defaultChecked: {
      control: false,
      description: "Initial selection in uncontrolled usage.",
    },
    size: {
      control: "select",
      options: SIZES,
      description: "Small 16px, default 20px or large 24px box.",
    },
    label: { control: "text", description: "Visible, clickable label." },
    description: {
      control: "text",
      description:
        "Optional supporting text under the label (12px, muted). Linked to the box with aria-describedby.",
    },
    labelPosition: {
      control: "radio",
      options: ["left", "right"],
      description: "Position relative to the box.",
    },
    variant: {
      control: "inline-radio",
      options: ["default", "card"],
      description:
        "`card` makes the whole option a bordered, clickable card that keeps a white surface with a clear border when checked.",
    },
    error: {
      control: "text",
      description:
        "A message under the checkbox. Marks the box invalid and is linked with aria-describedby.",
    },
    invalid: {
      control: "boolean",
      description: "Mark the box invalid without a message.",
    },
    disabled: {
      control: "boolean",
      description: "Disable selection and keyboard focus.",
    },
    separateLabel: {
      control: "boolean",
      description: "Render a separate label linked to the id.",
    },
    id: {
      control: "text",
      description: "Native control id, required for separateLabel.",
    },
    checkboxClassName: {
      control: "text",
      description: "Additional box classes; applied after className.",
    },
    labelClassName: {
      control: "text",
      description: "Additional label classes.",
    },
    onCheckedChange: {
      control: false,
      description: "Called with boolean or indeterminate selection.",
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
export const Unchecked: Story = { args: { checked: false } };
export const Checked: Story = { args: { checked: true } };
export const Indeterminate: Story = {
  args: { checked: "indeterminate", label: "Select all conversations" },
};
export const Disabled: Story = { args: { checked: true, disabled: true } };
export const DisabledUnchecked: Story = {
  args: { checked: false, disabled: true },
};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const WithLabel: Story = {
  name: "With a label",
  args: { label: "Include resolved conversations" },
};
export const WithDescription: Story = {
  name: "With a description",
  args: {
    label: "Marketing emails",
    description: "Product updates and tips, at most twice a month.",
  },
};
export const LabelLeft: Story = {
  name: "Label on the left",
  args: { labelPosition: "left" },
};
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["checked", "id"],
    "Compare initial selection states. Controls update the label, size, label position and disabled state. Each sample can be toggled independently."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-start gap-8">
      {CHECKED_STATES.map((state) => (
        <div key={state.label} className="flex flex-col items-start gap-3">
          <span className="text-xs text-[var(--v2-text-muted,#707070)]">
            {state.label}
          </span>
          <PreviewCheckbox {...args} id={undefined} checked={state.checked} />
        </div>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  name: "All sizes",
  parameters: gallery(
    ["size", "id"],
    "Compare box sizes with the same live selection and label. Toggling any sample updates checked in Controls."
  ),
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const generatedId = React.useId();
    return (
      <div className="flex max-w-full flex-wrap items-end gap-8">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-col items-start gap-3">
            <span className="text-xs text-[var(--v2-text-muted,#707070)]">
              {size} · {size === "sm" ? 16 : size === "lg" ? 24 : 20}px
            </span>
            <Checkbox
              {...args}
              size={size}
              id={generatedId + size}
              onCheckedChange={(checked) => {
                args.onCheckedChange?.(checked);
                updateArgs({ checked });
              }}
            />
          </div>
        ))}
      </div>
    );
  },
};
export const States: Story = {
  args: { label: "" },
  parameters: {
    ...gallery(
      ["checked", "size", "disabled", "id"],
      "Rows and columns fix the initial selection, size and visual state. Label and styling controls apply throughout; samples can be toggled independently."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-[150px_repeat(5,minmax(120px,1fr))] items-center gap-x-6 gap-y-6">
        <div />
        {STATE_COLUMNS.map((column) => (
          <div
            key={column.label}
            className="text-xs font-medium text-[var(--v2-text-muted,#707070)]"
          >
            {column.label}
          </div>
        ))}
        {SIZES.flatMap((size) =>
          CHECKED_STATES.map((state) => (
            <React.Fragment key={size + state.label}>
              <div className="text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
                {state.label} · {size}
              </div>
              {STATE_COLUMNS.map((column) => (
                <PreviewCheckbox
                  {...args}
                  key={column.label}
                  id={undefined}
                  size={size}
                  checked={state.checked}
                  disabled={column.disabled}
                  className={column.className}
                  aria-label={
                    args.label || state.label + " " + size + " " + column.label
                  }
                  data-v2-component="checkbox"
                  data-variant={state.label.toLowerCase()}
                  data-size={size}
                  data-visual-state={column.label}
                />
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  ),
};
export const SeparateLabel: Story = {
  name: "Separate label",
  args: { label: "Include resolved conversations", separateLabel: true },
};
export const LabelPositions: Story = {
  name: "Label positions",
  parameters: gallery(
    ["labelPosition", "checked", "id"],
    "Compare left and right labels. Controls update both labels, size and disabled state; each checkbox toggles independently."
  ),
  render: (args) => (
    <div className="flex flex-col items-start gap-6">
      <PreviewCheckbox {...args} id={undefined} checked labelPosition="right" />
      <PreviewCheckbox {...args} id={undefined} checked labelPosition="left" />
    </div>
  ),
};
export const V1VsV2: Story = {
  parameters: {
    ...gallery(
      ["checked", "size", "disabled", "id"],
      "The same label and label props rendered by each version. Rows fix selection and size."
    ),
    layout: "padded",
  },
  name: "v1 vs v2",
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[720px] grid-cols-[150px_1fr_1fr] items-center gap-x-8 gap-y-5">
        <div />
        <div className="text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v1 (ui/checkbox)
        </div>
        <div className="text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v2 (ui/v2/checkbox)
        </div>
        {SIZES.flatMap((size) =>
          CHECKED_STATES.map((state) => (
            <React.Fragment key={size + state.label}>
              <span className="text-xs text-[var(--v2-text-secondary,#5E5E5E)]">
                {state.label} · {size}
              </span>
              <CheckboxV1
                {...args}
                size={size}
                checked={state.checked}
                id={"v1-checkbox-" + size + state.label}
              />
              <PreviewCheckbox
                {...args}
                id={undefined}
                size={size}
                checked={state.checked}
              />
            </React.Fragment>
          ))
        )}
        <span className="text-xs text-[var(--v2-text-secondary,#5E5E5E)]">
          Focus
        </span>
        <CheckboxV1
          {...args}
          checked
          className="pseudo-focus-visible"
          id="v1-checkbox-focus"
        />
        <PreviewCheckbox
          {...args}
          id={undefined}
          checked
          className="pseudo-focus-visible"
        />
        <span className="text-xs text-[var(--v2-text-secondary,#5E5E5E)]">
          Disabled
        </span>
        <CheckboxV1 {...args} checked disabled id="v1-checkbox-disabled" />
        <PreviewCheckbox {...args} id={undefined} checked disabled />
      </div>
    </div>
  ),
};
function ConversationSelection(args: CheckboxProps) {
  const names = ["Billing question", "Product feedback", "New enquiry"];
  const [selected, setSelected] = React.useState<string[]>([
    "Billing question",
  ]);
  const generatedId = React.useId();
  const allChecked: CheckedState =
    selected.length === names.length
      ? true
      : selected.length === 0
        ? false
        : "indeterminate";
  return (
    <div className="w-[420px] max-w-full rounded-lg border border-v2-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        Select conversations
      </p>
      <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
        Choose the conversations to include in an export.
      </p>
      <div className="mt-6 border-b border-v2-semantic-border-layout pb-4">
        <Checkbox
          {...args}
          id={generatedId + "all"}
          checked={allChecked}
          label="Select all"
          onCheckedChange={(checked) => {
            args.onCheckedChange?.(checked);
            setSelected(checked ? names : []);
          }}
        />
      </div>
      <div className="flex flex-col gap-5 py-5">
        {names.map((name, index) => (
          <Checkbox
            {...args}
            key={name}
            id={generatedId + index}
            label={name}
            checked={selected.includes(name)}
            onCheckedChange={(checked) => {
              args.onCheckedChange?.(checked);
              setSelected((previous) =>
                checked
                  ? [...previous, name]
                  : previous.filter((item) => item !== name)
              );
            }}
          />
        ))}
      </div>
      <p
        className="m-0 border-t border-v2-semantic-border-layout pt-4 text-xs text-[var(--v2-text-muted,#707070)]"
        role="status"
      >
        {selected.length} of {names.length} selected
      </p>
    </div>
  );
}
export const Usage: Story = {
  parameters: gallery(
    ["checked", "label", "id"],
    "A working tri-state selection group. Size, disabled, label position, separate-label and styling controls apply to every checkbox."
  ),
  render: (args) => <ConversationSelection {...args} />,
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: { checked: false, label: "Include resolved conversations" },
  parameters: {
    // Every args update re-runs Storybook's loaders; the default mock restore
    // would wipe the spy history in the middle of the play function.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Plays real keyboard, box and label clicks against the action spy, and ends unchecked again. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", {
      name: "Include resolved conversations",
    });

    await step(
      "Tab focuses it; Space toggles it and Enter does not",
      async () => {
        await userEvent.tab();
        await expect(checkbox).toHaveFocus();
        await userEvent.keyboard(" ");
        await waitFor(() => expect(checkbox).toBeChecked());
        await userEvent.keyboard("{Enter}");
        await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
        await userEvent.keyboard(" ");
        await waitFor(() => expect(checkbox).not.toBeChecked());
        await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
      }
    );

    await step("Clicking the box checks it", async () => {
      await userEvent.click(checkbox);
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
      await waitFor(() => expect(checkbox).toBeChecked());
    });

    await step("Clicking the label unchecks it", async () => {
      await userEvent.click(canvas.getByText("Include resolved conversations"));
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
      await waitFor(() => expect(checkbox).not.toBeChecked());
      await expect(args.onCheckedChange).toHaveBeenCalledTimes(4);
    });
  },
};

/* ------------------------------------------------------------------------------------------------
 * Radio and RadioGroup: the same family, on the same page
 * ----------------------------------------------------------------------------------------------*/
type RadioStory = StoryObj<typeof Radio>;
const RADIO_CONTROLS = [
  "label",
  "description",
  "checked",
  "disabled",
  "onCheckedChange",
];
/** Every Radio story shows Radio's controls, not Checkbox's. */
const radioStory = {
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
  parameters: { controls: { include: RADIO_CONTROLS } },
} satisfies RadioStory;
const radioGallery = (exclude: string[], description: string) => {
  const base = gallery(exclude, description);
  return {
    ...base,
    controls: { include: RADIO_CONTROLS, exclude },
  };
};
/**
 * Storybook merges this page's Checkbox args (size, separateLabel, ...) into every story, so a Radio story must pick
 * out the props Radio actually takes before it reaches the DOM.
 */
const radioProps = (args: Parameters<typeof Radio>[0]) => {
  const { label, description, checked, disabled, onCheckedChange } = args;
  return { label, description, checked, disabled, onCheckedChange };
};
function RadioLive(args: Parameters<typeof Radio>[0]) {
  const [, updateArgs] = useArgs();
  return (
    <Radio
      {...radioProps(args)}
      onCheckedChange={(checked) => {
        args.onCheckedChange?.(checked);
        updateArgs({ checked });
      }}
    />
  );
}
export const RadioOverview: RadioStory = {
  ...radioStory,
  render: (args) => <RadioLive {...args} />,
};
export const RadioSelected: RadioStory = {
  ...radioStory,
  args: { ...radioStory.args, checked: true },
  render: (args) => <RadioLive {...args} />,
};
export const RadioDisabled: RadioStory = {
  ...radioStory,
  args: { ...radioStory.args, disabled: true },
  render: (args) => <RadioLive {...args} />,
};
function Sample(args: Parameters<typeof Radio>[0]) {
  const [checked, setChecked] = React.useState(args.checked || false);
  return (
    <Radio
      {...radioProps(args)}
      checked={checked}
      onCheckedChange={(next) => {
        setChecked(next);
        args.onCheckedChange?.(next);
      }}
    />
  );
}
export const RadioAllVariants: RadioStory = {
  ...radioStory,
  parameters: radioGallery(
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
export const RadioStates: RadioStory = {
  ...radioStory,
  parameters: radioGallery(
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
                {...radioProps(args)}
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
const PLANS = [
  {
    value: "starter",
    label: "Starter",
    description: "Up to 3 agents and a shared inbox.",
  },
  {
    value: "team",
    label: "Team",
    description: "Unlimited agents, routing rules and reports.",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Single sign-on and a dedicated manager.",
    disabled: true,
  },
] as const;
function PlanCards() {
  const [value, setValue] = React.useState("team");
  return (
    <RadioGroup
      name="plan"
      value={value}
      onValueChange={setValue}
      aria-label="Plan"
      className="w-[380px] max-w-full"
    >
      {PLANS.map((plan) => (
        <Radio
          key={plan.value}
          variant="card"
          value={plan.value}
          label={plan.label}
          description={plan.description}
          disabled={"disabled" in plan ? plan.disabled : undefined}
        />
      ))}
    </RadioGroup>
  );
}
export const RadioCards: RadioStory = {
  ...radioStory,
  name: "Radio cards",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Pass `variant="card"` to make the whole option a bordered target: 12px padding, 8px radius, a hover surface, and one primary-bordered, white highlight that glides to the selected card. The default variant is a circle with a label.',
      },
    },
  },
  render: () => <PlanCards />,
};
function Preferences(args: Parameters<NonNullable<RadioStory["render"]>>[0]) {
  const [value, setValue] = React.useState("weekly");
  const [saved, setSaved] = React.useState(false);
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
            {...radioProps(args)}
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
export const RadioUsage: RadioStory = {
  ...radioStory,
  parameters: radioGallery(
    ["checked", "label"],
    "Choose one cadence and save. The disabled and description controls affect every option."
  ),
  render: (args) => <Preferences {...args} />,
};

export const RadioInteraction: RadioStory = {
  ...radioStory,
  name: "Radio interaction test",
  tags: ["!autodocs"],
  // A lone radio cannot be unselected, so the group example (it keeps its own
  // state) is the one that can be played again from the start.
  render: RadioUsage.render,
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

/* ------------------------------------------------------------------------------------------------
 * Errors, cards, groups and anatomy (Checkbox and Radio share these)
 * ----------------------------------------------------------------------------------------------*/
export const WithError: Story = {
  name: "With error",
  args: {
    label: "I agree to the terms",
    error: "You must accept the terms to continue",
    checked: false,
  },
};
export const Invalid: Story = { args: { label: "Required", invalid: true } };
export const CardVariant: Story = {
  name: "Card",
  args: {
    variant: "card",
    label: "Email notifications",
    description: "Get notified when someone mentions you in a comment",
  },
};

const CHANNELS = [
  { value: "email", label: "Email", description: "Delivered within a minute" },
  { value: "sms", label: "SMS", description: "Charges may apply" },
  { value: "push", label: "Push", description: "Mobile app only" },
] as const;
function ChannelGroup({
  variant,
  disabled,
}: {
  variant?: "default" | "card";
  disabled?: boolean;
}) {
  const [value, setValue] = React.useState<string[]>(["email"]);
  return (
    <CheckboxGroup
      label="Notify me by"
      description="Choose at least one"
      value={value}
      onValueChange={setValue}
      disabled={disabled}
      error={value.length === 0 ? "Choose at least one channel" : undefined}
      className="w-[380px] max-w-full"
    >
      {CHANNELS.map((channel) => (
        <Checkbox
          key={channel.value}
          variant={variant}
          value={channel.value}
          label={channel.label}
          description={channel.description}
        />
      ))}
    </CheckboxGroup>
  );
}
export const Group: Story = {
  name: "Checkbox group",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "A CheckboxGroup keeps one list of values: give each Checkbox a `value` and the group decides which are checked. Its label, description and error name and describe the whole set. Clear every box to see the error.",
      },
    },
  },
  render: () => <ChannelGroup />,
};
export const GroupCards: Story = {
  name: "Checkbox group, cards",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The same group with `variant="card"` on each option.',
      },
    },
  },
  render: () => <ChannelGroup variant="card" />,
};
export const Anatomy: Story = {
  name: "Anatomy (parts)",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Give Checkbox children and compose the parts yourself: Content is the clickable label, Control the box, Indicator the mark (pass children to draw your own), Description and Error the text under it. Their ids are linked to the box for you.",
      },
    },
  },
  render: function Render() {
    const [accepted, setAccepted] = React.useState(false);
    return (
      <div className="flex flex-col gap-6">
        <Checkbox
          checked={accepted}
          onCheckedChange={(next) => setAccepted(next === true)}
          invalid={!accepted}
        >
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            Accept terms and conditions
          </Checkbox.Content>
          <Checkbox.Description>
            You can change this later.
          </Checkbox.Description>
          {!accepted && (
            <Checkbox.Error>You must accept to continue</Checkbox.Error>
          )}
        </Checkbox>
        <Checkbox defaultChecked>
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-full w-full p-0.5"
                  fill="currentColor"
                >
                  <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
                </svg>
              </Checkbox.Indicator>
            </Checkbox.Control>
            Custom indicator
          </Checkbox.Content>
        </Checkbox>
      </div>
    );
  },
};
export const FormIntegration: Story = {
  name: "Form integration",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Both submit by name and value like native inputs: checked boxes under their name, the selected radio under the group name.",
      },
    },
  },
  render: function Render() {
    const [submitted, setSubmitted] = React.useState("");
    return (
      <form
        className="flex w-[380px] max-w-full flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSubmitted(
            [...data.entries()]
              .map(([key, entry]) => key + "=" + entry)
              .join(", ")
          );
        }}
      >
        <CheckboxGroup
          label="Notify me by"
          name="channels"
          defaultValue={["email"]}
        >
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
        <RadioGroup label="Frequency" name="frequency" defaultValue="weekly">
          <Radio value="daily" label="Daily" />
          <Radio value="weekly" label="Weekly" />
        </RadioGroup>
        <Button type="submit">Save</Button>
        <p
          role="status"
          className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
        >
          {submitted || "Nothing submitted yet"}
        </p>
      </form>
    );
  },
};

export const RadioGroupFrame: RadioStory = {
  ...radioStory,
  name: "Radio group with label, description and error",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "A RadioGroup can carry its own label, description and error. The group is named and described to assistive technology, and an error marks every option invalid. Leave the choice empty to see it.",
      },
    },
  },
  render: function Render() {
    const [value, setValue] = React.useState("");
    return (
      <RadioGroup
        name="size"
        label="T-shirt size"
        description="Pick the one that fits best"
        value={value}
        onValueChange={setValue}
        error={value ? undefined : "Choose a size to continue"}
        className="w-[320px] max-w-full"
      >
        {["Small", "Medium", "Large"].map((size) => (
          <Radio key={size} value={size.toLowerCase()} label={size} />
        ))}
      </RadioGroup>
    );
  },
};
export const RadioAnatomy: RadioStory = {
  ...radioStory,
  name: "Radio anatomy (parts)",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Give Radio children to compose Content (the clickable label), Control (the native input, which draws its own dot) and Description. There is no Indicator part, because the dot is a layer of the input.",
      },
    },
  },
  render: function Render() {
    return (
      <RadioGroup name="billing" label="Billing" defaultValue="yearly">
        <Radio value="monthly">
          <Radio.Content>
            <Radio.Control />
            Monthly
          </Radio.Content>
          <Radio.Description>Cancel any time</Radio.Description>
        </Radio>
        <Radio value="yearly">
          <Radio.Content>
            <Radio.Control />
            Yearly
          </Radio.Content>
          <Radio.Description>Two months free</Radio.Description>
        </Radio>
      </RadioGroup>
    );
  },
};
