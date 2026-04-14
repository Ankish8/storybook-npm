import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Switch } from "../../ui/switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Textarea } from "../../ui/textarea";
import {
  hasInvalidPromptFieldChars,
  PROMPT_INVALID_CHARS_MESSAGE,
} from "./prompt-field-validation";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FrustrationHandoverData {
  frustrationHandoverEnabled: boolean;
  /** Message shown to the caller while waiting for a human handover (when escalation is enabled). */
  escalationPrompt: string;
  escalationDepartment: string;
}

export interface DepartmentOption {
  value: string;
  label: string;
}

const DEFAULT_DEPARTMENT_OPTIONS: DepartmentOption[] = [
  { value: "support", label: "Support" },
  { value: "sales", label: "Sales" },
  { value: "billing", label: "Billing" },
];

/** Default hover text for the info icon next to the "Escalate to Human" accordion title */
export const defaultEscalateToHumanInfoTooltip =
  "When enabled, the bot automatically transfers the call to a human agent if a caller shows repeated signs of frustration. Select a department extension to route these escalations to.";

export interface FrustrationHandoverCardProps {
  /** Current form data */
  data: Partial<FrustrationHandoverData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<FrustrationHandoverData>) => void;
  /** Available escalation department options */
  departmentOptions?: DepartmentOption[];
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /**
   * Hover text on the info icon next to the "Escalate to Human" title (same pattern as Knowledge Base).
   * When omitted, {@link defaultEscalateToHumanInfoTooltip} is used. Pass `""` for a non-interactive icon only.
   */
  infoTooltip?: string;
  /** Additional className */
  className?: string;
  /**
   * Maximum characters for **Prompt** (default 5000). Uses soft validation: users can type past the limit;
   * overflow styling applies unless `promptValidation` is set (parent message is shown instead).
   */
  promptMaxLength?: number;
  /**
   * External validation message for the Prompt field (e.g. from save/publish).
   * When set, it replaces the built-in overflow message (overflow still uses error styling via length check in the shared Textarea).
   */
  promptValidation?: string;
  /** Called when the Prompt textarea loses focus (current value passed — use to persist via API). */
  onEscalationPromptBlur?: (value: string) => void;
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

// ─── Component ──────────────────────────────────────────────────────────────

const FrustrationHandoverCard = React.forwardRef(
  ({
    data,
    onChange,
    departmentOptions = DEFAULT_DEPARTMENT_OPTIONS,
    disabled,
    infoTooltip,
    className,
    promptMaxLength = 5000,
    promptValidation,
    onEscalationPromptBlur,
  }: FrustrationHandoverCardProps, ref: React.Ref<HTMLDivElement>) => {
    const resolvedSectionInfoTooltip =
      infoTooltip === undefined ? defaultEscalateToHumanInfoTooltip : infoTooltip;

    const [promptInvalidCharsError, setPromptInvalidCharsError] = React.useState("");

    const promptValue = data.escalationPrompt ?? "";
    const promptLength = promptValue.length;
    const overPromptLimit = promptLength > promptMaxLength;
    const promptOverflowMessage = overPromptLimit
      ? `Maximum ${promptMaxLength} characters allowed.`
      : undefined;
    const promptErrorMessage =
      promptValidation ??
      (promptInvalidCharsError || undefined) ??
      promptOverflowMessage;

    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        <Accordion type="single">
          <AccordionItem value="frustration">
            <AccordionTrigger className="px-4 py-4 border-b border-solid border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
              <span className="flex items-center gap-1.5 text-base font-semibold text-semantic-text-primary min-w-0">
                Escalate to Human
                {resolvedSectionInfoTooltip ? (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="inline-flex shrink-0 cursor-help"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Escalate to Human: more information"
                        >
                          <Info className="size-3.5 text-semantic-text-muted pointer-events-none" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{resolvedSectionInfoTooltip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Info className="size-3.5 text-semantic-text-muted shrink-0" />
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-6 pt-0 pb-2">
                <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
                  <span className="text-sm text-semantic-text-primary">
                    Escalate when caller is unhappy
                  </span>
                  <Switch
                    checked={data.frustrationHandoverEnabled ?? false}
                    onCheckedChange={(v) =>
                      onChange({ frustrationHandoverEnabled: v })
                    }
                    disabled={disabled}
                  />
                </div>
                {data.frustrationHandoverEnabled ? (
                  <div className="px-4 sm:px-6">
                    <Textarea
                      label="Prompt"
                      labelClassName="font-semibold text-semantic-text-secondary tracking-[0.014px]"
                      placeholder="Executives are busy at the moment, we will connect you soon."
                      value={promptValue}
                      onChange={(e) => {
                        const v = e.target.value;
                        onChange({ escalationPrompt: v });
                        if (
                          promptInvalidCharsError &&
                          !hasInvalidPromptFieldChars(v)
                        ) {
                          setPromptInvalidCharsError("");
                        }
                      }}
                      onBlur={(e) => {
                        const v = e.target.value;
                        setPromptInvalidCharsError(
                          hasInvalidPromptFieldChars(v)
                            ? PROMPT_INVALID_CHARS_MESSAGE
                            : ""
                        );
                        onEscalationPromptBlur?.(v);
                      }}
                      disabled={disabled}
                      showCount
                      maxLength={promptMaxLength}
                      enforceMaxLength={false}
                      error={promptErrorMessage}
                      errorIcon={Boolean(promptErrorMessage)}
                      resize="vertical"
                      rows={4}
                      size="sm"
                    />
                  </div>
                ) : null}
                <div className="px-4 pb-2 sm:px-6">
                  <Field label="Transfer to department">
                    <Select
                      value={data.escalationDepartment || undefined}
                      onValueChange={(v) => onChange({ escalationDepartment: v })}
                      disabled={disabled || !data.frustrationHandoverEnabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);
FrustrationHandoverCard.displayName = "FrustrationHandoverCard";

export { FrustrationHandoverCard };
