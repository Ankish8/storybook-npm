# V2 text hierarchy correction — 2026-10-02

Workspace: `/Users/ankish/Downloads/Code/storybook-npm-v2`. This review was completed locally on `feat/v2`. The user subsequently authorized saving the reviewed work on `codex/ui-v2-review-2026-10-02`; repository coordination is documented in [V2-REPOSITORIES.md](V2-REPOSITORIES.md).

## User-directed changes

The user asked for softer text throughout v2 and less unnecessary font weight. This direction supersedes the recorded neutral Figma colors and ordinary label/title weights. The recorded Figma specifications remain historical references for geometry, state treatments and APIs; Figma was not reopened for this correction.

| Role | Token and fallback | Ordinary weight |
| --- | --- | --- |
| Titles and form labels | `--v2-text-primary: #484848` | 500 |
| Body text, field values, ordinary choices | `--v2-text-secondary: #5E5E5E` | 400 |
| Hints, counts and metadata | `--v2-text-muted: #707070` | 400 |
| Native placeholders | `--v2-text-placeholder: #707070` | 400 |

Selected field chips/options use 500; selected Dropdown/SearchFilter choices retain 400 and use their existing selection treatment. Some secondary form labels use the secondary color at 500. Tab counts use secondary text at 400. Tabs use 500 for both selected and inactive labels; the existing underline and color distinguish selection. Neutral Button variants use 500; filled primary and status actions retain 600. Prominent EmptyState headlines, explicit Typography headline/label variants and SearchFilter query-match emphasis retain intentional emphasis. Documentation page titles use 600, sections and table headers 500, and body text 400. Status, brand, inverted and disabled palettes are retained.

The new variables are additive in the preview stylesheet and CLI initialization template. Each component utility has its own fallback, so installed components receive the same visual changes even before optional theme variables are added. Existing v1 tokens are unchanged.

## Full component inventory and review

| Group | Components | Evidence |
| --- | --- | --- |
| Actions, selection and feedback (16) | Button, ButtonGroup, Badge, Tag, Checkbox, Switch, Radio, Breadcrumbs, Stepper, ProgressIndicator, FileUpload, Scrollbar, ShimmeringText, Spinner, Skeleton, BouncingLoader | `design/review/text-hierarchy/root-browser-checks.json`, screenshots in the same directory |
| Fields (13) | Input, TextField, Textarea, Select, SelectField, PhoneInput, MultiSelect, CreatableSelect, CreatableMultiSelect, DateRangePicker, DateTimePicker, OtpInput, NumberStepField | [Field review](V2-TEXT-HIERARCHY-FIELDS-REVIEW.md), [Docs/gallery supplement](V2-TEXT-HIERARCHY-FIELD-DOCS-GALLERY-REVIEW.md) |
| Content (16) | Tabs, Table, Accordion, Alert, Avatar, PageHeader, PageFooter, Pagination, EmptyState, UiCard, ContactListItem, ImageMedia, ReplyQuote, SystemMessage, DateDivider, UnreadSeparator | [Content review](V2-TEXT-HIERARCHY-CONTENT-REVIEW.md) |
| Overlays and supporting primitives (11) | Dialog, ConfirmationModal, DeleteConfirmationModal, DropdownMenu, Tooltip, Toast, FormModal, SearchFilter, ReadableField, Typography, Panel | [Overlay review](V2-TEXT-HIERARCHY-OVERLAYS-REVIEW.md) |

Root review covered 74 rendered views across its 16 components: Docs, Overview, variant galleries, applicable States and Usage. All measured documents had 980px client/scroll width, and no headings appeared inside table cells. Wide matrices retain their local scroll container. Variant, Usage and States captures were visually inspected. Introduction, Foundations and Migration were also reviewed with primary/500 section headings and secondary/400 paragraphs. The standalone MDX guides now declare their v2 scope directly because Storybook ignores a container parameter on an unattached Meta block.

The Checkbox Overview was checked in both directions: clicking the component changes its checked Control; choosing false in Controls unchecks it. Its actual label span computes primary/500. Per-group reports record the field typing, picker/menu, tab selection, modal focus-return and other exercised paths.

The field supplement completes Docs, variant galleries, States and Usage coverage for all 13 fields. Ten additional Usage forms exercised local saves, custom option creation and date selection; each measured 1620px client/scroll width. A final direct TextField Docs example check retained muted/400 helpers and red/400 error text at 1280px with no page overflow (`design/review/text-hierarchy/docs-example-role-check.json`).

The final field gallery pass found a real Select placeholder selector mismatch: Radix marks the trigger, while the old value-span rule could never apply. The correction moves the placeholder color to a local trigger variable and preserves caller text-color overrides. Both Select and SelectField are rechecked empty and filled. A final source scan found no remaining bold neutral text: the remaining semibold rules are the intentional roles listed above or the preserved v1 comparison branches.

## Verification

| Check | Result |
| --- | --- |
| Existing v2 tests | 56 suites; 1,292 passed |
| CLI tests, including existing E2E | 5 suites; 181 passed |
| CLI production build | Passed in this workspace |
| Consumer installation | All 56 v2 source files match in plain and prefixed projects; legacy Button and warning behavior correct |
| Tailwind coverage | 56 source files; 2,758 class tokens; 0 dead classes |
| Merge compatibility | 10 existing checks passed in each of tailwind-merge 2.6 and 3.4 |
| Story-inclusive TypeScript | `design/verify/tsconfig.all-stories.json` passed |
| Focused public type parity | Passed |
| API check | No breaking changes |
| Scoped ESLint and formatting | Passed; existing browser-data advisory only |
| V1 preservation | 627 tracked legacy UI/custom files unchanged; 125 registry component definitions unchanged; 63 old semantic variables unchanged |
| Final production Storybook and frozen preview | Passed in 22m 25s; 56 components, 772 stories and 56 component Docs pages in the built index; all 121 frozen build-source hashes match |

V1 proof is in `design/verify/text-hierarchy-v1-proof.json`. `design/verify/text-hierarchy-baseline.json` records the initial user modifications and backup location. Existing user-added interaction stories and story-sweep scripts are preserved. Generated catalog/token files were restored to their initial bytes after the finished preview was copied; both hashes match the initial backup, preserving the user's original uncommitted token data.

## Finished preview

[Open the reviewed Tabs preview](http://127.0.0.1:6040/?path=/story/v2-components-tabs--full-width-with-badges). The local server serves a copied production build from `/tmp/myoperator-v2-text-hierarchy-preview-ewz2ljr6`. `design/verify/text-hierarchy-preview-server.json` records the process, build log, source verification and restored-file hashes.

Three representative views were checked again in this finished build:

- Tabs: selected label primary/500, inactive labels muted/500, body secondary/400 and helper muted/400. No page overflow at 1280px.
- Dialog: title and inner heading primary/500, body secondary/400 and supporting text muted/400. Cancel remains secondary/500 and Continue inverted/600. Its 512px width and 12px radius are unchanged; Cancel closes the dialog and returns focus to Open dialog.
- Select: empty placeholder muted/400; selecting Basic Auth changes the value to secondary/400. No page overflow at 1280px.

Screenshots and computed values are in `design/review/text-hierarchy/`, named `tabs-final-built-*`, `dialog-final-built-*` and `select-final-built-*`.

## Browser evidence boundaries

This is a targeted visual correction, not a new manual sweep of every individual story. The reviewed Docs, galleries, States, selected portals and Usage paths are listed in the group reports. During concurrent development Storybook retained temporary Acorn/HMR failures, and its token addon once read a truncated JSON file while build output was being written. The dev server was restarted and affected final views reloaded; these warnings are recorded rather than described as a zero-console-error result. The final delivery preview is served from a copied build, without concurrent token writes.
