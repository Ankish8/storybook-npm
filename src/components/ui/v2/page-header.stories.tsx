import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Webhook, Plus, Info, Settings } from "lucide-react";
import { PageHeader, type PageHeaderProps } from "./page-header";
import { PageHeader as PageHeaderV1 } from "../page-header";
import { Button } from "./button";
import { Button as ButtonV1 } from "../button";
import { Badge } from "./badge";
import { Badge as BadgeV1 } from "../badge";
import { Input } from "./input";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = Omit<PageHeaderProps, "icon" | "badge" | "infoIcon" | "actions"> & {
  showIcon: boolean;
  showBadge: boolean;
  badgeLabel: string;
  showInfo: boolean;
  actionCount: number;
  actionDisabled: boolean;
  onAction: (label: string) => void;
};
const labels = ["Add webhook", "Settings", "Export", "Archive"];
function Sample({
  args,
  version = "v2",
  onAction,
}: {
  args: Args;
  version?: "v1" | "v2";
  onAction?: (label: string) => void;
}) {
  const UI = version === "v1" ? PageHeaderV1 : PageHeader;
  const Action = version === "v1" ? ButtonV1 : Button;
  const Status = version === "v1" ? BadgeV1 : Badge;
  return (
    <UI
      title={args.title}
      description={args.description}
      showBackButton={args.showBackButton}
      onBackClick={() => args.onBackClick?.()}
      showBorder={args.showBorder}
      layout={args.layout}
      mobileOverflowLimit={args.mobileOverflowLimit}
      className={version === "v1" ? "font-sans" : args.className}
      icon={args.showIcon ? <Webhook /> : undefined}
      badge={
        args.showBadge ? (
          <Status variant="outline">{args.badgeLabel}</Status>
        ) : undefined
      }
      infoIcon={
        args.showInfo ? (
          <span aria-label="Webhook information">
            <Info />
          </span>
        ) : undefined
      }
      actions={
        args.actionCount > 0 ? (
          <>
            {labels.slice(0, args.actionCount).map((label, index) => (
              <Action
                key={label}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                disabled={args.actionDisabled}
                leftIcon={
                  index === 0 ? (
                    <Plus />
                  ) : index === 1 ? (
                    <Settings />
                  ) : undefined
                }
                onClick={() => {
                  args.onAction(label);
                  onAction?.(label);
                }}
              >
                {label}
              </Action>
            ))}
          </>
        ) : undefined
      }
    />
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: [
        "title",
        "description",
        "layout",
        "showBorder",
        "showBackButton",
        "onBackClick",
        "mobileOverflowLimit",
        "showIcon",
        "showBadge",
        "badgeLabel",
        "showInfo",
        "actionCount",
        "actionDisabled",
        "onAction",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "page-header",
          exportName: "PageHeader",
          summary:
            "Page titles with descriptions, back navigation, optional badges and responsive actions.",
          changes: [
            ["Title", "18px semibold", "16px medium Inter"],
            ["Description", "14px body", "12px muted Inter"],
            [
              "Padding",
              "16px with 18px desktop vertical override",
              "16px on all sides at every breakpoint",
            ],
            [
              "Actions",
              "v1 Button",
              "v2 Button; existing overflow behavior retained",
            ],
            [
              "Layouts",
              "Horizontal, vertical, responsive",
              "Same layout and mobileOverflowLimit API",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["Title", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Description", "--semantic-text-muted", "#717680", "#717680"],
            ["Divider", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Type", "--font-v2", "Title 16/500, description 12/400"],
          ],
          guidance:
            "Keep the title short. Horizontal keeps actions inline; vertical stacks them and supports an expandable overflow row at every width. Responsive uses the viewport breakpoint: use Storybook's Viewport toolbar to inspect its mobile behavior. The composed icon, badge and action controls configure slots rather than adding PageHeader API props.",
        }),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full rounded-lg border border-semantic-border-layout bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Webhooks",
    description: "Manage your webhook integrations",
    layout: "responsive",
    showBorder: true,
    showBackButton: false,
    mobileOverflowLimit: 2,
    showIcon: true,
    showBadge: false,
    badgeLabel: "Active",
    showInfo: false,
    actionCount: 1,
    actionDisabled: false,
    onBackClick: fn(),
    onAction: fn(),
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    layout: {
      control: "select",
      options: ["horizontal", "vertical", "responsive"],
    },
    showBorder: { control: "boolean" },
    showBackButton: { control: "boolean" },
    mobileOverflowLimit: {
      control: { type: "number", min: 1, max: 4, step: 1 },
    },
    onBackClick: { control: false },
    showIcon: { control: "boolean", table: { category: "Example" } },
    showBadge: { control: "boolean", table: { category: "Example" } },
    badgeLabel: { control: "text", table: { category: "Example" } },
    showInfo: { control: "boolean", table: { category: "Example" } },
    actionCount: {
      control: { type: "number", min: 0, max: 4, step: 1 },
      table: { category: "Example" },
    },
    actionDisabled: { control: "boolean", table: { category: "Example" } },
    onAction: { control: false, table: { category: "Example" } },
  },
  render: (args) => <Sample args={args} />,
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const HeaderWithActions: Story = { args: { actionCount: 2 } };
export const HeaderWithBackButton: Story = {
  args: {
    showBackButton: true,
    title: "Edit webhook",
    description: "Update the webhook settings",
    actionCount: 2,
  },
};
export const MultipleActions: Story = { args: { actionCount: 4 } };
export const HorizontalLayout: Story = {
  args: { layout: "horizontal", actionCount: 2 },
};
export const VerticalLayout: Story = {
  args: { layout: "vertical", actionCount: 4 },
};
export const MobileView: Story = {
  args: { layout: "vertical", actionCount: 4, mobileOverflowLimit: 1 },
  parameters: {
    docs: {
      description: {
        story:
          "Uses vertical layout to show the existing overflow interaction at any preview width. Use the viewport toolbar for the actual responsive mobile breakpoint.",
      },
    },
  },
};
export const LongTitle: Story = {
  args: {
    title: "Webhook integrations for customer support and campaign delivery",
    description:
      "Descriptions can wrap across two lines while actions keep their existing responsive layout.",
    actionCount: 2,
  },
};
export const WithoutActions: Story = { args: { actionCount: 0 } };
export const WithBadgeAndInfo: Story = {
  args: { showBadge: true, showInfo: true },
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
      <div className="rounded-lg border border-semantic-border-layout">
        {children}
      </div>
    </section>
  );
}
export const AllVariations: Story = {
  name: "All layouts",
  args: { actionCount: 3 },
  parameters: gallery(
    ["layout"],
    "Horizontal, Vertical and Responsive layouts are fixed. Title, slots, actions, borders and overflow controls apply to every sample. Responsive follows the actual viewport."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-5">
      {(["horizontal", "vertical", "responsive"] as const).map((layout) => (
        <Card key={layout} title={layout}>
          <Sample args={{ ...args, layout }} />
        </Card>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["actionDisabled", "actionCount"],
    "Default, Disabled actions and No actions are fixed. Other controls apply to all three headers."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-5">
      {["Default", "Disabled actions", "No actions"].map((state) => (
        <Card key={state} title={state}>
          <Sample
            args={{
              ...args,
              actionCount: state === "No actions" ? 0 : 2,
              actionDisabled: state === "Disabled actions",
            }}
          />
        </Card>
      ))}
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    ["layout"],
    "All three layouts are paired between v1 and v2. Current action, content, badge, border and overflow controls remain live."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1100px] grid-cols-2 gap-4">
        {(["horizontal", "vertical", "responsive"] as const).flatMap((layout) =>
          (["v1", "v2"] as const).map((version) => (
            <Card key={layout + version} title={version + " · " + layout}>
              <Sample args={{ ...args, layout }} version={version} />
            </Card>
          ))
        )}
      </div>
    </div>
  ),
};
function WebhookExample({ args }: { args: Args }) {
  const [creating, setCreating] = React.useState(false);
  const [name, setName] = React.useState("");
  const [items, setItems] = React.useState(["Support inbox events"]);
  const [action, setAction] = React.useState("");
  return (
    <section>
      <Sample
        args={args}
        onAction={(label) => {
          setAction(label);
          if (label === "Add webhook") setCreating(true);
        }}
      />
      <div className="p-5">
        <p className="m-0 text-xs text-semantic-text-muted">
          Actions below run locally. Add webhook opens a form and saves a new
          list item.
        </p>
        {creating && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) {
                setItems((previous) => [...previous, name.trim()]);
                setName("");
                setCreating(false);
              }
            }}
            className="my-4 flex flex-wrap items-end gap-3"
          >
            <div className="min-w-[220px] flex-1">
              <label
                htmlFor="header-webhook-name"
                className="mb-2 block text-sm font-medium"
              >
                Webhook name
              </label>
              <Input
                id="header-webhook-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              type="submit"
              disabled={args.actionDisabled || !name.trim()}
            >
              Save webhook
            </Button>
          </form>
        )}
        <ul className="m-0 mt-4 list-none p-0">
          {items.map((item, index) => (
            <li
              key={item + index}
              className="border-b border-semantic-border-layout py-3 text-sm text-semantic-text-primary"
            >
              {item}
            </li>
          ))}
        </ul>
        {action && (
          <p className="m-0 mt-4 text-xs text-semantic-text-muted">
            Last action: {action}
          </p>
        )}
      </div>
    </section>
  );
}
export const Usage: Story = {
  args: { actionCount: 2 },
  render: (args) => <WebhookExample args={args} />,
};
export const DosAndDonts: Story = {
  name: "Long-content guidance",
  args: {
    title: "A concise page title",
    description:
      "Use description for supporting detail, keeping the main title readable.",
    showBadge: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Edit both text controls to check real wrapping and truncation. Keep actions brief and use vertical layout when a narrow viewport cannot fit an inline action row.",
      },
    },
  },
};
export const Accessibility: Story = {
  args: { showBackButton: true },
  parameters: {
    docs: {
      description: {
        story:
          "Back navigation keeps its accessible Back label. Action buttons retain their own names. Use keyboard Tab and Enter/Space to exercise buttons; the expandable overflow trigger exposes aria-expanded.",
      },
    },
  },
};
