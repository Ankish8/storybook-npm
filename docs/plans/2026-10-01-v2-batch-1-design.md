# V2 batch 1

Continue the side-by-side v2 design approved in the supplied handoff. The
next batch is Badge, Tag, Input, Checkbox and Switch. Use the current library
source for behavior and props, and the recorded spec plus the verified web-panel diffs for visual values.

## Decisions and constraints

- v1 source, tokens and generated consumer output stay unchanged.
- v2 source lives in `src/components/ui/v2`, uses unprefixed classes, and
  installs through the `v2-<name>` registry keys.
- The user confirmed on October 1 that everything should match v2. The Info
  badge uses Figma's black border (not the blue correction in the older preview).
- Keep the V2 section name and existing Inter loading for this continuation.
- Keep all work local and uncommitted. Host migration and publishing are later
  decisions; this batch makes no changes to the web panel.

## Implementation checklist

1. Inspect context and reproduce Button's existing verification.
2. Add a v2 mode to the existing component generator so the repo's required
   scaffolding workflow supports the namespace.
3. Generate and refine each component separately, preserving its current API,
   event handling, refs and accessible attributes.
4. Add state/size stories, v1 comparisons, usage examples and migration docs.
5. Add tests for behavior, API parity, states and customization.
6. Verify types, lint, formatting, CLI output, unchanged v1 registry,
   compiled utility classes, actual rendered styles and Storybook production build.
7. Record results and remaining decisions in `design/`.

## Verification

Use the supplied `design/verify` kit. Capture v1 registry output before and after
without stashing or modifying the original checkout. Compare browser geometry
and computed styles to the recorded values; exercise input typing,
checkbox/switch interaction and tag removal. Restore only generated catalog/token
drift attributable to our build, preserving the state supplied by the user.
