import * as React from "react";
import type { MultiSelectOptionInput } from "../../ui/multi-select";

export interface BotSettingsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * WhatsApp numbers: flat `MultiSelectOption[]` (optional per-row `group`), or
   * `MultiSelectGroupedSection[]` for explicit section labels. For section headers in the
   * dropdown, use grouped sections or set `group` on each option and set
   * `whatsappSeparateSelectedWithDivider={false}` (see [Figma 42590-146154](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=42590-146154)).
   * Rows may use `MultiSelectChoice` aliases (`caption`, `isDisabled`, `overlayMsg`).
   */
  whatsappOptions: MultiSelectOptionInput;
  /** Selected option values (controlled). Omit with `defaultWhatsappValue` for uncontrolled. */
  whatsappValue?: string[];
  /** Called when the user changes selection or removes a tag. */
  onWhatsappValueChange?: (values: string[]) => void;
  /** Initial selection when uncontrolled */
  defaultWhatsappValue?: string[];
  /** Placeholder when nothing is selected */
  whatsappPlaceholder?: string;
  /** Enable search in the dropdown */
  whatsappSearchable?: boolean;
  /** Search placeholder */
  whatsappSearchPlaceholder?: string;
  /** Max numbers allowed for this bot */
  whatsappMaxSelections?: number;
  /** Field-level error (e.g. validation) */
  whatsappError?: string;
  /** Helper text under the field */
  whatsappHelperText?: string;
  /** Mark Connect WhatsApp as required in the multi-select */
  whatsappRequired?: boolean;
  /**
   * When true (default), selected numbers are listed first with a divider.
   * When false, grouped options show section headers (`MultiSelectGroupedSection` or `group` on each option).
   */
  whatsappSeparateSelectedWithDivider?: boolean;
  /** Loading state for the WhatsApp field (spinner in the trigger). */
  whatsappLoading?: boolean;
  /** `id` on the multi-select combobox (accessibility, e.g. pairing with a custom `<label htmlFor>`). */
  whatsappId?: string;
  /** `name` for native form submission (renders hidden inputs for each selected value). */
  whatsappName?: string;
  /** When true, Escape closes the dropdown. Default false (closes on outside click only). */
  whatsappCloseOnEscape?: boolean;
  /** Extra `className` on the multi-select outer wrapper (merged with defaults). */
  whatsappWrapperClassName?: string;
  /** Extra `className` on the multi-select trigger (merged with defaults). */
  whatsappTriggerClassName?: string;
  /** Show “clear all” in the trigger. Default false (Figma-style). */
  whatsappShowClearAll?: boolean;
  /** Vertical rule before the chevron in the trigger. Default true. */
  whatsappShowSeparatorBeforeChevron?: boolean;
  /** Tooltip for the info icon next to "Connect WhatsApp" */
  infoTooltip?: string;
  /** Whether the section starts expanded (default: true) */
  defaultOpen?: boolean;
  /** Disables the section collapsible control and the multi-select */
  disabled?: boolean;
}
