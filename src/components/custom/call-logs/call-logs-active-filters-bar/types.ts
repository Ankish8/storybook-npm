import type * as React from "react";

export interface CallLogsActiveFilterChip {
  /** Stable id used for removal and as the React key */
  id: string;
  /** Bold prefix shown before the value, e.g. "Duration:" — omit for a plain chip */
  label?: string;
  /** The chip's displayed value, e.g. "Last 1 hour", "Rohit Sharma", "Voicemails" */
  value: string;
  /** Optional leading icon (e.g. a bot sparkle for an AI-agent filter) */
  icon?: React.ReactNode;
  /**
   * Full list of individual values this chip summarizes, e.g. every selected
   * agent name when `value` is a truncated summary like "Akhil, Nivedithatha
   * +2 more". When provided, hovering the chip shows a tooltip listing every
   * item, one per line.
   */
  tooltipItems?: string[];
}

export interface CallLogsActiveFiltersBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** One entry per currently-applied filter */
  chips: CallLogsActiveFilterChip[];
  /** Called with the chip's id when its × is clicked */
  onRemoveChip: (id: string) => void;
  /** Called when "Save as Preset" is clicked. Omit to hide that action. */
  onSaveAsPreset?: () => void;
  /** Called when "Clear All" is clicked. Omit to hide that action. */
  onClearAll?: () => void;
}
