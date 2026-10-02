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
import { gallery } from "../../../storybook/v2-preview";
import {
  DateRangePicker,
  type DateRangePickerProps,
  type DateRangeValue,
  type DateRangePreset,
} from "./date-range-picker";
import { DateRangePicker as DateRangePickerV1 } from "../date-range-picker";
import { Button } from "./button";
import { v2ComponentDocs } from "./story-docs";

type SerializedRange = { start?: string; end?: string };
type Args = Omit<
  DateRangePickerProps,
  "value" | "minDate" | "maxDate" | "presets"
> & {
  value: SerializedRange;
  minDate: string;
  maxDate: string;
  presetMode: "default" | "none" | "custom";
  label: string;
  helperText: string;
  errorMessage: string;
  width: number;
};
const VARIANTS = ["default", "error"] as const;
const COLUMNS = [
  { label: "Default", disabled: false, className: "" },
  { label: "Hover", disabled: false, className: "pseudo-hover" },
  { label: "Focus", disabled: false, className: "pseudo-focus" },
  { label: "Disabled", disabled: true, className: "" },
  { label: "Disabled + hover", disabled: true, className: "pseudo-hover" },
] as const;
function dateFor(value?: string) {
  if (!value || typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : undefined;
}
function dateText(date?: Date) {
  return date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";
}
function serialize(value: DateRangeValue): SerializedRange {
  return { start: dateText(value.start), end: dateText(value.end) };
}
const CUSTOM_PRESETS: DateRangePreset[] = [
  {
    label: "October launch",
    getRange: () => ({
      start: new Date(2026, 9, 1),
      end: new Date(2026, 9, 7),
    }),
  },
  {
    label: "October review",
    getRange: () => ({
      start: new Date(2026, 9, 15),
      end: new Date(2026, 9, 21),
    }),
  },
];
function Example({
  value,
  minDate,
  maxDate,
  presetMode,
  label,
  helperText,
  errorMessage,
  width,
  version = "v2",
  ...props
}: Args & { version?: "v1" | "v2" }) {
  const id = React.useId();
  const Component = version === "v1" ? DateRangePickerV1 : DateRangePicker;
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
          className={
            version === "v1"
              ? "m-0 text-sm font-medium text-semantic-text-secondary"
              : "m-0 text-sm font-medium text-[var(--v2-text-primary,#484848)]"
          }
        >
          {label}
        </p>
      )}
      <Component
        {...props}
        value={{ start: dateFor(value?.start), end: dateFor(value?.end) }}
        minDate={dateFor(minDate)}
        maxDate={dateFor(maxDate)}
        presets={
          presetMode === "none"
            ? []
            : presetMode === "custom"
              ? CUSTOM_PRESETS
              : undefined
        }
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-label={!label ? "Example date range" : undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && (
        <p
          id={`${id}-hint`}
          className={
            props.state === "error" && !props.disabled
              ? "m-0 text-xs text-semantic-error-text"
              : version === "v1"
                ? "m-0 text-xs text-semantic-text-muted"
                : "m-0 text-xs text-[var(--v2-text-muted,#707070)]"
          }
        >
          {hint}
        </p>
      )}
    </div>
  );
}
function useLiveArgs(args: Args): Args {
  const [, updateArgs] = useArgs<Args>();
  return {
    ...args,
    onValueChange: (value) => {
      updateArgs({ value: serialize(value) });
      args.onValueChange?.(value);
    },
    onOpenChange: (open) => {
      updateArgs({ open });
      args.onOpenChange?.(open);
    },
  };
}
function Preview({
  value,
  open: _open,
  onValueChange,
  onOpenChange,
  ...args
}: Args & { version?: "v1" | "v2" }) {
  const [selection, setSelection] = React.useState(value);
  return (
    <Example
      {...args}
      value={selection}
      open={undefined}
      onValueChange={(next) => {
        setSelection(serialize(next));
        onValueChange?.(next);
      }}
      onOpenChange={onOpenChange}
    />
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/DateRangePicker",
  component: Example,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=3217-27914",
    },
    layout: "padded",
    controls: {
      include: [
        "value",
        "open",
        "state",
        "disabled",
        "placeholder",
        "clearable",
        "clearLabel",
        "minDate",
        "maxDate",
        "disablePastDates",
        "presetMode",
        "label",
        "helperText",
        "errorMessage",
        "width",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "date-range-picker",
          summary:
            "Choose a preset or a start and end date. The recorded v2 input-family treatment is applied to the trigger; the existing calendar layout and behavior are retained.",
          changes: [
            [
              "Trigger",
              "40px height / 4px corners / 14px type",
              "40px height / 8px corners / Inter 16px",
            ],
            ["Host text", "Host styling", "14px / 500 label; 12px helper"],
            ["Hover", "Old teal stroke", "C0C3CA border"],
            [
              "Focus and open",
              "Thin teal highlight",
              "27ABB8 and soft 4px halo",
            ],
            ["Error", "Red border", "F04438 border and soft halo"],
            [
              "Disabled",
              "50% opacity",
              "Solid grey surface; grey border; no halo",
            ],
            [
              "Range behavior",
              "Presets, limits, month/year navigation, clearing and portals",
              "Preserved; inner calendar dimensions remain unverified",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Disabled surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Value", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
            ["Label", "--v2-text-primary", "#484848", "#484848"],
            ["Helper", "--semantic-text-muted", "#717680", "#717680"],
            ["Border", "--semantic-border-input", "#E9EAEB", "#E9EAEB"],
            ["Hover", "--color-primary-100", "#C0C3CA"],
            ["Focus", "--color-secondary-600", "#27ABB8"],
            ["Error", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Error text", "--semantic-error-text", "#B42318"],
            ["Family", "--font-v2", "Inter"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            "Controls serialize Date values as YYYY-MM-DD strings; the example converts them to local Date objects before passing the public value/minDate/maxDate props. Selection and open state synchronize in Controls. Label, helper, width and presetMode are host example settings. Figma could not verify calendar grid/day dimensions and inner popover spacing; those retain v1 values.",
        }),
      },
    },
  },
  argTypes: {
    value: {
      control: "object",
      description:
        "Date values serialized as {start: YYYY-MM-DD, end: YYYY-MM-DD} for editable Controls.",
    },
    open: { control: "boolean" },
    state: { control: "select", options: VARIANTS },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    clearable: { control: "boolean" },
    clearLabel: { control: "text" },
    minDate: {
      control: "text",
      description: "YYYY-MM-DD or empty for no lower bound.",
    },
    maxDate: {
      control: "text",
      description: "YYYY-MM-DD or empty for no upper bound.",
    },
    disablePastDates: { control: "boolean" },
    presetMode: {
      control: "radio",
      options: ["default", "none", "custom"],
      table: { category: "Example" },
    },
    label: { control: "text", table: { category: "Example" } },
    helperText: { control: "text", table: { category: "Example" } },
    errorMessage: { control: "text", table: { category: "Example" } },
    width: {
      control: { type: "number", min: 240, max: 700 },
      table: { category: "Example" },
    },
    onValueChange: { control: false },
    onOpenChange: { control: false },
    onClear: { control: false },
  },
  args: {
    value: { start: "2026-10-01", end: "2026-10-07" },
    open: false,
    state: "default",
    disabled: false,
    placeholder: "Choose a date range",
    clearable: true,
    clearLabel: "Clear date range",
    minDate: "",
    maxDate: "",
    disablePastDates: false,
    presetMode: "default",
    label: "Report period",
    helperText: "Choose the period to include in the report.",
    errorMessage: "Choose a start and end date.",
    width: 420,
    onValueChange: fn(),
    onOpenChange: fn(),
    onClear: fn(),
  },
  render: function Render(args) {
    return (
      <div className="min-h-[520px] pt-4">
        <Example {...useLiveArgs(args)} />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<Args>;
export const Overview: Story = {};
export const Empty: Story = { args: { value: {} } };
export const Error: Story = { args: { state: "error", value: {} } };
export const Disabled: Story = { args: { disabled: true } };
export const NoPresets: Story = { args: { presetMode: "none" } };
export const CustomPresets: Story = { args: { presetMode: "custom" } };
export const DateBounds: Story = {
  args: {
    minDate: "2026-10-05",
    maxDate: "2026-10-20",
    value: { start: "2026-10-07", end: "2026-10-10" },
  },
};
export const PastDatesDisabled: Story = {
  args: { disablePastDates: true, value: {} },
};
export const PartialRange: Story = {
  args: {
    value: { start: "2026-10-01" },
    helperText:
      "The trigger also supports a partial externally controlled range.",
  },
};
export const AllVariants: Story = {
  parameters: gallery(
    ["state", "open"],
    "Both validation variants, with independently editable calendar values. Shared Controls apply before the variant axis."
  ),
  render: (args) => (
    <div className="min-h-[540px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Validation variants
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          The calendar behavior is the same in both variants.
        </p>
      </header>
      <div className="flex flex-wrap gap-6">
        {VARIANTS.map((state) => (
          <section key={state} className="space-y-3">
            <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
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
    ["width", "open"],
    "One recorded 40px field height, shown at two widths."
  ),
  render: (args) => (
    <div className="min-h-[540px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Field proportions
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          40px high with 8px corners.
        </p>
      </header>
      <div className="flex flex-wrap gap-6">
        {[420, 280].map((width) => (
          <section key={width} className="space-y-3">
            <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
              {width}px wide
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
  parameters: gallery(
    ["state", "disabled", "open", "width"],
    "Complete trigger variants × state matrix. Calendars are functional; forced CSS pseudo states keep the interaction treatments visible together."
  ),
  render: (args) => (
    <div className="w-full min-h-[540px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Interaction states
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          The wide comparison remains within the canvas.
        </p>
      </header>
      <div className="w-full overflow-x-auto">
        <div
          style={{ width: 1370 }}
          className="grid grid-cols-[100px_repeat(5,238px)] gap-4"
        >
          <span />
          {COLUMNS.map((column) => (
            <p
              key={column.label}
              className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]"
            >
              {column.label}
            </p>
          ))}
          {VARIANTS.map((state) => (
            <React.Fragment key={state}>
              <p className="m-0 pt-6 text-sm font-medium text-[var(--v2-text-primary,#484848)]">
                {state}
              </p>
              {COLUMNS.map((column) => (
                <Preview
                  {...args}
                  key={`${state}-${column.label}-${JSON.stringify(args.value)}`}
                  state={state}
                  disabled={column.disabled}
                  width={238}
                  triggerClassName={column.className}
                  label={`${state} ${column.label}`}
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
  parameters: gallery(
    ["state", "disabled", "value", "width", "open"],
    "Default, error and disabled triggers in both versions, with empty and selected values. Host text Controls apply to all samples."
  ),
  render: (args) => (
    <div className="w-full min-h-[540px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          v1 and v2
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          The range selection and calendar layout remain compatible.
        </p>
      </header>
      <div className="w-full overflow-x-auto">
        <div
          style={{ width: 870 }}
          className="grid grid-cols-[160px_320px_320px] gap-6"
        >
          <span />
          <p className="m-0 text-sm font-medium text-[var(--v2-text-primary,#484848)]">
            v1
          </p>
          <p className="m-0 text-sm font-medium text-[var(--v2-text-primary,#484848)]">
            v2
          </p>
          {["default", "error", "disabled"].flatMap((treatment) =>
            [{}, { start: "2026-10-01", end: "2026-10-07" }].map(
              (value, index) => (
                <React.Fragment key={`${treatment}-${index}`}>
                  <p className="m-0 pt-6 text-xs text-[var(--v2-text-muted,#707070)]">
                    {treatment} · {index ? "selected" : "empty"}
                  </p>
                  {(["v1", "v2"] as const).map((version) => (
                    <Preview
                      {...args}
                      key={`${version}-${treatment}-${index}`}
                      version={version}
                      width={320}
                      value={value}
                      state={treatment === "error" ? "error" : "default"}
                      disabled={treatment === "disabled"}
                    />
                  ))}
                </React.Fragment>
              )
            )
          )}
        </div>
      </div>
    </div>
  ),
};
function RangeForm(args: Args) {
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState("");
  const complete = !!dateFor(args.value?.start) && !!dateFor(args.value?.end);
  return (
    <form
      noValidate
      className="min-h-[540px] max-w-[560px] space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        setSaved(
          complete
            ? `Report period saved: ${args.value.start} to ${args.value.end}`
            : ""
        );
      }}
    >
      <header className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Export a report
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          Choose the reporting period for this local example.
        </p>
      </header>
      <Example
        {...args}
        state={submitted && !complete ? "error" : args.state}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          setSubmitted(false);
          setSaved("");
        }}
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={args.disabled}>
          Save period
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={args.disabled}
          onClick={() => {
            args.onValueChange?.({});
            setSubmitted(false);
            setSaved("");
          }}
        >
          Clear
        </Button>
      </div>
      {saved && (
        <p role="status" className="m-0 text-sm text-semantic-success-text">
          {saved}
        </p>
      )}
    </form>
  );
}
export const Usage: Story = {
  args: { value: {} },
  render: function Render(args) {
    return <RangeForm {...useLiveArgs(args)} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "A local report form. Save a complete range; clear it and submit to see accessible validation. No network request is made.",
      },
    },
  },
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: { presetMode: "custom" },
  parameters: {
    // Selections call updateArgs, which re-renders the story, and Storybook
    // restores (clears) all spies on each render. Keep their history instead.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Picks ranges, clears and applies a preset in fixed October 2026 dates. It ends on the initial range so it can be replayed. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Report period" });
    const open = async () => {
      await userEvent.click(trigger);
      return body.findByRole("dialog");
    };
    const pick = (scope: HTMLElement, name: string) =>
      userEvent.click(within(scope).getByRole("button", { name }));
    const closed = () =>
      waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());
    const october = (start: number, end: number) => ({
      start: new Date(2026, 9, start),
      end: new Date(2026, 9, end),
    });

    await step("Two clicks pick a range, commit once and close", async () => {
      await expect(trigger).toHaveTextContent("1 Oct 2026 - 7 Oct 2026");
      const calendar = await open();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
      await pick(calendar, "October 12, 2026");
      await expect(args.onValueChange).not.toHaveBeenCalled();
      await pick(calendar, "October 20, 2026");
      await expect(args.onValueChange).toHaveBeenCalledTimes(1);
      await expect(args.onValueChange).toHaveBeenCalledWith(october(12, 20));
      await closed();
      await expect(trigger).toHaveTextContent("12 Oct 2026 - 20 Oct 2026");
      await expect(trigger).toHaveFocus();
    });

    await step(
      "Choosing the end first still gives an ordered range",
      async () => {
        const calendar = await open();
        await pick(calendar, "October 25, 2026");
        await pick(calendar, "October 14, 2026");
        await expect(args.onValueChange).toHaveBeenLastCalledWith(
          october(14, 25)
        );
        await closed();
      }
    );

    await step(
      "Clear empties the range without opening the calendar",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Clear date range" })
        );
        await expect(args.onClear).toHaveBeenCalledTimes(1);
        await expect(args.onValueChange).toHaveBeenLastCalledWith({});
        await expect(trigger).toHaveTextContent("Choose a date range");
        await expect(body.queryByRole("dialog")).not.toBeInTheDocument();
      }
    );

    await step("A preset commits its fixed range", async () => {
      await pick(await open(), "October launch");
      await expect(args.onValueChange).toHaveBeenLastCalledWith(october(1, 7));
      await closed();
      await expect(trigger).toHaveTextContent("1 Oct 2026 - 7 Oct 2026");
    });
  },
};

export const Probe: Story = {
  ...Interaction,
  play: async (ctx) => {
    const w = window as unknown as { __probeErr?: string };
    if (w.__probeErr)
      throw new globalThis.Error("PROBE earlier: " + w.__probeErr);
    try {
      await Interaction.play!(ctx);
    } catch (e) {
      w.__probeErr = String((e as { message: string }).message)
        // eslint-disable-next-line no-control-regex -- Strip ANSI escapes from probe errors.
        .replace(/\u001b\[[0-9;]*m/g, "")
        .slice(0, 280);
      throw e;
    }
  },
};
