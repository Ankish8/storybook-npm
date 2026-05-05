import * as React from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import { BotHumanHandover } from "../bot-human-handover/bot-human-handover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { MultiSelect } from "../../ui/multi-select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import type { BotSettingsProps } from "./types";

const defaultInfoTooltip =
  "Select the WhatsApp numbers you want this bot to handle. The bot will respond to messages received on these numbers.";

const BotSettings = React.forwardRef<HTMLDivElement, BotSettingsProps>(
  (
    {
      whatsappOptions,
      whatsappValue,
      onWhatsappValueChange,
      defaultWhatsappValue,
      whatsappPlaceholder = "Select WhatsApp numbers",
      whatsappSearchable = true,
      whatsappSearchPlaceholder = "Search numbers…",
      whatsappMaxSelections,
      whatsappShowSelectionFooter = true,
      whatsappError,
      whatsappHelperText,
      whatsappRequired,
      whatsappSeparateSelectedWithDivider = true,
      whatsappLoading,
      whatsappId,
      whatsappName,
      whatsappCloseOnEscape = false,
      whatsappWrapperClassName,
      whatsappTriggerClassName,
      whatsappShowClearAll = false,
      whatsappShowSeparatorBeforeChevron = true,
      infoTooltip,
      defaultOpen = true,
      disabled = false,
      humanHandover,
      className,
      ...props
    },
    ref
  ) => {
    const resolvedTooltip =
      infoTooltip === undefined ? defaultInfoTooltip : infoTooltip;

    const [internalWhatsapp, setInternalWhatsapp] = React.useState<string[]>(
      defaultWhatsappValue ?? []
    );
    const selectedWhatsappValues = whatsappValue ?? internalWhatsapp;

    const handleWhatsappChange = React.useCallback(
      (values: string[]) => {
        if (whatsappValue === undefined) {
          setInternalWhatsapp(values);
        }
        onWhatsappValueChange?.(values);
      },
      [whatsappValue, onWhatsappValueChange]
    );

    const handoverHidden = humanHandover === false;
    const {
      className: handoverClassName = undefined,
      ...handoverRest
    } = handoverHidden ? {} : { ...(humanHandover ?? {}) };

    const accordionId = "bot-settings";

    return (
      <div
        ref={ref}
        className={cn("min-w-0 max-w-full", className)}
        {...props}
      >
        <div
          className={cn(
            "overflow-visible rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary"
          )}
        >
          <Accordion
            type="single"
            defaultValue={defaultOpen ? [accordionId] : []}
          >
            <AccordionItem value={accordionId}>
              <AccordionTrigger
                className={cn(
                  "border-b border-solid border-semantic-border-layout px-4 py-4 hover:no-underline sm:px-6 sm:py-5"
                )}
              >
                <span className="flex min-w-0 items-center gap-1.5 text-base font-semibold text-semantic-text-primary">
                  Settings
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex min-w-0 flex-col gap-4 px-4 pb-5 pt-4 sm:gap-6 sm:px-6 sm:pb-6 sm:pt-5">
                  <div className="flex min-w-0 flex-col gap-3">
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                      <span className="text-sm text-semantic-text-secondary">
                        Connect WhatsApp
                      </span>
                      {resolvedTooltip ? (
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="inline-flex shrink-0 cursor-help text-semantic-text-muted"
                                aria-label="Connect WhatsApp: more information"
                              >
                                <HelpCircle
                                  className="size-3.5 pointer-events-none"
                                  aria-hidden
                                />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{resolvedTooltip}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="inline-flex shrink-0 text-semantic-text-muted">
                          <HelpCircle className="size-3.5" aria-hidden />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 w-full">
                      <MultiSelect
                        id={whatsappId}
                        name={whatsappName}
                        options={whatsappOptions}
                        value={selectedWhatsappValues}
                        onValueChange={handleWhatsappChange}
                        placeholder={whatsappPlaceholder}
                        searchable={whatsappSearchable}
                        searchPlaceholder={whatsappSearchPlaceholder}
                        maxSelections={whatsappMaxSelections}
                        showSelectionFooter={whatsappShowSelectionFooter}
                        error={whatsappError}
                        helperText={whatsappHelperText}
                        required={whatsappRequired}
                        disabled={disabled}
                        loading={whatsappLoading}
                        optionVariant="detailed"
                        separateSelectedWithDivider={
                          whatsappSeparateSelectedWithDivider
                        }
                        showClearAll={whatsappShowClearAll}
                        showSeparatorBeforeChevron={
                          whatsappShowSeparatorBeforeChevron
                        }
                        closeOnEscape={whatsappCloseOnEscape}
                        wrapperClassName={cn("gap-2", whatsappWrapperClassName)}
                        triggerClassName={cn(
                          "min-h-[46px] min-w-0 px-2.5 py-2",
                          whatsappTriggerClassName
                        )}
                      />
                    </div>
                  </div>

                  {!handoverHidden ? (
                    <>
                      <div
                        className="border-t border-solid border-semantic-border-layout"
                        aria-hidden
                      />
                      <BotHumanHandover
                        className={cn("border-0 py-0", handoverClassName)}
                        {...handoverRest}
                      />
                    </>
                  ) : null}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  }
);
BotSettings.displayName = "BotSettings";

export { BotSettings, defaultInfoTooltip };
