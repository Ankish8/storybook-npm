import * as React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import type { KeyValueRowProps } from "./types";

/**
 * Individual key-value pair row with inputs and delete button
 */
export const KeyValueRow = React.forwardRef<
  HTMLDivElement,
  KeyValueRowProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      pair,
      isDuplicateKey,
      isKeyEmpty,
      isValueEmpty,
      keyRequired = true,
      valueRequired = true,
      keyPlaceholder = "Key",
      valuePlaceholder = "Value",
      onKeyChange,
      onValueChange,
      onDelete,
      className,
      ...props
    },
    ref
  ) => {
    // Determine if inputs should show error state
    const keyHasError = isDuplicateKey || (keyRequired && isKeyEmpty);
    const valueHasError = valueRequired && isValueEmpty;

    return (
      <div
        ref={ref}
        className={cn("flex items-start gap-3", className)}
        {...props}
      >
        {/* Key Input */}
        <div className="flex-1">
          <Input
            value={pair.key}
            onChange={(e) => onKeyChange(pair.id, e.target.value)}
            placeholder={keyPlaceholder}
            state={keyHasError ? "error" : "default"}
            required={keyRequired}
            aria-label="Key"
          />
        </div>

        {/* Value Input */}
        <div className="flex-1">
          <Input
            value={pair.value}
            onChange={(e) => onValueChange(pair.id, e.target.value)}
            placeholder={valuePlaceholder}
            state={valueHasError ? "error" : "default"}
            required={valueRequired}
            aria-label="Value"
          />
        </div>

        {/* Delete Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(pair.id)}
          className="text-gray-400 hover:text-[#EF4444] hover:bg-[#FEF2F2] flex-shrink-0"
          aria-label="Delete row"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);
KeyValueRow.displayName = "KeyValueRow";
