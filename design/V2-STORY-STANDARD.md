# V2 Storybook story standard

**Text hierarchy update, 2026-10-02:** Use the additive v2 neutral roles from [V2-TEXT-HIERARCHY-REVIEW.md](V2-TEXT-HIERARCHY-REVIEW.md): primary `484848`, secondary `5E5E5E`, muted/placeholder `707070`. Ordinary component/example headings, form labels and neutral actions use 500; body, hints, counts and metadata use 400. Tabs use 500 in both active and inactive states. Keep deliberate emphasis for filled primary/status actions and explicit headline variants. Preserve legacy colors/weights in v1 comparison branches. These user-directed values supersede earlier neutral text/ordinary weight recommendations. Verify computed browser styles; native `dt` and `strong` defaults can introduce unintended bold text.


Use this alongside V2-HANDOFF.md. Worktree: `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`.

## What changed in this pass

Button, Badge, Tag, Input, Checkbox and Switch stories now pass their editable arguments through to the rendered samples. Input uses a live `value`; Checkbox and Switch update `checked` through Storybook's `useArgs`. Galleries expose controls for the properties they actually render. Docs escape leading color hashes so the Markdown renderer cannot turn hex values into headings. Wide matrices scroll inside their own preview.

These six components were manually reviewed: Docs tables, Overview controls, individual variant/state controls, galleries, state/size matrices and usage examples. See `V2-STORY-REVIEW.md` for the actual checks and limitations. Do not treat an existing story or this checklist as proof that a new story passes review.

## Required story behavior

1. **Overview is a real playground.** Put sensible defaults in meta `args`, including explicit boolean defaults. Declare the relevant `argTypes` (select/radio, text, boolean, number or object). Avoid controls that do nothing or can crash the preview, such as `asChild` without a valid child.
2. **Individual variants, sizes and states remain editable.** Use `args` overrides and inherit the meta renderer. Do not write `render: () => <Component fixedProps />` while exposing controls for those ignored properties.
3. **Keep interactive values synchronized.** Use `useArgs` in a named render function for `value`/`checked`, call the supplied event spy and update the argument on interaction. Typing or toggling must update Controls, and changing Controls must update the component. `defaultValue` and `defaultChecked` are initial values, not live controls.
4. **Galleries have working, relevant controls.** Spread `args` before fixed comparison props. Exclude only fixed axes (for example, `variant` in All variants or `size` in All sizes). Apply every other exposed control. Explain fixed axes in the story description. `gallery()` in `src/storybook/v2-preview.tsx` supplies this description and exclusions. Do not disable the whole Controls panel as a workaround.
5. **Usage examples really work.** Demonstrate local form state, dismissal, selection or preferences as appropriate. Feed size, disabled and other exposed arguments into the example. Hide irrelevant properties rather than displaying ignored controls. Keep independent samples independent; the preview helpers support gallery inputs and toggles.
6. **Custom example arguments are labelled.** If an example adds an icon toggle, tag list or overflow limit, put those controls in an Example or composed-component category and consume them in the renderer. Never add story-only props to the shipped component API.

## Visual hierarchy and docs

- Follow the reviewed Button pattern: brief description, CLI install, import, v1 changes and design tokens with swatches.
- Keep headings, body text, captions and actual component labels distinct. Example cards use a 16px medium title, 14px main labels and 12px supporting text. Keep the recorded component sizes; use the current user-directed neutral colors and ordinary weights above.
- Use modest gaps and consistent alignment. Cards should fit the preview (`max-w-full`); wide grids need an `overflow-x-auto` parent and a readable minimum width.
- Escape a leading `#` in docs table text (`value.replace(/^#/, "\\#")`), as in `story-docs.ts`. Check both the change table and token table. No heading elements should appear inside table cells.
- Every paragraph in JSX needs `m-0` to prevent Bootstrap margins.
- Keep install/import paths accurate and source examples readable. Preserve all v1 files and generated v1 output.

## Completion check for each component

1. Compare its story coverage and control types with its v1 counterpart.
2. In the browser, change controls on Overview, an individual variant/state, a gallery and a usage/composed example. Confirm the rendered result, not just the control's selected value. Check click/keyboard/typing where applicable.
3. Manually inspect screenshots of Docs (including both tables), galleries, state grids and Usage. Check clipping, wrapping, contrast, alignment and text hierarchy. Check the console for component errors.
4. Run focused ESLint, formatting and a TypeScript check that includes stories (the app config excludes them), then build Storybook. Do not format another agent's files or regenerate unrelated outputs.
5. Record which views and controls you actually reviewed and any remaining issues. Keep work local; no commit, push, publishing or Figma reread for components with recorded specs.

## Short prompt for another agent

Continue v2 in `/Users/ankish/Downloads/Code/storybook-npm-v2` on `feat/v2`. Read `design/V2-HANDOFF.md` and `design/V2-STORY-STANDARD.md`. Build stories with working Controls on individual examples and galleries, synchronize typing/toggling with args, preserve clear visual hierarchy, and manually review Docs, tables, states and Usage in the browser. Use the updated Button and A1 stories as implementation examples, but verify your own component. Use the recorded spec, keep v1 unchanged, and do not commit, push or publish.
