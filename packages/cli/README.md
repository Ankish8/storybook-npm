# myOperator UI

CLI for adding myOperator UI components to your React project.

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
- Create/update your global CSS with theme CSS variables
- Create/update `tailwind.config.js` with theme color mappings
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
```

## Available Components

- `button` - A customizable button with variants, sizes, icons, and loading state

## Requirements

- React 18+
- Tailwind CSS
- TypeScript (recommended)

## Dependencies

Components use these packages:
- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`
- `tailwindcss-animate`

## CSS Variables & Theming

Components use CSS variables for theming. The `init` command automatically sets up these variables in your global CSS file.

### Theme Colors

The following semantic colors are available:

| Variable | Description |
|----------|-------------|
| `--background` | Page background |
| `--foreground` | Default text color |
| `--primary` | Primary brand color |
| `--secondary` | Secondary color |
| `--destructive` | Error/danger color |
| `--muted` | Muted backgrounds |
| `--accent` | Accent color |
| `--border` | Border color |
| `--ring` | Focus ring color |

### Dark Mode

Dark mode is supported via the `.dark` class on the root element. The CSS variables automatically switch to dark theme values.

### Customizing Theme

To customize colors, edit the CSS variables in your global CSS file:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  /* ... other variables */
}
```

Colors use HSL format without the `hsl()` wrapper (e.g., `222.2 47.4% 11.2%`).

## PostCSS Configuration

This CLI automatically sets up the correct PostCSS configuration for Tailwind CSS. The new Tailwind CSS versions require the `@tailwindcss/postcss` plugin instead of the old `tailwindcss` plugin.

### Correct PostCSS Config

```javascript
// postcss.config.js
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
The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS
you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

**Fix it by:**

1. Installing the new plugin:
   ```bash
   npm install -D @tailwindcss/postcss
   ```

2. Updating your `postcss.config.js` to use the new plugin (see above)

Running `npx myoperator-ui init` will automatically create the correct configuration for you.

## License

MIT
