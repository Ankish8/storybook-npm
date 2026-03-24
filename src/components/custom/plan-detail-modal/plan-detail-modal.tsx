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
          className="p-0 gap-0 overflow-hidden"
        >
          <div
            ref={ref}
            className={cn("flex flex-col", className)}
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-semantic-border-layout">
              <DialogTitle className="text-lg font-semibold text-semantic-text-primary leading-none m-0">
                {title}
              </DialogTitle>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="flex items-center justify-center size-6 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <DialogDescription asChild>
              <div className="flex flex-col gap-2.5 px-8 py-5 overflow-y-auto max-h-[70vh]">
                <p className="m-0 text-base font-semibold text-semantic-text-primary leading-none">
                  Features
                </p>
                <div className="w-full overflow-x-auto rounded border border-semantic-border-layout">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-semantic-bg-ui">
                        <th className="px-3 py-[11px] text-left font-semibold text-semantic-text-primary border-b border-semantic-border-layout w-[44%]">
                          Feature
                        </th>
                        <th className="px-3 py-[11px] text-left font-semibold text-semantic-text-primary border-b border-semantic-border-layout w-[28%]">
                          Free
                        </th>
                        <th className="px-3 py-[11px] text-left font-semibold text-semantic-text-primary border-b border-semantic-border-layout w-[28%]">
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
                          <td className="px-3 py-[11px] text-semantic-text-secondary border-b border-semantic-border-layout">
                            <p className="m-0 leading-none">{feature.name}</p>
                          </td>
                          <td className="px-3 py-[11px] text-semantic-text-secondary border-b border-semantic-border-layout">
                            <p className="m-0 leading-none">{feature.free}</p>
                          </td>
                          <td className="px-3 py-[11px] text-semantic-text-secondary border-b border-semantic-border-layout">
                            <p className="m-0 leading-none">{feature.rate}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </DialogDescription>

            {/* Footer */}
            {planPrice && (
              <div className="flex items-center px-8 py-4 border-t border-semantic-border-layout">
                <p className="m-0 text-base text-semantic-text-primary">
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
