---
name: Storybook Generator
description: Generates comprehensive Storybook stories following the Button/AlertConfiguration pattern with installation instructions, design tokens table, typography table, and usage examples. Activate when creating component documentation.
version: 1.0.0
---

# Storybook Generator Skill

This skill generates comprehensive, consistent Storybook documentation for components following established patterns in the myOperator UI library.

## When to Activate

Activate this skill when:
- Creating a new component
- Updating component documentation
- Adding usage examples
- Documenting design tokens
- Creating interactive stories

## Documentation Pattern

Follow the Button and AlertConfiguration component documentation structure:

### Required Sections

1. **Installation** - CLI command for users
2. **Import** - How to import the component
3. **Design Tokens** - Table of CSS variables used
4. **Typography** (if applicable) - Font specifications
5. **Usage Examples** - Code snippets
6. **Interactive Stories** - Playground for each variant

## Story File Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Component } from './component'

/**
 * Component description with comprehensive documentation.
 *
 * ## Installation
 *
 * Install via the myOperator UI CLI:
 * ```bash
 * npx myoperator-ui add component-name
 * ```
 *
 * ## Import
 *
 * ```tsx
 * import { Component } from "@myoperator/ui"
 * ```
 *
 * ## Design Tokens
 *
 * [Design tokens table - see examples below]
 *
 * ## Typography (if applicable)
 *
 * [Typography table - see examples below]
 *
 * ## Usage
 *
 * ```tsx
 * <Component variant="primary" size="lg">
 *   Content
 * </Component>
 * ```
 */
const meta: Meta<typeof Component> = {
  // Title depends on component type and sub-group:
  //   UI component:              'Components/ComponentName'
  //   Custom (no sub-group):     'Custom/ComponentName'
  //   Custom (with sub-group):   'Custom/SubGroup/ComponentName'
  title: 'Components/ComponentName',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the component',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Stories...
```

## Design Tokens Table

### Format

The design tokens table must document all CSS variables used in the component:

```markdown
## Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|--------------|-------|---------|
| Background Primary | \`--semantic-bg-primary\` | Component background | <div style="width: 20px; height: 20px; background: var(--semantic-bg-primary); border: 1px solid #ccc;"></div> |
| Text Primary | \`--semantic-text-primary\` | Primary text color | <span style="color: var(--semantic-text-primary);">Aa</span> |
| Border Layout | \`--semantic-border-layout\` | Container borders | <div style="width: 40px; height: 2px; background: var(--semantic-border-layout);"></div> |
```

### How to Generate

1. **Extract CSS variables from component code**:
   ```tsx
   // From this code:
   className="bg-primary text-primary-foreground border-input"

   // Extract these variables:
   - --primary (bg-primary)
   - --primary-foreground (text-primary-foreground)
   - --input (border-input)
   ```

2. **Categorize by usage**:
   - Backgrounds: `bg-*` classes
   - Text colors: `text-*` classes
   - Borders: `border-*` classes
   - Other: Shadows, rings, etc.

3. **Add appropriate preview**:
   - Backgrounds: Color swatch (20x20px div)
   - Text: "Aa" sample with color
   - Borders: Line sample (40x2px div)

### Examples

**Example 1: Button Component**

```markdown
## Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|--------------|-------|---------|
| Primary | \`--primary\` | Primary button background | <div style="width: 20px; height: 20px; background: var(--primary); border-radius: 4px;"></div> |
| Primary Foreground | \`--primary-foreground\` | Text on primary button | <span style="color: var(--primary-foreground);">Aa</span> |
| Secondary | \`--secondary\` | Secondary button background | <div style="width: 20px; height: 20px; background: var(--secondary); border-radius: 4px;"></div> |
| Destructive | \`--destructive\` | Destructive button background | <div style="width: 20px; height: 20px; background: var(--destructive); border-radius: 4px;"></div> |
| Border | \`--border\` | Outline variant border | <div style="width: 40px; height: 2px; background: var(--border);"></div> |
```

**Example 2: AlertConfiguration Component**

```markdown
## Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|--------------|-------|---------|
| Border Layout | \`--semantic-border-layout\` | Container border, dividers | <div style="width: 40px; height: 2px; background: var(--semantic-border-layout);"></div> |
| Background Primary | \`--semantic-bg-primary\` | Component background | <div style="width: 20px; height: 20px; background: var(--semantic-bg-primary); border: 1px solid #ccc;"></div> |
| Text Primary | \`--semantic-text-primary\` | Labels and values | <span style="color: var(--semantic-text-primary);">Aa</span> |
| Text Muted | \`--semantic-text-muted\` | Descriptions | <span style="color: var(--semantic-text-muted);">Aa</span> |
| Text Link | \`--semantic-text-link\` | Top-up amount (blue) | <span style="color: var(--semantic-text-link);">Aa</span> |
| Error Primary | \`--semantic-error-primary\` | Negative balance (red) | <span style="color: var(--semantic-error-primary);">Aa</span> |
```

## Typography Table

### Format

Document font specifications for text elements in the component:

```markdown
## Typography

| Element | Font Size | Line Height | Weight | Letter Spacing |
|---------|-----------|-------------|--------|----------------|
| Title | 16px (\`text-base\`) | 24px (\`leading-6\`) | 600 (\`font-semibold\`) | 0px (\`tracking-[0px]\`) |
| Subtitle | 14px (\`text-sm\`) | 20px (\`leading-5\`) | 400 (\`font-normal\`) | 0.035px (\`tracking-[0.035px]\`) |
```

### How to Generate

1. **Identify text elements**:
   - Titles/headers
   - Body text
   - Labels
   - Descriptions
   - Captions

2. **Extract Tailwind classes**:
   ```tsx
   // From this code:
   <h3 className="text-base font-semibold tracking-[0px]">

   // Extract:
   - Font Size: 16px (text-base)
   - Weight: 600 (font-semibold)
   - Letter Spacing: 0px (tracking-[0px])
   ```

3. **Map to actual values**:
   ```
   text-sm = 14px
   text-base = 16px
   text-lg = 18px

   font-normal = 400
   font-medium = 500
   font-semibold = 600
   font-bold = 700

   leading-tight = 1.25
   leading-normal = 1.5
   leading-relaxed = 1.625
   ```

### Example

**AlertConfiguration Typography:**

```markdown
## Typography

| Element | Font Size | Line Height | Weight | Letter Spacing |
|---------|-----------|-------------|--------|----------------|
| Title | 16px (\`text-base\`) | 24px (\`leading-6\`) | 600 (\`font-semibold\`) | 0px (\`tracking-[0px]\`) |
| Description | 14px (\`text-sm\`) | 20px (\`leading-relaxed\`) | 400 (\`font-normal\`) | 0.035px (\`tracking-[0.035px]\`) |
| Label | 14px (\`text-sm\`) | 20px | 600 (\`font-semibold\`) | 0.014px (\`tracking-[0.014px]\`) |
| Value | 14px (\`text-sm\`) | 20px | 400 (\`font-normal\`) | 0.035px (\`tracking-[0.035px]\`) |
```

## Usage Examples

### Basic Usage

```tsx
<Component variant="primary" size="lg">
  Content
</Component>
```

### Advanced Usage

Show composition patterns, controlled state, callbacks:

```tsx
const [open, setOpen] = useState(false)

<Component
  open={open}
  onOpenChange={setOpen}
  variant="primary"
  onAction={handleAction}
>
  <ComponentContent />
</Component>
```

### With Form Integration

```tsx
const [value, setValue] = useState('')

<FormModal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Edit Values"
  onSave={handleSave}
>
  <TextField
    label="Name"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
</FormModal>
```

## Interactive Stories

Create stories for each variant and use case:

### 1. Default Story

```tsx
export const Default: Story = {
  args: {
    children: 'Component',
  },
}
```

### 2. Variant Stories

```tsx
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Component',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Component',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Component',
  },
}
```

### 3. Size Stories

```tsx
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Component',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Component',
  },
}
```

### 4. Interactive Stories

```tsx
export const WithState: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>
          Open Component
        </Button>
        <Component
          open={open}
          onOpenChange={setOpen}
        />
      </>
    )
  },
}
```

### 5. Showcase Stories

```tsx
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Component variant="default">Default</Component>
        <Component variant="primary">Primary</Component>
        <Component variant="secondary">Secondary</Component>
      </div>
      <div className="flex gap-2">
        <Component size="sm">Small</Component>
        <Component size="default">Default</Component>
        <Component size="lg">Large</Component>
      </div>
    </div>
  ),
}
```

### 6. State Stories

```tsx
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Component>Normal</Component>
      <Component disabled>Disabled</Component>
      <Component loading>Loading</Component>
    </div>
  ),
}
```

### 7. Multi-State Stories (from State Inventory Table)

If the component has a State Inventory Table from Phase 2, create a story for **each visual state**:

```tsx
// Example: WalletTopup has Default, No Preselection, Loading, and Disabled states
export const Default: Story = {
  args: {
    amounts: [100, 200, 500],
    selectedAmount: 100,
  },
}

export const NoPreselection: Story = {
  args: {
    amounts: [100, 200, 500],
    // no selectedAmount — tests empty/initial state
  },
}

export const Loading: Story = {
  args: {
    amounts: [100, 200, 500],
    isLoading: true,
  },
}

export const Disabled: Story = {
  args: {
    amounts: [100, 200, 500],
    disabled: true,
  },
}
```

**Rules for multi-state stories:**
- Every state in the State Inventory Table MUST have a corresponding story
- Name stories to match the state names (e.g., `Success`, `Error`, `Empty`)
- Show the visual difference clearly — don't just toggle a boolean, set all props that reflect that state
- If a state involves user interaction (e.g., after typing), use `render` with internal state

### 8. Domain-Specific Prop Stories

For components with domain-specific props (confirmed in Phase 5, Step 1e), create stories demonstrating key prop combinations:

```tsx
// Example: WalletTopup has currency, voucherLink, amounts, headerIcon
export const DollarCurrency: Story = {
  args: {
    currency: '$',
    amounts: [10, 25, 50, 100],
  },
}

export const CustomVoucherIcon: Story = {
  args: {
    amounts: [100, 200, 500],
    headerIcon: <Gift className="h-5 w-5" />,
  },
}

export const NoVoucherLink: Story = {
  args: {
    amounts: [100, 200, 500],
    showVoucherLink: false,
  },
}
```

**Rules for domain-specific prop stories:**
- Cover each customization prop with at least one story
- Show non-obvious defaults (e.g., what happens when a prop is omitted)
- Use descriptive story names that explain the prop being demonstrated

## ArgTypes Configuration

Document all props with descriptions and controls:

```tsx
argTypes: {
  variant: {
    control: 'select',
    options: ['default', 'primary', 'secondary', 'destructive'],
    description: 'Visual style variant of the component',
    table: {
      defaultValue: { summary: 'default' },
      type: { summary: 'string' },
    },
  },
  size: {
    control: 'select',
    options: ['sm', 'default', 'lg', 'xl'],
    description: 'Size of the component',
    table: {
      defaultValue: { summary: 'default' },
      type: { summary: 'string' },
    },
  },
  disabled: {
    control: 'boolean',
    description: 'Disables the component interaction',
    table: {
      defaultValue: { summary: false },
      type: { summary: 'boolean' },
    },
  },
  loading: {
    control: 'boolean',
    description: 'Shows loading state',
    table: {
      defaultValue: { summary: false },
      type: { summary: 'boolean' },
    },
  },
  onAction: {
    action: 'clicked',
    description: 'Callback when action is triggered',
    table: {
      type: { summary: '() => void' },
    },
  },
}
```

### Domain-Specific ArgTypes

For components with domain-specific props, document all three categories:

```tsx
argTypes: {
  // Data props
  amounts: {
    control: 'object',
    description: 'Array of preset amounts to display',
    table: {
      type: { summary: 'number[]' },
      defaultValue: { summary: '[100, 200, 500, 1000]' },
    },
  },
  currency: {
    control: 'text',
    description: 'Currency symbol to display',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: '₹' },
    },
  },
  // Callback props
  onSubmit: {
    action: 'submitted',
    description: 'Called when user submits with the selected/entered amount',
    table: {
      type: { summary: '(amount: number) => void' },
    },
  },
  // Customization props
  headerIcon: {
    control: false,
    description: 'Custom icon for the header. Defaults to Wallet icon.',
    table: {
      type: { summary: 'React.ReactNode' },
    },
  },
}
```

## Complete Example

**Button Component Story:**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { Loader2, Plus } from 'lucide-react'

/**
 * A customizable button component with multiple variants, sizes, and icon support.
 *
 * ## Installation
 *
 * Install via the myOperator UI CLI:
 * ```bash
 * npx myoperator-ui add button
 * ```
 *
 * ## Import
 *
 * ```tsx
 * import { Button } from "@myoperator/ui"
 * ```
 *
 * ## Design Tokens
 *
 * | Token | CSS Variable | Usage | Preview |
 * |-------|--------------|-------|---------|
 * | Primary | \`--primary\` | Primary button background | <div style="width: 20px; height: 20px; background: var(--primary); border-radius: 4px;"></div> |
 * | Primary Foreground | \`--primary-foreground\` | Text on primary button | <span style="color: var(--primary-foreground);">Aa</span> |
 * | Secondary | \`--secondary\` | Secondary button background | <div style="width: 20px; height: 20px; background: var(--secondary); border-radius: 4px;"></div> |
 * | Destructive | \`--destructive\` | Destructive action background | <div style="width: 20px; height: 20px; background: var(--destructive); border-radius: 4px;"></div> |
 * | Border | \`--border\` | Outline variant border | <div style="width: 40px; height: 2px; background: var(--border);"></div> |
 *
 * ## Usage
 *
 * ```tsx
 * // Basic usage
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 *
 * // With icons
 * <Button variant="default" leftIcon={<Plus />}>
 *   Add Item
 * </Button>
 *
 * // Loading state
 * <Button variant="primary" loading>
 *   Saving...
 * </Button>
 * ```
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables button interaction',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button leftIcon={<Plus className="h-4 w-4" />}>
        Add Item
      </Button>
      <Button variant="primary" rightIcon={<Plus className="h-4 w-4" />}>
        Add Item
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button loading>Loading</Button>
      <Button variant="primary" loading>
        Saving...
      </Button>
    </div>
  ),
}
```

## Best Practices

1. **Always include installation instructions** - Help users get started
2. **Document all CSS variables used** - Enable customization
3. **Show typography specifications** - Ensure consistent implementation
4. **Provide usage examples** - Demonstrate common patterns
5. **Create interactive stories** - Let users explore variants
6. **Use meaningful story names** - Make documentation discoverable
7. **Add descriptions to argTypes** - Explain prop purposes
8. **Show composition patterns** - Teach proper usage
9. **Include state examples** - Cover disabled, loading, error states
10. **Follow established patterns** - Maintain consistency across docs

## Validation Checklist

Before finalizing documentation:

- [ ] Installation section included
- [ ] Import statement shown
- [ ] Design tokens table complete (all CSS variables from actual component code)
- [ ] Typography table included (if applicable)
- [ ] Usage examples provided
- [ ] Default story created
- [ ] Variant stories created
- [ ] Size stories created
- [ ] Interactive stories added
- [ ] **Multi-state stories** — one per state in the State Inventory Table
- [ ] **Domain-specific prop stories** — key customization props demonstrated
- [ ] ArgTypes configured (including domain-specific props with categories)
- [ ] All stories render correctly
- [ ] Documentation is clear and helpful

### Post-Implementation Verification

After the component is fully implemented (Phase 5 complete), re-check:

- [ ] Design Tokens table reflects **actual** CSS variables in the final component code (not just the planned ones)
- [ ] Typography table matches **actual** font classes used
- [ ] Docs page description accurately reflects final props (props may have changed during implementation)
- [ ] Stories demonstrate the component's real behavior (not placeholder args)
- [ ] Sidebar grouping is correct (`Components/Name` for UI, `Custom/Name` or `Custom/SubGroup/Name` for custom)

This skill ensures comprehensive, consistent documentation that helps users understand and use components effectively.
