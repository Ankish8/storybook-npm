import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { PhoneCall, FileText, Search, Inbox } from "lucide-react";
import { EmptyState, type EmptyStateProps } from "./empty-state";
import { EmptyState as EmptyStateV1 } from "../empty-state";
import { Button } from "./button";
import { Button as ButtonV1 } from "../button";
import { Input } from "./input";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = Omit<EmptyStateProps, "icon" | "actions"> & {
  iconType: "phone" | "document" | "search" | "inbox" | "none";
  actionCount: number;
  primaryLabel: string;
  secondaryLabel: string;
  disabled: boolean;
  onAction: (action: string) => void;
  query: string;
};
const icons = {
  phone: PhoneCall,
  document: FileText,
  search: Search,
  inbox: Inbox,
};
function Sample({
  args,
  version = "v2",
  onAction,
}: {
  args: Args;
  version?: "v1" | "v2";
  onAction?: (action: string) => void;
}) {
  const UI = version === "v1" ? EmptyStateV1 : EmptyState;
  const Action = version === "v1" ? ButtonV1 : Button;
  const Icon = args.iconType === "none" ? undefined : icons[args.iconType];
  return (
    <UI
      title={args.title}
      description={args.description}
      className={
        (version === "v1" ? "font-sans " : "") + (args.className || "")
      }
      icon={Icon ? <Icon className="size-10" /> : undefined}
      actions={
        args.actionCount > 0 ? (
          <>
            <Action
              size="sm"
              disabled={args.disabled}
              onClick={() => {
                args.onAction(args.primaryLabel);
                onAction?.(args.primaryLabel);
              }}
            >
              {args.primaryLabel}
            </Action>
            {args.actionCount > 1 && (
              <Action
                size="sm"
                variant="outline"
                disabled={args.disabled}
                onClick={() => {
                  args.onAction(args.secondaryLabel);
                  onAction?.(args.secondaryLabel);
                }}
              >
                {args.secondaryLabel}
              </Action>
            )}
          </>
        ) : undefined
      }
    />
  );
}
const controls = [
  "title",
  "description",
  "iconType",
  "actionCount",
  "primaryLabel",
  "secondaryLabel",
  "disabled",
  "onAction",
];
const meta: Meta<Args> = {
  title: "V2/Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-7344",
    },
    layout: "padded",
    controls: { include: controls },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "empty-state",
          exportName: "EmptyState",
          summary:
            "Centered empty views with a clear explanation and optional next action.",
          changes: [
            ["Padding", "64px vertical / 16px horizontal", "24px on all sides"],
            ["Title", "16px semibold", "24px semibold Inter, 32px line height"],
            ["Description", "14px body", "16px regular Inter"],
            ["Actions", "v1 buttons", "v2 Small buttons"],
            [
              "Slots",
              "ReactNode icon/title/description/actions",
              "Same slot API",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Icon surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Description", "--semantic-text-muted", "#717680", "#717680"],
          ],
          guidance:
            "Explain why a view is empty and offer a useful next action. Icon and action controls configure ReactNode slots. EmptyState itself has no search or data-fetch behavior; Usage demonstrates local application state.",
        }),
      },
    },
  },
  args: {
    title: "Setup Calling API",
    description:
      "Generate production credentials when your environment is ready.",
    iconType: "phone",
    actionCount: 2,
    primaryLabel: "Generate credentials",
    secondaryLabel: "Setup guide",
    disabled: false,
    query: "",
    onAction: fn(),
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    iconType: {
      control: "select",
      options: ["phone", "document", "search", "inbox", "none"],
      table: { category: "Example" },
    },
    actionCount: {
      control: { type: "number", min: 0, max: 2, step: 1 },
      table: { category: "Example" },
    },
    primaryLabel: { control: "text", table: { category: "Example" } },
    secondaryLabel: { control: "text", table: { category: "Example" } },
    disabled: { control: "boolean", table: { category: "Example" } },
    query: { control: "text", table: { category: "Example" } },
    onAction: { control: false, table: { category: "Example" } },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full rounded-lg border border-semantic-border-layout bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  render: (args) => <Sample args={args} />,
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const WithIcon: Story = {};
export const NoButtons: Story = {
  name: "Without action buttons",
  args: {
    iconType: "document",
    title: "No statements found",
    description: "Your statements will appear here when they are available.",
    actionCount: 0,
  },
};
export const NoIcon: Story = {
  name: "Without icon",
  args: {
    iconType: "none",
    title: "No results found",
    description: "Try another keyword or adjust your filters.",
    actionCount: 1,
    primaryLabel: "Clear filters",
  },
};
export const SearchEmpty: Story = {
  name: "Search empty state",
  args: {
    iconType: "search",
    title: "No results found",
    description: "We couldn't find contacts matching your search.",
    actionCount: 1,
    primaryLabel: "Clear search",
  },
};
export const InboxEmpty: Story = {
  name: "Inbox empty state",
  args: {
    iconType: "inbox",
    title: "Your inbox is empty",
    description: "New conversations will appear here.",
    actionCount: 0,
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
      <h3 className="m-0 mb-4 text-base font-semibold text-semantic-text-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}
export const AllVariants: Story = {
  parameters: gallery(
    ["iconType", "actionCount"],
    "With icon and actions, icon only, text and action, and text only are fixed compositions. Text, button labels and disabled controls remain editable."
  ),
  render: (args) => (
    <div className="grid gap-5 md:grid-cols-2">
      {[
        { name: "Icon and actions", iconType: "phone", actionCount: 2 },
        { name: "Icon only", iconType: "document", actionCount: 0 },
        { name: "Text and action", iconType: "none", actionCount: 1 },
        { name: "Text only", iconType: "none", actionCount: 0 },
      ].map((c) => (
        <Card key={c.name} title={c.name}>
          <Sample
            args={{
              ...args,
              iconType: c.iconType as Args["iconType"],
              actionCount: c.actionCount,
            }}
          />
        </Card>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["disabled"],
    "Default and disabled action states are fixed. EmptyState is otherwise a static composition; content and slot controls remain editable."
  ),
  render: (args) => (
    <div className="grid gap-5 md:grid-cols-2">
      {[false, true].map((disabled) => (
        <Card
          key={String(disabled)}
          title={disabled ? "Disabled actions" : "Default"}
        >
          <Sample args={{ ...args, disabled }} />
        </Card>
      ))}
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    [],
    "The same icon, title, description, action labels and disabled state are paired across v1 and v2. The comparison stays within the preview."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[800px] grid-cols-2 gap-5">
        {(["v1", "v2"] as const).map((version) => (
          <Card key={version} title={version}>
            <Sample args={args} version={version} />
          </Card>
        ))}
      </div>
    </div>
  ),
};
const names = ["Aditi Kumar", "Mira Shah", "Noor Khan"];
function SearchExample({
  args,
  update,
}: {
  args: Args;
  update: (next: Partial<Args>) => void;
}) {
  const id = React.useId();
  const [feedback, setFeedback] = React.useState("");
  const matches = names.filter((n) =>
    n.toLowerCase().includes(args.query.toLowerCase())
  );
  return (
    <section className="p-5">
      <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
        Contacts
      </h3>
      <p className="m-0 mt-1 mb-4 text-xs text-semantic-text-muted">
        Filter a local list. Query typing and Controls stay synchronized;
        clearing restores contacts.
      </p>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        Search contacts
      </label>
      <Input
        id={id}
        value={args.query}
        onChange={(e) => {
          update({ query: e.target.value });
          setFeedback("");
        }}
      />
      {matches.length ? (
        <ul className="m-0 mt-4 list-none p-0">
          {matches.map((n) => (
            <li
              className="border-b border-semantic-border-layout py-3 text-sm"
              key={n}
            >
              {n}
            </li>
          ))}
        </ul>
      ) : (
        <Sample
          args={args}
          onAction={() => {
            update({ query: "" });
            setFeedback("Search cleared. All contacts restored.");
          }}
        />
      )}
      {feedback && (
        <p className="m-0 mt-4 text-xs text-semantic-success-text">
          {feedback}
        </p>
      )}
    </section>
  );
}
export const Usage: Story = {
  args: {
    query: "Unmatched",
    iconType: "search",
    title: "No matching contacts",
    description: "Clear your search to see all contacts.",
    actionCount: 1,
    primaryLabel: "Clear search",
  },
  parameters: { controls: { include: [...controls, "query"] } },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <SearchExample args={args} update={update} />;
  },
};
