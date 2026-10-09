import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

const useBrowserLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * Panel root variants
 */
const panelVariants = cva(
  "border-l border-solid border-semantic-border-layout bg-semantic-bg-primary text-[var(--v2-text-secondary,#5E5E5E)] flex flex-col overflow-hidden font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal shadow-[0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045)] transition-[width,opacity] motion-reduce:[transition-property:opacity] motion-reduce:[transition-duration:120ms] motion-reduce:[transition-delay:0ms] motion-reduce:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] shrink-0",
  {
    variants: {
      size: {
        sm: "",
        default: "",
        lg: "",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const panelWidths = {
  sm: "w-[280px]",
  default: "w-[320px]",
  lg: "w-[400px]",
} as const;

export interface PanelProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof panelVariants> {
  /** Whether the panel is open */
  open?: boolean;
  /** Panel title displayed in the header */
  title?: string;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Optional footer content (e.g., action buttons) */
  footer?: React.ReactNode;
  /** Custom header content — replaces the default title + close button */
  header?: React.ReactNode;
}

/**
 * Panel is a collapsible side panel layout with a header, scrollable body,
 * and optional footer — used for detail views, settings, and edit forms.
 *
 * @example
 * ```tsx
 * <Panel open={isOpen} title="Contact Details" onClose={() => setIsOpen(false)}>
 *   <TextField label="Name" value="Aditi Kumar" disabled size="sm" />
 *   <TextField label="Email" value="email@example.com" disabled size="sm" />
 * </Panel>
 * ```
 */
const Panel = React.forwardRef(
  (
    {
      open = true,
      title,
      onClose,
      footer,
      header,
      size,
      className,
      children,
      "aria-label": ariaLabel,
      onKeyDown,
      ...props
    }: PanelProps,
    ref: React.Ref<HTMLElement>
  ) => {
    const resolvedSize = size ?? "default";
    const widthClass = panelWidths[resolvedSize];
    const innerRef = React.useRef<HTMLDivElement>(null);

    useBrowserLayoutEffect(() => {
      innerRef.current?.toggleAttribute("inert", !open);
    }, [open]);

    // Capture the opener once and return focus only if this panel still owns it.
    React.useEffect(() => {
      if (!open) return;
      const opener =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const panel = innerRef.current;
      panel?.focus({ preventScroll: true });
      return () => {
        if (
          opener?.isConnected &&
          (panel?.contains(document.activeElement) ||
            document.activeElement === document.body)
        ) {
          opener.focus({ preventScroll: true });
        }
      };
    }, [open]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e);
      if (!e.defaultPrevented && open && e.key === "Escape" && onClose) {
        onClose();
      }
    };

    return (
      <aside
        ref={ref}
        className={cn(
          panelVariants({ size }),
          // Arc's drawer: the panel settles on a critically damped spring (about 460ms) and is opaque the whole
          // way in; it leaves faster (240ms) and only fades over the last 35% so its shadow goes with it.
          open
            ? cn(
                widthClass,
                "opacity-100 [transition-duration:460ms,0ms] [transition-timing-function:linear(0_0%,0.0288_4%,0.0974_8%,0.186_12%,0.2816_16%,0.3764_20%,0.4656_24%,0.5468_28%,0.6189_32%,0.6819_36%,0.7361_40%,0.7822_44%,0.821_48%,0.8535_52%,0.8806_56%,0.9029_60%,0.9213_64%,0.9364_68%,0.9487_72%,0.9587_76%,0.9668_80%,0.9734_84%,0.9787_88%,0.983_92%,0.9864_96%,1_100%),linear]"
              )
            : "w-0 border-l-0 opacity-0 [transition-duration:240ms,84ms] [transition-delay:0ms,156ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1),linear]",
          className
        )}
        aria-label={ariaLabel ?? title}
        aria-hidden={!open}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div
          ref={innerRef}
          tabIndex={-1}
          className={cn(widthClass, "flex flex-col h-full outline-none")}
        >
          {/* Header: Arc's drawer header (24px padding, 20px gap, 18px/1.4 title, 32px bordered close) */}
          {header ?? (
            <div className="flex shrink-0 items-start gap-5 border-b border-solid border-semantic-border-layout p-6">
              {title && (
                <span className="min-w-0 flex-1 break-words text-lg font-medium leading-[1.4] text-[var(--v2-text-primary,#484848)]">
                  {title}
                </span>
              )}
              {onClose && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mt-[3.4px] size-8 shrink-0 rounded-md border-semantic-border-layout bg-[color-mix(in_oklab,var(--semantic-bg-ui,#F5F5F5)_65%,transparent)] p-0 text-[var(--v2-text-secondary,#5E5E5E)] shadow-none [@media(hover:hover)]:hover:bg-semantic-bg-ui [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)]"
                >
                  <X className="size-4" strokeWidth={1.75} />
                </Button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex gap-2 px-6 py-4 shrink-0 border-t border-solid border-semantic-border-layout">
              {footer}
            </div>
          )}
        </div>
      </aside>
    );
  }
);
Panel.displayName = "Panel";

export { Panel, panelVariants };
