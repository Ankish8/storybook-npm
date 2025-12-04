---
name: validate-prefix-before-push
enabled: true
event: PreToolUse
tool: Bash
match_arg: command
match_regex: git\s+push
action: run
command: cd packages/cli && npm run validate:prefix
---

Validates prefix transformation before git push to prevent publishing corrupted components.

If validation fails, the push will be blocked. Fix by:
1. Check `packages/cli/scripts/generate-registry.js` for regex issues
2. Run `npm run build` to regenerate registry
3. Run `npm test` to verify tests pass
