import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { SystemMessage, type SystemMessageProps } from "./system-message";
import { SystemMessage as MessageV1 } from "../system-message";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
type Args = SystemMessageProps & { width: number; agent: string };
function messageProps(args: Args) {
  const { width, agent, ...props } = args;
  void [width, agent];
  return props;
}
const meta: Meta<Args> = {
  title: "V2/Components/SystemMessage",
  component: SystemMessage,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: { include: ["children", "width"] },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "system-message",
          summary:
            "Centered event text in a conversation timeline. Double-asterisk phrases render with medium link-colored emphasis.",
          changes: [
            [
              "Typography",
              "Inherited Source Sans",
              "Inter; existing 13px event text",
            ],
            [
              "Formatting",
              "Double-asterisk phrase parsing",
              "Preserved; not a general Markdown renderer",
            ],
            ["Layout", "Centered, 4px vertical margin", "Preserved"],
          ],
          tokens: [
            ["Text", "--semantic-text-muted", "#717680", "#717680"],
            ["Emphasis", "--semantic-text-link", "#4275D6", "#4275D6"],
            ["Type", "--font-v2", "13px regular; emphasis medium"],
            ["Margin", "my-1", "4px"],
          ],
          guidance:
            "Pass a string. Double-asterisk phrases use the current v1 parser; this is not a full Markdown renderer. This component has no event state or clickable links. Usage appends local assignment events.",
        }),
      },
    },
  },
  args: {
    children: "Assigned to **Mira Shah** by **Admin**",
    width: 560,
    agent: "Mira Shah",
  },
  argTypes: {
    children: { control: "text" },
    width: {
      control: { type: "number", min: 200, max: 1000, step: 20 },
      table: { category: "Example" },
    },
    agent: {
      control: "select",
      options: ["Mira Shah", "Noor Khan", "Aditi Kumar"],
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
      <SystemMessage {...messageProps(args)} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const PlainText: Story = { args: { children: "Chat was closed" } };
export const MultipleEmphasis: Story = {
  args: {
    children:
      "**Noor Khan** transferred this chat from **Sales** to **Support**",
  },
};
export const LongText: Story = {
  args: {
    children:
      "**Mira Shah** transferred the conversation from **Customer Support Operations** to **Delivery Assistance**",
  },
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
      <h3 className="m-0 mb-3 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        {title}
      </h3>
      {children}
    </section>
  );
}
export const AllFormats: Story = {
  name: "All formats",
  parameters: gallery(
    [],
    "Each sample transforms the editable event text into plain or emphasized content. Width applies to every example."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4" style={{ width: args.width + 34 }}>
      {[
        { title: "Plain text", text: args.children.replace(/\*\*/g, "") },
        { title: "Emphasized text", text: args.children },
      ].map((c) => (
        <Card title={c.title} key={c.title}>
          <div className="max-w-full" style={{ width: args.width }}>
            <SystemMessage {...messageProps(args)}>{c.text}</SystemMessage>
          </div>
        </Card>
      ))}
    </div>
  ),
};
export const ContentStates: Story = {
  name: "Content states",
  parameters: gallery(
    ["children"],
    "Empty, plain and unmatched-marker content are fixed; width Controls remain editable. The component has no interactive, disabled or loading state."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4" style={{ width: args.width + 34 }}>
      {[
        { title: "Empty event", text: "" },
        { title: "Plain event", text: "Chat was closed" },
        { title: "Unmatched marker", text: "Assigned to **Mira Shah" },
      ].map((c) => (
        <Card title={c.title} key={c.title}>
          <div className="max-w-full" style={{ width: args.width }}>
            <SystemMessage {...messageProps(args)}>{c.text}</SystemMessage>
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
    "Both versions receive the same event string and surrounding width."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[700px] grid-cols-2 gap-4">
        <Card title="v1">
          <div className="max-w-full" style={{ width: args.width }}>
            <MessageV1 {...messageProps(args)} className="font-sans" />
          </div>
        </Card>
        <Card title="v2">
          <div className="max-w-full" style={{ width: args.width }}>
            <SystemMessage {...messageProps(args)} />
          </div>
        </Card>
      </div>
    </div>
  ),
};
function Timeline({
  args,
  update,
}: {
  args: Args;
  update: (next: Partial<Args>) => void;
}) {
  const id = React.useId();
  const [history, setHistory] = React.useState<string[]>([]);
  return (
    <section
      className="max-w-full rounded-lg border border-semantic-border-layout p-4"
      style={{ width: args.width }}
    >
      <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        Conversation activity
      </h3>
      <p className="m-0 mt-1 mb-4 text-xs text-[var(--v2-text-muted,#707070)]">
        Choose an agent and append an assignment event locally.
      </p>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[var(--v2-text-primary,#484848)]"
      >
        Assign to
      </label>
      <div className="flex flex-wrap gap-3">
        <select
          id={id}
          value={args.agent}
          className="h-9 min-w-0 rounded-lg border border-semantic-border-input bg-semantic-bg-primary px-3 text-sm"
          onChange={(e) => update({ agent: e.target.value })}
        >
          {["Mira Shah", "Noor Khan", "Aditi Kumar"].map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
        <Button
          size="sm"
          onClick={() => {
            setHistory((h) => [...h, args.children]);
            update({ children: `Assigned to **${args.agent}** by **Admin**` });
          }}
        >
          Assign conversation
        </Button>
      </div>
      <div className="mt-5 space-y-3">
        <SystemMessage>Chat started by **Customer**</SystemMessage>
        <div className="max-w-[85%] rounded-lg bg-semantic-bg-ui p-3">
          <p className="m-0 text-sm">Could you check the delivery status?</p>
        </div>
        {history.map((event, i) => (
          <SystemMessage key={i}>{event}</SystemMessage>
        ))}
        <SystemMessage {...messageProps(args)} />
      </div>
    </section>
  );
}
export const Usage: Story = {
  parameters: { controls: { include: ["children", "width", "agent"] } },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <Timeline args={args} update={update} />;
  },
};
