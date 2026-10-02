# V2 text hierarchy: overlays, fields and typography

Reviewed on 2 October 2026 in the browser at `http://localhost:6008`, on `feat/v2` in `/Users/ankish/Downloads/Code/storybook-npm-v2`.

## Scope

Dialog, ConfirmationModal, DeleteConfirmationModal, DropdownMenu, Tooltip, Toast, FormModal, SearchFilter, ReadableField, Typography and Panel. This pass applies the user's softer neutral colors and lighter ordinary title/label weights. Recorded geometry and current component APIs, interactions, user-added story content and v1 component files remain unchanged.

The recorded specification was used for existing dimensions; this pass does not claim a new Figma comparison. The user's neutral palette update takes precedence over the previous recorded text colors.

## Final roles measured in the browser

| Role | Final color | Weight | Examples |
| --- | --- | --- | --- |
| Ordinary title / section heading | `#484848` / `rgb(72, 72, 72)` | 500 | Dialog title, settings card heading, Panel header, Dropdown section label, Toast title |
| Ordinary body / choice | `#5E5E5E` / `rgb(94, 94, 94)` | 400 | Dialog body, form input, Dropdown choices, SearchFilter input, ReadableField value, Tooltip description |
| Field label | Primary or secondary according to role | 500 | ReadableField label primary; ordinary FormModal/Panel/Delete labels secondary |
| Supporting / metadata | `#707070` / `rgb(112, 112, 112)` | 400 | Dialog description, Toast description, ReadableField helper, empty search results, tour step |
| Search placeholder | `#707070` | 400 | Computed `::placeholder` in the actual SearchFilter input |
| Selected choice | `#484848` | 400 | Dropdown checkbox and selected SearchFilter option |
| Neutral action | Secondary or link palette | 500 | Cancel, Toast View/Undo, ReadableField Regenerate, Tooltip Skip |

Deliberate exceptions remain: explicit Typography headline and label variants keep their selected 600 weight; primary and destructive Buttons retain their established 600 weight and white text; semantic error/success/warning/info colors, disabled text, numeric match emphasis and inverted text remain intact. Docs page titles retain 600; component and Docs section headings use 500, body/table text 400 and table headers 500.

Dialog baseline evidence showed its title at `#181D27`, body at `#343E55` and inner settings heading at 600. The final actual portal showed title `#484848`/500, body `#5E5E5E`/400, description `#707070`/400 and settings heading 500. The 512px width and 12px radius remained unchanged.

## Browser views and interactions

All eleven Docs pages were reviewed with both the component-specification and design-token tables. They rendered without opening a modal over the document. All had `documentElement.clientWidth = scrollWidth = 1620px` in the current browser preview. The final recorded dataset includes 11 unique Docs pages and 45 distinct gallery/Usage/comparison views, plus the actual opened components below.

| Component | Views reviewed | Actual interaction proof |
| --- | --- | --- |
| Dialog | Docs, Overview, All variants, All sizes, States, v1 vs v2, Usage | Opened real portal; corner-close Control hid the close button; Escape updated open to false and returned focus to Open dialog. Usage form opened and cancelled. |
| ConfirmationModal | Docs, Overview, All variants, States, v1 vs v2, Usage | Opened real portal; cancelled; Usage confirmation updated local result to Confirmed in this preview. |
| DeleteConfirmationModal | Docs, Overview, All variants, States, v1 vs v2, Usage | Typed DELETE in the actual modal; action became enabled; Usage deletion updated local preview result. |
| DropdownMenu | Docs, description/suffix portal, Checkboxes, All variants, States, v1 vs v2, Usage | Opened actual menus; enabled checkbox selection updated Controls; disabled checked and unchecked choices retained disabled color; Usage preference toggled. |
| Tooltip | Docs, With title, All variants, Sides and offsets, States, v1 vs v2, Usage | Actual titled tooltip rendered primary/500 and secondary/400; tour Next updated step Control to 2, Skip dismissed and updated result. |
| Toast | Docs, Default actual toast, All variants, States, v1 vs v2, Usage | Actual View action clicked; workspace input typing synchronized Controls; Save produced the real success toast; Undo restored the previous name. |
| FormModal | Docs, Overview, All sizes, States, v1 vs v2, Usage | Control name changed actual field; typing changed Control; department and checkbox worked; Save closed with focus return to Edit profile; Usage Cancel closed. |
| SearchFilter | Docs, Selected actual options, Empty Results actual options, All sizes, Search Modes, States, v1 vs v2, Usage | Selected option used primary text; ordinary choices secondary; empty-results message muted12px/400; Sales team selection updated value Control and conversation result. |
| ReadableField | Docs, All variants, States, v1 vs v2, Usage, Secret | Regenerate synchronized value Control to example_key_generation_2; Show value revealed the actual secret. |
| Typography | Docs, Overview, All variants, All sizes, All colors, States, v1 vs v2, Usage | Editable children Control changed actual body text to Softer text hierarchy; Usage expanded guidance; actual All colors samples measured the four neutral colors and preserved semantic/inverted palettes. |
| Panel | Docs, All sizes, All compositions, States, v1 vs v2, Usage | Name Control changed field; typing changed Control; Save reflected that name; Escape collapsed to zero width; workspace button reopened the panel. |

Typography's native color select did not respond to the browser automation's keyboard selection in this pass; no successful color-Control change is claimed. All color variants were rendered and measured directly, and the editable text Control was exercised successfully. This is a verification limitation, not an observed component defect.

### Containment

Every reviewed page remained 1620px wide without document-level horizontal overflow. Wide matrices scroll inside their own containers:

- Dialog All sizes: local 1588px viewport / 3464px content.
- FormModal All sizes: local 1588px / 3664px.
- ConfirmationModal States: local 1588px / 1792px.
- DeleteConfirmationModal States: local 1588px / 1672px.
- Panel sizes: internal panel widths remained 280px, 320px and 400px; outer page and gallery stayed contained.

### V1 comparison preservation

All eleven comparison stories were reviewed. For example, v1 modal titles remained `#181D25`/600 beside v2 `#484848`/500. The Dropdown section label remained v1 `#343E55`/600 beside v2 `#484848`/500. Conditional comparison composition retains original v1 neutral classes and weights; v1 sources were not edited by this pass.

## Issues found and fixed during review

1. The inline v2 Toast gallery action was still 400 while the real ToastAction was 500. It now matches; the final comparison action measured 500. The v1 branch remains unchanged.
2. Three Docs tables described the wrong text roles: Dropdown ordinary choices, SearchFilter ordinary versus selected choices, and ReadableField label/value. Rows now identify primary, secondary and supporting text correctly, with rendered color values rechecked.
3. Browser default styling made six Usage definition labels 700: two Dropdown preferences and four FormModal summary labels. Explicit medium weight now produces 500 in the browser.

No additional rendering defect was found in the final gallery and comparison pass.

## Local verification and preservation

- 296 existing tests passed across the eleven component test files: Typography 70, Dialog 27, Tooltip 20, DropdownMenu 34, SearchFilter 23, ReadableField 19, Toast 31, ConfirmationModal 20, DeleteConfirmationModal 21, Panel 19 and FormModal 12.
- Scoped source/story/test lint and formatting passed; story-inclusive TypeScript checks passed. Final story-only table/label corrections also passed focused lint, formatting and TypeScript checks.
- Existing neutral-class assertions were updated only where the new palette changed their expectations. No new tests were added to mirror reversible styling changes.
- User-added Interaction/Keyboard story exports for Dialog, ConfirmationModal and DeleteConfirmationModal, and ReadableField Interaction, were checked against the pre-edit snapshot for AST equivalence. The later table/label corrections are outside those exports.
- No commits, pushes or publishing were performed.

## Console observations

The final restarted preview produced an empty error log during the final comparison/size/search-result checks. This is not a claim that the entire development session had zero errors.

Earlier, while the production build was rewriting the generated token JSON, the design-token manager addon emitted `SyntaxError: Unterminated string in JSON` at positions 2359296, 14155776 and 21233664 from `fetchTokenFiles` in `storybook-design-token-8/manager-bundle.js`. The parent agent identified that as a development artifact race and owns final generated-JSON/static-preview validation. Earlier valid-story indexing errors were cleared by restarting the shared development server. One browser extension emitted `Could not establish connection. Receiving end does not exist.` No new component action-serialization failure was observed during this review.

## Evidence

- [Raw browser measurements](review/text-hierarchy-overlays/measurements.json)
- [Dialog before](review/text-hierarchy-overlays/dialog-before.png), [actual Dialog after](review/text-hierarchy-overlays/dialog-after.png), [corner close hidden](review/text-hierarchy-overlays/dialog-close-hidden.png)
- [Actual Dropdown](review/text-hierarchy-overlays/dropdown-portal.png), [selected checkbox](review/text-hierarchy-overlays/dropdown-checkbox-selected.png), [final Usage labels](review/text-hierarchy-overlays/dropdown-menu-usage.png)
- [Actual Confirmation](review/text-hierarchy-overlays/confirmation-portal.png), [actual Delete](review/text-hierarchy-overlays/delete-portal.png), [actual Form](review/text-hierarchy-overlays/form-portal.png), [final Form Usage labels](review/text-hierarchy-overlays/formmodal-usage.png)
- [Actual Toast](review/text-hierarchy-overlays/toast-default-portal.png), [Toast Usage](review/text-hierarchy-overlays/toast-usage-open.png), [final Toast comparison](review/text-hierarchy-overlays/toast-v-1-vs-v-2.png)
- [Titled Tooltip](review/text-hierarchy-overlays/tooltip-title.png), [tour](review/text-hierarchy-overlays/tooltip-tour.png), [sides and offsets](review/text-hierarchy-overlays/tooltip-all-positions.png)
- [Selected SearchFilter](review/text-hierarchy-overlays/search-selected.png), [actual empty results](review/text-hierarchy-overlays/search-empty-portal.png), [ReadableField Usage](review/text-hierarchy-overlays/readable-usage.png)
- [Typography colors](review/text-hierarchy-overlays/typography-all-colors.png), [edited Typography Control](review/text-hierarchy-overlays/typography-control.png), [Panel Usage](review/text-hierarchy-overlays/panel-usage.png), [Panel widths](review/text-hierarchy-overlays/panel-sizes.png)

The evidence folder also contains individual Docs/table screenshots and the other variant/state/comparison views listed above. These are local browser evidence; they do not establish a published package or deployed product result.
