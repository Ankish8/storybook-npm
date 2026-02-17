import * as React from "react";

/**
 * Props for the PowerUpCard component.
 */
export interface PowerUpCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon or illustration displayed in the tinted container */
  icon?: React.ReactNode;
  /** Service title (e.g., "Truecaller business") */
  title: string;
  /** Pricing text (e.g., "Starts @ ₹30,000/month") */
  price: string;
  /** Description explaining the service value */
  description: string;
  /** CTA button label (default: "Talk to us") */
  ctaLabel?: string;
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
}
