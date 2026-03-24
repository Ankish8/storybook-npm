import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import type { BotListHeaderProps } from "./types";

const botListHeaderVariants = cva("min-w-0", {
  variants: {
    variant: {
      default:
        "flex flex-col gap-1.5 shrink",
      withSearch:
        "flex flex-col gap-3 pb-4 mb-4 border-b border-solid border-semantic-border-layout sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5 sm:mb-6 shrink",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const BotListHeader = React.forwardRef(
  (
    { title, subtitle, variant = "default", rightContent, className, ...props }: BotListHeaderProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const rootClassName = cn(botListHeaderVariants({ variant }), className);
    const titleBlock = (
      <>
        {title != null && (
          <h1 className="m-0 text-base font-semibold text-semantic-text-primary tracking-[0.064px] break-words sm:text-lg">
            {title}
          </h1>
        )}
        {subtitle != null && (
          <p className="m-0 text-xs sm:text-sm text-semantic-text-muted tracking-[0.035px] break-words">
            {subtitle}
          </p>
        )}
      </>
    );

    if (variant === "withSearch") {
      return (
        <div ref={ref} className={rootClassName} {...props}>
          <div className="flex flex-col gap-1.5 min-w-0 shrink">{titleBlock}</div>
          {rightContent}
        </div>
      );
    }

    return (
      <div ref={ref} className={rootClassName} {...props}>
        {titleBlock}
      </div>
    );
  }
);

BotListHeader.displayName = "BotListHeader";

export { botListHeaderVariants };
