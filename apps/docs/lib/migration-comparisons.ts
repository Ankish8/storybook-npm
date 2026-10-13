import { earlierV2Slugs } from "./migration-history.mjs";

export type LegacyComparison = {
  slug: string;
  label: string;
  story: string;
  adapted?: boolean;
};
export type MigrationInfo = {
  notes: string[];
  counterparts: LegacyComparison[];
};

/** These are actual frozen earlier-v2 implementations, never a v1 substitute. */
export const earlierV2Comparisons = Object.fromEntries(
  earlierV2Slugs.map((slug) => [slug, { story: "Overview" }])
) as Record<string, { story: string }>;
const legacy = (
  slug: string,
  story = "Overview",
  label = slug
): LegacyComparison => ({ slug, story, label });
const retained = (
  slug: string,
  notes: string[],
  story = "Overview"
): MigrationInfo => ({ notes, counterparts: [legacy(slug, story)] });
const addition = (...notes: string[]): MigrationInfo => ({
  notes,
  counterparts: [],
});

/** Audited against actual legacy sources, not the frozen pre-refresh v2 review images. */
export const migrationComparisons: Record<string, MigrationInfo> = {
  button: retained(
    "button",
    [
      "The variant, size, icon, loadingText and forwarded-ref APIs remain. Native buttons are disabled while loading in both versions; aria-busy is additional feedback in v2.",
      "V2 changes typography, corners, state transitions and loading/success presentation. It retains the Lucide loading SVG contract; the shared example below uses the original props.",
    ],
    "Overview"
  ),
  "action-button": addition(
    "ActionButton is a v2 addition, with pending/success feedback. There is no legacy ActionButton module to migrate. Existing Button loading usage is a separate API."
  ),
  "split-button": addition(
    "SplitButton is a v2 addition composed with Button and DropdownMenu. Legacy Button or menu compositions are not a same-contract SplitButton counterpart."
  ),
  modal: {
    counterparts: [
      legacy("dialog", "Default", "Dialog parts"),
      legacy("confirmation-modal", "WithTrigger", "Confirmation modal"),
      legacy("delete-confirmation-modal", "WithTrigger", "Delete confirmation"),
      legacy("form-modal", "Default", "Form modal"),
    ],
    notes: [
      "Dialog, FormModal, ConfirmationModal and DeleteConfirmationModal exports migrate to ui/v2/modal; the four unchanged legacy examples can be selected below.",
      "Legacy Dialog keeps its size and hideCloseButton behavior. FormModal keeps its default small size, first-field focus and onSave contract. Confirmation and delete flows keep their legacy wrappers and callbacks.",
      "Adopting the new all-in-one Modal names is a separate step: onSave becomes onConfirm, and delete confirmText becomes requireText. The all-in-one confirmation flow has no top-right close button unless showCloseButton is passed. Dialog and FormModal retain their own close-button defaults.",
    ],
  },
  checkbox: retained(
    "checkbox",
    [
      "Checkbox keeps checked/defaultChecked, indeterminate state, label placement and onCheckedChange. Card treatments, descriptions, errors and compound parts are additions.",
      "Radio and RadioGroup are v2 additions in the same module; this v1 comparison is specifically Checkbox, not a legacy Radio implementation.",
    ],
    "Controlled"
  ),
  "creatable-multi-select": retained("creatable-multi-select", [
    "The existing options, value/change and create-option contracts remain. V2 restyles the field, chips and anchored menu.",
    "Invalid ARIA state is reflected in the v2 field styling. New option creation and selection remain application-controlled; this block retains its legacy composed API.",
  ]),
  "creatable-select": retained("creatable-select", [
    "The existing option/value and inline creation callbacks remain. V2 refreshes field, dropdown and option typography.",
    "V2 adds accessible invalid-state feedback. This is a legacy product composition now grouped under Blocks, not a new replacement API.",
  ]),
  "date-range-picker": retained(
    "date-range-picker",
    [
      "Preset, value/defaultValue, bounds, disabling and clearing props remain. The legacy controlled example is replayed below.",
      "V2 changes field/calendar geometry, range preview and selection motion. It adds invalid-state styling and aria-current on the selected preset; external date values remain caller-owned.",
    ],
    "Controlled"
  ),
  "date-time-picker": retained("date-time-picker", [
    "Date/time modes, value changes, bounds, step settings and native field attributes remain.",
    "V2 refreshes the calendar and time columns, with arrow/Home/End navigation within a column and visible invalid-state feedback. Date values remain the application's responsibility.",
  ]),
  "file-upload": addition(
    "Inline FileUpload is a v2 addition. V1's custom FileUploadModal is a different modal composition, not the same API; keep that custom flow or adopt the inline value/file callbacks explicitly."
  ),
  input: retained("input", [
    "Native input props and the forwarded input ref remain. The legacy 42px field becomes a 44px v2 field, with 8px corners instead of 4px.",
    "V2 refreshes value/placeholder typography and validation styling. Number-input exponent guarding and caller event cancellation remain available.",
  ]),
  "multi-select": retained(
    "multi-select",
    [
      "Options, selections, grouping, limits and change callbacks remain. V2 refreshes selected chips and the anchored option menu.",
      "Chip removal crosses are pointer-only; keyboard users remove the last value with Backspace/Delete on the trigger or toggle a list item. Clear all is a separate native button. Escape in the open list dismisses it; the trigger's closeOnEscape setting remains distinct.",
    ],
    "Controlled"
  ),
  "number-step-field": retained("number-step-field", [
    "Value, min/max/step, suffix and onValueChange remain. V2 adds keyboard stepping and press-and-hold repetition.",
    "An out-of-range typing draft is clamped on blur or Enter rather than every keystroke; an empty draft restores the previous value. Steppers stay outside the Tab order and use field-aware accessible names. Coarse-pointer sizing is larger.",
  ]),
  "otp-input": {
    counterparts: [
      {
        ...legacy("login-otp-input", "Overview", "Legacy Login OTP"),
        adapted: true,
      },
    ],
    notes: [
      "V2 OTP is a separate UI module. The actual v1 counterpart is custom/login/OtpInput, not a v1 ui/otp-input module.",
      "This comparison explicitly maps legacy onChange to onValueChange, hasError to error and ariaLabel to aria-label. V1 accepts arbitrary length; v2 supports 4 or 6. V1 autofocus defaults true; v2 defaults false. The shared example explicitly disables autofocus and uses four digits.",
    ],
  },
  "phone-input": retained(
    "phone-input",
    [
      "countryIso, countryCode, countryFlag, national-digit value/change events and onCountryClick remain. The legacy form below owns its state.",
      "The built-in anchored searchable countrySelector is opt-in and defaults false. V2 sanitizes formatted national-number paste before applying the digit limit; international + prefixed values are not automatically converted.",
      "The clickable country area is an accessible button in v2. A disabled field no longer fires onCountryClick; this is an intentional accessibility difference.",
    ],
    "InForm"
  ),
  "readable-field": retained(
    "readable-field",
    [
      "Copy, secret masking, header actions and existing value props remain. V2 updates the field surface and typography.",
      "This existing product pattern is organized under Blocks; moving it in the docs does not remove its source or CLI entry.",
    ],
    "EndpointDetailsLayout"
  ),
  "search-filter": retained("search-filter", [
    "Options, query, minimum-search-length and selection callbacks remain. V2 composes its field and menu with the updated Input and dropdown styling.",
    "Both versions can be opened and searched below. This is an existing product block, not an automatic replacement for SelectField.",
  ]),
  select: {
    counterparts: [
      legacy("select", "Overview", "Select primitives"),
      legacy("select-field", "Controlled", "Complete SelectField"),
    ],
    notes: [
      "Select primitives and the composed SelectField now share ui/v2/select. The ui/v2/select-field adapter and v2-select-field CLI entry remain supported.",
      "Both legacy contracts are replayed below. Existing value/open, option groups, search, validation and viewport callbacks remain; V2 updates popup placement, typography and selection transitions.",
      "The trigger changes from 42px/4px corners to 44px/8px. Invalid-state styling and searchable keyboard navigation are improved; choosing the new complete-field API is optional.",
    ],
  },
  "select-field": {
    counterparts: [
      legacy("select-field", "Controlled", "Complete SelectField"),
    ],
    notes: [
      "SelectField is a compatibility adapter for ui/v2/select. Its old source/install path remains; its docs live on the canonical Select page.",
      "Existing options, selection, validation, search and paging callbacks remain. The comparison replays the actual unchanged legacy SelectField story.",
    ],
  },
  switch: retained(
    "switch",
    [
      "Controlled/uncontrolled checked state, labels, label position, sizes and onCheckedChange remain.",
      "V2 refreshes the track/thumb, focus ring and finite toggle animation; description is additive. The legacy controlled switch can be toggled below.",
    ],
    "Controlled"
  ),
  "text-field": retained(
    "text-field",
    [
      "Labels, validation, prefix/suffix, icons, clear actions and character counters remain. V2 changes the default field from 42px to 44px and uses 8px corners.",
      "returnFocusOnClear is opt-in and defaults false. V2 preserves IME drafts and normalizes committed consecutive spaces, while animating supporting-message changes.",
    ],
    "Controlled"
  ),
  textarea: retained(
    "textarea",
    [
      "Labels, rows, resize, validation and character-count APIs remain. V2 adds the lg size and an optional autoResize mode; autoResize defaults false.",
      "The native maxLength remains a hard limit unless enforceMaxLength=false. V2 preserves IME drafts and normalized text; optional minRows/maxRows bound automatic growth.",
    ],
    "WithLabel"
  ),
  breadcrumbs: addition(
    "Breadcrumbs is a v2 addition. Links, overflow navigation and current-page behavior have no same-named v1 component to replay."
  ),
  "dropdown-menu": retained("dropdown-menu", [
    "The Radix root, item, checkbox, radio, submenu and keyboard-navigation exports remain.",
    "V2 refreshes neutral surfaces, row spacing and popup motion. Destructive items are additive; consumer selection cancellation remains respected.",
  ]),
  pagination: retained(
    "pagination",
    [
      "Composable page links and PaginationWidget retain the legacy page/change, bounds and item-count contracts.",
      "The optional pageWindow adds a horizontally moving numbered range; leaving it unset keeps the legacy ellipsis calculation. Selected pages use the primary dark surface and inverted text; fine-pointer hover uses the primary hover surface for clearer contrast.",
    ],
    "Widget"
  ),
  stepper: addition(
    "Stepper is a v2 addition with horizontal/vertical orientation and completed-step animations. Restricted completed-step navigation is opt-in; there is no legacy Stepper story."
  ),
  tabs: retained("tabs", [
    "Radix controlled/uncontrolled selection, orientation, disabled tabs, counts and full-width layout remain.",
    "The underline variant remains the default. The pill treatment is optional; V2 animates the active indicator and keeps reduced-motion and keyboard behavior.",
  ]),
  alert: retained(
    "alert",
    [
      "Variants, title/description, icons, actions and controlled/local dismissal remain. V2 uses a compact neutral composition with status concentrated in the icon.",
      "Header and overlay presentations are additions. Dismissal still removes the DOM immediately by default; animateExit=true opts into the short inert, aria-hidden exit fade.",
    ],
    "ControlledVisibility"
  ),
  badge: retained("badge", [
    "The original variants, sizes, native/Slot attributes and ref forwarding remain. V2 changes spacing and text treatment.",
    "Badges have no hover movement. Status changes can animate within a caller-owned approval workflow; optional dot content is additive.",
  ]),
  "bouncing-loader": retained("bouncing-loader", [
    "Dot size, spacing, color, attributes and the bouncing-loader/bouncing-loader__dot CSS hooks remain.",
    "V2 refines the loading rhythm and respects reduced motion; it remains a separate lightweight loading primitive.",
  ]),
  "empty-state": retained("empty-state", [
    "The existing icon, title, description and actions API remains. V2 adds reusable illustration scenes and a compact size.",
    "No-results/offline/caught-up/not-found illustrations are opt-in. The separate EmptyStates block composes this component; existing EmptyState code need not adopt that block.",
  ]),
  "empty-states": addition(
    "EmptyStates is a new v2 block composed from EmptyState, Tabs and Button. V1 EmptyState is a smaller existing component, not the same tabbed-block API; it has its own live comparison page."
  ),
  "progress-indicator": addition(
    "ProgressIndicator has no v1 UI source or export. Its existing v2 bar, circle and semi-circle APIs remain; the docs lead with the linear bar without removing circular shapes."
  ),
  "shimmering-text": addition(
    "ShimmeringText has no v1 UI source, root export or CLI entry. Its existing v2 install/source path is retained, while discovery is hidden; Spinner, Skeleton and Progress indicator remain the main loading choices."
  ),
  skeleton: retained("skeleton", [
    "Shape, dimensions, variant and caller styles remain. Pulse is the default animation; shimmer and none are optional additions.",
    "V2 honors reduced motion and caller-provided animation styles while keeping placeholders decorative unless the caller supplies loading semantics.",
  ]),
  spinner: retained("spinner", [
    "The original size/variant, native attributes and ref contract remain. V2 refines the indicator and supports a readable accessible loading label.",
    "Use one meaningful loading announcement in a composition; reduced motion removes continuous rotation.",
  ]),
  tag: retained("tag", [
    "Label/prefix, icon, variants, sizes, onClose and TagGroup remain. V2 updates intrinsic spacing and long-label wrapping.",
    "Removal stays caller-owned and respects preventDefault. The tag does not automatically remove itself or move focus after onClose.",
  ]),
  toast: retained(
    "toast",
    [
      "ToastProvider, primitives, Toaster, toast() and useToast() remain. The default managed list is retained; <Toaster stack /> opts into layered notifications.",
      "V2 uses neutral notification surfaces with status in the icon. Expanded stacks show every queued item; visibleToasts only limits collapsed layers. Hover/focus pauses timers, and touch/keyboard users can keep the stack expanded.",
      "Actions, close, Escape and swipe cancellation remain effective. Persistent notifications can still be dismissed; the legacy helper's queue and delayed removal remain separate from Radix's visible-duration timer.",
    ],
    "Playground"
  ),
  tooltip: retained(
    "tooltip",
    [
      "Provider, root, trigger, content, arrow, placement, offsets and controlled-open APIs remain.",
      "V2 uses a compact neutral tooltip and subtle entry/exit motion. Keyboard focus still opens help; touch interactions avoid a lingering hover tooltip.",
    ],
    "Default"
  ),
  accordion: retained(
    "accordion",
    [
      "Single/multiple selection, default/controlled values, disabled items, bordered treatment and chevron settings remain.",
      "V2 refreshes row surfaces, focus feedback and height/chevron transitions; reduced motion removes the spatial transition.",
    ],
    "Controlled"
  ),
  avatar: retained("avatar", [
    "Name/initials, image, custom content, size/variant and presence APIs remain. outline and AvatarGroup are additions.",
    "Failed images fall back to initials. The default accessible label keeps the legacy identity; presence is described separately. Documentation portrait URLs do not ship as component defaults.",
  ]),
  "page-footer": addition(
    "PageFooter is a v2 product block. There is no corresponding legacy UI module; its supporting text/actions and responsive layout are a new composition."
  ),
  "page-header": retained("page-header", [
    "Title, description, back navigation, badge and action props remain. V2 updates the responsive composition and typography.",
    "The existing page-chrome component is now grouped under Blocks. Its source/CLI path remains page-header.",
  ]),
  panel: retained("panel", [
    "Open/collapsed state, sizes, header/body/footer and forwarded DOM attributes remain.",
    "V2 improves finite slide/fade motion, scroll containment and keyboard focus around nested dialogs. Closed content is inert; the application continues to own the panel state.",
  ]),
  scrollbar: addition(
    "Scrollbar has no legacy UI counterpart. It is a v2 native scroll viewport with a draggable rail and optional arrows; native wheel, touch and keyboard scrolling remain available."
  ),
  table: retained("table", [
    "Table parts, density, loading/empty rows, wrapping, sticky cells and row controls remain. V2 restyles header/cells and adds a contained horizontal scroll frame.",
    "Native sort buttons, immutable useTableSort and stickyHeader are additive. TableBody animateRows is opt-in and defaults false, so existing composed rows keep their default lifecycle.",
  ]),
  typography: retained("typography", [
    "The Typography kind, variant, color and native-element APIs remain. V2 refreshes the type hierarchy and neutral text treatment.",
    "Typography is hidden from component discovery and its old page redirects to Foundations. Its source and CLI entry remain; this comparison replays the actual legacy Typography story.",
  ]),
  "ui-card": addition(
    "UiCard was introduced in v2; it has no v1 UI module. The docs title is Card, while its ui-card import/install path remains.",
    "Existing v2 parts and default/template/icon/action/metrics variants remain. Cards have no hover lift; nested controls keep independent actions. MetricCard is a separate new component."
  ),
  "metric-card": addition(
    "MetricCard is a new v2 component, distinct from UiCard's existing metrics composition. Label/value, independently chosen trend direction/tone and graphic/footer slots are its own API; formatted strings are not parsed as numbers."
  ),
  "contact-list-item": retained(
    "contact-list-item",
    [
      "Identity, subtitle, selected state, trailing content and native row behavior remain. V2 refreshes spacing, avatars and keyboard focus treatment.",
      "The same existing conversation row is grouped under Blocks; it is not a replacement for the custom ChatListItem composition.",
    ],
    "Default"
  ),
  "date-divider": retained("date-divider", [
    "The existing date-label API remains. V2 changes neutral text, divider styling and spacing.",
    "It is the same timeline building block, now listed under Blocks.",
  ]),
  "image-media": retained("image-media", [
    "Image source, alt text, maximum height and native image attributes remain. V2 refreshes the media frame.",
    "Alt text remains caller-owned; the docs grouping under Blocks does not change the API.",
  ]),
  "reply-quote": retained("reply-quote", [
    "Sender, message, thumbnail and click/keyboard callbacks remain. Both versions use their actual implementation below.",
    "V2 refreshes quote geometry and neutral text; an interactive quote retains its native button behavior. The prefix difference requires both stylesheet outputs in a mixed-version host.",
  ]),
  "system-message": retained("system-message", [
    "Message text and emphasized phrases remain. V2 changes type treatment and timeline spacing.",
    "This existing timeline composition is grouped under Blocks; application event text remains caller-owned.",
  ]),
  "unread-separator": retained("unread-separator", [
    "Count, custom label and singular/plural text remain. V2 refreshes the line and label styling.",
    "The timeline block keeps its existing source/install path and caller-controlled unread count.",
  ]),
};

export function migrationMarkdown(info: MigrationInfo): string {
  return (
    "## What changes from v1\n\n" +
    info.notes.map((note) => `- ${note}`).join("\n\n") +
    "\n"
  );
}

/** Replace old hand-written numeric comparisons and generic migration claims in the page, retaining other docs. */
export function auditedMigrationDocs(text: string, info: MigrationInfo) {
  const section =
    /\n## (?:What changes from v1|Design specification)[\s\S]*?(?=\n## |$)/i;
  const cleaned = text.replace(
    / \*\*v2 design\*\* — existing v1 props remain available, so moving a screen starts with an import-path change\./g,
    ""
  );
  const match = section.exec(cleaned);
  const before = match ? cleaned.slice(0, match.index) : cleaned;
  const after = match ? cleaned.slice(match.index + match[0].length) : "";
  return {
    before,
    after,
    full: before + "\n\n" + migrationMarkdown(info) + "\n" + after,
  };
}
