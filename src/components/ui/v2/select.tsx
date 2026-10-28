import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Arc's chevron turns on a 580ms spring that settles with a hint of life. The
 * sampled curve is Arc's own `--ease-spring`; the shared v2 spring is critically
 * damped and a touch quicker, so this one is spelled out. Wrapped in `cn(...)`
 * so the CLI prefixer transforms the literal.
 */
const chevronSpringClassName = cn(
  "[stroke-width:1.75] [transition-property:transform,color] [transition-duration:580ms] [transition-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)] motion-reduce:transition-none"
);

/**
 * SelectTrigger variants matching TextField styling. Radix exposes the
 * placeholder state on this trigger and discards classes on SelectValue.
 * A local color variable keeps caller text-color classes able to override
 * both empty and selected values.
 */
const selectTriggerVariants = cva(
  "flex h-11 w-full items-center justify-between gap-3 rounded-lg bg-v2-semantic-bg-primary px-3 py-2 text-left text-sm font-normal leading-[1.4] tracking-[-0.01em] text-[color:var(--v2-select-value-color,var(--v2-text-secondary,#5E5E5E))] data-[placeholder]:[--v2-select-value-color:var(--v2-text-placeholder,#707070)] font-[family-name:var(--font-v2,Inter,sans-serif)] outline-none focus-visible:[outline:2px_solid_var(--v2-semantic-border-focus,var(--semantic-primary))] focus-visible:outline-offset-2 transition-[border-color,box-shadow,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] disabled:cursor-not-allowed disabled:bg-v2-semantic-bg-ui disabled:border-v2-semantic-border-layout disabled:opacity-50 disabled:shadow-none [&>span]:min-w-0 [&>span]:flex-1 [&>span]:truncate",
  {
    variants: {
      state: {
        default:
          // Radix moves focus into the open list, so `focus:` alone would drop the
          // primary border the moment the panel opens. `aria-expanded` keeps it, and
          // the extra `hover` selector outranks the grey hover border (specificity
          // 0,4,0 vs 0,3,0) so the trigger does not flicker back under the cursor.
          // Arc also tints the field on hover, press and while open (its muted surface).
          "border border-solid border-v2-semantic-border-input focus:outline-none [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:border-[var(--v2-semantic-border-primary,var(--color-primary-100,#C0C3CA))] [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:bg-v2-semantic-bg-ui enabled:active:bg-v2-semantic-bg-ui focus:shadow-none aria-expanded:border-[var(--v2-semantic-border-focus,var(--semantic-primary))] aria-expanded:bg-v2-semantic-bg-ui aria-expanded:shadow-none [@media(hover:hover)_and_(pointer:fine)]:enabled:aria-expanded:hover:border-[var(--v2-semantic-border-focus,var(--semantic-primary))]",
        error:
          "border border-solid border-v2-semantic-error-primary shadow-[var(--v2-shadow-error,0_0_4px_0_rgba(240,68,56,0.4))] focus:outline-none ",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

const SelectOpenContext = React.createContext<(() => void) | null>(null);

// Keep the Radix Root contract while sharing a close action with its portaled
// content. This isolates Escape from surrounding dialogs, including consumers
// that resolve more than one Radix DismissableLayer dependency.
function Select({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange]
  );
  const close = React.useCallback(
    () => handleOpenChange(false),
    [handleOpenChange]
  );
  return (
    <SelectOpenContext.Provider value={close}>
      <SelectPrimitive.Root
        {...props}
        open={open ?? internalOpen}
        onOpenChange={handleOpenChange}
      />
    </SelectOpenContext.Provider>
  );
}

const SelectGroup = SelectPrimitive.Group;

/**
 * Lets `SelectContent` set the long-label behaviour once for every
 * `SelectItem` it renders, so callers don't repeat the flag per item.
 * Items may still override it individually.
 */
const SelectItemLayoutContext = React.createContext<{
  truncateOptionText: boolean;
}>({ truncateOptionText: false });

/**
 * Arc rolls the shown value in the direction of the list: a later option rises
 * from below, an earlier one drops from above, both through a soft blur, while
 * the previous copy leaves the other way. Radix fills the value node through a
 * portal, so the change is read off the DOM; the leaving copy is a short-lived
 * ghost. Direction comes from the open list when it is mounted and defaults to
 * "rising" otherwise. Reduced motion keeps a short crossfade.
 */
const VALUE_ROLL_EASE_IN = "cubic-bezier(0.16, 1, 0.3, 1)";
const VALUE_ROLL_EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

function visibleText(node: HTMLElement) {
  let text = "";
  node.childNodes.forEach((child) => {
    if (child instanceof HTMLElement && child.dataset.valueRollGhost != null)
      return;
    text += child.textContent ?? "";
  });
  return text;
}

function useValueRoll(ref: React.RefObject<HTMLSpanElement | null>) {
  React.useEffect(() => {
    const node = ref.current;
    if (!node || typeof MutationObserver === "undefined") return;
    let previous = visibleText(node);
    let rows: (string | null)[] = [];
    let animations: Animation[] = [];
    let ghost: HTMLSpanElement | null = null;
    const clearMotion = () => {
      animations.forEach((animation) => animation.cancel());
      animations = [];
      ghost?.remove();
      ghost = null;
    };
    const trigger = node.closest("button");
    const rememberOptions = () => {
      const listId = trigger?.getAttribute("aria-controls");
      const list = listId ? document.getElementById(listId) : null;
      if (list)
        rows = Array.from(list.querySelectorAll('[role="option"]')).map(
          (row) => row.textContent
        );
    };
    const listObserver = new MutationObserver(rememberOptions);
    if (trigger)
      listObserver.observe(trigger, {
        attributes: true,
        attributeFilter: ["aria-expanded"],
      });
    rememberOptions();

    const observer = new MutationObserver(() => {
      const next = visibleText(node);
      if (next === previous) return;
      const before = previous;
      previous = next;
      clearMotion();
      rememberOptions();
      // The first fill (Radix portals the selected text in after mount) is not a change.
      if (!before || !next || typeof node.animate !== "function") return;

      const reduce =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        animations.push(
          node.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 120,
            easing: VALUE_ROLL_EASE_OUT,
          })
        );
        return;
      }

      const from = rows.indexOf(before);
      const to = rows.indexOf(next);
      const direction = to < from ? -1 : 1;

      animations.push(
        node.animate(
          [
            {
              opacity: 0,
              transform: `translateY(${direction * 0.35}em)`,
              filter: "blur(4px)",
            },
            { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
          ],
          { duration: 240, easing: VALUE_ROLL_EASE_IN }
        )
      );

      const leavingNode = document.createElement("span");
      ghost = leavingNode;
      ghost.dataset.valueRollGhost = "";
      ghost.setAttribute("aria-hidden", "true");
      ghost.textContent = before;
      ghost.style.cssText =
        "position:absolute;inset:0;pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
      node.appendChild(ghost);
      const leaving = ghost.animate(
        [
          { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
          {
            opacity: 0,
            transform: `translateY(${direction * -0.3}em)`,
            filter: "blur(2px)",
          },
        ],
        { duration: 160, easing: VALUE_ROLL_EASE_OUT, fill: "forwards" }
      );
      animations.push(leaving);
      leaving.onfinish = () => leavingNode.remove();
      leaving.oncancel = () => leavingNode.remove();
    });

    observer.observe(node, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
      listObserver.disconnect();
      clearMotion();
    };
  }, [ref]);
}

const SelectValue = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>,
    ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Value>>
  ) => {
    const innerRef = React.useRef<HTMLSpanElement | null>(null);
    const setRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLSpanElement | null>).current =
            node;
      },
      [ref]
    );
    useValueRoll(innerRef);

    return (
      <SelectPrimitive.Value
        ref={setRef}
        className={cn(
          "relative [&[data-placeholder]]:text-[var(--v2-text-placeholder,#707070)]",
          className
        )}
        {...props}
      />
    );
  }
);
SelectValue.displayName = SelectPrimitive.Value.displayName;

export interface SelectTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = React.forwardRef(
  (
    { className, state, children, ...props }: SelectTriggerProps,
    ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Trigger>>
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectTriggerVariants({
          state:
            props["aria-invalid"] === true || props["aria-invalid"] === "true"
              ? "error"
              : state,
        }),
        "group/v2-select",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[var(--v2-text-muted,#707070)] opacity-70 group-data-[state=open]/v2-select:rotate-180",
            chevronSpringClassName
          )}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>,
    ref: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollUpButton>>
  ) => (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn(
        "flex h-7 cursor-default items-center justify-center",
        className
      )}
      {...props}
    >
      <ChevronUp className="size-4 text-[var(--v2-text-muted,#707070)] [stroke-width:1.75]" />
    </SelectPrimitive.ScrollUpButton>
  )
);
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>,
    ref: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollDownButton>>
  ) => (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn(
        "flex h-7 cursor-default items-center justify-center",
        className
      )}
      {...props}
    >
      <ChevronDown className="size-4 text-[var(--v2-text-muted,#707070)] [stroke-width:1.75]" />
    </SelectPrimitive.ScrollDownButton>
  )
);
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
function useUnlockBodyScroll(viewport: HTMLDivElement | null) {
  React.useEffect(() => {
    if (!viewport?.isConnected) return;
    // Radix mounts a detached viewport while closed to collect item labels.
    // Only the real, connected popup may unlock the page.
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
  }, [viewport]);
}

export type SelectContentProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
> & {
  /**
   * Fires on the scrollable list viewport when the user reaches the bottom.
   * React 18 has no synthetic event for `scrollend`, so the listener is
   * attached imperatively to the viewport DOM node. On browsers that
   * support the native `scrollend` event (Chrome/Edge 114+, Firefox 109+,
   * Safari 17.4+) we use it directly; on older Safari we fall back to a
   * debounced `scroll` listener with a 24px bottom threshold.
   *
   * The handler receives a native Event typed as React.UIEvent for
   * back-compat — `event.currentTarget` is the viewport div, so consumers
   * can still read scrollTop/scrollHeight/clientHeight from it.
   */
  onViewportScrollEnd?: (event: React.UIEvent<HTMLDivElement>) => void;
  hideScrollButtons?: boolean;
  /**
   * Clip long option labels to a single line with an ellipsis instead of
   * wrapping them. Applies to every `SelectItem` inside this content;
   * individual items can override it with their own `truncateOptionText`.
   * The trigger value always truncates, regardless of this flag.
   */
  truncateOptionText?: boolean;
};

const BOTTOM_THRESHOLD_PX = 24;
const SCROLL_DEBOUNCE_MS = 150;

const SelectContent = React.forwardRef(
  (
    {
      className,
      children,
      position = "popper",
      sideOffset = 4,
      collisionPadding = 12,
      onViewportScrollEnd,
      onEscapeKeyDown,
      hideScrollButtons,
      truncateOptionText = false,
      ...props
    }: SelectContentProps,
    ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Content>>
  ) => {
    // Use a state-backed ref so the effect re-runs when the viewport mounts.
    // The viewport lives inside Radix's Portal and only attaches when the
    // Select opens — a plain useRef wouldn't trigger the effect.
    const [viewport, setViewport] = React.useState<HTMLDivElement | null>(null);
    useUnlockBodyScroll(viewport);
    const close = React.useContext(SelectOpenContext);
    React.useEffect(() => {
      if (!viewport?.isConnected || !close) return;
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        const panel = viewport.closest('[role="listbox"]');
        const panels = document.querySelectorAll('[role="listbox"]');
        if (panel !== panels[panels.length - 1]) return;
        onEscapeKeyDown?.(event);
        const cancelled = event.defaultPrevented;
        event.preventDefault();
        event.stopPropagation();
        if (!cancelled) close();
      };
      window.addEventListener("keydown", handleEscape, true);
      return () => window.removeEventListener("keydown", handleEscape, true);
    }, [viewport, close, onEscapeKeyDown]);

    React.useEffect(() => {
      if (!viewport || !onViewportScrollEnd) return;

      const isAtBottom = () => {
        const { scrollTop, scrollHeight, clientHeight } = viewport;
        return scrollTop + clientHeight >= scrollHeight - BOTTOM_THRESHOLD_PX;
      };

      const notify = (event: Event) => {
        // A native event loses currentTarget after dispatch. The debounced
        // fallback still promises the viewport to v1 consumers. Restore the
        // native shape after the callback, including when it throws.
        const descriptor = Object.getOwnPropertyDescriptor(
          event,
          "currentTarget"
        );
        Object.defineProperty(event, "currentTarget", {
          configurable: true,
          value: viewport,
        });
        try {
          onViewportScrollEnd(
            event as unknown as React.UIEvent<HTMLDivElement>
          );
        } finally {
          if (descriptor)
            Object.defineProperty(event, "currentTarget", descriptor);
          else Reflect.deleteProperty(event, "currentTarget");
        }
      };

      const supportsScrollEnd =
        typeof window !== "undefined" && "onscrollend" in window;

      if (supportsScrollEnd) {
        const handler = (event: Event) => {
          if (isAtBottom()) {
            notify(event);
          }
        };
        viewport.addEventListener("scrollend", handler);
        return () => viewport.removeEventListener("scrollend", handler);
      }

      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      const handler = (event: Event) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (isAtBottom()) {
            notify(event);
          }
        }, SCROLL_DEBOUNCE_MS);
      };
      viewport.addEventListener("scroll", handler, { passive: true });
      return () => {
        viewport.removeEventListener("scroll", handler);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [viewport, onViewportScrollEnd]);

    const itemLayout = React.useMemo(
      () => ({ truncateOptionText }),
      [truncateOptionText]
    );

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            "relative z-[9999] max-h-[min(320px,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg font-[family-name:var(--font-v2,Inter,sans-serif)] bg-v2-semantic-bg-primary border border-solid border-v2-semantic-border-layout p-1.5 shadow-[var(--v2-shadow-popover,0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045))]",
            // Arc: 240ms enter on its ease-enter curve (rises 6px, scales from .97), 120ms exit on its standard curve (half the travel, .98).
            "origin-[var(--radix-select-content-transform-origin)] data-[state=open]:motion-safe:[animation-duration:240ms] data-[state=closed]:motion-safe:[animation-duration:120ms] [animation-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:[animation-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_120ms_ease-in]",
            "data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out",
            "data-[state=closed]:motion-safe:fade-out-0 data-[state=open]:motion-safe:fade-in-0",
            "data-[state=closed]:motion-safe:zoom-out-[0.98] data-[state=open]:motion-safe:zoom-in-[0.97]",
            "data-[side=bottom]:motion-safe:slide-in-from-top-[6px] data-[side=left]:motion-safe:slide-in-from-right-[6px]",
            "data-[side=right]:motion-safe:slide-in-from-left-[6px] data-[side=top]:motion-safe:slide-in-from-bottom-[6px]",
            "data-[side=bottom]:motion-safe:slide-out-to-top-[3px] data-[side=left]:motion-safe:slide-out-to-right-[3px]",
            "data-[side=right]:motion-safe:slide-out-to-left-[3px] data-[side=top]:motion-safe:slide-out-to-bottom-[3px]",
            className
          )}
          position={position}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          onEscapeKeyDown={onEscapeKeyDown}
          {...props}
        >
          {!hideScrollButtons && <SelectScrollUpButton />}
          <SelectPrimitive.Viewport
            ref={setViewport}
            data-select-viewport=""
            className={cn(
              "py-0.5",
              position === "popper" &&
                "h-[var(--radix-select-trigger-height)] w-full"
            )}
          >
            <SelectItemLayoutContext.Provider value={itemLayout}>
              {children}
            </SelectItemLayoutContext.Provider>
          </SelectPrimitive.Viewport>
          {!hideScrollButtons && <SelectScrollDownButton />}
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  }
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>,
    ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Label>>
  ) => (
    <SelectPrimitive.Label
      ref={ref}
      className={cn(
        "px-[11px] pb-1.5 pt-2.5 text-xs font-semibold leading-4 text-[var(--v2-text-muted,#707070)]",
        className
      )}
      {...props}
    />
  )
);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export interface SelectItemProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
> {
  /**
   * Clip this option's label to a single line with an ellipsis instead of
   * wrapping it. Defaults to the value set on `SelectContent` (wrapped).
   */
  truncateOptionText?: boolean;
}

const SelectItem = React.forwardRef(
  (
    { className, children, truncateOptionText, ...props }: SelectItemProps,
    ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Item>>
  ) => {
    const layout = React.useContext(SelectItemLayoutContext);
    const truncate = truncateOptionText ?? layout.truncateOptionText;

    return (
      <SelectPrimitive.Item
        ref={ref}
        className={cn(
          // 4px radius = panel 8px minus its 4px padding, so row and panel corners stay concentric.
          // No keyboard-only ring here on purpose: Radix focuses the highlighted row on pointer move too,
          // so the focus-visible pseudo-class is also true for a mouse hover (verified in Chrome) and cannot tell them apart.
          "relative flex min-h-9 w-full cursor-pointer select-none items-start rounded-sm font-[family-name:var(--font-v2,Inter,sans-serif)] py-2 pl-[11px] pr-[34px] text-sm leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] outline-none transition-[background-color,color] [transition-duration:120ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          // Selection keeps its check and a quiet tint; labels do not change weight or reflow.
          "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-v2-semantic-bg-ui focus:bg-v2-semantic-bg-ui data-[state=checked]:bg-v2-semantic-info-surface data-[state=checked]:focus:bg-v2-semantic-primary-surface data-[state=checked]:text-[var(--v2-text-primary,#484848)]",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        {...props}
      >
        <span className="absolute right-2.5 top-2.5 flex size-4 items-center justify-center">
          <SelectPrimitive.ItemIndicator
            // Arc: the check pops in after 40ms, from .6 scale through a 2px blur, 240ms on its enter curve.
            className="flex transition-[opacity,transform,filter] [transition-delay:40ms] [transition-duration:240ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [@starting-style]:scale-[0.6] [@starting-style]:opacity-0 [@starting-style]:blur-[2px] motion-reduce:[transition-duration:120ms] motion-reduce:[transition-delay:0ms] motion-reduce:[@starting-style]:scale-100 motion-reduce:[@starting-style]:blur-0"
          >
            <Check className="size-4 text-[var(--v2-selection-accent,var(--semantic-primary))] [stroke-width:1.75]" />
          </SelectPrimitive.ItemIndicator>
        </span>
        <span
          title={
            truncate && typeof children === "string" ? children : undefined
          }
          className={cn(
            "min-w-0 flex-1 leading-[inherit]",
            truncate ? "truncate" : "whitespace-normal break-words"
          )}
        >
          <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </span>
      </SelectPrimitive.Item>
    );
  }
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>,
    ref: React.Ref<React.ElementRef<typeof SelectPrimitive.Separator>>
  ) => (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-v2-semantic-border-layout", className)}
      {...props}
    />
  )
);
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export interface SelectOption {
  /** The value of the option */
  value: string;
  /** The display label of the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Group name for grouping options */
  group?: string;
}

export interface SelectFieldProps {
  /** Label text displayed above the select */
  label?: string;
  /** Shows red asterisk next to label when true */
  required?: boolean;
  /** Helper text displayed below the select */
  helperText?: string;
  /** Error message - shows error state with red styling */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state with spinner */
  loading?: boolean;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Currently selected value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Callback when an option is selected, provides the full option object */
  onSelect?: (option: SelectOption) => void;
  /**
   * Intercept a value change before it commits. Return `false` to prevent
   * `onValueChange` from firing (only `onSelect` will fire). Useful for
   * "action" items like "Add custom date" that should open a modal instead
   * of committing a value. Requires controlled mode (`value` prop) to
   * visually revert the selection.
   */
  interceptValue?: (value: string) => boolean;
  /** Options to display */
  options: SelectOption[];
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /**
   * Render a divider (top border) above each option group and display the
   * group labels in uppercase with letter-spacing — matches the Figma
   * "routing" dropdown style. Only affects grouped options.
   */
  separateGroups?: boolean;
  /**
   * Controlled search value. When provided, internal search state is
   * ignored and the consumer owns the value — typically used to drive
   * server-side filtering against a paginated API. The client-side
   * `option.label` filter is also skipped, since the consumer is expected
   * to have already filtered the options upstream.
   *
   * Pair with `onSearchChange`. Leave both undefined for the default
   * uncontrolled, client-side filtering behavior.
   */
  searchValue?: string;
  /**
   * Fires on every keystroke in the search input. Also fires with `""`
   * when the dropdown closes (so consumers can reset their query state).
   */
  onSearchChange?: (value: string) => void;
  /** Additional class for wrapper */
  wrapperClassName?: string;
  /** Additional class for trigger */
  triggerClassName?: string;
  /**
   * Additional class for the dropdown content. By default the content width is
   * bound to the trigger width (`--radix-select-trigger-width`); override here
   * (e.g. `w-[280px] max-w-[320px]`) when the trigger is intentionally narrow —
   * such as a "View all" text link — so the list isn't clipped to the link width.
   */
  contentClassName?: string;
  /** Additional class for label */
  labelClassName?: string;
  /** ID for the select */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
  /**
   * Fires when the user scrolls to the bottom of the open dropdown.
   * Use this to load the next page from the server. The callback is
   * forwarded to SelectContent's `onViewportScrollEnd` (debounced by
   * the native `scrollend` event), so it won't fire while a scroll is
   * still in progress.
   *
   * No virtualization is applied — all loaded items render to the DOM.
   * For >2k items consumers may notice some lag; virtualization is a
   * separate ticket if it becomes a real-world problem.
   */
  onScrollEnd?: () => void;
  /**
   * When true, renders a small "Loading more…" row at the bottom of
   * the options list. Set this to true while your API call is in flight
   * so the user knows more items are on the way.
   */
  loadingMore?: boolean;
  /**
   * When false, prevents `onScrollEnd` from firing further and renders
   * an "End of list" footer row. Default true (keep firing).
   */
  hasMore?: boolean;
  /**
   * Clip long option labels in the dropdown to a single line with an ellipsis
   * instead of wrapping them across lines. Default false (wrapped). The
   * selected value in the trigger always truncates, and the value reported to
   * `onValueChange` / `onSelect` is always the full string — truncation is
   * presentation only.
   */
  truncateOptionText?: boolean;
  /**
   * Content shown inside the open dropdown when `options` is empty (and no
   * search query is active — that case shows "No results found"). Use it to
   * tell the user why the list is empty and what to do next, e.g.
   * "No AI Agents yet. Build one in AI Agents first."
   * Default: "No options available".
   */
  emptyMessage?: React.ReactNode;
}

/**
 * A comprehensive select field component with label, icons, validation states, and more.
 *
 * @example
 * ```tsx
 * <SelectField
 *   label="Authentication"
 *   placeholder="Select authentication method"
 *   options={[
 *     { value: 'none', label: 'None' },
 *     { value: 'basic', label: 'Basic Auth' },
 *     { value: 'bearer', label: 'Bearer Token' },
 *   ]}
 *   required
 * />
 * ```
 *
 * @example Lazy-load on scroll
 * ```tsx
 * const [items, setItems] = useState<SelectOption[]>([]);
 * const [loadingMore, setLoadingMore] = useState(false);
 * const [hasMore, setHasMore] = useState(true);
 * const page = useRef(0);
 *
 * const loadNext = async () => {
 *   if (loadingMore || !hasMore) return;
 *   setLoadingMore(true);
 *   const { results, isLast } = await api.fetchTemplates(page.current);
 *   setItems(prev => [...prev, ...results]);
 *   setHasMore(!isLast);
 *   page.current += 1;
 *   setLoadingMore(false);
 * };
 *
 * useEffect(() => { loadNext(); }, []);
 *
 * <SelectField
 *   label="Template"
 *   options={items}
 *   onScrollEnd={loadNext}
 *   loadingMore={loadingMore}
 *   hasMore={hasMore}
 * />
 * ```
 */
const SelectField = React.forwardRef(
  (
    {
      label,
      required,
      helperText,
      error,
      disabled,
      loading,
      placeholder = "Select an option",
      value,
      defaultValue,
      onValueChange,
      onSelect,
      interceptValue,
      options,
      searchable,
      searchPlaceholder = "Search...",
      separateGroups,
      searchValue,
      onSearchChange,
      wrapperClassName,
      triggerClassName,
      contentClassName,
      labelClassName,
      id,
      name,
      onScrollEnd,
      loadingMore,
      hasMore,
      truncateOptionText,
      emptyMessage = "No options available",
    }: SelectFieldProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const searchRef = React.useRef<HTMLInputElement>(null);
    const openedByKeyboard = React.useRef(false);
    const [isOpen, setIsOpen] = React.useState(false);
    React.useEffect(() => {
      if (!isOpen || !searchable) return;
      // Keyboard users need a route into search. Do not summon the virtual
      // keyboard for a touch opening; arrow navigation still reaches search.
      if (
        !openedByKeyboard.current &&
        window.matchMedia?.("(pointer: coarse)")?.matches
      )
        return;
      const frame = window.requestAnimationFrame(() =>
        searchRef.current?.focus()
      );
      return () => window.cancelAnimationFrame(frame);
    }, [isOpen, searchable]);

    // Internal state for uncontrolled mode. When `searchValue` is provided,
    // the consumer owns the value and this state is unused.
    const [searchQuery, setSearchQuery] = React.useState("");
    const isSearchControlled = searchValue !== undefined;
    const effectiveSearchQuery = isSearchControlled ? searchValue : searchQuery;

    // Track the current selection ourselves so we always know which option is
    // selected — even in uncontrolled mode. This lets us keep the selected
    // option mounted while the search filter hides everything else (see the
    // filter below), which prevents Radix from blanking the trigger value and
    // stealing focus off the search input when the selected item unmounts.
    const isValueControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? ""
    );
    const selectedValue = isValueControlled ? value : uncontrolledValue;

    // Combined value change handler that also fires onSelect with full option object.
    // When interceptValue returns false, onValueChange is skipped (only onSelect fires).
    const handleValueChange = React.useCallback(
      (newValue: string) => {
        const intercepted = interceptValue?.(newValue) === false;

        if (!intercepted) {
          onValueChange?.(newValue);
          if (!isValueControlled) {
            setUncontrolledValue(newValue);
          }
        }

        if (onSelect) {
          const option = options.find((o) => o.value === newValue);
          if (option) {
            onSelect(option);
          }
        }
      },
      [onValueChange, onSelect, interceptValue, options, isValueControlled]
    );

    // Support re-selection: fire onSelect when clicking the already-selected
    // item. Radix only fires onValueChange for *new* values, so without this
    // clicking an action item like "Add custom date" a second time would be a
    // no-op.
    const handleItemClick = React.useCallback(
      (option: SelectOption) => {
        if (option.value === selectedValue) {
          handleValueChange(option.value);
        }
      },
      [selectedValue, handleValueChange]
    );

    // Derive state from props
    const derivedState = error ? "error" : "default";

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Group options by group property.
    //
    // When client-side filtering is active, non-matching options are hidden
    // (rendered with `display:none`) rather than removed from the tree. The
    // one exception we *must* keep mounted is the currently-selected option:
    // if Radix's selected item unmounts, the trigger loses its displayed value
    // and focus is pulled off the search input. `matchCount` tracks how many
    // options are actually visible so the "no results" / footer states stay
    // accurate.
    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, (SelectOption & { hidden?: boolean })[]> =
        {};
      const ungrouped: (SelectOption & { hidden?: boolean })[] = [];
      let matchCount = 0;

      const filtering = !!searchable && !isSearchControlled && !!searchQuery;
      const query = searchQuery.toLowerCase();

      options.forEach((option) => {
        const isMatch =
          !filtering || option.label.toLowerCase().includes(query);
        const isSelected = option.value === selectedValue && !!selectedValue;

        // Drop only options that neither match the query nor are selected.
        if (!isMatch && !isSelected) {
          return;
        }

        if (isMatch) matchCount++;
        const entry = { ...option, hidden: !isMatch };

        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = [];
          }
          groups[option.group].push(entry);
        } else {
          ungrouped.push(entry);
        }
      });

      return { groups, ungrouped, matchCount };
    }, [options, searchable, isSearchControlled, searchQuery, selectedValue]);

    const hasGroups = Object.keys(groupedOptions.groups).length > 0;

    // Number of *visible* options — drives the empty-state and footer rows.
    const totalRendered = groupedOptions.matchCount;
    const showEndOfList =
      hasMore === false && totalRendered > 0 && !loadingMore;

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (!isSearchControlled) {
        setSearchQuery(next);
      }
      onSearchChange?.(next);
    };

    const handleSearchKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      // Escape must reach Radix so a searchable list can close. Text keys
      // stay in the input instead of triggering Select's typeahead.
      if (event.key === "Escape") return;
      event.stopPropagation();
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const rows = Array.from(
          event.currentTarget
            .closest('[role="listbox"]')
            ?.querySelectorAll<HTMLElement>(
              '[role="option"]:not([data-disabled])'
            ) ?? []
        ).filter((row) => getComputedStyle(row).display !== "none");
        (event.key === "ArrowDown" ? rows[0] : rows.at(-1))?.focus();
      } else if (event.key === "Enter") {
        event.preventDefault();
      }
    };

    // Reset search when dropdown closes. In controlled mode we notify the
    // consumer so they can reset their state; in uncontrolled mode we clear
    // our own state directly.
    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        if (isSearchControlled) {
          onSearchChange?.("");
        } else {
          setSearchQuery("");
        }
      }
    };

    return (
      <div
        className={cn(
          "font-[family-name:var(--font-v2,Inter,sans-serif)] flex flex-col gap-2",
          wrapperClassName
        )}
        onPointerDownCapture={(event) => {
          if ((event.target as HTMLElement).closest('[role="combobox"]'))
            openedByKeyboard.current = false;
        }}
        onKeyDownCapture={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('[role="combobox"]'))
            openedByKeyboard.current = true;
          if (
            !searchable ||
            event.key !== "ArrowUp" ||
            target.getAttribute("role") !== "option"
          )
            return;
          const first = Array.from(
            target
              .closest('[role="listbox"]')
              ?.querySelectorAll<HTMLElement>(
                '[role="option"]:not([data-disabled])'
              ) ?? []
          ).find((row) => getComputedStyle(row).display !== "none");
          if (target === first) {
            event.preventDefault();
            event.stopPropagation();
            searchRef.current?.focus();
          }
        }}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "text-sm font-medium leading-[1.4] tracking-[-0.16px] text-[var(--v2-text-primary,#484848)]",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-v2-semantic-error-primary ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Select */}
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          disabled={disabled || loading}
          name={name}
          onOpenChange={handleOpenChange}
        >
          <SelectTrigger
            ref={ref}
            id={selectId}
            state={derivedState}
            className={cn(
              "relative",
              loading && "pr-10",
              // Routing uses the supporting-text placeholder role. Radix
              // puts the empty-state attribute on the trigger.
              separateGroups &&
                "data-[placeholder]:[--v2-select-value-color:var(--v2-text-muted,#707070)]",
              triggerClassName
            )}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
          >
            <SelectValue placeholder={placeholder} />
            {loading && (
              <Loader2 className="absolute right-8 size-4 animate-spin motion-reduce:[animation-duration:2s] text-[var(--v2-text-muted,#707070)]" />
            )}
          </SelectTrigger>
          <SelectContent
            onViewportScrollEnd={hasMore !== false ? onScrollEnd : undefined}
            hideScrollButtons={totalRendered === 0}
            truncateOptionText={truncateOptionText}
            className={contentClassName}
          >
            {/* Search input */}
            {searchable && (
              <div className="border-b border-solid border-v2-semantic-border-layout p-2">
                <div className="flex h-11 items-center gap-2 rounded-lg border border-solid border-v2-semantic-border-input bg-v2-semantic-bg-primary px-3 focus-within:border-[var(--v2-semantic-border-focus,var(--semantic-primary))]">
                  <Search
                    aria-hidden="true"
                    className="size-4 shrink-0 text-[var(--v2-text-muted,#707070)]"
                  />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    value={effectiveSearchQuery}
                    onChange={handleSearchChange}
                    className="h-full min-w-0 w-full border-0 bg-transparent p-0 text-sm leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)] placeholder:text-[var(--v2-text-placeholder,#707070)] focus:outline-none focus:shadow-none"
                    // Prevent closing dropdown when clicking input
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
              </div>
            )}

            {/* Ungrouped options. Non-matching options stay mounted but hidden
                (only the selected option is ever kept while filtering). */}
            {groupedOptions.ungrouped.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled || option.hidden}
                className={cn(option.hidden && "hidden")}
                onPointerUp={() => handleItemClick(option)}
              >
                {option.label}
              </SelectItem>
            ))}

            {/* Grouped options */}
            {hasGroups &&
              Object.entries(groupedOptions.groups).map(
                ([groupName, groupOptions]) => {
                  // Hide the group label when every option in it is filtered
                  // out (i.e. only a hidden selected item remains).
                  const hasVisible = groupOptions.some((o) => !o.hidden);
                  return (
                    <SelectGroup
                      key={groupName}
                      className={cn(
                        "mt-2 first:mt-0",
                        separateGroups &&
                          "border-t border-solid border-v2-semantic-border-layout pt-1"
                      )}
                    >
                      {hasVisible && <SelectLabel>{groupName}</SelectLabel>}
                      {groupOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled || option.hidden}
                          className={cn(option.hidden && "hidden")}
                          onPointerUp={() => handleItemClick(option)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                }
              )}

            {/* No results message — based on the count of *visible* options. */}
            {searchable && effectiveSearchQuery && totalRendered === 0 && (
              <div className="py-6 text-center text-xs text-[var(--v2-text-muted,#707070)]">
                No results found
              </div>
            )}

            {/* Empty state — no options at all and nothing being searched/loaded. */}
            {options.length === 0 && !effectiveSearchQuery && !loadingMore && (
              <div
                role="status"
                className="px-3 py-6 text-center text-xs text-[var(--v2-text-muted,#707070)]"
              >
                {emptyMessage}
              </div>
            )}

            {/* Loading-more row (lazy-load) */}
            {loadingMore && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center justify-center gap-2 py-2 text-xs text-[var(--v2-text-muted,#707070)]"
              >
                <Loader2
                  className="size-3.5 animate-spin motion-reduce:[animation-duration:2s]"
                  aria-hidden="true"
                />
                <span>Loading more…</span>
              </div>
            )}

            {/* End-of-list footer (lazy-load) */}
            {showEndOfList && (
              <div
                role="status"
                className="py-2 text-center text-xs text-[var(--v2-text-muted,#707070)]"
              >
                End of list
              </div>
            )}
          </SelectContent>
        </Select>

        {/* Helper text / Error message */}
        {(error || helperText) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span
                id={errorId}
                className="text-xs leading-[1.4] text-v2-semantic-error-text motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-0.5 [animation-duration:150ms] ease-out motion-reduce:animate-[v2-fade-in_150ms_ease-out]"
              >
                {error}
              </span>
            ) : helperText ? (
              <span
                id={helperId}
                className="text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)]"
              >
                {helperText}
              </span>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

export {
  SelectField,
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
