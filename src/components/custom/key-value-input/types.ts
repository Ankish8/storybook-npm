/**
 * Represents a single key-value pair
 */
export interface KeyValuePair {
  /** Unique identifier for the pair */
  id: string;
  /** The key (e.g., header name) */
  key: string;
  /** The value (e.g., header value) */
  value: string;
}

/**
 * Props for the KeyValueInput component
 */
export interface KeyValueInputProps {
  // Customization
  /** Title displayed at the top (e.g., "HTTP Headers") */
  title: string;
  /** Description displayed below the title */
  description?: string;
  /** Text for the add button (default: "Add Header") */
  addButtonText?: string;
  /** Maximum number of items allowed (default: 10) */
  maxItems?: number;
  /** Placeholder for key input */
  keyPlaceholder?: string;
  /** Placeholder for value input */
  valuePlaceholder?: string;
  /** Label for key column header (default: "Key") */
  keyLabel?: string;
  /** Label for value column header (default: "Value") */
  valueLabel?: string;

  // Validation
  /** Whether key field is required (default: true) */
  keyRequired?: boolean;
  /** Whether value field is required (default: true) */
  valueRequired?: boolean;

  // State (controlled mode)
  /** Array of key-value pairs (controlled) */
  value?: KeyValuePair[];
  /** Callback when pairs change */
  onChange?: (pairs: KeyValuePair[]) => void;

  // State (uncontrolled mode)
  /** Default key-value pairs for uncontrolled usage */
  defaultValue?: KeyValuePair[];

  // Styling
  /** Additional CSS classes for the root element */
  className?: string;
}

/**
 * Internal props for KeyValueRow component
 */
export interface KeyValueRowProps {
  /** The key-value pair data */
  pair: KeyValuePair;
  /** Whether the key is a duplicate */
  isDuplicateKey: boolean;
  /** Whether key is empty (for validation) */
  isKeyEmpty: boolean;
  /** Whether value is empty (for validation) */
  isValueEmpty: boolean;
  /** Whether key field is required */
  keyRequired?: boolean;
  /** Whether value field is required */
  valueRequired?: boolean;
  /** Placeholder for key input */
  keyPlaceholder?: string;
  /** Placeholder for value input */
  valuePlaceholder?: string;
  /** Callback when key changes */
  onKeyChange: (id: string, key: string) => void;
  /** Callback when value changes */
  onValueChange: (id: string, value: string) => void;
  /** Callback when row is deleted */
  onDelete: (id: string) => void;
}
