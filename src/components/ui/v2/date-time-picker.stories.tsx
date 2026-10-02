import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { gallery } from "../../../storybook/v2-preview";
import {
  DateTimePicker,
  type DateTimePickerProps,
  type DateTimePickerValue,
} from "./date-time-picker";
import { DateTimePicker as DateTimePickerV1 } from "../date-time-picker";
import { Button } from "./button";
import { v2ComponentDocs } from "./story-docs";

type SerializedValue = { date?: string; startTime?: string; endTime?: string };
type Args = Omit<DateTimePickerProps, "value" | "minDate" | "maxDate"> & {
  value: SerializedValue;
  minDate: string;
  maxDate: string;
};
const VARIANTS = ["date-time", "date-only", "time-only"] as const;
const SIZES = ["sm", "default", "lg"] as const;
const STATES = ["default", "error"] as const;
const COLUMNS = [
  { label: "Default", disabled: false, className: "" },
  { label: "Hover", disabled: false, className: "pseudo-hover-all" },
  { label: "Focus", disabled: false, className: "pseudo-focus-within-all" },
  { label: "Disabled", disabled: true, className: "" },
  { label: "Disabled + hover", disabled: true, className: "pseudo-hover-all" },
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
function serialize(value: DateTimePickerValue): SerializedValue {
  return {
    date: dateText(value.date),
    startTime: value.startTime,
    endTime: value.endTime,
  };
}
function Example({
  value,
  minDate,
  maxDate,
  version = "v2",
  ...props
}: Args & { version?: "v1" | "v2" }) {
  const Component = version === "v1" ? DateTimePickerV1 : DateTimePicker;
  return (
    <Component
      {...props}
      value={{
        date: dateFor(value?.date),
        startTime: typeof value?.startTime === "string" ? value.startTime : "",
        endTime: typeof value?.endTime === "string" ? value.endTime : "",
      }}
      minDate={dateFor(minDate)}
      maxDate={dateFor(maxDate)}
    />
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
  ...args
}: Args & { version?: "v1" | "v2" }) {
  const [selection, setSelection] = React.useState(value);
  return (
    <Example
      {...args}
      open={undefined}
      value={selection}
      onValueChange={(next) => {
        setSelection(serialize(next));
        onValueChange?.(next);
      }}
    />
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/DateTimePicker",
  component: Example,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2185-14049",
    },
    layout: "padded",
    controls: {
      include: [
        "value",
        "open",
        "variant",
        "size",
        "state",
        "label",
        "required",
        "helperText",
        "error",
        "placeholder",
        "disabled",
        "readOnly",
        "showEndTime",
        "showSeconds",
        "minuteStep",
        "secondStep",
        "showClear",
        "closeOnSelect",
        "startTimeLabel",
        "endTimeLabel",
        "minDate",
        "maxDate",
        "disablePastDates",
        "name",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "date-time-picker",
          summary:
            "A typed date/time field with calendar and time-column selection. The recorded v2 input family applies to its field; existing calendar, time layout and parsing behavior are preserved.",
          changes: [
            [
              "Field dimensions",
              "36px small / 42px default and large; 4px corners",
              "40px field in all width sizes; 8px corners; 16px horizontal padding",
            ],
            ["Width sizes", "280px / 336px / 360px", "Preserved"],
            [
              "Type",
              "Inherited type",
              "Inter 16px values; label 14px / 500; supporting text 12px",
            ],
            ["Hover", "Old teal stroke", "C0C3CA border"],
            [
              "Focus and open",
              "Thin teal highlight",
              "27ABB8 border and soft 4px halo",
            ],
            [
              "Error",
              "Red border and 14px message",
              "F04438 border and halo; B42318 12px message",
            ],
            [
              "Disabled",
              "Muted field",
              "Solid grey field; grey border; no halo",
            ],
            [
              "Parsing and selection",
              "Segment typing, date/time modes, range limits, portals and clearing",
              "Preserved; precise calendar/time inner dimensions remain unverified",
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
            ["Error message", "--semantic-error-text", "#B42318", "#B42318"],
            ["Family", "--font-v2", "Inter"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            "Controls serialize the Date object into a YYYY-MM-DD string; the adapter converts it back to a local Date before passing value, minDate and maxDate. Typed edits, selection, clearing and open state synchronize in Controls. Sizes control field width, with a shared 40px v2 height. Figma could not verify precise calendar day geometry, time-column dimensions and inner popover spacing, which retain current v1 values.",
        }),
      },
    },
  },
  argTypes: {
    value: {
      control: "object",
      description:
        "Serialized {date:YYYY-MM-DD,startTime:HH:mm:ss,endTime:HH:mm:ss}; actual component receives a Date object.",
    },
    open: { control: "boolean" },
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: SIZES },
    state: { control: "select", options: STATES },
    label: { control: "text" },
    required: { control: "boolean" },
    helperText: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    showEndTime: { control: "boolean" },
    showSeconds: { control: "boolean" },
    minuteStep: { control: { type: "number", min: 1, max: 30 } },
    secondStep: { control: { type: "number", min: 1, max: 30 } },
    showClear: { control: "boolean" },
    closeOnSelect: { control: "boolean" },
    startTimeLabel: { control: "text" },
    endTimeLabel: { control: "text" },
    minDate: {
      control: "text",
      description: "YYYY-MM-DD or empty for no bound.",
    },
    maxDate: {
      control: "text",
      description: "YYYY-MM-DD or empty for no bound.",
    },
    disablePastDates: { control: "boolean" },
    name: { control: "text" },
    onValueChange: { control: false },
    onOpenChange: { control: false },
  },
  args: {
    value: { date: "2026-10-07", startTime: "10:30:00", endTime: "11:30:00" },
    open: false,
    variant: "date-time",
    size: "default",
    state: "default",
    label: "Appointment",
    required: false,
    helperText: "Choose a date and start time.",
    error: "",
    placeholder: "--/--/---- --:-- --",
    disabled: false,
    readOnly: false,
    showEndTime: false,
    showSeconds: false,
    minuteStep: 5,
    secondStep: 5,
    showClear: true,
    closeOnSelect: false,
    startTimeLabel: "Start Time",
    endTimeLabel: "End Time",
    minDate: "",
    maxDate: "",
    disablePastDates: false,
    name: "appointment",
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  render: function Render(args) {
    return (
      <div className="min-h-[560px] pt-4">
        <Example {...useLiveArgs(args)} />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<Args>;
export const Overview: Story = {};
export const Empty: Story = { args: { value: {} } };
export const DateOnly: Story = {
  args: {
    variant: "date-only",
    placeholder: "--/--/----",
    helperText: "Choose a date.",
  },
};
export const TimeOnly: Story = {
  args: {
    variant: "time-only",
    placeholder: "--:-- --",
    helperText: "Choose a start time.",
  },
};
export const TimeRange: Story = {
  args: {
    variant: "time-only",
    showEndTime: true,
    placeholder: "--:-- --",
    helperText: "Choose a start and end time.",
  },
};
export const WithSeconds: Story = {
  args: {
    showSeconds: true,
    secondStep: 5,
    value: { date: "2026-10-07", startTime: "10:30:15", endTime: "11:30:45" },
  },
};
export const Error: Story = {
  args: { error: "Choose a valid appointment.", value: {} },
};
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const DateBounds: Story = {
  args: { minDate: "2026-10-05", maxDate: "2026-10-20" },
};
export const PastDatesDisabled: Story = { args: { disablePastDates: true } };
export const PartialValue: Story = {
  args: {
    value: { date: "2026-10-07", startTime: "", endTime: "" },
    helperText:
      "A selected date keeps the missing-time mask until a time is chosen.",
  },
};
export const AllVariants: Story = {
  parameters: gallery(
    ["variant", "open"],
    "All three modes. Other Controls update all fields; each sample’s value can be edited independently."
  ),
  render: (args) => (
    <div className="min-h-[560px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Picker modes
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          Date and time, date only, and time only.
        </p>
      </header>
      <div className="flex flex-wrap gap-6">
        {VARIANTS.map((variant) => (
          <section key={variant} className="space-y-3">
            <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
              {variant}
            </p>
            <Preview
              {...args}
              key={`${variant}-${JSON.stringify(args.value)}`}
              variant={variant}
              placeholder={
                variant === "date-only"
                  ? "--/--/----"
                  : variant === "time-only"
                    ? "--:-- --"
                    : args.placeholder
              }
            />
          </section>
        ))}
      </div>
    </div>
  ),
};
export const AllSizes: Story = {
  parameters: gallery(
    ["size", "open"],
    "All width sizes: 280px, 336px and 360px. Each v2 field is 40px high."
  ),
  render: (args) => (
    <div className="min-h-[560px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Width sizes
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          Sizes preserve the public width API and share one v2 field height.
        </p>
      </header>
      <div className="flex flex-wrap gap-6">
        {SIZES.map((size) => (
          <section key={size} className="space-y-3">
            <p className="m-0 text-xs font-medium text-[var(--v2-text-muted,#707070)]">
              {size} · {size === "sm" ? 280 : size === "lg" ? 360 : 336}px wide
            </p>
            <Preview
              {...args}
              key={`${size}-${JSON.stringify(args.value)}`}
              size={size}
            />
          </section>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["variant", "state", "disabled", "open", "error"],
    "Every mode × validation × interaction state. Size remains editable and applies across the matrix; disabled removes focus/error halos."
  ),
  render: (args) => (
    <div className="w-full min-h-[560px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Interaction states
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          Choose a width size in Controls. The grid scrolls within the canvas.
        </p>
      </header>
      <div className="w-full overflow-x-auto">
        <div
          style={{ width: 2100 }}
          className="grid grid-cols-[180px_repeat(5,360px)] gap-6"
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
          {VARIANTS.flatMap((variant) =>
            STATES.map((state) => (
              <React.Fragment key={`${variant}-${state}`}>
                <p className="m-0 pt-6 text-sm font-medium text-[var(--v2-text-primary,#484848)]">
                  {variant} · {state}
                </p>
                {COLUMNS.map((column) => (
                  <Preview
                    {...args}
                    key={`${variant}-${state}-${column.label}-${JSON.stringify(args.value)}`}
                    variant={variant}
                    placeholder={
                      variant === "date-only"
                        ? "--/--/----"
                        : variant === "time-only"
                          ? "--:-- --"
                          : args.placeholder
                    }
                    state={state}
                    error={state === "error" ? "Choose a valid value." : ""}
                    disabled={column.disabled}
                    label={`${variant} ${state} ${column.label}`}
                    className={column.className}
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
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    ["variant", "state", "disabled", "error", "size", "open"],
    "All modes in default, error and disabled states, at every width size, in both versions. Value and host text Controls apply throughout."
  ),
  render: (args) => (
    <div className="w-full min-h-[560px] space-y-5">
      <header className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          v1 and v2
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          Field styling changes; calendar/time geometry and parsing remain
          compatible.
        </p>
      </header>
      <div className="w-full overflow-x-auto">
        <div
          style={{ width: 980 }}
          className="grid grid-cols-[180px_360px_360px] gap-6"
        >
          <span />
          <p className="m-0 text-sm font-medium text-[var(--v2-text-primary,#484848)]">
            v1
          </p>
          <p className="m-0 text-sm font-medium text-[var(--v2-text-primary,#484848)]">
            v2
          </p>
          {VARIANTS.flatMap((variant) =>
            SIZES.flatMap((size) =>
              ["default", "error", "disabled"].map((treatment) => (
                <React.Fragment key={`${variant}-${size}-${treatment}`}>
                  <p className="m-0 pt-6 text-xs text-[var(--v2-text-muted,#707070)]">
                    {variant} · {size} · {treatment}
                  </p>
                  {(["v1", "v2"] as const).map((version) => (
                    <Preview
                      {...args}
                      key={`${version}-${variant}-${size}-${treatment}-${JSON.stringify(args.value)}`}
                      version={version}
                      variant={variant}
                      placeholder={
                        variant === "date-only"
                          ? "--/--/----"
                          : variant === "time-only"
                            ? "--:-- --"
                            : args.placeholder
                      }
                      size={size}
                      state={treatment === "error" ? "error" : "default"}
                      error={
                        treatment === "error" ? "Choose a valid value." : ""
                      }
                      disabled={treatment === "disabled"}
                    />
                  ))}
                </React.Fragment>
              ))
            )
          )}
        </div>
      </div>
    </div>
  ),
};
function AppointmentForm(args: Args) {
  const [submitted, setSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState("");
  const hasDate = !!dateFor(args.value?.date),
    hasTime = !!args.value?.startTime;
  const complete =
    args.variant === "date-only"
      ? hasDate
      : args.variant === "time-only"
        ? hasTime
        : hasDate && hasTime;
  return (
    <form
      noValidate
      className="min-h-[560px] max-w-[560px] space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        setSaved(
          complete
            ? `Appointment saved: ${args.value?.date || ""} ${args.value?.startTime || ""}`.trim()
            : ""
        );
      }}
    >
      <header className="space-y-1">
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Schedule a call
        </p>
        <p className="m-0 text-sm text-[var(--v2-text-muted,#707070)]">
          Set an appointment in this local example.
        </p>
      </header>
      <Example
        {...args}
        error={
          submitted && !complete
            ? "Complete the appointment field."
            : args.error
        }
        onValueChange={(value) => {
          args.onValueChange?.(value);
          setSubmitted(false);
          setSaved("");
        }}
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={args.disabled || args.readOnly}>
          Save appointment
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={args.disabled || args.readOnly}
          onClick={() => {
            args.onValueChange?.({
              date: undefined,
              startTime: "",
              endTime: "",
            });
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
  args: { required: true, value: {} },
  parameters: {
    docs: {
      description: {
        story:
          "A working local scheduling form with validation, synchronized typing and selection, save feedback, and clearing. No network request is made.",
      },
    },
  },
  render: function Render(args) {
    return <AppointmentForm {...useLiveArgs(args)} />;
  },
};
