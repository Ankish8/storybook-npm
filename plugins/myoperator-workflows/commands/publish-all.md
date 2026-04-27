# /publish-all

Execute the repository publish workflow in `.claude/commands/publish-all.md`.

## Arguments

- `release_type`: `beta` or `latest` (optional)

## Workflow

1. Read `.claude/commands/publish-all.md` from the repository root.
2. Follow that workflow exactly.
3. If `release_type` was provided in the slash command, use it.
4. If no release type was provided, ask the user whether to publish `beta` or `latest`, then continue after they answer.
5. Stop and fix failures if any required pre-flight, Storybook, build, publish, commit, or push step fails.

## Guardrails

- Do not skip validation gates.
- Do not publish MCP for beta releases.
- Do not add `Co-Authored-By: Codex` or `Generated with Codex` to commit messages.
- Respect the current git branch unless the canonical workflow explicitly says otherwise.
