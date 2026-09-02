export interface CallLogsSavePresetModalProps {
  /** Controls modal visibility (controlled mode) */
  open: boolean;
  /** Callback when open state changes (X button, Cancel, Escape, or overlay click) */
  onOpenChange: (open: boolean) => void;
  /** Number of active filters this preset will capture, shown as "Captures: N filters" */
  filterCount: number;
  /** Suggested name to prefill the Name field with, e.g. derived from the active filters */
  defaultName?: string;
  /** Called with the trimmed entered name when "Save" is clicked */
  onSave: (name: string) => void;
  /** Called when "Cancel" is clicked */
  onCancel?: () => void;
  /** Loading state for the Save button (e.g. while the preset is being persisted) */
  loading?: boolean;
  /** Additional className for the dialog content */
  className?: string;
}
