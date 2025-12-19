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
  'button': {
    name: 'button',
    description: 'A customizable button component with variants, sizes, and icons',
    dependencies: ["@radix-ui/react-slot","class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: 'core',
    internalDependencies: [],
  },
  'badge': {
    name: 'badge',
    description: 'A status badge component with active, failed, disabled, outline, secondary, and destructive variants',
    dependencies: ["@radix-ui/react-slot","class-variance-authority","clsx","tailwind-merge"],
    category: 'core',
    internalDependencies: [],
  },
  'typography': {
    name: 'typography',
    description: 'A semantic typography component with kind, variant, color, alignment, and truncation support',
    dependencies: ["clsx","tailwind-merge"],
    category: 'core',
    internalDependencies: [],
  },
  'input': {
    name: 'input',
    description: 'A text input component with error and disabled states',
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: 'form',
    internalDependencies: [],
  },
  'select': {
    name: 'select',
    description: 'A select dropdown component built on Radix UI Select',
    dependencies: ["@radix-ui/react-select","class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: 'form',
    internalDependencies: [],
  },
  'checkbox': {
    name: 'checkbox',
    description: 'A tri-state checkbox component with label support (checked, unchecked, indeterminate). Built on Radix UI Checkbox.',
    dependencies: ["@radix-ui/react-checkbox","class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: 'form',
    internalDependencies: [],
  },
  'switch': {
    name: 'switch',
    description: 'A switch/toggle component for boolean inputs with on/off states. Built on Radix UI Switch.',
    dependencies: ["@radix-ui/react-switch","class-variance-authority","clsx","tailwind-merge"],
    category: 'form',
    internalDependencies: [],
  },
  'text-field': {
    name: 'text-field',
    description: 'A text field with label, helper text, icons, and validation states',
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: 'form',
    internalDependencies: [],
  },
  'select-field': {
    name: 'select-field',
    description: 'A select field with label, helper text, and validation states',
    dependencies: ["@radix-ui/react-select","clsx","tailwind-merge","lucide-react"],
    category: 'form',
    internalDependencies: [],
  },
  'multi-select': {
    name: 'multi-select',
    description: 'A multi-select dropdown component with search, badges, and async loading',
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: 'form',
    internalDependencies: [],
  },
  'table': {
    name: 'table',
    description: 'A composable table component with size variants, loading/empty states, sticky columns, and sorting support',
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: 'data',
    internalDependencies: [],
  },
  'dialog': {
    name: 'dialog',
    description: 'A modal dialog component built on Radix UI Dialog with size variants and animations',
    dependencies: ["@radix-ui/react-dialog","class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: 'overlay',
    internalDependencies: [],
  },
  'dropdown-menu': {
    name: 'dropdown-menu',
    description: 'A dropdown menu component for displaying actions and options',
    dependencies: ["@radix-ui/react-dropdown-menu","clsx","tailwind-merge","lucide-react"],
    category: 'overlay',
    internalDependencies: [],
  },
  'tooltip': {
    name: 'tooltip',
    description: 'A popup that displays information related to an element when hovered or focused',
    dependencies: ["@radix-ui/react-tooltip","clsx","tailwind-merge"],
    category: 'overlay',
    internalDependencies: [],
  },
  'delete-confirmation-modal': {
    name: 'delete-confirmation-modal',
    description: 'A confirmation modal requiring text input to confirm deletion',
    dependencies: ["clsx","tailwind-merge"],
    category: 'overlay',
    internalDependencies: ["dialog","button","input"],
  },
  'confirmation-modal': {
    name: 'confirmation-modal',
    description: 'A simple confirmation modal for yes/no decisions',
    dependencies: ["clsx","tailwind-merge"],
    category: 'overlay',
    internalDependencies: ["dialog","button"],
  },
  'tag': {
    name: 'tag',
    description: 'A tag component for event labels with optional bold label prefix',
    dependencies: ["class-variance-authority","clsx","tailwind-merge"],
    category: 'feedback',
    internalDependencies: [],
  },
  'alert': {
    name: 'alert',
    description: 'A dismissible alert component for notifications, errors, warnings, and success messages with icons, actions, and controlled visibility',
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: 'feedback',
    internalDependencies: [],
  },
  'toast': {
    name: 'toast',
    description: 'A toast notification component for displaying brief messages at screen corners, with auto-dismiss and stacking support',
    dependencies: ["@radix-ui/react-toast","class-variance-authority","lucide-react","clsx","tailwind-merge"],
    category: 'feedback',
    internalDependencies: [],
  },
  'accordion': {
    name: 'accordion',
    description: 'An expandable/collapsible accordion component with single or multiple mode support',
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: 'layout',
    internalDependencies: [],
  },
  'page-header': {
    name: 'page-header',
    description: 'A page header component with icon, title, description, and action buttons',
    dependencies: ["class-variance-authority","clsx","tailwind-merge","lucide-react"],
    category: 'layout',
    internalDependencies: [],
  },
  'event-selector': {
    name: 'event-selector',
    description: 'A component for selecting webhook events with groups, categories, and tri-state checkboxes',
    dependencies: ["clsx","tailwind-merge"],
    category: 'custom',
    internalDependencies: ["checkbox","accordion"],
  },
  'key-value-input': {
    name: 'key-value-input',
    description: 'A component for managing key-value pairs with validation and duplicate detection',
    dependencies: ["clsx","tailwind-merge","lucide-react"],
    category: 'custom',
    internalDependencies: ["button","input"],
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
