import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { DateDivider, type DateDividerProps } from "./date-divider";
import { DateDivider as DividerV1 } from "../date-divider";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
type Args = Omit<DateDividerProps, "children"> & {
  children: string;
  width: number;
  showPrevious: boolean;
};
const meta: Meta<Args> = {
  title: "V2/Components/DateDivider",
  component: DateDivider,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: { include: ["children", "width"] },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "date-divider",
          summary:
            "A date label between two flexible lines in a message timeline.",
          changes: [
            [
              "Typography",
              "Inherited Source Sans",
              "Inter; existing 12px label",
            ],
            ["Spacing", "16px gap and vertical margins", "Preserved"],
            ["API", "ReactNode label and native root attributes", "Preserved"],
          ],
          tokens: [
            ["Text", "--semantic-text-muted", "#717680", "#717680"],
            ["Lines", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Type", "--font-v2", "12px regular"],
            ["Spacing", "gap / vertical margin", "16px"],
          ],
          guidance:
            "The component displays the supplied label; it does not format or compute dates. Use compact labels in narrow message columns. Width and previous-day controls configure the surrounding example.",
        }),
      },
    },
  },
  args: { children: "Today", width: 560, showPrevious: false },
  argTypes: {
    children: { control: "text" },
    width: {
      control: { type: "number", min: 200, max: 1000, step: 20 },
      table: { category: "Example" },
    },
    showPrevious: { control: "boolean", table: { category: "Example" } },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="max-w-full" style={{ width: args.width }}>
      <DateDivider className={args.className} aria-label={args["aria-label"]}>
        {args.children}
      </DateDivider>
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const CalendarDate: Story = { args: { children: "30 September 2026" } };
export const LongLabel: Story = {
  args: { children: "Wednesday, 30 September 2026" },
};
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-semantic-border-layout p-4">
      <h3 className="m-0 mb-3 text-base font-semibold">{title}</h3>
      {children}
    </section>
  );
}
export const AllLabels: Story = {
  name: "All label formats",
  parameters: gallery(
    ["children"],
    "Relative, calendar and long labels are fixed. Width Controls apply to every divider. This static component has no hover, disabled or loading state."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4" style={{ width: args.width + 34 }}>
      {[
        { title: "Relative date", text: "Today" },
        { title: "Calendar date", text: "30 September 2026" },
        { title: "Long date", text: "Wednesday, 30 September 2026" },
      ].map((c) => (
        <Card title={c.title} key={c.title}>
          <div className="max-w-full" style={{ width: args.width }}>
            <DateDivider>{c.text}</DateDivider>
          </div>
        </Card>
      ))}
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    [],
    "Both versions receive the same label and surrounding width. The wide comparison scrolls within its own preview."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[700px] grid-cols-2 gap-4">
        <Card title="v1">
          <div className="max-w-full" style={{ width: args.width }}>
            <DividerV1 className="font-sans">{args.children}</DividerV1>
          </div>
        </Card>
        <Card title="v2">
          <div className="max-w-full" style={{ width: args.width }}>
            <DateDivider>{args.children}</DateDivider>
          </div>
        </Card>
      </div>
    </div>
  ),
};
export const Usage: Story = {
  parameters: { controls: { include: ["children", "width", "showPrevious"] } },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return (
      <section
        className="max-w-full rounded-lg border border-semantic-border-layout p-4"
        style={{ width: args.width }}
      >
        <h3 className="m-0 text-base font-semibold">Message timeline</h3>
        <p className="m-0 mt-1 mb-4 text-xs text-semantic-text-muted">
          Toggle the earlier messages without changing the timeline layout.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => update({ showPrevious: !args.showPrevious })}
        >
          {args.showPrevious
            ? "Hide earlier messages"
            : "Show earlier messages"}
        </Button>
        {args.showPrevious && (
          <>
            <DateDivider>Yesterday</DateDivider>
            <div className="max-w-[85%] rounded-lg bg-semantic-bg-ui p-3">
              <p className="m-0 text-sm">I will send the receipt tomorrow.</p>
            </div>
          </>
        )}
        <DateDivider>{args.children}</DateDivider>
        <div className="max-w-[85%] rounded-lg bg-semantic-bg-ui p-3">
          <p className="m-0 text-sm">The delivery receipt is ready.</p>
        </div>
        <div className="ml-auto mt-3 max-w-[85%] rounded-lg bg-semantic-primary-surface p-3">
          <p className="m-0 text-sm">Thank you, I have received it.</p>
        </div>
      </section>
    );
  },
};
