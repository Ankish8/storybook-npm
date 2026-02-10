# Publish CLI Only

Publish only the CLI package (myoperator-ui) without updating MCP or git.

## Pre-flight Checks

1. All tests pass: `npm test`
2. Linting passes: `npm run lint`

## Steps

```bash
# 1. Build and validate
cd packages/cli
npm run integrity:snapshot
npm run build

# 2. Bump version
npm version patch

# 3. Publish
MYOPERATOR_PUBLISH_ALLOWED=1 npm publish
```

## Important

- `MYOPERATOR_PUBLISH_ALLOWED=1` is required to bypass the pre-publish safety check.
- This does NOT commit to git or publish the MCP package. Use `/publish-all` for the full workflow.
- After publishing, verify: `npm view myoperator-ui version`
