# Button final click review

Browser-only targeted follow-up on 2026-10-01 at http://127.0.0.1:6030. This checks the earlier channel warning against an actual click, without reopening the already completed visual/state review.

- Opened Button Overview and waited for the rendered enabled **Button**.
- Captured the console before clicking: zero errors.
- Clicked the rendered button once through the browser.
- The next console read contained one new error at `2026-10-01T14:40:33.556Z`: `SecurityError` while Storybook stringify read `Window.toJSON` across origins.
- The Actions panel stayed empty. This is a concrete click-triggered action serialization failure, rather than an unrelated historical channel warning.

Evidence: `design/review/button/final-production-click.png`.

Reported to the source owner for a minimal story callback repair. Button implementation and previously verified visual values remain frozen unless a separate concrete source defect is found.

## Story-only repair

The source owner transferred the story file for this targeted repair. Added one private `buttonStoryProps` adapter that invokes the action spy without the React mouse event. The default meta renderer and all eleven overridden Button/V1 spreads use it, covering Icon Only, All Variants, All Sizes, States, comparison and Usage. All layouts, labels, Controls and fixed gallery axes are preserved; neither Button implementation changed.

Focused ESLint, Prettier and story-inclusive TypeScript passed. The other eight owned stories were audited: seven already pass primitives or no arguments; Dropdown's four native selection-event action calls were adapted to log serializable `{type,label}` records without changing selection/close behavior.

The live 6008 preview initially returned `ERR_CONNECTION_REFUSED` during startup. The source owner confirmed it was ready, and the review resumed there.

## Repair browser proof

Reviewed the updated stories at http://127.0.0.1:6008 with ten actual clicks:

| View | Clicked examples | Actions result |
| --- | --- | --- |
| Overview | Default Button | `onClick: []` |
| All Variants | Default variant | `onClick: []` |
| All Sizes | Small text button and large icon button | Two `onClick: []` calls |
| Icon Only | Add item | `onClick: []` |
| States | Default state | `onClick: []` |
| v1 vs v2 | Actual small v1 and v2 buttons | Two `onClick: []` calls |
| Usage | Delete and Save | Two `onClick: []` calls |

Both comparison components remained distinct: actual v1 heights 32/36/40 with Source Sans Pro, and actual v2 heights 32/40/48 with Inter. No new `SecurityError`, `Window.toJSON` or stringify failure appeared across these clicks. The earlier 6030 error remains historical console evidence.

The live browser logs also captured generic Chrome extension `Receiving end does not exist` messages. These are reported separately from the repaired action failure: all ten Storybook actions logged successfully, without serializing an event.

Evidence: `design/review/button/{overview-action-fixed,variants-action-fixed,sizes-action-fixed,icon-action-fixed,states-action-fixed,comparison-actions-fixed,usage-actions-fixed}.png`.

The story repair is verified and source-frozen for the owner's final production rebuild. No Button implementation, v1 source, shared helper, layout or Control changes were made.
