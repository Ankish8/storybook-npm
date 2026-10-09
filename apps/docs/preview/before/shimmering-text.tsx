import * as React from "react";
import { cn } from "@/lib/utils";
export interface ShimmeringTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
}
const ShimmeringText = React.forwardRef<HTMLSpanElement, ShimmeringTextProps>(
  (
    { active = true, children = "Loading. Please wait", className, ...props },
    ref
  ) => (
    <span
      ref={ref}
      role="status"
      aria-live="polite"
      data-v2-shimmer={active || undefined}
      className={cn(
        "inline-block max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)] text-base font-normal leading-[19px] text-[var(--v2-text-secondary,#5E5E5E)]",
        className
      )}
      {...props}
    >
      {children}
      {active && (
        <style>{`@keyframes myoperator-v2-shimmer {0%,100% {background-position:100% 0} 50% {background-position:0 0}} [data-v2-shimmer]{background:linear-gradient(92deg,var(--v2-text-secondary,#5E5E5E) 0%,var(--semantic-text-inverted,#FFF) 28.77%,var(--v2-text-secondary,#5E5E5E) 45.08%);background-size:200% 100%;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:myoperator-v2-shimmer 2s ease-in-out infinite}@media(prefers-reduced-motion:reduce){[data-v2-shimmer]{animation:none;background:none;-webkit-text-fill-color:currentColor}}`}</style>
      )}
    </span>
  )
);
ShimmeringText.displayName = "ShimmeringText";
export { ShimmeringText };
