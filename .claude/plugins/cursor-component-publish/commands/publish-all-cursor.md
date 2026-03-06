---
description: "[Plugin] Cursor-native full publish workflow"
argument-hint: Optional release type (beta|latest)
---

# Publish All (Cursor Plugin)

This plugin command delegates to the workspace source-of-truth command:

- Read and execute: `.claude/commands/publish-all-cursor.md`

## Rules

1. Follow the delegated command file exactly.
2. Do not skip any pre-flight checks.
3. Enforce Storybook sync checks for both beta and latest.
4. Respect beta vs latest branching behavior exactly.

## Why this exists

This plugin packages the command for reuse across environments while keeping one source of truth in the repo command file.
