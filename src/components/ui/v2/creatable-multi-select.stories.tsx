import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { gallery } from "../../../storybook/v2-preview";
import {
  CreatableMultiSelect,
  type CreatableMultiSelectProps,
  type CreatableMultiSelectOption,
} from "./creatable-multi-select";
import { CreatableMultiSelect as CreatableMultiSelectV1 } from "../creatable-multi-select";
import { Button } from "./button";
import { v2ComponentDocs } from "./story-docs";

type Args = CreatableMultiSelectProps & {
  label: string;
  errorMessage: string;
  width: number;
  lettersOnly: boolean;
  collapseSpaces: boolean;
  showSelection: boolean;
};
const OPTIONS: CreatableMultiSelectOption[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "empathetic", label: "Empathetic" },
  { value: "direct", label: "Direct" },
  { value: "enthusiastic", label: "Enthusiastic" },
];
const VARIANTS = ["default", "error"] as const;
const COLUMNS = [
  { label: "Default", disabled: false, className: "" },
  { label: "Hover", disabled: false, className: "pseudo-hover-all" },
  { label: "Focus", disabled: false, className: "pseudo-focus-within-all" },
  { label: "Disabled", disabled: true, className: "" },
  { label: "Disabled + hover", disabled: true, className: "pseudo-hover-all" },
] as const;
function valuesFor(value: Args["value"]) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string")
    : [];
}
function optionsFor(options: Args["options"]) {
  return Array.isArray(options)
    ? options.filter(
        (option) =>
          option &&
          typeof option.value === "string" &&
          typeof option.label === "string"
      )
    : [];
}
function Example({
  label,
  errorMessage,
  width,
  lettersOnly,
  collapseSpaces,
  showSelection,
  version = "v2",
  ...props
}: Args & { version?: "v1" | "v2" }) {
  const id = React.useId();
  const Component =
    version === "v1" ? CreatableMultiSelectV1 : CreatableMultiSelect;
  const error = props.state === "error" && !props.disabled;
  return (
    <div
      style={{ width }}
      className="max-w-full space-y-1.5 font-[family-name:var(--font-v2,Inter,sans-serif)]"
    >
      {label && (
        <p
          id={`${id}-label`}
          className="m-0 text-sm font-semibold text-semantic-text-secondary"
        >
          {label}
        </p>
      )}
      <Component
        {...props}
        value={valuesFor(props.value)}
        options={optionsFor(props.options)}
        helperText={error ? "" : props.helperText}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-label={!label ? "Example tones" : undefined}
        aria-describedby={error && errorMessage ? `${id}-error` : undefined}
        sanitizeInput={
          lettersOnly
            ? (raw) => raw.replace(/[^A-Za-z ]/g, "")
            : props.sanitizeInput
        }
        normalizeInput={
          collapseSpaces
            ? (raw) => raw.replace(/ +/g, " ").replace(/^\s+/, "")
            : props.normalizeInput
        }
      />
      {error && errorMessage && (
        <p id={`${id}-error`} className="m-0 text-xs text-semantic-error-text">
          {errorMessage}
        </p>
      )}
      {showSelection && (
        <p role="status" className="m-0 text-xs text-semantic-text-muted">
          Selected: {valuesFor(props.value).join(", ") || "None"}
        </p>
      )}
    </div>
  );
}
function Playground(args: Args) {
  const [, updateArgs] = useArgs<Args>();
  return (
    <Example
      {...args}
      onValueChange={(value) => {
        updateArgs({ value });
        args.onValueChange?.(value);
      }}
    />
  );
}
function Preview({
  value = [],
  onValueChange,
  ...args
}: Args & { version?: "v1" | "v2" }) {
  const [selection, setSelection] = React.useState(valuesFor(value));
  return (
    <Example
      {...args}
      value={selection}
      onValueChange={(next) => {
        setSelection(next);
        onValueChange?.(next);
      }}
    />
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/CreatableMultiSelect",
  component: CreatableMultiSelect,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2118-22190",
    },
    layout: "centered",
    controls: {
      include: [
        "value",
        "options",
        "placeholder",
        "state",
        "disabled",
        "helperText",
        "createHintText",
        "maxItems",
        "maxLengthPerItem",
        "showPerItemCharacterCounter",
        "triggerDisplay",
        "label",
        "errorMessage",
        "width",
        "lettersOnly",
        "collapseSpaces",
        "showSelection",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "creatable-multi-select",
          summary:
            "Select several presets or create custom tones with Enter. The controlled string array synchronizes with Controls; the open draft is internal and reported through onInputValueChange.",
          changes: [
            [
              "Trigger",
              "42px minimum / 4px corners",
              "40px minimum / 8px corners; wraps selected chips",
            ],
            [
              "Type",
              "Inherited type",
              "Inter 16px values; host label 14px / 600; helper 12px",
            ],
            [
              "Selected chips",
              "4px corners / regular text",
              "8px corners, subtle border, 14px semibold",
            ],
            ["Hover", "Thin stroke", "C0C3CA border"],
            ["Focus", "Outer focus ring", "27ABB8 border and soft 4px halo"],
            ["Error", "Red border", "F04438 border and soft halo"],
            [
              "Disabled",
              "Native modifiers did not cover div trigger",
              "Solid grey surface; no halo; draft/options also disable",
            ],
            [
              "Keyboard presets",
              "Mouse selection only",
              "Native keyboard and mouse activation preserve input focus",
            ],
            [
              "Creation behavior",
              "Limits, legacy preset aliases, internal draft, Backspace removal",
              "Preserved",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Disabled surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Value", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Label", "--semantic-text-secondary", "#343E55", "#343E55"],
            ["Helper", "--semantic-text-muted", "#717680", "#717680"],
            ["Border", "--semantic-border-input", "#E9EAEB", "#E9EAEB"],
            ["Hover", "--color-primary-100", "#C0C3CA", "#C0C3CA"],
            ["Focus", "--color-secondary-600", "#27ABB8", "#27ABB8"],
            ["Error", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Error message", "--semantic-error-text", "#B42318", "#B42318"],
            ["Family", "--font-v2", "Inter"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            "Open with a click, Enter or Space. Select a preset or type a custom value and press Enter. Remove a chip with its button, or Backspace on an empty draft. maxItems applies to selections; maxLengthPerItem applies to custom drafts and preserves preset IDs. Label, error message, width and transformation switches are host example settings.",
        }),
      },
    },
  },
  argTypes: {
    value: {
      control: "object",
      description:
        "Selected string array; synchronized after selecting, creating or removing.",
    },
    options: { control: "object" },
    placeholder: { control: "text" },
    state: { control: "select", options: VARIANTS },
    disabled: { control: "boolean" },
    helperText: { control: "text" },
    createHintText: { control: "text" },
    maxItems: { control: { type: "number", min: 1, max: 20 } },
    maxLengthPerItem: { control: { type: "number", min: 1, max: 100 } },
    showPerItemCharacterCounter: { control: "boolean" },
    triggerDisplay: { control: "radio", options: ["chips", "summary"] },
    label: { control: "text", table: { category: "Example" } },
    errorMessage: { control: "text", table: { category: "Example" } },
    width: {
      control: { type: "number", min: 240, max: 700 },
      table: { category: "Example" },
    },
    lettersOnly: { control: "boolean", table: { category: "Example" } },
    collapseSpaces: { control: "boolean", table: { category: "Example" } },
    showSelection: { control: "boolean", table: { category: "Example" } },
    onValueChange: { control: false },
    onInputValueChange: { control: false },
    sanitizeInput: { control: false },
    normalizeInput: { control: false },
    onInvalidCharacters: { control: false },
    onValidInput: { control: false },
  },
  args: {
    value: [],
    options: OPTIONS,
    placeholder: "Select or create tones",
    state: "default",
    disabled: false,
    helperText: "Choose the tones this agent should use.",
    createHintText: "Type to create a custom tone",
    maxItems: 5,
    maxLengthPerItem: 20,
    showPerItemCharacterCounter: true,
    triggerDisplay: "chips",
    label: "Conversation tones",
    errorMessage: "Choose at least one tone.",
    width: 420,
    lettersOnly: false,
    collapseSpaces: false,
    showSelection: false,
    onValueChange: fn(),
    onInputValueChange: fn(),
    onInvalidCharacters: fn(),
    onValidInput: fn(),
  },
  render: Playground,
};
export default meta;
type Story = StoryObj<Args>;
export const Overview: Story = {};
export const Default: Story = {};
export const WithPreselectedValues: Story = {
  args: { value: ["professional", "friendly"] },
};
export const ErrorState: Story = { args: { state: "error" } };
export const Disabled: Story = {
  args: { disabled: true, value: ["professional", "friendly"] },
};
export const EmptyOptions: Story = {
  args: {
    options: [],
    helperText: "Type a tone and press Enter to create it.",
  },
};
export const SelectionLimit: Story = {
  args: {
    maxItems: 2,
    helperText: "Choose up to two tones. Reaching the limit closes the popup.",
  },
};
export const CharacterLimit: Story = {
  args: {
    maxLengthPerItem: 8,
    helperText:
      "Custom tones are limited to eight characters; preset IDs are preserved.",
  },
};
export const CharacterGuard: Story = {
  args: {
    lettersOnly: true,
    collapseSpaces: true,
    helperText:
      "Only letters and spaces; consecutive spaces collapse while typing.",
  },
};
export const Summary: Story = {
  args: {
    triggerDisplay: "summary",
    value: ["professional", "friendly"],
    showPerItemCharacterCounter: false,
  },
};
export const DisabledPresets: Story = {
  args: {
    options: [
      ...OPTIONS,
      { value: "unavailable", label: "Unavailable", disabled: true },
    ],
    helperText: "Unavailable preset options are not offered.",
  },
};
export const AllVariants: Story = {
  parameters: gallery(
    ["state"],
    "Both visual variants. Shared Controls update each sample; selections remain independent."
  ),
  render: (args) => (
    <div className="w-full max-w-[920px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-semibold">Validation variants</p>
        <p className="m-0 text-sm text-semantic-text-muted">
          The error message is linked to the field.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {VARIANTS.map((state) => (
          <section key={state} className="space-y-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-semantic-text-muted">
              {state}
            </p>
            <Preview
              {...args}
              key={`${state}-${JSON.stringify(args.value)}`}
              state={state}
            />
          </section>
        ))}
      </div>
    </div>
  ),
};
export const HeightAndWidth: Story = {
  name: "Height and width",
  parameters: gallery(
    ["width"],
    "40px minimum height at two widths. Chips wrap within the field; summary mode keeps a text treatment."
  ),
  render: (args) => (
    <div className="w-full max-w-[820px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-semibold">Field proportions</p>
        <p className="m-0 text-sm text-semantic-text-muted">
          Empty and one-line fields are 40px high. Wrapping chips can increase
          height.
        </p>
      </header>
      <div className="flex flex-wrap items-start gap-6">
        {[420, 280].map((width) => (
          <section key={width} className="space-y-3">
            <p className="m-0 text-xs text-semantic-text-muted">
              {width}px wide · 40px minimum
            </p>
            <Preview
              {...args}
              key={`${width}-${JSON.stringify(args.value)}`}
              width={width}
            />
          </section>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      ["state", "disabled", "width"],
      "Complete recorded variants × state matrix, including the disabled override. Fields remain functional; CSS pseudo states show hover and focus side by side."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="w-full space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-semibold">Interaction states</p>
        <p className="m-0 text-sm text-semantic-text-muted">
          The comparison grid scrolls inside its canvas.
        </p>
      </header>
      <div className="w-full overflow-x-auto pb-56">
        <div
          style={{ width: 1370 }}
          className="grid grid-cols-[100px_repeat(5,238px)] gap-4"
        >
          <span />
          {COLUMNS.map((column) => (
            <p
              key={column.label}
              className="m-0 text-xs font-semibold text-semantic-text-muted"
            >
              {column.label}
            </p>
          ))}
          {VARIANTS.map((state) => (
            <React.Fragment key={state}>
              <p className="m-0 pt-6 text-sm font-semibold">{state}</p>
              {COLUMNS.map((column) => (
                <Preview
                  {...args}
                  key={`${state}-${column.label}-${JSON.stringify(args.value)}`}
                  width={238}
                  state={state}
                  disabled={column.disabled}
                  label={`${state} ${column.label}`}
                  className={column.className}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: {
    ...gallery(
      ["state", "disabled", "value", "width"],
      "Every default, error and disabled treatment, empty and selected, in v1 and v2. TriggerDisplay Control switches all fields between chips and summary."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="w-full space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-semibold">v1 and v2</p>
        <p className="m-0 text-sm text-semantic-text-muted">
          Preset IDs, draft limits and selection behaviors are preserved.
        </p>
      </header>
      <div className="w-full overflow-x-auto pb-56">
        <div
          style={{ width: 870 }}
          className="grid grid-cols-[160px_320px_320px] gap-6"
        >
          <span />
          <p className="m-0 text-sm font-semibold">v1</p>
          <p className="m-0 text-sm font-semibold">v2</p>
          {["default", "error", "disabled"].flatMap((treatment) =>
            [[], ["professional"]].map((value) => (
              <React.Fragment key={`${treatment}-${value.length}`}>
                <p className="m-0 pt-6 text-xs text-semantic-text-muted">
                  {treatment} · {value.length ? "selected" : "empty"}
                </p>
                {(["v1", "v2"] as const).map((version) => (
                  <Preview
                    {...args}
                    key={`${version}-${treatment}-${value.length}`}
                    version={version}
                    width={320}
                    value={value}
                    state={treatment === "error" ? "error" : "default"}
                    disabled={treatment === "disabled"}
                  />
                ))}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  ),
};
export const Usage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A local agent tone form. Add a preset or create a custom tone, save, and clear to see required validation. No network request is made.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<Args>();
    return (
      <UsageForm
        {...args}
        onValueChange={(value) => {
          updateArgs({ value });
          args.onValueChange?.(value);
        }}
      />
    );
  },
};
function UsageForm(args: Args) {
  const [submitted, setSubmitted] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const selected = valuesFor(args.value);
  return (
    <form
      className="w-full max-w-[560px] space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        setFeedback(
          selected.length
            ? `Saved tones: ${selected.map((value) => optionsFor(args.options).find((option) => option.value === value)?.label || value).join(", ")}`
            : ""
        );
      }}
    >
      <header className="space-y-1">
        <p className="m-0 text-base font-semibold">Agent voice</p>
        <p className="m-0 text-sm text-semantic-text-muted">
          Set the tones for this agent’s conversations.
        </p>
      </header>
      <Example
        {...args}
        state={submitted && !selected.length ? "error" : args.state}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          setSubmitted(false);
          setFeedback("");
        }}
      />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={args.disabled}>
          Save tones
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={args.disabled}
          onClick={() => {
            args.onValueChange?.([]);
            setSubmitted(false);
            setFeedback("");
          }}
        >
          Clear selection
        </Button>
      </div>
      {feedback && (
        <p role="status" className="m-0 text-sm text-semantic-success-text">
          {feedback}
        </p>
      )}
    </form>
  );
}
