---
name: myoperator-design
description: Create UIs matching the myOperator design system. Use this skill when the user asks to "build with myoperator design", "create myoperator-style UI", "use myoperator design system", "myoperator dashboard", "myoperator page", or asks for interfaces, pages, dashboards, or components that should follow myOperator's visual language. Generates standalone React/Tailwind code with the design system's color tokens, typography, and component patterns.
version: 1.0.0
---

Generates production-ready React/Tailwind CSS code matching the myOperator design system. Code is standalone — does not require the myoperator-ui package but visually matches its components. Always include the full CSS variables block in output.

## Design Philosophy

myOperator's design language is **professional, clean, and purposeful**:

- **Blue-gray primary palette** (#343E55) — sophisticated and business-appropriate
- **Turquoise accent** (#2BBCCA) — fresh, modern brand identity
- **Clean typography** with Source Sans Pro — readable and professional
- **Subtle interactions** — focus rings, hover states, smooth transitions
- **Semantic color usage** — success/error/warning states are clear and consistent

The aesthetic is **enterprise SaaS** — trustworthy, efficient, uncluttered. NOT flashy, NOT playful, NOT experimental.

### Brand Color Usage

**Turquoise (#2BBCCA) is ONLY for:**
- Focus rings on inputs
- Active/selected states (toggle switches, nav items)
- Interactive badges (e.g., "Live" indicator)
- Links and clickable text

**DO NOT use turquoise for:** charts, graphs, decorative elements, large backgrounds, non-interactive content.

For charts/graphs: use `--semantic-primary` (#343E55) as default data color. Use semantic state colors for meaning (success green = positive, error red = negative).

## Color System

Always include this `:root` block in generated output. For the full primitive color scale (50–950 steps), see `references/design-tokens.md`.

```css
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap');

:root {
  /* Primary UI */
  --semantic-primary: #343E55;
  --semantic-primary-hover: #2F384D;
  --semantic-primary-selected: #777E8D;
  --semantic-primary-highlighted: #252C3C;
  --semantic-primary-surface: #EBECEE;

  /* Brand Accent (Turquoise — interactive elements only) */
  --semantic-brand: #2BBCCA;
  --semantic-brand-hover: #1F858F;
  --semantic-brand-selected: #71D2DB;
  --semantic-brand-surface: #EAF8FA;

  /* Backgrounds */
  --semantic-bg-primary: #FFFFFF;
  --semantic-bg-secondary: #0C0F12;
  --semantic-bg-ui: #F5F5F5;
  --semantic-bg-grey: #E9EAEB;
  --semantic-bg-hover: #D5D7DA;
  --semantic-bg-inverted: #000000;

  /* Text */
  --semantic-text-primary: #181D27;
  --semantic-text-secondary: #343E55;
  --semantic-text-muted: #717680;
  --semantic-text-placeholder: #A2A6B1;
  --semantic-text-link: #4275D6;
  --semantic-text-inverted: #FFFFFF;

  /* Borders */
  --semantic-border-primary: #343E55;
  --semantic-border-secondary: #777E8D;
  --semantic-border-accent: #27ABB8;
  --semantic-border-layout: #E9EAEB;
  --semantic-border-input: #E9EAEB;
  --semantic-border-input-focus: #2BBCCA;

  /* Disabled */
  --semantic-disabled-primary: #A2A6B1;
  --semantic-disabled-secondary: #EBECEE;
  --semantic-disabled-text: #717680;
  --semantic-disabled-border: #D5D7DA;

  /* Error */
  --semantic-error-primary: #F04438;
  --semantic-error-hover: #D92D20;
  --semantic-error-surface: #FEF3F2;
  --semantic-error-text: #B42318;
  --semantic-error-border: #FDA29B;

  /* Warning */
  --semantic-warning-primary: #F79009;
  --semantic-warning-surface: #FFFAEB;
  --semantic-warning-text: #B54708;
  --semantic-warning-border: #FEC84B;

  /* Success */
  --semantic-success-primary: #17B26A;
  --semantic-success-surface: #ECFDF3;
  --semantic-success-text: #067647;
  --semantic-success-border: #75E0A7;

  /* Info */
  --semantic-info-primary: #4275D6;
  --semantic-info-surface: #ECF1FB;
  --semantic-info-text: #2F5398;
  --semantic-info-border: #C4D4F2;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
  background: var(--semantic-bg-primary);
  color: var(--semantic-text-primary);
  margin: 0;
  padding: 0;
}
```

## Typography

**Font**: `'Source Sans Pro', sans-serif` — always import with weights 400;600;700.

**Convention**: Default body is **16px**. Use 14px for secondary/helper text only. 12px for rare metadata.

| Kind | Size | Weight | Use Case |
|------|------|--------|----------|
| headline/large | 32px | 600 | Page titles |
| headline/medium | 28px | 600 | Section titles |
| headline/small | 24px | 600 | Card titles |
| title/large | 18px | 600 | Subsection headers |
| title/medium | 16px | 600 | Component titles |
| body/large | 16px | 400 | Default body text |
| body/small | 14px | 400 | Secondary/helper text |
| label/large | 14px | 600 | Form labels |
| label/medium | 12px | 600 | Small labels |

## Component Patterns

### Buttons

```jsx
{/* Primary */}
<button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium
  min-w-20 py-2.5 px-4 bg-[var(--semantic-primary)] text-[var(--semantic-text-inverted)]
  hover:bg-[var(--semantic-primary-hover)] transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-primary)] focus-visible:ring-offset-2
  disabled:opacity-50 disabled:pointer-events-none">
  Save Changes
</button>

{/* Outline */}
<button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium
  min-w-20 py-2.5 px-4 border border-[var(--semantic-border-primary)] bg-transparent text-[var(--semantic-text-secondary)]
  hover:bg-[var(--semantic-primary-surface)] transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-primary)] focus-visible:ring-offset-2
  disabled:opacity-50 disabled:pointer-events-none">
  Cancel
</button>

{/* Destructive */}
<button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium
  min-w-20 py-2.5 px-4 bg-[var(--semantic-error-primary)] text-[var(--semantic-text-inverted)]
  hover:bg-[var(--semantic-error-hover)] transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-error-primary)] focus-visible:ring-offset-2
  disabled:opacity-50 disabled:pointer-events-none">
  Delete
</button>
```

### Input

```jsx
{/* Default */}
<input className="h-10 w-full rounded px-4 py-2.5 text-sm
  bg-[var(--semantic-bg-primary)] text-[var(--semantic-text-primary)]
  border border-[var(--semantic-border-input)]
  placeholder:text-[var(--semantic-text-placeholder)]
  focus:outline-none focus:border-[var(--semantic-border-input-focus)]
  focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]
  disabled:cursor-not-allowed disabled:bg-[var(--semantic-disabled-secondary)] disabled:text-[var(--semantic-disabled-text)] disabled:border-[var(--semantic-disabled-border)]
  transition-all" />

{/* Error state */}
<input className="h-10 w-full rounded px-4 py-2.5 text-sm
  bg-[var(--semantic-bg-primary)] text-[var(--semantic-text-primary)]
  border border-[var(--semantic-error-border)]
  placeholder:text-[var(--semantic-text-placeholder)]
  focus:outline-none focus:border-[var(--semantic-error-primary)]
  focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]
  transition-all" />
<p className="mt-1.5 text-sm text-[var(--semantic-error-primary)]">Error message</p>
```

### Form Field with Label

```jsx
<div className="space-y-1.5">
  <label className="text-sm font-semibold leading-5 text-[var(--semantic-text-secondary)]">
    Email Address <span className="text-[var(--semantic-error-primary)]">*</span>
  </label>
  <input type="email" placeholder="you@example.com" className="/* input classes */" />
  <p className="text-xs text-[var(--semantic-text-muted)]">Helper text goes here.</p>
</div>
```

### Card

```jsx
<div className="rounded-lg border border-[var(--semantic-border-layout)] bg-[var(--semantic-bg-primary)] p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Card Title</h3>
  <p className="mt-2 text-sm text-[var(--semantic-text-muted)]">Description</p>
</div>
```

### Badge

```jsx
{/* Active */}
<span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
  bg-[var(--semantic-success-surface)] text-[var(--semantic-success-primary)]">Active</span>

{/* Failed */}
<span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
  bg-[var(--semantic-error-surface)] text-[var(--semantic-error-primary)]">Failed</span>

{/* Outline/Pending */}
<span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
  border border-[var(--semantic-border-layout)] text-[var(--semantic-text-primary)]">Pending</span>
```

### Modal/Dialog

> **Always use `z-[9999]`** — the host app's navbar sits at `z-index: 1000+`. Never use `z-50`.

```jsx
{/* Backdrop */}
<div className="fixed inset-0 z-[9999] bg-black/50" />

{/* Dialog */}
<div className="fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2
  w-full max-w-lg rounded-lg border border-[var(--semantic-border-layout)]
  bg-[var(--semantic-bg-primary)] p-6 shadow-lg">
  <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Title</h2>
  <p className="mt-1 text-sm text-[var(--semantic-text-muted)]">Description</p>
  <div className="mt-6 flex justify-end gap-2">
    {/* Outline cancel + Primary confirm */}
  </div>
  {/* Close button */}
  <button className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100
    focus:outline-none focus:ring-2 focus:ring-[var(--semantic-primary)] focus:ring-offset-2">
    ✕
  </button>
</div>
```

Sizes: `max-w-sm` / `max-w-lg` / `max-w-2xl` / `max-w-4xl`

### Table

```jsx
<div className="rounded-lg border border-[var(--semantic-border-layout)] overflow-hidden">
  <table className="w-full text-sm">
    <thead className="bg-[var(--semantic-bg-ui)]">
      <tr>
        <th className="px-4 py-3 text-left font-semibold text-[var(--semantic-text-secondary)]">Name</th>
        <th className="px-4 py-3 text-left font-semibold text-[var(--semantic-text-secondary)]">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-t border-[var(--semantic-border-layout)] hover:bg-[var(--semantic-bg-ui)] transition-colors">
        <td className="px-4 py-3 text-[var(--semantic-text-primary)]">Item Name</td>
        <td className="px-4 py-3">
          <span className="/* badge classes */">Active</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Alert

```jsx
{/* Error */}
<div className="rounded-lg border border-[var(--semantic-error-border)] bg-[var(--semantic-error-surface)] p-4">
  <div className="flex items-start gap-3">
    <div>
      <h4 className="text-sm font-semibold text-[var(--semantic-error-text)]">Error</h4>
      <p className="mt-1 text-sm text-[var(--semantic-error-text)]">Something went wrong.</p>
    </div>
  </div>
</div>

{/* Success */}
<div className="rounded-lg border border-[var(--semantic-success-border)] bg-[var(--semantic-success-surface)] p-4">
  <div className="flex items-start gap-3">
    <div>
      <h4 className="text-sm font-semibold text-[var(--semantic-success-text)]">Success</h4>
      <p className="mt-1 text-sm text-[var(--semantic-success-text)]">Changes saved.</p>
    </div>
  </div>
</div>
```

### Sidebar Navigation

```jsx
<aside className="w-64 h-screen bg-[var(--semantic-primary)] flex flex-col shrink-0">
  {/* Logo */}
  <div className="px-6 py-5 border-b border-white/10">
    <span className="text-lg font-semibold text-[var(--semantic-text-inverted)]">myOperator</span>
  </div>

  {/* Nav items */}
  <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
    {/* Active */}
    <a href="#" className="flex items-center gap-3 px-3 py-2 rounded text-sm font-medium
      bg-white/10 text-[var(--semantic-text-inverted)]">
      Dashboard
    </a>
    {/* Inactive */}
    <a href="#" className="flex items-center gap-3 px-3 py-2 rounded text-sm font-medium
      text-white/70 hover:bg-white/10 hover:text-[var(--semantic-text-inverted)] transition-colors">
      Reports
    </a>
  </nav>
</aside>
```

### Page Layout (Sidebar + Content)

```jsx
<div className="flex h-screen bg-[var(--semantic-bg-ui)]">
  {/* Sidebar */}
  <aside className="w-64 shrink-0">{/* sidebar */}</aside>

  {/* Main area */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Top bar */}
    <header className="h-16 bg-[var(--semantic-bg-primary)] border-b border-[var(--semantic-border-layout)]
      px-6 flex items-center justify-between shrink-0">
      <h1 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Page Title</h1>
      <div className="flex items-center gap-3">{/* actions */}</div>
    </header>

    {/* Scrollable content */}
    <main className="flex-1 overflow-auto p-6 space-y-6">
      {/* content */}
    </main>
  </div>
</div>
```

## Output Format

Always output complete, runnable code:

1. **Single file preferred** — inline `<style>` tag with CSS variables + JSX component
2. **Two files** for larger components — `styles.css` + `Component.jsx`
3. **Include `useState`/`useEffect`** when the UI needs interactive state
4. **Include SVG icons inline** rather than importing packages
5. **Plain JSX** by default — only TypeScript if the user asks

```jsx
// Recommended single-file structure
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap');
  :root { /* all tokens */ }
  body { font-family: 'Source Sans Pro', sans-serif; }
`;

export function MyComponent() {
  return (
    <>
      <style>{css}</style>
      {/* JSX */}
    </>
  );
}
```

## Implementation Rules

1. **Always include CSS variables** — full `:root` block in every output
2. **Never hardcode colors** — always `var(--token-name)` references
3. **z-index for overlays**: always `z-[9999]`, never `z-50`
4. **Disabled states**: use `--semantic-disabled-*` tokens, not just `opacity-50`
5. **Focus states**: `focus-visible:ring-2` on all interactive elements
6. **Transitions**: `transition-all duration-200` for hover/interactive states
7. **Border radius**: `rounded` (4px) for buttons/inputs, `rounded-lg` (8px) for cards/modals
8. **Spacing**: `p-6` cards, `py-2.5 px-4` buttons, `px-4 py-2.5` inputs

## What NOT to Do

- **No hardcoded hex colors** — always use CSS variable tokens
- **No generic fonts** — always Source Sans Pro
- **No `z-50` for modals** — must use `z-[9999]`
- **No turquoise in charts/data viz** — use primary blue-gray
- **No `rounded-full` on containers** — only on badges and avatars
- **No flashy animations** — subtle `transition-all duration-200` only
- **No heavy shadows** — `shadow-sm` for cards, `shadow-lg` for modals only

## References

- **Full primitive color scale** (50–950 steps for all palettes): `references/design-tokens.md`
- **Component catalog** (44 components, props, install commands): `references/component-catalog.md`
