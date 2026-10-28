import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Checkbox box variants (the outer container)
 */
const checkboxVariants = cva(
  // Checkbox box: 20px, 1px border. The fill is the ::after layer (scale .6 -> 1 on a snappy spring, opacity 120ms in / 160ms
  // out), so the shell colour never jumps; the mark draws inside it. before: = an invisible ring reaching 6px beyond the
  // padding box so the pointer target is 32px for the default box without moving layout (44px on coarse pointers, Arc's 44px control).
  // Press scales the box .95 (120ms down, 580ms spring back); disabled under reduced motion.
  // --arc-snappy samples Arc's snappy spring (visualDuration .26, bounce .12), settling in 350ms.
  "peer relative isolate inline-flex items-center justify-center shrink-0 box-border rounded border border-solid before:absolute before:-inset-[6px] before:content-[''] after:pointer-events-none after:absolute after:-inset-px after:content-[''] after:rounded-[inherit] after:bg-v2-semantic-primary after:opacity-0 after:scale-[0.6] [--arc-snappy:linear(0,.0506,.1667,.2966,.4251,.5482,.6476,.7298,.7994,.8508,.8924,.922,.9442,.9613,.973,.9815,.9877,.9918,.9947,.9967,1)] [transition-property:border-color,box-shadow,transform] [transition-duration:160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] after:[transition:opacity_160ms_cubic-bezier(0.22,1,0.36,1),transform_350ms_var(--arc-snappy),background-color_160ms_cubic-bezier(0.22,1,0.36,1)] enabled:active:scale-[0.95] enabled:active:[transition-duration:160ms,160ms,120ms] motion-reduce:[transition-property:border-color,box-shadow] motion-reduce:enabled:active:scale-100 motion-reduce:after:scale-100 motion-reduce:after:[transition:opacity_120ms_ease-out] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--v2-semantic-border-focus,var(--semantic-primary))] disabled:cursor-not-allowed text-v2-semantic-text-inverted data-[state=checked]:border-v2-semantic-primary data-[state=checked]:after:opacity-100 data-[state=checked]:after:scale-100 data-[state=checked]:after:[transition:opacity_120ms_cubic-bezier(0.22,1,0.36,1),transform_350ms_var(--arc-snappy),background-color_160ms_cubic-bezier(0.22,1,0.36,1)] data-[state=checked]:disabled:border-v2-semantic-disabled-primary data-[state=checked]:disabled:after:bg-v2-semantic-disabled-primary data-[state=indeterminate]:border-v2-semantic-primary data-[state=indeterminate]:after:opacity-100 data-[state=indeterminate]:after:scale-100 data-[state=indeterminate]:after:[transition:opacity_120ms_cubic-bezier(0.22,1,0.36,1),transform_350ms_var(--arc-snappy),background-color_160ms_cubic-bezier(0.22,1,0.36,1)] data-[state=indeterminate]:disabled:border-v2-semantic-disabled-primary data-[state=indeterminate]:disabled:after:bg-v2-semantic-disabled-primary data-[state=unchecked]:bg-v2-semantic-bg-primary data-[state=unchecked]:border-v2-semantic-border-input data-[state=unchecked]:enabled:[@media(hover:hover)]:hover:border-[var(--v2-semantic-border-primary,var(--color-primary-100))] data-[state=unchecked]:focus-visible:border-[var(--v2-semantic-border-focus,var(--semantic-primary))] data-[state=unchecked]:disabled:border-v2-semantic-bg-ui enabled:aria-[invalid=true]:data-[state=unchecked]:border-v2-semantic-error-primary enabled:aria-[invalid=true]:data-[state=unchecked]:hover:border-v2-semantic-error-primary enabled:aria-[invalid=true]:data-[state=checked]:border-v2-semantic-error-primary enabled:aria-[invalid=true]:data-[state=checked]:after:bg-v2-semantic-error-primary enabled:aria-[invalid=true]:data-[state=checked]:text-[var(--v2-on-status,var(--semantic-text-inverted))] enabled:aria-[invalid=true]:data-[state=indeterminate]:border-v2-semantic-error-primary enabled:aria-[invalid=true]:data-[state=indeterminate]:after:bg-v2-semantic-error-primary enabled:aria-[invalid=true]:data-[state=indeterminate]:text-[var(--v2-on-status,var(--semantic-text-inverted))]",
  {
    variants: {
      size: {
        default: "h-5 w-5 [@media(pointer:coarse)]:before:-inset-[13px]",
        sm: "h-4 w-4 [@media(pointer:coarse)]:before:-inset-[15px]",
        lg: "h-6 w-6 [@media(pointer:coarse)]:before:-inset-[11px]",
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
 * Mark (the paths in the indicator below): the indicator is force-mounted so a change reverses instead of unmounting.
 * Each path draws with a stroke-dashoffset transition on the snappy spring and fades (120ms in / 160ms out); the check
 * and the dash share Arc's three points, and only the one for the current state is drawn. A path starts past its end
 * (dashoffset 1) so a round cap never leaves a dot.
 */
const markPath =
  "opacity-[0] [stroke-dasharray:1] [stroke-dashoffset:1] [transition:stroke-dashoffset_350ms_var(--arc-snappy),opacity_160ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:opacity_120ms_ease-out]";
const checkPathOn =
  "[[data-state=checked]_&]:opacity-[1] [[data-state=checked]_&]:[stroke-dashoffset:0] [[data-state=checked]_&]:[transition:stroke-dashoffset_350ms_var(--arc-snappy),opacity_120ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[[data-state=checked]_&]:[transition:opacity_120ms_ease-out]";
const dashPathOn =
  "[[data-state=indeterminate]_&]:opacity-[1] [[data-state=indeterminate]_&]:[stroke-dashoffset:0] [[data-state=indeterminate]_&]:[transition:stroke-dashoffset_350ms_var(--arc-snappy),opacity_120ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[[data-state=indeterminate]_&]:[transition:opacity_120ms_ease-out]";

/* -------------------------------------------------------------------------------------------------
 * Shared by Checkbox and Radio: the description and error parts, and the field state they report to
 * -----------------------------------------------------------------------------------------------*/

interface ChoiceFieldContextValue {
  descriptionId: string;
  errorId: string;
  hasDescription: boolean;
  hasError: boolean;
  setPart: (part: "description" | "error", present: boolean) => void;
  disabled: boolean;
  invalid: boolean;
}
const ChoiceFieldContext = React.createContext<ChoiceFieldContextValue | null>(
  null
);

/** Ids for a field's description and error, and whether either is on screen, so the control can point at them. */
function useChoiceField(disabled: boolean, invalid: boolean) {
  const base = React.useId();
  const [parts, setParts] = React.useState({
    description: false,
    error: false,
  });
  const setPart = React.useCallback(
    (part: "description" | "error", present: boolean) =>
      setParts((previous) =>
        previous[part] === present ? previous : { ...previous, [part]: present }
      ),
    []
  );
  return React.useMemo<ChoiceFieldContextValue>(
    () => ({
      descriptionId: base + "-description",
      errorId: base + "-error",
      hasDescription: parts.description,
      hasError: parts.error,
      setPart,
      disabled,
      invalid,
    }),
    [base, parts.description, parts.error, setPart, disabled, invalid]
  );
}

const joinIds = (...ids: Array<string | false | null | undefined>) =>
  ids.filter(Boolean).join(" ") || undefined;

/** Supporting text under a Checkbox or Radio label (12px, muted). Inside a field it is linked to the control. */
const ChoiceDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, id, ...props }, ref) => {
  const field = React.useContext(ChoiceFieldContext);
  const setPart = field?.setPart;
  React.useEffect(() => {
    setPart?.("description", true);
    return () => setPart?.("description", false);
  }, [setPart]);
  return (
    <p
      ref={ref}
      id={id ?? field?.descriptionId}
      data-slot="choice-description"
      className={cn(
        "m-0 mt-0.5 text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)]",
        // Inside a field the text lines up with the label, not the control: the field sets the indent.
        field && "pl-[var(--choice-indent,0px)]",
        className
      )}
      {...props}
    />
  );
});
ChoiceDescription.displayName = "ChoiceDescription";

/** A validation message under a Checkbox or Radio. Inside a field it is linked to the control. */
const ChoiceError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, id, ...props }, ref) => {
  const field = React.useContext(ChoiceFieldContext);
  const setPart = field?.setPart;
  React.useEffect(() => {
    setPart?.("error", true);
    return () => setPart?.("error", false);
  }, [setPart]);
  return (
    <p
      ref={ref}
      id={id ?? field?.errorId}
      data-slot="choice-error"
      className={cn(
        "m-0 mt-1 text-xs leading-[1.4] text-v2-semantic-error-primary",
        field && "pl-[var(--choice-indent,0px)]",
        className
      )}
      {...props}
    />
  );
});
ChoiceError.displayName = "ChoiceError";

/** The label and description above a group of options. */
function ChoiceGroupHeader({
  label,
  description,
  labelId,
  descriptionId,
}: {
  label?: React.ReactNode;
  description?: React.ReactNode;
  labelId: string;
  descriptionId: string;
}) {
  return (
    <>
      {label && (
        <span
          id={labelId}
          data-slot="choice-group-label"
          className="text-sm font-medium leading-[1.4] text-[var(--v2-text-primary,#484848)]"
        >
          {label}
        </span>
      )}
      {description && (
        <ChoiceDescription id={descriptionId} className="mt-0">
          {description}
        </ChoiceDescription>
      )}
    </>
  );
}

/** The check / dash drawn inside the box. Also the part to restyle or replace (pass children) for a custom mark. */
const CheckboxIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
>(({ className, children, ...props }, ref) => (
  <CheckboxPrimitive.Indicator
    ref={ref}
    forceMount
    className={cn(
      "absolute -inset-px z-[1] flex items-center justify-center",
      className
    )}
    {...props}
  >
    {children ?? (
      <svg
        aria-hidden="true"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-full overflow-visible"
      >
        <path
          pathLength="1"
          d="M4.25 9.25 L7.25 12.25 L13.75 5.75"
          className={cn(markPath, checkPathOn)}
        />
        <path
          pathLength="1"
          d="M4.75 9 L9 9 L13.25 9"
          className={cn(markPath, dashPathOn)}
        />
      </svg>
    )}
  </CheckboxPrimitive.Indicator>
));
CheckboxIndicator.displayName = "CheckboxIndicator";

/**
 * Arc names a checkbox "Checkbox" when it has no label. Only apply it once the DOM shows nothing else names the box
 * (a wrapping <label>, an outside <label htmlFor>), since aria-label would override those.
 */
function useFallbackName(unnamed: boolean, id: string | undefined) {
  const innerRef = React.useRef<HTMLButtonElement | null>(null);
  const [fallbackName, setFallbackName] = React.useState(false);
  React.useEffect(() => {
    const el = innerRef.current;
    // A label only names the box if it has text; an empty wrapping label (an anatomy Content with no text) does not.
    const hasText = Array.from(el?.labels ?? []).some((label) =>
      label.textContent?.trim()
    );
    setFallbackName(Boolean(unnamed && el && !hasText));
  }, [unnamed, id]);
  return [fallbackName, innerRef] as const;
}

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
  /** An error message under the checkbox. It also marks the box invalid and is linked with aria-describedby. */
  error?: React.ReactNode;
  /** Mark the box invalid without a message. */
  invalid?: boolean;
  /**
   * `card` makes the whole option a bordered target (12px padding, 8px radius): hover surface, and a primary border
   * with a calm white surface when checked. Defaults to `default`, the box with a label beside it.
   */
  variant?: "default" | "card";
}

const CheckboxBase = React.forwardRef(
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
      error,
      invalid,
      variant = "default",
      id,
      disabled,
      ...props
    }: CheckboxProps,
    ref: React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>>
  ) => {
    const generatedId = React.useId();
    const unnamed =
      !label &&
      !props["aria-label"] &&
      !props["aria-labelledby"] &&
      !props.title;
    const [fallbackName, innerRef] = useFallbackName(unnamed, id);
    const setRefs = (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<typeof node>).current = node;
    };
    const isInvalid = Boolean(invalid || error);
    // Only generate an id when a description or error needs one, so the default markup is unchanged.
    const controlId = description || error ? id || generatedId : id;
    const descriptionId = controlId + "-description";
    const errorId = controlId + "-error";
    const labelId = controlId + "-label";
    const describedBy = joinIds(
      props["aria-describedby"],
      description ? descriptionId : undefined,
      error ? errorId : undefined
    );
    const checkbox = (
      <CheckboxPrimitive.Root
        ref={setRefs}
        id={controlId}
        disabled={disabled}
        className={cn(
          checkboxVariants({ size }),
          "cursor-pointer",
          className,
          checkboxClassName
        )}
        {...(fallbackName ? { "aria-label": "Checkbox" } : {})}
        {...(variant === "card" && label ? { "aria-labelledby": labelId } : {})}
        {...props}
        {...(isInvalid ? { "aria-invalid": true } : {})}
        {...(description || error ? { "aria-describedby": describedBy } : {})}
      >
        <CheckboxIndicator />
      </CheckboxPrimitive.Root>
    );

    const layout = (() => {
      if (variant === "card") {
        // The whole card is the <label>, so the name must come from the label text alone (aria-labelledby above):
        // otherwise the description would be read as part of the name.
        return (
          <label
            data-checkbox-card=""
            className={cn(
              "group/checkbox relative flex items-center gap-3 rounded-lg border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-3 font-[family-name:var(--font-v2,Inter,sans-serif)] cursor-pointer [transition-property:border-color,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-property:none] [@media(hover:hover)]:hover:[&:not(:has(:disabled)):not(:has([aria-invalid=true]))]:border-v2-semantic-border-secondary [@media(hover:hover)]:hover:[&:not(:has(:disabled))]:bg-v2-semantic-bg-subtle has-[[data-state=checked]:enabled:not([aria-invalid=true])]:border-v2-semantic-primary has-[[data-state=indeterminate]:enabled:not([aria-invalid=true])]:border-v2-semantic-primary has-[:focus-visible]:border-[var(--v2-semantic-border-focus,var(--semantic-primary))] has-[[aria-invalid=true]:enabled]:border-v2-semantic-error-primary has-[:disabled]:cursor-not-allowed has-[:disabled]:border-v2-semantic-disabled-border has-[:disabled]:bg-v2-semantic-bg-ui"
            )}
          >
            {checkbox}
            {(label || description) && (
              <span className={cn("min-w-0 flex-1", disabled && "opacity-50")}>
                {label && (
                  <span
                    id={labelId}
                    className={cn(
                      labelSizeVariants({ size }),
                      "m-0 block font-medium text-[var(--v2-text-primary,#484848)]",
                      labelClassName
                    )}
                  >
                    {label}
                  </span>
                )}
                {description && (
                  <span
                    id={descriptionId}
                    className="m-0 mt-0.5 block text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)]"
                  >
                    {description}
                  </span>
                )}
              </span>
            )}
          </label>
        );
      }
      if (description) {
        const text = (
          <div
            className={cn("flex min-w-0 flex-col", disabled && "opacity-50")}
          >
            {label && (
              <label
                htmlFor={controlId}
                className={cn(
                  labelSizeVariants({ size }),
                  "block font-medium text-[var(--v2-text-primary,#484848)]",
                  disabled ? "cursor-not-allowed" : "cursor-pointer",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            <p
              id={descriptionId}
              className="m-0 mt-0.5 text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)]"
            >
              {description}
            </p>
          </div>
        );
        return (
          <div className="inline-flex items-center gap-3.5 font-[family-name:var(--font-v2,Inter,sans-serif)]">
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
            <div className="inline-flex items-center gap-3.5 font-[family-name:var(--font-v2,Inter,sans-serif)]">
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
              "inline-flex items-center gap-3.5 font-[family-name:var(--font-v2,Inter,sans-serif)] cursor-pointer",
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
    })();
    // Keep the control mounted when validation changes, preserving uncontrolled state and keyboard focus.
    // A contents shell leaves the default layout unchanged; errors add a vertical message beneath the row.
    return (
      <div
        className={cn(
          error
            ? "inline-flex flex-col gap-1 font-[family-name:var(--font-v2,Inter,sans-serif)]"
            : "contents"
        )}
      >
        {layout}
        {error && (
          <ChoiceError
            id={errorId}
            className={cn(
              "mt-0",
              variant !== "card" &&
                labelPosition === "right" &&
                (size === "sm"
                  ? "pl-[30px]"
                  : size === "lg"
                    ? "pl-[38px]"
                    : "pl-[34px]")
            )}
          >
            {error}
          </ChoiceError>
        )}
      </div>
    );
  }
);
CheckboxBase.displayName = "CheckboxBase";

/* -------------------------------------------------------------------------------------------------
 * CheckboxGroup
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxGroupContextValue {
  name?: string;
  value: string[];
  disabled: boolean;
  invalid: boolean;
  setItem: (value: string, checked: boolean) => void;
}
const CheckboxGroupContext =
  React.createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  /** Name given to every checkbox in the group, for form submission */
  name?: string;
  /** Values of the checked options (controlled) */
  value?: string[];
  /** Values checked at first (uncontrolled) */
  defaultValue?: string[];
  /** Called with the new list of checked values */
  onValueChange?: (value: string[]) => void;
  /** Disable every option */
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  /** A visible name for the group */
  label?: React.ReactNode;
  /** Supporting text under the group label */
  description?: React.ReactNode;
  /** A validation message under the group. It also marks every option invalid. */
  error?: React.ReactNode;
  /** Mark every option invalid without a message */
  invalid?: boolean;
}

/**
 * A set of checkboxes that share one list of values. Give each Checkbox inside a `value`; the group decides which
 * are checked, so it replaces a row of separate `checked` / `onCheckedChange` pairs.
 *
 * @example
 * ```tsx
 * <CheckboxGroup label="Notify me by" value={channels} onValueChange={setChannels}>
 *   <Checkbox value="email" label="Email" />
 *   <Checkbox value="sms" label="SMS" description="Charges may apply" />
 * </CheckboxGroup>
 * ```
 */
const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      name,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      orientation = "vertical",
      label,
      description,
      error,
      invalid,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const labelId = id + "-label";
    const descriptionId = id + "-description";
    const errorId = id + "-error";
    const [localValue, setLocalValue] = React.useState(defaultValue ?? []);
    const current = value ?? localValue;
    const isInvalid = Boolean(invalid || error);
    const setItem = React.useCallback(
      (item: string, checked: boolean) => {
        const rest = current.filter((entry) => entry !== item);
        const next = checked ? [...rest, item] : rest;
        if (value === undefined) setLocalValue(next);
        onValueChange?.(next);
      },
      [current, value, onValueChange]
    );
    return (
      <CheckboxGroupContext.Provider
        value={{ name, value: current, disabled, invalid: isInvalid, setItem }}
      >
        <div
          ref={ref}
          role="group"
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={joinIds(
            description ? descriptionId : undefined,
            error ? errorId : undefined
          )}
          aria-invalid={isInvalid || undefined}
          aria-disabled={disabled || undefined}
          className={cn(
            "flex flex-col gap-2 font-[family-name:var(--font-v2,Inter,sans-serif)]",
            className
          )}
          {...props}
        >
          <ChoiceGroupHeader
            label={label}
            description={description}
            labelId={labelId}
            descriptionId={descriptionId}
          />
          <div
            data-slot="checkbox-group-items"
            className={cn(
              "flex gap-3 has-[[data-checkbox-card]]:gap-2",
              orientation === "vertical" ? "flex-col" : "flex-wrap items-center"
            )}
          >
            {children}
          </div>
          {error && (
            <ChoiceError id={errorId} className="mt-0">
              {error}
            </ChoiceError>
          )}
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";

/* -------------------------------------------------------------------------------------------------
 * Checkbox anatomy: Checkbox.Content, Checkbox.Control, Checkbox.Indicator, Checkbox.Description, Checkbox.Error
 * (the same parts HeroUI uses). Pass children to <Checkbox> to compose them; without children <Checkbox> draws
 * the whole thing from its props.
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxFieldContextValue {
  size: CheckboxProps["size"];
  id?: string;
  checked?: CheckboxProps["checked"];
  defaultChecked?: CheckboxProps["defaultChecked"];
  onCheckedChange?: CheckboxProps["onCheckedChange"];
  required?: boolean;
  name?: string;
  value?: CheckboxProps["value"];
  /** Everything else given to <Checkbox> (aria-*, handlers, form, ...) goes to the control. */
  controlProps: Record<string, unknown>;
  controlRef: React.Ref<HTMLButtonElement>;
}
const CheckboxFieldContext =
  React.createContext<CheckboxFieldContextValue | null>(null);

const CheckboxField = React.forwardRef(
  (
    {
      children,
      className,
      style,
      size,
      disabled,
      invalid,
      checked,
      defaultChecked,
      onCheckedChange,
      required,
      name,
      value,
      id,
      // Props mode only: anatomy mode composes these from the parts.
      label: _label,
      description: _description,
      labelPosition: _labelPosition,
      checkboxClassName: _checkboxClassName,
      labelClassName: _labelClassName,
      separateLabel: _separateLabel,
      error: _error,
      variant: _variant,
      ...rest
    }: CheckboxProps,
    ref: React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>>
  ) => {
    const field = useChoiceField(Boolean(disabled), Boolean(invalid));
    const dataAttributes: Record<string, unknown> = {};
    const controlProps: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(rest)) {
      if (key.startsWith("data-")) dataAttributes[key] = entry;
      else controlProps[key] = entry;
    }
    return (
      <ChoiceFieldContext.Provider value={field}>
        <CheckboxFieldContext.Provider
          value={{
            size,
            id,
            checked,
            defaultChecked,
            onCheckedChange,
            required,
            name,
            value,
            controlProps,
            controlRef: ref,
          }}
        >
          <div
            data-slot="checkbox"
            data-disabled={disabled ? "" : undefined}
            data-invalid={invalid ? "" : undefined}
            className={cn(
              "inline-flex flex-col font-[family-name:var(--font-v2,Inter,sans-serif)]",
              // Box width + the 14px gap to the label.
              size === "sm"
                ? "[--choice-indent:30px]"
                : size === "lg"
                  ? "[--choice-indent:38px]"
                  : "[--choice-indent:34px]",
              className
            )}
            style={style}
            {...dataAttributes}
          >
            {children}
          </div>
        </CheckboxFieldContext.Provider>
      </ChoiceFieldContext.Provider>
    );
  }
);
CheckboxField.displayName = "CheckboxField";

/** The clickable label that wraps the control and the label text. */
const CheckboxContent = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const field = React.useContext(CheckboxFieldContext);
  const choice = React.useContext(ChoiceFieldContext);
  return (
    <label
      ref={ref}
      data-slot="checkbox-content"
      className={cn(
        labelSizeVariants({ size: field?.size }),
        "inline-flex items-center gap-3.5 font-medium text-[var(--v2-text-primary,#484848)]",
        choice?.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className
      )}
      {...props}
    />
  );
});
CheckboxContent.displayName = "CheckboxContent";

/** The box. It holds the state given to <Checkbox> and draws the indicator unless you pass your own. */
const CheckboxControl = React.forwardRef(
  (
    {
      className,
      children,
      size,
      ...props
    }: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
      VariantProps<typeof checkboxVariants>,
    ref: React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>>
  ) => {
    const field = React.useContext(CheckboxFieldContext);
    const choice = React.useContext(ChoiceFieldContext);
    const merged = { ...(field?.controlProps ?? {}), ...props } as typeof props;
    const unnamed =
      !merged["aria-label"] && !merged["aria-labelledby"] && !merged.title;
    const [fallbackName, innerRef] = useFallbackName(
      unnamed,
      merged.id ?? field?.id
    );
    const controlRef = field?.controlRef;
    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        innerRef.current = node;
        for (const target of [ref, controlRef]) {
          if (typeof target === "function") target(node);
          else if (target)
            (target as React.MutableRefObject<typeof node>).current = node;
        }
      },
      [ref, controlRef, innerRef]
    );
    return (
      <CheckboxPrimitive.Root
        ref={setRefs}
        data-slot="checkbox-control"
        id={merged.id ?? field?.id}
        checked={field?.checked}
        defaultChecked={field?.defaultChecked}
        onCheckedChange={field?.onCheckedChange}
        required={field?.required}
        name={field?.name}
        value={field?.value}
        disabled={choice?.disabled}
        className={cn(
          checkboxVariants({ size: size ?? field?.size }),
          "cursor-pointer",
          className
        )}
        {...(fallbackName ? { "aria-label": "Checkbox" } : {})}
        {...merged}
        {...(choice?.invalid ? { "aria-invalid": true } : {})}
        {...(choice && (choice.hasDescription || choice.hasError)
          ? {
              "aria-describedby": joinIds(
                merged["aria-describedby"],
                choice.hasDescription ? choice.descriptionId : undefined,
                choice.hasError ? choice.errorId : undefined
              ),
            }
          : {})}
      >
        {children ?? <CheckboxIndicator />}
      </CheckboxPrimitive.Root>
    );
  }
);
CheckboxControl.displayName = "CheckboxControl";

/**
 * A checkbox. With no children it draws everything from its props (`label`, `description`, `error`, `variant`).
 * With children it is the field root for the Checkbox.* parts, as in HeroUI:
 *
 * ```tsx
 * <Checkbox defaultChecked name="terms">
 *   <Checkbox.Content>
 *     <Checkbox.Control>
 *       <Checkbox.Indicator />
 *     </Checkbox.Control>
 *     Accept terms and conditions
 *   </Checkbox.Content>
 *   <Checkbox.Description>You can change this later.</Checkbox.Description>
 * </Checkbox>
 * ```
 *
 * Inside a `CheckboxGroup`, give it a `value` and the group controls whether it is checked.
 */
const CheckboxRoot = React.forwardRef(
  (
    props: CheckboxProps,
    ref: React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>>
  ) => {
    const group = React.useContext(CheckboxGroupContext);
    const grouped =
      group &&
      props.value !== undefined &&
      props.checked === undefined &&
      props.defaultChecked === undefined;
    const merged: CheckboxProps = grouped
      ? {
          ...props,
          checked: group.value.includes(props.value as string),
          disabled: props.disabled || group.disabled,
          invalid: props.invalid || group.invalid,
          name: props.name ?? group.name,
          onCheckedChange: (next) => {
            group.setItem(props.value as string, next === true);
            props.onCheckedChange?.(next);
          },
        }
      : group
        ? {
            ...props,
            disabled: props.disabled || group.disabled,
            invalid: props.invalid || group.invalid,
          }
        : props;
    return merged.children !== undefined && merged.children !== null ? (
      <CheckboxField ref={ref} {...merged} />
    ) : (
      <CheckboxBase ref={ref} {...merged} />
    );
  }
);
CheckboxRoot.displayName = "Checkbox";
const Checkbox = Object.assign(CheckboxRoot, {
  Content: CheckboxContent,
  Control: CheckboxControl,
  Indicator: CheckboxIndicator,
  Description: ChoiceDescription,
  Error: ChoiceError,
});

/* -------------------------------------------------------------------------------------------------
 * Radio (same family: one file, one docs page)
 * -----------------------------------------------------------------------------------------------*/

interface RadioGroupContextValue {
  name: string;
  value?: string;
  disabled?: boolean;
  /** True while the group's travelling highlight is drawing the selected card, so the card skips its own selected style. */
  highlighted: boolean;
  /** Set when the group has an error or `invalid`, so every option draws its error colours. */
  invalid?: boolean;
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
  /** A visible name for the group */
  label?: React.ReactNode;
  /** Supporting text under the group label */
  description?: React.ReactNode;
  /** A validation message under the group. It also marks every option invalid. */
  error?: React.ReactNode;
  /** Mark every option invalid without a message */
  invalid?: boolean;
}
/**
 * One highlight (a bordered, tinted layer) travels to the selected card, like Arc's radio group: it glides on the morph
 * spring (visualDuration .42, bounce .16, sampled for 506ms); the first placement and resizes snap. Plain circle radios
 * have no card, so nothing is drawn for them. Reduced motion snaps it.
 */
// Inline, not a class: the highlight's box is written from layout, and the transition has to change with it.
const highlightTransition =
  "transform 506ms var(--arc-morph), width 506ms var(--arc-morph), height 506ms var(--arc-morph), opacity 160ms cubic-bezier(0.22, 1, 0.36, 1)";
const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      orientation = "vertical",
      label,
      description,
      error,
      invalid,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedName = React.useId();
    const labelId = generatedName + "-label";
    const descriptionId = generatedName + "-description";
    const errorId = generatedName + "-error";
    const isInvalid = Boolean(invalid || error);
    // Keep the options in one stable container when validation appears or clears.
    const framed = Boolean(label || description || error);
    const itemsClass = cn(
      "flex gap-3 has-[[data-radio-card]]:gap-2",
      orientation === "vertical" ? "flex-col" : "flex-wrap items-center"
    );
    const [localValue, setLocalValue] = React.useState(defaultValue);
    const [highlighted, setHighlighted] = React.useState(false);
    const groupRef = React.useRef<HTMLDivElement | null>(null);
    const highlightRef = React.useRef<HTMLSpanElement>(null);
    const placedAt = React.useRef("");
    const current = value === undefined ? localValue : value;
    const change = (next: string) => {
      if (value === undefined) setLocalValue(next);
      onValueChange?.(next);
    };
    const setRefs = (node: HTMLDivElement | null) => {
      groupRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };
    const place = React.useCallback((glide: boolean) => {
      const group = groupRef.current;
      const highlight = highlightRef.current;
      if (!group || !highlight) return;
      let row: HTMLElement | null = null;
      for (const card of group.querySelectorAll<HTMLElement>(
        "[data-radio-card]"
      )) {
        const input = card.querySelector("input");
        if (input?.checked && !input.disabled) row = card;
      }
      if (!row) {
        placedAt.current = "";
        highlight.style.opacity = "0";
        setHighlighted(false);
        return;
      }
      // Validation can change without moving the selected card. Update it before the geometry early return.
      highlight.dataset.invalid = String(
        row.querySelector("input")?.getAttribute("aria-invalid") === "true"
      );
      const next = `${row.offsetLeft} ${row.offsetTop} ${row.offsetWidth} ${row.offsetHeight}`;
      if (next === placedAt.current) return;
      // Glide only between two placed cards; the first placement and resizes snap.
      highlight.style.transition =
        glide && placedAt.current !== "" ? highlightTransition : "none";
      placedAt.current = next;
      highlight.style.width = `${row.offsetWidth}px`;
      highlight.style.height = `${row.offsetHeight}px`;
      highlight.style.transform = `translate(${row.offsetLeft}px, ${row.offsetTop}px)`;
      highlight.style.opacity = "1";
      setHighlighted(true);
    }, []);
    React.useLayoutEffect(() => {
      place(true);
    });
    React.useEffect(() => {
      const group = groupRef.current;
      if (!group || typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() => place(false));
      observer.observe(group);
      return () => observer.disconnect();
    }, [place]);
    return (
      <RadioContext.Provider
        value={{
          name: name || generatedName,
          value: current,
          disabled,
          highlighted,
          invalid: isInvalid,
          onValueChange: change,
        }}
      >
        <div
          ref={setRefs}
          role="radiogroup"
          aria-orientation={orientation}
          aria-disabled={disabled || undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={joinIds(
            description ? descriptionId : undefined,
            error ? errorId : undefined
          )}
          aria-invalid={isInvalid || undefined}
          className={cn(
            "relative font-[family-name:var(--font-v2,Inter,sans-serif)]",
            framed ? "flex flex-col gap-2" : itemsClass,
            className
          )}
          {...props}
        >
          <span
            ref={highlightRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-0 top-0 z-[1] box-border rounded-lg border border-solid border-v2-semantic-primary bg-v2-semantic-bg-primary data-[invalid=true]:border-v2-semantic-error-primary will-change-transform [--arc-morph:linear(0,.0308,.1027,.1959,.2972,.3979,.4971,.5827,.6582,.7233,.7785,.8246,.8625,.8933,.9182,.9379,.9534,.9655,.9753,.9823,.9876,.9915,.9944,.9965,1)] motion-reduce:!transition-none",
              isInvalid && "border-v2-semantic-error-primary"
            )}
            style={{ opacity: 0 }}
          />
          <ChoiceGroupHeader
            label={label}
            description={description}
            labelId={labelId}
            descriptionId={descriptionId}
          />
          <div className={framed ? itemsClass : "contents"}>{children}</div>
          {error && (
            <ChoiceError id={errorId} className="mt-0">
              {error}
            </ChoiceError>
          )}
        </div>
      </RadioContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";
/**
 * Radio control, in the `input` class string below. Arc's mark: 17px with a 1px border that fills when selected; the 7px dot is the
 * ::after layer and grows from 40% on a snappy spring (350ms, opacity 160ms in / 120ms out). While the pointer is down on an
 * unselected radio a faint dot (22%) previews the choice. before: is an invisible ring reaching 5px beyond the padding box,
 * making the pointer target 27px. Press scales the circle .88 (100ms down, 580ms back). Hover is gated to real hover devices.
 */
export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /**
   * `card` makes the whole option a bordered target (16px padding, 8px radius): hover border, and a primary border
   * with a calm white surface when selected. Defaults to `default`, the circle with a label beside it.
   */
  variant?: "default" | "card";
  onCheckedChange?: (checked: boolean) => void;
  /** Mark the option invalid (a group's `error` or `invalid` does this for every option). */
  invalid?: boolean;
}
const radioLabelClass = (isDisabled: boolean) =>
  cn(
    "m-0 block text-sm font-medium leading-[1.4] tracking-[0.014px] [transition:color_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    isDisabled
      ? "text-[var(--v2-text-muted,#707070)]"
      : "text-[var(--v2-text-secondary,#5E5E5E)] group-has-[:checked]/radio:text-[var(--v2-text-primary,#484848)]"
  );
/** The native radio input and its dot. Shared by <Radio> and the Radio.Control part. */
const RadioInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
    onCheckedChange?: (checked: boolean) => void;
    invalid?: boolean;
  }
>(({ className, invalid, onChange, onCheckedChange, value, ...props }, ref) => {
  const context = React.useContext(RadioContext);
  return (
    <input
      ref={ref}
      type="radio"
      value={value}
      aria-invalid={invalid || context?.invalid || undefined}
      className={cn(
        // Dot, hit area and press: see the comment above RadioProps.
        "relative size-[17px] shrink-0 appearance-none rounded-full border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary [--arc-snappy:linear(0,.0506,.1667,.2966,.4251,.5482,.6476,.7298,.7994,.8508,.8924,.922,.9442,.9613,.973,.9815,.9877,.9918,.9947,.9967,1)] before:absolute before:-inset-[5px] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:m-auto after:size-[7px] after:rounded-full after:bg-v2-semantic-text-inverted after:content-[''] after:opacity-0 after:scale-[0.4] after:[transition:opacity_120ms_cubic-bezier(0.22,1,0.36,1),transform_350ms_var(--arc-snappy)] [transition-property:background-color,border-color,box-shadow,transform] [transition-duration:160ms,160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] enabled:active:scale-[0.88] enabled:active:[transition-duration:160ms,160ms,160ms,100ms] [&:not(:checked):enabled:active]:after:opacity-[0.22] [&:not(:checked):enabled:active]:after:scale-100 motion-reduce:[transition-property:background-color,border-color,box-shadow] motion-reduce:enabled:active:scale-100 motion-reduce:after:scale-100 motion-reduce:after:[transition:opacity_120ms_ease-out] enabled:[@media(hover:hover)]:hover:border-[var(--v2-semantic-border-primary,var(--color-primary-100))] checked:border-v2-semantic-primary checked:bg-v2-semantic-primary checked:after:opacity-100 checked:after:scale-100 checked:after:[transition:opacity_160ms_cubic-bezier(0.22,1,0.36,1),transform_350ms_var(--arc-snappy)] checked:enabled:[@media(hover:hover)]:hover:border-[var(--v2-semantic-border-primary,var(--semantic-primary))] focus-visible:border-[var(--v2-semantic-border-focus,var(--semantic-primary))] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--v2-semantic-border-focus,var(--semantic-primary))] disabled:cursor-not-allowed disabled:border-v2-semantic-bg-ui disabled:checked:bg-v2-semantic-disabled-primary disabled:checked:border-v2-semantic-disabled-primary enabled:aria-[invalid=true]:border-v2-semantic-error-primary enabled:aria-[invalid=true]:hover:border-v2-semantic-error-primary enabled:aria-[invalid=true]:checked:border-v2-semantic-error-primary enabled:aria-[invalid=true]:checked:bg-v2-semantic-error-primary enabled:aria-[invalid=true]:checked:after:bg-[var(--v2-on-status,var(--semantic-text-inverted))] checked:enabled:aria-[invalid=true]:[@media(hover:hover)]:hover:border-v2-semantic-error-primary",
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
});
RadioInput.displayName = "RadioInput";
const RadioBase = React.forwardRef<HTMLInputElement, RadioProps>(
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
      invalid,
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
    const highlighted = context?.highlighted ?? false;
    const isChecked =
      checked ?? (context ? context.value === String(value) : undefined);
    const labelId = inputId + "-label";
    const input = (
      <RadioInput
        ref={ref}
        id={inputId}
        name={name || context?.name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        invalid={invalid}
        aria-describedby={
          description ? inputId + "-description" : props["aria-describedby"]
        }
        {...(variant === "card" && label ? { "aria-labelledby": labelId } : {})}
        className={className}
        onChange={onChange}
        onCheckedChange={onCheckedChange}
        {...props}
      />
    );
    if (variant === "card") {
      // The whole card is the <label>, so the name must come from the label text alone (aria-labelledby above):
      // otherwise the description would be read as part of the name.
      return (
        <label
          htmlFor={inputId}
          data-radio-card=""
          className={cn(
            // Arc row: 12px padding and gap, mark centred on the row, surface on hover/press. While the group's travelling highlight is drawing the selected card the card skips its own selected style.
            "group/radio relative flex items-center gap-3 rounded-lg border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-3 font-[family-name:var(--font-v2,Inter,sans-serif)] cursor-pointer [transition-property:border-color,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [&>*:not(input)]:relative [&>*]:z-[2] motion-reduce:[transition-property:none] [@media(hover:hover)]:hover:[&:not(:has(:disabled)):not(:has([aria-invalid=true]))]:border-v2-semantic-border-secondary [@media(hover:hover)]:hover:[&:not(:has(:disabled))]:bg-v2-semantic-bg-subtle active:[&:not(:has(:disabled))]:bg-v2-semantic-bg-subtle has-[:focus-visible]:border-[var(--v2-semantic-border-focus,var(--semantic-primary))] has-[[aria-invalid=true]:enabled]:border-v2-semantic-error-primary has-[:disabled]:cursor-not-allowed has-[:disabled]:border-v2-semantic-disabled-border has-[:disabled]:bg-v2-semantic-bg-ui",
            !highlighted &&
              "has-[:checked:enabled:not([aria-invalid=true])]:border-v2-semantic-primary"
          )}
        >
          {input}
          {(label || description) && (
            <span className={cn("min-w-0 flex-1", isDisabled && "opacity-50")}>
              {label && (
                <span id={labelId} className={radioLabelClass(isDisabled)}>
                  {label}
                </span>
              )}
              {description && (
                <span
                  id={inputId + "-description"}
                  className="m-0 mt-0.5 block text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)]"
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
      <div className="group/radio flex items-center gap-3 font-[family-name:var(--font-v2,Inter,sans-serif)]">
        {input}
        {(label || description) && (
          <div className="min-w-0 flex-1">
            {label && (
              <label htmlFor={inputId} className={radioLabelClass(isDisabled)}>
                {label}
              </label>
            )}
            {description && (
              <p
                id={inputId + "-description"}
                className="m-0 mt-0.5 text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)]"
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
RadioBase.displayName = "RadioBase";

/* -------------------------------------------------------------------------------------------------
 * Radio anatomy: Radio.Content, Radio.Control, Radio.Description, Radio.Error. Pass children to <Radio> to compose
 * them; without children <Radio> draws the whole option from its props. The dot is a layer of the native input
 * itself, so there is no Radio.Indicator.
 * -----------------------------------------------------------------------------------------------*/

interface RadioFieldContextValue {
  inputId: string;
  name?: string;
  value: RadioProps["value"];
  checked?: boolean;
  onChange?: RadioProps["onChange"];
  onCheckedChange?: RadioProps["onCheckedChange"];
  /** Everything else given to <Radio> (aria-*, handlers, form, ...) goes to the control. */
  controlProps: Record<string, unknown>;
  controlRef: React.Ref<HTMLInputElement>;
}
const RadioFieldContext = React.createContext<RadioFieldContextValue | null>(
  null
);

const RadioField = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      children,
      className,
      style,
      id,
      name,
      value,
      checked,
      disabled,
      invalid,
      onChange,
      onCheckedChange,
      // Props mode only: anatomy mode composes these from the parts.
      label: _label,
      description: _description,
      variant: _variant,
      ...rest
    },
    ref
  ) => {
    const group = React.useContext(RadioContext);
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const isDisabled = Boolean(disabled || group?.disabled);
    const isInvalid = Boolean(invalid || group?.invalid);
    const field = useChoiceField(isDisabled, isInvalid);
    const dataAttributes: Record<string, unknown> = {};
    const controlProps: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(rest)) {
      if (key.startsWith("data-")) dataAttributes[key] = entry;
      else controlProps[key] = entry;
    }
    return (
      <ChoiceFieldContext.Provider value={field}>
        <RadioFieldContext.Provider
          value={{
            inputId,
            name: name || group?.name,
            value,
            checked:
              checked ?? (group ? group.value === String(value) : undefined),
            onChange,
            onCheckedChange,
            controlProps,
            controlRef: ref,
          }}
        >
          <div
            data-slot="radio"
            data-disabled={isDisabled ? "" : undefined}
            data-invalid={isInvalid ? "" : undefined}
            className={cn(
              "group/radio flex flex-col font-[family-name:var(--font-v2,Inter,sans-serif)] [--choice-indent:29px]",
              className
            )}
            style={style}
            {...dataAttributes}
          >
            {children}
          </div>
        </RadioFieldContext.Provider>
      </ChoiceFieldContext.Provider>
    );
  }
);
RadioField.displayName = "RadioField";

/** The clickable label that wraps the control and the label text. */
const RadioContent = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const field = React.useContext(RadioFieldContext);
  const choice = React.useContext(ChoiceFieldContext);
  const isDisabled = Boolean(choice?.disabled);
  return (
    <label
      ref={ref}
      htmlFor={field?.inputId}
      data-slot="radio-content"
      className={cn(
        radioLabelClass(isDisabled),
        "flex items-center gap-3",
        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
      {...props}
    />
  );
});
RadioContent.displayName = "RadioContent";

/** The native radio input. It reads its value and state from <Radio> and the surrounding RadioGroup. */
const RadioControl = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size">
>(({ className, ...props }, ref) => {
  const field = React.useContext(RadioFieldContext);
  const choice = React.useContext(ChoiceFieldContext);
  const outer = React.useCallback(
    (node: HTMLInputElement | null) => {
      for (const target of [ref, field?.controlRef]) {
        if (typeof target === "function") target(node);
        else if (target)
          (target as React.MutableRefObject<typeof node>).current = node;
      }
    },
    [ref, field?.controlRef]
  );
  const merged = { ...(field?.controlProps ?? {}), ...props } as typeof props;
  return (
    <RadioInput
      ref={outer}
      data-slot="radio-control"
      id={field?.inputId}
      name={field?.name}
      value={field?.value}
      checked={field?.checked}
      disabled={choice?.disabled}
      invalid={choice?.invalid}
      onChange={field?.onChange}
      onCheckedChange={field?.onCheckedChange}
      className={className}
      {...merged}
      aria-describedby={
        choice && (choice.hasDescription || choice.hasError)
          ? joinIds(
              merged["aria-describedby"],
              choice.hasDescription ? choice.descriptionId : undefined,
              choice.hasError ? choice.errorId : undefined
            )
          : merged["aria-describedby"]
      }
    />
  );
});
RadioControl.displayName = "RadioControl";

/**
 * A radio option, for use inside a `RadioGroup`. With no children it draws everything from its props (`label`,
 * `description`, `variant`). With children it is the field root for the Radio.* parts, as in HeroUI:
 *
 * ```tsx
 * <RadioGroup name="plan" defaultValue="team" label="Plan">
 *   <Radio value="team">
 *     <Radio.Content>
 *       <Radio.Control />
 *       Team
 *     </Radio.Content>
 *     <Radio.Description>Unlimited agents</Radio.Description>
 *   </Radio>
 * </RadioGroup>
 * ```
 */
const RadioRoot = React.forwardRef<HTMLInputElement, RadioProps>(
  (props, ref) =>
    props.children !== undefined && props.children !== null ? (
      <RadioField ref={ref} {...props} />
    ) : (
      <RadioBase ref={ref} {...props} />
    )
);
RadioRoot.displayName = "Radio";
const Radio = Object.assign(RadioRoot, {
  Content: RadioContent,
  Control: RadioControl,
  Description: ChoiceDescription,
  Error: ChoiceError,
});

export {
  Checkbox,
  CheckboxGroup,
  CheckboxContent,
  CheckboxControl,
  CheckboxIndicator,
  checkboxVariants,
  Radio,
  RadioGroup,
  RadioContent,
  RadioControl,
  ChoiceDescription,
  ChoiceError,
};
