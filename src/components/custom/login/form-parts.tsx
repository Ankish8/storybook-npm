import * as React from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { cn } from "../../../lib/utils";

export interface AuthFormHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Heading text */
  title?: string;
  /** Supporting copy under the heading */
  description?: React.ReactNode;
  /** Renders a back affordance above the heading when provided */
  onBack?: () => void;
  /** Accessible label for the back affordance. Defaults to "Go back" */
  backLabel?: string;
}

/** Shared card header used by every step of the authentication flow. */
const AuthFormHeader = React.forwardRef<HTMLDivElement, AuthFormHeaderProps>(
  ({ className, title, description, onBack, backLabel = "Go back", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex w-full flex-col items-center gap-2", className)}
      {...props}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="mr-auto flex h-8 w-8 items-center justify-center rounded text-semantic-text-muted transition-colors hover:bg-semantic-bg-ui hover:text-semantic-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
      ) : null}
      {title ? (
        <h1 className="m-0 text-center text-2xl font-semibold leading-8 text-semantic-text-primary">
          {title}
        </h1>
      ) : null}
      {description ? (
        <p className="m-0 text-center text-base text-semantic-text-muted">
          {description}
        </p>
      ) : null}
    </div>
  )
);
AuthFormHeader.displayName = "AuthFormHeader";

export interface AuthFieldLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Label text */
  children?: React.ReactNode;
  /** Appends a red asterisk when true */
  required?: boolean;
}

/**
 * Field label matching the Figma spec. Used for fields whose underlying UI
 * component does not render its own label (e.g. `PhoneInput`).
 */
const AuthFieldLabel = React.forwardRef<HTMLLabelElement, AuthFieldLabelProps>(
  ({ className, children, required = false, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-semibold leading-5 tracking-[0.014px] text-semantic-text-secondary",
        className
      )}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="text-semantic-error-primary">
          *
        </span>
      ) : null}
    </label>
  )
);
AuthFieldLabel.displayName = "AuthFieldLabel";

export interface AuthFormMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Message body */
  children?: React.ReactNode;
  /** Emphasised trailing text, e.g. "4 more attempts left." */
  trailing?: React.ReactNode;
}

/** Inline error row with a leading alert icon, matching the Figma error states. */
const AuthFormMessage = React.forwardRef<HTMLDivElement, AuthFormMessageProps>(
  ({ className, children, trailing, ...props }, ref) => {
    if (!children && !trailing) return null;
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "flex w-full items-start gap-1.5 text-semantic-error-primary",
          className
        )}
        {...props}
      >
        <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <p className="m-0 text-xs leading-[18px]">
          {children}
          {trailing ? (
            <span className="ml-1 font-semibold">{trailing}</span>
          ) : null}
        </p>
      </div>
    );
  }
);
AuthFormMessage.displayName = "AuthFormMessage";

export { AuthFieldLabel, AuthFormHeader, AuthFormMessage };
