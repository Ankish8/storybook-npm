# Action Button

Requested: add Arc-inspired Action Button as an additive v2 component.

## Fit

Use the existing `buttonVariants` contract for palettes, aliases, text sizes, focus and press styles. Export `ActionButton`, `ActionButtonProps`, and `ActionButtonState` from `ui/v2/action-button`. There is no v1 equivalent; preserve all existing Button source and registry output. Do not invent a legacy replacement or rewrite existing call sites.

A behavior wrapper around Button would animate the entire label/icon group and conflict with per-glyph motion. Duplicating its styling would drift. Use a native button with the shared variant function and a private label/icon animation layer. Motion is declared only for this opt-in component; React 18/19 are supported.

## Behavior

Required `label` and `onAction`. Optional pending/success labels, error announcement, error callback, state-change callback, and reset timeout (2400ms; 0 retains success). Await the real action, prevent same-tick duplicate runs, preserve focus while pending, and ignore late settlements after unmount. Errors return to idle and announce failure; applications own visible error details. Native type defaults to button.

Retain the brand primary, 8px radius, 36/44/50px text sizes, all Button variant aliases, and explicit native disabled behavior. Omit icon-only sizes, asChild, children and manually controlled loading because ActionButton owns its label and lifecycle.

## Motion

Reference inspected through the external browser: idle arrow, pending spinner, success check, displayed implementation and computed CSS. Preserve shared letter runs, softly transition changed characters, spring label width, move the arrow out forward, and draw the success tick. No entrance effect on mount. Reduced motion removes movement/blur/width spring/drawing; progress still has a slower spinner in keeping with current v2.

## Verification

Canonical interactive stories with actual timers, real controls and a retry example; native keyboard/form semantics, duplicate-run guard, promise rejection, reset, unmount, attributes, styles and dependency installation tests. Add to docs catalog and CLI registry. Build docs and Storybook. Local browser verification remains blocked by the earlier browser security restriction; no alternate browser/transport workaround.
