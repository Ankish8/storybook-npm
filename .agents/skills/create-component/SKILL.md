---
name: create-component
description: Creates myOperator UI components following the full workflow: analyze codebase for existing components, scaffold with the generator, implement with forwardRef+CVA pattern and semantic CSS tokens, write tests, and generate comprehensive Storybook stories. Use when creating a new UI component, modifying an existing component, or asking about component architecture in the myOperator UI library.
---

# Create myOperator Component

Full workflow for creating or modifying components in the myOperator UI library.

## Quick Start

**Always use the generator first — never create files manually:**

```bash
node scripts/create-component.js <name> "<description>"
```

This creates `component.tsx`, `component.test.tsx`, `component.stories.tsx`, and updates `components.yaml`.

---

## Phase 1: Analyze Before Creating

Before generating anything, check the codebase to avoid duplication.

### 1a. Scan existing components

```
Glob: src/components/ui/*.tsx        (exclude __tests__/*, *.stories.tsx)
Glob: src/components/custom/*/*.tsx  (exclude __tests__/*, *.stories.tsx)
```

For each component extract: CVA variants, public exports, key props.

### 1b. Decision tree

| Situation | Action |
|-----------|--------|
| Exact match exists | Use it — tell the user |
| Similar name / same purpose | Add a **variant** to existing component |
| Combines multiple components | Create a **composition** (custom/) |
| Different structure or behavior | Create a **new component** |

### 1c. Category for `components.yaml`

| Category | Examples |
|----------|---------|
| `core` | button, badge, typography |
| `form` | input, select, checkbox, switch, text-field |
| `data` | table, list, data-grid |
| `overlay` | dialog, dropdown-menu, tooltip, form-modal |
| `feedback` | tag, alert, toast |
| `layout` | accordion, page-header, tabs |
| `custom` | multi-file complex components |

For detailed analysis patterns, see [component-analysis.md](component-analysis.md).

---

## Phase 2: Scaffold

```bash
# Take integrity snapshot FIRST
cd packages/cli && npm run integrity:snapshot

# Return to root and generate
cd ../..
node scripts/create-component.js <name> "<description>"
```

For **multi-file custom components** (complex, multiple sub-parts):
- Create in `src/components/custom/<name>/`
- Set `isMultiFile: true` in `components.yaml`
- Use relative imports (never `@/` aliases inside custom/)

---

## Phase 3: Implement the Component

### Standard pattern (UI components)

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        primary: "...",
      },
      size: {
        sm: "...",
        default: "...",
        lg: "...",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
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

### CSS token rules (CRITICAL)

**Never use hardcoded colors.** Always map to semantic tokens:

```tsx
// ✅ Correct
className="bg-semantic-primary text-semantic-text-inverted"
className="bg-semantic-bg-ui text-semantic-text-primary"
className="border-semantic-border-layout"
className="bg-primary text-primary-foreground"   // legacy tokens also OK

// ❌ Wrong
className="bg-[#343E55] text-white"
className="bg-gray-50 text-gray-900"
```

**Before using any token, verify it exists:**
```bash
grep -- "--semantic-<name>" src/index.css
```

Common Figma → token mappings:

| Figma color | Purpose | Token |
|-------------|---------|-------|
| `#343E55` | Primary actions | `bg-semantic-primary` / `bg-primary` |
| `#F5F5F5` | Surfaces | `bg-semantic-bg-ui` |
| `#717680` | Secondary text | `text-semantic-text-muted` |
| `#F04438` | Errors | `text-semantic-error-primary` |
| `#17B26A` | Success | `text-semantic-success-primary` |
| `#E9EAEB` | Borders | `border-semantic-border-layout` |

For the full token reference, see [design-system.md](design-system.md).

### Import rules

```tsx
// UI components (src/components/ui/) — use @/ alias
import { cn } from "@/lib/utils"
import { Button } from "./button"

// Custom components (src/components/custom/name/) — use relative paths
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
// NEVER use @/ in custom components
```

---

## Phase 4: Write Tests

Every component needs `src/components/ui/__tests__/<name>.test.tsx`.

**Required coverage:**

1. Renders correctly with children
2. All variants apply correct classes
3. All sizes apply correct classes
4. Custom `className` merging works
5. `ref` forwarding works
6. ARIA attributes (if applicable)

**Always read the component file before writing tests** — assertions must match actual classes.

```tsx
import { render, screen } from "@testing-library/react"
import { Component } from "../component"

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component>content</Component>)
    expect(screen.getByText("content")).toBeInTheDocument()
  })

  it("applies variant classes", () => {
    const { container } = render(<Component variant="primary" />)
    expect(container.firstChild).toHaveClass("bg-primary")
  })

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Component ref={ref} />)
    expect(ref.current).toBeInTheDocument()
  })
})
```

---

## Phase 5: Generate Storybook Stories

Story file: `src/components/ui/<name>.stories.tsx`

### Required stories (in order)

1. **Overview** — interactive with `args` + controls
2. **Per-variant stories** — one export per variant
3. **AllVariants** — side-by-side comparison render
4. **AllSizes** — side-by-side size comparison
5. **WithIcons** / **States** / **Loading** — as applicable

### Story file template

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Component } from "./component"

/**
 * Brief description of the component.
 *
 * ## Installation
 * ```bash
 * npx myoperator-ui add <name>
 * ```
 *
 * ## Import
 * ```tsx
 * import { Component } from "@myoperator/ui"
 * ```
 *
 * ## Design Tokens
 *
 * | Token | CSS Variable | Usage | Preview |
 * |-------|--------------|-------|---------|
 * | Primary | `--primary` | Background | <div style="width:20px;height:20px;background:var(--primary);border-radius:4px"></div> |
 *
 * ## Usage
 * ```tsx
 * <Component variant="primary" size="lg">Content</Component>
 * ```
 */
const meta: Meta<typeof Component> = {
  title: "Components/ComponentName",  // "Custom/ComponentName" for custom/
  component: Component,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary"],
      description: "Visual style variant",
      table: { defaultValue: { summary: "default" } },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = { args: { children: "Component" } }

export const Primary: Story = { args: { variant: "primary", children: "Primary" } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Component variant="default">Default</Component>
      <Component variant="primary">Primary</Component>
    </div>
  ),
}
```

For the full Storybook patterns (design tokens table, typography table, state stories, domain-specific props), see [storybook.md](storybook.md).

---

## Phase 6: Verify & Build

```bash
# Verify only the intended component changed
cd packages/cli
node scripts/check-integrity.js verify <component-name>

# Full build
npm run build
```

If `api:check` blocks a commit for intentional breaking changes:
```bash
npm run api:snapshot  # Update baseline
```

---

## components.yaml Entry

After scaffolding, review the auto-generated entry and add missing fields:

```yaml
- name: component-name
  description: "What this component does"
  category: core          # See category table in Phase 1
  dependencies:           # npm packages
    - class-variance-authority
    - lucide-react
  internalDependencies:   # Other myOperator components used
    - button
    - input
```

For multi-file components, add:
```yaml
  isMultiFile: true
  directory: src/components/custom/component-name
  files:
    - component-name.tsx
    - component-subpart.tsx
    - index.ts
  mainFile: component-name.tsx
```

---

## Checklist

```
- [ ] Phase 1: Analyzed existing components — no duplication
- [ ] Phase 2: Scaffolded with generator + integrity snapshot taken
- [ ] Phase 3: Implemented with forwardRef + CVA + semantic tokens
- [ ] Phase 3: Verified all tokens exist in src/index.css
- [ ] Phase 4: Tests written — all assertions match actual classes
- [ ] Phase 5: Stories cover overview, variants, sizes, states
- [ ] Phase 5: Design tokens table in story JSDoc
- [ ] Phase 6: Integrity verified, build passes
```
