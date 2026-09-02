export interface CallJourneyJsonModalProps {
  /** Controls modal visibility (controlled mode) */
  open: boolean;
  /** Callback when open state changes (X button, Escape, or overlay click) */
  onOpenChange: (open: boolean) => void;
  /** Modal title, defaults to "JSON" */
  title?: string;
  /** The raw JSON to display, e.g. JSON.stringify(callJourneyLog, null, 2) */
  json: string;
  /** Called with the copied JSON string when the copy button is clicked */
  onCopy?: (json: string) => void;
  /** Additional className for the dialog content */
  className?: string;
}
