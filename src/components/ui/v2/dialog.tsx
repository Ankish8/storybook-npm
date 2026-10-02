import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    ref: React.Ref<React.ElementRef<typeof DialogPrimitive.Overlay>>
  ) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-[9999] bg-black/50 overscroll-contain data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-[9999] flex flex-col translate-x-[-50%] translate-y-[-50%] gap-0 border-[1.2px] border-solid border-semantic-border-layout bg-semantic-bg-primary p-0 font-[family-name:var(--font-v2,Inter,sans-serif)] shadow-[0_20px_24px_-4px_rgba(10,13,18,0.08),0_8px_8px_-4px_rgba(10,13,18,0.03),0_3px_3px_-1.5px_rgba(10,13,18,0.04)] duration-200 max-h-[calc(100vh-2rem)] overflow-y-auto overscroll-contain data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl",
  {
    variants: {
      size: {
        sm: "w-[calc(100%-2rem)] max-w-sm",
        default: "w-[calc(100%-2rem)] max-w-lg",
        lg: "w-[calc(100%-2rem)] max-w-2xl",
        xl: "w-[calc(100%-2rem)] max-w-4xl",
        full: "w-[calc(100%-2rem)] h-[calc(100%-2rem)] max-w-none",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface DialogContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  /** Hide the default close button in the top-right corner */
  hideCloseButton?: boolean;
}

// Helper to check if children contain DialogDescription
const hasDialogDescription = (children: React.ReactNode): boolean => {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === DialogDescription) {
        found = true;
      } else {
        const childProps = child.props as { children?: React.ReactNode };
        if (childProps.children) {
          if (hasDialogDescription(childProps.children)) {
            found = true;
          }
        }
      }
    }
  });
  return found;
};

const DialogContent = React.forwardRef(
  (
    {
      className,
      children,
      size,
      hideCloseButton = false,
      ...props
    }: DialogContentProps,
    ref: React.Ref<React.ElementRef<typeof DialogPrimitive.Content>>
  ) => {
    const hasDescription = hasDialogDescription(children);

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(dialogContentVariants({ size }), className)}
          {...props}
        >
          {children}
          {/* Accessibility: Add hidden description if none provided */}
          {!hasDescription && (
            <DialogPrimitive.Description className="sr-only m-0">
              Dialog content
            </DialogPrimitive.Description>
          )}
          {!hideCloseButton && (
            <DialogPrimitive.Close className="absolute right-6 top-6 flex size-6 items-center justify-center rounded-md text-semantic-text-muted transition-colors hover:bg-semantic-bg-ui hover:text-semantic-text-primary focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-primary,#343E55)] disabled:pointer-events-none">
              <X className="size-3" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-4 border-b border-solid border-semantic-border-layout p-6 text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 px-6 pb-6 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>,
    ref: React.Ref<React.ElementRef<typeof DialogPrimitive.Title>>
  ) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "m-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-medium leading-normal text-semantic-text-primary",
        className
      )}
      {...props}
    />
  )
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>,
    ref: React.Ref<React.ElementRef<typeof DialogPrimitive.Description>>
  ) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        "m-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs text-semantic-text-muted",
        className
      )}
      {...props}
    />
  )
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  dialogContentVariants,
};
