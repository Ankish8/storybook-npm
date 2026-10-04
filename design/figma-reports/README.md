# v2 UI refresh: Figma change reports (2026-10-04)

Every component below changed visually or interactively. Each folder has a `REPORT.md` with before/after screenshots, the **measured** style changes (px, hex, ms, taken from the rendered component) and numbered **Figma steps**.

v2 stays a drop-in for v1: no existing prop, callback, aria-label or DOM contract changed (`npm run verify:v1-v2-compat`). Items marked **new variant** need a new Figma variant or property, not just a value edit.

| Component | What changed | New in Figma | Report |
| --- | --- | --- | --- |
| Alert | The close button now has a 24px target around a 16px icon (it was a 20px box holding a 20px icon). | values only | [alert/REPORT.md](alert/REPORT.md) |
| Avatar | Two additive changes. A failing image URL now falls back to the custom content or initials, exactly like an avatar with no src (before, the browser's broken-image glyph and alt text showed inside the circle); nothing changes while the image loads. | new variant / property | [avatar/REPORT.md](avatar/REPORT.md) |
| Badge | New optional `dot` prop: a 7px status dot before the label in the badge's own text colour, so the dot always matches the variant. | new variant / property | [badge/REPORT.md](badge/REPORT.md) |
| Checkbox | Checking a box now feels physical: the tick is drawn in, the box pops from 70% to full size, and pressing squeezes it to 96%. | new variant / property | [checkbox/REPORT.md](checkbox/REPORT.md) |
| CreatableMultiSelect | The open field keeps its teal focused look while the panel is open. The chip remove button now shows a visible neutral hover plate (it was #F5F5F5 on a #F5F5F5 chip, so nothing showed) with a 24px hit area. | new variant / property | [creatable-multi-select/REPORT.md](creatable-multi-select/REPORT.md) |
| CreatableSelect | The open field keeps its teal focused look even while the pointer is over the list or focus leaves the input. | new variant / property | [creatable-select/REPORT.md](creatable-select/REPORT.md) |
| DateRangePicker | The range now reads as one continuous pill instead of squared bars per week row, and choosing the end date shows a lighter dashed preview that follows the pointer or keyboard focus. | values only | [date-range-picker/REPORT.md](date-range-picker/REPORT.md) |
| DateTimePicker | The time dropdown no longer clips its first row: each Hours / Minutes / AM-PM list opens with the selected row centred (so the three selected rows line up across the panel), fades 12px at both edges, and lets the first and last row reach the centre. | values only | [date-time-picker/REPORT.md](date-time-picker/REPORT.md) |
| Dialog (+ ConfirmationModal, DeleteConfirmationModal, FormModal) | A tall dialog no longer scrolls its title, close button and actions out of sight: the header and the footer stay pinned while the body scrolls, and the footer shows a divider (with 16px of breathing room above the buttons) only while content is hidden benea... | new variant / property | [dialog/REPORT.md](dialog/REPORT.md) |
| DropdownMenu | Menu rows are now 4px-radius pills concentric with the 8px menu (they were square). | new variant / property | [dropdown-menu/REPORT.md](dropdown-menu/REPORT.md) |
| EmptyState | EmptyState gains an optional size='sm' for cards, side panels and table bodies: 48px icon tile, 16px title, 14px description and 16px padding. | new variant / property | [empty-state/REPORT.md](empty-state/REPORT.md) |
| FileUpload | Dragging a file over the drop zone no longer flickers when the pointer crosses the icon and text, and when the browser can tell the dragged type will not be accepted (MIME-only accept such as image/* or application/pdf) the zone turns red instead of invitin... | new variant / property | [file-upload/REPORT.md](file-upload/REPORT.md) |
| MultiSelect | The trigger keeps its focused look while the list is open, even when focus moves into the search field or a row. | new variant / property | [multi-select/REPORT.md](multi-select/REPORT.md) |
| NumberStepField | The two stepper chevrons were 12 x 12px targets. Each is now a half-height tile, 24 x 19px, with a neutral grey hover fill, so it is easy to hit and shows what will be pressed; at rest it still looks like two bare chevrons. | values only | [number-step-field/REPORT.md](number-step-field/REPORT.md) |
| OtpInput | Typing a digit now fades and grows it into its slot (180ms) instead of appearing, and when a code is rejected the slots turn red and shake sideways once (4px, 3 cycles, 300ms). | values only | [otp-input/REPORT.md](otp-input/REPORT.md) |
| Pagination | Page links now keep digits the same width while paging, every link presses to 97% and returns in 180ms (Previous/Next used 98% and 200ms), and the hover fill no longer sticks after a tap on touch screens. | values only | [pagination/REPORT.md](pagination/REPORT.md) |
| PhoneInput | The country button now shows a visible keyboard focus ring (it had none: the whole field only glowed teal). | new variant / property | [phone-input/REPORT.md](phone-input/REPORT.md) |
| ProgressIndicator | The indeterminate linear bar now slides: a 30%-wide bar travels across the track in 1.5s on an ease-in-out curve, instead of a stationary 30% bar that pulsed (which read as "30% done"). | new variant / property | [progress-indicator/REPORT.md](progress-indicator/REPORT.md) |
| Radio | The radio gets the same tactile treatment as the checkbox: the dot grows from the centre (6px, or 8px while pressed), the circle squeezes to 96% on press, and the pointer target is 24 x 24. | new variant / property | [radio/REPORT.md](radio/REPORT.md) |
| ReadableField | Copying now has real feedback: the Copy icon cross-fades into a green check (180ms), the change is announced to screen readers, and if the browser refuses the copy the icon turns into a red cross for 2 seconds and the value is selected so Cmd/Ctrl+C works. | new variant / property | [readable-field/REPORT.md](readable-field/REPORT.md) |
| SearchFilter | The search field keeps its teal focused look while the list is open, even when you Tab into a row. | new variant / property | [search-filter/REPORT.md](search-filter/REPORT.md) |
| Select | The trigger keeps its teal focused look for as long as the list is open (before it fell back to grey the moment focus moved into the list). | new variant / property | [select/REPORT.md](select/REPORT.md) |
| SelectField | SelectField inherits the Select refresh: the field keeps its teal focused look while the list is open, rows are 4px-radius, and the selected check pops in. | values only | [select-field/REPORT.md](select-field/REPORT.md) |
| Skeleton | Skeleton keeps today's soft pulse by default and gains an optional animation prop: 'shimmer' sweeps a soft white highlight across the placeholder (1.6s, linear, repeating), 'none' is a static fill. | values only | [skeleton/REPORT.md](skeleton/REPORT.md) |
| Switch | The switch track squeezes to 96% when pressed, hover only applies on devices that can hover, and the invisible pointer target is now 44 x 28 for the default size (4px of padding on every side). | new variant / property | [switch/REPORT.md](switch/REPORT.md) |
| Table | Selected rows now read as selected (light blue #ECF1FB) instead of looking identical to hover (#F5F5F5). | new variant / property | [table/REPORT.md](table/REPORT.md) |
| Tabs | TabsList gains an optional variant. "underline" (default) renders exactly what it did before. | new variant / property | [tabs/REPORT.md](tabs/REPORT.md) |
| Tag | The dismiss (x) button now has a 24px hit area around the unchanged 12px icon, a neutral 18px hover plate, and its own focus ring instead of the browser default. | new variant / property | [tag/REPORT.md](tag/REPORT.md) |
| TextField (with the shared Textarea and PhoneInput message reveal) | A validation or helper message that appears after the field is on screen now glides open (height, 240ms spring) instead of popping in and shoving everything below it down; the text fades in with a 2px slide, and under reduced motion the height snaps and onl... | new variant / property | [text-field/REPORT.md](text-field/REPORT.md) |
| Tooltip | The pale tooltip now has a 1px inset edge so it no longer melts into a white page. | values only | [tooltip/REPORT.md](tooltip/REPORT.md) |

## Cross-cutting

- **Entry animations now actually move.** `motion-safe:animate-in` used to cancel the fade/zoom/slide values next to it, so overlays appeared instantly. They now fade and scale (dialog 220ms 0.98 to 1 plus a 4px slide; popovers 200ms; month change 200ms). Figma prototypes should use: spring ease `cubic-bezier(0.22, 1, 0.36, 1)`, opacity 0 to 100, scale 98 to 100.
- **Hover is gated for touch** (`@media (hover:hover)`): hover variants apply to pointer devices only.
- **Focus ring** (one style everywhere): 2px solid #343E55, offset 1px outside the shape.
- **Before baselines** of all 56 components: `baseline-2026-10-04/`.
- **How these were produced:** `design/verify/capture.mjs` (screenshots + computed styles in headless Chrome with real input) and `design/verify/figma-report.mjs` (diff into REPORT.md).
