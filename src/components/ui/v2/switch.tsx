import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Switch track variants (the outer container)
 */
const switchVariants = cva(
  "peer inline-flex shrink-0 box-border cursor-pointer items-center rounded-xl border-2 border-solid border-transparent transition-colors focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary disabled:cursor-not-allowed data-[state=checked]:bg-semantic-primary data-[state=unchecked]:bg-semantic-primary-surface enabled:hover:data-[state=checked]:bg-semantic-primary-hover enabled:hover:data-[state=unchecked]:bg-semantic-border-layout disabled:data-[state=checked]:bg-semantic-disabled-primary",
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
  "pointer-events-none block rounded-full bg-semantic-bg-primary shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] ring-0 transition-transform data-[state=unchecked]:translate-x-0 data-[disabled]:data-[state=checked]:bg-semantic-primary-surface data-[disabled]:data-[state=unchecked]:bg-semantic-bg-ui",
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
  /** Position of the label */
  labelPosition?: "left" | "right";
}

const Switch = React.forwardRef(
  (
    {
      className,
      size,
      label,
      labelPosition = "right",
      disabled,
      ...props
    }: SwitchProps,
    ref: React.Ref<React.ElementRef<typeof SwitchPrimitives.Root>>
  ) => {
    const switchElement = (
      <SwitchPrimitives.Root
        className={cn(switchVariants({ size, className }))}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ size }))} />
      </SwitchPrimitives.Root>
    );

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
                "font-semibold text-semantic-text-secondary",
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
                "font-semibold text-semantic-text-secondary",
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
