export interface CallLogsCustomizeTabsView {
  /** Stable identifier for this view */
  id: string;
  /** View label, e.g. "All" or "Missed by Agent" */
  label: string;
  /** Count shown next to the label, e.g. matching call volume */
  count?: number;
  /** Whether this view is pinned (shown inline as a tab) vs available (only in the "More" dropdown) */
  pinned: boolean;
  /**
   * The default, always-pinned view (e.g. "All") — renders "-" in Order and
   * "Always shown" in Placement instead of reorder arrows and a Pin/Unpin
   * action. There should be exactly one, and it should be first in `views`.
   */
  isDefault?: boolean;
}

export interface CallLogsCustomizeTabsModalProps {
  /** Controls modal visibility (controlled mode) */
  open: boolean;
  /** Callback when open state changes (X button, Escape, or overlay click) */
  onOpenChange: (open: boolean) => void;
  /** All views, in display order — pinned views first (in tab order), then available views */
  views: CallLogsCustomizeTabsView[];
  /**
   * Called with the full updated views array whenever the user reorders a
   * pinned view or pins/unpins one. This component is controlled — it does
   * not keep its own copy of `views`.
   */
  onViewsChange: (views: CallLogsCustomizeTabsView[]) => void;
  /** Called when "New View" is clicked */
  onAddNewView?: () => void;
  /** Called when "Done" is clicked */
  onDone?: () => void;
  /**
   * Maximum number of non-default views that can be pinned at once. Pinning
   * one more than this automatically unpins the longest-pinned non-default
   * view (FIFO) to make room. The always-pinned default view (e.g. "All")
   * doesn't count against this limit. Defaults to 4.
   */
  maxPinnedPresets?: number;
  /** Additional className for the dialog content */
  className?: string;
}
