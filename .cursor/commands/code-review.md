# Code Review

Review recently created or modified components for quality, consistency, and design system compliance.

## What to Review

Identify which component files were recently created or modified. If the user specifies a component, review that one. Otherwise, check git status for recently changed files.

## Review Checklist

### 1. Design Token Compliance

Search for hardcoded colors in the component file:
- Any `#hex` values (e.g., `#343E55`, `#FFFFFF`)
- Any raw Tailwind colors (e.g., `bg-gray-50`, `text-red-500`, `bg-white`, `text-black`)
- Any `rgb()` or `hsl()` values

All colors MUST use semantic tokens like `bg-semantic-primary`, `text-semantic-text-muted`, `border-semantic-border-layout`.

### 2. Component Pattern Compliance

Verify the component follows the standard pattern:
- [ ] Uses `React.forwardRef` with proper TypeScript generics
- [ ] Has `displayName` set
- [ ] Uses CVA (`cva()`) for variant definitions
- [ ] Uses `cn()` from `@/lib/utils` for className merging
- [ ] Exports both the component AND variants
- [ ] Props interface extends `React.HTMLAttributes`
- [ ] Spreads `...props` to root element
- [ ] `defaultVariants` is defined in CVA

### 3. Import Path Rules

- UI components use `@/lib/utils` (transformed by CLI build)
- Custom components use relative paths (`../../ui/button`, `../../../lib/utils`)
- NO `@/components/ui/` imports in custom components

### 4. Test Coverage

Check the corresponding test file:
- [ ] Test file exists at `__tests__/{component}.test.tsx`
- [ ] Tests for basic rendering
- [ ] Tests for ALL variants (using `it.each`)
- [ ] Tests for ALL sizes (using `it.each`)
- [ ] Tests for custom className merging
- [ ] Tests for ref forwarding
- [ ] Tests for additional props (data-testid, aria-*)
- [ ] Test assertions use ACTUAL classes from the component (not guessed)

### 5. Storybook Coverage

Check the story file:
- [ ] Story file exists at `{component}.stories.tsx`
- [ ] Has `tags: ["autodocs"]`
- [ ] Has installation command in docs description
- [ ] Has design tokens table
- [ ] Has stories for all variants and sizes
- [ ] Has `argTypes` for interactive controls

### 6. Registry Entry

Check `packages/cli/components.yaml`:
- [ ] Component is listed
- [ ] Description is clear and accurate
- [ ] Category is correct
- [ ] Dependencies are listed
- [ ] Internal dependencies listed (if using other components)

### 7. Accessibility

- [ ] Interactive elements have proper ARIA attributes
- [ ] Focus states use `focus-visible:ring-2 focus-visible:ring-semantic-primary`
- [ ] Keyboard navigation supported
- [ ] Color contrast sufficient (semantic token pairs guarantee this)

## Report Format

Present findings grouped by severity:

**Issues (must fix before publishing):**
- List critical issues like hardcoded colors, missing forwardRef, missing tests

**Warnings (should fix):**
- List non-critical issues like missing accessibility attributes, incomplete stories

**Passed:**
- Confirm what checks passed

If issues are found, offer to fix them.
