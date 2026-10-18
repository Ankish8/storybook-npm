import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import {
  ProgressIndicator,
  type ProgressIndicatorProps,
} from "./progress-indicator";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

const variants = ["bar", "circle", "semi-circle"] as const;
const meta: Meta<ProgressIndicatorProps> = {
  title: "V2/Components/ProgressIndicator",
  component: ProgressIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: ["value", "variant", "labelPosition", "indeterminate"],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "progress-indicator",
          hasV1: false,
          summary:
            "Measured task progress, with a linear bar as the primary presentation. Circular and semicircular variants remain available.",
          changes: [
            [
              "Linear track",
              "—",
              "7px high; 320px default width, overridable with className or style",
            ],
            ["Circular", "—", "54px diameter; 5.13488px ring"],
            ["Semicircular", "—", "54 × 27px"],
            [
              "Labels",
              "—",
              "Tabular percentage; right, bottom or hidden. 100% appears only on completion.",
            ],
            [
              "Measured values",
              "—",
              "0–100, clamped; non-finite values become 0. ARIA receives the actual value immediately.",
            ],
            [
              "Motion",
              "—",
              "Fill and count settle together over 400ms. Loading pauses offscreen or in a hidden page and stays still with reduced motion.",
            ],
          ],
          tokens: [
            ["Progress", "--semantic-info-primary", "#4275D6", "#4275D6"],
            ["Complete", "--semantic-success-primary", "#17B26A", "#17B26A"],
            ["Track", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Text", "--semantic-text-muted", "#717680", "#717680"],
          ],
          guidance:
            "Give every indicator a meaningful aria-label or aria-labelledby. Use indeterminate only when the amount of completed work is unknown; it omits aria-valuenow and the visible percentage. A custom aria-valuetext can describe completed items. Progress is not a live region: announce meaningful task status separately. This component has no v1 counterpart; its existing v2 API and defaults are retained.",
        }),
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2284-50240",
    },
  },
  args: {
    value: 30,
    variant: "bar",
    labelPosition: "right",
    indeterminate: false,
    "aria-label": "Task progress",
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    variant: { control: "select", options: variants },
    labelPosition: { control: "radio", options: ["right", "bottom", "none"] },
    indeterminate: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

const sampleContacts = Array.from({ length: 24 }, (_, index) => ({
  name: `Contact ${index + 1}`,
  email:
    index === 7
      ? "missing-at.example.com"
      : index === 18
        ? ""
        : `contact${index + 1}@example.com`,
}));

function ContactCheckDemo({
  onProgressChange,
  ...args
}: ProgressIndicatorProps & { onProgressChange: (value: number) => void }) {
  const [checked, setChecked] = React.useState(0);
  const [issues, setIssues] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [pageVisible, setPageVisible] = React.useState(true);
  const statusId = React.useId();
  const total = sampleContacts.length;
  const complete = checked === total;
  const percentage = (checked / total) * 100;

  React.useEffect(() => {
    const update = () => setPageVisible(document.visibilityState !== "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  React.useEffect(() => {
    if (!running || !pageVisible || checked === total) return;
    // Yield between records so the local work is observable and can be paused.
    const timer = window.setTimeout(() => {
      const contact = sampleContacts[checked];
      const valid =
        contact.name.trim().length > 0 && /^\S+@\S+\.\S+$/.test(contact.email);
      const nextChecked = checked + 1;
      setChecked(nextChecked);
      setIssues((previous) => previous + (valid ? 0 : 1));
      onProgressChange((nextChecked / total) * 100);
      if (nextChecked === total) setRunning(false);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [running, pageVisible, checked, total, onProgressChange]);

  const status = complete
    ? `Check complete. ${issues} sample contacts need attention.`
    : running
      ? "Checking sample contacts."
      : started
        ? "Check paused. Resume to continue."
        : "Ready to check 24 sample contacts.";

  return (
    <section className="w-[440px] max-w-full space-y-5 rounded-xl border border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-5">
      <div className="space-y-1.5">
        <h3 className="m-0 text-base font-semibold text-v2-semantic-text-primary">
          Check contact format
        </h3>
        <p className="m-0 text-sm text-v2-semantic-text-muted">
          Local demo · checks names and email format in this browser.
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap justify-between gap-2 text-sm text-v2-semantic-text-secondary">
          <span className="tabular-nums">
            {checked} of {total} checked
          </span>
          <span className="tabular-nums">{issues} need attention</span>
        </div>
        <ProgressIndicator
          {...args}
          className="w-full"
          value={percentage}
          variant="bar"
          indeterminate={false}
          aria-label="Sample contact format check"
          aria-valuetext={`${checked} of ${total} sample contacts checked`}
          aria-describedby={statusId}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={complete}
          onClick={() => {
            setStarted(true);
            setRunning((previous) => !previous);
          }}
        >
          {complete
            ? "Complete"
            : running
              ? "Pause"
              : started
                ? "Resume"
                : "Start"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setRunning(false);
            setStarted(false);
            setChecked(0);
            setIssues(0);
            onProgressChange(0);
          }}
        >
          Reset
        </Button>
      </div>
      <div className="space-y-1.5">
        <p
          id={statusId}
          role="status"
          className="m-0 text-sm text-v2-semantic-text-secondary"
        >
          {status}
        </p>
        <p className="m-0 min-h-4 text-xs text-v2-semantic-text-muted">
          {checked > 0
            ? `Last checked: ${sampleContacts[checked - 1].name}.`
            : "24 sample records · no upload or server request."}
        </p>
      </div>
    </section>
  );
}

const taskParameters = gallery(
  ["value", "variant", "indeterminate"],
  "A local name and email-format check. Start, Pause, Resume and Reset control actual checked records; the bar owns its measured value. Use Default to explore value, shape and loading controls."
);

export const Overview: Story = {
  args: { value: 0, variant: "bar", indeterminate: false },
  parameters: taskParameters,
  render: function OverviewRender(args) {
    const [, updateArgs] = useArgs();
    const updateProgress = React.useCallback(
      (value: number) => updateArgs({ value }),
      [updateArgs]
    );
    return <ContactCheckDemo {...args} onProgressChange={updateProgress} />;
  },
};
export const Default: Story = {};
export const Bar: Story = { args: { variant: "bar" } };
export const Circle: Story = { args: { variant: "circle" } };
export const SemiCircle: Story = { args: { variant: "semi-circle" } };
export const BottomLabel: Story = { args: { labelPosition: "bottom" } };
export const HiddenLabel: Story = { args: { labelPosition: "none" } };
export const Indeterminate: Story = {
  args: { indeterminate: true, labelPosition: "none" },
};
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "Linear progress is the primary presentation. Circular and semicircular variants preserve the existing API."
  ),
  render: (args) => (
    <div className="grid w-[740px] max-w-full gap-8 sm:grid-cols-2">
      <section className="space-y-4 sm:col-span-2">
        <h3 className="m-0 text-base font-medium">Linear progress</h3>
        <ProgressIndicator {...args} variant="bar" />
      </section>
      {variants.slice(1).map((variant) => (
        <section key={variant} className="space-y-4">
          <h3 className="m-0 text-base font-medium capitalize">
            {variant.replace("-", " ")}
          </h3>
          <ProgressIndicator {...args} variant={variant} />
        </section>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  parameters: gallery(
    ["variant"],
    "Widths are controlled with native className or style. There is no size prop; the default linear width stays 320px."
  ),
  render: (args) => (
    <div className="w-[440px] max-w-full space-y-6">
      <section className="space-y-2">
        <h3 className="m-0 text-sm font-medium">Compact · 200px</h3>
        <ProgressIndicator {...args} variant="bar" className="w-[200px]" />
      </section>
      <section className="space-y-2">
        <h3 className="m-0 text-sm font-medium">Default · 320px</h3>
        <ProgressIndicator {...args} variant="bar" />
      </section>
      <section className="space-y-2">
        <h3 className="m-0 text-sm font-medium">Container width</h3>
        <ProgressIndicator {...args} variant="bar" className="w-full" />
      </section>
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["value", "indeterminate"],
    "Start, partial, complete and indeterminate states. Shape and label position apply to each."
  ),
  render: (args) => (
    <div className="grid w-[700px] max-w-full gap-6 sm:grid-cols-2">
      {[0, 30, 100, -1].map((value) => (
        <section key={value} className="space-y-3">
          <h3 className="m-0 text-sm font-medium">
            {value < 0
              ? "Indeterminate"
              : value === 100
                ? "Complete"
                : value === 0
                  ? "Not started"
                  : "In progress"}
          </h3>
          <ProgressIndicator
            {...args}
            value={value < 0 ? 0 : value}
            indeterminate={value < 0}
          />
        </section>
      ))}
    </div>
  ),
};
export const IndeterminateShapes: Story = {
  parameters: gallery(
    ["value", "variant", "indeterminate", "labelPosition"],
    "All three unknown-progress shapes show a partial fill independently of value. Reduced motion keeps that partial fill still."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-center gap-8">
      {variants.map((variant) => (
        <ProgressIndicator
          {...args}
          key={variant}
          variant={variant}
          value={0}
          indeterminate
          labelPosition="none"
          aria-label={`${variant} loading`}
        />
      ))}
    </div>
  ),
};
export const Usage: Story = { ...Overview };
export const Keyboard: Story = {
  ...Overview,
  parameters: gallery(
    ["value", "variant", "indeterminate"],
    "Tab to Start, activate with Enter or Space, Pause and Resume, then Reset. The progress indicator remains a read-only measurement without a tab stop."
  ),
};
