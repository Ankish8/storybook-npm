# V2 motion polish: controls and layouts

Date: 2026-10-03. Branch: `codex/v2-motion-polish`. Source and stories remain local; no commits, pushes or publishing.

## Changes and browser checks

Reviewed the actual Storybook at `http://localhost:6008` through the Browser skill in one fresh Chrome tab. For every component below, opened Docs, Overview, its variants/compositions view, States and Usage. Also opened Panel All sizes. Waited for rendered story content and the Docs install command; early loading screenshots were not counted. Checked the displayed type hierarchy, local comparison containment and actual interactions. Screenshots and route log are in `/tmp/v2-motion-controls/`.

| Component | Polish | Actual interaction evidence |
| --- | --- | --- |
| Switch | Track and thumb use the shared 240 ms spring. | Toggled Overview and Usage both ways. Reduced thumb transition property is `none`; value changes immediately. |
| Checkbox | Checked and indeterminate indicators enter from scale 0.85 at 180 ms, with restrained colour transitions. | Selected/deselected Product feedback in Usage. Computed indicator duration 180 ms. Reduced indicator animation is `none`. |
| Radio | Dot size and colours settle with a 240 ms spring. | Changed Daily to Monthly in Usage; exactly one radio remains checked. Reduced transition properties exclude background-size and retain colours. |
| Accordion | Height, opacity and chevron share 240 ms. ResizeObserver retargets expanded height when nested content changes. | Closed/opened Basic information and toggled Custom fields repeatedly. Actual content height/property/duration verified. Reduced content uses opacity-only 150 ms; chevron snaps. |
| Panel | Explicit width/opacity transitions at 260 ms replace transition-all; closed content fades. All sizes now uses responsive cards with contained local scrolling. | Opened/closed repeatedly and through its close button. Reduced transition is opacity-only 150 ms. Browser widths verified as 280/320/400 px. After the story repair, workspace widths are 468/428/348 px and root width/scrollWidth are both 1588 px. |
| ProgressIndicator | Linear width and circle/semicircle stroke-dashoffset use 240 ms. | Changed circle and semicircle values using the live variant Control and Import next batch/Reset. Both stroke transitions are 240 ms; reduced transition is `none`. |
| Scrollbar | Step scrolling honours reduced motion; native thumb stays immediate. | Used forward/back arrows, observed 200 px movement, loaded more rows. Reduced arrow scroll reaches its target immediately. |
| ReadableField | Copy/reveal presses scale only to 0.96; copied check enters at 180 ms. | Copied, revealed/hidden and regenerated Usage values. Verified actual 180 ms shared spring after correcting specificity. Reduced copied check has no animation. Replaced the single-example States story with four contained interactive cards and reviewed it; root width and scrollWidth both 1588 px. |
| FileUpload | Drag scale stays restrained at 1.01; inserted rows move only 2 px at 180 ms. | Loaded sample file in Usage; actual inserted row duration 180 ms and shared spring confirmed. Selected/error/disabled views inspected. Real OS file drag is not claimed. |
| TextField | Validation moves 2 px and fades for 150 ms; reduced spinner continues at 2 s. | Cleared required workspace name, saved to show validation, entered valid text and saved. Actual validation animation `enter`/150 ms/ease-out. Loading Control plus reduced preference produced a 2 s spinner. |
| Textarea | Validation entry is 2 px/150 ms. | Submitted empty note, typed a valid note and saved, then repeated under reduced motion. Error duration 150 ms; reduced animation `none`. |
| Phone Input | Validation entry is 2 px/150 ms; typing stays immediate. | Submitted empty number, observed 150 ms error, entered a valid 10-digit fixture, saved and cleared. Country selector uses the existing host-owned behaviour. |
| NumberStepField | Reduced press depth from 0.90 to 0.96, 80 ms down/180 ms return. | Increased/decreased to the zero boundary and confirmed live value synchronization. Normal return duration 180 ms. Press scaling is motion-safe only. |
| OtpInput | Explicit colour/border/shadow transitions, no motion applied to digits or focus advance. | Entered all four digits using real keypresses, verified the code and requested a fresh code. Typing and local completion are immediate. Per-digit synthetic fill was unreliable; a follow-up checked fresh Overview and Usage with one CUA type call for the complete fixture, and native keyboard paste. All four displayed digits and value Controls synchronized; Usage verification succeeded. |

## Concrete corrections found by rendered checks

`tailwindcss-animate` registers arbitrary `duration-*` and `ease-*` utilities alongside Tailwind's core utilities. Ambiguous arbitrary utility names were dropped from generated CSS. These components now use exact transition/animation CSS properties. Radix state and `motion-safe:animate-in` specificity also overrode unqualified animation durations: state-qualified Checkbox durations and motion-safe copy/file row durations fix the actual rendered values, not just the source text.

The TextField observation harness initially missed validation startup. Manual empty-submit in Usage confirms the real 150 ms validation animation; no speculative source change was made.

## Scoped gates

- 268 tests across the 14 owned component test files passed, including new Accordion nested-resize/cleanup and reduced-scroll tests. This scoped run preceded the final class specificity corrections; the parent task runs the final global gates.
- ESLint passes for the 14 owned components plus the edited ReadableField and Panel stories after the final corrections. One dependency freshness notice from baseline-browser-mapping is unrelated to these changes.
- Formatting and `git diff --check` pass for the owned edits.
- Public component APIs and component DOM structure are preserved. v1 files were not edited.

## Review limits

These screenshots are viewport evidence, not a pixel-by-pixel review of every row of every long gallery or a timing feel approval by the user. The final global build, consumer and full test results belong to the parent task.

The cramped Panel All sizes gallery was repaired and re-reviewed in the browser; its three panel widths and component structure are unchanged. Real file dragging, clipboard failure handling and physical reduced-motion preference switching were not exercised; reduced motion here uses browser media emulation.

Static surfaces, avatars, images, text, separators, plain badge/status content and empty-state bodies should remain still. Navigation highlights and native input/focus feedback should stay immediate. New movement is limited to a control's state, inserted feedback, measured progress or an expanding layout.

Owned component source plus ReadableField story freeze fingerprint (SHA-256 of each relative path, NUL, file bytes, NUL in the component order above, then ReadableField story): `aeb01593bfbc8c618b530062e2aa8b413f9516902a7e818d625687fe018d6cdc`.

Panel story received a separately authorized gallery-only change after that component freeze; the parent task was notified to include it in the final static build.

## Focused OTP follow-up

The earlier fill concern did not reproduce as a genuine entry problem. On a fresh Usage load, focused the first digit and used one `cua.type({text: "1234"})` call. Waited for the `value 1234` Controls row, checked the four rendered digits, and used Verify code; the local status confirmed submission. Repeated the same complete-entry call after a fresh Overview load; all four displayed digits and Controls matched.

For paste, copied the public `1234` fixture from the value Control with Meta+A / Meta+C, used Request new code, focused the first digit and used Meta+V. Controls synchronized to the complete fixture and Verify code submitted successfully. Repeated native paste after another fresh Usage load and saved its settled screenshot. Evidence: `/tmp/v2-motion-controls/OtpInput-rapid-overview.png` and `/tmp/v2-motion-controls/OtpInput-native-paste-usage.png`.

The Browser masks the first OTP field in DOM value reads; raw returned input-value lengths are therefore unsuitable for this check. Settled screenshots, the value Control and the working local completion action establish the result. The earlier sequential per-cell fill also invokes field clearing/replacement rather than the tested user entry flow. No OTP component or story changes were made for this follow-up; the source freeze fingerprint is unchanged.
