import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

/**
 * Panel root variants
 */
const panelVariants = cva(
  "border-l border-semantic-border-layout bg-semantic-bg-primary flex flex-col overflow-hidden transition-all duration-300 ease-in-out shrink-0",
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
  extends React.HTMLAttributes<HTMLElement>,
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
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const resolvedSize = size ?? "default";
    const widthClass = panelWidths[resolvedSize];
    const innerRef = React.useRef<HTMLDivElement>(null);

    // Focus the inner container when the panel opens
    React.useEffect(() => {
      if (open) {
        innerRef.current?.focus();
      }
    }, [open]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
      // Forward to user-provided onKeyDown if any
      onKeyDown?.(e);
    };

    return (
      <aside
        ref={ref}
        className={cn(
          panelVariants({ size }),
          open ? widthClass : "w-0 border-l-0",
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
          {/* Header */}
          {header ?? (
            <div className="flex items-center gap-3 px-4 h-14 border-b border-semantic-border-layout shrink-0">
              {title && (
                <span className="flex-1 text-base font-semibold text-semantic-text-primary truncate">
                  {title}
                </span>
              )}
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X className="size-5" />
                </Button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex gap-3 px-4 py-3 shrink-0 border-t border-semantic-border-layout">
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
