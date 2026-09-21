import * as React from "react";
import { ChevronDown, X } from "lucide-react";

import { cn } from "../../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import type { CallLogsViewTab, CallLogsViewTabsProps } from "./types";

const TAB_GAP_PX = 8;

/** Shared remove (×) control — hidden until the parent tab/item is hovered or focused. */
function RemoveTabButton({
  label,
  onRemove,
  className,
}: {
  label: string;
  onRemove: () => void;
  className?: string;
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={`Remove ${label} view`}
      onClick={(event) => {
        event.stopPropagation();
        onRemove();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onRemove();
        }
      }}
      className={cn(
        "flex items-center rounded-full p-0.5 hover:bg-semantic-bg-hover",
        className
      )}
    >
      <X className="size-3" aria-hidden="true" />
    </span>
  );
}

const TAB_BUTTON_CLASS =
  "group flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded px-3 text-sm font-semibold";
const TAB_ACTIVE_CLASS =
  "bg-semantic-info-surface text-semantic-text-secondary";
const TAB_INACTIVE_CLASS =
  "text-semantic-text-muted hover:bg-semantic-bg-hover";

function TabButton({
  tab,
  isActive,
  onTabChange,
  onRemoveTab,
}: {
  tab: CallLogsViewTab;
  isActive: boolean;
  onTabChange: (id: string) => void;
  onRemoveTab?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onTabChange(tab.id)}
      className={cn(
        TAB_BUTTON_CLASS,
        isActive ? TAB_ACTIVE_CLASS : TAB_INACTIVE_CLASS
      )}
    >
      {tab.label}
      {tab.removable && (
        <RemoveTabButton
          label={tab.label}
          onRemove={() => onRemoveTab?.(tab.id)}
          className="hidden group-hover:flex group-focus-within:flex"
        />
      )}
    </button>
  );
}

/**
 * CallLogsViewTabs renders the Call Logs page's view switcher: built-in views
 * (e.g. "All") alongside user-saved filter presets, which can be removed
 * individually via a close icon that appears on hovering (or keyboard-focusing)
 * the tab — it stays hidden the rest of the time.
 *
 * How many tabs fit inline is measured, not fixed: an off-screen copy of every
 * tab supplies natural widths, and as many as fit the row's real width render
 * inline (the first tab always does) while the rest collapse into a "More (N)"
 * dropdown. A ResizeObserver watches both the row and that off-screen copy, so
 * the count re-settles on viewport resize and on anything that changes label
 * widths — a late-loading webfont, browser zoom, a renamed preset — with no
 * breakpoint-specific markup.
 *
 * An optional `maxVisiblePresets` can cap the inline removable tabs (useful for
 * pin-based tab customization or SSR fallbacks).
 *
 * @example
 * ```tsx
 * <CallLogsViewTabs
 *   tabs={[
 *     { id: "all", label: "All" },
 *     { id: "preset-1", label: "Connected", removable: true },
 *   ]}
 *   activeTabId="all"
 *   onTabChange={setActiveTabId}
 *   onRemoveTab={removePreset}
 * />
 * ```
 */
const CallLogsViewTabs = React.forwardRef(
  (
    {
      tabs,
      activeTabId,
      onTabChange,
      onRemoveTab,
      maxVisiblePresets,
      onCustomize,
      customizeLabel = "Customize tabs...",
      className,
      ...props
    }: CallLogsViewTabsProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const rowRef = React.useRef<HTMLDivElement>(null);
    const measureRowRef = React.useRef<HTMLDivElement>(null);
    const tabWidthRefs = React.useRef(new Map<string, HTMLButtonElement>());
    const moreWidthRef = React.useRef<HTMLButtonElement>(null);
    const [visibleCount, setVisibleCount] = React.useState(tabs.length);
    // Whether the row has a real width to measure against. Drives the measuring
    // clone: mounting it where nothing can be measured (SSR, jsdom) buys
    // nothing and duplicates every tab label in the query tree.
    const [canMeasure, setCanMeasure] = React.useState(false);

    // Ref to keep recompute stable and avoid destroying/rebuilding the observer on every render.
    const tabsRef = React.useRef(tabs);

    const recompute = React.useCallback(() => {
      const row = rowRef.current;
      const currentTabs = tabsRef.current;
      if (!row || currentTabs.length === 0) return;

      const rowWidth = row.clientWidth;
      setCanMeasure(rowWidth > 0);
      // Measured from a "More (N)" whose N is the total tab count — the widest
      // the trigger can ever get — so the reservation never comes up short.
      const moreWidth = moreWidthRef.current?.offsetWidth ?? 0;

      // When maxVisiblePresets is explicitly specified, or when unmeasured
      // (rowWidth === 0, such as in jsdom / SSR), use maxVisiblePresets (defaulting to 3).
      // When rowWidth > 0 and maxVisiblePresets is not specified, tabs dynamically
      // fill as much width as available without a fixed preset limit.
      const presetLimit =
        maxVisiblePresets !== undefined
          ? maxVisiblePresets
          : rowWidth === 0
            ? 3
            : undefined;

      let used = 0;
      let count = 0;
      let removableCount = 0;

      for (const tab of currentTabs) {
        if (
          presetLimit !== undefined &&
          tab.removable &&
          removableCount >= presetLimit
        ) {
          break;
        }

        const width = tabWidthRefs.current.get(tab.id)?.offsetWidth ?? 0;
        const withTab = used + (count > 0 ? TAB_GAP_PX : 0) + width;
        const spaceForMore =
          count + 1 < currentTabs.length ? TAB_GAP_PX + moreWidth : 0;

        // The first tab (e.g. "All") stays inline even if it alone overflows a
        // very narrow row — an empty tab strip is worse than a clipped one.
        if (rowWidth > 0 && count > 0 && withTab + spaceForMore > rowWidth) {
          break;
        }

        used = withTab;
        count += 1;
        if (tab.removable) {
          removableCount += 1;
        }
      }
      setVisibleCount(count);
    }, [maxVisiblePresets]);

    // Anything that changes a rendered label's width has to re-trigger
    // measurement; identity of `tab` alone would fire on every render.
    const tabsSignature = React.useMemo(
      () =>
        tabs
          .map((tab) => `${tab.id}:${tab.label}:${!!tab.removable}`)
          .join("|"),
      [tabs]
    );

    // Layout (not passive) effect so the corrected count paints in the same
    // frame — otherwise an overflowing row flashes before collapsing.
    React.useLayoutEffect(() => {
      tabsRef.current = tabs;
      recompute();
    }, [recompute, tabs, tabsSignature, canMeasure]);

    React.useEffect(() => {
      if (typeof ResizeObserver === "undefined") return;
      const row = rowRef.current;
      const measureRow = measureRowRef.current;
      if (!row) return;

      const observer = new ResizeObserver(() => recompute());
      observer.observe(row);
      if (measureRow) {
        observer.observe(measureRow);
      }

      return () => observer.disconnect();
    }, [recompute]);

    if (tabs.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("relative flex min-w-0 max-w-full flex-1", className)}
          {...props}
        />
      );
    }

    const visibleTabs = tabs.slice(0, visibleCount);
    const overflowTabs = tabs.slice(visibleCount);
    const isOverflowActive = overflowTabs.some((tab) => tab.id === activeTabId);

    return (
      <div
        ref={ref}
        className={cn("relative flex min-w-0 max-w-full flex-1", className)}
        {...props}
      >
        {/* Off-screen hidden clone used for exact `offsetWidth` calculation by ResizeObserver. */}
        {canMeasure && (
          <div
            ref={measureRowRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute left-0 top-0 flex h-0 w-max items-center gap-2 overflow-hidden"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) tabWidthRefs.current.set(tab.id, el);
                  else tabWidthRefs.current.delete(tab.id);
                }}
                type="button"
                disabled
                tabIndex={-1}
                className={TAB_BUTTON_CLASS}
              >
                {tab.label}
                {tab.removable && (
                  <span className="flex items-center rounded-full p-0.5">
                    <X className="size-3" aria-hidden="true" />
                  </span>
                )}
              </button>
            ))}
            <button
              ref={moreWidthRef}
              type="button"
              disabled
              tabIndex={-1}
              className={TAB_BUTTON_CLASS}
            >
              More ({tabs.length})
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        <div
          ref={rowRef}
          className="flex min-w-0 max-w-full flex-1 items-center gap-2 overflow-hidden"
        >
          {visibleTabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onTabChange={onTabChange}
              onRemoveTab={onRemoveTab}
            />
          ))}

          {overflowTabs.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* No aria-label: the visible "More (N)" text is the accessible name, and Radix supplies aria-haspopup/aria-expanded. */}
                <button
                  type="button"
                  className={cn(
                    TAB_BUTTON_CLASS,
                    isOverflowActive ? TAB_ACTIVE_CLASS : TAB_INACTIVE_CLASS
                  )}
                >
                  More ({overflowTabs.length})
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 overflow-hidden p-0"
              >
                <div className="max-h-[340px] overflow-y-auto p-1">
                  {overflowTabs.map((tab) => (
                    <DropdownMenuItem
                      key={tab.id}
                      onSelect={() => onTabChange(tab.id)}
                      className={cn(
                        tab.id === activeTabId && "bg-semantic-bg-ui"
                      )}
                      suffix={
                        tab.count !== undefined ||
                        (tab.removable && onRemoveTab) ? (
                          <span className="flex items-center gap-2">
                            {tab.count !== undefined && (
                              <span>{tab.count}</span>
                            )}
                            {tab.removable && onRemoveTab && (
                              <RemoveTabButton
                                label={tab.label}
                                onRemove={() => onRemoveTab(tab.id)}
                              />
                            )}
                          </span>
                        ) : undefined
                      }
                    >
                      {tab.label}
                    </DropdownMenuItem>
                  ))}
                </div>
                {onCustomize && (
                  <button
                    type="button"
                    onClick={onCustomize}
                    className="flex h-11 w-full shrink-0 items-center bg-semantic-primary-surface px-4 text-left text-sm font-semibold text-semantic-text-secondary"
                  >
                    {customizeLabel}
                  </button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    );
  }
);
CallLogsViewTabs.displayName = "CallLogsViewTabs";

export { CallLogsViewTabs };
