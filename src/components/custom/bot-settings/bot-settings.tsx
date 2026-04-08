import * as React from "react";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Tag } from "../../ui/tag";
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
      phoneNumbers = [],
      onRemovePhoneNumber,
      onOpenDropdown,
      defaultOpen,
      infoTooltip,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen ?? true);

    const resolvedTooltip =
      infoTooltip === undefined ? defaultInfoTooltip : infoTooltip;

    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Header */}
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

        {/* Content */}
        {isOpen && (
          <div className="border-t border-solid border-semantic-border-layout">
            {/* Connect WhatsApp subsection */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-solid border-semantic-border-layout">
              {/* Label row */}
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

              {/* Phone number tag input container */}
              <div className="bg-semantic-bg-primary border border-solid border-semantic-border-layout rounded p-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                    {phoneNumbers.map((phone) => (
                      <Tag
                        key={phone}
                        variant="info"
                        onRemove={() => onRemovePhoneNumber?.(phone)}
                        removeDisabled={disabled}
                        removeAriaLabel={`Remove ${phone}`}
                      >
                        {phone}
                      </Tag>
                    ))}
                  </div>

                  {/* Divider + dropdown chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-px h-5 border-l border-solid border-semantic-border-layout" />
                    <button
                      type="button"
                      className="inline-flex items-center justify-center bg-transparent border-none cursor-pointer p-0"
                      onClick={() => onOpenDropdown?.()}
                      disabled={disabled}
                      aria-label="Open phone number dropdown"
                    >
                      <ChevronDown className="size-4 text-semantic-text-muted" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
BotSettings.displayName = "BotSettings";

export { BotSettings, defaultInfoTooltip };
