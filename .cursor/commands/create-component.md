# Create Component Workflow

You are creating a new React component for the myOperator UI component library. Follow this comprehensive workflow step by step.

## Phase 1: Gather Inputs

### Step 1: Ask for Screenshot

Ask the user to provide a screenshot of the component from Figma. This is REQUIRED — do not proceed without it.

If the user already provided a screenshot, analyze it. Otherwise, ask them to paste or drag-drop a screenshot.

### Step 2: Analyze the Design

From the screenshot, determine:
- **Component structure**: What elements are visible (buttons, inputs, cards, lists, etc.)
- **Component purpose**: What does this component do?
- **Component type**: Is this a simple UI primitive or a complex custom component?

Suggest 3-4 kebab-case names based on your analysis and ask the user to pick one.

### Step 3: Ask for Figma Link

Ask the user for the Figma link. This is REQUIRED for accurate design implementation.

Once provided, extract the fileKey and nodeId from the URL pattern:
`https://figma.com/design/:fileKey/:fileName?node-id=:nodeId`

Use the Figma MCP tools to fetch design context:
- `get_design_context` for code/design metadata
- `get_screenshot` for visual reference

### Step 4: Determine Component Type

Based on the design:
- **UI component** (`src/components/ui/`) — Simple, reusable primitive (button, badge, input)
- **Custom component** (`src/components/custom/`) — Complex composite with multiple elements

### Step 5: Select Folder & Sub-folder (ONLY if Custom component)

Scan existing Storybook groups and sub-groups:
```
Grep for `title: "Custom/` in src/components/custom/**/*.stories.tsx
Parse ALL levels: "Custom/<Group>/<Name>" and "Custom/<Group>/<SubGroup>/<Name>"
```

**5a: Select top-level folder** — Present existing groups (e.g., "Plan & Payment", "Webhook") + "Create a new folder" option.

**5b: Select sub-folder** — After top-level folder is selected, scan for sub-groups within it. Present:
- "Directly in <FolderName>" — Component at the top level of this folder
- Each existing sub-folder (e.g., "Plan & Pricing")
- "Create a new sub-folder" → Ask for name; create a placeholder story at `src/components/custom/<sub-folder-kebab>.stories.tsx` with `title: "Custom/<Folder>/<SubFolder>/Overview"` so the folder appears in Storybook immediately.

**Story title resolution:**
- Direct in folder → `title: "Custom/<FolderName>/<ComponentName>"`
- In sub-folder → `title: "Custom/<FolderName>/<SubFolderName>/<ComponentName>"`

## Phase 2: Check for Existing Components

Before creating anything, search for similar components:

1. Search `src/components/ui/` and `src/components/custom/` for similar names
2. Read `packages/cli/components.yaml` for all registered components
3. If a similar component exists, suggest adding a variant instead of creating a new component
4. Ask user to confirm: create new or add variant to existing?

## Phase 3: Identify Subcomponents

### Step 1: Identify Existing Reusable Components

Check if the design includes elements that match existing library components:
- Text inputs → `text-field` or `input`
- Buttons → `button`
- Dropdowns → `select-field`
- Checkboxes → `checkbox`
- Switches → `switch`
- Dialogs/modals → `dialog` or `form-modal`
- Badges → `badge`
- Tags → `tag`

Present identified subcomponents to the user and confirm which to reuse.

### Step 2: Detect New Sub-Component Patterns

Look for **repeating elements** or **distinct compositional boundaries** that don't exist in the library:
- 2+ visually identical structures (e.g., cards in a grid)
- Self-contained UI blocks with their own icon + text + CTA
- Elements that could logically render independently

If detected, ask the user:
- **"Create as separate component"** — Independent, CLI-installable. Best when reusable elsewhere or has its own variants/states.
- **"Keep as internal sub-file"** — File inside parent directory (like `plan-icons.tsx` in `pricing-card/`). Best when only used by this parent.
- **"No separate component"** — Render inline. Best for < 15 lines of JSX.

### Step 3: Collect Figma Links for Sub-Components

For each new sub-component, ask: "Please provide the Figma link for the [sub-component name]."
- If separate Figma link → fetch design context and screenshot
- If "Same as parent" → analyze the sub-component area from parent's Figma frame

### Step 4: Sub-Component Variant Analysis

For each new sub-component, ask if it has variants or states:
- If yes with separate Figma links → collect a link per variant, fetch screenshots
- If yes in same frame → analyze differences between instances
- If no → single appearance

Build a variant inventory table if applicable.

### Step 5: Build Creation Order (Bottom-Up)

1. **First**: Create "separate component" sub-components (full lifecycle: types → component → tests → stories → components.yaml → src/index.ts)
2. **Second**: Create parent component (imports sub-components, creates internal sub-files)
3. **Third**: Create parent's tests and stories

Present creation plan to user before proceeding.

## Phase 4: Map Figma Colors to Design Tokens

Extract colors from the Figma design and map them to semantic tokens:

**NEVER use hardcoded hex colors.** Always map to semantic tokens:
- `#343E55` → `bg-semantic-primary`
- `#F5F5F5` → `bg-semantic-bg-ui`
- `#717680` → `text-semantic-text-muted`
- `#F04438` → `text-semantic-error-primary`
- `#17B26A` → `text-semantic-success-primary`
- `#E9EAEB` → `border-semantic-border-layout`

**IMPORTANT:** Verify each token exists by searching `src/index.css` for the CSS variable name.

## Phase 5: Create Component Files

### Step 0: Spawn Parallel Sub-Agents for Sub-Components (if any from Phase 3)

If Phase 3 identified "separate component" sub-components, create them **in parallel** using the Task tool:

1. **Prepare context** for each sub-component: Figma design data, color mappings, props interface, variant inventory, conventions
2. **Spawn agents in parallel** using multiple Task calls (subagent_type: "general-purpose", mode: "bypassPermissions") in a SINGLE message
3. Each sub-agent creates: types.ts, component.tsx, index.ts, tests, stories — but does NOT modify src/index.ts or components.yaml (main agent handles those)
4. **Verify results** after all sub-agents complete: check files exist, run tests together
5. Proceed to parent component creation only after all sub-components are verified

For "internal sub-file" sub-components: these are created inside the parent directory in the steps below.

### For UI Components

Create 3 files following the project patterns:

1. **Component** (`src/components/ui/{name}.tsx`):
   - Use `React.forwardRef` with proper TypeScript types
   - Use CVA (`class-variance-authority`) for variants
   - Use `cn()` from `@/lib/utils` for className merging
   - Use semantic design tokens only
   - Set `displayName`
   - Export component AND variants

2. **Tests** (`src/components/ui/__tests__/{name}.test.tsx`):
   - READ the component file FIRST, then extract actual CVA classes
   - Test: renders correctly, all variants, all sizes, custom className, ref forwarding, aria props
   - Use `it.each` for variant/size tests
   - Assert the EXACT classes from the component

3. **Stories** (`src/components/ui/{name}.stories.tsx`):
   - Include `tags: ["autodocs"]`
   - Add installation command in docs description
   - Add design tokens table with color previews
   - Create stories: Overview, each variant, AllVariants, AllSizes
   - Add argTypes for interactive controls

### For Custom Components

Create in `src/components/custom/{name}/`:
- `types.ts` for shared types/interfaces
- Main component file (imports sub-components from Step 0 if any)
- Internal sub-file components (if marked "internal sub-file" in Phase 3)
- `index.ts` with exports
- Tests in `__tests__/` subdirectory
- Story file

Use relative imports (`../../ui/button`) not `@/components/ui/button`.

**Custom components ARE distributed via CLI** (`npx myoperator-ui add <name>`). Always add to `packages/cli/components.yaml` under `custom` category with `isMultiFile: true`, `directory`, `files`, and `mainFile`. Wire `internalDependencies` for any separate sub-components.

## Phase 6: Register the Component

### Update components.yaml

Add entry to `packages/cli/components.yaml`:
```yaml
component-name:
  description: "Description for CLI output"
  category: core  # core|form|data|overlay|feedback|layout|custom
  dependencies:
    - "class-variance-authority"
    - "clsx"
    - "tailwind-merge"
  internalDependencies:  # if using other myOperator components
    - button
```

### Update exports

Add to `src/index.ts`:
```tsx
export { Component, componentVariants } from "./components/ui/component"
export type { ComponentProps } from "./components/ui/component"
```

## Phase 7: Validate

1. Run tests: `npx vitest run src/components/ui/__tests__/{name}.test.tsx`
2. Check types: `npx tsc --noEmit`
3. Run Storybook: `npm run storybook` (tell user to verify visually)

## Phase 8: Summary

Report what was created:
- List all files created
- List semantic tokens used
- List subcomponents reused
- Next steps: verify in Storybook, then build CLI (`cd packages/cli && npm run build`)
