import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { expect, fn, userEvent, within } from "storybook/test";
import { PhoneCall, FileText, Search, Inbox } from "lucide-react";
import { EmptyState, type EmptyStateProps } from "./empty-state";
import { EmptyState as EmptyStateV1 } from "../empty-state";
import { cn } from "@/lib/utils";
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
      className={cn(version === "v1" && "font-sans", args.className)}
      {...(version === "v2"
        ? { size: args.size, illustration: args.illustration }
        : {})}
      icon={Icon ? <Icon className="size-10" /> : undefined}
      actions={
        args.actionCount > 0 ? (
          <>
            <Action
              type="button"
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
                type="button"
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
  "size",
  "illustration",
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
            "Calm empty views with custom content, optional illustrated presets, and a useful next action.",
          changes: [
            ["Padding", "64px vertical / 16px horizontal", "24px on all sides"],
            [
              "Title",
              "16px semibold",
              "24px medium Timeless Sans (Inter fallback), 32px line height",
            ],
            [
              "Description",
              "14px body",
              "16px regular Timeless Sans (Inter fallback)",
            ],
            ["Actions", "v1 buttons", "v2 Small buttons"],
            [
              "Size",
              "One size",
              'default, or size="sm": 48px icon tile, 16px title, 14px description, 20px sides and 32–48px vertical padding',
            ],
            [
              "Slots",
              "ReactNode icon/title/description/actions",
              "Same slot API; icons take precedence over illustration presets",
            ],
            [
              "Illustrations",
              "Custom icon only",
              "Opt-in no-results, offline, caught-up and not-found SVG artwork",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            [
              "Icon / illustration surface",
              "--semantic-bg-ui",
              "#F5F5F5",
              "#F5F5F5",
            ],
            [
              "Illustration outline",
              "--semantic-primary",
              "#343E55",
              "#343E55",
            ],
            [
              "Illustration detail",
              "--semantic-border-layout",
              "#E9EAEB",
              "#E9EAEB",
            ],
            [
              "Completion mark",
              "--semantic-success-primary",
              "#17B26A",
              "#17B26A",
            ],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Description", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
          ],
          guidance:
            "Explain why a view is empty and offer a useful next action. Choose an illustration preset or supply a custom icon; supplying an icon keeps the original icon slot. Illustrations are decorative and stay still under reduced motion. The contact-search preview clears an unmatched query, restores contacts, and returns focus to the search field. Native div attributes and a forwarded ref support application labeling and status announcements.",
        }),
      },
    },
  },
  args: {
    title: "Setup Calling API",
    description:
      "Generate production credentials when your environment is ready.",
    size: "default",
    iconType: "phone",
    actionCount: 2,
    primaryLabel: "Generate credentials",
    secondaryLabel: "Setup guide",
    disabled: false,
    query: "",
    onAction: fn(),
  },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    illustration: {
      control: "select",
      options: ["none", "no-results", "offline", "caught-up", "not-found"],
      mapping: { none: undefined },
      description:
        'Optional decorative art. Set iconType to "none" to show it.',
    },
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
export const Overview: Story = {
  args: {
    query: "Atlas",
    iconType: "none",
    illustration: "no-results",
    title: "No matching contacts",
    description: "Try a different name or clear your search to see everyone.",
    actionCount: 1,
    primaryLabel: "Clear search",
    secondaryLabel: "Try Mira",
  },
  parameters: { controls: { include: [...controls, "query"] } },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <SearchExample args={args} update={update} />;
  },
};
export const WithIcon: Story = {};
export const Small: Story = {
  args: {
    size: "sm",
    iconType: "inbox",
    title: "No conversations yet",
    description: "New conversations will appear here.",
    actionCount: 1,
    primaryLabel: "Start a conversation",
  },
};
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
export const Illustrations: Story = {
  name: "Illustrated states",
  parameters: gallery(
    ["illustration", "iconType", "title", "description", "actionCount"],
    "Four opt-in illustrations share the current theme. Artwork is decorative; the application supplies copy and recovery actions."
  ),
  render: (args) => (
    <div className="grid gap-5 md:grid-cols-2">
      {[
        {
          illustration: "no-results",
          title: "No results",
          description: "Try another keyword or adjust your filters.",
        },
        {
          illustration: "offline",
          title: "You're offline",
          description: "Reconnect to load the latest conversations.",
        },
        {
          illustration: "caught-up",
          title: "All caught up",
          description: "New conversations will appear here.",
        },
        {
          illustration: "not-found",
          title: "Page not found",
          description: "This page may have moved. Try searching the workspace.",
        },
      ].map((state) => (
        <Card key={state.illustration} title={state.title}>
          <Sample
            args={{
              ...args,
              ...state,
              illustration: state.illustration as Args["illustration"],
              iconType: "none",
              actionCount: 0,
            }}
          />
        </Card>
      ))}
    </div>
  ),
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
      <h3 className="m-0 mb-4 text-base font-medium text-[var(--v2-text-primary,#484848)]">
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
export const AllSizes: Story = {
  parameters: gallery(
    ["size"],
    "The established default and compact sizes are shown with the same content and actions."
  ),
  render: (args) => (
    <div className="grid gap-5 md:grid-cols-2">
      {(["default", "sm"] as const).map((size) => (
        <Card key={size} title={size === "default" ? "Default" : "Compact"}>
          <Sample args={{ ...args, size }} />
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
  const input = React.useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = React.useState("");
  const matches = names.filter((n) =>
    n.toLowerCase().includes(args.query.toLowerCase())
  );
  return (
    <section className="p-5">
      <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        Contacts
      </h3>
      <p className="m-0 mt-1 mb-4 text-sm text-[var(--v2-text-secondary,#5E5E5E)]">
        Find someone in your workspace.
      </p>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[var(--v2-text-primary,#484848)]"
      >
        Search contacts
      </label>
      <Input
        ref={input}
        id={id}
        type="search"
        placeholder="Search by name"
        value={args.query}
        onChange={(e) => {
          update({ query: e.target.value });
          setFeedback("");
        }}
      />
      {matches.length ? (
        <ul aria-label="Matching contacts" className="m-0 mt-4 list-none p-0">
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
          onAction={(action) => {
            if (action === args.primaryLabel) {
              update({ query: "" });
              setFeedback("Search cleared. All 3 contacts are shown.");
            } else {
              update({ query: "Mira" });
              setFeedback("Showing contacts named Mira.");
            }
            input.current?.focus();
          }}
        />
      )}
      <p role="status" className="m-0 mt-4 text-sm text-semantic-text-muted">
        {feedback ||
          (matches.length
            ? matches.length + " contacts found"
            : "No contacts found")}
      </p>
    </section>
  );
}
export const Usage: Story = {
  args: {
    query: "Unmatched",
    iconType: "none",
    illustration: "no-results",
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox", { name: "Search contacts" });
    await step("An unmatched search offers recovery", async () => {
      await expect(canvas.getByText("No matching contacts")).toBeVisible();
      await expect(
        canvas.queryByRole("list", { name: "Matching contacts" })
      ).not.toBeInTheDocument();
    });
    await step("Clearing restores results and search focus", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Clear search" })
      );
      await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
      await expect(input).toHaveValue("");
      await expect(input).toHaveFocus();
      await expect(canvas.getByRole("status")).toHaveTextContent(
        "All 3 contacts are shown"
      );
    });
    await step("A new search filters the restored list", async () => {
      await userEvent.type(input, "Mira");
      await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
      await expect(canvas.getByText("Mira Shah")).toBeVisible();
    });
  },
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: {
    title: "Setup Calling API",
    actionCount: 2,
    primaryLabel: "Generate credentials",
    secondaryLabel: "Setup guide",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Clicks and keyboard-activates each action and checks which label it reports. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const primary = canvas.getByRole("button", {
      name: "Generate credentials",
    });
    const secondary = canvas.getByRole("button", { name: "Setup guide" });

    await step("Shows the message and both actions", async () => {
      await expect(canvas.getByText("Setup Calling API")).toBeVisible();
      await expect(canvas.getAllByRole("button")).toHaveLength(2);
    });

    await step("Each click reports its own action", async () => {
      await userEvent.click(primary);
      await expect(args.onAction).toHaveBeenLastCalledWith(
        "Generate credentials"
      );
      await userEvent.click(secondary);
      await expect(args.onAction).toHaveBeenLastCalledWith("Setup guide");
      await expect(args.onAction).toHaveBeenCalledTimes(2);
    });

    await step("Tab, Enter and Space work from the keyboard", async () => {
      primary.focus();
      await userEvent.keyboard("{Enter}");
      await expect(args.onAction).toHaveBeenNthCalledWith(
        3,
        "Generate credentials"
      );
      await userEvent.tab();
      await expect(secondary).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(args.onAction).toHaveBeenNthCalledWith(4, "Setup guide");
      await expect(args.onAction).toHaveBeenCalledTimes(4);
    });
  },
};
