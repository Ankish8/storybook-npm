import * as React from "react";
import { ChevronDown, Info } from "lucide-react";
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
      defaultOpen,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen ?? true);

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
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg overflow-visible",
          className
        )}
        {...props}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-4 sm:px-6 sm:py-5 cursor-pointer bg-transparent border-none"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span className="text-base font-semibold text-semantic-text-primary">
            Settings
          </span>
          <ChevronDown
            className={cn(
              "size-5 text-semantic-text-muted transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="border-t border-solid border-semantic-border-layout">
            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-solid border-semantic-border-layout">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-sm text-semantic-text-primary">
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
        )}
      </div>
    );
  }
);
BotSettings.displayName = "BotSettings";

export { BotSettings, defaultInfoTooltip };
