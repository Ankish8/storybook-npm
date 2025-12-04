---
name: validate-prefix-before-push
description: Validates prefix transformation output before git push to prevent corrupted components
event: PreToolUse
tool: Bash
match_arg: command
match_regex: git\s+push
---

Before pushing, validate the prefix transformation output to ensure no corruption:

```bash
cd packages/cli && npm run validate:prefix
```

If validation fails, DO NOT proceed with the push. Fix the issues first by:
1. Checking `packages/cli/scripts/generate-registry.js` for regex issues
2. Running `npm run build` to regenerate the registry
3. Running `npm test` to verify all tests pass

Only push after validation passes.
