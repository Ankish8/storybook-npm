# FormModal v2 review

Worktree `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`; local only.

## Changes

Current props, forwarded ref, size, loading/disableSave and save/cancel semantics are retained. It composes the recorded Dialog recipe with body24/gap16, footer0/24/24/gap8, and header space reserved for the close control. Stories provide synchronized name/email/department/notification fields, editable individual sizes/states, contained size/state grids and a complete comparison using each version's Dialog/Input/Select/Checkbox/Button. Usage validates and edits a synthetic profile; cancel restores its saved fields.

## Verified

- 12 focused tests passed; lint, formatting and story-inclusive TypeScript passed. Original v1 source/story/test hashes unchanged.
- Live browser Overview: actual width384/radius12; body24, footer0/24/24/gap8, header24 with64px right reserve. Typing name updates Controls; toggling notification updates Controls. Changing email/department Controls updates the real fields.
- Individual Large story title changed to Edit sales profile, size changed to sm and actual width384 verified. Loading disables both actions.
- Size gallery title Control updates all five samples; actual widths384/512/672/896/full-reference1000. Document and viewport both980: wide matrix is contained.
- All three ready/Save disabled/loading forms manually inspected, including action disabled states and complete footer layout. Complete version comparison contains both text fields, Select, Checkbox, close and actions in both versions.
- Usage invalid email disables Save; a valid email enables it. The saved card updates, and Cancel restores the saved name in the fields and Controls. Final stable-preview save/status and focus checks follow below because unrelated dev HMR reset local state during initial review.
- Docs change/token tables inspected: five/six rows, readable normal values/swatches, no headings inside cells. Closed inline galleries create no modal portals.

Evidence: `design/review/form-modal/overview.png`, `sizes.png`, `states.png`, `comparison.png`, `usage.png`, `docs.png`.

## Final stable checks

On production Storybook `http://localhost:6028`, Usage name typing synchronizes Controls; Save persists Morgan Quinn, reports Profile saved in this preview and synchronizes open=false without the dev HMR reset. Cancel restores the saved profile/Controls. Current live source at6008 was separately checked after the external-trigger effect fix: Escape returns focus to Edit profile. The6028 snapshot preceded that story-only focus change; the main agent must include it in the final build. No component console errors observed in the stable view. Global mobile/build gates belong to the main agent.

## Final production focus check

Rechecked Overview at http://127.0.0.1:6029: Edit profile opened the actual modal, Escape closed it, the `open` Control returned to false, and actual browser focus returned to the Edit profile trigger. This snapshot includes the external-trigger focus restoration effect.
