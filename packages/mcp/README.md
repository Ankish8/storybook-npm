# myOperator MCP Server

Model Context Protocol (MCP) server for the myOperator UI component library. Enables AI assistants like Claude, Cursor, and VSCode Copilot to browse and install components using natural language.

[![npm version](https://badge.fury.io/js/myoperator-mcp.svg)](https://www.npmjs.com/package/myoperator-mcp)

## Quick Start

```bash
npx myoperator-mcp
```

## Features

- **Natural Language Installation** - Say "add a login form" and it installs the right components
- **Component Discovery** - Browse all available components
- **Metadata & Props** - Get component details, variants, and code examples
- **shadcn-style CLI** - Uses `npx myoperator-ui add <component>`

## Installation & Setup

### Cursor (One-Click Install)

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.png)](cursor://anysphere.cursor-deeplink/mcp/install?name=myoperator&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIm15b3BlcmF0b3ItbWNwIl19)

> **Note:** The button above works when viewing this README locally or in an app that supports `cursor://` links. If it doesn't work, copy this link and paste in your browser:
> ```
> cursor://anysphere.cursor-deeplink/mcp/install?name=myoperator&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIm15b3BlcmF0b3ItbWNwIl19
> ```

Or manually edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "myoperator": {
      "command": "npx",
      "args": ["-y", "myoperator-mcp"]
    }
  }
}
```

### Claude Code

Run this command in your terminal:

```bash
claude mcp add myoperator -- npx -y myoperator-mcp
```

Or manually add to `~/.claude.json`:

```json
{
  "mcpServers": {
    "myoperator": {
      "command": "npx",
      "args": ["-y", "myoperator-mcp"]
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "myoperator": {
      "command": "npx",
      "args": ["-y", "myoperator-mcp"]
    }
  }
}
```

### VSCode (with GitHub Copilot)

Add to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "myoperator": {
      "command": "npx",
      "args": ["-y", "myoperator-mcp"]
    }
  }
}
```

Or use Command Palette → "MCP: Add Server"

---

## Available Tools

| Tool | Description |
|------|-------------|
| `list-components` | Browse all available components |
| `get-component-metadata` | Get props, variants, and code examples |
| `init-project` | Initialize project for myOperator UI |
| `install-component` | **Install components using natural language** |

---

## Natural Language Installation

The `install-component` tool understands natural language. Ask your AI assistant:

### Form Components
> "Add a login form"
> → Installs: text-field, button, checkbox

> "I need a settings form"
> → Installs: text-field, toggle, select-field, button

> "Add a search form"
> → Installs: input, button

### Multiple Components
> "Install button, input, and select"
> → Installs all three components

> "Add table and badge"
> → Installs both components

### Specific Components
> "Add button"
> → Installs: button

> "Install the dropdown menu"
> → Installs: dropdown-menu

### Context-Aware
> "I need a data table with status badges"
> → Installs: table, badge

> "Add an accordion section"
> → Installs: accordion

---

## Usage Examples

### Browse Components

> "What components are available in myOperator UI?"

> "List all the UI components"

### Component Details

> "Show me the Button component props and variants"

> "What are the size options for TextField?"

### Install Components

> "Initialize my project for myOperator UI"

> "Add a login form" *(installs text-field, button, checkbox)*

> "Install the Table component"

---

## Components

| Component | Description |
|-----------|-------------|
| **Accordion** | Expandable/collapsible sections with single or multiple mode |
| **Badge** | Status badges (active, failed, disabled, outline, secondary, destructive) with asChild |
| **Button** | 7 variants, 6 sizes (including icon-lg), loading states, icons |
| **Checkbox** | Tri-state checkbox built on Radix UI with labels |
| **DropdownMenu** | Radix-based with keyboard navigation |
| **Input** | Text input with state variants |
| **MultiSelect** | Multi-select with tags and search |
| **Select** | Composable Radix-based dropdown |
| **SelectField** | Form select with label and validation |
| **Switch** | Switch component built on Radix UI for boolean inputs |
| **Table** | Composable table with loading skeleton |
| **Tag** | Event labels with bold prefix, interactive |
| **TextField** | Form input with label, icons, validation |

---

## Development

```bash
# Clone the repository
git clone https://github.com/Ankish8/storybook-npm.git
cd storybook-npm/packages/mcp

# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run dev

# Test locally
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node dist/index.js
```

---

## Related

- [myoperator-ui](https://www.npmjs.com/package/myoperator-ui) - CLI for adding myOperator UI components
- [Model Context Protocol](https://modelcontextprotocol.io/) - Open standard for AI-tool integration

## License

MIT
