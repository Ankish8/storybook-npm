# V2 story repair and browser review — 2026-10-01

Workspace: `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`.
Scope: **Button, Badge, Tag, Input, Checkbox and Switch stories** and their shared story helpers. The shipped primitive implementations were not changed by this repair. Changes remain local and uncommitted.

Use `V2-STORY-STANDARD.md` for subsequent stories. The earlier batch verification remains a record of the component/CLI checks; it was not sufficient evidence for story quality.

## What changed

- Explicit defaults and relevant control types; editable arguments reach the rendered component.
- Individual variants/sizes/states inherit the working meta renderer.
- Named `useArgs` renderers synchronize Input text and Checkbox/Switch selection with Controls; event spies remain active.
- Galleries exclude their fixed axes, apply their remaining controls and explain what is fixed.
- Independent gallery inputs and toggles use `src/storybook/v2-preview.tsx`; these helpers are story-only.
- Usage cards use a 16px semibold title, 14px main labels and 12px supporting text, with modest spacing and `max-w-full` containment.
- Wide state matrices scroll within their own container; comparison samples wrap within their column.
- `story-docs.ts` escapes leading color hashes. Storybook had parsed `#E9EAEB` and similar values as Markdown headings inside HTML table cells.

## Manual browser checks

Reviewed rendered pages in the in-app browser. Development controls were exercised at `http://localhost:6008`. Final screenshots and additional checks used the fresh production build served at `http://localhost:6018`, so other agents' ongoing HMR edits would not reset the review.

| Component | Controls and interaction checks | Visual views reviewed |
| --- | --- | --- |
| Button | Overview: palette, text, small size, icons, loading text and busy state. Secondary: editable text/size. All variants: all nine samples became 32px high with 12px labels. Usage: all four actions respond to the size control. | Both Docs tables, Overview, palette gallery, state matrix, Usage |
| Badge | Overview: palette, text, large size and both icons. All variants: content/size apply to all ten. Information: editable text/small size. AsLink: text, palette, large size and local anchor. Usage: small status badges. | Both Docs tables, Overview, all 30 palette/size samples, Usage |
| Tag | Overview: palette, label, text, icon and dismiss toggle. Accent: editable text/small size. Dismissible: remove/reset and disabled dismiss buttons. TagGroup: maxVisible 2 → 3 changes +2 more → +1 more. | Both Docs tables, Overview, all 27 palette/size samples, v1 comparison wrapping, activity Usage |
| Input | Overview: value control, typing synchronization, error, password and readOnly. Error: value and aria-invalid. Focused check-icon toggle. All variants: text applies to both fields. Usage: typing updates Controls and Save shows local saved state. Number fields: decimal input, integer dot-key guard, decimal control and events in Actions. | Both Docs tables, Overview, variant gallery, state matrix, numeric example, Usage |
| Checkbox | Overview: indeterminate selection, Space updates args, size, label placement and separate-label association. Indeterminate story: text/small size; direct click updates the checked control. All variants: size/disabled apply to each. Usage: mixed group → select all; size applies to the group. | Both Docs tables, Overview, variants, all 45 state/size samples, Usage |
| Switch | Overview: checked control, direct toggle updates args, size, label, left placement and disabled. On: text/large size. All sizes: live checked value and three correct track sizes. Usage: independent preferences and large-size control. | Both Docs tables, Overview, size gallery, all 30 state/size samples, Usage |

Both Docs tables for each component contained **zero heading elements inside cells**. The corrected Switch comparison values rendered at 14px and retained their leading hashes. Docs section headings remain visually distinct from table text. Also opened the v1 Switch Docs and inspected its control organization/typography; v1 source stories were used for the coverage comparison.

The Input state grid had a 1000px content width in a 948px scrolling container; the page width stayed equal to its 980px viewport. Tag's comparison also stayed within the viewport. These are contained comparison grids, not page-level overflow.

Evidence directory:
`/Users/ankish/.codex/visualizations/2026/10/01/01a0f701-1f12-7e51-a61f-f71dd3bd944b/v2-story-review`

It includes per-component Docs, Controls, matrix and Usage screenshots plus `review.json` with the exercised controls. `switch-docs.png` shows the exact table area reported by the user; `input-usage.png` shows synchronized typing and local Save; `tag-controls.png` and `button-variants.png` show functioning Controls beside their rendered result.

## Focused verification

| Check | Result |
| --- | --- |
| Stories TypeScript config (`design/verify/tsconfig.a1-stories.json`) | Passed; explicitly includes the six story files because the app config excludes stories |
| ESLint on six stories and the two helpers | Passed |
| Prettier check on those files and the stories TS config | Passed |
| Six primitive unit-test files | 189 tests passed |
| Fresh production Storybook build | Passed, `/tmp/myoperator-v2-story-review-build` |
| Tracked v1 component files | No changes in `git diff --name-only -- src/components/ui` |

Commands:

```sh
npx tsc -p design/verify/tsconfig.a1-stories.json --noEmit --incremental false
npx eslint src/components/ui/v2/{button,badge,tag,input,checkbox,switch}.stories.tsx src/components/ui/v2/story-docs.ts src/storybook/v2-preview.tsx
npx prettier --check src/components/ui/v2/{button,badge,tag,input,checkbox,switch}.stories.tsx src/components/ui/v2/story-docs.ts src/storybook/v2-preview.tsx design/verify/tsconfig.a1-stories.json
npx vitest run src/components/ui/__tests__/v2/{button,badge,tag,input,checkbox,switch}.test.tsx
npx storybook build --output-dir /tmp/myoperator-v2-story-review-build
```

The full numeric recorded-spec matrix and CLI consumer tests were not repeated in this story-only repair; their earlier results are recorded in `V2-BATCH-1-VERIFICATION.md`. This pass adds actual Controls and manual hierarchy checks.

## Limitations and shared-worktree notes

- The development server briefly cached failed story indexing while files were being saved/formatted. Completed files parsed, typed and built successfully; touching the affected completed files and reloading recovered the six stories. A separate Textarea indexing error appeared during concurrent work. No other agent's component is approved by this report.
- Browser logs were checked. They include one production Storybook channel `toJSON` cross-origin error on Button Docs navigation, plus addon deprecation/duplicate design-token registration and Google Fonts cssRules warnings. The inspected previews continued rendering and their controls worked; this report does **not** claim a zero-error console. Those addon/channel issues remain a separate follow-up.
- The existing Button Slot unit test still emits the React.Fragment className warning. Tooling also warns about stale browser compatibility data; the focused checks exit successfully.
- An early formatting-only pass included concurrently created v2 stories before narrowing the formatter to these six files. No behavioral repair or browser approval for those other components is claimed.
- No Figma specs were reread. v1 compatibility and the recorded v2 values remain the source of truth. No commits, pushes, registry regeneration, publishing or deployment were performed by this story repair.
