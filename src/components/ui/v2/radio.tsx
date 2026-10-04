import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextValue {
  name: string;
  value?: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}
const RadioContext = React.createContext<RadioGroupContextValue | null>(null);
export interface RadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
}
const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      orientation = "vertical",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedName = React.useId();
    const [localValue, setLocalValue] = React.useState(defaultValue);
    const current = value === undefined ? localValue : value;
    const change = (next: string) => {
      if (value === undefined) setLocalValue(next);
      onValueChange?.(next);
    };
    return (
      <RadioContext.Provider
        value={{
          name: name || generatedName,
          value: current,
          disabled,
          onValueChange: change,
        }}
      >
        <div
          ref={ref}
          role="radiogroup"
          aria-orientation={orientation}
          aria-disabled={disabled || undefined}
          className={cn(
            "flex gap-3 font-[family-name:var(--font-v2,Inter,sans-serif)]",
            orientation === "vertical" ? "flex-col" : "flex-wrap items-center",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </RadioContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";
/**
 * Radio control, in the `input` class string below. The dot is a radial gradient sized by background-size (a gradient itself cannot be tweened), so it grows from
 * the centre: 0 -> 6px when selected, 8px while pressed (100ms). before: is an invisible ring reaching 4px beyond the border box
 * (-5px from the padding box, which excludes the border, drawn as 1px), making the pointer target 24px. Press scales the circle .96 (80ms down, 200ms back). Hover is gated to real hover devices.
 */
export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /**
   * `card` makes the whole option a bordered target (16px padding, 8px radius): hover border, and a primary border
   * with a tinted surface when selected. Defaults to `default`, the circle with a label beside it.
   */
  variant?: "default" | "card";
  onCheckedChange?: (checked: boolean) => void;
}
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      description,
      variant = "default",
      id,
      name,
      value,
      checked,
      disabled,
      onChange,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(RadioContext);
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const isDisabled = Boolean(disabled || context?.disabled);
    const isChecked =
      checked ?? (context ? context.value === String(value) : undefined);
    const labelId = inputId + "-label";
    const input = (
      <input
        ref={ref}
        id={inputId}
        type="radio"
        name={name || context?.name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        aria-describedby={
          description ? inputId + "-description" : props["aria-describedby"]
        }
        {...(variant === "card" && label ? { "aria-labelledby": labelId } : {})}
        className={cn(
          // Dot, hit area and press: see the comment above RadioProps.
          "relative mt-0.5 size-4 shrink-0 appearance-none rounded-full border-[1.2px] border-solid border-semantic-border-layout bg-semantic-bg-primary bg-center bg-no-repeat [--dot:var(--semantic-primary)] bg-[radial-gradient(circle_closest-side,var(--dot)_100%,transparent_100%)] bg-[length:0px_0px] before:absolute before:-inset-[5px] before:content-[''] [transition-property:background-color,background-size,border-color,box-shadow,transform] [transition-duration:240ms,240ms,240ms,240ms,200ms] [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] enabled:active:scale-[0.96] enabled:active:[transition-duration:240ms,100ms,240ms,240ms,80ms] motion-reduce:[transition-property:background-color,border-color,box-shadow] motion-reduce:enabled:active:scale-100 enabled:[@media(hover:hover)]:hover:border-[var(--color-primary-100)] checked:border-semantic-primary checked:bg-[length:6px_6px] checked:enabled:active:bg-[length:8px_8px] checked:enabled:[@media(hover:hover)]:hover:border-semantic-text-primary focus-visible:border-semantic-primary focus-visible:bg-semantic-bg-ui focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--semantic-primary-surface)] disabled:cursor-not-allowed disabled:border-semantic-bg-ui disabled:[--dot:var(--semantic-disabled-primary)] disabled:checked:border-semantic-disabled-primary",
          className
        )}
        onChange={(event) => {
          onChange?.(event);
          onCheckedChange?.(event.target.checked);
          if (event.target.checked) context?.onValueChange(String(value));
        }}
        {...props}
      />
    );
    if (variant === "card") {
      // The whole card is the <label>, so the name must come from the label text alone (aria-labelledby above):
      // otherwise the description would be read as part of the name.
      return (
        <label
          htmlFor={inputId}
          className={cn(
            "flex items-start gap-3 rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-4 font-[family-name:var(--font-v2,Inter,sans-serif)] cursor-pointer [transition-property:border-color,background-color] [transition-duration:150ms] [transition-timing-function:ease-out] [@media(hover:hover)]:hover:[&:not(:has(:checked,:disabled))]:border-[var(--color-primary-100)] has-[:checked]:border-semantic-primary has-[:checked]:bg-semantic-primary-surface has-[:focus-visible]:border-semantic-primary has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-semantic-bg-ui"
          )}
        >
          {input}
          {(label || description) && (
            <span className="min-w-0 flex-1">
              {label && (
                <span
                  id={labelId}
                  className={cn(
                    "m-0 block text-sm font-medium leading-5 tracking-[0.014px]",
                    isDisabled
                      ? "text-[var(--v2-text-muted,#707070)]"
                      : "text-[var(--v2-text-primary,#484848)]"
                  )}
                >
                  {label}
                </span>
              )}
              {description && (
                <span
                  id={inputId + "-description"}
                  className="m-0 mt-1 block text-xs text-[var(--v2-text-muted,#707070)]"
                >
                  {description}
                </span>
              )}
            </span>
          )}
        </label>
      );
    }
    return (
      <div className="flex items-start gap-2 font-[family-name:var(--font-v2,Inter,sans-serif)]">
        {input}
        {(label || description) && (
          <div className="min-w-0 flex-1">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "m-0 block text-sm font-medium leading-5 tracking-[0.014px]",
                  isDisabled
                    ? "text-[var(--v2-text-muted,#707070)]"
                    : "text-[var(--v2-text-primary,#484848)]"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={inputId + "-description"}
                className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]"
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";
export { Radio, RadioGroup };
