import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../../ui/dialog";
import type { PlanDetailModalProps, PlanFeature } from "./types";

const DEFAULT_FEATURES: PlanFeature[] = [
  { name: "WhatsApp Service", free: "0 Message(s)", rate: "₹ 0" },
  { name: "Incoming (Missed)", free: "0 Minute(s)", rate: "₹ 0" },
  { name: "WhatsApp Marketing", free: "0 Message(s)", rate: "₹ 0.86" },
  { name: "Fix did(s)", free: "0 DID(s)", rate: "₹ 200.00" },
  { name: "WhatsApp Utility", free: "0 Message(s)", rate: "₹ 0.13" },
  { name: "User(s)", free: "3 User(s)", rate: "₹ 150.00" },
  { name: "Pro license(s)", free: "3 License(s)", rate: "₹ 300.00" },
  { name: "WhatsApp Authentication", free: "0 Unit(s)", rate: "₹ 0.13" },
  { name: "Department(s)", free: "2 Department(s)", rate: "₹ 300.00" },
  { name: "Channel(s)", free: "1 Pair(s)", rate: "₹ 300.00" },
];

const PlanDetailModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      title = "Plan detail",
      features = DEFAULT_FEATURES,
      planPrice,
      onClose,
      className,
      ...props
    }: PlanDetailModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const handleClose = () => {
      onClose?.();
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          size="lg"
          hideCloseButton
          className={cn(
            "flex max-h-[min(90vh,calc(100dvh-2rem))] min-w-0 flex-col gap-0 overflow-hidden rounded-xl",
            "w-full max-w-[min(42rem,calc(100vw-2rem))] p-3 sm:p-4 md:p-6"
          )}
        >
          <DialogDescription className="sr-only">
            Plan features, free allowances, and rates for this subscription.
          </DialogDescription>
          <div
            ref={ref}
            className={cn("flex min-h-0 flex-1 flex-col", className)}
            {...props}
          >
            {/* Header — matches other custom modals (e.g. plan-upgrade-summary) */}
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-solid border-semantic-border-layout pb-3 sm:gap-4 sm:pb-4">
              <DialogTitle className="m-0 min-w-0 flex-1 pr-2 text-base font-semibold leading-normal text-semantic-text-primary sm:text-lg">
                {title}
              </DialogTitle>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="shrink-0 text-semantic-text-muted transition-colors hover:text-semantic-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus focus-visible:ring-offset-2"
              >
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>

            {/* Features label fixed; only the table region scrolls */}
            <div className="flex min-h-0 flex-1 flex-col gap-2 pt-3 sm:gap-2.5 sm:pt-4">
              <p className="m-0 shrink-0 text-sm font-semibold leading-none text-semantic-text-primary sm:text-base">
                Features
              </p>
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto rounded border border-solid border-semantic-border-layout">
                <table className="w-full min-w-0 border-collapse text-sm">
                  <thead>
                    <tr className="bg-semantic-bg-ui">
                      <th className="w-[40%] px-2 py-2 text-left text-xs font-semibold text-semantic-text-primary border-b border-solid border-semantic-border-layout sm:w-[44%] sm:px-3 sm:py-[11px] sm:text-sm">
                        Feature
                      </th>
                      <th className="w-[30%] px-2 py-2 text-left text-xs font-semibold text-semantic-text-primary border-b border-solid border-semantic-border-layout sm:w-[28%] sm:px-3 sm:py-[11px] sm:text-sm">
                        Free
                      </th>
                      <th className="w-[30%] px-2 py-2 text-left text-xs font-semibold text-semantic-text-primary border-b border-solid border-semantic-border-layout sm:w-[28%] sm:px-3 sm:py-[11px] sm:text-sm">
                        Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr
                        key={feature.name}
                        className={cn(
                          index % 2 === 0
                            ? "bg-semantic-bg-primary"
                            : "bg-semantic-bg-ui"
                        )}
                      >
                        <td className="px-2 py-2 text-xs text-semantic-text-secondary border-b border-solid border-semantic-border-layout sm:px-3 sm:py-[11px] sm:text-sm">
                          <p className="m-0 leading-snug sm:leading-none">{feature.name}</p>
                        </td>
                        <td className="px-2 py-2 text-xs text-semantic-text-secondary border-b border-solid border-semantic-border-layout sm:px-3 sm:py-[11px] sm:text-sm">
                          <p className="m-0 leading-snug sm:leading-none">{feature.free}</p>
                        </td>
                        <td className="px-2 py-2 text-xs text-semantic-text-secondary border-b border-solid border-semantic-border-layout sm:px-3 sm:py-[11px] sm:text-sm">
                          <p className="m-0 leading-snug sm:leading-none">{feature.rate}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            {planPrice && (
              <div
                className={cn(
                  "flex shrink-0 items-center border-t border-solid border-semantic-border-layout pt-3 sm:pt-4"
                )}
              >
                <p className="m-0 text-sm text-semantic-text-primary sm:text-base">
                  <span className="font-semibold">Plan price </span>
                  <span className="font-normal">{planPrice}</span>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

PlanDetailModal.displayName = "PlanDetailModal";

export { PlanDetailModal };
