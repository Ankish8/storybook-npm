import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Checkbox box variants (the outer container)
 */
const checkboxVariants = cva(
  "peer inline-flex items-center justify-center shrink-0 box-border rounded border border-solid transition-[background-color,border-color,box-shadow] duration-150 ease-in-out focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--semantic-primary-surface)] disabled:cursor-not-allowed data-[state=checked]:bg-semantic-primary data-[state=checked]:border-semantic-primary data-[state=checked]:text-semantic-text-inverted data-[state=checked]:enabled:hover:bg-semantic-primary-hover data-[state=checked]:enabled:hover:border-semantic-primary-hover data-[state=checked]:enabled:hover:shadow-[0_0_0_2px_var(--semantic-primary-surface)] data-[state=checked]:disabled:bg-semantic-disabled-primary data-[state=checked]:disabled:border-semantic-disabled-primary data-[state=indeterminate]:bg-semantic-primary data-[state=indeterminate]:border-semantic-primary data-[state=indeterminate]:text-semantic-text-inverted data-[state=indeterminate]:enabled:hover:bg-semantic-primary-hover data-[state=indeterminate]:disabled:bg-semantic-disabled-primary data-[state=indeterminate]:disabled:border-semantic-disabled-primary data-[state=unchecked]:bg-semantic-bg-primary data-[state=unchecked]:border-semantic-border-input data-[state=unchecked]:enabled:hover:border-[var(--color-primary-100)] data-[state=unchecked]:enabled:hover:bg-semantic-bg-ui data-[state=unchecked]:focus-visible:border-semantic-primary data-[state=unchecked]:disabled:border-semantic-bg-ui",
  {
    variants: {
      size: {
        default: "h-5 w-5",
        sm: "h-4 w-4",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Icon size variants based on checkbox size
 */
const iconSizeVariants = cva("", {
  variants: {
    size: {
      default: "h-3.5 w-3.5",
      sm: "h-3 w-3",
      lg: "h-4 w-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * Label text size variants
 */
const labelSizeVariants = cva("", {
  variants: {
    size: {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type CheckedState = boolean | "indeterminate";

/**
 * A tri-state checkbox component with label support. Built on Radix UI Checkbox primitive.
 *
 * @example
 * ```tsx
 * <Checkbox checked={isEnabled} onCheckedChange={setIsEnabled} />
 * <Checkbox size="sm" disabled />
 * <Checkbox checked="indeterminate" label="Select all" />
 * <Checkbox label="Accept terms" labelPosition="right" />
 * <Checkbox id="terms" label="Accept terms" separateLabel />
 * ```
 */
export interface CheckboxProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
      "onChange"
    >,
    VariantProps<typeof checkboxVariants> {
  /** Optional label text */
  label?: string;
  /** Position of the label */
  labelPosition?: "left" | "right";
  /** Class name applied to the checkbox element */
  checkboxClassName?: string;
  /** Class name applied to the label element */
  labelClassName?: string;
  /** If true, uses separate labels with htmlFor/id association instead of wrapping the input. Requires id prop. */
  separateLabel?: boolean;
}

const Checkbox = React.forwardRef(
  (
    {
      className,
      size,
      label,
      labelPosition = "right",
      checkboxClassName,
      labelClassName,
      separateLabel = false,
      id,
      disabled,
      ...props
    }: CheckboxProps,
    ref: React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>>
  ) => {
    const checkbox = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        disabled={disabled}
        className={cn(
          checkboxVariants({ size }),
          "cursor-pointer",
          className,
          checkboxClassName
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          {props.checked === "indeterminate" ? (
            <Minus className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
          ) : (
            <Check className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    if (label) {
      // separateLabel mode: use htmlFor/id association instead of wrapping
      if (separateLabel && id) {
        return (
          <div className="inline-flex items-center gap-2 font-[family-name:var(--font-v2,Inter,sans-serif)]">
            {labelPosition === "left" && (
              <label
                htmlFor={id}
                className={cn(
                  labelSizeVariants({ size }),
                  "font-medium text-[var(--v2-text-primary,#484848)] cursor-pointer",
                  disabled && "opacity-50 cursor-not-allowed",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            {checkbox}
            {labelPosition === "right" && (
              <label
                htmlFor={id}
                className={cn(
                  labelSizeVariants({ size }),
                  "font-medium text-[var(--v2-text-primary,#484848)] cursor-pointer",
                  disabled && "opacity-50 cursor-not-allowed",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
          </div>
        );
      }

      // Default: wrapping label
      return (
        <label
          className={cn(
            "inline-flex items-center gap-2 font-[family-name:var(--font-v2,Inter,sans-serif)] cursor-pointer",
            disabled && "cursor-not-allowed"
          )}
        >
          {labelPosition === "left" && (
            <span
              className={cn(
                labelSizeVariants({ size }),
                "font-medium text-[var(--v2-text-primary,#484848)]",
                disabled && "opacity-50",
                labelClassName
              )}
            >
              {label}
            </span>
          )}
          {checkbox}
          {labelPosition === "right" && (
            <span
              className={cn(
                labelSizeVariants({ size }),
                "font-medium text-[var(--v2-text-primary,#484848)]",
                disabled && "opacity-50",
                labelClassName
              )}
            >
              {label}
            </span>
          )}
        </label>
      );
    }

    return checkbox;
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
