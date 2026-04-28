---
description: "[Cursor] Add or sync a prop on an existing component (.tsx + story + test + yaml deps). Stops at source boundary; /publish-all-cursor handles registry/build/publish."
argument-hint: Optional component name
---

# Add Prop Workflow (Cursor Edition)

You are adding (or syncing) a single prop on an existing myOperator UI component. This command uses **Cursor's native `AskQuestion` tool** for all interactive prompts.

> **Note:** This is the Cursor-native version of `/add-prop`.
> The original at `.claude/commands/add-prop.md` is the Claude Code version (uses `AskUserQuestion`).

You handle **source-side edits only** — `.tsx`, `.stories.tsx`, `.test.tsx`, and (when a new npm import appears) the `dependencies` array in `packages/cli/components.yaml`. You DO NOT run integrity-snapshot, registry generation, prefix validation, version bump, npm publish, git commit, or git push — those belong to `/publish-all-cursor`.

There are two flows:
- **Flow A — Create new prop**: user wants you to write the prop end-to-end.
- **Flow B — Sync existing code**: user already added the prop in `.tsx` and just wants the story + test (and yaml deps if needed) updated to match.

---

## Phase 1: Identify the Component

### Step 1: Resolve component name

If `$ARGUMENTS` is non-empty, treat its trimmed value as the component name. Otherwise, call:

```
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

If the user selects "show_list":
- `ls src/components/ui/*.tsx` and `ls -d src/components/custom/*/` to enumerate
- Send a plain message listing them and ask the user to type the name in their next message

If the user selects "type_name", wait for them to type the name in their next message.

### Step 2: Locate the files

Search in this order:
1. `src/components/ui/<name>.tsx`
2. `src/components/custom/<name>/<name>.tsx` (single-file custom)
3. `src/components/custom/<name>/*.tsx` (multi-file custom)

If multiple matches or no match, ask the user to disambiguate via a plain message.

For multi-file custom components (`isMultiFile: true` in `components.yaml`):

```
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
- The component `.tsx` (and its `types.ts` if it's a custom multi-file component)
- The matching `*.stories.tsx`
- The matching `__tests__/<name>.test.tsx`

Keep them in context — every subsequent edit must match the existing patterns in these files.

---

## Phase 2: Branch on Flow

```
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

If `create` → continue to Phase 3 (Flow A).
If `sync` → skip to Phase 5 (Flow B).

---

## Phase 3: Flow A — Gather Prop Spec

### Step 1: Prop kind

```
AskQuestion({
  questions: [{
    id: "prop_kind",
    prompt: "What kind of prop is this?",
    options: [
      { id: "cva",      label: "CVA variant group — e.g., tone: info|warning|danger" },
      { id: "boolean",  label: "Boolean flag — e.g., loading, inline, asChild" },
      { id: "string",   label: "String / enum — free-form string or string-literal union" },
      { id: "reactnode", label: "ReactNode slot — icon, label, or arbitrary JSX content" }
    ]
  }]
})
```

### Step 2: Prop name + JSDoc

Send a plain message asking for both:
> "What's the prop name (camelCase)? And give me a one-line JSDoc description for it."

Wait for the user's reply. Validate the name matches `/^[a-z][a-zA-Z0-9]*$/`. Reject names starting with uppercase or containing `_`/`-`.

### Step 3: Kind-specific details

**If CVA variant group:**

Send a plain message:
> "Tell me: (1) the variant key (e.g., `tone`), (2) the option list (comma-separated, e.g., `info, warning, danger`), (3) the default option, and (4) the Tailwind classes for each option. Use semantic tokens — no hex, no `bg-gray-*`, no `text-white`."

Show the user the existing `cva()` block from the component as reference:
```
Here's the existing variant block in <component>.tsx:
<paste the cva variants object>

Match this style for your new options.
```

Wait for the user's reply.

**If Boolean flag:**

```
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

Then:

```
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

Then send a plain message asking for the Tailwind classes (if classname change) and/or the JSX block to gate (if conditional). Wait for reply.

**If String / enum:**

```
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

If `enum`: send a plain message asking for the option list and default. Wait for reply.

Then ask how it's consumed:

```
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

**If ReactNode slot:**

Send a plain message:
> "Where does the slot render? (e.g., before children, after children, replacing a placeholder element). And confirm: should it be optional (`?:`)? Almost always yes."

Wait for reply.

### Step 4: Validate semantic-token usage

Reject any of: hex literals (`#XXXXXX`), `bg-gray-*`, `text-white`, `bg-black`, `text-gray-*`, arbitrary color values (`bg-[#...]`).

Confirm tokens exist:
```bash
grep -E "(--semantic-|--color-)" src/index.css
```

If a token isn't found, send a plain message suggesting the closest match and ask before proceeding.

### Step 5: Breaking-change guard

The new prop MUST be optional or have a default in the destructure. Refuse if the user wants a required prop with no default — explain it would break `npm run api:check` at commit time. Send a plain message asking them to make it optional.

---

## Phase 4: Flow A — Apply Edits

Edit in this order. Use the `Edit` tool, not `Write`.

### Step 1: `<component>.tsx`

**For CVA variant group:**
- Locate the `cva(...)` call. Add the new key inside `variants: { ... }` with all options as Tailwind class strings.
- Add the new key to `defaultVariants: { ... }` with the user's chosen default.
- Add the new key to the forwardRef destructure list AND to the `cva()` call args (otherwise the prop is silently ignored — common mistake).
- The `VariantProps<typeof <component>Variants>` typing picks it up automatically — do NOT manually edit the `Props` interface for CVA additions.

**For Boolean / String / ReactNode prop:**
- Extend the `Props` interface with the new field, including `/** JSDoc */`. Slot order:
  - Utility props (asChild, etc.) first
  - Content/icon slots next
  - State props (loading, inline) last
- Add to the forwardRef destructure list with default value if applicable.
- Wire into JSX (className conditional or conditional element).

**Lint rules to enforce while editing:**
- Any new `<p>` MUST include `m-0` (or be inside a CVA base string with `m-0`). Pre-commit `check-bootstrap-compat.js` blocks otherwise.
- No hex colors, no `bg-gray-*`, no `text-white`. Semantic tokens only.

### Step 2: `<component>.stories.tsx`

Add an `argTypes` entry. Control type matrix:

| Prop kind | argTypes shape |
|-----------|----------------|
| CVA variant | `control: "select"`, `options: [<all options>]`, `description: "<JSDoc>"` |
| Boolean | `control: "boolean"`, `description: "<JSDoc>"` |
| String (enum) | `control: "select"`, `options: [...]`, `description: "..."` |
| String (free) | `control: "text"`, `description: "..."` |
| ReactNode | `control: "boolean"`, `mapping: { true: <PlaceholderIcon />, false: undefined }`, `description: "..."` |

Add a dedicated story:

```tsx
export const <PascalCasePropName>: Story = {
  args: {
    <propName>: <representativeValue>,
    children: "Example",
  },
};
```

For CVA variants, also extend the existing comparison story (commonly named `AllVariants`, `AllSizes`, etc.) by adding the new option(s) inline.

Only update the `parameters.docs.description.component` Design Tokens table if the prop introduces a NEW token row.

### Step 3: `__tests__/<component>.test.tsx`

Match the existing test style.

**For CVA variant group** — extend the `it.each([...])` block with the new options.

**For Boolean prop** — add positive + negative cases.

**For ReactNode slot** — render with `data-testid` and assert presence + sibling content.

**Bootstrap compat**: if the component renders any `<p>`, ensure the test imports and calls `assertNoBootstrapMarginBleed(container)`.

---

## Phase 5: Flow B — Sync Existing Code

### Step 1: Detect the change

Run:
```bash
git diff -- src/components/ui/<name>.tsx src/components/custom/<name>/
```

If the diff is non-empty, parse it for new lines inside `variants: { ... }`, new fields in the `Props` interface, or new entries in the forwardRef destructure. Extract: prop name, kind, default, and (for CVA) the new options.

If the diff is empty (file already committed), send a plain message:
> "The file is clean — no uncommitted changes. What's the prop name you added?"

Wait for the user's reply, then read the file and locate the prop.

### Step 2: Confirm detection

```
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

If `no`, fall back to the Flow A Phase 3 questions to gather the spec, but skip the `.tsx` edit in Phase 4 Step 1.

### Step 3: Apply story + test edits

Run **Phase 4 Step 2** (story) and **Phase 4 Step 3** (test) exactly as in Flow A.

DO NOT re-edit the `.tsx`. The user owns it in this flow.

---

## Phase 6: Dependency Check (Both Flows)

Compare the post-edit `.tsx` import list against the pre-edit version:

```bash
git diff -- src/components/ui/<name>.tsx | grep '^+import'
```

For each new bare-package import (e.g., `@radix-ui/react-tooltip`, NOT relative imports):

1. Check whether it's already declared in the component's `dependencies:` block in `packages/cli/components.yaml`. If yes, skip silently.
2. If not, look up the version installed in root `package.json`:
   ```bash
   grep '"<pkg-name>"' package.json
   ```
3. Confirm with the user:

```
AskQuestion({
  questions: [{
    id: "add_dep",
    prompt: "New dependency detected: <pkg>@^<version>. Add to components.yaml under <component> → dependencies?",
    options: [
      { id: "yes", label: "Yes, add it" },
      { id: "no",  label: "No, skip — I'll handle it manually" }
    ]
  }]
})
```

4. If approved, edit `packages/cli/components.yaml` — locate the component's `dependencies:` array and add the new entry. Maintain alphabetical order. Use caret range (`^X.Y.Z`).

If no new bare-package imports appeared, skip this phase silently.

**Animation classes special case**: if the user added `animate-in`, `animate-out`, `fade-in-*`, `zoom-in-*`, or `slide-in-from-*` classes and `tailwindcss-animate` is not in the component's deps, propose adding it.

---

## Phase 7: Post-Edit Verification

Run, in order:

```bash
npm run lint -- --fix src/components/ui/<name>.tsx src/components/ui/<name>.stories.tsx src/components/ui/__tests__/<name>.test.tsx
```

Then:

```bash
npm run test:smart
```

If `test:smart` fails:
- Read the failure output.
- If the failure is in the test you just wrote (typical: wrong class string in `toHaveClass` because you guessed instead of reading), fix and re-run once.
- If the failure is in an unrelated test, report it and STOP. Do not auto-fix.

If `test:smart` reports "no changed components", fall back to:
```bash
npx vitest run src/components/ui/__tests__/<name>.test.tsx
```

---

## Phase 8: Completion Report

Print a summary table:

```markdown
| File | Change |
|------|--------|
| src/components/ui/<name>.tsx | [Flow A only] added prop `<propName>` (`<kind>`) |
| src/components/ui/<name>.stories.tsx | argTypes entry, `<PascalCase>` story, extended comparison render |
| src/components/ui/__tests__/<name>.test.tsx | added `it.each` row / `it()` block(s) |
| packages/cli/components.yaml | added dependency `<pkg>@^<version>` *(only if applicable)* |
```

Then print the boundary reminder verbatim:

> **Source edits done.** Run `/publish-all-cursor` when you're ready to beta-publish. This command does not run integrity-snapshot, registry generation, prefix validation, version bump, or publish — those belong to `/publish-all-cursor`.

---

## Out-of-Scope (Hard Boundary)

You MUST NOT run any of these:
- `cd packages/cli && npm run integrity:snapshot`
- `node scripts/check-integrity.js verify ...`
- `npm run generate-registry`
- `npm run validate:prefix`
- `npm run build` (root or `packages/cli`)
- `npm version`
- `npm publish` (with or without `MYOPERATOR_PUBLISH_ALLOWED=1`)
- `git add`, `git commit`, `git push`
- `node scripts/sync-mcp-metadata.js`
- Any edit to `packages/cli/src/registry-*.ts` (auto-generated)

`packages/cli/components.yaml` is the only CLI-adjacent file you may write to, and only its `dependencies:` array, only when a real new bare-package import appeared in Phase 6.

---

## Important Rules

1. **Read before you edit.** Test assertions must use the EXACT classes from the source `.tsx`. Never guess class names.
2. **Semantic tokens only.** Reject hex literals, `bg-gray-*`, `text-white`, arbitrary color values. Verify in `src/index.css`.
3. **Bootstrap `<p>` rule.** Every `<p>` in component files needs `m-0` (or `mb-0`/`my-0`).
4. **Optional props or defaults.** Refuse required props without defaults — they break `api:check`.
5. **One component per invocation.** If the user wants prop changes across multiple components, run the command once per component.
6. **Imports.** UI components: `@/lib/utils`, sibling `./<name>`. Custom components: `../../../lib/utils`, `../../ui/<name>`. Never `@/components/ui/...` in custom components.
7. **JSDoc on every new prop.** One-line `/** ... */` immediately above the field in the `Props` interface.
8. **Stop at the source boundary.** When in doubt, leave it for `/publish-all-cursor`.

---

## Error Handling

- Component not found → list available components via plain message, ask user to pick one
- User wants required prop with no default → reject, explain breaking-change risk
- User supplies hex color → reject, suggest closest semantic token
- Lint/tests fail on the new code → fix and retry once; if still failing, stop and report
- Lint/tests fail on unrelated code → report and stop, do not auto-fix
- Multi-file custom component, no file specified → ask which file via AskQuestion
