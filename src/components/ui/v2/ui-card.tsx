import * as React from "react";
import { cn } from "@/lib/utils";
export interface UiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "template" | "icon" | "action" | "metrics";
  selected?: boolean;
  disabled?: boolean;
}
const UiCard = React.forwardRef<HTMLDivElement, UiCardProps>(
  (
    {
      variant = "default",
      selected = false,
      disabled = false,
      className,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const interactive = Boolean(onClick);
    return (
      <div
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive && !disabled ? 0 : undefined}
        aria-pressed={interactive ? selected : undefined}
        aria-disabled={interactive ? disabled : undefined}
        className={cn(
          "w-[300px] max-w-full min-w-0 rounded-xl border border-solid border-semantic-border-layout bg-semantic-bg-primary p-4 font-[family-name:var(--font-v2,Inter,sans-serif)] text-semantic-text-primary shadow-[0_1px_2px_0_rgba(12,15,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_0_rgba(12,15,18,0.05)]",
          interactive &&
            !disabled &&
            "cursor-pointer transition-[background,box-shadow,border-color] hover:bg-[linear-gradient(290deg,color-mix(in_srgb,var(--semantic-border-layout)_40%,transparent)_0.89%,color-mix(in_srgb,var(--semantic-bg-primary)_40%,transparent)_36.25%)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary",
          (variant === "icon" || variant === "action") && "w-[200px]",
          variant === "action" &&
            "border-dashed border-semantic-info-border shadow-none",
          selected &&
            "border-semantic-border-accent bg-semantic-brand-surface shadow-[0_0_4px_rgba(39,171,184,0.4)]",
          disabled &&
            "cursor-not-allowed bg-semantic-bg-ui text-semantic-text-muted shadow-none",
          className
        )}
        onClick={disabled ? undefined : onClick}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (
            !event.defaultPrevented &&
            interactive &&
            !disabled &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            event.currentTarget.click();
          }
        }}
        {...props}
      />
    );
  }
);
UiCard.displayName = "UiCard";
const UiCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2.5 py-0.5", className)}
    {...props}
  />
));
UiCardHeader.displayName = "UiCardHeader";
const UiCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("m-0 text-base font-medium leading-5", className)}
    {...props}
  />
));
UiCardTitle.displayName = "UiCardTitle";
const UiCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "m-0 text-sm font-normal text-semantic-text-muted",
      className
    )}
    {...props}
  />
));
UiCardDescription.displayName = "UiCardDescription";
const UiCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 flex-col gap-2", className)}
    {...props}
  />
));
UiCardContent.displayName = "UiCardContent";
const UiCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-3 flex items-center justify-end gap-2", className)}
    {...props}
  />
));
UiCardFooter.displayName = "UiCardFooter";
export {
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
  UiCardContent,
  UiCardFooter,
};
