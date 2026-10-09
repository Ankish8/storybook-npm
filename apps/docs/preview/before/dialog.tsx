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
        "fixed inset-0 z-[9999] bg-black/50 overscroll-contain data-[state=open]:motion-safe:[animation-duration:160ms] data-[state=closed]:motion-safe:[animation-duration:120ms] [animation-timing-function:var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_100ms_ease-in] data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:fade-out-0 data-[state=open]:motion-safe:fade-in-0",
        className
      )}
      {...props}
    />
  )
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-[9999] flex flex-col [translate:-50%_-50%] gap-0 border-[1.2px] border-solid border-semantic-border-layout bg-semantic-bg-primary p-0 text-[var(--v2-text-secondary,#5E5E5E)] font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal shadow-[0_20px_24px_-4px_rgba(10,13,18,0.08),0_8px_8px_-4px_rgba(10,13,18,0.03),0_3px_3px_-1.5px_rgba(10,13,18,0.04)] data-[state=open]:motion-safe:[animation-duration:220ms] data-[state=closed]:motion-safe:[animation-duration:160ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] data-[state=closed]:[animation-timing-function:var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_100ms_ease-in] max-h-[calc(100vh-2rem)] overflow-y-auto overscroll-contain data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:fade-out-0 data-[state=open]:motion-safe:fade-in-0 data-[state=closed]:motion-safe:zoom-out-[0.98] data-[state=open]:motion-safe:zoom-in-[0.98] data-[state=closed]:motion-safe:[--tw-exit-translate-y:4px] data-[state=open]:motion-safe:[--tw-enter-translate-y:4px] rounded-xl",
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
            // Last in the DOM so Tab order and initial focus are unchanged, but ordered first and sticky so
            // it stays pinned beside the sticky header while a tall body scrolls (net layout height is 0:
            // mt-6 + size-6 - mb-12). The 24px control gets a 32px hit area from the ::before inset.
            <DialogPrimitive.Close className="sticky top-6 z-20 order-first -mb-12 mr-6 mt-6 flex size-6 shrink-0 items-center justify-center self-end rounded-md text-[var(--v2-text-muted,#707070)] transition-colors before:absolute before:-inset-1 before:content-[''] [@media(hover:hover)]:hover:bg-semantic-bg-ui [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-primary,#343E55)] disabled:pointer-events-none">
              <X className="size-4" />
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
      // Sticky inside the dialog's own scroll area (no wrapper); opaque so scrolled content passes beneath.
      "sticky top-0 z-10 flex flex-col gap-4 border-b border-solid border-semantic-border-layout bg-semantic-bg-primary p-6 text-left",
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
      // Pinned to the bottom of the scroll area. The ::before is the divider plus 16px of breathing room
      // above the buttons. With scroll-state queries (Chrome 133+) it shows only while the footer is stuck,
      // that is while content is hidden beneath it; elsewhere it falls back to an always-visible 1px divider.
      "sticky bottom-0 z-10 bg-semantic-bg-primary [container-type:scroll-state]",
      "before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-px before:bg-[linear-gradient(var(--semantic-border-layout,#E9EAEB)_0_1px,var(--semantic-bg-primary,#FFF)_1px)] before:content-[''] before:transition-opacity before:[transition-duration:150ms]",
      "[@supports(container-type:scroll-state)]:before:h-[17px] [@supports(container-type:scroll-state)]:before:opacity-0 [@supports(container-type:scroll-state)]:[@container_scroll-state(stuck:bottom)]:before:opacity-100",
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
        "m-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-medium leading-normal text-[var(--v2-text-primary,#484848)]",
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
        "m-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs text-[var(--v2-text-muted,#707070)]",
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
