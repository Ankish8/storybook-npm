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
  "min-h-0 min-w-0 max-w-full shrink-0 border-l border-solid border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-secondary flex flex-col overflow-hidden font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal shadow-[0_8px_24px_color-mix(in_srgb,var(--semantic-text-primary)_8%,transparent)] transition-[width,opacity] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
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
  /** Requests closing from the close button or an unhandled Escape. The parent owns open. */
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
const Panel = React.forwardRef<HTMLElement, PanelProps>(
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
      "aria-hidden": ariaHidden,
      hidden,
      onKeyDown,
      ...props
    }: PanelProps,
    ref
  ) => {
    const resolvedSize = size ?? "default";
    const widthClass = panelWidths[resolvedSize];
    const rootRef = React.useRef<HTMLElement | null>(null);
    const innerRef = React.useRef<HTMLDivElement>(null);
    const nativeInert = "inert" in props && props.inert === true;
    const available =
      open &&
      !hidden &&
      !nativeInert &&
      ariaHidden !== true &&
      ariaHidden !== "true";

    const setRef = React.useCallback(
      (element: HTMLElement | null) => {
        rootRef.current = element;
        if (typeof ref === "function") {
          const cleanup = (
            ref as (node: HTMLElement | null) => void | (() => void)
          )(element);
          if (typeof cleanup === "function") {
            return () => {
              rootRef.current = null;
              cleanup();
            };
          }
        } else if (ref) ref.current = element;
      },
      [ref]
    );

    useBrowserLayoutEffect(() => {
      // Include the aside itself: consumers can make it focusable with tabIndex.
      rootRef.current?.toggleAttribute("inert", !open || nativeInert);
      innerRef.current?.toggleAttribute("inert", !open);
    }, [open, nativeInert]);

    // Capture the opener once and return focus only if this panel still owns it.
    React.useEffect(() => {
      if (!available) return;
      const panel = rootRef.current;
      const doc = panel?.ownerDocument;
      if (!panel || !doc) return;
      const opener =
        doc.activeElement instanceof HTMLElement &&
        !panel.contains(doc.activeElement)
          ? doc.activeElement
          : null;
      // Respect a child's autoFocus and an already focused nested panel.
      if (!panel.contains(doc.activeElement)) {
        innerRef.current?.focus({ preventScroll: true });
      }
      return () => {
        if (
          opener?.isConnected &&
          !opener.closest("[inert], [hidden]") &&
          (panel.contains(doc.activeElement) || doc.activeElement === doc.body)
        ) {
          opener.focus({ preventScroll: true });
        }
      };
    }, [available]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e);
      if (
        !e.defaultPrevented &&
        available &&
        e.key === "Escape" &&
        !e.nativeEvent.isComposing &&
        onClose &&
        e.target instanceof Element &&
        e.currentTarget.contains(e.target as Node) &&
        (e.target as Element).closest("[data-panel-root]") === e.currentTarget
      ) {
        // React events from portals still bubble through the panel. Only handle
        // events from this panel's DOM, and let nested panels own their Escape.
        e.preventDefault();
        onClose();
      }
    };

    return (
      <aside
        ref={setRef}
        className={cn(
          panelVariants({ size }),
          open
            ? cn(widthClass, "opacity-100 [transition-duration:240ms]")
            : "w-0 border-l-0 opacity-0 pointer-events-none [transition-duration:180ms]",
          className
        )}
        {...props}
        data-panel-root=""
        aria-label={ariaLabel ?? title}
        aria-hidden={open ? (ariaHidden ?? false) : true}
        hidden={hidden}
        onKeyDown={handleKeyDown}
      >
        <div
          ref={innerRef}
          tabIndex={-1}
          className="flex h-full min-h-0 min-w-0 w-full flex-col outline-none"
        >
          {header ?? (
            <div className="flex shrink-0 items-center gap-4 border-b border-solid border-semantic-border-layout p-4 sm:p-6">
              {title && (
                <span className="min-w-0 flex-1 break-words text-lg font-medium leading-[1.4] text-semantic-text-primary">
                  {title}
                </span>
              )}
              {onClose && (
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={(event) => {
                    if (!event.defaultPrevented && available) onClose();
                  }}
                  aria-label="Close"
                  className="ml-auto size-8 shrink-0 rounded-md border-semantic-border-layout bg-semantic-bg-subtle p-0 text-semantic-text-secondary shadow-none [@media(hover:hover)_and_(pointer:fine)]:hover:bg-semantic-bg-ui [@media(hover:hover)_and_(pointer:fine)]:hover:text-semantic-text-primary [@media(pointer:coarse)]:size-11"
                >
                  <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </Button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex min-w-0 shrink-0 flex-wrap gap-2 border-t border-solid border-semantic-border-layout px-4 py-4 sm:px-6">
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
