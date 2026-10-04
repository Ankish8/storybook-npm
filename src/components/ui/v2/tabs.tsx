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

// Keep the Radix DOM and its immediate selection/focus behavior. Only the
// decorative rail moves, so text and panels never wait for the spring.
const useBrowserLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function useTabIndicator(listRef: React.RefObject<HTMLDivElement | null>) {
  useBrowserLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastTime = 0;
    let ready = false;
    let vertical = false;
    let active: HTMLElement | undefined;
    let current = [0, 0, 0, 0];
    let target = [0, 0, 0, 0];
    let velocity = [0, 0, 0, 0];
    // Critically damped spring: omega=30 rad/s (mass=1, stiffness=900,
    // damping=60). Exact integration preserves velocity on rapid retargets.
    const omega = 30;

    const paint = () => {
      ["x", "y", "width", "height"].forEach((axis, index) => {
        list.style.setProperty(`--v2-tab-${axis}`, `${current[index]}px`);
      });
    };
    const cancel = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const snap = () => {
      cancel();
      current = [...target];
      velocity = [0, 0, 0, 0];
      paint();
    };
    const tick = (time: number) => {
      const dt = Math.max(0, (time - lastTime) / 1000);
      lastTime = time;
      const decay = Math.exp(-omega * dt);
      let settled = true;
      current = current.map((position, index) => {
        const offset = position - target[index];
        const coefficient = velocity[index] + omega * offset;
        const nextOffset = (offset + coefficient * dt) * decay;
        velocity[index] = (velocity[index] - omega * coefficient * dt) * decay;
        if (Math.abs(nextOffset) > 0.1 || Math.abs(velocity[index]) > 0.5) {
          settled = false;
        }
        return target[index] + nextOffset;
      });
      paint();
      if (settled) snap();
      else frame = window.requestAnimationFrame(tick);
    };

    const triggers = () =>
      Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]')).filter(
        (trigger) => trigger.closest('[role="tablist"]') === list
      );

    const measure = (animate: boolean) => {
      const selected = triggers().find(
        (trigger) => trigger.getAttribute("data-state") === "active"
      );
      if (!selected) {
        cancel();
        ready = false;
        active = undefined;
        list.removeAttribute("data-motion-indicator");
        return;
      }
      const bounds = list.getBoundingClientRect();
      const tab = selected.getBoundingClientRect();
      // Hidden Docs samples can have zero geometry. Keep the static border
      // until ResizeObserver supplies a real measurement.
      if (!tab.width || !tab.height) return;
      const nextVertical = list.getAttribute("data-orientation") === "vertical";
      target = [
        tab.left - bounds.left + list.scrollLeft - list.clientLeft,
        tab.top - bounds.top + list.scrollTop - list.clientTop,
        tab.width,
        tab.height,
      ];
      const selectionChanged = selected !== active;
      const shouldAnimate =
        animate &&
        ready &&
        selectionChanged &&
        nextVertical === vertical &&
        !preference?.matches;
      active = selected;
      vertical = nextVertical;
      ready = true;
      list.setAttribute("data-motion-indicator", "true");
      if (!shouldAnimate) snap();
      else if (!frame) {
        lastTime = performance.now();
        frame = window.requestAnimationFrame(tick);
      }
    };

    const resize =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measure(false))
        : undefined;
    const observeSizes = () => {
      resize?.disconnect();
      resize?.observe(list);
      triggers().forEach((trigger) => resize?.observe(trigger));
    };
    const mutations = new MutationObserver((records) => {
      const structureChanged = records.some(
        (record) => record.type === "childList"
      );
      if (structureChanged) observeSizes();
      measure(!structureChanged);
    });
    mutations.observe(list, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-state", "data-orientation", "dir", "disabled"],
    });
    const remeasure = () => measure(false);
    observeSizes();
    measure(false);
    window.addEventListener("resize", remeasure);
    preference?.addEventListener("change", remeasure);
    document.fonts?.addEventListener("loadingdone", remeasure);
    return () => {
      cancel();
      mutations.disconnect();
      resize?.disconnect();
      window.removeEventListener("resize", remeasure);
      preference?.removeEventListener("change", remeasure);
      document.fonts?.removeEventListener("loadingdone", remeasure);
      list.removeAttribute("data-motion-indicator");
      ["x", "y", "width", "height"].forEach((axis) =>
        list.style.removeProperty(`--v2-tab-${axis}`)
      );
    };
  }, [listRef]);
}

const TabsList = React.forwardRef(
  (
    { className, fullWidth, ...props }: TabsListProps,
    ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.List>>
  ) => {
    const listRef = React.useRef<HTMLDivElement>(null);
    useTabIndicator(listRef);
    const composedRef = React.useCallback(
      (element: HTMLDivElement | null) => {
        listRef.current = element;
        if (typeof ref === "function") ref(element);
        else if (ref) ref.current = element;
      },
      [ref]
    );
    return (
      <TabsPrimitive.List
        ref={composedRef}
        className={cn(
          "relative inline-flex items-center border-b border-solid border-semantic-border-layout w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:border-b-0",
          "after:pointer-events-none after:absolute after:left-0 after:bottom-[-1px] after:h-[2px] after:w-[var(--v2-tab-width,0px)] after:translate-x-[var(--v2-tab-x,0px)] after:bg-semantic-primary after:content-[''] after:opacity-0 data-[motion-indicator=true]:after:opacity-100",
          "[&[data-motion-indicator=true]>[role=tab][data-state=active]]:border-transparent",
          "data-[orientation=vertical]:after:top-0 data-[orientation=vertical]:after:bottom-auto data-[orientation=vertical]:after:w-1 data-[orientation=vertical]:after:h-[var(--v2-tab-height,0px)] data-[orientation=vertical]:after:translate-x-0 data-[orientation=vertical]:after:translate-y-[var(--v2-tab-y,0px)] data-[orientation=vertical]:after:bg-semantic-border-accent",
          fullWidth && "[&>*]:flex-1",
          className
        )}
        {...props}
      />
    );
  }
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
        "inline-flex items-center justify-center gap-2 whitespace-nowrap py-4 px-3 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-5 tracking-[0.014px] border-b-2 border-solid -mb-px cursor-pointer transition-colors duration-150 ease-out",
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
        "data-[state=active]:motion-safe:animate-in data-[state=active]:fade-in-0 duration-150 ease-out",
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
