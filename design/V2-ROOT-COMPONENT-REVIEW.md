# Root component review — 2026-10-01

Workspace: `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`. All changes remain local. Final frozen preview: `http://127.0.0.1:6040`.

The coordinator reviewed these seven components in the browser, in addition to the delegated per-component reviews. The development review used port 6008; the final build uses the documented verification copy. Recorded specs and captured Inspect values were used, rather than reopening already-covered Figma components.

## Browser review

| Component | Docs, variants and states | Controls and Usage |
| --- | --- | --- |
| ButtonGroup | Both Docs tables; pill/primary/toggle shapes; enabled/disabled samples; 48px pill and 180×50px two-item toggle, 32px actions, 8px padding/gap and 16px toggle radius. Start/end alignment changes actual item positions. | Overview click ↔ value Control, gallery presentation Controls and independent selections. Usage List click updates the value Control and its status; Calendar Control updates the selected button and status. |
| Breadcrumbs | Both Docs tables and three contained compositions; 14px Inter labels, 8px padding and 34px minimum link height; maxItems 3↔5 and hidden navigation. | Visible ancestor callbacks, overflow selection, local path navigation/restore. Repaired synthetic-event serialization in story action logs and overflow closing when consumers prevent native anchor navigation. Mouse and keyboard selection close and restore focus. See `V2-BREADCRUMBS-EVENT-REVIEW.md`. |
| Radio | Both Docs tables, labelled/unlabelled size examples and the recorded selection-state matrix. The browser rounds the authored 1.2px border to one physical pixel. | Overview direct selection ↔ checked Control; AllVariants label/checked Controls; Usage arrow-key selection and local save. Final synchronization evidence is in `V2-RADIO-CONTROL-REVIEW.md`. |
| OtpInput | Both Docs tables; four/six-cell variants and default/hover/focus/error/disabled states; 54×60px cells, radius8, padding20 and gap24. Focus remains teal when hovered. The final review found the pseudo addon losing styles on length remounts; the story now uses scoped descendant state styling, confirmed through 4→6→4 and value changes. | Direct typing advances focus and synchronizes value; reverse value Controls update cells. Verify, Request new code and value reset are real local interactions. Final detailed evidence is supplied by the table reviewer. |
| NumberStepField | Both Docs tables, hours/minutes variants, four states and the real v1/v2 comparison. Outer v2 height40, radius8 and Inter16/400. Actual focus plus hover keeps the teal border/glow. | Native typing and Increase synchronize value Controls. Step Control changes the increment, samples are independent, Usage Save reports the current value, reverse Control edits update the field. |
| ProgressIndicator | Both Docs tables; linear/circle/semicircle variants, label positions, start/partial/complete/indeterminate states. Final linear right-label container320×17, track8; circle54×54, semicircle54×27, SVG stroke5.13488. | Shape/position/value Controls render correctly. Usage advances 30→55→80→100, updates the value slider, disables at completion, and Reset restores both progress and Control to0. |
| FileUpload | Both Docs tables; single/multiple variants; empty/selected/error/disabled states. The current fallback recipe is dashed, radius12 and padding24, with clear 16/14/12px hierarchy. | Label/helper/accept/multiple/disabled Controls affect the examples. Load sample file creates a row, removal clears it, and Usage import updates the local status. The actual file chooser accepted a generated demo CSV, rendered its row and enabled Import; importing reported one file. Real drag-and-drop was tested in the component suite rather than manually exercised. |

Comparison and state grids were inspected for containment. Wider matrices scroll inside their story containers; the preview document remains contained. Both Docs tables for each reviewed component have readable values/swatches and zero heading elements inside table cells. Final root screenshots are in `design/review/root-final`; additional screenshots from the earlier review remain in `design/review` and the visualization evidence folder recorded by the story review.

## Fixes found during review

- ButtonGroup pill height corrected from50 to the recorded48; Usage selection now shares Storybook args.
- Breadcrumb actions now log serializable destination data. Overflow closes even if navigation is prevented, and its regression test verifies focus restoration.
- OTP focus border wins over hover, and its States story exposes all five interactions. Usage verification/reset shares Controls.
- NumberStepField outer height corrected from42 to40. Focus wins over hover and Usage typing shares Controls.
- Progress bottom track no longer shrinks; right-label container matches the recorded17px height. Usage progress shares Controls.
- The delegated static reviews found and repaired Skeleton explicit dimensions, Spinner inverted-copy contrast, Typography alignment/truncation and ReadableField dimensions/Usage synchronization. Their individual reports retain before/after evidence.

## Evidence boundaries

The captured Progress right-label root size is verified; its linear percentage leaf typography was not independently captured in Figma. The documented circular/semicircular percentage leaf uses the recorded12px/600/0.06px values. FileUpload inner geometry remains a v2 fallback because logged-in Figma became unavailable with WebGL/transport failures. Calendar internals, some Alert icon/EmptyState composition values and the DeleteConfirmation body-padding contradiction are also listed in `V2-COMPLETION.md`. These are not presented as fresh Figma verification.

The browser has generic addon/channel/extension warnings; individual action repairs were checked for new component-triggered failures. A zero-error browser console is not claimed.

## Final action-log sweep

The final Button click reproduced a real `Window.toJSON` serialization error. Story-only adapters now keep raw DOM events out of action spies across Button and its overridden renderers, Dropdown, Input focus/blur/change, Tag removal, ReadableField header actions, TextField/Textarea/PhoneInput typing, ReplyQuote/ContactListItem/ImageMedia clicks, PageHeader back navigation and Alert actions. Component APIs and real event plumbing remain unchanged. The named change spies log strings; click spies log zero arguments or serializable selection data.

Root verified Input typing→Control and Actions `["Workspace demo"]`, focus/blur `[]`, Tag removal→no Support tag and `onRemove: []`, and ReadableField header action→`headerAction.onClick: []`. Those paths had no console errors in the root review tab. The per-component agents verified their own remaining action paths and saved screenshots. See `V2-BUTTON-EVENT-REVIEW.md` and the amended field, card and navigation reports.

A generated CSV was selected through the actual FileUpload chooser in the production browser. It appeared as `demo-upload.csv`, enabled Import and produced the one-file local success status. No file was sent to a server.

## Final gallery containment correction

The last production check found 32px of page overflow in six-digit OTP States: the centered Storybook root expanded to the gallery width plus its two 16px padding edges. The gallery's own scroll wrapper was already correct. The v2-only `gallery()` helper now uses the padded canvas, so fixed-width galleries receive the available content width instead of expanding the flex root. Individual centered examples remain centered, and v1 stories are unaffected.

After the correction, OTP's viewport/document both measure 980px, while its 1,000px comparison grid scrolls inside a 948px wrapper. Six cells, the hover border and focus glow persist. The root also rechecked ten wide comparison/state views covering Badge, Tag, Input, Checkbox, Switch, ButtonGroup, Breadcrumbs, Radio, ProgressIndicator and FileUpload: all have viewport/document width 980px, and Input's wide state matrix scrolls locally. Evidence: `review/root-final/containment-final-root.json` and `otp-six-contained-gallery.png`.

## Final frozen production check

The final build at `/tmp/myoperator-v2-completion-preview-final` passed and is served at `http://127.0.0.1:6040`. Its component source/stories and preview helper match the real workspace exactly. On this build, Button's real click logs `onClick: []`; OTP length 4→6→4 retains its five displayed states, hover border and focus glow with viewport/document width 980/980; and ReadableField's corrected comparison also stays 980/980. The final v2 Introduction is left open in the browser. Evidence: `verify/final-production-browser-proof.json`, `review/root-final/final-otp-gallery.png`, `final-build-otp-six-states.png`, `final-build-readable-comparison.png` and `final-build-button-actions.png`.
