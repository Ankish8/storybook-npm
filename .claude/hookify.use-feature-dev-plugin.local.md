---
name: use-feature-dev-plugin
enabled: true
event: prompt
conditions:
  - field: user_prompt
    operator: regex_match
    pattern: (create|build|add|implement|make|develop|write).*(new|feature|functionality|capability|module|system)
---

🔧 **New Feature Request Detected**

The user is asking to create a new feature.

**Use the `feature-dev` plugin** for this task!

This plugin provides a structured workflow for:
- Planning the feature implementation
- Creating necessary files and components
- Writing tests
- Ensuring code quality

Do NOT proceed without using the feature-dev plugin workflow.
