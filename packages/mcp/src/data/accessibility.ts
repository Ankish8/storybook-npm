import type { AccessibilityGuideline } from "../types/index.js";

export const accessibilityGuidelines: Record<string, AccessibilityGuideline> = {
  button: {
    component: "Button",
    guidelines: [
      {
        category: "Semantic HTML",
        items: [
          "Uses native <button> element for proper semantics",
          "Supports asChild prop to render as other elements while maintaining accessibility",
          "Automatically handles disabled state",
        ],
      },
      {
        category: "Visual Feedback",
        items: [
          "Has visible focus ring using focus-visible for keyboard users",
          "Disabled state has reduced opacity (50%)",
          "Loading state shows spinner and maintains text for context",
        ],
      },
      {
        category: "Best Practices",
        items: [
          "Use aria-label for icon-only buttons",
          "Loading state automatically disables the button to prevent double submission",
          "Destructive variant uses red color to indicate dangerous actions",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "aria-label",
        usage: "Required for icon-only buttons to provide accessible name",
      },
      {
        attribute: "aria-disabled",
        usage: "Set automatically when disabled or loading",
      },
      {
        attribute: "aria-busy",
        usage: "Consider adding when loading prop is true",
      },
    ],
    keyboardSupport: [
      { key: "Enter", action: "Activates the button" },
      { key: "Space", action: "Activates the button" },
      { key: "Tab", action: "Moves focus to/from the button" },
    ],
  },

  badge: {
    component: "Badge",
    guidelines: [
      {
        category: "Semantic Usage",
        items: [
          "Rendered as <div> - consider adding role='status' for dynamic status badges",
          "Color alone should not be the only indicator of status",
          "Include descriptive text alongside color",
        ],
      },
      {
        category: "Color Contrast",
        items: [
          "Active variant: Green text on light green background (passes WCAG AA)",
          "Failed variant: Red text on light red background (passes WCAG AA)",
          "Disabled variant: Gray text on gray background (passes WCAG AA)",
        ],
      },
      {
        category: "Best Practices",
        items: [
          "Icons in badges should be decorative and not the only indicator",
          "Screen readers will read the badge text content",
          "Consider aria-live='polite' for status badges that update dynamically",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "role='status'",
        usage: "Add when badge represents live status that updates",
      },
      {
        attribute: "aria-live='polite'",
        usage: "Add for dynamically updating status badges",
      },
    ],
    keyboardSupport: [
      { key: "N/A", action: "Badges are not interactive by default" },
    ],
  },

  tag: {
    component: "Tag",
    guidelines: [
      {
        category: "Interactive Tags",
        items: [
          "When interactive=true, component adds role='button' and tabIndex=0",
          "Selected state uses aria-selected attribute",
          "Interactive tags respond to keyboard activation",
        ],
      },
      {
        category: "Visual Design",
        items: [
          "Selected state has visible ring outline for clear visual feedback",
          "Interactive tags have hover and active state styling",
          "Focus state is visible for keyboard navigation",
        ],
      },
      {
        category: "Best Practices",
        items: [
          "Use label prop for bold category prefixes to improve scannability",
          "Group related tags together for easier comprehension",
          "Consider using aria-describedby for additional context if needed",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "role='button'",
        usage: "Automatically added when interactive=true",
      },
      {
        attribute: "tabIndex='0'",
        usage: "Automatically added when interactive=true",
      },
      {
        attribute: "aria-selected",
        usage: "Reflects the selected prop state",
      },
    ],
    keyboardSupport: [
      { key: "Enter", action: "Activates interactive tag" },
      { key: "Space", action: "Activates interactive tag" },
      { key: "Tab", action: "Moves focus between interactive tags" },
    ],
  },

  table: {
    component: "Table",
    guidelines: [
      {
        category: "Semantic Structure",
        items: [
          "Uses native <table>, <thead>, <tbody>, <tr>, <th>, <td> elements",
          "TableHead uses <th> with proper text-left alignment",
          "Supports sticky columns that maintain context during horizontal scroll",
        ],
      },
      {
        category: "Visual Clarity",
        items: [
          "Highlighted rows use distinct background color",
          "Hover states on rows help track which row is being examined",
          "Sort direction indicators are visible in table headers",
          "Info tooltips can be added to headers for additional context",
        ],
      },
      {
        category: "Loading & Empty States",
        items: [
          "TableSkeleton provides visual loading feedback",
          "TableEmpty provides clear message when no data is available",
          "Skeleton animation indicates data is loading",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "scope='col'",
        usage: "Consider adding to TableHead for better header association",
      },
      {
        attribute: "aria-sort",
        usage: "Add to sortable columns to indicate sort state",
      },
      {
        attribute: "aria-describedby",
        usage: "Link to TableCaption for table description",
      },
    ],
    keyboardSupport: [
      { key: "Tab", action: "Navigate between interactive elements in cells" },
      { key: "Arrow keys", action: "Consider adding for cell navigation" },
    ],
  },

  "dropdown-menu": {
    component: "DropdownMenu",
    guidelines: [
      {
        category: "Keyboard Navigation",
        items: [
          "Full arrow key navigation between menu items",
          "Escape closes the menu and returns focus to trigger",
          "Enter/Space activates the focused menu item",
          "Type-ahead search to jump to items starting with typed character",
        ],
      },
      {
        category: "Focus Management",
        items: [
          "Focus is trapped within menu when open",
          "Focus returns to trigger when menu closes",
          "Submenus are accessible via arrow keys",
        ],
      },
      {
        category: "Screen Reader Support",
        items: [
          "Proper ARIA roles assigned automatically by Radix",
          "Menu items announce their role and state",
          "Checkbox and radio items announce their checked state",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "role='menu'",
        usage: "Automatically applied to DropdownMenuContent",
      },
      {
        attribute: "role='menuitem'",
        usage: "Automatically applied to DropdownMenuItem",
      },
      {
        attribute: "role='menuitemcheckbox'",
        usage: "Automatically applied to DropdownMenuCheckboxItem",
      },
      {
        attribute: "role='menuitemradio'",
        usage: "Automatically applied to DropdownMenuRadioItem",
      },
      {
        attribute: "aria-expanded",
        usage: "Set on trigger based on menu open state",
      },
      {
        attribute: "aria-haspopup",
        usage: "Set on trigger to indicate menu presence",
      },
    ],
    keyboardSupport: [
      { key: "Enter / Space", action: "Opens menu from trigger, activates item" },
      { key: "ArrowDown", action: "Opens menu, moves to next item" },
      { key: "ArrowUp", action: "Moves to previous item" },
      { key: "ArrowRight", action: "Opens submenu" },
      { key: "ArrowLeft", action: "Closes submenu" },
      { key: "Escape", action: "Closes menu" },
      { key: "Tab", action: "Closes menu and moves focus" },
      { key: "Home", action: "Moves to first item" },
      { key: "End", action: "Moves to last item" },
    ],
  },

  input: {
    component: "Input",
    guidelines: [
      {
        category: "Semantic HTML",
        items: [
          "Uses native <input> element for proper semantics",
          "Supports all standard input types (text, email, password, etc.)",
          "Automatically handles disabled state with proper styling",
        ],
      },
      {
        category: "Visual Feedback",
        items: [
          "Has visible focus ring for keyboard users",
          "Error state uses red border for visual indication",
          "Disabled state has reduced opacity (50%)",
          "Placeholder text has distinct color from input text",
        ],
      },
      {
        category: "Best Practices",
        items: [
          "Always pair with a label element or aria-label",
          "Use state='error' alongside visible error message",
          "Consider adding aria-describedby for error messages",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "aria-invalid",
        usage: "Set to true when state='error'",
      },
      {
        attribute: "aria-describedby",
        usage: "Link to error message or helper text element",
      },
      {
        attribute: "aria-label",
        usage: "Required if no visible label is provided",
      },
    ],
    keyboardSupport: [
      { key: "Tab", action: "Moves focus to/from the input" },
      { key: "Enter", action: "Submits form if input is in a form" },
    ],
  },

  "text-field": {
    component: "TextField",
    guidelines: [
      {
        category: "Label Association",
        items: [
          "Label is automatically associated with input via htmlFor",
          "Required indicator (*) is visually distinct",
          "Generated unique IDs ensure proper association",
        ],
      },
      {
        category: "Error Handling",
        items: [
          "Error messages are linked via aria-describedby",
          "aria-invalid is set automatically when error prop is provided",
          "Error styling is visually distinct with red border and text",
        ],
      },
      {
        category: "Visual Feedback",
        items: [
          "Helper text provides additional context",
          "Character count shows remaining/used characters",
          "Loading spinner indicates async operation",
          "Icons are decorative and don't replace labels",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "aria-invalid",
        usage: "Automatically set when error prop is provided",
      },
      {
        attribute: "aria-describedby",
        usage: "Links to helper text or error message",
      },
      {
        attribute: "id",
        usage: "Auto-generated unique ID for label association",
      },
    ],
    keyboardSupport: [
      { key: "Tab", action: "Moves focus to/from the input" },
      { key: "Enter", action: "Submits form if in a form context" },
    ],
  },

  select: {
    component: "Select",
    guidelines: [
      {
        category: "Radix UI Accessibility",
        items: [
          "Built on Radix UI Select with full ARIA support",
          "Proper listbox pattern implementation",
          "Focus management handled automatically",
        ],
      },
      {
        category: "Keyboard Navigation",
        items: [
          "Full arrow key navigation through options",
          "Type-ahead search to jump to matching options",
          "Escape closes dropdown and returns focus to trigger",
        ],
      },
      {
        category: "Screen Reader Support",
        items: [
          "Selected value is announced",
          "Options announce their label and selection state",
          "Grouped options have proper group labels",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "role='listbox'",
        usage: "Automatically applied to SelectContent",
      },
      {
        attribute: "role='option'",
        usage: "Automatically applied to SelectItem",
      },
      {
        attribute: "aria-selected",
        usage: "Set on selected option",
      },
      {
        attribute: "aria-expanded",
        usage: "Set on trigger based on open state",
      },
    ],
    keyboardSupport: [
      { key: "Enter / Space", action: "Opens select, selects focused option" },
      { key: "ArrowDown", action: "Opens select, moves to next option" },
      { key: "ArrowUp", action: "Moves to previous option" },
      { key: "Escape", action: "Closes select" },
      { key: "Home", action: "Moves to first option" },
      { key: "End", action: "Moves to last option" },
      { key: "Type characters", action: "Jump to matching option" },
    ],
  },

  "select-field": {
    component: "SelectField",
    guidelines: [
      {
        category: "Form Integration",
        items: [
          "Label is properly associated with the select trigger",
          "Error messages are linked via aria-describedby",
          "Supports native form submission with name attribute",
        ],
      },
      {
        category: "Search Functionality",
        items: [
          "When searchable, input does not close dropdown on click",
          "Search filters options while maintaining keyboard navigation",
          "No results message is announced to screen readers",
        ],
      },
      {
        category: "Visual Feedback",
        items: [
          "Required indicator is clearly visible",
          "Error state shows red border and error message",
          "Loading spinner indicates async operation",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "aria-invalid",
        usage: "Set when error prop is provided",
      },
      {
        attribute: "aria-describedby",
        usage: "Links to helper text or error message",
      },
    ],
    keyboardSupport: [
      { key: "Tab", action: "Moves focus to trigger" },
      { key: "Enter / Space", action: "Opens dropdown" },
      { key: "Arrow keys", action: "Navigate options" },
      { key: "Escape", action: "Closes dropdown" },
    ],
  },

  "multi-select": {
    component: "MultiSelect",
    guidelines: [
      {
        category: "Combobox Pattern",
        items: [
          "Uses role='combobox' on the trigger",
          "aria-expanded reflects dropdown open state",
          "aria-haspopup='listbox' indicates dropdown content",
        ],
      },
      {
        category: "Selection Management",
        items: [
          "Selected items shown as removable tags",
          "Each tag has accessible remove button with aria-label",
          "Clear all button is keyboard accessible",
        ],
      },
      {
        category: "Screen Reader Support",
        items: [
          "Selection count is conveyed",
          "Options announce selection state",
          "Max selections limit is communicated",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "role='combobox'",
        usage: "Applied to trigger button",
      },
      {
        attribute: "aria-expanded",
        usage: "Reflects dropdown open state",
      },
      {
        attribute: "aria-haspopup='listbox'",
        usage: "Indicates dropdown contains listbox",
      },
      {
        attribute: "aria-multiselectable='true'",
        usage: "Applied to listbox to indicate multiple selection",
      },
      {
        attribute: "aria-selected",
        usage: "Set on selected options",
      },
    ],
    keyboardSupport: [
      { key: "Tab", action: "Moves focus to/from trigger" },
      { key: "Enter / Space", action: "Opens dropdown" },
      { key: "Arrow keys", action: "Navigate options" },
      { key: "Enter / Space (in list)", action: "Toggle option selection" },
      { key: "Escape", action: "Closes dropdown" },
    ],
  },

  checkbox: {
    component: "Checkbox",
    guidelines: [
      {
        category: "ARIA Checkbox Pattern",
        items: [
          "Uses role='checkbox' for proper semantics",
          "Supports three states: checked, unchecked, indeterminate",
          "aria-checked properly reflects all three states",
        ],
      },
      {
        category: "Label Association",
        items: [
          "Label is clickable and toggles checkbox",
          "Label position (left/right) is flexible",
          "Disabled state affects both checkbox and label",
        ],
      },
      {
        category: "Visual Feedback",
        items: [
          "Focus ring is visible for keyboard users",
          "Checked state has distinct background color",
          "Indeterminate state shows minus icon",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "role='checkbox'",
        usage: "Applied to the button element",
      },
      {
        attribute: "aria-checked",
        usage: "Set to true, false, or 'mixed' for indeterminate",
      },
      {
        attribute: "aria-disabled",
        usage: "Set when disabled prop is true",
      },
    ],
    keyboardSupport: [
      { key: "Tab", action: "Moves focus to/from checkbox" },
      { key: "Space", action: "Toggles checkbox state" },
    ],
  },

  toggle: {
    component: "Toggle",
    guidelines: [
      {
        category: "Switch Pattern",
        items: [
          "Uses role='switch' for proper semantics",
          "aria-checked reflects on/off state",
          "Native button element ensures keyboard accessibility",
        ],
      },
      {
        category: "Label Association",
        items: [
          "Label is clickable and toggles switch",
          "Label can be positioned left or right",
          "Disabled state affects both toggle and label",
        ],
      },
      {
        category: "Visual Feedback",
        items: [
          "Focus ring is visible for keyboard users",
          "On/off states have distinct colors",
          "Smooth animation provides visual feedback",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "role='switch'",
        usage: "Applied to the button element",
      },
      {
        attribute: "aria-checked",
        usage: "Reflects toggle on/off state",
      },
      {
        attribute: "aria-disabled",
        usage: "Set when disabled prop is true",
      },
    ],
    keyboardSupport: [
      { key: "Tab", action: "Moves focus to/from toggle" },
      { key: "Space", action: "Toggles switch state" },
      { key: "Enter", action: "Toggles switch state" },
    ],
  },

  collapsible: {
    component: "Collapsible",
    guidelines: [
      {
        category: "Disclosure Pattern",
        items: [
          "Uses aria-expanded on trigger buttons",
          "aria-hidden hides collapsed content from screen readers",
          "Supports single (accordion) or multiple mode",
        ],
      },
      {
        category: "Keyboard Navigation",
        items: [
          "Trigger buttons are keyboard focusable",
          "Space/Enter toggles expanded state",
          "Focus management is handled by the browser",
        ],
      },
      {
        category: "Visual Feedback",
        items: [
          "Chevron icon rotates to indicate state",
          "Smooth animation shows content expanding/collapsing",
          "Disabled triggers are visually distinct",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "aria-expanded",
        usage: "Set on trigger to indicate open/closed state",
      },
      {
        attribute: "aria-hidden",
        usage: "Set on collapsed content to hide from screen readers",
      },
      {
        attribute: "data-state",
        usage: "Set to 'open' or 'closed' for styling",
      },
    ],
    keyboardSupport: [
      { key: "Tab", action: "Navigate between triggers" },
      { key: "Enter / Space", action: "Toggle section expanded state" },
    ],
  },

  "event-selector": {
    component: "EventSelector",
    guidelines: [
      {
        category: "Group Selection",
        items: [
          "Groups can have select all functionality",
          "Individual checkboxes for each event",
          "Selection count is displayed",
        ],
      },
      {
        category: "Checkbox Accessibility",
        items: [
          "All checkboxes have proper labels",
          "Indeterminate state for partial group selection",
          "Focus management within groups",
        ],
      },
      {
        category: "Visual Organization",
        items: [
          "Categories visually group related events",
          "Icons are decorative with aria-hidden",
          "Selection state is clearly visible",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "role='checkbox'",
        usage: "Applied to event checkboxes",
      },
      {
        attribute: "aria-checked",
        usage: "Reflects selection state",
      },
      {
        attribute: "aria-label",
        usage: "Provides accessible name for groups",
      },
    ],
    keyboardSupport: [
      { key: "Tab", action: "Navigate between checkboxes" },
      { key: "Space", action: "Toggle event selection" },
    ],
  },

  "key-value-input": {
    component: "KeyValueInput",
    guidelines: [
      {
        category: "Dynamic Form Fields",
        items: [
          "Add button is keyboard accessible",
          "Delete buttons have aria-labels",
          "Limit reached message is displayed",
        ],
      },
      {
        category: "Validation",
        items: [
          "Duplicate key errors are shown inline",
          "Required field indicators are visible",
          "Error states are conveyed visually",
        ],
      },
      {
        category: "Focus Management",
        items: [
          "New rows receive focus when added",
          "Focus moves appropriately on delete",
          "Tab order follows visual order",
        ],
      },
    ],
    ariaAttributes: [
      {
        attribute: "aria-label",
        usage: "Provides context for delete buttons",
      },
      {
        attribute: "aria-describedby",
        usage: "Links inputs to error messages",
      },
      {
        attribute: "aria-invalid",
        usage: "Set on inputs with validation errors",
      },
    ],
    keyboardSupport: [
      { key: "Tab", action: "Navigate between inputs and buttons" },
      { key: "Enter", action: "Activates focused button" },
      { key: "Delete/Backspace", action: "Consider for row deletion" },
    ],
  },
};

export function getAccessibilityGuideline(
  componentName: string
): AccessibilityGuideline | undefined {
  return accessibilityGuidelines[componentName.toLowerCase()];
}

export function getComponentsWithGuidelines(): string[] {
  return Object.keys(accessibilityGuidelines);
}
