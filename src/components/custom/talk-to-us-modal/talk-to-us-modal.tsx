import * as React from "react";
import { cn } from "../../../lib/utils";
import { MyOperatorChatIcon } from "./icon";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import type { TalkToUsModalProps } from "./types";

/**
 * TalkToUsModal is a dialog that prompts users to contact support.
 * Features a centered icon, heading, description, and two action buttons
 * (cancel + primary CTA).
 *
 * Used on the pricing page when a power-up or plan requires sales contact.
 * Typically triggered by the PowerUpCard's "Talk to us" button.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <PowerUpCard onCtaClick={() => setOpen(true)} ... />
 * <TalkToUsModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   onPrimaryAction={() => window.open("mailto:support@myoperator.com")}
 * />
 * ```
 */
const TalkToUsModal: React.FC<TalkToUsModalProps> = ({
  open,
  onOpenChange,
  title = "Let's Talk!",
  description = "Please contact our team for more details. We're here to help you choose the right plan.",
  icon,
  primaryActionLabel = "Contact support",
  primaryActionLoading = false,
  secondaryActionLabel = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  className,
}) => {
  const handleSecondaryAction = () => {
    onSecondaryAction?.();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className={cn(
          "w-[423px] max-w-[423px] rounded-[6px] border-0 p-0 gap-0",
          className
        )}
      >
        <div className="flex flex-col items-center gap-[24px] px-[60px] py-[40px] text-center">
          {/* Icon + Text section */}
          <div className="flex w-[303px] flex-col items-center gap-[18px]">
            {icon ?? <MyOperatorChatIcon />}
            <div className="flex flex-col gap-[4px]">
              <DialogTitle className="m-0 text-[16px] font-semibold leading-none text-semantic-text-primary">
                {title}
              </DialogTitle>
              <DialogDescription className="m-0 text-[14px] leading-normal tracking-[0.035px] text-semantic-text-muted">
                {description}
              </DialogDescription>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-start justify-center gap-[16px]">
            <Button
              variant="outline"
              className="rounded-[4px] px-[24px] py-[10px]"
              onClick={handleSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
            <Button
              className="rounded-[4px] px-[24px] py-[10px]"
              loading={primaryActionLoading}
              onClick={onPrimaryAction}
            >
              {primaryActionLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

TalkToUsModal.displayName = "TalkToUsModal";

export { TalkToUsModal };
