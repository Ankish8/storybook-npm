# V2 motion polish review

Date: 2026-10-03. Repository: `/Users/ankish/Downloads/Code/storybook-npm-v2`. Local branch: `codex/v2-motion-polish`, based on `feat/v2-motion` at `8108aca`.

## Result

All 56 v2 components were reviewed in the actual Storybook: Docs, available variants/sizes, states and Usage. Working Controls, typing/toggling and representative workflows were exercised where the component supports them. Static content remains still; composed components inherit the motion of their controls. Thirty v2 component sources needed refinement.

The horizontal tab underline and vertical rail now move with a real, critically damped spring. Rapid retargeting preserves position and velocity. Logical selection and keyboard focus remain immediate. No extra component DOM nodes, public props or runtime animation library were added.

Fixed small movements use a shared monotonic sampled spring with a cubic-bezier fallback. Presses compress in 80ms and return in 180–200ms; toggles and accordion use 240ms; panels use 260ms. Overlays enter from their actual origin at 200ms, Dialog at 220ms and Tooltip at 160ms. Displacement stays small. Reduced motion removes spatial movement and retains brief fades; spinners continue at a slower two-second rotation.

Apple's interrupted-spring guidance informed the approach. Our stiffness, damping and durations are proposed web values, not published Apple constants. Research also covered official HeroUI, Mantine, Adobe Spectrum, Radix, Motion, Fluent and Material sources. The references and full timing rules are in [V2-MOTION.md](V2-MOTION.md).

## Changes found through actual rendering

- Added the missing shared Tabs indicator, including full-width, unequal-width, vertical, controlled, manual activation and interrupted-switching behavior.
- Corrected Tailwind animation utility collisions and state specificity. Classes now emit and apply their intended timing properties in Storybook and installed consumer projects.
- Matched expanding accordion height and chevron timing; observed changing content size to avoid clipping asynchronously inserted content.
- Kept overlay placement fixed while animating; reduced-motion overlays use separate opacity-only keyframes.
- Reduced checkbox, small-action and upload movement; link buttons remain stationary, including icon sizes.
- Repaired Tabs and Select interaction-story play functions and the ReadableField state comparisons.
- Repaired the cramped Panel size gallery with responsive cards and contained local scrolling. Component widths remain 280/320/400px.

## Manual review coverage

| Group | Components | Evidence |
| --- | --- | --- |
| Content and composed surfaces | Alert, Avatar, Badge, Breadcrumbs, ButtonGroup, Button, ContactListItem, DateDivider, EmptyState, ImageMedia, PageHeader, ReplyQuote, SystemMessage, Table, Tag, Typography, UiCard, UnreadSeparator | [18-component review](review/motion-polish-content.md) |
| Controls and expanding layouts | Switch, Checkbox, Radio, Accordion, Panel, ProgressIndicator, Scrollbar, ReadableField, FileUpload, TextField, Textarea, PhoneInput, NumberStepField, OtpInput | [14-component review](review/motion-polish-controls.md) |
| Overlays and composed modals | Dialog, DropdownMenu, Tooltip, MultiSelect, CreatableMultiSelect, CreatableSelect, SelectField, DateRangePicker, DateTimePicker, SearchFilter, Toast, ConfirmationModal, DeleteConfirmationModal, FormModal | [14-component review](review/motion-polish-overlay.md) |
| Navigation | Tabs, Select | [2-component review](review/motion-polish-navigation.md) |
| Forms and layout navigation | Input, PageFooter, Pagination, Stepper | [4-component review](review/motion-polish-navigation-layout.md) |
| Loading feedback | Skeleton, Spinner, BouncingLoader, ShimmeringText | [4-component review](review/motion-polish-loading.md) |

Reviews used the supported Browser runtime and actual input. Screenshots show settled presentation; timing/frame records establish intermediate motion. Headings, supporting text, disabled hierarchy and comparison containment were visually checked. This is not a pixel inspection of every row of every long Docs page or a responsive device sweep.

## Verification

| Gate | Result |
| --- | --- |
| Actual browser motion | **54/54 checks passed**, normal and reduced motion: 40 existing checks plus 14 spring/opacity checks |
| V2 component tests | **1,312 passed** across 57 files, including spring interruption, layout/fallback, resize and cleanup regressions |
| CLI tests | **181 passed** |
| All-story TypeScript | Passed |
| Changed source/story lint and formatting | Passed |
| Public API compatibility | Passed; the older API snapshot reports existing additions, no break |
| CLI build and generated registry checks | Passed |
| Consumer installation | All **56 v2 components** install byte-identically in plain and `tw-`-prefixed projects |
| Consumer CSS compilation | Spring tokens, measured rail, explicit timings and opacity-only reduced-motion keyframes compile in both projects; prefixed v1 remains separate |
| Legacy source/story preservation | SHA-256 comparison: **90 files unchanged** |
| Legacy CLI integrity | **45 components unchanged** |
| Static Storybook | Full standard build passed; four additional compiled Tabs checks passed |

Browser records: [motion-polish-browser.json](review/motion-polish-browser.json). Reusable probes: [motion-probe.mjs](verify/motion-probe.mjs) and [motion-polish-probe.mjs](verify/motion-polish-probe.mjs). The Browser adapter exports let the supported runtime execute those scenarios without launching another browser.

Two recorder issues were corrected, rather than changing valid components: startup validation could finish before the recorder attached, and Radix manual keyboard focus moves asynchronously. The repaired cases create fresh validation through real Usage input and wait for actual focus. Real browser review also identified and fixed the animation-duration specificity defects.

## Current preview and build evidence

Current preview: `http://127.0.0.1:6040`. It forwards the running Storybook at `http://localhost:6008`, including live refresh, so all stories reflect current source. The outdated static preview at 6040 was replaced. The user tab is left on Full width with counts, with Assigned selected and Controls synchronized.

The complete normal static build succeeded using the repository configuration. Four extra real-browser checks against that compiled build confirmed horizontal and full-width tab springs with normal and reduced motion: [compiled preview evidence](review/motion-polish-static-browser.json). A later gallery-only Panel story change was reviewed in the live preview. An optional second static rebuild was stopped after the current live preview made it unnecessary; repository configuration was not changed. The saved static artifact predates that gallery-only story correction and should not be described as the latest presentation artifact.

Final checks through 6040 confirmed the corrected responsive Panel gallery, panel widths 280/320/400px, explicit 260ms transitions and no document overflow (1280px client/scroll width). The visible Tooltip measured its final 160ms entrance. The full-width Tabs example and Controls were checked in both directions. A settled screenshot is saved at `/Users/ankish/.codex/visualizations/2026/09/30/01a0f2a4-0e92-7fd3-8700-553b05aeb4df/v2-tabs-motion-polish.png`.

The 6040 forwarding process is local only and depends on the existing 6008 development server. Its temporary script is `/tmp/v2-motion-polish-live-preview.mjs`; it creates no repository configuration or deployment.

## Limits and retained behavior

- Animation feel remains a visual judgment; passing frame checks does not substitute for the user's taste or measure performance under device load.
- Physical OS file dragging and Toast swipe were not manually exercised. Reduced motion was checked through browser media emulation, not by changing the user's system preference.
- Earlier `aria-allowed-attr` findings for DateTimePicker and SearchFilter are outside this motion pass and have not been claimed as repaired. Existing Escape and close-on-select defaults are preserved.
- The user's pre-existing `public/design-tokens.source.json` change was preserved.
- No commits, pushes, merges or publishing were performed. All work remains local on the separate polish branch; frontend and existing GitHub review branches were untouched.
