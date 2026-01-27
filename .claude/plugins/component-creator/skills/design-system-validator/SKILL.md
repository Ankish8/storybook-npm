---
name: Design System Validator
description: Ensures CSS variables are used instead of hardcoded colors, validates semantic tokens, checks responsive design patterns, and enforces design system consistency. Activate when creating or validating components.
version: 1.0.0
---

# Design System Validator Skill

This skill enforces design system consistency by validating CSS variable usage, responsive design patterns, and accessibility standards.

## When to Activate

Activate this skill when:
- Creating a new component
- Reviewing component code
- Mapping Figma designs to code
- Validating color usage
- Checking responsive patterns
- Ensuring accessibility compliance

## Validation Rules

### 1. CSS Variable Enforcement

**Rule: NEVER use hardcoded color values**

Prohibited patterns:
```tsx
// ❌ WRONG - Hardcoded hex colors
className="bg-[#343E55] text-[#FFFFFF]"

// ❌ WRONG - Hardcoded RGB/HSL
className="bg-[rgb(52,62,85)] text-[hsl(0,0%,100%)]"

// ❌ WRONG - Hardcoded named colors
className="bg-white text-black"

// ❌ WRONG - Hardcoded Tailwind colors
className="bg-gray-50 text-gray-900"
```

Required patterns:
```tsx
// ✅ CORRECT - Semantic CSS variables
className="bg-primary text-primary-foreground"
className="bg-semantic-bg-primary text-semantic-text-primary"
className="border-semantic-border-layout"
```

### 2. CSS Variable Mapping

Map all colors to appropriate semantic tokens:

#### Core Tokens (from shadcn/ui)

| Color Context | CSS Variable | Tailwind Class | Usage |
|--------------|--------------|----------------|--------|
| **Backgrounds** |
| Page background | `--background` | `bg-background` | Main page background |
| Foreground text | `--foreground` | `text-foreground` | Primary text on background |
| Card background | `--card` | `bg-card` | Raised surfaces |
| Card text | `--card-foreground` | `text-card-foreground` | Text on cards |
| Popover background | `--popover` | `bg-popover` | Floating elements |
| Popover text | `--popover-foreground` | `text-popover-foreground` | Text on popovers |
| **Actions** |
| Primary background | `--primary` | `bg-primary` | Primary buttons |
| Primary text | `--primary-foreground` | `text-primary-foreground` | Text on primary |
| Secondary background | `--secondary` | `bg-secondary` | Secondary buttons |
| Secondary text | `--secondary-foreground` | `text-secondary-foreground` | Text on secondary |
| Muted background | `--muted` | `bg-muted` | Disabled states |
| Muted text | `--muted-foreground` | `text-muted-foreground` | Muted/disabled text |
| Accent background | `--accent` | `bg-accent` | Accent highlights |
| Accent text | `--accent-foreground` | `text-accent-foreground` | Text on accent |
| Destructive background | `--destructive` | `bg-destructive` | Error/delete actions |
| Destructive text | `--destructive-foreground` | `text-destructive-foreground` | Text on destructive |
| **Borders & Inputs** |
| Border color | `--border` | `border-border` | Standard borders |
| Input border | `--input` | `border-input` | Input field borders |
| Ring color | `--ring` | `ring-ring` | Focus rings |

#### Semantic Tokens (myOperator-specific)

| Context | CSS Variable | Tailwind Class | Usage |
|---------|--------------|----------------|--------|
| **Backgrounds** |
| Primary | `--semantic-bg-primary` | `bg-semantic-bg-primary` | Component backgrounds |
| Secondary | `--semantic-bg-secondary` | `bg-semantic-bg-secondary` | Alternative backgrounds |
| Subtle | `--semantic-bg-subtle` | `bg-semantic-bg-subtle` | Hover/selected states |
| **Text** |
| Primary | `--semantic-text-primary` | `text-semantic-text-primary` | Main text content |
| Secondary | `--semantic-text-secondary` | `text-semantic-text-secondary` | Supporting text |
| Muted | `--semantic-text-muted` | `text-semantic-text-muted` | Disabled/placeholder |
| Link | `--semantic-text-link` | `text-semantic-text-link` | Interactive links |
| **Borders** |
| Layout | `--semantic-border-layout` | `border-semantic-border-layout` | Container borders |
| Input | `--semantic-border-input` | `border-semantic-border-input` | Form field borders |
| Focus | `--semantic-border-focus` | `border-semantic-border-focus` | Focus indicators |
| **States** |
| Error primary | `--semantic-error-primary` | `text-semantic-error-primary` | Error messages |
| Error subtle | `--semantic-error-subtle` | `bg-semantic-error-subtle` | Error backgrounds |
| Success primary | `--semantic-success-primary` | `text-semantic-success-primary` | Success messages |
| Success subtle | `--semantic-success-subtle` | `bg-semantic-success-subtle` | Success backgrounds |
| Warning primary | `--semantic-warning-primary` | `text-semantic-warning-primary` | Warning messages |
| Warning subtle | `--semantic-warning-subtle` | `bg-semantic-warning-subtle` | Warning backgrounds |
| **Info** |
| Info primary | `--semantic-info-primary` | `text-semantic-info-primary` | Informational messages |
| Info subtle | `--semantic-info-subtle` | `bg-semantic-info-subtle` | Informational backgrounds |

### 3. Color Mapping from Figma

When extracting colors from Figma, map them to semantic tokens:

**Mapping algorithm:**

1. **Identify color purpose** from context:
   - Button background → `bg-primary` or `bg-secondary`
   - Text color → `text-foreground`, `text-primary-foreground`, or semantic text token
   - Border → `border-border`, `border-input`, or semantic border token
   - Background → `bg-background`, `bg-card`, or semantic bg token

2. **Match to existing tokens** by usage pattern:
   ```
   Figma: #343E55 (dark blue) → Used for primary button
   Mapping: bg-primary (primary action color)

   Figma: #F3F4F6 (light gray) → Used for disabled state
   Mapping: bg-muted (disabled/inactive state)

   Figma: #EF4444 (red) → Used for error text
   Mapping: text-destructive or text-semantic-error-primary
   ```

2b. **Verify token existence via codebase grep** (MANDATORY):
   - Before using any CSS variable token, search `src/index.css` for the actual variable definition
   - This prevents using tokens that don't exist or have different names than expected
   ```bash
   # Verify a semantic token exists
   grep "--semantic-success-primary" src/index.css

   # If not found, search for alternatives
   grep "success" src/index.css
   ```
   - **Common pitfalls**:
     - Figma may use naming like "success/primary" but the CSS variable may be `--semantic-success-primary` or just `--success`
     - Info-level tokens (blue/informational) may use `--semantic-info-primary` — always verify
     - Some tokens exist in `:root` (light) but not `[data-theme="dark"]` (dark) — check both
   - If a required token doesn't exist, document it and use the closest available token

3. **Document custom mappings**:
   If a color doesn't match existing tokens, document it:
   ```tsx
   // Note: Figma uses #4275D6 for links
   // Mapped to: text-semantic-text-link
   className="text-semantic-text-link"
   ```

### 4. Responsive Design Validation

**Rule: Components must be mobile-first and responsive**

Required patterns:

```tsx
// ✅ CORRECT - Mobile-first responsive padding
className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4"

// ✅ CORRECT - Responsive text sizes
className="text-sm md:text-base lg:text-lg"

// ✅ CORRECT - Responsive layout
className="flex flex-col sm:flex-row gap-2 sm:gap-4"

// ✅ CORRECT - Responsive visibility
className="hidden md:block"
```

**Breakpoint reference:**
- `sm`: 640px - Small tablets
- `md`: 768px - Tablets
- `lg`: 1024px - Laptops
- `xl`: 1280px - Desktops
- `2xl`: 1536px - Large desktops

**Validation checklist:**
- [ ] Padding scales responsively
- [ ] Text sizes adjust for readability
- [ ] Layout adapts for small screens
- [ ] Touch targets are at least 44px on mobile
- [ ] Horizontal scrolling is avoided

### 5. Typography Validation

**Rule: Use semantic typography tokens**

```tsx
// ✅ CORRECT - Semantic font sizes
className="text-sm"      // 14px - Small text, captions
className="text-base"    // 16px - Default body text
className="text-lg"      // 18px - Large body text
className="text-xl"      // 20px - Headings
className="text-2xl"     // 24px - Section headers

// ✅ CORRECT - Font weights
className="font-normal"     // 400 - Body text
className="font-medium"     // 500 - Emphasized text
className="font-semibold"   // 600 - Headings
className="font-bold"       // 700 - Strong emphasis

// ✅ CORRECT - Line heights
className="leading-none"     // 1 - Tight spacing
className="leading-tight"    // 1.25 - Headings
className="leading-normal"   // 1.5 - Body text
className="leading-relaxed"  // 1.625 - Comfortable reading

// ✅ CORRECT - Letter spacing
className="tracking-tight"   // -0.025em
className="tracking-normal"  // 0em
className="tracking-wide"    // 0.025em
```

**Typography table format for Storybook:**
```markdown
## Typography

| Element | Font Size | Line Height | Weight | Letter Spacing |
|---------|-----------|-------------|--------|----------------|
| Title | 16px (`text-base`) | 24px (`leading-6`) | 600 (`font-semibold`) | 0px (`tracking-[0px]`) |
| Description | 14px (`text-sm`) | 20px (`leading-relaxed`) | 400 (`font-normal`) | 0.035px (`tracking-[0.035px]`) |
```

### 6. Accessibility Validation

**Rule: Components must meet WCAG 2.1 AA standards**

Required checks:

**Color Contrast:**
```tsx
// ✅ CORRECT - Sufficient contrast
className="bg-primary text-primary-foreground"  // Ensures contrast
className="bg-background text-foreground"       // Theme-aware contrast

// ❌ WRONG - Potentially low contrast
className="bg-gray-100 text-gray-300"  // May fail contrast check
```

**Focus States:**
```tsx
// ✅ CORRECT - Visible focus indicator
className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

// ✅ CORRECT - Focus-visible for keyboard only
className="focus-visible:ring-2 focus-visible:ring-ring"
```

**Keyboard Navigation:**
```tsx
// ✅ CORRECT - Keyboard accessible
<button onClick={...}>  // Inherently keyboard accessible

// ✅ CORRECT - Custom interactive element with keyboard support
<div role="button" tabIndex={0} onKeyDown={handleKeyPress} onClick={...}>

// ❌ WRONG - Not keyboard accessible
<div onClick={...}>  // Missing role and tabIndex
```

**ARIA Attributes:**
```tsx
// ✅ CORRECT - Proper ARIA labels
<button aria-label="Close dialog">
<input aria-invalid={hasError} aria-describedby="error-message">
<div role="alert" aria-live="polite">

// ✅ CORRECT - Form field associations
<label htmlFor="email">Email</label>
<input id="email" name="email">
```

## Validation Workflow

### Step 1: Scan Component Code

Search for prohibited patterns:

```bash
# Check for hardcoded hex colors
grep -r "#[0-9A-Fa-f]\{3,6\}" src/components/ui/component.tsx

# Check for RGB/HSL values
grep -r "rgb\|hsl" src/components/ui/component.tsx

# Check for hardcoded Tailwind colors
grep -r "bg-\(gray\|red\|blue\|green\|yellow\)-[0-9]" src/components/ui/component.tsx
```

### Step 2: Map to Semantic Tokens

For each color found, provide mapping:

```
Found: bg-[#343E55]
Context: Primary button background
Suggested mapping: bg-primary

Found: text-[#FFFFFF]
Context: Text on primary button
Suggested mapping: text-primary-foreground

Found: border-[#E4E4E4]
Context: Container border
Suggested mapping: border-semantic-border-layout
```

### Step 3: Validate Responsive Design

Check for responsive classes:

```tsx
// Check padding is responsive
✓ Found: px-4 sm:px-6 lg:px-8
✓ Found: py-2 sm:py-3

// Check text sizing is responsive
✓ Found: text-sm md:text-base

// Check layout is responsive
✓ Found: flex-col sm:flex-row
```

### Step 4: Validate Accessibility

```tsx
// Check focus states
✓ Found: focus:ring-2 focus:ring-ring

// Check ARIA labels
✓ Found: aria-label="Close"

// Check keyboard support
✓ Found: onKeyDown handler for custom interactive element
```

### Step 5: Generate Validation Report

```markdown
# Design System Validation Report

## CSS Variables
✅ All colors use semantic tokens
- bg-primary, text-primary-foreground
- border-semantic-border-layout
- text-semantic-text-muted

## Responsive Design
✅ Mobile-first breakpoints used
- Padding: px-4 sm:px-6 lg:px-8
- Text: text-sm md:text-base
- Layout: flex-col sm:flex-row

## Typography
✅ Semantic typography tokens
- Font sizes: text-sm, text-base
- Weights: font-normal, font-semibold
- Line heights: leading-normal, leading-relaxed

## Accessibility
✅ WCAG 2.1 AA compliant
- Focus states: focus:ring-2
- ARIA labels: aria-label present
- Keyboard: onKeyDown handlers

## Issues Found
❌ Hardcoded color at line 45: bg-[#F3F4F6]
   Suggested fix: bg-muted

## Recommendations
- Replace bg-[#F3F4F6] with bg-muted
- Add responsive padding to container
- Consider adding aria-describedby for error states
```

## Color Mapping Examples

### Example 1: Button Component

**Figma Design:**
- Default: #F3F4F6 background, #333333 text
- Primary: #343E55 background, #FFFFFF text
- Destructive: #EF4444 background, #FFFFFF text

**CSS Variable Mapping:**
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",       // #F3F4F6 → bg-secondary
        primary: "bg-primary text-primary-foreground",           // #343E55 → bg-primary
        destructive: "bg-destructive text-destructive-foreground", // #EF4444 → bg-destructive
      },
    },
  }
)
```

### Example 2: Alert Component

**Figma Design:**
- Error: #FEE2E2 background, #B42318 text, #EF4444 border
- Success: #DCFCE7 background, #15803D text, #22C55E border
- Warning: #FEF3C7 background, #92400E text, #F59E0B border

**CSS Variable Mapping:**
```tsx
const alertVariants = cva(
  "rounded-lg border p-4",
  {
    variants: {
      variant: {
        destructive: "bg-semantic-error-subtle text-semantic-error-primary border-destructive",
        success: "bg-semantic-success-subtle text-semantic-success-primary border-success",
        warning: "bg-semantic-warning-subtle text-semantic-warning-primary border-warning",
      },
    },
  }
)
```

### Example 3: Form Input

**Figma Design:**
- Border: #E4E4E4 (normal), #4275D6 (focus), #B42318 (error)
- Background: #FFFFFF
- Text: #333333
- Placeholder: #9CA3AF

**CSS Variable Mapping:**
```tsx
const inputVariants = cva(
  "flex h-10 w-full rounded-md px-3 py-2",
  "bg-background text-foreground",                    // Background & text
  "border border-input",                              // Normal border
  "placeholder:text-muted-foreground",                // Placeholder
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", // Focus
  "disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "border-input",
        error: "border-semantic-error-primary",        // Error border
        success: "border-semantic-success-primary",
      },
    },
  }
)
```

## Best Practices

1. **Always use semantic tokens** - Enables theme switching (dark mode)
2. **Document color mappings** - Help future maintainers understand choices
3. **Validate against Figma** - Ensure visual accuracy while using tokens
4. **Test in light/dark themes** - Verify color contrast in both modes
5. **Mobile-first responsive** - Start with mobile, enhance for larger screens
6. **Accessible by default** - Build accessibility in, don't bolt it on

## Error Messages

When validation fails, provide specific, actionable feedback:

```
❌ Hardcoded color detected at line 45

Found:
  className="bg-[#343E55] text-white"

Issue:
  - bg-[#343E55]: Hardcoded hex color
  - text-white: Hardcoded color name

Fix:
  className="bg-primary text-primary-foreground"

Reasoning:
  - #343E55 is the primary brand color → use bg-primary
  - white on primary needs high contrast → use text-primary-foreground
  - Enables automatic theme switching (dark mode)
```

This skill ensures design system consistency, theme compatibility, and accessibility compliance across all components.
