import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Switch track variants (the outer container)
 */
const switchVariants = cva(
  // Arc track: 42 x 24 with 3px inside padding (no border). The fill is the ::after layer, which crossfades over 240ms,
  // so the track colour fades rather than jumping; the unchecked surface fades in 160ms. before: = an invisible ring that
  // reaches 4px beyond the box, so the pointer target is 50 x 32 (default) without moving layout. The track does not scale
  // on press; the thumb stretches instead (see the thumb).
  "peer group/switch relative isolate inline-flex shrink-0 box-border cursor-pointer items-center rounded-xl p-[3px] before:absolute before:-inset-1 before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] after:bg-v2-semantic-primary after:opacity-0 after:[transition:opacity_240ms_cubic-bezier(0.22,1,0.36,1),background-color_160ms_cubic-bezier(0.22,1,0.36,1)] [transition-property:color,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:after:transition-none focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-offset-[3px] focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))] disabled:cursor-not-allowed data-[state=checked]:after:opacity-100 data-[state=checked]:disabled:after:bg-v2-semantic-disabled-primary data-[state=unchecked]:bg-v2-semantic-primary-surface enabled:[@media(hover:hover)_and_(pointer:fine)]:hover:data-[state=unchecked]:bg-v2-semantic-border-layout enabled:[@media(hover:hover)_and_(pointer:fine)]:hover:data-[state=checked]:after:bg-v2-semantic-primary-hover aria-[readonly=true]:cursor-default aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-inset aria-[invalid=true]:ring-v2-semantic-error-primary aria-[invalid=true]:after:bg-v2-semantic-error-primary aria-[invalid=true]:focus-visible:outline-v2-semantic-error-primary",
  {
    variants: {
      size: {
        default: "h-6 w-[42px]",
        sm: "h-5 w-9",
        lg: "h-7 w-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Switch thumb variants (the sliding circle)
 *
 * Arc thumb: 18px (default) that travels the track inside its padding on a critically damped spring (visualDuration .3,
 * 490ms sampled as --arc-glide). While the track is pressed the thumb widens by ~28% of its size toward the far side, keeping
 * its far edge anchored, with the snappy spring (350ms) for the width; reduced motion skips the stretch.
 */
const switchThumbVariants = cva(
  "pointer-events-none relative z-[1] block shrink-0 rounded-full bg-[var(--v2-switch-thumb,var(--semantic-bg-primary))] group-aria-[invalid=true]/switch:data-[state=checked]:bg-[var(--v2-on-status,var(--semantic-bg-primary))] shadow-[0_0_0_0.5px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.14),0_2px_6px_rgba(0,0,0,0.06)] ring-0 [--arc-glide:linear(0,.075,.2163,.3756,.5147,.6358,.7282,.8024,.856,.8973,.9273,.9481,.9636,.9742,.9821,.9874,.9913,.9939,.9958,.9971,1)] [--arc-snappy:linear(0,.0506,.1667,.2966,.4251,.5482,.6476,.7298,.7994,.8508,.8924,.922,.9442,.9613,.973,.9815,.9877,.9918,.9947,.9967,1)] [transition:transform_490ms_var(--arc-glide),width_350ms_var(--arc-snappy),background-color_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none data-[state=unchecked]:translate-x-0 data-[disabled]:data-[state=checked]:bg-[var(--v2-switch-thumb-disabled,var(--v2-semantic-primary-surface,var(--semantic-primary-surface)))] data-[disabled]:data-[state=unchecked]:bg-[var(--v2-switch-thumb-disabled,var(--v2-semantic-bg-ui,var(--semantic-bg-ui)))]",
  {
    variants: {
      size: {
        default:
          "h-[18px] w-[18px] data-[state=checked]:translate-x-[18px] rtl:data-[state=checked]:-translate-x-[18px] motion-safe:[button:enabled:not([aria-readonly=true]):active_&]:w-[23px] motion-safe:[button:enabled:not([aria-readonly=true]):active_&]:data-[state=checked]:translate-x-[13px] motion-safe:rtl:[button:enabled:not([aria-readonly=true]):active_&]:data-[state=checked]:-translate-x-[13px]",
        sm: "h-3.5 w-3.5 data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4 motion-safe:[button:enabled:not([aria-readonly=true]):active_&]:w-[18px] motion-safe:[button:enabled:not([aria-readonly=true]):active_&]:data-[state=checked]:translate-x-3 motion-safe:rtl:[button:enabled:not([aria-readonly=true]):active_&]:data-[state=checked]:-translate-x-3",
        lg: "h-[22px] w-[22px] data-[state=checked]:translate-x-5 rtl:data-[state=checked]:-translate-x-5 motion-safe:[button:enabled:not([aria-readonly=true]):active_&]:w-7 motion-safe:[button:enabled:not([aria-readonly=true]):active_&]:data-[state=checked]:translate-x-3.5 motion-safe:rtl:[button:enabled:not([aria-readonly=true]):active_&]:data-[state=checked]:-translate-x-3.5",
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
      default: "text-sm leading-[1.4]",
      sm: "text-xs leading-[1.4]",
      lg: "text-base leading-[1.4]",
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
      default: "min-h-6",
      sm: "min-h-5",
      lg: "min-h-7",
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
  /** Keeps the switch focusable and in forms while preventing user changes. */
  readOnly?: boolean;
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
      readOnly,
      onClick,
      id,
      ...props
    }: SwitchProps,
    ref: React.Ref<React.ElementRef<typeof SwitchPrimitives.Root>>
  ) => {
    const generatedId = React.useId();
    // Only generate an id when a description needs one, so the default markup is unchanged.
    const hasDescription =
      description !== undefined &&
      description !== null &&
      description !== false;
    const controlId = hasDescription ? id || generatedId : id;
    const descriptionId = controlId + "-description";
    const switchElement = (
      <SwitchPrimitives.Root
        className={cn(switchVariants({ size, className }))}
        disabled={disabled}
        ref={ref}
        id={controlId}
        {...props}
        onClick={(event) => {
          onClick?.(event);
          if (readOnly) event.preventDefault();
        }}
        {...(readOnly ? { "aria-readonly": true } : {})}
        {...(hasDescription
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

    if (hasDescription) {
      const text = (
        <div className={cn("flex min-w-0 flex-col", disabled && "opacity-50")}>
          {label && (
            <label
              htmlFor={controlId}
              className={cn(
                labelSizeVariants({ size }),
                labelRowVariants({ size }),
                "flex items-center font-normal text-v2-semantic-text-primary",
                disabled
                  ? "cursor-not-allowed"
                  : readOnly
                    ? "cursor-default"
                    : "cursor-pointer"
              )}
            >
              {label}
            </label>
          )}
          <p
            id={descriptionId}
            className="m-0 mt-1 text-xs leading-4 text-v2-semantic-text-muted"
          >
            {description}
          </p>
        </div>
      );
      return (
        <div className="inline-flex items-start gap-3 font-[family-name:var(--font-v2,Inter,sans-serif)]">
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
            "inline-flex items-center gap-3 font-[family-name:var(--font-v2,Inter,sans-serif)] cursor-pointer",
            disabled && "cursor-not-allowed",
            readOnly && "cursor-default"
          )}
        >
          {labelPosition === "left" && (
            <span
              className={cn(
                labelSizeVariants({ size }),
                "font-normal text-v2-semantic-text-primary",
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
                "font-normal text-v2-semantic-text-primary",
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
