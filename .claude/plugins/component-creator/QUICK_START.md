# Quick Start Guide - Component Creator Plugin

Get started creating components in under 5 minutes.

## TL;DR

```bash
# Method 1: Use the command
/create-component

# Method 2: Just mention it
"I need to create a button component"
# → Agent automatically activates
```

## 5-Minute Tutorial

### Step 1: Trigger Component Creation

Choose your preferred method:

**Option A: Slash Command**
```
/create-component
```

**Option B: Natural Conversation**
```
"I want to create an avatar component"
"Can you help me build a user settings form?"
"I have this Figma design: https://figma.com/design/..."
```

### Step 2: Provide Component Name

```
Component Name: user-profile-card
Description: A card component for displaying user profile information
```

### Step 3: Component Type

The plugin will ask:
```
Where should this component be created?

○ src/components/ui/ - UI component (distributed via CLI)
● src/components/custom/ - Custom component (project-specific)
```

### Step 4: Design Input

**Option A: Figma Link**
```
Figma URL: https://figma.com/design/abc123/Design?node-id=1-2

✓ Extracting design context...
✓ Mapping colors to CSS variables...
✓ Analyzing layout and spacing...
```

**Option B: Manual Description**
```
Describe the component:
- Card with user avatar, name, role, and bio
- Primary variant with blue background
- Compact and expanded sizes
- Hover state with elevation
```

### Step 5: Review Identified Components

```
Identified reusable subcomponents:
☑ Avatar (create new - doesn't exist)
☑ Typography (use existing)
☑ Badge (use existing for role)

Proceed with these? [Yes/Modify]
```

### Step 6: Automatic Generation

The plugin will:
```
✓ Creating src/components/custom/user-profile-card/user-profile-card.tsx
✓ Creating src/components/custom/user-profile-card/__tests__/user-profile-card.test.tsx
✓ Creating src/components/custom/user-profile-card/user-profile-card.stories.tsx
✓ Validating CSS variables (no hardcoded colors)
✓ Updating src/index.ts
✓ Running tests... PASSED
```

### Step 7: View in Storybook

```bash
npm run storybook
```

Navigate to `Components/UserProfileCard` to see your new component!

## Common Scenarios

### Scenario 1: Creating a Simple UI Component

```
User: "Create a spinner component for loading states"

Plugin:
✓ Checks if spinner exists → Not found
✓ Suggests category → Feedback
✓ Asks for Figma → No link, manual description
✓ Generates → With size variants (sm, md, lg)
✓ Tests → 8 test cases
✓ Stories → 4 interactive stories
✓ Registry → Added to components.yaml
```

### Scenario 2: Avoiding Duplication

```
User: "I need a destructive button"

Plugin:
✓ Found existing: button.tsx
✓ Checked variants: destructive variant exists!
✓ Suggestion: Use <Button variant="destructive">

No new component created. Use existing instead!
```

### Scenario 3: Composite Component

```
User: "Create a search input with a button"

Plugin:
✓ Identifies subcomponents:
  - text-field (search input)
  - button (search button)
✓ Recommends: Compose using existing components
✓ Generates: Custom component using primitives
```

## Pro Tips

### Tip 1: Let the Agent Help

Don't overthink it. Just describe what you need:
```
❌ Don't: "I need to create a new React component using CVA with variants..."
✅ Do: "I need a card to show user info with avatar, name, and bio"
```

### Tip 2: Provide Figma Links When Possible

Figma integration extracts:
- Exact colors → Mapped to CSS variables
- Spacing/padding → Responsive Tailwind classes
- Typography → Font size, weight, line height
- Layout → Flexbox/grid structure

### Tip 3: Trust the Suggestions

If the plugin suggests using a variant or existing component:
```
Plugin: "Found 'button' component with 'icon' variant. Use that instead?"

✅ Trust it - Maintains consistency
❌ Override only if truly different
```

### Tip 4: Review Generated Tests

The plugin generates comprehensive tests, but review them:
```bash
npm test -- user-profile-card
```

Add edge cases if needed:
```tsx
it('handles very long user names gracefully', () => {
  const longName = 'A'.repeat(100)
  render(<UserProfileCard name={longName} />)
  // Test truncation or wrapping
})
```

### Tip 5: Customize in Settings

Set your preferences once:
```bash
cp .claude/plugins/component-creator/.claude/component-creator.local.md.template \
   .claude/component-creator.local.md

# Edit to your preferences
```

## Validation & Hooks

### CSS Variable Validation (Automatic)

After creating/editing components, validation runs:

```bash
✅ Pass:
className="bg-primary text-primary-foreground"

❌ Fail:
className="bg-[#343E55] text-white"

Fix suggestions provided automatically!
```

### How to Fix Validation Errors

1. Read the error message - it shows exact line numbers
2. Replace hardcoded values with suggested CSS variables
3. Save file - validation re-runs automatically

Common fixes:
```tsx
# Hardcoded → CSS Variable
bg-[#343E55]  → bg-primary
bg-[#F3F4F6]  → bg-muted
text-[#EF4444] → text-destructive
border-[#E4E4E4] → border-semantic-border-layout
```

## Troubleshooting

### Issue: "Component already exists"

**Solution:** Plugin found existing component. Options:
- Use existing component
- Create a variant instead
- Choose a different name

### Issue: "Figma extraction failed"

**Solution:** Fall back to manual description:
- Describe colors (will be mapped to CSS variables)
- Specify variants (primary, secondary, etc.)
- List sizes (sm, default, lg)
- Note interactive states (hover, focus, disabled)

### Issue: "Test failing after generation"

**Solution:**
1. Check test output for specific failure
2. Common issues:
   - Props interface changed → Update test props
   - New variant added → Add to test cases
   - DOM structure changed → Update selectors

### Issue: "Storybook not showing component"

**Solution:**
1. Restart Storybook: `npm run storybook`
2. Clear cache: `rm -rf node_modules/.cache`
3. Check story file location

## Next Steps

### After Component Creation

1. **Review generated code** - Customize if needed
2. **Run tests** - Ensure all pass
3. **View in Storybook** - Check visual appearance
4. **Test responsiveness** - Resize browser
5. **Check accessibility** - Test keyboard navigation
6. **Add to project** - Import and use!

### Iterate and Improve

The plugin is a starting point. Feel free to:
- Add more variants
- Extend functionality
- Improve tests
- Enhance documentation

### Share Feedback

If you find issues or have suggestions:
- Update plugin skills (SKILL.md files)
- Modify validation rules (hooks/scripts/)
- Extend agent capabilities (agents/*.md)

## Cheat Sheet

| Task | Command/Action |
|------|----------------|
| Create component | `/create-component` or just mention it |
| With Figma | Provide Figma link when asked |
| Check existing | Plugin does this automatically |
| Suggest variant | Plugin suggests when similar found |
| Identify subcomponents | Plugin analyzes design automatically |
| Validate CSS vars | Runs automatically on save |
| Run tests | `npm test` |
| View in Storybook | `npm run storybook` |
| Customize settings | Edit `.claude/component-creator.local.md` |

## Examples Gallery

### UI Components Created

- ✅ Avatar - Circular user images with fallback
- ✅ Spinner - Loading indicators
- ✅ Breadcrumbs - Navigation path
- ✅ Progress - Progress bars
- ✅ Skeleton - Loading placeholders

### Custom Components Created

- ✅ UserProfileCard - User info display
- ✅ SearchBar - Search input with button
- ✅ FilterPanel - Multi-filter sidebar
- ✅ DataCard - Metric display cards
- ✅ SettingsForm - User settings modal

All generated with:
- ✓ CSS variables (no hardcoded colors)
- ✓ Responsive design
- ✓ Comprehensive tests
- ✓ Complete documentation
- ✓ Accessibility built-in

---

**Ready to create your first component?**

Try: `/create-component` or just say "I want to create a component for..."

The agent will guide you through the rest!
