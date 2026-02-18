---
name: myoperator-design
description: Create UIs matching the myOperator design system. Use this skill when the user asks to "build with myoperator design", "create myoperator-style UI", "use myoperator design system", "myoperator dashboard", "myoperator page", or asks for interfaces, pages, dashboards, or components that should follow myOperator's visual language. Invoke with /myoperator-design. Generates standalone React/Tailwind code with the design system's color tokens, typography, and component patterns.
version: 1.0.0
---

This skill generates production-ready React/Tailwind CSS code that matches the myOperator design system aesthetic. All generated code is standalone — it does not require the myoperator-ui package, but visually matches its components.

The user provides UI requirements: a component, page, form, dashboard, or interface to build. They may include context about the purpose, data, or specific features.

## Design Philosophy

myOperator's design language is **professional, clean, and purposeful**:

- **Blue-gray primary palette** (#343E55) — sophisticated and business-appropriate
- **Turquoise accent** (#2BBCCA) — fresh, modern brand identity
- **Clean typography** with Source Sans Pro — readable and professional
- **Subtle interactions** — focus rings, hover states, smooth transitions
- **Semantic color usage** — success/error/warning states are clear and consistent

The aesthetic is **enterprise SaaS** — trustworthy, efficient, uncluttered. NOT flashy, NOT playful, NOT experimental.

### Brand Color Usage (Important)

**Turquoise (#2BBCCA) is ONLY for highlighting interactive elements:**
- Focus rings on inputs
- Active/selected states (toggle switches, nav items)
- Interactive badges (e.g., "Live" indicator)
- Links and clickable text
- Brand logo accent

**DO NOT use turquoise for:**
- Charts, graphs, or data visualizations
- Decorative elements
- Large background areas
- Non-interactive content

For charts/graphs, use the **primary blue-gray** (--semantic-primary / #343E55) as the default data color. Use **semantic state colors** for meaning (success green for positive trends, error red for negative).

## Color System

### Primitive Colors (CSS Variables)

Include these CSS custom properties in generated code. Use the semantic tokens below for actual styling.

```css
:root {
  /* Base */
  --color-white: #FFFFFF;
  --color-black: #000000;

  /* Neutral (Gray) */
  --color-neutral-50: #FAFAFA;
  --color-neutral-100: #F5F5F5;
  --color-neutral-200: #E9EAEB;
  --color-neutral-300: #D5D7DA;
  --color-neutral-400: #A4A7AE;
  --color-neutral-500: #717680;
  --color-neutral-600: #535862;
  --color-neutral-700: #414651;
  --color-neutral-800: #252B37;
  --color-neutral-900: #181D27;

  /* Primary (Blue Gray) */
  --color-primary-50: #EBECEE;
  --color-primary-100: #C0C3CA;
  --color-primary-200: #A2A6B1;
  --color-primary-300: #777E8D;
  --color-primary-400: #5D6577;
  --color-primary-500: #343E55;
  --color-primary-600: #2F384D;
  --color-primary-700: #252C3C;
  --color-primary-800: #1D222F;
  --color-primary-900: #161A24;

  /* Secondary (Turquoise) - Brand accent */
  --color-secondary-50: #EAF8FA;
  --color-secondary-100: #BDEAEF;
  --color-secondary-200: #9DE0E7;
  --color-secondary-300: #71D2DB;
  --color-secondary-400: #55C9D5;
  --color-secondary-500: #2BBCCA;
  --color-secondary-600: #27ABB8;
  --color-secondary-700: #1F858F;

  /* Error (Red) */
  --color-error-50: #FEF3F2;
  --color-error-100: #FEE4E2;
  --color-error-300: #FDA29B;
  --color-error-500: #F04438;
  --color-error-600: #D92D20;
  --color-error-700: #B42318;

  /* Warning (Amber) */
  --color-warning-50: #FFFAEB;
  --color-warning-100: #FEF0C7;
  --color-warning-300: #FEC84B;
  --color-warning-500: #F79009;
  --color-warning-700: #B54708;

  /* Success (Green) */
  --color-success-50: #ECFDF3;
  --color-success-100: #DCFAE6;
  --color-success-300: #75E0A7;
  --color-success-500: #17B26A;
  --color-success-700: #067647;

  /* Info (Blue) */
  --color-info-50: #ECF1FB;
  --color-info-100: #C4D4F2;
  --color-info-500: #4275D6;
  --color-info-700: #2F5398;
}
```

### Semantic Tokens

Map purpose to color. ALWAYS use semantic tokens, not raw colors:

```css
:root {
  /* Primary UI */
  --semantic-primary: var(--color-primary-500);           /* #343E55 */
  --semantic-primary-hover: var(--color-primary-600);     /* #2F384D */
  --semantic-primary-surface: var(--color-primary-50);    /* #EBECEE */

  /* Brand Accent */
  --semantic-brand: var(--color-secondary-500);           /* #2BBCCA */
  --semantic-brand-hover: var(--color-secondary-700);     /* #1F858F */
  --semantic-brand-surface: var(--color-secondary-50);    /* #EAF8FA */

  /* Backgrounds */
  --semantic-bg-primary: var(--color-white);
  --semantic-bg-ui: var(--color-neutral-100);             /* #F5F5F5 */
  --semantic-bg-hover: var(--color-neutral-300);          /* #D5D7DA */

  /* Text */
  --semantic-text-primary: var(--color-neutral-900);      /* #181D27 */
  --semantic-text-secondary: var(--color-primary-500);    /* #343E55 */
  --semantic-text-muted: var(--color-neutral-500);        /* #717680 */
  --semantic-text-placeholder: var(--color-primary-200);  /* #A2A6B1 */
  --semantic-text-link: var(--color-info-500);            /* #4275D6 */
  --semantic-text-inverted: var(--color-white);

  /* Borders */
  --semantic-border-primary: var(--color-primary-500);
  --semantic-border-input: var(--color-neutral-200);
  --semantic-border-input-focus: var(--color-secondary-500);
  --semantic-border-layout: var(--color-neutral-200);

  /* States */
  --semantic-error-primary: var(--color-error-500);
  --semantic-error-surface: var(--color-error-50);
  --semantic-success-primary: var(--color-success-500);
  --semantic-success-surface: var(--color-success-50);
  --semantic-warning-primary: var(--color-warning-500);
  --semantic-warning-surface: var(--color-warning-50);
}
```

## Typography System

**Font**: `'Source Sans Pro', sans-serif` (import from Google Fonts)

**Body Text Convention**: Default body text is **16px** (not 14px). Use 14px only for secondary/helper text. 12px is reserved for rare cases like tiny labels or metadata.

### Type Scale

| Kind | Variant | Size | Line Height | Weight | Use Case |
|------|---------|------|-------------|--------|----------|
| display | large | 57px | 64px | 400 | Hero sections |
| display | medium | 45px | 52px | 400 | Page heroes |
| display | small | 36px | 44px | 400 | Large callouts |
| headline | large | 32px | 40px | 600 | Page titles |
| headline | medium | 28px | 36px | 600 | Section titles |
| headline | small | 24px | 32px | 600 | Card titles |
| title | large | 18px | 22px | 600 | Subsection headers |
| title | medium | 16px | 20px | 600 | Component titles |
| title | small | 14px | 18px | 600 | Small headers |
| label | large | 14px | 20px | 600 | Form labels |
| label | medium | 12px | 16px | 600 | Small labels |
| label | small | 10px | 14px | 600 | Tiny labels |
| body | large | 16px | 24px | 400 | Large paragraphs |
| body | medium | 16px | 22px | 400 | Default body text |
| body | small | 14px | 20px | 400 | Secondary/helper text |

### Text Colors

- **primary**: `--semantic-text-primary` — Main content
- **secondary**: `--semantic-text-secondary` — Emphasized text
- **muted**: `--semantic-text-muted` — Helper text, descriptions
- **placeholder**: `--semantic-text-placeholder` — Input placeholders
- **link**: `--semantic-text-link` — Clickable links
- **inverted**: `--semantic-text-inverted` — On dark backgrounds
- **error**: `--semantic-error-primary` — Error messages
- **success**: `--semantic-success-primary` — Success messages

## Component Patterns

### Buttons

**Variants**:
- `primary` — Blue-gray background, white text. Main actions.
- `outline` — Transparent with border. Secondary actions.
- `secondary` — Light surface background. Tertiary actions.
- `ghost` — No background until hover. Minimal actions.
- `destructive` — Red background. Dangerous actions.
- `dashed` — Dashed border. "Add" actions.
- `link` — Underline on hover. Text links.

**Sizes**:
- `sm` — py-2 px-3, text-xs
- `default` — py-2.5 px-4, text-sm
- `lg` — py-3 px-6, text-sm

**Pattern**:
```jsx
<button className="inline-flex items-center justify-center gap-2 rounded text-sm font-medium
  bg-[var(--semantic-primary)] text-[var(--semantic-text-inverted)]
  hover:bg-[var(--semantic-primary-hover)]
  focus:outline-none focus:ring-2 focus:ring-[var(--semantic-primary)] focus:ring-offset-2
  disabled:opacity-50 disabled:pointer-events-none
  transition-all duration-200 py-2.5 px-4">
  Button Text
</button>
```

### Inputs

**States**: default, error, disabled

**Pattern**:
```jsx
<input className="h-10 w-full rounded px-4 py-2.5 text-sm
  bg-[var(--semantic-bg-primary)] text-[var(--semantic-text-primary)]
  border border-[var(--semantic-border-input)]
  placeholder:text-[var(--semantic-text-placeholder)]
  focus:outline-none focus:border-[var(--semantic-border-input-focus)]
  focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]
  disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]
  transition-all" />
```

### Cards

**Pattern**:
```jsx
<div className="rounded-lg border border-[var(--semantic-border-layout)]
  bg-[var(--semantic-bg-primary)] p-6 shadow-sm">
  {/* Card content */}
</div>
```

### Badges

**Variants**: active (green), failed (red), disabled (gray), default, outline

**Pattern**:
```jsx
<span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
  bg-[var(--semantic-success-surface)] text-[var(--semantic-success-primary)]">
  Active
</span>
```

### Dialogs/Modals

**Sizes**: sm (max-w-sm), default (max-w-lg), lg (max-w-2xl), xl (max-w-4xl)

**Pattern**:
```jsx
{/* Overlay */}
<div className="fixed inset-0 z-50 bg-black/50" />

{/* Modal */}
<div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2
  w-full max-w-lg rounded-lg border border-[var(--semantic-border-layout)]
  bg-[var(--semantic-bg-primary)] p-6 shadow-lg">
  {/* Content */}
</div>
```

### Tables

**Pattern**:
```jsx
<table className="w-full text-sm">
  <thead>
    <tr className="border-b border-[var(--semantic-border-layout)]">
      <th className="px-4 py-3 text-left font-semibold text-[var(--semantic-text-secondary)]">
        Header
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-[var(--semantic-border-layout)]
      hover:bg-[var(--semantic-bg-ui)] transition-colors">
      <td className="px-4 py-3 text-[var(--semantic-text-primary)]">Cell</td>
    </tr>
  </tbody>
</table>
```

## Implementation Guidelines

1. **Always include CSS variables** — Output a `:root` block with required tokens
2. **Use semantic tokens** — Never use raw hex colors in component code
3. **Import the font** — Include `@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap');`
4. **Focus states** — All interactive elements need visible focus indicators
5. **Transitions** — Use `transition-all duration-200` for smooth interactions
6. **Disabled states** — `opacity-50` + `pointer-events-none`
7. **Spacing** — Use consistent padding: p-4 (cards), py-2.5 px-4 (buttons), px-4 py-2.5 (inputs)
8. **Border radius** — `rounded` (4px) for small elements, `rounded-lg` (8px) for cards/modals

## Code Structure

Generate complete, runnable code:

```jsx
// styles.css (or in <style> tag)
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap');

:root {
  /* Include all required tokens */
}

body {
  font-family: 'Source Sans Pro', sans-serif;
  background: var(--semantic-bg-primary);
  color: var(--semantic-text-primary);
}

// Component.jsx
export function Component() {
  return (
    // JSX using Tailwind classes with CSS variable values
  );
}
```

## What NOT to Do

- **No arbitrary colors** — Always use CSS variables
- **No generic fonts** — Always use Source Sans Pro
- **No flashy animations** — Keep it subtle and professional
- **No heavy shadows** — Use `shadow-sm` or `shadow-lg` sparingly
- **No rounded-full on containers** — Only on badges and avatars
- **No neon/bright accent colors** — Stick to the turquoise brand color
- **No turquoise in charts/graphs** — Use primary blue-gray for data visualization, semantic colors for meaning

## Reference

For detailed token values and component examples, see `references/design-tokens.md`.

<!-- AUTO-GENERATED: Component Catalog -->

## Component Catalog

> Auto-generated from `components.yaml` and component metadata. 43 components across 7 categories.

### Quick Reference

| Component | Category | Install |
|-----------|----------|---------|
| Button | core | `npx myoperator-ui add button` |
| Badge | core | `npx myoperator-ui add badge` |
| Typography | core | `npx myoperator-ui add typography` |
| Input | form | `npx myoperator-ui add input` |
| Select | form | `npx myoperator-ui add select` |
| Checkbox | form | `npx myoperator-ui add checkbox` |
| Switch | form | `npx myoperator-ui add switch` |
| TextField | form | `npx myoperator-ui add text-field` |
| SelectField | form | `npx myoperator-ui add select-field` |
| MultiSelect | form | `npx myoperator-ui add multi-select` |
| ReadableField | form | `npx myoperator-ui add readable-field` |
| Table | data | `npx myoperator-ui add table` |
| Dialog | overlay | `npx myoperator-ui add dialog` |
| DropdownMenu | overlay | `npx myoperator-ui add dropdown-menu` |
| Tooltip | overlay | `npx myoperator-ui add tooltip` |
| DeleteConfirmationModal | overlay | `npx myoperator-ui add delete-confirmation-modal` |
| ConfirmationModal | overlay | `npx myoperator-ui add confirmation-modal` |
| FormModal | overlay | `npx myoperator-ui add form-modal` |
| Tag | feedback | `npx myoperator-ui add tag` |
| Alert | feedback | `npx myoperator-ui add alert` |
| Toast | feedback | `npx myoperator-ui add toast` |
| Spinner | feedback | `npx myoperator-ui add spinner` |
| Skeleton | feedback | `npx myoperator-ui add skeleton` |
| EmptyState | feedback | `npx myoperator-ui add empty-state` |
| Accordion | layout | `npx myoperator-ui add accordion` |
| PageHeader | layout | `npx myoperator-ui add page-header` |
| Pagination | layout | `npx myoperator-ui add pagination` |
| EventSelector | custom | `npx myoperator-ui add event-selector` |
| KeyValueInput | custom | `npx myoperator-ui add key-value-input` |
| ApiFeatureCard | custom | `npx myoperator-ui add api-feature-card` |
| EndpointDetails | custom | `npx myoperator-ui add endpoint-details` |
| AlertConfiguration | custom | `npx myoperator-ui add alert-configuration` |
| AutoPaySetup | custom | `npx myoperator-ui add auto-pay-setup` |
| BankDetails | custom | `npx myoperator-ui add bank-details` |
| DateRangeModal | custom | `npx myoperator-ui add date-range-modal` |
| PaymentOptionCard | custom | `npx myoperator-ui add payment-option-card` |
| PaymentSummary | custom | `npx myoperator-ui add payment-summary` |
| LetUsDriveCard | custom | `npx myoperator-ui add let-us-drive-card` |
| PowerUpCard | custom | `npx myoperator-ui add power-up-card` |
| PricingCard | custom | `npx myoperator-ui add pricing-card` |
| PricingPage | custom | `npx myoperator-ui add pricing-page` |
| PricingToggle | custom | `npx myoperator-ui add pricing-toggle` |
| WalletTopup | custom | `npx myoperator-ui add wallet-topup` |

### Core — Essential UI primitives

#### Button
> A customizable button component with variants, sizes, and icons. Supports loading states and can render as a child element using Radix Slot.

**Install**: `npx myoperator-ui add button`

**Variants**: default, destructive, outline, secondary, ghost, link, dashed (default: default)
**Sizes**: default, sm, lg, icon, icon-sm, icon-lg (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link" \| "dashed" | default | The visual style of the button |
| size | "default" \| "sm" \| "lg" \| "icon" \| "icon-sm" \| "icon-lg" | default | The size of the button |
| asChild | boolean | false | Render as child element using Radix Slot |
| leftIcon | React.ReactNode | — | Icon displayed on the left side of the button text |
| rightIcon | React.ReactNode | — | Icon displayed on the right side of the button text |
| loading | boolean | false | Shows loading spinner and disables button |
| loadingText | string | — | Text shown during loading state |

**Examples**:
- **Basic Button**: Simple button with default styling
```jsx
<Button>Click me</Button>
```
- **Button with Icons**: Buttons with left or right icons
```jsx
import { Mail } from "lucide-react"

<Button leftIcon={<Mail />}>Send Email</Button>
```
- **Loading State**: Button with loading spinner
```jsx
<Button loading loadingText="Saving...">Save</Button>
```

---

#### Badge
> A status badge component with active, failed, disabled, outline, secondary, and destructive variants. Supports asChild for rendering as links.

**Install**: `npx myoperator-ui add badge`

**Variants**: active, failed, disabled, default, secondary, outline, destructive (default: default)
**Sizes**: default, sm, lg (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "active" \| "failed" \| "disabled" \| "default" \| "secondary" \| "outline" \| "destructive" | default | The visual style of the badge |
| size | "default" \| "sm" \| "lg" | default | The size of the badge |
| leftIcon | React.ReactNode | — | Icon displayed on the left side |
| rightIcon | React.ReactNode | — | Icon displayed on the right side |
| asChild | boolean | false | Render as child element using Radix Slot |

**Examples**:
- **Status Badges**: Badges for different status states
```jsx
<Badge variant="active">Active</Badge>
<Badge variant="failed">Failed</Badge>
```
- **Badge as Link**: Badge rendered as a link
```jsx
<Badge asChild><a href="/status">View Status</a></Badge>
```

---

#### Typography
> A semantic typography component with kind, variant, color, alignment, and truncation support

**Install**: `npx myoperator-ui add typography`

---

### Form — Form inputs and controls

#### Input
> A flexible input component for text entry with state variants. Supports default and error states.

**Install**: `npx myoperator-ui add input`

**States**: default, error (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| state | "default" \| "error" | default | The visual state of the input |

**Examples**:
- **Basic Input**: Simple input with placeholder
```jsx
<Input placeholder="Enter your email" />
```

---

#### Select
> A composable select dropdown built with Radix UI primitives. Includes SelectTrigger, SelectContent, SelectItem, and more sub-components.

**Install**: `npx myoperator-ui add select`

**States**: default, error (default: default)

**Examples**:
- **Basic Select**: Simple select dropdown
```jsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

#### Checkbox
> A tri-state checkbox component built on Radix UI with label support. Supports checked, unchecked, and indeterminate states.

**Install**: `npx myoperator-ui add checkbox`

**Sizes**: default, sm, lg (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "default" \| "sm" \| "lg" | default | The size of the checkbox |
| checked | boolean \| "indeterminate" | — | Whether the checkbox is checked |
| onCheckedChange | (checked: CheckedState) => void | — | Callback when checked state changes |
| label | string | — | Optional label text |
| labelPosition | "left" \| "right" | right | Position of the label |

**Examples**:
- **Basic Checkbox**: Simple controlled checkbox
```jsx
<Checkbox checked={isEnabled} onCheckedChange={setIsEnabled} />
```
- **Checkbox with Label**: Checkbox with label
```jsx
<Checkbox label="Accept terms and conditions" />
```

---

#### Switch
> A switch component built on Radix UI for boolean inputs with on/off states. Supports labels and multiple sizes.

**Install**: `npx myoperator-ui add switch`

**Sizes**: default, sm, lg (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "default" \| "sm" \| "lg" | default | The size of the switch |
| checked | boolean | — | Whether the switch is on |
| onCheckedChange | (checked: boolean) => void | — | Callback when checked state changes |
| label | string | — | Optional label text |
| labelPosition | "left" \| "right" | right | Position of the label |

**Examples**:
- **Basic Switch**: Simple controlled switch
```jsx
<Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
```
- **Switch with Label**: Switch with label
```jsx
<Switch label="Enable notifications" />
```

---

#### TextField
> A comprehensive text field component with label, icons, prefix/suffix, validation states, character count, and loading state.

**Install**: `npx myoperator-ui add text-field`

**States**: default, error (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | — | Label text displayed above the input |
| required | boolean | false | Shows red asterisk next to label |
| helperText | string | — | Helper text displayed below the input |
| error | string | — | Error message - shows error state |
| leftIcon | React.ReactNode | — | Icon displayed on the left |
| rightIcon | React.ReactNode | — | Icon displayed on the right |
| prefix | string | — | Text prefix inside input |
| suffix | string | — | Text suffix inside input |
| showCount | boolean | false | Shows character count when maxLength is set |
| loading | boolean | false | Shows loading spinner |

**Examples**:
- **Basic TextField**: Text field with label and required indicator
```jsx
<TextField label="Email" placeholder="Enter your email" required />
```
- **TextField with Error**: Text field showing error state
```jsx
<TextField label="Username" error="Username is already taken" />
```

---

#### SelectField
> A form-ready select component with label, helper text, error handling, and grouped options support.

**Install**: `npx myoperator-ui add select-field`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | — | Label text displayed above the select |
| required | boolean | false | Shows red asterisk next to label |
| options | SelectOption[] | — | Array of options with value, label, disabled, and group properties |
| error | string | — | Error message - shows error state |
| helperText | string | — | Helper text displayed below the select |
| searchable | boolean | false | Enable search/filter functionality |

**Examples**:
- **Basic SelectField**: Select field with label and options
```jsx
<SelectField
  label="Country"
  placeholder="Select a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  required
/>
```

---

#### MultiSelect
> A multi-select component with tags display, search functionality, and validation states. Supports maximum selection limits.

**Install**: `npx myoperator-ui add multi-select`

**States**: default, error (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | — | Label text displayed above the select |
| options | MultiSelectOption[] | — | Array of options with value, label, and disabled properties |
| value | string[] | — | Currently selected values (controlled) |
| onValueChange | (value: string[]) => void | — | Callback when values change |
| searchable | boolean | false | Enable search/filter functionality |
| maxSelections | number | — | Maximum number of selections allowed |
| error | string | — | Error message - shows error state |

**Examples**:
- **Basic MultiSelect**: Multi-select with tag display
```jsx
<MultiSelect
  label="Skills"
  placeholder="Select skills"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ]}
  onValueChange={(values) => console.log(values)}
/>
```

---

#### ReadableField
> A read-only field with copy-to-clipboard functionality. Supports secret mode for sensitive data like API keys.

**Install**: `npx myoperator-ui add readable-field`

---

### Data — Data display components

#### Table
> A composable table component with size variants, loading/empty states, sticky columns, and sorting support.

**Install**: `npx myoperator-ui add table`

**Sizes**: sm, md, lg (default: md)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "sm" \| "md" \| "lg" | md | The row height of the table |
| withoutBorder | boolean | false | Remove outer border from the table |

**Examples**:
- **Basic Table**: Simple table with header and body
```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell><Badge variant="active">Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Overlay — Popups, modals, menus

#### Dialog
> A modal dialog component built on Radix UI Dialog with size variants and animations

**Install**: `npx myoperator-ui add dialog`

---

#### DropdownMenu
> A dropdown menu component for displaying actions and options. Built on Radix UI with full keyboard navigation support.

**Install**: `npx myoperator-ui add dropdown-menu`

**Examples**:
- **Basic Dropdown**: Simple dropdown with menu items
```jsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

#### Tooltip
> A popup that displays information related to an element when hovered or focused

**Install**: `npx myoperator-ui add tooltip`

---

#### DeleteConfirmationModal
> A confirmation modal requiring text input to confirm deletion

**Install**: `npx myoperator-ui add delete-confirmation-modal`
**Requires**: `dialog`, `button`, `input` (auto-installed)

---

#### ConfirmationModal
> A simple confirmation modal for yes/no decisions

**Install**: `npx myoperator-ui add confirmation-modal`
**Requires**: `dialog`, `button` (auto-installed)

---

#### FormModal
> A reusable modal component for forms with consistent layout

**Install**: `npx myoperator-ui add form-modal`
**Requires**: `dialog`, `button` (auto-installed)

---

### Feedback — Status and notifications

#### Tag
> A tag component for event labels with optional bold label prefix. Rounded rectangle tags for categorization.

**Install**: `npx myoperator-ui add tag`

**Variants**: default, primary, secondary, success, warning, error (default: default)
**Sizes**: default, sm, lg (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "default" \| "primary" \| "secondary" \| "success" \| "warning" \| "error" | default | The visual style of the tag |
| size | "default" \| "sm" \| "lg" | default | The size of the tag |
| label | string | — | Bold label prefix displayed before the content |
| interactive | boolean | false | Make the tag clickable |
| selected | boolean | false | Show selected state |

**Examples**:
- **Basic Tags**: Simple tag labels
```jsx
<Tag>Category</Tag>
<Tag variant="success">Success</Tag>
```
- **Tag with Label**: Tags with bold label prefix
```jsx
<Tag label="Status:">Active</Tag>
```

---

#### Alert
> A dismissible alert component for notifications, errors, warnings, and success messages with icons, actions, and controlled visibility

**Install**: `npx myoperator-ui add alert`

---

#### Toast
> A toast notification component for displaying brief messages at screen corners, with auto-dismiss and stacking support

**Install**: `npx myoperator-ui add toast`

---

#### Spinner
> A loading spinner component with customizable size and color variants for indicating progress

**Install**: `npx myoperator-ui add spinner`

---

#### Skeleton
> A placeholder loading component with pulse animation for content loading states

**Install**: `npx myoperator-ui add skeleton`

---

#### EmptyState
> Centered empty state with icon, title, description, and optional action buttons

**Install**: `npx myoperator-ui add empty-state`

---

### Layout — Layout and structure components

#### Accordion
> An expandable/collapsible accordion component with single or multiple mode support.

**Install**: `npx myoperator-ui add accordion`

**Types**: single, multiple (default: multiple)
**Variants**: default, bordered (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | "single" \| "multiple" | multiple | Whether only one item can be open at a time |
| variant | "default" \| "bordered" | default | Visual variant of the accordion |
| value | string[] | — | Controlled value - array of open item values |
| defaultValue | string[] | — | Default open items for uncontrolled usage |

**Examples**:
- **Basic Accordion**: Basic accordion with sections
```jsx
<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

#### PageHeader
> A page header component with icon, title, description, and action buttons

**Install**: `npx myoperator-ui add page-header`

---

#### Pagination
> A composable pagination component with page navigation, next/previous links, and ellipsis

**Install**: `npx myoperator-ui add pagination`
**Requires**: `button` (auto-installed)

---

### Custom — Multi-file complex components

#### EventSelector
> A component for selecting webhook events with groups, categories, and tri-state checkboxes

**Install**: `npx myoperator-ui add event-selector`
**Requires**: `checkbox`, `accordion` (auto-installed)
**Type**: Multi-file component

---

#### KeyValueInput
> A component for managing key-value pairs with validation and duplicate detection

**Install**: `npx myoperator-ui add key-value-input`
**Requires**: `button`, `input` (auto-installed)
**Type**: Multi-file component

---

#### ApiFeatureCard
> A card component for displaying API features with icon, title, description, and action button

**Install**: `npx myoperator-ui add api-feature-card`
**Requires**: `button` (auto-installed)
**Type**: Multi-file component

---

#### EndpointDetails
> A component for displaying API endpoint details with copy-to-clipboard and secret field support

**Install**: `npx myoperator-ui add endpoint-details`
**Requires**: `readable-field` (auto-installed)
**Type**: Multi-file component

---

#### AlertConfiguration
> A configuration card for alert settings with inline editing modal

**Install**: `npx myoperator-ui add alert-configuration`
**Requires**: `button`, `form-modal`, `select` (auto-installed)
**Type**: Multi-file component

---

#### AutoPaySetup
> A setup wizard component for configuring automatic payments with payment method selection

**Install**: `npx myoperator-ui add auto-pay-setup`
**Requires**: `accordion`, `button` (auto-installed)
**Type**: Multi-file component

---

#### BankDetails
> A component for displaying bank account details with copy-to-clipboard functionality

**Install**: `npx myoperator-ui add bank-details`
**Requires**: `accordion` (auto-installed)
**Type**: Multi-file component

---

#### DateRangeModal
> A modal for selecting a date range with start and end date pickers

**Install**: `npx myoperator-ui add date-range-modal`
**Requires**: `dialog`, `button`, `input` (auto-installed)
**Type**: Multi-file component

---

#### PaymentOptionCard
> A selectable payment method list with icons, titles, and descriptions. Includes a modal variant for overlay usage.

**Install**: `npx myoperator-ui add payment-option-card`
**Requires**: `button`, `dialog` (auto-installed)
**Type**: Multi-file component

---

#### PaymentSummary
> A component for displaying payment summary with line items and total

**Install**: `npx myoperator-ui add payment-summary`
**Requires**: `tooltip` (auto-installed)
**Type**: Multi-file component

---

#### LetUsDriveCard
> A managed service card with pricing, billing badge, 'Show details' link, and CTA for the full-service management section

**Install**: `npx myoperator-ui add let-us-drive-card`
**Requires**: `button`, `badge` (auto-installed)
**Type**: Multi-file component

---

#### PowerUpCard
> An add-on service card with icon, title, pricing, description, and CTA button for the power-ups section

**Install**: `npx myoperator-ui add power-up-card`
**Requires**: `button` (auto-installed)
**Type**: Multi-file component

---

#### PricingCard
> A pricing tier card with plan name, pricing, feature checklist, CTA button, and optional popularity badge and addon footer

**Install**: `npx myoperator-ui add pricing-card`
**Requires**: `button`, `badge` (auto-installed)
**Type**: Multi-file component

---

#### PricingPage
> A full pricing page layout composing plan-type tabs, billing toggle, pricing cards grid, power-ups section, and let-us-drive managed services section

**Install**: `npx myoperator-ui add pricing-page`
**Requires**: `button`, `page-header`, `pricing-toggle`, `pricing-card`, `power-up-card`, `let-us-drive-card` (auto-installed)
**Type**: Multi-file component

---

#### PricingToggle
> A plan type tab selector with billing period toggle for pricing pages. Pill-shaped tabs switch plan categories, and an optional switch toggles between monthly/yearly billing.

**Install**: `npx myoperator-ui add pricing-toggle`
**Requires**: `switch` (auto-installed)
**Type**: Multi-file component

---

#### WalletTopup
> A component for wallet top-up with amount selection and coupon support

**Install**: `npx myoperator-ui add wallet-topup`
**Requires**: `accordion`, `button`, `input` (auto-installed)
**Type**: Multi-file component

---
