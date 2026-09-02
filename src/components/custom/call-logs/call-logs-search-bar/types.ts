import type * as React from "react";

export interface CallLogsSearchBarSuggestion {
  /** Unique identifier passed back on select */
  value: string;
  /** Display text — the matching substring against `value` (the typed query) is bolded */
  label: string;
}

export interface CallLogsSearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size" | "onSelect"> {
  /** Current text in the input (controlled) */
  value: string;
  /** Called with the next value on every keystroke */
  onValueChange: (value: string) => void;
  /**
   * Suggestions shown in a dropdown below the input while it's focused and
   * has a non-empty value. Omit or pass an empty array to disable the dropdown.
   */
  suggestions?: CallLogsSearchBarSuggestion[];
  /** Called when a suggestion is clicked — the input blurs and the dropdown closes */
  onSelect?: (suggestion: CallLogsSearchBarSuggestion) => void;
  /** Called when the clear (×) button is clicked */
  onClear?: () => void;
  /** Additional class for the outer wrapper (positioning context for the dropdown) */
  wrapperClassName?: string;
}
