import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

/**
 * A flexible tabs component. The default "underline" style draws a rail under the
 * selected tab; `<TabsList variant="pill">` renders a segmented control instead.
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
const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ onValueChange, style, ...props }, ref) => {
  // The incoming panel slides in from the side the new tab sits on (+1 after the old tab, -1 before it), as in Arc.
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [direction, setDirection] = React.useState(1);
  // Radix reports uncontrolled changes after it has already committed them, so the previous value is tracked here.
  const lastValue = React.useRef(props.value ?? props.defaultValue);
  const composedRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      rootRef.current = element;
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    },
    [ref]
  );
  const follow = React.useCallback((next: string | undefined) => {
    const previous = lastValue.current;
    lastValue.current = next;
    const root = rootRef.current;
    if (!root || previous === undefined || next === undefined) return;
    const ids = Array.from(root.querySelectorAll<HTMLElement>('[role="tab"]'))
      .filter((tab) => {
        const panel = tab.closest('[role="tabpanel"]');
        return !panel || panel.contains(root);
      })
      .map((tab) => tab.id);
    const from = ids.findIndex((id) => id.endsWith(`-trigger-${previous}`));
    const to = ids.findIndex((id) => id.endsWith(`-trigger-${next}`));
    if (from >= 0 && to >= 0 && from !== to) setDirection(to > from ? 1 : -1);
  }, []);
  React.useLayoutEffect(() => {
    if (props.value !== undefined && props.value !== lastValue.current)
      follow(props.value);
  }, [props.value, follow]);
  return (
    <TabsPrimitive.Root
      ref={composedRef}
      onValueChange={(next) => {
        follow(next);
        onValueChange?.(next);
      }}
      style={{ "--v2-tab-dir": direction, ...style } as React.CSSProperties}
      {...props}
    />
  );
});
Tabs.displayName = TabsPrimitive.Root.displayName;

export interface TabsListProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> {
  /** When true, tabs stretch to fill the full width equally */
  fullWidth?: boolean;
  /**
   * Visual style. "underline" (default) is the original rail under the selected tab.
   * "pill" is a segmented control: a grey track with a white cursor that glides to the selected tab.
   */
  variant?: "underline" | "pill";
}

// TabsTrigger needs to know the list style without a new DOM node or a data attribute on every tab.
const TabsVariantContext = React.createContext<"underline" | "pill">(
  "underline"
);

// Keep the Radix DOM and its immediate selection/focus behavior. Only the
// decorative rail moves, so text and panels never wait for the spring.
const useBrowserLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

// Arc's "morph" spring (motion: visualDuration 0.42, bounce 0.16) for the pill cursor, derived the way motion does:
// root = 2π / (visualDuration × 1.2), stiffness = root², damping = 2 × (1 − bounce) × root. The underline keeps its
// critically damped spring so the original rail never overshoots.
const PILL_OMEGA = (2 * Math.PI) / (0.42 * 1.2);
const PILL_ZETA = 1 - 0.16;

function useTabIndicator(
  listRef: React.RefObject<HTMLDivElement | null>,
  bouncy: boolean
) {
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
    // Underline: critically damped spring, omega=30 rad/s (mass=1, stiffness=900,
    // damping=60). Exact integration preserves velocity on rapid retargets.
    const omega = bouncy ? PILL_OMEGA : 30;
    const zeta = bouncy ? PILL_ZETA : 1;

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
      let settled = true;
      if (zeta === 1) {
        const decay = Math.exp(-omega * dt);
        current = current.map((position, index) => {
          const offset = position - target[index];
          const coefficient = velocity[index] + omega * offset;
          const nextOffset = (offset + coefficient * dt) * decay;
          velocity[index] =
            (velocity[index] - omega * coefficient * dt) * decay;
          if (Math.abs(nextOffset) > 0.1 || Math.abs(velocity[index]) > 0.5) {
            settled = false;
          }
          return target[index] + nextOffset;
        });
      } else {
        // Under-damped: semi-implicit Euler in 1/240s steps keeps the small overshoot stable at any frame rate.
        const steps = Math.min(60, Math.max(1, Math.ceil(dt * 240)));
        const h = dt / steps;
        const stiffness = omega * omega;
        const damping = 2 * zeta * omega;
        current = current.map((position, index) => {
          let x = position;
          let v = velocity[index];
          for (let i = 0; i < steps; i++) {
            v += (-stiffness * (x - target[index]) - damping * v) * h;
            x += v * h;
          }
          velocity[index] = v;
          if (Math.abs(x - target[index]) > 0.1 || Math.abs(v) > 0.5) {
            settled = false;
          }
          return x;
        });
      }
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
  }, [listRef, bouncy]);
}

const underlineListClasses = [
  "relative inline-flex items-center border-b border-solid border-semantic-border-layout w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:border-b-0",
  "after:pointer-events-none after:absolute after:left-0 after:bottom-[-1px] after:h-[2px] after:w-[var(--v2-tab-width,0px)] after:translate-x-[var(--v2-tab-x,0px)] after:bg-semantic-primary after:content-[''] after:opacity-0 data-[motion-indicator=true]:after:opacity-100",
  "[&[data-motion-indicator=true]>[role=tab][data-state=active]]:border-transparent",
  "data-[orientation=vertical]:after:top-0 data-[orientation=vertical]:after:bottom-auto data-[orientation=vertical]:after:w-1 data-[orientation=vertical]:after:h-[var(--v2-tab-height,0px)] data-[orientation=vertical]:after:translate-x-0 data-[orientation=vertical]:after:translate-y-[var(--v2-tab-y,0px)] data-[orientation=vertical]:after:bg-semantic-border-accent",
];

// The cursor is the same measured ::after the underline uses, but it covers the whole selected tab, so it needs both
// axes. `isolate` + `-z-10` park it behind the labels without wrapping them in a new element.
const pillListClasses = [
  "relative isolate inline-flex w-fit max-w-full items-center gap-1 rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-ui p-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:self-start",
  "after:pointer-events-none after:absolute after:left-0 after:top-0 after:-z-10 after:h-[var(--v2-tab-height,0px)] after:w-[var(--v2-tab-width,0px)] after:translate-x-[var(--v2-tab-x,0px)] after:translate-y-[var(--v2-tab-y,0px)] after:rounded-md after:border after:border-solid after:border-semantic-border-layout after:bg-semantic-bg-primary after:shadow-xs after:content-[''] after:opacity-0 data-[motion-indicator=true]:after:opacity-100",
  // Before the first measurement (server render, hidden Docs sample) the selected tab paints its own pill, so
  // selection is never invisible; once the cursor is live these are cleared so nothing is drawn twice.
  "[&[data-motion-indicator=true]>[role=tab][data-state=active]]:border-transparent [&[data-motion-indicator=true]>[role=tab][data-state=active]]:bg-transparent [&[data-motion-indicator=true]>[role=tab][data-state=active]]:shadow-none",
];

const TabsList = React.forwardRef(
  (
    { className, fullWidth, variant = "underline", ...props }: TabsListProps,
    ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.List>>
  ) => {
    const listRef = React.useRef<HTMLDivElement>(null);
    const pill = variant === "pill";
    useTabIndicator(listRef, pill);
    const composedRef = React.useCallback(
      (element: HTMLDivElement | null) => {
        listRef.current = element;
        if (typeof ref === "function") ref(element);
        else if (ref) ref.current = element;
      },
      [ref]
    );
    return (
      <TabsVariantContext.Provider value={pill ? "pill" : "underline"}>
        <TabsPrimitive.List
          ref={composedRef}
          // Only the new style is marked: the default markup stays exactly what v1 consumers already render.
          data-variant={pill ? "pill" : undefined}
          className={cn(
            pill ? pillListClasses : underlineListClasses,
            pill && fullWidth && "w-full",
            fullWidth && "[&>*]:flex-1",
            className
          )}
          {...props}
        />
      </TabsVariantContext.Provider>
    );
  }
);
TabsList.displayName = TabsPrimitive.List.displayName;

// Hover is gated so a tap on a touch screen does not leave the label stuck in its hover colour.
const underlineTriggerClasses = [
  "inline-flex items-center justify-center gap-2 whitespace-nowrap py-4 px-3 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-5 tracking-[0.014px] border-b-2 border-solid -mb-px cursor-pointer transition-colors duration-150 ease-out",
  "text-[var(--v2-text-muted,#707070)] border-transparent [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)]",
  "data-[state=active]:text-[var(--v2-text-primary,#484848)] data-[state=active]:border-semantic-primary",
  "focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[-3px] focus-visible:outline-semantic-primary disabled:pointer-events-none disabled:text-semantic-disabled-primary",
  "data-[orientation=vertical]:mb-0 data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-l-4 data-[orientation=vertical]:px-6 data-[orientation=vertical]:data-[state=active]:border-semantic-border-accent data-[orientation=vertical]:data-[state=active]:bg-semantic-bg-ui",
];

// The 1px transparent border keeps the tab the same size whether or not it paints its own (fallback) pill.
const pillTriggerClasses = [
  "inline-flex h-9 min-w-[88px] items-center justify-center gap-2 whitespace-nowrap rounded-md border border-solid border-transparent px-3 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-[1.4] tracking-[-0.01em] cursor-pointer transition-colors [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
  "text-[var(--v2-text-muted,#707070)] [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] active:text-[var(--v2-text-primary,#484848)]",
  "data-[state=active]:border-semantic-border-layout data-[state=active]:bg-semantic-bg-primary data-[state=active]:text-[var(--v2-text-primary,#484848)] data-[state=active]:shadow-xs",
  "focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary disabled:cursor-not-allowed disabled:opacity-50",
  "data-[orientation=vertical]:justify-start",
];

const TabsTrigger = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    ref: React.Ref<React.ComponentRef<typeof TabsPrimitive.Trigger>>
  ) => {
    const variant = React.useContext(TabsVariantContext);
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          variant === "pill" ? pillTriggerClasses : underlineTriggerClasses,
          className
        )}
        {...props}
      />
    );
  }
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
        "mt-4 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)] focus-visible:outline-none",
        // Fades in while sliding 8px from the side of the newly selected tab (--v2-tab-dir is set by <Tabs>).
        "data-[state=active]:motion-safe:animate-in data-[state=active]:motion-safe:fade-in-0 data-[state=active]:motion-safe:[--tw-enter-translate-x:calc(var(--v2-tab-dir,1)*8px)] data-[state=active]:motion-safe:[animation-duration:240ms] data-[state=active]:motion-safe:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)]",
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
