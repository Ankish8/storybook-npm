# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**IMPORTANT: Never add "Co-Authored-By: Claude" or "Generated with Claude Code" to commit messages.**

## Architecture Overview

This is a **React component library** (myOperator UI) distributed via a CLI tool, with an MCP server for AI integration. The monorepo contains three packages:

1. **Root** (`shadcn-react-app`) — Source components in `src/components/ui/`, Storybook for development, Vite for builds. Components follow the shadcn/ui pattern: `forwardRef` + CVA variants + `cn()` utility.
2. **`packages/cli`** (`myoperator-ui`) — CLI that consumers run via `npx myoperator-ui add button`. It embeds component source code into generated registry files, applies a `tw-` Tailwind prefix for Bootstrap compatibility, and copies components into user projects.
3. **`packages/mcp`** (`myoperator-mcp`) — MCP server providing component metadata to AI assistants via stdio transport.

**Data flow**: Source components → `components.yaml` defines metadata → `generate-registry.js` reads YAML + source files → produces `registry-*.ts` files with embedded code → `tsup` bundles CLI → consumers get prefixed components.

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
```

## Component Change Workflow

**ALWAYS follow this when modifying components:**

1. `cd packages/cli && npm run integrity:snapshot` — Before changes
2. Edit ONLY the specified component in `src/components/ui/`
3. `node scripts/check-integrity.js verify <component-name>` — After changes
4. `npm run build` — Build and validate

**Rules**: One component at a time. Don't edit registry files directly (auto-generated). Don't modify unrelated components.

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

## Theming — CSS Variables

Use semantic tokens, not hardcoded colors:

```tsx
// Correct
className="bg-background text-foreground border-border"
className="bg-primary text-primary-foreground"
className="bg-destructive text-destructive-foreground"

// Wrong
className="bg-[#343E55] text-white"
```

Tokens: `background/foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`.

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

# MCP package
cd packages/mcp
npm version patch
npm run build
npm publish
```
