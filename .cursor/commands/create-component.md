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

### Step 4b: Ask if the component is a Modal or a Page/Panel

Use AskQuestion to ask:

```
Question: "What kind of component is this?"
Options:
  - Modal / Dialog — Opens as an overlay. In Storybook, show it closed by default with a trigger Button.
  - Page / Panel / Inline — Renders inline. In Storybook, render the component directly.
```

Store this as `componentKind: "modal" | "inline"`. It controls the story render pattern in Phase 5.

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
   - Follow the story format rules in the **Story File Format** section below.

### For Custom Components

Create in `src/components/custom/{name}/`:
- `types.ts` for shared types/interfaces
- Main component file (imports sub-components from Step 0 if any)
- Internal sub-file components (if marked "internal sub-file" in Phase 3)
- `index.ts` with exports
- Tests in `__tests__/` subdirectory
- Story file following the **Story File Format** section below

Use relative imports (`../../ui/button`) not `@/components/ui/button`.

**Custom components ARE distributed via CLI** (`npx myoperator-ui add <name>`). Always add to `packages/cli/components.yaml` under `custom` category with `isMultiFile: true`, `directory`, `files`, and `mainFile`. Wire `internalDependencies` for any separate sub-components.

---

## Story File Format (MANDATORY — read before writing any story)

### Step 0: Read an existing reference story first

Before writing ANY story file, read the closest existing story for structure reference:

```bash
# For custom Chat components:
cat src/components/custom/chat-list-item/chat-list-item.stories.tsx

# For overlay/modal components:
cat src/components/ui/form-modal.stories.tsx

# For UI primitives:
cat src/components/ui/button.stories.tsx
```

Then replicate its exact structure. Never invent a new story format.

### Story file structure (matches chat-list-item.stories.tsx pattern)

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { ComponentName } from "./component-name"

const meta: Meta<typeof ComponentName> = {
  title: "Custom/Group/ComponentName",   // or "Components/ComponentName" for UI
  component: ComponentName,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
One-line description of what the component does.

### Installation

\`\`\`bash
npx myoperator-ui add component-name
\`\`\`

### Import

\`\`\`tsx
import { ComponentName } from "@/components/custom/component-name"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Primary bg | \`--semantic-primary\` | CTA button | <span style="color:#343E55">■</span> \`#343E55\` |
| Border | \`--semantic-border-layout\` | Card border | <span style="color:#E9EAEB">■</span> \`#E9EAEB\` |
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // EVERY prop must be documented:
    propName: {
      control: "text",            // text | boolean | select | number | object
      description: "What this prop does",
      table: {
        defaultValue: { summary: "defaultValue" },
        type: { summary: "string" },
      },
    },
    onAction: {
      action: "action",           // use action: instead of control for callbacks
      description: "Callback description",
      table: { type: { summary: "() => void" } },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>
```

### Design Tokens table format

Use markdown table (NOT HTML table). Preview column uses inline `<span>` color swatch:

```markdown
| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Name text | `--text/text-primary` | Contact name | <span style="color:#181d27">■</span> `#181D27` |
| Muted text | `--text/text-muted` | Preview text | <span style="color:#717680">■</span> `#717680` |
| Border | `--border/border-layout` | Separator | <span style="color:#e9eaeb">■</span> `#E9EAEB` |
```

The preview column format is always: `<span style="color:#hex">■</span> \`#HEX\``

### argTypes — every prop required

Document EVERY prop in `argTypes`. Use the appropriate control type:

| Prop type | control value |
|-----------|--------------|
| `string` | `"text"` |
| `boolean` | `"boolean"` |
| `number` | `"number"` |
| `enum / union` | `"select"` with `options: [...]` |
| `array / object` | `"object"` |
| `ReactNode` / complex | `{ control: false }` |
| callback `() => void` | `action: "event-name"` (no control) |

### Stories — one per visual state

Each story uses `name:` for display, and `args:` with realistic values:

```tsx
export const Default: Story = {
  args: {
    name: "Aditi Kumar",
    message: "Have a look at this document",
    timestamp: "2:30 PM",
  },
}

export const WithUnreadCount: Story = {
  name: "Unread Messages",   // <-- overrides display name in Storybook sidebar
  args: {
    name: "Sushant Arya",
    unreadCount: 3,
  },
}
```

### Modal components — trigger button pattern

If `componentKind === "modal"`, NEVER use `open: true` in args. Instead, all stories use a `render()` with internal state and a trigger button:

```tsx
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open ComponentName
        </Button>
        <ComponentName
          open={open}
          onOpenChange={setOpen}
          // all required props with realistic values
        />
      </div>
    )
  },
}
```

Every modal story (Default, Loading, error states, etc.) follows this same trigger pattern.

### Inline / Page components

Use `args:` directly. Add a decorator if the component needs a fixed width:

```tsx
decorators: [
  (Story) => (
    <div style={{ width: 400, background: "white" }}>
      <Story />
    </div>
  ),
],
```

### Checklist before saving the story file

```
- [ ] docs.description.component uses template string (backtick, not JSDoc /**/)
- [ ] ### Installation section present with bash codeblock
- [ ] ### Import section present with tsx codeblock
- [ ] ### Design Tokens markdown table present (NOT HTML table)
- [ ] Design token preview uses <span style="color:#hex">■</span> `#HEX` format
- [ ] argTypes covers EVERY prop
- [ ] Callbacks use action: not control:
- [ ] One story per visual state / variant
- [ ] Stories use name: for readable display names
- [ ] Modal: all stories use render() + useState + trigger Button (no open: true in args)
- [ ] Inline: args used directly, decorator added if fixed width needed
```

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
