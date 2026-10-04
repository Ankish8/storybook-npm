# Navigation motion review — Tabs and Select

Reviewed on 2026-10-03 in the user's Chrome through the supported Browser runtime, against the live development Storybook at `http://localhost:6008`, branch `codex/v2-motion-polish`.

This report covers **Tabs and Select only**. The other navigation/form/loading components were reassigned to the research and controls reviewers. Source changes remain local. v1 component sources were not changed by this reviewer.

## Manual story review

| Component | Docs and Controls | Variants and states | Working Usage |
| --- | --- | --- | --- |
| Tabs | Read installation, import, v1 differences, recorded tokens and guidance. Four Docs tables rendered without headings inside cells or page overflow. Changed the `value` Control to Assigned and enabled full width; all three triggers measured approximately 587.3px. Clicking Resolved in the rendered example synchronized the value Control to `resolved`. | Reviewed horizontal and vertical galleries and the Default/Hover/Focus/Active/Disabled matrix. Both tablists had the measured motion indicator enabled. Selecting Assigned in the vertical example left the horizontal example on Open. Three disabled triggers stayed disabled. Labels measured weight 500; inactive text `#707070`, active text `#484848`. No horizontal page overflow. | Open/Assigned/Resolved initially showed counts 2/1/1. Resolving an Open conversation removed it from Open and changed the counts to 1/1/2. Reviewed the resulting layout visually. |
| Select | Read installation, import, composition guidance, v1 differences and recorded tokens. Four Docs tables rendered without headings inside cells or page overflow. Changing the value Control to `bearer` updated the live trigger to Bearer Token. Selecting OAuth 2.0 in the actual popup changed the Control back to `oauth2`. | Reviewed default and error variants, opened the default popup, and selected API Key; the error example stayed independent. Both triggers measured 40px high and 420px wide, with regular weight 400. Reviewed the contained two-row/five-column state matrix: 10 triggers, four disabled, visible focus/error treatments, disabled hover stayed subdued, no horizontal page overflow. | Empty Save showed “Choose an authentication method.” Selecting Bearer Token and saving removed validation and showed “Saved in this example.” Reviewed the resulting card visually. |

The following story routes were visited directly for each component: `--docs&viewMode=docs`, `--all-variants`, `--states`, and `--usage`. The separate Interaction stories were also exercised after repairing their play functions.

### Screenshots inspected

These are viewport captures from the actual rendered stories, visually inspected by the reviewer. Docs captures show the top of the page; the full Docs content and Controls were read and exercised separately. Screenshots show settled states, while the motion probes below record intermediate frames.

- Tabs: [Docs](motion-polish-navigation/v2-tabs-motion-docs.png), [variants](motion-polish-navigation/v2-tabs-motion-variants.png), [states](motion-polish-navigation/v2-tabs-motion-states.png), [Usage](motion-polish-navigation/v2-tabs-motion-usage.png).
- Select: [Docs](motion-polish-navigation/v2-select-motion-docs.png), [open popup](motion-polish-navigation/v2-select-motion-variants.png), [states](motion-polish-navigation/v2-select-motion-states.png), [Usage](motion-polish-navigation/v2-select-motion-usage.png).

## Story fixes

- Tabs Interaction now establishes its public starting selection, clears the initial callback, enters by keyboard, and waits for reactive assertions. The disabled-click check configures `pointerEventsCheck` on its own user-event instance rather than passing an unsupported second argument to `click`.
- Select Interaction uses the owning document and handles Radix's inert trigger between pointer down/up. Synthetic pointer input now moves to the option's actual geometry and commits the highlighted option with Enter; repeated opening uses the trigger's keyboard path. A clean browser run ended with OAuth 2.0 selected, the popup closed and focus returned to its trigger.
- Tabs and Select play functions were checked in the real browser after repair. No new component error was observed in those clean runs.

## Motion evidence

The root reviewer ran the exported probes with real input through the supported Browser runtime adapter. The final combined result is **54/54 passing checks**: 40 baseline checks and 14 additional spring/opacity checks, covering normal and reduced motion.

The added probe reads the tablist's measured CSS variables and the rendered pseudo-element on animation frames. Its cases cover horizontal position, full-width position, changing indicator width, vertical position, interrupted reversal, manual activation, and reduced-motion opacity-only Dialog entry. This is evidence that the spring runs and settles in the rendered library; whether the timing feels right remains a visual judgment.

Two recorder timing issues were repaired before the final run:

1. TextField's startup animation could finish before the Browser runtime injected its recorder. The scenario now clears and submits the real Usage form, creating a fresh validation message after recording begins. Normal and reduced runs recorded 150ms validation entry.
2. Manual Tabs read `activeElement` before Radix's deferred arrow-key focus completed. The scenario now waits a bounded number of animation frames for focus to move before reading geometry. It confirms that the indicator stays at the selected tab until Enter activates the focused tab.

The supported adapter routes navigation through `tab.goto` and keyboard input through `tab.cua.keypress`; allowed CDP commands handle pointer dispatch, media emulation and frame instrumentation. Importing either probe module does not launch Chrome. This review did not run standalone headless browser automation.

Raw final browser results are retained by the root reviewer in `design/review/motion-polish-browser.json`, with temporary detailed results at `/private/tmp/v2-motion-baseline-browser.json` and `/private/tmp/v2-motion-extra-browser.json`.

## Focused automated checks

- **39/39 Tabs tests passed**, including 15 new motion tests plus the existing 24 behavior tests.
- New tests verify real mocked geometry and frame progression: controlled selection, monotonic critical damping, retained velocity on interruption, resize/font snaps, vertical and RTL geometry, manual activation, disabled skipping, nested tablist ownership, reduced motion, missing-geometry fallback and effect cleanup.
- Focused story lint and formatting checks passed; the all-stories TypeScript check passed after the Tabs click signature repair.
- Both exported motion probe files passed `node --check` after the final harness changes.

Broader library tests, consumer installs and the static Storybook build belong to the root completion report. No claim about those checks is inferred from these two manual reviews.
