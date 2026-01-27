import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Button } from "./button";

/**
 * Props for the FormModal component
 */
export interface FormModalProps {
  /** Controls modal visibility (controlled mode) */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Modal title */
  title: React.ReactNode;
  /** Optional modal description */
  description?: React.ReactNode;
  /** Form content (inputs, selects, etc.) */
  children: React.ReactNode;
  /** Called when user saves/submits the form */
  onSave?: () => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Loading state for save button */
  loading?: boolean;
  /** Text for save button (default: "Save") */
  saveButtonText?: string;
  /** Text for cancel button (default: "Cancel") */
  cancelButtonText?: string;
  /** Disable the save button */
  disableSave?: boolean;
  /** Additional className for the dialog content */
  className?: string;
  /** Size of the dialog */
  size?: "sm" | "default" | "lg" | "xl" | "full";
}

/**
 * A reusable modal component for forms with inputs, selects, and other form controls.
 * Provides consistent layout and spacing for form-based dialogs.
 *
 * @example
 * Basic usage with form fields
 *
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const [name, setName] = useState('');
 *
 * <FormModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Edit Profile"
 *   description="Make changes to your profile here."
 *   onSave={handleSave}
 *   loading={loading}
 * >
 *   <div className="grid gap-2">
 *     <label htmlFor="name">Name</label>
 *     <Input id="name" value={name} onChange={e => setName(e.target.value)} />
 *   </div>
 * </FormModal>
 * ```
 */
const FormModal = React.forwardRef<HTMLDivElement, FormModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      onSave,
      onCancel,
      loading = false,
      saveButtonText = "Save",
      cancelButtonText = "Cancel",
      disableSave = false,
      className,
      size = "sm",
    },
    ref
  ) => {
    const handleSave = () => {
      onSave?.();
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange?.(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} size={size} className={cn(className)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          {/* Form content with consistent spacing */}
          <div className="grid gap-4 py-4">{children}</div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelButtonText}
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={loading || disableSave}
              loading={loading}
            >
              {saveButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
FormModal.displayName = "FormModal";

export { FormModal };
