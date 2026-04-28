---
description: "[Cursor] Add a prop to an existing myOperator UI component — strict workflow with AskQuestion branching"
argument-hint: Optional component name
---

# Add Prop (Cursor Edition)

Follow this workflow exactly.

## AskQuestion Requirements

- Use Cursor `AskQuestion` for every step that explicitly says AskQuestion.
- Do not replace required AskQuestion prompts with plain chat.
- When AskQuestion is not specified, use a plain message as directed.

## Phase 1: Identify the Component

### Step 1: Resolve component name

If `$ARGUMENTS` is non-empty, treat its trimmed value as the component name.
Otherwise, call:

```ts
AskQuestion({
  questions: [{
    id: "component_choice",
    prompt: "Which component are you adding a prop to?",
    options: [
      { id: "type_name", label: "I'll type the component name" },
      { id: "show_list", label: "Show me the list of available components" }
    ]
  }]
})
```

If the user selects `show_list`:
- Run `ls src/components/ui/*.tsx` and `ls -d src/components/custom/*/` to enumerate.
- Send a plain message listing them and ask the user to type the name in their next message.

If the user selects `type_name`:
- Wait for them to type the name in their next message.

### Step 2: Locate the files

Search in this order:
1. `src/components/ui/<name>.tsx`
2. `src/components/custom/<name>/<name>.tsx` (single-file custom)
3. `src/components/custom/<name>/*.tsx` (multi-file custom)

If multiple matches or no match, ask the user to disambiguate via a plain message.

For multi-file custom components (`isMultiFile: true` in `components.yaml`), call:

```ts
AskQuestion({
  questions: [{
    id: "target_file",
    prompt: "This is a multi-file component. Which file does the prop go in?",
    options: [
      { id: "file_<n>", label: "<filename>.tsx" }
      // one option per .tsx file in the directory
    ]
  }]
})
```

### Step 3: Read the trio

Read all three:
1. The component `.tsx` (and its `types.ts` if it's a custom multi-file component)
2. The matching `*.stories.tsx`
3. The matching `__tests__/<name>.test.tsx`

Keep them in context. Every subsequent edit must match the existing patterns in these files.

## Phase 2: Branch on Flow

Call:

```ts
AskQuestion({
  questions: [{
    id: "flow",
    prompt: "Are you creating a new prop, or syncing a prop you already added in the .tsx?",
    options: [
      { id: "create", label: "Create new prop — I'll add the prop to the .tsx, then update story + test + yaml" },
      { id: "sync",   label: "Sync existing code — User already coded the prop in .tsx; only update story + test + yaml" }
    ]
  }]
})
```

- If `create`, continue to Phase 3 (Flow A).
- If `sync`, skip to Phase 5 (Flow B).

## Phase 3: Flow A — Gather Prop Spec

### Step 1: Prop kind

Call:

```ts
AskQuestion({
  questions: [{
    id: "prop_kind",
    prompt: "What kind of prop is this?",
    options: [
      { id: "cva",       label: "CVA variant group — e.g., tone: info|warning|danger" },
      { id: "boolean",   label: "Boolean flag — e.g., loading, inline, asChild" },
      { id: "string",    label: "String / enum — free-form string or string-literal union" },
      { id: "reactnode", label: "ReactNode slot — icon, label, or arbitrary JSX content" }
    ]
  }]
})
```

### Step 2: Prop name + JSDoc

Send a plain message:

> What's the prop name (camelCase)? And give me a one-line JSDoc description for it.

Wait for the reply. Validate the name with regex: `^[a-z][a-zA-Z0-9]*$`.
Reject names starting with uppercase or containing `_` or `-`.

### Step 3: Kind-specific details

#### If CVA variant group

Send a plain message:

> Tell me: (1) the variant key (e.g., tone), (2) the option list (comma-separated, e.g., info, warning, danger), (3) the default option, and (4) the Tailwind classes for each option. Use semantic tokens — no hex, no bg-gray-*, no text-white.

Show the existing `cva()` variants block from the component as reference and ask to match style.
Wait for reply.

#### If Boolean flag

Call:

```ts
AskQuestion({
  questions: [{
    id: "bool_default",
    prompt: "What's the default value?",
    options: [
      { id: "false", label: "false (conventional default)" },
      { id: "true",  label: "true" }
    ]
  }]
})
```

Then call:

```ts
AskQuestion({
  questions: [{
    id: "render_impact",
    prompt: "How does this prop affect rendering?",
    options: [
      { id: "classname",   label: "className change only — e.g., adds w-full when true" },
      { id: "conditional", label: "Conditional element render — e.g., adds a close button when true" },
      { id: "both",        label: "Both — adds an element AND changes classes on the root" }
    ]
  }]
})
```

Then send a plain message asking for Tailwind classes (if classname change) and/or JSX block to gate (if conditional).

#### If String / enum

Call:

```ts
AskQuestion({
  questions: [{
    id: "string_kind",
    prompt: "Is this prop a free-form string or a finite enum?",
    options: [
      { id: "freeform", label: "Free-form string (e.g., a label, a URL)" },
      { id: "enum",     label: "Finite enum (e.g., 'left' | 'right' | 'center')" }
    ]
  }]
})
```

If enum, send a plain message asking for option list and default.

Then call:

```ts
AskQuestion({
  questions: [{
    id: "string_use",
    prompt: "How is the value consumed?",
    options: [
      { id: "classname", label: "Used in className (e.g., a position selector)" },
      { id: "attribute", label: "Used as an HTML attribute (e.g., aria-label, role)" },
      { id: "content",   label: "Used as content (rendered inside)" }
    ]
  }]
})
```

#### If ReactNode slot

Send a plain message:

> Where does the slot render? (e.g., before children, after children, replacing a placeholder element). And confirm: should it be optional (?:)? Almost always yes.

### Step 4: Validate semantic-token usage

Reject any of:
- Hex literals (`#XXXXXX`)
- `bg-gray-*`
- `text-white`
- `bg-black`
- `text-gray-*`
- Arbitrary color values (e.g. `bg-[#...]`)

Confirm tokens exist with:

```bash
grep -E "(--semantic-|--color-)" src/index.css
```

If a token is not found, suggest the closest match and ask before proceeding.

### Step 5: Breaking-change guard

The new prop must be optional or have a default in destructure.
Refuse required props with no default and explain this breaks `npm run api:check`.

## Phase 4: Flow A — Apply Edits

Edit in this order. Use Edit tool, not Write.

### Step 1: `<component>.tsx`

#### For CVA variant group
- Locate `cva(...)`.
- Add new key inside `variants: { ... }`.
- Add key to `defaultVariants: { ... }`.
- Add key to `forwardRef` destructure and `cva()` args.
- Do not manually edit Props interface for CVA-only additions when `VariantProps` already covers it.

#### For Boolean / String / ReactNode
- Extend Props interface with new field and one-line JSDoc.
- Slot order:
  - Utility props first
  - Content/icon slots next
  - State props last
- Add to destructure with default if applicable.
- Wire into JSX.

Lint rules while editing:
- Any new `<p>` must include `m-0` (or `mb-0` / `my-0`).
- No hex colors, no `bg-gray-*`, no `text-white`. Semantic tokens only.

### Step 2: `<component>.stories.tsx`

Add `argTypes` entry using matrix:

| Prop kind | argTypes shape |
|---|---|
| CVA variant | `control: "select"`, `options: [<all options>]`, `description: "<JSDoc>"` |
| Boolean | `control: "boolean"`, `description: "<JSDoc>"` |
| String (enum) | `control: "select"`, `options: [...]`, `description: "..."` |
| String (free) | `control: "text"`, `description: "..."` |
| ReactNode | `control: "boolean"`, `mapping: { true: <PlaceholderIcon />, false: undefined }`, `description: "..."` |

Add a dedicated story:

```ts
export const <PascalCasePropName>: Story = {
  args: {
    <propName>: <representativeValue>,
    children: "Example",
  },
};
```

For CVA variants, extend comparison stories (e.g. `AllVariants`, `AllSizes`) with new options.
Only update docs design tokens table if the prop introduces a new token row.

### Step 3: `__tests__/<component>.test.tsx`

Match existing style.
- CVA variant: extend `it.each([...])`.
- Boolean: add positive and negative cases.
- ReactNode: render with `data-testid` and assert presence + sibling content.

Bootstrap compat: if component renders `<p>`, ensure tests import/call `assertNoBootstrapMarginBleed(container)`.

## Phase 5: Flow B — Sync Existing Code

### Step 1: Detect the change

Run:

```bash
git diff -- src/components/ui/<name>.tsx src/components/custom/<name>/
```

If diff non-empty, parse for new variants, Props fields, or new destructure entries and extract:
- prop name
- kind
- default
- CVA options (if any)

If diff is empty, ask plain message:

> The file is clean — no uncommitted changes. What's the prop name you added?

### Step 2: Confirm detection

Call:

```ts
AskQuestion({
  questions: [{
    id: "confirm_detected",
    prompt: "I detected: prop `<name>` (kind: `<kind>`, default: `<default>`). Correct?",
    options: [
      { id: "yes", label: "Yes, proceed — use these to update story + test" },
      { id: "no",  label: "No, let me correct — I'll re-enter the details" }
    ]
  }]
})
```

If `no`, gather spec using Flow A questions, but skip `.tsx` edit in Phase 4 Step 1.

### Step 3: Apply story + test edits

Run Phase 4 Step 2 and Step 3 exactly.
Do not re-edit `.tsx` in sync flow.

## Phase 6: Dependency Check (Both Flows)

Compare post-edit imports:

```bash
git diff -- src/components/ui/<name>.tsx | grep '^+import'
```

For each new bare package import:
- Check if already in that component's `dependencies` block in `packages/cli/components.yaml`.
- If missing, look up version in root `package.json`:

```bash
grep '"<pkg-name>"' package.json
```

Confirm with user:

```ts
AskQuestion({
  questions: [{
    id: "add_dep",
    prompt: "New dependency detected: <pkg>@^<version>. Add to components.yaml under <component> -> dependencies?",
    options: [
      { id: "yes", label: "Yes, add it" },
      { id: "no",  label: "No, skip — I'll handle it manually" }
    ]
  }]
})
```

If yes, edit `packages/cli/components.yaml` dependencies array alphabetically.
If no new bare imports, skip silently.

Animation special case:
- If animation utility classes were added and `tailwindcss-animate` is missing, propose adding it.

## Phase 7: Post-Edit Verification

Run in order:

```bash
npm run lint -- --fix src/components/ui/<name>.tsx src/components/ui/<name>.stories.tsx src/components/ui/__tests__/<name>.test.tsx
```

Then:

```bash
npm run test:smart
```

If `test:smart` fails:
- Fix once if failure is in your new test changes.
- If unrelated failure, report and stop.

If `test:smart` says no changed components, run:

```bash
npx vitest run src/components/ui/__tests__/<name>.test.tsx
```

## Phase 8: Completion Report

Print:

| File | Change |
|------|--------|
| src/components/ui/<name>.tsx | [Flow A only] added prop `<propName>` (`<kind>`) |
| src/components/ui/<name>.stories.tsx | argTypes entry, `<PascalCase>` story, extended comparison render |
| src/components/ui/__tests__/<name>.test.tsx | added `it.each` row / `it()` block(s) |
| packages/cli/components.yaml | added dependency `<pkg>@^<version>` *(only if applicable)* |

Then print this boundary reminder verbatim:

> Source edits done. Run /publish-all-cursor when you're ready to beta-publish. This command does not run integrity-snapshot, registry generation, prefix validation, version bump, or publish — those belong to /publish-all-cursor.

## Out-of-Scope (Hard Boundary)

Do not run:
- `cd packages/cli && npm run integrity:snapshot`
- `node scripts/check-integrity.js verify ...`
- `npm run generate-registry`
- `npm run validate:prefix`
- `npm run build` (root or packages/cli)
- `npm version`
- `npm publish` (with or without `MYOPERATOR_PUBLISH_ALLOWED=1`)
- `git add`, `git commit`, `git push`
- `node scripts/sync-mcp-metadata.js`
- Any edit to `packages/cli/src/registry-*.ts`

Only CLI-adjacent file allowed here: `packages/cli/components.yaml` dependencies array (Phase 6 only).

## Important Rules

- Read before edit. Tests must assert exact class names from source.
- Semantic tokens only. Reject hex, `bg-gray-*`, `text-white`, arbitrary color values.
- Every `<p>` needs `m-0`/`mb-0`/`my-0`.
- New props must be optional or defaulted.
- One component per invocation.
- Import conventions:
  - UI components: `@/lib/utils`, sibling `./<name>`
  - Custom components: `../../../lib/utils`, `../../ui/<name>`
  - Never `@/components/ui/...` in custom components
- One-line JSDoc on every new prop field.
- Stop at source boundary.

## Error Handling

- Component not found -> list available components, ask user to pick.
- Required prop without default -> reject and explain.
- Hex color supplied -> reject and suggest token.
- Lint/tests fail on new code -> fix and retry once.
- Lint/tests fail on unrelated code -> report and stop.
- Multi-file custom component, no file specified -> ask.
