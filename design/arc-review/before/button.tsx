"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Button — v2 design (Figma: New Design System › v2 › Buttons).
 *
 * Same public props as `@/components/ui/button`, with Arc-inspired state styling
 * and focus-preserving loading. Brand primary and 8px radius are retained.
 *
 * Canonical variants: primary, secondary, ghost, link, destructive.
 * `default` aliases primary; `outline` aliases secondary. Success and dashed
 * remain available for existing v1 consumers. All legacy props remain accepted.
 *
 * Sizes: sm 36 / default 44 / lg 50; square icon equivalents. Label Inter 500.
 *
 * Explicit disabled uses the native attribute. Loading uses aria-disabled so
 * focus stays on the action, with capture guards preventing repeat activation.
 *
 * Focus ring: the 1px width is an arbitrary property on purpose. Storybook runs
 * tailwind-merge 3, where a bare `outline` means width and is dropped next to
 * `outline-1`; consumers run tailwind-merge 2.x, where it means style and is
 * kept. `[outline-width:1px]` is immune to both, so the ring is identical.
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-solid border-transparent font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-[1.4] tracking-normal cursor-pointer shadow-none [-webkit-tap-highlight-color:transparent] transition-[background-color,border-color,box-shadow,color,opacity,transform] [transition-duration:160ms,160ms,160ms,160ms,160ms,220ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] active:[transition-duration:160ms,160ms,160ms,160ms,160ms,120ms] active:scale-[var(--v2-button-press,0.97)] motion-reduce:active:scale-100 motion-reduce:[transition-duration:120ms] data-[popup-anchor=true]:active:scale-100 aria-disabled:active:scale-100 aria-busy:cursor-progress disabled:cursor-not-allowed disabled:opacity-[0.52] [&[aria-disabled=true]:not([aria-busy=true])]:opacity-[0.52] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        destructive:
          "bg-[var(--v2-button-surface,var(--semantic-bg-primary,#fff))] border-[var(--v2-button-border,oklch(0.935_0_0))] text-[var(--v2-button-danger,oklch(0.54_0.21_25))] [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:border-[var(--v2-button-danger,oklch(0.54_0.21_25))] [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:bg-[var(--v2-button-surface-muted,oklch(0.978_0_0))] [&:active:not([aria-disabled=true])]:border-[var(--v2-button-danger,oklch(0.54_0.21_25))] [&:active:not([aria-disabled=true])]:bg-[var(--v2-button-surface-muted,oklch(0.978_0_0))]",
        success:
          "bg-[var(--v2-button-surface,var(--semantic-bg-primary,#fff))] border-[var(--v2-button-border,oklch(0.935_0_0))] text-semantic-success-hover [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:border-semantic-success-hover [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:bg-[var(--v2-button-surface-muted,oklch(0.978_0_0))] [&:active:not([aria-disabled=true])]:border-semantic-success-hover [&:active:not([aria-disabled=true])]:bg-[var(--v2-button-surface-muted,oklch(0.978_0_0))]",
        outline: "",
        secondary: "",
        ghost:
          "border-0 bg-transparent text-[var(--v2-button-secondary,oklch(0.46_0_0))] [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:text-[var(--v2-button-foreground,oklch(0.15_0_0))] [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:bg-[var(--v2-button-surface-muted,oklch(0.978_0_0))] [&:active:not([aria-disabled=true])]:text-[var(--v2-button-foreground,oklch(0.15_0_0))] [&:active:not([aria-disabled=true])]:bg-[var(--v2-button-surface-muted,oklch(0.978_0_0))]",
        link: "border-0 bg-transparent active:scale-100 text-semantic-text-link underline underline-offset-4 decoration-current [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not(:active):not([aria-disabled=true])]:opacity-[0.91] [&:active:not([aria-disabled=true])]:opacity-[0.84]",
        dashed:
          "border-dashed bg-[var(--v2-button-surface,var(--semantic-bg-primary,#fff))] border-[var(--v2-button-border,oklch(0.935_0_0))] text-[var(--v2-button-foreground,oklch(0.15_0_0))] [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:bg-[var(--v2-button-surface-muted,oklch(0.978_0_0))] [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:shadow-[0_1px_2px_var(--v2-button-shadow,rgba(0,0,0,0.035))] [&:active:not([aria-disabled=true])]:bg-[var(--v2-button-surface-muted,oklch(0.978_0_0))]",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3",
        lg: "h-[50px] px-5",
        icon: "h-11 w-11 p-0 [--v2-button-press:0.96]",
        "icon-sm": "h-9 w-9 p-0 [--v2-button-press:0.96]",
        "icon-lg": "h-[50px] w-[50px] p-0 [--v2-button-press:0.96]",
      },
    },
    // Legacy names resolve to the same style definition, so they cannot drift.
    compoundVariants: [
      {
        variant: ["default", "primary"],
        class:
          "bg-semantic-primary border-semantic-primary text-semantic-text-inverted [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not(:active):not([aria-disabled=true])]:opacity-[0.91] [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:shadow-[0_1px_2px_var(--v2-button-shadow,rgba(0,0,0,0.035))] [&:active:not([aria-disabled=true])]:opacity-[0.84]",
      },
      {
        variant: ["outline", "secondary"],
        class:
          "bg-[var(--v2-button-surface,var(--semantic-bg-primary,#fff))] border-[var(--v2-button-border,oklch(0.935_0_0))] text-[var(--v2-button-foreground,oklch(0.15_0_0))] [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:bg-[var(--v2-button-surface-muted,oklch(0.978_0_0))] [@media(hover:hover)_and_(pointer:fine)]:[&:hover:not([aria-disabled=true])]:shadow-[0_1px_2px_var(--v2-button-shadow,rgba(0,0,0,0.035))] [&:active:not([aria-disabled=true])]:bg-[var(--v2-button-surface-muted,oklch(0.978_0_0))]",
      },
      { variant: "link", class: "active:scale-100" },
    ],
    defaultVariants: { variant: "default", size: "default" },
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
  /** Shows a spinner and blocks activation while retaining keyboard focus */
  loading?: boolean;
  /** Text shown during loading state */
  loadingText?: string;
}

const useBrowserLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function ButtonContent({
  children,
  leftIcon,
  rightIcon,
  conceal = false,
  iconOnly = false,
}: Pick<ButtonProps, "children" | "leftIcon" | "rightIcon"> & {
  conceal?: boolean;
  iconOnly?: boolean;
}) {
  const shellRef = React.useRef<HTMLSpanElement>(null);
  const contentRef = React.useRef<HTMLSpanElement>(null);
  const previousRef = React.useRef<HTMLSpanElement>(null);

  useBrowserLayoutEffect(() => {
    const shell = shellRef.current;
    const content = contentRef.current;
    const previous = previousRef.current;
    if (!shell || !content || !previous) return;
    previous.setAttribute("inert", "");

    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let current = 0;
    let target = 0;
    let velocity = 0;
    let lastTime = 0;
    let frame = 0;
    let ready = false;
    let markup = content.innerHTML;
    let snapshot = content.cloneNode(true) as HTMLElement;
    let entering: Animation | undefined;
    let exiting: Animation | undefined;
    // Critically damped, no bounce. Exact integration retains velocity when
    // labels change again before the previous width has finished settling.
    const omega = 32;
    const paint = () => {
      shell.style.width = `${current}px`;
    };
    const cancel = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const snap = () => {
      cancel();
      current = target;
      velocity = 0;
      paint();
    };
    const tick = (time: number) => {
      const dt = Math.max(0, (time - lastTime) / 1000);
      lastTime = time;
      const offset = current - target;
      const coefficient = velocity + omega * offset;
      const decay = Math.exp(-omega * dt);
      current = target + (offset + coefficient * dt) * decay;
      velocity = (velocity - omega * coefficient * dt) * decay;
      paint();
      if (Math.abs(current - target) < 0.1 && Math.abs(velocity) < 0.5) snap();
      else frame = window.requestAnimationFrame(tick);
    };
    const measure = (animate: boolean) => {
      // CSS width is unscaled even when a pointer is pressing the button.
      const width =
        parseFloat(window.getComputedStyle(content).width) ||
        content.offsetWidth;
      if (!width) {
        cancel();
        ready = false;
        shell.style.removeProperty("width");
        return;
      }
      if (ready && Math.abs(width - target) < 0.1) return;
      target = width;
      if (!ready || !animate || preference?.matches) snap();
      else if (!frame) {
        lastTime = performance.now();
        frame = window.requestAnimationFrame(tick);
      }
      ready = true;
    };
    const update = () => {
      const nextMarkup = content.innerHTML;
      if (nextMarkup !== markup) {
        entering?.cancel();
        exiting?.cancel();
        previous.replaceChildren();
        if (ready && typeof content.animate === "function") {
          // The outgoing snapshot is decorative, inert and never owns focus.
          snapshot.removeAttribute("id");
          snapshot
            .querySelectorAll("[id]")
            .forEach((node) => node.removeAttribute("id"));
          previous.append(snapshot);
          previous.style.opacity = "1";
          exiting = previous.animate(
            preference?.matches
              ? [{ opacity: 1 }, { opacity: 0 }]
              : [
                  { opacity: 1, transform: "none", filter: "blur(0px)" },
                  {
                    opacity: 0,
                    transform: iconOnly ? "scale(0.6)" : "translateY(-3px)",
                    filter: iconOnly ? "blur(2px)" : "blur(4px)",
                  },
                ],
            {
              duration: preference?.matches ? 120 : 160,
              easing: "cubic-bezier(0.22,1,0.36,1)",
            }
          );
          const activeExit = exiting;
          exiting.onfinish = () => {
            if (exiting !== activeExit) return;
            previous.replaceChildren();
            previous.style.opacity = "0";
          };
          entering = content.animate(
            preference?.matches
              ? [{ opacity: 0 }, { opacity: 1 }]
              : [
                  {
                    opacity: 0,
                    transform: iconOnly ? "scale(0.6)" : "translateY(4px)",
                    filter: iconOnly ? "blur(2px)" : "blur(4px)",
                  },
                  { opacity: 1, transform: "none", filter: "blur(0px)" },
                ],
            {
              duration: preference?.matches ? 120 : 240,
              easing: "cubic-bezier(0.16,1,0.3,1)",
            }
          );
        }
        markup = nextMarkup;
        snapshot = content.cloneNode(true) as HTMLElement;
      }
      measure(true);
    };
    const resize =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measure(true))
        : undefined;
    const mutations = new MutationObserver(update);
    mutations.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
    resize?.observe(content);
    const remeasure = () => measure(false);
    const motionChanged = () => {
      if (preference?.matches) {
        snap();
        entering?.cancel();
        exiting?.cancel();
        previous.replaceChildren();
        previous.style.opacity = "0";
      }
    };
    measure(false);
    window.addEventListener("resize", remeasure);
    preference?.addEventListener("change", motionChanged);
    document.fonts?.addEventListener("loadingdone", remeasure);
    return () => {
      cancel();
      entering?.cancel();
      exiting?.cancel();
      mutations.disconnect();
      resize?.disconnect();
      window.removeEventListener("resize", remeasure);
      preference?.removeEventListener("change", motionChanged);
      document.fonts?.removeEventListener("loadingdone", remeasure);
    };
  }, [iconOnly]);

  return (
    <span
      ref={shellRef}
      data-v2-button-content=""
      data-concealed={conceal || undefined}
      className="relative inline-flex max-w-full items-center justify-center align-middle [clip-path:inset(-50%_-12px)] transition-opacity [transition-duration:160ms] data-[concealed=true]:opacity-0 motion-reduce:[transition-duration:120ms]"
    >
      <span
        ref={contentRef}
        data-v2-button-label=""
        className="inline-flex w-max shrink-0 items-center justify-center gap-2 whitespace-nowrap"
      >
        {leftIcon}
        {children}
        {rightIcon}
      </span>
      <span
        ref={previousRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-y-0 left-0 inline-flex w-max items-center"
      />
    </span>
  );
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
      onClick,
      onClickCapture,
      onPointerDownCapture,
      onKeyDownCapture,
      ...props
    }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const Comp = asChild ? Slot : "button";
    const child =
      asChild &&
      React.isValidElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(
        children
      )
        ? children
        : undefined;
    const ariaDisabled =
      props["aria-disabled"] ?? child?.props["aria-disabled"];
    const unavailable = Boolean(
      disabled ||
      loading ||
      child?.props.disabled ||
      ariaDisabled === true ||
      ariaDisabled === "true"
    );
    const popup = props["aria-haspopup"] ?? child?.props["aria-haspopup"];
    const anchorsLayer = Boolean(
      (popup && popup !== "false") ||
      (props.role ?? child?.props.role) === "combobox" ||
      (props as { "data-state"?: string })["data-state"] !== undefined ||
      (child?.props as { "data-state"?: string } | undefined)?.[
        "data-state"
      ] !== undefined
    );
    const iconOnly =
      size === "icon" || size === "icon-sm" || size === "icon-lg";
    const label = child?.props.children ?? children;
    const loadingLabel = loadingText || label;
    // The default busy treatment holds the original label's width. Consumers
    // can still opt into the existing inline loadingText API.
    const centeredLoading = loading && (iconOnly || !loadingText);
    const content = (
      <>
        <ButtonContent
          conceal={centeredLoading}
          iconOnly={iconOnly}
          leftIcon={
            loading && !centeredLoading ? (
              <Loader2
                aria-hidden="true"
                className="animate-spin [animation-duration:700ms] motion-reduce:[animation-duration:2s]"
              />
            ) : (
              leftIcon
            )
          }
          rightIcon={loading && !centeredLoading ? undefined : rightIcon}
        >
          {loading && !centeredLoading ? loadingLabel : label}
        </ButtonContent>
        <span
          aria-hidden="true"
          data-active={centeredLoading || undefined}
          className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 scale-[0.6] transition-[opacity,transform] [transition-duration:160ms] ease-out data-[active=true]:opacity-100 data-[active=true]:scale-100 motion-reduce:scale-100"
        >
          <span
            data-v2-button-spinner=""
            data-loading={centeredLoading || undefined}
            className="size-4 rounded-full border-[1.5px] border-solid border-current border-r-transparent animate-spin [animation-duration:700ms] [animation-play-state:paused] data-[loading=true]:[animation-play-state:running] motion-reduce:[animation-duration:2s]"
          />
        </span>
      </>
    );
    const block = (event: React.SyntheticEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const measurePress = (element: HTMLButtonElement) => {
      const width = element.offsetWidth;
      element.style.setProperty(
        "--v2-button-press",
        width > 220
          ? "0.985"
          : (width > 0 && width <= 48) || iconOnly
            ? "0.96"
            : "0.97"
      );
    };
    const slottedChild = child
      ? React.cloneElement(child, {
          children: content,
          ...(disabled ? { disabled: true } : {}),
          ...(unavailable
            ? {
                "aria-disabled": true,
                ...(loading ? { "aria-busy": true } : {}),
                onClick: undefined,
                onClickCapture: undefined,
                onPointerDown: undefined,
                onPointerDownCapture: undefined,
                onKeyDown: undefined,
                onKeyDownCapture: undefined,
              }
            : {}),
        })
      : children;

    return (
      <Comp
        {...props}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        aria-busy={loading || props["aria-busy"] || undefined}
        aria-disabled={unavailable || undefined}
        aria-label={
          props["aria-label"] ??
          (loading && iconOnly && typeof loadingLabel === "string"
            ? loadingLabel
            : undefined)
        }
        data-popup-anchor={anchorsLayer || undefined}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          if (unavailable) block(event);
          else onClick?.(event);
        }}
        onClickCapture={(event: React.MouseEvent<HTMLButtonElement>) => {
          if (unavailable) block(event);
          else onClickCapture?.(event);
        }}
        onPointerDownCapture={(
          event: React.PointerEvent<HTMLButtonElement>
        ) => {
          if (unavailable) block(event);
          else {
            measurePress(event.currentTarget);
            onPointerDownCapture?.(event);
          }
        }}
        onKeyDownCapture={(event: React.KeyboardEvent<HTMLButtonElement>) => {
          if (unavailable && (event.key === "Enter" || event.key === " "))
            block(event);
          else {
            if (event.key === "Enter" || event.key === " ")
              measurePress(event.currentTarget);
            onKeyDownCapture?.(event);
          }
        }}
      >
        {asChild ? slottedChild : content}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
