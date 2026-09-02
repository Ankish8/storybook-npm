import * as React from "react";

import { cn } from "../../../../lib/utils";
import { MultiSelect } from "../../../ui/multi-select";
import type { CallLogsLineSelectProps } from "./types";

const defaultLineSummaryLabel = (count: number) =>
  `${count} line${count === 1 ? "" : "s"} selected`;

/**
 * CallLogsLineSelect is the Call Logs page's "Line (number dialled)" filter
 * — a thin wrapper around the shared `MultiSelect` with the Call Logs
 * defaults baked in: detailed rows (checkbox + phone number), a pinned
 * "All lines" select-all, search enabled, and a compact "N lines selected"
 * trigger summary (hover it to see the full list of selected numbers)
 * instead of a chip per selection. Every `MultiSelect` prop can still be
 * overridden.
 *
 * @example
 * ```tsx
 * <CallLogsLineSelect
 *   options={lineOptions}
 *   value={selectedLines}
 *   onValueChange={setSelectedLines}
 * />
 * ```
 */
const CallLogsLineSelect = React.forwardRef<
  HTMLButtonElement,
  CallLogsLineSelectProps
>(
  (
    {
      selectAllLabel = "All lines",
      optionVariant = "detailed",
      searchable = true,
      searchPlaceholder = "Search lines...",
      placeholder = "Select lines",
      summaryLabel = defaultLineSummaryLabel,
      triggerClassName,
      ...props
    },
    ref
  ) => (
    <MultiSelect
      ref={ref}
      selectAllLabel={selectAllLabel}
      optionVariant={optionVariant}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      summaryLabel={summaryLabel}
      triggerClassName={cn(
        "rounded border-semantic-border-layout text-sm font-semibold text-semantic-text-secondary",
        triggerClassName
      )}
      {...props}
    />
  )
);
CallLogsLineSelect.displayName = "CallLogsLineSelect";

export { CallLogsLineSelect };
