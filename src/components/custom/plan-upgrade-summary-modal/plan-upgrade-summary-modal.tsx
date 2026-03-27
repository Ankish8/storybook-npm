import * as React from "react";
import { cva } from "class-variance-authority";
import { AlertCircle, CircleCheck, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../../ui/dialog";
import type {
  PlanUpgradeSummaryModalProps,
  PlanUpgradeSummaryMode,
  PlanUpgradeSummaryRow,
  PlanUpgradeSummaryStatus,
  PlanUpgradeSummaryTone,
} from "./types";

const modalRootVariants = cva(
  "flex max-h-[min(90vh,calc(100dvh-2rem))] flex-col gap-4 overflow-y-auto rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-4 sm:gap-6 sm:p-6 md:gap-8 md:p-9"
);

const summaryPanelVariants = cva(
  "flex flex-col gap-4 rounded border border-solid border-semantic-border-layout bg-semantic-bg-ui p-3 sm:gap-5 sm:p-4"
);

const statusTitleVariants = cva("m-0 text-sm font-semibold leading-5 tracking-[0.014px]", {
  variants: {
    tone: {
      warning: "text-semantic-warning-text",
      success: "text-semantic-success-text",
    },
  },
  defaultVariants: {
    tone: "warning",
  },
});

const statusMessageVariants = cva("m-0 text-xs leading-normal", {
  variants: {
    tone: {
      warning: "text-semantic-warning-text",
      success: "text-semantic-success-text",
    },
  },
  defaultVariants: {
    tone: "warning",
  },
});

const defaultRowsByMode: Record<PlanUpgradeSummaryMode, PlanUpgradeSummaryRow[]> = {
  upgrade: [
    { label: "Prepaid amount", value: "(₹ 47,229.20)" },
    { label: "Difference in rental", value: "₹ 150,000.00" },
    { label: "Total", value: "₹ 102,770.80" },
    { label: "Taxes", value: "₹ 18,498.74" },
  ],
  downgrade: [
    { label: "Prepaid amount", value: "(₹ 581.48)" },
    { label: "Difference in rental", value: "₹ -120,000.00" },
    { label: "Total", value: "₹ -120,581.48" },
    { label: "Taxes", value: "₹ 0.00" },
  ],
};

const defaultStatusByMode: Record<PlanUpgradeSummaryMode, PlanUpgradeSummaryStatus> = {
  upgrade: {
    title: "Payable Amount",
    message: "A payment of ₹ 59,437.44 is required to upgrade.",
    tone: "warning",
  },
  downgrade: {
    title: "Adjustable Credit",
    tone: "success",
  },
};

const defaultTitleByMode: Record<PlanUpgradeSummaryMode, string> = {
  upgrade: "Plan upgrade, SUV ₹ 15,000.00/month",
  downgrade: "Plan downgrade, SUV ₹ 15,000.00/month",
};

const defaultPrimaryActionLabelByMode: Record<PlanUpgradeSummaryMode, string> = {
  upgrade: "Pay & Upgrade Plan",
  downgrade: "Downgrade Plan",
};

const defaultTotalValueByMode: Record<PlanUpgradeSummaryMode, string> = {
  upgrade: "₹ 59,437.44",
  downgrade: "₹ -120,581.48",
};

const defaultDescription =
  "Your request will be processed from the current billing cycle.";

const getStatusIcon = (tone: PlanUpgradeSummaryTone) => {
  if (tone === "success") {
    return <CircleCheck className="size-6 text-semantic-success-text" aria-hidden="true" />;
  }

  return <AlertCircle className="size-6 text-semantic-warning-text" aria-hidden="true" />;
};

const PlanUpgradeSummaryModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      mode = "upgrade",
      title,
      description = defaultDescription,
      status,
      rows,
      totalLabel = "Total amount due",
      totalValue,
      cancelLabel = "Cancel",
      primaryActionLabel,
      onPrimaryAction,
      loading = false,
      disabled = false,
      onCancel,
      onClose,
      closeAriaLabel = "Close plan summary modal",
      className,
      ...props
    }: PlanUpgradeSummaryModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const resolvedStatus = status ?? defaultStatusByMode[mode];
    const resolvedTone = resolvedStatus.tone ?? defaultStatusByMode[mode].tone ?? "warning";
    const resolvedRows = rows ?? defaultRowsByMode[mode];
    const resolvedTitle = title ?? defaultTitleByMode[mode];
    const resolvedTotalValue = totalValue ?? defaultTotalValueByMode[mode];
    const resolvedPrimaryActionLabel =
      primaryActionLabel ?? defaultPrimaryActionLabelByMode[mode];

    const handleClose = () => {
      onClose?.();
      onOpenChange(false);
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          size="default"
          hideCloseButton
          className="min-w-0 w-full max-w-[min(41.25rem,calc(100vw-2rem))] border-none bg-transparent p-0 shadow-none"
        >
          <div ref={ref} className={cn(modalRootVariants(), className)} {...props}>
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <DialogTitle className="m-0 text-base font-semibold leading-normal text-semantic-text-primary sm:text-lg">
                  {resolvedTitle}
                </DialogTitle>
                <DialogDescription className="m-0 text-sm tracking-[0.035px] text-semantic-text-muted">
                  {description}
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 text-semantic-text-muted transition-colors hover:text-semantic-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus focus-visible:ring-offset-2"
                aria-label={closeAriaLabel}
              >
                <X className="size-6" />
              </button>
            </div>

            <div className={summaryPanelVariants()}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <span className="shrink-0">{getStatusIcon(resolvedTone)}</span>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className={statusTitleVariants({ tone: resolvedTone })}>
                    {resolvedStatus.title}
                  </p>
                  {resolvedStatus.message ? (
                    <p className={statusMessageVariants({ tone: resolvedTone })}>
                      {resolvedStatus.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {resolvedRows.map((row) => (
                  <div
                    key={`${row.label}-${row.value}`}
                    className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <span className="min-w-0 text-sm tracking-[0.035px] text-semantic-text-secondary">
                      {row.label}
                    </span>
                    <span className="min-w-0 shrink-0 text-left text-sm tracking-[0.035px] text-semantic-text-primary sm:text-right">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1 border-t border-solid border-semantic-border-layout pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <span className="text-sm font-semibold tracking-[0.014px] text-semantic-text-secondary">
                  {totalLabel}
                </span>
                <span className="text-sm font-semibold tracking-[0.014px] text-semantic-text-primary sm:text-right">
                  {resolvedTotalValue}
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2.5">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                {cancelLabel}
              </Button>
              <Button
                variant="primary"
                onClick={onPrimaryAction}
                loading={loading}
                disabled={disabled}
                className="w-full sm:w-auto"
              >
                {resolvedPrimaryActionLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

PlanUpgradeSummaryModal.displayName = "PlanUpgradeSummaryModal";

export { PlanUpgradeSummaryModal, modalRootVariants, summaryPanelVariants };
