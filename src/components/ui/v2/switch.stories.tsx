import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { gallery, PreviewSwitch } from "../../../storybook/v2-preview";
import { Switch, type SwitchProps } from "./switch";
import { Switch as SwitchV1 } from "../switch";
import { v2ComponentDocs } from "./story-docs";

const SIZES = ["sm", "default", "lg"] as const;
const DIMENSIONS = { sm: "32 × 18", default: "36 × 20", lg: "44 × 24" };
const STATE_COLUMNS = [
  { label: "Default", className: undefined, disabled: false },
  { label: "Hover", className: "pseudo-hover", disabled: false },
  { label: "Focus", className: "pseudo-focus-visible", disabled: false },
  { label: "Disabled", className: undefined, disabled: true },
  { label: "Disabled + hover", className: "pseudo-hover", disabled: true },
] as const;
const meta: Meta<typeof Switch> = {
  title: "V2/Components/Switch",
  component: Switch,
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
          name: "switch",
          summary:
            "A compact toggle for a setting that has on and off states. Built on Radix Switch, with the same controlled and uncontrolled behavior as v1.",
          changes: [
            [
              "Track sizes (w × h)",
              "sm 36 × 20 / default 44 × 24 / lg 56 × 28",
              "sm 32 × 18 / default 36 × 20 / lg 44 × 24px",
            ],
            ["Thumb diameters", "16 / 20 / 24px", "14 / 16 / 20px"],
            ["Track radius", "Full pill", "12px"],
            ["Off surface", "#E9EAEB", "#EBECEE; hover #E9EAEB"],
            ["On surface", "#343E55", "#343E55; hover #2F384D"],
            [
              "Focus",
              "2px ring with 2px offset",
              "1px outline with 3px offset",
            ],
            ["Disabled", "Reduced opacity", "Solid track and thumb colors"],
            [
              "Thumb shadow",
              "Large shadow",
              "Soft 0 2px 8px shadow at 6% black",
            ],
            [
              "Labels and behavior",
              "Boolean selection and left/right labels",
              "Same API; Inter labels",
            ],
          ],
          tokens: [
            ["On track", "--semantic-primary", "#343E55", "#343E55"],
            ["On hover", "--semantic-primary-hover", "#2F384D", "#2F384D"],
            ["Off track", "--semantic-primary-surface", "#EBECEE", "#EBECEE"],
            ["Off hover", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            [
              "Disabled on track",
              "--semantic-disabled-primary",
              "#A2A6B1",
              "#A2A6B1",
            ],
            ["Thumb", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            [
              "Disabled on thumb",
              "--semantic-primary-surface",
              "#EBECEE",
              "#EBECEE",
            ],
            ["Disabled off thumb", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Focus outline", "--semantic-primary", "#343E55", "#343E55"],
            ["Label", "--semantic-text-secondary", "#343E55", "#343E55"],
            ["Font", "--font-v2", "Inter 600"],
          ],
          guidance:
            "Use Switch for a boolean setting that takes effect when toggled. Use Checkbox for selection within a list or form. Supply a visible `label` or an `aria-label`. Pair `checked` with `onCheckedChange` for controlled usage, or use `defaultChecked` for an uncontrolled initial value.",
        }),
      },
    },
  },
  args: {
    checked: false,
    disabled: false,
    labelPosition: "right",
    size: "default",
    label: "Enable notifications",
    onCheckedChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Switch
        {...args}
        onCheckedChange={(checked) => {
          args.onCheckedChange?.(checked);
          updateArgs({ checked });
        }}
      />
    );
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controlled on/off state; pair with onCheckedChange.",
    },
    defaultChecked: {
      control: false,
      description: "Initial value for an uncontrolled switch.",
    },
    size: {
      control: "select",
      options: SIZES,
      description: "Small 32 × 18, default 36 × 20 or large 44 × 24px track.",
    },
    label: { control: "text", description: "Visible, clickable label." },
    labelPosition: {
      control: "radio",
      options: ["left", "right"],
      description: "Position relative to the switch.",
    },
    disabled: {
      control: "boolean",
      description: "Disable toggling and keyboard focus.",
    },
    onCheckedChange: {
      control: false,
      description: "Called with the next boolean value.",
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Off: Story = { args: { checked: false } };
export const On: Story = { args: { checked: true } };
export const Disabled: Story = { args: { checked: true, disabled: true } };
export const DisabledOff: Story = {
  name: "Disabled off",
  args: { checked: false, disabled: true },
};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const WithLabel: Story = {
  name: "With a label",
  args: { label: "Enable notifications" },
};
export const LabelLeft: Story = {
  name: "Label on the left",
  args: { labelPosition: "left" },
};
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["checked"],
    "Compare initial on and off states. Size, label, position and disabled controls update both samples, and each switch can be toggled independently."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-start gap-10">
      {[false, true].map((checked) => (
        <div key={String(checked)} className="flex flex-col items-start gap-3">
          <span className="text-xs text-semantic-text-muted">
            {checked ? "On" : "Off"}
          </span>
          <PreviewSwitch {...args} checked={checked} />
        </div>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  name: "All sizes",
  parameters: gallery(
    ["size"],
    "Compare track sizes with the same live selection and label. Toggling a sample updates checked in Controls."
  ),
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <div className="flex max-w-full flex-wrap items-end gap-8">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-col items-start gap-3">
            <span className="text-xs text-semantic-text-muted">
              {size} · {DIMENSIONS[size]}px
            </span>
            <Switch
              {...args}
              size={size}
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
      ["checked", "size", "disabled"],
      "Rows and columns fix initial selection, size and visual state. Edit the label and its position across the matrix; each sample can be toggled independently."
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
            className="text-xs font-semibold text-semantic-text-muted"
          >
            {column.label}
          </div>
        ))}
        {SIZES.flatMap((size) =>
          [false, true].map((checked) => (
            <React.Fragment key={size + checked}>
              <div className="text-xs font-semibold text-semantic-text-secondary">
                {checked ? "On" : "Off"} · {size}
              </div>
              {STATE_COLUMNS.map((column) => (
                <PreviewSwitch
                  {...args}
                  key={column.label}
                  size={size}
                  checked={checked}
                  disabled={column.disabled}
                  className={column.className}
                  aria-label={
                    args.label ||
                    (checked ? "On" : "Off") + " " + size + " " + column.label
                  }
                  data-v2-component="switch"
                  data-variant={checked ? "on" : "off"}
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
export const LabelPositions: Story = {
  name: "Label positions",
  parameters: gallery(
    ["labelPosition", "checked"],
    "Compare left and right labels. Controls edit the same label, size and disabled state; each sample toggles independently."
  ),
  render: (args) => (
    <div className="flex flex-col items-start gap-6">
      <PreviewSwitch {...args} checked labelPosition="right" />
      <PreviewSwitch {...args} checked labelPosition="left" />
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: {
    ...gallery(
      ["checked", "size", "disabled"],
      "The same label and position rendered by both versions. Rows fix track size and selection."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[720px] grid-cols-[150px_1fr_1fr] items-center gap-x-8 gap-y-5">
        <div />
        <div className="text-xs font-semibold text-semantic-text-muted">
          v1 (ui/switch)
        </div>
        <div className="text-xs font-semibold text-semantic-text-muted">
          v2 (ui/v2/switch)
        </div>
        {SIZES.flatMap((size) =>
          [false, true].map((checked) => (
            <React.Fragment key={size + checked}>
              <span className="text-xs text-semantic-text-secondary">
                {checked ? "On" : "Off"} · {size}
              </span>
              <SwitchV1 {...args} size={size} checked={checked} />
              <PreviewSwitch {...args} size={size} checked={checked} />
            </React.Fragment>
          ))
        )}
        <span className="text-xs text-semantic-text-secondary">Focus</span>
        <SwitchV1 {...args} checked className="pseudo-focus-visible" />
        <PreviewSwitch {...args} checked className="pseudo-focus-visible" />
        <span className="text-xs text-semantic-text-secondary">Disabled</span>
        <SwitchV1 {...args} checked disabled />
        <PreviewSwitch {...args} checked disabled />
      </div>
    </div>
  ),
};
function NotificationPreferences({ label: _label, ...args }: SwitchProps) {
  const [desktop, setDesktop] = React.useState(true);
  const [sound, setSound] = React.useState(false);
  const generatedId = React.useId();
  return (
    <div className="w-[420px] max-w-full rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <p className="m-0 text-base font-semibold text-semantic-text-primary">
        Notification preferences
      </p>
      <p className="m-0 mt-1 text-xs text-semantic-text-muted">
        Choose how you hear about new conversations.
      </p>
      <div className="mt-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <label
              htmlFor={generatedId + "desktop"}
              className="cursor-pointer text-sm font-semibold text-semantic-text-secondary"
            >
              Desktop notifications
            </label>
            <p
              id={generatedId + "desktop-help"}
              className="m-0 mt-1 text-xs text-semantic-text-muted"
            >
              Show an alert when a new message arrives.
            </p>
          </div>
          <Switch
            {...args}
            id={generatedId + "desktop"}
            checked={desktop}
            onCheckedChange={(checked) => {
              args.onCheckedChange?.(checked);
              setDesktop(checked);
            }}
            aria-describedby={generatedId + "desktop-help"}
          />
        </div>
        <div className="flex items-start justify-between gap-6 border-t border-semantic-border-layout pt-5">
          <div>
            <label
              htmlFor={generatedId + "sound"}
              className="cursor-pointer text-sm font-semibold text-semantic-text-secondary"
            >
              Notification sound
            </label>
            <p
              id={generatedId + "sound-help"}
              className="m-0 mt-1 text-xs text-semantic-text-muted"
            >
              Play a sound for new conversations.
            </p>
          </div>
          <Switch
            {...args}
            id={generatedId + "sound"}
            checked={sound}
            onCheckedChange={(checked) => {
              args.onCheckedChange?.(checked);
              setSound(checked);
            }}
            aria-describedby={generatedId + "sound-help"}
          />
        </div>
      </div>
      <p
        className="m-0 mt-6 border-t border-semantic-border-layout pt-4 text-xs text-semantic-text-muted"
        role="status"
      >
        Desktop {desktop ? "on" : "off"} · Sound {sound ? "on" : "off"}
      </p>
    </div>
  );
}
export const Usage: Story = {
  parameters: gallery(
    ["checked", "label", "labelPosition"],
    "A working preferences example. Controls update track size and disable both switches; the preferences remain independent."
  ),
  render: (args) => <NotificationPreferences {...args} />,
};
