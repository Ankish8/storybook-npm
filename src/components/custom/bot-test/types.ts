import type { SelectOption } from "../../ui/select-field";

export interface BotTestProps {
  /** Whether the dialog is open (controlled) */
  open?: boolean;
  /** Called when the open state changes (close via X or overlay click) */
  onOpenChange?: (open: boolean) => void;
  /** Description text shown below the title */
  description?: string;
  /** Options for the "Connected whatsapp number" select */
  whatsappNumbers?: SelectOption[];
  /** Currently selected whatsapp number value */
  selectedNumber?: string;
  /** Called when a whatsapp number is selected */
  onNumberChange?: (value: string) => void;
  /** Placeholder for the whatsapp number select */
  numberPlaceholder?: string;
  /** Country flag emoji for the phone input (default: flag of India) */
  countryFlag?: string;
  /** Country dial code for the phone input (default: "+91") */
  countryCode?: string;
  /** Whether to show the country code chevron (default: true) */
  showCountryChevron?: boolean;
  /** Called when the country code area is clicked */
  onCountryClick?: () => void;
  /** Phone number input value */
  phoneNumber?: string;
  /** Called when the phone number changes */
  onPhoneNumberChange?: (value: string) => void;
  /** Placeholder for the phone number input */
  phonePlaceholder?: string;
  /**
   * Max length for the phone number field when no connected WhatsApp number is selected.
   * When a number is selected, max length is derived from that value (national digits after `countryCode`).
   * @default 10
   */
  phoneNumberMaxLength?: number;
  /** Called when the Test button is clicked */
  onTest?: () => void;
  /** Disables the Test button */
  testDisabled?: boolean;
  /** Shows loading state on the Test button */
  testLoading?: boolean;
  /** Label for the Test button (default: "Test") */
  testLabel?: string;
  /** Disables all interactive elements */
  disabled?: boolean;
}
