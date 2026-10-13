/**
 * Shared component metadata definitions.
 * Used by both sync-mcp-metadata.js and sync-design-skill.js.
 *
 * When adding a new component, add its metadata here so both
 * the MCP server and the design skill SKILL.md stay in sync.
 */

// ============================================================================
// COMPONENT METADATA DEFINITIONS
// Add new components here with their metadata. The source code is auto-extracted.
// ============================================================================

export const COMPONENT_META = {
  "v2-metric-card": {
    "name": "MetricCard",
    "description": "A calm metric summary with a value, optional trend, comparison and supporting graphic. An optional 180ms value transition respects reduced motion.",
    "dependencies": [
      "class-variance-authority",
      "clsx",
      "tailwind-merge@^2.6.0",
      "lucide-react"
    ],
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "description": "What the value measures; names the accessible group"
      },
      {
        "name": "value",
        "type": "number | string",
        "required": true,
        "description": "Numeric or already formatted metric value"
      },
      {
        "name": "suffix",
        "type": "string",
        "required": false,
        "description": "Optional unit appended to the value"
      },
      {
        "name": "trend",
        "type": "MetricCardTrend",
        "required": false,
        "description": "Readable change, independent up/down/flat direction and positive/negative/neutral tone"
      },
      {
        "name": "comparison",
        "type": "React.ReactNode",
        "required": false,
        "description": "Context for the measurement"
      },
      {
        "name": "graphic",
        "type": "React.ReactNode",
        "required": false,
        "description": "Supporting graphic; label meaningful graphics"
      },
      {
        "name": "animateValue",
        "type": "boolean",
        "required": false,
        "defaultValue": "true",
        "description": "Briefly animate changes; initial render and reduced-motion mode are static"
      }
    ],
    "variants": [
      {
        "name": "variant",
        "options": [
          "default",
          "subtle"
        ],
        "defaultValue": "default"
      },
      {
        "name": "size",
        "options": [
          "sm",
          "default",
          "lg"
        ],
        "defaultValue": "default"
      }
    ],
    "examples": [
      {
        "title": "Answered calls",
        "code": "import { MetricCard } from \"@/components/ui/v2/metric-card\"\n\n<MetricCard label=\"Answered calls\" value={1248} trend={{ change: \"12%\", direction: \"up\", tone: \"positive\" }} comparison=\"Compared with the previous 7 days\" />",
        "description": "Explicit sample value; the consumer owns the data and comparison"
      }
    ]
  },
  "v2-empty-states": {
    "name": "EmptyStates",
    "description": "An illustrated block for no-results, offline, caught-up and not-found views. Uses v2 EmptyState, Tabs and Button; recovery actions remain owned by the consumer.",
    "dependencies": [
      "clsx",
      "tailwind-merge@^2.6.0"
    ],
    "props": [
      {
        "name": "value",
        "type": "EmptyStatesValue",
        "required": false,
        "description": "Controlled selected view"
      },
      {
        "name": "defaultValue",
        "type": "EmptyStatesValue",
        "required": false,
        "defaultValue": "no-results",
        "description": "Initial uncontrolled view"
      },
      {
        "name": "onValueChange",
        "type": "(value: EmptyStatesValue) => void",
        "required": false,
        "description": "Observe view selection; does not mutate app data"
      },
      {
        "name": "states",
        "type": "Partial<Record<EmptyStatesValue, EmptyStatesView>>",
        "required": false,
        "description": "Override title, description, icon and action slots for each view"
      },
      {
        "name": "onAction",
        "type": "(value: EmptyStatesValue, event: React.MouseEvent<HTMLButtonElement>) => void",
        "required": false,
        "description": "Wires recovery buttons; omitting it shows no preset button"
      },
      {
        "name": "tabListLabel",
        "type": "string",
        "required": false,
        "defaultValue": "Empty state",
        "description": "Accessible tab rail label"
      }
    ],
    "variants": [
      {
        "name": "size",
        "options": [
          "sm",
          "default",
          "lg"
        ],
        "defaultValue": "default"
      }
    ],
    "examples": [
      {
        "title": "Reconnect view",
        "code": "import { EmptyStates } from \"@/components/ui/v2/empty-states\"\n\n<EmptyStates defaultValue=\"offline\" onAction={(view) => { if (view === \"offline\") retryConnection() }} />",
        "description": "Install v2-empty-states to include v2-empty-state, v2-tabs and v2-button"
      }
    ]
  },

  'v2-split-button': {
    name: 'SplitButton',
    description: 'A v2 Button main action joined to a collision-aware dropdown of related alternatives. Install v2-split-button to include v2-button and v2-dropdown-menu.',
    dependencies: ['clsx', 'tailwind-merge@^2.6.0', 'lucide-react', 'motion@^14.0.0'],
    props: [
      { name: 'label', type: 'string', required: true, description: 'Main action label' },
      { name: 'actions', type: 'SplitButtonAction[]', required: true, description: 'Related actions: label, onSelect, optional id, icon, disabled, destructive' },
      { name: 'onClick', type: 'React.MouseEventHandler<HTMLButtonElement>', required: false, description: 'Runs the main action' },
      { name: 'icon', type: 'React.ReactNode', required: false, description: 'Leading icon on the main action' },
      { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Disables both halves and closes the menu' },
      { name: 'loading', type: 'boolean', required: false, defaultValue: 'false', description: 'Shows Button loading feedback, blocks both halves and retains main-action focus' },
      { name: 'open', type: 'boolean', required: false, description: 'Controlled menu visibility, paired with onOpenChange' },
      { name: 'onOpenChange', type: '(open: boolean) => void', required: false, description: 'Menu visibility change callback' },
    ],
    variants: [
      { name: 'variant', options: ['primary', 'secondary', 'default', 'outline'], defaultValue: 'primary' },
      { name: 'size', options: ['sm', 'default', 'lg'], defaultValue: 'default' },
    ],
    examples: [{ title: 'Export alternatives', code: 'import { SplitButton } from "@/components/ui/v2/split-button"\n\n<SplitButton label="Export CSV" onClick={exportCSV} actions={[{ label: "Export PDF", onSelect: exportPDF }]} />', description: 'Independent main action and alternatives; menu choices do not implicitly replace the main action' }],
  },
  'v2-action-button': {
    name: 'ActionButton',
    description: 'An opt-in v2 async action button with pending and success feedback, using the shared v2 Button styles. Install v2-action-button to include its v2-button dependency.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge@^2.6.0', 'lucide-react', 'motion@^14.0.0'],
    props: [
      { name: 'label', type: 'string', required: true, description: 'Idle label and stable accessible name' },
      { name: 'onAction', type: '() => void | Promise<unknown>', required: true, description: 'The real task to await before showing success' },
      { name: 'pendingLabel', type: 'string', required: false, defaultValue: 'Saving', description: 'Visible and announced while the task runs' },
      { name: 'successLabel', type: 'string', required: false, defaultValue: 'Saved', description: 'Visible and announced after resolution' },
      { name: 'errorLabel', type: 'string', required: false, defaultValue: 'Action failed. Please try again.', description: 'Screen-reader announcement after rejection' },
      { name: 'resetAfterMs', type: 'number', required: false, defaultValue: '2400', description: 'Success duration; zero retains success' },
      { name: 'onActionError', type: '(error: unknown) => void', required: false, description: 'Show visible error feedback; the action returns to idle for retry' },
      { name: 'onStateChange', type: '(state: "idle" | "pending" | "success") => void', required: false, description: 'Observe the internally owned state' },
      { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Native disabled state' },
      { name: 'variant', type: '"primary" | "secondary" | "ghost" | "link" | "destructive" | "default" | "outline" | "success" | "dashed"', required: false, defaultValue: 'primary', description: 'Shared v2 Button styles and compatibility aliases' },
      { name: 'size', type: '"sm" | "default" | "lg"', required: false, defaultValue: 'default', description: 'Text button size; icon-only actions use Button' },
    ],
    variants: [
      { name: 'variant', options: ['primary', 'secondary', 'ghost', 'link', 'destructive', 'default', 'outline', 'success', 'dashed'], defaultValue: 'primary' },
      { name: 'size', options: ['sm', 'default', 'lg'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Save action', code: 'import { ActionButton } from "@/components/ui/v2/action-button"\n\n<ActionButton label="Save changes" onAction={() => saveDraft()} onActionError={(error) => showError(error)} />', description: 'Await a real promise; preserve focus and prevent duplicate requests while pending' },
    ],
  },
  button: {
    name: 'Button',
    description: 'A customizable button component with variants, sizes, and icons. Supports loading states and can render as a child element using Radix Slot.',
    dependencies: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'variant', type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "dashed"', required: false, description: 'The visual style of the button', defaultValue: 'default' },
      { name: 'size', type: '"default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"', required: false, description: 'The size of the button', defaultValue: 'default' },
      { name: 'asChild', type: 'boolean', required: false, description: 'Render as child element using Radix Slot', defaultValue: 'false' },
      { name: 'leftIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the left side of the button text' },
      { name: 'rightIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the right side of the button text' },
      { name: 'loading', type: 'boolean', required: false, description: 'Shows loading spinner and disables button', defaultValue: 'false' },
      { name: 'loadingText', type: 'string', required: false, description: 'Text shown during loading state' },
    ],
    variants: [
      { name: 'variant', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'dashed'], defaultValue: 'default' },
      { name: 'size', options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Button', code: '<Button>Click me</Button>', description: 'Simple button with default styling' },
      { title: 'Button with Icons', code: 'import { Mail } from "lucide-react"\n\n<Button leftIcon={<Mail />}>Send Email</Button>', description: 'Buttons with left or right icons' },
      { title: 'Loading State', code: '<Button loading loadingText="Saving...">Save</Button>', description: 'Button with loading spinner' },
    ],
  },

  badge: {
    name: 'Badge',
    description: 'A status badge component with active, failed, disabled, outline, secondary, and destructive variants. Supports asChild for rendering as links.',
    dependencies: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'],
    props: [
      { name: 'variant', type: '"active" | "failed" | "disabled" | "default" | "secondary" | "outline" | "destructive"', required: false, description: 'The visual style of the badge', defaultValue: 'default' },
      { name: 'size', type: '"default" | "sm" | "lg"', required: false, description: 'The size of the badge', defaultValue: 'default' },
      { name: 'leftIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the left side' },
      { name: 'rightIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the right side' },
      { name: 'asChild', type: 'boolean', required: false, description: 'Render as child element using Radix Slot', defaultValue: 'false' },
    ],
    variants: [
      { name: 'variant', options: ['active', 'failed', 'disabled', 'default', 'secondary', 'outline', 'destructive'], defaultValue: 'default' },
      { name: 'size', options: ['default', 'sm', 'lg'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Status Badges', code: '<Badge variant="active">Active</Badge>\n<Badge variant="failed">Failed</Badge>', description: 'Badges for different status states' },
      { title: 'Badge as Link', code: '<Badge asChild><a href="/status">View Status</a></Badge>', description: 'Badge rendered as a link' },
    ],
  },

  tag: {
    name: 'Tag',
    description: 'A tag component for event labels with optional bold label prefix. Rounded rectangle tags for categorization.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    props: [
      { name: 'variant', type: '"default" | "primary" | "secondary" | "success" | "warning" | "error"', required: false, description: 'The visual style of the tag', defaultValue: 'default' },
      { name: 'size', type: '"default" | "sm" | "lg"', required: false, description: 'The size of the tag', defaultValue: 'default' },
      { name: 'label', type: 'string', required: false, description: 'Bold label prefix displayed before the content' },
      { name: 'interactive', type: 'boolean', required: false, description: 'Make the tag clickable', defaultValue: 'false' },
      { name: 'selected', type: 'boolean', required: false, description: 'Show selected state', defaultValue: 'false' },
    ],
    variants: [
      { name: 'variant', options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'], defaultValue: 'default' },
      { name: 'size', options: ['default', 'sm', 'lg'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Tags', code: '<Tag>Category</Tag>\n<Tag variant="success">Success</Tag>', description: 'Simple tag labels' },
      { title: 'Tag with Label', code: '<Tag label="Status:">Active</Tag>', description: 'Tags with bold label prefix' },
    ],
  },

  table: {
    name: 'Table',
    description: 'A composable table component with size variants, loading/empty states, sticky columns, and sorting support.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    props: [
      { name: 'size', type: '"sm" | "md" | "lg"', required: false, description: 'The row height of the table', defaultValue: 'md' },
      { name: 'withoutBorder', type: 'boolean', required: false, description: 'Remove outer border from the table', defaultValue: 'false' },
    ],
    variants: [
      { name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    ],
    examples: [
      { title: 'Basic Table', code: '<Table>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Name</TableHead>\n      <TableHead>Status</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n      <TableCell>John Doe</TableCell>\n      <TableCell><Badge variant="active">Active</Badge></TableCell>\n    </TableRow>\n  </TableBody>\n</Table>', description: 'Simple table with header and body' },
    ],
  },

  'dropdown-menu': {
    name: 'DropdownMenu',
    description: 'A dropdown menu component for displaying actions and options. Built on Radix UI with full keyboard navigation support.',
    dependencies: ['@radix-ui/react-dropdown-menu', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [],
    variants: [],
    examples: [
      { title: 'Basic Dropdown', code: '<DropdownMenu>\n  <DropdownMenuTrigger asChild>\n    <Button variant="outline">Open Menu</Button>\n  </DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>Profile</DropdownMenuItem>\n    <DropdownMenuItem>Settings</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem>Logout</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>', description: 'Simple dropdown with menu items' },
    ],
  },

  input: {
    name: 'Input',
    description: 'A flexible input component for text entry with state variants. Supports default and error states.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    props: [
      { name: 'state', type: '"default" | "error"', required: false, description: 'The visual state of the input', defaultValue: 'default' },
    ],
    variants: [
      { name: 'state', options: ['default', 'error'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Input', code: '<Input placeholder="Enter your email" />', description: 'Simple input with placeholder' },
    ],
  },

  'text-field': {
    name: 'TextField',
    description: 'A comprehensive text field component with label, icons, prefix/suffix, validation states, character count, and loading state.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Label text displayed above the input' },
      { name: 'required', type: 'boolean', required: false, description: 'Shows red asterisk next to label', defaultValue: 'false' },
      { name: 'helperText', type: 'string', required: false, description: 'Helper text displayed below the input' },
      { name: 'error', type: 'string', required: false, description: 'Error message - shows error state' },
      { name: 'leftIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the left' },
      { name: 'rightIcon', type: 'React.ReactNode', required: false, description: 'Icon displayed on the right' },
      { name: 'prefix', type: 'string', required: false, description: 'Text prefix inside input' },
      { name: 'suffix', type: 'string', required: false, description: 'Text suffix inside input' },
      { name: 'showCount', type: 'boolean', required: false, description: 'Shows character count when maxLength is set', defaultValue: 'false' },
      { name: 'loading', type: 'boolean', required: false, description: 'Shows loading spinner', defaultValue: 'false' },
    ],
    variants: [
      { name: 'state', options: ['default', 'error'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic TextField', code: '<TextField label="Email" placeholder="Enter your email" required />', description: 'Text field with label and required indicator' },
      { title: 'TextField with Error', code: '<TextField label="Username" error="Username is already taken" />', description: 'Text field showing error state' },
    ],
  },

  select: {
    name: 'Select',
    description: 'A composable select dropdown built with Radix UI primitives. Includes SelectTrigger, SelectContent, SelectItem, and more sub-components.',
    dependencies: ['@radix-ui/react-select', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [],
    variants: [
      { name: 'state', options: ['default', 'error'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Select', code: '<Select>\n  <SelectTrigger>\n    <SelectValue placeholder="Select an option" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="option1">Option 1</SelectItem>\n    <SelectItem value="option2">Option 2</SelectItem>\n  </SelectContent>\n</Select>', description: 'Simple select dropdown' },
    ],
  },

  'select-field': {
    name: 'SelectField',
    description: 'A form-ready select component with label, helper text, error handling, and grouped options support.',
    dependencies: ['@radix-ui/react-select', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Label text displayed above the select' },
      { name: 'required', type: 'boolean', required: false, description: 'Shows red asterisk next to label', defaultValue: 'false' },
      { name: 'options', type: 'SelectOption[]', required: true, description: 'Array of options with value, label, disabled, and group properties' },
      { name: 'error', type: 'string', required: false, description: 'Error message - shows error state' },
      { name: 'helperText', type: 'string', required: false, description: 'Helper text displayed below the select' },
      { name: 'searchable', type: 'boolean', required: false, description: 'Enable search/filter functionality', defaultValue: 'false' },
    ],
    variants: [],
    examples: [
      { title: 'Basic SelectField', code: '<SelectField\n  label="Country"\n  placeholder="Select a country"\n  options={[\n    { value: \'us\', label: \'United States\' },\n    { value: \'uk\', label: \'United Kingdom\' },\n  ]}\n  required\n/>', description: 'Select field with label and options' },
    ],
  },

  'multi-select': {
    name: 'MultiSelect',
    description: 'A multi-select component with tags display, search functionality, and validation states. Supports maximum selection limits.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Label text displayed above the select' },
      { name: 'options', type: 'MultiSelectOption[]', required: true, description: 'Array of options with value, label, and disabled properties' },
      { name: 'value', type: 'string[]', required: false, description: 'Currently selected values (controlled)' },
      { name: 'onValueChange', type: '(value: string[]) => void', required: false, description: 'Callback when values change' },
      { name: 'searchable', type: 'boolean', required: false, description: 'Enable search/filter functionality', defaultValue: 'false' },
      { name: 'maxSelections', type: 'number', required: false, description: 'Maximum number of selections allowed' },
      { name: 'error', type: 'string', required: false, description: 'Error message - shows error state' },
    ],
    variants: [
      { name: 'state', options: ['default', 'error'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic MultiSelect', code: '<MultiSelect\n  label="Skills"\n  placeholder="Select skills"\n  options={[\n    { value: \'react\', label: \'React\' },\n    { value: \'vue\', label: \'Vue\' },\n  ]}\n  onValueChange={(values) => console.log(values)}\n/>', description: 'Multi-select with tag display' },
    ],
  },

  checkbox: {
    name: 'Checkbox',
    description: 'A tri-state checkbox component built on Radix UI with label support. Supports checked, unchecked, and indeterminate states.',
    dependencies: ['@radix-ui/react-checkbox', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'size', type: '"default" | "sm" | "lg"', required: false, description: 'The size of the checkbox', defaultValue: 'default' },
      { name: 'checked', type: 'boolean | "indeterminate"', required: false, description: 'Whether the checkbox is checked' },
      { name: 'onCheckedChange', type: '(checked: CheckedState) => void', required: false, description: 'Callback when checked state changes' },
      { name: 'label', type: 'string', required: false, description: 'Optional label text' },
      { name: 'labelPosition', type: '"left" | "right"', required: false, description: 'Position of the label', defaultValue: 'right' },
    ],
    variants: [
      { name: 'size', options: ['default', 'sm', 'lg'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Checkbox', code: '<Checkbox checked={isEnabled} onCheckedChange={setIsEnabled} />', description: 'Simple controlled checkbox' },
      { title: 'Checkbox with Label', code: '<Checkbox label="Accept terms and conditions" />', description: 'Checkbox with label' },
    ],
  },

  switch: {
    name: 'Switch',
    description: 'A switch component built on Radix UI for boolean inputs with on/off states. Supports labels and multiple sizes.',
    dependencies: ['@radix-ui/react-switch', 'class-variance-authority', 'clsx', 'tailwind-merge'],
    props: [
      { name: 'size', type: '"default" | "sm" | "lg"', required: false, description: 'The size of the switch', defaultValue: 'default' },
      { name: 'checked', type: 'boolean', required: false, description: 'Whether the switch is on' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', required: false, description: 'Callback when checked state changes' },
      { name: 'label', type: 'string', required: false, description: 'Optional label text' },
      { name: 'labelPosition', type: '"left" | "right"', required: false, description: 'Position of the label', defaultValue: 'right' },
    ],
    variants: [
      { name: 'size', options: ['default', 'sm', 'lg'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Switch', code: '<Switch checked={isEnabled} onCheckedChange={setIsEnabled} />', description: 'Simple controlled switch' },
      { title: 'Switch with Label', code: '<Switch label="Enable notifications" />', description: 'Switch with label' },
    ],
  },

  accordion: {
    name: 'Accordion',
    description: 'An expandable/collapsible accordion component with single or multiple mode support.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    props: [
      { name: 'type', type: '"single" | "multiple"', required: false, description: 'Whether only one item can be open at a time', defaultValue: 'multiple' },
      { name: 'variant', type: '"default" | "bordered"', required: false, description: 'Visual variant of the accordion', defaultValue: 'default' },
      { name: 'value', type: 'string[]', required: false, description: 'Controlled value - array of open item values' },
      { name: 'defaultValue', type: 'string[]', required: false, description: 'Default open items for uncontrolled usage' },
    ],
    variants: [
      { name: 'type', options: ['single', 'multiple'], defaultValue: 'multiple' },
      { name: 'variant', options: ['default', 'bordered'], defaultValue: 'default' },
    ],
    examples: [
      { title: 'Basic Accordion', code: '<Accordion>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Section 1</AccordionTrigger>\n    <AccordionContent>Content for section 1</AccordionContent>\n  </AccordionItem>\n</Accordion>', description: 'Basic accordion with sections' },
    ],
  },
}

// Components that are NOT available via CLI (only via npm import)
export const NPM_ONLY_COMPONENTS = ['event-selector', 'key-value-input']
