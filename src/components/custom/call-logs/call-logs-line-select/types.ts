import type { MultiSelectProps } from "../../../ui/multi-select";

/**
 * Same shape as `MultiSelectProps` — `CallLogsLineSelect` only changes the
 * defaults (detailed rows, a pinned "All lines" select-all, search enabled),
 * it doesn't add new fields.
 */
export type CallLogsLineSelectProps = MultiSelectProps;
