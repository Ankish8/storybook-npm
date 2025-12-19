import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
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
const ConfirmationModal = React.forwardRef<
  HTMLDivElement,
  ConfirmationModalProps
>(
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
    },
    ref
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
        <DialogContent ref={ref} size="sm" className={cn(className)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
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
