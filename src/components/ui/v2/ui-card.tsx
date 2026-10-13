import * as React from "react";
import { cn } from "@/lib/utils";
export interface UiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "template" | "icon" | "action" | "metrics";
  selected?: boolean;
  disabled?: boolean;
}

// A card may still receive bubbled events from a legacy composition. Keep
// controls inside it independent; prefer a passive card for new compositions.
const interactiveDescendantSelector = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "label",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]",
  "[role='button']",
  "[role='link']",
  "[role='checkbox']",
  "[role='radio']",
  "[role='switch']",
  "[role='tab']",
  "[role='menuitem']",
  "[role='menuitemcheckbox']",
  "[role='menuitemradio']",
  "[role='option']",
  "[role='textbox']",
  "[role='searchbox']",
  "[role='combobox']",
  "[role='slider']",
  "[role='spinbutton']",
  "[role='treeitem']",
].join(",");

function isInteractiveDescendant(event: React.MouseEvent<HTMLDivElement>) {
  if (!(event.target instanceof Element)) return false;
  const control = event.target.closest(interactiveDescendantSelector);
  return (
    control !== null &&
    control !== event.currentTarget &&
    event.currentTarget.contains(control)
  );
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
      role,
      tabIndex,
      ...props
    },
    ref
  ) => {
    const interactive = Boolean(onClick);
    return (
      <div
        ref={ref}
        role={role ?? (interactive ? "button" : undefined)}
        tabIndex={
          interactive && disabled
            ? undefined
            : (tabIndex ?? (interactive ? 0 : undefined))
        }
        aria-pressed={interactive ? selected : undefined}
        aria-disabled={interactive ? disabled : undefined}
        className={cn(
          "w-[300px] max-w-full min-w-0 rounded-xl border border-solid border-semantic-border-layout bg-semantic-bg-primary p-5 font-[family-name:var(--font-v2,Inter,sans-serif)] text-semantic-text-secondary shadow-none [transition-property:border-color,background-color] duration-150 ease-out motion-reduce:transition-none",
          interactive &&
            !disabled &&
            "cursor-pointer focus-visible:border-semantic-border-focus focus-visible:[outline-style:solid] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-semantic-border-focus",
          interactive &&
            !disabled &&
            !selected &&
            "[@media(hover:hover)_and_(pointer:fine)]:hover:border-semantic-border-secondary",
          (variant === "icon" || variant === "action") && "w-[200px]",
          variant === "action" &&
            "border-dashed border-semantic-info-border shadow-none",
          selected && "border-semantic-border-accent bg-semantic-brand-surface",
          disabled &&
            "cursor-not-allowed bg-semantic-bg-ui text-semantic-text-muted [&_h3]:text-semantic-text-muted [&_p]:text-semantic-text-muted",
          className
        )}
        onClick={
          interactive
            ? (event) => {
                if (
                  !disabled &&
                  !event.defaultPrevented &&
                  !isInteractiveDescendant(event)
                ) {
                  onClick?.(event);
                }
              }
            : undefined
        }
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (
            !event.defaultPrevented &&
            event.target === event.currentTarget &&
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
      "m-0 text-lg font-medium leading-[1.3] tracking-[-0.01em] text-semantic-text-primary",
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
      "m-0 text-sm font-normal leading-[1.4] text-semantic-text-secondary",
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
