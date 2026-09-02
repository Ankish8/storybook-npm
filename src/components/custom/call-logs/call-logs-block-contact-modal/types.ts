export interface CallLogsBlockContactModalValues {
  name: string;
  reason: string;
}

export interface CallLogsBlockContactModalProps {
  /** Controls modal visibility (controlled mode) */
  open: boolean;
  /** Callback when open state changes (X button, Cancel, Escape, or overlay click) */
  onOpenChange: (open: boolean) => void;
  /** The number being blocked — always shown read-only */
  phoneNumber: string;
  /** Prefilled, editable contact name (optional) */
  defaultName?: string;
  /** Country dial code shown in the phone field, e.g. "+91" */
  countryCode?: string;
  /** Country flag emoji shown in the phone field */
  countryFlag?: string;
  /** Maximum length of the block reason, reflected in the character counter (default: 160) */
  reasonMaxLength?: number;
  /** Called with the name and reason when "Block & Close" is clicked */
  onBlock: (values: CallLogsBlockContactModalValues) => void;
  /** Called when "Cancel" is clicked */
  onCancel?: () => void;
  /** Loading state for the Block & Close button */
  loading?: boolean;
  /** Additional className for the dialog content */
  className?: string;
}
