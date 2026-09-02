export interface CallLogsAddContactModalValues {
  name: string;
  phoneNumber: string;
  email: string;
}

export interface CallLogsAddContactModalProps {
  /** Controls modal visibility (controlled mode) */
  open: boolean;
  /** Callback when open state changes (X button, Cancel, Escape, or overlay click) */
  onOpenChange: (open: boolean) => void;
  /** Prefills the phone number, e.g. when adding a contact from an unknown caller's number */
  defaultPhoneNumber?: string;
  /** Country dial code shown in the phone field, e.g. "+91" */
  countryCode?: string;
  /** Country flag emoji shown in the phone field */
  countryFlag?: string;
  /** Called with the entered values when "Save" is clicked */
  onSave: (values: CallLogsAddContactModalValues) => void;
  /** Called when "Cancel" is clicked */
  onCancel?: () => void;
  /** Loading state for the Save button */
  loading?: boolean;
  /** Additional className for the dialog content */
  className?: string;
}
