---
description: Create a new React component with intelligent analysis, design system validation, and auto-generated tests
argument-hint: Optional screenshot path
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "AskUserQuestion", "Task", "Skill"]
context: fork
---

# Create Component Workflow

You are creating a new React component for the myOperator UI component library. Follow this comprehensive workflow:

## Phase 1: Screenshot Analysis & Component Discovery

### Step 1: Ask for Screenshot (REQUIRED - DO THIS FIRST)

Your FIRST action must be to call AskUserQuestion with this exact format:
- question: "Please provide a screenshot of the component you want to create."
- header: "Screenshot"
- options:
  - label: "I'll paste/drag the screenshot", description: "I will paste or drag-drop the screenshot in the next message"
  - label: "I have a file path", description: "I will provide the path to the screenshot file"
- multiSelect: false

**IMPORTANT:** Do NOT suggest component names like "avatar", "skeleton", "progress". Do NOT ask about component type yet. Just ask for the screenshot and wait.

### Step 2: Read and Analyze the Screenshot

Once you receive the screenshot:
- Use the Read tool to view the screenshot (Claude is multimodal)
- Analyze the design to determine:
  - **Component structure**: What elements are visible (buttons, inputs, cards, lists, etc.)
  - **Component purpose**: What does this component do?
  - **Component type inference**: Is this a simple UI primitive or a complex custom component?
  - **Suggested names**: Generate 3-4 kebab-case name suggestions based on the design
  - **Description**: Generate a brief description of the component

### Step 3: Present Name Options

Using AskUserQuestion, present 3-4 name suggestions based on YOUR ANALYSIS of the screenshot:
- question: "Based on the screenshot, here are suggested names for this component:"
- Options should be based on what you SEE in the screenshot, each with a description
- Example: "feature-card" - "Card displaying a feature with icon, title, and capabilities"
- User can also type a custom name via "Other"

### Step 4: Confirm Component Type

Based on screenshot analysis, pre-determine if this looks like:
- A simple, reusable UI primitive (button, badge, input) → UI component
- A complex, composite component with multiple elements → Custom component

Using AskUserQuestion:
- question: "Based on the design, this appears to be a [Custom/UI] component. Confirm the type:"
- Options:
  - "UI component (src/components/ui/)" - "Distributed via CLI, simple reusable primitives"
  - "Custom component (src/components/custom/)" - "Complex composites, not in CLI"

### Step 5: Select Folder Location (ONLY if Custom component)

First, scan existing Storybook sub-groups:
```
Grep for `title: "Custom/` in src/components/custom/**/*.stories.tsx
Parse sub-groups from pattern "Custom/<SubGroup>/<Name>"
```

Using AskUserQuestion:
- question: "Which Storybook folder/sub-group should this component belong to?"
- Options (dynamically generated):
  - Each existing sub-group discovered (e.g., "Plan & Payment", "API & Features")
  - "Create a new folder" → Follow-up question for folder name

If "Create a new folder" selected:
- Suggest a folder name based on screenshot analysis
- question: "What should the new folder be named?"
- Options: Suggested name + "Other"

### Step 6: Check if Component Exists

- Search `src/components/ui/` for UI components
- Search `src/components/custom/` for custom components
- If found, inform user and ask:
  - "Create a variant instead"
  - "Create a different component"
  - "Proceed anyway (will overwrite)"

## Phase 2: Figma Design Context (REQUIRED)

### Step 1: Ask for Figma Link (REQUIRED - no skip option)

Using AskUserQuestion:
- question: "Please provide the Figma link for this component. This is required for accurate design implementation."
- header: "Figma"
- Options:
  - "I'll paste the Figma URL" - "Provide the Figma design link"
  - "I need help finding the link" - "Show me how to get a Figma link"

### Step 2: Fetch Figma Design

- Extract fileKey and nodeId from URL pattern: `https://figma.com/design/:fileKey/:fileName?node-id=:nodeId`
- Use `mcp__figma__get_design_context` to fetch design metadata
- Use `mcp__figma__get_screenshot` to get visual reference
- Store design context for component generation

### Step 3: Analyze Figma Design

- Extract colors and map to CSS variables using design-system-validator skill
- Identify typography (font sizes, weights, line heights)
- Identify spacing values
- Identify interactive states (hover, focus, active, disabled)

### Step 4: Multi-state Analysis

Using AskUserQuestion:
- question: "Does this component have multiple visual states? (e.g., default, loading, success, error)"
- Options:
  - "Yes, I have additional Figma links for other states" → Collect additional links
  - "Yes, but all states are in the same Figma frame" → Analyze single frame for states
  - "No, single state only"

If multiple states, create a **State Inventory Table**:
```markdown
| State | Trigger | Key Visual Differences | Figma Node |
|-------|---------|----------------------|------------|
| Default | Initial render | Base layout, primary CTA | node-id=X |
| Success | After action completes | Green CTA, confirmation text | node-id=Y |
```

## Phase 3: Subcomponent Identification

### Step 1: Analyze Figma Design for Reusable Components

Check if design includes these patterns and map to existing components:
- Text inputs → suggest using `text-field` or `input`
- Buttons → suggest using `button`
- Select dropdowns → suggest using `select-field`
- Checkboxes → suggest using `checkbox`
- Switches/toggles → suggest using `switch`
- Dialogs/modals → suggest using `dialog` or `form-modal`
- Dropdown menus → suggest using `dropdown-menu`
- Tooltips → suggest using `tooltip`
- Accordions → suggest using `accordion`
- Badges/status indicators → suggest using `badge`
- Tags → suggest using `tag`
- Alerts → suggest using `alert`

### Step 2: Present Identified Subcomponents

Using AskUserQuestion:
- question: "I identified these existing components that can be reused. Confirm which to use:"
- List all identified subcomponents with their purpose
- multiSelect: true
- Options example:
  - "Button - For the action button"
  - "Badge - For status indicators"
  - "None of these"

## Phase 4: Design System Validation

Activate the **design-system-validator** skill to:

### Step 1: Map Figma Colors to CSS Variables

- NEVER use hardcoded hex colors (`#F3F4F6`, `#343E55`)
- ALWAYS use semantic tokens:
  - Backgrounds: `bg-background`, `bg-card`, `bg-popover`, `bg-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-destructive`
  - Text: `text-foreground`, `text-card-foreground`, `text-primary-foreground`, `text-muted-foreground`
  - Borders: `border-border`, `border-input`
  - Semantic colors: `text-semantic-text-primary`, `text-semantic-text-muted`, `bg-semantic-bg-primary`, `border-semantic-border-layout`

**Verify tokens via codebase grep** (MANDATORY):
- Before using any semantic token, grep `src/index.css` for the exact CSS variable name
- If variable not found, check for alternative naming
- Document any tokens that require creation

### Step 2: Validate Responsive Design

- Ensure component uses responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- Check for responsive padding, margin, font sizes
- Validate mobile-first approach

### Step 3: Check Accessibility

- Ensure proper ARIA attributes
- Verify keyboard navigation support
- Check focus states

## Phase 5: Component Generation

### Step 1: Create Component File(s)

Based on Figma design:
- Use CVA (class-variance-authority) for variants
- Follow the template pattern from existing components
- Include proper TypeScript types
- Add JSDoc comments with examples
- Export variants for reusability
- Use `React.forwardRef` for ref forwarding
- Import identified subcomponents
- **Extend `React.HTMLAttributes`** to allow passing data-testid, aria-*, etc.
- Spread `...props` to the root element

### Step 2: For UI Components (`src/components/ui/`)

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { /* use CSS variables */ },
      size: { /* responsive sizes */ },
    },
    defaultVariants: { /* ... */ },
  }
)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
)
Component.displayName = "Component"

export { Component, componentVariants }
```

### Step 3: For Custom Components (`src/components/custom/`)

- Create directory: `src/components/custom/component-name/`
- Create main component file
- Create subcomponent files if needed
- Create types file if needed
- Create index.ts with exports

## Phase 6: Test Generation

### Required Test Cases

- ✓ Renders correctly
- ✓ All variants render with correct classes
- ✓ All sizes render with correct classes
- ✓ Custom className is applied
- ✓ Ref forwarding works
- ✓ Additional props are spread (data-testid, aria-*, etc.)
- ✓ Interactive behavior (clicks, callbacks)

### Test Assertions

- Read the component file first
- Extract actual CVA classes
- Use those EXACT classes in test assertions

### Test File Location

- UI components: `src/components/ui/__tests__/<component>.test.tsx`
- Custom components: `src/components/custom/<component>/__tests__/<component>.test.tsx`

## Phase 7: Storybook Story Generation

Activate the **storybook-generator** skill to create comprehensive documentation:

### Story Title Based on Component Type and Folder

- UI component: `title: 'Components/ComponentName'`
- Custom (no sub-group): `title: 'Custom/ComponentName'`
- Custom (with sub-group): `title: 'Custom/SubGroup/ComponentName'`

### Required Story Sections

- Installation section with CLI command (or npm install for custom)
- Import statement
- Design Tokens table (Token | CSS Variable | Usage | Preview)
- Typography table if applicable (Element | Font Size | Line Height | Weight)
- Usage example code block
- Interactive stories for each variant/size/state

## Phase 8: Registry & Export Updates

### For UI Components

1. Add to `src/index.ts`:
```tsx
export { Component, componentVariants } from "./components/ui/component"
export type { ComponentProps } from "./components/ui/component"
```

2. Add to `packages/cli/components.yaml`:
```yaml
component:
  description: "Component description"
  category: core  # or form, data, overlay, feedback, layout
  dependencies:
    - "class-variance-authority"
    - "clsx"
    - "tailwind-merge"
  internalDependencies:
    - button  # if using Button
```

### For Custom Components

Add to `src/index.ts` with comment noting it's NOT available via CLI:
```tsx
// ComponentName (Custom - NOT available via CLI)
export { Component } from "./components/custom/component"
export type { ComponentProps } from "./components/custom/component"
```

## Phase 9: Validation & Summary

### Run Tests

```bash
npx vitest run src/components/.../<component>.test.tsx
```

### TypeScript Check

```bash
npx tsc --noEmit
```

### Summary Report

- List all files created
- Show CSS variables used
- List subcomponents used
- Provide next steps (run storybook, etc.)

## Important Rules

1. **NEVER use hardcoded colors** - Always use CSS variables from Figma mapping
2. **ALWAYS require Figma link** - No component creation without Figma
3. **ALWAYS generate tests** - No component without tests
4. **ALWAYS create Storybook stories** - Follow established pattern
5. **ALWAYS check for existing components** - Suggest reuse first
6. **ALWAYS extend HTMLAttributes** - Enable data-testid, aria-*, etc.
7. **ALWAYS use CVA for variants** - Consistent variant system
8. **ALWAYS forward refs** - Enable parent ref access
9. **ALWAYS export variants** - Enable variant reusability

## Error Handling

- If screenshot not provided → Keep asking, it's required
- If Figma link not provided → Keep asking, it's required
- If Figma link is invalid → Ask for correct link, don't fall back to manual
- If component exists → Ask user to confirm override or create variant
- If CSS variable not found → Use closest semantic token and document
- If test fails → Fix component or test, don't skip
