import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Check,
  CircleAlert,
  CircleCheck,
  FileCheck2,
  Layers,
} from "lucide-react";
import { gallery } from "../../../storybook/v2-preview";
import { Badge, type BadgeProps } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
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
      include: ["variant", "size", "children", "dot", "leftIcon", "rightIcon"],
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
              "sm 22 · default 26 · lg 30px",
            ],
            ["Radius", "Full pill", "25px, matching the v2 pill"],
            [
              "Label",
              "Inherited, 14px medium (12px sm)",
              "v2 font token, 12px medium (11px sm, 14px lg)",
            ],
            ["Icon gap", "4px", "5px (4px sm)"],
            [
              "Status dot",
              "—",
              "Optional dot: 7px circle before the label in the variant's text colour",
            ],
            [
              "Borders",
              "Only outline has a border",
              "1px semantic status borders; disabled none",
            ],
            [
              "Status text",
              "Bright action colors",
              "Darker status text for active, failed and warning",
            ],
            ["Secondary", "Grey surface", "Teal surface with teal border"],
            [
              "Content changes",
              "Instant update",
              "Short label and icon swap with an intrinsic width spring; reduced motion settles immediately",
            ],
            ["Hover", "No visual change", "No tint, movement, or animation"],
          ],
          tokens: [
            ["Default surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            [
              "Default border",
              "--semantic-border-layout",
              "#E9EAEB",
              "#E9EAEB",
            ],
            ["Default text", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
            ["Info surface", "--semantic-info-surface", "#ECF1FB", "#ECF1FB"],
            ["Info text", "--semantic-info-text", "#2F5398", "#2F5398"],
            ["Info border", "--semantic-info-border", "#A8C0EC", "#A8C0EC"],
            [
              "Active surface",
              "--semantic-success-surface",
              "#ECFDF3",
              "#ECFDF3",
            ],
            [
              "Active border",
              "--semantic-success-border",
              "#75E0A7",
              "#75E0A7",
            ],
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
            ["Status dot", "currentColor", "The variant's text colour"],
            ["Font", "--font-v2", "Timeless Sans, Inter, sans-serif · 500"],
          ],
          guidance:
            "Use a status word as well as color. Icons and the optional dot are decorative (aria-hidden). Badges stay quiet on hover; a change of string/number label or icon component/key gets a short transition. Re-rendering the same icon and passive font/size changes stay still. Reduced motion shows the current state immediately. Use a Button for actions. Native props, refs, variant/size defaults, and the `information` API name remain compatible with v1. `asChild` applies styles to one existing element and ignores the separate dot/icon props; put its content inside the child. Put a changing status in a polite live region only when it needs to be announced. References: [Arc](https://uiarc.dev/components/badge), [HeroUI Chip](https://heroui.com/en/docs/react/components/chip), and [shadcn](https://ui.shadcn.com/docs/components/radix/badge).",
        }),
      },
    },
  },
  tags: ["autodocs"],
  args: {
    variant: "default",
    size: "default",
    children: "Badge",
    dot: false,
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
      description: "Small 22px, default 26px, or large 30px.",
    },
    children: { control: "text", description: "Short status label." },
    dot: {
      control: "boolean",
      description:
        "Leading 7px status dot in the variant's text colour. Not rendered with asChild.",
    },
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

function ReviewWorkflowDemo({ size }: Pick<BadgeProps, "size">) {
  const [status, setStatus] = React.useState<
    "ready" | "approved" | "attention"
  >("ready");
  const [autoApprove, setAutoApprove] = React.useState(false);
  const autoApproveId = React.useId();

  React.useEffect(() => {
    if (!autoApprove || status === "approved") return;
    const timeout = window.setTimeout(() => setStatus("approved"), 1600);
    return () => window.clearTimeout(timeout);
  }, [autoApprove, status]);

  const current = {
    ready: {
      label: "Ready",
      variant: "information" as const,
      icon: <CircleCheck />,
      description: "The review is ready for approval.",
    },
    approved: {
      label: "Approved",
      variant: "active" as const,
      icon: <Check />,
      description: "The component is approved for this release.",
    },
    attention: {
      label: "Needs attention",
      variant: "warning" as const,
      icon: <CircleAlert />,
      description:
        "The review was reopened. Check the changes before approving.",
    },
  }[status];

  return (
    <section
      aria-label="Component review"
      className="w-[520px] max-w-full overflow-hidden rounded-2xl border border-semantic-border-layout bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-semantic-border-layout px-6 py-4">
        <p className="m-0 text-sm font-medium text-semantic-text-primary">
          Component review
        </p>
        <Badge variant="secondary" size="sm" leftIcon={<Layers />}>
          Design system
        </Badge>
      </div>
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-semantic-bg-ui text-semantic-text-secondary">
              <FileCheck2 className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="m-0 text-base font-medium text-semantic-text-primary">
                Status labels
              </p>
              <p className="m-0 mt-1 text-xs text-semantic-text-muted">
                Badge · Feedback and metadata
              </p>
            </div>
          </div>
          <div role="status" aria-live="polite" aria-atomic="true">
            <Badge
              variant={current.variant}
              size={size}
              leftIcon={current.icon}
            >
              {current.label}
            </Badge>
          </div>
        </div>
        <p className="m-0 min-h-10 text-sm leading-5 text-semantic-text-secondary">
          {autoApprove && status !== "approved"
            ? "Auto-approval is queued. You can turn it off before the review completes."
            : current.description}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="sm"
            leftIcon={<Check />}
            disabled={status === "approved"}
            onClick={() => setStatus("approved")}
          >
            Approve
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={status !== "approved"}
            onClick={() => {
              setAutoApprove(false);
              setStatus("attention");
            }}
          >
            Reopen review
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2.5 border-t border-semantic-border-layout bg-semantic-bg-subtle px-6 py-4">
        <Checkbox
          id={autoApproveId}
          checked={autoApprove}
          onCheckedChange={(checked) => setAutoApprove(checked === true)}
        />
        <label
          htmlFor={autoApproveId}
          className="cursor-pointer text-sm text-semantic-text-secondary"
        >
          Auto-approve
        </label>
      </div>
    </section>
  );
}

export const ReviewWorkflow: Story = {
  name: "Review workflow",
  parameters: gallery(
    ["variant", "children", "leftIcon", "rightIcon", "dot"],
    "Approve the review or enable auto-approve. Reopen review changes the status to Needs attention and cancels automatic approval. Status text and icons update together; the Design system category stays still."
  ),
  render: ({ size }) => <ReviewWorkflowDemo size={size} />,
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
          <span className="text-xs text-[var(--v2-text-muted,var(--semantic-text-muted))]">
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
          <span className="text-xs text-[var(--v2-text-muted,var(--semantic-text-muted))]">
            {size} · {size === "sm" ? 22 : size === "lg" ? 30 : 26}px
          </span>
          <Badge {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};
export const WithDot: Story = {
  name: "With dot",
  args: { variant: "active", children: "Online", dot: true },
};
export const Dot: Story = {
  parameters: gallery(
    ["variant", "dot"],
    "Every palette with the 7px dot. The dot always matches the variant's text colour. Size and label stay editable."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-start gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col items-start gap-2">
          <span className="text-xs text-[var(--v2-text-muted,var(--semantic-text-muted))]">
            {LABELS[variant]}
          </span>
          <Badge {...args} variant={variant} dot />
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
        {["Small · 22px", "Default · 26px", "Large · 30px"].map((label) => (
          <div
            key={label}
            className="text-xs font-medium text-[var(--v2-text-muted,var(--semantic-text-muted))]"
          >
            {label}
          </div>
        ))}
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="text-xs font-medium text-[var(--v2-text-secondary,var(--semantic-text-secondary))]">
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
  render: function Render(args) {
    // `dot` is v2-only: v1 would write it to the DOM as an unknown attribute.
    const { dot: _dot, ...v1Args } = args;
    return (
      <div className="max-w-full overflow-x-auto">
        <div className="grid min-w-[820px] grid-cols-[110px_1fr_1fr] items-center gap-x-8 gap-y-4">
          <div />
          <div className="text-xs font-medium text-[var(--v2-text-muted,var(--semantic-text-muted))]">
            v1 (ui/badge)
          </div>
          <div className="text-xs font-medium text-[var(--v2-text-muted,var(--semantic-text-muted))]">
            v2 (ui/v2/badge)
          </div>
          {VARIANTS.map((variant) => (
            <React.Fragment key={variant}>
              <div className="text-xs font-medium text-[var(--v2-text-secondary,var(--semantic-text-secondary))]">
                {LABELS[variant]}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {SIZES.map((size) => (
                  <BadgeV1
                    {...v1Args}
                    key={size}
                    variant={variant}
                    size={size}
                  />
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
    );
  },
};

export const Usage: Story = {
  parameters: gallery(
    ["variant", "children"],
    "Status words and palettes are fixed to the example. Controls update the badge size and icons."
  ),
  render: (args) => (
    <div className="flex w-[420px] max-w-full flex-col gap-5 rounded-lg border border-semantic-border-layout p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]">
      <div>
        <p className="m-0 text-base font-medium text-[var(--v2-text-primary,var(--semantic-text-primary))]">
          AI bots
        </p>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,var(--semantic-text-muted))]">
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
            <p className="m-0 text-sm font-medium text-[var(--v2-text-primary,var(--semantic-text-primary))]">
              {bot.name}
            </p>
            <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,var(--semantic-text-muted))]">
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
    ["leftIcon", "rightIcon", "dot"],
    "Radix Slot applies the badge styles to the link. Edit its label, palette and size."
  ),
  render: ({
    children,
    leftIcon: _left,
    rightIcon: _right,
    dot: _dot,
    ...args
  }) => (
    <Badge {...args} asChild>
      <a
        href="#storybook-root"
        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-border-focus"
      >
        {children}
      </a>
    </Badge>
  ),
};
