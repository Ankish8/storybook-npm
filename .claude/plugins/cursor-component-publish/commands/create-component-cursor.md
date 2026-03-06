---
description: "[Plugin] Cursor-native create component workflow"
argument-hint: Optional screenshot path
---

# Create Component (Cursor Plugin)

This plugin command delegates to the workspace source-of-truth command:

- Read and execute: `.claude/commands/create-component-cursor.md`

## Rules

1. Follow the delegated command file exactly.
2. Do not skip required AskQuestion prompts.
3. Do not bypass required Figma collection.
4. Preserve all workflow phases and critical rules.

## Why this exists

This plugin packages the command for reuse across environments while keeping one source of truth in the repo command file.
