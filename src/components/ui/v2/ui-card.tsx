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
          // Arc's card: 1px border, 20px padding, no resting shadow. Border eases in 160ms, shadow 240ms, lift 260ms.
          "w-[300px] max-w-full min-w-0 rounded-xl border border-solid border-semantic-border-layout bg-semantic-bg-primary p-5 font-[family-name:var(--font-v2,Inter,sans-serif)] text-[var(--v2-text-secondary,#5E5E5E)] shadow-none [transition-property:border-color,box-shadow,transform] [transition-duration:160ms,240ms,260ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-property:border-color,box-shadow] motion-reduce:[transition-duration:120ms]",
          // A pointed-at card floats 2px, so the raised shadow arrives with the lift. Touch and pen never lift; the
          // press has no scale of its own (Arc has none).
          interactive &&
            !disabled &&
            "cursor-pointer [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-primary-100,#C0C3CA)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_6px_18px_rgba(0,0,0,0.065),0_1px_3px_rgba(0,0,0,0.035)] motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:hover:translate-y-0 focus-visible:border-[var(--color-primary-100,#C0C3CA)] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary",
          (variant === "icon" || variant === "action") && "w-[200px]",
          variant === "action" &&
            "border-dashed border-semantic-info-border shadow-none",
          selected &&
            "border-semantic-border-accent bg-semantic-brand-surface shadow-[0_0_4px_rgba(39,171,184,0.4)]",
          disabled &&
            "cursor-not-allowed bg-semantic-bg-ui text-[var(--v2-text-muted,#707070)] [&_h3]:text-[var(--v2-text-muted,#707070)] [&_p]:text-[var(--v2-text-muted,#707070)] shadow-none",
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
    className={cn(
      "m-0 text-lg font-medium leading-[1.1] tracking-[-0.01em] text-[var(--v2-text-primary,#484848)]",
      className
    )}
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
      "m-0 text-sm font-normal leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)]",
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
    className={cn(
      // Arc: byline left, action right. A lone child still sits at the end, as before.
      "mt-5 flex items-center justify-between gap-3 [&>:only-child]:ml-auto",
      className
    )}
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
