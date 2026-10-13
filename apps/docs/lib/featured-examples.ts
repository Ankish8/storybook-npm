/**
 * Original CSF export IDs for the first preview on each component page.
 * Compact, responsive comparisons lead where they remain useful in a ~628px
 * content column. Individual examples stay available through the story picker.
 * An explicit example query must take precedence over this recommendation.
 */
export const featuredExamples: Record<string, string> = {
  // The comparison grid requires 850px; the live accordion already shows several items.
  accordion: "Overview",
  "action-button": "Overview",
  "split-button": "Overview",
  // The six-color comparison requires 850px; avoid a horizontal gallery as the hero.
  alert: "Overview",
  avatar: "Overview",
  badge: "ReviewWorkflow",
  "bouncing-loader": "Overview",
  breadcrumbs: "Overview",
  button: "AllVariants",
  checkbox: "AllVariants",
  // Inline modal comparisons require 808px and 1224px respectively.
  modal: "Overview",
  "contact-list-item": "AllCompositions",
  "creatable-multi-select": "AllVariants",
  "creatable-select": "AllVariants",
  "date-divider": "AllLabels",
  "date-range-picker": "AllVariants",
  "date-time-picker": "AllVariants",
  // The three inline menu compositions require 940px.
  "dropdown-menu": "Default",
  "empty-state": "Overview",
  "empty-states": "Overview",
  "metric-card": "Overview",
  "file-upload": "Uploads",
  // Content states differ only in alt text; height comparisons stack large images.
  "image-media": "Overview",
  input: "AllVariants",
  "multi-select": "AllVariants",
  "number-step-field": "AllVariants",
  "otp-input": "Overview",
  "page-footer": "AllVariants",
  "page-header": "Overview",
  pagination: "AnimatedWindow",
  // All compositions contains three 430px-tall workspaces; one real panel fits the hero.
  panel: "Overview",
  "phone-input": "Overview",
  "progress-indicator": "Overview",
  "readable-field": "AllVariants",
  "reply-quote": "AllCompositions",
  scrollbar: "Overview",
  // All sizes requires 1148px; Search modes still requires 748px.
  "search-filter": "Overview",
  select: "Overview",
  "select-field": "AllVariants",
  skeleton: "Overview",
  spinner: "Overview",
  // Four orientation/marker combinations become a long stack in the narrow column.
  stepper: "DocsPreview",
  switch: "DocsPreview",
  "system-message": "AllFormats",
  table: "Overview",
  // The four style/orientation comparison cards require a 1050px grid.
  tabs: "Overview",
  tag: "Dismissible",
  "text-field": "Overview",
  textarea: "DocsPreview",
  // Inline toast comparisons require 1224px; use the real dismissible toast example.
  toast: "InteractiveStack",
  // Inline tooltip comparisons require 720px; the live example keeps hover and focus.
  tooltip: "Overview",
  "ui-card": "Overview",
  "unread-separator": "AllCounts",
};
