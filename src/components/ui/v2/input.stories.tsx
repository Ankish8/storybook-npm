import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { useArgs } from "storybook/preview-api";
import { gallery, PreviewInput } from "../../../storybook/v2-preview";
import { Check, Info } from "lucide-react";
import { Input, type InputProps } from "./input";
import { Input as InputV1 } from "../input";
import { Button } from "./button";
import { v2ComponentDocs } from "./story-docs";

const STATES = ["default", "error"] as const;
const changeAction = fn<(value: string) => void>().mockName("onChange");
const focusAction = fn().mockName("onFocus");
const blurAction = fn().mockName("onBlur");
const STATE_COLUMNS = [
  { label: "Default", className: undefined, disabled: false },
  { label: "Hover", className: "pseudo-hover", disabled: false },
  { label: "Focus", className: "pseudo-focus", disabled: false },
  { label: "Disabled", className: undefined, disabled: true },
  { label: "Disabled + hover", className: "pseudo-hover", disabled: true },
] as const;
const meta: Meta<typeof Input> = {
  title: "V2/Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "state",
        "type",
        "value",
        "placeholder",
        "disabled",
        "readOnly",
        "showCheckIcon",
        "decimal",
        "allowDecimal",
        "hideNumberSpinners",
        "preventNumberExponent",
        "preventConsecutiveSpaces",
        "onChange",
        "onFocus",
        "onBlur",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-7628",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "input",
          summary:
            "A single-line field for text and numbers. Native input attributes and the current typing rules are preserved.",
          changes: [
            [
              "Height and radius",
              "42px height, 4px radius",
              "44px height, 8px radius",
            ],
            [
              "Typography",
              "16px, inherited family",
              "Timeless Sans (Inter fallback) 14/1.4, -0.01em tracking, regular",
            ],
            ["Horizontal padding", "16px", "12px"],
            [
              "Hover",
              "Border stayed the same",
              "Border darkens to the primary colour over 160ms, on fine hover-capable pointers only",
            ],
            [
              "Focus",
              "Teal border and a 1px teal glow",
              "No border change or glow; the caret marks the field",
            ],
            [
              "Error",
              "Red border with a faint red glow, kept on focus",
              'Red border only, kept on hover and focus. aria-invalid="true" shows it too',
            ],
            ["Disabled", "50% opacity", "50% opacity on a solid grey surface"],
            [
              "Check icon",
              "Appeared and disappeared instantly",
              "Scales up from 0.8 and unblurs on focus; opacity only under reduced motion",
            ],
            [
              "Typing behavior",
              "Number guards, spinner control, consecutive-space protection",
              "Unchanged, including caret handling and override props",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Border", "--semantic-border-input", "#E9EAEB", "#E9EAEB"],
            ["Hover border", "--semantic-primary", "#343E55", "#343E55"],
            ["Value", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
            ["Placeholder", "--v2-text-placeholder", "#707070", "#707070"],
            ["Error border", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Disabled surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Font", "--font-v2", "Timeless Sans (Inter fallback) 400"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            'Pair Input with a visible label. `state="error"` or `aria-invalid="true"` shows the red border; connect a message with `aria-describedby` when showing validation. For a label, helper and error copy that animates, icons, a counter or a clear button as one field, use TextField. Numeric fields preserve `decimal`, `allowDecimal`, `preventNumberExponent` and `hideNumberSpinners`.',
        }),
      },
    },
  },
  tags: ["autodocs"],
  args: {
    state: "default",
    type: "text",
    value: "",
    placeholder: "Enter text",
    disabled: false,
    readOnly: false,
    showCheckIcon: false,
    decimal: true,
    hideNumberSpinners: true,
    preventNumberExponent: true,
    preventConsecutiveSpaces: true,
    onChange: (event) => changeAction(event.target.value),
    onFocus: () => focusAction(),
    onBlur: () => blurAction(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <div className="w-[420px] max-w-full">
        <Input
          {...args}
          aria-label="Example input"
          aria-invalid={args.state === "error" || undefined}
          onChange={(event) => {
            args.onChange?.(event);
            updateArgs({ value: event.target.value });
          }}
        />
      </div>
    );
  },
  argTypes: {
    state: {
      control: "select",
      options: STATES,
      description: "Default or error visual treatment.",
    },
    placeholder: {
      control: "text",
      description: "Hint displayed when the field is empty.",
    },
    defaultValue: {
      control: false,
      description:
        "Initial uncontrolled value. The interactive stories use value so edits update immediately.",
    },
    type: {
      control: "select",
      options: ["text", "email", "tel", "password", "number", "search"],
      description: "Native input type.",
    },
    disabled: { control: "boolean", description: "Disable typing and focus." },
    readOnly: {
      control: "boolean",
      description: "Allow selection and copying without edits.",
    },
    showCheckIcon: {
      control: "boolean",
      description: "Show a check icon while focused.",
    },
    hideNumberSpinners: {
      control: "boolean",
      description: "Hide native number controls. Defaults to true.",
    },
    preventNumberExponent: {
      control: "boolean",
      description: "Reject e/E in number fields. Defaults to true.",
    },
    decimal: {
      control: "boolean",
      description: "Allow decimal separators in number fields.",
    },
    allowDecimal: {
      control: "boolean",
      description: "Explicit override for decimal.",
    },
    preventConsecutiveSpaces: {
      control: "boolean",
      description:
        "Reject consecutive spaces in text-like inputs. Defaults to true.",
    },
    value: {
      control: "text",
      description:
        "Live text value. Typing updates this control, and editing the control updates the field.",
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Default: Story = { args: { placeholder: "Enter your name" } };
export const Error: Story = { args: { state: "error", value: "not-an-email" } };
export const Disabled: Story = {
  args: { disabled: true, placeholder: "Unavailable" },
};
export const ReadOnly: Story = {
  args: { readOnly: true, value: "support@myoperator.com" },
};
export const WithValue: Story = { args: { value: "Customer support" } };
export const WithCheckIcon: Story = {
  name: "With focus check icon",
  args: { showCheckIcon: true, placeholder: "Click to focus" },
  parameters: {
    docs: {
      description: {
        story:
          "Focus the input to reveal its check icon. The showCheckIcon control updates the icon while focused.",
      },
    },
  },
};
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["state"],
    "Default and error treatments. Controls update both fields; typing in each sample is independent."
  ),
  render: (args) => (
    <div className="flex w-[420px] max-w-full flex-col gap-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      {STATES.map((state) => (
        <div key={state} className="space-y-2">
          <label
            htmlFor={"input-" + state}
            className="text-sm font-medium text-[var(--v2-text-primary,#484848)]"
          >
            {state === "error" ? "Error" : "Default"}
          </label>
          <PreviewInput
            {...args}
            key={state + String(args.value)}
            id={"input-" + state}
            state={state}
            aria-invalid={state === "error" || undefined}
            aria-describedby={
              state === "error" ? "input-error-help" : undefined
            }
          />
          {state === "error" && (
            <p
              id="input-error-help"
              className="m-0 flex items-center gap-1.5 text-xs text-semantic-error-text"
            >
              <Info className="size-3.5" />
              Enter a valid email address.
            </p>
          )}
        </div>
      ))}
    </div>
  ),
};
export const Sizing: Story = {
  name: "Height and width",
  parameters: gallery(
    [],
    "Both fields stay 44px high and fill their containers. All input controls apply to both examples."
  ),
  render: (args) => (
    <div className="flex w-[420px] max-w-full flex-col items-start gap-6">
      {[420, 280].map((width) => (
        <div key={width} className="max-w-full space-y-2" style={{ width }}>
          <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
            44px height · {width}px container
          </p>
          <PreviewInput
            {...args}
            key={String(args.value)}
            aria-label={"Field in " + width + "px container"}
          />
        </div>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      ["state", "disabled"],
      "Rows fix the visual treatment; columns fix the interaction state. Text, type, read-only and check-icon controls apply across the matrix."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1000px] grid-cols-[100px_repeat(5,minmax(160px,1fr))] items-center gap-x-5 gap-y-5">
        <div />
        {STATE_COLUMNS.map((column) => (
          <div
            key={column.label}
            className="text-xs font-medium text-[var(--v2-text-muted,#707070)]"
          >
            {column.label}
          </div>
        ))}
        {STATES.map((state) => (
          <React.Fragment key={state}>
            <div className="text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {state === "error" ? "Error" : "Default"}
            </div>
            {STATE_COLUMNS.map((column) => (
              <PreviewInput
                {...args}
                key={column.label + String(args.value)}
                state={state}
                className={column.className}
                disabled={column.disabled}
                aria-label={state + " " + column.label}
                aria-invalid={state === "error" || undefined}
                data-v2-component="input"
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
      ["state", "disabled"],
      "The same text and native input props rendered in both versions. Rows fix the state being compared."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[700px] grid-cols-[100px_minmax(240px,1fr)_minmax(240px,1fr)] items-center gap-x-8 gap-y-5">
        <div />
        <div className="text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v1 (ui/input)
        </div>
        <div className="text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v2 (ui/v2/input)
        </div>
        {[
          { label: "Default", state: "default" as const },
          {
            label: "Focus",
            state: "default" as const,
            className: "pseudo-focus",
          },
          {
            label: "Error",
            state: "error" as const,
            className: "pseudo-focus",
          },
          { label: "Disabled", state: "default" as const, disabled: true },
        ].map(({ label, ...example }) => (
          <React.Fragment key={label}>
            <div className="text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {label}
            </div>
            <InputV1
              {...args}
              {...example}
              value={undefined}
              defaultValue={args.value}
              key={"v1" + String(args.value)}
              aria-label={"v1 " + label}
            />
            <PreviewInput
              {...args}
              {...example}
              key={"v2" + String(args.value)}
              aria-label={"v2 " + label}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
function NumericInputs(args: InputProps) {
  const decimals = args.allowDecimal ?? args.decimal;
  return (
    <div className="flex w-[420px] max-w-full flex-col gap-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div className="space-y-2">
        <label
          htmlFor="input-amount"
          className="text-sm font-medium text-[var(--v2-text-primary,#484848)]"
        >
          Amount
        </label>
        <PreviewInput
          {...args}
          key={"amount" + String(args.value)}
          id="input-amount"
          type="number"
        />
        <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
          {decimals ? "Decimals allowed." : "Whole numbers only."}{" "}
          {args.preventNumberExponent
            ? "Exponent notation is blocked."
            : "Exponent notation is allowed."}
        </p>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="input-count"
          className="text-sm font-medium text-[var(--v2-text-primary,#484848)]"
        >
          Number of agents
        </label>
        <PreviewInput
          {...args}
          key={"count" + String(args.value)}
          id="input-count"
          type="number"
          decimal={false}
          allowDecimal={false}
        />
        <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
          This field always accepts whole numbers only.
        </p>
      </div>
    </div>
  );
}
export const NumberInputs: Story = {
  name: "Number inputs",
  args: { type: "number", placeholder: "0" },
  parameters: gallery(
    ["type", "showCheckIcon"],
    "Both examples are number fields. Decimal controls apply to Amount; Number of agents stays an integer. Native spinner and exponent controls affect both."
  ),
  render: (args) => <NumericInputs {...args} />,
};
function WorkspaceName(args: InputProps) {
  const [saved, setSaved] = React.useState(false);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
      className="flex w-[420px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]"
    >
      <div>
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Workspace details
        </p>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
          Update the name used in your workspace.
        </p>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="input-workspace-name"
          className="text-sm font-medium text-[var(--v2-text-primary,#484848)]"
        >
          Workspace name
        </label>
        <Input
          {...args}
          id="input-workspace-name"
          onChange={(event) => {
            args.onChange?.(event);
            setSaved(false);
          }}
          required
          aria-invalid={args.state === "error" || undefined}
          aria-describedby="workspace-help"
        />
        <p
          id="workspace-help"
          className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
        >
          Use a name your team can recognize.
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-semantic-border-layout pt-4">
        <span
          className="text-xs text-[var(--v2-text-muted,#707070)]"
          role="status"
        >
          {saved ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5" />
              Saved in this example
            </span>
          ) : (
            "Changes are local to this example"
          )}
        </span>
        <Button type="submit" size="sm" disabled={args.disabled}>
          Save
        </Button>
      </div>
    </form>
  );
}
export const Usage: Story = {
  args: { value: "Customer support" },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <WorkspaceName
        {...args}
        onChange={(event) => {
          args.onChange?.(event);
          updateArgs({ value: event.target.value });
        }}
      />
    );
  },
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  parameters: {
    // Every args update re-runs Storybook's loaders; the default mock restore
    // would wipe the spy history in the middle of the play function.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Types into the field and checks the change action, the consecutive-space guard and clearing. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Example input" });

    await step("Clicking focuses the field", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();
    });

    await step("Typing updates the value and calls onChange", async () => {
      await userEvent.type(input, "Ada");
      await waitFor(() => expect(input).toHaveValue("Ada"));
      await expect(changeAction).toHaveBeenCalledTimes(3);
      await expect(changeAction).toHaveBeenLastCalledWith("Ada");
    });

    await step("A second space in a row is rejected", async () => {
      await userEvent.type(input, "  Lovelace");
      await waitFor(() => expect(input).toHaveValue("Ada Lovelace"));
    });

    await step("Clearing empties the field", async () => {
      await userEvent.clear(input);
      await waitFor(() => expect(input).toHaveValue(""));
      await expect(changeAction).toHaveBeenLastCalledWith("");
    });
  },
};
