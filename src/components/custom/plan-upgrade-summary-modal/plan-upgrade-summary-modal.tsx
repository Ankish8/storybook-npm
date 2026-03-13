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
  "flex flex-col gap-8 rounded-lg border border-semantic-border-layout bg-semantic-bg-primary p-9"
);

const summaryPanelVariants = cva(
  "flex flex-col gap-5 rounded border border-semantic-border-layout bg-semantic-bg-ui p-4"
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

const PlanUpgradeSummaryModal = React.forwardRef<
  HTMLDivElement,
  PlanUpgradeSummaryModalProps
>(
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
    },
    ref
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
          className="w-full max-w-[660px] border-none bg-transparent p-0 shadow-none"
        >
          <div ref={ref} className={cn(modalRootVariants(), className)} {...props}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <DialogTitle className="m-0 text-lg font-semibold leading-normal text-semantic-text-primary">
                  {resolvedTitle}
                </DialogTitle>
                <DialogDescription className="m-0 text-sm tracking-[0.035px] text-semantic-text-muted">
                  {description}
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 text-semantic-text-muted transition-colors hover:text-semantic-text-primary"
                aria-label={closeAriaLabel}
              >
                <X className="size-6" />
              </button>
            </div>

            <div className={summaryPanelVariants()}>
              <div className="flex items-start gap-4">
                <span className="shrink-0">{getStatusIcon(resolvedTone)}</span>
                <div className="flex flex-col gap-1">
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
                    className="flex items-center justify-between gap-6"
                  >
                    <span className="text-sm tracking-[0.035px] text-semantic-text-secondary">
                      {row.label}
                    </span>
                    <span className="text-sm tracking-[0.035px] text-semantic-text-primary">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-6 border-t border-semantic-border-layout pt-3">
                <span className="text-sm font-semibold tracking-[0.014px] text-semantic-text-secondary">
                  {totalLabel}
                </span>
                <span className="text-sm font-semibold tracking-[0.014px] text-semantic-text-primary">
                  {resolvedTotalValue}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <Button variant="outline" onClick={handleCancel}>
                {cancelLabel}
              </Button>
              <Button variant="primary" onClick={onPrimaryAction} loading={loading} disabled={disabled}>
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
