import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { gallery } from "../../../storybook/v2-preview";
import {
  CreatableSelect,
  type CreatableSelectProps,
  type CreatableSelectOption,
} from "./creatable-select";
import { CreatableSelect as CreatableSelectV1 } from "../creatable-select";
import { Button } from "./button";
import { v2ComponentDocs } from "./story-docs";

type Args = CreatableSelectProps & {
  label: string;
  helperText: string;
  errorMessage: string;
  width: number;
  lettersOnly: boolean;
  collapseSpaces: boolean;
  showSelection: boolean;
};
const OPTIONS: CreatableSelectOption[] = [
  { value: "customer-support", label: "Customer Support Agent" },
  { value: "sales", label: "Sales Representative" },
  { value: "technical-support", label: "Technical Support" },
  { value: "billing", label: "Billing Enquiry Agent" },
  { value: "receptionist", label: "Receptionist" },
];
const VARIANTS = ["default", "error"] as const;
const COLUMNS = [
  { label: "Default", disabled: false, className: "" },
  { label: "Hover", disabled: false, className: "pseudo-hover-all" },
  { label: "Focus", disabled: false, className: "pseudo-focus-within-all" },
  { label: "Disabled", disabled: true, className: "" },
  { label: "Disabled + hover", disabled: true, className: "pseudo-hover-all" },
] as const;
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
  helperText,
  errorMessage,
  width,
  lettersOnly,
  collapseSpaces,
  showSelection,
  version = "v2",
  ...props
}: Args & { version?: "v1" | "v2" }) {
  const id = React.useId();
  const Component = version === "v1" ? CreatableSelectV1 : CreatableSelect;
  const hint =
    props.state === "error" && !props.disabled ? errorMessage : helperText;
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
        options={optionsFor(props.options)}
        value={typeof props.value === "string" ? props.value : ""}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-label={!label ? "Example role" : undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
        sanitizeInput={
          lettersOnly
            ? (raw) => raw.replace(/[^A-Za-z ]/g, "")
            : props.sanitizeInput
        }
        normalizeComboboxInput={
          collapseSpaces
            ? (raw) => raw.replace(/ +/g, " ").replace(/^\s+/, "")
            : props.normalizeComboboxInput
        }
      />
      {hint && (
        <p
          id={`${id}-hint`}
          className={`m-0 text-xs ${props.state === "error" && !props.disabled ? "text-semantic-error-text" : "text-semantic-text-muted"}`}
        >
          {hint}
        </p>
      )}
      {showSelection && (
        <p role="status" className="m-0 text-xs text-semantic-text-muted">
          Selected: {props.value || "None"}
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
  value = "",
  onValueChange,
  ...args
}: Args & { version?: "v1" | "v2" }) {
  const [selection, setSelection] = React.useState(value);
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
  title: "V2/Components/CreatableSelect",
  component: CreatableSelect,
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
        "state",
        "disabled",
        "options",
        "placeholder",
        "creatableHint",
        "maxLength",
        "label",
        "helperText",
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
          name: "creatable-select",
          summary:
            "Choose a saved role or type a custom one and press Enter. The selected value is controlled; the open draft is internal and reported through onInputValueChange.",
          changes: [
            ["Trigger", "42px height / 4px radius", "40px height / 8px radius"],
            ["Value type", "Inherited font", "Inter 16px / 400"],
            [
              "Host label / helper",
              "Host styling",
              "14px / 600 label; 12px helper",
            ],
            ["Hover", "Thin stroke", "C0C3CA border"],
            ["Focus", "Teal stroke", "27ABB8 border and soft 4px halo"],
            [
              "Error",
              "Red border",
              "F04438 border and halo; B42318 host message",
            ],
            ["Disabled", "Muted styling", "Solid F5F5F5; grey border; no halo"],
            [
              "Creation contract",
              "Selected value; internal draft; sanitize and normalize callbacks",
              "Preserved, with named inner controls and disabled draft/options",
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
            "Click the field, type to filter or create, then use Enter to select. Selection changes synchronize value in Controls. Draft typing is an internal component state, not a public value prop. Label, helper, width and transformation switches are host example settings; no new component API is implied.",
        }),
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description:
        "Selected preset value or custom text; synchronized after selection or creation.",
    },
    state: { control: "select", options: VARIANTS },
    disabled: { control: "boolean" },
    options: { control: "object" },
    placeholder: { control: "text" },
    creatableHint: { control: "text" },
    maxLength: { control: { type: "number", min: 1, max: 100 } },
    label: { control: "text", table: { category: "Example" } },
    helperText: { control: "text", table: { category: "Example" } },
    errorMessage: { control: "text", table: { category: "Example" } },
    width: {
      control: { type: "number", min: 240, max: 700 },
      table: { category: "Example" },
    },
    lettersOnly: {
      control: "boolean",
      description: "Example sanitizer rejects digits and punctuation.",
      table: { category: "Example" },
    },
    collapseSpaces: {
      control: "boolean",
      description:
        "Example normalizer collapses consecutive spaces and trims leading space.",
      table: { category: "Example" },
    },
    showSelection: { control: "boolean", table: { category: "Example" } },
    onValueChange: { control: false },
    onInputValueChange: { control: false },
    sanitizeInput: { control: false },
    normalizeComboboxInput: { control: false },
    onInvalidCharacters: { control: false },
    onValidInput: { control: false },
  },
  args: {
    value: "",
    state: "default",
    disabled: false,
    options: OPTIONS,
    placeholder: "Select or create a role",
    creatableHint: "Type to create a custom role",
    maxLength: 40,
    label: "Primary role",
    helperText: "Choose a preset or type your own role.",
    errorMessage: "Choose or create a role.",
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
export const WithPreselectedValue: Story = { args: { value: "sales" } };
export const ErrorState: Story = { args: { state: "error" } };
export const Disabled: Story = {
  args: { disabled: true, value: "customer-support" },
};
export const WithDisabledOptions: Story = {
  args: {
    options: [
      ...OPTIONS,
      { value: "manager", label: "Manager (unavailable)", disabled: true },
    ],
  },
};
export const EmptyOptions: Story = {
  args: {
    options: [],
    placeholder: "Create your first role",
    helperText: "Type a role and press Enter to create it.",
  },
};
export const CharacterLimit: Story = {
  args: {
    maxLength: 12,
    helperText:
      "Open the field and type up to 12 characters. Preset selection retains its value.",
  },
};
export const CharacterGuard: Story = {
  args: {
    lettersOnly: true,
    collapseSpaces: true,
    helperText:
      "Letters and spaces only. Consecutive spaces collapse while typing.",
  },
};
export const AllVariants: Story = {
  parameters: gallery(
    ["state"],
    "Both visual variants. Other Controls update both samples; selections are independent."
  ),
  render: (args) => (
    <div className="w-full max-w-[920px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-semibold text-semantic-text-primary">
          Validation variants
        </p>
        <p className="m-0 text-sm text-semantic-text-muted">
          Labels and hints stay aligned with the field.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {VARIANTS.map((state) => (
          <section key={state} className="space-y-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-semantic-text-muted">
              {state}
            </p>
            <Preview {...args} key={`${state}-${args.value}`} state={state} />
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
    "One 40px field height at two widths. Each field remains independently editable."
  ),
  render: (args) => (
    <div className="w-full max-w-[820px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-semibold">Field proportions</p>
        <p className="m-0 text-sm text-semantic-text-muted">
          40px high at both widths, with 8px corners.
        </p>
      </header>
      <div className="flex flex-wrap items-start gap-6">
        {[420, 280].map((width) => (
          <section key={width} className="space-y-3">
            <p className="m-0 text-xs text-semantic-text-muted">
              {width}px wide · 40px high
            </p>
            <Preview {...args} key={`${width}-${args.value}`} width={width} />
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
      "Complete recorded variant × state matrix. Forced CSS pseudo states supplement the actual keyboard interaction; all samples are functional."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="w-full space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-semibold">Interaction states</p>
        <p className="m-0 text-sm text-semantic-text-muted">
          Disabled overrides the error halo. The table scrolls within this
          canvas.
        </p>
      </header>
      <div className="w-full overflow-x-auto pb-56">
        <div
          style={{ width: 1370 }}
          className="grid grid-cols-[100px_repeat(5,238px)] gap-4"
        >
          <span />
          <>
            {COLUMNS.map((column) => (
              <p
                key={column.label}
                className="m-0 text-xs font-semibold text-semantic-text-muted"
              >
                {column.label}
              </p>
            ))}
          </>
          {VARIANTS.map((state) => (
            <React.Fragment key={state}>
              <p className="m-0 pt-6 text-sm font-semibold">{state}</p>
              {COLUMNS.map((column) => (
                <Preview
                  {...args}
                  key={`${state}-${column.label}-${args.value}`}
                  state={state}
                  disabled={column.disabled}
                  width={238}
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
      "All default, error and disabled treatments with empty and selected fields, in both versions. Shared host Controls apply before each fixed comparison axis."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="w-full space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-semibold">v1 and v2</p>
        <p className="m-0 text-sm text-semantic-text-muted">
          Same options and behaviors, with the v2 field language.
        </p>
      </header>
      <div className="w-full overflow-x-auto pb-56">
        <div
          className="grid grid-cols-[160px_320px_320px] gap-6"
          style={{ width: 870 }}
        >
          <span />
          <p className="m-0 text-sm font-semibold">v1</p>
          <p className="m-0 text-sm font-semibold">v2</p>
          {["default", "error", "disabled"].flatMap((treatment) =>
            ["", "sales"].map((value) => (
              <React.Fragment key={`${treatment}-${value}`}>
                <p className="m-0 pt-6 text-xs text-semantic-text-muted">
                  {treatment} · {value ? "selected" : "empty"}
                </p>
                {(["v1", "v2"] as const).map((version) => (
                  <Preview
                    {...args}
                    version={version}
                    key={`${version}-${treatment}-${value}`}
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
          "A local profile form. Create a custom role, save it, or clear the selection to see required validation. No network request is made.",
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
  const missing = submitted && !args.value;
  return (
    <form
      className="w-full max-w-[560px] space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        setFeedback(
          args.value
            ? `Saved role: ${optionsFor(args.options).find((option) => option.value === args.value)?.label || args.value}`
            : ""
        );
      }}
    >
      <header className="space-y-1">
        <p className="m-0 text-base font-semibold">Agent profile</p>
        <p className="m-0 text-sm text-semantic-text-muted">
          Choose the main role for this agent.
        </p>
      </header>
      <Example
        {...args}
        width={args.width}
        state={missing ? "error" : args.state}
        errorMessage={args.errorMessage}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          setSubmitted(false);
          setFeedback("");
        }}
      />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={args.disabled}>
          Save role
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={args.disabled}
          onClick={() => {
            args.onValueChange?.("");
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
