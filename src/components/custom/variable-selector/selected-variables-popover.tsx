import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/utils";
import { VariableChip } from "./variable-chip";
import type { SelectedVariablesPopoverProps, ValueSegment } from "./types";
import { computeAnchoredPopoverLayout } from "./popover-layout";

const POPOVER_OFFSET = 4;
const PREFERRED_WIDTH = 406;
const MAX_HEIGHT = 280;

export const SelectedVariablesPopover = React.forwardRef<
  HTMLDivElement,
  SelectedVariablesPopoverProps
>(
  (
    {
      open,
      onOpenChange,
      anchorRef,
      segments,
      title,
      showEditIcon = true,
      onEditVariable,
      showEditIconForVariable,
      className,
    },
    _ref
  ) => {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const [layout, setLayout] = React.useState({
      top: 0,
      left: 0,
      width: PREFERRED_WIDTH,
      maxHeight: MAX_HEIGHT,
    });

    React.useEffect(() => {
      if (!open || !anchorRef.current) return;
      const el = anchorRef.current;
      const update = () => {
        const rect = el.getBoundingClientRect();
        setLayout(
          computeAnchoredPopoverLayout(rect, {
            preferredWidth: PREFERRED_WIDTH,
            minWidth: 220,
            maxHeight: MAX_HEIGHT,
            offset: POPOVER_OFFSET,
          })
        );
      };
      update();
      window.addEventListener("scroll", update, true);
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update, true);
        window.removeEventListener("resize", update);
      };
    }, [open, anchorRef]);

    React.useEffect(() => {
      if (!open) return;
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          panelRef.current?.contains(target) ||
          anchorRef.current?.contains(target)
        )
          return;
        onOpenChange(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onOpenChange, anchorRef]);

    if (!open) return null;

    const content = (
      <div
        ref={panelRef}
        role="dialog"
        aria-label={title ?? "All variables"}
        className={cn(
          "fixed z-[10000] box-border max-w-[calc(100vw-1rem)] flex flex-col overflow-hidden rounded-md border border-semantic-border-layout bg-semantic-bg-primary p-2.5 shadow-lg sm:p-3",
          className
        )}
        style={{
          top: layout.top,
          left: layout.left,
          width: layout.width,
          maxHeight: layout.maxHeight,
        }}
      >
        {title ? (
          <p className="m-0 border-b border-semantic-border-layout pb-2.5 text-sm font-semibold text-semantic-text-primary">
            {title}
          </p>
        ) : null}
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto",
            title ? "pt-3" : "pt-0"
          )}
        >
          {segments.length === 0 ? (
            <p className="m-0 text-sm text-semantic-text-muted">No content.</p>
          ) : (
            <div className="flex flex-wrap content-start gap-x-1 gap-y-1.5 text-sm leading-6 text-semantic-text-primary">
              {segments.map((seg, index) =>
                seg.type === "text" ? (
                  seg.value ? (
                    <span key={`t-${index}`} className="break-words">
                      {seg.value}
                    </span>
                  ) : null
                ) : (
                  <VariableChip
                    key={`v-${index}-${seg.name}`}
                    name={seg.name}
                    showEditIcon={
                      showEditIcon &&
                      (showEditIconForVariable?.(seg.name) ?? true)
                    }
                    onEdit={onEditVariable}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(content, document.body);
  }
);
SelectedVariablesPopover.displayName = "SelectedVariablesPopover";
