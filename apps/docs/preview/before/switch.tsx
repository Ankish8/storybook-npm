import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Switch track variants (the outer container)
 */
const switchVariants = cva(
  // before: = an invisible ring that reaches 4px beyond the border box (-6px from the padding box, which excludes the 2px
  // border), so the pointer target is 44 x 28 (default) without moving layout. Press scales the
  // track only (the thumb is deliberately not stretched, see design/V2-MOTION.md).
  "peer relative inline-flex shrink-0 box-border cursor-pointer items-center rounded-xl border-2 border-solid border-transparent before:absolute before:-inset-[6px] before:content-[''] [transition-property:color,background-color,border-color,transform] [transition-duration:240ms,240ms,240ms,200ms] [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] enabled:active:scale-[0.96] enabled:active:[transition-duration:240ms,240ms,240ms,80ms] motion-reduce:[transition-property:color,background-color,border-color] motion-reduce:enabled:active:scale-100 focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary disabled:cursor-not-allowed data-[state=checked]:bg-semantic-primary data-[state=unchecked]:bg-semantic-primary-surface enabled:[@media(hover:hover)]:hover:data-[state=checked]:bg-semantic-primary-hover enabled:[@media(hover:hover)]:hover:data-[state=unchecked]:bg-semantic-border-layout disabled:data-[state=checked]:bg-semantic-disabled-primary",
  {
    variants: {
      size: {
        default: "h-5 w-9",
        sm: "h-[18px] w-8",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Switch thumb variants (the sliding circle)
 */
const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-semantic-bg-primary shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] ring-0 transition-transform [transition-duration:240ms] [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none data-[state=unchecked]:translate-x-0 data-[disabled]:data-[state=checked]:bg-semantic-primary-surface data-[disabled]:data-[state=unchecked]:bg-semantic-bg-ui",
  {
    variants: {
      size: {
        default: "h-4 w-4 data-[state=checked]:translate-x-4",
        sm: "h-3.5 w-3.5 data-[state=checked]:translate-x-3.5",
        lg: "h-5 w-5 data-[state=checked]:translate-x-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

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
 * With a description the label row is as tall as the track so the track lines up with the first line of text
 */
const labelRowVariants = cva("", {
  variants: {
    size: {
      default: "min-h-5",
      sm: "min-h-[18px]",
      lg: "min-h-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * A switch/toggle component for boolean inputs with on/off states
 *
 * @example
 * ```tsx
 * <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
 * <Switch size="sm" disabled />
 * <Switch size="lg" checked label="Enable notifications" />
 * ```
 */
export interface SwitchProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
      "onChange"
    >,
    VariantProps<typeof switchVariants> {
  /** Optional label text */
  label?: string;
  /**
   * Optional supporting text under the label (12px, muted). Linked to the switch with aria-describedby.
   * The label is a `<label htmlFor>` so only the label text toggles the switch.
   */
  description?: React.ReactNode;
  /** Position of the label */
  labelPosition?: "left" | "right";
}

const Switch = React.forwardRef(
  (
    {
      className,
      size,
      label,
      description,
      labelPosition = "right",
      disabled,
      id,
      ...props
    }: SwitchProps,
    ref: React.Ref<React.ElementRef<typeof SwitchPrimitives.Root>>
  ) => {
    const generatedId = React.useId();
    // Only generate an id when a description needs one, so the default markup is unchanged.
    const controlId = description ? id || generatedId : id;
    const descriptionId = controlId + "-description";
    const switchElement = (
      <SwitchPrimitives.Root
        className={cn(switchVariants({ size, className }))}
        disabled={disabled}
        ref={ref}
        id={controlId}
        {...props}
        {...(description
          ? {
              "aria-describedby": [props["aria-describedby"], descriptionId]
                .filter(Boolean)
                .join(" "),
            }
          : {})}
      >
        <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ size }))} />
      </SwitchPrimitives.Root>
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
                disabled ? "cursor-not-allowed" : "cursor-pointer"
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
          {switchElement}
          {labelPosition === "right" && text}
        </div>
      );
    }

    if (label) {
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
                disabled && "opacity-50"
              )}
            >
              {label}
            </span>
          )}
          {switchElement}
          {labelPosition === "right" && (
            <span
              className={cn(
                labelSizeVariants({ size }),
                "font-medium text-[var(--v2-text-primary,#484848)]",
                disabled && "opacity-50"
              )}
            >
              {label}
            </span>
          )}
        </label>
      );
    }

    return switchElement;
  }
);
Switch.displayName = "Switch";

export { Switch, switchVariants };
