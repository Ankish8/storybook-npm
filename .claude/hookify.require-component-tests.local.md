---
name: require-component-tests
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

⚠️ **Test File Required!**

You're creating/editing a component. Every component MUST have a test file.

**Required:** `src/components/ui/__tests__/<component-name>.test.tsx`

**Test must include:**
- Renders correctly
- All variants tested
- All sizes tested
- Custom className applied
- Ref forwarding works
- Accessibility (ARIA) if applicable

Use the component generator for new components:
```bash
node scripts/create-component.js <component-name> "<description>"
```
