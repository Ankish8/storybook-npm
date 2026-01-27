import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowLeft, MoreHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

const pageHeaderVariants = cva(
  "flex flex-col sm:flex-row sm:items-center w-full bg-semantic-bg-primary",
  {
    variants: {},
    defaultVariants: {},
  }
);

export interface PageHeaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageHeaderVariants> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
  infoIcon?: React.ReactNode;
  actions?: React.ReactNode;
  showBorder?: boolean;
  layout?: "horizontal" | "vertical" | "responsive";
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
    const [isOverflowExpanded, setIsOverflowExpanded] = React.useState(false);

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

    const actionsArray = flattenChildren(actions);
    const hasOverflow = actionsArray.length > mobileOverflowLimit;
    const visibleActions = hasOverflow
      ? actionsArray.slice(0, mobileOverflowLimit)
      : actionsArray;
    const overflowActions = hasOverflow
      ? actionsArray.slice(mobileOverflowLimit)
      : [];

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

    const renderDesktopActions = () => (
      <div className="hidden sm:flex items-center gap-2 ml-6">
        {actionsArray}
      </div>
    );

    const renderExpandableActions = (additionalClasses?: string) => {
      const hasOverflowBtn = overflowActions.length > 0;
      const gridCols = hasOverflowBtn
        ? `repeat(${visibleActions.length}, 1fr) auto`
        : `repeat(${visibleActions.length}, 1fr)`;

      return (
        <div className={cn("flex flex-col gap-2 w-full", additionalClasses)}>
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
        <div className="flex items-center flex-1 min-w-0">
          {leftElement && (
            <div className="flex-shrink-0 mr-4">{leftElement}</div>
          )}

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

        {renderActions()}
      </div>
    );
  }
);
PageHeader.displayName = "PageHeader";

export { PageHeader, pageHeaderVariants };
