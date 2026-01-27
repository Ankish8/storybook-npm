---
name: Component Analysis
description: Analyzes codebase to check if component exists, suggests creating variants vs new components, and identifies reusable subcomponents. Activate when creating new components to avoid duplication and ensure proper architecture.
version: 1.0.0
---

# Component Analysis Skill

This skill provides intelligent codebase analysis for component creation. It prevents duplication, suggests architectural improvements, and identifies reusable subcomponents.

## When to Activate

Activate this skill when:
- Creating a new component
- User describes a UI element they need
- Analyzing a Figma design
- Planning component architecture
- Deciding between new component vs variant

## Analysis Steps

### 1. Component Existence Check — Deep Discovery

Build a **Component Capability Map** by scanning the entire component library:

**a. Fetch ALL components:**
```
Glob: src/components/ui/*.tsx (exclude __tests__/*, *.stories.tsx)
Glob: src/components/custom/*/*.tsx (exclude __tests__/*, *.stories.tsx)
```

**b. Extract metadata per component** using Grep:
- `export interface.*Props` → props interfaces
- `variants:` blocks → CVA variants and their names
- `export {` or `export const` → public exports

**c. Build and present a Capability Map:**
```
| Component   | Location | Variants              | Key Props                |
|-------------|----------|-----------------------|--------------------------|
| Button      | ui/      | 7 variants, 4 sizes   | onClick, loading, leftIcon |
| Badge       | ui/      | 5 variants            | —                        |
| TextField   | ui/      | —                     | label, error, helperText |
| WalletTopup | custom/  | —                     | amounts, onPay, currency |
```

**d. Match against new component:**
- **Exact match**: `button.tsx` exists → Component exists
- **Similar name**: Looking for `icon-button` → Found `button` → Suggest variant
- **Functionality match**: Looking for `data-table` → Found `table` → Suggest enhancement
- **Semantic similarity**: Compare name AND description against capability map to catch non-obvious overlaps

### 2. Variant vs New Component Decision

Use this decision tree informed by the Capability Map:

**Create a VARIANT when:**
- Component differs only in visual style (colors, sizes)
- Component shares same structure and behavior
- Component uses same props interface
- The Capability Map shows an existing component with matching variants/props
- Example: `button` with `variant="icon"` instead of new `icon-button`

**Create a COMPOSITION when:**
- New component combines multiple existing components
- The Capability Map shows several components that together form the new one
- Example: `user-settings-form` composes `form-modal` + `text-field` + `select-field` + `switch`

**Create a NEW COMPONENT when:**
- Component has different structure or behavior
- Component needs different props interface
- Component serves different purpose
- No existing component in the Capability Map covers its functionality
- Example: `avatar` is different from `badge` despite both being circular

**Recommendation pattern:**
```
Found existing component: `button` at src/components/ui/button.tsx

Capability Map excerpt:
| Component | Variants | Key Props |
|-----------|----------|-----------|
| Button | default, primary, secondary, destructive, outline, ghost, link | onClick, disabled, loading, leftIcon |

Analysis:
- Your "icon-button" differs only in having no text and centered icon
- It shares the same purpose (clickable action)
- It can use the same props (onClick, disabled, etc.)

Recommendation: Add a variant to `button` instead:

variant: {
  default: "...",
  primary: "...",
  icon: "h-10 w-10 p-0 justify-center items-center",  // NEW
}

This maintains consistency and reduces code duplication.
```

### 3. Subcomponent Identification

Analyze the component requirements and identify which existing components can be reused:

**Form Components:**
```
Requirement: "A form with name and email inputs"

Identified subcomponents:
✓ text-field (for name input with label)
✓ text-field (for email input with validation)
✓ button (for submit action)
✓ form-modal (if in a dialog)
✓ alert (for error messages)

Architecture:
- Composite component using existing primitives
- No need to create custom input components
```

**Data Display Components:**
```
Requirement: "A user profile card"

Identified subcomponents:
✓ typography (for name, role, description)
✓ badge (for status indicator)
✓ button (for action buttons)
✓ avatar (if available, else suggest creating)

Architecture:
- Container component with composition
- Uses existing UI primitives
```

**Overlay Components:**
```
Requirement: "A confirmation dialog with form"

Identified subcomponents:
✓ form-modal (provides dialog + form layout)
✓ text-field (for input fields)
✓ button (already included in form-modal)

Architecture:
- Use form-modal as base
- Add custom content inside
```

### 4. Component Category Detection

Determine the appropriate category for components.yaml:

| Category | When to Use | Examples |
|----------|-------------|----------|
| `core` | Essential UI primitives | button, badge, typography |
| `form` | Form inputs and controls | input, select, checkbox, switch, text-field |
| `data` | Data display components | table, list, data-grid |
| `overlay` | Popups, modals, menus | dialog, dropdown-menu, tooltip, form-modal |
| `feedback` | Status and notifications | tag, alert, toast |
| `layout` | Layout and structure | accordion, page-header, tabs |
| `custom` | Multi-file complex components | event-selector, key-value-input |

### 5. Dependency Analysis

Identify all dependencies for the component:

**External dependencies:**
```yaml
dependencies:
  - "class-variance-authority"  # If using CVA
  - "clsx"  # If using cn()
  - "tailwind-merge"  # If using cn()
  - "lucide-react"  # If using icons
  - "@radix-ui/react-dialog@^1.1.15"  # If using Dialog
  - "@radix-ui/react-select@^2.2.6"  # If using Select
```

**Internal dependencies (other components):**
```yaml
internalDependencies:
  - button  # If using Button component
  - input  # If using Input component
  - dialog  # If using Dialog component
```

### 6. Multi-File Structure Detection

Determine if component needs multiple files:

**Single file components:**
- Simple primitives (Button, Badge, Input)
- No internal state management
- No complex sub-structures

**Multi-file components:**
- Complex components with subcomponents (EventSelector, KeyValueInput)
- Shared types across files
- Multiple related components that work together

**Multi-file structure:**
```
src/components/custom/component-name/
├── component-name.tsx          # Main component (exported)
├── component-subpart.tsx       # Internal subcomponent
├── types.ts                    # Shared types
├── utils.ts                    # Helper functions
└── index.ts                    # Public exports
```

## Analysis Output Format

Provide analysis in this structured format:

```markdown
# Component Analysis: [ComponentName]

## Existence Check
- ❌ Component does not exist
- ✅ Similar component found: `button` at src/components/ui/button.tsx

## Recommendation
[CREATE VARIANT / CREATE NEW COMPONENT]

**Reasoning:**
[Explanation of decision]

## Identified Subcomponents

| Component | Location | Usage |
|-----------|----------|-------|
| text-field | src/components/ui/text-field.tsx | For labeled input fields |
| button | src/components/ui/button.tsx | For submit action |
| alert | src/components/ui/alert.tsx | For validation errors |

## Component Details

**Type:** [UI / Custom]
**Category:** [core / form / data / overlay / feedback / layout]
**Structure:** [Single file / Multi-file]

**Dependencies:**
- External: class-variance-authority, clsx, tailwind-merge
- Internal: button, text-field, alert

## Suggested Architecture

```tsx
// Main component using identified subcomponents
import { Button } from "./button"
import { TextField } from "./text-field"
import { Alert } from "./alert"

const Component = () => {
  return (
    <div>
      <TextField label="Name" />
      <TextField label="Email" type="email" />
      {error && <Alert variant="destructive">{error}</Alert>}
      <Button type="submit">Submit</Button>
    </div>
  )
}
```

## Next Steps
1. Confirm architecture with user
2. Gather design context (Figma or manual)
3. Map colors to CSS variables
4. Generate component files
5. Create tests and stories
```

## Examples

### Example 1: Suggest Variant

**Input:** User wants to create "outlined-button"

**Analysis:**
```markdown
# Component Analysis: OutlinedButton

## Existence Check
✅ Found: `button` at src/components/ui/button.tsx

## Recommendation
CREATE VARIANT

**Reasoning:**
The existing `button` component already has an `outline` variant:
```tsx
variant: {
  default: "bg-primary text-primary-foreground",
  outline: "border border-input bg-background",  // Already exists!
  // ...
}
```

**Action:** Use existing `<Button variant="outline">` instead of creating new component.
```

### Example 2: Create New Component

**Input:** User wants to create "avatar" component

**Analysis:**
```markdown
# Component Analysis: Avatar

## Existence Check
❌ Component does not exist
✅ Similar: `badge` (circular shape) at src/components/ui/badge.tsx

## Recommendation
CREATE NEW COMPONENT

**Reasoning:**
While `badge` is circular, `avatar` serves a different purpose:
- Avatar displays user images with fallback
- Badge shows status indicators
- Different props (src, alt, fallback vs children)
- Different behavior (image loading vs static content)

## Identified Subcomponents
None - This is a primitive component

## Component Details
**Type:** UI
**Category:** core
**Structure:** Single file

**Dependencies:**
- External: class-variance-authority, clsx, tailwind-merge
- Internal: None

## Suggested Architecture
```tsx
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: { size: "md" },
  }
)

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}
```
```

### Example 3: Identify Subcomponents

**Input:** User wants to create "user-settings-form"

**Analysis:**
```markdown
# Component Analysis: UserSettingsForm

## Existence Check
❌ Component does not exist

## Recommendation
CREATE NEW COMPONENT (Custom)

**Reasoning:**
This is an application-specific form, not a reusable primitive.
Should be created in `src/components/custom/`.

## Identified Subcomponents

| Component | Location | Usage |
|-----------|----------|-------|
| form-modal | src/components/ui/form-modal.tsx | Modal wrapper with save/cancel |
| text-field | src/components/ui/text-field.tsx | Name, email, phone inputs |
| select-field | src/components/ui/select-field.tsx | Timezone, language selects |
| switch | src/components/ui/switch.tsx | Notification toggles |
| button | src/components/ui/button.tsx | Included in form-modal |
| alert | src/components/ui/alert.tsx | Error/success messages |

## Component Details
**Type:** Custom
**Category:** custom
**Structure:** Single file (uses composition)

**Dependencies:**
- External: clsx, tailwind-merge
- Internal: form-modal, text-field, select-field, switch, alert

## Suggested Architecture
```tsx
import { FormModal } from "@/components/ui/form-modal"
import { TextField } from "@/components/ui/text-field"
import { SelectField } from "@/components/ui/select-field"
import { Switch } from "@/components/ui/switch"
import { Alert } from "@/components/ui/alert"

const UserSettingsForm = ({ open, onOpenChange }) => {
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="User Settings"
      onSave={handleSave}
    >
      <TextField label="Name" />
      <TextField label="Email" type="email" />
      <SelectField label="Timezone" options={timezones} />
      <Switch label="Email notifications" />
      {error && <Alert variant="destructive">{error}</Alert>}
    </FormModal>
  )
}
```
```

## Best Practices

1. **Always search before suggesting creation** - Avoid duplication
2. **Prefer variants over new components** - Maintain consistency
3. **Identify ALL reusable subcomponents** - Don't reinvent the wheel
4. **Consider component category** - Organize properly
5. **Analyze dependencies** - Keep dependency tree clean
6. **Suggest multi-file structure when needed** - For complex components

## Error Handling

- **No similar component found** → Safe to create new component
- **Multiple similar components** → Present options to user
- **Unclear if variant or new** → Ask user for clarification
- **Missing dependency** → Note in analysis and suggest adding

This skill ensures component library consistency, prevents duplication, and promotes proper architecture patterns.
