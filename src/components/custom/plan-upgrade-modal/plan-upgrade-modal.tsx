import * as React from "react";
import { cva } from "class-variance-authority";
import { CalendarDays, Clock3, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../../ui/dialog";
import type { BillingCycleOption, PlanUpgradeModalProps } from "./types";

const modalRootVariants = cva(
  "flex flex-col gap-6 rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-9"
);

const billingCycleOptionVariants = cva(
  "flex w-full items-center gap-2.5 rounded-lg border border-solid bg-semantic-bg-primary p-3 text-left transition-colors",
  {
    variants: {
      selected: {
        true: "border-semantic-border-input-focus",
        false: "border-semantic-border-layout hover:border-semantic-border-input",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

const iconContainerVariants = cva(
  "flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-semantic-info-surface"
);

const defaultOptions: BillingCycleOption[] = [
  { id: "current-billing-cycle", label: "Current billing cycle", icon: "clock" },
  { id: "upcoming-billing-cycle", label: "Upcoming billing cycle", icon: "calendar" },
];

const renderOptionIcon = (icon: BillingCycleOption["icon"]) => {
  if (icon === "calendar") {
    return <CalendarDays className="size-5 text-semantic-text-secondary" aria-hidden="true" />;
  }
  if (icon === "clock" || icon === undefined) {
    return <Clock3 className="size-5 text-semantic-text-secondary" aria-hidden="true" />;
  }
  return icon;
};

const PlanUpgradeModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      title = "Plan upgrade, SUV ₹ 15,000.00/month",
      description = "Select how you want to apply your new plan.",
      options = defaultOptions,
      selectedOptionId,
      defaultSelectedOptionId,
      onOptionChange,
      nextLabel = "Next",
      onNext,
      loading = false,
      onClose,
      className,
      ...props
    }: PlanUpgradeModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const initialOptionId = defaultSelectedOptionId ?? options[0]?.id;
    const [internalSelectedOptionId, setInternalSelectedOptionId] = React.useState<
      string | undefined
    >(initialOptionId);
    const isControlled = selectedOptionId !== undefined;
    const activeOptionId = isControlled ? selectedOptionId : internalSelectedOptionId;

    React.useEffect(() => {
      if (!isControlled) {
        setInternalSelectedOptionId(initialOptionId);
      }
    }, [initialOptionId, isControlled]);

    const handleOptionSelect = (optionId: string) => {
      if (!isControlled) {
        setInternalSelectedOptionId(optionId);
      }
      onOptionChange?.(optionId);
    };

    const handleNext = () => {
      if (!activeOptionId) {
        return;
      }
      onNext?.(activeOptionId);
    };

    const handleClose = () => {
      onClose?.();
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          size="default"
          hideCloseButton
          className="w-full max-w-[480px] border-none bg-transparent p-0 shadow-none"
        >
          <div ref={ref} className={cn(modalRootVariants(), className)} {...props}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <DialogTitle className="m-0 text-lg font-semibold leading-normal text-semantic-text-primary">
                  {title}
                </DialogTitle>
                <DialogDescription className="m-0 text-sm tracking-[0.035px] text-semantic-text-muted">
                  {description}
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 text-semantic-text-muted transition-colors hover:text-semantic-text-primary"
                aria-label="Close plan upgrade modal"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {options.map((option) => {
                const isSelected = activeOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    className={cn(billingCycleOptionVariants({ selected: isSelected }))}
                    aria-pressed={isSelected}
                  >
                    <span className={iconContainerVariants()}>{renderOptionIcon(option.icon)}</span>
                    <span className="text-sm leading-normal tracking-[0.035px] text-semantic-text-primary">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button
                variant="default"
                onClick={handleNext}
                disabled={!activeOptionId}
                loading={loading}
                className="min-w-[95px]"
              >
                {nextLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

PlanUpgradeModal.displayName = "PlanUpgradeModal";

export { PlanUpgradeModal, billingCycleOptionVariants };
