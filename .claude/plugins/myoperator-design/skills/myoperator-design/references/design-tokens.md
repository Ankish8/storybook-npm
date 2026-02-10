# myOperator Design Tokens — Complete Reference

## Complete CSS Variables Block

Copy this into any project to use myOperator design tokens:

```css
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap');

:root {
  /* =========================================================================
     PRIMITIVE COLORS
     ========================================================================= */

  /* Base */
  --color-white: #FFFFFF;
  --color-black: #000000;

  /* Neutral (Gray) */
  --color-neutral-25: #FDFDFD;
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
  --color-neutral-950: #0A0D12;

  /* Primary (Blue Gray) */
  --color-primary-25: #F9FAFB;
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
  --color-primary-950: #0C0F12;

  /* Secondary (Turquoise) - Brand */
  --color-secondary-25: #F6FCFD;
  --color-secondary-50: #EAF8FA;
  --color-secondary-100: #BDEAEF;
  --color-secondary-200: #9DE0E7;
  --color-secondary-300: #71D2DB;
  --color-secondary-400: #55C9D5;
  --color-secondary-500: #2BBCCA;
  --color-secondary-600: #27ABB8;
  --color-secondary-700: #1F858F;
  --color-secondary-800: #18676F;
  --color-secondary-900: #124F55;
  --color-secondary-950: #0F3D3D;

  /* Error (Red) */
  --color-error-25: #FFFBFA;
  --color-error-50: #FEF3F2;
  --color-error-100: #FEE4E2;
  --color-error-200: #FECDCA;
  --color-error-300: #FDA29B;
  --color-error-400: #F97066;
  --color-error-500: #F04438;
  --color-error-600: #D92D20;
  --color-error-700: #B42318;
  --color-error-800: #912018;
  --color-error-900: #7A271A;
  --color-error-950: #55160C;

  /* Warning (Amber) */
  --color-warning-25: #FFFCF5;
  --color-warning-50: #FFFAEB;
  --color-warning-100: #FEF0C7;
  --color-warning-200: #FEDF89;
  --color-warning-300: #FEC84B;
  --color-warning-400: #FDB022;
  --color-warning-500: #F79009;
  --color-warning-600: #DC6803;
  --color-warning-700: #B54708;
  --color-warning-800: #93370D;
  --color-warning-900: #7A2E0E;
  --color-warning-950: #4E1D09;

  /* Success (Green) */
  --color-success-25: #F6FEF9;
  --color-success-50: #ECFDF3;
  --color-success-100: #DCFAE6;
  --color-success-200: #ABEFC6;
  --color-success-300: #75E0A7;
  --color-success-400: #47CD89;
  --color-success-500: #17B26A;
  --color-success-600: #079455;
  --color-success-700: #067647;
  --color-success-800: #085D3A;
  --color-success-900: #074D31;
  --color-success-950: #053321;

  /* Info (Blue) */
  --color-info-25: #F6F8FD;
  --color-info-50: #ECF1FB;
  --color-info-100: #C4D4F2;
  --color-info-200: #A8C0EC;
  --color-info-300: #80A3E4;
  --color-info-400: #6891DE;
  --color-info-500: #4275D6;
  --color-info-600: #3C6AC3;
  --color-info-700: #2F5398;
  --color-info-800: #244076;
  --color-info-900: #1C315A;
  --color-info-950: #182A44;

  /* =========================================================================
     SEMANTIC TOKENS
     ========================================================================= */

  /* Primary UI */
  --semantic-primary: var(--color-primary-500);
  --semantic-primary-hover: var(--color-primary-600);
  --semantic-primary-selected: var(--color-primary-300);
  --semantic-primary-highlighted: var(--color-primary-700);
  --semantic-primary-surface: var(--color-primary-50);

  /* Brand (Turquoise) */
  --semantic-brand: var(--color-secondary-500);
  --semantic-brand-hover: var(--color-secondary-700);
  --semantic-brand-selected: var(--color-secondary-300);
  --semantic-brand-surface: var(--color-secondary-50);

  /* Backgrounds */
  --semantic-bg-primary: var(--color-white);
  --semantic-bg-secondary: var(--color-primary-950);
  --semantic-bg-ui: var(--color-neutral-100);
  --semantic-bg-grey: var(--color-neutral-200);
  --semantic-bg-hover: var(--color-neutral-300);
  --semantic-bg-inverted: var(--color-black);

  /* Text */
  --semantic-text-primary: var(--color-neutral-900);
  --semantic-text-secondary: var(--color-primary-500);
  --semantic-text-muted: var(--color-neutral-500);
  --semantic-text-placeholder: var(--color-primary-200);
  --semantic-text-link: var(--color-info-500);
  --semantic-text-inverted: var(--color-white);

  /* Borders */
  --semantic-border-primary: var(--color-primary-500);
  --semantic-border-secondary: var(--color-primary-300);
  --semantic-border-accent: var(--color-secondary-600);
  --semantic-border-layout: var(--color-neutral-200);
  --semantic-border-input: var(--color-neutral-200);
  --semantic-border-input-focus: var(--color-secondary-500);

  /* Disabled */
  --semantic-disabled-primary: var(--color-primary-200);
  --semantic-disabled-secondary: var(--color-primary-50);
  --semantic-disabled-text: var(--color-neutral-500);
  --semantic-disabled-border: var(--color-neutral-300);

  /* Error */
  --semantic-error-primary: var(--color-error-500);
  --semantic-error-surface: var(--color-error-50);
  --semantic-error-text: var(--color-error-700);
  --semantic-error-border: var(--color-error-300);
  --semantic-error-hover: var(--color-error-600);

  /* Warning */
  --semantic-warning-primary: var(--color-warning-500);
  --semantic-warning-surface: var(--color-warning-50);
  --semantic-warning-text: var(--color-warning-700);
  --semantic-warning-border: var(--color-warning-300);

  /* Success */
  --semantic-success-primary: var(--color-success-500);
  --semantic-success-surface: var(--color-success-50);
  --semantic-success-text: var(--color-success-700);
  --semantic-success-border: var(--color-success-300);

  /* Info */
  --semantic-info-primary: var(--color-info-500);
  --semantic-info-surface: var(--color-info-50);
  --semantic-info-text: var(--color-info-700);
  --semantic-info-border: var(--color-info-200);
}

body {
  font-family: 'Source Sans Pro', sans-serif;
  background: var(--semantic-bg-primary);
  color: var(--semantic-text-primary);
  margin: 0;
  padding: 0;
}
```

## Component Examples

### Primary Button

```jsx
<button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-w-20 py-2.5 px-4 bg-[var(--semantic-primary)] text-[var(--semantic-text-inverted)] hover:bg-[var(--semantic-primary-hover)] focus-visible:ring-[var(--semantic-primary)]">
  Save Changes
</button>
```

### Outline Button

```jsx
<button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-w-20 py-2.5 px-4 border border-[var(--semantic-border-primary)] bg-transparent text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-primary-surface)]">
  Cancel
</button>
```

### Destructive Button

```jsx
<button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-w-20 py-2.5 px-4 bg-[var(--semantic-error-primary)] text-[var(--semantic-text-inverted)] hover:bg-[var(--semantic-error-hover)] focus-visible:ring-[var(--semantic-error-primary)]">
  Delete
</button>
```

### Text Input

```jsx
<input
  type="text"
  placeholder="Enter your email"
  className="h-10 w-full rounded px-4 py-2.5 text-sm transition-all bg-[var(--semantic-bg-primary)] text-[var(--semantic-text-primary)] border border-[var(--semantic-border-input)] placeholder:text-[var(--semantic-text-placeholder)] focus:outline-none focus:border-[var(--semantic-border-input-focus)] focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]"
/>
```

### Input with Error

```jsx
<input
  type="text"
  className="h-10 w-full rounded px-4 py-2.5 text-sm transition-all bg-[var(--semantic-bg-primary)] text-[var(--semantic-text-primary)] border border-[var(--semantic-error-primary)]/40 placeholder:text-[var(--semantic-text-placeholder)] focus:outline-none focus:border-[var(--semantic-error-primary)]/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]"
/>
<p className="mt-1.5 text-sm text-[var(--semantic-error-primary)]">This field is required</p>
```

### Card

```jsx
<div className="rounded-lg border border-[var(--semantic-border-layout)] bg-[var(--semantic-bg-primary)] p-6 shadow-sm">
  <h3 className="text-lg font-semibold leading-none tracking-tight text-[var(--semantic-text-primary)]">
    Card Title
  </h3>
  <p className="mt-2 text-sm text-[var(--semantic-text-muted)]">
    Card description or content goes here.
  </p>
</div>
```

### Badge - Active

```jsx
<span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium bg-[var(--semantic-success-surface)] text-[var(--semantic-success-primary)]">
  Active
</span>
```

### Badge - Failed

```jsx
<span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium bg-[var(--semantic-error-surface)] text-[var(--semantic-error-primary)]">
  Failed
</span>
```

### Badge - Outline

```jsx
<span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium border border-[var(--semantic-border-layout)] bg-transparent text-[var(--semantic-text-primary)]">
  Pending
</span>
```

### Table

```jsx
<div className="rounded-lg border border-[var(--semantic-border-layout)] overflow-hidden">
  <table className="w-full text-sm">
    <thead className="bg-[var(--semantic-bg-ui)]">
      <tr>
        <th className="px-4 py-3 text-left font-semibold text-[var(--semantic-text-secondary)]">Name</th>
        <th className="px-4 py-3 text-left font-semibold text-[var(--semantic-text-secondary)]">Status</th>
        <th className="px-4 py-3 text-left font-semibold text-[var(--semantic-text-secondary)]">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-t border-[var(--semantic-border-layout)] hover:bg-[var(--semantic-bg-ui)] transition-colors">
        <td className="px-4 py-3 text-[var(--semantic-text-primary)]">Item Name</td>
        <td className="px-4 py-3">
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-[var(--semantic-success-surface)] text-[var(--semantic-success-primary)]">Active</span>
        </td>
        <td className="px-4 py-3">
          <button className="text-sm text-[var(--semantic-text-link)] hover:underline">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Modal/Dialog

```jsx
{/* Backdrop */}
<div className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0" />

{/* Dialog */}
<div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-lg border border-[var(--semantic-border-layout)] bg-[var(--semantic-bg-primary)] p-6 shadow-lg animate-in fade-in-0 zoom-in-95">
  <div className="flex flex-col space-y-1.5">
    <h2 className="text-lg font-semibold leading-none tracking-tight text-[var(--semantic-text-primary)]">
      Dialog Title
    </h2>
    <p className="text-sm text-[var(--semantic-text-muted)]">
      Dialog description goes here.
    </p>
  </div>

  <div className="mt-4">
    {/* Dialog content */}
  </div>

  <div className="mt-6 flex justify-end gap-2">
    <button className="...outline button classes...">Cancel</button>
    <button className="...primary button classes...">Confirm</button>
  </div>

  {/* Close button */}
  <button className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--semantic-primary)] focus:ring-offset-2">
    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </button>
</div>
```

### Form Field with Label

```jsx
<div className="space-y-1.5">
  <label className="text-sm font-semibold leading-5 text-[var(--semantic-text-secondary)]">
    Email Address
  </label>
  <input
    type="email"
    placeholder="you@example.com"
    className="h-10 w-full rounded px-4 py-2.5 text-sm transition-all bg-[var(--semantic-bg-primary)] text-[var(--semantic-text-primary)] border border-[var(--semantic-border-input)] placeholder:text-[var(--semantic-text-placeholder)] focus:outline-none focus:border-[var(--semantic-border-input-focus)] focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
  />
  <p className="text-xs text-[var(--semantic-text-muted)]">
    We'll never share your email with anyone else.
  </p>
</div>
```

### Alert - Error

```jsx
<div className="rounded-lg border border-[var(--semantic-error-border)] bg-[var(--semantic-error-surface)] p-4">
  <div className="flex items-start gap-3">
    <svg className="h-5 w-5 text-[var(--semantic-error-primary)] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <div>
      <h4 className="text-sm font-semibold text-[var(--semantic-error-text)]">Error</h4>
      <p className="mt-1 text-sm text-[var(--semantic-error-text)]">
        Something went wrong. Please try again.
      </p>
    </div>
  </div>
</div>
```

### Alert - Success

```jsx
<div className="rounded-lg border border-[var(--semantic-success-border)] bg-[var(--semantic-success-surface)] p-4">
  <div className="flex items-start gap-3">
    <svg className="h-5 w-5 text-[var(--semantic-success-primary)] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
    <div>
      <h4 className="text-sm font-semibold text-[var(--semantic-success-text)]">Success</h4>
      <p className="mt-1 text-sm text-[var(--semantic-success-text)]">
        Your changes have been saved successfully.
      </p>
    </div>
  </div>
</div>
```

## Spacing Reference

| Token | Value | Use Case |
|-------|-------|----------|
| p-1 | 4px | Tight spacing |
| p-2 | 8px | Compact elements |
| p-3 | 12px | Button padding (sm) |
| p-4 | 16px | Card padding, standard spacing |
| p-6 | 24px | Modal padding, generous spacing |
| p-8 | 32px | Section spacing |
| gap-2 | 8px | Icon + text |
| gap-4 | 16px | Form fields |
| gap-6 | 24px | Section separation |

## Shadow Reference

| Class | Use Case |
|-------|----------|
| shadow-sm | Cards, subtle elevation |
| shadow | Dropdowns, moderate elevation |
| shadow-lg | Modals, high elevation |

## Border Radius Reference

| Class | Value | Use Case |
|-------|-------|----------|
| rounded | 4px | Buttons, inputs, small elements |
| rounded-md | 6px | Slightly larger elements |
| rounded-lg | 8px | Cards, modals, large containers |
| rounded-full | 9999px | Badges, avatars, pills |
