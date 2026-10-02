# HANDOFF: continue the MyOperator "v2" design system

**Repository snapshot update, 2026-10-02:** The user has authorized committing and pushing the current work on `codex/ui-v2-review-2026-10-02`. Storybook is saved in `Ankish8/storybook-npm`; the frontend is saved in the private `Ankish8/myoperator-web-ui` repository. Older statements about uncommitted/local-only work below describe the earlier handoff. See [V2-REPOSITORIES.md](V2-REPOSITORIES.md) for the paired revisions and integration workflow.

**Text hierarchy update, 2026-10-02:** The user requested softer neutral text and less unnecessary font weight across all 56 v2 components. The current palette and weight decisions, browser evidence and preservation checks are in [V2-TEXT-HIERARCHY-REVIEW.md](V2-TEXT-HIERARCHY-REVIEW.md). This update supersedes the original neutral text colors and ordinary label/title weights; use the recorded specs for the remaining design values. This correction remains local.


Written by the previous AI agent (Claude Code) on 2026-10-01 for the next agent. You have **no memory** of the earlier conversation; this document is the whole brief. Read all of it, run the "First 15 minutes" checklist (section 4), then continue with the backlog (section 12). **Nothing described here is committed, pushed or published.**

**Story quality update, 2026-10-01:** Before creating or revising a v2 story, read `design/V2-STORY-STANDARD.md`. Button, Badge, Tag, Input, Checkbox and Switch received a subsequent repair for working Controls, synchronized values, visual hierarchy and Docs table formatting. The browser review and current verification scope are recorded in `design/V2-STORY-REVIEW.md`; other new components still need their own review.

---

## 1. TL;DR

- **What**: MyOperator's design team redesigned its UI components ("version two"): Figma file *New Design System - MyO*, page *v2*. We (a) restyled the production web panel's components to v2 inside a scratch work tree, and (b) started moving v2 into the shared component library (`storybook-npm`, npm package `myoperator-ui`) as a **side-by-side, additive `v2` namespace**, so products can migrate screen by screen while v1 keeps working untouched.
- **Done**: web panel: 28 component files restyled in place (uncommitted, work tree). Library: the v2 **Button** is built end to end (component + Storybook story + 72 tests + CLI/registry support + tokens) and verified numerically against the recorded Figma spec (493 computed-style checks, 0 mismatches). Figma itself was NOT reopened for that check; see gate 8 in section 10.
- **Your job**: repeat the Button recipe (section 8) for the other components (next batch: Badge, Tag, Input, Checkbox, Switch), keep v1 untouched, keep verifying with the kit in `design/verify/`, and bring the open decisions (section 11) to the user instead of deciding them silently.

## 2. Ground rules (from the user; do not break)

1. **v1 keeps `tw-` support and v1's generated output must not change. v2 does not need `tw-`**: it ships exactly as authored, unprefixed. (User, verbatim: "v1 should support tw- but v2 need not to.")
2. **Figma has already been read for the components listed in section 5 (Phase 1). Do NOT re-read it for those.** Treat `design/v2-figma-specs.md` and the web-panel diff as the source of truth. Open Figma only when (a) a component has no recorded values (the v2-only components in backlog A5, or anything missing from the spec file), or (b) the spec and the web-panel diff contradict each other. **Never use the Figma MCP** (explicit user instruction when this started): read through the user's logged-in Chrome (Work profile) in Dev Mode (how: section 5, Phase 1). If you cannot drive a browser, say which values are unverified.
3. **Never commit, push, publish to npm, deploy or delete branches unless the user asks.** In the `storybook-npm` repo, commit messages must NOT contain "Co-Authored-By: Claude" or "Generated with Claude Code" (that repo's `CLAUDE.md`).
4. Don't touch the user's other browser tabs. Don't open real customer conversations in the web panel (read receipts). Never type credentials.
5. **"Pulse"** (an earlier "Design System 2.0" scaffold) was deliberately deleted at the user's request; do not recreate it. **"Orbit"** was floated as a possible name; for now the Storybook section is simply **V2**.
6. Working style the user expects: concise and structured; analytical; challenge assumptions; state uncertainty explicitly; finish with a recommendation and one clear next step.

User directives in their own words (chronological):
- "use the work profile of Chrome ... try to match the components of this ... Do not use the Figma MCP ... click on individual component ... make changes directly to the component ... these are the version two that we are working on ... make all the components change it to how we have in the version two." (web panel work tree)
- "whatever we have achieved we need to keep it ... the storybook as well because that needs to be updated as well ... in a work tree or maybe a separate design system or maybe version 2 of the existing one ... suggest what can be done." (Storybook = `/Users/ankish/Downloads/Code/storybook-npm`)
- "remove the pulse one. create a new one for v2 ... either a complete new design system (Orbit), or add V2/latest components in the existing one, or a whole separate place ... so that we can slowly migrate. Suggest the best way." -> recommended: a side-by-side additive namespace in the same repo/CLI/Storybook; the user answered "go".
- "v1 should support tw- but v2 need not to."
- "looks good ... I'll continue all these things with some other AI agent." (this handoff)

## 3. Background you need

**Product.** The MyOperator web panel is a CakePHP legacy app plus a React SPA at `src_in/myop-web-react` (React 18 + TS, Tailwind 3.4 with `prefix: "tw-"` and `important: true`, **Bootstrap 5.3.3 loaded globally**, Radix, lucide-react, class-variance-authority, tailwind-merge 2.6.1, font Open Sans). Its `src/components/ui/*` are **generated copies** produced by the `myoperator-ui` CLI. The WABA team consumes `myoperator-ui` in production, so v1 (`latest` 0.0.459) must not change visually.

**The library pipeline (`storybook-npm`, GitHub Ankish8/storybook-npm).**
`src/components/ui/*.tsx` (unprefixed source, semantic tokens) -> `packages/cli/components.yaml` (metadata) -> `packages/cli/scripts/generate-registry.js` (embeds source + prefixer code into `registry-*.ts`, which are **tracked in git**) -> `tsup` builds the CLI -> consumers run `npx myoperator-ui add <name>`; for v1 the CLI adds the `tw-` prefix and rewrites `bg-semantic-x` into `bg-[var(--semantic-x,#fallback)]`. Storybook (Vite, Tailwind 3.4.18 **unprefixed**, `important: true`, Bootstrap CSS imported) is the dev/preview tool; tests are vitest + React Testing Library. Read the repo's `CLAUDE.md` first: semantic-token rules, `<p>` needs `m-0` (Bootstrap), story conventions, pre-commit hooks.

**Figma.** File `q84boKV4Bly9HKXzdtBj2K` ("New Design System - MyO"), page **v2**, frame **Components** (node `2285:8532`). Each component is a "card" under that frame; node ids are listed in `design/v2-figma-specs.md`. URL form: `https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-6438` (dash instead of colon).

## 4. First 15 minutes (do this before changing anything)

```bash
cd /Users/ankish/Downloads/Code/storybook-npm-v2
git branch --show-current            # feat/v2
git status --short                   # 13 modified + design/, ui/v2/, __tests__/v2/ (untracked)
git diff packages/cli/scripts/generate-registry.js packages/cli/components.yaml   # the pipeline changes
```

1. Read: this file, the repo `CLAUDE.md`, `design/v2-figma-specs.md`, `design/verify/README.md`.
2. **Study the finished Button end to end** (it is your template): `src/components/ui/v2/button.tsx`, `src/components/ui/v2/button.stories.tsx`, `src/components/ui/__tests__/v2/button.test.tsx`, the `v2-button` entry in `packages/cli/components.yaml`.
3. Start Storybook (it may already be running on port 6008; check `lsof -nP -iTCP:6008 -sTCP:LISTEN`):
   `npm run storybook -- -p 6008` then open `http://localhost:6008/?path=/story/v2-components-button--states`. Look at **States**, **v1 vs v2**, **Docs**.
4. Watch the Button go green: `npx vitest run src/components/ui/__tests__/v2`; run `design/verify/story-states.check.js` in the States iframe (expect `buttons 54 | checks 493 | mismatches 0`); `node design/verify/dead-classes.mjs src/components/ui/v2/button.tsx` (expect 0 dead).
5. Only then start the next component.

## 5. What was done, in order

### Phase 1 - Web panel: Figma v2 -> in-place component port (uncommitted)
- **How Figma was read (no MCP).** In Chrome (Work profile) open the file, go to page v2 -> Components, switch to **Dev Mode (Shift+D)**, Cmd+click a layer to select it deeply, **Shift+Return** selects the parent, **Tab / Shift+Tab** walk siblings, and read the right-hand **Inspect** panel (layout, typography, fill, stroke, effects as CSS) for each variant and state. Loading a URL with `?node-id=` selects that node. If the canvas looks blank/stale in an automation-driven window the tab is hidden: bring it to the foreground before reading.
- **Where**: `/Users/ankish/.codex/worktrees/92e4/ai-bot-frontend` (branch `codex/ai-bot-ui-test`), frontend dir `myop-web-react/`. Preview: `http://in.app.myoperator.local:8101/chat`.
- **28 component files edited in `myop-web-react/src/components/ui/`** (git diff there = the verified v2 spec, in prefixed form): accordion, alert, avatar, badge, button, checkbox, confirmation-modal, creatable-multi-select, creatable-select, delete-confirmation-modal, dialog, dropdown-menu, empty-state, input, multi-select, page-header, pagination, phone-input, select-field, select, switch, table, tabs, tag, text-field, textarea, toast, tooltip. (Three other changed files in that folder - `bots/bot-card.tsx`, `bots/bot-list-create-card.tsx`, `chat-list-item/chat-list-item.tsx` - belong to an earlier, unrelated chat UI refresh.)
- **Plumbing there**: new `src/lib/myoperator-ui-v2.css` (tokens `--font-v2`, `--border-skeuomorphic`, shadows), imported in `App.scss`; `tailwind.config.js` got `fontFamily.v2`; `src/index.tsx` injects a Google Fonts `<link>` for Inter; a **TEMP gallery** page at `/bots/v2-gallery` (`src/modules/Shadcn/V2Gallery/V2Gallery.tsx`, wired in `routes.ts` + `route-components.ts`) renders every restyled component for side-by-side review (remove before shipping). Four Jest snapshot suites were updated for the intentional class changes.
- **Verified then**: `tsc` clean, ESLint 0 errors, Jest only pre-existing failures (InfoMenu, LiveChatPageLayout, BotList, SidebarToggleButton stale snapshot), numeric DOM checks in the gallery (Button 48/40/32 px, radius 8, Inter 14/600; Input 40 px; Checkbox 20 px; Switch 36x20; Badge pill 12/400).
- **What changed per component (v2 vs v1)**: Button: heights 48/40/32 (default 34->40), radius 8, Inter 14/600, skeuomorphic border+shadow on solid variants, gradient when pressed, Ghost = blue text, Link = dark text, Secondary = light-blue `#ECF1FB`, new disabled/loading looks. Badge: pill, 0.4px border, variants active/failed/warning/info/disabled/default/primary/secondary/outline/destructive, heights 20/24/30. Tag: 8px radius, 0.4px tinted borders, 600 label. Input/TextField/Textarea/Select family/Phone container: h40, radius 8, px16, text 16, hover border `#C0C3CA`, focus border `#27ABB8` + `0 0 4px rgba(39,171,184,.4)`, error red border+shadow, disabled bg `#F5F5F5`, label 14/600. Toast: 384px two-row card, tinted 1px borders, xl shadow. Tooltip: light-blue `#ECF1FB`. Dialog: radius 12, 1.2px border, xl shadow; Confirmation/Delete modals re-laid out. DropdownMenu: 16px items. Tabs: px12 py16 14/600, active border-b 2px. Table: uppercase 14/500 header on `#EBECEE`. Checkbox 20px/4px radius; Switch 36x20 (sm 32x18, lg 44x24). Accordion/Alert/Avatar/PageHeader/Pagination/EmptyState: font + radius + spacing alignment.
- **Not ported**: no coded component yet: Stepper, Breadcrumbs, OTP input, Number step, Shimmering text, Scrollbar, Progress indicator, UI Cards, Page Footer, Radio. Not touched: Date range/time pickers, File upload, Phone input internals. Unchanged because already matching/rarely used: Spinner, Skeleton, Panel, ReadableField, Typography, Bouncing loader.

### Phase 2 - Discovery: Storybook is the source of truth
- The web panel's `ui` files are CLI-generated copies and are **behind** the library: 27 of the 28 files changed above differ from `storybook-npm` `main` by a few lines up to 605 (multi-select 605, creatable-multi-select 465, select-field 363, select 180, phone-input 160, text-field 142, textarea 135, input 98, pagination 95, dropdown-menu 87...). **Never copy those files upstream** (it would silently revert library work, and the next `npx myoperator-ui add` would overwrite the web-panel hand edits). Re-derive v2 on the current library source instead.
- A branch `feat/pulse-design-system` (an unfinished "Design System 2.0": Tailwind 4, no prefix, 0 of 26 planned components) existed only locally. At the user's request it was deleted along with its WIP stash and the on-disk `packages/pulse`. Recovery until `git gc`: `git branch x 9eb2744` and `git stash store -m "pulse wip" 80bfa5a`. Lessons its notes recorded (verified there): unprefixed compiled Tailwind collides with Bootstrap class names; without preflight a `h-10 + border-2` button renders 44 px; Tailwind v4 needs `source(none)` or it scans markdown.

### Phase 3 - Decision: side-by-side additive `v2` namespace
Chosen over (a) editing v1 in place (breaks WABA in production), (b) a brand-new compiled "Orbit" package (a rewrite for a ~300-edited-line visual change; the previous attempt stalled at 0 components), (c) `ButtonV2`-style suffixes (never go away). Why this wins: it is **additive**, so it can merge to `main` and ship at any time; v1 and v2 coexist in one app; migration = changing an import path. The user said "go", then ruled v2 is **unprefixed**.

### Phase 4 - The Button spike (what exists now)
See 5.1 (file list), section 6 (architecture), section 7 (Button walkthrough).

#### 5.1 Files in `/Users/ankish/Downloads/Code/storybook-npm-v2` (branch `feat/v2`, base `main` @ e98903e = origin/main, all uncommitted)
| File | Change |
| --- | --- |
| `src/components/ui/v2/button.tsx` (new) | The v2 Button. Same exports/props as v1 (`Button`, `buttonVariants`, `ButtonProps`). |
| `src/components/ui/v2/button.stories.tsx` (new) | Storybook `V2/Components/Button`: Overview, All variants, All sizes, With icons, States (variant x Default/Hover/Pressed/Focus/Disabled/Loading), v1 vs v2, Usage, plus docs (install, import, unprefixed note, what-changes table, design tokens). |
| `src/components/ui/__tests__/v2/button.test.tsx` (new) | 72 tests: variants, sizes, elevation, disabled/loading, icons, className merge, ref, asChild, clicks, plus a v1-parity block. |
| `packages/cli/components.yaml` | `v2-button` added to `categories.core.components` and as an entry with `path: "v2/button"`, `unprefixed: true`; header comment explains both fields. |
| `packages/cli/scripts/generate-registry.js` | `readSingleFileComponent` honours `meta.path` (source file, install file name `v2/button.tsx`, and the `lib/utils` import depth `../../../`); `unprefixed` entries are emitted **verbatim** (helpers `singleFileContentExpr` / `unprefixedLine`, used by both emitters: category files and legacy `registry.ts`); `unprefixed?: boolean` added to both emitted `ComponentDefinition` types; a guard rejects `unprefixed` on multi-file components. |
| `packages/cli/src/commands/add.ts` | Yellow warning when a project with a Tailwind prefix installs an `unprefixed` component. |
| `packages/cli/src/commands/init.ts` | Consumer theme CSS (`MYOPERATOR_THEME_CSS`) gets `--font-v2` and `--border-skeuomorphic`. |
| `packages/cli/scripts/validate-prefix-coverage.js` | `unprefixed` components must equal their source apart from the utils import (but see gotcha 3: this validator currently no-ops). |
| `packages/cli/src/__tests__/registry.test.ts` | +9 tests ("v1 prefixed vs v2 unprefixed"): v1 still prefixed + rewritten; v2 verbatim, installs under `v2/`, correct utils depth, identical output for any project prefix, equals its source file. |
| `packages/cli/src/utils/registry-core.ts`, `registry.ts` | GENERATED but tracked; regenerated by `generate-registry` (adds v2-button). Do not hand-edit. |
| `scripts/check-component-tests.js` | Test-presence guard now also scans `src/components/ui/v2` (tests in `__tests__/v2`). |
| `scripts/emit-catalog.js` | Parser accepts the `path` key; `sourcePath` uses `meta.path \|\| slug`. |
| `src/index.css` | `:root` gains `--font-v2: "Inter", sans-serif;` and `--border-skeuomorphic: rgba(255, 255, 255, 0.12);`. |
| `.storybook/preview-head.html` | Loads Inter (Google Fonts) next to Source Sans Pro. |
| `.storybook/preview.ts` | `storySort.order` includes `'V2'` after `'Custom'`. |
| `design/` (new, untracked) | This file, `v2-figma-specs.md`, `verify/` (kit). |

## 6. Architecture of the v2 namespace (conventions to follow exactly)

| Thing | Convention (Button as the example) |
| --- | --- |
| Source | `src/components/ui/v2/<name>.tsx` |
| Test | `src/components/ui/__tests__/v2/<name>.test.tsx` |
| Story | `src/components/ui/v2/<name>.stories.tsx`, title `V2/Components/<Name>` |
| Registry key | `v2-<name>` (**hyphenated, never a slash**: `scripts/emit-catalog.js` and `scripts/sync-design-skill.js` parse the YAML with `[\w-]+` regexes and would silently corrupt the previous entry) |
| YAML fields | `path: "v2/<name>"`, `unprefixed: true`, `category`, `dependencies`, `internalDependencies` (other registry keys, e.g. `v2-button`) |
| Install result | `npx myoperator-ui add v2-<name>` -> `<ui dir>/v2/<name>.tsx`, byte-identical to source except `@/lib/utils` -> `../../../lib/utils` |
| Import in an app | `import { Button } from "@/components/ui/v2/button"` (same export names as v1) |
| Siblings | v2 -> v2: `./button`. v2 -> v1: `../select`. The install tree mirrors the source tree, so relative imports work in both. |
| Tokens | Only semantic tokens (`bg-semantic-primary`...) plus the two additive v2 tokens. Never change an existing token value (that would change v1). |
| Prefix | **None.** Class strings must be literal (no string building) so tools can read them. |
| API | **Parity with v1**: same prop names/types/defaults so migration is an import change. Visual differences are allowed; API drift is not. |

Consumers of v2 need an unprefixed Tailwind build that defines the semantic colors (`npx myoperator-ui init` with an empty prefix generates that). In a project that builds Tailwind with a prefix (the web panel uses `tw-`), v2 classes generate no CSS until an unprefixed pass also scans `ui/v2`; `add` prints a warning. See open decision 1.

## 7. The v2 Button, annotated (your template)

Base classes (`cva` first argument):
```
inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg
font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-semibold leading-5 tracking-[0.014px]
transition-[background-color,border-color,box-shadow,color,opacity] duration-200
focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary
disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0
```
Sizes: `default h-10 px-4`, `sm h-8 px-4 text-xs leading-4 tracking-[0.06px]`, `lg h-12 px-4`, `icon h-10 w-10 p-0`, `icon-sm h-8 w-8`, `icon-lg h-12 w-12`, all with `[&_svg]:size-[18px]`.

Design decisions and WHY (each one cost time to discover):
1. **`rounded-lg`** = 8 px via the existing `--radius: 0.5rem` token.
2. **Font** is `font-[family-name:var(--font-v2,Inter,sans-serif)]`: needs no Tailwind config change in the consumer; `family-name:` makes tailwind-merge treat it as a font family, so it doesn't clash with `font-semibold`.
3. **Skeuomorphic solid variants** (default, primary, destructive, success): `border-solid border-[var(--border-skeuomorphic,rgba(255,255,255,0.12))]` + `shadow-[0_1px_2px_0_rgba(12,15,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_0_rgba(12,15,18,0.05)]`; border is 2px for default/primary, 1px for destructive/success. Use **literal** `shadow-[...]` values (not `shadow-[var(--x)]`): tailwind-merge only dedupes literal shadows against `shadow-none`.
4. **Pressed** = `active:bg-[linear-gradient(270deg,var(--a,#hex)_0%,var(--b,#hex)_100%)] active:shadow-none` (gradient stops use tokens with hex fallbacks). It sets `background-image`, so it layers over the hover colour.
5. **Disabled vs loading without a `state` cva variant.** `scripts/validate-cva-props.js` requires every cva variant key to be a destructured prop, so a hidden `state` variant is not allowed. Instead: `disabled:` modifiers style disabled, and because a loading button is also `disabled`, `aria-busy:` modifiers restore the loading look only where it differs (outline, secondary, success, ghost, link, dashed). The component sets `disabled={disabled || loading}` and `aria-busy={loading || undefined}`. Default/primary/destructive look the same disabled and loading, so they need no `aria-busy:` classes.
6. **Focus ring** (Figma: 1px solid `#343E55`, offset 3px) is `focus-visible:outline` + **`focus-visible:[outline-width:1px]`** + `focus-visible:outline-offset-[3px]` + `focus-visible:outline-semantic-primary`. The width is an arbitrary property on purpose: Storybook's root has `tailwind-merge ^3.4` (bare `outline` = width, so it is dropped next to `outline-1`) while consumers use `^2.6` (bare `outline` = style, kept). The arbitrary property is immune to both. Overriding the ring still works with `focus-visible:outline-none`.
7. **Ghost = blue text, Link = dark text, Secondary = `#ECF1FB`** exactly as Figma shows (a visible change from v1; documented in the story).
8. Dropped from v1: `min-w-16/20/24` (Figma shows no minimum width). Raise this with the user (open decision 3).
9. Props are identical to v1: `variant`, `size`, `asChild`, `leftIcon`, `rightIcon`, `loading`, `loadingText`.

Story pattern (`button.stories.tsx`): meta with `title: "V2/Components/Button"`, `parameters.design` (Figma URL of the card), docs description with install command `npx myoperator-ui add v2-button`, import statement, an "Unprefixed Tailwind" note, a v1->v2 change table and a Design Tokens table, `tags: ["autodocs"]`, `argTypes` for all props; stories listed in 5.1. The **States** story renders every variant in every state; Hover/Pressed/Focus are forced with the `storybook-addon-pseudo-states` classes `pseudo-hover`, `pseudo-active`, `pseudo-focus-visible` applied directly on the element. The **v1 vs v2** story imports `../button` (v1) next to the v2 button. Every `<p>` in stories/components needs `m-0`.

## 8. Recipe: add the next v2 component

1. **Spec first, without re-reading Figma.** Use `design/v2-figma-specs.md` (section 9 has the global facts). If the component is not in that file, take the values from the web-panel diff, which was already checked against Figma when it was built:
   `git -C /Users/ankish/.codex/worktrees/92e4/ai-bot-frontend diff -- myop-web-react/src/components/ui/<name>.tsx`
   Reopen Figma only if values are missing or the two sources disagree.
2. **Create `src/components/ui/v2/<name>.tsx`** by copying the CURRENT v1 file from `src/components/ui/<name>.tsx` (not the web-panel copy: it is outdated). Keep exports/props identical. Apply the v2 deltas. Translate the web-panel diff back to library form:
   - strip `tw-`; `bg-[var(--semantic-x,#hex)]` -> `bg-semantic-x`; `tw-font-v2` -> `font-[family-name:var(--font-v2,Inter,sans-serif)]`;
   - replace `${CONSTANT}` string building with literal strings; replace any `state` compound variants with `disabled:` / `aria-busy:` modifiers;
   - a v2 file that needs another primitive imports the **v2 sibling** (`./button`); one that is unchanged imports the v1 file (`../x`).
   - Big logic components (`multi-select` 755 lines, `creatable-multi-select` 481, `creatable-select` 392, `select-field` 331): v2 changed only a handful of lines. Prefer a thin v2 wrapper/re-export over forking, unless the class changes are internal and cannot be passed in.
3. **Add the test** `__tests__/v2/<name>.test.tsx` modelled on the Button test (variants, sizes, states, className merge, ref, a11y attributes, v1-parity block).
4. **Add the story** modelled on the Button story (Overview, All variants, All sizes, With icons / States matrix, v1 vs v2, Usage, docs block).
5. **Register it** in `packages/cli/components.yaml`: add `v2-<name>` to the right `categories.<cat>.components` list and an entry with `path: "v2/<name>"`, `unprefixed: true`, correct `dependencies` and `internalDependencies` (registry keys such as `v2-button`). Then `cd packages/cli && npm run build`.
6. **Format and lint**: `npx prettier --write` the new files; `npx eslint` them.
7. **Run the full verification** (section 10). Only report "done" when every gate is green.
8. Update `design/v2-figma-specs.md` with any new Figma values you read.

## 9. Figma v2 reference

Global v2 facts (details and node ids in `design/v2-figma-specs.md`):
- **Font** Inter (token `--font-v2`). Text styles: Title/Medium 16/500; Body/Large 16/400; Body/Medium 14/400; Body/Small 12/400; Label/Large 14/600 lh20 ls .014px; Label/Medium 12/600 ls .06px; Headline/Small 24/600.
- **Radius** token New-sm = 8 px (dialog 12, tooltip 6, badge pill).
- **Shadows**: skeuomorphic `0 1px 2px 0 rgba(12,15,18,.05), inset 0 0 0 1px rgba(10,13,18,.18), inset 0 -2px 0 0 rgba(12,15,18,.05)`; soft `4px 4px 40px 0 rgba(0,0,0,.02)`; xl (toast/dialog) `0 20px 24px -4px rgba(10,13,18,.08), 0 8px 8px -4px rgba(10,13,18,.03), 0 3px 3px -1.5px rgba(10,13,18,.04)`. **Border token** Skeuomorphic = `rgba(255,255,255,.12)`.
- **Palette** is the same as the existing semantic tokens (primary `#343E55`, hover `#2F384D`, text-primary `#181D27`, muted `#717680`, border `#E9EAEB`, bg-ui `#F5F5F5`, info surface `#ECF1FB`...). Check a token exists with `grep "--semantic-<name>" src/index.css`. **Never infer a token's meaning from its name** (`--semantic-bg-secondary` is near-black).
- Hidden/odd cards: Checkboxes (`924:6837`), Switch (`924:12476`) and `2224:16084` are hidden in Figma; Checkbox/Switch/Radio values come from the visible **Selection** card (`2650:18296`). Figma quirks: the Info badge border renders `#000` (we used `#A8C0EC`); the Secondary button's hover shows no visible change (only the shadow goes); the "Tooltip" card is a tour-style tooltip (Skip/Next).
- Usage counts in the app (outside `ui/`) to prioritise: secondary buttons 75, primary 42, link 28, outline 23, default 10, success 5, ghost 5, destructive 1.

## 10. Verification playbook ("done" = every gate green)

Run from the repo root; the kit is documented in `design/verify/README.md`.

| # | Gate | Command / method | Expected |
| --- | --- | --- | --- |
| 1 | Unit tests | `npx vitest run src/components/ui/__tests__/v2` and the full `npx vitest run` | all pass; the ONLY failure allowed is the pre-existing `date-time-picker.test.tsx > clears a value that was picked from the calendar...` (hard-coded "September 12, 2026"; fails on untouched `main` too) |
| 2 | Types/lint/format | `npx tsc -p tsconfig.app.json --noEmit`; `npx eslint <files>`; `npx prettier --check "src/components/ui/v2/*.tsx" "src/components/ui/__tests__/v2/*.tsx"` | clean (tsc excludes stories/tests by config) |
| 3 | Repo guards | `node scripts/check-component-tests.js`; `node scripts/check-bootstrap-compat.js` | pass |
| 4 | CLI build + tests | `cd packages/cli && npm run build` then `npx vitest run --exclude "**/e2e.test.ts"` | all validators pass; 89+ tests pass |
| 5 | v1 unchanged | registry dump before/after (`design/verify/README.md` section 2) | only `v2-*` entries differ (Button spike: 126 compared, 0 v1 changed) |
| 6 | Consumer install | `design/verify/README.md` section 1 | lands at `ui/v2/<name>.tsx`, no `tw-`, equals source, warning in a prefixed project |
| 7 | Dead classes | `node design/verify/dead-classes.mjs <file>` | 0 dead (negative control: the prefixed v1 file shows all classes dead) |
| 8 | Visual + numbers | Storybook `States` story + a script modelled on `story-states.check.js` | every variant x state matches the RECORDED spec (`design/v2-figma-specs.md`, read from Figma earlier; do not reopen Figma for this gate); Docs tab renders; no console errors |
| 9 | tailwind-merge | `design/verify/README.md` section 3 for risky class combos | `true` on both 2.6 and 3.4 |
| 10 | Production build | `npm run build-storybook` | exit 0; new story ids present in `storybook-static/index.json` |

**Why gate 8 exists although Figma was already compared.** The earlier comparison validated the web panel's copies, not the library. The library file is a rewrite (unprefixed, `disabled:`/`aria-busy:` instead of a `state` variant, a different tailwind-merge major, a different Storybook CSS environment), so it must prove it still renders the recorded values. The Button run found a real bug this way (tailwind-merge 3 silently dropped the focus ring's `outline` style in Storybook), and the web-panel checks had only covered default-state sizes and fonts, never hover/pressed/disabled/loading. The check is automated and takes seconds; the only cost per component is writing its expectations table once, **from the recorded spec, not from Figma**. Keep it proportionate: the full variant x state matrix is for interactive components (Input, Checkbox, Switch, Select, Dropdown); for static ones (Badge, Tag, Avatar, Alert, EmptyState) checking the default state of each variant and size is enough.

Notes on gate 8: query `#storybook-root button` (Storybook injects 3 extra buttons); use a viewport >= 1200 px wide; story iframe URL is `http://localhost:6008/iframe.html?id=v2-components-<name>--states&viewMode=story`; story ids come from `http://localhost:6008/index.json`.

After running gate 10, **restore generated tracked files** that Storybook/emit-catalog rewrite: `git checkout -- public/catalog.json public/design-tokens.source.json` (see gotcha 7).

## 11. Open decisions (ask the user; do not decide silently)

1. **How does the web panel consume unprefixed v2 under Bootstrap?** Bootstrap 5.3.3's `!important` utilities overlap with unprefixed Tailwind: `.px-4` is 1.5rem in Bootstrap but 1rem in Tailwind; `.border` also sets style/colour; `.border-2`, `.gap-2`, `.p-0` share names. So either Bootstrap wins (v2 gets wrong padding) or v2 wins (legacy pages using those classes shift). Storybook is unaffected. Options: (1) an opt-in prefix only for Bootstrap hosts (my recommendation; cheapest, but the v1 prefixer must first stop prefixing arbitrary properties, gotcha 2, or v2 must avoid arbitrary properties); (2) isolate v2 screens (Shadow DOM/iframe, heavier); (3) use v2 first where Bootstrap is absent (the web panel loads it globally, so this excludes the web panel for now).
2. **Commit strategy.** Nothing is committed in any repo. Suggested: web panel as two commits (chat/AI-bot polish vs v2 components) so they can be reverted separately; library as one commit for the v2 Button spike (decide whether to include the regenerated `registry-core.ts`/`registry.ts`, which are tracked). Ask first.
3. **Design calls**: v1 `min-w-*` was dropped from the v2 Button; the Secondary button has no visible hover in Figma (designers may want one); Info badge border `#000` in Figma vs `#A8C0EC` used.
4. **Naming**: keep the Storybook section "V2" or brand it "Orbit" (display name only; keep folder/group `v2` so promotion is a rename-free move).
5. **Inter hosting**: Google Fonts link (current, in Storybook `preview-head.html` and the web-panel `src/index.tsx`) vs self-hosting; and whether to switch the app font globally (v1 pages stay Open Sans, so screens mix fonts).
6. **The web-panel work tree** has v2 applied IN PLACE (a flag-day preview). With the namespace approach the long-term plan is to regenerate v1 there and import `ui/v2/*` per screen. Keep it as a visual preview only (do not merge), and remove the TEMP gallery route when done?
7. **Publishing** (`npm publish --tag v2`, MCP metadata sync, docs): not now; never without the user.

## 12. Backlog (priority order)

**A. Components (each = section 8 recipe + section 10 gates).**
1. Batch 1: **Badge, Tag, Input, Checkbox, Switch** (small, high usage). Specs for Badge, Tag, Input are in `design/v2-figma-specs.md`; Checkbox/Switch from the Selection card.
2. Batch 2: **Textarea, TextField, Select, SelectField, Phone input container**. Wrap/re-export the large select-family components instead of forking where possible.
3. Batch 3 (overlays): **Tooltip, Dialog, Confirmation modal, Delete confirmation modal, Dropdown menu, Toast.**
4. Batch 4: **Tabs, Table, Accordion, Alert, Avatar, PageHeader, Pagination, EmptyState.**
5. Batch 5 (v2-only, need fresh Figma reading + new code): **Stepper, Breadcrumbs, OTP input, Number step, Shimmering text, Scrollbar, Progress indicator, UI Cards, Page Footer, Radio**, then Date range/time pickers and File upload.

**B. Infrastructure follow-ups.**
- Add a v2 mode to `scripts/create-component.js` (it only handles flat `ui/`; the Button files were hand-made to mirror what it generates).
- Extend scanners that read `src/components/ui` **non-recursively** so they cover `ui/v2`: `scripts/check-breaking-changes.js` + `scripts/generate-api-snapshot.js` (api:check), `scripts/smart-test.js`, `scripts/sync-mcp-metadata.js`, `packages/cli/scripts/validate-imports.js`, `scripts/validate-cva-props.js`.
- Storybook docs: a "V2" Introduction + Migration page (import swap, what visually changes, the unprefixed requirement, migrate by screen not by component, sunset trigger), and a v2 Foundations/tokens page.
- CLI README/docs for `v2-*` components; MCP metadata for v2 (only when publishing).
- Add a `ui/v2` barrel only if the user wants one.

**C. Separate tasks found along the way (queued as chips in the previous agent's UI; NOT started; re-create them if you can):**
1. *Fix the CLI prefixer: stop prefixing Tailwind arbitrary properties.* `[appearance:textfield]` becomes `tw-[appearance:textfield]`, which Tailwind 3.4 with a prefix never generates (arbitrary properties are never prefixed). v1 ships dead classes today: `input.tsx`, `text-field.tsx`, `date-time-picker.tsx`, `date-range-picker.tsx`, `custom/date-range-modal/date-input.tsx`; the web panel's committed `input.tsx` contains `tw-[appearance:textfield]`. Two copies of `prefixClassString` must change identically: `packages/cli/src/utils/prefix-utils.ts` and the template copy inside `packages/cli/scripts/generate-registry.js`. Prove it with the registry dump diff and note that it changes what v1 consumers receive (number spinners vanish, thin scrollbars appear), so it needs the owner's go-ahead.
2. *Align the root `tailwind-merge` (^3.4.0) with the CLI/consumers (^2.6.0)* so Storybook merges classes like consumers do.
3. *Make `validate:coverage` actually run*: it prints "Validation skipped (registry not built yet)" because `await import('../src/utils/registry-index.ts')` fails under plain Node; it must fail loudly instead.

**D. Web panel track (after decision 1).** Decide per-screen migration order (chat page first is natural), regenerate v1 copies, switch imports to `ui/v2/*`, remove the TEMP gallery, and fix the pre-existing failing suites separately.

## 13. Known issues and gotchas

1. **tailwind-merge major mismatch**: root ^3.4.0 vs consumers ^2.6.x. Class lists must survive both (gate 9). Known example: bare `outline` + `outline-1`.
2. **v1 prefixer bug with arbitrary properties** (backlog C1). v2 is unprefixed so it is unaffected, but any future "prefix v2" option depends on this fix.
3. **`validate:coverage` is a silent no-op** here (backlog C3). The registry tests I added are what enforce "v2 ships verbatim".
4. **Hand-rolled YAML parsers** (`emit-catalog.js`, `sync-design-skill.js`) need registry keys matching `[\w-]+`: no slashes, no quotes.
5. **Non-recursive scanners** (backlog B): `api:check`, `smart-test`, `sync-mcp-metadata`, `validate-imports`, `validate-cva-props` do not see `ui/v2` yet. `validate-cva-props.js` also reports pre-existing problems on `main` (e.g. `bouncing-loader`).
6. **No hidden cva `state` variant** (validate-cva-props rule) - use `disabled:` / `aria-busy:`.
7. **Generated files that are tracked**: `packages/cli/src/utils/registry-*.ts` and `registry.ts` change whenever you run `generate-registry` (expected). `public/catalog.json` is tracked, **stale at HEAD** (122 entries; 125 real components), so regenerating it adds unrelated drift (24 changed entries); `public/design-tokens.source.json` is a Storybook addon artifact with machine-local paths. Restore both with `git checkout -- <file>` unless the user wants a refreshed catalog committed deliberately (Merlin reads it).
8. **Husky pre-commit** (when the user eventually asks for a commit): `check-component-tests.js`, `validate-cva-props.js`, and lint-staged (ESLint fix, `api:check`, `generate-registry`).
9. **Bootstrap `<p>` rule**: every `<p>` in component/story code needs `m-0` (`scripts/check-bootstrap-compat.js`).
10. **zsh** is the user's shell: quote globs (`--include='*.tsx'`), and an unquoted `$VAR` holding several paths is NOT word-split.
11. **Storybook** rewrites `public/design-tokens.source.json` every time it starts. It runs on 6008 so it doesn't clash with v1's 6006 (and a stopped one is `lsof -ti:6008 | xargs kill`).
12. **Pre-existing failing tests** in the web panel work tree: InfoMenu, LiveChatPageLayout, BotList and a stale SidebarToggleButton snapshot (not caused by this work).
13. The web panel serves SPA routes only for whitelisted prefixes (Apache/CakePHP): `/bots/...` works, `/dev/...` returns a CakePHP "Oops" page. `/chat` has a single-tab guard ("Use here").
14. `design/v2-figma-specs.md` contains process notes tied to the previous agent's browser tooling (tab ids are stale); the Figma facts and node ids are what matter.

## 14. Where everything is

| Thing | Location |
| --- | --- |
| Library, original checkout (v1 reference) | `/Users/ankish/Downloads/Code/storybook-npm` - branch `main`, clean. Don't edit. |
| **v2 work tree (your main workspace)** | `/Users/ankish/Downloads/Code/storybook-npm-v2` - branch `feat/v2`, deps installed (`npm ci` done in root and `packages/cli`) |
| Stale git worktree entry | `/Users/ankish/Downloads/Code/storybook-npm-merlin-wt` (directory missing; `git worktree prune` is safe but was not requested) |
| Web panel repo | `/Users/ankish/Downloads/Code/myOperatorWebPanel/myoperator-web-panel-docker-image`, frontend `src_in/myop-web-react` (root `git status` has unrelated infra changes; not ours) |
| Web panel v2 work tree (in-place port, TEMP gallery) | `/Users/ankish/.codex/worktrees/92e4/ai-bot-frontend` - branch `codex/ai-bot-ui-test`, 51 uncommitted paths |
| Storybook (v2 work tree) | `http://localhost:6008` (was started in the background; may need restarting) |
| Previous agent's scratch (temporary, may vanish) | `/private/tmp/claude-501/-Users-ankish-Downloads-Code-myOperatorWebPanel-myoperator-web-panel-docker-image/d2250b2a-fc06-4a4c-af1e-6657c59b193a/scratchpad/` (registry before/after JSON, scratch consumer projects, Pulse backups) |

## 15. How to report back to the user

Keep it short: what you did, what you verified (numbers), what is still unverified, the decision you need from them, and the single recommended next step. Never claim something is verified unless you ran the gate in section 10; say which gates you could not run.
