import * as React from "react";
import { X } from "lucide-react";

import { cn } from "../../../../lib/utils";
import { Button } from "../../../ui/button";
import { Checkbox } from "../../../ui/checkbox";
import { MultiSelect } from "../../../ui/multi-select";
import { SelectField } from "../../../ui/select-field";
import {
  AI_HANDLING_OPTIONS,
  CALL_DIRECTION_OPTIONS,
  CALL_STATUS_OPTIONS,
  DURATION_OPTIONS,
  SOURCE_OPTIONS,
  TRANSFER_STATUS_OPTIONS,
} from "./types";
import type { CallLogsFilterPanelProps, CallLogsFilterValue } from "./types";

/* ── Section label + divider ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-semantic-text-muted">
        {children}
      </span>
      <span className="h-px w-full bg-semantic-border-layout" />
    </div>
  );
}

/* ── Pill toggle group (single-select) ── */

interface PillOption {
  value: string;
  label: string;
}

function PillToggleGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly PillOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-semantic-text-secondary">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={cn(
                "h-[30px] whitespace-nowrap rounded px-2 py-1.5 text-sm transition-colors",
                isSelected
                  ? "border-[0.8px] border-solid border-semantic-border-accent bg-semantic-brand-surface text-semantic-text-primary"
                  : "border border-solid border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-secondary hover:bg-semantic-bg-ui"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main component ── */

/**
 * CallLogsFilterPanel is a slide-out "Filters" drawer for the Call Logs page:
 * a sticky header, a scrollable middle section with call type, call
 * properties, and people/routing controls, and a sticky footer with
 * Reset / Save as New Preset / Apply Filter actions. Drop it into a
 * consumer-provided slide-out/drawer container — the panel itself fills the
 * available width and height.
 *
 * @example
 * ```tsx
 * <CallLogsFilterPanel
 *   resultCount={20}
 *   value={filters}
 *   onValueChange={setFilters}
 *   lineOptions={[{ value: "all", label: "All Numbers" }]}
 *   campaignOptions={[{ value: "diwali", label: "Diwali" }]}
 *   aiAgentOptions={[{ value: "all", label: "All AI Agents" }, { value: "aria", label: "Aria" }]}
 *   transferredToOptions={[{ value: "anyone", label: "Anyone" }, { value: "sales", label: "Sales" }]}
 *   agentOptions={[{ value: "rohit", label: "Rohit Sharma" }]}
 *   departmentOptions={[{ value: "sales", label: "Sales" }]}
 *   onClose={() => {}}
 *   onReset={() => {}}
 *   onSaveAsPreset={() => {}}
 *   onApply={() => {}}
 * />
 * ```
 */
const CallLogsFilterPanel = React.forwardRef(
  (
    {
      resultCount,
      value,
      onValueChange,
      lineOptions,
      campaignOptions,
      aiAgentOptions,
      transferredToOptions,
      agentOptions,
      departmentOptions,
      onClose,
      onReset,
      onSaveAsPreset,
      onApply,
      className,
      ...props
    }: CallLogsFilterPanelProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const patch = (partial: Partial<CallLogsFilterValue>) => {
      onValueChange({ ...value, ...partial });
    };

    const toggleMarker = (marker: keyof CallLogsFilterValue["callMarkers"]) => {
      onValueChange({
        ...value,
        callMarkers: {
          ...value.callMarkers,
          [marker]: !value.callMarkers[marker],
        },
      });
    };

    return (
      <div
        ref={ref}
        className={cn("flex h-full w-full flex-col bg-semantic-bg-primary", className)}
        {...props}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-solid border-semantic-border-layout p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-semantic-text-primary">Filters</span>
            <span className="text-sm text-semantic-text-muted">{resultCount} calls</span>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-semantic-bg-hover"
          >
            <X className="size-5 text-semantic-text-muted" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          {/* Call Type */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Call Type</SectionLabel>
            <MultiSelect
              label="Call Status"
              optionVariant="detailed"
              options={CALL_STATUS_OPTIONS}
              value={value.callStatus}
              onValueChange={(callStatus) => patch({ callStatus })}
            />
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <MultiSelect
                label="Call Direction"
                optionVariant="detailed"
                wrapperClassName="min-w-0 flex-1"
                options={CALL_DIRECTION_OPTIONS}
                value={value.callDirection}
                onValueChange={(callDirection) => patch({ callDirection })}
              />
              <SelectField
                label="Source"
                wrapperClassName="min-w-0 flex-1"
                options={SOURCE_OPTIONS}
                value={value.source}
                onValueChange={(source) => patch({ source })}
              />
            </div>
            <PillToggleGroup
              label="Duration"
              options={DURATION_OPTIONS}
              value={value.duration}
              onChange={(duration) => patch({ duration })}
            />
          </div>

          {/* Call Properties */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Call Properties</SectionLabel>
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <MultiSelect
                label="Phone Number (dialled)"
                optionVariant="detailed"
                wrapperClassName="min-w-0 flex-1"
                options={lineOptions}
                value={value.line}
                onValueChange={(line) => patch({ line })}
              />
              <MultiSelect
                label="Campaign Name"
                optionVariant="detailed"
                wrapperClassName="min-w-0 flex-1"
                options={campaignOptions}
                value={value.campaign}
                onValueChange={(campaign) => patch({ campaign })}
              />
            </div>
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <MultiSelect
                label="AI Handling"
                optionVariant="detailed"
                wrapperClassName="min-w-0 flex-1"
                options={AI_HANDLING_OPTIONS}
                value={value.aiHandling}
                onValueChange={(aiHandling) => patch({ aiHandling })}
              />
              <MultiSelect
                label="Transfer Status"
                optionVariant="detailed"
                wrapperClassName="min-w-0 flex-1"
                options={TRANSFER_STATUS_OPTIONS}
                value={value.transferStatus}
                onValueChange={(transferStatus) => patch({ transferStatus })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-semantic-text-secondary">
                Call Markers
              </span>
              <div className="flex items-center gap-4">
                <Checkbox
                  label="Notes"
                  checked={value.callMarkers.notes}
                  onCheckedChange={() => toggleMarker("notes")}
                />
                <Checkbox
                  label="Starred"
                  checked={value.callMarkers.starred}
                  onCheckedChange={() => toggleMarker("starred")}
                />
              </div>
            </div>
          </div>

          {/* People & Routing */}
          <div className="flex flex-col gap-4">
            <SectionLabel>People & Routing</SectionLabel>
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <MultiSelect
                label="Agent"
                optionVariant="detailed"
                wrapperClassName="min-w-0 flex-1"
                options={agentOptions}
                value={value.agents}
                onValueChange={(agents) => patch({ agents })}
              />
              <MultiSelect
                label="Department"
                optionVariant="detailed"
                wrapperClassName="min-w-0 flex-1"
                options={departmentOptions}
                value={value.departments}
                onValueChange={(departments) => patch({ departments })}
              />
            </div>
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <MultiSelect
                label="AI Agent"
                optionVariant="detailed"
                wrapperClassName="min-w-0 flex-1"
                options={aiAgentOptions}
                value={value.aiAgent}
                onValueChange={(aiAgent) => patch({ aiAgent })}
              />
              <MultiSelect
                label="Transferred to"
                optionVariant="detailed"
                wrapperClassName="min-w-0 flex-1"
                options={transferredToOptions}
                value={value.transferredTo}
                onValueChange={(transferredTo) => patch({ transferredTo })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-solid border-semantic-border-layout px-4 py-3">
          <Button type="button" variant="ghost" className="h-10" onClick={onReset}>
            Reset
          </Button>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button type="button" variant="outline" className="h-10" onClick={onSaveAsPreset}>
              Save as New Preset
            </Button>
            <Button type="button" variant="default" className="h-10" onClick={onApply}>
              Apply Filter
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
CallLogsFilterPanel.displayName = "CallLogsFilterPanel";

export { CallLogsFilterPanel };
