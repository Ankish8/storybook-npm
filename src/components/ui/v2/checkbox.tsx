import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Checkbox box variants (the outer container)
 */
const checkboxVariants = cva(
  // before: = an invisible ring that reaches 4px beyond the border box (-5px from the padding box, which excludes the 1px
  // border), so the pointer target is 28px for the default box without moving layout.
  // The press scale and the check pop (zoom from .7, run by tailwindcss-animate when data-state flips) animate
  // transform only, so colour and border keep their own 150ms timing. The zoom value is gated by the motion-safe
  // variant too: animate-in resets --tw-enter-* to initial and its motion-safe copy is emitted after the plain
  // utilities, so an ungated zoom-in or fade-in value is silently reset to 1.
  "peer relative inline-flex items-center justify-center shrink-0 box-border rounded border border-solid before:absolute before:-inset-[5px] before:content-[''] [transition-property:background-color,border-color,box-shadow,transform] [transition-duration:150ms,150ms,150ms,200ms] [transition-timing-function:ease-out,ease-out,ease-out,var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] enabled:active:scale-[0.96] enabled:active:[transition-duration:150ms,150ms,150ms,80ms] motion-reduce:[transition-property:background-color,border-color,box-shadow] motion-reduce:enabled:active:scale-100 data-[state=checked]:motion-safe:animate-in data-[state=checked]:motion-safe:zoom-in-[0.7] data-[state=indeterminate]:motion-safe:animate-in data-[state=indeterminate]:motion-safe:zoom-in-[0.7] data-[state=checked]:motion-safe:[animation-duration:200ms] data-[state=indeterminate]:motion-safe:[animation-duration:200ms] data-[state=checked]:motion-safe:[animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] data-[state=indeterminate]:motion-safe:[animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--semantic-primary-surface)] disabled:cursor-not-allowed data-[state=checked]:bg-semantic-primary data-[state=checked]:border-semantic-primary data-[state=checked]:text-semantic-text-inverted data-[state=checked]:enabled:[@media(hover:hover)]:hover:bg-semantic-primary-hover data-[state=checked]:enabled:[@media(hover:hover)]:hover:border-semantic-primary-hover data-[state=checked]:enabled:[@media(hover:hover)]:hover:shadow-[0_0_0_2px_var(--semantic-primary-surface)] data-[state=checked]:disabled:bg-semantic-disabled-primary data-[state=checked]:disabled:border-semantic-disabled-primary data-[state=indeterminate]:bg-semantic-primary data-[state=indeterminate]:border-semantic-primary data-[state=indeterminate]:text-semantic-text-inverted data-[state=indeterminate]:enabled:[@media(hover:hover)]:hover:bg-semantic-primary-hover data-[state=indeterminate]:disabled:bg-semantic-disabled-primary data-[state=indeterminate]:disabled:border-semantic-disabled-primary data-[state=unchecked]:bg-semantic-bg-primary data-[state=unchecked]:border-semantic-border-input data-[state=unchecked]:enabled:[@media(hover:hover)]:hover:border-[var(--color-primary-100)] data-[state=unchecked]:enabled:[@media(hover:hover)]:hover:bg-semantic-bg-ui data-[state=unchecked]:focus-visible:border-semantic-primary data-[state=unchecked]:disabled:border-semantic-bg-ui",
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

/**
 * With a description the label row is as tall as the box so the box lines up with the first line of text
 */
const labelRowVariants = cva("", {
  variants: {
    size: {
      default: "min-h-5",
      sm: "min-h-4",
      lg: "min-h-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * Tick draw (the classes on the Check / Minus icons below): a stroke-dashoffset transition, 150ms linear after 15ms. The Radix indicator mounts already checked, so there is no
 * state change to transition from: @starting-style supplies the "from" value on mount. The dash is a little longer
 * than the path (24 vs 22.6 for the check, 15 vs 14 for the minus) and starts past its end so a round cap never
 * leaves a dot before the draw begins.
 */

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
  /**
   * Optional supporting text under the label (12px, muted). Linked to the box with aria-describedby.
   * The box, label and description are laid out side by side; the label is a `<label htmlFor>` so only
   * the label text toggles the box.
   */
  description?: React.ReactNode;
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
      description,
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
    const generatedId = React.useId();
    // Only generate an id when a description needs one, so the default markup is unchanged.
    const controlId = description ? id || generatedId : id;
    const descriptionId = controlId + "-description";
    const checkbox = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={controlId}
        disabled={disabled}
        className={cn(
          checkboxVariants({ size }),
          "cursor-pointer",
          className,
          checkboxClassName
        )}
        {...props}
        {...(description
          ? {
              "aria-describedby": [props["aria-describedby"], descriptionId]
                .filter(Boolean)
                .join(" "),
            }
          : {})}
      >
        {/* Entering: the stroke draws (see the classes on the icons) and the box pops, so the wrapper itself only fades under
            reduced motion. Leaving: the tick fades and shrinks out for 120ms. */}
        <CheckboxPrimitive.Indicator className="flex items-center justify-center [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] data-[state=checked]:motion-reduce:animate-[v2-fade-in_150ms_ease-out] data-[state=indeterminate]:motion-reduce:animate-[v2-fade-in_150ms_ease-out] data-[state=unchecked]:motion-safe:[animation-duration:120ms] data-[state=unchecked]:motion-safe:animate-out data-[state=unchecked]:motion-safe:fade-out-0 data-[state=unchecked]:motion-safe:zoom-out-[0.85]">
          {props.checked === "indeterminate" ? (
            <Minus
              className={cn(
                iconSizeVariants({ size }),
                "stroke-[3]",
                "[&>path]:[stroke-dasharray:15_20] [@starting-style]:[&>path]:[stroke-dashoffset:17] [&>path]:[transition:stroke-dashoffset_150ms_linear_15ms] motion-reduce:[&>path]:[transition:none]"
              )}
            />
          ) : (
            <Check
              className={cn(
                iconSizeVariants({ size }),
                "stroke-[3]",
                "[&>path]:[stroke-dasharray:24_30] [@starting-style]:[&>path]:[stroke-dashoffset:26] [&>path]:[transition:stroke-dashoffset_150ms_linear_15ms] motion-reduce:[&>path]:[transition:none]"
              )}
            />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    if (description) {
      const text = (
        <div className={cn("flex min-w-0 flex-col", disabled && "opacity-50")}>
          {label && (
            <label
              htmlFor={controlId}
              className={cn(
                labelSizeVariants({ size }),
                labelRowVariants({ size }),
                "flex items-center font-medium text-[var(--v2-text-primary,#484848)]",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                labelClassName
              )}
            >
              {label}
            </label>
          )}
          <p
            id={descriptionId}
            className="m-0 mt-1 text-xs leading-4 text-[var(--v2-text-muted,#707070)]"
          >
            {description}
          </p>
        </div>
      );
      return (
        <div className="inline-flex items-start gap-2 font-[family-name:var(--font-v2,Inter,sans-serif)]">
          {labelPosition === "left" && text}
          {checkbox}
          {labelPosition === "right" && text}
        </div>
      );
    }

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
