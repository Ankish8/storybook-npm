import type * as React from "react";

export interface InstructionItem {
  id: string;
  name: string;
  enabled: boolean;
  charCount: number;
}

export interface BotInstructionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  /** List of instruction items to display */
  instructions: InstructionItem[];
  /** Maximum allowed characters (default: 5000) */
  maxCharacters?: number;
  /** Total characters currently used */
  usedCharacters?: number;
  /** Called when the "+ Instructions" button is clicked */
  onAdd?: () => void;
  /** Called when an instruction's toggle is changed */
  onToggle?: (id: string, enabled: boolean) => void;
  /** Called when an instruction's edit button is clicked */
  onEdit?: (id: string) => void;
  /** Called when an instruction's delete button is clicked */
  onDelete?: (id: string) => void;
  /** Tooltip text shown next to the "Instructions" title */
  infoTooltip?: string;
  /** Disables all interactive elements */
  disabled?: boolean;
  /** When true, the "+ Instructions" add button is disabled (e.g. max items reached) */
  addDisabled?: boolean;
  /** Shown as native `title` on the add button when `addDisabled` is true */
  addDisabledTitle?: string;
}
