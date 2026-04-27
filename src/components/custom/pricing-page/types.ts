import * as React from "react";
import type { AlertProps } from "../../ui/alert";
import type { PlanCardCtaState, PricingCardProps } from "../pricing-card/types";
import type { PowerUpCardProps } from "../power-up-card/types";
import type { LetUsDriveCardProps } from "../let-us-drive-card/types";
import type { PricingToggleTab } from "../pricing-toggle/types";

export type { PricingToggleTab };

/**
 * How the main plan card area is laid out. **`default`** uses `PricingPlanCardsRow` (grid
 * up to 4 columns; **5+** cards use horizontal scroll). **`oneColumn`** / **`twoColumn`** use
 * dedicated layouts that never switch to horizontal scroll.
 */
export type PricingPagePlanCardsLayout = "default" | "oneColumn" | "twoColumn";

/** Status for the optional banner above the plan cards (maps to Alert variants). */
export type PricingPlanAlertStatus = "success" | "warning" | "info" | "failed";

/**
 * Props forwarded to the underlying {@link AlertProps Alert} (everything except `children` and `variant`).
 * Set appearance with `PricingPlanAlertConfig.variant` or `status` on the parent object, not here.
 */
export type PricingPlanAlertForwardedProps = Omit<
  AlertProps,
  "children" | "variant"
>;

/** Same options as `<Alert variant={…} />` — use instead of `status` when you want to match the Alert API directly. */
export type PricingPlanAlertVariant = NonNullable<AlertProps["variant"]>;

/**
 * Config for the plan-area alert (Figma: full-width banner with icon, title, description).
 *
 * **Appearance:** set **`variant`** to mirror `<Alert variant />` (switch e.g. `info` → `warning` in one prop).
 * If omitted, **`status`** is mapped to an Alert variant (`failed` → `error`). If both are omitted, the Alert uses `default`.
 *
 * **Behavior:** pass **`alertProps`** for closable, actions, icons, and other `Alert` props.
 */
export interface PricingPlanAlertConfig {
  /** Bold heading line. */
  title: string;
  /** Supporting copy below the title. */
  description?: string;
  /** Semantic tone when `variant` is omitted — maps to Alert (e.g. `failed` → error). */
  status?: PricingPlanAlertStatus;
  /**
   * Direct Alert variant (same names as `Alert`). Overrides `status` when both are set.
   */
  variant?: PricingPlanAlertVariant;
  /** Extra props for the shared `Alert` (e.g. `closable`, `onClose`, `icon`, `action`, `className`). */
  alertProps?: PricingPlanAlertForwardedProps;
}

/**
 * Props for the PricingPage component.
 *
 * PricingPage is a layout compositor that orchestrates PricingToggle,
 * PricingCard, PowerUpCard, LetUsDriveCard, and PageHeader into
 * the full plan selection page. Modular and reusable across screens:
 * use the full page layout, or compose sections elsewhere with the same
 * sub-components (PricingCard, PowerUpCard, LetUsDriveCard, etc.).
 *
 * **Embedding in host apps:** the root uses `h-auto` and `w-full max-w-full` so it does not rely on
 * a parent height, and includes **horizontal shell padding** (`px-4` → `lg:px-10`) so the layout is
 * not flush to the viewport. To **fill a flex panel** (sidebar + main) and scroll inside the main
 * column, pass **`className="h-full min-h-0 min-w-0 flex-1"`** (or `className="min-h-0 flex-1"`) on
 * `PricingPage` so the flex chain and overflow behave correctly. Override side padding with
 * `className` if the host already pads the main area.
 */
export interface PricingPageProps extends React.HTMLAttributes<HTMLDivElement> {
  /* ───── Header ───── */

  /** Page title (default: "Select business plan") */
  title?: string;
  /** Actions rendered on the right side of the header (e.g., number-type dropdown) */
  headerActions?: React.ReactNode;

  /* ───── Tabs & Billing ───── */

  /** Plan type tabs shown in the pill selector */
  tabs?: PricingToggleTab[];
  /** When false, the category toggle (e.g. Team-Led Plans / Go-AI First) is hidden. Default true. */
  showCategoryToggle?: boolean;
  /** Currently active tab value (controlled). Falls back to first tab when unset. */
  activeTab?: string;
  /** Callback when the active tab changes */
  onTabChange?: (value: string) => void;
  /** Whether to show the monthly/yearly billing toggle */
  showBillingToggle?: boolean;
  /** Current billing period (controlled) */
  billingPeriod?: "monthly" | "yearly";
  /** Callback when the billing period changes */
  onBillingPeriodChange?: (period: "monthly" | "yearly") => void;

  /* ───── Plan Cards ───── */

  /** Array of plan card props to render in the main pricing grid */
  planCards?: PricingCardProps[];
  /**
   * Column count for the plan card row in `default` layout. Defaults to
   * `planCards.length`; one plan uses a wide featured layout, two plans use a
   * wider two-up row, three/four stay in an equal-width row, and five+ switch to
   * horizontal scroll. Ignored when `planCardsLayout` is `oneColumn` or
   * `twoColumn`.
   */
  planCardColumnCount?: number;
  /**
   * Plan card region layout. **`default`**: responsive grid (up to 4 columns) or horizontal scroll
   * for **5+** cards. **`oneColumn`**: always a single vertical stack. **`twoColumn`**: 1 col on
   * small screens, 2 columns from `min-[480px]` with wrapping.
   */
  planCardsLayout?: PricingPagePlanCardsLayout;
  /**
   * Optional CTA state per plan card (loading/disabled). Reusable across any screen that renders plan cards.
   * Index matches planCards: [0] = first card CTA, [1] = second, [2] = third.
   * Overrides ctaLoading/ctaDisabled on the card when provided.
   */
  planCardCtaStates?: PlanCardCtaState[];

  /**
   * Optional alert above the pricing cards (Plan & Pricing area), using the design-system `Alert`.
   * Set **`showPlanAlert={false}`** to keep config in memory but hide the banner (e.g. feature flags).
   */
  planAlert?: PricingPlanAlertConfig;
  /**
   * When `false`, the plan-area alert is not rendered; `planAlert` can stay defined for easy toggling.
   * Default: show whenever `planAlert` is set.
   */
  showPlanAlert?: boolean;

  /* ───── Power-ups Section ───── */

  /** Array of power-up card props */
  powerUpCards?: PowerUpCardProps[];
  /** Power-ups section heading (default: "Power-ups and charges") */
  powerUpsTitle?: string;
  /** Feature comparison link text (default: "See full feature comparison") */
  featureComparisonText?: string;
  /** Callback when the feature comparison link is clicked */
  onFeatureComparisonClick?: () => void;

  /* ───── Let Us Drive Section ───── */

  /** Array of let-us-drive card props */
  letUsDriveCards?: LetUsDriveCardProps[];
  /** Let-us-drive section heading (default: "Let us drive — Full-service management") */
  letUsDriveTitle?: string;
}
