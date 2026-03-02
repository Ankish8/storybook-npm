import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { RefreshCw, CreditCard, Landmark, CreditCard as WalletIcon, Building2, ChevronDown } from "lucide-react";
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
  title: "Custom/Plan & Payment/AutoPaySetup",
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

// Defined at module scope so React never remounts it on parent re-renders
const CollapsiblePanel = ({
  icon,
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border border-semantic-border-layout rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-[var(--color-neutral-50)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-[10px] bg-[var(--semantic-info-surface)] shrink-0">
            {icon}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.01px]">
              {title}
            </span>
            <span className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
              {subtitle}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`size-4 text-semantic-text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: height !== undefined ? `${height}px` : undefined }}
      >
        <div ref={contentRef} className="border-t border-semantic-border-layout px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Demonstrates the exclusive accordion pattern used on the Plan & Payment page.
 *
 * Only one panel can be open at a time — clicking a collapsed panel expands it
 * and collapses the currently open one. This is achieved by lifting `openSection`
 * state to the parent and using the `open` + `onOpenChange` controlled props.
 *
 * **WABA integration guide:**
 * ```tsx
 * const [openSection, setOpenSection] = useState<string>("instant-topup");
 * const toggle = (id: string) =>
 *   setOpenSection(prev => prev === id ? "" : id);
 *
 * <InstantTopUp
 *   open={openSection === "instant-topup"}
 *   onToggle={() => toggle("instant-topup")}
 * />
 * <AutoPaySetup
 *   open={openSection === "auto-pay"}
 *   onOpenChange={(open) => setOpenSection(open ? "auto-pay" : "")}
 * />
 * <BankDetails
 *   open={openSection === "bank-details"}
 *   onToggle={() => toggle("bank-details")}
 * />
 * ```
 */
export const ExclusiveAccordion: Story = {
  name: "Exclusive accordion (Plan & Payment)",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: "480px" }}>
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [openSection, setOpenSection] = useState<string>("instant-topup");
    const toggle = (id: string) =>
      setOpenSection((prev) => (prev === id ? "" : id));

    return (
      <div className="flex flex-col gap-3">
        {/* Panel 1: Instant wallet top-up (WABA app component, shown here as mock) */}
        <CollapsiblePanel
          icon={<WalletIcon className="size-5 text-semantic-primary" />}
          title="Instant wallet top-up"
          subtitle="Add funds to your account balance"
          isOpen={openSection === "instant-topup"}
          onToggle={() => toggle("instant-topup")}
        >
          <div className="flex flex-col gap-3">
            <p className="m-0 text-xs text-semantic-text-muted">Select Amount</p>
            <div className="flex gap-2">
              <div className="flex-1 border border-semantic-border-input-focus rounded px-3 py-2 text-sm text-center text-semantic-text-primary">₹1,000</div>
              <div className="flex-1 border border-semantic-border-input rounded px-3 py-2 text-sm text-center text-semantic-text-muted">₹5,000</div>
            </div>
            <p className="m-0 text-xs text-semantic-text-muted">Custom Amount</p>
            <div className="border border-semantic-border-input rounded px-3 py-2 text-sm text-semantic-text-placeholder">Enter amount</div>
          </div>
        </CollapsiblePanel>

        {/* Panel 2: Auto-pay setup — uses open/onOpenChange from this library */}
        <AutoPaySetup
          icon={<RefreshCw className="size-5 text-semantic-primary" />}
          open={openSection === "auto-pay"}
          onOpenChange={(open) => setOpenSection(open ? "auto-pay" : "")}
        />

        {/* Panel 3: Bank details (WABA app component, shown here as mock) */}
        <CollapsiblePanel
          icon={<Building2 className="size-5 text-semantic-primary" />}
          title="Bank details"
          subtitle="Direct NEFT/RTGS transfer"
          isOpen={openSection === "bank-details"}
          onToggle={() => toggle("bank-details")}
        >
          <div className="flex flex-col gap-3">
            {[
              ["Account holder's name", "MyOperator Test Account"],
              ["Account Number", "MOCK1234567890"],
              ["IFSC Code", "MOCK0001234"],
              ["A/C type", "Current account"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-semantic-text-muted">{label}</span>
                <span className="text-sm text-semantic-text-primary">{value}</span>
              </div>
            ))}
          </div>
        </CollapsiblePanel>
      </div>
    );
  },
};

export const ActiveSubscription: Story = {
  name: "Active Subscription",
  args: {
    icon: <RefreshCw className="size-5 text-semantic-primary" />,
    title: "Recurring payment setup",
    bodyText: (
      <p className="m-0">
        Your MyOperator account is currently subscribed for monthly recurring
        payments. If you wish to edit or discontinue the payment method, kindly
        write to us at{" "}
        <a
          href="mailto:support@myoperator.co"
          className="text-semantic-text-link underline"
        >
          support@myoperator.co
        </a>
        .
      </p>
    ),
    noteLabel: "",
    noteText:
      "For card-based subscriptions, your card will be charged a minimum of ₹1 every month (even if there is no usage) to keep the subscription active, and ₹1 will be added as prepaid amount for your service. An initial deduction of ₹5 will be made for subscription, which will be auto-refunded.",
    ctaText: "Edit subscription",
    ctaVariant: "outline",
  },
};
