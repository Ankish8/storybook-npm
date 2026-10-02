import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Check } from "lucide-react";
import { gallery } from "../../../storybook/v2-preview";
import { Textarea, type TextareaProps } from "./textarea";
import { Textarea as TextareaV1 } from "../textarea";
import { Button } from "./button";
import { v2ComponentDocs } from "./story-docs";

const changeAction = fn<(value: string) => void>().mockName("onChange");

const STATES = ["default", "error"] as const;
const SIZES = ["sm", "default", "lg"] as const;
const COLUMNS = [
  { label: "Default", disabled: false },
  { label: "Hover", disabled: false, className: "pseudo-hover" },
  { label: "Focus", disabled: false, className: "pseudo-focus" },
  { label: "Disabled", disabled: true },
  { label: "Disabled + hover", disabled: true, className: "pseudo-hover" },
] as const;

function PreviewTextarea({
  value = "",
  onChange,
  version = "v2",
  ...props
}: TextareaProps & { version?: "v1" | "v2" }) {
  const [text, setText] = React.useState(value);
  const fieldProps = {
    ...props,
    value: text,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value);
      onChange?.(event);
    },
  };
  return version === "v1" ? (
    <TextareaV1
      {...fieldProps}
      size={props.size === "lg" ? "default" : props.size}
    />
  ) : (
    <Textarea {...fieldProps} />
  );
}

const meta: Meta<typeof Textarea> = {
  title: "V2/Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "label",
        "value",
        "placeholder",
        "helperText",
        "error",
        "errorIcon",
        "state",
        "size",
        "disabled",
        "readOnly",
        "required",
        "rows",
        "resize",
        "showCount",
        "maxLength",
        "enforceMaxLength",
        "displayCharCount",
        "onChange",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-9305",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "textarea",
          summary:
            "A multiline field with labels, validation, character counts and native resizing.",
          changes: [
            ["Radius", "4px", "8px"],
            [
              "Typography",
              "Inherited font; default 16px / compact 14px",
              "Inter; compact 12px / default 14px / large 16px; 14px medium label",
            ],
            [
              "Helper and counter",
              "14px supporting text",
              "12px supporting text",
            ],
            ["Hover border", "Default border", "#C0C3CA on enabled fields"],
            [
              "Focus",
              "Thin teal shadow",
              "#27ABB8 border and a soft 4px shadow",
            ],
            ["Disabled", "Reduced opacity", "Solid grey surface and border"],
            [
              "Typing and limits",
              "Space normalization, caret preservation, hard and soft limits",
              "Same current behavior and props",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Value", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
            ["Label", "--v2-text-primary", "#484848", "#484848"],
            ["Helper / counter", "--semantic-text-muted", "#717680", "#717680"],
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
            ["Font", "--font-v2", "Inter 400"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            "Keep the label visible. The `error` prop supplies an accessible description and error treatment. `maxLength` is a native hard limit unless `enforceMaxLength=false`; with a soft limit, let your form validate overflow. The counter counts normalized text, including single spaces and line breaks. `displayCharCount` overrides only the displayed count. `rows` and `resize` keep the existing native sizing behavior. Existing default and sm options remain available; lg adds the recorded Large treatment.",
        }),
      },
    },
  },
  args: {
    label: "Notes",
    value: "",
    placeholder: "Write a note.",
    helperText: "Keep it brief.",
    error: "",
    errorIcon: false,
    state: "default",
    size: "default",
    disabled: false,
    readOnly: false,
    required: false,
    rows: 4,
    resize: "none",
    showCount: false,
    maxLength: 200,
    enforceMaxLength: true,
    onChange: (event) => changeAction(event.target.value),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <div className="w-[420px] max-w-full">
        <Textarea
          {...args}
          aria-label={args.label ? undefined : "Example textarea"}
          onChange={(event) => {
            args.onChange?.(event);
            updateArgs({ value: event.target.value });
          }}
        />
      </div>
    );
  },
  argTypes: {
    label: {
      control: "text",
      description: "Visible label associated with the textarea.",
    },
    value: {
      control: "text",
      description:
        "Live text. Typing updates this control; editing the control updates the field.",
    },
    placeholder: {
      control: "text",
      description: "Hint while the field is empty.",
    },
    helperText: {
      control: "text",
      description: "Supporting text, replaced by an error message.",
    },
    error: {
      control: "text",
      description: "Error message, styling and accessible description.",
    },
    errorIcon: {
      control: "boolean",
      description: "Show an icon beside the validation message.",
    },
    state: {
      control: "select",
      options: STATES,
      description: "Visual treatment; an error message takes precedence.",
    },
    size: {
      control: "select",
      options: SIZES,
      description:
        "Compact 12px, default 14px or large 16px text with size-specific padding.",
    },
    disabled: { control: "boolean", description: "Disable editing and focus." },
    readOnly: {
      control: "boolean",
      description: "Allow copying without edits.",
    },
    required: {
      control: "boolean",
      description:
        "Show the required indicator and set native required validation.",
    },
    rows: {
      control: { type: "number", min: 1, max: 20, step: 1 },
      description: "Native visible row count.",
    },
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
      description:
        "Native resize directions; the field stays within its container.",
    },
    showCount: {
      control: "boolean",
      description: "Show the current length against maxLength.",
    },
    maxLength: {
      control: { type: "number", min: 1, step: 1 },
      description: "Hard or soft character limit.",
    },
    enforceMaxLength: {
      control: "boolean",
      description:
        "Apply maxLength as a native hard limit. Disable for a soft limit.",
    },
    displayCharCount: {
      control: { type: "number", min: 0, step: 1 },
      description:
        "Optional display-only count override. Unset to use the normalized length.",
    },
    defaultValue: {
      control: false,
      description:
        "Initial uncontrolled value. Playground stories use live value.",
    },
    onChange: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Default: Story = {};
export const WithLabel: Story = {
  name: "With label",
  args: { label: "Conversation notes" },
};
export const WithError: Story = {
  name: "With error",
  args: {
    error: "Add a little more detail.",
    value: "Too short",
    errorIcon: true,
  },
};
export const WithHelperText: Story = {
  name: "With helper text",
  args: { helperText: "Add context that will help the next agent." },
};
export const WithCharacterCount: Story = {
  name: "With character count",
  args: {
    showCount: true,
    maxLength: 100,
    value: "The customer asked for a callback.",
  },
};
export const SmallSize: Story = { name: "Small size", args: { size: "sm" } };
export const LargeSize: Story = { name: "Large size", args: { size: "lg" } };
export const Resizable: Story = {
  args: {
    resize: "vertical",
    helperText: "Drag the bottom corner to change the height.",
  },
};
export const Required: Story = { args: { required: true } };
export const Disabled: Story = {
  args: { disabled: true, value: "These notes cannot be edited." },
};
export const ReadOnly: Story = {
  name: "Read only",
  args: { readOnly: true, value: "You can select and copy this text." },
};

export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["state", "error"],
    "Compare default and error treatments. Every other control applies to both samples; typing in each field is independent."
  ),
  render: (args) => (
    <div className="flex w-[420px] max-w-full flex-col gap-6">
      {STATES.map((state) => (
        <section key={state} className="space-y-2">
          <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
            {state === "error" ? "Error" : "Default"}
          </p>
          <PreviewTextarea
            {...args}
            key={state + String(args.value)}
            state={state}
            error={state === "error" ? "Add a little more detail." : ""}
          />
        </section>
      ))}
    </div>
  ),
};
export const AllStates: Story = { ...AllVariants, name: "All states" };
export const AllSizes: Story = {
  name: "All sizes",
  parameters: gallery(
    ["size"],
    "Compact, default and large text/padding with the same row count. All other controls apply, including validation, resizing and character counts."
  ),
  render: (args) => (
    <div className="flex w-[420px] max-w-full flex-col gap-6">
      {SIZES.map((size) => (
        <section key={size} className="space-y-2">
          <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
            {size === "sm"
              ? "Compact · 12px"
              : size === "lg"
                ? "Large · 16px"
                : "Default · 14px"}
          </p>
          <PreviewTextarea
            {...args}
            key={size + String(args.value)}
            size={size}
          />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      ["state", "error", "disabled"],
      "Rows fix the treatment and columns fix interaction states. Text, row count, size, helper, resize and counter controls remain editable. This wide grid scrolls within its preview."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1200px] grid-cols-[100px_repeat(5,minmax(200px,1fr))] items-start gap-x-5 gap-y-6">
        <div />
        {COLUMNS.map((column) => (
          <p
            key={column.label}
            className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]"
          >
            {column.label}
          </p>
        ))}
        {STATES.map((state) => (
          <React.Fragment key={state}>
            <p className="m-0 pt-6 text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {state === "error" ? "Error" : "Default"}
            </p>
            {COLUMNS.map((column) => (
              <PreviewTextarea
                {...args}
                key={column.label + String(args.value)}
                state={state}
                error={state === "error" ? "Add more detail." : ""}
                disabled={column.disabled}
                className={"className" in column ? column.className : undefined}
                aria-label={state + " " + column.label}
                data-v2-component="textarea"
                data-variant={state}
                data-state={column.label}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: {
    ...gallery(
      ["size", "state", "error", "disabled"],
      "All v2 sizes in default, error and disabled treatments. Existing default/sm options compare directly; the new lg option has no v1 counterpart. Other controls apply equally to both versions. Each sample owns its text; comparison content stays inside the preview."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[850px] grid-cols-[120px_minmax(320px,1fr)_minmax(320px,1fr)] items-start gap-x-6 gap-y-5">
        <div />
        <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v1 · ui/textarea
        </p>
        <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v2 · ui/v2/textarea
        </p>
        {[...STATES, "disabled" as const].flatMap((state) =>
          SIZES.map((size) => (
            <React.Fragment key={state + size}>
              <p className="m-0 pt-6 text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
                {state}
                <span className="mt-1 block font-normal text-[var(--v2-text-muted,#707070)]">
                  {size === "sm"
                    ? "Compact"
                    : size === "lg"
                      ? "Large"
                      : "Default size"}
                </span>
              </p>
              {(["v1", "v2"] as const).map((version) =>
                version === "v1" && size === "lg" ? (
                  <p
                    key={version}
                    className="m-0 rounded-lg border border-dashed border-semantic-border-layout p-4 text-xs text-[var(--v2-text-muted,#707070)]"
                  >
                    Large is new in v2. v1 supports default and sm.
                  </p>
                ) : (
                  <PreviewTextarea
                    {...args}
                    key={version + String(args.value)}
                    version={version}
                    size={size}
                    state={state === "disabled" ? "default" : state}
                    disabled={state === "disabled"}
                    error={state === "error" ? "Add more detail." : ""}
                    aria-label={version + " " + state + " " + size}
                  />
                )
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  ),
};

function DraftForm(args: TextareaProps) {
  const [savedValue, setSavedValue] = React.useState<string | null>(null);
  const [validation, setValidation] = React.useState("");
  const text = String(args.value ?? "");
  const overflow = args.maxLength && text.length > args.maxLength;
  return (
    <form
      className="flex w-[420px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]"
      onSubmit={(event) => {
        event.preventDefault();
        if (text.trim().length < 10 || overflow) {
          setValidation(
            overflow
              ? "Shorten the note before saving."
              : "Use at least 10 characters."
          );
          setSavedValue(null);
          return;
        }
        setValidation("");
        setSavedValue(text);
      }}
    >
      <div>
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Conversation notes
        </p>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
          Leave useful context for your team.
        </p>
      </div>
      <Textarea
        {...args}
        error={args.error || validation}
        onChange={(event) => {
          args.onChange?.(event);
          setValidation("");
          setSavedValue(null);
        }}
      />
      <div className="flex items-center justify-between gap-4 border-t border-semantic-border-layout pt-4">
        <span
          className="text-xs text-[var(--v2-text-muted,#707070)]"
          role="status"
        >
          {savedValue === text ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5" />
              Saved in this example
            </span>
          ) : (
            "Changes stay in this example"
          )}
        </span>
        <Button type="submit" size="sm" disabled={args.disabled}>
          Save note
        </Button>
      </div>
    </form>
  );
}
export const Usage: Story = {
  args: {
    value: "The customer asked for a callback tomorrow.",
    showCount: true,
  },
  parameters: gallery(
    [],
    "A local form with working validation, typing and save feedback. All exposed controls apply to the field. No data leaves this example."
  ),
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <DraftForm
        {...args}
        onChange={(event) => {
          args.onChange?.(event);
          updateArgs({ value: event.target.value });
        }}
      />
    );
  },
};
export const SoftLimit: Story = {
  name: "Soft character limit",
  args: {
    value: "This longer note exceeds the example's soft limit.",
    showCount: true,
    maxLength: 30,
    enforceMaxLength: false,
  },
  parameters: gallery(
    [],
    "Turn enforceMaxLength on to use a hard limit. With it off, typing can exceed maxLength and the counter turns red. Usage demonstrates form validation for overflow."
  ),
};
