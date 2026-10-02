# V2 motion

Small, quiet, purposeful. Motion confirms an action or explains where something came from; it never decorates and never makes anyone wait. This is the spec for the v2 micro-interactions and the rules a component must follow to add its own.

Benchmarks read before deciding: shadcn/ui (Radix + `tailwindcss-animate`), HeroUI, Mantine, Radix Themes. Common ground: enter/exit keyframes on overlays that grow out of their trigger, a press scale on buttons (HeroUI `0.97`), a sliding switch thumb, an accordion chevron in step with the height, reduced motion honoured. Radix Themes and Mantine are the restraint reference: no motion on plain content.

## Tokens

| Purpose | Value | Notes |
| --- | --- | --- |
| Hover / press / colour | `transition-*` explicit property list, 150ms, `ease-out` | Never `transition-all` |
| Toggles, expand/collapse | 200ms, `ease-out` | Switch thumb + track, accordion height + chevron |
| Overlay enter | 150ms (dialog 200ms) | `fade-in-0 zoom-in-95` + `slide-in-from-<opposite side>-2` |
| Overlay exit | 100-150ms | Exits are quicker than enters |
| Press scale | Button `0.98`, icon-only `0.95`, step arrows `0.90`, tag remove `0.90` | Link variant: none |
| Hover scale | Tag remove `1.10` | Only on a lone icon target |

## What moves

| Component | Interaction |
| --- | --- |
| Button (and Pagination links, built on it) | Press scale (0.98; icon sizes 0.95; link none). Spinner keeps turning under reduced motion, slower |
| Switch | Thumb glides, track colour fades, both 200ms |
| Checkbox | Tick (or dash) pops in/out: fade + zoom 50 -> 100 |
| Radio | Dot grows from the centre (`background-size` 0 -> 100%, as a gradient cannot be tweened) |
| Tabs | Panel eases in on switch; underline colour fades |
| Accordion | Height + content opacity, chevron rotates in step, 200ms |
| Dialog / Form / Confirmation / Delete modals | Overlay fade, content fade + zoom + 2% slide, 200ms in / 150ms out |
| Dropdown menu (and submenus), Select, Tooltip | Grow out of the trigger (`transform-origin` from Radix) with a side-aware slide. Menu and select exit in 100ms; tooltip keeps the 150ms default |
| Multi-select, Search filter, Date range, Date-time (calendar + both lists) | Fade + zoom from top-left, 150ms |
| Text field, Textarea, Select field, Phone input, Multi-select, Date-time | Validation message fades in with a 4px drop |
| Readable field | Copy confirmation: the check icon pops in; the reveal toggle now fades |
| File upload | Drop zone scales to 1.01 while dragging; added files ease in |
| Number step, Tag remove, Scrollbar steppers, Breadcrumb, clear icons | Colour / press transitions that were missing |
| Toast | Existing slide in/out, now motion-safe |

Deliberately NOT animated: menu and listbox item highlight (instant, so keyboard navigation never lags), avatars and images (no popular library fades them in), stepper (static marks), anything that is only text.

## Reduced motion

Policy: remove **movement**, keep **cross-fades and colour**. Keyframes are written `motion-safe:animate-in` / `motion-safe:animate-out`, so with `prefers-reduced-motion: reduce` they never exist and Radix unmounts immediately. Transforms add `motion-reduce:active:scale-100`. Spinners are the exception: they slow to 2s per turn rather than stop, because a frozen arc reads as broken and is the only "busy" signal.

## Rules for adding motion (each one cost a debugging round)

1. **Exit animations need keyframes, not transitions.** Radix `Presence` waits for `animationend`; a transition does not delay unmount.
2. **Gate keyframes with `motion-safe:`**, never `motion-reduce:animate-none`. `data-[state=open]:animate-in` has higher specificity than a bare `motion-reduce:animate-none`, which silently loses.
3. **Never use `duration-*` to time an animation on an element that has no `transition-*`.** Tailwind's `duration-*` also writes `transition-duration`; with no `transition-property` the CSS default is `all`, so every later change (a floating panel's `left` / `top` / `visibility`) transitions and the panel flies in from the corner. Keep the 150ms default, or use `[animation-duration:Nms]`.
4. **Positioned panels (floating-ui) must use `transform: false`** before they get a zoom/slide keyframe. The `enter` keyframe writes `transform`, which would fight `translate(x, y)` positioning. The date pickers already did; multi-select and search-filter now do.
5. **Animate `transform` and `opacity`**; list `transition-[...]` properties explicitly.
6. **Class changes only.** The DOM stays identical to v1 (`button.test.tsx` pins loading markup to v1). A wrapper element for a nicer spinner fade was tried and reverted for that reason.
7. **Declare `tailwindcss-animate`** in `packages/cli/components.yaml` for any component that uses `animate-in/out`. The CLI build validator enforces it; without the plugin a consumer's animations silently do nothing.

## Verify

```bash
node design/verify/motion-probe.mjs                  # against the running Storybook (:6008)
node design/verify/motion-probe.mjs --static storybook-static
node design/verify/motion-probe.mjs --only dialog,switch
```

Drives real mouse and keyboard input in headless Chrome, records every CSS animation and transition (`document.getAnimations()`, every frame), and asserts the expected ones appear with the right duration, that overlays grow from their trigger rather than the centre, that positioned panels never animate their position, and that with `prefers-reduced-motion: reduce` emulated none of the movement exists. Mutation-checked: re-adding `duration-150` to a floating panel makes it fail.

Not covered by the probe (judge by eye): timing feel, easing curves, and the file-upload drag state (needs a real drag).

## Considered and left out

- **Sliding tab underline / switch press-stretch / avatar and image fade-in**: need JS measurement or load state for a small gain; none of the benchmark libraries ship them.
- **Spinner fade-in on `Button loading`**: needs a wrapper element and breaks the v1 markup parity test.
- **Option-row hover transitions**: would make keyboard navigation feel laggy.
