---
description: "Full publish workflow for myOperator UI (Claude/Codex compatible; beta/latest) with pre-flight checks, Storybook sync, and conditional publish paths"
argument-hint: "Optional release type (beta|latest)"
---

# Full Publish Workflow

> **Cursor users:** Use `/publish-all-cursor` for the Cursor-native version of this workflow.
> **Codex users:** Follow this command directly. If no release type is provided, ask the user in chat for `beta` or `latest`, then continue after they answer.

Complete publishing workflow for myOperator UI:
1. Ask for release type (Beta or Latest)
2. Run pre-flight checks
3. Check Storybook sync
4. Publish CLI → commit/push → publish MCP → sync design skill

---

## Step 1: Ask for Release Type

If the user provided an argument, normalize it:
- `beta` / `Beta` -> Beta release
- `latest` / `Latest` -> Latest release

If no release type was provided, ask:

> Which release type: `beta` or `latest`?

Use the host-native interaction:
- **Claude Code:** use the available question tool if present; otherwise ask in chat.
- **Codex:** ask in chat and wait for the user's reply. Do not call unavailable structured question tools.
- **Cursor:** use `/publish-all-cursor`, which contains the Cursor-native `AskQuestion` call.

Release choices:
- **Beta:** Publish CLI with `--tag beta`. Test before affecting other developers. Does NOT publish MCP.
- **Latest:** Publish to `@latest`. All users get this version. Commits, pushes, and publishes MCP.

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

### 2.3 CLI E2E tests
```bash
cd packages/cli && npm run test:e2e
```

Runs full end-to-end verification: installs components into a temp project, checks `tw-` prefixing, import paths, Bootstrap compat, and runs a Vite build. If this fails, there's a real bug that would break consumers.

### 2.4 Linting
```bash
npm run lint
```

### 2.5 API breaking change check
```bash
npm run api:check
```

If `api:check` reports intentional breaking changes, run `npm run api:snapshot` to update the baseline, then continue.

### 2.6 Bootstrap compat check
```bash
node scripts/check-bootstrap-compat.js
```

Ensures all `<p>` elements in component files have `m-0` (or `mb-0`/`my-0`). Bootstrap sets `p { margin-bottom: 1rem }` globally — missing the reset causes 16px layout gaps in the host app. Fix any violations before publishing.

**IMPORTANT: All checks (2.1–2.6) MUST pass. Do NOT skip or proceed if any fail.**

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

#### 4b. Git Commit and Push on CURRENT branch (does NOT trigger Storybook deploy)

**IMPORTANT: Do NOT checkout `beta/cli` or any other branch. Stay on whatever branch the user is currently on.**

```bash
BETA_VERSION=$(cd packages/cli && node -p "require('./package.json').version")
git add .
MYOPERATOR_GIT_ALLOWED=1 git commit -m "chore: publish myoperator-ui v${BETA_VERSION} (beta)"
MYOPERATOR_GIT_ALLOWED=1 git push
```

#### 4c. Report and STOP

Report to user:
- "Published CLI as beta: myoperator-ui@X.X.X-beta.X"
- "Test with: `npx myoperator-ui@beta add <component>`"
- "When ready for production, run `/publish-all` and choose 'Latest'"
- "Promote manually: `npm dist-tag add myoperator-ui@X.X.X-beta.X latest`"

**Do NOT publish MCP for beta.**

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
| Beta | Only @beta users | Yes (current branch) | No | No |
| Latest | Everyone | Yes | Yes | Yes (via push) |

## Important Notes

- `MYOPERATOR_PUBLISH_ALLOWED=1` is REQUIRED for `npm publish` — without it the pre-publish hook blocks it
- `MYOPERATOR_GIT_ALLOWED=1` is REQUIRED for `git commit` and `git push` — without it the pre-commit/pre-push hooks block it
- Always publish CLI first, then MCP (MCP reads CLI metadata)
- If any step fails, STOP and fix before continuing
