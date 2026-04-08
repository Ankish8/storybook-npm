export interface FunctionItem {
  id: string;
  name: string;
}

export interface BotFunctionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** List of functions to display */
  functions: FunctionItem[];
  /** Called when user clicks the "+ Functions" button */
  onAdd?: () => void;
  /** Called when user clicks the edit button on a function */
  onEdit?: (id: string) => void;
  /** Called when user clicks the delete button on a function */
  onDelete?: (id: string) => void;
  /** Hover text shown on the info icon next to the "Functions" title */
  infoTooltip?: string;
  /** When true, disables the add button and action buttons */
  disabled?: boolean;
}
