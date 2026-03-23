/**
 * Single variable item shown in the VariableSelector list.
 */
export interface VariableSelectorItem {
  id: string;
  name: string;
  /** Optional description (e.g. Edit variable dialog). */
  description?: string;
  /** Optional metadata — whether the variable is required in downstream flows. */
  required?: boolean;
}

/**
 * A section grouping variables (e.g. "Function variables", "Contact fields").
 */
export interface VariableSelectorSection {
  label: string;
  variables: VariableSelectorItem[];
}

/** Segment of a value: either plain text or a variable reference {{name}}. */
export type ValueSegment =
  | { type: "text"; value: string }
  | { type: "variable"; name: string };

/**
 * Parses a value string into segments (text and variable parts).
 * Variables are in the form {{variable_name}}.
 */
export function parseValueToSegments(value: string): ValueSegment[] {
  if (!value) return [];
  const re = /\{\{([^}]+)\}\}/g;
  const segments: ValueSegment[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ type: "text", value: value.slice(lastIndex, m.index) });
    }
    segments.push({ type: "variable", name: m[1].trim() });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < value.length) {
    segments.push({ type: "text", value: value.slice(lastIndex) });
  }
  return segments;
}

/** Builds a value string from segments. */
export function segmentsToValue(segments: ValueSegment[]): string {
  return segments
    .map((s) => (s.type === "text" ? s.value : `{{${s.name}}}`))
    .join("");
}

/**
 * For backspace at end of the field: if the string ends with a complete `{{name}}` token,
 * remove that whole token; otherwise remove one character (letter or space).
 */
export function removeLastVariableOrChar(value: string): string {
  if (!value) return "";
  const trailingVar = /\{\{[^}]+\}\}$/;
  if (trailingVar.test(value)) {
    return value.replace(trailingVar, "");
  }
  return value.slice(0, -1);
}

export interface VariableSelectorProps {
  /** Whether the popover is open */
  open: boolean;
  /** Called when open state should change (e.g. close on outside click or selection) */
  onOpenChange: (open: boolean) => void;
  /** Ref to the element the popover is anchored to (e.g. the value input) */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Sections with variables to display */
  sections: VariableSelectorSection[];
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Label for the "Add new variable" action */
  addNewLabel?: string;
  /** Whether to show the edit (pencil) icon on each variable row */
  showEditIcon?: boolean;
  /** Called when user selects a variable (insert into field) */
  onSelectVariable?: (item: VariableSelectorItem) => void;
  /** Called when user clicks "+ Add new variable" */
  onAddNewVariable?: () => void;
  /** Called when user clicks the edit icon on a variable */
  onEditVariable?: (item: VariableSelectorItem) => void;
  /** Called when search input value changes (optional filtering can be done by parent) */
  onSearchChange?: (value: string) => void;
  /** Optional class name for the popover panel */
  className?: string;
}

/** Props for a single variable chip (pill) display. */
export interface VariableChipProps {
  /** Inner variable name; shown in the chip with double-brace syntax (Figma). */
  name: string;
  /** Whether to show the edit (pencil) icon. */
  showEditIcon?: boolean;
  /** Called when the edit icon is clicked. */
  onEdit?: (name: string) => void;
  /** Optional class name for the chip. */
  className?: string;
}

/** Props for the popover that lists all selected variables (e.g. when clicking "..." overflow). */
export interface SelectedVariablesPopoverProps {
  /** Whether the popover is open. */
  open: boolean;
  /** Called when open state should change. */
  onOpenChange: (open: boolean) => void;
  /** Ref to the value field container (full input width). Popover aligns below it and matches its width. */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Segments that include all variables to list (only variable segments are shown). */
  segments: ValueSegment[];
  /** Optional title for the popover (e.g. "Variables"). */
  title?: string;
  /** Whether to show edit icon on each variable row. */
  showEditIcon?: boolean;
  /** Called when user clicks edit on a variable. */
  onEditVariable?: (name: string) => void;
  /** Optional class name for the popover panel. */
  className?: string;
}

/** Props for the input that displays value as text + variable chips with overflow. */
export interface VariableValueInputProps {
  /** Current value (may contain {{variable_name}} tokens). */
  value: string;
  /** Called when value changes (e.g. after inserting/removing a variable). */
  onChange: (value: string) => void;
  /** Placeholder when value is empty. */
  placeholder?: string;
  /** Sections for VariableSelector when user types {{. */
  variableSections?: VariableSelectorSection[];
  /** Max number of variable chips to show inline before "…" (default 1, Figma). Remaining are in the popover. */
  maxVisibleChips?: number;
  /** Extra label after "…" (e.g. "+N more"). Default empty — only "…" is shown, matching Figma. */
  overflowButtonLabel?: (hiddenCount: number) => string;
  /** Whether to show edit icon on chips and in the selected-variables popover. */
  showEditIcon?: boolean;
  /** Called when user selects a variable from VariableSelector (parent can append to value). */
  onSelectVariable?: (item: VariableSelectorItem) => void;
  /** Called when user clicks edit on a variable chip or in the popover. */
  onEditVariableChip?: (name: string) => void;
  /** Called when user clicks "+ Add new variable" in the selector (e.g. open add-variable dialog). Popover closes first; `{{` stays in the field. */
  onAddNewVariable?: () => void;
  /** Called when user clicks the pencil on a row in the selector list. */
  onEditVariable?: (item: VariableSelectorItem) => void;
  /** Max length for the inline text input (e.g. URL field limits). */
  maxLength?: number;
  /** Fires when the inline text input loses focus (e.g. URL validation on blur). */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Ref for the value container (used to anchor VariableSelector popover). */
  containerRef?: React.RefObject<HTMLDivElement | null>;
  /** Optional class name for the root. */
  className?: string;
}
