import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Switch } from "../../ui/switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdvancedSettingsData {
  silenceTimeout: number;
  callEndThreshold: number;
  interruptionHandling: boolean;
}

export interface AdvancedSettingsCardProps {
  /** Current form data */
  data: Partial<AdvancedSettingsData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<AdvancedSettingsData>) => void;
  /** Min value for silence timeout spinner (default: 1) */
  silenceTimeoutMin?: number;
  /** Max value for silence timeout spinner (default: 60) */
  silenceTimeoutMax?: number;
  /** Min value for call end threshold spinner (default: 1) */
  callEndThresholdMin?: number;
  /** Max value for call end threshold spinner (default: 10) */
  callEndThresholdMax?: number;
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
        {label}
      </label>
      {children}
    </div>
  );
}

function NumberSpinner({
  value,
  onChange,
  min = 0,
  max = 999,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <div className={cn("flex w-full items-center gap-2.5 px-4 py-2.5 border border-solid border-semantic-border-layout bg-semantic-bg-primary rounded", disabled && "opacity-50 cursor-not-allowed")}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-0 text-base text-semantic-text-primary bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:cursor-not-allowed"
      />
      <div className="flex flex-col items-center shrink-0 gap-0.5">
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={disabled}
          className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors disabled:cursor-not-allowed"
          aria-label="Increase"
        >
          <ChevronUp className="size-3" />
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={disabled}
          className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors disabled:cursor-not-allowed"
          aria-label="Decrease"
        >
          <ChevronDown className="size-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const AdvancedSettingsCard = React.forwardRef(
  (
    {
      data,
      onChange,
      silenceTimeoutMin = 1,
      silenceTimeoutMax = 60,
      callEndThresholdMin = 1,
      callEndThresholdMax = 10,
      disabled,
      className,
    }: AdvancedSettingsCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
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
                  <Field label="Silence Timeout (seconds)">
                    <NumberSpinner
                      value={data.silenceTimeout ?? 15}
                      onChange={(v) => onChange({ silenceTimeout: v })}
                      min={silenceTimeoutMin}
                      max={silenceTimeoutMax}
                      disabled={disabled}
                    />
                    <p className="m-0 text-xs text-semantic-text-muted">
                      Default: 15 seconds
                    </p>
                  </Field>

                  <Field label="Call End Threshold">
                    <NumberSpinner
                      value={data.callEndThreshold ?? 3}
                      onChange={(v) => onChange({ callEndThreshold: v })}
                      min={callEndThresholdMin}
                      max={callEndThresholdMax}
                      disabled={disabled}
                    />
                    <p className="m-0 text-xs text-semantic-text-muted">
                      Drop call after n consecutive silences. Default: 3
                    </p>
                  </Field>
                </div>

                {/* Interruption Handling — separated by divider */}
                <div className="px-4 py-4 flex items-center gap-3 sm:px-6 sm:py-5">
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-semantic-text-primary">
                      Interruption Handling
                    </span>
                    <p className="m-0 text-xs text-semantic-text-muted">
                      Allow user to interrupt the bot mid-sentence
                    </p>
                  </div>
                  <Switch
                    checked={data.interruptionHandling ?? true}
                    onCheckedChange={(v) =>
                      onChange({ interruptionHandling: v })
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
