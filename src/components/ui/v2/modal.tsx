import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";

/**
 * Modal: the one v2 modal. It replaces v1's `Dialog`, `FormModal`, `ConfirmationModal` and
 * `DeleteConfirmationModal`, and follows shadcn's dialog / alert dialog.
 *
 * Two ways to use it, built from the same parts:
 *
 * - `<Modal />` takes props and renders everything: title, description, icon, a body, and Cancel / confirm
 *   actions. It covers a plain yes/no, a destructive action, a type-to-confirm gate and a form.
 * - `ModalRoot`, `ModalContent`, `ModalHeader`, ... are the parts, for layouts of your own.
 *
 * The v1 names (`Dialog`, `DialogContent`, `FormModal`, `ConfirmationModal`, `DeleteConfirmationModal`, ...)
 * are still exported from this file so v1 code migrates by changing only its import path.
 */

/* -------------------------------------------------------------------------------------------------
 * Parts
 * -----------------------------------------------------------------------------------------------*/

const ModalRoot = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

/** Match the 44px fields and default Button treatment, including its 8px corners. */
const ACTION_CLASS = "h-11 rounded-lg px-4";

const ModalOverlay = React.forwardRef(
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
        "fixed inset-0 z-[9999] bg-black/[0.46] backdrop-blur-[7px] overscroll-contain data-[state=open]:motion-safe:[animation-duration:240ms] data-[state=closed]:motion-safe:[animation-duration:160ms] [animation-timing-function:var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] data-[state=closed]:[animation-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_100ms_ease-in] data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:fade-out-0 data-[state=open]:motion-safe:fade-in-0",
        className
      )}
      {...props}
    />
  )
);
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * The modal surface: 16px padding and gap, a 1px border and the floating shadow. `group/modal` lets the
 * parts inside read `data-layout` and `data-close`, which `ModalContent` sets. The inline previews in the
 * docs use this same string, so they cannot drift from the real modal.
 */
const modalSurfaceClass =
  "group/modal relative flex flex-col gap-4 overflow-x-hidden rounded-xl border border-solid border-semantic-border-layout bg-semantic-bg-primary p-4 text-sm leading-5 text-[var(--v2-text-secondary,#5E5E5E)] font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal shadow-[0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045)]";

const modalContentVariants = cva(
  [
    modalSurfaceClass,
    "fixed left-[50%] top-[50%] z-[9999] [translate:-50%_-50%] focus-visible:outline-none data-[state=open]:motion-safe:[animation-name:enter,v2-fade-in] data-[state=open]:motion-safe:[animation-duration:500ms,160ms] data-[state=open]:motion-safe:[animation-timing-function:linear(0.0000_0%,0.0288_4%,0.0974_8%,0.1860_12%,0.2816_16%,0.3764_20%,0.4656_24%,0.5468_28%,0.6189_32%,0.6819_36%,0.7361_40%,0.7822_44%,0.8210_48%,0.8535_52%,0.8806_56%,0.9029_60%,0.9213_64%,0.9364_68%,0.9487_72%,0.9587_76%,0.9668_80%,0.9734_84%,0.9787_88%,0.9830_92%,0.9864_96%,1_100%),var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] data-[state=closed]:motion-safe:[animation-duration:160ms] data-[state=closed]:[animation-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out] motion-reduce:data-[state=closed]:animate-[v2-fade-out_100ms_ease-in] max-h-[calc(100vh-2rem)] overflow-y-auto overscroll-contain data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:fade-out-0 data-[state=closed]:motion-safe:zoom-out-[0.98] data-[state=open]:motion-safe:zoom-in-[0.96] data-[state=closed]:motion-safe:[--tw-exit-translate-y:4px] data-[state=open]:motion-safe:[--tw-enter-translate-y:8px]",
  ],
  {
    variants: {
      size: {
        /** 320px, centred, with two equal-width actions: shadcn's `sm` alert dialog. */
        xs: "w-[calc(100%-2rem)] max-w-xs",
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

export interface ModalContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalContentVariants> {
  /** Hide the default close button in the top-right corner */
  hideCloseButton?: boolean;
}

// `ModalContent` adds a hidden description when none is found among its children, so the dialog always has one.
const hasModalDescription = (children: React.ReactNode): boolean => {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === ModalDescription) {
        found = true;
      } else {
        const childProps = child.props as { children?: React.ReactNode };
        if (childProps.children && hasModalDescription(childProps.children)) {
          found = true;
        }
      }
    }
  });
  return found;
};

const ModalContent = React.forwardRef(
  (
    {
      className,
      children,
      size,
      hideCloseButton = false,
      ...props
    }: ModalContentProps,
    ref: React.Ref<React.ElementRef<typeof DialogPrimitive.Content>>
  ) => {
    const hasDescription = hasModalDescription(children);
    const resolvedSize = size ?? "default";

    return (
      <ModalPortal>
        <ModalOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(modalContentVariants({ size }), className)}
          {...props}
          // `xs` stacks and centres its content; every other size puts the text beside the icon from `sm` up.
          data-size={resolvedSize}
          data-layout={resolvedSize === "xs" ? "stack" : "beside"}
          data-close={hideCloseButton ? undefined : "true"}
        >
          {children}
          {/* Accessibility: add a hidden description if none provided */}
          {!hasDescription && (
            <DialogPrimitive.Description className="sr-only m-0">
              Dialog content
            </DialogPrimitive.Description>
          )}
          {!hideCloseButton && (
            // Last in the DOM, so Tab order and initial focus are unchanged.
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-2 top-2"
              >
                <X strokeWidth={1.75} aria-hidden />
                <span className="sr-only">Close</span>
              </Button>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </ModalPortal>
    );
  }
);
ModalContent.displayName = DialogPrimitive.Content.displayName;

export interface ModalMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `destructive` tints the tile red */
  variant?: "default" | "destructive";
}

/** A 40px icon tile for the header, beside the title (above it for `size="xs"`). */
const ModalMedia = ({
  className,
  variant = "default",
  ...props
}: ModalMediaProps) => (
  <div
    data-slot="modal-media"
    className={cn(
      "mb-2 inline-flex size-10 items-center justify-center rounded-md [&_svg]:size-6 [&_svg]:shrink-0 sm:group-data-[layout=beside]/modal:row-span-2",
      variant === "destructive"
        ? "bg-semantic-error-surface text-semantic-error-primary"
        : "bg-semantic-bg-ui text-[var(--v2-text-primary,#484848)]",
      className
    )}
    {...props}
  />
);
ModalMedia.displayName = "ModalMedia";

const ModalHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const hasMedia = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === ModalMedia
  );
  return (
    <div
      data-slot="modal-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center group-data-[close=true]/modal:pr-8 sm:group-data-[layout=beside]/modal:place-items-start sm:group-data-[layout=beside]/modal:text-left",
        // With an icon: stacked it is three rows; beside, a two-column grid whose tile spans both text rows.
        hasMedia &&
          "grid-rows-[auto_auto_1fr] gap-x-4 sm:group-data-[layout=beside]/modal:grid-cols-[auto_1fr] sm:group-data-[layout=beside]/modal:grid-rows-[auto_1fr]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
ModalHeader.displayName = "ModalHeader";

/** The form / content area between the header and the footer. */
const ModalBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="modal-body"
    className={cn("grid gap-4", className)}
    {...props}
  />
);
ModalBody.displayName = "ModalBody";

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="modal-footer"
    className={cn(
      "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t border-solid border-semantic-border-layout bg-[color-mix(in_oklab,var(--semantic-bg-ui,#F5F5F5)_50%,transparent)] p-4 group-data-[layout=stack]/modal:grid group-data-[layout=stack]/modal:grid-cols-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef(
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
        "m-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-medium leading-6 text-[var(--v2-text-primary,#484848)]",
        className
      )}
      {...props}
    />
  )
);
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef(
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
        "m-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-balance text-sm leading-5 text-[var(--v2-text-secondary,#5E5E5E)] md:text-pretty",
        className
      )}
      {...props}
    />
  )
);
ModalDescription.displayName = DialogPrimitive.Description.displayName;

/** Cancel: closes the modal. An outline Button; pass `variant` to change it. */
const ModalCancel = React.forwardRef(
  (
    {
      className,
      variant = "outline",
      ...props
    }: React.ComponentProps<typeof Button>,
    ref: React.Ref<HTMLButtonElement>
  ) => (
    <DialogPrimitive.Close asChild>
      <Button
        ref={ref}
        variant={variant}
        className={cn(ACTION_CLASS, className)}
        {...props}
      />
    </DialogPrimitive.Close>
  )
);
ModalCancel.displayName = "ModalCancel";

/** The confirming action. It does not close the modal: your handler decides when. */
const ModalAction = React.forwardRef(
  (
    { className, ...props }: React.ComponentProps<typeof Button>,
    ref: React.Ref<HTMLButtonElement>
  ) => <Button ref={ref} className={cn(ACTION_CLASS, className)} {...props} />
);
ModalAction.displayName = "ModalAction";

/* -------------------------------------------------------------------------------------------------
 * <Modal />
 * -----------------------------------------------------------------------------------------------*/

/**
 * Props for the Modal component
 */
export interface ModalProps {
  /** Controls modal visibility (controlled mode) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Modal title */
  title: React.ReactNode;
  /** Modal description/message */
  description?: React.ReactNode;
  /** Form content or any body shown between the description and the actions */
  children?: React.ReactNode;
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
  /** Disable the confirm button, e.g. while a form is invalid */
  confirmDisabled?: boolean;
  /**
   * Replaces the Cancel and confirm actions. `null` shows no footer at all. Build it from `ModalCancel` and
   * `ModalAction`.
   */
  footer?: React.ReactNode;
  /** Trigger element for uncontrolled usage */
  trigger?: React.ReactNode;
  /** Additional className for the dialog content */
  className?: string;
  /**
   * Icon shown in a tile beside the title (above it for `size="xs"`). There is no icon unless you pass one; the
   * tile is tinted for the destructive variant.
   */
  icon?: React.ReactNode;
  /**
   * Width: `xs` 320px (centred, equal-width actions), `sm` 384px, `default` 512px, `lg` 672px, `xl` 896px or
   * `full`. Defaults to `sm`.
   */
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "full";
  /**
   * Phrase the user must type before the confirm button is enabled (type-to-confirm). Leave unset for a plain
   * yes/no confirmation. Compared exactly, case included.
   */
  requireText?: string;
  /** Label above the type-to-confirm field. Defaults to `Enter "<requireText>" to confirm` */
  requireTextLabel?: React.ReactNode;
  /** `id` of the type-to-confirm field, for tests and stylesheets that target it */
  inputId?: string;
  /** Description announced by screen readers when `description` is omitted (default: "Confirmation dialog") */
  srDescription?: string;
  /** Show a close (×) button in the corner. Off by default: Cancel and Escape already dismiss the modal */
  showCloseButton?: boolean;
}

interface ModalPanelProps extends Omit<
  ModalProps,
  "open" | "onOpenChange" | "trigger" | "className" | "showCloseButton" | "size"
> {
  /** What the user has typed so far into the type-to-confirm field */
  typed: string;
  onTypedChange: (value: string) => void;
  cancelRef?: React.Ref<HTMLButtonElement>;
  inputRef?: React.Ref<HTMLInputElement>;
}

const phraseLabel = (phrase: string) =>
  phrase === phrase.toUpperCase() && /[A-Z]/.test(phrase)
    ? `Enter "${phrase}" in uppercase to confirm`
    : `Enter "${phrase}" to confirm`;

/**
 * The modal's interior: header (icon tile, title, description), body, optional type-to-confirm field and the
 * footer.
 *
 * @internal Called as a plain function, not rendered as an element: `ModalContent` looks for a
 * `ModalDescription` among its children to decide whether to add its own hidden one, and an intermediate
 * component element would hide ours from that scan (two descriptions sharing one id). It holds no state, so the
 * stories can render it as an element, inside a `ModalRoot`, to preview the real layout inline.
 */
function ModalPanel({
  title,
  description,
  children,
  variant = "default",
  onConfirm,
  onCancel,
  loading = false,
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
  confirmDisabled = false,
  footer,
  icon,
  requireText,
  requireTextLabel,
  inputId,
  srDescription = "Confirmation dialog",
  typed,
  onTypedChange,
  cancelRef,
  inputRef,
}: ModalPanelProps) {
  const generatedInputId = React.useId();
  const fieldId = inputId ?? generatedInputId;
  const destructive = variant === "destructive";
  const hasMedia = icon !== undefined && icon !== null && icon !== false;
  const gated = requireText !== undefined;
  const phraseMatches = !gated || typed === requireText;

  return (
    <>
      <ModalHeader>
        {hasMedia && <ModalMedia variant={variant}>{icon}</ModalMedia>}
        <ModalTitle>{title}</ModalTitle>
        <ModalDescription className={description ? undefined : "sr-only"}>
          {description || srDescription}
        </ModalDescription>
      </ModalHeader>
      {children !== undefined && children !== null && (
        <ModalBody>{children}</ModalBody>
      )}
      {gated && (
        <div data-slot="modal-confirm-field" className="grid gap-2">
          <label
            htmlFor={fieldId}
            className="text-sm font-medium leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)]"
          >
            {requireTextLabel ?? phraseLabel(requireText)}
          </label>
          <Input
            ref={inputRef}
            id={fieldId}
            value={typed}
            onChange={(event) => onTypedChange(event.target.value)}
            placeholder={requireText}
            autoComplete="off"
          />
        </div>
      )}
      {footer === null ? null : (
        <ModalFooter>
          {footer !== undefined ? (
            footer
          ) : (
            <>
              <ModalCancel
                ref={cancelRef}
                onClick={() => onCancel?.()}
                disabled={loading}
              >
                {cancelButtonText}
              </ModalCancel>
              <ModalAction
                variant={destructive ? "destructive" : "default"}
                onClick={() => {
                  if (phraseMatches) onConfirm?.();
                }}
                disabled={!phraseMatches || confirmDisabled || loading}
                loading={loading}
              >
                {confirmButtonText}
              </ModalAction>
            </>
          )}
        </ModalFooter>
      )}
    </>
  );
}

/**
 * One modal for every "are you sure?" and form moment: a plain yes/no, a destructive action, a type-to-confirm
 * gate (set `requireText`), or a form (pass it as `children`). Layout follows shadcn's alert dialog: an optional
 * icon tile, title and description, and a footer strip with Cancel and the confirm action.
 *
 * For a layout of your own, compose `ModalRoot`, `ModalContent`, `ModalHeader`, ... directly.
 *
 * @example
 * ```tsx
 * // Plain confirmation
 * <Modal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Disable Webhook"
 *   description="Are you sure you want to disable this webhook?"
 *   onConfirm={handleDisable}
 * />
 *
 * // shadcn's destructive example: small, centred, a trash tile
 * <Modal
 *   trigger={<Button variant="destructive">Delete chat</Button>}
 *   variant="destructive"
 *   size="xs"
 *   icon={<Trash2 />}
 *   title="Delete chat?"
 *   description="This will permanently delete this chat conversation."
 *   confirmButtonText="Delete"
 *   onConfirm={handleDelete}
 * />
 *
 * // Type to confirm
 * <Modal variant="destructive" requireText="DELETE" title="Delete this webhook?" ... />
 *
 * // A form
 * <Modal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Edit profile"
 *   confirmButtonText="Save"
 *   onConfirm={save}
 *   showCloseButton
 * >
 *   <Input value={name} onChange={(e) => setName(e.target.value)} />
 * </Modal>
 * ```
 */
const Modal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      trigger,
      className,
      size = "sm",
      requireText,
      showCloseButton = false,
      ...panel
    }: ModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [typed, setTyped] = React.useState("");
    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // The phrase is cleared whenever the modal closes, so reopening never starts pre-confirmed.
    React.useEffect(() => {
      if (!open) setTyped("");
    }, [open]);

    const handleOpenChange = (next: boolean) => {
      if (!next) setTyped("");
      onOpenChange?.(next);
    };

    return (
      <ModalRoot open={open} onOpenChange={handleOpenChange}>
        {trigger && <ModalTrigger asChild>{trigger}</ModalTrigger>}
        <ModalContent
          ref={ref}
          size={size}
          hideCloseButton={!showCloseButton}
          // Focus lands on the field being asked for. With a form body Radix's default (the first field, as in
          // v1's FormModal) is right; a plain confirmation focuses the safe choice, Cancel. While loading Cancel
          // is disabled, so Radix keeps its default first-focusable behaviour.
          onOpenAutoFocus={(event) => {
            const hasBody =
              panel.children !== undefined && panel.children !== null;
            const target =
              requireText !== undefined
                ? inputRef.current
                : hasBody
                  ? null
                  : cancelRef.current;
            if (target && !target.disabled) {
              event.preventDefault();
              target.focus({ preventScroll: true });
            }
          }}
          className={className}
        >
          {ModalPanel({
            ...panel,
            requireText,
            typed,
            onTypedChange: setTyped,
            cancelRef,
            inputRef,
          })}
        </ModalContent>
      </ModalRoot>
    );
  }
);
Modal.displayName = "Modal";

/* -------------------------------------------------------------------------------------------------
 * v1 names, kept so v1 code migrates by changing only its import to `@/components/ui/v2/modal`.
 * None of these is a separate component.
 * -----------------------------------------------------------------------------------------------*/

/** v1 `ConfirmationModal`: the same component as `Modal`, with the same props. @deprecated Use `Modal`. */
const ConfirmationModal = Modal;
/** @deprecated Use `ModalProps`. */
export type ConfirmationModalProps = ModalProps;

/** Props of v1's `FormModal`, unchanged. */
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
 * v1's `FormModal`, as `Modal` with a body, a Save action and the close button v1 showed.
 *
 * @deprecated Use `<Modal showCloseButton confirmButtonText="Save" onConfirm={...}>{fields}</Modal>`. Mapping:
 * `onSave` becomes `onConfirm`, `saveButtonText` becomes `confirmButtonText`, `disableSave` becomes
 * `confirmDisabled`.
 */
const FormModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      onSave,
      onCancel,
      loading,
      saveButtonText = "Save",
      cancelButtonText,
      disableSave,
      className,
      size = "sm",
    }: FormModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => (
    // Every v1 prop is passed by name, so the mapping reads top to bottom and nothing is forwarded by accident.
    <Modal
      ref={ref}
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onConfirm={onSave}
      onCancel={onCancel}
      loading={loading}
      confirmButtonText={saveButtonText}
      cancelButtonText={cancelButtonText}
      confirmDisabled={disableSave}
      className={className}
      size={size}
      showCloseButton
      srDescription="Dialog content"
    >
      {children}
    </Modal>
  )
);
FormModal.displayName = "FormModal";

/** Props of v1's `DeleteConfirmationModal`, unchanged. */
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
 * v1's `DeleteConfirmationModal`: `Modal` with shadcn's destructive look (`size="xs"`, a trash tile) and v1's
 * wording and ids.
 *
 * @deprecated Use `<Modal variant="destructive" size="xs" icon={<Trash2 />} requireText="DELETE" />`. Mapping:
 * `itemName` becomes a title such as "Delete this webhook?", `confirmText` becomes `requireText`,
 * `deleteButtonText` becomes `confirmButtonText`.
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
      loading,
      deleteButtonText = "Delete",
      cancelButtonText,
      trigger,
      className,
    }: DeleteConfirmationModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => (
    // Every v1 prop is passed by name, so the mapping reads top to bottom and nothing is forwarded by accident.
    <Modal
      ref={ref}
      open={open}
      onOpenChange={onOpenChange}
      variant="destructive"
      size="xs"
      icon={<Trash2 strokeWidth={1.75} aria-hidden />}
      title={title || `Are you sure you want to delete this ${itemName}?`}
      description={description}
      requireText={confirmText}
      // The exact v1 wording and hooks, so existing tests, e2e selectors and stylesheets keep matching.
      requireTextLabel={`Enter "${confirmText}" in uppercase to confirm`}
      inputId="delete-confirmation-input"
      srDescription="Delete confirmation dialog - this action cannot be undone"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={loading}
      confirmButtonText={deleteButtonText}
      cancelButtonText={cancelButtonText}
      trigger={trigger}
      className={className}
    />
  )
);
DeleteConfirmationModal.displayName = "DeleteConfirmationModal";

/** v1 `Dialog` parts. They are the `Modal*` parts under their old names. @deprecated Use the `Modal*` names. */
export type DialogContentProps = ModalContentProps;

export {
  // Parts
  ModalRoot,
  ModalTrigger,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalMedia,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalCancel,
  ModalAction,
  modalContentVariants,
  modalSurfaceClass,
  // All-in-one
  Modal,
  ModalPanel,
  // v1 names
  ModalRoot as Dialog,
  ModalTrigger as DialogTrigger,
  ModalPortal as DialogPortal,
  ModalOverlay as DialogOverlay,
  ModalClose as DialogClose,
  ModalContent as DialogContent,
  ModalHeader as DialogHeader,
  ModalFooter as DialogFooter,
  ModalTitle as DialogTitle,
  ModalDescription as DialogDescription,
  modalContentVariants as dialogContentVariants,
  ConfirmationModal,
  FormModal,
  DeleteConfirmationModal,
};
