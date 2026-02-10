# Publish All — Full Release Workflow

Run the complete publish workflow for both CLI and MCP packages, then commit and push.

## Pre-flight Checks

Before publishing, verify:
1. All tests pass: `npm test`
2. Linting passes: `npm run lint`
3. No breaking changes (or intentional ones): `npm run api:check`

If any check fails, fix the issues first before proceeding.

## Step 1: Publish CLI Package

```bash
cd packages/cli
npm run integrity:snapshot
npm run build
```

If build succeeds, bump version and publish:

```bash
npm version patch
MYOPERATOR_PUBLISH_ALLOWED=1 npm publish
```

Note the new version number.

## Step 2: Sync MCP Metadata

```bash
cd ../..
node scripts/sync-mcp-metadata.js --write
```

## Step 3: Publish MCP Package

```bash
cd packages/mcp
npm version patch
npm run build
MYOPERATOR_PUBLISH_ALLOWED=1 npm publish
```

## Step 4: Sync Design Skill Plugin

```bash
cd ../..
node scripts/sync-design-skill.js --write
```

This updates the component catalog in the myoperator-design skill's SKILL.md.

## Step 5: Git Commit and Push

```bash
MYOPERATOR_GIT_ALLOWED=1 git add -A
MYOPERATOR_GIT_ALLOWED=1 git commit -m "chore: publish myoperator-ui vX.X.X and myoperator-mcp vX.X.X"
MYOPERATOR_GIT_ALLOWED=1 git push
```

Replace `vX.X.X` with the actual version numbers from Steps 1 and 3.

## Important Notes

- The `MYOPERATOR_PUBLISH_ALLOWED=1` env var is required because `npm publish` is blocked by a pre-publish hook without it.
- The `MYOPERATOR_GIT_ALLOWED=1` env var is required because pre-commit and pre-push hooks block direct git operations without it.
- Always publish CLI first, then MCP (MCP depends on CLI metadata).
- If any step fails, stop and fix the issue before continuing.

## Post-Publish Verification

After publishing, verify the packages are available:
```bash
npm view myoperator-ui version
npm view myoperator-mcp version
```
