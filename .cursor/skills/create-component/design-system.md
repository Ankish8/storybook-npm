# Design System Reference

Full token tables and validation rules for Phase 3 of `SKILL.md`.

## CSS Variable Token Reference

### Core (shadcn/ui) Tokens

| Context | CSS Variable | Tailwind Class | Usage |
|---------|--------------|----------------|-------|
| **Backgrounds** ||||
| Page background | `--background` | `bg-background` | Main page background |
| Foreground text | `--foreground` | `text-foreground` | Primary text on background |
| Card background | `--card` | `bg-card` | Raised surfaces |
| Card text | `--card-foreground` | `text-card-foreground` | Text on cards |
| Popover background | `--popover` | `bg-popover` | Floating elements |
| Popover text | `--popover-foreground` | `text-popover-foreground` | Text on popovers |
| **Actions** ||||
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
| **Borders & Inputs** ||||
| Border color | `--border` | `border-border` | Standard borders |
| Input border | `--input` | `border-input` | Input field borders |
| Ring color | `--ring` | `ring-ring` | Focus rings |

### Semantic (myOperator-specific) Tokens

| Context | CSS Variable | Tailwind Class | Usage |
|---------|--------------|----------------|-------|
| **Backgrounds** ||||
| Primary surface | `--semantic-bg-primary` | `bg-semantic-bg-primary` | Component backgrounds |
| UI surface | `--semantic-bg-ui` | `bg-semantic-bg-ui` | Card/panel surfaces |
| Hover state | `--semantic-bg-hover` | `bg-semantic-bg-hover` | Hover backgrounds |
| Primary action | `--semantic-primary` | `bg-semantic-primary` | Primary CTA backgrounds |
| Primary hover | `--semantic-primary-hover` | `bg-semantic-primary-hover` | Hover on primary |
| Primary surface | `--semantic-primary-surface` | `bg-semantic-primary-surface` | Light primary tint |
| **Status surfaces** ||||
| Success background | `--semantic-success-surface` | `bg-semantic-success-surface` | Success state bg |
| Error background | `--semantic-error-surface` | `bg-semantic-error-surface` | Error state bg |
| Warning background | `--semantic-warning-surface` | `bg-semantic-warning-surface` | Warning state bg |
| Info background | `--semantic-info-surface` | `bg-semantic-info-surface` | Info state bg |
| **Text** ||||
| Primary text | `--semantic-text-primary` | `text-semantic-text-primary` | Main content |
| Secondary text | `--semantic-text-secondary` | `text-semantic-text-secondary` | Supporting text |
| Muted text | `--semantic-text-muted` | `text-semantic-text-muted` | Disabled/placeholder |
| Inverted text | `--semantic-text-inverted` | `text-semantic-text-inverted` | Text on dark bg |
| Link text | `--semantic-text-link` | `text-semantic-text-link` | Interactive links |
| **Status text** ||||
| Success | `--semantic-success-primary` | `text-semantic-success-primary` | Success messages |
| Error | `--semantic-error-primary` | `text-semantic-error-primary` | Error messages |
| Warning | `--semantic-warning-primary` | `text-semantic-warning-primary` | Warning messages |
| **Borders** ||||
| Layout border | `--semantic-border-layout` | `border-semantic-border-layout` | Container borders |
| Input border | `--semantic-border-input` | `border-semantic-border-input` | Form field borders |
| Focus border | `--semantic-border-focus` | `border-semantic-border-focus` | Focus indicators |

## Figma → Token Mapping

```
#343E55 (dark blue)   → bg-semantic-primary / bg-primary       (primary actions)
#F5F5F5 (light gray)  → bg-semantic-bg-ui                      (surfaces)
#717680 (medium gray) → text-semantic-text-muted               (secondary text)
#F04438 (red)         → text-semantic-error-primary            (errors)
#17B26A (green)       → text-semantic-success-primary          (success)
#E9EAEB (border gray) → border-semantic-border-layout          (borders)
#4275D6 (blue)        → text-semantic-text-link                (links)
#F3F4F6 (light gray)  → bg-muted / bg-secondary                (disabled/secondary)
#FFFFFF (white)       → text-primary-foreground / text-semantic-text-inverted
```

**Mapping algorithm:**
1. Identify the color's **purpose** in the design (button bg, text, border, etc.)
2. Match to the closest token by purpose — not by hue
3. Verify the token exists: `grep -- "--semantic-<name>" src/index.css`
4. If not found, search for alternatives: `grep "success" src/index.css`

## Prohibited Patterns

```tsx
// ❌ Hardcoded hex
className="bg-[#343E55] text-[#FFFFFF]"

// ❌ Hardcoded Tailwind colors
className="bg-gray-50 text-gray-900"

// ❌ Hardcoded RGB/HSL
className="bg-[rgb(52,62,85)]"

// ❌ Named colors
className="bg-white text-black"
```

## Accessibility Requirements

**Focus states:**
```tsx
className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
// or keyboard-only:
className="focus-visible:ring-2 focus-visible:ring-ring"
```

**ARIA attributes:**
```tsx
<button aria-label="Close dialog">
<input aria-invalid={hasError} aria-describedby="error-message">
<div role="alert" aria-live="polite">
```

**Custom interactive elements must have keyboard support:**
```tsx
// ✅ Correct
<div role="button" tabIndex={0} onKeyDown={handleKeyPress} onClick={...}>

// ❌ Wrong
<div onClick={...}>
```

## Typography Tokens

| Class | Size | Use |
|-------|------|-----|
| `text-sm` | 14px | Captions, labels |
| `text-base` | 16px | Default body |
| `text-lg` | 18px | Large body |
| `text-xl` | 20px | Headings |
| `text-2xl` | 24px | Section headers |

| Class | Weight | Use |
|-------|--------|-----|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Emphasized text |
| `font-semibold` | 600 | Headings |
| `font-bold` | 700 | Strong emphasis |
