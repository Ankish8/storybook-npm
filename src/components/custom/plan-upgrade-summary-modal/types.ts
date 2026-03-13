import * as React from "react";

export type PlanUpgradeSummaryMode = "upgrade" | "downgrade";

export type PlanUpgradeSummaryTone = "warning" | "success";

export interface PlanUpgradeSummaryRow {
  /** Label shown on the left side of the summary row */
  label: string;
  /** Value shown on the right side of the summary row */
  value: string;
}

export interface PlanUpgradeSummaryStatus {
  /** Highlighted title shown at the top of the summary panel */
  title: string;
  /** Optional supporting message shown below the status title */
  message?: string;
  /** Visual tone used for the status title and icon */
  tone?: PlanUpgradeSummaryTone;
}

export interface PlanUpgradeSummaryModalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Preset content mode for upgrade or downgrade flows */
  mode?: PlanUpgradeSummaryMode;
  /** Title shown at the top of the modal */
  title?: string;
  /** Supporting description below the title */
  description?: string;
  /** Status content shown inside the summary panel */
  status?: PlanUpgradeSummaryStatus;
  /** Summary rows shown above the total row */
  rows?: PlanUpgradeSummaryRow[];
  /** Label for the total row */
  totalLabel?: string;
  /** Value for the total row */
  totalValue?: string;
  /** Text for the cancel button */
  cancelLabel?: string;
  /** Text for the primary CTA button */
  primaryActionLabel?: string;
  /** Called when the primary CTA is clicked */
  onPrimaryAction?: () => void;
  /** Shows loading spinner on the primary CTA button */
  loading?: boolean;
  /** Disables the primary CTA button */
  disabled?: boolean;
  /** Called when the cancel button is clicked */
  onCancel?: () => void;
  /** Called when the close icon is clicked */
  onClose?: () => void;
  /** Accessible label for the close button */
  closeAriaLabel?: string;
}
