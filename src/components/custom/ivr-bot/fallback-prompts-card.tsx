import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/utils";
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

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FallbackPromptsData {
  agentBusyPrompt: string;
  noExtensionFoundPrompt: string;
}

/** Default hover text for the info icon next to "Agent Busy Prompt" */
export const defaultAgentBusyPromptTooltip =
  "Played when a call is transferred but no agent picks up and the call returns to the bot.";

/** Default hover text for the info icon next to "No Extension Found" */
export const defaultNoExtensionFoundPromptTooltip =
  "Played when the bot can't find a valid department extension to transfer to.";

/** Default hover text for the info icon next to the "Fallback Prompts" accordion title */
export const defaultFallbackPromptsInfoTooltip =
  "These prompts play when a transfer fails or no extension is found. Configure them to ensure callers always get a helpful response even when agents are unavailable.";

export interface FallbackPromptsCardProps {
  /** Current prompt text values */
  data: Partial<FallbackPromptsData>;
  /** Callback when any field changes */
  onChange: (patch: Partial<FallbackPromptsData>) => void;
  /** Called when the Agent Busy Prompt textarea loses focus */
  onAgentBusyPromptBlur?: (value: string) => void;
  /** Called when the No Extension Found textarea loses focus */
  onNoExtensionFoundPromptBlur?: (value: string) => void;
  /** Maximum character length for each prompt field (default: 25000) */
  maxLength?: number;
  /** Disables all fields in the card (view mode) */
  disabled?: boolean;
  /** Opens the accordion by default (default: false) */
  defaultOpen?: boolean;
  /**
   * Hover text on the info icon next to "Agent Busy Prompt".
   * When omitted, {@link defaultAgentBusyPromptTooltip} is used. Pass `""` to hide the icon.
   */
  agentBusyPromptTooltip?: string;
  /**
   * Hover text on the info icon next to "No Extension Found".
   * When omitted, {@link defaultNoExtensionFoundPromptTooltip} is used. Pass `""` to hide the icon.
   */
  noExtensionFoundPromptTooltip?: string;
  /**
   * Hover text on the info icon next to the "Fallback Prompts" title (same pattern as Knowledge Base).
   * When omitted, {@link defaultFallbackPromptsInfoTooltip} is used. Pass `""` for a non-interactive icon only.
   */
  infoTooltip?: string;
  /** Additional className */
  className?: string;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function PromptField({
  label,
  labelTooltip,
  value,
  placeholder,
  maxLength,
  disabled,
  onChange,
  onBlur,
  rows = 2,
}: {
  label: string;
  /** When set, info icon beside label; hover shows tooltip */
  labelTooltip?: string;
  value: string;
  placeholder?: string;
  maxLength: number;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  rows?: number;
}) {
  const labelClasses = cn(
    "text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]"
  );

  return (
    <div className="flex flex-col gap-1.5">
      {labelTooltip ? (
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={labelClasses}>{label}</span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="inline-flex shrink-0 cursor-pointer"
                  aria-label={`${label}: more information`}
                >
                  <Info className="size-3.5 text-semantic-text-muted pointer-events-none" />
                </span>
              </TooltipTrigger>
              <TooltipContent>{labelTooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <label className={labelClasses}>{label}</label>
      )}
      <Textarea
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        showCount
        disabled={disabled}
        rows={rows}
        resize="none"
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        wrapperClassName="gap-1.5"
        className="min-h-0"
      />
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

const FallbackPromptsCard = React.forwardRef(
  (
    {
      data,
      onChange,
      onAgentBusyPromptBlur,
      onNoExtensionFoundPromptBlur,
      maxLength = 25000,
      disabled,
      defaultOpen = false,
      agentBusyPromptTooltip,
      noExtensionFoundPromptTooltip,
      infoTooltip,
      className,
    }: FallbackPromptsCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const resolvedAgentBusyTooltip =
      agentBusyPromptTooltip === undefined
        ? defaultAgentBusyPromptTooltip
        : agentBusyPromptTooltip;
    const resolvedNoExtensionTooltip =
      noExtensionFoundPromptTooltip === undefined
        ? defaultNoExtensionFoundPromptTooltip
        : noExtensionFoundPromptTooltip;
    const resolvedSectionInfoTooltip =
      infoTooltip === undefined ? defaultFallbackPromptsInfoTooltip : infoTooltip;

    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        <Accordion
          type="single"
          defaultValue={defaultOpen ? ["fallback"] : []}
        >
          <AccordionItem value="fallback">
            <AccordionTrigger className="px-4 py-4 border-b border-solid border-semantic-border-layout hover:no-underline sm:px-6 sm:py-5">
              <span className="flex items-center gap-1.5 text-base font-semibold text-semantic-text-primary min-w-0">
                Fallback Prompts
                {resolvedSectionInfoTooltip ? (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="inline-flex shrink-0 cursor-pointer"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Fallback Prompts: more information"
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
              <div className="flex flex-col gap-6 px-4 pt-4 sm:px-6 sm:pt-5">
                <PromptField
                  label="Agent Busy Prompt"
                  labelTooltip={resolvedAgentBusyTooltip || undefined}
                  value={data.agentBusyPrompt ?? ""}
                  placeholder="Executives are busy at the moment, we will connect you soon."
                  maxLength={maxLength}
                  disabled={disabled}
                  onChange={(v) => onChange({ agentBusyPrompt: v })}
                  onBlur={onAgentBusyPromptBlur}
                  rows={4}
                />
                <PromptField
                  label="No Extension Found"
                  labelTooltip={resolvedNoExtensionTooltip || undefined}
                  value={data.noExtensionFoundPrompt ?? ""}
                  placeholder="Sorry, the requested extension is currently unavailable. Let me help you directly."
                  maxLength={maxLength}
                  disabled={disabled}
                  onChange={(v) => onChange({ noExtensionFoundPrompt: v })}
                  onBlur={onNoExtensionFoundPromptBlur}
                  rows={4}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);
FallbackPromptsCard.displayName = "FallbackPromptsCard";

export { FallbackPromptsCard };
