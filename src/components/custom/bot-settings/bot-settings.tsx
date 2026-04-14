import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/utils";
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
      defaultOpen: _defaultOpenIgnored,
      disabled = false,
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
    const selectedWhatsappValues =
      whatsappValue ?? internalWhatsapp;

    const handleWhatsappChange = React.useCallback(
      (values: string[]) => {
        if (whatsappValue === undefined) {
          setInternalWhatsapp(values);
        }
        onWhatsappValueChange?.(values);
      },
      [whatsappValue, onWhatsappValueChange]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col overflow-visible",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-4 pb-4">
          <h2 className="text-base font-semibold text-semantic-text-primary m-0">
            Settings
          </h2>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-semantic-text-secondary">
                Connect WhatsApp
              </span>
              {resolvedTooltip ? (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="inline-flex shrink-0 cursor-help"
                        aria-label="Connect WhatsApp: more information"
                      >
                        <Info className="size-3.5 text-semantic-text-muted pointer-events-none" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{resolvedTooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Info className="size-3.5 text-semantic-text-muted shrink-0" />
              )}
            </div>

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
              separateSelectedWithDivider={whatsappSeparateSelectedWithDivider}
              showClearAll={whatsappShowClearAll}
              showSeparatorBeforeChevron={whatsappShowSeparatorBeforeChevron}
              closeOnEscape={whatsappCloseOnEscape}
              wrapperClassName={cn("gap-2", whatsappWrapperClassName)}
              triggerClassName={cn(
                "min-h-[46px] px-2.5 py-2",
                whatsappTriggerClassName
              )}
            />
          </div>
        </div>

        <hr
          className="m-0 h-px w-full shrink-0 border-0 border-t border-solid border-semantic-border-layout"
          aria-hidden
        />
      </div>
    );
  }
);
BotSettings.displayName = "BotSettings";

export { BotSettings, defaultInfoTooltip };
