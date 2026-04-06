import * as React from "react";
import { ChevronUp, ChevronDown, Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Switch } from "../../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import {
  defaultAdvancedSettingsNumericBounds,
  type AdvancedSettingsNumericBounds,
} from "./advanced-settings-bounds";

/** Default hover text for the Silence Wait Duration info icon */
export const defaultSilenceWaitDurationTooltip =
  "How long the bot waits after a caller stops speaking before responding again.";

/** Default hover text for the Maximum Silence Retries info icon */
export const defaultMaximumSilenceRetriesTooltip =
  "The number of consecutive silences after which the bot automatically ends the call.";

/** Default muted helper line under Maximum Silence Retries (below the input); empty = none shown */
export const defaultMaximumSilenceRetriesHelpText = "";

/** Default muted helper line under Interruption Handling */
export const defaultInterruptionHandlingHelpText =
  "Allow user to interrupt the bot mid-sentence.";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdvancedSettingsData {
  silenceTimeout?: number;
  callEndThreshold?: number;
  interruptionHandling: boolean;
}

/** Payload when a numeric advanced field finishes a blur validation pass. */
export interface AdvancedSettingsNumericFieldBlurDetail {
  /** Value committed to form state (`undefined` if empty after blur). */
  value: number | undefined;
  /** `false` when the field shows a validation error after blur. */
  valid: boolean;
}

export interface AdvancedSettingsCardProps {
  /** Current form data */
  data: Partial<AdvancedSettingsData>;
  /** Callback when any field in this card changes */
  onChange: (patch: Partial<AdvancedSettingsData>) => void;
  /**
   * Shorthand min/max for both numeric fields. Overridden by explicit
   * `silenceTimeoutMin`, `silenceTimeoutMax`, `callEndThresholdMin`, or `callEndThresholdMax`
   * when those are passed.
   */
  numericBounds?: Partial<AdvancedSettingsNumericBounds>;
  /** Min value for silence timeout spinner */
  silenceTimeoutMin?: number;
  /** Max value for silence timeout spinner */
  silenceTimeoutMax?: number;
  /** Min value for call end threshold spinner */
  callEndThresholdMin?: number;
  /** Max value for call end threshold spinner */
  callEndThresholdMax?: number;
  /** When true, an empty value shows a validation error on blur (default: true) */
  silenceTimeoutRequired?: boolean;
  /** When true, an empty value shows a validation error on blur (default: true) */
  callEndThresholdRequired?: boolean;
  /** Fires after each successful `onChange` from this card (including stepper and switch). */
  onAdvancedSettingsChange?: (patch: Partial<AdvancedSettingsData>) => void;
  /** Fires when silence timeout input blurs after validation. */
  onSilenceTimeoutBlur?: (
    detail: AdvancedSettingsNumericFieldBlurDetail
  ) => void;
  /** Fires when call end threshold input blurs after validation. */
  onCallEndThresholdBlur?: (
    detail: AdvancedSettingsNumericFieldBlurDetail
  ) => void;
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /** Hover text on the info icon next to the Silence Wait Duration label */
  silenceWaitDurationTooltip?: string;
  /** Hover text on the info icon next to the Maximum Silence Retries label */
  maximumSilenceRetriesTooltip?: string;
  /** Muted helper line under the Maximum Silence Retries input */
  maximumSilenceRetriesHelpText?: string;
  /** Muted helper text under the Interruption Handling title */
  interruptionHandlingHelpText?: string;
  /** Additional className */
  className?: string;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function Field({
  label,
  labelTooltip,
  children,
}: {
  label: string;
  /** When set, shows an info icon beside the label (same pattern as Knowledge Base / Functions cards). */
  labelTooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
          {label}
        </span>
        {labelTooltip ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
                  className="size-3.5 text-semantic-text-muted shrink-0 cursor-help"
                  aria-label={`${label}: more information`}
                />
              </TooltipTrigger>
              <TooltipContent>{labelTooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function ValidatedNumberSpinner({
  id,
  value,
  onChange,
  min,
  max,
  required,
  disabled,
  onBlurCommit,
}: {
  id: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  min: number;
  max: number;
  required: boolean;
  disabled?: boolean;
  onBlurCommit?: (detail: AdvancedSettingsNumericFieldBlurDetail) => void;
}) {
  const [inputStr, setInputStr] = React.useState(() =>
    value === undefined ? "" : String(value)
  );
  const [error, setError] = React.useState<string | null>(null);
  const focusedRef = React.useRef(false);
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      if (!focusedRef.current) {
        setInputStr(value === undefined ? "" : String(value));
        setError(null);
      }
    }
  }, [value]);

  const stepBase = (): number | null => {
    const t = inputStr.trim();
    if (t !== "") {
      const n = Number(t);
      if (Number.isFinite(n)) return n;
    }
    if (value !== undefined) return value;
    return null;
  };

  const canIncrement = (): boolean => {
    const b = stepBase();
    if (b === null) return true;
    return b < max;
  };

  const canDecrement = (): boolean => {
    const b = stepBase();
    if (b === null) return false;
    return b > min;
  };

  const applyStep = (delta: 1 | -1) => {
    let n = stepBase();
    if (n === null) {
      if (delta > 0) n = min - 1;
      else return;
    }
    const next = clamp(n + delta, min, max);
    setInputStr(String(next));
    setError(null);
    onChange(next);
  };

  const handleBlur = () => {
    focusedRef.current = false;
    const trimmed = inputStr.trim();
    if (trimmed === "") {
      onChange(undefined);
      if (required) {
        setError("This field is required");
        onBlurCommit?.({ value: undefined, valid: false });
      } else {
        setError(null);
        onBlurCommit?.({ value: undefined, valid: true });
      }
      return;
    }
    const num = Number(trimmed);
    if (!Number.isFinite(num)) {
      setError("Enter a valid number");
      onBlurCommit?.({ value, valid: false });
      return;
    }
    if (num < min || num > max) {
      setError(`Value must be between ${min} and ${max}`);
      onBlurCommit?.({ value, valid: false });
      return;
    }
    setError(null);
    onChange(num);
    onBlurCommit?.({ value: num, valid: true });
  };

  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex w-full items-center gap-2.5 px-4 py-2.5 border border-solid bg-semantic-bg-primary rounded",
          error
            ? "border-semantic-error-primary"
            : "border-semantic-border-layout",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={inputStr}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onFocus={() => {
            focusedRef.current = true;
            setError(null);
          }}
          onBlur={handleBlur}
          onChange={(e) => setInputStr(e.target.value)}
          className="flex-1 min-w-0 text-base text-semantic-text-primary bg-transparent outline-none disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center shrink-0 gap-0.5">
          <button
            type="button"
            onClick={() => applyStep(1)}
            disabled={disabled || !canIncrement()}
            className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase"
          >
            <ChevronUp className="size-3" />
          </button>
          <button
            type="button"
            onClick={() => applyStep(-1)}
            disabled={disabled || !canDecrement()}
            className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease"
          >
            <ChevronDown className="size-3" />
          </button>
        </div>
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="m-0 text-xs text-semantic-error-primary"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function useCorrectOutOfRangeNumeric(
  raw: number | undefined,
  min: number,
  max: number,
  disabled: boolean | undefined,
  patchKey: "silenceTimeout" | "callEndThreshold",
  onChange: (patch: Partial<AdvancedSettingsData>) => void
) {
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  React.useEffect(() => {
    if (disabled || raw === undefined) return;
    if (raw < min || raw > max) {
      onChangeRef.current({
        [patchKey]: clamp(raw, min, max),
      } as Partial<AdvancedSettingsData>);
    }
  }, [raw, min, max, disabled, patchKey]);
}

// ─── Component ──────────────────────────────────────────────────────────────

const AdvancedSettingsCard = React.forwardRef(
  (
    {
      data,
      onChange,
      numericBounds,
      silenceTimeoutMin: silenceTimeoutMinProp,
      silenceTimeoutMax: silenceTimeoutMaxProp,
      callEndThresholdMin: callEndThresholdMinProp,
      callEndThresholdMax: callEndThresholdMaxProp,
      silenceTimeoutRequired = true,
      callEndThresholdRequired = true,
      onAdvancedSettingsChange,
      onSilenceTimeoutBlur,
      onCallEndThresholdBlur,
      disabled,
      silenceWaitDurationTooltip = defaultSilenceWaitDurationTooltip,
      maximumSilenceRetriesTooltip = defaultMaximumSilenceRetriesTooltip,
      maximumSilenceRetriesHelpText = defaultMaximumSilenceRetriesHelpText,
      interruptionHandlingHelpText = defaultInterruptionHandlingHelpText,
      className,
    }: AdvancedSettingsCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const silenceTimeoutMin =
      silenceTimeoutMinProp ??
      numericBounds?.silenceTimeoutMin ??
      defaultAdvancedSettingsNumericBounds.silenceTimeoutMin;
    const silenceTimeoutMax =
      silenceTimeoutMaxProp ??
      numericBounds?.silenceTimeoutMax ??
      defaultAdvancedSettingsNumericBounds.silenceTimeoutMax;
    const callEndThresholdMin =
      callEndThresholdMinProp ??
      numericBounds?.callEndThresholdMin ??
      defaultAdvancedSettingsNumericBounds.callEndThresholdMin;
    const callEndThresholdMax =
      callEndThresholdMaxProp ??
      numericBounds?.callEndThresholdMax ??
      defaultAdvancedSettingsNumericBounds.callEndThresholdMax;

    const emitPatch = React.useCallback(
      (patch: Partial<AdvancedSettingsData>) => {
        onChange(patch);
        onAdvancedSettingsChange?.(patch);
      },
      [onChange, onAdvancedSettingsChange]
    );

    useCorrectOutOfRangeNumeric(
      data.silenceTimeout,
      silenceTimeoutMin,
      silenceTimeoutMax,
      disabled,
      "silenceTimeout",
      emitPatch
    );
    useCorrectOutOfRangeNumeric(
      data.callEndThreshold,
      callEndThresholdMin,
      callEndThresholdMax,
      disabled,
      "callEndThreshold",
      emitPatch
    );

    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        <Accordion type="single">
          <AccordionItem value="advanced">
            <AccordionTrigger className="px-4 py-4 border-b border-solid border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
              <span className="text-base font-semibold text-semantic-text-primary">
                Advanced Settings
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col">
                {/* Number fields section */}
                <div className="px-4 pt-4 pb-4 flex flex-col gap-5 border-b border-solid border-semantic-border-layout sm:px-6 sm:pt-5 sm:pb-6">
                  <Field
                    label="Silence Wait Duration"
                    labelTooltip={silenceWaitDurationTooltip}
                  >
                    <ValidatedNumberSpinner
                      id="advanced-silence-timeout"
                      value={data.silenceTimeout}
                      onChange={(v) => emitPatch({ silenceTimeout: v })}
                      min={silenceTimeoutMin}
                      max={silenceTimeoutMax}
                      required={silenceTimeoutRequired}
                      disabled={disabled}
                      onBlurCommit={onSilenceTimeoutBlur}
                    />
                  </Field>

                  <Field
                    label="Maximum Silence Retries"
                    labelTooltip={maximumSilenceRetriesTooltip}
                  >
                    <ValidatedNumberSpinner
                      id="advanced-call-end-threshold"
                      value={data.callEndThreshold}
                      onChange={(v) => emitPatch({ callEndThreshold: v })}
                      min={callEndThresholdMin}
                      max={callEndThresholdMax}
                      required={callEndThresholdRequired}
                      disabled={disabled}
                      onBlurCommit={onCallEndThresholdBlur}
                    />
                    {maximumSilenceRetriesHelpText ? (
                      <p className="m-0 text-xs text-semantic-text-muted">
                        {maximumSilenceRetriesHelpText}
                      </p>
                    ) : null}
                  </Field>
                </div>

                {/* Interruption Handling — separated by divider */}
                <div className="px-4 py-4 flex items-center gap-3 sm:px-6 sm:py-5">
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-semantic-text-primary">
                      Interruption Handling
                    </span>
                    <p className="m-0 text-xs text-semantic-text-muted">
                      {interruptionHandlingHelpText}
                    </p>
                  </div>
                  <Switch
                    checked={data.interruptionHandling ?? true}
                    onCheckedChange={(v) =>
                      emitPatch({ interruptionHandling: v })
                    }
                    disabled={disabled}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);
AdvancedSettingsCard.displayName = "AdvancedSettingsCard";

export { AdvancedSettingsCard };
