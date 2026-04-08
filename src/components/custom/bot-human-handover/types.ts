export interface BotHumanHandoverProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  /** Whether the human handover toggle is enabled */
  enabled?: boolean;
  /** Label text displayed next to the switch */
  label?: string;
  /** Called when the toggle is switched */
  onToggle?: (enabled: boolean) => void;
  /** Called when the edit button is clicked. If not provided, edit button is hidden. */
  onEdit?: () => void;
  /** When true, disables the switch */
  disabled?: boolean;
}
