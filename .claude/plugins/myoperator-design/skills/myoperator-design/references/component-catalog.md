# myOperator Component Catalog

> Auto-generated from `components.yaml` and component metadata. 71 components across 7 categories.

## Quick Reference

| Component | Category | Install |
|-----------|----------|---------|
| Avatar | core | `npx myoperator-ui add avatar` |
| Button | core | `npx myoperator-ui add button` |
| Badge | core | `npx myoperator-ui add badge` |
| ContactListItem | core | `npx myoperator-ui add contact-list-item` |
| DateDivider | core | `npx myoperator-ui add date-divider` |
| ImageMedia | core | `npx myoperator-ui add image-media` |
| PhoneInput | core | `npx myoperator-ui add phone-input` |
| ReplyQuote | core | `npx myoperator-ui add reply-quote` |
| SystemMessage | core | `npx myoperator-ui add system-message` |
| Tabs | core | `npx myoperator-ui add tabs` |
| Typography | core | `npx myoperator-ui add typography` |
| UnreadSeparator | core | `npx myoperator-ui add unread-separator` |
| Input | form | `npx myoperator-ui add input` |
| Select | form | `npx myoperator-ui add select` |
| Checkbox | form | `npx myoperator-ui add checkbox` |
| Switch | form | `npx myoperator-ui add switch` |
| TextField | form | `npx myoperator-ui add text-field` |
| Textarea | form | `npx myoperator-ui add textarea` |
| SelectField | form | `npx myoperator-ui add select-field` |
| MultiSelect | form | `npx myoperator-ui add multi-select` |
| ReadableField | form | `npx myoperator-ui add readable-field` |
| Table | data | `npx myoperator-ui add table` |
| Dialog | overlay | `npx myoperator-ui add dialog` |
| DropdownMenu | overlay | `npx myoperator-ui add dropdown-menu` |
| Tooltip | overlay | `npx myoperator-ui add tooltip` |
| DeleteConfirmationModal | overlay | `npx myoperator-ui add delete-confirmation-modal` |
| ConfirmationModal | overlay | `npx myoperator-ui add confirmation-modal` |
| FormModal | overlay | `npx myoperator-ui add form-modal` |
| Tag | feedback | `npx myoperator-ui add tag` |
| Alert | feedback | `npx myoperator-ui add alert` |
| Toast | feedback | `npx myoperator-ui add toast` |
| Spinner | feedback | `npx myoperator-ui add spinner` |
| Skeleton | feedback | `npx myoperator-ui add skeleton` |
| EmptyState | feedback | `npx myoperator-ui add empty-state` |
| Accordion | layout | `npx myoperator-ui add accordion` |
| PageHeader | layout | `npx myoperator-ui add page-header` |
| Panel | layout | `npx myoperator-ui add panel` |
| Pagination | layout | `npx myoperator-ui add pagination` |
| AttachmentPreview | custom | `npx myoperator-ui add attachment-preview` |
| AudioMedia | custom | `npx myoperator-ui add audio-media` |
| CarouselMedia | custom | `npx myoperator-ui add carousel-media` |
| ChatBubble | custom | `npx myoperator-ui add chat-bubble` |
| ChatComposer | custom | `npx myoperator-ui add chat-composer` |
| ChatTimelineDivider | custom | `npx myoperator-ui add chat-timeline-divider` |
| DocMedia | custom | `npx myoperator-ui add doc-media` |
| EventSelector | custom | `npx myoperator-ui add event-selector` |
| KeyValueInput | custom | `npx myoperator-ui add key-value-input` |
| ApiFeatureCard | custom | `npx myoperator-ui add api-feature-card` |
| EndpointDetails | custom | `npx myoperator-ui add endpoint-details` |
| AlertConfiguration | custom | `npx myoperator-ui add alert-configuration` |
| AutoPaySetup | custom | `npx myoperator-ui add auto-pay-setup` |
| BankDetails | custom | `npx myoperator-ui add bank-details` |
| DateRangeModal | custom | `npx myoperator-ui add date-range-modal` |
| PaymentOptionCard | custom | `npx myoperator-ui add payment-option-card` |
| PlanUpgradeModal | custom | `npx myoperator-ui add plan-upgrade-modal` |
| PlanUpgradeSummaryModal | custom | `npx myoperator-ui add plan-upgrade-summary-modal` |
| PaymentSummary | custom | `npx myoperator-ui add payment-summary` |
| LetUsDriveCard | custom | `npx myoperator-ui add let-us-drive-card` |
| PowerUpCard | custom | `npx myoperator-ui add power-up-card` |
| PricingCard | custom | `npx myoperator-ui add pricing-card` |
| PricingPage | custom | `npx myoperator-ui add pricing-page` |
| PricingToggle | custom | `npx myoperator-ui add pricing-toggle` |
| TalkToUsModal | custom | `npx myoperator-ui add talk-to-us-modal` |
| WalletTopup | custom | `npx myoperator-ui add wallet-topup` |
| FileUploadModal | custom | `npx myoperator-ui add file-upload-modal` |
| VideoMedia | custom | `npx myoperator-ui add video-media` |

## Core — Essential UI primitives

### Avatar
> A versatile avatar component displaying user initials or images with size variants and optional online status indicator

**Install**: `npx myoperator-ui add avatar`

---

### Button
> A customizable button component with variants, sizes, and icons. Supports loading states and can render as a child element using Radix Slot.

**Install**: `npx myoperator-ui add button`

**Variants**: default, destructive, outline, secondary, ghost, link, dashed (default: default)
**Sizes**: default, sm, lg, icon, icon-sm, icon-lg (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link" \| "dashed" | default | The visual style of the button |
| size | "default" \| "sm" \| "lg" \| "icon" \| "icon-sm" \| "icon-lg" | default | The size of the button |
| asChild | boolean | false | Render as child element using Radix Slot |
| leftIcon | React.ReactNode | — | Icon displayed on the left side of the button text |
| rightIcon | React.ReactNode | — | Icon displayed on the right side of the button text |
| loading | boolean | false | Shows loading spinner and disables button |
| loadingText | string | — | Text shown during loading state |

**Examples**:
- **Basic Button**: Simple button with default styling
```jsx
<Button>Click me</Button>
```
- **Button with Icons**: Buttons with left or right icons
```jsx
import { Mail } from "lucide-react"

<Button leftIcon={<Mail />}>Send Email</Button>
```
- **Loading State**: Button with loading spinner
```jsx
<Button loading loadingText="Saving...">Save</Button>
```

---

### Badge
> A status badge component with active, failed, disabled, outline, secondary, and destructive variants. Supports asChild for rendering as links.

**Install**: `npx myoperator-ui add badge`

**Variants**: active, failed, disabled, default, secondary, outline, destructive (default: default)
**Sizes**: default, sm, lg (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "active" \| "failed" \| "disabled" \| "default" \| "secondary" \| "outline" \| "destructive" | default | The visual style of the badge |
| size | "default" \| "sm" \| "lg" | default | The size of the badge |
| leftIcon | React.ReactNode | — | Icon displayed on the left side |
| rightIcon | React.ReactNode | — | Icon displayed on the right side |
| asChild | boolean | false | Render as child element using Radix Slot |

**Examples**:
- **Status Badges**: Badges for different status states
```jsx
<Badge variant="active">Active</Badge>
<Badge variant="failed">Failed</Badge>
```
- **Badge as Link**: Badge rendered as a link
```jsx
<Badge asChild><a href="/status">View Status</a></Badge>
```

---

### ContactListItem
> Contact list item with avatar, name, subtitle, and trailing content

**Install**: `npx myoperator-ui add contact-list-item`
**Requires**: `avatar` (auto-installed)

---

### DateDivider
> A horizontal line with centered date text for separating chat messages by date

**Install**: `npx myoperator-ui add date-divider`

---

### ImageMedia
> An image display component for chat messages with rounded corners and configurable max height

**Install**: `npx myoperator-ui add image-media`

---

### PhoneInput
> A phone number input with country code prefix, flag emoji, and optional country selector

**Install**: `npx myoperator-ui add phone-input`

---

### ReplyQuote
> A quoted message block with blue left border showing sender name and quoted text for reply previews

**Install**: `npx myoperator-ui add reply-quote`

---

### SystemMessage
> A centered system message for chat timelines with bold markdown support

**Install**: `npx myoperator-ui add system-message`

---

### Tabs
> A flexible tabs component with underline-style active indicator, supporting badges/counts, equal-width and auto-width layouts

**Install**: `npx myoperator-ui add tabs`

---

### Typography
> A semantic typography component with kind, variant, color, alignment, and truncation support

**Install**: `npx myoperator-ui add typography`

---

### UnreadSeparator
> A horizontal divider with unread message count label for chat message lists

**Install**: `npx myoperator-ui add unread-separator`

---

## Form — Form inputs and controls

### Input
> A flexible input component for text entry with state variants. Supports default and error states.

**Install**: `npx myoperator-ui add input`

**States**: default, error (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| state | "default" \| "error" | default | The visual state of the input |

**Examples**:
- **Basic Input**: Simple input with placeholder
```jsx
<Input placeholder="Enter your email" />
```

---

### Select
> A composable select dropdown built with Radix UI primitives. Includes SelectTrigger, SelectContent, SelectItem, and more sub-components.

**Install**: `npx myoperator-ui add select`

**States**: default, error (default: default)

**Examples**:
- **Basic Select**: Simple select dropdown
```jsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Checkbox
> A tri-state checkbox component built on Radix UI with label support. Supports checked, unchecked, and indeterminate states.

**Install**: `npx myoperator-ui add checkbox`

**Sizes**: default, sm, lg (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "default" \| "sm" \| "lg" | default | The size of the checkbox |
| checked | boolean \| "indeterminate" | — | Whether the checkbox is checked |
| onCheckedChange | (checked: CheckedState) => void | — | Callback when checked state changes |
| label | string | — | Optional label text |
| labelPosition | "left" \| "right" | right | Position of the label |

**Examples**:
- **Basic Checkbox**: Simple controlled checkbox
```jsx
<Checkbox checked={isEnabled} onCheckedChange={setIsEnabled} />
```
- **Checkbox with Label**: Checkbox with label
```jsx
<Checkbox label="Accept terms and conditions" />
```

---

### Switch
> A switch component built on Radix UI for boolean inputs with on/off states. Supports labels and multiple sizes.

**Install**: `npx myoperator-ui add switch`

**Sizes**: default, sm, lg (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "default" \| "sm" \| "lg" | default | The size of the switch |
| checked | boolean | — | Whether the switch is on |
| onCheckedChange | (checked: boolean) => void | — | Callback when checked state changes |
| label | string | — | Optional label text |
| labelPosition | "left" \| "right" | right | Position of the label |

**Examples**:
- **Basic Switch**: Simple controlled switch
```jsx
<Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
```
- **Switch with Label**: Switch with label
```jsx
<Switch label="Enable notifications" />
```

---

### TextField
> A comprehensive text field component with label, icons, prefix/suffix, validation states, character count, and loading state.

**Install**: `npx myoperator-ui add text-field`

**States**: default, error (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | — | Label text displayed above the input |
| required | boolean | false | Shows red asterisk next to label |
| helperText | string | — | Helper text displayed below the input |
| error | string | — | Error message - shows error state |
| leftIcon | React.ReactNode | — | Icon displayed on the left |
| rightIcon | React.ReactNode | — | Icon displayed on the right |
| prefix | string | — | Text prefix inside input |
| suffix | string | — | Text suffix inside input |
| showCount | boolean | false | Shows character count when maxLength is set |
| loading | boolean | false | Shows loading spinner |

**Examples**:
- **Basic TextField**: Text field with label and required indicator
```jsx
<TextField label="Email" placeholder="Enter your email" required />
```
- **TextField with Error**: Text field showing error state
```jsx
<TextField label="Username" error="Username is already taken" />
```

---

### Textarea
> A multi-line text input with label, error state, helper text, character counter, and resize control

**Install**: `npx myoperator-ui add textarea`

---

### SelectField
> A form-ready select component with label, helper text, error handling, and grouped options support.

**Install**: `npx myoperator-ui add select-field`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | — | Label text displayed above the select |
| required | boolean | false | Shows red asterisk next to label |
| options | SelectOption[] | — | Array of options with value, label, disabled, and group properties |
| error | string | — | Error message - shows error state |
| helperText | string | — | Helper text displayed below the select |
| searchable | boolean | false | Enable search/filter functionality |

**Examples**:
- **Basic SelectField**: Select field with label and options
```jsx
<SelectField
  label="Country"
  placeholder="Select a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  required
/>
```

---

### MultiSelect
> A multi-select component with tags display, search functionality, and validation states. Supports maximum selection limits.

**Install**: `npx myoperator-ui add multi-select`

**States**: default, error (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | — | Label text displayed above the select |
| options | MultiSelectOption[] | — | Array of options with value, label, and disabled properties |
| value | string[] | — | Currently selected values (controlled) |
| onValueChange | (value: string[]) => void | — | Callback when values change |
| searchable | boolean | false | Enable search/filter functionality |
| maxSelections | number | — | Maximum number of selections allowed |
| error | string | — | Error message - shows error state |

**Examples**:
- **Basic MultiSelect**: Multi-select with tag display
```jsx
<MultiSelect
  label="Skills"
  placeholder="Select skills"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ]}
  onValueChange={(values) => console.log(values)}
/>
```

---

### ReadableField
> A read-only field with copy-to-clipboard functionality. Supports secret mode for sensitive data like API keys.

**Install**: `npx myoperator-ui add readable-field`

---

## Data — Data display components

### Table
> A composable table component with size variants, loading/empty states, sticky columns, and sorting support.

**Install**: `npx myoperator-ui add table`

**Sizes**: sm, md, lg (default: md)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "sm" \| "md" \| "lg" | md | The row height of the table |
| withoutBorder | boolean | false | Remove outer border from the table |

**Examples**:
- **Basic Table**: Simple table with header and body
```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell><Badge variant="active">Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Overlay — Popups, modals, menus

### Dialog
> A modal dialog component built on Radix UI Dialog with size variants and animations

**Install**: `npx myoperator-ui add dialog`

---

### DropdownMenu
> A dropdown menu component for displaying actions and options. Built on Radix UI with full keyboard navigation support.

**Install**: `npx myoperator-ui add dropdown-menu`

**Examples**:
- **Basic Dropdown**: Simple dropdown with menu items
```jsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Tooltip
> A popup that displays information related to an element when hovered or focused

**Install**: `npx myoperator-ui add tooltip`

---

### DeleteConfirmationModal
> A confirmation modal requiring text input to confirm deletion

**Install**: `npx myoperator-ui add delete-confirmation-modal`
**Requires**: `dialog`, `button`, `input` (auto-installed)

---

### ConfirmationModal
> A simple confirmation modal for yes/no decisions

**Install**: `npx myoperator-ui add confirmation-modal`
**Requires**: `dialog`, `button` (auto-installed)

---

### FormModal
> A reusable modal component for forms with consistent layout

**Install**: `npx myoperator-ui add form-modal`
**Requires**: `dialog`, `button` (auto-installed)

---

## Feedback — Status and notifications

### Tag
> A tag component for event labels with optional bold label prefix. Rounded rectangle tags for categorization.

**Install**: `npx myoperator-ui add tag`

**Variants**: default, primary, secondary, success, warning, error (default: default)
**Sizes**: default, sm, lg (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "default" \| "primary" \| "secondary" \| "success" \| "warning" \| "error" | default | The visual style of the tag |
| size | "default" \| "sm" \| "lg" | default | The size of the tag |
| label | string | — | Bold label prefix displayed before the content |
| interactive | boolean | false | Make the tag clickable |
| selected | boolean | false | Show selected state |

**Examples**:
- **Basic Tags**: Simple tag labels
```jsx
<Tag>Category</Tag>
<Tag variant="success">Success</Tag>
```
- **Tag with Label**: Tags with bold label prefix
```jsx
<Tag label="Status:">Active</Tag>
```

---

### Alert
> A dismissible alert component for notifications, errors, warnings, and success messages with icons, actions, and controlled visibility

**Install**: `npx myoperator-ui add alert`

---

### Toast
> A toast notification component for displaying brief messages at screen corners, with auto-dismiss and stacking support

**Install**: `npx myoperator-ui add toast`

---

### Spinner
> A loading spinner component with customizable size and color variants for indicating progress

**Install**: `npx myoperator-ui add spinner`

---

### Skeleton
> A placeholder loading component with pulse animation for content loading states

**Install**: `npx myoperator-ui add skeleton`

---

### EmptyState
> Centered empty state with icon, title, description, and optional action buttons

**Install**: `npx myoperator-ui add empty-state`

---

## Layout — Layout and structure components

### Accordion
> An expandable/collapsible accordion component with single or multiple mode support.

**Install**: `npx myoperator-ui add accordion`

**Types**: single, multiple (default: multiple)
**Variants**: default, bordered (default: default)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | "single" \| "multiple" | multiple | Whether only one item can be open at a time |
| variant | "default" \| "bordered" | default | Visual variant of the accordion |
| value | string[] | — | Controlled value - array of open item values |
| defaultValue | string[] | — | Default open items for uncontrolled usage |

**Examples**:
- **Basic Accordion**: Basic accordion with sections
```jsx
<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### PageHeader
> A page header component with icon, title, description, and action buttons

**Install**: `npx myoperator-ui add page-header`

---

### Panel
> A collapsible side panel layout with header, scrollable body, and optional footer

**Install**: `npx myoperator-ui add panel`
**Requires**: `button` (auto-installed)

---

### Pagination
> A composable pagination component with page navigation, next/previous links, and ellipsis

**Install**: `npx myoperator-ui add pagination`
**Requires**: `button` (auto-installed)

---

## Custom — Multi-file complex components

### AttachmentPreview
> A file attachment preview for chat composers with image, video, audio, and document previews

**Install**: `npx myoperator-ui add attachment-preview`
**Type**: Multi-file component

---

### AudioMedia
> A waveform-based audio player with play/pause, speed control, and SVG waveform visualization

**Install**: `npx myoperator-ui add audio-media`
**Requires**: `dropdown-menu` (auto-installed)
**Type**: Multi-file component

---

### CarouselMedia
> A horizontally scrollable card carousel with images, titles, and action buttons

**Install**: `npx myoperator-ui add carousel-media`
**Type**: Multi-file component

---

### ChatBubble
> A chat message bubble with sender/receiver variants, delivery status, reply quote, and media slot

**Install**: `npx myoperator-ui add chat-bubble`
**Requires**: `reply-quote` (auto-installed)
**Type**: Multi-file component

---

### ChatComposer
> A message composition area with textarea, action slots, reply preview, attachment slot, and send button

**Install**: `npx myoperator-ui add chat-composer`
**Requires**: `button`, `reply-quote` (auto-installed)
**Type**: Multi-file component

---

### ChatTimelineDivider
> A timeline divider for chat message lists — renders centered content between horizontal lines with date, unread, and system event variants

**Install**: `npx myoperator-ui add chat-timeline-divider`
**Type**: Multi-file component

---

### DocMedia
> A document media component with preview, download, and file variants for chat messages

**Install**: `npx myoperator-ui add doc-media`
**Type**: Multi-file component

---

### EventSelector
> A component for selecting webhook events with groups, categories, and tri-state checkboxes

**Install**: `npx myoperator-ui add event-selector`
**Requires**: `checkbox`, `accordion` (auto-installed)
**Type**: Multi-file component

---

### KeyValueInput
> A component for managing key-value pairs with validation and duplicate detection

**Install**: `npx myoperator-ui add key-value-input`
**Requires**: `button`, `input` (auto-installed)
**Type**: Multi-file component

---

### ApiFeatureCard
> A card component for displaying API features with icon, title, description, and action button

**Install**: `npx myoperator-ui add api-feature-card`
**Requires**: `button` (auto-installed)
**Type**: Multi-file component

---

### EndpointDetails
> A component for displaying API endpoint details with copy-to-clipboard and secret field support

**Install**: `npx myoperator-ui add endpoint-details`
**Requires**: `readable-field` (auto-installed)
**Type**: Multi-file component

---

### AlertConfiguration
> A configuration card for alert settings with inline editing modal

**Install**: `npx myoperator-ui add alert-configuration`
**Requires**: `button`, `form-modal`, `select` (auto-installed)
**Type**: Multi-file component

---

### AutoPaySetup
> A setup wizard component for configuring automatic payments with payment method selection

**Install**: `npx myoperator-ui add auto-pay-setup`
**Requires**: `accordion`, `button` (auto-installed)
**Type**: Multi-file component

---

### BankDetails
> A component for displaying bank account details with copy-to-clipboard functionality

**Install**: `npx myoperator-ui add bank-details`
**Requires**: `accordion` (auto-installed)
**Type**: Multi-file component

---

### DateRangeModal
> A modal for selecting a date range with start and end date pickers

**Install**: `npx myoperator-ui add date-range-modal`
**Requires**: `dialog`, `button`, `input` (auto-installed)
**Type**: Multi-file component

---

### PaymentOptionCard
> A selectable payment method list with icons, titles, and descriptions. Includes a modal variant for overlay usage.

**Install**: `npx myoperator-ui add payment-option-card`
**Requires**: `button`, `dialog` (auto-installed)
**Type**: Multi-file component

---

### PlanUpgradeModal
> A modal for selecting whether a plan upgrade is applied in the current or upcoming billing cycle

**Install**: `npx myoperator-ui add plan-upgrade-modal`
**Requires**: `button`, `dialog` (auto-installed)
**Type**: Multi-file component

---

### PlanUpgradeSummaryModal
> A billing summary modal for confirming plan upgrades and downgrades

**Install**: `npx myoperator-ui add plan-upgrade-summary-modal`
**Requires**: `button`, `dialog` (auto-installed)
**Type**: Multi-file component

---

### PaymentSummary
> A component for displaying payment summary with line items and total

**Install**: `npx myoperator-ui add payment-summary`
**Requires**: `tooltip` (auto-installed)
**Type**: Multi-file component

---

### LetUsDriveCard
> A managed service card with pricing, billing badge, 'Show details' link, and CTA for the full-service management section

**Install**: `npx myoperator-ui add let-us-drive-card`
**Requires**: `button`, `badge` (auto-installed)
**Type**: Multi-file component

---

### PowerUpCard
> An add-on service card with icon, title, pricing, description, and CTA button for the power-ups section

**Install**: `npx myoperator-ui add power-up-card`
**Requires**: `button` (auto-installed)
**Type**: Multi-file component

---

### PricingCard
> A pricing tier card with plan name, pricing, feature checklist, CTA button, and optional popularity badge and addon footer

**Install**: `npx myoperator-ui add pricing-card`
**Requires**: `button`, `badge` (auto-installed)
**Type**: Multi-file component

---

### PricingPage
> A full pricing page layout composing plan-type tabs, billing toggle, pricing cards grid, power-ups section, and let-us-drive managed services section

**Install**: `npx myoperator-ui add pricing-page`
**Requires**: `button`, `page-header`, `pricing-toggle`, `pricing-card`, `power-up-card`, `let-us-drive-card` (auto-installed)
**Type**: Multi-file component

---

### PricingToggle
> A plan type tab selector with billing period toggle for pricing pages. Pill-shaped tabs switch plan categories, and an optional switch toggles between monthly/yearly billing.

**Install**: `npx myoperator-ui add pricing-toggle`
**Requires**: `switch` (auto-installed)
**Type**: Multi-file component

---

### TalkToUsModal
> A modal dialog with icon, heading, description, and two action buttons prompting users to contact support. Triggered by PowerUpCard's Talk to us button.

**Install**: `npx myoperator-ui add talk-to-us-modal`
**Requires**: `button`, `dialog` (auto-installed)
**Type**: Multi-file component

---

### WalletTopup
> A component for wallet top-up with amount selection and coupon support

**Install**: `npx myoperator-ui add wallet-topup`
**Requires**: `accordion`, `button`, `input` (auto-installed)
**Type**: Multi-file component

---

### FileUploadModal
> A reusable file upload modal with drag-and-drop, progress tracking, and error handling

**Install**: `npx myoperator-ui add file-upload-modal`
**Requires**: `dialog`, `button` (auto-installed)
**Type**: Multi-file component

---

### VideoMedia
> A video player with thumbnail overlay, play/pause, seek bar, speed dropdown, volume, and fullscreen

**Install**: `npx myoperator-ui add video-media`
**Requires**: `dropdown-menu` (auto-installed)
**Type**: Multi-file component

---
