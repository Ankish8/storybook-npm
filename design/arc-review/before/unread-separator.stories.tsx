import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { UnreadSeparator, type UnreadSeparatorProps } from "./unread-separator";
import { UnreadSeparator as SeparatorV1 } from "../unread-separator";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
type Args = UnreadSeparatorProps & { width: number };
function separatorProps(args: Args) {
  const { width, ...props } = args;
  void width;
  return props;
}
const meta: Meta<Args> = {
  title: "V2/Components/UnreadSeparator",
  component: UnreadSeparator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: { include: ["count", "label", "width"] },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "unread-separator",
          summary:
            "A divider indicating where unread messages begin, with count-based singular/plural labels.",
          changes: [
            [
              "Typography",
              "Inherited Source Sans",
              "Inter; existing 12px label",
            ],
            [
              "Count and label",
              "Singular/plural count or custom label",
              "Preserved, including empty custom labels",
            ],
            ["Spacing", "16px gap, 8px vertical margin", "Preserved"],
          ],
          tokens: [
            ["Text", "--semantic-text-muted", "#717680", "#717680"],
            ["Lines", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Label surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Type", "--font-v2", "12px regular"],
          ],
          guidance:
            "The separator does not own read state. Usage updates count locally and hides the separator after Mark as read. A supplied custom label overrides the count text; use Reset controls to return to the generated label.",
        }),
      },
    },
  },
  args: { count: 3, label: undefined, width: 560 },
  argTypes: {
    count: { control: { type: "number", min: 0, step: 1 } },
    label: { control: "text" },
    width: {
      control: { type: "number", min: 200, max: 1000, step: 20 },
      table: { category: "Example" },
    },
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
      <UnreadSeparator {...separatorProps(args)} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Singular: Story = { args: { count: 1 } };
export const NoUnread: Story = { args: { count: 0 } };
export const CustomLabel: Story = { args: { label: "New messages" } };
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-semantic-border-layout p-4">
      <h3 className="m-0 mb-3 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        {title}
      </h3>
      {children}
    </section>
  );
}
export const AllCounts: Story = {
  name: "Count states",
  parameters: gallery(
    ["count"],
    "Zero, singular and plural counts are fixed. Custom label and width Controls apply to every example. This is a static component with no hover or loading state."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4" style={{ width: args.width + 34 }}>
      {[0, 1, 3].map((count) => (
        <Card key={count} title={`${count} unread`}>
          <div className="max-w-full" style={{ width: args.width }}>
            <UnreadSeparator {...separatorProps(args)} count={count} />
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
    "Both versions receive identical count, label and surrounding width."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[700px] grid-cols-2 gap-4">
        <Card title="v1">
          <div className="max-w-full" style={{ width: args.width }}>
            <SeparatorV1 {...separatorProps(args)} className="font-sans" />
          </div>
        </Card>
        <Card title="v2">
          <div className="max-w-full" style={{ width: args.width }}>
            <UnreadSeparator {...separatorProps(args)} />
          </div>
        </Card>
      </div>
    </div>
  ),
};
export const Usage: Story = {
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return (
      <section
        className="max-w-full rounded-lg border border-semantic-border-layout p-4"
        style={{ width: args.width }}
      >
        <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Unread messages
        </h3>
        <p className="m-0 mt-1 mb-4 text-xs text-[var(--v2-text-muted,#707070)]">
          Simulate one new message or mark the current messages as read.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => update({ count: args.count + 1 })}
          >
            Receive message
          </Button>
          <Button
            size="sm"
            disabled={args.count === 0}
            onClick={() => update({ count: 0 })}
          >
            Mark as read
          </Button>
        </div>
        <div className="mt-4 rounded-lg bg-semantic-bg-ui p-3">
          <p className="m-0 text-sm">Earlier messages</p>
        </div>
        {args.count > 0 ? (
          <>
            <UnreadSeparator {...separatorProps(args)} />
            <div className="rounded-lg bg-semantic-primary-surface p-3">
              <p className="m-0 text-sm">
                There are {args.count} new messages in this example.
              </p>
            </div>
          </>
        ) : (
          <p className="m-0 mt-4 text-sm text-[var(--v2-text-muted,#707070)]">
            All messages are read
          </p>
        )}
      </section>
    );
  },
};
