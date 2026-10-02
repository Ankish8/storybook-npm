import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

/**
 * A flexible tabs component with underline-style active indicator.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 */
const Tabs = TabsPrimitive.Root;

export interface TabsListProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> {
  /** When true, tabs stretch to fill the full width equally */
  fullWidth?: boolean;
}

const TabsList = React.forwardRef(
  (
    { className, fullWidth, ...props }: TabsListProps,
    ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.List>>
  ) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center border-b border-solid border-semantic-border-layout w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:border-b-0",
        fullWidth && "[&>*]:flex-1",
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.Trigger>>
  ) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap py-4 px-3 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-5 tracking-[0.014px] border-b-2 border-solid -mb-px cursor-pointer transition-colors",
        "text-[var(--v2-text-muted,#707070)] border-transparent hover:text-[var(--v2-text-primary,#484848)]",
        "data-[state=active]:text-[var(--v2-text-primary,#484848)] data-[state=active]:border-semantic-primary",
        "focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[-3px] focus-visible:outline-semantic-primary disabled:pointer-events-none disabled:text-semantic-disabled-primary",
        "data-[orientation=vertical]:mb-0 data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-l-4 data-[orientation=vertical]:px-6 data-[orientation=vertical]:data-[state=active]:border-semantic-border-accent data-[orientation=vertical]:data-[state=active]:bg-semantic-bg-ui",
        className
      )}
      {...props}
    />
  )
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.Content>>
  ) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 font-[family-name:var(--font-v2,Inter,sans-serif)] text-[var(--v2-text-secondary,#5E5E5E)] focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

const TabsCount = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "inline-flex size-[18px] items-center justify-center rounded-full border-[0.4px] border-solid border-semantic-border-layout bg-semantic-disabled-secondary font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-normal leading-none text-[var(--v2-text-secondary,#5E5E5E)]",
      className
    )}
    {...props}
  />
);

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsCount };
