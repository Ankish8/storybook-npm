import * as React from "react";
import { Phone, MessageSquare, Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { BOT_TYPE, type CreateBotModalProps, type BotType } from "./types";

interface BotTypeOption {
  id: BotType;
  label: string;
  description: string;
}

const BOT_TYPE_OPTIONS: BotTypeOption[] = [
  {
    id: "chatbot",
    label: "Chat bot",
    description: "Text-based routing for websites and WhatsApp.",
  },
  {
    id: "voicebot",
    label: "Voice bot",
    description: "Conversational spoken interactions over phone.",
  },
];

function getFirstEnabledBotType(
  chatbotDisabled: boolean,
  voicebotDisabled: boolean
): BotType {
  if (!chatbotDisabled) return "chatbot";
  if (!voicebotDisabled) return "voicebot";
  return "chatbot";
}

function isBotTypeDisabled(
  type: BotType,
  chatbotDisabled: boolean,
  voicebotDisabled: boolean
): boolean {
  return (
    (type === "chatbot" && chatbotDisabled) ||
    (type === "voicebot" && voicebotDisabled)
  );
}

export const CreateBotModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      onSubmit,
      isLoading,
      chatbotDisabled = false,
      voicebotDisabled = false,
      chatbotDisabledTooltip,
      voicebotDisabledTooltip,
      className,
    }: CreateBotModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [name, setName] = React.useState("");
    const [selectedType, setSelectedType] = React.useState<BotType>("chatbot");

    const chatD = Boolean(chatbotDisabled);
    const voiceD = Boolean(voicebotDisabled);

    React.useEffect(() => {
      if (!open) {
        setName("");
        setSelectedType(getFirstEnabledBotType(chatD, voiceD));
        return;
      }
      setSelectedType((prev) => {
        if (!isBotTypeDisabled(prev, chatD, voiceD)) return prev;
        return getFirstEnabledBotType(chatD, voiceD);
      });
    }, [open, chatD, voiceD]);

    const selectedTypeBlocked = isBotTypeDisabled(selectedType, chatD, voiceD);

    const handleSubmit = () => {
      if (!name.trim() || selectedTypeBlocked) return;
      const typeValue =
        selectedType === "chatbot" ? BOT_TYPE.CHAT : BOT_TYPE.VOICE;
      onSubmit?.({ name: name.trim(), type: typeValue });
    };

    const handleClose = () => {
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="sm"
          className={cn(
            // Do not use horizontal margin here — it breaks left-1/2 + -translate-x-1/2 centering on DialogContent.
            "max-h-[90vh] overflow-y-auto w-[min(100%,calc(100vw-1.5rem))]",
            className
          )}
        >
          <DialogHeader>
            <DialogTitle>Create AI bot</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Name field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="bot-name"
                className="flex items-center gap-0.5 text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]"
              >
                Name
                <span className="text-xs text-semantic-error-primary">*</span>
              </label>
              <input
                id="bot-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter bot name"
                className={cn(
                  "w-full h-10 px-4 py-2.5 text-sm rounded border border-solid",
                  "border-semantic-border-input bg-semantic-bg-primary",
                  "text-semantic-text-primary placeholder:text-semantic-text-muted",
                  "outline-none hover:border-semantic-border-input-focus",
                  "focus:border-semantic-border-input-focus focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
                )}
              />
            </div>

            {/* Bot type selection */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
                Select Bot Type
              </span>
              <TooltipProvider delayDuration={200}>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                  {BOT_TYPE_OPTIONS.map(({ id, label, description }) => {
                    const optionDisabled = isBotTypeDisabled(id, chatD, voiceD);
                    const isSelected = selectedType === id && !optionDisabled;
                    const disabledTooltip =
                      id === "chatbot"
                        ? chatbotDisabledTooltip
                        : voicebotDisabledTooltip;
                    const showTooltip =
                      optionDisabled &&
                      disabledTooltip != null &&
                      disabledTooltip.trim() !== "";

                    const baseButtonClass = cn(
                      "flex flex-col items-start gap-2 sm:gap-2.5 p-3 rounded-lg border border-solid text-left flex-1 min-h-[100px] sm:h-[134px] justify-center min-w-0 w-full",
                      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus",
                      optionDisabled
                        ? "cursor-not-allowed opacity-50 pointer-events-none bg-semantic-bg-primary border-semantic-border-layout"
                        : isSelected
                          ? "bg-semantic-brand-surface border-semantic-brand shadow-sm"
                          : "bg-semantic-bg-primary border-semantic-border-layout hover:bg-semantic-bg-hover"
                    );

                    const button = (
                      <button
                        type="button"
                        disabled={optionDisabled}
                        onClick={() => {
                          if (!optionDisabled) setSelectedType(id);
                        }}
                        className={baseButtonClass}
                        aria-pressed={isSelected}
                        aria-disabled={optionDisabled}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center size-[34px] rounded-lg",
                            isSelected
                              ? "bg-semantic-bg-primary"
                              : "bg-semantic-info-surface-subtle"
                          )}
                        >
                          {id === "chatbot" ? (
                            <MessageSquare className="size-5 text-semantic-text-secondary" />
                          ) : (
                            <Phone className="size-5 text-semantic-text-secondary" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="m-0 text-sm font-semibold text-semantic-text-primary tracking-[0.014px]">
                            {label}
                          </p>
                          <p className="m-0 text-xs text-semantic-text-muted tracking-[0.048px]">
                            {description}
                          </p>
                        </div>
                      </button>
                    );

                    if (showTooltip) {
                      return (
                        <Tooltip key={id}>
                          <TooltipTrigger asChild>
                            <span className="flex flex-1 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus">
                              {button}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="m-0">{disabledTooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return (
                      <React.Fragment key={id}>
                        {button}
                      </React.Fragment>
                    );
                  })}
                </div>
              </TooltipProvider>

              {/* Helper text */}
              <div className="flex items-center gap-1.5 px-3 py-2.5 rounded bg-semantic-bg-ui">
                <Info className="size-4 text-semantic-text-secondary shrink-0" />
                <p className="m-0 text-xs text-semantic-text-secondary">
                  This setting cannot be changed once selected.
                </p>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4 justify-end mt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!name.trim() || isLoading || selectedTypeBlocked}
              loading={isLoading}
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

CreateBotModal.displayName = "CreateBotModal";
