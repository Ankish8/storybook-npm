# Type cleanup and theme switch

The approved request is to eliminate all 88 aggregate TypeScript diagnostics, retain v1 compatibility, replace the docs theme dropdown with the Arc UI sun/moon switch, validate, commit, push and deploy.

## Design

Use the public Arc UI theme switcher's compact icon-button treatment and spring icon swap, adapted to the existing docs color tokens and native button. Keep accessible action labels, keyboard activation, visible focus, reduced-motion support and a motion-free hydration correction. The existing theme provider remains responsible for persistence, system defaults and synchronizing open preview popups without remounting.

A first visit or saved System preference follows the OS. Pressing the switch saves an explicit opposite appearance. No dropdown is retained. The public component-library API and v1 styles remain unchanged.

## Implementation and checks

1. Correct test fixture/ref/mock types and story-only arg contracts, without disabling strict checks or changing existing component APIs.
2. Supply a precise declaration for shared migration metadata.
3. Integrate the adapted switch and update docs and provider tests.
4. Run aggregate build, full component/CLI/preview tests, lint, API/Bootstrap/CVA checks, all four migration gates, library/MCP/docs builds, and built CSS cascade checks.
5. Verify keyboard/theme persistence and open popups in localhost; commit, push and verify the production deployment.

Reference: https://uiarc.dev/components/theme-switch and its public registry source.

## Verified results

- All 88 prior TypeScript diagnostics resolved; aggregate `npm run build` passes, including library ES/CJS/declaration output. The root build now targets the actual library instead of a removed app HTML entry.
- 5,931 component tests pass with five existing skips; 189 CLI tests and the complete CLI build pass.
- 67 docs preview tests pass, including hydration, keyboard activation, focus preservation, persistence and authenticated iframe theme updates.
- All four v1 compatibility gates pass with existing waivers unchanged. Component APIs and compiler strictness are unchanged.
- Storybook typecheck/build pass; 1,189 entries with no v2 entries. Five affected-story interaction smokes pass.
- Full lint passes with zero errors and five existing warnings. API, Bootstrap, CVA and required-test checks pass.
- Production docs build, metadata/type checks and actual-built CSS cascade checks pass. MCP typecheck/build pass.
- A live localhost calendar remains open and keeps its selected dates when the sun/moon switch is pressed in either direction.
