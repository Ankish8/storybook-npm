import * as React from "react";

/**
 * Props for the LetUsDriveCard component.
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
  /** Text for the details link (default: "Show details") */
  showDetailsLabel?: string;
  /** CTA button text (default: "Talk to us") */
  ctaLabel?: string;
  /** Callback when "Show details" link is clicked */
  onShowDetails?: () => void;
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
}
