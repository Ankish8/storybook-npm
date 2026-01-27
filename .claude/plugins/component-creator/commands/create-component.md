---
description: Create a new React component with intelligent analysis, design system validation, and auto-generated tests
argument-hint: Optional component name (kebab-case)
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "AskUserQuestion", "Task", "Skill"]
---

# Create Component Workflow

You are creating a new React component for the myOperator UI component library. Follow this comprehensive workflow:

## Phase 1: Component Discovery & Analysis

1. **Ask for component name and description** using AskUserQuestion:
   - Question: "What component would you like to create?"
   - Collect: Component name (kebab-case), brief description

2. **Check if component exists**:
   - Search `src/components/ui/` for UI components
   - Search `src/components/custom/` for custom components
   - If found, inform user and ask if they want to:
     - Create a variant instead
     - Create a different component
     - Proceed anyway

3. **Identify similar components**:
   - Use Grep to find components with similar functionality
   - Suggest whether this should be a variant of existing component
   - Example: If creating "icon-button", check if "button" exists and suggest variant

4. **Determine component type** using AskUserQuestion:
   - Question: "Where should this component be created?"
   - Options:
     - `src/components/ui/` - "UI component (distributed via CLI)"
     - `src/components/custom/` - "Custom component (project-specific, not in CLI)"

5. **Check for multi-file structure**:
   - Ask if component needs multiple files (like event-selector, key-value-input)
   - If yes, ask for subcomponent names

## Phase 2: Design Context Gathering

1. **Ask for Figma link** using AskUserQuestion:
   - Question: "Do you have a Figma design for this component?"
   - Options:
     - "Yes, I have a Figma link" (provide input for URL)
     - "No, I'll describe it manually"

2. **If Figma provided**:
   - Extract fileKey and nodeId from URL
   - Use `mcp__figma__get_design_context` to fetch design
   - Use `mcp__figma__get_screenshot` to get visual reference
   - Analyze colors and map to CSS variables using design-system-validator skill

3. **Multi-state Figma analysis** — Ask if the component has multiple visual states/modes using AskUserQuestion:
   - Question: "Does this component have multiple visual states or modes? (e.g., default, loading, success, error, empty)"
   - Options:
     - "Yes, I have additional Figma links for other states"
     - "Yes, but all states are in the same Figma frame"
     - "No, single state only"
   - If additional links provided, fetch each with `mcp__figma__get_design_context` and `mcp__figma__get_screenshot`
   - Create a **State Inventory Table**:
     ```markdown
     | State | Trigger | Key Visual Differences | Figma Node |
     |-------|---------|----------------------|------------|
     | Default | Initial render | Base layout, primary CTA | node-id=X |
     | Success | After action completes | Green CTA, confirmation text | node-id=Y |
     | Error | Validation fails | Red border, error message | node-id=Z |
     ```

4. **Interaction flow mapping** — Map all user interactions to state changes:
   - Identify every interactive element (click, type, submit, toggle, hover)
   - Map each interaction to its resulting state change and callback
   - Create an **Interaction Flow Map**:
     ```markdown
     | Element | Action | State Change | Callback Prop |
     |---------|--------|-------------|---------------|
     | Input field | onChange | Updates value state | `onValueChange` |
     | Submit button | onClick | Default → Loading → Success/Error | `onSubmit` |
     | Close button | onClick | Closes component | `onClose` |
     ```
   - This map becomes the implementation checklist for Phase 5 and test checklist for Phase 6

5. **If manual description**:
   - Ask user to describe:
     - Visual appearance (colors, spacing, typography)
     - Variants needed (primary, secondary, destructive, etc.)
     - Sizes (sm, default, lg, xl)
     - Interactive states (hover, focus, active, disabled)

## Phase 3: Subcomponent Identification

1. **Analyze design for reusable components**:
   - Check if design includes text inputs → suggest using `text-field` or `input`
   - Check if design includes buttons → suggest using `button`
   - Check if design includes selects → suggest using `select-field`
   - Check if design includes checkboxes → suggest using `checkbox`
   - Check if design includes switches → suggest using `switch`
   - Check if design includes dialogs/modals → suggest using `dialog` or `form-modal`
   - Check if design includes dropdowns → suggest using `dropdown-menu`
   - Check if design includes tooltips → suggest using `tooltip`
   - Check if design includes accordions → suggest using `accordion`
   - Check if design includes badges → suggest using `badge`
   - Check if design includes tags → suggest using `tag`
   - Check if design includes alerts → suggest using `alert`

2. **Present identified subcomponents** using AskUserQuestion:
   - List all identified subcomponents
   - Ask user to confirm which ones to use
   - Multi-select: true

## Phase 4: Design System Validation

Activate the **design-system-validator** skill to:

1. **Map colors to CSS variables**:
   - NEVER use hardcoded hex colors (`#F3F4F6`, `#343E55`)
   - ALWAYS use semantic tokens:
     - Backgrounds: `bg-background`, `bg-card`, `bg-popover`, `bg-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-destructive`
     - Text: `text-foreground`, `text-card-foreground`, `text-primary-foreground`, `text-muted-foreground`
     - Borders: `border-border`, `border-input`
     - Semantic colors: `text-semantic-text-primary`, `text-semantic-text-muted`, `bg-semantic-bg-primary`, `border-semantic-border-layout`
   - **Verify tokens via codebase grep** (MANDATORY):
     - Before using any semantic token, grep `src/index.css` for the exact CSS variable name
     - Example: Before using `bg-semantic-success-primary`, verify `--semantic-success-primary` exists in `src/index.css`
     - If variable not found, check for alternative naming (e.g., `--success` vs `--semantic-success-primary`)
     - Document any tokens that require creation

2. **Validate responsive design**:
   - Ensure component uses responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
   - Check for responsive padding, margin, font sizes
   - Validate mobile-first approach

3. **Check accessibility**:
   - Ensure proper ARIA attributes
   - Verify keyboard navigation support
   - Check focus states

## Phase 5: Component Generation

1. **Create component file(s)**:
   - Use CVA (class-variance-authority) for variants
   - Follow the template pattern from existing components
   - Include proper TypeScript types
   - Add JSDoc comments with examples
   - Export variants for reusability
   - Use `React.forwardRef` for ref forwarding
   - Import identified subcomponents

1b. **Detect validation patterns** — If the component contains input fields paired with action buttons (e.g., text field + submit button):
   - Prompt user for validation requirements using AskUserQuestion:
     - Question: "This component has input + action button. What validation is needed?"
     - Options:
       - "Regex pattern validation (e.g., phone number, email)"
       - "Custom validator function prop"
       - "Both regex and custom validator"
       - "No validation needed"
   - If validation needed, include a `useMemo`-based validation pattern:
     ```tsx
     const isValid = React.useMemo(() => {
       if (!value) return false
       if (pattern && !pattern.test(value)) return false
       if (validate && !validate(value)) return false
       return true
     }, [value, pattern, validate])
     ```
   - Add props: `pattern?: RegExp`, `validate?: (value: string) => boolean`, `errorMessage?: string`

1c. **Default icon detection** — When Figma design includes icons on interactive elements (buttons, inputs, badges):
   - Match each icon to the closest `lucide-react` equivalent
   - Set matched icons as **default prop values** (not purely optional):
     ```tsx
     interface ComponentProps {
       icon?: LucideIcon  // defaults to matched icon
     }
     // In component:
     const IconComponent = icon ?? DefaultMatchedIcon
     ```
   - Use AskUserQuestion to confirm icon matches if ambiguous

1d. **CTA state awareness** — If the component has multiple states with different CTA button styles (e.g., "Add" vs "Success" states):
   - Detect distinct button styles across component states from the State Inventory Table (Phase 2)
   - Prompt for styling approach using AskUserQuestion:
     - Question: "The design has different CTA styles across states. How should these be styled?"
     - Options:
       - "CVA variants for each CTA state"
       - "Conditional className based on component state"
       - "Separate button components per state"
   - **Enforce semantic CSS variables** for all CTA colors:
     - Use `bg-primary`, `bg-destructive`, `bg-semantic-success-primary` etc.
     - NEVER use hardcoded Tailwind colors (`bg-emerald-600`, `bg-blue-500`)

1e. **Prompt for domain-specific props** — Beyond the standard props (`className`, `variant`, `size`, `ref`, `children`), ask the user what additional props this component needs:
   - Using AskUserQuestion, present props inferred from the Figma analysis and Interaction Flow Map:
     - Question: "I've inferred these domain-specific props from the design. Which do you want, and are there any others?"
     - Multi-select: true
     - List inferred props (e.g., `amounts`, `currency`, `onSubmit`, `voucherLink`)
   - Allow user to add custom props not visible in the design
   - Categorize accepted props into:
     - **Data props**: Values the component displays (e.g., `amounts: number[]`, `currency: string`)
     - **Callback props**: Event handlers (e.g., `onSubmit`, `onAmountSelect`, `onValueChange`)
     - **Customization props**: Override defaults (e.g., `voucherLink`, `headerIcon`, `ctaLabel`)
   - For each accepted prop, define:
     - TypeScript type (prefer specific types over `string` — e.g., `currency?: "INR" | "USD"` or a generic)
     - Whether required or optional
     - Default value if optional

2. **For UI components** (`src/components/ui/`):
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

3. **For custom multi-file components** (`src/components/custom/`):
   - Create directory: `src/components/custom/component-name/`
   - Create main component file
   - Create subcomponent files
   - Create types file if needed
   - Create index.ts with exports

## Phase 6: Test Generation

Activate auto-test generation to create comprehensive test file:

1. **Required test cases**:
   - ✓ Renders children correctly
   - ✓ All variants render with correct classes
   - ✓ All sizes render with correct classes
   - ✓ Custom className is applied
   - ✓ Ref forwarding works
   - ✓ Additional props are spread
   - ✓ Type compatibility tests

2. **Test assertions must match actual classes**:
   - Read the component file first
   - Extract actual CVA classes
   - Use those EXACT classes in test assertions
   - Example: If component uses `bg-primary`, test for `bg-primary` (NOT `bg-[#343E55]`)

3. **Test file template**:
   ```tsx
   import { describe, it, expect } from 'vitest'
   import { render, screen } from '@testing-library/react'
   import { Component } from '../component'

   describe('Component', () => {
     it('renders children correctly', () => {
       render(<Component>Test</Component>)
       expect(screen.getByText('Test')).toBeInTheDocument()
     })

     it.each([
       ['default', 'expected-class-1', 'expected-class-2'],
       ['primary', 'expected-class-1', 'expected-class-2'],
     ] as const)('renders %s variant', (variant, class1, class2) => {
       render(<Component variant={variant} data-testid="el">Test</Component>)
       const element = screen.getByTestId('el')
       expect(element).toHaveClass(class1)
       expect(element).toHaveClass(class2)
     })

     it('forwards ref correctly', () => {
       const ref = { current: null }
       render(<Component ref={ref}>Test</Component>)
       expect(ref.current).toBeInstanceOf(HTMLDivElement)
     })
   })
   ```

## Phase 7: Storybook Story Generation

Activate the **storybook-generator** skill to create comprehensive documentation:

1. **Follow the Button/AlertConfiguration pattern**:
   - Installation section with CLI command
   - Import statement
   - Design Tokens table (Token | CSS Variable | Usage | Preview)
   - Typography table if applicable (Element | Font Size | Line Height | Weight)
   - Usage example code block
   - Interactive stories for each variant/size

2. **Story file structure**:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react'
   import { Component } from './component'

   const meta: Meta<typeof Component> = {
     title: 'Components/Component',
     component: Component,
     parameters: { layout: 'centered' },
     tags: ['autodocs'],
   }

   export default meta
   type Story = StoryObj<typeof meta>

   export const Default: Story = { args: { children: 'Component' } }
   export const Primary: Story = { args: { variant: 'primary', children: 'Primary' } }
   // ... more variants
   ```

3. **Design Tokens Table**:
   - Extract all CSS variables used in component
   - Create markdown table in story description:
   ```markdown
   | Token | CSS Variable | Usage | Preview |
   |-------|--------------|-------|---------|
   | Background Primary | `--semantic-bg-primary` | Component background | [swatch] |
   | Text Primary | `--semantic-text-primary` | Primary text | [swatch] |
   ```

## Phase 8: Registry & Export Updates

1. **For UI components**:
   - Add to `src/index.ts`:
     ```tsx
     export { Component, componentVariants } from "./components/ui/component"
     export type { ComponentProps } from "./components/ui/component"
     ```

   - Add to `packages/cli/components.yaml`:
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

2. **For custom components**:
   - Add to `src/index.ts`:
     ```tsx
     export { Component } from "./components/custom/component"
     export type { ComponentProps } from "./components/custom/component"
     ```
   - Add comment noting it's NOT available via CLI

## Phase 9: Validation & Summary

1. **Run integrity check** (if UI component):
   ```bash
   cd packages/cli
   npm run integrity:snapshot
   ```

2. **Verify files created**:
   - Component file(s)
   - Test file
   - Story file
   - Updated exports
   - Updated components.yaml (if UI component)

3. **Summary report**:
   - List all files created
   - Show CSS variables used
   - List identified subcomponents
   - Note responsive breakpoints used
   - Provide next steps (run tests, view in Storybook)

4. **Update documentation if needed**:
   - Review the Storybook story to ensure it includes:
     - Complete **Design Tokens** table with all CSS variables actually used in the component
     - Complete **Typography** table with font sizes, weights, and letter spacing
     - Stories for every visual state from the State Inventory Table (Phase 2)
     - Stories demonstrating key prop combinations (especially domain-specific props)
   - If the component is a custom component, verify the Storybook sidebar grouping (`Custom/ComponentName`)
   - If any existing documentation or parent component stories reference the new component, update those references
   - Ensure the Storybook docs page description accurately reflects the final component (props may have changed during implementation)

## Important Rules

1. **NEVER use hardcoded colors** - Always use CSS variables
2. **ALWAYS generate tests** - No component without tests
3. **ALWAYS create Storybook stories** - Follow established pattern
4. **ALWAYS check for existing components** - Suggest variants first
5. **ALWAYS identify reusable subcomponents** - Don't reinvent the wheel
6. **ALWAYS validate responsive design** - Mobile-first approach
7. **ALWAYS use CVA for variants** - Consistent variant system
8. **ALWAYS forward refs** - Enable parent ref access
9. **ALWAYS export variants** - Enable variant reusability

## Example Workflow

User: "Create an avatar component for displaying user profile images"

1. Check existence → No "avatar" found
2. Check similar → Found "badge" (circular), suggest as reference
3. Ask component type → User selects UI component
4. Ask for Figma → User provides link
5. Fetch Figma design → Extract colors, sizes, variants
6. Map colors → `bg-muted`, `text-muted-foreground`, `border-border`
7. Identify subcomponents → None needed (simple component)
8. Generate component → With image fallback, size variants
9. Generate tests → 15 test cases covering all variants, sizes, fallback
10. Generate story → With design tokens table, usage examples
11. Update registry → Add to components.yaml, exports
12. Summary → Files created, next steps

## Error Handling

- If Figma link is invalid → Fall back to manual description
- If component exists → Ask user to confirm override or create variant
- If CSS variable not found → Use closest semantic token and document
- If test fails → Fix component or test, don't skip
- If registry update fails → Show manual instructions
