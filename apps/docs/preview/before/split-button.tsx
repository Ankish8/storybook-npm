"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
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
    const reduced = useReducedMotion() ?? false;
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
    const solid = variant === "primary" || variant === "default";
    const segmentFocus =
      "focus-visible:outline-none focus-visible:[outline-width:0px]";
    const iconSize =
      size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : "icon";

    return (
      <div
        role="group"
        aria-label={label}
        className={cn(
          "inline-flex max-w-full items-stretch align-middle",
          containerClassName
        )}
      >
        <Button
          {...props}
          ref={ref}
          type={type}
          variant={variant}
          size={size}
          disabled={disabled}
          loading={loading}
          leftIcon={icon}
          className={cn(
            "min-w-0 focus-visible:z-10",
            hasActions && "rounded-e-none [transform-origin:right_center]",
            hasActions && segmentFocus,
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
                variant={variant}
                size={iconSize}
                disabled={blocked}
                aria-label={menuLabel ?? `${label} more actions`}
                className={cn(
                  "shrink-0 rounded-s-none border-s-0 focus-visible:z-10 active:scale-100 before:pointer-events-none before:absolute before:start-0 before:top-1/2 before:h-4 before:w-px before:-translate-y-1/2 before:bg-current before:content-['']",
                  segmentFocus,
                  solid ? "before:opacity-25" : "before:opacity-15"
                )}
              >
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "transition-transform duration-200 ease-out motion-reduce:transition-none",
                    menuOpen && "rotate-180"
                  )}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              collisionPadding={12}
              loop
              className="min-w-[180px] p-1.5"
            >
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={action.id ?? `${action.label}-${index}`}
                  disabled={blocked || action.disabled}
                  destructive={action.destructive}
                  className="min-h-9 px-2.5 py-2 text-sm"
                  onSelect={(event) => {
                    if (blocked || action.disabled) event.preventDefault();
                    else action.onSelect?.(event);
                  }}
                >
                  <motion.span
                    className="flex min-w-0 flex-1 items-center gap-2.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.12,
                      delay: reduced ? 0 : Math.min(index * 0.025, 0.1),
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
                    <span className="min-w-0 whitespace-normal break-words">
                      {action.label}
                    </span>
                  </motion.span>
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
