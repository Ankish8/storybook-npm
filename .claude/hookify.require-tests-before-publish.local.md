---
name: require-tests-before-publish
enabled: true
event: PreToolUse
tool: Bash
match_arg: command
match_regex: npm\s+publish
action: run
command: cd /Users/ankish/Downloads/Code/storybook-npm && npm test 2>&1 | tail -3 && cd packages/cli && npm test 2>&1 | tail -3
---

Runs ALL test suites before allowing npm publish:
1. Component tests (`npm test` — vitest, ~972 tests)
2. CLI prefix & registry tests (`cd packages/cli && npm test` — ~43 tests)

If any test fails, the publish will be blocked. Fix by:
1. Run `npm test` to see which component tests fail
2. Run `cd packages/cli && npm test` to see which CLI tests fail
3. Fix the failing tests before retrying publish
