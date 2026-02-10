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

## Phase 2: Check for Existing Components

Before creating anything, search for similar components:

1. Search `src/components/ui/` and `src/components/custom/` for similar names
2. Read `packages/cli/components.yaml` for all registered components
3. If a similar component exists, suggest adding a variant instead of creating a new component
4. Ask user to confirm: create new or add variant to existing?

## Phase 3: Identify Reusable Subcomponents

Check if the design includes elements that match existing components:
- Text inputs → `text-field` or `input`
- Buttons → `button`
- Dropdowns → `select-field`
- Checkboxes → `checkbox`
- Switches → `switch`
- Dialogs/modals → `dialog` or `form-modal`
- Badges → `badge`
- Tags → `tag`

Present identified subcomponents to the user and confirm which to reuse.

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
- Main component file
- Sub-component files as needed
- `types.ts` for shared types
- Tests in `__tests__/` subdirectory
- Story file

Use relative imports (`../../ui/button`) not `@/components/ui/button`.

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
