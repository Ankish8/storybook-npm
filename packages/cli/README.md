# myOperator UI

CLI for adding myOperator UI components to your React project. Works with both standalone projects and projects that use Bootstrap or other CSS frameworks.

## Installation

```bash
npx myoperator-ui init
```

## Usage

### Initialize your project

```bash
npx myoperator-ui init
```

This will:
- Create a `components.json` configuration file
- Set up the utils file with the `cn` helper
- Create the components directory
- Create/update your global CSS with Tailwind imports
- Create/update `postcss.config.js` with the correct Tailwind CSS PostCSS plugin

### Add components

```bash
# Add a specific component
npx myoperator-ui add button

# Add multiple components
npx myoperator-ui add button input card

# Interactive selection
npx myoperator-ui add
```

### Options

```bash
# Skip confirmation
npx myoperator-ui add button -y

# Overwrite existing files
npx myoperator-ui add button --overwrite

# Custom path
npx myoperator-ui add button -p src/ui

# Check version
npx myoperator-ui --version
```

## Bootstrap Compatibility

myOperator UI automatically detects if your project uses Bootstrap and configures Tailwind CSS to avoid conflicts.

### How it works

When Bootstrap is detected, the CLI:

1. **Uses selective Tailwind imports** - Imports only theme and utilities, skipping Preflight (Tailwind's CSS reset) which would override Bootstrap's base styles

2. **No class name conflicts** - Tailwind utility classes like `bg-[#343E55]`, `flex`, `p-4` don't overlap with Bootstrap classes like `btn`, `container`, `row`

### Generated CSS for Bootstrap projects

```css
/* Selective imports to avoid Preflight conflicts with Bootstrap */
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);

/* Tell Tailwind to scan component files for utility classes */
@source "./components/**/*.{js,ts,jsx,tsx}";
@source "./lib/**/*.{js,ts,jsx,tsx}";
```

### Note on Prefixes

Tailwind CSS v4's `prefix()` option only works with the full `@import "tailwindcss"` which includes Preflight. Since Bootstrap compatibility requires skipping Preflight, prefixes are not available for Bootstrap projects.

## Tailwind CSS Version Support

### Tailwind CSS v4 (default)

For v4 projects, the CLI generates CSS-based configuration:

```css
@import "tailwindcss";

@theme {
  --color-primary: hsl(222.2 47.4% 11.2%);
  /* ... */
}
```

### Tailwind CSS v3

For v3 projects, the CLI generates the traditional configuration with `tailwind.config.js` and CSS variables.

## Available Components

- `button` - A customizable button with variants, sizes, icons, and loading state

## Requirements

- React 18+
- Tailwind CSS v3 or v4
- TypeScript (recommended)

## Dependencies

Components use these packages:
- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`

For Tailwind v3, you'll also need:
- `tailwindcss-animate`

## PostCSS Configuration

This CLI automatically sets up the correct PostCSS configuration for Tailwind CSS.

### For Tailwind v4

```javascript
// postcss.config.js (ESM)
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

// postcss.config.js (CommonJS)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### Common Error

If you see this error:

```
[plugin:vite:css] [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
```

**Fix it by:**

1. Installing the new plugin:
   ```bash
   npm install -D @tailwindcss/postcss
   ```

2. Run `npx myoperator-ui init` to automatically create the correct configuration

## Troubleshooting

### Button styles not applying

Make sure you've installed the required dependencies:

```bash
npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot lucide-react
```

### Styles conflict with Bootstrap

If you're seeing Bootstrap styles override your components, make sure:

1. You ran `npx myoperator-ui init` after adding Bootstrap
2. The CSS file has selective imports (not `@import "tailwindcss"`)

### Version mismatch

To ensure you're using the latest version:

```bash
npx --yes myoperator-ui@latest init
```

## License

MIT
