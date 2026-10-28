"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";

export interface SplitButtonAction {
  /** Stable key, useful when actions can be reordered. */
  id?: string;
  label: string;
  onSelect?: (event: Event) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}
export interface SplitButtonProps extends Omit<
  ButtonProps,
  "children" | "asChild" | "leftIcon" | "rightIcon" | "size" | "variant"
> {
  label: string;
  actions: SplitButtonAction[];
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "default" | "outline";
  size?: "sm" | "default" | "lg";
  /** Accessible name for the chevron, defaults to `${label} more actions`. */
  menuLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Styles the joined pair; className and native attributes style the main button. */
  containerClassName?: string;
}

/** A default action and related alternatives. No v1 API is replaced. */
const SplitButton = React.forwardRef<HTMLButtonElement, SplitButtonProps>(
  (
    {
      label,
      actions,
      icon,
      variant = "primary",
      size = "default",
      menuLabel,
      open,
      defaultOpen = false,
      onOpenChange,
      containerClassName,
      className,
      disabled = false,
      loading = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    const [localOpen, setLocalOpen] = React.useState(defaultOpen);
    const blocked =
      disabled ||
      loading ||
      props["aria-disabled"] === true ||
      props["aria-disabled"] === "true";
    const hasActions = actions.length > 0;
    const unavailable = blocked || !hasActions;
    // Disabling an uncontrolled menu also clears its requested state, so enabling
    // the button later cannot unexpectedly reopen it.
    if (unavailable && localOpen) setLocalOpen(false);
    const menuOpen = !unavailable && (open ?? localOpen);
    React.useEffect(() => {
      if (open && unavailable) onOpenChange?.(false);
    }, [open, unavailable, onOpenChange]);
    const changeOpen = (next: boolean) => {
      const allowed = next && !unavailable;
      if (open === undefined) setLocalOpen(allowed);
      onOpenChange?.(allowed);
    };
    // SplitButton keeps its original two-style API even when Button gains
    // a distinct Outline treatment. Existing outline callers still get Secondary.
    const resolvedVariant =
      variant === "outline"
        ? "secondary"
        : variant === "default"
          ? "primary"
          : variant;
    const solid = resolvedVariant === "primary";
    const iconSize =
      size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : "icon";
    // Arc: the pair is one pill. The border lives on the wrapper, segments sit
    // inside it, and a press on the main action dips the whole pill.
    const pair = hasActions
      ? cn(
          "rounded-lg border border-solid",
          solid
            ? "border-v2-semantic-primary"
            : "border-[var(--v2-button-border,oklch(0.935_0_0))]",
          "transition-transform [transition-duration:580ms] [transition-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)]",
          "has-[>button:first-child:active:not(:disabled):not([aria-disabled=true])]:scale-[0.97] has-[>button:first-child:active:not(:disabled):not([aria-disabled=true])]:[transition-duration:120ms] has-[>button:first-child:active:not(:disabled):not([aria-disabled=true])]:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          "motion-reduce:transition-none motion-reduce:has-[>button:first-child:active]:scale-100"
        )
      : "";
    // The joined pair owns its 1px border, so segments leave room for it
    // inside the approved 32 / 40 / 44px overall sizes.
    const segmentHeight =
      size === "sm" ? "h-[30px]" : size === "lg" ? "h-[42px]" : "h-[38px]";
    const triggerWidth =
      size === "sm" ? "w-8" : size === "lg" ? "w-[42px]" : "w-[38px]";

    return (
      <div
        role="group"
        aria-label={label}
        className={cn(
          "inline-flex max-w-full items-stretch align-middle",
          pair,
          containerClassName
        )}
      >
        <Button
          {...props}
          ref={ref}
          type={type}
          variant={resolvedVariant}
          size={size}
          disabled={disabled}
          loading={loading}
          leftIcon={icon}
          className={cn(
            "min-w-0 focus-visible:z-10",
            hasActions &&
              "rounded-s-[7px] rounded-e-none border-0 active:scale-100",
            hasActions && segmentHeight,
            className
          )}
        >
          {label}
        </Button>
        {hasActions && (
          <DropdownMenu open={menuOpen} onOpenChange={changeOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant={resolvedVariant}
                size={iconSize}
                disabled={blocked}
                aria-label={menuLabel ?? `${label} more actions`}
                className={cn(
                  "shrink-0 rounded-s-none rounded-e-[7px] border-0 focus-visible:z-10 active:scale-100 before:pointer-events-none before:absolute before:inset-y-0 before:start-0 before:w-px before:content-['']",
                  triggerWidth,
                  segmentHeight,
                  // Full-height divider: the pill's own tone mixed toward the page
                  // on primary, the lighter hairline on secondary.
                  solid
                    ? "before:bg-current before:opacity-[0.18]"
                    : "before:bg-[var(--v2-button-border-subtle,oklch(0.965_0_0))]"
                )}
              >
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "[stroke-width:1.75] transition-transform [transition-duration:580ms] [transition-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)] motion-reduce:transition-none",
                    menuOpen && "rotate-180"
                  )}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={4}
              collisionPadding={12}
              loop
            >
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={action.id ?? `${action.label}-${index}`}
                  disabled={blocked || action.disabled}
                  destructive={action.destructive}
                  onSelect={(event) => {
                    if (blocked || action.disabled) event.preventDefault();
                    else action.onSelect?.(event);
                  }}
                >
                  {action.icon && (
                    <span
                      aria-hidden="true"
                      className="grid size-4 shrink-0 place-items-center [&_svg]:size-4"
                    >
                      {action.icon}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 whitespace-normal break-words leading-[1.4]">
                    {action.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {loading ? (props.loadingText ?? label) : label}
        </span>
      </div>
    );
  }
);
SplitButton.displayName = "SplitButton";
export { SplitButton };
