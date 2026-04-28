---
description: Add or sync a prop on an existing component (.tsx + story + test + yaml deps). Stops at the source boundary; /publish-all handles registry/build/publish.
argument-hint: Optional component name
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "AskUserQuestion"]
---

# Add Prop Workflow

You are adding (or syncing) a single prop on an existing myOperator UI component. You handle **source-side edits only** — `.tsx`, `.stories.tsx`, `.test.tsx`, and (when a new npm import appears) the `dependencies` array in `packages/cli/components.yaml`. You DO NOT run integrity-snapshot, registry generation, prefix validation, version bump, npm publish, git commit, or git push — those belong to `/publish-all`.

There are two flows:
- **Flow A — Create new prop**: user wants you to write the prop end-to-end.
- **Flow B — Sync existing code**: user already added the prop in `.tsx` and just wants the story + test (and yaml deps if needed) updated to match.

---

## Phase 1: Identify the Component

### Step 1: Resolve component name

If `$ARGUMENTS` is non-empty, treat its trimmed value as the component name. Otherwise, ask:

- question: "Which component are you adding a prop to?"
- header: "Component"
- Options:
  - "I'll type the component name" — "Free-form name (e.g., button, switch, alert)"
  - "Show me the list" — "I'll list available components"

If the user picks "Show me the list", `ls src/components/ui/*.tsx` and `ls -d src/components/custom/*/` and present a `Glob`-trimmed list. Then re-ask with concrete options (max 4 — use Other for the rest).

### Step 2: Locate the files

Search in this order:
1. `src/components/ui/<name>.tsx`
2. `src/components/custom/<name>/<name>.tsx` (single-file custom)
3. `src/components/custom/<name>/*.tsx` (multi-file custom)

If multiple matches or no match, ask the user to disambiguate.

For multi-file custom components (`isMultiFile: true` in `components.yaml`), ask which file the prop belongs to:

- question: "This is a multi-file component. Which file does the prop go in?"
- header: "File"
- Options: list the `.tsx` files in the directory

### Step 3: Read the trio

Read all three:
- The component `.tsx` (and its `types.ts` if it's a custom multi-file component)
- The matching `*.stories.tsx`
- The matching `__tests__/<name>.test.tsx`

Keep them in context — every subsequent edit must match the existing patterns in these files (CVA structure, story conventions, test style).

---

## Phase 2: Branch on Flow

Ask:

- question: "Are you creating a new prop, or syncing a prop you already added in the .tsx?"
- header: "Flow"
- Options:
  - "Create new prop" — "I'll add the prop to the .tsx, then update story + test + yaml"
  - "Sync existing code" — "User already coded the prop in .tsx; only update story + test + yaml"

If "Create new prop" → continue to Phase 3 (Flow A).
If "Sync existing code" → skip to Phase 5 (Flow B).

---

## Phase 3: Flow A — Gather Prop Spec

### Step 1: Prop kind

Ask:

- question: "What kind of prop is this?"
- header: "Prop kind"
- Options:
  - "CVA variant group" — "A new variants/sizes/etc. category that switches Tailwind classes (e.g., tone: info|warning|danger)"
  - "Boolean flag" — "true/false toggle (e.g., loading, inline, asChild)"
  - "String / enum" — "Free-form string or string-literal union not driven by CVA"
  - "ReactNode slot" — "Icon, label, or arbitrary JSX content (e.g., leftIcon, footer)"

### Step 2: Prop name + JSDoc

Ask the user for:
- The prop name (camelCase). Validate it matches `/^[a-z][a-zA-Z0-9]*$/`. Reject names starting with uppercase or containing `_`/`-`.
- A one-line JSDoc description.

### Step 3: Kind-specific details

**If CVA variant group:**
- Ask for the variant key (e.g., `tone`).
- Ask for the option list (comma-separated, e.g., `info, warning, danger`).
- Ask for the default option.
- For each option, ask for the Tailwind classes. Show the existing CVA block from the component as a reference so the user matches its style.

**If Boolean flag:**
- Ask for the default value (`false` is the conventional default).
- Ask whether the flag drives a className change, conditional element rendering, or both.
- If className change: ask for the classes (one set for `true`, optionally one for `false`).
- If conditional render: ask the user to describe the JSX it gates.

**If String / enum:**
- Ask whether the value is free-form or a finite enum.
- If enum: collect the option list and default.
- Ask how it's consumed (className, attribute, content).

**If ReactNode slot:**
- Ask where the slot renders (e.g., before children, after children, replacing a placeholder).
- Ask whether it's optional (almost always yes).

### Step 4: Validate semantic-token usage

Any Tailwind classes the user supplies must use semantic tokens. Reject and re-prompt if you see:
- Hex literals (`#XXXXXX`)
- `bg-gray-*`, `text-white`, `bg-black`, `text-gray-*`
- Arbitrary color values (`bg-[#...]`)

Confirm tokens exist:
```bash
grep -E "(--semantic-|--color-)" src/index.css
```

If a token the user named isn't found, suggest the closest match and ask before proceeding.

### Step 5: Breaking-change guard

The new prop MUST be optional or have a default in the destructure. Refuse if the user wants a required prop with no default — this would break `npm run api:check` at commit time. Explain and ask them to make it optional.

---

## Phase 4: Flow A — Apply Edits

Edit in this order. Use the `Edit` tool, not `Write`.

### Step 1: `<component>.tsx`

**For CVA variant group:**
- Locate the `cva(...)` call. Add the new key inside `variants: { ... }` with all options as Tailwind class strings.
- Add the new key to `defaultVariants: { ... }` with the user's chosen default.
- The `VariantProps<typeof <component>Variants>` typing picks it up automatically — do NOT manually edit the `Props` interface for CVA additions.
- The forwardRef destructure should already accept `...props` — no edit needed unless the prop drives conditional render.

**For Boolean / String / ReactNode prop:**
- Extend the `Props` interface with the new field, including `/** JSDoc */`. Place it in the right slot:
  - Utility props (asChild, etc.) first
  - Content/icon slots next
  - State props (loading, inline) last
- Add to the forwardRef destructure list with default value if applicable.
- Wire into JSX (className conditional or conditional element).

**Lint rules to enforce while editing:**
- Any new `<p>` MUST include `m-0` (or be inside a CVA base string with `m-0`). The pre-commit `check-bootstrap-compat.js` will block otherwise.
- No hex colors, no `bg-gray-*`, no `text-white`. Semantic tokens only.

After editing, **read the file back** and confirm the change is syntactically clean.

### Step 2: `<component>.stories.tsx`

Add an `argTypes` entry. Control type matrix:

| Prop kind | argTypes shape |
|-----------|----------------|
| CVA variant | `control: "select"`, `options: [<all options>]`, `description: "<JSDoc>"` |
| Boolean | `control: "boolean"`, `description: "<JSDoc>"` |
| String (enum) | `control: "select"`, `options: [...]`, `description: "..."` |
| String (free) | `control: "text"`, `description: "..."` |
| ReactNode | `control: "boolean"`, `mapping: { true: <PlaceholderIcon />, false: undefined }`, `description: "..."` |

Add a dedicated story for the prop:

```tsx
export const <PascalCasePropName>: Story = {
  args: {
    <propName>: <representativeValue>,
    children: "Example",
  },
};
```

For CVA variants, also extend the existing comparison story (commonly named `AllVariants`, `ButtonKinds`, `Sizes`, etc.) by adding the new option(s) inline:

```tsx
// existing render
<Component variant="default">Default</Component>
<Component variant="primary">Primary</Component>
// + new
<Component variant="<newOption>">{"<newOption>"}</Component>
```

Only update the `parameters.docs.description.component` Design Tokens table if the prop introduces a NEW token row (e.g., a `tone="warning"` that uses `--semantic-warning-*` for the first time). Do not pad it otherwise.

### Step 3: `__tests__/<component>.test.tsx`

Match the existing test style.

**For CVA variant group** — extend the `it.each([...])` block:
```tsx
it.each([
  ["existing", "existing-class"],
  ["<newOption>", "<representativeClass>"],
] as const)("renders %s variant", (variant, expectedClass) => {
  render(<Component variant={variant}>Test</Component>);
  expect(screen.getByRole("...")).toHaveClass(expectedClass);
});
```

**For Boolean prop** — add positive + negative cases:
```tsx
it("applies <propName> when true", () => {
  render(<Component <propName>>Test</Component>);
  expect(/* effect */).toBe(/* ... */);
});

it("does not apply <propName> when false (default)", () => {
  render(<Component>Test</Component>);
  expect(/* effect */).not.toBe(/* ... */);
});
```

**For ReactNode slot:**
```tsx
it("renders <propName> slot", () => {
  render(
    <Component <propName>={<span data-testid="slot">x</span>}>
      Test
    </Component>
  );
  expect(screen.getByTestId("slot")).toBeInTheDocument();
  expect(screen.getByText("Test")).toBeInTheDocument();
});
```

**Bootstrap compat**: if the component renders any `<p>`, ensure the test imports and calls:
```tsx
import { assertNoBootstrapMarginBleed } from "./utils/bootstrap-compat";
// inside a render test:
assertNoBootstrapMarginBleed(container);
```

Do not duplicate this if it's already present.

---

## Phase 5: Flow B — Sync Existing Code

### Step 1: Detect the change

Run:
```bash
git diff -- src/components/ui/<name>.tsx src/components/custom/<name>/
```

If the diff is non-empty:
- Parse it for new lines inside `variants: { ... }`, new fields in the `Props` interface, or new entries in the forwardRef destructure.
- Extract: prop name, kind (CVA / boolean / string / ReactNode), default, and (for CVA) the new options.

If the diff is empty (file already committed):
- Ask the user for the prop name.
- Read the file and locate the prop. Infer kind from the source.

### Step 2: Confirm detection

Show the user what you detected and ask to confirm:

- question: "I detected: prop `<name>` (kind: `<kind>`, default: `<default>`). Correct?"
- header: "Detected prop"
- Options:
  - "Yes, proceed" — "Use these to update story + test"
  - "No, let me correct" — "I'll re-enter the details"

If "No", fall back to the Flow A Phase 3 questions to gather the spec, but skip the `.tsx` edit in Phase 4 Step 1 — the user has already written it.

### Step 3: Apply story + test edits

Run **Phase 4 Step 2** (story) and **Phase 4 Step 3** (test) exactly as in Flow A.

DO NOT re-edit the `.tsx`. The user owns it in this flow.

---

## Phase 6: Dependency Check (Both Flows)

Compare the post-edit `.tsx` import list against the pre-edit version:

```bash
git diff -- src/components/ui/<name>.tsx | grep '^+import'
```

For each new bare-package import (e.g., `@radix-ui/react-tooltip`, NOT relative imports like `./button` or `../../lib/utils`):

1. Check whether it's already declared in the component's `dependencies:` block in `packages/cli/components.yaml`. If yes, skip.
2. If not, look up the version installed in root `package.json`:
   ```bash
   grep '"@radix-ui/react-tooltip"' package.json
   ```
3. Show the user the proposed yaml diff and ask for confirmation:
   - question: "New dependency detected: `<pkg>@^<version>`. Add to components.yaml under `<component>` → dependencies?"
   - header: "New dep"
   - Options:
     - "Yes, add it" — "Add to dependencies array"
     - "No, skip" — "I'll handle it manually later"
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
- If the failure is in the test you just wrote (typical: wrong class string in `toHaveClass` because you guessed the class instead of reading it from the component), fix the test and re-run once.
- If the failure is in an unrelated test, report it to the user and STOP. Do not auto-fix unrelated regressions.

If `test:smart` reports "no changed components" (because the user staged nothing), fall back to:
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

> **Source edits done.** Run `/publish-all` when you're ready to beta-publish. This command does not run integrity-snapshot, registry generation, prefix validation, version bump, or publish — those belong to `/publish-all`.

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
2. **Semantic tokens only.** Reject hex literals, `bg-gray-*`, `text-white`, arbitrary color values. Use `semantic-*` tokens; verify in `src/index.css`.
3. **Bootstrap `<p>` rule.** Every `<p>` in component files needs `m-0` (or `mb-0`/`my-0`).
4. **Optional props or defaults.** Refuse required props without defaults — they break `api:check`.
5. **One component per invocation.** If the user wants prop changes across multiple components, run the command once per component.
6. **Imports.** UI components: `@/lib/utils`, sibling `./<name>`. Custom components: `../../../lib/utils`, `../../ui/<name>`. Never `@/components/ui/...` in custom components.
7. **JSDoc on every new prop.** One-line `/** ... */` immediately above the field in the `Props` interface.
8. **Stop at the source boundary.** When in doubt about whether a step belongs to this command or `/publish-all`, leave it for `/publish-all`.

---

## Error Handling

- Component not found → list available components, ask user to pick one
- User wants required prop with no default → reject, explain breaking-change risk
- User supplies hex color → reject, suggest closest semantic token
- Lint/tests fail on the new code → fix and retry once; if still failing, stop and report
- Lint/tests fail on unrelated code → report and stop, do not auto-fix
- Multi-file custom component, no file specified → ask which file
