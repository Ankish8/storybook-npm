---
name: mcp-server-update
enabled: true
event: stop
pattern: .*
---

⚠️ **MCP Server Update Reminder**

If you added/modified components and published to npm, **don't forget to update the MCP server!**

**After publishing CLI package:**
1. Navigate to `packages/mcp`
2. Update component references if needed
3. Bump version in `package.json`
4. Build: `npm run build`
5. Publish: `npm publish`

**Checklist:**
- [ ] CLI package published with new components
- [ ] MCP server updated with new component metadata
- [ ] MCP server version bumped
- [ ] MCP server published to npm
