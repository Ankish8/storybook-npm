// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry
//
// This file provides lazy-loading access to component registries.
// Components are split by category for optimal loading performance.

import type { Registry, ComponentDefinition, ComponentMeta } from './registry-types'

import { getCoreRegistry } from './registry-core'
import { getFormRegistry } from './registry-form'
import { getDataRegistry } from './registry-data'
import { getOverlayRegistry } from './registry-overlay'
import { getFeedbackRegistry } from './registry-feedback'
import { getLayoutRegistry } from './registry-layout'
import { getCustomRegistry } from './registry-custom'

// Component metadata (loaded immediately - small footprint)
export const COMPONENT_METADATA: Record<string, ComponentMeta> = {
  "avatar": {
    name: "avatar",
    description: "A versatile avatar component displaying user initials or images with size variants and optional online status indicator",
      category: "core",
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: "core",
    internalDependencies: [],
  },
  "date-divider": {
    name: "date-divider",
    description: "A horizontal line with centered date text for separating chat messages by date",
      category: "core",
    dependencies: ["clsx","tailwind-merge"],
    category: "core",
    internalDependencies: [],
  },
  "image-media": {
    name: "image-media",
    description: "An image display component for chat messages with rounded corners and configurable max height",
      category: "core",
    dependencies: ["clsx","tailwind-merge"],
    category: "core",
    internalDependencies: [],
  },
  "phone-input": {
    name: "phone-input",
    description: "A phone number input with country code prefix, flag emoji, and optional country selector",
      category: "core",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "core",
    internalDependencies: [],
  },
  "reply-quote": {
    name: "reply-quote",
    description: "A quoted message block with blue left border showing sender name and quoted text for reply previews",
      category: "core",
    dependencies: ["clsx","tailwind-merge"],
    category: "core",
    internalDependencies: [],
  },
  "system-message": {
    name: "system-message",
    description: "A centered system message for chat timelines with bold markdown support",
      category: "core",
    dependencies: ["clsx","tailwind-merge"],
    category: "core",
    internalDependencies: [],
  },
  "unread-separator": {
    name: "unread-separator",
    description: "A horizontal divider with unread message count label for chat message lists",
      category: "core",
    dependencies: ["clsx","tailwind-merge"],
    category: "core",
    internalDependencies: [],
  },
  "button": {
    name: "button",
    description: "A customizable button component with variants, sizes, and icons",
      category: "core",
    dependencies: ["@radix-ui/react-slot@^1.2.4","class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: "core",
    internalDependencies: [],
  },
  "badge": {
    name: "badge",
    description: "A status badge component with active, failed, disabled, outline, secondary, and destructive variants",
      category: "core",
    dependencies: ["@radix-ui/react-slot@^1.2.4","class-variance-authority","clsx","tailwind-merge"],
    category: "core",
    internalDependencies: [],
  },
  "contact-list-item": {
    name: "contact-list-item",
    description: "Contact list item with avatar, name, subtitle, and trailing content",
      category: "core",
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: "core",
    internalDependencies: ["avatar"],
  },
  "typography": {
    name: "typography",
    description: "A semantic typography component with kind, variant, color, alignment, and truncation support",
      category: "core",
    dependencies: ["clsx","tailwind-merge"],
    category: "core",
    internalDependencies: [],
  },
  "input": {
    name: "input",
    description: "A text input component with error and disabled states",
      category: "form",
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: "form",
    internalDependencies: [],
  },
  "select": {
    name: "select",
    description: "A select dropdown component built on Radix UI Select",
      category: "form",
    dependencies: ["@radix-ui/react-select@^2.2.6","class-variance-authority","clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "form",
    internalDependencies: [],
  },
  "checkbox": {
    name: "checkbox",
    description: "A tri-state checkbox component with label support (checked, unchecked, indeterminate). Built on Radix UI Checkbox.",
      category: "form",
    dependencies: ["@radix-ui/react-checkbox@^1.3.3","class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: "form",
    internalDependencies: [],
  },
  "switch": {
    name: "switch",
    description: "A switch/toggle component for boolean inputs with on/off states. Built on Radix UI Switch.",
      category: "form",
    dependencies: ["@radix-ui/react-switch@^1.2.6","class-variance-authority","clsx","tailwind-merge"],
    category: "form",
    internalDependencies: [],
  },
  "text-field": {
    name: "text-field",
    description: "A text field with label, helper text, icons, and validation states",
      category: "form",
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: "form",
    internalDependencies: [],
  },
  "textarea": {
    name: "textarea",
    description: "A multi-line text input with label, error state, helper text, character counter, and resize control",
      category: "form",
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: "form",
    internalDependencies: [],
  },
  "readable-field": {
    name: "readable-field",
    description: "A read-only field with copy-to-clipboard functionality. Supports secret mode for sensitive data like API keys.",
      category: "form",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "form",
    internalDependencies: [],
  },
  "select-field": {
    name: "select-field",
    description: "A select field with label, helper text, and validation states",
      category: "form",
    dependencies: ["@radix-ui/react-select@^2.2.6","clsx","tailwind-merge","lucide-react"],
    category: "form",
    internalDependencies: [],
  },
  "multi-select": {
    name: "multi-select",
    description: "A multi-select dropdown component with search, badges, and async loading",
      category: "form",
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: "form",
    internalDependencies: [],
  },
  "creatable-select": {
    name: "creatable-select",
    description: "A single-value select with type-to-search and type-to-create custom options",
      category: "form",
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "form",
    internalDependencies: [],
  },
  "creatable-multi-select": {
    name: "creatable-multi-select",
    description: "A multi-value select with chips, type-to-search, and type-to-create custom options",
      category: "form",
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "form",
    internalDependencies: [],
  },
  "table": {
    name: "table",
    description: "A composable table component with size variants, loading/empty states, sticky columns, and sorting support",
      category: "data",
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: "data",
    internalDependencies: [],
  },
  "tabs": {
    name: "tabs",
    description: "A flexible tabs component with underline-style active indicator, supporting badges/counts, equal-width and auto-width layouts",
      category: "core",
    dependencies: ["@radix-ui/react-tabs","clsx","tailwind-merge"],
    category: "core",
    internalDependencies: [],
  },
  "dialog": {
    name: "dialog",
    description: "A modal dialog component built on Radix UI Dialog with size variants and animations",
      category: "overlay",
    dependencies: ["@radix-ui/react-dialog@^1.1.15","class-variance-authority","clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "overlay",
    internalDependencies: [],
  },
  "dropdown-menu": {
    name: "dropdown-menu",
    description: "A dropdown menu component for displaying actions and options",
      category: "overlay",
    dependencies: ["@radix-ui/react-dropdown-menu@^2.1.16","clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "overlay",
    internalDependencies: [],
  },
  "tooltip": {
    name: "tooltip",
    description: "A popup that displays information related to an element when hovered or focused",
      category: "overlay",
    dependencies: ["@radix-ui/react-tooltip@^1.2.8","clsx","tailwind-merge","tailwindcss-animate"],
    category: "overlay",
    internalDependencies: [],
  },
  "delete-confirmation-modal": {
    name: "delete-confirmation-modal",
    description: "A confirmation modal requiring text input to confirm deletion",
      category: "overlay",
    dependencies: ["clsx","tailwind-merge"],
    category: "overlay",
    internalDependencies: ["dialog","button","input"],
  },
  "confirmation-modal": {
    name: "confirmation-modal",
    description: "A simple confirmation modal for yes/no decisions",
      category: "overlay",
    dependencies: ["clsx","tailwind-merge"],
    category: "overlay",
    internalDependencies: ["dialog","button"],
  },
  "form-modal": {
    name: "form-modal",
    description: "A reusable modal component for forms with consistent layout",
      category: "overlay",
    dependencies: ["clsx","tailwind-merge"],
    category: "overlay",
    internalDependencies: ["dialog","button"],
  },
  "tag": {
    name: "tag",
    description: "A tag component for event labels with optional bold label prefix",
      category: "feedback",
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: "feedback",
    internalDependencies: [],
  },
  "alert": {
    name: "alert",
    description: "A dismissible alert component for notifications, errors, warnings, and success messages with icons, actions, and controlled visibility",
      category: "feedback",
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: "feedback",
    internalDependencies: [],
  },
  "toast": {
    name: "toast",
    description: "A toast notification component for displaying brief messages at screen corners, with auto-dismiss and stacking support",
      category: "feedback",
    dependencies: ["@radix-ui/react-toast@^1.2.15","class-variance-authority","lucide-react","clsx","tailwind-merge","tailwindcss-animate"],
    category: "feedback",
    internalDependencies: [],
  },
  "spinner": {
    name: "spinner",
    description: "A loading spinner component with customizable size and color variants for indicating progress",
      category: "feedback",
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: "feedback",
    internalDependencies: [],
  },
  "skeleton": {
    name: "skeleton",
    description: "A placeholder loading component with pulse animation for content loading states",
      category: "feedback",
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: "feedback",
    internalDependencies: [],
  },
  "empty-state": {
    name: "empty-state",
    description: "Centered empty state with icon, title, description, and optional action buttons",
      category: "feedback",
    dependencies: ["clsx","tailwind-merge"],
    category: "feedback",
    internalDependencies: [],
  },
  "accordion": {
    name: "accordion",
    description: "An expandable/collapsible accordion component with single or multiple mode support",
      category: "layout",
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: "layout",
    internalDependencies: [],
  },
  "page-header": {
    name: "page-header",
    description: "A page header component with icon, title, description, and action buttons",
      category: "layout",
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: "layout",
    internalDependencies: [],
  },
  "panel": {
    name: "panel",
    description: "A collapsible side panel layout with header, scrollable body, and optional footer",
      category: "layout",
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: "layout",
    internalDependencies: ["button"],
  },
  "pagination": {
    name: "pagination",
    description: "A composable pagination component with page navigation, next/previous links, and ellipsis",
      category: "layout",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "layout",
    internalDependencies: ["button"],
  },
  "event-selector": {
    name: "event-selector",
    description: "A component for selecting webhook events with groups, categories, and tri-state checkboxes",
      category: "custom",
    dependencies: ["clsx","tailwind-merge"],
    category: "custom",
    internalDependencies: ["checkbox","accordion"],
  },
  "key-value-input": {
    name: "key-value-input",
    description: "A component for managing key-value pairs with validation and duplicate detection",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["button","input"],
  },
  "api-feature-card": {
    name: "api-feature-card",
    description: "A card component for displaying API features with icon, title, description, and action button",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["button"],
  },
  "endpoint-details": {
    name: "endpoint-details",
    description: "A component for displaying API endpoint details with copy-to-clipboard and secret field support",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["readable-field"],
  },
  "alert-configuration": {
    name: "alert-configuration",
    description: "A configuration card for alert settings with inline editing modal",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["button","form-modal","select"],
  },
  "auto-pay-setup": {
    name: "auto-pay-setup",
    description: "A setup wizard component for configuring automatic payments with payment method selection",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["accordion","button"],
  },
  "bank-details": {
    name: "bank-details",
    description: "A component for displaying bank account details with copy-to-clipboard functionality",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["accordion"],
  },
  "date-range-modal": {
    name: "date-range-modal",
    description: "A modal for selecting a date range with start and end date pickers",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["dialog","button","input"],
  },
  "payment-summary": {
    name: "payment-summary",
    description: "A component for displaying payment summary with line items and total",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["tooltip"],
  },
  "payment-option-card": {
    name: "payment-option-card",
    description: "A selectable payment method list with icons, titles, and descriptions. Includes a modal variant for overlay usage.",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["button","dialog"],
  },
  "plan-detail-modal": {
    name: "plan-detail-modal",
    description: "A read-only modal displaying plan feature breakdown with free allowances and per-unit rates",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react","@radix-ui/react-dialog"],
    category: "custom",
    internalDependencies: ["dialog"],
  },
  "plan-upgrade-modal": {
    name: "plan-upgrade-modal",
    description: "A modal for selecting whether a plan upgrade is applied in the current or upcoming billing cycle",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react","@radix-ui/react-dialog"],
    category: "custom",
    internalDependencies: ["button","dialog"],
  },
  "plan-upgrade-summary-modal": {
    name: "plan-upgrade-summary-modal",
    description: "A billing summary modal for confirming plan upgrades and downgrades",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react","@radix-ui/react-dialog"],
    category: "custom",
    internalDependencies: ["button","dialog"],
  },
  "let-us-drive-card": {
    name: "let-us-drive-card",
    description: "A managed service card with pricing, billing badge, 'Show details' link, and CTA for the full-service management section",
      category: "custom",
    dependencies: ["clsx","tailwind-merge"],
    category: "custom",
    internalDependencies: ["button","badge"],
  },
  "power-up-card": {
    name: "power-up-card",
    description: "An add-on service card with icon, title, pricing, description, and CTA button for the power-ups section",
      category: "custom",
    dependencies: ["clsx","tailwind-merge"],
    category: "custom",
    internalDependencies: ["button"],
  },
  "pricing-card": {
    name: "pricing-card",
    description: "A pricing tier card with plan name, pricing, feature checklist, CTA button, and optional popularity badge and addon footer",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["button","badge"],
  },
  "pricing-page": {
    name: "pricing-page",
    description: "A full pricing page layout composing plan-type tabs, billing toggle, pricing cards grid, power-ups section, and let-us-drive managed services section",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["button","page-header","pricing-toggle","pricing-card","power-up-card","let-us-drive-card"],
  },
  "pricing-toggle": {
    name: "pricing-toggle",
    description: "A plan type tab selector with billing period toggle for pricing pages. Pill-shaped tabs switch plan categories, and an optional switch toggles between monthly/yearly billing.",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","@radix-ui/react-switch@^1.2.6"],
    category: "custom",
    internalDependencies: ["switch"],
  },
  "talk-to-us-modal": {
    name: "talk-to-us-modal",
    description: "A modal dialog with icon, heading, description, and two action buttons prompting users to contact support. Triggered by PowerUpCard's Talk to us button.",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","@radix-ui/react-dialog"],
    category: "custom",
    internalDependencies: ["button","dialog"],
  },
  "bots": {
    name: "bots",
    description: "AI Bot management components — BotList, BotListHeader, BotListSearch, BotListCreateCard, BotListGrid, BotCard, CreateBotModal",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["badge","button","dialog","dropdown-menu"],
  },
  "file-upload-modal": {
    name: "file-upload-modal",
    description: "A reusable file upload modal with drag-and-drop, progress tracking, and error handling",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["dialog","button"],
  },
  "attachment-preview": {
    name: "attachment-preview",
    description: "A file attachment preview for chat composers with image, video, audio, and document previews",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: [],
  },
  "audio-media": {
    name: "audio-media",
    description: "A waveform-based audio player with play/pause, speed control, and SVG waveform visualization",
      category: "custom",
    dependencies: ["clsx","tailwind-merge"],
    category: "custom",
    internalDependencies: ["dropdown-menu"],
  },
  "carousel-media": {
    name: "carousel-media",
    description: "A horizontally scrollable card carousel with images, titles, and action buttons",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: [],
  },
  "chat-bubble": {
    name: "chat-bubble",
    description: "A chat message bubble with sender/receiver variants, delivery status, reply quote, and media slot",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["reply-quote"],
  },
  "chat-list-item": {
    name: "chat-list-item",
    description: "A chat list item showing contact name, message preview, timestamp, delivery status, and channel badge",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: [],
  },
  "chat-timeline-divider": {
    name: "chat-timeline-divider",
    description: "A timeline divider for chat message lists — renders centered content between horizontal lines with date, unread, and system event variants",
      category: "custom",
    dependencies: ["clsx","tailwind-merge"],
    category: "custom",
    internalDependencies: [],
  },
  "chat-composer": {
    name: "chat-composer",
    description: "A message composition area with textarea, action slots, reply preview, attachment slot, and send button",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["button","reply-quote"],
  },
  "doc-media": {
    name: "doc-media",
    description: "A document media component with preview, download, and file variants for chat messages",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: [],
  },
  "video-media": {
    name: "video-media",
    description: "A video player with thumbnail overlay, play/pause, seek bar, speed dropdown, volume, and fullscreen",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["dropdown-menu"],
  },
  "ivr-bot": {
    name: "ivr-bot",
    description: "IVR/Voicebot configuration page with Create Function modal (2-step wizard)",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["button","badge","switch","accordion","dialog","select","creatable-select","creatable-multi-select","page-header","tag","file-upload-modal","form-modal","text-field","textarea"],
  },
  "wallet-topup": {
    name: "wallet-topup",
    description: "A component for wallet top-up with amount selection and coupon support",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["accordion","button","input"],
  },
  "chat-types": {
    name: "chat-types",
    description: "Shared TypeScript interfaces for the chat template",
      category: "custom",
    dependencies: ["clsx","tailwind-merge"],
    category: "custom",
    internalDependencies: [],
  },
  "chat-transport": {
    name: "chat-transport",
    description: "ChatTransport interface and MockTransport with realistic fake data",
      category: "custom",
    dependencies: ["clsx","tailwind-merge"],
    category: "custom",
    internalDependencies: ["chat-types"],
  },
  "chat-provider": {
    name: "chat-provider",
    description: "React context provider for chat state management with transport abstraction",
      category: "custom",
    dependencies: ["clsx","tailwind-merge"],
    category: "custom",
    internalDependencies: ["chat-types","chat-transport"],
  },
  "chat-sidebar": {
    name: "chat-sidebar",
    description: "Chat inbox sidebar with search, tabs, and conversation list",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "custom",
    internalDependencies: ["chat-types","chat-provider","button","text-field","tabs","badge","chat-list-item"],
  },
  "chat-filter-panel": {
    name: "chat-filter-panel",
    description: "Assignee and channel filter panel with checkbox groups",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["chat-types","chat-provider","button","text-field","checkbox","dialog"],
  },
  "chat-new-panel": {
    name: "chat-new-panel",
    description: "New chat panel with contact search and add-contact modal",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["chat-types","chat-provider","button","text-field","dialog","avatar","dropdown-menu"],
  },
  "chat-message-list": {
    name: "chat-message-list",
    description: "Message list with all media renderers, delivery status, and reply functionality",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "custom",
    internalDependencies: ["chat-types","chat-provider","button","tooltip","spinner","avatar","tag","dropdown-menu","chat-timeline-divider","doc-media"],
  },
  "chat-header": {
    name: "chat-header",
    description: "Chat window header with assignment dropdown and resolve button",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: "custom",
    internalDependencies: ["chat-types","chat-provider","button","badge","tag","avatar","dropdown-menu","tooltip"],
  },
  "chat-input": {
    name: "chat-input",
    description: "Chat composer with canned messages, attachments, and keyboard navigation",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "custom",
    internalDependencies: ["chat-types","chat-provider","button","tooltip","dropdown-menu","confirmation-modal","chat-composer"],
  },
  "chat-template-modal": {
    name: "chat-template-modal",
    description: "Template selection modal with variable mapping, media upload, and live preview",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "custom",
    internalDependencies: ["chat-types","chat-provider","button","dialog","select-field","tabs","text-field","avatar","spinner","confirmation-modal"],
  },
  "chat-contact-panel": {
    name: "chat-contact-panel",
    description: "Contact details slide-out panel with view and edit modes",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "custom",
    internalDependencies: ["chat-types","chat-provider","button","text-field","switch","tag","dropdown-menu","accordion","confirmation-modal","panel"],
  },
  "chat-template": {
    name: "chat-template",
    description: "Complete chat application template — install this to get the full chat UI",
      category: "custom",
    dependencies: ["clsx","tailwind-merge","lucide-react","tailwindcss-animate"],
    category: "custom",
    internalDependencies: ["chat-types","chat-transport","chat-provider","chat-sidebar","chat-filter-panel","chat-new-panel","chat-message-list","chat-header","chat-input","chat-template-modal","chat-contact-panel","button","tooltip"],
  }
}

// Available categories
export const CATEGORIES = ["core","form","data","overlay","feedback","layout","custom"] as const
export type Category = typeof CATEGORIES[number]

/**
 * Get metadata for all components (fast, no source code loaded)
 */
export function getComponentList(): ComponentMeta[] {
  return Object.values(COMPONENT_METADATA)
}

/**
 * Get metadata for a specific component
 */
export function getComponentMeta(name: string): ComponentMeta | undefined {
  return COMPONENT_METADATA[name]
}

/**
 * Get all components in a specific category
 */
export function getCategoryRegistry(category: Category, prefix: string = ''): Registry {
  switch (category) {
    case 'core': return getCoreRegistry(prefix)
    case 'form': return getFormRegistry(prefix)
    case 'data': return getDataRegistry(prefix)
    case 'overlay': return getOverlayRegistry(prefix)
    case 'feedback': return getFeedbackRegistry(prefix)
    case 'layout': return getLayoutRegistry(prefix)
    case 'custom': return getCustomRegistry(prefix)
    default:
      throw new Error(`Unknown category: ${category}`)
  }
}

/**
 * Get a single component by name (lazy loads only the needed category)
 */
export async function getComponent(name: string, prefix: string = ''): Promise<ComponentDefinition | undefined> {
  const meta = COMPONENT_METADATA[name]
  if (!meta) return undefined

  const categoryRegistry = getCategoryRegistry(meta.category as Category, prefix)
  return categoryRegistry[name]
}

/**
 * Get the full registry (all components) - for backwards compatibility
 * Note: This loads ALL categories into memory. Prefer getComponent() for better performance.
 */
export async function getRegistry(prefix: string = ''): Promise<Registry> {
  const allComponents: Registry = {}

  for (const category of CATEGORIES) {
    const categoryRegistry = getCategoryRegistry(category, prefix)
    Object.assign(allComponents, categoryRegistry)
  }

  return allComponents
}

// Re-export types
export type { Registry, ComponentDefinition, ComponentMeta, ComponentFile } from './registry-types'
