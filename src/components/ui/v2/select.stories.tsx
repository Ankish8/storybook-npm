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
import { Check } from "lucide-react";
import { gallery } from "../../../storybook/v2-preview";
import * as V2 from "./select";
import * as V1 from "../select";
import { Button } from "./button";
import { v2ComponentDocs } from "./story-docs";

type Option = {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
};
type SelectExampleArgs = React.ComponentProps<typeof V2.Select> & {
  label: string;
  placeholder: string;
  state: "default" | "error";
  options: Option[];
  truncateOptionText: boolean;
  hideScrollButtons: boolean;
  position: "popper" | "item-aligned";
  width: number;
  onViewportScrollEnd?: (event: React.UIEvent<HTMLDivElement>) => void;
};
const OPTIONS: Option[] = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "api-key", label: "API Key" },
  { value: "oauth2", label: "OAuth 2.0" },
];
const GROUPED: Option[] = [
  { value: "agents", label: "Support agents", group: "People" },
  { value: "managers", label: "Managers", group: "People" },
  { value: "teams", label: "All teams", group: "Groups" },
  { value: "sales", label: "Sales team", group: "Groups" },
];
const STATES = ["default", "error"] as const;
const COLUMNS = [
  { label: "Default", disabled: false },
  { label: "Hover", disabled: false, className: "pseudo-hover" },
  { label: "Focus", disabled: false, className: "pseudo-focus" },
  { label: "Disabled", disabled: true },
  { label: "Disabled + hover", disabled: true, className: "pseudo-hover" },
] as const;

function SelectExample({
  label,
  placeholder,
  state,
  options,
  truncateOptionText,
  hideScrollButtons,
  position,
  width,
  onViewportScrollEnd,
  version = "v2",
  triggerClassName,
  triggerLabel,
  triggerDescriptionId,
  ...rootProps
}: SelectExampleArgs & {
  version?: "v1" | "v2";
  triggerClassName?: string;
  triggerLabel?: string;
  triggerDescriptionId?: string;
}) {
  const kit = version === "v1" ? V1 : V2;
  const id = React.useId();
  const validOptions = Array.isArray(options)
    ? options.filter(
        (option) =>
          option &&
          typeof option.value === "string" &&
          option.value.length > 0 &&
          typeof option.label === "string"
      )
    : [];
  const groups = Array.from(
    new Set(validOptions.map((option) => option.group || ""))
  );
  return (
    <div
      className="max-w-full space-y-1.5 font-[family-name:var(--font-v2,Inter,sans-serif)]"
      style={{ width }}
    >
      {label && (
        <label
          htmlFor={id}
          className={
            version === "v1"
              ? "text-sm font-medium text-semantic-text-secondary"
              : "text-sm font-medium text-[var(--v2-text-primary,#484848)]"
          }
        >
          {label}
        </label>
      )}
      <kit.Select {...rootProps}>
        <kit.SelectTrigger
          id={id}
          state={state}
          className={triggerClassName}
          aria-label={triggerLabel || (!label ? "Example select" : undefined)}
          aria-invalid={state === "error" || undefined}
          aria-describedby={triggerDescriptionId}
          data-v2-component="select"
          data-variant={state}
        >
          <kit.SelectValue placeholder={placeholder} />
        </kit.SelectTrigger>
        <kit.SelectContent
          position={position}
          truncateOptionText={truncateOptionText}
          hideScrollButtons={hideScrollButtons}
          onViewportScrollEnd={onViewportScrollEnd}
        >
          {groups.map((group, index) => (
            <React.Fragment key={group}>
              {index > 0 && <kit.SelectSeparator />}
              <kit.SelectGroup>
                {group && <kit.SelectLabel>{group}</kit.SelectLabel>}
                {validOptions
                  .filter((option) => (option.group || "") === group)
                  .map((option) => (
                    <kit.SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </kit.SelectItem>
                  ))}
              </kit.SelectGroup>
            </React.Fragment>
          ))}
          {validOptions.length === 0 && (
            <kit.SelectItem value="no-options" disabled>
              No options provided
            </kit.SelectItem>
          )}
        </kit.SelectContent>
      </kit.Select>
    </div>
  );
}
function PreviewSelect({
  value = "",
  onValueChange,
  onOpenChange,
  ...args
}: SelectExampleArgs & {
  version?: "v1" | "v2";
  triggerClassName?: string;
  triggerLabel?: string;
}) {
  const [selection, setSelection] = React.useState(value);
  return (
    <SelectExample
      {...args}
      open={undefined}
      value={selection}
      onOpenChange={onOpenChange}
      onValueChange={(next) => {
        setSelection(next);
        onValueChange?.(next);
      }}
    />
  );
}

const meta: Meta<SelectExampleArgs> = {
  title: "V2/Components/Select",
  component: V2.Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "value",
        "open",
        "disabled",
        "required",
        "label",
        "placeholder",
        "state",
        "options",
        "truncateOptionText",
        "hideScrollButtons",
        "position",
        "width",
        "onValueChange",
        "onOpenChange",
        "onViewportScrollEnd",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2118-22190",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "select",
          summary:
            "Composable Radix select primitives with keyboard navigation, grouped options, wrapped labels and viewport callbacks.",
          changes: [
            ["Trigger height and radius", "42px / 4px", "40px / 8px"],
            [
              "Typography",
              "Inherited font",
              "Inter 16px regular value and options",
            ],
            ["Focus", "Thin teal shadow", "#27ABB8 border and soft 4px shadow"],
            ["Error", "Red border", "Red border and soft 4px shadow"],
            ["Disabled", "Reduced opacity", "Solid grey surface and border"],
            ["Popup", "6px corners", "8px corners"],
            [
              "Behavior",
              "Radix keyboard navigation, scrolling, wrapped/truncated labels",
              "Same current props and behavior",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Value", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
            [
              "Placeholder",
              "--semantic-text-placeholder",
              "#A2A6B1",
              "#A2A6B1",
            ],
            ["Border", "--semantic-border-input", "#E9EAEB", "#E9EAEB"],
            ["Hover", "--color-primary-100", "#C0C3CA", "#C0C3CA"],
            ["Focus", "--color-secondary-600", "#27ABB8", "#27ABB8"],
            ["Error", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Disabled surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Selection check", "--semantic-brand", "#2BBCCA", "#2BBCCA"],
            ["Font", "--font-v2", "Inter 400"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            "Compose Select, SelectTrigger, SelectValue, SelectContent and SelectItem. Root `value`/`onValueChange` and `open`/`onOpenChange` can be controlled. Items wrap by default; `truncateOptionText` changes presentation without shortening the stored value. The labelled, options-driven playground is a story composition: label, options, width, state and content settings are not additional Select root props. For an options-driven shipped component, use SelectField.",
        }),
      },
    },
  },
  args: {
    value: "",
    open: false,
    disabled: false,
    required: false,
    label: "Authentication",
    placeholder: "Select a method",
    state: "default",
    options: OPTIONS,
    truncateOptionText: false,
    hideScrollButtons: false,
    position: "popper",
    width: 420,
    onValueChange: fn(),
    onOpenChange: fn(),
    onViewportScrollEnd: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <SelectExample
        {...args}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          updateArgs({ value });
        }}
        onOpenChange={(open) => {
          args.onOpenChange?.(open);
          updateArgs({ open });
        }}
      />
    );
  },
  argTypes: {
    value: {
      control: "text",
      description:
        "Live selected option value. Selection synchronizes this control.",
      table: { category: "Select" },
    },
    open: {
      control: "boolean",
      description:
        "Live popup state. Opening or closing synchronizes this control.",
      table: { category: "Select" },
    },
    disabled: { control: "boolean", table: { category: "Select" } },
    required: {
      control: "boolean",
      description: "Native required selection.",
      table: { category: "Select" },
    },
    label: {
      control: "text",
      description: "Visible label supplied by this composition.",
      table: { category: "Example" },
    },
    placeholder: { control: "text", table: { category: "SelectValue" } },
    state: {
      control: "select",
      options: STATES,
      table: { category: "SelectTrigger" },
    },
    options: {
      control: "object",
      description:
        "Example items: nonempty value, label, optional group and disabled flag.",
      table: { category: "Example" },
    },
    truncateOptionText: {
      control: "boolean",
      table: { category: "SelectContent" },
    },
    hideScrollButtons: {
      control: "boolean",
      table: { category: "SelectContent" },
    },
    position: {
      control: "select",
      options: ["popper", "item-aligned"],
      table: { category: "SelectContent" },
    },
    width: {
      control: { type: "number", min: 160, max: 700, step: 20 },
      description: "Example container width; trigger stays 40px high.",
      table: { category: "Example" },
    },
    defaultValue: {
      control: false,
      description: "Initial uncontrolled selection. Stories use live value.",
    },
    defaultOpen: { control: false },
    onValueChange: { control: false },
    onOpenChange: { control: false },
    onViewportScrollEnd: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Default: Story = {};
export const Error: Story = { args: { state: "error" } };
export const Disabled: Story = { args: { disabled: true, value: "bearer" } };
export const WithSelectedValue: Story = {
  name: "With selected value",
  args: { value: "bearer" },
};
export const WithGroups: Story = {
  name: "With groups",
  args: { label: "Routing", options: GROUPED, placeholder: "Select a group" },
};
export const WithDisabledItems: Story = {
  name: "With disabled items",
  args: {
    options: [
      ...OPTIONS,
      { value: "sso", label: "Single sign-on · unavailable", disabled: true },
    ],
  },
};
export const LongList: Story = {
  name: "Long list",
  args: {
    label: "Agent",
    options: Array.from({ length: 60 }, (_, i) => ({
      value: "agent-" + (i + 1),
      label: "Support agent " + (i + 1),
    })),
    placeholder: "Select an agent",
  },
};
export const LongOption: Story = {
  name: "Long option labels",
  args: {
    label: "Team",
    width: 280,
    options: [
      {
        value: "support",
        label:
          "Customer support team handling product questions and account requests",
      },
      {
        value: "sales",
        label:
          "Sales team handling enterprise plans and new customer onboarding",
      },
    ],
    placeholder: "Select a team",
  },
};
export const EmptyOptions: Story = {
  name: "Empty options",
  args: { options: [] },
};
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["state", "open"],
    "Compare default and error treatments. All other controls apply to both examples; selection and popup state are independent."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col gap-6">
      {STATES.map((state) => (
        <section key={state} className="space-y-2">
          <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
            {state === "error" ? "Error" : "Default"}
          </p>
          <PreviewSelect
            {...args}
            key={state + String(args.value)}
            state={state}
          />
        </section>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  name: "Height and width",
  parameters: gallery(
    ["width", "open"],
    "Select has one 40px height. These containers compare 420px and 280px widths; all other controls apply to both."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col gap-6">
      {[420, 280].map((width) => (
        <section key={width} className="space-y-2">
          <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
            40px height · {width}px container
          </p>
          <PreviewSelect {...args} key={String(args.value)} width={width} />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      ["state", "disabled", "open", "width"],
      "Rows fix the treatment and columns fix the interaction state. Label, placeholder, value, options and content controls apply across the contained grid."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1200px] grid-cols-[100px_repeat(5,minmax(200px,1fr))] items-center gap-x-5 gap-y-6">
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
            <p className="m-0 text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
              {state === "error" ? "Error" : "Default"}
            </p>
            {COLUMNS.map((column) => (
              <PreviewSelect
                {...args}
                key={column.label + String(args.value)}
                state={state}
                disabled={column.disabled}
                width={200}
                triggerClassName={
                  "className" in column ? column.className : undefined
                }
                triggerLabel={state + " " + column.label}
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
      ["state", "disabled", "open", "width", "value"],
      "Empty and selected triggers in default, error and disabled treatments. Labels, placeholders, options and content settings apply to both versions. Each sample opens and selects independently."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[850px] grid-cols-[120px_minmax(320px,1fr)_minmax(320px,1fr)] items-center gap-x-6 gap-y-5">
        <div />
        <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v1 · ui/select
        </p>
        <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
          v2 · ui/v2/select
        </p>
        {["default", "error", "disabled"].flatMap((state) =>
          [
            "",
            Array.isArray(args.options) ? args.options[0]?.value || "" : "",
          ].map((value, i) => (
            <React.Fragment key={state + i}>
              <p className="m-0 text-xs font-medium text-[var(--v2-text-secondary,#5E5E5E)]">
                {state}
                <span className="mt-1 block font-normal text-[var(--v2-text-muted,#707070)]">
                  {i ? "Selected" : "Placeholder"}
                </span>
              </p>
              {(["v1", "v2"] as const).map((version) => (
                <PreviewSelect
                  {...args}
                  key={version + value}
                  version={version}
                  value={value}
                  state={state === "error" ? "error" : "default"}
                  disabled={state === "disabled"}
                  width={320}
                  triggerLabel={
                    version +
                    " " +
                    state +
                    " " +
                    (i ? "Selected" : "Placeholder")
                  }
                />
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  ),
};
function AuthenticationForm(args: SelectExampleArgs) {
  const errorId = React.useId();
  const [savedValue, setSavedValue] = React.useState<string | null>(null);
  const [invalid, setInvalid] = React.useState(false);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!args.value) {
          setInvalid(true);
          return;
        }
        setInvalid(false);
        setSavedValue(args.value);
      }}
      className="flex w-[480px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]"
    >
      <div>
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Webhook authentication
        </p>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
          Choose a method for this local example.
        </p>
      </div>
      <SelectExample
        {...args}
        width={Math.min(args.width, 430)}
        state={invalid ? "error" : args.state}
        triggerDescriptionId={invalid ? errorId : undefined}
        onValueChange={(value) => {
          setInvalid(false);
          setSavedValue(null);
          args.onValueChange?.(value);
        }}
      />
      {invalid && (
        <p id={errorId} className="m-0 text-xs text-semantic-error-text">
          Choose an authentication method.
        </p>
      )}
      <div className="flex items-center justify-between gap-4 border-t border-semantic-border-layout pt-4">
        <span
          role="status"
          className="text-xs text-[var(--v2-text-muted,#707070)]"
        >
          {savedValue && savedValue === args.value ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5" />
              Saved in this example
            </span>
          ) : (
            "Changes stay in this example"
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
  parameters: gallery(
    [],
    "A working local form with selection, validation and save feedback. Value and open state stay synchronized with Controls. All exposed controls apply to the composed Select."
  ),
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <AuthenticationForm
        {...args}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          updateArgs({ value });
        }}
        onOpenChange={(open) => {
          args.onOpenChange?.(open);
          updateArgs({ open });
        }}
      />
    );
  },
};
export const AuthenticationExample: Story = {
  ...Usage,
  name: "Authentication example",
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: {
    options: [
      ...OPTIONS,
      { value: "sso", label: "Single sign-on · unavailable", disabled: true },
    ],
  },
  parameters: {
    // Live-synced args re-render the story, and every render resets the spies.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Opens the list with a click, picks an option, then reopens it to pick another while a disabled option stays unavailable. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    const t0 = performance.now();
    clearAllMocks();
    const trigger = within(canvasElement).getByRole("combobox", {
      name: "Authentication",
    });
    const body = within(canvasElement.ownerDocument.body);
    const user = userEvent.setup();

    await step("A click opens the list", async () => {
      await user.pointer({ keys: "[MouseLeft>]", target: trigger });
      await expect(await body.findAllByRole("option")).toHaveLength(6);
      await user.pointer({ keys: "[/MouseLeft]" });
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(args.onOpenChange).toHaveBeenCalledTimes(1);
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    });

    await step(
      "Choosing an option commits it and closes the list",
      async () => {
        await userEvent.click(
          body.getByRole("option", { name: "Bearer Token" })
        );
        await expect(args.onValueChange).toHaveBeenCalledTimes(1);
        await expect(args.onValueChange).toHaveBeenLastCalledWith("bearer");
        await waitFor(() =>
          expect(body.queryByRole("listbox")).not.toBeInTheDocument()
        );
        await expect(trigger).toHaveTextContent("Bearer Token");
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
      }
    );

    await step(
      "The chosen option is marked; a disabled one is unavailable",
      async () => {
        await user.pointer({ keys: "[MouseLeft>]", target: trigger });
        await body.findByRole("listbox");
        await user.pointer({ keys: "[/MouseLeft]" });
        const chosen = await body.findByRole("option", {
          name: "Bearer Token",
        });
        await expect(chosen).toHaveAttribute("data-state", "checked");
        const unavailable = body.getByRole("option", { name: /unavailable/ });
        await expect(unavailable).toHaveAttribute("aria-disabled", "true");
        await userEvent.click(body.getByRole("option", { name: "OAuth 2.0" }));
        await expect(args.onValueChange).toHaveBeenCalledTimes(2);
        await expect(args.onValueChange).toHaveBeenLastCalledWith("oauth2");
        await waitFor(() => expect(trigger).toHaveTextContent("OAuth 2.0"));
      }
    );
    console.warn("PLAYMS " + Math.round(performance.now() - t0));
  },
};
