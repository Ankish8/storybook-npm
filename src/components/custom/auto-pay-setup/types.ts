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
  /** Description content displayed below the header when expanded. Accepts a string or JSX (e.g. text with a link). */
  bodyText?: React.ReactNode;

  // Note callout
  /** Note/callout text displayed in a highlighted box */
  noteText?: string;
  /** Label prefix for the note (e.g., "Note:") */
  noteLabel?: string;

  // CTA
  /** Whether to show the CTA button (defaults to true) */
  showCta?: boolean;
  /** Text for the CTA button (defaults to "Enable Auto-Pay") */
  ctaText?: string;
  /** CTA button variant — use "outline" for the subscribed "Edit subscription" state */
  ctaVariant?: "default" | "outline";
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
  /** Whether the CTA button shows loading state */
  loading?: boolean;
  /** Whether the CTA button is disabled */
  disabled?: boolean;

  // Accordion
  /** Whether the accordion is open by default (uncontrolled) */
  defaultOpen?: boolean;
  /** Controlled open state — use with onOpenChange for exclusive accordion behavior */
  open?: boolean;
  /** Callback fired when the panel is toggled — receives new open state */
  onOpenChange?: (open: boolean) => void;

  // Styling
  /** Additional className for the root element */
  className?: string;
}
