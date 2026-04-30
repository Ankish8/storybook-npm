# Full Publish Workflow

Complete publishing workflow for myOperator UI:
1. Ask for release type (Beta or Latest)
2. Run pre-flight checks
3. Check Storybook sync
4. Publish CLI → commit/push → publish MCP → sync design skill

---

## Step 1: Ask for Release Type

Use the AskQuestion tool to ask:

```
Question: "Which release type?"
Options:
  - Beta — Publish CLI with --tag beta. Test before affecting other developers. Does NOT commit or publish MCP.
  - Latest — Publish to @latest. All users get this version. Commits, pushes, and publishes MCP.
```

---

## Step 2: Pre-flight Checks

Run ALL of these. If any fail, STOP and fix before proceeding.

### 2.1 Component tests
```bash
npm test
```

### 2.2 CLI prefix & registry tests
```bash
cd packages/cli && npm test
```

### 2.3 Linting
```bash
npm run lint
```

### 2.4 API breaking change check
```bash
npm run api:check
```

If `api:check` reports intentional breaking changes, run `npm run api:snapshot` to update the baseline, then continue.

### 2.5 Bootstrap compatibility check
```bash
node scripts/check-bootstrap-compat.js
```

Every `<p>` element in component source must include `m-0`, `mb-0`, or `my-0`. Fix any violations before proceeding.

**IMPORTANT: All checks (2.1–2.5) MUST pass. Do NOT skip or proceed if any fail.**

---

## Step 3: Storybook Sync Check

Run this for BOTH Beta and Latest releases.

### 3.1 Find changed components
```bash
git diff --name-only HEAD
```

Look for modified files under:
- `src/components/ui/*.tsx` (excluding `*.stories.tsx`, `*.test.tsx`, `__tests__/`)
- `src/components/custom/**/*.tsx` (excluding stories and tests)

### 3.2 For each changed component, check stories

For each modified component:
1. Read the component source to understand what changed
2. Read the corresponding `.stories.tsx`
3. Update stories if any of these apply:
   - New prop added → Add a story + add control to Playground
   - Default value changed → Update docs description
   - New variant added → Add variant story + update AllVariants
   - Behavior change → Update relevant stories
   - Component removed/renamed → Update or remove stories

If no updates needed, report: "Stories are already in sync."

### 3.3 Verify Storybook builds
```bash
npx storybook build --test 2>&1 | tail -5
```

Fix any build failures before proceeding.

---

## Step 4: Execute Based on Release Type

### If BETA:

#### 4a. Publish CLI as Beta
```bash
cd packages/cli && npm version prerelease --preid=beta --no-git-tag-version && npm run build && MYOPERATOR_PUBLISH_ALLOWED=1 npm publish --tag beta
```

#### 4b. Report and STOP

Report to user:
- "Published CLI as beta: myoperator-ui@X.X.X-beta.X"
- "Test with: `npx myoperator-ui@beta add <component>`"
- "When ready for production, run `/publish-all` and choose 'Latest'"
- "Promote manually: `npm dist-tag add myoperator-ui@X.X.X-beta.X latest`"

**Do NOT commit, push, or publish MCP for beta.**

---

### If LATEST:

#### 4a. Publish CLI
```bash
cd packages/cli && npm version patch --no-git-tag-version && npm run build && MYOPERATOR_PUBLISH_ALLOWED=1 npm publish
```

Note the new CLI version.

#### 4b. Git Commit and Push (triggers Vercel Storybook deploy)
```bash
git add .
MYOPERATOR_GIT_ALLOWED=1 git commit -m "chore: publish myoperator-ui v$(cd packages/cli && node -p "require('./package.json').version")"
MYOPERATOR_GIT_ALLOWED=1 git push
```

#### 4c. Sync and Publish MCP
```bash
node scripts/sync-mcp-metadata.js --write
cd packages/mcp && npm version patch --no-git-tag-version && npm run build && MYOPERATOR_PUBLISH_ALLOWED=1 npm publish
```

Note the new MCP version.

#### 4d. Sync Design Skill Plugin
```bash
node scripts/sync-design-skill.js --write
```

This updates the component catalog in the myoperator-design skill's SKILL.md.

#### 4e. Final Git Commit
```bash
git add packages/mcp .claude/plugins/myoperator-design
MYOPERATOR_GIT_ALLOWED=1 git commit -m "chore: publish myoperator-mcp v$(cd packages/mcp && node -p "require('./package.json').version")"
MYOPERATOR_GIT_ALLOWED=1 git push
```

---

## Completion Report

Report after finishing:
- CLI version published (and tag: beta or latest)
- MCP version published (latest only)
- Git commits and push done (latest only)
- Vercel deploy triggered (latest only)
- Post-publish verification:
  ```bash
  npm view myoperator-ui version
  npm view myoperator-mcp version
  ```

---

## Quick Reference

| Release Type | Who gets it | Commits? | MCP? | Storybook deploy? |
|---|---|---|---|---|
| Beta | Only @beta users | No | No | No |
| Latest | Everyone | Yes | Yes | Yes (via push) |

## Important Notes

- `MYOPERATOR_PUBLISH_ALLOWED=1` is REQUIRED for `npm publish` — without it the pre-publish hook blocks it
- `MYOPERATOR_GIT_ALLOWED=1` is REQUIRED for `git commit` and `git push` — without it the pre-commit/pre-push hooks block it
- Always publish CLI first, then MCP (MCP reads CLI metadata)
- If any step fails, STOP and fix before continuing
