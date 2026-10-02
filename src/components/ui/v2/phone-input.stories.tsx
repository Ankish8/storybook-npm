import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Check } from "lucide-react";
import { PhoneInput, type PhoneInputProps } from "./phone-input";
import { PhoneInput as PhoneInputV1 } from "../phone-input";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

const changeAction = fn<(value: string) => void>().mockName("onChange");

type Args = PhoneInputProps & {
  label: string;
  helperText: string;
  customFlag: string;
  width: number;
};
const COUNTRIES = [
  { iso: "IN", code: "+91", label: "India" },
  { iso: "US", code: "+1", label: "United States" },
  { iso: "GB", code: "+44", label: "United Kingdom" },
  { iso: "AU", code: "+61", label: "Australia" },
];
const VARIANTS = ["default", "empty", "error"] as const;
const COLUMNS = [
  { label: "Default", disabled: false },
  { label: "Hover", disabled: false, className: "pseudo-hover" },
  { label: "Focus", disabled: false, className: "pseudo-focus-within" },
  { label: "Disabled", disabled: true },
  { label: "Disabled + hover", disabled: true, className: "pseudo-hover" },
] as const;
function Example({
  label,
  helperText,
  customFlag,
  width,
  version = "v2",
  ...props
}: Args & { version?: "v1" | "v2" }) {
  const generated = React.useId(),
    id = props.id || generated,
    helperId = `${id}-example-helper`;
  const Component = version === "v1" ? PhoneInputV1 : PhoneInput;
  return (
    <div
      className="max-w-full space-y-1.5 font-[family-name:var(--font-v2,Inter,sans-serif)]"
      style={{ width }}
    >
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-semantic-text-secondary"
        >
          {label}
          {props.required && (
            <span className="ml-0.5 text-semantic-error-primary">*</span>
          )}
        </label>
      )}
      <Component
        {...props}
        id={id}
        countryFlag={
          customFlag ? (
            <span className="text-base" aria-hidden>
              {customFlag}
            </span>
          ) : (
            props.countryFlag
          )
        }
        aria-describedby={
          [
            props["aria-describedby"],
            helperText && !props.validation ? helperId : undefined,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
      {helperText && !props.validation && (
        <p id={helperId} className="m-0 text-xs text-semantic-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}
function CountryPicker({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (country: (typeof COUNTRIES)[number]) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Select a country</DialogTitle>
          <DialogDescription>
            Update the country flag and dial code in this example.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 p-6">
          {COUNTRIES.map((c) => (
            <Button
              key={c.iso}
              variant="secondary"
              className="justify-between"
              onClick={() => onPick(c)}
            >
              <span>{c.label}</span>
              <span className="text-semantic-text-muted">{c.code}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
function useLiveArgs(args: Args): Args {
  const [, updateArgs] = useArgs();
  return {
    ...args,
    onChange: (e) => {
      args.onChange?.(e);
      updateArgs({ value: e.target.value });
    },
  };
}
function Playground({
  updateExampleArgs,
  ...args
}: Args & { updateExampleArgs: (args: Partial<Args>) => void }) {
  const live = args;
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Example
        {...live}
        onCountryClick={() => {
          args.onCountryClick?.();
          setOpen(true);
        }}
      />
      <CountryPicker
        open={open}
        onOpenChange={setOpen}
        onPick={(c) => {
          updateExampleArgs({ countryIso: c.iso, countryCode: c.code });
          setOpen(false);
        }}
      />
    </>
  );
}
function PreviewPhone({
  value = "",
  countryIso = "IN",
  countryCode = "+91",
  onChange,
  onCountryClick,
  ...args
}: Args & { version?: "v1" | "v2" }) {
  const [text, setText] = React.useState(value),
    [country, setCountry] = React.useState({
      iso: countryIso,
      code: countryCode,
    }),
    [open, setOpen] = React.useState(false);
  return (
    <>
      <Example
        {...args}
        value={text}
        countryIso={country.iso}
        countryCode={country.code}
        onChange={(e) => {
          setText(e.target.value);
          onChange?.(e);
        }}
        onCountryClick={() => {
          onCountryClick?.();
          setOpen(true);
        }}
      />
      <CountryPicker
        open={open}
        onOpenChange={setOpen}
        onPick={(c) => {
          setCountry(c);
          setOpen(false);
        }}
      />
    </>
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/Phone Input",
  component: PhoneInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "value",
        "placeholder",
        "state",
        "validation",
        "disabled",
        "readOnly",
        "required",
        "phoneMaxNumber",
        "countryIso",
        "countryCode",
        "showChevron",
        "label",
        "helperText",
        "customFlag",
        "width",
        "onChange",
        "onCountryClick",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2190-7669",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "phone-input",
          summary:
            "A numeric phone field with a country-code area, SVG flag, digit guards and accessible validation. The host supplies labels and the country chooser.",
          changes: [
            [
              "Height and radius",
              "42px / 4px",
              "48px / 8px (recorded October 1 check)",
            ],
            [
              "Typography",
              "Inherited font",
              "Inter 16px value/code; example label 14px semibold and helper 12px",
            ],
            ["Hover", "Default border", "#C0C3CA enabled border"],
            ["Focus", "Thin teal shadow", "#27ABB8 border and soft 4px halo"],
            ["Error", "Red border", "Red border and soft 4px halo"],
            [
              "Disabled",
              "Reduced opacity",
              "Solid grey surface without opacity loss",
            ],
            [
              "Country activation",
              "Click handler on prefix",
              "Same chooser callback with a keyboard-accessible button",
            ],
            [
              "Numeric behavior",
              "Digit guards, sanitization and length limit",
              "Same current callbacks, ref and validation contract",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Value", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Country code", "--semantic-text-secondary", "#343E55", "#343E55"],
            [
              "Placeholder",
              "--semantic-text-placeholder",
              "#A2A6B1",
              "#A2A6B1",
            ],
            ["Border", "--semantic-border-input", "#E9EAEB", "#E9EAEB"],
            ["Hover", "--color-primary-100", "#C0C3CA", "#C0C3CA"],
            ["Focus", "--semantic-border-accent", "#27ABB8", "#27ABB8"],
            ["Error", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Validation", "--semantic-error-text", "#B42318", "#B42318"],
            ["Disabled surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Font", "--font-v2", "Inter 400"],
            ["Radius", "--radius", "8px"],
          ],
          guidance:
            "Numeric typing and pasted values are sanitized before onChange runs. phoneMaxNumber takes precedence over native maxLength. validation applies the error style and associated message; state only changes the treatment. Labels/helper text and the four-country dialog are example composition, not PhoneInput props. Country controls remain independently editable. The chooser callback is unavailable when disabled.",
        }),
      },
    },
  },
  args: {
    value: "",
    placeholder: "Enter phone number",
    state: "default",
    validation: "",
    disabled: false,
    readOnly: false,
    required: false,
    phoneMaxNumber: 10,
    countryIso: "IN",
    countryCode: "+91",
    showChevron: true,
    label: "Phone number",
    helperText: "Include the number without the country code.",
    customFlag: "",
    width: 420,
    onChange: (event) => changeAction(event.target.value),
    onCountryClick: fn(),
  },
  argTypes: {
    value: {
      control: "text",
      description: "Live numeric value; typing synchronizes this Control.",
    },
    placeholder: { control: "text" },
    state: { control: "select", options: VARIANTS },
    validation: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    phoneMaxNumber: { control: { type: "number", min: 1, max: 15, step: 1 } },
    countryIso: { control: "text" },
    countryCode: { control: "text" },
    showChevron: { control: "boolean" },
    label: { control: "text", table: { category: "Example" } },
    helperText: { control: "text", table: { category: "Example" } },
    customFlag: {
      control: "text",
      description: "Optional custom flag text/emoji node in the example.",
      table: { category: "Example" },
    },
    width: {
      control: { type: "number", min: 240, max: 700, step: 20 },
      table: { category: "Example" },
    },
    countryFlag: { control: false },
    defaultValue: { control: false },
    onChange: { control: false },
    onCountryClick: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<Args>();
    return <Playground {...useLiveArgs(args)} updateExampleArgs={updateArgs} />;
  },
};
export default meta;
type Story = StoryObj<Args>;
export const Overview: Story = {};
export const Default: Story = {};
export const WithCountrySelector: Story = { name: "Country chooser" };
export const Disabled: Story = {
  args: { disabled: true, value: "9876543210" },
};
export const ReadOnly: Story = {
  name: "Read only",
  args: { readOnly: true, value: "9876543210" },
};
export const USNumber: Story = {
  name: "US number",
  args: { countryIso: "US", countryCode: "+1" },
};
export const CustomFlagNode: Story = {
  name: "Custom flag",
  args: { customFlag: "🇮🇳" },
};
export const WithMaxNumber: Story = {
  name: "Digit limit",
  args: { phoneMaxNumber: 6, placeholder: "Enter up to 6 digits" },
};
export const EmptyState: Story = {
  name: "Empty",
  args: { state: "empty", value: "" },
};
export const Error: Story = {
  args: { state: "error", validation: "Enter a valid phone number." },
};
export const NoChevron: Story = {
  name: "No chevron",
  args: { showChevron: false },
};
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["state", "validation"],
    "Rows fix default, empty and error treatments. Other Controls apply to every field; typing and country selection remain independent."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col gap-6">
      {VARIANTS.map((state) => (
        <section key={state} className="space-y-2">
          <p className="m-0 text-xs font-semibold text-semantic-text-muted">
            {state === "default"
              ? "Default"
              : state === "empty"
                ? "Empty"
                : "Error"}
          </p>
          <PreviewPhone
            {...args}
            key={
              state + String(args.value) + args.countryIso + args.countryCode
            }
            state={state}
            validation={state === "error" ? "Check this phone number." : ""}
          />
        </section>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  name: "Height and width",
  parameters: gallery(
    ["width"],
    "PhoneInput has one recorded 48px height. These examples fix 420px and 280px widths; other Controls apply."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col gap-6">
      {[420, 280].map((width) => (
        <section key={width} className="space-y-2">
          <p className="m-0 text-xs font-semibold text-semantic-text-muted">
            48px height · {width}px container
          </p>
          <PreviewPhone
            {...args}
            key={String(args.value) + args.countryIso + args.countryCode}
            width={width}
          />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: {
    ...gallery(
      ["state", "validation", "disabled", "width"],
      "Rows fix treatment and columns fix interaction. The complete matrix scrolls inside its preview."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1330px] grid-cols-[100px_repeat(5,minmax(225px,1fr))] items-start gap-x-5 gap-y-6">
        <div />
        {COLUMNS.map((c) => (
          <p
            key={c.label}
            className="m-0 text-xs font-semibold text-semantic-text-muted"
          >
            {c.label}
          </p>
        ))}
        {VARIANTS.map((state) => (
          <React.Fragment key={state}>
            <p className="m-0 pt-6 text-xs font-semibold text-semantic-text-secondary">
              {state === "default"
                ? "Default"
                : state === "empty"
                  ? "Empty"
                  : "Error"}
            </p>
            {COLUMNS.map((c) => (
              <PreviewPhone
                {...args}
                key={
                  c.label +
                  String(args.value) +
                  args.countryIso +
                  args.countryCode
                }
                width={225}
                state={state}
                validation={state === "error" ? "Check this phone number." : ""}
                disabled={c.disabled}
                wrapperClassName={"className" in c ? c.className : undefined}
                aria-label={`${state} ${c.label}`}
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
      ["state", "validation", "disabled", "width"],
      "All visual treatments and disabled state compare both versions. Shared text/country/value Controls apply to each independent field."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[850px] grid-cols-[110px_1fr_1fr] items-start gap-x-8 gap-y-6">
        <div />
        <p className="m-0 text-xs font-semibold text-semantic-text-muted">
          v1 · ui/phone-input
        </p>
        <p className="m-0 text-xs font-semibold text-semantic-text-muted">
          v2 · ui/v2/phone-input
        </p>
        {[...VARIANTS, "disabled" as const].map((state) => (
          <React.Fragment key={state}>
            <p className="m-0 pt-6 text-xs font-semibold text-semantic-text-secondary">
              {state}
            </p>
            {(["v1", "v2"] as const).map((version) => (
              <PreviewPhone
                {...args}
                key={
                  version +
                  String(args.value) +
                  args.countryIso +
                  args.countryCode
                }
                width={330}
                version={version}
                state={state === "disabled" ? "default" : state}
                disabled={state === "disabled"}
                validation={state === "error" ? "Check this phone number." : ""}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
function PhoneForm({
  updateExampleArgs,
  ...args
}: Args & { updateExampleArgs: (args: Partial<Args>) => void }) {
  const live = args;
  const [open, setOpen] = React.useState(false),
    [error, setError] = React.useState(""),
    [saved, setSaved] = React.useState<string | null>(null);
  return (
    <form
      noValidate
      className="flex w-[480px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]"
      onSubmit={(e) => {
        e.preventDefault();
        const digits = String(args.value || "");
        const expected = args.phoneMaxNumber || 10;
        if (digits.length !== expected) {
          setError(`Enter ${expected} digits.`);
          return;
        }
        setError("");
        setSaved(digits);
      }}
    >
      <div>
        <p className="m-0 text-base font-semibold text-semantic-text-primary">
          Contact phone number
        </p>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          Save a number in this local example.
        </p>
      </div>
      <Example
        {...live}
        validation={error || args.validation}
        onChange={(e) => {
          setError("");
          setSaved(null);
          live.onChange?.(e);
        }}
        onCountryClick={() => {
          args.onCountryClick?.();
          setOpen(true);
        }}
      />
      <CountryPicker
        open={open}
        onOpenChange={setOpen}
        onPick={(c) => {
          updateExampleArgs({ countryIso: c.iso, countryCode: c.code });
          setOpen(false);
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-semantic-border-layout pt-4">
        <span role="status" className="text-xs text-semantic-text-muted">
          {saved === String(args.value) && saved ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5" />
              Saved in this example
            </span>
          ) : (
            "Changes stay in this example"
          )}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={args.disabled}
            onClick={() => {
              updateExampleArgs({ value: "" });
              setError("");
              setSaved(null);
            }}
          >
            Clear
          </Button>
          <Button type="submit" size="sm" disabled={args.disabled}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
export const Usage: Story = {
  args: { required: true },
  render: function Render(args) {
    const [, updateArgs] = useArgs<Args>();
    return <PhoneForm {...useLiveArgs(args)} updateExampleArgs={updateArgs} />;
  },
};
export const InForm: Story = { ...Usage, name: "Form example" };
