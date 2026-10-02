import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
export interface ButtonGroupItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
export interface ButtonGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  items: ButtonGroupItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "default" | "primary" | "toggle";
  alignment?: "start" | "end";
  iconOnly?: boolean;
  disabled?: boolean;
}
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      items,
      value,
      defaultValue,
      onValueChange,
      variant = "default",
      alignment = "start",
      iconOnly = false,
      disabled = false,
      className,
      "aria-label": ariaLabel = "Options",
      ...props
    },
    ref
  ) => {
    const [local, setLocal] = React.useState(defaultValue);
    const selected = value === undefined ? local : value;
    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={cn(
          "inline-flex max-w-full items-center border-solid font-[family-name:var(--font-v2,Inter,sans-serif)] shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
          variant === "toggle"
            ? "min-w-[180px] gap-2 rounded-2xl border border-semantic-border-layout bg-semantic-bg-ui p-2"
            : "h-12 gap-px rounded-[36px] border-[0.4px] border-semantic-border-layout bg-semantic-bg-primary",
          variant === "primary" && "border-0 bg-semantic-primary",
          alignment === "end" && "justify-end",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <Button
            key={item.value}
            type="button"
            aria-label={iconOnly ? item.label : undefined}
            title={iconOnly ? item.label : undefined}
            aria-pressed={selected === item.value}
            disabled={disabled || item.disabled}
            variant={
              variant === "primary" || selected === item.value
                ? "primary"
                : "link"
            }
            size={variant === "toggle" ? "sm" : "lg"}
            className={cn(
              variant === "toggle"
                ? "rounded-lg px-3"
                : "h-full rounded-[36px] border-0 px-4 shadow-none",
              variant === "primary" &&
                selected !== item.value &&
                "bg-transparent shadow-none",
              iconOnly && "px-3"
            )}
            onClick={() => {
              if (value === undefined) setLocal(item.value);
              onValueChange?.(item.value);
            }}
          >
            {item.icon}
            {!iconOnly && item.label}
          </Button>
        ))}
      </div>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";
export { ButtonGroup };
