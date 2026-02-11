import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../ui/dialog";
import { PaymentOptionCard } from "./payment-option-card";
import type { PaymentOptionCardModalProps } from "./types";

/**
 * PaymentOptionCardModal wraps the PaymentOptionCard in a centered Dialog overlay.
 * Use this when you want to show payment method selection as a modal popup rather
 * than an inline card.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <PaymentOptionCardModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   options={paymentOptions}
 *   onOptionSelect={(id) => console.log(id)}
 *   onCtaClick={() => { handlePayment(); setOpen(false); }}
 * />
 * ```
 */
export const PaymentOptionCardModal = React.forwardRef<
  HTMLDivElement,
  PaymentOptionCardModalProps
>(
  (
    {
      open,
      onOpenChange,
      title,
      subtitle,
      options,
      selectedOptionId,
      defaultSelectedOptionId,
      onOptionSelect,
      ctaText,
      onCtaClick,
      loading,
      disabled,
      className,
    },
    ref
  ) => {
    const handleClose = () => {
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="sm"
          hideCloseButton
          className="p-0 border-0 bg-transparent shadow-none"
        >
          {/* Visually hidden title for accessibility */}
          <DialogTitle className="sr-only">
            {title || "Select payment method"}
          </DialogTitle>
          <PaymentOptionCard
            title={title}
            subtitle={subtitle}
            options={options}
            selectedOptionId={selectedOptionId}
            defaultSelectedOptionId={defaultSelectedOptionId}
            onOptionSelect={onOptionSelect}
            ctaText={ctaText}
            onCtaClick={onCtaClick}
            onClose={handleClose}
            loading={loading}
            disabled={disabled}
            className={className}
          />
        </DialogContent>
      </Dialog>
    );
  }
);

PaymentOptionCardModal.displayName = "PaymentOptionCardModal";
