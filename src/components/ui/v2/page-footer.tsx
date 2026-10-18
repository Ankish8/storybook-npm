import * as React from "react";
import { cn } from "@/lib/utils";
export interface PageFooterProps extends React.HTMLAttributes<HTMLElement> {
  description?: React.ReactNode;
  actions?: React.ReactNode;
  layout?: "desktop" | "mobile";
}
const PageFooter = React.forwardRef<HTMLElement, PageFooterProps>(
  (
    { description, actions, layout = "desktop", children, className, ...props },
    ref
  ) => (
    <footer
      ref={ref}
      className={cn(
        "flex gap-3 border-t border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary px-5 font-[family-name:var(--font-v2,Inter,sans-serif)] text-[var(--v2-text-secondary,#5E5E5E)]",
        layout === "mobile"
          ? "flex-col items-stretch py-5"
          : "flex-wrap items-center justify-end py-3",
        className
      )}
      {...props}
    >
      {description && (
        <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-normal leading-[1.4] tracking-[-0.01em]">
          {description}
        </div>
      )}
      {children}
      {actions && (
        <div
          className={cn(
            "flex items-center gap-3",
            layout === "mobile" && "w-full [&>button]:flex-1"
          )}
        >
          {actions}
        </div>
      )}
    </footer>
  )
);
PageFooter.displayName = "PageFooter";
export { PageFooter };
