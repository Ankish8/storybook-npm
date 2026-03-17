import * as React from "react";

/**
 * A single item in the expandable "Includes" details block (bold title + description).
 */
export interface LetUsDriveDetailsItem {
  /** Bold title (e.g., "Start Your Channels") */
  title: string;
  /** Description text (e.g., "Get help setting up your Call and WhatsApp channels.") */
  description: string;
}

/**
 * Content for the expandable "Show details" / "Hide details" section.
 * When provided, the card shows an "Includes:"-style block with checklist items.
 */
export interface LetUsDriveDetailsContent {
  /** Heading above the list (default: "Includes:") */
  heading?: string;
  /** Checklist items (title in bold, description in regular weight) */
  items: LetUsDriveDetailsItem[];
}

/**
 * Props for the LetUsDriveCard component. Modular and reusable across screens (e.g. managed services, add-on offerings, or any service card with pricing and expandable details).
 */
export interface LetUsDriveCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Service title (e.g., "Dedicated Onboarding", "Account Manager") */
  title: string;
  /** Price amount as formatted string (e.g., "20,000", "15,000") */
  price: string;
  /** Billing period label (e.g., "/one-time fee", "/month") */
  period?: string;
  /** Show "Starts at" prefix above the price */
  startsAt?: boolean;
  /** Billing frequency badge text (e.g., "Annually", "Quarterly") */
  billingBadge?: string;
  /** Service description text */
  description: string;
  /** When provided, price is shown with strikethrough and this label (e.g., "FREE") is displayed in green */
  freeLabel?: string;
  /** Text for the details link when collapsed (default: "Show details") */
  showDetailsLabel?: string;
  /** Text for the details link when expanded (default: "Hide details") */
  hideDetailsLabel?: string;
  /** CTA button text (default: "Talk to us") */
  ctaLabel?: string;
  /**
   * Expandable details content. When provided, the card shows "Show details" / "Hide details"
   * and an expandable "Includes:"-style block. Omit for link-only (onShowDetails callback only).
   */
  detailsContent?: LetUsDriveDetailsContent;
  /** Controlled expanded state for the details block (use with onExpandedChange) */
  expanded?: boolean;
  /** Callback when expanded state changes (for controlled mode / PricingPage accordion) */
  onExpandedChange?: (expanded: boolean) => void;
  /** Callback when "Show details" link is clicked (still fired when using detailsContent) */
  onShowDetails?: () => void;
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
}
