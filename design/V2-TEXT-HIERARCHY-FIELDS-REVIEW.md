# v2 fields: text hierarchy review

Completed on 2 October 2026 in `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`. Source and story edits are frozen. Changes remain local.

## Scope and roles

This pass covers Input, TextField, Textarea, Select, SelectField, PhoneInput, MultiSelect, CreatableSelect, CreatableMultiSelect, DateRangePicker, DateTimePicker, OtpInput and NumberStepField, including their existing stories.

The user's gray hierarchy overrides the earlier recorded neutral Figma colors. Dimensions, layout, API, behavior, status colors, disabled surfaces and intentional primary button emphasis are retained. No fresh Figma read was needed for this correction.

| Role                                                      | Variable and fallback              | Weight |
| --------------------------------------------------------- | ---------------------------------- | ------ |
| Field labels, selected options/chips, month/year headings | `--v2-text-primary`, `#484848`     | 500    |
| Values, ordinary menu choices, calendar dates             | `--v2-text-secondary`, `#5E5E5E`   | 400    |
| Helper text, counters, supporting copy                    | `--v2-text-muted`, `#707070`       | 400    |
| Native text placeholders                                  | `--v2-text-placeholder`, `#707070` | 400    |

Ordinary example headings now use 500. Calendar selection keeps its inverted white text at 500. Labels in shared v1/v2 comparison renderers retain the old color and 600 weight in the v1 branch. Existing user stories and interaction plays are preserved; the intentional ANSI stripping expression in the user's DateRangePicker Probe has one documented ESLint exception.

## Final browser views

Reviewed in the logged-in Chrome Work browser at `http://localhost:6008`. The actual preview document width was 1620px. All thirteen States pages measured `scrollWidth === clientWidth === 1620`; the TextField version comparison and the four reviewed Docs pages also stayed within that width.

| Component            | Views reviewed in this pass                                       | Findings                                                                                                                                                                                                                                      |
| -------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Input                | States                                                            | Values 400 / `rgb(94,94,94)`; native placeholders `rgb(112,112,112)`; error and disabled surfaces retained.                                                                                                                                   |
| TextField            | Overview, States, Usage, Docs, v1 vs v2                           | Labels 500 / `rgb(72,72,72)`; values 400 / `rgb(94,94,94)`; native placeholders `rgb(112,112,112)`. Default field stays 40px and compact stays 36px.                                                                                          |
| Textarea             | States                                                            | Labels primary / 500; body secondary / 400; helpers and placeholders muted; default, hover, focus, error and disabled rows remain distinct.                                                                                                   |
| Select               | Overview with open and selected menu, States, With disabled items | Ordinary options secondary / 400; selected Basic Auth primary / 500. Unavailable option keeps its disabled flag and 0.5 opacity.                                                                                                              |
| SelectField          | States                                                            | Labels primary / 500; field values secondary / 400. Loading, disabled and error treatments remain intact.                                                                                                                                     |
| PhoneInput           | States                                                            | Labels primary / 500; values secondary / 400; placeholders muted. The outer 48px control remains unchanged; its measured inner input is 46px.                                                                                                 |
| MultiSelect          | Overview with open menu and selected React chip, States           | Ordinary options secondary / 400; selected option and chip primary / 500. Loading and disabled/error rows retained.                                                                                                                           |
| CreatableSelect      | Overview with selected Technical Support, States                  | Ordinary options secondary / 400; selected option primary / 500; search/value text remains regular-weight.                                                                                                                                    |
| CreatableMultiSelect | Overview with selected Friendly chip and open suggestions, States | Suggestions secondary / 400; chip primary / 500. Creation instructions and selection counter remain supporting text.                                                                                                                          |
| DateRangePicker      | States, Overview with open calendar and preset selection          | Trigger secondary / 400 at 40px. Month/year primary / 500; presets and ordinary current-month dates secondary / 400; adjacent-month dates muted / 400; selected range edges white / 500.                                                      |
| DateTimePicker       | States, Overview with calendar, month menu and time menu, Docs    | Values secondary / 400; field labels primary / 500. Month/year and selected month/time choices primary / 500; ordinary choices secondary / 400; selected calendar day white / 500. Inner text input is 24px inside the existing 40px control. |
| OtpInput             | States, Usage, Docs                                               | Digit cells remain 400 / secondary at their existing 60px height. Usage title primary / 500; helper/status text muted; error and disabled surfaces retained.                                                                                  |
| NumberStepField      | States, Overview, Usage, Docs                                     | Numeric values secondary / 400, suffix muted, example headings primary / 500. Inner numeric input remains 38px within the 40px control.                                                                                                       |

For ordinary fields, the measured disabled surface was `rgb(245,245,245)` and the normal/disabled border was `rgb(233,234,235)`. Error borders remained `rgb(240,68,56)`. Composite fields keep those styles on the outer container, rather than the transparent inner input. The hover/focus colors and geometry were preserved.

### Working Controls and Usage

- TextField: entering `Softer hierarchy` updated the value Control; setting `Quiet workspace` in the Control immediately updated the rendered field after the clean final reload. Usage saved `Modern support` and displayed `Saved in this example`.
- Select: selected Basic Auth; the value Control became `basic` and reopening highlighted that option with the 500-weight primary role.
- MultiSelect: selected React; the value Control became `["react"]` and its chip/selected row measured primary / 500.
- CreatableSelect: selected Technical Support; the value Control became `technical-support`.
- CreatableMultiSelect: selected Friendly; the value Control became `["friendly"]` and the selected chip measured primary / 500.
- DateRangePicker: selected Last 7 days; rendered range and value Control both changed to `2026-09-26` through `2026-10-02`.
- DateTimePicker: changed the Start Time hour from 10 to 11; both the rendered time and value Control changed to `11:30:00` / `11:30 AM`.
- OtpInput Usage: entered `1234`, confirmed the four cells and live value Control, then clicked Verify code; the example displayed `Code submitted for verification`.
- NumberStepField: Increase value changed both the input and value Control from 1 to 2. Usage Save delay displayed `Saved 1 hours.` with muted / 400 status text; the existing message wording is unchanged.

### Docs and v1

TextField, DateTimePicker, OtpInput and NumberStepField Docs were reviewed after the final typography changes. Each renders three visible tables, a primary / 600 page title and primary / 500 section headings. None contains heading elements inside table cells. The TextField token table was also scrolled into view and inspected: cells are 14px / 400 / secondary, with the current primary, secondary, muted and placeholder token values shown correctly.

The rendered TextField v1/v2 comparison confirms that v1 labels remain `rgb(52,62,85)` / 600 and values remain `rgb(24,29,39)` / 400. v2 labels are `rgb(72,72,72)` / 500 and values `rgb(94,94,94)` / 400. Existing version dimensions remain 42px/36px for v1 and 40px/36px for v2.

## Checks

- Focused existing test suites: **13 passed, 441 tests passed**. Log: `/tmp/myoperator-field-hierarchy-tests.log`.
- Final source/story-inclusive TypeScript, scoped ESLint, formatting and `git diff --check` passed. No new tests were added for the color/weight class changes; existing class expectations were updated in five test files.
- Consumer Tailwind check: **13 source files, 1034 class tokens, zero dead classes**. Log: `/tmp/myoperator-field-hierarchy-css.log`.
- The root agent owns aggregate tests, production build, shared CSS/docs, CLI metadata and v1 snapshot verification. This report records the focused field work and browser evidence, not a separate claim about publishing or deployment.

During concurrent dev updates, Storybook briefly retained stale Acorn/HMR errors and an empty iframe. A clean reload after the shared server restart restored rendering. The log also retains a design-token addon's truncated JSON fetch while the production token output was being written. No new field component exception or React-event serialization error appeared during the clean final typing/Controls check. The final Overview, token-table and version-comparison captures were replaced with clean rendered captures.

## Evidence

Screenshot and measurements directory:

`design/review/text-hierarchy-fields/`

The following saved screenshots were opened and visually inspected:

- All thirteen component States captures: `input-states.png`, `text-field-states.png`, `textarea-states.png`, `select-states.png`, `select-field-states.png`, `phone-input-states.png`, `multi-select-states.png`, `creatable-select-states.png`, `creatable-multi-select-states.png`, `date-range-picker-states.png`, `date-time-picker-states.png`, `otp-input-states.png`, `number-step-field-states.png`.
- Selected/disabled menus: `select-selected.png`, `select-disabled-items.png`, `multi-select-selected.png`, `creatable-select-selected.png`, `creatable-multi-select-selected.png`.
- Picker portals: `date-range-picker-open.png`, `date-time-picker-calendar.png`, `date-time-picker-month-menu.png`, `date-time-picker-time-menu.png`.
- Docs: `text-field-docs.png`, `text-field-docs-tokens.png`, `date-time-picker-docs.png`, `otp-input-docs.png`, `number-step-field-docs.png`.
- Final field/example/version captures: `text-field-after.png`, `text-field-usage.png`, `otp-input-usage.png`, `number-step-field-usage.png`, `text-field-v1-v2.png`.

`measurements.json` contains the DOM-backed computed values and interaction results. No source or story changes remain pending for this group.

## Usage coverage supplement and Select placeholder correction

The remaining ten Usage views were reviewed in Chrome Work at `http://localhost:6008` on 2 October 2026. This supplements the earlier TextField, OtpInput and NumberStepField Usage checks, completing Usage coverage for all thirteen owned components. Each remaining form received a meaningful local action, and all ten preview documents measured `scrollWidth === clientWidth === 1620px`, with no overflowing local containers.

| Component            | Action and rendered result                                                                                                                    | Measured hierarchy                                                                                                                                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Input                | Entered `Support workspace`; Save displayed `Saved in this example`.                                                                          | Label primary / 500; input secondary / 400; native placeholder muted; saved status muted / 400.                                                                                                                                           |
| Textarea             | Entered `The customer requested a callback tomorrow morning.`; Save note displayed `Saved in this example` and the counter remained `51/200`. | Label primary / 500; body secondary / 400; native placeholder muted; counter/helper/status supporting text.                                                                                                                               |
| Select               | Opened the options, selected API Key and saved. `Saved in this example` appeared.                                                             | Ordinary options and selected trigger secondary / 400; saved status muted / 400. Empty placeholder correction is recorded below.                                                                                                          |
| SelectField          | Opened its searchable options, selected Basic Auth and saved. `Saved in this example` appeared.                                               | Required label primary / 500; ordinary options and value secondary / 400; helper/status muted / 400.                                                                                                                                      |
| PhoneInput           | Entered the synthetic test number `9876543210` and saved. `Saved in this example` appeared.                                                   | Required label primary / 500; number secondary / 400; native placeholder and saved status muted. Existing 48px field geometry retained.                                                                                                   |
| MultiSelect          | Selected React and saved. Its chip and `Saved in this example` were visible.                                                                  | Required label primary / 500; ordinary options secondary / 400; React chip primary / 500; saved status muted / 400.                                                                                                                       |
| CreatableSelect      | Typed `Escalation specialist`, confirmed creation with Enter, then saved the role. `Saved role: Escalation specialist` appeared.              | Example title primary / 500; draft and trigger secondary / 400; subtitle muted / 400; existing success status green / 400.                                                                                                                |
| CreatableMultiSelect | Typed `Calm`, created it with Enter, closed suggestions, then saved the tone. `Saved tones: Calm` appeared.                                   | Example title primary / 500; ordinary suggestions secondary / 400; Calm chip primary / 500; subtitle muted / 400; success status green / 400.                                                                                             |
| DateRangePicker      | Selected Last 7 days and saved `26 Sep 2026 - 2 Oct 2026`. `Report period saved: 2026-09-26 to 2026-10-02` appeared.                          | Example title primary / 500; preset and rendered value secondary / 400; subtitle muted / 400; success status green / 400.                                                                                                                 |
| DateTimePicker       | Selected October 7, 2026, set Start Time to 10:30 AM, closed the calendar and saved. `Appointment saved: 2026-10-07 10:30:00` appeared.       | Example title and required label primary / 500; native input and ordinary date/time choices secondary / 400; native placeholder muted; selected time choice primary / 500; month/year controls primary / 500; success status green / 400. |

The explicit computed neutral values were primary `rgb(72,72,72)`, secondary `rgb(94,94,94)` and muted/placeholder `rgb(112,112,112)`. The existing semantic success status remained `rgb(6,118,71)`, rather than being converted into a neutral. Native input values, selected chips and live Controls were visible in the saved captures. No stories or interaction plays were edited during this supplement.

### Corrected Select placeholder inheritance

The table agent found that an empty Select inherited the secondary value color instead of the recorded placeholder color. Browser DOM inspection confirmed that Radix puts `data-placeholder` on the Trigger, while its Value span has no such attribute. The installed Radix Value implementation also ignores its `className`, so the old Value-only placeholder selector could not apply.

The Trigger now uses an explicitly typed arbitrary color utility backed by a local value-color variable. Its `data-placeholder` modifier sets that variable to the placeholder role. Filled values retain the secondary role, and ordinary caller text-color overrides continue to win through `cn`. SelectField's routing/group placeholder override now targets the actual Trigger flag through the same local variable.

| Rendered check                     | Empty Trigger and Value  | Filled Trigger and Value |
| ---------------------------------- | ------------------------ | ------------------------ |
| Select Default, then API Key       | `rgb(112,112,112)` / 400 | `rgb(94,94,94)` / 400    |
| SelectField Usage, then Basic Auth | `rgb(112,112,112)` / 400 | `rgb(94,94,94)` / 400    |

The earlier Select/SelectField States screenshots predate this correction. The four new empty/filled captures below are the final placeholder evidence.

Only these two source files changed for the correction:

- `src/components/ui/v2/select.tsx`
- `src/components/ui/v2/select-field.tsx`

Focused checks passed: **2 suites / 80 tests**, story-inclusive TypeScript for all thirteen field sources/stories, scoped ESLint and atomic formatting. The actual classes were checked with both tailwind-merge **2.6** and **3.4**: `text-base` and the default color survive, caller `text-blue-600`, `text-[color:#663399]` and `text-[var(--custom-color)]` replace the default color, and the routing placeholder variable override survives. Test log: `/tmp/myoperator-select-placeholder-tests.log`.

### Supplement evidence

All fourteen additional screenshots were opened and visually inspected:

- `input-usage.png`, `textarea-usage.png`, `select-usage.png`, `select-field-usage.png`, `phone-input-usage.png`, `multi-select-usage.png`.
- `creatable-select-usage.png`, `creatable-multi-select-usage.png`, `date-range-picker-usage.png`, `date-time-picker-usage.png`.
- `select-empty-fixed.png`, `select-filled-fixed.png`, `select-field-empty-fixed.png`, `select-field-filled-fixed.png`.

They are in the evidence directory above. `usage-measurements.json` contains the additional DOM-backed values and results, including both placeholder correction records and the final saved tone state.

The browser log retained four Storybook manager follower-state errors (`storybook/status`, `test-provider`, `checklist`, `test`) from the initial manager load at `2026-10-02T05:37:03.071Z`. The reviewed preview forms rendered and completed their actions; the final log contained no field exception or React-event serialization error. These manager messages are recorded separately from component results.

Source and story edits are frozen again. No further component, story, test, metadata, v1 or API changes are pending from this agent.
