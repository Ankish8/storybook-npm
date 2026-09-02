export interface CallLogsAddNoteModalProps {
  /** Controls modal visibility (controlled mode) */
  open: boolean;
  /** Callback when open state changes (X button, Cancel, Escape, or overlay click) */
  onOpenChange: (open: boolean) => void;
  /** Prefilled note text, e.g. when editing an existing note */
  defaultValue?: string;
  /** Maximum note length, reflected in the character counter (default: 100) */
  maxLength?: number;
  /** Called with the trimmed note text when "Save Note" is clicked, or Enter is pressed in the textarea */
  onSave: (note: string) => void;
  /** Called when "Cancel" is clicked */
  onCancel?: () => void;
  /** Loading state for the Save Note button */
  loading?: boolean;
  /** Additional className for the dialog content */
  className?: string;
}
