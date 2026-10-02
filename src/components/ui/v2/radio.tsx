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
export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      description,
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
    return (
      <div className="flex items-start gap-2 font-[family-name:var(--font-v2,Inter,sans-serif)]">
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
          className={cn(
            "mt-0.5 size-4 shrink-0 appearance-none rounded-full border-[1.2px] border-solid border-semantic-border-layout bg-semantic-bg-primary transition-colors enabled:hover:border-[var(--color-primary-100)] checked:border-semantic-primary checked:bg-[radial-gradient(circle,var(--semantic-primary)_0_3px,transparent_3px)] checked:enabled:hover:border-semantic-text-primary focus-visible:border-semantic-primary focus-visible:bg-semantic-bg-ui focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--semantic-primary-surface)] disabled:cursor-not-allowed disabled:border-semantic-bg-ui disabled:checked:border-semantic-disabled-primary disabled:checked:bg-[radial-gradient(circle,var(--semantic-disabled-primary)_0_3px,transparent_3px)]",
            className
          )}
          onChange={(event) => {
            onChange?.(event);
            onCheckedChange?.(event.target.checked);
            if (event.target.checked) context?.onValueChange(String(value));
          }}
          {...props}
        />
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
