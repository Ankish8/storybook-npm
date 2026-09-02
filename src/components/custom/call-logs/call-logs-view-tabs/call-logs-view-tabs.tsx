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
        "group flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded px-3 text-sm font-semibold",
        isActive
          ? "bg-semantic-info-surface text-semantic-text-secondary"
          : "text-semantic-text-muted hover:bg-semantic-bg-hover"
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
 * Only the first `maxVisiblePresets` removable (saved-preset) tabs render
 * inline; any further ones collapse into a "More (N)" dropdown so the tab row
 * doesn't grow unbounded as a user saves more presets. Built-in, non-removable
 * views (e.g. "All") always render inline and aren't counted against the limit.
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
      maxVisiblePresets = 3,
      onCustomize,
      customizeLabel = "Customize tabs...",
      className,
      ...props
    }: CallLogsViewTabsProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const visibleTabs: CallLogsViewTab[] = [];
    const overflowTabs: CallLogsViewTab[] = [];
    let visiblePresetCount = 0;

    for (const tab of tabs) {
      if (!tab.removable) {
        visibleTabs.push(tab);
        continue;
      }
      if (visiblePresetCount < maxVisiblePresets) {
        visibleTabs.push(tab);
        visiblePresetCount += 1;
      } else {
        overflowTabs.push(tab);
      }
    }

    const isOverflowActive = overflowTabs.some((tab) => tab.id === activeTabId);

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-w-0 max-w-full items-center gap-2 overflow-x-auto overflow-y-hidden",
          className
        )}
        {...props}
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
              <button
                type="button"
                aria-label={`${overflowTabs.length} more saved views`}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded px-3 text-sm font-semibold",
                  isOverflowActive
                    ? "bg-semantic-info-surface text-semantic-text-secondary"
                    : "text-semantic-text-muted hover:bg-semantic-bg-hover"
                )}
              >
                More ({overflowTabs.length})
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 overflow-hidden p-0">
              <div className="max-h-[340px] overflow-y-auto p-1">
                {overflowTabs.map((tab) => (
                  <DropdownMenuItem
                    key={tab.id}
                    onSelect={() => onTabChange(tab.id)}
                    className={cn(tab.id === activeTabId && "bg-semantic-bg-ui")}
                    suffix={
                      tab.count !== undefined || (tab.removable && onRemoveTab) ? (
                        <span className="flex items-center gap-2">
                          {tab.count !== undefined && <span>{tab.count}</span>}
                          {tab.removable && onRemoveTab && (
                            <RemoveTabButton label={tab.label} onRemove={() => onRemoveTab(tab.id)} />
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
    );
  }
);
CallLogsViewTabs.displayName = "CallLogsViewTabs";

export { CallLogsViewTabs };
