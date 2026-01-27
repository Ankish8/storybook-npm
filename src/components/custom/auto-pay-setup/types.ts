import * as React from "react";

/**
 * Props for the AutoPaySetup component
 */
export interface AutoPaySetupProps {
  // Header
  /** Title displayed in the accordion header */
  title?: string;
  /** Subtitle displayed below the title */
  subtitle?: string;
  /** Icon displayed in the header (rendered inside a rounded container) */
  icon?: React.ReactNode;

  // Body
  /** Description text displayed below the header when expanded */
  bodyText?: string;

  // Note callout
  /** Note/callout text displayed in a highlighted box */
  noteText?: string;
  /** Label prefix for the note (e.g., "Note:") */
  noteLabel?: string;

  // CTA
  /** Text for the CTA button (defaults to "Enable Auto-Pay") */
  ctaText?: string;
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
  /** Whether the CTA button shows loading state */
  loading?: boolean;
  /** Whether the CTA button is disabled */
  disabled?: boolean;

  // Accordion
  /** Whether the accordion is open by default */
  defaultOpen?: boolean;

  // Styling
  /** Additional className for the root element */
  className?: string;
}
