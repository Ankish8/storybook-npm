# Component Development Guide

This guide documents the patterns and requirements for adding new components to myOperator UI CLI.

## Key Learnings from Button Component

### 1. Hardcode Colors (No Semantic Classes)

**Don't use semantic color classes** like `bg-primary`, `bg-destructive`, `text-destructive-foreground` because they require theme configuration that may not exist in user projects.

**Do use hardcoded colors:**
```tsx
// Good - works everywhere
default: "bg-[#343E55] text-white hover:bg-[#343E55]/90",
destructive: "bg-[#ef4444] text-white hover:bg-[#ef4444]/90",

// Bad - requires theme setup
default: "bg-primary text-primary-foreground hover:bg-primary/90",
destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
```

### 2. Explicit Heights for Bootstrap Compatibility

Bootstrap overrides default button padding/sizing. Always use explicit heights:

```tsx
size: {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
},
```

### 3. Reset Bootstrap Default Borders

Bootstrap adds borders to buttons. Add `border-0` to variants that shouldn't have borders:

```tsx
variant: {
  default: "bg-[#343E55] text-white border-0 hover:bg-[#343E55]/90",
  destructive: "bg-[#ef4444] text-white border-0 hover:bg-[#ef4444]/90",
  outline: "border border-[#343E55] bg-transparent...", // Keep border here
  secondary: "bg-[#343E55]/20 text-[#343E55] border-0 hover:bg-[#343E55]/30",
  ghost: "border-0 hover:bg-[#343E55]/10 hover:text-[#343E55]",
  link: "text-[#343E55] border-0 underline-offset-4 hover:underline",
},
```

### 4. Focus Ring Colors

Use hardcoded focus ring color instead of semantic:

```tsx
// Good
"focus-visible:ring-[#1e293b]"

// Bad - requires --ring CSS variable
"focus-visible:ring-ring"
```

## Adding a New Component

### Step 1: Add to Registry

Edit `src/utils/registry.ts`:

```typescript
export async function getRegistry(prefix: string = ''): Promise<Registry> {
  const buttonContent = prefixTailwindClasses(`...`, prefix)

  // Add your new component
  const inputContent = prefixTailwindClasses(`import * as React from "react"
import { cn } from "@/lib/utils"

// Your component code here...
`, prefix)

  return {
    button: {
      name: 'button',
      description: 'A customizable button component...',
      dependencies: [...],
      files: [{ name: 'button.tsx', content: buttonContent }],
    },
    // Add your component
    input: {
      name: 'input',
      description: 'A styled input component',
      dependencies: ['clsx', 'tailwind-merge'],
      files: [{ name: 'input.tsx', content: inputContent }],
    },
  }
}
```

### Step 2: Component Structure

Follow this pattern:

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement> {
  // Custom props
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <element
        className={cn(
          "base-classes here",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"

export { Component }
```

### Step 3: Class Name Rules

1. **Use hardcoded colors**: `bg-[#343E55]`, `text-[#ef4444]`
2. **Explicit dimensions**: `h-10`, `w-full`
3. **Reset browser/Bootstrap defaults**: `border-0`, `outline-none`
4. **Hardcoded focus states**: `focus-visible:ring-[#1e293b]`

### Step 4: Dependencies

Only include packages actually used by the component:

```typescript
dependencies: [
  'clsx',           // Always needed for cn()
  'tailwind-merge', // Always needed for cn()
  // Add others as needed:
  '@radix-ui/react-slot',  // For asChild pattern
  'class-variance-authority', // For cva variants
  'lucide-react',  // For icons
],
```

### Step 5: Test in Both Environments

1. **Standalone project** (with Tailwind Preflight)
2. **Bootstrap project** (without Preflight)

Check for:
- Correct sizing
- No unwanted borders
- Colors display correctly
- Focus states work
- Hover states work

## Color Palette

Use these hardcoded colors for consistency:

| Usage | Color | Class |
|-------|-------|-------|
| Primary | Dark blue-gray | `bg-[#343E55]` |
| Primary hover | | `hover:bg-[#343E55]/90` |
| Destructive | Red | `bg-[#ef4444]` |
| Text on primary | White | `text-white` |
| Focus ring | Dark | `ring-[#1e293b]` |
| Secondary bg | Light gray | `bg-[#343E55]/20` |

## Prefixing

The `prefixTailwindClasses` function automatically handles prefixing for Tailwind v3 projects that use a prefix. Your component code should use unprefixed classes.

**Important**: The function skips:
- Import paths (strings with `/` or starting with `@`/`.`)
- npm package names (e.g., `class-variance-authority`)
- Simple identifiers without class-like characters

## Common Patterns

### Using cva (class-variance-authority)

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "variant-classes",
      },
      size: {
        default: "size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface Props extends VariantProps<typeof componentVariants> {}
```

### Using Radix Slot (asChild pattern)

```tsx
import { Slot } from "@radix-ui/react-slot"

interface Props {
  asChild?: boolean
}

const Component = ({ asChild, ...props }) => {
  const Comp = asChild ? Slot : "button"
  return <Comp {...props} />
}
```

## Checklist for New Components

- [ ] Hardcoded colors (no semantic classes)
- [ ] Explicit heights/widths where needed
- [ ] `border-0` on elements that shouldn't have borders
- [ ] Hardcoded focus ring color
- [ ] `cn()` for className merging
- [ ] `forwardRef` for DOM access
- [ ] `displayName` set
- [ ] Dependencies listed correctly
- [ ] Tested in standalone project
- [ ] Tested in Bootstrap project
- [ ] Added to registry with description

## Publishing

After adding a component:

```bash
npm run build
npm version patch
npm publish
```

Then test:
```bash
npx --yes myoperator-ui@latest add your-component
```
