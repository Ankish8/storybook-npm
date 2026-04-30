import * as React from "react";
import { cn } from "../../../lib/utils";

/** Label style for field row headings (BotIdentityCard Field, BotBehaviorCard prompt title). */
export const formFieldLabelClassName = cn(
  "text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]"
);

export type FormFieldLabelProps = React.HTMLAttributes<HTMLSpanElement>;

export function FormFieldLabel({ className, ...props }: FormFieldLabelProps) {
  return (
    <span className={cn(formFieldLabelClassName, className)} {...props} />
  );
}
