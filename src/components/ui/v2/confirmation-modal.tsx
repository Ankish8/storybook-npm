import * as React from "react";
import { Info, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "./dialog";
import { Button } from "./button";

/**
 * Props for the ConfirmationModal component
 */
export interface ConfirmationModalProps {
  /** Controls modal visibility (controlled mode) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Modal title */
  title: React.ReactNode;
  /** Modal description/message */
  description?: React.ReactNode;
  /** Visual style of confirm button */
  variant?: "default" | "destructive";
  /** Called when user confirms */
  onConfirm?: () => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Loading state for confirm button */
  loading?: boolean;
  /** Text for confirm button (default: "Yes") */
  confirmButtonText?: string;
  /** Text for cancel button (default: "Cancel") */
  cancelButtonText?: string;
  /** Trigger element for uncontrolled usage */
  trigger?: React.ReactNode;
  /** Additional className for the dialog content */
  className?: string;
}

/**
 * A simple confirmation modal for yes/no decisions.
 *
 * @example
 * ```tsx
 * // Controlled usage
 * <ConfirmationModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Disable Webhook"
 *   description="Are you sure you want to disable this webhook?"
 *   onConfirm={handleDisable}
 * />
 *
 * // Destructive variant
 * <ConfirmationModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Archive Project"
 *   variant="destructive"
 *   confirmButtonText="Archive"
 *   onConfirm={handleArchive}
 * />
 * ```
 */
const ConfirmationModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      variant = "default",
      onConfirm,
      onCancel,
      loading = false,
      confirmButtonText = "Yes",
      cancelButtonText = "Cancel",
      trigger,
      className,
    }: ConfirmationModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const handleConfirm = () => {
      onConfirm?.();
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange?.(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent
          ref={ref}
          size="sm"
          hideCloseButton
          className={cn("gap-0 overflow-hidden p-0", className)}
        >
          <DialogHeader className="flex-row items-center gap-3 border-b border-solid border-semantic-border-layout p-4 text-left">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center",
                variant === "destructive"
                  ? "text-semantic-error-primary"
                  : "text-semantic-info-primary"
              )}
            >
              {variant === "destructive" ? (
                <TriangleAlert className="size-[18px]" aria-hidden />
              ) : (
                <Info className="size-[18px]" aria-hidden />
              )}
            </span>
            <DialogTitle className="min-w-0 flex-1">{title}</DialogTitle>
            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close"
                className="flex size-6 shrink-0 items-center justify-center rounded-md text-[var(--v2-text-muted,#707070)] transition-colors hover:bg-semantic-bg-ui hover:text-[var(--v2-text-primary,#484848)] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary"
              >
                <X className="size-3" aria-hidden />
              </button>
            </DialogClose>
          </DialogHeader>
          <div className={description ? "px-4 py-3" : "sr-only"}>
            <DialogDescription
              className={
                description
                  ? "text-sm text-[var(--v2-text-secondary,#5E5E5E)]"
                  : "sr-only"
              }
            >
              {description || "Confirmation dialog"}
            </DialogDescription>
          </div>
          <DialogFooter className="gap-2 px-4 pb-4 pt-3 sm:space-x-0 [&>button]:flex-1">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              {cancelButtonText}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
              disabled={loading}
              loading={loading}
            >
              {confirmButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
ConfirmationModal.displayName = "ConfirmationModal";

export { ConfirmationModal };
