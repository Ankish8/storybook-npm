/** A single tab option in the plan tab selector */
export interface PricingToggleTab {
  /** Display label for the tab */
  label: string;
  /** Unique value identifier for the tab */
  value: string;
}

export interface PricingToggleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of tab options for the plan type selector */
  tabs: PricingToggleTab[];
  /** Currently active tab value (controlled) */
  activeTab: string;
  /** Callback when the active tab changes */
  onTabChange: (value: string) => void;
  /** Whether to show the billing period toggle below the tabs */
  showBillingToggle?: boolean;
  /** Current billing period — "monthly" or "yearly" (controlled) */
  billingPeriod?: "monthly" | "yearly";
  /** Callback when the billing period changes */
  onBillingPeriodChange?: (period: "monthly" | "yearly") => void;
  /** Left label for the billing toggle (default: "Monthly") */
  monthlyLabel?: string;
  /** Right label for the billing toggle (default: "Yearly (Save 20%)") */
  yearlyLabel?: string;
}
