import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * SelectTrigger variants matching TextField styling
 */
const selectTriggerVariants = cva(
  "flex h-[42px] w-full items-center justify-between rounded bg-semantic-bg-primary px-4 py-2 text-base text-semantic-text-primary outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)] [&>span]:line-clamp-1",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Value>>) => (
  <SelectPrimitive.Value
    ref={ref}
    className={cn("[&[data-placeholder]]:text-semantic-text-muted", className)}
    {...props}
  />
));
SelectValue.displayName = SelectPrimitive.Value.displayName;

export interface SelectTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = React.forwardRef(({ className, state, children, ...props }: SelectTriggerProps, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Trigger>>) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ state, className }))}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 text-semantic-text-muted opacity-70" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollUpButton>>) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="size-4 text-semantic-text-muted" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollDownButton>>) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="size-4 text-semantic-text-muted" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

/**
 * Radix Select v2 wraps content in RemoveScroll which locks body scroll
 * via both CSS (overflow:hidden) and JS (preventDefault on wheel/touchmove).
 *
 * CSS fix: react-remove-scroll-bar uses `body[data-scroll-locked]` with
 * `!important`. We use a doubled attribute selector for higher specificity
 * so our override always wins regardless of style injection order.
 *
 * JS fix: react-remove-scroll checks `event.cancelable` before calling
 * `preventDefault()`. We override this property in a capture-phase listener
 * so the library skips the preventDefault call.
 */
function useUnlockBodyScroll() {
  React.useEffect(() => {
    // Don't unlock body scroll if inside a dialog/modal — the dialog's
    // own scroll lock should remain active to prevent background scrolling
    if (document.querySelector('[role="dialog"]')) return;

    const style = document.createElement("style");
    style.setAttribute("data-select-scroll-fix", "");
    style.textContent =
      "body[data-scroll-locked][data-scroll-locked] { overflow: auto !important; margin-right: 0 !important; overscroll-behavior: auto !important; }";
    document.head.appendChild(style);

    const preventScrollLock = (e: Event) => {
      if (!document.body.hasAttribute("data-scroll-locked")) return;
      Object.defineProperty(e, "cancelable", {
        value: false,
        configurable: true,
      });
    };

    document.addEventListener("wheel", preventScrollLock, true);
    document.addEventListener("touchmove", preventScrollLock, true);

    return () => {
      document.head.removeChild(style);
      document.removeEventListener("wheel", preventScrollLock, true);
      document.removeEventListener("touchmove", preventScrollLock, true);
    };
  }, []);
}

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Content>>) => {
  useUnlockBodyScroll();

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-[9999] max-h-96 min-w-[8rem] overflow-hidden rounded bg-semantic-bg-primary border border-solid border-semantic-border-layout shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Label>>) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-4 py-1.5 text-xs font-medium text-semantic-text-muted",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef(({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Item>>) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-4 pr-8 text-base text-semantic-text-primary outline-none",
      "hover:bg-semantic-bg-ui focus:bg-semantic-bg-ui",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-semantic-brand" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>, ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Separator>>) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-semantic-border-layout", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  selectTriggerVariants,
};
