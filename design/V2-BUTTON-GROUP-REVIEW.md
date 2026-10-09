# Button Group redesign — 2026-10-07

## What changed

Redesigned the existing v2-only Button Group as a joined action surface inspired by https://uiarc.dev/components/button-group. No v1 equivalent is added or replaced. Keeps MyOperator primary colors, neutral v2 typography, 8px corners and Button's 36/44/50px outer sizes.

- One measured hover/keyboard-focus highlight uses a damped spring; dividers fade beside the active segment.
- Press response scales only the content, never the group or menu anchor.
- Reserved labels crossfade in a fixed space; unreserved text changes animate width. Feedback is announced after activation.
- Outline and solid styles, horizontal/vertical orientation, icon-only and live-value actions, native links, disabled actions, and responsive label collapse.
- Optional non-modal Dropdown Menu reuses the canonical v2 menu, focus handling and motion.
- Reduced motion removes travel, press scaling, label movement and chevron rotation; fades remain.
- Existing value/defaultValue/onValueChange, value-based items, default/primary/toggle aliases, alignment and iconOnly remain accepted. These opt into selection compatibility mode. New id-based items are actions without persistent selection.
- Twenty-three editable stories include live feedback, size/style/state comparisons, a narrow container, zoom controls, links, document usage, and keyboard interaction. Overview is the featured docs example. The preview reserves 420px before opening a menu.

## Verification

- 31 component and motion tests pass. Covers native activation/forms, independent callbacks, keyboard wrap/Home/End/RTL/vertical behavior, focus return, disabled actions, links, feedback announcements, ref forwarding, compatibility, responsive collapse, reduced motion, observer cleanup and the initial-observer-delivery regression that could interrupt a moving highlight.
- 16 docs preview tests pass, including five Button Group cases for live Customize properties, menu/action feedback, synchronized legacy selection, independent comparisons and zoom values. All 58 modules / 829 stories register.
- Component and story TypeScript, focused ESLint and formatting pass. All 120 class candidates compile.
- CLI dependency graph/source installation checks pass for plain, tw- and app- prefixes. The registry declares Motion 14 and v2 Dropdown Menu.
- Full Next docs build and refreshed canonical preview/Storybook builds pass. V1 integrity remains unchanged.

## Reference and limits

The Arc page was opened in the external browser; its Share → Copied feedback and More actions menu were exercised, and its published motion/API description was inspected. This is evidence for the reference only.

Localhost browser access remains blocked by the browser tool's policy. No alternate browser or transport was used to work around it. Local motion feel, real-browser geometry and Storybook play execution remain unverified; automated geometry tests and successful builds do not replace visual sign-off.

All changes remain local. No commits, pushes, publishing, Figma edits or product sync.
