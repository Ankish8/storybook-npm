# myOperator UI

A React component library with CLI tooling for easy integration. Built with Tailwind CSS, fully compatible with Bootstrap projects.

## Installation

```bash
# Initialize in your project
npx myoperator-ui init

# Add components
npx myoperator-ui add button badge table
```

## Usage

```tsx
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function App() {
  return (
    <div>
      <Button variant="default" size="md">
        Click me
      </Button>
      <Badge variant="active">Active</Badge>
    </div>
  )
}
```

## CLI Commands

```bash
# Initialize project with Tailwind config
npx myoperator-ui init

# Add specific components
npx myoperator-ui add button
npx myoperator-ui add button badge table

# Interactive component selection
npx myoperator-ui add

# Update components to latest version
npx myoperator-ui@latest update button
npx myoperator-ui@latest update --all

# Preview updates without applying
npx myoperator-ui@latest update --all --dry-run
```

See [CLI documentation](packages/cli/README.md) for full command reference.

## Bootstrap Compatibility

The CLI automatically detects Bootstrap and configures Tailwind to avoid style conflicts. All components use the `tw-` prefix by default.

## Development

```bash
# Install dependencies
npm install

# Run Storybook
npm run storybook

# Run tests
npm test

# Build CLI
cd packages/cli && npm run build
```

## Project Structure

```
src/components/ui/       # Source components
packages/cli/            # CLI package (myoperator-ui)
scripts/                 # Build and development scripts
```

## Requirements

- React 18+
- Tailwind CSS v3 or v4
- TypeScript (recommended)

## License

MIT
