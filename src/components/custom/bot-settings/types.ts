import * as React from "react";

export interface BotSettingsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** List of phone numbers to display as chips */
  phoneNumbers?: string[];
  /** Called when the X button on a phone number chip is clicked */
  onRemovePhoneNumber?: (phoneNumber: string) => void;
  /** Called when the dropdown chevron is clicked */
  onOpenDropdown?: () => void;
  /** Whether the section starts expanded (default: true) */
  defaultOpen?: boolean;
  /** Tooltip text for the info icon next to "Connect WhatsApp" */
  infoTooltip?: string;
  /** Disables interactive elements */
  disabled?: boolean;
}
