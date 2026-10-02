# V2 field Docs and gallery review supplement

Reviewed on October 2, 2026 in the browser at `http://localhost:6008`, on `feat/v2` in `/Users/ankish/Downloads/Code/storybook-npm-v2`.

This pass supplements [the field hierarchy report](V2-TEXT-HIERARCHY-FIELDS-REVIEW.md). It covers the nine missing Docs pages and the AllVariants galleries of all thirteen field components. The earlier report covers the thirteen States views and the recorded Usage/Controls checks. This supplement does not claim to repeat those interactions.

## Evidence and scope

- Opened all 22 listed views, inspected their screenshots, and read rendered DOM colors, sizes and weights.
- Opened and inspected a separate Design Tokens screenshot for each of the nine Docs pages.
- Every view measured `documentElement.clientWidth = 1620` and `scrollWidth = 1620` in the preview frame. No page overflow was found.
- Both Docs tables have plain text cells: zero heading elements inside cells in all nine pages.
- Screenshots are in [design/verify/text-hierarchy/fields](verify/text-hierarchy/fields/). Each component uses `<slug>-docs.png`, `<slug>-docs-tokens.png`, and/or `<slug>-gallery.png` as shown below.
- Raw per-view measurements, table text and computed typography are in [field-docs-gallery-observations.json](verify/text-hierarchy/field-docs-gallery-observations.json).
- The palette is the user's October 2 refinement: primary `#484848`, secondary `#5E5E5E`, muted and placeholder `#707070`. Recorded dimensions and status colors remain the comparison baseline; no Figma reread was needed.

## Missing Docs completed

Table counts include their header rows. The first table describes v1/v2 changes; the second contains design tokens.

| Component | Screenshot slug | Table rows | Actual Docs hierarchy |
| --- | --- | --- | --- |
| Input | `input` | 9 / 13 | Title 32px/600 primary; body 14px/400 secondary; plain comparison and token cells |
| Textarea | `textarea` | 8 / 14 | Same Docs hierarchy; size, helper and state treatment recorded |
| Select | `select` | 8 / 14 | Same Docs hierarchy; recorded placeholder `#707070`; rendered mismatch reported below |
| SelectField | `select-field` | 8 / 14 | Same Docs hierarchy; label/value/helper roles recorded |
| Phone Input | `phone-input` | 9 / 15 | Same Docs hierarchy; country-code and numeric-field treatment recorded |
| MultiSelect | `multi-select` | 8 / 14 | Same Docs hierarchy; chips, trigger and portal behavior recorded |
| CreatableSelect | `creatable-select` | 9 / 14 | Same Docs hierarchy; creation guards and controlled value documented |
| CreatableMultiSelect | `creatable-multi-select` | 10 / 14 | Same Docs hierarchy; selected chips and controlled array documented |
| DateRangePicker | `date-range-picker` | 8 / 14 | Same Docs hierarchy; trigger treatment recorded and remaining calendar-value limits stated |

The Docs shell retains its prominent 32px/600 page title and syntax highlighting. Storybook's own Controls inputs and Copy buttons are framework UI; their computed styles are not component-value evidence.

## AllVariants galleries completed

| Component | Screenshot slug | Rendered findings |
| --- | --- | --- |
| Input | `input` | Default/error labels 14px/500 primary; input values 16px/400 secondary; native placeholders muted; error text 12px/400 `#B42318` |
| Textarea | `textarea` | Labels 14px/500 primary; textarea 14px/400 secondary; native placeholders muted; supporting/error text 12px/400 |
| Select | `select` | Labels 14px/500 primary; empty trigger text was 16px/400 secondary, a concrete placeholder defect |
| SelectField | `select-field` | Labels 14px/500 primary; same inherited placeholder defect; helper muted and validation red |
| Phone Input | `phone-input` | Labels 14px/500 primary; country code and input value 16px/400 secondary; native placeholder muted |
| MultiSelect | `multi-select` | Labels 14px/500 primary; the actual placeholder span 16px/400 muted; helper 12px/400 muted |
| CreatableSelect | `creatable-select` | Gallery title 16px/500 primary; labels 14px/500 primary; placeholder span 16px/400 muted; helper 12px/400 muted/error |
| CreatableMultiSelect | `creatable-multi-select` | Same title/label/placeholder/helper hierarchy as CreatableSelect; default/error cards contained |
| DateRangePicker | `date-range-picker` | Gallery title 16px/500 primary; period labels 14px/500 primary; selected range 16px/400 secondary; helper 12px/400 muted/error |
| TextField | `text-field` | Default/empty/error treatments; labels 14px/500 primary; input 16px/400 secondary with muted native placeholder; helper 12px/400 muted/error |
| DateTimePicker | `date-time-picker` | Date-time/date-only/time-only gallery; labels 14px/500 primary, values 16px/400 secondary, helpers 12px/400 muted |
| OtpInput | `otp-input` | Default/error/disabled gallery; section titles 16px/500 primary; digits 16px/400 secondary; helpers 12px/400 muted/error |
| NumberStepField | `number-step-field` | Hours/minutes gallery; titles 16px/500 primary; numeric values 16px/400 secondary; unit labels 14px/400 muted |

Status borders, disabled surfaces, spacing and existing layouts remain visible. No additional concrete neutral-color or font-weight mismatch was found in these views.

## Select placeholder defect

The initial Select gallery rendered “Select a method” in `#5E5E5E` rather than the recorded `#707070`. SelectField inherited the same issue. The observed Radix DOM puts `data-placeholder=""` on the trigger, while the inner value span has neither that attribute nor a class. The value wrapper's self `data-placeholder` selector therefore did not affect the rendered text. The trigger/span measurements are retained in [select-placeholder-before.json](verify/text-hierarchy/select-placeholder-before.json).

This was reported to the parent immediately. The field agent owns the trigger-selector repair and the empty-versus-selected Select/SelectField browser recheck. The initial `select-gallery.png` and `select-field-gallery.png` are retained as before evidence. This supplement will record independent recheck evidence if that repaired build becomes available during this pass.

## Change boundary

This review changed only this report and its browser evidence files. It did not change component/source/story files, rerun broad tests, reopen Figma, restart Storybook, build, commit, push or publish.
