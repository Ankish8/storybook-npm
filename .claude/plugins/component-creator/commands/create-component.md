---
description: Create a new React component with intelligent analysis, design system validation, and auto-generated tests
argument-hint: "A Merlin component-request id — or a screenshot path, or nothing"
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "AskUserQuestion", "Task", "Skill"]
context: fork
---

# Create Component (plugin)

This plugin command delegates to the workspace source-of-truth command:

- Read and execute: `.claude/commands/create-component.md`

## Rules

1. Follow the delegated command file exactly — every phase, in order.
2. Do not skip required AskUserQuestion prompts.
3. Do not bypass required Figma collection.
4. Preserve all workflow phases and critical rules.

## Why this exists, and why it is now a pointer

This plugin packages the command for reuse across environments. It used to be a full
944-line COPY of the workflow, and by the time anyone looked it had already drifted:
the copy was missing Step 2b (reconciling the component's name against Figma), Step 2c
(taking the variant axes from Figma) and the "a screenshot is already attached"
short-circuit — three things the base command had gained and this one silently had not.

That is what a second source of truth costs. Both files were invoked, so which
behaviour you got depended on how the command was reached, and nothing anywhere said
so. Only `context: fork` was ever genuinely this file's own, so that is all that is
left here. This mirrors `.claude/commands/build-screen-cursor.md` and
`.claude/plugins/cursor-component-publish/commands/create-component-cursor.md`, which
already delegate the same way.
