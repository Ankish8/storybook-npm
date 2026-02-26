import * as React from "react";

/**
 * Props for the TalkToUsModal component.
 */
export interface TalkToUsModalProps {
  /** Whether the modal is open */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Heading text (default: "Let's Talk!") */
  title?: string;
  /** Description text below the heading */
  description?: string;
  /** Custom icon element. Defaults to a phone icon in a circular badge */
  icon?: React.ReactNode;
  /** Label for the primary action button (default: "Contact support") */
  primaryActionLabel?: string;
  /** Label for the secondary action button (default: "Cancel") */
  secondaryActionLabel?: string;
  /** Callback when primary action button is clicked */
  onPrimaryAction?: () => void;
  /** Callback when secondary action button is clicked (also closes the modal) */
  onSecondaryAction?: () => void;
  /** Additional className for the dialog content */
  className?: string;
}
