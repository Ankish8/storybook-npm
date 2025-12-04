---
name: require-component-stories
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/ui/[^/]+\.tsx$
  - field: file_path
    operator: not_contains
    pattern: __tests__
  - field: file_path
    operator: not_contains
    pattern: .stories.
  - field: file_path
    operator: not_contains
    pattern: .test.
---

⚠️ **Storybook Story Required!**

You're creating/editing a component. Every component MUST have a story file.

**Required:** `src/components/ui/<component-name>.stories.tsx`

**Story should include:**
- Default story with basic usage
- All variants demonstrated
- All sizes demonstrated
- Interactive examples

Use the component generator for new components:
```bash
node scripts/create-component.js <component-name> "<description>"
```
