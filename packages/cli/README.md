# myOperator UI

CLI for adding myOperator UI components to your React project. Works with both standalone projects and projects that use Bootstrap or other CSS frameworks.

## Quick Start

```bash
# Initialize your project
npx myoperator-ui init

# Add a component
npx myoperator-ui add button
```

## Commands

### `init` - Initialize Project

```bash
npx myoperator-ui init
```

This will:
- Create a `components.json` configuration file
- Set up the utils file with the `cn` helper
- Create the components directory
- Create/update your global CSS (`App.scss`) with Tailwind imports
- Create/update `postcss.config.js` with the correct Tailwind CSS PostCSS plugin
- Configure Tailwind with `tw-` prefix by default

### `add` - Add Components

```bash
# Add a specific component
npx myoperator-ui add button

# Add multiple components
npx myoperator-ui add button badge table

# Add all available components at once
npx myoperator-ui add --all

# Interactive selection (shows all available components)
npx myoperator-ui add
```

**Options:**

| Option | Short | Description |
|--------|-------|-------------|
| `--all` | `-a` | Add all available components |
| `--yes` | `-y` | Skip confirmation prompt |
| `--overwrite` | `-o` | Overwrite existing files |
| `--path <path>` | `-p` | Custom path (default: `src/components/ui`) |

**Examples:**

```bash
# Add all components at once
npx myoperator-ui add --all

# Add all components, skip confirmation
npx myoperator-ui add --all -y

# Skip confirmation
npx myoperator-ui add button -y

# Overwrite existing component
npx myoperator-ui add button --overwrite

# Add to custom directory
npx myoperator-ui add button -p src/ui
```

### `update` - Update Components

Safely update installed components to the latest version with diff preview.

**Important:** Always use `@latest` to ensure you get the newest component code:

```bash
# Update a specific component (recommended)
npx myoperator-ui@latest update button

# Update multiple components
npx myoperator-ui@latest update button badge

# Interactive selection (shows installed components)
npx myoperator-ui@latest update

# Update all installed components
npx myoperator-ui@latest update --all
```

**Options:**

| Option | Short | Description |
|--------|-------|-------------|
| `--yes` | `-y` | Skip confirmation prompt |
| `--all` | `-a` | Update all installed components |
| `--dry-run` | `-d` | Preview changes without modifying files |
| `--backup` | `-b` | Create backup files before updating |
| `--path <path>` | `-p` | Custom path (default: `src/components/ui`) |

**Examples:**

```bash
# Preview what would change (safe - no modifications)
npx myoperator-ui@latest update button --dry-run

# Preview all component updates
npx myoperator-ui@latest update --all --dry-run

# Update all with backups
npx myoperator-ui@latest update --all --backup

# Force update without confirmation
npx myoperator-ui@latest update button -y
```

> **Note:** If you see "No changes" but expect updates, make sure you're using `@latest` to get the newest package version. NPX may cache older versions.

**Update Safeguards:**
- Shows diff of changes before applying
- `--dry-run` lets you preview without making changes
- `--backup` creates timestamped backups (e.g., `button.tsx.backup.1700000000`)
- Only updates components that are already installed
- Skips components with no changes

### Other Commands

```bash
# Check CLI version
npx myoperator-ui --version

# Get help
npx myoperator-ui --help
npx myoperator-ui add --help
npx myoperator-ui update --help
```

## Available Components

| Component | Description |
|-----------|-------------|
| `accordion` | Expandable/collapsible accordion component with single or multiple mode support |
| `badge` | Status badge with active, failed, disabled, outline, secondary, destructive variants and asChild support |
| `button` | Customizable button with variants, sizes (including icon-lg), icons, and loading state |
| `checkbox` | Tri-state checkbox built on Radix UI with label support (checked, unchecked, indeterminate) |
| `dropdown-menu` | Dropdown menu for displaying actions and options |
| `input` | Basic input component |
| `multi-select` | Multi-select dropdown with search, tags, and keyboard navigation |
| `select` | Single select dropdown component |
| `select-field` | Select field with label, helper text, and validation states |
| `switch` | Switch component built on Radix UI for boolean inputs with on/off states |
| `table` | Composable table with size variants, loading/empty states, sticky columns |
| `tag` | Tag component for event labels with optional bold label prefix |
| `text-field` | Text input with label, icons, prefix/suffix, validation states, and character count |

## Configuration

After running `init`, a `components.json` file is created:

```json
{
  "$schema": "https://myoperator.com/schema.json",
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/App.scss",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": "tw-"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## Tailwind CSS Configuration

The CLI generates a `tailwind.config.js` with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  prefix: "tw-",
  content: ["./src/components/ui/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // ... theme configuration
  },
  plugins: [require("tailwindcss-animate")],
}
```

**Key Features:**
- `prefix: "tw-"` - Avoids conflicts with other CSS frameworks
- Scoped content path - Only scans UI components directory

## Bootstrap Compatibility

myOperator UI automatically detects if your project uses Bootstrap and configures Tailwind CSS to avoid conflicts.

### How it works

When Bootstrap is detected, the CLI uses selective Tailwind imports - importing only theme and utilities, skipping Preflight (Tailwind's CSS reset) which would override Bootstrap's base styles.

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

## Requirements

- React 18+
- Tailwind CSS v3 or v4
- TypeScript (recommended)

## Dependencies

Components use these packages (installed automatically during `init`):

```bash
npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot lucide-react
```

For Tailwind v3, you'll also need:
- `tailwindcss-animate`

## PostCSS Configuration

The CLI automatically sets up the correct PostCSS configuration for Tailwind CSS.

### For Tailwind v4

```javascript
// postcss.config.js
export default {
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

### Component styles not applying

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
npx myoperator-ui@latest init
```

### Updating components

To get the latest component updates:

```bash
# Preview changes first
npx myoperator-ui update --all --dry-run

# Then apply updates
npx myoperator-ui update --all
```

## Development Workflow (For Maintainers)

### Safe Component Updates

To ensure changes don't accidentally break other components:

```bash
cd packages/cli

# 1. Create a snapshot BEFORE making changes
npm run integrity:snapshot

# 2. Make your changes to a component (e.g., button.tsx)

# 3. Verify only the intended component changed
node scripts/check-integrity.js verify button

# 4. If check passes, build and publish
npm run build
npm publish
```

### Integrity Check Commands

```bash
# Create baseline snapshot of all components
npm run integrity:snapshot

# Verify no unexpected changes
npm run integrity:verify

# Verify specific component changed (others unchanged)
node scripts/check-integrity.js verify button

# Verify multiple components changed
node scripts/check-integrity.js verify button badge

# Check status of a specific component
node scripts/check-integrity.js diff button
```

### What the Integrity Check Does

1. **Creates MD5 hashes** of each component file
2. **Compares current state** against the snapshot
3. **Fails if unexpected changes** are detected
4. **Passes if only expected components** changed

Example output when an unexpected change is detected:

```
Component Status:
──────────────────────────────────────────────────
  ✓ badge - unchanged
  ✓ button - changed (expected)
  ⚠️  table - CHANGED (unexpected!)
  ✓ tag - unchanged

❌ INTEGRITY CHECK FAILED
   Unexpected changes detected in: table
```

## License

MIT
