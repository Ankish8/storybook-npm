import type { Meta, StoryObj } from "@storybook/react";
import { RefreshCw, CreditCard, Landmark } from "lucide-react";
import { AutoPaySetup } from "./auto-pay-setup";

/**
 * ## Auto-Pay Setup
 *
 * A collapsible panel that explains recurring payment enrollment and provides
 * a CTA to enable auto-pay. Includes an informational note callout for
 * important billing details.
 *
 * ### Design Tokens
 *
 * | Token | CSS Variable | Usage |
 * |-------|--------------|-------|
 * | Info Surface | `--semantic-info-surface` | Header icon background |
 * | Text Primary | `--semantic-text-primary` | Title, body text, note label |
 * | Text Muted | `--semantic-text-muted` | Subtitle, note body text |
 * | Border Layout | `--semantic-border-layout` | Card border, content separator |
 * | Primary | `--semantic-primary` | CTA button background |
 * | Text Inverted | `--semantic-text-inverted` | CTA button text |
 * | Info 25 | `--semantic-info-25` | Note callout background |
 * | Info Border | `#BEDBFF` | Note callout border |
 *
 * ### Typography
 *
 * | Element | Font Size | Weight | Letter Spacing |
 * |---------|-----------|--------|----------------|
 * | Title | 14px | 600 (SemiBold) | 0.01px |
 * | Subtitle | 12px | 400 (Regular) | 0.048px |
 * | Body Text | 14px | 400 (Regular) | 0.035px |
 * | Note Label | 12px | 500 (Medium) | 0.048px |
 * | Note Body | 12px | 400 (Regular) | 0.048px |
 * | CTA Button | 14px | 500 (Medium) | — |
 *
 * ### Usage
 *
 * ```tsx
 * import { AutoPaySetup } from "@/components/custom/auto-pay-setup";
 * import { RefreshCw } from "lucide-react";
 *
 * <AutoPaySetup
 *   icon={<RefreshCw className="size-5 text-semantic-primary" />}
 *   onCtaClick={() => handleEnableAutoPay()}
 * />
 * ```
 */
const meta: Meta<typeof AutoPaySetup> = {
  title: "Custom/AutoPaySetup",
  component: AutoPaySetup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "440px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <RefreshCw className="size-5 text-semantic-primary" />,
  },
};

export const WithCustomIcon: Story = {
  name: "With Credit Card Icon",
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    title: "Card auto-pay",
    subtitle: "Automatic card billing",
  },
};

export const BankTransfer: Story = {
  name: "Bank Transfer Variant",
  args: {
    icon: <Landmark className="size-5 text-semantic-primary" />,
    title: "Bank auto-debit setup",
    subtitle: "Link your bank for automatic debits",
    bodyText:
      "Authorize your bank to automatically debit your account for monthly MyOperator bills. This ensures uninterrupted service.",
    noteText:
      "Your bank may take 2-3 business days to process the mandate registration. You will be notified once it is active.",
    ctaText: "Set Up Bank Auto-Debit",
  },
};

export const WithoutNote: Story = {
  args: {
    icon: <RefreshCw className="size-5 text-semantic-primary" />,
    noteText: "",
  },
};

export const WithoutIcon: Story = {
  args: {},
};

export const CustomCTA: Story = {
  args: {
    icon: <RefreshCw className="size-5 text-semantic-primary" />,
    ctaText: "Set Up Recurring Payments",
  },
};

export const Loading: Story = {
  args: {
    icon: <RefreshCw className="size-5 text-semantic-primary" />,
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: <RefreshCw className="size-5 text-semantic-primary" />,
    disabled: true,
  },
};

export const CollapsedByDefault: Story = {
  args: {
    icon: <RefreshCw className="size-5 text-semantic-primary" />,
    defaultOpen: false,
  },
};

export const CustomContent: Story = {
  name: "Fully Customized",
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    title: "Subscription auto-renewal",
    subtitle: "Never miss a payment",
    bodyText:
      "Enable automatic renewal for your MyOperator subscription. Your saved payment method will be charged at the start of each billing cycle.",
    noteLabel: "Important:",
    noteText:
      "You can cancel auto-renewal at any time from your account settings. No cancellation fees apply.",
    ctaText: "Enable Auto-Renewal",
  },
};
