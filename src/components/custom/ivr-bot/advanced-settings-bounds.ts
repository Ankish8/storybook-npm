/**
 * Min/max for Advanced Settings numeric fields (silence timeout, call end threshold).
 * Allowed committed values are inclusive: `min` through `max`. Values above `max` are invalid.
 * Use with `numericBounds` / `advancedSettingsNumericBounds` props or edit
 * `defaultAdvancedSettingsNumericBounds` for deployment defaults.
 */
export interface AdvancedSettingsNumericBounds {
  silenceTimeoutMin: number;
  silenceTimeoutMax: number;
  callEndThresholdMin: number;
  callEndThresholdMax: number;
}

/**
 * Default min/max for Advanced Settings numeric fields (silence timeout, call end threshold).
 *
 * Change these values per client or deployment. You can also override any bound by passing
 * `advancedSettingsNumericBounds`, `numericBounds`, or the individual min/max props
 * on `IvrBotConfig` / `AdvancedSettingsCard`.
 */
export const defaultAdvancedSettingsNumericBounds: AdvancedSettingsNumericBounds =
  {
    silenceTimeoutMin: 3,
    silenceTimeoutMax: 15,
    callEndThresholdMin: 1,
    callEndThresholdMax: 10,
  };

export type DefaultAdvancedSettingsNumericBounds =
  typeof defaultAdvancedSettingsNumericBounds;
