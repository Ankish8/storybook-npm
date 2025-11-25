# myOperator UI - Claude Instructions

## Project Structure

```
src/components/ui/     # Source components (badge, button, table, tag, dropdown-menu)
packages/cli/          # NPM CLI package (myoperator-ui)
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

## Publishing Workflow

```bash
cd packages/cli
npm run integrity:snapshot          # Snapshot before changes
# ... make changes ...
node scripts/check-integrity.js verify button  # Verify (replace 'button' with component name)
npm version patch                   # Bump version
npm run build                       # Build (regenerates registry)
npm publish                         # Publish to npm
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
