import * as React from "react";

/**
 * Add-on info displayed at the bottom of the pricing card.
 */
export interface PricingCardAddon {
  /** Icon rendered in the addon section */
  icon?: React.ReactNode;
  /** Addon description text */
  text: string;
}

/**
 * A single usage detail item (e.g., "Usage: Includes 2,000 AI conversations/month").
 */
export interface UsageDetail {
  /** Bold label (e.g., "Usage") */
  label: string;
  /** Value text (e.g., "Includes 2,000 AI conversations/month") */
  value: string;
}

/**
 * A feature can be a plain string or an object with bold styling.
 */
export type PricingCardFeature = string | { text: string; bold?: boolean };

/**
 * Props for the PricingCard component.
 */
export interface PricingCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Plan name displayed in the header (e.g., "Compact", "Sedan", "SUV") */
  planName: string;
  /** Price amount as formatted string (e.g., "2,5000") */
  price: string;
  /** Billing period label (default: "/Month") */
  period?: string;
  /** Plan detail line (e.g., "3 Users | 12 Month plan") */
  planDetails?: React.ReactNode;
  /** Plan icon or illustration */
  planIcon?: React.ReactNode;
  /** Plan description text */
  description?: string;
  /** Background color for the header section */
  headerBgColor?: string;
  /** List of included features shown with checkmarks. Supports bold items via object form. */
  features?: PricingCardFeature[];
  /** Whether this is the currently active plan (shows outlined button) */
  isCurrentPlan?: boolean;
  /** Show a popularity badge next to the plan name */
  showPopularBadge?: boolean;
  /** Custom badge text (defaults to "MOST POPULAR") */
  badgeText?: string;
  /** Custom CTA button text (overrides default "Select plan" / "Current plan") */
  ctaText?: string;
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
  /** Callback when "Feature details" link is clicked */
  onFeatureDetails?: () => void;
  /** Add-on info displayed at the bottom of the card */
  addon?: PricingCardAddon;
  /** Usage details displayed in a bulleted list at the bottom (e.g., AIO plan) */
  usageDetails?: UsageDetail[];
}
