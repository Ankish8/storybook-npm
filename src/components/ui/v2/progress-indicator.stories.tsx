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
            "Measured progress in linear, circular and semicircular presentations.",
          changes: [
            ["Linear track", "—", "8px high; 8px corners; 320px default width"],
            ["Circular", "—", "54px diameter; 5.13488px ring"],
            ["Semicircular", "—", "54 × 27px"],
            ["Labels", "—", "12px text; right, bottom or hidden"],
          ],
          tokens: [
            ["Progress", "--semantic-info-primary", "#4275D6", "#4275D6"],
            ["Track", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Text", "--semantic-text-primary", "#181D27", "#181D27"],
          ],
          guidance:
            "Give every indicator a meaningful accessible label. Values are clamped to 0–100. Indeterminate progress omits aria-valuenow and respects reduced motion.",
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
    "aria-label": "Upload progress",
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
export const Overview: Story = {};
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
    "Three fixed shapes. Value, labels and indeterminate mode update every example."
  ),
  render: (args) => (
    <div className="grid w-[740px] max-w-full gap-8 sm:grid-cols-2">
      <section className="space-y-4 sm:col-span-2">
        <h3 className="m-0 text-base font-semibold">Linear progress</h3>
        <ProgressIndicator {...args} variant="bar" />
      </section>
      {variants.slice(1).map((variant) => (
        <section key={variant} className="space-y-4">
          <h3 className="m-0 text-base font-semibold capitalize">
            {variant.replace("-", " ")}
          </h3>
          <ProgressIndicator {...args} variant={variant} />
        </section>
      ))}
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
          <h3 className="m-0 text-sm font-semibold">
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
            value={value < 0 ? 30 : value}
            indeterminate={value < 0}
          />
        </section>
      ))}
    </div>
  ),
};
function UploadExample(
  args: ProgressIndicatorProps & { onProgressChange: (value: number) => void }
) {
  const value = args.value || 0;
  return (
    <section className="w-[440px] max-w-full space-y-5">
      <div>
        <h3 className="m-0 text-base font-semibold">Import contacts</h3>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          Each action advances this local example by 25%.
        </p>
      </div>
      <ProgressIndicator
        {...args}
        value={value}
        aria-label="Contact import progress"
      />
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => args.onProgressChange(Math.min(100, value + 25))}
          disabled={value === 100}
        >
          Import next batch
        </Button>
        <Button variant="outline" onClick={() => args.onProgressChange(0)}>
          Reset
        </Button>
      </div>
      <p role="status" className="m-0 text-sm text-semantic-text-secondary">
        {value === 100
          ? "Contacts imported."
          : `${value}% of contacts imported.`}
      </p>
    </section>
  );
}
export const Usage: Story = {
  parameters: gallery(
    ["indeterminate"],
    "A local import workflow. Import and Reset stay synchronized with value Controls; shape and label position remain editable."
  ),
  render: function UsageRender(args) {
    const [, updateArgs] = useArgs();
    return (
      <UploadExample
        {...args}
        indeterminate={false}
        onProgressChange={(value) => updateArgs({ value })}
      />
    );
  },
};
