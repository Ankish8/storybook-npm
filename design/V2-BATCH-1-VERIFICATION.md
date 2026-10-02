# V2 batch 1 verification — 2026-10-01

**Later story repair:** The user identified visual hierarchy and Controls problems after this initial verification. See `V2-STORY-REVIEW.md` for the subsequent six-component repair, browser checks and console limitations. This earlier report's component/CLI checks do not establish that the original stories met the required quality bar.

Workspace: `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`.
Everything remains local and uncommitted. No Figma reread, commits, pushes or publishing.

## Delivered

Badge, Tag, Input, Checkbox and Switch are additive v2 primitives. They retain the
current v1 public props, refs, event behavior and Radix/native semantics. CLI keys
are `v2-badge`, `v2-tag`, `v2-input`, `v2-checkbox`, `v2-switch`.

Their stories now follow the supplied Button story: interactive Overview,
individual variants, size comparisons, state matrices, complete v1/v2 comparisons,
usage examples, install/import guidance, migration notes and token tables with
swatches. Badge includes icons and Slot usage; Tag includes removal, labels and
overflow; Input includes numeric typing and a form; Checkbox includes partial group
selection; Switch includes notification preferences.

The required generator now supports `--v2`, copies the current v1 API, remaps sibling
imports, registers an unprefixed entry and refuses to overwrite existing work.
Four generator regression tests and 15 registry tests were added.

## Gates

| Gate | Result |
| --- | --- |
| v2 unit tests | 189 passed across 6 files, including the existing 72 Button tests; 117 are for this batch |
| Full root tests | 3,084 passed, 5 skipped, 1 known date-picker failure: the test asks for September 12 while the calendar starts in October |
| Types | Root app types, CLI types and 7 compile-time v1/v2 public type equality assertions passed |
| Lint / formatting | v2 component, story and test files passed |
| Repo guards | Component test/story presence and Bootstrap paragraph margin checks passed |
| CLI build | Full build pipeline passed; existing coverage validator still prints its known skip, so direct registry tests additionally prove source equality |
| CLI unit tests | 108 permanent tests passed; external e2e tests excluded as instructed |
| v1 source integrity | 45 primitive source hashes unchanged |
| v1 registry output | 125 pre-existing entries compared against untouched main: 0 changed; only 6 v2 entries added |
| Consumer installs | All 6 v2 files equal source with only the utils import rewritten, in both plain and tw-prefixed scratch projects; v1 button prefix and warning verified |
| Dead classes | 336 authored class tokens across 6 primitives: 0 dead; 255 tokens in 5 installed A1 files: 0 dead |
| Negative control | The prefixed v1 button produced 64 dead tokens under an unprefixed build, as expected |
| Merge compatibility | 10 checks passed with tailwind-merge 2.6 and 3.4 |
| Production Storybook | Build passed; all 5 Docs ids and 77 component/docs entries are present; production docs use the corrected token formatting |

## Rendered values

Expectations are in `design/verify/batch-one-states.check.js`, written from
`design/v2-figma-specs.md` and the already verified web-panel diffs.

| Component | Matrix elements | Checks | Mismatches |
| --- | ---: | ---: | ---: |
| Badge | 30 | 388 | 0 |
| Tag | 27 | 352 | 0 |
| Input | 10 | 161 | 0 |
| Checkbox | 45 | 586 | 0 |
| Switch | 30 | 415 | 0 |
| Total A1 | 142 | 1,902 | 0 |

The earlier Button baseline also passed 493 checks over 54 controls.

Chrome verified the improved Badge docs, Tag removal/reset and the Input matrix,
then its inspection session stalled. The full A1 matrices and all five Docs pages
were verified in the in-app browser. No console errors were observed in the final
docs and interactive examples.

Interaction checks passed for removing/restoring tags, editing/saving the workspace
name, selecting all from a mixed Checkbox group, changing notification preferences,
and toggling the controlled Checkbox and Switch Overview controls.

Chrome rounds the authored 0.4px static borders to a device pixel. An apparent
missing-border problem was caused by stale development CSS for newly added files;
restarting our Storybook server resolved it. No extra shadow workaround was retained.

Existing Button Slot tests still emit the inherited React.Fragment className warning.

## Review

Storybook is running at `http://localhost:6008`.
Start with `/?path=/story/v2-components-tag--v-1-vs-v-2`, then each component's Docs
and Usage stories. The comparison screenshot is saved at
`/Users/ankish/.codex/visualizations/2026/10/01/myoperator-v2-stories/tag-comparison.png`.

Scratch logs: `/tmp/myoperator-v2-batch-1.BjMx1B`.
The registry dump test was removed after comparing output. Generated catalog/token
drift was restored.

## Remaining decisions

A1 does not change the web panel. The handoff's Bootstrap host migration, commit
strategy, display naming, Inter hosting and publishing choices remain for the user.
The Info Badge design choice is resolved: use the black v2 border, per the user's
October 1 instruction to match v2. Tag's Info border remains blue as recorded.
