import type * as React from "react";

export interface NudgeItem {
  id: string;
  name: string;
  enabled: boolean;
  /** Hours portion of the delay (clamped with `maxHours` and total bounds). */
  delayHours: number;
  /** Minutes portion of the delay (clamped with `maxMinutes` and total bounds). */
  delayMinutes: number;
  message: string;
}

/** Default cap for combined delay: 23h 59m. */
export const DEFAULT_MAX_TOTAL_MINUTES = 23 * 60 + 59;

export interface BotFollowUpsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  nudges: NudgeItem[];
  /** Section heading. Default: `Follow-ups` */
  title?: string;
  onToggle?: (id: string, enabled: boolean) => void;
  onDelayHoursChange?: (id: string, hours: number) => void;
  onDelayMinutesChange?: (id: string, minutes: number) => void;
  onMessageChange?: (id: string, message: string) => void;
  /** Fires when the message field loses focus (e.g. for validation or save-on-blur). */
  onMessageBlur?: (
    id: string,
    event: React.FocusEvent<HTMLTextAreaElement>
  ) => void;
  /**
   * Tooltip shown next to the section title.
   * Takes precedence over `infoTooltip` when both are set.
   */
  tooltip?: string;
  /**
   * @deprecated Use `tooltip` instead.
   */
  infoTooltip?: string;
  /** Minimum combined delay in minutes. Default: `0` */
  minTotalMinutes?: number;
  /** Maximum combined delay in minutes. Default: `1439` (23h 59m) */
  maxTotalMinutes?: number;
  /** Maximum hour field value. Default: `23` */
  maxHours?: number;
  /** Maximum minute field value. Default: `59` */
  maxMinutes?: number;
  /**
   * Label for each row next to the toggle. Defaults to `Followup {index}` (1-based, Figma).
   * Use this to override with `nudge.name` or custom copy.
   */
  getItemLabel?: (nudge: NudgeItem, index: number) => string;
  disabled?: boolean;
}
