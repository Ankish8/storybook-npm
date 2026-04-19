import * as React from "react"

/** Shared fields for every integration row (required). */
export interface IntegrationItemBase {
  id: string
  /** Row title (single line with ellipsis when overflow; full text shown via native tooltip on hover) */
  label: string
  /** Integration icon (e.g. an `<img>` or SVG) */
  icon: React.ReactNode
  /** Called when the user activates edit for this row — receives this row's `id` */
  onEdit: (integrationId: string) => void
  /** Called when the user activates delete for this row — receives this row's `id` */
  onDelete: (integrationId: string) => void
}

/** Row with optional description (default). */
export type IntegrationItemWithOptionalDescription = IntegrationItemBase & {
  /** Optional body copy (max two lines with ellipsis; full text shown via native tooltip on hover) */
  description?: string
}

/** Row where description is required — use with `descriptionRequirement="required"` on the section. */
export type IntegrationItemWithRequiredDescription = IntegrationItemBase & {
  description: string
}

/** Default integration row: `icon`, `label`, `onEdit`, and `onDelete` are required; `description` is optional unless the section sets `descriptionRequirement="required"`. */
export type IntegrationItem = IntegrationItemWithOptionalDescription

type BotIntegrationsShared = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Called when user clicks the add integration button */
  onAdd?: () => void
  /** Title shown in the empty state */
  emptyStateTitle?: string
  /** Description shown in the empty state */
  emptyStateDescription?: string
  /** Custom icon for the empty state */
  emptyStateIcon?: React.ReactNode
  /** Hover text shown on the info icon next to the title */
  infoTooltip?: string
  /** Disables the add button and action buttons */
  disabled?: boolean
}

export type BotIntegrationsProps = BotIntegrationsShared &
  (
    | {
        /**
         * Whether each integration must include `description`.
         * - `"optional"` (default): `description` may be omitted on each item.
         * - `"required"`: TypeScript requires `description` on every item.
         */
        descriptionRequirement?: "optional"
        integrations: IntegrationItemWithOptionalDescription[]
      }
    | {
        descriptionRequirement: "required"
        integrations: IntegrationItemWithRequiredDescription[]
      }
  )
