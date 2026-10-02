# Avatar v2 review

Reviewed locally on feat/v2 at http://localhost:6008 on 2026-10-01. Recorded specs and current verified web-panel values used; v1 source is unchanged.

## Changes

- Inter medium initials, soft #ECF1FB surface, additive outline variant and 30px small size. Existing identity, image, custom children and presence API remains.
- Overview and individual stories expose working size/variant/presence/identity controls. Variant, size, presence and identity-mode galleries fix only their comparison axes. Shared Soft/Filled × five-size v1/v2 comparison is contained; Outline is additive v2.
- Profile Usage synchronizes name typing and presence changes with Controls. Unique React IDs prevent repeated Docs examples from sharing field labels.
- Browser review found presence dots clipped by the root's overflow. Removed that clip and rounded the image itself; existing image and presence behavior is preserved.

## Manual browser evidence

- Overview: set size sm, variant outline, status busy. Measured 30px, medium Inter, white outlined surface; dot is fully visible after repair.
- All Sizes: measured 24/30/40/48/64px; changing variant to filled updates all five samples.
- All Variants: changing size to lg gives three 48px samples; soft/outline/filled backgrounds and border checked.
- With Status: none, online, offline, busy, away inspected; full dots visible.
- States: generated initials, explicit initials, local embedded image and custom content reviewed.
- With Image: size xs gives loaded 24px image and root; natural width 150px, image is rounded.
- v1 vs v2: all ten shared variant/size pairs reviewed, including Source Sans v1 vs Inter v2 and 32px vs30px small avatars.
- Usage: typed Mira Shah; name Control changed to Mira Shah. Selected away; status Control changed to away. Changed name Control to Noor Khan; input and initials updated to Noor Khan/NK. Presence text and dot remain visible.
- Docs: install/import, migration table, token table and all story sections inspected. No headings inside table cells; no browser component errors. Reloaded Docs after unique-ID correction; repeated name inputs each have the single label Name.

## Verification

35 focused Avatar tests passed, including retained API behavior and outline variant. Focused source/story lint and story-inclusive TypeScript check passed. No claim is made about automatic image-error fallback: v1's behavior is retained.

Screenshots (all visually inspected): /Users/ankish/.codex/visualizations/2026/10/01/v2-avatar/overview.png, sizes.png, variants.png, presence.png, states.png, comparison.png, usage.png, docs-top.png, docs-tables.png.

Shared Storybook briefly encountered unrelated indexing errors during review; final reviewed views rendered normally after recovery.
