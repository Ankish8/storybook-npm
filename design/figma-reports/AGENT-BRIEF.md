# Brief for the v2 UI refresh (read fully before editing)

Repo: `/Users/ankish/Downloads/Code/storybook-npm-v2` (branch `codex/v2-motion-polish`). Storybook for v2 is already running at `http://localhost:6008` (hot reload). Do NOT start another one.

## Goal
Make selected v2 components look and feel more modern and interactive, based on research of HeroUI, Mantine, shadcn/ui, React Aria, Untitled UI and others, **while keeping our design system**: Inter, our semantic tokens (`semantic-*` Tailwind colours, `--v2-*` CSS vars), ~8px radii, neutral greys with one accent. Every change must be reproducible in Figma by the design team, so every change must be written down with exact values (see "Deliverable").

## Hard rules
1. **v2 stays a drop-in for v1.** Do not remove, rename, or retype any existing prop, export, callback signature, aria-label, `data-*`/`id`/hook class, or default behaviour. Additive optional props are allowed ONLY where your task list says so, with unchanged defaults. No roving-tabindex or other Tab-order changes.
2. Edit only the files your task names (plus their tests/stories under `src/components/ui/__tests__/v2/` and `src/components/ui/v2/*.stories.tsx`). **Never touch v1 files** (`src/components/ui/*.tsx` outside `v2/`), `packages/`, `public/`, or other agents' components. Another agent is editing other v2 components in parallel.
3. **Do not run `git add`, `git commit`, `git stash`, `git checkout`, or `npm run generate-registry`.** The orchestrator commits and regenerates the registry. Do not stage or edit `public/design-tokens.source.json` or `public/catalog.json`.
4. No new dependencies, no runtime animation library. CSS transitions/keyframes only.
5. Motion rules (read `design/V2-MOTION.md`): presses 80ms down / 180-200ms back; panels 200-260ms; reduced motion removes spatial movement and keeps brief fades; gate keyframes with `motion-safe:animate-in` (not `motion-reduce:animate-none`).
6. Gotchas that already cost hours:
   - Tailwind `duration-*` also sets `transition-duration`; on an element with no `transition-property` that means `transition: all` (a floating panel "flew in from the corner"). Time animations with `[animation-duration:Nms]` or list the transition properties explicitly.
   - floating-ui panels need `transform: false` before any zoom/slide keyframe.
   - Tailwind is 3.4: an alpha modifier on a `var()`-based colour (`bg-semantic-info-surface/60`) generates nothing. Use an explicit token or an arbitrary value (`bg-[var(--semantic-info-surface-subtle)]`).
   - Hover must not stick on touch: gate hover fills with `[@media(hover:hover)]:hover:`.
   - `button.test.tsx` pins the loading DOM to v1; do not add wrappers to Button.
   - Any component using `animate-in/out` needs `tailwindcss-animate` in `packages/cli/components.yaml` (already true for components that use it today; do not edit that file, tell the orchestrator if a component newly needs it).
   - Prefer pseudo-elements and classes over new DOM nodes. If you add a DOM node it must not duplicate visible text (v1 tests use `getByText`).
7. No hard-coded new hex colours unless there is no token; list any such value in the report.
8. Keep comments in the existing style (explain the *why* of non-obvious CSS, not the what).

## How to verify (run these yourself, scoped to your components)
- Unit tests: `npx vitest run src/components/ui/__tests__/v2/<name>.test.tsx` (fix or extend tests; class-name assertions in v2 tests may be updated when the class changed on purpose, behaviour assertions may not).
- v1 contract (fast): `node design/verify/v1-v2-api-compat.mjs --only <name>` must print `0 breaking`.
- v1 tests replayed on v2 for one file: `npx vitest run -c design/verify/vitest.v1-on-v2.config.ts src/components/ui/__tests__/<name>.test.tsx`. Failures that only assert a v1 utility class are expected; any other failure is a break you must fix (or report).
- Lint: `npx eslint <changed files>`.
- Real browser: the capture tool below, then LOOK at the screenshots (Read the PNG) and judge them as a designer: alignment, contrast, spacing rhythm, hover/focus/disabled/error states, long text, narrow widths, dark mode if the story supports it.
- Motion: if you add or change motion, add a scenario to `design/verify/motion-probe.mjs` style checks or at least verify with `document.getAnimations()` through the capture tool's `eval` step; reduced motion must be honoured.

## Capture tool (before/after screenshots + measured styles)
`design/verify/capture.mjs`, see its header. A scenario file under `design/figma-reports/<kebab-component>/scenarios.mjs` default-exports an array of
`{ name, story, width?, height?, steps?, measure?: { "<label>": { sel, props: [...] } } }`. Story ids look like `v2-components-daterangepicker--overview` (list them with `curl -s http://localhost:6008/index.json`). Steps: `{click: css}`, `{clickText: "text", within: css}`, `{hover}`, `{hoverText}`, `{key: "ArrowDown", repeat}`, `{type}`, `{wait}`, `{eval: js}`. Run:
`node design/verify/capture.mjs design/figma-reports/<comp>/scenarios.mjs --label before --out design/figma-reports/<comp>`
and later `--label after`. **Capture "before" FIRST, before you change any source** (Storybook hot-reloads your edits). Choose `measure` selectors for every element whose style you change (trigger, panel, row, cell, chip, ...), with props such as `background-color, color, border-radius, border-top-width, border-top-color, box-shadow, padding, gap, font-size, font-weight, line-height, letter-spacing, transition-duration, opacity`. Capture every state you changed (default, hover, focus-visible via `{key: "Tab"}`, open, selected, disabled, error, empty, long content, small width via `width`).

## Deliverable per component (this is as important as the code)
Folder `design/figma-reports/<kebab-component>/` containing: `scenarios.mjs`, `*.before.png/.json`, `*.after.png/.json`, and `meta.json`:
```json
{
  "title": "DateRangePicker",
  "storybook": "V2/Components/DateRangePicker",
  "figmaNode": "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=<id from the story's design.url, or omit>",
  "summary": "2-4 sentences: what changed for a user.",
  "why": ["research finding that motivated it, with library names"],
  "scenarioLabels": { "<scenario name>": "Human label" },
  "motion": [{ "what": "Month change", "before": "none", "after": "200ms slide 8px + fade, spring ease" }],
  "states": ["Every Figma variant/state that must be updated: e.g. 'Day cell / in-range / row-start: left cap radius 9999'"],
  "figmaSteps": ["Concrete, ordered steps a designer follows, naming layers and exact numbers (px, hex, ms, auto-layout padding/gap, corner radius, effects)"],
  "notes": ["Things proposed but NOT implemented, open questions, anything you could not verify"]
}
```
Then run `node design/verify/figma-report.mjs design/figma-reports/<comp>` to generate `REPORT.md` (it diffs the measured styles). Read the generated REPORT.md and fix scenarios/meta until the measured tables show the real changes with sensible element names.

## Final message to the orchestrator (concise)
List: files changed; per component a 2-line summary of the visible changes; test/contract/lint results with the actual numbers; anything you chose not to do and why; anything that needs a decision. Do not claim a check passed unless you ran it.
