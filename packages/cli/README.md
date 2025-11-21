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

Components use these packages (installed automatically):
- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`

## License

MIT
