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
        size="sm"
        hideCloseButton
        className={cn("!p-0 !gap-0", className)}
      >
        <div className="flex flex-col items-center gap-6 px-[60px] py-10 text-center">
          {/* Icon + Text section */}
          <div className="flex flex-col items-center gap-[18px]">
            {icon ?? <MyOperatorChatIcon />}
            <div className="flex flex-col gap-1">
              <DialogTitle className="m-0 text-base font-semibold text-semantic-text-primary">
                {title}
              </DialogTitle>
              <DialogDescription className="m-0 text-sm tracking-[0.035px] text-semantic-text-muted">
                {description}
              </DialogDescription>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleSecondaryAction}>
              {secondaryActionLabel}
            </Button>
            <Button onClick={onPrimaryAction}>{primaryActionLabel}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

TalkToUsModal.displayName = "TalkToUsModal";

export { TalkToUsModal };
