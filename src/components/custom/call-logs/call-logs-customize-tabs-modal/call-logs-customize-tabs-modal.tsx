import * as React from "react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

import { cn } from "../../../../lib/utils";
import { Button } from "../../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import type { CallLogsCustomizeTabsModalProps, CallLogsCustomizeTabsView } from "./types";

function reorderPinned(
  views: CallLogsCustomizeTabsView[],
  id: string,
  direction: "up" | "down"
): CallLogsCustomizeTabsView[] {
  const pinned = views.filter((view) => view.pinned);
  const available = views.filter((view) => !view.pinned);
  const index = pinned.findIndex((view) => view.id === id);
  if (index === -1) return views;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= pinned.length) return views;
  if (pinned[index].isDefault || pinned[swapWith].isDefault) return views;

  const reordered = [...pinned];
  [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];
  return [...reordered, ...available];
}

function togglePinned(
  views: CallLogsCustomizeTabsView[],
  id: string,
  maxPinnedPresets: number
): CallLogsCustomizeTabsView[] {
  const target = views.find((view) => view.id === id);
  if (!target || target.isDefault) return views;

  const otherPinned = views.filter((view) => view.id !== id && view.pinned);
  const otherAvailable = views.filter((view) => view.id !== id && !view.pinned);

  if (target.pinned) {
    const updatedTarget = { ...target, pinned: false };
    return [...otherPinned, ...otherAvailable, updatedTarget];
  }

  // Pinning: once already at the cap, evict the longest-pinned non-default
  // view (FIFO — pinned views accumulate at the end of `otherPinned`, so the
  // first non-default entry is the oldest) to make room for the new pin.
  const pinnedNonDefaultCount = otherPinned.filter((view) => !view.isDefault).length;
  const evictedId =
    pinnedNonDefaultCount >= maxPinnedPresets
      ? otherPinned.find((view) => !view.isDefault)?.id
      : undefined;

  const nextPinned = otherPinned.filter((view) => view.id !== evictedId);
  const evicted = otherPinned.find((view) => view.id === evictedId);
  const nextAvailable = evicted
    ? [{ ...evicted, pinned: false }, ...otherAvailable]
    : otherAvailable;

  const updatedTarget = { ...target, pinned: true };
  return [...nextPinned, updatedTarget, ...nextAvailable];
}

function TabRow({
  view,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onTogglePin,
}: {
  view: CallLogsCustomizeTabsView;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onTogglePin: () => void;
}) {
  return (
    <div className="flex items-center border-b border-solid border-semantic-border-layout px-6 py-3 last:border-b-0">
      <div className="flex flex-1 items-center gap-2 text-sm">
        <span className="text-semantic-text-primary">{view.label}</span>
        {view.count !== undefined && (
          <span className="text-xs tracking-[0.048px] text-semantic-text-muted">{view.count}</span>
        )}
      </div>
      <div className="flex w-20 shrink-0 items-center justify-center gap-3">
        {!view.isDefault && view.pinned ? (
          <>
            <button
              type="button"
              aria-label={`Move ${view.label} up`}
              disabled={!canMoveUp}
              onClick={onMoveUp}
              className="text-semantic-text-muted transition-colors hover:text-semantic-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-semantic-text-muted"
            >
              <ChevronUp className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={`Move ${view.label} down`}
              disabled={!canMoveDown}
              onClick={onMoveDown}
              className="text-semantic-text-muted transition-colors hover:text-semantic-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-semantic-text-muted"
            >
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>
          </>
        ) : (
          <span className="text-sm text-semantic-text-placeholder">-</span>
        )}
      </div>
      <div className="flex w-[100px] shrink-0 items-center justify-end">
        {view.isDefault ? (
          <span className="text-sm text-semantic-text-muted">Always shown</span>
        ) : (
          <button
            type="button"
            onClick={onTogglePin}
            className="text-xs font-semibold tracking-[0.06px] text-semantic-text-link hover:underline"
          >
            {view.pinned ? "Unpin" : "Pin"}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * CallLogsCustomizeTabsModal is the dialog opened from CallLogsViewTabs'
 * "Customize tabs..." footer link. It lists every view split into two
 * sections — pinned (shown inline as tabs, reorderable) and available (only
 * in the "More" dropdown) — and lets the user reorder pinned views or move a
 * view between the two sections. It's fully controlled: every change is
 * reported via `onViewsChange` with the complete updated array.
 *
 * Pinning is capped at `maxPinnedPresets` (default 4) non-default views —
 * pinning one more automatically unpins the longest-pinned non-default view
 * to make room, so the header never grows past the cap.
 *
 * @example
 * ```tsx
 * <CallLogsCustomizeTabsModal
 *   open={isCustomizeOpen}
 *   onOpenChange={setIsCustomizeOpen}
 *   views={views}
 *   onViewsChange={setViews}
 *   onDone={() => setIsCustomizeOpen(false)}
 * />
 * ```
 */
const CallLogsCustomizeTabsModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      views,
      onViewsChange,
      onAddNewView,
      onDone,
      maxPinnedPresets = 4,
      className,
    }: CallLogsCustomizeTabsModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const pinnedViews = views.filter((view) => view.pinned);
    const availableViews = views.filter((view) => !view.pinned);

    const renderRow = (view: CallLogsCustomizeTabsView) => {
      const pinnedIndex = pinnedViews.findIndex((v) => v.id === view.id);
      const canMoveUp = pinnedIndex > 0 && !pinnedViews[pinnedIndex - 1]?.isDefault;
      const canMoveDown =
        pinnedIndex !== -1 &&
        pinnedIndex < pinnedViews.length - 1 &&
        !pinnedViews[pinnedIndex + 1]?.isDefault;

      return (
        <TabRow
          key={view.id}
          view={view}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onMoveUp={() => onViewsChange(reorderPinned(views, view.id, "up"))}
          onMoveDown={() => onViewsChange(reorderPinned(views, view.id, "down"))}
          onTogglePin={() => onViewsChange(togglePinned(views, view.id, maxPinnedPresets))}
        />
      );
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} size="lg" hideCloseButton className={cn("gap-6", className)}>
          <DialogHeader className="flex-row items-start justify-between gap-2 space-y-0">
            <div className="flex flex-col gap-2">
              <DialogTitle>Customize Tabs</DialogTitle>
              <p className="m-0 text-sm text-semantic-text-muted">
                Choose which views appear as tabs and arrange their order.
              </p>
            </div>
            <DialogClose
              aria-label="Close"
              className="mt-1 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="size-3" aria-hidden="true" />
            </DialogClose>
          </DialogHeader>

          <div className="flex max-h-[433px] flex-col overflow-y-auto">
            <div className="flex border-b border-solid border-semantic-border-layout px-6 pb-2 text-sm font-semibold text-semantic-text-muted">
              <span className="flex-1">View</span>
              <span className="w-20 shrink-0 text-center">Order</span>
              <span className="w-[100px] shrink-0 text-right">Placement</span>
            </div>

            {pinnedViews.length > 0 && (
              <div className="flex flex-col">
                <div className="px-6 pb-2 pt-4 text-xs font-semibold tracking-[0.06px] text-semantic-text-muted">
                  PINNED — SHOWN AS TABS
                </div>
                {pinnedViews.map(renderRow)}
              </div>
            )}

            {availableViews.length > 0 && (
              <div className="flex flex-col">
                <div className="px-6 pb-2 pt-5 text-xs font-semibold tracking-[0.06px] text-semantic-text-muted">
                  AVAILABLE — IN &quot;MORE&quot;
                </div>
                {availableViews.map(renderRow)}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onAddNewView}
              className="flex items-center gap-1.5 text-sm font-semibold tracking-[0.014px] text-semantic-text-link"
            >
              New View
              <Plus className="size-3" aria-hidden="true" />
            </button>
            <Button type="button" variant="outline" size="sm" onClick={onDone}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
CallLogsCustomizeTabsModal.displayName = "CallLogsCustomizeTabsModal";

export { CallLogsCustomizeTabsModal };
