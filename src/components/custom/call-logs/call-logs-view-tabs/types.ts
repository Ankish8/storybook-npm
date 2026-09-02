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
   * Called when the "More" dropdown's footer link is clicked. The footer
   * only renders when this is provided.
   */
  onCustomize?: () => void;
  /** Footer link text in the "More" dropdown, shown only when `onCustomize` is provided. Defaults to "Customize tabs..." */
  customizeLabel?: string;
}
