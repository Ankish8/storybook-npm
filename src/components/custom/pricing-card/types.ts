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
 * A single segment of feature text with optional bold styling.
 */
export interface PricingCardFeaturePart {
  /** The text content */
  text: string;
  /** Whether this segment should be bold */
  bold?: boolean;
}

/**
 * A feature can be:
 * - A plain string: `"WhatsApp Campaigns"`
 * - Full bold object: `{ text: "Everything in Compact", bold: true }`
 * - Partial bold parts: `{ parts: [{ text: "Everything in " }, { text: "Compact", bold: true }] }`
 */
export type PricingCardFeature =
  | string
  | { text: string; bold?: boolean }
  | { parts: PricingCardFeaturePart[] };

/**
 * Reusable CTA state for a single plan card (loading/disabled).
 * Use on PricingCard via ctaLoading/ctaDisabled, or in arrays for
 * screens that render multiple plan cards (e.g. planCardCtaStates on PricingPage).
 */
export interface PlanCardCtaState {
  /** Show loading spinner on the CTA and make it non-interactive */
  loading?: boolean;
  /** Disable the CTA button (e.g. current plan or pending action) */
  disabled?: boolean;
}

/**
 * Props for the PricingCard component. Modular and reusable across screens (e.g. plan selection grid, comparison view, or any plan card with features and CTA).
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
  /** Show loading spinner on CTA button and make it non-interactive. Reusable on any screen that renders PricingCard. */
  ctaLoading?: boolean;
  /** Disable the CTA button (e.g. current plan or pending action). Reusable on any screen that renders PricingCard. */
  ctaDisabled?: boolean;
  /** Callback when CTA button is clicked */
  onCtaClick?: () => void;
  /** Callback when "Feature details" link is clicked */
  onFeatureDetails?: () => void;
  /** Add-on info displayed at the bottom of the card */
  addon?: PricingCardAddon;
  /** Usage details displayed in a bulleted list at the bottom (e.g., AIO plan) */
  usageDetails?: UsageDetail[];
  /** Informational text shown below the CTA button (e.g., "Your package change will be effective from 23-03-2026") */
  infoText?: string;
}
