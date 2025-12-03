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
};

export function getAccessibilityGuideline(
  componentName: string
): AccessibilityGuideline | undefined {
  return accessibilityGuidelines[componentName.toLowerCase()];
}

export function getComponentsWithGuidelines(): string[] {
  return Object.keys(accessibilityGuidelines);
}
