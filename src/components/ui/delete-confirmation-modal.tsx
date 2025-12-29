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
import { Input } from "./input";

/**
 * Props for the DeleteConfirmationModal component
 */
export interface DeleteConfirmationModalProps {
  /** Controls modal visibility (controlled mode) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** The name of the item being deleted (shown in title) */
  itemName?: string;
  /** Custom title (overrides default) */
  title?: React.ReactNode;
  /** Additional description text */
  description?: React.ReactNode;
  /** Text user must type to confirm (default: "DELETE") */
  confirmText?: string;
  /** Called when user confirms deletion */
  onConfirm?: () => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Loading state for delete button */
  loading?: boolean;
  /** Text for delete button (default: "Delete") */
  deleteButtonText?: string;
  /** Text for cancel button (default: "Cancel") */
  cancelButtonText?: string;
  /** Trigger element for uncontrolled usage */
  trigger?: React.ReactNode;
  /** Additional className for the dialog content */
  className?: string;
}

/**
 * A confirmation modal that requires the user to type a specific text to confirm deletion.
 *
 * @example
 * ```tsx
 * // Controlled usage
 * <DeleteConfirmationModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   itemName="webhook"
 *   onConfirm={handleDelete}
 * />
 *
 * // Uncontrolled with trigger
 * <DeleteConfirmationModal
 *   trigger={<Button variant="destructive">Delete</Button>}
 *   itemName="user"
 *   onConfirm={handleDelete}
 * />
 * ```
 */
const DeleteConfirmationModal = React.forwardRef<
  HTMLDivElement,
  DeleteConfirmationModalProps
>(
  (
    {
      open,
      onOpenChange,
      itemName = "item",
      title,
      description,
      confirmText = "DELETE",
      onConfirm,
      onCancel,
      loading = false,
      deleteButtonText = "Delete",
      cancelButtonText = "Cancel",
      trigger,
      className,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const isConfirmEnabled = inputValue === confirmText;

    // Reset input when modal closes
    React.useEffect(() => {
      if (!open) {
        setInputValue("");
      }
    }, [open]);

    const handleConfirm = () => {
      if (isConfirmEnabled) {
        onConfirm?.();
      }
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange?.(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
      if (!newOpen) {
        setInputValue("");
      }
      onOpenChange?.(newOpen);
    };

    const defaultTitle = `Are you sure you want to delete this ${itemName}?`;

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent ref={ref} size="sm" className={cn(className)}>
          <DialogHeader>
            <DialogTitle>{title || defaultTitle}</DialogTitle>
            <DialogDescription className={description ? undefined : "sr-only"}>
              {description ||
                "Delete confirmation dialog - this action cannot be undone"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <label
              htmlFor="delete-confirmation-input"
              className="text-sm text-muted-foreground"
            >
              Enter "{confirmText}" in uppercase to confirm
            </label>
            <Input
              id="delete-confirmation-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmText}
              autoComplete="off"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              {cancelButtonText}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!isConfirmEnabled || loading}
              loading={loading}
            >
              {deleteButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
DeleteConfirmationModal.displayName = "DeleteConfirmationModal";

export { DeleteConfirmationModal };
