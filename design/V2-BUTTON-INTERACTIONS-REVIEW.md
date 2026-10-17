# V2 Button state and interaction refinement

Date: 2026-10-07. Local branch: `codex/v2-motion-polish`.

The user asked for a closer match to [Arc Button](https://uiarc.dev/components/button), keeping only MyOperator's primary color and corner radius intact. This supersedes the earlier pass's preservation of all existing variant colors, borders, sizes and shadows, and its crisp-only crossfades.

## Reference inspected

The external Arc page was opened through computer use. The rendered primary, secondary, ghost, destructive, icon, disabled and loading examples were inspected; hover, keyboard focus and the Upload file loading interaction were exercised. The live page's Button CSS rules and displayed source were read, including the active selectors. A held pointer-down frame was not captured.

| Aspect                  | Reference                                                                       | v2 result                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary resting         | Flat foreground fill, 1px matching border, no shadow                            | Same structure, using existing `--semantic-primary` (#343E55)                                                                                             |
| Primary hover / pressed | .91 / .84 opacity; hover shadow 0 1px 2px at .035 alpha                         | Same rules, fine-pointer hover only                                                                                                                       |
| Secondary / Outline     | White, neutral border; subtle neutral hover and pressed fill                    | Secondary now has a neutral fill; Outline a white bordered surface, both in the picker and examples                                                       |
| Ghost                   | Muted neutral text, transparent; foreground text and subtle fill on interaction | Same                                                                                                                                                      |
| Destructive             | White with red text; red border and subtle neutral fill on interaction          | Same; no solid red background                                                                                                                             |
| Success / Dashed / Link | No direct reference equivalents                                                 | Existing names retained; Success now uses a filled semantic green, Dashed a neutral outlined surface; Link is blue, underlined, borderless and stationary |
| Disabled                | .52 opacity, not-allowed cursor                                                 | Same; native disabled or explicit aria-disabled activation guard                                                                                          |
| Loading                 | Centered spinner over hidden label, same width and palette                      | Same by default; explicit `loadingText` retains the existing optional inline-label API                                                                    |
| Typography / sizing     | 14px, weight 500, line height 1.4; 36/44/50px, padding 12/16/20px               | User-approved sizes 32/40/44px; radius stays 8px                                                                                                          |
| Press depth             | .96 for compact, .97 standard, .985 wide                                        | Same standard/wide thresholds, explicit icon sizes compress to .96; links and popup anchors stay still                                                    |
| Label change            | Incoming +4px, outgoing -3px, soft blur, width morph                            | 240ms in / 160ms out with 4px blur; retained native width spring                                                                                          |
| Focus                   | Page globally suppresses outlines                                               | Deliberately retained visible 1px brand outline, 3px offset                                                                                               |
| Reduced motion          | No movement, short fade; spinner stops                                          | No movement/blur/width spring, 120ms fade; spinner continues slowly to communicate progress                                                               |

Button-local neutral colors have optional `--v2-button-*` overrides. Shared tokens and v1 components were not edited. The spinner is decorative, the concealed label remains accessible, and outgoing snapshots are inert and hidden from assistive technology. Existing focus retention and pointer/keyboard/form guards remain in place.

## Follow-up: canonical variants and actual docs CSS

The next user review identified invisible loading feedback, outlined Ghost/Link buttons, and a left-aligned icon sample. Two concrete causes were found:

- The docs preview imports Bootstrap but compiled Tailwind without `important: true`. Bootstrap's important opacity and border utilities won over v2 state classes. The docs compiler now matches Storybook's configuration. A regression check compiles the actual docs configuration with Bootstrap and verifies state-rule precedence; class existence alone missed this issue previously.
- `gallery()` sets a padded layout. IconOnly inherited it and also inherited text sizes in Controls. IconOnly now uses a centered layout and only square 32/40/44px choices, with a persistent Plus icon and centered spinner. Button comparison grids are now defined in the canonical stories, removing docs-only layout overrides.

Eight canonical variants appear in Controls, the main preview and examples: Primary, Secondary, Outline, Ghost, Destructive, Success, Dashed and Link. Default and Primary share one CVA style definition. Secondary has a neutral fill; Outline has a white bordered surface; Success uses a filled semantic green (`--semantic-success-text`, #067647) so its white 14px label has 5.69:1 resting contrast; hover and press use 95% / 91% opacity. The public API still accepts every v1 variant and size. Link now has a persistent underline and the existing semantic link color; Ghost and Link have zero border width. Both retain keyboard focus feedback.

## Verification

- Focused Button, motion and ConfirmationModal tests pass: **126 checks**.
- Story-inclusive TypeScript and focused ESLint pass.
- **110 class candidates compile, zero dead classes**. This caught two ambiguous duration utilities; explicit transition properties fixed them.
- The source snapshot confirms only Button implementation/stories/tests and one dependent ConfirmationModal assertion changed among component files. All 45 legacy v1 files are unchanged.
- The dependent assertion was updated because it expected the superseded solid-red destructive background.

- **All 1,664 v2 tests pass** across 59 test files.
- The preceding state-refresh Storybook build passed (not repeated in this follow-up). For this verification command, `DESIGN_TOKEN_GLOB` was scoped to source assets to avoid the known repeated token-addon scan of repository proof images; shared configuration was untouched.
- CLI build passes; all 56 v2 files install exactly from source in plain and prefixed consumer projects.
- Both generated registries are identical to HEAD except the `v2-button` entry.
- Five docs adapter tests pass, including icon Controls, the original gallery / 9-name compatibility comparison (the gallery expanded to eight distinct styles on October 17), synchronized save feedback, and all 786 stories importing with JSON-safe Controls. The compiled CSS regression check passes.
- Production docs build and docs catalog/type checks pass. The rebuilt app is running on localhost:6009.
- Pre-existing catalog and token-source files were restored byte-for-byte after the build. Formatting and whitespace checks pass.

## Visual verification limit

External reference inspection succeeded. The revised local implementation has **not** been visually compared in the browser: the earlier localhost browser security rejection remains in effect and was not bypassed. Unit tests and compiled CSS checks establish implementation behavior, not an exact rendered match or subjective animation feel.

All work remains local. No commit, push, publishing, product sync or Figma update.

Preview: http://localhost:6009/components/button?example=AllVariants

## October 17 approved compact sizes

The approved Button heights are small 32px, default 40px and large 44px, including their square icon equivalents. ActionButton inherits the same sizes. SplitButton keeps these overall heights by accounting for its outer 1px border inside the joined segments. Existing size names and custom class overrides remain supported. Modal confirmation actions keep their explicit 44px height to match their input. Original v1 sizes are unchanged.
