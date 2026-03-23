import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

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
const Tabs = TabsPrimitive.Root

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** When true, tabs stretch to fill the full width equally */
  fullWidth?: boolean
}

const TabsList = React.forwardRef(({ className, fullWidth, ...props }: TabsListProps, ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.List>>) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center border-b border-semantic-border-layout w-full",
      fullWidth && "[&>*]:flex-1",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>, ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.Trigger>>) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap py-3 px-3 text-sm font-medium border-b-2 -mb-px cursor-pointer transition-colors",
      "text-semantic-text-muted border-transparent hover:text-semantic-text-secondary",
      "data-[state=active]:text-semantic-text-primary data-[state=active]:border-semantic-primary",
      "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>, ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.Content>>) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 focus-visible:outline-none",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
