type PageTreeNode = {
  type: "page" | "separator" | "folder";
  name: string;
  url?: string;
  description?: string;
  children?: PageTreeNode[];
};
type Root = { name: string; children: PageTreeNode[] };

export const categories = [
  { id: "actions", title: "Actions" },
  { id: "forms", title: "Forms" },
  { id: "navigation", title: "Navigation" },
  { id: "feedback", title: "Feedback" },
  { id: "cards", title: "Cards" },
  { id: "layout", title: "Layout and content" },
  { id: "app-shell", title: "App shell" },
  { id: "chat", title: "Chat" },
] as const;

export type ComponentCategory = (typeof categories)[number]["id"];

export interface ComponentEntry {
  slug: string;
  title: string;
  category: ComponentCategory;
  description: string;
  /**
   * A block is a ready-made piece of product UI, not a building block. It is listed under Blocks and lives at
   * `/blocks/<slug>`; its source file, story and CLI key (`v2-<slug>`) are exactly those of a component.
   */
  kind?: "block";
  /** Slugs shown under Related; defaults to the other entries in the same category. */
  related?: string[];
  /** Compatibility entry whose docs live with the canonical component. */
  aliasOf?: string;
  /** Retained source/install entry that is omitted from discovery. */
  hidden?: boolean;
}

// The v2 CLI registry and each component's story summary define this catalog.
// Keep plain data here: the page tree and component entries also reach the client.
export const components: ComponentEntry[] = [
  {
    slug: "button",
    title: "Button",
    category: "actions",
    description:
      "Buttons trigger actions or events, with variants, sizes, icons and loading states.",
  },
  {
    slug: "action-button",
    title: "Action button",
    category: "actions",
    description:
      "Run a task with animated pending and success feedback, and an automatic return to idle.",
  },
  {
    slug: "split-button",
    title: "Split button",
    category: "actions",
    description:
      "A main action joined to a dropdown of related alternatives, with shared Button styling and keyboard navigation.",
  },
  {
    slug: "modal",
    title: "Modal",
    category: "actions",
    description:
      "The one modal: dialogs, forms, confirmations and type-to-confirm, as shadcn-style parts or one all-in-one component.",
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    category: "forms",
    description:
      "Checkboxes and radios in one family: single or grouped, with labels, descriptions, errors and selectable cards.",
  },
  {
    slug: "creatable-multi-select",
    title: "Creatable multi-select",
    category: "forms",
    description:
      "A searchable multi-select with selected chips and inline option creation.",
    kind: "block",
    related: ["creatable-select", "multi-select", "select-field", "text-field"],
  },
  {
    slug: "creatable-select",
    title: "Creatable select",
    category: "forms",
    description:
      "A searchable single-select with existing options and inline option creation.",
    kind: "block",
  },
  {
    slug: "date-range-picker",
    title: "Date range picker",
    category: "forms",
    description:
      "Choose a preset or a start and end date with a calendar and range preview.",
  },
  {
    slug: "date-time-picker",
    title: "Date-time picker",
    category: "forms",
    description:
      "A typed date/time field with calendar and time-column selection.",
  },
  {
    slug: "file-upload",
    title: "File upload",
    category: "forms",
    description:
      "Native file selection and drag-and-drop with validation and removable file rows.",
  },
  {
    slug: "input",
    title: "Input",
    category: "forms",
    description:
      "A single-line field for text and numbers with native input attributes.",
  },
  {
    slug: "multi-select",
    title: "Multi-select",
    category: "forms",
    description:
      "A multi-select with chips, search, detailed/grouped rows, select-all, selection limits and a portal menu that works inside dialogs.",
  },
  {
    slug: "number-step-field",
    title: "Number step field",
    category: "forms",
    description:
      "A constrained numeric field with custom step controls and a unit suffix.",
  },
  {
    slug: "otp-input",
    title: "OTP input",
    category: "forms",
    description:
      "Digit-by-digit verification code entry with paste and keyboard navigation.",
  },
  {
    slug: "phone-input",
    title: "Phone input",
    category: "forms",
    description:
      "A numeric phone field with a country-code area, flag and accessible validation.",
  },
  {
    slug: "readable-field",
    title: "Readable field",
    category: "forms",
    description:
      "Read-only values with copy, secret masking and an optional header action.",
    kind: "block",
  },
  {
    slug: "search-filter",
    title: "Search filter",
    category: "forms",
    description:
      "A searchable single-select field for phone numbers or text lists, composed with the v2 Input and dropdown row styling.",
    kind: "block",
  },
  {
    slug: "select",
    title: "Select",
    category: "forms",
    description:
      "One Select family: a complete labelled field or composable Radix primitives, with search, groups, validation and paging.",
  },
  {
    slug: "select-field",
    aliasOf: "select",
    title: "Select field",
    category: "forms",
    description:
      "A complete labelled select with live search, grouping, validation, action items and viewport pagination.",
  },
  {
    slug: "switch",
    title: "Switch",
    category: "forms",
    description: "A compact toggle for a setting that has on and off states.",
  },
  {
    slug: "text-field",
    title: "Text field",
    category: "forms",
    description:
      "A labelled single-line field with validation, icons, prefixes, suffixes, a counter and a clear action.",
  },
  {
    slug: "textarea",
    title: "Textarea",
    category: "forms",
    description:
      "A multiline field with labels, validation, character counts and native resizing.",
  },
  {
    slug: "breadcrumbs",
    title: "Breadcrumbs",
    category: "navigation",
    description:
      "Ancestor links, a current page and optional overflow navigation.",
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown menu",
    category: "navigation",
    description:
      "Keyboard-accessible action menus with independent choices, single choices and nested actions.",
  },
  {
    slug: "pagination",
    title: "Pagination",
    category: "navigation",
    description:
      "Page navigation with a ready-to-use widget or composable links, ellipses and an optional item range.",
  },
  {
    slug: "stepper",
    title: "Stepper",
    category: "navigation",
    description:
      "Progressive steps with numbered or icon markers in horizontal and vertical layouts.",
  },
  {
    slug: "tabs",
    title: "Tabs",
    category: "navigation",
    description:
      "Accessible horizontal and vertical tabs with synchronized selection, optional counts and full-width layouts.",
  },
  {
    slug: "alert",
    title: "Alert",
    category: "feedback",
    description:
      "Status feedback with controlled or local dismissal, optional actions, and inline, header and overlay presentations.",
  },
  {
    slug: "badge",
    title: "Badge",
    category: "feedback",
    description:
      "Badges show a short status or category without competing with the main content.",
  },
  {
    slug: "bouncing-loader",
    title: "Bouncing loader",
    category: "feedback",
    description:
      "A three-dot loading indicator with configurable dot size, spacing and color.",
  },
  {
    slug: "empty-state",
    title: "Empty state",
    category: "cards",
    description:
      "Centered empty views with a clear explanation and optional next action.",
  },
  {
    slug: "empty-states",
    title: "Empty states",
    category: "app-shell",
    kind: "block",
    description:
      "A tabbed app-shell pattern for no results, offline, caught-up and missing-page views, with recovery actions owned by your app.",
    related: ["empty-state", "tabs", "button", "alert"],
  },
  {
    slug: "progress-indicator",
    title: "Progress indicator",
    category: "feedback",
    description:
      "Measured progress in linear, circular and semicircular presentations.",
  },
  {
    slug: "shimmering-text",
    hidden: true,
    title: "Shimmering text",
    category: "feedback",
    description:
      "A short loading status with a moving highlight and a reduced-motion fallback.",
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    category: "feedback",
    description:
      "Loading placeholders for text, avatars and rectangular content.",
  },
  {
    slug: "spinner",
    title: "Spinner",
    category: "feedback",
    description:
      "Animated loading indicators with four sizes and five color treatments.",
  },
  {
    slug: "tag",
    title: "Tag",
    category: "feedback",
    description:
      "Tags label events and categories. Add a bold prefix, an icon, or a dismiss button when needed.",
  },
  {
    slug: "toast",
    title: "Toast",
    category: "feedback",
    description:
      "Dismissible notifications with six semantic treatments, a header and a description/action row.",
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    category: "feedback",
    description: "Short contextual help on hover or keyboard focus.",
  },
  {
    slug: "accordion",
    title: "Accordion",
    category: "layout",
    description:
      "Expandable sections with single or multiple selection, disabled items and animated content.",
  },
  {
    slug: "avatar",
    title: "Avatar",
    category: "layout",
    description:
      "User identity with images, generated or explicit initials, custom content and optional presence dots.",
  },
  {
    slug: "page-footer",
    title: "Page footer",
    category: "layout",
    description:
      "Page actions with supporting text in desktop and mobile layouts.",
    kind: "block",
  },
  {
    slug: "page-header",
    title: "Page header",
    category: "layout",
    description:
      "Page titles with descriptions, back navigation, optional badges and responsive actions.",
    kind: "block",
  },
  {
    slug: "panel",
    title: "Panel",
    category: "layout",
    description:
      "A collapsible side panel with a header, scrollable body and optional footer.",
  },
  {
    slug: "scrollbar",
    title: "Scrollbar",
    category: "layout",
    description:
      "A native scroll viewport with the v2 rail, draggable thumb and optional arrow controls.",
  },
  {
    slug: "table",
    title: "Table",
    category: "layout",
    description:
      "Composed tables with row density, loading and empty states, sticky columns and row controls.",
  },
  {
    slug: "typography",
    hidden: true,
    title: "Typography",
    category: "layout",
    description:
      "The v2 type hierarchy: display, headline, title, label and body styles.",
  },
  {
    slug: "ui-card",
    title: "Card",
    category: "cards",
    description:
      "Content cards for templates, actions, metrics and selectable options.",
    related: ["metric-card", "empty-state", "avatar", "button"],
  },
  {
    slug: "metric-card",
    title: "Metric card",
    category: "cards",
    description:
      "A focused metric summary with formatted values, units, comparisons, independent trend direction and tone, and an optional supporting graphic.",
    related: ["ui-card", "table", "progress-indicator", "badge"],
  },
  {
    slug: "contact-list-item",
    title: "Contact list item",
    category: "chat",
    description:
      "A keyboard-accessible contact row with identity, secondary information and a trailing slot.",
    kind: "block",
  },
  {
    slug: "date-divider",
    title: "Date divider",
    category: "chat",
    description:
      "A date label between two flexible lines in a message timeline.",
    kind: "block",
  },
  {
    slug: "image-media",
    title: "Image media",
    category: "chat",
    description:
      "An image inside a message, with native alt text and a configurable maximum height.",
    kind: "block",
  },
  {
    slug: "reply-quote",
    title: "Reply quote",
    category: "chat",
    description:
      "A bounded quoted-message preview with a sender, one-line message and optional thumbnail.",
    kind: "block",
  },
  {
    slug: "system-message",
    title: "System message",
    category: "chat",
    description:
      "Centered event text in a conversation timeline, with optional emphasized phrases.",
    kind: "block",
  },
  {
    slug: "unread-separator",
    title: "Unread separator",
    category: "chat",
    description:
      "A divider indicating where unread messages begin, with count-based singular/plural labels.",
    kind: "block",
  },
];

const componentBySlug = new Map(
  components.map((component) => [component.slug, component])
);

export function getComponent(slug: string): ComponentEntry | undefined {
  return componentBySlug.get(slug);
}

/** Where an entry's page lives: components under `/components`, blocks under `/blocks`. */
export function entryHref(
  entry: Pick<ComponentEntry, "slug" | "kind" | "aliasOf">
) {
  return `${entry.kind === "block" ? "/blocks" : "/components"}/${entry.aliasOf ?? entry.slug}`;
}

export const visibleEntries = components.filter(
  (component) => !component.hidden && !component.aliasOf
);
export const uiComponents = visibleEntries.filter(
  (component) => component.kind !== "block"
);
export const blocks = visibleEntries.filter(
  (component) => component.kind === "block"
);

export function relatedEntries(entry: ComponentEntry) {
  const candidates = entry.related
    ? entry.related.map(getComponent)
    : visibleEntries.filter((item) => item.category === entry.category);
  return candidates
    .filter((item): item is ComponentEntry =>
      Boolean(item && !item.hidden && !item.aliasOf && item.slug !== entry.slug)
    )
    .slice(0, 4);
}

function pagesFor(entries: ComponentEntry[]) {
  return categories
    .map((category) => ({
      type: "folder" as const,
      name: category.title,
      children: entries
        .filter((entry) => entry.category === category.id)
        .map((entry) => ({
          type: "page" as const,
          name: entry.title,
          description: entry.description,
          url: entryHref(entry),
        })),
    }))
    .filter((folder) => folder.children.length > 0);
}

export const pageTree: Root = {
  name: "myOperator UI",
  children: [
    { type: "page", name: "Overview", url: "/" },
    { type: "page", name: "Foundations", url: "/foundations" },
    { type: "separator", name: "Components" },
    ...pagesFor(uiComponents),
    { type: "separator", name: "Blocks" },
    ...pagesFor(blocks),
  ],
};
