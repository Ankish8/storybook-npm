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
import { Checkbox, type CheckedState, type CheckboxProps } from "./checkbox";
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
        "labelPosition",
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
          summary:
            "A selection control for one or more choices, with checked, unchecked and indeterminate states. Built on Radix Checkbox.",
          changes: [
            [
              "Box sizes",
              "16 / 20 / 24px",
              "Unchanged: sm 16 / default 20 / lg 24px",
            ],
            ["Radius", "4px", "4px"],
            [
              "Hover",
              "No distinct hover treatment",
              "Grey unchecked surface; darker checked surface",
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
              "Inter 500 labels, with the same sizes and placement",
            ],
            [
              "Behavior",
              "Tri-state selection, separate label and form props",
              "Unchanged",
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
            ["Font", "--font-v2", "Inter 500"],
          ],
          guidance:
            'Use Checkbox for independent choices or multi-selection. Pass `checked="indeterminate"` to represent a partially selected group. A visible `label` supplies an accessible name; use `aria-label` for a standalone box. With `separateLabel`, supply an `id` to link the label to the control.',
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
    labelPosition: {
      control: "radio",
      options: ["left", "right"],
      description: "Position relative to the box.",
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
    <div className="w-[420px] max-w-full rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        Select conversations
      </p>
      <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
        Choose the conversations to include in an export.
      </p>
      <div className="mt-6 border-b border-semantic-border-layout pb-4">
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
        className="m-0 border-t border-semantic-border-layout pt-4 text-xs text-[var(--v2-text-muted,#707070)]"
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
