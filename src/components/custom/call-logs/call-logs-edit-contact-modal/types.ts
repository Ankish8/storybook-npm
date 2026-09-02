export interface CallLogsEditContactModalValues {
  name: string;
  phoneNumber: string;
  email: string;
}

export interface CallLogsEditContactModalProps {
  /** Controls modal visibility (controlled mode) */
  open: boolean;
  /** Callback when open state changes (X button, Cancel, Escape, or overlay click) */
  onOpenChange: (open: boolean) => void;
  /** Prefilled contact name */
  defaultName?: string;
  /** Prefilled phone number, digits only (no country code) */
  defaultPhoneNumber?: string;
  /** Prefilled email */
  defaultEmail?: string;
  /** Country dial code shown in the phone field, e.g. "+91" */
  countryCode?: string;
  /** Country flag emoji shown in the phone field */
  countryFlag?: string;
  /** Called with the current field values when "Save" is clicked */
  onSave: (values: CallLogsEditContactModalValues) => void;
  /** Called when "Cancel" is clicked */
  onCancel?: () => void;
  /** Loading state for the Save button */
  loading?: boolean;
  /** Additional className for the dialog content */
  className?: string;
}
