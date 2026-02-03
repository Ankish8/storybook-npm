---
name: publish-all
description: Full publish workflow - CLI to npm, git commit/push (Vercel deploy), MCP to npm
allowed-tools: Bash, Read, Write, TodoWrite
---

# Full Publish Workflow (PR-Based)

Complete publishing workflow for myOperator UI with mandatory code review:

**Phase 1 (PR Creation):** Create release branch → Push → Create PR → Wait for review
**Phase 2 (After Merge):** Publish CLI to npm → Publish MCP to npm

Note: The CLI package (`myoperator-ui`) is ALWAYS published because it serves as both:
- The CLI tool (`npx myoperator-ui add ...`) for UI components
- The npm package that exports ALL components (UI + custom) via `import { ... } from "myoperator-ui"`

## Workflow Decision

First, check the current state to determine which phase to execute:

```bash
git status --porcelain
git branch --show-current
```

**Decision logic:**
- If there are uncommitted/staged changes OR not on `main` branch → Execute **Phase 1** (Create PR)
- If on `main` branch with clean working directory → Execute **Phase 2** (Publish)

---

## Phase 1: Create Release PR

Only execute if there are changes to commit or you're on a feature branch.

### Step 1.1: Run Tests

```bash
npm test
cd packages/cli && npm test
```

### Step 1.2: Create Release Branch

```bash
# Get the next CLI version for branch name
NEXT_VERSION=$(cd packages/cli && npm version patch --no-git-tag-version | tr -d 'v')
cd packages/cli && git checkout -- package.json package-lock.json  # Reset the version bump
BRANCH_NAME="release/v${NEXT_VERSION}"
git checkout -b "$BRANCH_NAME"
```

### Step 1.3: Build and Validate CLI Package

```bash
cd packages/cli && npm run build && node scripts/validate-prefix-output.js
```

### Step 1.4: Sync MCP Metadata

```bash
node scripts/sync-mcp-metadata.js --write
```

### Step 1.5: Commit All Changes

```bash
git add .
git commit -m "chore: prepare release v${NEXT_VERSION}

- Updated components
- Synced MCP metadata
- Ready for review"
```

### Step 1.6: Push and Create PR

```bash
git push -u origin "$BRANCH_NAME"
gh pr create --title "Release v${NEXT_VERSION}" --body "$(cat <<'EOF'
## Release Checklist

- [ ] Code review completed
- [ ] All tests passing
- [ ] Changes verified in Storybook preview

## After Merge

Run `/publish-all` again to publish packages to npm.
EOF
)"
```

### Step 1.7: Stop and Report

After creating the PR, STOP and report:
- PR URL created
- Tell user to review the PR
- Remind user to run `/publish-all` again after merging

**Do NOT proceed to Phase 2 until the PR is merged.**

---

## Phase 2: Publish to npm

Only execute if on `main` branch with a clean working directory (PR was merged).

### Step 2.1: Verify Clean State

```bash
git pull origin main
git status --porcelain  # Should be empty
```

### Step 2.2: Publish CLI Package

```bash
cd packages/cli && npm version patch && npm run build && npm publish
```

### Step 2.3: Commit CLI Version Bump

```bash
git add packages/cli/package.json packages/cli/package-lock.json
git commit -m "chore: publish myoperator-ui v$(cd packages/cli && node -p "require('./package.json').version")"
git push
```

### Step 2.4: Publish MCP Package

```bash
cd packages/mcp && npm version patch && npm run build && npm publish
```

### Step 2.5: Commit MCP Version Bump

```bash
git add packages/mcp/package.json packages/mcp/package-lock.json
git commit -m "chore: publish myoperator-mcp v$(cd packages/mcp && node -p "require('./package.json').version")"
git push
```

### Step 2.6: Report Success

After successful completion, report:
- CLI version published
- MCP version published
- Confirm Vercel deploy was triggered

---

## Error Handling

- If tests fail → Stop and report errors
- If PR creation fails → Stop and report errors
- If npm publish fails → Stop and report errors (may need to fix and retry)

## Code Review Integration

After Phase 1 creates a PR, you can use `/code-review` on the PR URL to get an automated code review before merging.
