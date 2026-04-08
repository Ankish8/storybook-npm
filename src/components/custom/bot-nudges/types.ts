export type DelayUnit = "seconds" | "minutes" | "hours";

export interface NudgeItem {
  id: string;
  name: string;
  enabled: boolean;
  delayValue: number;
  delayUnit: DelayUnit;
  message: string;
}

export interface BotNudgesProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  nudges: NudgeItem[];
  onToggle?: (id: string, enabled: boolean) => void;
  onDelayValueChange?: (id: string, value: number) => void;
  onDelayUnitChange?: (id: string, unit: DelayUnit) => void;
  onMessageChange?: (id: string, message: string) => void;
  delayUnitOptions?: { value: DelayUnit; label: string }[];
  infoTooltip?: string;
  disabled?: boolean;
}
