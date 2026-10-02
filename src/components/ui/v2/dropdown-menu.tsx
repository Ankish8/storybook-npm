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
        "flex cursor-pointer select-none items-center gap-2 rounded-none px-1.5 py-2.5 min-h-12 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base text-semantic-text-primary outline-none focus:bg-semantic-bg-ui focus:text-semantic-text-primary data-[state=open]:bg-semantic-bg-ui",
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
        "z-[9999] max-h-[min(20rem,var(--radix-dropdown-menu-content-available-height))] max-w-[min(20rem,var(--radix-dropdown-menu-content-available-width))] min-w-[8rem] overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1 font-[family-name:var(--font-v2,Inter,sans-serif)] text-semantic-text-primary shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
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
          "z-[9999] max-h-[min(20rem,var(--radix-dropdown-menu-content-available-height))] max-w-[min(20rem,var(--radix-dropdown-menu-content-available-width))] min-w-[8rem] overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1 font-[family-name:var(--font-v2,Inter,sans-serif)] text-semantic-text-primary shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
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
      ...props
    }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
      inset?: boolean;
      /** Secondary text displayed below children */
      description?: string;
      /** Content displayed at the right edge of the item */
      suffix?: React.ReactNode;
    },
    ref: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Item>>
  ) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      asChild={asChild}
      className={cn(
        "relative flex min-w-0 cursor-pointer select-none items-center gap-2 rounded-none px-1.5 py-2.5 min-h-12 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base text-semantic-text-primary outline-none transition-colors focus:bg-semantic-bg-ui focus:text-semantic-text-primary data-[disabled]:pointer-events-none data-[disabled]:text-semantic-disabled-primary [&>svg]:shrink-0",
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
              <span className="min-w-0 whitespace-normal break-words text-xs text-semantic-text-muted">
                {description}
              </span>
            </div>
          ) : (
            renderDropdownMenuItemChildren(label)
          )}
          {suffix && (
            <span className="ml-auto text-xs text-semantic-text-muted shrink-0 pl-4">
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
        "relative flex min-w-0 cursor-pointer select-none items-center gap-2 rounded-none py-2.5 pl-8 pr-1.5 min-h-12 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base text-semantic-text-primary outline-none transition-colors focus:bg-semantic-bg-ui focus:text-semantic-text-primary data-[disabled]:pointer-events-none data-[disabled]:text-semantic-disabled-primary",
        className
      )}
      checked={checked}
      {...props}
    >
      {renderDropdownMenuContent(children, asChild, (label) => (
        <>
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-semantic-border-accent">
            <DropdownMenuPrimitive.ItemIndicator>
              <Check className="h-4 w-4" />
            </DropdownMenuPrimitive.ItemIndicator>
          </span>
          {description ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="min-w-0 whitespace-normal break-words leading-normal">
                {renderDropdownMenuItemChildren(label)}
              </span>
              <span className="min-w-0 whitespace-normal break-words text-xs text-semantic-text-muted">
                {description}
              </span>
            </div>
          ) : (
            renderDropdownMenuItemChildren(label)
          )}
          {suffix && (
            <span className="ml-auto text-xs text-semantic-text-muted shrink-0 pl-4">
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
        "relative flex min-w-0 cursor-pointer select-none items-center gap-2 rounded-none py-2.5 pl-8 pr-1.5 min-h-12 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base text-semantic-text-primary outline-none transition-colors focus:bg-semantic-bg-ui focus:text-semantic-text-primary data-[disabled]:pointer-events-none data-[disabled]:text-semantic-disabled-primary",
        className
      )}
      {...props}
    >
      {renderDropdownMenuContent(children, asChild, (label) => (
        <>
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-semantic-border-accent">
            <DropdownMenuPrimitive.ItemIndicator>
              <Check className="h-4 w-4" />
            </DropdownMenuPrimitive.ItemIndicator>
          </span>
          {description ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="min-w-0 whitespace-normal break-words leading-normal">
                {renderDropdownMenuItemChildren(label)}
              </span>
              <span className="min-w-0 whitespace-normal break-words text-xs text-semantic-text-muted">
                {description}
              </span>
            </div>
          ) : (
            renderDropdownMenuItemChildren(label)
          )}
          {suffix && (
            <span className="ml-auto text-xs text-semantic-text-muted shrink-0 pl-4">
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
        "px-2 py-1.5 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-semibold text-semantic-text-secondary",
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
        "ml-auto inline-flex h-5 shrink-0 items-center rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary px-1 text-xs text-semantic-text-muted",
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
