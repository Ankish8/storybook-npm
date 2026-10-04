# Dialog (+ ConfirmationModal, DeleteConfirmationModal, FormModal): UI change report for Figma

Figma source: [https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-11664](https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-11664)  
Storybook: `V2/Components/Dialog`  
Date: 2026-10-04

## Summary

A tall dialog no longer scrolls its title, close button and actions out of sight: the header and the footer stay pinned while the body scrolls, and the footer shows a divider (with 16px of breathing room above the buttons) only while content is hidden beneath it. Close buttons keep their 24px look but have a 32px hit area and a 16px icon. Short dialogs look exactly as before.

### Why (what the research found)

- Untitled UI, Mantine (Modal with scroll area) and HeroUI (ModalHeader/ModalFooter outside the scrolling body) keep the title and actions visible; shadcn's dialog scrolls everything and users lose the close button and primary action on long forms.
- Apple HIG and Material both ask for a minimum hit target of 44pt / 48dp; a 24px icon button is hard to hit. The visible size stays, the target grows to 32px (the largest that does not collide with the 24px header padding).
- Mantine and HeroUI only show the footer divider when content actually overflows, so short dialogs stay clean.

### API / compatibility

No prop, callback, aria-label or DOM-contract changes. v2 remains a drop-in for v1 (`npm run verify:v1-v2-compat` passes).

## Before and after

### Dialog, small

| Before | After |
| --- | --- |
| ![before](01-dialog-small.before.png) | ![after](01-dialog-small.after.png) |

### Dialog, default (short content)

| Before | After |
| --- | --- |
| ![before](02-dialog-default.before.png) | ![after](02-dialog-default.after.png) |

### Close button hover

| Before | After |
| --- | --- |
| ![before](03-dialog-close-hover.before.png) | ![after](03-dialog-close-hover.after.png) |

### Close button keyboard focus

| Before | After |
| --- | --- |
| ![before](04-dialog-close-focus.before.png) | ![after](04-dialog-close-focus.after.png) |

### Dialog at 360px

| Before | After |
| --- | --- |
| ![before](05-dialog-narrow-360.before.png) | ![after](05-dialog-narrow-360.after.png) |

### Long form, scrolled to top

| Before | After |
| --- | --- |
| ![before](06-long-form-scroll-top.before.png) | ![after](06-long-form-scroll-top.after.png) |

### Long form, scrolled 260px (header and footer pinned, footer divider)

| Before | After |
| --- | --- |
| ![before](07-long-form-scrolled.before.png) | ![after](07-long-form-scrolled.after.png) |

### Long form, scrolled to the end (footer divider gone)

| Before | After |
| --- | --- |
| ![before](08-long-form-scroll-end.before.png) | ![after](08-long-form-scroll-end.after.png) |

### FormModal in a 380px-high viewport, top

| Before | After |
| --- | --- |
| ![before](09-form-modal-short-viewport-top.before.png) | ![after](09-form-modal-short-viewport-top.after.png) |

### FormModal in a 380px-high viewport, scrolled

| Before | After |
| --- | --- |
| ![before](10-form-modal-short-viewport-scrolled.before.png) | ![after](10-form-modal-short-viewport-scrolled.after.png) |

### FormModal, content fits (identical to before)

| Before | After |
| --- | --- |
| ![before](11-form-modal-no-overflow.before.png) | ![after](11-form-modal-no-overflow.after.png) |

### ConfirmationModal

| Before | After |
| --- | --- |
| ![before](12-confirm-default.before.png) | ![after](12-confirm-default.after.png) |

### ConfirmationModal, destructive

| Before | After |
| --- | --- |
| ![before](13-confirm-destructive.before.png) | ![after](13-confirm-destructive.after.png) |

### ConfirmationModal close hover

| Before | After |
| --- | --- |
| ![before](14-confirm-close-hover.before.png) | ![after](14-confirm-close-hover.after.png) |

### DeleteConfirmationModal

| Before | After |
| --- | --- |
| ![before](15-delete-default.before.png) | ![after](15-delete-default.after.png) |

### DeleteConfirmationModal at 360px

| Before | After |
| --- | --- |
| ![before](16-delete-narrow-360.before.png) | ![after](16-delete-narrow-360.after.png) |

## Measured changes (copy these into Figma)

_Source: computed styles of the rendered component; px, hex colours, ms. Only properties that changed are listed._

### Dialog, small

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### Dialog, default (short content)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### Close button hover

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### Close button keyboard focus

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### Dialog at 360px

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### Long form, scrolled to top

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### Long form, scrolled 260px (header and footer pinned, footer divider)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### Long form, scrolled to the end (footer divider gone)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### FormModal in a 380px-high viewport, top

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### FormModal in a 380px-high viewport, scrolled

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### FormModal, content fits (identical to before)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Corner close button | position | absolute | **sticky** |
| Corner close button | right | 24px | **auto** |
| Corner close button | z-index | auto | **20** |
| Corner close icon | width | 12px | **16px** |
| Corner close icon | height | 12px | **16px** |

### ConfirmationModal

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Header close button | position | static | **relative** |
| Header close button | top | auto | **0px** |
| Header close button | right | auto | **0px** |
| Header close icon | width | 12px | **16px** |
| Header close icon | height | 12px | **16px** |

### ConfirmationModal, destructive

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Header close button | position | static | **relative** |
| Header close button | top | auto | **0px** |
| Header close button | right | auto | **0px** |
| Header close icon | width | 12px | **16px** |
| Header close icon | height | 12px | **16px** |

### ConfirmationModal close hover

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Header close button | position | static | **relative** |
| Header close button | top | auto | **0px** |
| Header close button | right | auto | **0px** |
| Header close icon | width | 12px | **16px** |
| Header close icon | height | 12px | **16px** |

### DeleteConfirmationModal

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Header close button | position | static | **relative** |
| Header close button | top | auto | **0px** |
| Header close button | right | auto | **0px** |
| Header close icon | width | 12px | **16px** |
| Header close icon | height | 12px | **16px** |

### DeleteConfirmationModal at 360px

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Header | position | static | **sticky** |
| Header | top | auto | **0px** |
| Header | z-index | auto | **10** |
| Header | background-color | transparent | **#FFFFFF** |
| Footer | position | static | **sticky** |
| Footer | bottom | auto | **0px** |
| Footer | z-index | auto | **10** |
| Footer | background-color | transparent | **#FFFFFF** |
| Header close button | position | static | **relative** |
| Header close button | top | auto | **0px** |
| Header close button | right | auto | **0px** |
| Header close icon | width | 12px | **16px** |
| Header close icon | height | 12px | **16px** |

## Motion

| What | Before | After |
| --- | --- | --- |
| Dialog open / close | 220ms in / 160ms out | **unchanged** |
| Footer divider appearing | none | **opacity fade 150ms when content starts to scroll beneath the footer / reaches the end** |
| Close button hover fill | 150ms colour fade | **unchanged 150ms; only on hover-capable pointers** |

## States to update in Figma

- Dialog header / default: fill #FFFFFF, 24px padding, 1px bottom divider #E9EAEB. NEW behaviour: pinned to the top of the dialog while the body scrolls (confirm and delete modals: 16px / 24px padding, same).
- Dialog footer / default (content fits): unchanged, no divider; buttons 24px from the side and bottom.
- Dialog footer / content scrolling beneath: NEW variant. Fill #FFFFFF, pinned to the bottom, 1px divider #E9EAEB, then 16px white space, then the buttons.
- Dialog footer / scrolled to the very end: same as 'content fits' (no divider).
- Close button: 24x24 radius 6, icon 16px (was 12px, FormModal/Dialog) colour #707070; hover fill #F5F5F5 and icon #484848; focus ring 1px #343E55 offset 2px. Hit area 32x32 (not drawn).
- Confirmation / Delete modal header close button: same 24px button, 16px icon, 32px hit area.

## How to apply in Figma

1. Dialog component: make 'Header' and 'Footer' pinned: in a prototype frame with a scrolling body, set the header to 'fixed position when scrolling' (top, 0) and the footer to fixed (bottom, 0). Both keep fill #FFFFFF so scrolled content passes behind them. Dialog panel stays: radius 12, stroke 1.2 #E9EAEB, same shadow, max height viewport - 32px.
2. Header: keep padding 24, bottom stroke 1px #E9EAEB. Confirmation/Delete headers: padding 16 (confirmation) / 24 (delete), unchanged.
3. Footer: add variant 'Scrolling' (content hidden beneath). Above the button row add a 16px high white strip with a 1px top stroke #E9EAEB (full width of the dialog). The footer's own padding is unchanged (0 top, 24 sides, 24 bottom); the strip sits above the footer's top edge. The default (content fits) footer variant does not show the strip or the stroke.
4. Close button: keep the 24x24 frame, radius 6, top 24 / right 24 from the dialog corner. Change the X icon to 16x16 (was 12x12), stroke 2, colour #707070. Hover: frame fill #F5F5F5, icon #484848. Focus-visible: 1px outline #343E55, offset 2px.
5. Hit area: add a transparent 32x32 layer centred behind the close button (4px larger on every side) and name it 'hit area' so developers see the target; it is not visible. Apply the same to the close button in the Confirmation and Delete headers.
6. The close button stays pinned beside the header while the body scrolls (position: sticky at 24px from the top, 24px from the right).
7. Do not change: overlay, open/close motion (220ms in / 160ms out), widths 384 / 512 / 672 / 896 / full, title 16/500 #484848, description 12/400 #707070.

## Notes

- Decision on the footer divider: pure CSS using a scroll-state container query (@container scroll-state(stuck: bottom)), no JavaScript. It works in Chrome/Edge 133+ (verified in Chrome 154: divider appears when content is hidden beneath the footer, disappears at the end, absent when content fits). Browsers without it (Firefox; I believe also current Safari, not tested) fall back to a plain always-visible 1px divider above the footer, i.e. the 'bottom border always present' fallback the brief allowed. Where the fallback applies, short dialogs show a divider that Chrome users do not see.
- Close button implementation: it stays last in the DOM (Tab order and initial focus unchanged) but is ordered first and made sticky (net layout height zero) so it stays beside the sticky header. No new DOM wrappers were added to DialogContent.
- The scroll container is DialogContent (overflow-y-auto). ConfirmationModal and DeleteConfirmationModal set overflow-hidden on it, so the sticky header/footer are a no-op there (they never scroll, same as before).
- The Close hit area was verified in Chrome: a 24x24 button, ::before 32x32 at -4px; elementFromPoint hits the button up to 16px from its centre and misses at 17px (see 17-close-hit-area-dialog.after.json and 18-close-hit-area-confirm.after.json). These two scenarios have no 'before' capture (the before state is a plain 24px button without a pseudo-element).
- The long-form story 'Scrolling content' was added to dialog.stories.tsx for review. FormModal needs no code change: it inherits the sticky header/footer from Dialog. The 'before' of scenarios 06-08 is the same story under the old code.
- Not tested: Safari, Firefox, touch devices, iOS rubber-band scrolling with the pinned footer. Overlay and the dialog motion were not touched.
- Research conclusions in 'why' come from the task brief; I did not re-verify them against each library.
