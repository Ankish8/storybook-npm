---
name: publish-mcp
description: Sync component metadata and publish the myoperator-mcp package to npm
allowed-tools: Bash, Read, Write, TodoWrite
---

# Publish MCP Package

Sync component metadata from CLI and publish the `myoperator-mcp` package to npm.

## Steps to Follow

1. **Sync Metadata**: Run the sync script to update MCP metadata from source components
   ```bash
   node scripts/sync-mcp-metadata.js
   ```

2. **Build MCP**: Build the MCP package
   ```bash
   cd packages/mcp && npm run build
   ```

3. **Bump Version**: Increment the patch version
   ```bash
   cd packages/mcp && npm version patch
   ```

4. **Publish**: Publish to npm
   ```bash
   cd packages/mcp && npm publish
   ```

## Execution

Execute these commands sequentially. If any step fails, stop and report the error.

After successful publish:
- Report the new version number
- Confirm the package was published successfully
- Report what components were synced (if any new ones)
