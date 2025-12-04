---
name: publish-all
description: Full publish workflow - CLI to npm, git commit/push (Vercel deploy), MCP to npm
allowed-tools: Bash, Read, Write, TodoWrite
---

# Full Publish Workflow

Complete publishing workflow for myOperator UI:
1. Publish CLI package to npm
2. Git commit and push (triggers Vercel deploy)
3. Sync and publish MCP package to npm

## Pre-flight Checks

Before starting, verify:
- All tests pass
- No uncommitted changes that shouldn't be committed
- You're on the correct branch

## Steps to Follow

### Step 1: Publish CLI Package

```bash
cd packages/cli && npm test && npm version patch && npm run build && node scripts/validate-prefix-output.js && npm publish
```

### Step 2: Git Commit and Push

```bash
git add .
git commit -m "chore: publish myoperator-ui v$(cd packages/cli && node -p "require('./package.json').version")"
git push
```

This triggers Vercel auto-deploy for the Storybook documentation.

### Step 3: Sync and Publish MCP Package

```bash
node scripts/sync-mcp-metadata.js
cd packages/mcp && npm version patch && npm run build && npm publish
```

### Step 4: Final Git Commit

Commit the MCP version bump:
```bash
git add packages/mcp
git commit -m "chore: publish myoperator-mcp v$(cd packages/mcp && node -p "require('./package.json').version")"
git push
```

## Execution

Execute each step sequentially. If any step fails, stop and report the error.

After successful completion, report:
- CLI version published
- MCP version published
- Git commits made
- Confirm Vercel deploy was triggered
