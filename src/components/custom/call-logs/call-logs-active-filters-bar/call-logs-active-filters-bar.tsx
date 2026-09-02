import * as React from "react";

import { cn } from "../../../../lib/utils";
import { Tag } from "../../../ui/tag";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../ui/tooltip";
import type { CallLogsActiveFilterChip, CallLogsActiveFiltersBarProps } from "./types";

function ChipTag({
  chip,
  onRemoveChip,
}: {
  chip: CallLogsActiveFilterChip;
  onRemoveChip: (id: string) => void;
}) {
  const tag = (
    <Tag
      label={chip.label}
      onRemove={() => onRemoveChip(chip.id)}
      removeAriaLabel={`Remove ${chip.label ?? ""} ${chip.value}`.trim()}
    >
      {chip.icon}
      {chip.value}
    </Tag>
  );

  if (!chip.tooltipItems || chip.tooltipItems.length === 0) return tag;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{tag}</TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-0.5">
            {chip.tooltipItems.map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * CallLogsActiveFiltersBar sits below the Call Logs top bar (view tabs, line
 * select, date range, more filters), showing one removable chip per
 * currently-applied filter, plus "Save as Preset" and "Clear All" actions.
 * Like `LiveCallsBanner` and `BulkSelectionToolbar`, it doesn't hide itself —
 * render it only when `chips.length > 0`.
 *
 * A chip for a multi-value filter (e.g. several selected agents) should
 * summarize as a single chip — "Akhil, Nivedithatha +2 more" — with the full
 * list passed as `tooltipItems` so hovering reveals every value.
 *
 * @example
 * ```tsx
 * <CallLogsActiveFiltersBar
 *   chips={[
 *     { id: "duration", label: "Duration:", value: "Last 1 hour" },
 *     {
 *       id: "agents",
 *       label: "Agent:",
 *       value: "Akhil, Nivedithatha +2 more",
 *       tooltipItems: ["Akhil Yadav", "Nivedithatha N.", "Sumati Dixit", "Komal Rawat"],
 *     },
 *     { id: "ai-agent-eva", value: "Eva", icon: <Sparkles className="size-3" /> },
 *   ]}
 *   onRemoveChip={(id) => removeFilter(id)}
 *   onSaveAsPreset={() => setShowSavePresetModal(true)}
 *   onClearAll={() => resetFilters()}
 * />
 * ```
 */
const CallLogsActiveFiltersBar = React.forwardRef(
  (
    {
      chips,
      onRemoveChip,
      onSaveAsPreset,
      onClearAll,
      className,
      ...props
    }: CallLogsActiveFiltersBarProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-between gap-x-2 gap-y-2 border-b border-solid border-semantic-border-layout px-4 py-2",
          className
        )}
        {...props}
      >
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <ChipTag key={chip.id} chip={chip} onRemoveChip={onRemoveChip} />
          ))}
        </div>

        {(onSaveAsPreset || onClearAll) && (
          <div className="flex shrink-0 items-center gap-4">
            {onSaveAsPreset && (
              <button
                type="button"
                onClick={onSaveAsPreset}
                className="text-sm font-semibold text-semantic-text-link hover:underline"
              >
                Save as Preset
              </button>
            )}
            {onClearAll && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-sm font-semibold text-semantic-error-primary hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);
CallLogsActiveFiltersBar.displayName = "CallLogsActiveFiltersBar";

export { CallLogsActiveFiltersBar };
