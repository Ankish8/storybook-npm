import * as React from "react";

/**
 * A single feature row in the plan detail table.
 */
export interface PlanFeature {
  /** Feature name (e.g., "WhatsApp Service") */
  name: string;
  /** Free allowance (e.g., "0 Message(s)") */
  free: string;
  /** Rate per unit (e.g., "₹ 0.86") */
  rate: string;
}

export interface PlanDetailModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Modal title */
  title?: string;
  /** List of features to display in the table */
  features?: PlanFeature[];
  /** Plan price label (e.g., "₹ 2,500.00/month") */
  planPrice?: string;
  /** Called when close button is clicked */
  onClose?: () => void;
}
