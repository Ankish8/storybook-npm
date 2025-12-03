# myOperator UI - Claude Instructions

**IMPORTANT: Never add "Co-Authored-By: Claude" or "Generated with Claude Code" to commit messages.**

## Project Structure

```
src/components/ui/           # Source components (badge, button, table, tag, dropdown-menu)
src/components/ui/__tests__/ # Component tests (REQUIRED for all components)
packages/cli/                # NPM CLI package (myoperator-ui)
scripts/                     # Development scripts (including component generator)
```

## CRITICAL: Safe Component Update Workflow

**ALWAYS follow this workflow when modifying components:**

```bash
cd packages/cli

# 1. BEFORE changes - create snapshot
npm run integrity:snapshot

# 2. Make changes to ONLY the specified component

# 3. AFTER changes - verify integrity
node scripts/check-integrity.js verify <component-name>

# 4. Only if check PASSES, build and publish
npm run build
npm publish
```

## Rules for Component Changes

1. **ONE component at a time** - Never modify multiple components unless explicitly asked
2. **Run integrity check** - Always verify only intended component changed
3. **Don't touch other files** - registry.ts is auto-generated, don't edit directly
4. **Preserve imports** - Components use `@/lib/utils` (transformed to `../../lib/utils` during build)
5. **Tests are REQUIRED** - Every component MUST have a corresponding test file
6. **Stories are REQUIRED** - Every component MUST have a corresponding story file

## NPM Automation Token

For publishing without 2FA OTP, use the automation token stored in `~/.npmrc` or set `NPM_TOKEN` environment variable.

## Publishing Workflow

```bash
cd packages/cli
npm run integrity:snapshot          # Snapshot before changes
# ... make changes ...
node scripts/check-integrity.js verify button  # Verify (replace 'button' with component name)
npm version patch                   # Bump version
npm run build                       # Build (regenerates registry)
npm publish                         # Publish to npm (requires ~/.npmrc with auth token)
git add . && git commit && git push # Commit changes
```

## Key Files

| File | Purpose |
|------|---------|
| `src/components/ui/*.tsx` | Source components - EDIT THESE |
| `packages/cli/scripts/generate-registry.js` | Auto-generates registry from source |
| `packages/cli/scripts/check-integrity.js` | Verifies only intended changes |
| `packages/cli/src/commands/update.ts` | User-facing update command |

## Component Template

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva("base-classes", {
  variants: { /* ... */ },
  defaultVariants: { /* ... */ },
})

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(componentVariants({ variant, className }))} {...props} />
  )
)
Component.displayName = "Component"

export { Component, componentVariants }
```

## If Integrity Check Fails

```bash
# See what changed
git diff src/components/ui/

# Revert unintended changes
git checkout src/components/ui/<file>.tsx

# Or if all changes were intentional, update snapshot
npm run integrity:snapshot
```

## CRITICAL: Creating New Components

**ALWAYS use the component generator to create new components:**

```bash
node scripts/create-component.js <component-name> "<description>"

# Example:
node scripts/create-component.js avatar "A circular avatar component for displaying user images"
```

This automatically creates:
- `src/components/ui/<name>.tsx` - Component file
- `src/components/ui/__tests__/<name>.test.tsx` - Test file (REQUIRED)
- `src/components/ui/<name>.stories.tsx` - Storybook story
- Updates `packages/cli/scripts/generate-registry.js` with metadata

**DO NOT create components manually without these files.**

## Required Test Coverage

Every component test file MUST include tests for:

1. **Renders correctly** - Basic render test with children
2. **All variants** - Test each variant has correct classes
3. **All sizes** - Test each size has correct classes
4. **Custom className** - Verify custom classes are applied
5. **Ref forwarding** - Verify ref is forwarded to DOM element
6. **Accessibility** - Test ARIA attributes if applicable

Example test structure:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Component } from '../component'

describe('Component', () => {
  it('renders children correctly', () => {
    render(<Component>Content</Component>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it.each([
    ['default', 'expected-class'],
    ['primary', 'expected-class'],
  ] as const)('renders %s variant', (variant, expectedClass) => {
    render(<Component variant={variant} data-testid="el">Test</Component>)
    expect(screen.getByTestId('el')).toHaveClass(expectedClass)
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Component ref={ref}>Test</Component>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
```

## Test Assertions Must Match Component Code

**CRITICAL:** Test assertions must match the ACTUAL classes in the component:

- If component uses `py-2.5 px-4` for default size, test for `py-2.5` and `px-4`
- If component uses `bg-destructive` (not `bg-[#ef4444]`), test for `bg-destructive`
- Always read the component file before writing/updating tests

## Hardcoded Colors - DO NOT CHANGE

Colors are intentionally hardcoded (e.g., `bg-[#343E55]`) for Bootstrap compatibility.
**NEVER** change these to CSS variables or Tailwind theme tokens.

## Running Tests

```bash
# Run all component tests
npm test

# Run CLI tests
cd packages/cli && npm test

# Watch mode
npm run test:watch
```
