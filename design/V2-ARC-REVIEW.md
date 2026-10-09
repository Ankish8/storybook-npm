# Existing v2 Arc review — 2026-10-07

All 58 existing components were reviewed. 40 are updated and 18 retained after review. No installable components were added. The comparison page is `http://localhost:6009/v2-review.html`.

The before examples use immutable source/story snapshots captured at the start of this pass; the after examples import the canonical current stories. Both are interactive. Search/category/changed filters, shared example selection, common Controls and reset support review on one page.

## Results

| Component | Result | Changes |
|---|---|---|
| Accordion | Updated | Added enabled-row Arrow Up/Down and Home/End focus navigation. Linked each trigger to its labelled panel and made collapsed content inert. Reveal content travels 6px with the existing measured height transition; reduced motion removes travel. Consumer click and key handlers can prevent the default toggle/navigation. |
| Action Button | Reviewed / retained | Reviewed Arc asynchronous action feedback, width morphing, success/reset and reduced-motion behavior. Retained the promise-driven pending/success sequence, error callback and animated label from the recent implementation. |
| Alert | Updated | Dismissal now collapses height and padding with a damped spring instead of unmounting instantly. Tone icon fades and scales subtly; reduced motion uses a short fade. Body text is left aligned instead of justified; close button has subtle press feedback. |
| Avatar | Updated | Presence dots spring into and out of place, with instant positioning under reduced motion. Existing dimensions, photo rendering and failed-photo fallback retained. |
| Badge | Updated | String and number labels rise and fade when changed; arbitrary React children and asChild remain supported. Leading and trailing status icons are decorative and fixed in the inline layout. |
| Bouncing Loader | Reviewed / retained | Reviewed against the related Arc Chat Thread typing pattern. Existing restrained three-dot wave, sizing API and reduced-motion stop already fit; retained. |
| Breadcrumbs | Updated | Only newly appended crumbs enter with an 8px slide and fade; existing path stays still. Reduced motion keeps path changes immediate; animations cancel on a new path update. |
| Button | Reviewed / retained | Reviewed Arc hover, pressed, disabled, loading and label/icon motion against the recently rebuilt Button. Retained the primary/default compatibility alias, quiet ghost/link styles, stable icon centering and focus-preserving loading behavior. |
| Button Group | Reviewed / retained | Reviewed Arc joined surfaces, shared highlight, content press, label confirmation and attached menu. Retained the just-completed redesign and existing value-based selection compatibility. |
| Checkbox | Updated | Keep the checkbox shell stationary when selection changes; draw the check or mixed dash inside it in 160ms. Read mixed state from Radix data-state so defaultChecked="indeterminate" renders the correct dash as well as controlled mixed state. Use normalized SVG path lengths and disable stroke travel under reduced motion. |
| Confirmation Modal | Updated | Cancel now closes uncontrolled dialogs through the existing DialogClose primitive and restores trigger focus. Kept the current compact layout, spring entrance and primary action styling. |
| Contact List Item | Updated | Replaced strong sticky hover tint with subtle hover-capable surface and press feedback. Subtitle truncates within the list width; selection is exposed through aria-pressed. Host keyboard handlers compose with Enter/Space activation and can prevent it. Arc reference is related, not a standalone Contact List Item. |
| Creatable Multi Select | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. Animate newly mounted selected chips with the same brief fade and 90%-to-full scale as MultiSelect. |
| Creatable Select | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. Draw selected menu checks instead of scaling the entire glyph; disable stroke travel under reduced motion. |
| Date Divider | Reviewed / retained | Reviewed the related Arc Chat Thread day separators. Existing quiet date label and flexible rule spacing are suitable; retained. |
| Date Range Picker | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| Date Time Picker | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| Delete Confirmation Modal | Updated | Cancel now closes uncontrolled delete dialogs and resets typed confirmation on close. Kept explicit typed confirmation, error palette and existing dialog entrance. |
| Dialog | Reviewed / retained | Retained existing 4px rise, 0.98 scale spring entrance and shorter exit. Retained reduced-motion fade, Radix focus trap/return, sticky header/footer and viewport height cap. |
| Dropdown Menu | Reviewed / retained | Retained existing trigger-origin grow/fade, short close, collision constraints and immediate keyboard highlight. Direct Arc menu page/registry could not be fetched; menu comparison remains unverified. |
| Empty State | Updated | Copy is constrained to a readable 400px measure. Titles use medium weight; description leading is balanced. Action row wraps and remains centered on narrow previews. |
| File Upload | Updated | Lift the upload icon gently during an accepted drag, keeping invalid and disabled drops stationary. Apply hover fill only on enabled controls on hover-capable devices. |
| Form Modal | Reviewed / retained | Retained shared Dialog entrance/exit and the current responsive scrollable form layout. Existing loading state, editable stories and save/cancel APIs remain compatible. |
| Image Media | Updated | Attachments render as a block with object-contain, so height limits no longer crop the source image. Container and image remain bounded by available width. Arc Chat Thread is a related attachment reference. |
| Input | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| Multi Select | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| Number Step Field | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| OTP Input | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| Page Footer | Reviewed / retained | No direct Arc page-footer component in the published component index. Retained the compact responsive footer and existing action layout. |
| Page Header | Reviewed / retained | No direct Arc page-header component in the published component index. Retained existing responsive action overflow, title hierarchy and compatible back behavior. |
| Pagination | Updated | Disabled previous/next links now leave the tab order and prevent keyboard/programmatic activation. Retained current page styling, tabular numerals and subtle press feedback. |
| Panel | Updated | Closing returns focus to the opener when the panel still owns focus. Closed controls are inert while the width/opacity exit finishes. Escape can be handled by the consumer before closing; nested scroll stays contained. Retained the existing side-panel width animation and nonmodal layout. |
| Phone Input | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| Progress Indicator | Updated | One damped spring drives both fill and displayed count for bars, circles and semicircles. Removed separate CSS interpolation so visible fill and percentage agree. Accessible numeric progress and percentage update immediately; reduced motion snaps directly to the new value. |
| Radio | Reviewed / retained | Retain the existing center-growing selection dot, spring press response, card selection surface and reduced-motion fallback. |
| Readable Field | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| Reply Quote | Updated | Passive quotes no longer claim pointer or hover interactivity. Clickable replies use a soft press tint with a brief color transition and existing keyboard focus treatment. Arc Chat Thread is a related reference. |
| Scrollbar | Updated | Dragging keeps the grabbed point within the thumb instead of jumping to its centre. Thumb hover uses a subtle token-based colour fade. Measurement gracefully handles environments without ResizeObserver; native keyboard scrolling stays intact. |
| Search Filter | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| Select | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. Draw selected menu checks instead of scaling the entire glyph; disable stroke travel under reduced motion. |
| Select Field | Updated | Inherit the primary border focus and drawn selected checks from the shared Select primitive. |
| Shimmering Text | Updated | Replaced the white sweep with a readable charcoal band over a muted base. Calmer linear 2.4-second sweep and aria-busy reflecting active state; reduced-motion fallback retained. |
| Skeleton | Updated | Pulse supports a per-placeholder stagger delay via --v2-skeleton-delay. Usage shows a restrained 60ms/120ms text wave; shape, size and animation APIs retained. |
| Spinner | Reviewed / retained | Arc has no standalone Spinner in its reviewed component index. Existing track and arc, balanced stroke widths and slower reduced-motion spin retained. |
| Split Button | Reviewed / retained | Reviewed Arc separate main/menu actions, chevron feedback and menu-origin animation. Retained independent callbacks, stable menu anchor, removed selector outline and preallocated preview space. |
| Stepper | Updated | Completed connectors fill through a short transform transition in both orientations. Completed markers use the primary fill; current marker has a distinct neutral surface and ring. Colours settle smoothly and reduced motion removes transitions; numbered/icon modes remain supported. |
| Switch | Reviewed / retained | Retain the existing spring-eased thumb travel, enabled press feedback and reduced-motion fallback. |
| System Message | Reviewed / retained | Reviewed against the related Arc Timeline / Chat Thread secondary metadata. Existing centered muted event text and selective medium emphasis are suitable; retained. |
| Table | Updated | Keyed rows spring to their new positions when consumers reorder them. Reduced motion disables row movement. Existing sorting arrows, table semantics, sticky headers and restrained hover are retained. |
| Tabs | Reviewed / retained | Retained the scoped critically damped moving selection rail/pill, including rapid retargets and reduced motion. Retained Radix immediate selection/focus and brief panel fade without overlapping outgoing content. |
| Tag | Reviewed / retained | Reviewed Arc Badge as the closest status-label reference. Existing semantic surfaces, compact size axes and dismiss hover/press feedback already fit; retained. |
| Text Field | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| Textarea | Updated | Replace the teal outer focus glow with primary border emphasis and no glow. |
| Toast | Updated | Action and dismiss controls now have restrained press feedback and hover fades. Dismiss outline appears for keyboard focus; pointer clicks no longer leave a focus ring. Retained Radix swipe, timeout/hover behavior, queue and reduced-motion toast fade. |
| Tooltip | Reviewed / retained | Retained anchored grow/fade, instant keyboard/skip-delay opening and plain reduced-motion fade. Retained touch support and text wrapping rather than removing existing supported behavior. |
| Typography | Updated | Corrected ordinary label weights from semibold to medium across all three sizes, matching the established subtle hierarchy. No standalone Arc Typography component exists; headline emphasis and primary/secondary/muted roles retained. |
| UI Card | Updated | Interactive cards have subtle 0.99 press scale and a damped easing curve. Reduced motion keeps color feedback and removes press movement. Dimensions, rounded corners and selection palette retained. |
| Unread Separator | Reviewed / retained | Reviewed against the related Arc Chat Thread unread notification pattern. Existing quiet divider and count grammar retained; no new floating notification widget introduced. |

## Verification

- All 1,753 v2 tests pass across 62 suites.
- All 19 docs preview tests, all four comparison/snapshot protocol tests, and all 60 CLI v2 source/dependency tests pass.
- Current component/story, preview and Next TypeScript checks pass. Family lint/format and compiled class audits pass; Bootstrap margin and compiled Button CSS checks pass.
- All 45 legacy v1 primitives remain byte-identical.
- Full docs/preview and canonical Storybook builds pass; comparison preview source maps contain all 117 frozen and all 117 current files.

## Limits

Localhost browser access remains blocked by browser policy. No alternate browser or transport workaround was used. Real-browser visual sign-off and animation feel remain unverified. Some direct Arc counterparts do not exist or public reference endpoints were unavailable; each family manifest records those cases. These are review notes, not a claim of exact parity with Arc for every custom component.

All changes remain local. No commits, pushes, publication, product sync or Figma edits.

## Live-reference follow-up

The first pass was documentation/source comparison, not manual rendered parity. A follow-up now exercises live Arc reference examples; family manifests record exact actions and remaining differences. See `design/arc-review/live-reference-check.md`. The review UI shows the 40 changed components only, exposes focus-state differences immediately, chooses change-relevant examples, and supplies synchronized Replay controls. Remaining Arc-specific behaviors are recorded honestly rather than presented as complete parity. Local rendered comparison is still unverified.
