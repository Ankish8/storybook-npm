# V2 Button interaction refinement

Approved by the user on 2026-10-07, based on https://uiarc.dev/components/button.

## Design

- Preserve the current palette, 8px corner radius, heights, typography and focus ring.
- Use quick press compression and a restrained spring return. Links and popup anchors stay stationary.
- Crossfade changing content without blur. A critically damped width spring keeps label and spinner changes from jumping; fixed and full-width buttons keep their outer sizing.
- Loading remains focusable with `aria-busy` and `aria-disabled`. Guard pointer, keyboard and form activation to prevent duplicate actions. Explicitly disabled buttons remain natively disabled.
- Apply hover treatments only to hover-capable fine pointers. Reduced motion snaps width and scale while retaining short fades.
- Add a Save → Saving → Saved story whose loading and label values stay synchronized with Controls.

## Implementation plan

1. Snapshot component integrity. Refine only v2 Button, its stories and focused tests.
2. Keep animation code self-contained in the component: native animation/resize APIs, no new runtime dependency. Preserve `asChild`, forwarded refs, icons and ordinary native button behavior.
3. Test focus retention, duplicate activation, composition, interrupted width changes, reduced motion and cleanup. Existing v1 markup parity tests are replaced with v2 wrapper/accessibility checks because animated content now needs a wrapper; v1 source remains untouched.
4. Regenerate the CLI registry, verify consumer parity, and rebuild the local documentation preview. Record the actual verification scope and any browser restriction.

Everything remains local. No commit, push, publishing or product integration.


## Follow-up approved by the user: match every Button state

The user reported the first pass still looked different during presses and explicitly authorized matching everything except primary color and corner radius. Inspect the live Arc reference CSS and UI, replace the old skeuomorphic/gradient states, update all Button variants, sizing and loading presentation, then rebuild both previews. Preserve a keyboard focus indicator and keep existing variant/prop names available. The prior crisp-only fade choice is superseded by the requested reference blur/vertical label transition. No new approval or publishing is required.
