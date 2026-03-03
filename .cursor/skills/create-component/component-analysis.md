# Component Analysis Reference

Detailed patterns for the Phase 1 analysis step in `SKILL.md`.

## Building a Capability Map

Scan the library and produce this table before making any decision:

```
| Component        | Location | Variants                   | Key Props                         |
|------------------|----------|----------------------------|-----------------------------------|
| Button           | ui/      | 7 variants, 4 sizes        | onClick, loading, leftIcon        |
| Badge            | ui/      | 5 variants                 | —                                 |
| TextField        | ui/      | —                          | label, error, helperText          |
| WalletTopup      | custom/  | —                          | amounts, onPay, currency          |
```

Extract metadata via Grep:
- `export interface.*Props` → props interfaces
- `variants:` blocks → CVA variant names
- `export {` or `export const` → public exports

## Decision Examples

### Suggest a Variant

**Input:** "outlined-button"

```
# Component Analysis: OutlinedButton

Existence Check
✅ Found: `button` at src/components/ui/button.tsx

Capability Map:
| Component | Variants                                        |
|-----------|-------------------------------------------------|
| Button    | default, primary, secondary, destructive,       |
|           | outline, ghost, link                            |

Recommendation: USE EXISTING VARIANT
<Button variant="outline"> already exists.
No new component needed.
```

### Create a New Component

**Input:** "avatar"

```
# Component Analysis: Avatar

Existence Check
❌ Not found
✅ Similar: `badge` (circular) — different purpose

Recommendation: CREATE NEW COMPONENT

Reasoning:
- Avatar displays user images with fallback
- Badge shows status indicators
- Different props: (src, alt, fallback) vs (children)
- Different behavior: image loading vs static content

Category: core
Structure: Single file
Dependencies (external): class-variance-authority
Dependencies (internal): none
```

### Identify Subcomponents (Composition)

**Input:** "user-settings-form"

```
# Component Analysis: UserSettingsForm

Existence Check
❌ Not found

Recommendation: CREATE NEW COMPONENT (Custom)

Identified subcomponents:
| Component   | Location                          | Usage                        |
|-------------|-----------------------------------|------------------------------|
| form-modal  | src/components/ui/form-modal.tsx  | Modal wrapper with save/cancel|
| text-field  | src/components/ui/text-field.tsx  | Name, email, phone inputs    |
| select-field| src/components/ui/select-field.tsx| Timezone, language selects   |
| switch      | src/components/ui/switch.tsx      | Notification toggles         |
| alert       | src/components/ui/alert.tsx       | Error/success messages       |

Category: custom
Structure: Single file (composition)
internalDependencies: [form-modal, text-field, select-field, switch, alert]
```

## Multi-File Structure Detection

**Use single file for:** Simple primitives (Button, Badge, Input), no internal state management, no complex sub-structures.

**Use multi-file for:** Complex components with several subcomponents, shared types, multiple related parts that work together.

Multi-file structure:
```
src/components/custom/component-name/
├── component-name.tsx      # Main component (exported)
├── component-subpart.tsx   # Internal subcomponent
├── types.ts                # Shared types
├── utils.ts                # Helper functions
└── index.ts                # Public exports
```

## Error Handling

| Situation | Action |
|-----------|--------|
| No similar component | Safe to create new |
| Multiple similar components | Present options, ask user to choose |
| Unclear variant vs new | Ask user for clarification |
| Missing internal dependency | Note in analysis, add to `internalDependencies` |
