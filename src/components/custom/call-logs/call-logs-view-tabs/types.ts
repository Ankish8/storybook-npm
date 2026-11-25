import type * as React from "react";

export interface CallLogsViewTab {
  /** Stable identifier for this view/tab */
  id: string;
  /** Tab label, e.g. "All" or a saved preset name like "Incoming connected" */
  label: string;
  /** Whether this tab can be removed (saved presets are removable; the default "All" view is not) */
  removable?: boolean;
  /** Count shown next to the label when this tab appears in the "More" overflow dropdown (e.g. matching call volume) */
  count?: number;
  /** System-provided view: shows a lock instead of the remove control and can't be deleted (overrides `removable`) */
  isDefault?: boolean;
}

export interface CallLogsViewTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Built-in views plus any user-saved filter presets, in display order */
  tabs: CallLogsViewTab[];
  /** id of the currently active tab */
  activeTabId: string;
  /** Called when a tab is clicked to make it active */
  onTabChange: (id: string) => void;
  /** Called when a removable tab's remove (×) button is clicked */
  onRemoveTab?: (id: string) => void;
  /**
   * Maximum number of removable (saved-preset) tabs shown inline before the
   * rest collapse into a "More (N)" dropdown. Non-removable built-in views
   * (e.g. "All") are never counted against this limit. Defaults to 3.
   */
  maxVisiblePresets?: number;
  /**
   * Enables reordering in the "More" dropdown. The dropdown then lists every
   * `removable` or `isDefault` view (inline ones included), each with a drag
   * handle. Called with the complete `tabs` array in its new order; other
   * views keep their positions.
   */
  onReorderTabs?: (tabs: CallLogsViewTab[]) => void;
  /** Called by the "More" dropdown's "Add new" button. The button only renders when this is provided. */
  onAddNew?: () => void;
  /** Text of the add button. Defaults to "Add new" */
  addNewLabel?: string;
}
