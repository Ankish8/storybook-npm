import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";
import { Check, Eye, EyeOff, Lock, Mail, Search } from "lucide-react";
import { gallery } from "../../../storybook/v2-preview";
import { TextField, type TextFieldProps } from "./text-field";
import { TextField as TextFieldV1 } from "../text-field";
import { Button } from "./button";
import { v2ComponentDocs } from "./story-docs";

const changeAction = fn<(value: string) => void>().mockName("onChange");

const STATES = ["default", "empty", "error"] as const;
const SIZES = ["default", "sm"] as const;
const STATE_COLUMNS = [
  { label: "Default", disabled: false, loading: false },
  { label: "Hover", pseudo: "hover", disabled: false, loading: false },
  { label: "Focus", pseudo: "focus", disabled: false, loading: false },
  { label: "Disabled", disabled: true, loading: false },
  {
    label: "Disabled + hover",
    pseudo: "hover",
    disabled: true,
    loading: false,
  },
  { label: "Loading", disabled: false, loading: true },
] as const;

/** Each gallery sample owns its text; editing the value control remounts it. */
function PreviewTextField({
  value = "",
  onChange,
  onClear,
  version = "v2",
  ...props
}: TextFieldProps & { version?: "v1" | "v2" }) {
  const [text, setText] = React.useState(value);
  const Component = version === "v1" ? TextFieldV1 : TextField;
  return (
    <Component
      {...props}
      value={text}
      onChange={(event) => {
        setText(event.target.value);
        onChange?.(event);
      }}
      onClear={() => {
        setText("");
        onClear?.();
      }}
    />
  );
}

const meta: Meta<typeof TextField> = {
  title: "V2/Components/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "label",
        "value",
        "placeholder",
        "helperText",
        "error",
        "state",
        "size",
        "type",
        "required",
        "disabled",
        "readOnly",
        "loading",
        "leftIcon",
        "rightIcon",
        "prefix",
        "suffix",
        "clearable",
        "showCount",
        "maxLength",
        "preventConsecutiveSpaces",
        "onChange",
        "onClear",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-7628",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "text-field",
          summary:
            "A labelled single-line field with validation, icons, prefixes, suffixes, a counter and a clear action.",
          changes: [
            [
              "Height and radius",
              "Default 42px / compact 36px; 4px radius",
              "Default 40px / compact 36px; 8px radius",
            ],
            [
              "Typography",
              "Inherited font; 12px label",
              "Inter; 14px semibold label, 12px helper",
            ],
            [
              "Value text",
              "16px default / 12px compact",
              "16px default / 12px compact",
            ],
            ["Hover border", "Default border", "#C0C3CA on enabled fields"],
            [
              "Focus",
              "Thin teal shadow",
              "#27ABB8 border and a soft 4px shadow",
            ],
            [
              "Error",
              "Red border and thin shadow",
              "Red border and a soft 4px shadow; 12px error text",
            ],
            [
              "Disabled",
              "Reduced opacity",
              "Solid grey surface without opacity loss",
            ],
            [
              "Typing and validation",
              "Controlled/uncontrolled values, counters, clear callback and space/caret protection",
              "Same current props and behavior",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Value", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Label", "--semantic-text-secondary", "#343E55", "#343E55"],
            [
              "Helper / prefix / suffix",
              "--semantic-text-muted",
              "#717680",
              "#717680",
            ],
            [
              "Placeholder",
              "--semantic-text-placeholder",
              "#A2A6B1",
              "#A2A6B1",
            ],
            ["Border", "--semantic-border-input", "#E9EAEB", "#E9EAEB"],
            ["Hover border", "--color-primary-100", "#C0C3CA", "#C0C3CA"],
            ["Focus", "--color-secondary-600", "#27ABB8", "#27ABB8"],
            ["Error border", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Error text", "--semantic-error-text", "#B42318", "#B42318"],
            ["Disabled surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Font", "--font-v2", "Inter"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            "Use a visible label and helper text when more context is needed. `error` supplies an error message, red styling and the accessible description. `state` changes the visual treatment only. In controlled forms, update `value` from `onChange` and reset it in `onClear`; the component never changes your controlled value itself. `loading` disables typing and replaces the right icon with a spinner. Compact size remains 36px for existing dense forms.",
        }),
      },
    },
  },
  tags: ["autodocs"],
  args: {
    label: "Workspace name",
    value: "",
    placeholder: "Enter a workspace name",
    helperText: "A name your team can recognize.",
    error: "",
    state: "default",
    size: "default",
    type: "text",
    required: false,
    disabled: false,
    readOnly: false,
    loading: false,
    leftIcon: false,
    rightIcon: false,
    prefix: "",
    suffix: "",
    clearable: false,
    showCount: false,
    maxLength: 40,
    preventConsecutiveSpaces: true,
    onChange: (event) => changeAction(event.target.value),
    onClear: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <div className="w-[420px] max-w-full">
        <TextField
          {...args}
          aria-label={args.label ? undefined : "Example text field"}
          onChange={(event) => {
            args.onChange?.(event);
            updateArgs({ value: event.target.value });
          }}
          onClear={() => {
            args.onClear?.();
            updateArgs({ value: "" });
          }}
        />
      </div>
    );
  },
  argTypes: {
    label: {
      control: "text",
      description: "Visible label associated with the input.",
    },
    value: {
      control: "text",
      description:
        "Live value. Typing and clearing update this control; editing it updates the field.",
    },
    placeholder: {
      control: "text",
      description: "Hint shown while the field is empty.",
    },
    helperText: {
      control: "text",
      description: "Supporting text; replaced when error is present.",
    },
    error: {
      control: "text",
      description:
        "Validation message; also sets the error treatment and aria-invalid.",
    },
    state: {
      control: "select",
      options: STATES,
      description: "Visual treatment. An error message takes precedence.",
    },
    size: {
      control: "select",
      options: SIZES,
      description: "Default 40px or compact 36px control height.",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "Native input type.",
    },
    required: {
      control: "boolean",
      description: "Show the required indicator beside the label.",
    },
    disabled: {
      control: "boolean",
      description: "Disable typing and use the disabled surface.",
    },
    readOnly: {
      control: "boolean",
      description: "Allow selection and copying without editing.",
    },
    loading: {
      control: "boolean",
      description: "Disable typing and show a loading spinner.",
    },
    leftIcon: {
      control: "boolean",
      mapping: { true: <Search />, false: undefined },
      description: "Show a search icon before the value.",
    },
    rightIcon: {
      control: "boolean",
      mapping: { true: <Mail />, false: undefined },
      description: "Show an email icon after the value. Hidden while loading.",
    },
    prefix: {
      control: "text",
      description: "Static text before the editable value.",
    },
    suffix: {
      control: "text",
      description: "Static text after the editable value.",
    },
    clearable: {
      control: "boolean",
      description: "Show a clear action when an enabled field has a value.",
    },
    showCount: {
      control: "boolean",
      description: "Show the current character count beside maxLength.",
    },
    maxLength: {
      control: { type: "number", min: 1, step: 1 },
      description: "Native character limit and counter limit.",
    },
    preventConsecutiveSpaces: {
      control: "boolean",
      description:
        "Prevent repeated spaces in text-like types while preserving the caret.",
    },
    defaultValue: {
      control: false,
      description:
        "Initial uncontrolled value. These playgrounds use a live value control.",
    },
    onChange: { control: false, description: "Receives native input changes." },
    onClear: {
      control: false,
      description:
        "Reset the value in a controlled field when the clear action is clicked.",
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
export const Default: Story = {};
export const Empty: Story = { args: { state: "empty", value: "" } };
export const Error: Story = {
  args: { state: "error", value: "ab", error: "Use at least 3 characters." },
};
export const Disabled: Story = {
  args: { disabled: true, value: "Customer support" },
};
export const ReadOnly: Story = {
  name: "Read only",
  args: { readOnly: true, value: "Customer support" },
};
export const LoadingState: Story = {
  name: "Loading",
  args: {
    loading: true,
    value: "Customer support",
    helperText: "Checking availability…",
  },
};
export const SmallSize: Story = { name: "Small size", args: { size: "sm" } };
export const WithLabel: Story = {
  name: "With required label",
  args: { required: true },
};
export const WithIcons: Story = {
  name: "With icons",
  args: { leftIcon: true, rightIcon: true },
};
export const Clearable: Story = {
  args: { clearable: true, value: "Customer support" },
};
export const WithPrefixSuffix: Story = {
  name: "With prefix / suffix",
  args: {
    label: "Workspace website",
    prefix: "https://",
    suffix: ".com",
    placeholder: "workspace",
    value: "myoperator",
    helperText: "Enter the domain name only.",
  },
};
export const CharacterCount: Story = {
  name: "Character count",
  args: { showCount: true, maxLength: 24, value: "Customer support" },
};
export const AllFeatures: Story = {
  name: "All features",
  args: {
    label: "Workspace website",
    value: "myoperator",
    prefix: "https://",
    suffix: ".com",
    leftIcon: true,
    clearable: true,
    showCount: true,
    maxLength: 24,
    required: true,
  },
};

export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["state", "error"],
    "Rows fix the default, empty and error treatments. All other controls apply to every sample. Each sample keeps its own text; editing the value control resets them together."
  ),
  render: (args) => (
    <div className="flex w-[420px] max-w-full flex-col gap-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      {STATES.map((state) => (
        <section key={state} className="space-y-2">
          <p className="m-0 text-xs font-semibold text-semantic-text-muted">
            {state === "default"
              ? "Default"
              : state === "empty"
                ? "Empty treatment"
                : "Error treatment"}
          </p>
          <PreviewTextField
            {...args}
            key={state + String(args.value)}
            state={state}
            error={state === "error" ? "Use at least 3 characters." : ""}
          />
        </section>
      ))}
    </div>
  ),
};
export const ValidationStates: Story = {
  ...AllVariants,
  name: "Validation states",
};

export const AllSizes: Story = {
  name: "All sizes",
  parameters: gallery(
    ["size"],
    "Default is 40px high; compact is 36px. All other controls apply to both samples, including icons, validation and the counter."
  ),
  render: (args) => (
    <div className="flex w-[420px] max-w-full flex-col gap-6">
      {SIZES.map((size) => (
        <section key={size} className="space-y-2">
          <p className="m-0 text-xs font-semibold text-semantic-text-muted">
            {size === "sm" ? "Compact · 36px" : "Default · 40px"}
          </p>
          <PreviewTextField
            {...args}
            key={size + String(args.value)}
            size={size}
          />
        </section>
      ))}
    </div>
  ),
};
export const SizeComparison: Story = { ...AllSizes, name: "Size comparison" };

function StateGrid(args: TextFieldProps) {
  return (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1320px] grid-cols-[110px_repeat(6,minmax(180px,1fr))] items-start gap-x-5 gap-y-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <div />
        {STATE_COLUMNS.map((column) => (
          <p
            key={column.label}
            className="m-0 text-xs font-semibold text-semantic-text-muted"
          >
            {column.label}
          </p>
        ))}
        {STATES.map((state) => (
          <React.Fragment key={state}>
            <p className="m-0 pt-6 text-xs font-semibold text-semantic-text-secondary">
              {state === "default"
                ? "Default"
                : state === "empty"
                  ? "Empty"
                  : "Error"}
            </p>
            {STATE_COLUMNS.map((column) => (
              <PreviewTextField
                {...args}
                key={column.label + String(args.value)}
                state={state}
                error={state === "error" ? "Check this value." : ""}
                disabled={column.disabled}
                loading={column.loading}
                className={
                  "pseudo" in column && column.pseudo === "hover"
                    ? "pseudo-hover"
                    : "pseudo" in column && column.pseudo === "focus"
                      ? "pseudo-focus"
                      : undefined
                }
                inputContainerClassName={
                  "pseudo" in column && column.pseudo === "hover"
                    ? "pseudo-hover"
                    : "pseudo" in column && column.pseudo === "focus"
                      ? "pseudo-focus-within"
                      : undefined
                }
                aria-label={state + " " + column.label}
                data-v2-component="text-field"
                data-variant={state}
                data-state={column.label}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
export const States: Story = {
  parameters: {
    ...gallery(
      ["state", "error", "disabled", "loading"],
      "Rows fix the visual treatment and columns fix the interaction state. Text, size, icons, prefixes, suffixes and counters remain editable. The grid scrolls inside its preview."
    ),
    layout: "padded",
  },
  render: (args) => <StateGrid {...args} />,
};
export const AddonStates: Story = {
  ...States,
  name: "States with addons",
  args: {
    leftIcon: true,
    prefix: "https://",
    helperText: "Focus styling belongs to the outer container.",
  },
};

const COMPARISON_ROWS = [
  {
    label: "Default",
    state: "default" as const,
    disabled: false,
    loading: false,
  },
  { label: "Empty", state: "empty" as const, disabled: false, loading: false },
  { label: "Error", state: "error" as const, disabled: false, loading: false },
  {
    label: "Disabled",
    state: "default" as const,
    disabled: true,
    loading: false,
  },
  {
    label: "Loading",
    state: "default" as const,
    disabled: false,
    loading: true,
  },
];
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: {
    ...gallery(
      ["state", "size", "error", "disabled", "loading"],
      "Compare both sizes and every visual treatment with the same text, labels, icons, prefixes and counters. Each input is independent. Fixed axes are hidden from Controls; wide content stays inside the preview."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-[130px_minmax(320px,1fr)_minmax(320px,1fr)] items-start gap-x-8 gap-y-5 font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <div />
        <p className="m-0 text-xs font-semibold text-semantic-text-muted">
          v1 · ui/text-field
        </p>
        <p className="m-0 text-xs font-semibold text-semantic-text-muted">
          v2 · ui/v2/text-field
        </p>
        {COMPARISON_ROWS.flatMap((row) =>
          SIZES.map((size) => (
            <React.Fragment key={row.label + size}>
              <p className="m-0 pt-6 text-xs font-semibold text-semantic-text-secondary">
                {row.label}
                <span className="mt-1 block font-normal text-semantic-text-muted">
                  {size === "sm" ? "Compact" : "Default size"}
                </span>
              </p>
              {(["v1", "v2"] as const).map((version) => (
                <PreviewTextField
                  {...args}
                  state={row.state}
                  disabled={row.disabled}
                  loading={row.loading}
                  key={version + String(args.value)}
                  version={version}
                  size={size}
                  error={
                    row.state === "error" ? "Use at least 3 characters." : ""
                  }
                  aria-label={version + " " + row.label + " " + size}
                />
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  ),
};

function PasswordExample(args: TextFieldProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="w-[420px] max-w-full">
      <TextField
        {...args}
        type={visible ? "text" : "password"}
        leftIcon={<Lock />}
        rightIcon={
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            disabled={args.disabled || args.loading}
            onClick={() => setVisible((previous) => !previous)}
            className="flex cursor-pointer items-center rounded-sm focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-semantic-primary disabled:cursor-not-allowed"
          >
            {visible ? <EyeOff /> : <Eye />}
          </button>
        }
      />
    </div>
  );
}
export const Password: Story = {
  args: {
    label: "Password",
    value: "example-password",
    placeholder: "Enter a password",
    helperText: "Use at least 8 characters.",
    required: true,
  },
  parameters: gallery(
    ["type", "leftIcon", "rightIcon"],
    "The password type and icons belong to this example. The reveal action works with a mouse or keyboard; value, size, disabled, loading and other field controls remain live."
  ),
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <PasswordExample
        {...args}
        onChange={(event) => {
          args.onChange?.(event);
          updateArgs({ value: event.target.value });
        }}
        onClear={() => {
          args.onClear?.();
          updateArgs({ value: "" });
        }}
      />
    );
  },
};

function WorkspaceForm(args: TextFieldProps) {
  const [savedValue, setSavedValue] = React.useState<string | null>(null);
  const [validation, setValidation] = React.useState("");
  const saved = savedValue !== null && savedValue === String(args.value ?? "");
  return (
    <form
      className="flex w-[420px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]"
      onSubmit={(event) => {
        event.preventDefault();
        if (String(args.value ?? "").trim().length < 3) {
          setValidation("Use at least 3 characters.");
          setSavedValue(null);
          return;
        }
        setValidation("");
        setSavedValue(String(args.value ?? ""));
      }}
    >
      <div>
        <p className="m-0 text-base font-semibold text-semantic-text-primary">
          Workspace details
        </p>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          Update the name shown to your team.
        </p>
      </div>
      <TextField
        {...args}
        type="text"
        state={validation ? "error" : args.state}
        error={args.error || validation}
        onChange={(event) => {
          args.onChange?.(event);
          setSavedValue(null);
          setValidation("");
        }}
        onClear={() => {
          args.onClear?.();
          setSavedValue(null);
          setValidation("");
        }}
      />
      <div className="flex items-center justify-between gap-4 border-t border-semantic-border-layout pt-4">
        <span className="text-xs text-semantic-text-muted" role="status">
          {saved ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5" />
              Saved in this example
            </span>
          ) : (
            "Changes stay in this example"
          )}
        </span>
        <Button
          type="submit"
          size="sm"
          disabled={args.disabled || args.loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
export const Usage: Story = {
  args: {
    value: "Customer support",
    clearable: true,
    showCount: true,
    required: true,
  },
  parameters: gallery(
    ["type"],
    "A local form with working validation, clear action and save feedback. All field controls apply; type stays text. Typing and clearing synchronize the value control. No data is submitted outside this example."
  ),
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <WorkspaceForm
        {...args}
        onChange={(event) => {
          args.onChange?.(event);
          updateArgs({ value: event.target.value });
        }}
        onClear={() => {
          args.onClear?.();
          updateArgs({ value: "" });
        }}
      />
    );
  },
};
export const FormExample: Story = { ...Usage, name: "Form example" };
export const Controlled: Story = { ...Usage, name: "Controlled form" };
