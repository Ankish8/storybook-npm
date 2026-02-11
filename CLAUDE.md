# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**IMPORTANT: Never add "Co-Authored-By: Claude" or "Generated with Claude Code" to commit messages.**

## Architecture Overview

This is a **React component library** (myOperator UI) distributed via a CLI tool, with an MCP server for AI integration. The monorepo contains three packages:

1. **Root** (`shadcn-react-app`) — Source components in `src/components/ui/`, Storybook for development, Vite for builds. Components follow the shadcn/ui pattern: `forwardRef` + CVA variants + `cn()` utility.
2. **`packages/cli`** (`myoperator-ui`) — CLI that consumers run via `npx myoperator-ui add button`. It embeds component source code into generated registry files, applies a `tw-` Tailwind prefix for Bootstrap compatibility, and copies components into user projects.
3. **`packages/mcp`** (`myoperator-mcp`) — MCP server providing component metadata to AI assistants via stdio transport.

**Data flow**: Source components → `components.yaml` defines metadata → `generate-registry.js` reads YAML + source files → produces `registry-*.ts` files with embedded code → `tsup` bundles CLI → consumers get prefixed components.

**Categories** control how the CLI lazy-loads component registries. Each category (`core`, `form`, `data`, `overlay`, `feedback`, `layout`, `custom`) generates a separate `registry-{category}.ts` file, allowing the CLI to load only needed code.

## Commands

```bash
# Development
npm run storybook          # Storybook on port 6006
npm run dev                # Vite dev server
npm test                   # Run all component tests (vitest)
npm run test:watch         # Watch mode
npx vitest run src/components/ui/__tests__/button.test.tsx  # Single test file

# Linting & Formatting
npm run lint               # ESLint (flat config)
npm run format             # Prettier write
npm run format:check       # Prettier check

# API & Integrity
npm run api:snapshot       # Generate .api-snapshot.json baseline
npm run api:check          # Detect breaking changes against baseline

# CLI package (from packages/cli/)
cd packages/cli
npm run build              # Full pipeline: validate → generate-registry → validate:prefix → tsup → verify
npm test                   # CLI-specific tests
npm run generate-registry  # Regenerate registry from components.yaml + source files
npm run integrity:snapshot # Snapshot component hashes before changes
node scripts/check-integrity.js verify <component-name>  # Verify only intended component changed

# MCP package (from packages/mcp/)
cd packages/mcp
npm run build              # tsup build
npm run typecheck          # TypeScript check

# Sync MCP metadata (from root)
node scripts/sync-mcp-metadata.js  # Updates MCP package with component info from components.yaml
```

## Component Change Workflow

**ALWAYS follow this when modifying components:**

1. `cd packages/cli && npm run integrity:snapshot` — Before changes
2. Edit ONLY the specified component in `src/components/ui/`
3. `node scripts/check-integrity.js verify <component-name>` — After changes
4. `npm run build` — Build and validate

**Rules**: One component at a time. Don't edit registry files directly (auto-generated). Don't modify unrelated components.

**Primary development tool**: Storybook (`npm run storybook`). All components should have stories in `src/components/ui/{component}.stories.tsx`. Use Storybook to visually test variants, states, and interactions before committing.

## Storybook Conventions

**Title patterns**: UI components use `title: "Components/ComponentName"`, custom components use `title: "Custom/ComponentName"` (or `"Custom/SubGroup/ComponentName"` for sub-grouped).

**Required stories** for each component:
1. **Overview** — interactive with `args` controls
2. **Individual variant stories** — one per variant
3. **All Variants** — side-by-side comparison render
4. **All Sizes** — side-by-side comparison render
5. **With Icons** / **States** / **Usage examples** — as applicable

**Docs section** (`docs.description.component`) must include: brief description, CLI install command (`npx myoperator-ui add <name>`), import statement, and a Design Tokens table showing CSS variables with color preview swatches.

## Creating New Components

**Always use the generator** — never create component files manually:

```bash
node scripts/create-component.js <name> "<description>"
```

This creates the component `.tsx`, test file, and Storybook story, and updates `components.yaml`.

## Component Patterns

Components use `@/lib/utils` imports (transformed to relative paths during CLI build). Standard pattern:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const variants = cva("base-classes", { variants: {}, defaultVariants: {} })

export interface Props extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof variants> {}

const Component = React.forwardRef<HTMLElement, Props>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(variants({ variant, className }))} {...props} />
))
Component.displayName = "Component"

export { Component, variants }
```

**Multi-file components** (in `src/components/custom/`) have a directory with multiple `.tsx` files and are declared in `components.yaml` with `isMultiFile: true`.

**Import path rules** — UI and custom components use different import styles:
```tsx
// UI components (src/components/ui/) — use @/ alias
import { cn } from "@/lib/utils"
import { Button } from "./button"          // sibling UI import

// Custom components (src/components/custom/name/) — use relative paths
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
// NEVER use @/components/ui/button in custom components
```

**Internal dependencies** — Some components depend on other components (e.g., `delete-confirmation-modal` uses `dialog`, `button`, `input`). The CLI automatically installs these when a user adds the component. Check `internalDependencies` in `components.yaml` when adding new composed components.

**Animation dependencies** — If a component uses animation classes (`animate-in`, `animate-out`, `fade-in-*`, `zoom-in-*`, `slide-in-from-*`), add `tailwindcss-animate` to its `dependencies` in `components.yaml`.

### components.yaml Structure

Each component entry in `packages/cli/components.yaml` supports:
- `description` — User-facing description for CLI output
- `category` — Groups components for lazy-loading (core, form, data, overlay, feedback, layout, custom)
- `dependencies` — npm packages to install
- `internalDependencies` — Other myOperator components this depends on (auto-installed by CLI)
- `isMultiFile` — Set to true for components with multiple files
- `directory`, `files`, `mainFile` — Required for multi-file components

## Theming — CSS Variables

NEVER use hardcoded colors. The codebase has two token systems; **prefer `semantic-*` tokens** for new work:

```tsx
// BEST — semantic tokens (preferred for new components)
className="bg-semantic-primary text-semantic-text-inverted"
className="bg-semantic-bg-ui text-semantic-text-primary"
className="border-semantic-border-layout"

// OK — legacy tokens (still used in older components)
className="bg-primary text-primary-foreground"
className="bg-background text-foreground border-border"

// WRONG — hardcoded colors
className="bg-[#343E55] text-white"
className="bg-gray-50 text-gray-900"
```

### Semantic Token Reference

| Category | Tokens |
|----------|--------|
| Backgrounds | `bg-semantic-primary`, `bg-semantic-primary-hover`, `bg-semantic-primary-surface`, `bg-semantic-bg-primary`, `bg-semantic-bg-ui`, `bg-semantic-bg-hover` |
| Status surfaces | `bg-semantic-success-surface`, `bg-semantic-error-surface`, `bg-semantic-warning-surface`, `bg-semantic-info-surface` |
| Text | `text-semantic-text-primary`, `text-semantic-text-secondary`, `text-semantic-text-muted`, `text-semantic-text-inverted`, `text-semantic-text-link` |
| Status text | `text-semantic-success-primary`, `text-semantic-error-primary`, `text-semantic-warning-primary` |
| Borders | `border-semantic-border-primary`, `border-semantic-border-layout`, `border-semantic-border-input`, `border-semantic-border-focus` |
| Legacy | `background/foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring` |

### Figma Color Mapping

When translating Figma designs to code, map hex values to semantic tokens by purpose:

```
#343E55 (dark blue)   → bg-semantic-primary (primary actions)
#F5F5F5 (light gray)  → bg-semantic-bg-ui (surfaces)
#717680 (medium gray)  → text-semantic-text-muted (secondary text)
#F04438 (red)          → bg-semantic-error-primary / text-semantic-error-primary
#17B26A (green)        → bg-semantic-success-primary / text-semantic-success-primary
#E9EAEB (border gray)  → border-semantic-border-layout
```

Always verify a token exists before using it: `grep "--semantic-<name>" src/index.css`.

## Tailwind tw- Prefix System

The CLI build adds `tw-` to all Tailwind classes for Bootstrap compatibility. The prefixer recognizes these patterns:
- `cva("classes")` — CVA base/variant classes
- `cn("classes")` / `cn('classes')` — Merged classes
- `className="classes"` — JSX attributes
- `key: "classes"` — Object property values

Avoid template literals or complex string concatenation for class strings — they won't be prefixed.

Validation: `npm run validate:prefix` (false prefixing) and `npm run validate:coverage` (missed classes).

## Test Requirements

Every component needs a test file in `src/components/ui/__tests__/`. Required coverage:
1. Renders correctly (basic render with children)
2. All variants have correct classes
3. All sizes have correct classes
4. Custom className merging
5. Ref forwarding
6. ARIA attributes (if applicable)

**Test assertions must match actual component classes** — always read the component file before writing tests.

## Pre-commit Hooks

Husky runs on commit:
1. `check-component-tests.js` — Ensures all components have test files
2. `validate-cva-props.js` — Validates CVA variant definitions match prop destructuring
3. lint-staged: ESLint fix + `api:check` (breaking change detection) + `generate-registry`

If `api:check` blocks a commit for intentional breaking changes, run `npm run api:snapshot` to update the baseline.

## Key Files

| File | Purpose |
|------|---------|
| `src/components/ui/*.tsx` | Source components — EDIT THESE |
| `packages/cli/components.yaml` | Component registry definitions (YAML) |
| `packages/cli/scripts/generate-registry.js` | Generates registry from YAML + source |
| `packages/cli/scripts/check-integrity.js` | MD5 hash verification for changes |
| `scripts/create-component.js` | New component generator |
| `scripts/check-breaking-changes.js` | API regression detection |
| `.api-snapshot.json` | Baseline for breaking change detection |

## Publishing

```bash
# CLI package
cd packages/cli
npm run integrity:snapshot
# ... make changes & verify ...
npm version patch
npm run build
npm publish                # Uses automation token from ~/.npmrc or NPM_TOKEN

# MCP package (sync metadata first!)
cd ../..                   # Return to root
node scripts/sync-mcp-metadata.js  # Sync component data from components.yaml
cd packages/mcp
npm version patch
npm run build
npm publish
```
