import * as React from "react";

export type BillingCycleOptionIcon = "clock" | "calendar" | React.ReactNode;

/**
 * A selectable billing cycle option shown inside PlanUpgradeModal.
 */
export interface BillingCycleOption {
  /** Unique identifier for the option */
  id: string;
  /** Option label text */
  label: string;
  /** Optional icon key or custom icon node */
  icon?: BillingCycleOptionIcon;
}

export interface PlanUpgradeModalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Title shown at the top of the modal */
  title?: string;
  /** Description shown below the title */
  description?: string;
  /** Options to select from */
  options?: BillingCycleOption[];
  /** Controlled selected option id */
  selectedOptionId?: string;
  /** Uncontrolled selected option id */
  defaultSelectedOptionId?: string;
  /** Called when an option is selected */
  onOptionChange?: (optionId: string) => void;
  /** Next button label */
  nextLabel?: string;
  /** Called when Next is clicked */
  onNext?: (selectedOptionId: string) => void;
  /** Shows loading spinner on the Next button and disables it */
  loading?: boolean;
  /** Called when close button is clicked */
  onClose?: () => void;
}
