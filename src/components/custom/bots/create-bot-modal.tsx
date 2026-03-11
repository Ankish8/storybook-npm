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
import type { CreateBotModalProps, BotType } from "./types";

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

export const CreateBotModal = React.forwardRef<
  HTMLDivElement,
  CreateBotModalProps
>(({ open, onOpenChange, onSubmit, className }, ref) => {
  const [name, setName] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<BotType>("chatbot");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit?.({ name: name.trim(), type: selectedType });
    setName("");
    setSelectedType("chatbot");
  };

  const handleClose = () => {
    setName("");
    setSelectedType("chatbot");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={ref} size="sm" className={cn("mx-4 sm:mx-auto", className)}>
        <DialogHeader>
          <DialogTitle>Create AI bot</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
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
                "w-full h-10 px-4 py-2.5 text-sm rounded border",
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
            <div className="flex flex-col gap-3 sm:flex-row">
              {BOT_TYPE_OPTIONS.map(({ id, label, description }) => {
                const isSelected = selectedType === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedType(id)}
                    className={cn(
                      "flex flex-row items-center gap-3 p-3 rounded-lg border text-left sm:flex-col sm:gap-2.5 sm:flex-1 sm:h-[134px] sm:justify-center",
                      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus",
                      isSelected
                        ? "bg-semantic-info-surface border-semantic-border-focus shadow-sm"
                        : "bg-semantic-bg-primary border-semantic-border-layout hover:bg-semantic-bg-hover"
                    )}
                    aria-pressed={isSelected}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-[34px] rounded-lg",
                        isSelected
                          ? "bg-semantic-bg-primary"
                          : "bg-semantic-info-surface"
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
              })}
            </div>

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
        <div className="flex flex-col-reverse gap-3 mt-2 sm:flex-row sm:justify-end sm:gap-4">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

CreateBotModal.displayName = "CreateBotModal";
