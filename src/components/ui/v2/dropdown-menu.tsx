import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { motion, useReducedMotion } from "motion/react";
import { Check, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>,
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Trigger>>
  ) => (
    <DropdownMenuPrimitive.Trigger
      ref={ref}
      className={cn(
        "focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))] focus-visible:outline-offset-[3px]",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const renderDropdownMenuItemChildren = (children: React.ReactNode) =>
  React.Children.toArray(children).map((child, index) => {
    if (React.isValidElement(child)) {
      return child;
    }

    const content = typeof child === "string" ? child.trim() : child;
    if (content === "") return null;

    return (
      <span
        key={index}
        className="min-w-0 flex-1 whitespace-normal break-words leading-[1.4]"
      >
        {content}
      </span>
    );
  });

/** Keep Radix Slot's one-child contract while adding item adornments. */
const renderDropdownMenuContent = (
  children: React.ReactNode,
  asChild: boolean | undefined,
  renderContent: (label: React.ReactNode) => React.ReactNode
) => {
  if (!asChild) return renderContent(children);
  const child = React.Children.only(children);
  if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
    return child;
  }
  return React.cloneElement(
    child,
    undefined,
    renderContent(child.props.children)
  );
};

const DropdownMenuSubTrigger = React.forwardRef(
  (
    {
      className,
      inset,
      children,
      asChild,
      ...props
    }: React.ComponentPropsWithoutRef<
      typeof DropdownMenuPrimitive.SubTrigger
    > & {
      inset?: boolean;
    },
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>>
  ) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      asChild={asChild}
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2.5 py-2 min-h-9 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm leading-5 font-normal text-[var(--v2-text-secondary,#5E5E5E)] outline-none dark:focus-visible:outline dark:focus-visible:[outline-width:1px] dark:focus-visible:-outline-offset-1 dark:focus-visible:outline-v2-semantic-border-focus focus:bg-v2-semantic-bg-ui focus:text-[var(--v2-text-primary,#484848)] data-[state=open]:bg-v2-semantic-bg-ui data-[state=open]:text-[var(--v2-text-primary,#484848)] data-[disabled]:pointer-events-none data-[disabled]:text-[var(--v2-semantic-disabled-text,var(--semantic-disabled-primary))] [&>svg]:shrink-0",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {renderDropdownMenuContent(children, asChild, (label) => (
        <>
          {label}
          <ChevronRight className="ml-auto h-4 w-4" />
        </>
      ))}
    </DropdownMenuPrimitive.SubTrigger>
  )
);
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

/**
 * Arc menu surface: 5px inset, hairline border, floating shadow. The menu grows
 * from its trigger edge. Open rides a sampled spring on transform (580ms) with a
 * quicker opacity tween (160ms); close leaves faster (130ms) and smaller. Rows
 * rise in on a short stagger (35ms steps, capped at four), and reduced motion
 * keeps only a 120ms fade.
 */
const menuSurface = cn(
  "relative z-[9999] max-h-[min(20rem,var(--radix-dropdown-menu-content-available-height))] max-w-[min(20rem,var(--radix-dropdown-menu-content-available-width))] min-w-[min(12rem,var(--radix-dropdown-menu-content-available-width))] overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-[5px] font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal tracking-[-0.16px] text-[var(--v2-text-secondary,#5E5E5E)] shadow-[0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045)]"
);
const menuMotion = cn(
  "origin-[var(--radix-dropdown-menu-content-transform-origin)] data-[state=open]:motion-safe:animate-in data-[state=open]:motion-safe:[animation-name:enter,v2-fade-in] data-[state=open]:motion-safe:[animation-duration:580ms,160ms] data-[state=open]:motion-safe:[animation-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1),cubic-bezier(0.16,1,0.3,1)] data-[state=open]:motion-safe:[animation-fill-mode:both] data-[state=open]:motion-safe:zoom-in-[0.97] data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:[animation-duration:130ms] data-[state=closed]:motion-safe:[animation-timing-function:cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:motion-safe:fade-out-0 data-[state=closed]:motion-safe:zoom-out-[0.985] data-[side=bottom]:motion-safe:slide-in-from-top-[5px] data-[side=top]:motion-safe:slide-in-from-bottom-[5px] data-[side=left]:motion-safe:slide-in-from-right-[5px] data-[side=right]:motion-safe:slide-in-from-left-[5px] data-[side=bottom]:motion-safe:slide-out-to-top-[2.5px] data-[side=top]:motion-safe:slide-out-to-bottom-[2.5px] data-[side=left]:motion-safe:slide-out-to-right-[2.5px] data-[side=right]:motion-safe:slide-out-to-left-[2.5px] motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_100ms_ease-in]"
);
const menuItemMotion = cn(
  "[&>[role^=menuitem]]:data-[state=open]:motion-safe:[animation:enter_240ms_cubic-bezier(0.16,1,0.3,1)_backwards] [&>[role^=menuitem]]:data-[state=open]:motion-safe:[--tw-enter-opacity:0] [&>[role^=menuitem]]:data-[state=open]:data-[side=bottom]:motion-safe:[--tw-enter-translate-y:-2px] [&>[role^=menuitem]]:data-[state=open]:data-[side=top]:motion-safe:[--tw-enter-translate-y:2px] [&>[role^=menuitem]:nth-child(3)]:data-[state=open]:motion-safe:[animation-delay:35ms] [&>[role^=menuitem]:nth-child(4)]:data-[state=open]:motion-safe:[animation-delay:70ms] [&>[role^=menuitem]:nth-child(5)]:data-[state=open]:motion-safe:[animation-delay:105ms] [&>[role^=menuitem]:nth-child(n+6)]:data-[state=open]:motion-safe:[animation-delay:140ms]"
);
// One highlight glides between rows, so rows themselves stay clear on focus.
const menuHighlightOwner = cn(
  "[&_[role^=menuitem]:focus]:bg-transparent",
  // Inline submenus have their own focus surface, outside this highlight.
  "[&_[role=menu]_[role^=menuitem]:focus]:bg-v2-semantic-bg-ui [&_[role=menu]_[data-destructive]:focus]:bg-v2-semantic-error-surface"
);

type MenuHighlight = {
  top: number;
  left: number;
  width: number;
  height: number;
  danger: boolean;
  glide: boolean;
};

const DropdownMenuSubContent = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>,
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.SubContent>>
  ) => (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(menuSurface, menuMotion, className)}
      {...props}
    />
  )
);
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef(
  (
    {
      className,
      sideOffset = 6,
      children,
      onFocus,
      onPointerMoveCapture,
      onKeyDownCapture,
      onCloseAutoFocus,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Content>>
  ) => {
    const reduced = useReducedMotion() ?? false;
    const [highlight, setHighlight] = React.useState<MenuHighlight | null>(
      null
    );
    const pointer = React.useRef(false);
    const clearTimer = React.useRef(0);
    React.useEffect(() => () => window.clearTimeout(clearTimer.current), []);
    // Radix focuses the highlighted row (pointer or keyboard), and the menu
    // itself once the pointer leaves a row, so focus is the one signal to follow.
    const follow = (event: React.FocusEvent<HTMLDivElement>) => {
      const row =
        event.target instanceof HTMLElement
          ? event.target.closest<HTMLElement>('[role^="menuitem"]')
          : null;
      // React focus bubbles through inline submenus. Their offsets belong to
      // their own menu, so never move the parent highlight to a submenu row.
      if (row && row.closest('[role="menu"]') !== event.currentTarget) return;
      window.clearTimeout(clearTimer.current);
      if (!row) {
        // A short grace keeps the highlight gliding across separators and gaps.
        clearTimer.current = window.setTimeout(
          () => setHighlight(null),
          pointer.current ? 70 : 0
        );
        return;
      }
      // Layout offsets stay unscaled while the surface animates. Walk any
      // positioned groups so custom group layouts align with the same owner.
      let top = row.offsetTop;
      let left = row.offsetLeft;
      let parent = row.offsetParent as HTMLElement | null;
      while (parent && parent !== event.currentTarget) {
        top += parent.offsetTop + parent.clientTop - parent.scrollTop;
        left += parent.offsetLeft + parent.clientLeft - parent.scrollLeft;
        parent = parent.offsetParent as HTMLElement | null;
      }
      const next = {
        top,
        left,
        width: row.offsetWidth,
        height: row.offsetHeight,
        danger: row.dataset.destructive !== undefined,
      };
      const glide =
        pointer.current &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      setHighlight((current) => ({
        ...next,
        glide: glide && current !== null,
      }));
    };
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            menuSurface,
            menuMotion,
            menuItemMotion,
            menuHighlightOwner,
            className
          )}
          onFocus={(event) => {
            onFocus?.(event);
            follow(event);
          }}
          onPointerMoveCapture={(event) => {
            pointer.current = event.pointerType !== "touch";
            onPointerMoveCapture?.(event);
          }}
          onKeyDownCapture={(event) => {
            pointer.current = false;
            onKeyDownCapture?.(event);
          }}
          // Giving focus back to the trigger after a mouse-driven close makes browsers draw the keyboard ring around it,
          // so only the keyboard path returns focus (a click leaves it on the page).
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event);
            if (pointer.current && !event.defaultPrevented) {
              event.preventDefault();
            }
          }}
          {...props}
        >
          {/* One highlight glides between rows for the pointer and jumps instantly for the keyboard. */}
          <motion.span
            aria-hidden="true"
            data-menu-highlight=""
            data-tone={highlight?.danger ? "danger" : undefined}
            initial={false}
            animate={
              highlight
                ? {
                    x: highlight.left,
                    y: highlight.top,
                    width: highlight.width,
                    height: highlight.height,
                    opacity: 1,
                  }
                : { opacity: 0 }
            }
            transition={{
              default:
                highlight?.glide && !reduced
                  ? { type: "spring", visualDuration: 0.26, bounce: 0.12 }
                  : { duration: 0 },
              opacity: { duration: reduced ? 0 : 0.08 },
            }}
            className="pointer-events-none absolute left-0 top-0 rounded-sm bg-v2-semantic-bg-ui opacity-0 data-[tone=danger]:bg-v2-semantic-error-surface"
          />
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    );
  }
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef(
  (
    {
      className,
      inset,
      children,
      description,
      suffix,
      asChild,
      destructive,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
      inset?: boolean;
      /** Secondary text displayed below children */
      description?: string;
      /** Content displayed at the right edge of the item */
      suffix?: React.ReactNode;
      /**
       * Marks a dangerous action (delete, archive): error-coloured label and a
       * faint error tint when highlighted. Visual only; selection and
       * keyboard behaviour are unchanged.
       * @default false
       */
      destructive?: boolean;
    },
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Item>>
  ) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      asChild={asChild}
      data-destructive={destructive ? "" : undefined}
      className={cn(
        // 4px radius = menu 8px minus its 4px padding, so row and menu corners stay concentric.
        // No keyboard-only ring: Radix focuses the highlighted row on pointer move too, so
        // the focus-visible pseudo-class is also true under a mouse hover (verified in Chrome).
        "relative flex min-w-0 cursor-pointer select-none items-center gap-2.5 rounded-sm px-[11px] py-2 min-h-9 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm leading-[1.4] font-normal text-[var(--v2-text-secondary,#5E5E5E)] outline-none dark:focus-visible:outline dark:focus-visible:[outline-width:1px] dark:focus-visible:-outline-offset-1 dark:focus-visible:outline-v2-semantic-border-focus focus:bg-v2-semantic-bg-ui focus:text-[var(--v2-text-primary,#484848)] data-[disabled]:pointer-events-none data-[disabled]:text-[var(--v2-semantic-disabled-text,var(--semantic-disabled-primary))] [&>svg]:shrink-0",
        // Tint is an explicit token (`/alpha` on a var() colour compiles to nothing in Tailwind 3.4).
        destructive &&
          "text-v2-semantic-error-text focus:bg-v2-semantic-error-surface focus:text-v2-semantic-error-text",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {renderDropdownMenuContent(children, asChild, (label) => (
        <>
          {description ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="min-w-0 whitespace-normal break-words leading-[1.4]">
                {renderDropdownMenuItemChildren(label)}
              </span>
              <span className="min-w-0 whitespace-normal break-words text-xs text-[var(--v2-text-muted,#707070)]">
                {description}
              </span>
            </div>
          ) : (
            renderDropdownMenuItemChildren(label)
          )}
          {suffix && (
            <span className="ml-auto text-xs text-[var(--v2-text-muted,#707070)] shrink-0 pl-4">
              {suffix}
            </span>
          )}
        </>
      ))}
    </DropdownMenuPrimitive.Item>
  )
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef(
  (
    {
      className,
      children,
      checked,
      description,
      suffix,
      asChild,
      ...props
    }: React.ComponentPropsWithoutRef<
      typeof DropdownMenuPrimitive.CheckboxItem
    > & {
      /** Secondary text displayed below children */
      description?: string;
      /** Content displayed at the right edge of the item */
      suffix?: React.ReactNode;
    },
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>>
  ) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      asChild={asChild}
      className={cn(
        "relative flex min-w-0 cursor-pointer select-none items-center gap-2 rounded-sm py-2 pl-8 pr-2.5 min-h-9 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm leading-5 font-normal text-[var(--v2-text-secondary,#5E5E5E)] outline-none dark:focus-visible:outline dark:focus-visible:[outline-width:1px] dark:focus-visible:-outline-offset-1 dark:focus-visible:outline-v2-semantic-border-focus focus:bg-v2-semantic-bg-ui focus:text-[var(--v2-text-primary,#484848)] data-[state=checked]:text-[var(--v2-text-primary,#484848)] data-[state=checked]:data-[disabled]:text-[var(--v2-semantic-disabled-text,var(--semantic-disabled-primary))] data-[disabled]:pointer-events-none data-[disabled]:text-[var(--v2-semantic-disabled-text,var(--semantic-disabled-primary))]",
        className
      )}
      checked={checked}
      {...props}
    >
      {renderDropdownMenuContent(children, asChild, (label) => (
        <>
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-v2-semantic-border-accent">
            <DropdownMenuPrimitive.ItemIndicator>
              <Check className="h-4 w-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.85] motion-safe:[animation-duration:180ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))]" />
            </DropdownMenuPrimitive.ItemIndicator>
          </span>
          {description ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="min-w-0 whitespace-normal break-words leading-[1.4]">
                {renderDropdownMenuItemChildren(label)}
              </span>
              <span className="min-w-0 whitespace-normal break-words text-xs text-[var(--v2-text-muted,#707070)]">
                {description}
              </span>
            </div>
          ) : (
            renderDropdownMenuItemChildren(label)
          )}
          {suffix && (
            <span className="ml-auto text-xs text-[var(--v2-text-muted,#707070)] shrink-0 pl-4">
              {suffix}
            </span>
          )}
        </>
      ))}
    </DropdownMenuPrimitive.CheckboxItem>
  )
);
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef(
  (
    {
      className,
      children,
      description,
      suffix,
      asChild,
      ...props
    }: React.ComponentPropsWithoutRef<
      typeof DropdownMenuPrimitive.RadioItem
    > & {
      /** Secondary text displayed below children */
      description?: string;
      /** Content displayed at the right edge of the item */
      suffix?: React.ReactNode;
    },
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>>
  ) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      asChild={asChild}
      className={cn(
        "relative flex min-w-0 cursor-pointer select-none items-center gap-2 rounded-sm py-2 pl-8 pr-2.5 min-h-9 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm leading-5 font-normal text-[var(--v2-text-secondary,#5E5E5E)] outline-none dark:focus-visible:outline dark:focus-visible:[outline-width:1px] dark:focus-visible:-outline-offset-1 dark:focus-visible:outline-v2-semantic-border-focus focus:bg-v2-semantic-bg-ui focus:text-[var(--v2-text-primary,#484848)] data-[state=checked]:text-[var(--v2-text-primary,#484848)] data-[state=checked]:data-[disabled]:text-[var(--v2-semantic-disabled-text,var(--semantic-disabled-primary))] data-[disabled]:pointer-events-none data-[disabled]:text-[var(--v2-semantic-disabled-text,var(--semantic-disabled-primary))]",
        className
      )}
      {...props}
    >
      {renderDropdownMenuContent(children, asChild, (label) => (
        <>
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-v2-semantic-border-accent">
            <DropdownMenuPrimitive.ItemIndicator>
              <Check className="h-4 w-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.85] motion-safe:[animation-duration:180ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))]" />
            </DropdownMenuPrimitive.ItemIndicator>
          </span>
          {description ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="min-w-0 whitespace-normal break-words leading-[1.4]">
                {renderDropdownMenuItemChildren(label)}
              </span>
              <span className="min-w-0 whitespace-normal break-words text-xs text-[var(--v2-text-muted,#707070)]">
                {description}
              </span>
            </div>
          ) : (
            renderDropdownMenuItemChildren(label)
          )}
          {suffix && (
            <span className="ml-auto text-xs text-[var(--v2-text-muted,#707070)] shrink-0 pl-4">
              {suffix}
            </span>
          )}
        </>
      ))}
    </DropdownMenuPrimitive.RadioItem>
  )
);
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef(
  (
    {
      className,
      inset,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
      inset?: boolean;
    },
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Label>>
  ) => (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium text-[var(--v2-text-primary,#484848)]",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>,
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Separator>>
  ) => (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-v2-semantic-border-layout", className)}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto inline-flex h-5 shrink-0 items-center rounded border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary px-1 text-xs text-[var(--v2-text-muted,#707070)]",
        className
      )}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
