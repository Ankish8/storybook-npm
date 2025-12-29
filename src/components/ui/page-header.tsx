import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowLeft, MoreHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

/**
 * PageHeader variants for layout styles.
 */
const pageHeaderVariants = cva(
  "flex flex-col sm:flex-row sm:items-center w-full bg-semantic-bg-primary",
  {
    variants: {},
    defaultVariants: {},
  }
);

/**
 * Page header component for displaying page titles with optional icons and actions.
 *
 * @example
 * ```tsx
 * // Simple header with icon
 * <PageHeader
 *   icon={<WebhookIcon />}
 *   title="Webhooks"
 *   description="Manage your webhook integrations"
 * />
 *
 * // Header with actions
 * <PageHeader
 *   icon={<WebhookIcon />}
 *   title="Webhooks"
 *   description="Manage your webhook integrations"
 *   actions={<Button>Add Webhook</Button>}
 * />
 *
 * // Header with back button
 * <PageHeader
 *   showBackButton
 *   onBackClick={() => navigate(-1)}
 *   title="Edit Webhook"
 *   description="Modify webhook settings"
 *   actions={<><Button variant="outline">Cancel</Button><Button>Save</Button></>}
 * />
 * ```
 */
export interface PageHeaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageHeaderVariants> {
  /** Page title (required) */
  title: string;
  /** Optional description/subtitle displayed below the title */
  description?: string;
  /** Icon displayed on the left side (hidden when showBackButton is true) */
  icon?: React.ReactNode;
  /** Shows back arrow button instead of icon */
  showBackButton?: boolean;
  /** Callback when back button is clicked */
  onBackClick?: () => void;
  /** Optional info icon displayed next to the title (e.g., tooltip trigger) */
  infoIcon?: React.ReactNode;
  /** Action buttons/elements rendered on the right side */
  actions?: React.ReactNode;
  /** Show bottom border (default: true) */
  showBorder?: boolean;
  /** Layout mode: 'horizontal' (single row), 'vertical' (stacked), 'responsive' (auto based on screen size, default) */
  layout?: "horizontal" | "vertical" | "responsive";
  /** Max actions to show on mobile before overflow (default: 2) */
  mobileOverflowLimit?: number;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      className,
      title,
      description,
      icon,
      showBackButton = false,
      onBackClick,
      infoIcon,
      actions,
      showBorder = true,
      layout = "responsive",
      mobileOverflowLimit = 2,
      ...props
    },
    ref
  ) => {
    // State for overflow expansion (moved to top level)
    const [isOverflowExpanded, setIsOverflowExpanded] = React.useState(false);

    // Determine what to show on the left: back button, icon, or nothing
    const renderLeftElement = () => {
      if (showBackButton) {
        return (
          <button
            type="button"
            onClick={onBackClick}
            className="flex items-center justify-center w-10 h-10 rounded hover:bg-semantic-bg-ui transition-colors text-semantic-text-primary"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        );
      }
      if (icon) {
        return (
          <div className="flex items-center justify-center w-10 h-10 [&_svg]:w-6 [&_svg]:h-6 text-semantic-text-muted">
            {icon}
          </div>
        );
      }
      return null;
    };

    const leftElement = renderLeftElement();

    // Flatten children recursively to handle fragments
    const flattenChildren = (children: React.ReactNode): React.ReactNode[] => {
      const result: React.ReactNode[] = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === React.Fragment) {
          const fragmentProps = child.props as { children?: React.ReactNode };
          result.push(...flattenChildren(fragmentProps.children));
        } else if (child !== null && child !== undefined) {
          result.push(child);
        }
      });
      return result;
    };

    // Convert actions to array for overflow handling
    const actionsArray = flattenChildren(actions);
    const hasOverflow = actionsArray.length > mobileOverflowLimit;
    const visibleActions = hasOverflow
      ? actionsArray.slice(0, mobileOverflowLimit)
      : actionsArray;
    const overflowActions = hasOverflow
      ? actionsArray.slice(mobileOverflowLimit)
      : [];

    // Layout classes based on prop
    const layoutClasses = {
      horizontal: "flex-row items-center",
      vertical: "flex-col",
      responsive: "flex-col sm:flex-row sm:items-center",
    };

    const heightClasses = {
      horizontal: "h-[76px]",
      vertical: "min-h-[76px] py-4",
      responsive: "min-h-[76px] py-4 lg:py-0 lg:h-[76px]",
    };

    // Render actions for desktop (all inline)
    const renderDesktopActions = () => (
      <div className="hidden sm:flex items-center gap-2 ml-6">
        {actionsArray}
      </div>
    );

    // Render expandable actions (for mobile and vertical layout)
    const renderExpandableActions = (additionalClasses?: string) => {
      // Calculate grid columns: equal width for visible actions, smaller for overflow button
      const hasOverflowBtn = overflowActions.length > 0;
      const gridCols = hasOverflowBtn
        ? `repeat(${visibleActions.length}, 1fr) auto`
        : `repeat(${visibleActions.length}, 1fr)`;

      return (
        <div className={cn("flex flex-col gap-2 w-full", additionalClasses)}>
          {/* Visible actions row - full width grid */}
          <div className="grid gap-2" style={{ gridTemplateColumns: gridCols }}>
            {visibleActions.map((action, index) => (
              <div key={index} className="[&>*]:w-full [&>*]:h-9">
                {action}
              </div>
            ))}
            {hasOverflowBtn && (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsOverflowExpanded(!isOverflowExpanded)}
                aria-label={isOverflowExpanded ? "Show less" : "More actions"}
                aria-expanded={isOverflowExpanded}
              >
                {isOverflowExpanded ? (
                  <X className="w-4 h-4" />
                ) : (
                  <MoreHorizontal className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {/* Expanded overflow actions - stacked full width */}
          {isOverflowExpanded && overflowActions.length > 0 && (
            <div className="flex flex-col gap-2">
              {overflowActions.map((action, index) => (
                <div key={index} className="[&>*]:w-full [&>*]:h-9">
                  {action}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    // For horizontal layout, always show all actions inline
    const renderHorizontalActions = () => (
      <div className="flex items-center gap-2 ml-4">{actionsArray}</div>
    );

    const renderActions = () => {
      if (!actions) return null;

      if (layout === "horizontal") {
        return renderHorizontalActions();
      }

      if (layout === "vertical") {
        return renderExpandableActions("mt-3");
      }

      // Responsive: render both, CSS handles visibility
      return (
        <>
          {renderDesktopActions()}
          <div className="sm:hidden mt-3 w-full">
            {renderExpandableActions()}
          </div>
        </>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full bg-semantic-bg-primary px-4",
          layoutClasses[layout],
          heightClasses[layout],
          showBorder && "border-b border-semantic-border-layout",
          className
        )}
        {...props}
      >
        {/* Top Row: Icon/Back + Title + Description */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Left Section: Icon or Back Button */}
          {leftElement && (
            <div className="flex-shrink-0 mr-4">{leftElement}</div>
          )}

          {/* Content Section: Title + Description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="m-0 text-base font-semibold text-semantic-text-primary truncate">
                {title}
              </h1>
              {infoIcon && (
                <span className="flex-shrink-0 [&_svg]:w-4 [&_svg]:h-4 text-semantic-text-muted">
                  {infoIcon}
                </span>
              )}
            </div>
            {description && (
              <p className="m-0 text-sm text-semantic-text-secondary font-normal mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions Section */}
        {renderActions()}
      </div>
    );
  }
);
PageHeader.displayName = "PageHeader";

export { PageHeader, pageHeaderVariants };
