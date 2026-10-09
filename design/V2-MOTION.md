# V2 motion

Small, quiet, purposeful. Motion confirms an action or explains where something came from; it never decorates and never makes anyone wait. This is the spec for the v2 micro-interactions and the rules a component must follow to add its own.

Benchmarks read before deciding: shadcn/ui (Radix + `tailwindcss-animate`), HeroUI, Mantine, Radix Themes. Common ground: enter/exit keyframes on overlays that grow out of their trigger, a press scale on buttons (HeroUI `0.97`), a sliding switch thumb, an accordion chevron in step with the height, reduced motion honoured. Radix Themes and Mantine are the restraint reference: no motion on plain content.

## Spring refinement, 2026-10-03

The user requested a more responsive, Apple-inspired feel across every v2 component. The moving tab rail was missing; it is now measured without adding DOM nodes. The earlier 6040 preview was a frozen build from before the motion branch. Current development preview: `http://localhost:6008`.

### Research and translation

- [Apple WWDC23: Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/) recommends springs without bounce by default and preserving position and velocity when an animation is interrupted. [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/motion) emphasizes purposeful, brief, optional motion.
- [Adobe Spectrum Tabs](https://spectrum.adobe.com/web/swc/components/tabs) explicitly slides its selection indicator. [HeroUI's current Tabs CSS](https://github.com/heroui-inc/heroui/blob/v3/packages/styles/components/tabs.css) transitions indicator position and dimensions, with reduced-motion overrides. [Mantine FloatingIndicator](https://mantine.dev/core/floating-indicator/) measures the selected target.
- [Radix animation guidance](https://www.radix-ui.com/primitives/docs/guides/animation) explains why CSS exit keyframes can keep content mounted until animation completes. [Motion's CSS guide](https://motion.dev/docs/css) describes sampled springs using CSS `linear()`; these approximate a fixed response, unlike a velocity-preserving runtime spring.
- [Fluent timing guidance](https://learn.microsoft.com/en-us/windows/apps/design/motion/timing-and-easing) and [Material motion tokens](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss) support short feedback and slightly longer spatial changes.

The values below are our web translation, not Apple's published constants. No runtime animation dependency was added. Fixed movements use a monotonic sampled critically damped curve, with `cubic-bezier(0.22,1,0.36,1)` as the older-browser/standalone fallback. Shared values live in `src/index.css` and the CLI consumer theme. Only the tab rail uses an actual runtime spring, with mass 1, stiffness 900 and damping 60, integrated exactly and retargeted with its current velocity.

## Tokens

| Purpose | Value | Notes |
| --- | --- | --- |
| Colour feedback | 150ms, ease-out | Explicit properties; option highlights remain instant |
| Button press / return | 120ms down / 220ms return | Scale 0.97, compact 0.96, wide 0.985; links, popup anchors and busy actions stay still |
| Small action press / return | 80ms down / 180–200ms return | Scale no lower than 0.96; tag hover 1.03 |
| Toggle / accordion | 240ms, sampled spring | Shared settling curve; no overshoot |
| Panel | 260ms, width/opacity only | Reduced motion snaps width and retains a fade |
| Overlay enter / exit | 200ms / 120ms | Scale 0.98, movement at most 4px |
| Dialog enter / exit | 220ms / 160ms | Centered positioning stays fixed |
| Tooltip enter / exit | 160ms / 100ms | Short, origin-aware feedback |
| Tabs rail | Velocity-preserving critically damped spring | First render, resize, font load and reduced motion snap |
| Progress | 240ms | Width or stroke-dashoffset, no overshoot |

## What moves

| Component | Interaction |
| --- | --- |
| Button (and Pagination links, built on it) | Press scale (0.97; icon sizes 0.96; link/popup anchors none), fast compression and softer return. Changing content rises through a soft blur (240ms in / 160ms out) and its width settles on a critically damped spring. Reduced motion uses 120ms fades. Default loading overlays a centered spinner without changing label width. Loading retains focus and blocks activation. Spinner keeps turning under reduced motion, slower |
| Button Group | One measured highlight springs between actions; surrounding dividers fade, pressed content dips in place, reserved labels crossfade and other labels animate width. Optional menu uses the shared Dropdown motion. Reduced motion keeps fades and removes spatial movement |
| Switch | Thumb glides, track colour fades, both 240ms |
| Checkbox | Tick (or dash) pops in/out: fade + zoom 85 -> 100, 180ms |
| Radio | Dot grows from the centre (`background-size` 0 -> 100%, as a gradient cannot be tweened) |
| Tabs | Shared horizontal underline / vertical rail glides between measured targets; panel fades. Keyboard and controlled selection update immediately |
| Accordion | Height + content opacity, chevron rotates in step, 240ms; content size is observed so async content does not clip |
| Dialog / Form / Confirmation / Delete modals | Backdrop fade and panel fade + 98% scale + 4px movement, 220ms in / 160ms out |
| Dropdown menu (and submenus), Select, Tooltip | Grow out of the trigger (`transform-origin` from Radix) with a side-aware slide. Menu/select 200ms in / 120ms out; tooltip 160ms / 100ms |
| Multi-select, Search filter, Date range, Date-time (calendar + both lists) | Fade + 98% scale from top-left, 200ms; custom panels still close immediately |
| Text field, Textarea, Select field, Phone input, Multi-select, Date-time | Validation message fades in with a 2px movement |
| Readable field | Copy confirmation: the check icon pops in; the reveal toggle now fades |
| File upload | Drop zone scales to 1.01 while dragging; added files ease in |
| Number step, Tag remove, Scrollbar steppers, Breadcrumb, clear icons | Colour / press transitions that were missing |
| Toast | Explicit transform/opacity transitions; swipe follows the pointer directly |
| Panel | 260ms width/opacity changes, including interrupted open/close |
| Progress indicator | Bar width and circular stroke-dashoffset settle consistently |
| Scrollbar | Drag stays direct; step scrolling snaps with reduced motion |

Deliberately NOT animated: menu and listbox item highlight (instant, so keyboard navigation never lags), avatars and images (keep static content stable), stepper (static marks), anything that is only text.

## Reduced motion

Policy: remove movement, retain short opacity and colour fades. Radix overlays use separate `v2-fade-in/out` opacity-only keyframes under reduced motion, avoiding accidental transform changes to centered or positioned panels. Tabs snap to their selected target, accordion/radio/switch/progress stop spatial transitions, and Scrollbar stops smooth scrolling. Spinners retain a slower two-second turn; skeleton, shimmer and typing loops keep their static reduced-motion alternatives.

## Rules for adding motion (each one cost a debugging round)

1. **Exit animations need keyframes, not transitions.** Radix `Presence` waits for `animationend`; a transition does not delay unmount.
2. **Gate keyframes with `motion-safe:`**, never `motion-reduce:animate-none`. `data-[state=open]:animate-in` has higher specificity than a bare `motion-reduce:animate-none`, which silently loses.
3. **Never use `duration-*` to time an animation on an element that has no `transition-*`.** Tailwind's `duration-*` also writes `transition-duration`; with no `transition-property` the CSS default is `all`, so every later change (a floating panel's `left` / `top` / `visibility`) transitions and the panel flies in from the corner. Keep the 150ms default, or use `[animation-duration:Nms]`.
4. **Positioned panels (floating-ui) must use `transform: false`** before they get a zoom/slide keyframe. The `enter` keyframe writes `transform`, which would fight `translate(x, y)` positioning. The date pickers already did; multi-select and search-filter now do.
5. **Animate `transform` and `opacity`**; list `transition-[...]` properties explicitly.
6. **Preserve v1 and public APIs.** The measured tab rail is a pseudo-element. The user-approved October 7 Button refinement adds internal content wrappers to v2 only, allowing label/spinner crossfades and width motion. Decorative outgoing content is inert and aria-hidden. Focusable loading uses aria-disabled; explicitly disabled actions remain natively disabled.
7. **Use explicit CSS timing properties.** `tailwindcss-animate` registers overlapping `ease-*` and `duration-*` utilities: arbitrary values can be ambiguous and silently omitted. Use `[transition-duration:240ms]`, `[transition-timing-function:var(...)]` and their animation equivalents. Verify emitted CSS.
8. **Declare `tailwindcss-animate`** in `packages/cli/components.yaml` for any component that uses `animate-in/out`. The CLI build validator enforces it; without the plugin a consumer's animations silently do nothing.

## Verify

```bash
node design/verify/motion-probe.mjs                  # against the running Storybook (:6008)
node design/verify/motion-probe.mjs --static storybook-static
node design/verify/motion-probe.mjs --only dialog,switch
```

Drives real mouse and keyboard input in headless Chrome, records every CSS animation and transition (`document.getAnimations()`, every frame), and asserts the expected ones appear with the right duration, that overlays grow from their trigger rather than the centre, that positioned panels never animate their position, and that with `prefers-reduced-motion: reduce` emulated none of the movement exists. Mutation-checked: re-adding `duration-150` to a floating panel makes it fail.

The original probe measures CSS motion; the refinement adds geometry and interruption tests for the runtime tab spring. Browser review records are saved in `design/review/motion-polish-*.md`. Feel remains a visual judgment. Verification scope and any remaining limits are recorded explicitly in the refinement report.

## Considered and left out

- **Switch press-stretch, avatar and image entrances**: they add distracting movement. The tab rail is now implemented, consistent with measured indicators in the references above.
- **Earlier Button spinner fade omission**: superseded by the user-approved October 7 content wrappers. The spinner now fades with the incoming content; v1 stays untouched.
- **Option-row hover transitions**: would make keyboard navigation feel laggy.

## Entry/exit utilities must be gated with `motion-safe:` too (2026-10-04)

`motion-safe:animate-in` (tailwindcss-animate) resets the `--tw-enter-*` variables, and `animate-out` resets `--tw-exit-*`. A plain
`fade-in-0`, `zoom-in-[0.98]`, `slide-in-from-top-1` or `[--tw-enter-translate-y:4px]` in the same class string has equal
specificity but is emitted earlier, so the reset wins. The animation still exists (`getAnimations()` lists it) but its
keyframes are identity: nothing fades, scales or slides. This was true of the dialog and the date-picker popovers until this
date; a motion probe that only counts animations cannot see it.

- Write `data-[state=open]:motion-safe:animate-in data-[state=open]:motion-safe:fade-in-0 data-[state=open]:motion-safe:zoom-in-[0.98]`:
  gate EVERY enter/exit value utility. An attribute variant with strictly more attribute selectors than the reset
  (`data-[side=bottom]:slide-in-from-top-1` next to a plain `motion-safe:animate-in`) out-ranks it and may stay as is.
- `motion-gating.test.ts` scans every v2 source and fails on the pattern; `design/verify/motion-movement-probe.mjs` samples real
  opacity/transform frames while overlays open and fails unless they ramp.
- Tailwind `important: true` (Storybook and the web panel) pins every `transform` utility over an animation's transform. A
  centred dialog therefore uses the CSS `translate` property (`[translate:-50%_-50%]`) so the 0.98 zoom and 4px slide can run.
- The Select panel carries a static `translate-y-1` offset, so only its fade runs (known, moving the offset into `sideOffset`
  is a layout change).
