---
name: publish-cli
description: Publish the myoperator-ui CLI package to npm with tests, integrity check, and version bump
allowed-tools: Bash, Read, TodoWrite
---

# Publish CLI Package

Publish the `myoperator-ui` CLI package to npm.

## Steps to Follow

1. Navigate to `packages/cli` directory
2. Run tests to ensure everything passes: `npm test`
3. Run integrity check if components were modified: `node scripts/check-integrity.js verify`
4. Bump version with `npm version patch`
5. Build the package: `npm run build`
6. Validate prefix output: `node scripts/validate-prefix-output.js`
7. Publish to npm: `npm publish`

## Execution

Execute these commands sequentially. If any step fails, stop and report the error.

```bash
cd packages/cli && npm test && npm version patch && npm run build && node scripts/validate-prefix-output.js && npm publish
```

After successful publish:
- Report the new version number
- Confirm the package was published successfully
- Remind user that git commit/push is still needed
