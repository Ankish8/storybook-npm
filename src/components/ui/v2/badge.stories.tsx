import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Check } from "lucide-react";
import { gallery } from "../../../storybook/v2-preview";
import { Badge } from "./badge";
import { Badge as BadgeV1 } from "../badge";
import { v2ComponentDocs } from "./story-docs";

const VARIANTS = [
  "default",
  "primary",
  "outline",
  "disabled",
  "information",
  "active",
  "failed",
  "warning",
  "destructive",
  "secondary",
] as const;
const SIZES = ["sm", "default", "lg"] as const;
const LABELS = {
  default: "Default",
  primary: "Primary",
  outline: "Outline",
  disabled: "Disabled",
  information: "Info",
  active: "Active",
  failed: "Failed",
  warning: "Warning",
  destructive: "Destructive",
  secondary: "Secondary",
};
const meta: Meta<typeof Badge> = {
  title: "V2/Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    controls: {
      include: ["variant", "size", "children", "leftIcon", "rightIcon"],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-6748",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "badge",
          summary:
            "Badges show a short status or category without competing with the main content.",
          changes: [
            [
              "Heights",
              "Content and padding determine the height",
              "sm 20 · default 24 · lg 30px",
            ],
            ["Radius", "Full pill", "25px, matching the v2 pill"],
            [
              "Label",
              "Inherited, 14px medium (12px sm)",
              "Inter regular, 12px (14px lg)",
            ],
            ["Icon gap", "4px", "8px"],
            [
              "Borders",
              "Only outline has a border",
              "0.4px tinted borders; outline 1px; disabled none",
            ],
            [
              "Status text",
              "Bright action colors",
              "Darker status text for active, failed and warning",
            ],
            ["Secondary", "Grey surface", "Teal surface with teal border"],
            [
              "Info border",
              "None",
              "Black, matching the recorded v2 design exactly",
            ],
          ],
          tokens: [
            ["Default surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            [
              "Default border",
              "--semantic-border-layout",
              "#E9EAEB",
              "#E9EAEB",
            ],
            ["Default text", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Info surface", "--semantic-info-surface", "#ECF1FB", "#ECF1FB"],
            ["Info text", "--semantic-info-text", "#2F5398", "#2F5398"],
            ["Info border", "--color-black", "#000000", "#000000"],
            [
              "Active surface",
              "--semantic-success-surface",
              "#ECFDF3",
              "#ECFDF3",
            ],
            ["Active border", "--color-success-200", "#ABEFC6", "#ABEFC6"],
            ["Active text", "--semantic-success-text", "#067647", "#067647"],
            [
              "Failed surface",
              "--semantic-error-surface",
              "#FEF3F2",
              "#FEF3F2",
            ],
            ["Failed text", "--semantic-error-text", "#B42318", "#B42318"],
            [
              "Warning surface",
              "--semantic-warning-surface",
              "#FFFAEB",
              "#FFFAEB",
            ],
            ["Warning text", "--semantic-warning-text", "#B54708", "#B54708"],
            [
              "Secondary surface",
              "--semantic-brand-surface",
              "#EAF8FA",
              "#EAF8FA",
            ],
            [
              "Secondary border",
              "--semantic-border-accent",
              "#27ABB8",
              "#27ABB8",
            ],
            ["Font", "--font-v2", "Inter 400"],
          ],
          guidance:
            "Use a status word as well as color. Badges are informational by default; use a Button for actions. The `information` API name is unchanged. Use `asChild` only when the badge wraps an existing link.",
        }),
      },
    },
  },
  tags: ["autodocs"],
  args: {
    variant: "default",
    size: "default",
    children: "Badge",
    leftIcon: false,
    rightIcon: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
      description:
        "Status or visual style. The v1 variant names are preserved.",
    },
    size: {
      control: "select",
      options: SIZES,
      description: "Small 20px, default 24px, or large 30px.",
    },
    children: { control: "text", description: "Short status label." },
    leftIcon: {
      control: "boolean",
      description: "Optional icon before the label.",
      mapping: { true: <Check />, false: undefined },
    },
    rightIcon: {
      control: "boolean",
      description: "Optional icon after the label.",
      mapping: { true: <Check />, false: undefined },
    },
    asChild: {
      control: false,
      description:
        "Apply the badge styles to the child element with Radix Slot.",
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: { variant: "default", size: "default", children: "Badge" },
};
export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};
export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};
export const Disabled: Story = {
  args: { variant: "disabled", children: "Disabled" },
};
export const Information: Story = {
  args: { variant: "information", children: "Information" },
};
export const Active: Story = {
  args: { variant: "active", children: "Active" },
};
export const Failed: Story = {
  args: { variant: "failed", children: "Failed" },
};
export const Warning: Story = {
  args: { variant: "warning", children: "Warning" },
};
export const Destructive: Story = {
  args: { variant: "destructive", children: "Destructive" },
};
export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["variant"],
    "Compare palettes. Controls update the label, size and icons across all samples."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-start gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col items-start gap-2">
          <span className="text-xs text-semantic-text-muted">
            {LABELS[variant]}
          </span>
          <Badge {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  name: "All sizes",
  parameters: gallery(
    ["size"],
    "Compare heights. Controls update the same content and palette at every size."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-end gap-8">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-start gap-2">
          <span className="text-xs text-semantic-text-muted">
            {size} · {size === "sm" ? 20 : size === "lg" ? 30 : 24}px
          </span>
          <Badge {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};
export const WithIcons: Story = {
  name: "With icons",
  args: { variant: "active", children: "Published", leftIcon: true },
};
export const VariantsAndSizes: Story = {
  name: "Variants and sizes",
  args: { leftIcon: true, rightIcon: true },
  parameters: {
    ...gallery(
      ["variant", "size"],
      "All palettes and heights. Edit the content and icons using Controls."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[620px] grid-cols-[110px_repeat(3,minmax(140px,1fr))] items-center gap-x-6 gap-y-5">
        <div />
        {["Small · 20px", "Default · 24px", "Large · 30px"].map((label) => (
          <div
            key={label}
            className="text-xs font-semibold text-semantic-text-muted"
          >
            {label}
          </div>
        ))}
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="text-xs font-semibold text-semantic-text-secondary">
              {LABELS[variant]}
            </div>
            {SIZES.map((size) => (
              <div key={size}>
                <Badge
                  {...args}
                  variant={variant}
                  size={size}
                  data-v2-component="badge"
                  data-variant={variant}
                  data-size={size}
                />
              </div>
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
      ["variant", "size"],
      "The same content and icons rendered by both versions. Each row fixes the palette; each column includes all three sizes."
    ),
    layout: "padded",
  },
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[820px] grid-cols-[110px_1fr_1fr] items-center gap-x-8 gap-y-4">
        <div />
        <div className="text-xs font-semibold text-semantic-text-muted">
          v1 (ui/badge)
        </div>
        <div className="text-xs font-semibold text-semantic-text-muted">
          v2 (ui/v2/badge)
        </div>
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="text-xs font-semibold text-semantic-text-secondary">
              {LABELS[variant]}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {SIZES.map((size) => (
                <BadgeV1 {...args} key={size} variant={variant} size={size} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {SIZES.map((size) => (
                <Badge {...args} key={size} variant={variant} size={size} />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
};
export const Usage: Story = {
  parameters: gallery(
    ["variant", "children"],
    "Status words and palettes are fixed to the example. Controls update the badge size and icons."
  ),
  render: (args) => (
    <div className="flex w-[420px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div>
        <p className="m-0 text-base font-semibold text-semantic-text-primary">
          AI bots
        </p>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
          Status at a glance across your workspace.
        </p>
      </div>
      {[
        {
          name: "Customer support",
          type: "Chatbot",
          variant: "active" as const,
          status: "Published",
        },
        {
          name: "Appointment assistant",
          type: "Voicebot",
          variant: "warning" as const,
          status: "Unpublished",
        },
        {
          name: "Order tracking",
          type: "Chatbot",
          variant: "disabled" as const,
          status: "Inactive",
        },
      ].map((bot) => (
        <div
          key={bot.name}
          className="flex items-center justify-between gap-4 border-t border-semantic-border-layout pt-4"
        >
          <div className="min-w-0">
            <p className="m-0 text-sm font-semibold text-semantic-text-primary">
              {bot.name}
            </p>
            <p className="m-0 mt-1 text-xs text-semantic-text-muted">
              {bot.type}
            </p>
          </div>
          <Badge {...args} variant={bot.variant}>
            {bot.status}
          </Badge>
        </div>
      ))}
    </div>
  ),
};
export const AsLink: Story = {
  name: "As a link",
  args: { variant: "outline", children: "View status" },
  parameters: gallery(
    ["leftIcon", "rightIcon"],
    "Radix Slot applies the badge styles to the link. Edit its label, palette and size."
  ),
  render: ({ children, leftIcon: _left, rightIcon: _right, ...args }) => (
    <Badge {...args} asChild>
      <a href="#storybook-root">{children}</a>
    </Badge>
  ),
};
