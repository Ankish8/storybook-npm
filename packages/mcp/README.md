# myOperator MCP Server

Model Context Protocol (MCP) server for the myOperator UI component library. Enables AI assistants like Claude, Cursor, and VSCode Copilot to access component metadata, code examples, and design tokens.

[![npm version](https://badge.fury.io/js/myoperator-mcp.svg)](https://www.npmjs.com/package/myoperator-mcp)

## Quick Start

```bash
npx myoperator-mcp
```

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

3. Restart Cursor

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

### Component Discovery
| Tool | Description |
|------|-------------|
| `list-components` | List all available components with descriptions |
| `get-component-metadata` | Get props, variants, dependencies for a component |
| `get-component-examples` | Get React code examples |
| `get-component-source` | Get full source code (copy/paste ready) |

### Installation (like shadcn)
| Tool | Description |
|------|-------------|
| `init-project` | Initialize project for myOperator UI (runs CLI) |
| `install-component` | Install a component via CLI |

### Design System
| Tool | Description |
|------|-------------|
| `list-design-tokens` | List design tokens (colors, spacing, radius, typography) |
| `get-component-accessibility` | Get accessibility guidelines and ARIA attributes |
| `get-installation-info` | Get npm package info and setup instructions |

---

## Usage Examples

Once installed, ask your AI assistant:

### Component Discovery

> "What components are available in myOperator UI?"

> "List all the UI components I can use"

### Component Details

> "Show me the Button component props and variants"

> "What are the size options for the Badge component?"

> "How do I use the Table component with loading state?"

### Code Examples

> "Give me a code example for a Button with an icon"

> "Show me how to create a dropdown menu"

> "How do I make an interactive Tag component?"

### Design Tokens

> "What color tokens are available?"

> "List all spacing values in the design system"

> "What's the primary brand color?"

### Accessibility

> "What accessibility features does the DropdownMenu have?"

> "How do I make the Button accessible for screen readers?"

> "What keyboard shortcuts does the Table support?"

### Source Code (NEW)

> "Give me the full Button component source code"

> "Get the utils.ts file I need"

> "Get the CSS styles for the design system"

### Installation (like shadcn)

> "Initialize my project for myOperator UI"

> "Install the Button component"

> "Add badge and table components to my project"

---

## Components

The MCP server provides information for these components:

| Component | Description |
|-----------|-------------|
| **Button** | Customizable button with 6 variants, 4 sizes, loading states, and icon support |
| **Badge** | Status badges for active, failed, disabled states |
| **Tag** | Event labels with optional bold prefix, interactive and selectable |
| **Table** | Composable table with size variants, loading skeleton, empty state, sticky columns |
| **DropdownMenu** | Radix-based dropdown with full keyboard navigation |

---

## Tool Reference

### `list-components`

Lists all available components.

```
Input: (none)
Output: Array of components with name, id, description, dependencyCount
```

### `get-component-metadata`

Get detailed metadata for a specific component.

```
Input: { componentName: "button" }
Output: {
  name, description, dependencies,
  props (with types, defaults, descriptions),
  variants (with options),
  import statement
}
```

### `get-component-examples`

Get code examples for a component.

```
Input: { componentName: "button", exampleType?: "loading" }
Output: {
  component, import statement,
  examples (with title, description, code)
}
```

### `list-design-tokens`

List design tokens from the design system.

```
Input: { category?: "colors" | "spacing" | "radius" | "typography" }
Output: {
  tokens (with name, value, cssVariable, description),
  usage instructions
}
```

### `get-component-accessibility`

Get accessibility guidelines for a component.

```
Input: { componentName: "dropdown-menu" }
Output: {
  guidelines (semantic, visual, best practices),
  ariaAttributes (with usage),
  keyboardSupport (key → action mapping)
}
```

### `get-component-source`

Get full source code for a component (copy/paste ready).

```
Input: { componentName: "button" }  // or "utils" or "css"
Output: {
  component, file path, dependencies,
  installCommand,
  sourceCode (full implementation)
}
```

### `get-installation-info`

Get npm package info and setup instructions.

```
Input: (none)
Output: {
  packageName, npmUrl,
  quickStart commands,
  manualInstallation steps,
  dependencies
}
```

### `init-project`

Initialize a project for myOperator UI (runs CLI command).

```
Input: { cwd?: string }
Output: { success, command, output }
```

### `install-component`

Install a component via CLI (like shadcn).

```
Input: { component: "button", cwd?: string }
Output: { success, component, command, output }
```

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

- [myoperator-ui](https://www.npmjs.com/package/myoperator-ui) - CLI for adding myOperator UI components to your project
- [Model Context Protocol](https://modelcontextprotocol.io/) - Open standard for AI-tool integration

## License

MIT
