# Component Creator Plugin

Intelligent React component creation plugin for the myOperator UI component library. Automates component generation with design system validation, Figma integration, and comprehensive testing.

## Features

- ✅ **Intelligent Component Analysis** - Checks for existing components and suggests variants
- ✅ **Subcomponent Identification** - Identifies reusable components to avoid duplication
- ✅ **Design System Validation** - Enforces CSS variable usage (no hardcoded colors)
- ✅ **Figma Integration** - Optionally extracts design context from Figma links
- ✅ **Responsive Design Validation** - Ensures mobile-first approach
- ✅ **Auto-Test Generation** - Creates comprehensive test suites
- ✅ **Storybook Documentation** - Generates docs following established patterns
- ✅ **Registry Management** - Automatically updates components.yaml and exports

## Installation

The plugin is already installed in this project at:
```
.claude/plugins/component-creator/
```

## Usage

### Method 1: Slash Command (Explicit)

Use the `/create-component` command to explicitly trigger component creation:

```
/create-component
```

The command will guide you through:
1. Component name and description
2. Existence check and variant suggestion
3. Component type (UI vs custom)
4. Figma design link (optional)
5. Subcomponent identification
6. Design validation and generation

### Method 2: Agent (Proactive)

The plugin includes a specialized agent that automatically activates when you:
- Mention creating a component
- Share a Figma design link
- Describe a UI element you need

The agent will proactively guide you through the creation process.

## Workflow

### 1. Component Discovery

The plugin searches existing components:
```
Searching:
- src/components/ui/*.tsx (21 UI components)
- src/components/custom/*/ (Custom components)

Found: button.tsx
Suggestion: Create variant instead of new component
```

### 2. Design Context

**Option A: Figma Integration**
```
Figma URL: https://figma.com/design/abc123/Design?node-id=1-2

Extracting:
- Design context (layouts, spacing, typography)
- Screenshots (visual reference)
- Colors (mapped to CSS variables)
```

**Option B: Manual Description**
```
Describe:
- Visual appearance (colors, spacing, typography)
- Variants (primary, secondary, destructive)
- Sizes (sm, default, lg, xl)
- Interactive states (hover, focus, disabled)
```

### 3. Subcomponent Identification

```
Analyzing design...

Identified reusable components:
✓ text-field (for name input)
✓ button (for submit action)
✓ alert (for error messages)

Will compose using existing primitives.
```

### 4. Design System Validation

```
Validating design system compliance...

✓ All colors mapped to CSS variables
  - #343E55 → bg-primary
  - #F3F4F6 → bg-muted
  - #EF4444 → bg-destructive

✓ Responsive breakpoints used
  - px-4 sm:px-6 lg:px-8
  - text-sm md:text-base

✓ Accessibility standards met
  - Focus states: focus:ring-2
  - ARIA labels present
```

### 5. Component Generation

Generates:
- `src/components/ui/component-name.tsx` - Component file
- `src/components/ui/__tests__/component-name.test.tsx` - Test file
- `src/components/ui/component-name.stories.tsx` - Storybook story
- Updates to `src/index.ts` (exports)
- Updates to `packages/cli/components.yaml` (registry)

### 6. Validation

```
Running integrity check...
✓ Only intended component changed
✓ All tests pass
✓ Storybook renders correctly
```

## Skills

The plugin includes three specialized skills:

### 1. Component Analysis
- Checks for component existence
- Suggests variants vs new components
- Identifies reusable subcomponents
- Determines component category

### 2. Design System Validator
- Maps colors to CSS variables
- Validates responsive design
- Checks accessibility compliance
- Enforces design system rules

### 3. Storybook Generator
- Creates comprehensive documentation
- Generates design tokens table
- Includes typography specifications
- Provides usage examples

## Hooks

### PostToolUse Hook: CSS Variable Validation

Automatically runs after Write/Edit operations on component files:

```bash
🔍 Validating CSS variables in: src/components/ui/button.tsx
✅ CSS variable validation passed
```

If hardcoded colors are found:
```bash
❌ Found hardcoded hex colors:
45:  className="bg-[#343E55] text-white"

💡 Fix: Replace with CSS variables
   Example: bg-[#343E55] → bg-primary
```

## Configuration

Copy the template to customize plugin behavior:

```bash
cp .claude/plugins/component-creator/.claude/component-creator.local.md.template \
   .claude/component-creator.local.md
```

Edit `.claude/component-creator.local.md` to set preferences:
- Default component type (UI vs custom)
- Figma API token (optional)
- Auto-test generation
- Design system validation strictness
- Storybook documentation options

## Examples

### Example 1: Creating a Simple UI Component

```
User: "Create an avatar component for displaying user profile images"

Plugin:
1. Checks existence → No "avatar" found
2. Checks similar → Found "badge" (circular shape)
3. Recommends → Create new component (different purpose)
4. Asks for Figma → User provides link
5. Extracts design → Circular image with fallback, 5 sizes
6. Maps colors → bg-muted, border-border, text-muted-foreground
7. Generates component → With CVA variants for sizes
8. Generates tests → 15 test cases
9. Generates story → With design tokens table
10. Updates registry → Added to components.yaml
```

### Example 2: Suggesting a Variant

```
User: "Create an outlined button component"

Plugin:
1. Checks existence → Found "button" component
2. Analyzes → "outline" variant already exists!
3. Recommends → Use existing <Button variant="outline">
4. Shows code example → Usage pattern
```

### Example 3: Composite Component

```
User: "Create a user settings form"

Plugin:
1. Checks existence → No existing component
2. Recommends → Custom component (app-specific)
3. Identifies subcomponents:
   - form-modal (wrapper)
   - text-field (inputs)
   - select-field (dropdowns)
   - switch (toggles)
4. Generates → Composite component using existing primitives
5. Creates in → src/components/custom/
```

## Design System Rules

### CSS Variables (Enforced)

**NEVER use hardcoded colors:**
```tsx
❌ className="bg-[#343E55] text-white"
❌ className="bg-gray-50 text-gray-900"
```

**ALWAYS use semantic tokens:**
```tsx
✅ className="bg-primary text-primary-foreground"
✅ className="bg-semantic-bg-primary text-semantic-text-primary"
```

### Responsive Design (Enforced)

**Mobile-first approach:**
```tsx
✅ className="px-4 sm:px-6 lg:px-8"
✅ className="text-sm md:text-base lg:text-lg"
✅ className="flex-col sm:flex-row"
```

### Component Architecture

**Prefer composition:**
```tsx
✅ import { Button } from "./button"
✅ import { TextField } from "./text-field"
   <FormModal>
     <TextField />
     <Button />
   </FormModal>
```

**Avoid duplication:**
```tsx
❌ Creating new input component when text-field exists
✅ Using existing text-field component
```

## Testing

The plugin generates comprehensive test suites:

```tsx
✓ Renders children correctly
✓ All variants render with correct classes
✓ All sizes render with correct classes
✓ Custom className is applied
✓ Ref forwarding works
✓ Additional props spread correctly
✓ Type compatibility (CVA ↔ Props)
```

Run tests:
```bash
npm test
```

## Storybook Documentation

Generated documentation includes:

1. **Installation** - CLI command
2. **Import** - How to import
3. **Design Tokens** - CSS variables table
4. **Typography** - Font specifications
5. **Usage** - Code examples
6. **Interactive Stories** - Variant playground

View in Storybook:
```bash
npm run storybook
```

## Troubleshooting

### Hook Validation Fails

If the CSS variable validation hook blocks your changes:

1. **Check the error message** - It shows which colors are hardcoded
2. **Replace with CSS variables** - Follow the suggested mappings
3. **Re-save the file** - Validation will re-run automatically

To temporarily disable validation:
```bash
# Edit .claude/component-creator.local.md
validateCssVariables: false
```

### Figma Integration Issues

If Figma extraction fails:

1. **Verify URL format** - Must be `https://figma.com/design/:fileKey/:fileName?node-id=:nodeId`
2. **Check permissions** - Ensure you have access to the Figma file
3. **Fall back to manual** - Describe the design manually

### Component Not Added to Registry

If `components.yaml` isn't updated:

1. **Check component type** - Only UI components go in registry
2. **Manual update** - Add entry to `packages/cli/components.yaml`
3. **Run generator** - `cd packages/cli && npm run generate-registry`

## Best Practices

1. **Always check existing components first** - Avoid duplication
2. **Prefer variants over new components** - Maintain consistency
3. **Use semantic CSS variables** - Enable theme switching
4. **Compose with existing primitives** - Don't reinvent the wheel
5. **Write comprehensive tests** - Maintain code quality
6. **Document thoroughly** - Help future developers
7. **Validate responsiveness** - Ensure mobile compatibility
8. **Follow accessibility standards** - Build inclusive UIs

## Architecture

```
.claude/plugins/component-creator/
├── .claude-plugin/
│   └── plugin.json                 # Plugin manifest
├── commands/
│   └── create-component.md         # /create-component command
├── agents/
│   └── component-creator-agent.md  # Proactive agent
├── skills/
│   ├── component-analysis/
│   │   └── SKILL.md                # Existence check, variant suggestion
│   ├── design-system-validator/
│   │   └── SKILL.md                # CSS variable validation
│   └── storybook-generator/
│       └── SKILL.md                # Documentation generation
├── hooks/
│   ├── hooks.json                  # Hook configuration
│   └── scripts/
│       └── validate-css-variables.sh # Validation script
├── .claude/
│   └── component-creator.local.md.template # Settings template
└── README.md                       # This file
```

## Contributing

To improve this plugin:

1. **Modify skills** - Update SKILL.md files for behavior changes
2. **Add hooks** - Create new validation scripts in `hooks/scripts/`
3. **Extend agent** - Update agent.md for new capabilities
4. **Test thoroughly** - Create sample components to verify

## Support

For issues or questions:
- Review this README
- Check `.claude/component-creator.local.md` settings
- Examine validation errors for guidance
- Consult existing component patterns in `src/components/ui/`

---

**Built for myOperator UI Component Library** | Version 1.0.0
