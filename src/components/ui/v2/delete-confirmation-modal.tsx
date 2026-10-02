import * as React from "react";
import { Trash2, X } from "lucide-react";

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
const DeleteConfirmationModal = React.forwardRef(
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
    }: DeleteConfirmationModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const inputId = React.useId();
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
        <DialogContent
          ref={ref}
          size="sm"
          hideCloseButton
          className={cn("gap-0 overflow-hidden p-0", className)}
        >
          <DialogHeader className="flex-row items-center gap-4 border-b border-solid border-semantic-border-layout p-6 text-left">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-semantic-error-surface text-semantic-error-primary">
              <Trash2 className="size-[18px]" aria-hidden />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <DialogTitle>{title || defaultTitle}</DialogTitle>
              <DialogDescription
                className={description ? undefined : "sr-only"}
              >
                {description ||
                  "Delete confirmation dialog - this action cannot be undone"}
              </DialogDescription>
            </div>
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
          <div className="flex flex-col gap-1 px-6 py-0">
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-[var(--v2-text-secondary,#5E5E5E)]"
            >
              Enter "{confirmText}" in uppercase to confirm
            </label>
            <Input
              id={inputId}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmText}
              autoComplete="off"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 px-4 pb-4 sm:space-x-0">
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
