import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Button — v2 design (Figma: New Design System › v2 › Buttons).
 *
 * Same props as `@/components/ui/button`; only the look changes, so moving a
 * screen to v2 is an import-path change.
 *
 * Sizes: sm 32 / default 40 / lg 48 / icon 40. Radius 8. Label Inter 600.
 *
 * Disabled and loading are styled with `disabled:` / `aria-busy:` modifiers. A
 * loading button is also disabled, so `aria-busy:` only appears where the two
 * states differ (outline, secondary, success, ghost, link, dashed).
 *
 * Focus ring: the 1px width is an arbitrary property on purpose. Storybook runs
 * tailwind-merge 3, where a bare `outline` means width and is dropped next to
 * `outline-1`; consumers run tailwind-merge 2.x, where it means style and is
 * kept. `[outline-width:1px]` is immune to both, so the ring is identical.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-semibold leading-5 tracking-[0.014px] transition-[background-color,border-color,box-shadow,color,opacity] duration-200 focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-2 border-solid border-[var(--border-skeuomorphic,rgba(255,255,255,0.12))] bg-semantic-primary text-semantic-text-inverted shadow-[0_1px_2px_0_rgba(12,15,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_0_rgba(12,15,18,0.05)] hover:bg-semantic-primary-hover active:bg-[linear-gradient(270deg,var(--color-primary-300,#777E8D)_0%,var(--semantic-primary-hover,#2F384D)_100%)] active:shadow-none disabled:border-transparent disabled:bg-semantic-disabled-primary disabled:shadow-none",
        primary:
          "border-2 border-solid border-[var(--border-skeuomorphic,rgba(255,255,255,0.12))] bg-semantic-primary text-semantic-text-inverted shadow-[0_1px_2px_0_rgba(12,15,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_0_rgba(12,15,18,0.05)] hover:bg-semantic-primary-hover active:bg-[linear-gradient(270deg,var(--color-primary-300,#777E8D)_0%,var(--semantic-primary-hover,#2F384D)_100%)] active:shadow-none disabled:border-transparent disabled:bg-semantic-disabled-primary disabled:shadow-none",
        destructive:
          "border border-solid border-[var(--border-skeuomorphic,rgba(255,255,255,0.12))] bg-semantic-error-primary text-semantic-text-inverted shadow-[0_1px_2px_0_rgba(12,15,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_0_rgba(12,15,18,0.05)] hover:bg-semantic-error-hover active:bg-[linear-gradient(270deg,var(--semantic-error-primary,#F04438)_0%,var(--semantic-error-hover,#D92D20)_47.6%)] active:shadow-none disabled:border-transparent disabled:bg-[rgba(240,68,56,0.6)] disabled:shadow-none",
        success:
          "border border-solid border-[var(--border-skeuomorphic,rgba(255,255,255,0.12))] bg-semantic-success-primary text-semantic-text-inverted shadow-[0_1px_2px_0_rgba(12,15,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_0_rgba(12,15,18,0.05)] hover:bg-semantic-success-hover active:bg-[linear-gradient(270deg,var(--semantic-success-primary,#17B26A)_0%,var(--semantic-success-hover,#079455)_47.6%)] active:shadow-none disabled:border-transparent disabled:bg-[rgba(23,178,106,0.6)] disabled:shadow-none aria-busy:bg-semantic-success-primary",
        outline:
          "border border-solid border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-secondary shadow-[4px_4px_40px_0_rgba(0,0,0,0.02)] hover:bg-semantic-bg-ui hover:shadow-none active:bg-[linear-gradient(270deg,var(--semantic-border-layout,#E9EAEB)_0%,var(--semantic-bg-ui,#F5F5F5)_100%)] active:shadow-none disabled:bg-semantic-primary-surface disabled:text-semantic-text-muted disabled:shadow-none aria-busy:bg-semantic-bg-primary aria-busy:text-semantic-text-secondary",
        secondary:
          "bg-semantic-info-surface text-semantic-text-secondary shadow-[4px_4px_40px_0_rgba(0,0,0,0.02)] hover:shadow-none active:bg-[linear-gradient(270deg,var(--semantic-primary-surface,#EBECEE)_0%,var(--semantic-info-surface,#ECF1FB)_100%)] active:shadow-none disabled:bg-semantic-primary-surface disabled:text-semantic-text-muted disabled:shadow-none aria-busy:bg-semantic-bg-ui aria-busy:text-semantic-text-secondary",
        ghost:
          "bg-transparent text-semantic-text-link hover:bg-semantic-bg-ui active:bg-[linear-gradient(270deg,var(--semantic-border-layout,#E9EAEB)_0%,var(--semantic-bg-ui,#F5F5F5)_100%)] disabled:text-semantic-disabled-primary aria-busy:text-semantic-text-link",
        link: "text-semantic-text-secondary underline-offset-4 hover:underline disabled:text-semantic-disabled-primary aria-busy:text-semantic-text-secondary",
        dashed:
          "border border-dashed border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-muted hover:border-[var(--color-primary-100,#C0C3CA)] hover:bg-semantic-bg-ui active:border-[var(--color-primary-100,#C0C3CA)] active:bg-[linear-gradient(270deg,var(--semantic-border-layout,#E9EAEB)_0%,var(--semantic-bg-ui,#F5F5F5)_100%)] disabled:opacity-50 aria-busy:opacity-100",
      },
      size: {
        default: "h-10 px-4 [&_svg]:size-[18px]",
        sm: "h-8 px-4 text-xs leading-4 tracking-[0.06px] [&_svg]:size-[18px]",
        lg: "h-12 px-4 [&_svg]:size-[18px]",
        icon: "h-10 w-10 p-0 [&_svg]:size-[18px]",
        "icon-sm": "h-8 w-8 p-0 [&_svg]:size-[18px]",
        "icon-lg": "h-12 w-12 p-0 [&_svg]:size-[18px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button component for user interactions (v2 design).
 *
 * @example
 * ```tsx
 * <Button variant="default" size="default">
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element using Radix Slot */
  asChild?: boolean;
  /** Icon displayed on the left side of the button text */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right side of the button text */
  rightIcon?: React.ReactNode;
  /** Shows loading spinner and disables button */
  loading?: boolean;
  /** Text shown during loading state */
  loadingText?: string;
}

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leftIcon,
      rightIcon,
      loading = false,
      loadingText,
      children,
      disabled,
      ...props
    }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
