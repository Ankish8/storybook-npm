import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
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
        "focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-semantic-primary focus-visible:outline-offset-[3px]",
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
        className="min-w-0 flex-1 whitespace-normal break-words leading-normal"
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
        "flex cursor-pointer select-none items-center gap-2 rounded-sm px-1.5 py-2.5 min-h-12 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-normal text-[var(--v2-text-secondary,#5E5E5E)] outline-none focus:bg-semantic-bg-ui focus:text-[var(--v2-text-primary,#484848)] data-[state=open]:bg-semantic-bg-ui data-[state=open]:text-[var(--v2-text-primary,#484848)]",
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
      className={cn(
        "z-[9999] origin-[var(--radix-dropdown-menu-content-transform-origin)] data-[state=open]:motion-safe:[animation-duration:200ms] data-[state=closed]:motion-safe:[animation-duration:120ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] data-[state=closed]:[animation-timing-function:var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_100ms_ease-in] max-h-[min(20rem,var(--radix-dropdown-menu-content-available-height))] max-w-[min(20rem,var(--radix-dropdown-menu-content-available-width))] min-w-[8rem] overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1 font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal text-[var(--v2-text-secondary,#5E5E5E)] shadow-lg data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:fade-out-0 data-[state=open]:motion-safe:fade-in-0 data-[state=closed]:motion-safe:zoom-out-[0.98] data-[state=open]:motion-safe:zoom-in-[0.98] data-[side=bottom]:motion-safe:slide-in-from-top-1 data-[side=left]:motion-safe:slide-in-from-right-1 data-[side=right]:motion-safe:slide-in-from-left-1 data-[side=top]:motion-safe:slide-in-from-bottom-1",
        className
      )}
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
      sideOffset = 4,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Content>>
  ) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-[9999] max-h-[min(20rem,var(--radix-dropdown-menu-content-available-height))] max-w-[min(20rem,var(--radix-dropdown-menu-content-available-width))] min-w-[8rem] overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1 font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal text-[var(--v2-text-secondary,#5E5E5E)] shadow-md",
          "origin-[var(--radix-dropdown-menu-content-transform-origin)] data-[state=open]:motion-safe:[animation-duration:200ms] data-[state=closed]:motion-safe:[animation-duration:120ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] data-[state=closed]:[animation-timing-function:var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_100ms_ease-in]",
          "data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:fade-out-0 data-[state=open]:motion-safe:fade-in-0 data-[state=closed]:motion-safe:zoom-out-[0.98] data-[state=open]:motion-safe:zoom-in-[0.98] data-[side=bottom]:motion-safe:slide-in-from-top-1 data-[side=left]:motion-safe:slide-in-from-right-1 data-[side=right]:motion-safe:slide-in-from-left-1 data-[side=top]:motion-safe:slide-in-from-bottom-1",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
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
        "relative flex min-w-0 cursor-pointer select-none items-center gap-2 rounded-sm px-1.5 py-2.5 min-h-12 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-normal text-[var(--v2-text-secondary,#5E5E5E)] outline-none focus:bg-semantic-bg-ui focus:text-[var(--v2-text-primary,#484848)] data-[disabled]:pointer-events-none data-[disabled]:text-semantic-disabled-primary [&>svg]:shrink-0",
        // Tint is an explicit token (`/alpha` on a var() colour compiles to nothing in Tailwind 3.4).
        destructive &&
          "text-semantic-error-text focus:bg-semantic-error-surface focus:text-semantic-error-text",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {renderDropdownMenuContent(children, asChild, (label) => (
        <>
          {description ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="min-w-0 whitespace-normal break-words leading-normal">
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
        "relative flex min-w-0 cursor-pointer select-none items-center gap-2 rounded-sm py-2.5 pl-8 pr-1.5 min-h-12 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-normal text-[var(--v2-text-secondary,#5E5E5E)] outline-none focus:bg-semantic-bg-ui focus:text-[var(--v2-text-primary,#484848)] data-[state=checked]:text-[var(--v2-text-primary,#484848)] data-[state=checked]:data-[disabled]:text-semantic-disabled-primary data-[disabled]:pointer-events-none data-[disabled]:text-semantic-disabled-primary",
        className
      )}
      checked={checked}
      {...props}
    >
      {renderDropdownMenuContent(children, asChild, (label) => (
        <>
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-semantic-border-accent">
            <DropdownMenuPrimitive.ItemIndicator>
              <Check className="h-4 w-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.85] motion-safe:[animation-duration:180ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))]" />
            </DropdownMenuPrimitive.ItemIndicator>
          </span>
          {description ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="min-w-0 whitespace-normal break-words leading-normal">
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
        "relative flex min-w-0 cursor-pointer select-none items-center gap-2 rounded-sm py-2.5 pl-8 pr-1.5 min-h-12 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-normal text-[var(--v2-text-secondary,#5E5E5E)] outline-none focus:bg-semantic-bg-ui focus:text-[var(--v2-text-primary,#484848)] data-[state=checked]:text-[var(--v2-text-primary,#484848)] data-[state=checked]:data-[disabled]:text-semantic-disabled-primary data-[disabled]:pointer-events-none data-[disabled]:text-semantic-disabled-primary",
        className
      )}
      {...props}
    >
      {renderDropdownMenuContent(children, asChild, (label) => (
        <>
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-semantic-border-accent">
            <DropdownMenuPrimitive.ItemIndicator>
              <Check className="h-4 w-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.85] motion-safe:[animation-duration:180ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))]" />
            </DropdownMenuPrimitive.ItemIndicator>
          </span>
          {description ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="min-w-0 whitespace-normal break-words leading-normal">
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
      className={cn("-mx-1 my-1 h-px bg-semantic-border-layout", className)}
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
        "ml-auto inline-flex h-5 shrink-0 items-center rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary px-1 text-xs text-[var(--v2-text-muted,#707070)]",
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
