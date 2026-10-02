import type { Meta, StoryObj } from "@storybook/react";
import { Home, Settings } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";
import {
  Breadcrumbs,
  type BreadcrumbItem,
  type BreadcrumbsProps,
} from "./breadcrumbs";
import { v2ComponentDocs } from "./story-docs";
import { gallery } from "../../../storybook/v2-preview";
const items = [
  { label: "Home", href: "#home" },
  { label: "Workspace", href: "#workspace" },
  { label: "Settings", href: "#settings" },
];
function notifyNavigate(
  handler: BreadcrumbsProps["onNavigate"],
  item: BreadcrumbItem,
  index: number
) {
  const log = handler as
    | ((destination: BreadcrumbItem, position: number) => void)
    | undefined;
  log?.({ label: item.label, href: item.href }, index);
}
const meta: Meta<typeof Breadcrumbs> = {
  title: "V2/Components/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: { include: ["items", "maxItems", "onNavigate"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2274-48709",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "breadcrumbs",
          hasV1: false,
          summary:
            "Ancestor links, a current page and optional overflow navigation.",
          changes: [
            ["Layout", "—", "Inline links, 2px gap, 34px link height"],
            ["Labels", "—", "14px Inter, 8px padding, 18px icons"],
          ],
          tokens: [
            ["Ancestor", "--semantic-text-secondary", "343E55", "#343E55"],
            ["Current", "--semantic-text-primary", "181D27", "#181D27"],
            ["Separator", "--semantic-text-muted", "717680", "#717680"],
          ],
          guidance:
            "Provide an ordered items array from root to current page. The final item is marked aria-current=page. maxItems collapses middle items into a menu; all destinations remain accessible.",
        }),
      },
    },
  },
  args: { items, maxItems: 4, onNavigate: fn() },
  argTypes: {
    items: { control: "object" },
    maxItems: { control: { type: "number", min: 3, max: 10 } },
  },
  render: (args) => (
    <Breadcrumbs
      {...args}
      onNavigate={(item, index, event) => {
        event.preventDefault();
        notifyNavigate(args.onNavigate, item, index);
      }}
    />
  ),
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const WithIcons: Story = {
  args: {
    items: [
      { ...items[0], icon: <Home /> },
      items[1],
      { ...items[2], icon: <Settings /> },
    ],
  },
  parameters: gallery(
    ["items"],
    "Icon composition is fixed. maxItems continues to control overflow."
  ),
};
export const MorePages: Story = {
  args: {
    items: [
      ...items,
      { label: "Integrations", href: "#integrations" },
      { label: "Webhooks", href: "#webhooks" },
    ],
    maxItems: 3,
  },
};
export const AllVariants: Story = {
  parameters: gallery(
    ["items"],
    "Default, icons and overflow examples. The maximum-items control applies to all rows."
  ),
  render: (args) => (
    <div className="w-[640px] max-w-full space-y-6">
      {[
        items,
        [{ ...items[0], icon: <Home /> }, ...items.slice(1)],
        [...items, { label: "Integrations" }, { label: "Webhooks" }],
      ].map((example, i) => (
        <section key={i} className="space-y-2">
          <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
            {["Default", "With icons", "More pages"][i]}
          </h3>
          <Breadcrumbs
            {...args}
            items={example}
            onNavigate={(item, index, event) => {
              event.preventDefault();
              notifyNavigate(args.onNavigate, item, index);
            }}
          />
        </section>
      ))}
    </div>
  ),
};
function Navigate(args: Parameters<NonNullable<Story["render"]>>[0]) {
  const [current, setCurrent] = useState(args.items.length - 1);
  return (
    <div className="w-[640px] max-w-full space-y-5">
      <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        Workspace settings
      </h3>
      <Breadcrumbs
        {...args}
        items={args.items.slice(0, Math.min(current + 1, args.items.length))}
        onNavigate={(item, index, event) => {
          event.preventDefault();
          setCurrent(index);
          notifyNavigate(args.onNavigate, item, index);
        }}
      />
      <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
        Current page:{" "}
        {args.items[Math.min(current, args.items.length - 1)]?.label || "None"}
      </p>
      <button
        type="button"
        className="text-sm text-semantic-text-link"
        onClick={() => setCurrent(args.items.length - 1)}
      >
        Restore path
      </button>
    </div>
  );
}
export const Usage: Story = {
  render: (args) => <Navigate key={JSON.stringify(args.items)} {...args} />,
};
