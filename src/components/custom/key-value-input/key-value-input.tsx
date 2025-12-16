import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../../ui/button"
import { KeyValueRow } from "./key-value-row"
import type { KeyValueInputProps, KeyValuePair } from "./types"

// Helper to generate unique IDs
const generateId = () =>
  `kv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

/**
 * KeyValueInput - A component for managing key-value pairs
 *
 * Install via CLI:
 * ```bash
 * npx myoperator-ui add key-value-input
 * ```
 *
 * Or import directly from npm:
 * ```tsx
 * import { KeyValueInput } from "@myoperator/ui"
 * ```
 *
 * @example
 * ```tsx
 * <KeyValueInput
 *   title="HTTP Headers"
 *   description="Add custom headers for the webhook request"
 *   value={headers}
 *   onChange={setHeaders}
 * />
 * ```
 */
export const KeyValueInput = React.forwardRef<
  HTMLDivElement,
  KeyValueInputProps
>(
  (
    {
      title,
      description,
      addButtonText = "Add Header",
      maxItems = 10,
      keyPlaceholder = "Key",
      valuePlaceholder = "Value",
      keyLabel = "Key",
      valueLabel = "Value",
      value: controlledValue,
      onChange,
      defaultValue = [],
      className,
      ...props
    },
    ref
  ) => {
    // Controlled vs uncontrolled state
    const [internalPairs, setInternalPairs] =
      React.useState<KeyValuePair[]>(defaultValue)

    const isControlled = controlledValue !== undefined
    const pairs = isControlled ? controlledValue : internalPairs

    // Track which keys have been touched for validation
    const [touchedKeys, setTouchedKeys] = React.useState<Set<string>>(new Set())

    const handlePairsChange = React.useCallback(
      (newPairs: KeyValuePair[]) => {
        if (!isControlled) {
          setInternalPairs(newPairs)
        }
        onChange?.(newPairs)
      },
      [isControlled, onChange]
    )

    // Check for duplicate keys (case-insensitive)
    const getDuplicateKeys = React.useCallback((): Set<string> => {
      const keyCount = new Map<string, number>()
      pairs.forEach((pair) => {
        if (pair.key.trim()) {
          const key = pair.key.toLowerCase()
          keyCount.set(key, (keyCount.get(key) || 0) + 1)
        }
      })
      const duplicates = new Set<string>()
      keyCount.forEach((count, key) => {
        if (count > 1) duplicates.add(key)
      })
      return duplicates
    }, [pairs])

    const duplicateKeys = getDuplicateKeys()

    // Add new row
    const handleAdd = () => {
      if (pairs.length >= maxItems) return
      const newPair: KeyValuePair = {
        id: generateId(),
        key: "",
        value: "",
      }
      handlePairsChange([...pairs, newPair])
    }

    // Update key
    const handleKeyChange = (id: string, key: string) => {
      handlePairsChange(
        pairs.map((pair) => (pair.id === id ? { ...pair, key } : pair))
      )
      setTouchedKeys((prev) => new Set(prev).add(id))
    }

    // Update value
    const handleValueChange = (id: string, value: string) => {
      handlePairsChange(
        pairs.map((pair) => (pair.id === id ? { ...pair, value } : pair))
      )
    }

    // Delete row
    const handleDelete = (id: string) => {
      handlePairsChange(pairs.filter((pair) => pair.id !== id))
      setTouchedKeys((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }

    const isAtLimit = pairs.length >= maxItems
    const addButtonTitle = isAtLimit
      ? `Maximum of ${maxItems} items allowed`
      : undefined

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* Header */}
        <div className="mb-3">
          <h3 className="m-0 text-base font-semibold text-[#333333]">{title}</h3>
          {description && (
            <p className="m-0 text-sm text-[#6B7280] mt-1">{description}</p>
          )}
        </div>

        {/* Content Container with Background - only show when there are items */}
        {pairs.length > 0 && (
          <div className="bg-[#F9FAFB] rounded-lg p-4 mb-4">
            {/* Column Headers */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <span className="text-sm font-medium text-[#333333]">
                  {keyLabel}
                  <span className="text-[#FF3B3B] ml-0.5">*</span>
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-[#333333]">
                  {valueLabel}
                </span>
              </div>
              {/* Spacer for delete button column */}
              <div className="w-8 flex-shrink-0" />
            </div>

            {/* Rows */}
            <div className="space-y-3">
              {pairs.map((pair) => (
                <KeyValueRow
                  key={pair.id}
                  pair={pair}
                  isDuplicateKey={duplicateKeys.has(pair.key.toLowerCase())}
                  isKeyEmpty={touchedKeys.has(pair.id) && !pair.key.trim()}
                  keyPlaceholder={keyPlaceholder}
                  valuePlaceholder={valuePlaceholder}
                  onKeyChange={handleKeyChange}
                  onValueChange={handleValueChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Button using dashed variant - outside the gray container */}
        <Button
          type="button"
          variant="dashed"
          onClick={handleAdd}
          disabled={isAtLimit}
          title={addButtonTitle}
          className="w-full justify-center"
        >
          <Plus className="h-4 w-4" />
          {addButtonText}
        </Button>

        {/* Limit indicator */}
        {isAtLimit && (
          <p className="m-0 text-xs text-[#6B7280] mt-2 text-center">
            Maximum of {maxItems} items reached
          </p>
        )}
      </div>
    )
  }
)
KeyValueInput.displayName = "KeyValueInput"
