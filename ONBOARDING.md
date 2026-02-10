# Onboarding Guide — myOperator UI Component Library

Welcome! This guide will help you get up to speed with how we build, test, and publish UI components for myOperator. You'll be using **Cursor** (an AI-powered code editor) to do all the coding — your job is to understand the workflow, provide the right design inputs, and verify the output looks correct.

---

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [Before You Join — Things to Learn](#2-before-you-join--things-to-learn)
3. [Setting Up Your Machine](#3-setting-up-your-machine)
4. [Getting to Know Cursor](#4-getting-to-know-cursor)
5. [Understanding the Workflow](#5-understanding-the-workflow)
6. [Task: Creating a New Component](#6-task-creating-a-new-component)
7. [Task: Modifying an Existing Component](#7-task-modifying-an-existing-component)
8. [Task: Reviewing in Storybook](#8-task-reviewing-in-storybook)
9. [Task: Running Tests](#9-task-running-tests)
10. [Task: Publishing](#10-task-publishing)
11. [Task: Code Review](#11-task-code-review)
12. [Quality Checklist](#12-quality-checklist)
13. [Commands Cheatsheet](#13-commands-cheatsheet)
14. [What NOT to Do](#14-what-not-to-do)
15. [Troubleshooting](#15-troubleshooting)
16. [Glossary](#16-glossary)

---

## 1. What Is This Project?

Think of this project as a **design system turned into real code**. Designers create components in Figma (buttons, inputs, modals, cards). We then turn those Figma designs into working React components that developers across the company can install and use.

**The three parts of this project:**

| Part | What It Is | Analogy |
|------|-----------|---------|
| **Component Library** (root folder) | The actual UI components, their visual tests (Storybook), and unit tests | Your Figma component library, but in code |
| **CLI Package** (`packages/cli/`) | A tool developers run to install components into their projects | Like Figma's "copy component" but for code |
| **MCP Package** (`packages/mcp/`) | Lets AI assistants understand our components | Like attaching documentation to Figma components |

**Your role:** You take a Figma design, use Cursor's AI to turn it into a real component, verify it looks correct in Storybook, make sure tests pass, and then publish it so developers can use it.

---

## 2. Before You Join — Things to Learn

You don't need to know how to write code. But understanding what these tools ARE will help you communicate with Cursor's AI effectively and verify output quality.

### Must-Learn (study these before Day 1)

#### a) Cursor — Your AI Code Editor

Cursor looks and feels like VS Code (a popular code editor), but it has an AI assistant built right in. You can chat with the AI, paste screenshots, and it will write code for you. Think of it as a design tool where you describe what you want and the AI builds it.

**What to learn:**
- What Cursor looks like — it's a code editor with a chat panel on the side
- How to open the AI chat (`Cmd+L` on Mac, `Ctrl+L` on Windows)
- How to use Composer for bigger tasks (`Cmd+I` on Mac, `Ctrl+I` on Windows)
- How to open the built-in terminal (`Ctrl+`` ` — the backtick key, next to the number 1)
- How to reference files in chat by typing `@filename`

**Resource:** [cursor.com/features](https://cursor.com/features) and search YouTube for "Cursor AI tutorial for beginners 2026".

#### b) Storybook — Your Visual Testing Tool

Storybook is like a **private gallery for your components**. Each component gets its own page where you can see every variant (primary, secondary, destructive), every size (small, medium, large), and every state (loading, disabled, error). You'll use Storybook constantly to verify that what Cursor's AI built matches the Figma design.

**What to learn:**
- What Storybook looks like and how to navigate it
- What "stories" are (different states/variants of a component)
- How to use the controls panel to change props interactively

**Resource:** [storybook.js.org/docs](https://storybook.js.org/docs) — just read the "What is Storybook?" and "Browse Stories" pages.

#### c) Figma Inspection — Getting Design Details

You already know Figma, but make sure you can:
- Copy a **Figma link** to a specific frame/component (right-click → Copy link)
- Read **spacing values** (padding, margin, gap)
- Read **color values** (hex codes like `#343E55`)
- Read **typography** (font size, weight, line height)
- Identify **states** (default, hover, focus, disabled, error)
- Identify **variants** (primary, secondary, outline, etc.)

#### d) What is a "Component" in Code?

In Figma, a component is a reusable design element. In code, it's the same idea — a reusable piece of UI. Our components have:

- **Variants** — different visual styles (like Figma variants). Example: a Button can be `default`, `primary`, `destructive`, `outline`, `ghost`.
- **Sizes** — different dimensions. Example: `sm`, `default`, `lg`.
- **Props** — configurable options (like Figma component properties). Example: a Button has `loading`, `leftIcon`, `rightIcon`.
- **States** — how it looks during interaction. Example: `hover`, `focus`, `disabled`.

#### e) Git Basics — Saving and Sharing Code

Git is like "version history" for code (similar to Figma's version history). You should understand:
- **Commit** — saving a snapshot of your changes (like "Save to Version History")
- **Push** — sharing your saved changes with the team
- **Branch** — a separate workspace so you don't affect the main project

**Note:** In this project, you won't commit or push manually. The publish workflow handles it automatically.

### Good to Know (learn during your first week)

| Topic | Why It Helps |
|-------|-------------|
| **React basics** | Understanding what a "component" looks like in code helps you verify Cursor's output |
| **Tailwind CSS** | Our styling system — classes like `px-4` mean "padding horizontal 16px". Helps you compare Figma spacing with code |
| **CSS variables** | We use design tokens like `--semantic-primary` instead of raw colors like `#343E55`. This is how we support theming |

---

## 3. Setting Up Your Machine

Ask a senior team member to help you with initial setup. Here's what you'll need:

### One-Time Setup

1. **Install Node.js** — [nodejs.org](https://nodejs.org) (download the LTS version)
2. **Install Cursor** — [cursor.com](https://cursor.com) (download and install)
3. **Sign in to Cursor** — you'll need a Cursor account (the company should provide one)
4. **Get the project code:**
   Open Cursor's built-in terminal (`` Ctrl+` ``) and run:
   ```
   git clone <repository-url>
   cd storybook-npm
   npm install
   ```
   Or ask your senior team member to help you clone the project.
5. **Open the project in Cursor** — File → Open Folder → select the `storybook-npm` folder
6. **Set up Figma access** — make sure you can access the myOperator Figma files

### Verify Setup Works

Open Cursor's built-in terminal (`` Ctrl+` ``) and run:

```
npm run storybook
```

This should open a browser window showing all our components. Browse through them — this is what you'll be working with daily.

Press `Ctrl+C` in the terminal to stop Storybook when you're done.

---

## 4. Getting to Know Cursor

Cursor is your main tool. Here's a quick tour of what you'll use daily:

### The Editor (center)

This is where you see code files. You don't need to edit code here directly — Cursor's AI does that for you. But you'll look at files here to verify what was created.

### The Chat Panel (side)

Open it with `Cmd+L` (Mac) or `Ctrl+L` (Windows). This is where you talk to the AI. You can:
- Type questions or instructions
- Paste screenshots directly (drag and drop, or paste from clipboard)
- Reference project files by typing `@` followed by the filename (e.g., `@button.tsx`)
- The AI can see your entire project and understand our coding patterns

### Composer (for bigger tasks)

Open it with `Cmd+I` (Mac) or `Ctrl+I` (Windows). Composer is better for tasks that create or modify multiple files at once — like creating a new component (which involves 3 files: component + test + story).

### The Terminal (bottom)

Open it with `` Ctrl+` ``. This is where you run commands like `npm run storybook` or `npm test`. You can also ask the AI to run commands for you in the chat.

### Slash Commands

Type `/` in the chat to see available commands. We have custom commands set up for common tasks:

| Command | What It Does |
|---------|-------------|
| `/create-component` | Walks you through creating a new component from a Figma design |
| `/publish-all` | Publishes everything (CLI + MCP + git commit) |
| `/publish-cli` | Publishes only the CLI package |
| `/code-review` | Reviews code for quality issues |

### Referencing Files with @

When chatting with the AI, you can point it to specific files:
- `@button.tsx` — references the button component file
- `@CLAUDE.md` — references our project rules (the AI reads this automatically, but you can emphasize it)
- `@components.yaml` — references the component registry

### Rules (how the AI knows our patterns)

The project has rule files in `.cursor/rules/` that tell the AI how we build components — what patterns to follow, what design tokens to use, what file structure to create. You don't need to edit these, but know they exist. They're why the AI already knows our project conventions.

---

## 5. Understanding the Workflow

Here's the big picture of what happens when a new component needs to be built:

```
Figma Design (designer creates it)
       |
       v
You provide: Screenshot + Figma Link
       |
       v
Cursor's AI creates: Component + Tests + Storybook Stories
       |
       v
You verify: Does it match the Figma design in Storybook?
       |
       v
You run: Tests (to make sure nothing is broken)
       |
       v
You run: Code Review (AI reviews the code)
       |
       v
You publish: Using the /publish-all command
       |
       v
Developers install: npx myoperator-ui add component-name
```

**The key insight:** You are the **quality gate**. Cursor's AI writes the code, but YOU decide if the result matches the design and meets our standards.

---

## 6. Task: Creating a New Component

This is the most common task you'll do. Here's every step:

### Step 1: Prepare Your Inputs

Before starting in Cursor, gather:
- [ ] **Screenshot** of the component from Figma (save as PNG/JPG, or copy to clipboard)
- [ ] **Figma link** — right-click the component frame in Figma → "Copy link to selection"
- [ ] **Component name idea** — a short name in lowercase with hyphens (e.g., `status-card`, `pricing-table`, `user-avatar`)
- [ ] **List of states/variants** — what different versions exist? (e.g., "there's a default state, a loading state, and an error state")

### Step 2: Open the Chat in Cursor

Press `Cmd+L` (Mac) or `Ctrl+L` (Windows) to open the chat panel.

### Step 3: Use the `/create-component` Command

Type `/create-component` in the chat. The AI will guide you through a step-by-step process:

1. **It asks for a screenshot** — paste or drag-drop your screenshot into the chat
2. **It analyzes the design** — it identifies what kind of component it is
3. **It suggests names** — pick one, or type your own
4. **It asks for the Figma link** — paste the Figma URL you copied
5. **It fetches the Figma design** — it reads colors, spacing, typography directly from Figma
6. **It checks for existing components** — maybe something similar already exists that we can reuse
7. **It identifies reusable parts** — if your design has a button inside, it will reuse our existing Button component
8. **It creates the files** — the component, tests, and Storybook stories

**If `/create-component` is not available**, you can describe the task manually in the chat:

```
I need to create a new component from this Figma design.

Here's the screenshot: [paste screenshot]
Here's the Figma link: [paste link]
Suggested name: status-card

Please follow the component creation workflow from our project rules:
- Create the component file, test file, and Storybook story
- Use semantic design tokens (no hardcoded colors)
- Reuse existing components where possible
- Follow the forwardRef + CVA pattern
- Add it to components.yaml
```

**What gets created (3 files):**

| File | What It Is |
|------|-----------|
| `src/components/ui/your-component.tsx` | The actual component code |
| `src/components/ui/__tests__/your-component.test.tsx` | Automated tests that verify the component works correctly |
| `src/components/ui/your-component.stories.tsx` | Storybook page showing all variants and states |

### Step 4: Verify in Storybook

After the AI creates the files, run Storybook in Cursor's terminal (`` Ctrl+` ``):

```
npm run storybook
```

In the Storybook sidebar, find your new component and check:

- [ ] Does it **look like the Figma design**?
- [ ] Are the **colors correct**? (not hardcoded colors — it should use our design tokens)
- [ ] Are the **spacings correct**? (padding, margins, gaps)
- [ ] Are the **typography** settings correct? (font size, weight)
- [ ] Do all **variants** look right?
- [ ] Do all **sizes** look right?
- [ ] Does the **hover state** look right? (move your mouse over it)
- [ ] Does the **disabled state** look right?

If something doesn't match, tell the AI in chat what's wrong:

```
The padding on the left side should be 16px, not 12px.
The heading text should be semibold, not bold.
The error state border should be red, not orange.
```

The AI will fix it and you can check again in Storybook.

### Step 5: Run Tests

In Cursor's terminal, run:

```
npm test
```

Or ask the AI in chat: `Run the tests for my new component`

**What "pass" looks like:**
```
 PASS  src/components/ui/__tests__/your-component.test.tsx
  ✓ renders correctly
  ✓ applies default variant
  ✓ applies custom className
  ✓ forwards ref
```

**What "fail" looks like:**
```
 FAIL  src/components/ui/__tests__/your-component.test.tsx
  ✗ applies default variant
    Expected: "bg-semantic-primary"
    Received: "bg-[#343E55]"
```

If tests fail, tell the AI in chat:

```
The tests are failing. Please fix them.
```

### Step 6: Build the CLI Package

This step packages the component so developers can install it. In Cursor's terminal:

```
cd packages/cli && npm run build
```

Or ask the AI: `Build the CLI package to include my new component`

If the build succeeds, you'll see green checkmarks. If it fails, paste the error in chat and the AI will fix it.

---

## 7. Task: Modifying an Existing Component

Sometimes you need to update an existing component — add a new variant, change spacing, fix a color.

### Step 1: Take an Integrity Snapshot

Before making any changes, run this in Cursor's terminal. It records the current state of all components so we can verify you only changed what you intended:

```
cd packages/cli && npm run integrity:snapshot
```

### Step 2: Tell the AI What to Change

Open the chat (`Cmd+L` / `Ctrl+L`) and be specific. You can reference the file directly with `@`. Good examples:

```
In @button.tsx, add a new variant called "success" that has a green
background. Use our semantic-success-primary token for the color.
Here's the updated Figma design: [paste screenshot]
```

```
In @badge.tsx, change the small size padding from px-2 to px-2.5
to match the updated Figma design.
```

```
The tag component's "warning" variant should use a yellow background,
not orange. Check this Figma link: [paste link]
```

### Step 3: Verify Only Your Component Changed

After the AI makes the changes, verify that no OTHER components were accidentally modified. In Cursor's terminal:

```
cd packages/cli
node scripts/check-integrity.js verify component-name
```

Replace `component-name` with the name of the component you changed (e.g., `button`, `badge`).

### Step 4: Check Storybook, Run Tests, Build

Same as Steps 4-6 in "Creating a New Component":
1. Check Storybook — does the change look right?
2. Run tests — `npm test`
3. Build — `cd packages/cli && npm run build`

---

## 8. Task: Reviewing in Storybook

Storybook is your primary quality assurance tool. Here's how to use it effectively:

### Starting Storybook

In Cursor's terminal:

```
npm run storybook
```

Opens at `http://localhost:6006` in your browser.

### What to Look For

**Layout & Spacing:**
- Compare padding and margins with Figma (use browser DevTools → right-click → Inspect)
- Check gap between elements matches the design
- Verify alignment (left, center, right)

**Colors:**
- Verify colors match Figma
- Check that hover states have correct color changes
- Make sure disabled states are properly dimmed

**Typography:**
- Font size matches Figma
- Font weight matches (regular, medium, semibold, bold)
- Line height looks correct (text isn't too cramped or too spread)

**Interactive States:**
- Hover the component — does it respond correctly?
- Click it — does the active state look right?
- Tab to it with keyboard — is there a visible focus ring?

**Responsiveness:**
- Resize the Storybook canvas — does the component adapt?
- Check mobile dimensions

### Using Controls

Storybook has a "Controls" panel at the bottom. Use it to:
- Switch between variants (default, primary, destructive, etc.)
- Change sizes (sm, default, lg)
- Toggle boolean props (loading, disabled)
- Test with different text content

### Accessibility Tab

Click the "Accessibility" tab in Storybook to see automated accessibility checks. It will flag issues like:
- Low color contrast
- Missing labels
- Keyboard navigation problems

All checks should pass (green). If there are violations (red), tell Cursor's AI to fix them.

---

## 9. Task: Running Tests

Tests are automated checks that verify the component works correctly. You don't write tests — the AI does — but you need to run them and understand the results.

### Running All Tests

In Cursor's terminal:

```
npm test
```

### Running Tests for One Component

```
npx vitest run src/components/ui/__tests__/button.test.tsx
```

Replace `button` with your component name.

### Understanding Test Results

**All passing (good):**
```
 ✓ src/components/ui/__tests__/button.test.tsx (12 tests)
 ✓ src/components/ui/__tests__/badge.test.tsx (8 tests)

Tests:  20 passed
```

**Some failing (needs fixing):**
```
 ✗ src/components/ui/__tests__/button.test.tsx (2 failed, 10 passed)

 FAIL  applies destructive variant
   Expected element to have class "bg-semantic-error-primary"
   but received "bg-red-500"
```

When tests fail, tell the AI in chat:

```
Tests are failing for the button component. The destructive variant is using
bg-red-500 instead of bg-semantic-error-primary. Please fix this.
```

### What Tests Check

Every component has tests that verify:

| Test | What It Checks |
|------|---------------|
| Renders correctly | The component shows up on screen with the right content |
| Variant classes | Each variant (primary, secondary, etc.) applies the correct colors |
| Size classes | Each size (sm, default, lg) applies the correct dimensions |
| Custom className | Users can add their own CSS classes without breaking the component |
| Ref forwarding | Developers can get a reference to the actual HTML element |
| Accessibility | ARIA attributes are present where needed |

---

## 10. Task: Publishing

Publishing makes your components available for developers to install. Always use the automated workflow — never try to publish manually.

### Publishing Everything (Most Common)

In Cursor's chat, type:

```
/publish-all
```

If the slash command isn't available, describe the task manually:

```
Please run the full publish workflow:
1. Run all validations
2. Bump the CLI version (patch)
3. Build the CLI package
4. Publish the CLI to npm
5. Sync MCP metadata
6. Build and publish the MCP package
7. Create a git commit
8. Push to the repository

Remember to set MYOPERATOR_GIT_ALLOWED=1 and MYOPERATOR_PUBLISH_ALLOWED=1
before the git and npm commands.
```

This automated workflow:
1. Runs all validations
2. Bumps the version number
3. Builds the CLI package
4. Publishes the CLI to npm
5. Syncs MCP metadata
6. Builds and publishes the MCP package
7. Creates a git commit
8. Pushes to the repository

### Publishing Only the CLI Package

In Cursor's chat:

```
/publish-cli
```

### What to Check After Publishing

After publishing, verify:
- [ ] The command completed without errors
- [ ] The new version number was shown
- [ ] Ask in chat: `What version did we just publish?`

### Testing the Published Component

You can verify the published component works by testing the install command in the terminal:

```
npx myoperator-ui add component-name
```

---

## 11. Task: Code Review

Before publishing, it's good practice to have the AI review the code it wrote. This catches issues like:
- Hardcoded colors (should use design tokens)
- Missing accessibility attributes
- Inconsistent patterns
- Performance issues

### How to Request a Code Review

In Cursor's chat, type:

```
/code-review
```

Or ask directly:

```
Review the code for the new status-card component. Check for:
- Hardcoded colors (should use semantic tokens)
- Missing accessibility attributes
- Missing forwardRef or displayName
- Component follows our CVA + forwardRef pattern
- Tests cover all variants and sizes
- Storybook stories exist for all variants
```

### What to Look for in the Review

The AI will report issues. Pay attention to:

- **Hardcoded colors** — should always use `semantic-*` tokens, never `#hex` values
- **Missing `forwardRef`** — every component must support ref forwarding
- **Missing `displayName`** — needed for debugging
- **Missing test cases** — every variant and size needs a test
- **Missing Storybook stories** — every variant needs a visual story

---

## 12. Quality Checklist

Use this checklist before publishing any component:

### Design Accuracy
- [ ] Component matches the Figma design
- [ ] All variants from Figma are implemented
- [ ] All sizes from Figma are implemented
- [ ] Spacing matches Figma (padding, margins, gaps)
- [ ] Typography matches Figma (font size, weight, line height)
- [ ] Colors match Figma (using design tokens, not hardcoded)
- [ ] Hover/focus/active states match Figma
- [ ] Disabled state matches Figma

### Code Quality
- [ ] No hardcoded colors (no `#343E55`, no `bg-gray-500`)
- [ ] Uses semantic tokens (`bg-semantic-primary`, `text-semantic-text-muted`)
- [ ] Component has `forwardRef` and `displayName`
- [ ] Exports both the component and its variants

### Testing
- [ ] All tests pass (`npm test`)
- [ ] Tests cover all variants
- [ ] Tests cover all sizes
- [ ] Tests cover ref forwarding
- [ ] Tests cover custom className

### Storybook
- [ ] Component has a Storybook story file
- [ ] All variants have stories
- [ ] All sizes have stories
- [ ] Interactive states can be tested via controls
- [ ] The story includes an installation command (`npx myoperator-ui add ...`)
- [ ] Accessibility tab shows no violations

### Build
- [ ] CLI build passes (`cd packages/cli && npm run build`)
- [ ] No integrity violations (only your component changed)

---

## 13. Commands Cheatsheet

Copy-paste these commands as needed. You don't need to memorize them.

### Cursor Shortcuts

| What You Want to Do | Shortcut |
|---------------------|----------|
| Open AI Chat | `Cmd+L` (Mac) / `Ctrl+L` (Windows) |
| Open Composer (multi-file tasks) | `Cmd+I` (Mac) / `Ctrl+I` (Windows) |
| Open Terminal | `` Ctrl+` `` |
| Reference a file in chat | Type `@filename` |
| Use a slash command | Type `/command-name` in chat |

### Terminal Commands (run in Cursor's terminal)

| What You Want to Do | Command | Where to Run |
|---------------------|---------|-------------|
| Open Storybook | `npm run storybook` | Project folder |
| Stop Storybook | Press `Ctrl+C` | Same terminal |
| Run all tests | `npm test` | Project folder |
| Run one component's tests | `npx vitest run src/components/ui/__tests__/COMPONENT.test.tsx` | Project folder |

### Component Workflow Commands

| What You Want to Do | Command | Where to Run |
|---------------------|---------|-------------|
| Create a new component | `/create-component` | Cursor chat |
| Take integrity snapshot (before changes) | `npm run integrity:snapshot` | Terminal, in `packages/cli/` |
| Verify only intended changes | `node scripts/check-integrity.js verify COMPONENT` | Terminal, in `packages/cli/` |
| Build CLI package | `npm run build` | Terminal, in `packages/cli/` |

### Publishing Commands

| What You Want to Do | Command | Where to Run |
|---------------------|---------|-------------|
| Publish everything | `/publish-all` | Cursor chat |
| Publish CLI only | `/publish-cli` | Cursor chat |

### Checking Commands (run in terminal)

| What You Want to Do | Command | Where to Run |
|---------------------|---------|-------------|
| Check for lint errors | `npm run lint` | Project folder |
| Check formatting | `npm run format:check` | Project folder |
| Fix formatting | `npm run format` | Project folder |
| Check for breaking changes | `npm run api:check` | Project folder |
| Update API baseline (after intentional breaking change) | `npm run api:snapshot` | Project folder |

---

## 14. What NOT to Do

These are guardrails to protect you from common mistakes:

### Never Edit These Files Manually
- `packages/cli/src/registry*.ts` — these are auto-generated. If you edit them, your changes will be overwritten.
- `.component-snapshot.json` — this is for integrity verification.
- `.api-snapshot.json` — this is the API baseline. Only update via `npm run api:snapshot`.

### Never Run These Commands Directly
- `git commit` — blocked by pre-commit hooks. Always use the publish workflow.
- `git push` — blocked by pre-push hooks. Always use the publish workflow.
- `npm publish` — blocked. Always use `/publish-cli` or `/publish-all`.

### Never Use Hardcoded Colors
When reviewing the AI's work, if you see color values like `#343E55`, `bg-gray-500`, `text-white`, or `bg-[#FF0000]` in the component code — that's wrong. Tell the AI to replace them with design tokens.

**Wrong:**
```
bg-[#343E55] text-white border-[#E4E4E4]
```

**Correct:**
```
bg-semantic-primary text-semantic-text-inverted border-semantic-border-layout
```

### Never Skip Testing
Even if the component "looks fine" in Storybook, always run `npm test` before publishing. Tests catch issues that aren't visible — like broken ref forwarding or wrong CSS classes.

---

## 15. Troubleshooting

### "Storybook won't start"

Run `npm install` in Cursor's terminal first, then try `npm run storybook` again.

### "Tests are failing but I didn't change anything"

Run `npm test` to see which tests fail. Tell the AI in chat:

```
Tests are failing but I didn't change those components. Can you investigate?
```

### "Build fails with prefix errors"

This means the Tailwind `tw-` prefix system found a problem. Tell the AI in chat:

```
The CLI build is failing with prefix validation errors. Please fix the prefixing issues.
```

### "Pre-commit hook blocks my commit"

This is by design. You should never commit directly. Use the `/publish-all` command or ask the AI to run the publish workflow.

### "API check says there are breaking changes"

This means a component's public interface changed (props were removed or renamed). If the change was intentional, run in the terminal:

```
npm run api:snapshot
```

If it wasn't intentional, tell the AI to revert the breaking change.

### "The AI seems confused or gives wrong results"

Try these steps:
1. Start a new chat — press `Cmd+L` / `Ctrl+L` and begin a fresh conversation
2. Reference the project rules: `@CLAUDE.md` (yes, our rules file is called CLAUDE.md — it works in Cursor too)
3. Be more specific about what you need
4. Paste the Figma screenshot again so the AI has visual context

### "I don't understand an error message"

Copy the full error message and paste it in chat:

```
I got this error. What does it mean and how do I fix it?

[paste the error here]
```

### "The slash command isn't working"

If `/create-component` or `/publish-all` don't appear when you type `/`, the custom commands may not be set up yet. Instead, describe the task in plain language in the chat — the AI can still do everything, it just won't have the guided step-by-step flow. See the example prompts in Section 6, Step 3.

---

## 16. Glossary

Terms you'll encounter, explained simply:

| Term | What It Means |
|------|--------------|
| **Component** | A reusable UI element (button, input, card, modal) |
| **Variant** | A different visual style of the same component (primary button vs ghost button) |
| **Props** | Settings you can pass to a component (like Figma component properties) |
| **State** | How a component looks during interaction (hover, focus, disabled, loading) |
| **Storybook** | A tool that shows all your components in a visual gallery |
| **Story** | One example/variant of a component in Storybook |
| **Test** | An automated check that verifies a component works correctly |
| **Build** | Converting source code into a distributable package |
| **Publish** | Making the package available for developers to install |
| **CLI** | Command Line Interface — a text-based tool (our CLI lets devs install components) |
| **npm** | A package registry where we publish our components |
| **Registry** | Auto-generated files that contain all component code for the CLI |
| **Design Token** | A named value (like `--semantic-primary`) instead of a raw value (like `#343E55`) |
| **Semantic Token** | A token named by purpose (`error-primary`) not by color (`red-500`) |
| **CVA** | Class Variance Authority — the system that manages component variants |
| **forwardRef** | A React pattern that lets developers access the underlying HTML element |
| **Tailwind** | A CSS framework that uses utility classes like `px-4`, `text-sm`, `bg-primary` |
| **tw- prefix** | We add `tw-` before Tailwind classes so they don't conflict with Bootstrap |
| **MCP** | Model Context Protocol — lets AI assistants understand our components |
| **Git** | Version control system (like Figma version history, but for code) |
| **Commit** | A saved snapshot of changes in git |
| **Branch** | A separate workspace in git (like duplicating a Figma page to experiment) |
| **Lint** | Automated style checking for code (like spell-check for code formatting) |
| **Integrity Check** | Verification that only intended components were changed |
| **Breaking Change** | A change that would break existing usage (like renaming a Figma component property) |
| **API Snapshot** | A baseline record of component interfaces, used to detect breaking changes |
| **Pre-commit Hook** | An automatic check that runs before every commit (like Figma's "publish" validation) |
| **Cursor** | The AI-powered code editor you use daily — like VS Code with a built-in AI assistant |
| **Chat Panel** | The side panel in Cursor where you talk to the AI (`Cmd+L` / `Ctrl+L`) |
| **Composer** | Cursor's multi-file editing mode for bigger tasks (`Cmd+I` / `Ctrl+I`) |
| **Slash Command** | A shortcut starting with `/` that triggers a specific workflow (e.g., `/create-component`) |
| **Rules** | Project configuration files that tell the AI how to write code for this specific project |

---

## Quick Reference: Talking to the AI in Cursor

Here are phrases you can use in Cursor's chat for common tasks:

**Creating a component:**
```
/create-component
```
Or manually:
```
Create a new component called "status-card" from this Figma design.
Here's the Figma link: [paste link]
[paste screenshot]
Follow our component patterns from @CLAUDE.md
```

**Fixing a visual issue:**
```
The button's destructive variant doesn't match Figma. The background should
be lighter red. Here's the updated Figma link: [link]
```

**Running tests:**
```
Run the tests for the badge component and fix any failures
```

**Reviewing code:**
```
Review @status-card.tsx for hardcoded colors, missing accessibility
attributes, and pattern compliance
```

**Publishing:**
```
/publish-all
```

**Investigating errors:**
```
The build failed. Here's the error: [paste error]. What went wrong?
```

**Exploring the codebase:**
```
Show me all the existing components we have
What variants does the button component support?
Does a modal component already exist?
```

---

## Your First Day Plan

1. Open the project in Cursor and run `npm run storybook` in the terminal — browse every component for 30 minutes
2. Read through 2-3 component stories in Storybook — click the "Docs" tab to see usage details
3. Click on `src/components/ui/badge.tsx` in Cursor's file explorer — you don't need to understand the code, but notice the patterns: it imports things at the top, defines variants in the middle, and exports at the bottom
4. Run `npm test` in the terminal and see all tests pass
5. Open the chat (`Cmd+L` / `Ctrl+L`) and try creating a practice component from a simple Figma design — follow the workflow described in Section 6
6. Delete the practice component files when done

**After your first week**, you should be comfortable with the full cycle: design → create → verify → test → publish.
