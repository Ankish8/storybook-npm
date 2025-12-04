---
name: component-integrity-check
enabled: true
event: stop
pattern: .*
---

⚠️ **Component Workflow Reminder**

Before completing work on components, verify you followed the workflow:

**BEFORE changes:**
```bash
cd packages/cli
npm run integrity:snapshot
```

**AFTER changes:**
```bash
node scripts/check-integrity.js verify <component-name>
```

**Before publishing:**
```bash
npm run build
npm publish
```

**Checklist:**
- [ ] Created integrity snapshot BEFORE making changes
- [ ] Made changes to ONLY the specified component(s)
- [ ] Ran integrity check to verify only intended changes
- [ ] Build succeeded
- [ ] Published to npm (if required)
