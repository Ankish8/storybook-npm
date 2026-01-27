import * as React from "react";

/**
 * A single row of bank detail information.
 */
export interface BankDetailItem {
  /** Label text displayed on the left (e.g., "Account Number") */
  label: string;
  /** Value text displayed on the right (e.g., "2223330026552601") */
  value: string;
  /** Whether to show a copy-to-clipboard button for this item's value */
  copyable?: boolean;
}

/**
 * Props for the BankDetails component
 */
export interface BankDetailsProps {
  // Header
  /** Title displayed in the accordion header */
  title?: string;
  /** Subtitle displayed below the title */
  subtitle?: string;
  /** Icon displayed in the header (rendered inside a rounded container) */
  icon?: React.ReactNode;

  // Data
  /** Array of bank detail items to display */
  items: BankDetailItem[];

  // Accordion
  /** Whether the accordion is open by default */
  defaultOpen?: boolean;

  // Callbacks
  /** Callback fired when a value is copied to clipboard */
  onCopy?: (item: BankDetailItem) => void;

  // Styling
  /** Additional className for the root element */
  className?: string;
}
