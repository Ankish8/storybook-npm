---
name: build-screen-cursor
description: "[Cursor] Rebuild a Figma screen from Merlin as a responsive twin using real myOperator UI components — uses Cursor's AskQuestion tool for all prompts"
argument-hint: "Figma URL, screen id(s), or a flow id — or nothing, and I'll ask"
---

# Build Screen Workflow (Cursor Edition)

> **Note:** this is the Cursor-native version of `/build-screen`. Claude Code users
> should run that one instead.

> **Screens or a whole flow.** The base command now takes several screen ids, or a
> flow id, and builds ONE clickable prototype whose buttons navigate between the
> screens. Nothing about that path is Cursor-specific — read it there.

Follow **`.claude/commands/build-screen.md`** for the workflow, the build rules and
the reasoning behind them — this file only states where Cursor differs.

## Cursor-specific differences

1. **Questions** — use Cursor's native `AskQuestion` tool wherever the base command
   says `AskUserQuestion`. Same questions, same options, same recommended-first
   ordering. Where the base command says "Other" for free text, ask in chat.

2. **The dev server is yours to run.** Cursor has no background shell, so at Phase 5
   do not try to start Vite. Print the command and wait:

   ```bash
   cd twins/<slug> && npx vite --host 127.0.0.1
   ```

   Ask the user to run it, check the screen at 375, 768 and 1440, and paste back what
   needs changing. Then edit `twins/<slug>/src/` and ask them to reload.

3. **No sub-agents and no Skill calls.** Read the component catalog directly at
   `$WORKSPACE/.claude/plugins/myoperator-design/skills/myoperator-design/references/component-catalog.md`.

4. **MCP, if you have it.** The base command prefers the `merlin` MCP tools and falls
   back to the CLI; that preference holds here, because Cursor speaks MCP too. The one
   thing that differs is how the server is added — Cursor configures MCP in its own
   settings (`~/.cursor/mcp.json` or Settings → MCP), not with `claude mcp add`. So at
   Phase 0, if the tools are not present, offer the CLI login rather than a command
   the user cannot run. The URL is the same:
   `https://basic-monitor-555.convex.site/mcp` (dev:
   `https://acrobatic-bass-678.convex.site/mcp`).

Everything else — one working connection being enough, preferring MCP and falling back
to the CLI, the phases, verbatim copy, semantic tokens, `data-component` tagging,
checking what a token actually is before using it, derived breakpoints, and the
three-step upload that keeps the build out of the conversation — is identical to the
base command.
