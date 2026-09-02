---
description: "[Cursor] Create a new React component with interactive guided workflow — uses Cursor's AskQuestion tool for all prompts"
argument-hint: "A Merlin component-request id — or a screenshot path, or nothing"
---

# Create Component Workflow (Cursor Edition)

> **Note:** this is the Cursor-native version of `/create-component`. Claude Code
> users should run that one instead.

Follow **`.claude/commands/create-component.md`** for the workflow, the phases, the
file layout, the registry rules and the reasoning behind them — this file only states
where Cursor differs.

## Cursor-specific differences

1. **Questions** — use Cursor's native `AskQuestion` tool wherever the base command
   says `AskUserQuestion`. Same questions, same options, same recommended-first
   ordering. Where the base command offers "Other" for free text, ask in chat.

2. **No sub-agents and no Skill calls.** The base command's Phase 5 and Phases 6–8
   spawn parallel agents for sub-components, tests, stories and the registry write.
   Cursor has none, so do that work yourself, in the same order, and verify each step
   before moving on. The context bundle the base command assembles for a sub-agent is
   still worth writing down — it is the checklist for doing it by hand.

3. **MCP, if you have it.** Phase 0 prefers the `merlin` MCP tools and falls back to
   the CLI; that preference holds here, because Cursor speaks MCP too. What differs is
   how the server is added — Cursor configures MCP in its own settings
   (`~/.cursor/mcp.json` or Settings → MCP), not with `claude mcp add`. So if the
   tools are absent, offer the CLI login rather than a command the user cannot run.
   The URL is the same: `https://basic-monitor-555.convex.site/mcp` (dev:
   `https://acrobatic-bass-678.convex.site/mcp`).

Everything else — taking a Merlin request id and deriving the brief from it, the
zero-arguments rule that leaves the old flow untouched, reconciling the name against
Figma, taking the variant axes from Figma, the token mapping, the story and test
requirements, the two registry files, and reporting the component back to Merlin — is
identical to the base command.

## Why this is a delta doc

It used to be a 14,840-byte COPY of the workflow, existing byte-identically in three
places with no mechanism keeping them in step. The sibling `create-component.md` fork
under `.claude/plugins/` had already drifted — three whole steps behind — which is
what one source of truth exists to prevent. `.claude/commands/build-screen-cursor.md`
is the model.
