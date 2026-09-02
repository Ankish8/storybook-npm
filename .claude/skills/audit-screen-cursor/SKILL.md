---
name: audit-screen-cursor
description: "[Cursor] Audit a Merlin handoff screen as a senior UX designer and publish the findings back to Merlin — uses Cursor's AskQuestion tool for all prompts"
argument-hint: "Screen id(s), or a flow id — or nothing, and I'll ask"
---

# Audit Screen Workflow (Cursor Edition)

> **Note:** this is the Cursor-native version of `/audit-screen`. Claude Code users
> should run that one instead.

Follow **`.claude/commands/audit-screen.md`** for the workflow, the judging rules and
the reasoning behind them — this file only states where Cursor differs.

## Cursor-specific differences

1. **Questions** — use Cursor's native `AskQuestion` tool wherever the base command
   says `AskUserQuestion`. Same questions, same options, same recommended-first
   ordering.

2. **Looking at the screenshot.** The base command curls `preview_url` to a file and
   reads it. If your model cannot read a local image, fetch the URL directly instead —
   but say plainly that you could not see the render, because roughly half of a UX
   audit is visual and a text-only reading is a weaker audit, not an equivalent one.

3. **Everything else is identical.** The MCP tools, the citation rules, the severity
   discipline and the publish step are the same, because they are enforced server-side
   rather than by this file.
