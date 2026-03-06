---
description: "[Cursor] Create a new React component with interactive guided workflow — uses Cursor's AskQuestion tool for all prompts"
argument-hint: Optional screenshot path
---

# Create Component Workflow (Cursor Edition)

You are creating a new React component for the myOperator UI component library.
This command uses **Cursor's native `AskQuestion` tool** for all interactive prompts.

> **Note:** This is the Cursor-native version of `/create-component`.
> The original at `.claude/commands/create-component.md` is the Claude Code version (uses `AskUserQuestion`).

---

## Phase 1: Screenshot Analysis & Component Discovery

### Step 1: Ask for Screenshot

**FIRST: Check if a screenshot or image was already provided in the current message.**
- If an image is attached → skip this step and go directly to Step 2.
- If no image is present → send a plain conversational message:

> "Please share a screenshot of the component you want to create. You can paste or drag-drop an image directly into the chat, or provide a file path."

Wait for the user's reply before continuing.

### Step 2: Analyze the Screenshot

Once you receive the screenshot (or see one attached):
- Use the Read tool to view it (Claude is multimodal)
- Determine: component structure, purpose, type (UI primitive vs complex custom), suggested names

### Step 3: Ask for Component Name

Call `AskQuestion` with 3–4 name suggestions derived from the screenshot analysis:

```
AskQuestion({
  questions: [{
    id: "component_name",
    prompt: "Based on the screenshot, pick a name for this component:",
    options: [
      { id: "name_1", label: "<suggested-name-1> — <brief description>" },
      { id: "name_2", label: "<suggested-name-2> — <brief description>" },
      { id: "name_3", label: "<suggested-name-3> — <brief description>" },
      { id: "custom",  label: "Other — I'll type a custom name" }
    ]
  }]
})
```

If the user selects "Other", ask them to type the name in their next message.

### Step 4: Confirm Component Type

Pre-determine if this looks like a UI primitive or a complex custom component, then confirm:

```
AskQuestion({
  questions: [{
    id: "component_type",
    prompt: "Based on the design, this appears to be a [Custom/UI] component. Confirm the type:",
    options: [
      { id: "ui",     label: "UI component (src/components/ui/) — simple, reusable primitive" },
      { id: "custom", label: "Custom component (src/components/custom/) — complex composite" }
    ]
  }]
})
```

### Step 4b: Modal or Inline?

```
AskQuestion({
  questions: [{
    id: "component_kind",
    prompt: "How does this component render?",
    options: [
      { id: "modal",  label: "Modal / Dialog — opens as an overlay; show closed in Storybook with a trigger button" },
      { id: "inline", label: "Page / Panel / Inline — renders directly in the page" }
    ]
  }]
})
```

Store result as `componentKind: "modal" | "inline"` — this controls the Storybook story pattern.

### Step 5: Select Folder & Sub-folder (Custom components only)

**5a: Scan existing Storybook groups:**
```
Grep for title: "Custom/ in src/components/custom/**/*.stories.tsx
Parse all group/sub-group levels
```

Then call AskQuestion with the discovered groups:

```
AskQuestion({
  questions: [{
    id: "storybook_folder",
    prompt: "Which Storybook folder should this component belong to?",
    options: [
      { id: "group_1", label: "<Discovered Group 1>" },
      { id: "group_2", label: "<Discovered Group 2>" },
      { id: "new",     label: "Create a new folder" }
    ]
  }]
})
```

**5b: Sub-folder selection** (always ask after top-level is chosen):

```
AskQuestion({
  questions: [{
    id: "storybook_subfolder",
    prompt: "Place directly in '<FolderName>' or inside a sub-folder?",
    options: [
      { id: "direct",    label: "Directly in <FolderName>" },
      { id: "subfolder_1", label: "<Existing SubFolder 1>" },
      { id: "new_sub",   label: "Create a new sub-folder" }
    ]
  }]
})
```

Story title resolution:
- Direct in folder → `title: "Custom/<FolderName>/<ComponentName>"`
- In sub-folder → `title: "Custom/<FolderName>/<SubFolderName>/<ComponentName>"`

### Step 6: Check if Component Exists

Search `src/components/ui/` and `src/components/custom/` for similar names.
If found, call AskQuestion:

```
AskQuestion({
  questions: [{
    id: "existing_component",
    prompt: "A similar component '<name>' already exists. What would you like to do?",
    options: [
      { id: "variant",   label: "Add a variant to the existing component" },
      { id: "new",       label: "Create a different component" },
      { id: "overwrite", label: "Proceed anyway (will overwrite)" }
    ]
  }]
})
```

---

## Phase 2: Figma Design Context (REQUIRED)

### Step 1: Ask for Figma Link

```
AskQuestion({
  questions: [{
    id: "figma_link",
    prompt: "Please provide the Figma link for this component. Required for accurate design tokens and spacing.",
    options: [
      { id: "paste",  label: "I'll paste the Figma URL in my next message" },
      { id: "help",   label: "Show me how to get a Figma link" }
    ]
  }]
})
```

If "help" → explain: open the component in Figma → right-click → "Copy link to selection".

### Step 2: Fetch Figma Design

Extract `fileKey` and `nodeId` from the URL:
```
https://figma.com/design/:fileKey/:fileName?node-id=:nodeId
```

Then call:
- `get_design_context(fileKey, nodeId)` — design metadata and reference code
- `get_screenshot(fileKey, nodeId)` — visual reference

### Step 3: Multi-state Analysis

```
AskQuestion({
  questions: [{
    id: "states",
    prompt: "Does this component have multiple visual states? (e.g., loading, success, error)",
    options: [
      { id: "yes_links",  label: "Yes — I have separate Figma links for each state" },
      { id: "yes_same",   label: "Yes — all states are visible in the same Figma frame" },
      { id: "no",         label: "No — single state only" }
    ]
  }]
})
```

If multiple states exist, collect links and build a State Inventory Table:
```markdown
| State   | Trigger              | Key Visual Differences | Figma Node |
|---------|----------------------|------------------------|------------|
| Default | Initial render       | Base layout            | node-id=X  |
| Success | After action completes | Green CTA, check icon | node-id=Y  |
```

---

## Phase 3: Subcomponent Identification

### Step 1: Identify Existing Reusable Components

Check if the design contains: inputs → `text-field`, buttons → `button`, dropdowns → `select-field`,
checkboxes → `checkbox`, switches → `switch`, dialogs → `dialog` or `form-modal`, badges → `badge`, tags → `tag`

### Step 2: Confirm Reuse

```
AskQuestion({
  questions: [{
    id: "reuse_subcomponents",
    prompt: "I identified these existing components that can be reused. Confirm which to use:",
    allow_multiple: true,
    options: [
      { id: "button", label: "Button — for the action button" },
      { id: "badge",  label: "Badge — for status indicators" },
      { id: "none",   label: "None of these" }
    ]
  }]
})
```

### Step 3: Detect New Sub-Component Patterns

Look for repeating elements or distinct compositional boundaries.
If found, call AskQuestion for each pattern:

```
AskQuestion({
  questions: [{
    id: "subcomponent_<name>",
    prompt: "I detected a repeating pattern: [describe]. How should I handle it?",
    options: [
      { id: "separate",  label: "Create as separate component — independently installable, best if reused elsewhere" },
      { id: "internal",  label: "Keep as internal sub-file — bundled with parent, not independently installable" },
      { id: "inline",    label: "No separate component — render inline (best for < 15 lines of JSX)" }
    ]
  }]
})
```

### Step 4: Collect Figma Links for Sub-Components

For each new sub-component:

```
AskQuestion({
  questions: [{
    id: "subcomponent_figma_<name>",
    prompt: "Please provide the Figma link for the [sub-component name] sub-component.",
    options: [
      { id: "paste",     label: "I'll paste the Figma URL" },
      { id: "same",      label: "Same as parent — it's visible in the parent's frame" }
    ]
  }]
})
```

### Step 5: Sub-Component Variant Analysis

For each new sub-component:

```
AskQuestion({
  questions: [{
    id: "subcomponent_variants_<name>",
    prompt: "Does the [sub-component name] have multiple variants or visual states?",
    options: [
      { id: "yes_links", label: "Yes — I have Figma links for each variant" },
      { id: "yes_same",  label: "Yes — all variants are in the same Figma frame" },
      { id: "no",        label: "No variants — single appearance only" }
    ]
  }]
})
```

### Step 6: Present Creation Plan

After gathering all the above info, present a bottom-up creation plan:
```markdown
### Creation Order:
1. [Sub-component A] (separate) — src/components/custom/sub-component-a/
2. [Sub-component B] (internal) — will be inside parent directory
3. [Parent component] — src/components/custom/parent-component/
```

Then ask:
```
AskQuestion({
  questions: [{
    id: "confirm_plan",
    prompt: "Does this creation plan look correct?",
    options: [
      { id: "yes",    label: "Yes — proceed with creation" },
      { id: "modify", label: "No — I want to make changes" }
    ]
  }]
})
```

---

## Phase 4: Design System Validation

### Map Figma Colors to Semantic Tokens

**NEVER use hardcoded hex colors.** Map to semantic tokens:
- `#343E55` → `bg-semantic-primary`
- `#F5F5F5` → `bg-semantic-bg-ui`
- `#717680` → `text-semantic-text-muted`
- `#F04438` → `text-semantic-error-primary`
- `#17B26A` → `text-semantic-success-primary`
- `#E9EAEB` → `border-semantic-border-layout`

**Verify every token:** `grep -- "--semantic-<name>" src/index.css`

---

## Phase 5: Component Generation (Parallel Sub-Agent Architecture)

### Step 0: Spawn Parallel Sub-Agents for Sub-Components

If Phase 3 identified "separate component" sub-components, spawn them in parallel using the `Task` tool.
Make ALL `Task` calls in a **single message** so they execute in parallel.

Each sub-agent:
- Creates: `types.ts`, `component.tsx`, `index.ts`, `__tests__/`, `.stories.tsx`
- Does NOT modify `src/index.ts` or `packages/cli/components.yaml` (main agent handles those)
- Uses relative imports (`../../../lib/utils`, `../../ui/button`) — never `@/` aliases

Verify all sub-agents succeeded before proceeding to the parent.

### For UI Components (`src/components/ui/`)

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva("base-classes", {
  variants: { variant: {}, size: {} },
  defaultVariants: {},
})

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div ref={ref} className={cn(componentVariants({ variant, size, className }))} {...props} />
  )
)
Component.displayName = "Component"

export { Component, componentVariants }
```

### For Custom Components (`src/components/custom/{name}/`)

- `types.ts` — shared TypeScript interfaces
- `{name}.tsx` — main component (relative imports only, never `@/`)
- Internal sub-file components if any
- `index.ts` — re-exports
- `__tests__/{name}.test.tsx` — tests

---

## Phase 6: Tests + Stories + Registry (Parallel)

After component files are created, spawn **3 parallel agents** in a single message:

**Agent 1: Test Generator**
- Read the component file to extract exact CVA classes
- Write assertions that match actual class names
- Cover: renders, variants, sizes, className merging, ref forwarding, callbacks, conditional rendering
- Run tests and report results

**Agent 2: Story Generator**

Before writing ANY story file, read the closest existing reference:
- Modal components → `src/components/ui/form-modal.stories.tsx`
- Custom list items → `src/components/custom/chat-list-item/chat-list-item.stories.tsx`
- UI primitives → `src/components/ui/button.stories.tsx`

Story requirements:
- `tags: ["autodocs"]`
- `docs.description.component` with template string (backtick) — NOT JSDoc `/**`
- `### Installation` section with bash codeblock
- `### Import` section with tsx codeblock
- `### Design Tokens` markdown table (NOT HTML table) with `<span style="color:#hex">■</span>` swatches
- `argTypes` for EVERY prop (callbacks use `action:`, not `control:`)
- One story per visual state/variant, with `name:` for display labels

**Modal story pattern** (if `componentKind === "modal"`):
```tsx
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>Open ComponentName</Button>
        <ComponentName open={open} onOpenChange={setOpen} {/* realistic props */} />
      </div>
    )
  },
}
```
NEVER use `open: true` in `args` for modal stories. Every modal story uses this render+useState pattern.

**Inline story pattern** (if `componentKind === "inline"`):
```tsx
export const Default: Story = {
  args: { /* realistic prop values */ },
}
```

**Agent 3: Registry Updater**
- Append to `src/index.ts`: exports for component + types
- Append to `packages/cli/components.yaml`: component entry under correct category with `isMultiFile: true` for custom components

---

## Phase 7: Validation

```bash
npx vitest run src/components/{type}/{name}/__tests__/{name}.test.tsx
npx tsc --noEmit
```

Fix any failures before proceeding.

---

## Phase 8: Summary Report

```markdown
## Components Created

### Files
- src/components/custom/{name}/types.ts
- src/components/custom/{name}/{name}.tsx
- src/components/custom/{name}/index.ts
- src/components/custom/{name}/__tests__/{name}.test.tsx
- src/components/custom/{name}/{name}.stories.tsx

### Semantic Tokens Used
| Token | Usage |
|-------|-------|
| bg-semantic-primary | ... |

### Subcomponents Reused
- button, dialog, ...

### Next Steps
1. `npm run storybook` — verify visually in browser
2. `cd packages/cli && npm run build` — build CLI
```

---

## Critical Rules

1. **NEVER use hardcoded colors** — always semantic tokens
2. **ALWAYS require Figma link** — no component without it
3. **ALWAYS generate tests** — assertions must match actual component classes
4. **ALWAYS create Storybook stories** — follow reference file structure exactly
5. **NEVER use `@/` in custom components** — use relative paths
6. **ALWAYS use CVA + forwardRef** for all components
7. **ALWAYS check existing components** before creating new ones
8. **Modal stories NEVER use `open: true` in args** — always render() + useState + trigger button
9. **Add `tailwindcss-animate` to dependencies** if using `animate-in`, `animate-out`, `fade-in-*`, etc.
