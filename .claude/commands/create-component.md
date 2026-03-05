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

First, scan existing Storybook groups and sub-groups:
```
Grep for `title: "Custom/` in src/components/custom/**/*.stories.tsx
Parse ALL levels from pattern "Custom/<Group>/<Name>" and "Custom/<Group>/<SubGroup>/<Name>"
Build a tree of: top-level groups, and sub-groups within each group.
```

**Step 5a: Select top-level folder**

Using AskUserQuestion:
- question: "Which Storybook folder should this component belong to?"
- Options (dynamically generated):
  - Each existing top-level group discovered (e.g., "Plan & Payment", "Webhook")
  - "Create a new folder" → Follow-up question for folder name

If "Create a new folder" selected:
- Suggest a folder name based on screenshot analysis
- question: "What should the new folder be named?"
- Options: Suggested name + "Other"

**Step 5b: Select sub-folder (ALWAYS ask after selecting top-level folder)**

After a top-level folder is selected, scan for existing sub-groups within it:
```
From the parsed titles, find all sub-groups under the selected group.
E.g., if "Plan & Payment" selected, find: "Plan & Pricing", etc.
```

Using AskUserQuestion:
- question: "Place directly in '<FolderName>' or inside a sub-folder?"
- Options (dynamically generated):
  - "Directly in <FolderName>" - "Component appears at the top level of this folder (e.g., title: Custom/<FolderName>/<ComponentName>)"
  - Each existing sub-folder discovered (e.g., "Plan & Pricing") - "Place inside the existing '<SubFolderName>' sub-folder"
  - "Create a new sub-folder" → Follow-up question for sub-folder name

If "Create a new sub-folder" selected:
- Suggest a sub-folder name based on screenshot analysis
- question: "What should the new sub-folder be named?"
- Options: Suggested name + "Other"
- After creation, if no stories exist yet in this sub-folder, create a placeholder story file at `src/components/custom/<sub-folder-kebab>.stories.tsx` with `title: "Custom/<FolderName>/<SubFolderName>/Overview"` to make the folder visible in Storybook immediately.

**Story title resolution:**
- Direct in folder → `title: "Custom/<FolderName>/<ComponentName>"`
- In sub-folder → `title: "Custom/<FolderName>/<SubFolderName>/<ComponentName>"`

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

### Step 1: Identify Existing Reusable Components

Check if design includes these patterns and map to existing library components:
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

### Step 2: Present Identified Existing Components

Using AskUserQuestion:
- question: "I identified these existing components that can be reused. Confirm which to use:"
- List all identified subcomponents with their purpose
- multiSelect: true
- Options example:
  - "Button - For the action button"
  - "Badge - For status indicators"
  - "None of these"

### Step 3: Detect New Sub-Component Patterns

Analyze the Figma design for **new reusable patterns** that don't exist in the library yet. Look for:

- **Repeating elements**: 2+ visually identical structures (e.g., 3 cards in a grid, multiple list items)
- **Distinct compositional boundaries**: A clear parent/child relationship (e.g., a section containing independent cards)
- **Self-contained UI blocks**: Elements that have their own props, state, or interactivity separate from the parent

**Detection signals:**

| Signal | Strength | Example |
|--------|----------|---------|
| 3+ identical structures in a grid/list | Strong | Power-up cards in a row |
| Visually bounded element with icon + text + CTA | Strong | Feature card with "Talk to us" button |
| Element that could render independently | Medium | A pricing tier card |
| Repeated layout but different content types | Weak | May just be styled containers |

If NO new sub-component patterns are detected, skip to Phase 4.

### Step 4: Present Sub-Component Discovery

If new patterns are found, present them to the user:

Using AskUserQuestion:
- question: "I detected a repeating pattern in the design: [describe pattern, e.g., 'cards with icon, title, price, description, and CTA button']. How should I handle it?"
- header: "Sub-component"
- Options:
  - "Create as separate component" - "Creates an independent, CLI-installable component. Parent uses it via internalDependencies. Best when the sub-component may be reused elsewhere."
  - "Keep as internal sub-file" - "Creates a file inside the parent's directory (like plan-icons.tsx in pricing-card/). Bundled together, not independently installable. Best when only used by this parent."
  - "No separate component" - "Render the pattern inline in the parent component. Best for trivially simple patterns (< 15 lines of JSX)."

**Decision guidance** (use this to pre-select your recommendation):

| Signal | Recommended approach |
|--------|---------------------|
| Pattern used in multiple pages/sections across the app | **Separate component** |
| Pattern has its own variants, states, or complex props | **Separate component** |
| Pattern only appears inside this one parent component | **Internal sub-file** |
| Pattern is < 15 lines of JSX with no interactivity | **Inline, no abstraction** |
| Pattern could logically be used standalone | **Separate component** |

If multiple distinct sub-component patterns are detected (e.g., a card AND a section header), repeat this step for each pattern.

### Step 5: Collect Figma Links for New Sub-Components

**For each new sub-component** (whether separate or internal), collect its own Figma design context:

Using AskUserQuestion:
- question: "Please provide the Figma link for the [sub-component name] sub-component. This helps me get precise design details (spacing, colors, typography) for this element specifically."
- header: "Sub-component Figma"
- Options:
  - "I'll paste the Figma URL" - "Provide the Figma link for just the sub-component"
  - "Same as parent" - "The sub-component is fully visible in the parent's Figma frame, no separate link needed"
  - "I'll select the node in Figma" - "I'll copy the link after selecting just the sub-component node"

If a separate Figma link is provided:
- Extract fileKey and nodeId
- Use `mcp__figma__get_design_context` and `mcp__figma__get_screenshot` for the sub-component
- Analyze sub-component-specific colors, typography, spacing, and states

If "Same as parent" is selected:
- Use the parent's Figma context but focus analysis on the sub-component area
- Extract sub-component-specific design tokens from the parent frame

### Step 6: Sub-Component Variant & State Analysis

For each new sub-component, check if it has its own variants or states:

Using AskUserQuestion:
- question: "Does the [sub-component name] have multiple variants or visual states? (e.g., different icon styles, active/inactive states, size variations)"
- header: "Variants"
- Options:
  - "Yes, I have Figma links for variants" - "I'll provide separate Figma links for each variant"
  - "Yes, visible in the same frame" - "All variants are shown in the parent Figma frame"
  - "No variants" - "Single appearance only"

If variants exist with separate Figma links:
- Collect a Figma link for EACH variant
- Use `mcp__figma__get_screenshot` for each variant
- Create a **Sub-Component Variant Inventory**:

```markdown
### Sub-Component: [name]

| Variant | Key Differences | Figma Node |
|---------|----------------|------------|
| Default | Blue icon, standard price | node-id=X |
| Featured | Gold border, "Popular" badge | node-id=Y |
| Disabled | Greyed out, no CTA | node-id=Z |
```

If variants are in the same frame:
- Analyze the frame to identify visual differences between instances
- Document variant differences in the inventory table

### Step 7: Build Creation Order

Based on Steps 3-6, determine the **bottom-up creation order**:

1. **First**: Create all sub-components that are marked as "separate component"
   - Each gets its own full lifecycle: types → component → tests → stories → components.yaml → src/index.ts
2. **Second**: Create the parent component
   - Import separate sub-components and wire `internalDependencies`
   - Create internal sub-files within the parent directory
3. **Third**: Create parent's tests and stories (which will use the sub-components)

Document the creation plan:
```markdown
### Creation Order:
1. [Sub-component A] (separate) — src/components/custom/sub-component-a/
2. [Sub-component B] (internal) — will be created inside parent directory
3. [Parent component] — src/components/custom/parent-component/
   - Uses Sub-component A via internalDependencies
   - Contains Sub-component B as internal file
```

Present this plan to the user for confirmation before proceeding to Phase 4.

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

## Phase 5: Component Generation (Parallel Sub-Agent Architecture)

### Step 0: Spawn Parallel Sub-Agents for Sub-Components

If Phase 3 identified "separate component" sub-components, create them **in parallel** using the Task tool before creating the parent. This dramatically speeds up creation when multiple sub-components are involved.

If NO sub-components were identified, skip directly to Step 1.

**For "internal sub-file" sub-components:**
- These are NOT spawned as sub-agents
- They are created in Step 3 below (inside the parent component directory)
- They do NOT get their own stories, components.yaml entry, or src/index.ts export
- They ARE exported from the parent's `index.ts` if consumers need direct access

#### Step 0a: Prepare Sub-Agent Context

Before spawning, the main agent must assemble a **self-contained context bundle** for each sub-component. Each sub-agent works autonomously — it cannot ask the user questions or access Figma MCP tools. Everything it needs must be in the prompt.

Gather from earlier phases:
1. **From Phase 2-3**: Figma screenshot path, design metadata, color mappings
2. **From Phase 3 Step 6**: Variant inventory (if any)
3. **From Phase 4**: Semantic token mappings (which hex → which CSS variable)
4. **From Phase 3 Step 7**: The creation plan (so the agent knows its role)

#### Step 0b: Sub-Agent Prompt Template

For each "separate component" sub-component, build a prompt following this template:

```
You are creating the [{sub-component-name}] component for the myOperator UI component library.
Your job is to create ALL the component files, tests, and Storybook stories. Do NOT ask questions — all the information you need is below. Do NOT modify any files outside your component directory except the specific files listed.

## Component Specification

- **Name**: {sub-component-name} (kebab-case)
- **Display Name**: {SubComponentName} (PascalCase)
- **Type**: Custom component
- **Directory**: src/components/custom/{sub-component-name}/
- **Description**: {description from Phase 1 analysis}

## Props Interface

Based on the design analysis, implement these props:
{List each prop with name, type, required/optional, default value, and description}

Example:
- `icon`: ReactNode (optional) — Icon displayed in the card header
- `title`: string (required) — Main heading text
- `price`: string (required) — Price display value
- `onCtaClick`: () => void (optional) — Callback when CTA button is clicked

## Variants (if any)

{From Phase 3 Step 6 variant inventory table}
{If no variants, write: "No variants — single appearance."}

## Design Tokens & Visual Specs

Map these Figma values to semantic tokens:
{Color mapping table from Phase 4}

Example:
| Figma Value | CSS Token | Usage |
|-------------|-----------|-------|
| #343E55 | bg-semantic-primary | CTA button background |
| #717680 | text-semantic-text-muted | Description text |
| #E9EAEB | border-semantic-border-layout | Card border |

Typography:
{Font sizes, weights, line heights from Figma analysis}

Spacing:
{Padding, gap, margin values from Figma analysis}

## Existing Components to Import

{List from Phase 3 Steps 1-2}
Example:
- Button (from ../../ui/button) — For the CTA button
- Badge (from ../../ui/badge) — For status indicator

## Storybook Configuration

- **Story title**: {from Phase 1 Step 5 folder resolution}
  Example: "Custom/Plan & Payment/Plan & Pricing/PowerUpCard"
- **Story file**: src/components/custom/{sub-component-name}/{sub-component-name}.stories.tsx

## Files to Create

Create these files in order:

### 1. types.ts
Define all TypeScript interfaces and types. Export the main props interface.

### 2. {sub-component-name}.tsx
The main component file. Follow these patterns EXACTLY:
- Use `import * as React from "react"`
- Use `React.forwardRef<HTMLDivElement, {SubComponentName}Props>`
- Use `cn()` from `../../../lib/utils` for className merging
- Use CVA if the component has variants
- Set `displayName`
- Spread `...props` to root element
- Extend `React.HTMLAttributes<HTMLDivElement>`
- Use ONLY semantic tokens — NO hardcoded colors
- Import UI components with relative paths: `../../ui/button` (NEVER `@/components/ui/button`)
- Import utils with: `../../../lib/utils` (NEVER `@/lib/utils` in custom components)

### 3. index.ts
Re-export the component and types:
```tsx
export { {SubComponentName} } from "./{sub-component-name}"
export type { {SubComponentName}Props, ... } from "./types"
```

### 4. __tests__/{sub-component-name}.test.tsx
Test file with these required cases:
- Renders correctly with required props
- All variants render correct classes (if variants exist)
- Custom className is applied
- Ref forwarding works
- Additional props spread (data-testid)
- Interactive callbacks fire (onClick, etc.)
- Conditional rendering (elements that show/hide based on props)

Use: `import { render, screen, fireEvent } from "@testing-library/react"`
Use: `import { describe, it, expect, vi } from "vitest"`

### 5. {sub-component-name}.stories.tsx
Storybook story with:
- `tags: ["autodocs"]`
- docs.description.component with: description, install command (`npx myoperator-ui add {sub-component-name}`), import statement, Design Tokens table
- Overview story (interactive with args)
- Individual variant stories (if variants exist)
- Composition/usage example stories

## After Creating All Files

Run tests to verify:
```bash
npx vitest run src/components/custom/{sub-component-name}/__tests__/{sub-component-name}.test.tsx
```

If tests fail, fix the component or test until all pass. Report the final test results.

## IMPORTANT RULES
- Do NOT modify `src/index.ts` — the main agent handles this
- Do NOT modify `packages/cli/components.yaml` — the main agent handles this
- Do NOT create files outside your component directory
- Do NOT use hardcoded hex colors — use semantic tokens only
- Do NOT use `@/components` imports — use relative paths
- Do NOT use `@/lib/utils` — use `../../../lib/utils`
```

#### Step 0c: Spawn Sub-Agents in Parallel

Use the **Task tool** with `subagent_type: "general-purpose"` to spawn one agent per "separate component" sub-component. **Critically, make ALL Task calls in a single message** so they execute in parallel.

Example (3 sub-components):
```
// In a SINGLE message, call Task three times:

Task 1: {
  description: "Create power-up-card component",
  prompt: "[assembled prompt from template above]",
  subagent_type: "general-purpose",
  mode: "bypassPermissions"
}

Task 2: {
  description: "Create addon-card component",
  prompt: "[assembled prompt from template above]",
  subagent_type: "general-purpose",
  mode: "bypassPermissions"
}

Task 3: {
  description: "Create feature-comparison component",
  prompt: "[assembled prompt from template above]",
  subagent_type: "general-purpose",
  mode: "bypassPermissions"
}
```

**Key parameters:**
- `subagent_type: "general-purpose"` — Has access to all tools (Read, Write, Edit, Bash, Glob, Grep)
- `mode: "bypassPermissions"` — Sub-agents should not prompt the user for file permissions
- All Task calls in ONE message = parallel execution

#### Step 0d: Verify Sub-Agent Results

After all sub-agents complete:

1. **Check each result** for success/failure
2. **Read a sample file** from each sub-component to verify it was created correctly:
   - Check `index.ts` exists and has proper exports
   - Check the test results reported by each agent
3. **If a sub-agent failed**: Either fix the issue directly or re-spawn that specific agent
4. **Run all sub-component tests together** as a final check:
   ```bash
   npx vitest run src/components/custom/{sub-component-a}/__tests__/ src/components/custom/{sub-component-b}/__tests__/
   ```

Only proceed to Step 1 after all sub-components are verified.

### Step 1: Create Parent Component File(s)

Based on Figma design:
- Use CVA (class-variance-authority) for variants
- Follow the template pattern from existing components
- Include proper TypeScript types
- Add JSDoc comments with examples
- Export variants for reusability
- Use `React.forwardRef` for ref forwarding
- Import identified subcomponents (both existing library components and newly created sub-components)
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
- Create types file with all interfaces
- Create main component file (imports sub-components created in Step 0)
- Create internal sub-file components if any were marked "internal sub-file" in Phase 3
- Create `index.ts` with exports (include internal sub-components if consumers need them)

**Import patterns for sub-components:**
```tsx
// Separate sub-component (created in Step 0, installed via internalDependencies)
import { PowerUpCard } from "../../custom/power-up-card"

// Internal sub-file (lives in same directory)
import { SectionHeader } from "./section-header"

// Existing library component
import { Button } from "../../ui/button"
```

## Phase 6–8: PARALLEL Generation (Tests + Stories + Registry)

**CRITICAL: ALWAYS use parallel Task agents for this phase.** After the component files are created in Phase 5, tests, stories, and registry updates are INDEPENDENT and MUST be spawned as parallel sub-agents using the Task tool. This applies to ALL components — even single-component creation with no sub-components.

### Step 1: Assemble Context for Sub-Agents

Before spawning, gather from earlier phases:
1. **Component directory path** and all file paths created in Phase 5
2. **Component props interface** (from types.ts)
3. **CVA classes / Tailwind classes** used in the component (from the .tsx file)
4. **Storybook title** (from Phase 1 Step 5 folder resolution)
5. **Design tokens table** (from Phase 4 color mapping)
6. **Typography specs** (from Figma analysis)
7. **Component type** (UI or Custom) and **category**
8. **Dependencies and internalDependencies** list

### Step 2: Spawn Three Parallel Agents

Use the **Task tool** to make ALL THREE calls in a SINGLE message so they execute in parallel:

**Agent 1: Test Generator** (`subagent_type: "general-purpose"`, `mode: "bypassPermissions"`)
```
You are generating tests for the [{component-name}] component.

Component file: [paste full path]
Props interface: [paste from types.ts]
CVA/Tailwind classes on root element: [paste from component]

Create: src/components/{type}/{component-name}/__tests__/{component-name}.test.tsx

Required test cases:
- ✓ Renders correctly with required props
- ✓ All variants render with correct classes (if CVA variants exist)
- ✓ All sizes render with correct classes (if size variants exist)
- ✓ Custom className is applied
- ✓ Ref forwarding works
- ✓ Additional props spread (data-testid)
- ✓ Interactive callbacks fire (onClick, etc.)
- ✓ Conditional rendering (elements that show/hide based on optional props)

Use: import { render, screen, fireEvent } from "@testing-library/react"
Use: import { describe, it, expect, vi } from "vitest"

Read the component file first to extract EXACT classes for assertions.
After creating the test file, run: npx vitest run [test-file-path]
Report pass/fail results.
```

**Agent 2: Story Generator** (`subagent_type: "general-purpose"`, `mode: "bypassPermissions"`)
```
You are generating a Storybook story for the [{component-name}] component.

Component file: [paste full path]
Props interface: [paste from types.ts]
Storybook title: [from Phase 1, e.g., "Custom/Plan & Payment/Plan & Pricing/PowerUpCard"]
Design tokens: [paste token table from Phase 4]
Typography: [paste typography specs from Figma]
CLI install command: npx myoperator-ui add {component-name}

Create: src/components/{type}/{component-name}/{component-name}.stories.tsx

Required sections in docs.description.component:
- Brief description
- Installation: ```bash npx myoperator-ui add {component-name} ```
- Import statement
- Design Tokens table (HTML table with Token | CSS Variable | Usage | Preview columns — use colored div swatches)
- Typography table (if applicable)
- Usage code example

Required stories:
- Default (interactive with args)
- One story per variant (if variants exist)
- Without optional props (e.g., without icon)
- Composition/section story showing real-world usage (e.g., grid of cards matching Figma layout)

Use tags: ["autodocs"] on meta.
Use singleCardDecorator for individual card stories (constrain width).
```

**Agent 3: Registry Updater** (`subagent_type: "general-purpose"`, `mode: "bypassPermissions"`)
```
You are updating the registry files for the [{component-name}] component.

Component type: [UI or Custom]
Component name: {component-name}
Category: {category}
Dependencies: [list]
Internal dependencies: [list]
Is multi-file: [true/false]
Directory: {component-name}
Files: [list of files created]
Main file: {component-name}.tsx
Export name: {ComponentName}
Types to export: [{ComponentName}Props, ...]

Update these TWO files:

1. src/index.ts — Add export block:
   // {ComponentName} (Custom)
   export { {ComponentName} } from "./components/custom/{component-name}"
   export type { {ComponentName}Props } from "./components/custom/{component-name}"

2. packages/cli/components.yaml — Add TWO things:
   a. Add "{component-name}" to the "{category}" category list (maintain alphabetical order)
   b. Add component definition block (maintain alphabetical order among component definitions)

Read both files first to find the correct insertion points.
Do NOT modify any other files.
```

### Step 3: Verify Parallel Results

After all three agents complete:

1. **Check each result** for success/failure
2. **If test agent reported failures**: Read the test file and component, fix the issue
3. **If story agent had issues**: Review and fix the story file
4. **If registry agent missed anything**: Verify index.ts and components.yaml manually
5. **Run a final combined test**: `npx vitest run [test-file-path]`
6. **Run TypeScript check**: `npx tsc --noEmit`

### Reference: Test Requirements

- ✓ Renders correctly
- ✓ All variants render with correct classes
- ✓ All sizes render with correct classes
- ✓ Custom className is applied
- ✓ Ref forwarding works
- ✓ Additional props are spread (data-testid, aria-*, etc.)
- ✓ Interactive behavior (clicks, callbacks)
- ✓ Sub-component integration (if parent uses sub-components, test they render within the parent)

### Reference: Story Requirements

- Story title patterns:
  - UI component: `title: 'Components/ComponentName'`
  - Custom (direct): `title: 'Custom/FolderName/ComponentName'`
  - Custom (sub-folder): `title: 'Custom/FolderName/SubFolderName/ComponentName'`
- Installation section with CLI command (`npx myoperator-ui add <name>`)
- Import statement
- Design Tokens table (Token | CSS Variable | Usage | Preview)
- Typography table if applicable
- Usage example code block
- Interactive stories for each variant/size/state
- **Composition story** showing real-world usage with multiple instances

### Reference: Registry Requirements

**IMPORTANT:** Registry updates are handled ONLY by the registry agent (or main agent if not parallelized). Sub-component agents from Phase 5 Step 0 must NOT modify `src/index.ts` or `components.yaml`.

Register ALL components created in this session (sub-components + parent) in a single pass:

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

### For Custom Components (including sub-components created by sub-agents)

For EACH component (sub-components first, then parent):

1. Add to `src/index.ts`:
```tsx
// SubComponentA (Custom)
export { SubComponentA } from "./components/custom/sub-component-a"
export type { SubComponentAProps } from "./components/custom/sub-component-a"

// ParentComponent (Custom)
export { ParentComponent } from "./components/custom/parent-component"
export type { ParentComponentProps } from "./components/custom/parent-component"
```

2. Add to `packages/cli/components.yaml` under the `custom` category:
```yaml
# Sub-component (created by sub-agent, registered by main agent)
sub-component-a:
  description: "Description"
  category: custom
  dependencies:
    - "lucide-react"
  isMultiFile: true
  directory: "sub-component-a"
  files:
    - "types.ts"
    - "sub-component-a.tsx"
    - "index.ts"
  mainFile: "index.ts"

# Parent component (uses sub-component via internalDependencies)
parent-component:
  description: "Description"
  category: custom
  dependencies:
    - "lucide-react"
  internalDependencies:
    - sub-component-a  # CLI auto-installs this when user adds parent-component
  isMultiFile: true
  directory: "parent-component"
  files:
    - "types.ts"
    - "parent-component.tsx"
    - "section-header.tsx"  # internal sub-file (if any)
    - "index.ts"
  mainFile: "index.ts"
```

**IMPORTANT:** Custom components ARE distributed via CLI (`npx myoperator-ui add <name>`). Always add them to `components.yaml` and use install command in Storybook docs.

## Phase 9: Validation & Summary

### Run ALL Tests Together

Run tests for all components created in this session (sub-components + parent):
```bash
npx vitest run src/components/custom/{sub-component-a}/__tests__/ src/components/custom/{sub-component-b}/__tests__/ src/components/custom/{parent-component}/__tests__/
```

### TypeScript Check

```bash
npx tsc --noEmit
```

### Summary Report

Present a comprehensive summary:

```markdown
## Components Created

### Sub-components (created in parallel by sub-agents)
| Component | Files | Tests | Status |
|-----------|-------|-------|--------|
| power-up-card | 5 files | 12 tests passing | ✓ |
| addon-card | 5 files | 8 tests passing | ✓ |

### Parent Component (created by main agent)
| Component | Files | Tests | Status |
|-----------|-------|-------|--------|
| power-ups-section | 6 files (incl. 1 internal sub-file) | 15 tests passing | ✓ |

### Registry Updates
- src/index.ts: 3 components added
- components.yaml: 3 entries added (2 sub-components + 1 parent with internalDependencies)

### Semantic Tokens Used
| Token | Usage |
|-------|-------|
| bg-semantic-primary | CTA button |
| text-semantic-text-muted | Description text |

### Next Steps
1. Run Storybook: `npm run storybook`
2. Verify visually in browser
3. Build CLI: `cd packages/cli && npm run build`
```

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
10. **NEVER use `@/components` imports in custom components** - Use relative paths like `../../ui/button`
11. **ALWAYS add `tailwindcss-animate` dependency** if using animation classes (`animate-in`, `animate-out`, `fade-in-*`, `zoom-in-*`, etc.)

## Import Path Rules (CRITICAL)

### For UI Components (`src/components/ui/`)
```tsx
// ✅ CORRECT - Use @/lib/utils (will be transformed by CLI)
import { cn } from "@/lib/utils"

// ✅ CORRECT - Import from sibling UI components
import { Button } from "./button"
```

### For Custom Components (`src/components/custom/component-name/`)
```tsx
// ✅ CORRECT - Use relative path to lib/utils
import { cn } from "../../../lib/utils"

// ✅ CORRECT - Use relative path to UI components
import { Button } from "../../ui/button"
import { Dialog, DialogContent } from "../../ui/dialog"

// ❌ WRONG - @/components will NOT work in user's project
import { Button } from "@/components/ui/button"
```

**Why this matters:** The `@/` path alias only exists in our source project. When components are installed in user projects, `@/components/ui/button` fails because users don't have that alias configured.

## Animation Dependency Rule (CRITICAL)

If your component uses ANY of these Tailwind classes, add `tailwindcss-animate` to dependencies in `components.yaml`:

```
animate-in, animate-out, fade-in-*, fade-out-*, zoom-in-*, zoom-out-*,
slide-in-from-*, slide-out-to-*, spin-in-*, spin-out-*
```

**Example components.yaml entry:**
```yaml
dialog:
  description: "Modal dialog with animations"
  category: overlay
  dependencies:
    - "@radix-ui/react-dialog"
    - "tailwindcss-animate"  # Required for animate-in/out classes
```

## Error Handling

- If screenshot not provided → Keep asking, it's required
- If Figma link not provided → Keep asking, it's required
- If Figma link is invalid → Ask for correct link, don't fall back to manual
- If component exists → Ask user to confirm override or create variant
- If CSS variable not found → Use closest semantic token and document
- If test fails → Fix component or test, don't skip
