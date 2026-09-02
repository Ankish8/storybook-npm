/**
 * TEMPORARY test harness composing every Call Logs component together into one
 * working screen, to sanity-check that they interoperate correctly.
 * DELETE THIS FILE when done — it is not a real component, has no tests, and
 * is not registered in components.yaml or src/index.ts.
 */
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

/** Exact "More Filters" glyph from the design (Figma `settings-2`). */
function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10.5 12.75H3.75M10.5 12.75C10.5 13.9926 11.5074 15 12.75 15C13.9926 15 15 13.9926 15 12.75C15 11.5074 13.9926 10.5 12.75 10.5C11.5074 10.5 10.5 11.5074 10.5 12.75ZM14.25 5.25H7.5M7.5 5.25C7.5 6.49264 6.49264 7.5 5.25 7.5C4.00736 7.5 3 6.49264 3 5.25C3 4.00736 4.00736 3 5.25 3C6.49264 3 7.5 4.00736 7.5 5.25Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import { Badge } from "@/components/ui/badge";
import { SelectField } from "@/components/ui/select-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/ui/page-header";
import { PaginationWidget } from "@/components/ui/pagination";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { FormModal } from "@/components/ui/form-modal";
import type { DateRangeValue } from "@/components/ui/date-range-picker";
import type { MultiSelectOption } from "@/components/ui/multi-select";

import { CallLogs, AiSparkIcon, type CallLogsProps } from "@/components/custom/call-logs/call-logs";
import { LiveCallsBanner } from "@/components/custom/call-logs/live-calls-banner";
import { BulkSelectionToolbar } from "@/components/custom/call-logs/bulk-selection-toolbar";
import { RecordingPlaybackBar } from "@/components/custom/call-logs/recording-playback-bar";
import { CallLogsSearchBar } from "@/components/custom/call-logs/call-logs-search-bar";
import {
  CallLogsFilterPanel,
  CALL_STATUS_OPTIONS,
  CALL_DIRECTION_OPTIONS,
  SOURCE_OPTIONS,
  DURATION_OPTIONS,
  AI_HANDLING_OPTIONS,
  TRANSFER_STATUS_OPTIONS,
  type CallLogsFilterValue,
} from "@/components/custom/call-logs/call-logs-filter-panel";
import { CallDetailPanel } from "@/components/custom/call-logs/call-detail-panel";
import { CallLogsAddNoteModal } from "@/components/custom/call-logs/call-logs-add-note-modal";
import { CallLogsSavePresetModal } from "@/components/custom/call-logs/call-logs-save-preset-modal";
import {
  CallLogsActiveFiltersBar,
  type CallLogsActiveFilterChip,
} from "@/components/custom/call-logs/call-logs-active-filters-bar";
import { CallJourneyJsonModal } from "@/components/custom/call-logs/call-journey-json-modal";
import { CallLogsEditContactModal } from "@/components/custom/call-logs/call-logs-edit-contact-modal";
import { CallLogsAddContactModal } from "@/components/custom/call-logs/call-logs-add-contact-modal";
import { CallLogsBlockContactModal } from "@/components/custom/call-logs/call-logs-block-contact-modal";
import { CallLogsViewTabs, type CallLogsViewTab } from "@/components/custom/call-logs/call-logs-view-tabs";
import {
  CallLogsCustomizeTabsModal,
  type CallLogsCustomizeTabsView,
} from "@/components/custom/call-logs/call-logs-customize-tabs-modal";
import { CallLogsDateRangeFilter } from "@/components/custom/call-logs/call-logs-date-range-filter";
import { CallLogsLineSelect } from "@/components/custom/call-logs/call-logs-line-select";

/* ── Sample data ── */

const ROWS: (CallLogsProps & { id: string })[] = [
  {
    id: "row-1",
    status: "connected",
    isLive: true,
    phoneNumber: "+91 98765 43210",
    handledBy: { type: "connecting" },
    actions: { type: "none" },
  },
  {
    id: "row-2",
    status: "connected",
    isLive: true,
    phoneNumber: "+91 98765 43210",
    handledBy: { type: "agent", agentName: "Komal R.", department: "Customer support" },
    time: "07:00 PM",
    duration: "2m 48s",
    isOngoing: true,
    actions: { type: "live" },
  },
  {
    id: "row-3",
    status: "connected",
    phoneNumber: "+91 98201 45632",
    callerName: "Priya Sharma",
    hasNote: true,
    handledBy: {
      type: "bot-handoff",
      botName: "Eva",
      agentName: "Nivedithatha N.",
      department: "Customer support",
    },
    time: "05:00 PM",
    duration: "6m 48s",
    actions: { type: "none" },
    expandable: true,
  },
  {
    id: "row-4",
    status: "ai-handled",
    phoneNumber: "+91 98765 43210",
    callerName: "Rohit Mishra",
    handledBy: { type: "bot", botName: "Eva" },
    time: "05:00 PM",
    duration: "5m 48s",
    actions: { type: "none" },
    expandable: true,
  },
  {
    id: "row-5",
    status: "missed",
    phoneNumber: "+91 90045 88123",
    handledBy: {
      type: "bot-handoff",
      botName: "Arina",
      department: "Customer Support",
      missed: true,
    },
    time: "05:00 PM",
    duration: "5m 48s",
    actions: { type: "none" },
    expandable: true,
  },
  {
    id: "row-6",
    status: "neutral",
    phoneNumber: "+91 98765 43210",
    callerName: "Ananya Iyer",
    handledBy: { type: "campaign", campaignName: "Q3 Enterprise Campaign" },
    time: "05:00 PM",
    duration: "5m 48s",
    actions: { type: "none" },
    expandable: true,
  },
];

const DEFAULT_FILTER_VALUE: CallLogsFilterValue = {
  callStatus: [],
  callDirection: [],
  source: "all",
  duration: "all",
  line: [],
  campaign: [],
  aiHandling: [],
  transferStatus: [],
  callMarkers: { notes: false, starred: false },
  agents: [],
  departments: [],
  aiAgent: [],
  transferredTo: [],
};

function countActiveFilters(value: CallLogsFilterValue) {
  return (
    value.callStatus.length +
    value.callDirection.length +
    Number(value.source !== "all") +
    Number(value.duration !== "all") +
    value.line.length +
    value.campaign.length +
    value.aiHandling.length +
    value.transferStatus.length +
    Number(value.callMarkers.notes) +
    Number(value.callMarkers.starred) +
    value.agents.length +
    value.departments.length +
    value.aiAgent.length +
    value.transferredTo.length
  );
}

// Used by the top-bar CallLogsLineSelect, which has its own pinned "All Phone
// Numbers" select-all row (via `selectAllLabel`) — no plain "all" entry here,
// that would duplicate it.
const LINE_MULTI_OPTIONS: MultiSelectOption[] = [
  { value: "1800-200-1234", label: "1800 200 1234" },
  { value: "1800-200-4323", label: "1800 200 4323" },
  { value: "1800-300-4567", label: "1800 300 4567" },
  { value: "1800-300-4367", label: "1800 300 4367" },
  { value: "+91-22-4890-2211", label: "+91 22 4890 2211" },
  { value: "+91-80-4567-8901", label: "+91 80 4567 8901" },
];
// Used by CallLogsFilterPanel's "Phone Number (dialled)" field, which shows
// "All Numbers" as a plain flat checkbox option rather than a pinned select-all row.
const FILTER_PANEL_LINE_OPTIONS: MultiSelectOption[] = [
  { value: "all", label: "All Numbers" },
  ...LINE_MULTI_OPTIONS,
];
const CAMPAIGN_OPTIONS = [
  { value: "all", label: "All" },
  { value: "click-to-call", label: "Click-to-Call" },
  { value: "peer-to-peer", label: "Campaign · Peer-to-peer" },
  { value: "broadcasting", label: "Campaign · Broadcasting" },
];
const AI_AGENT_OPTIONS = [
  { value: "all", label: "All AI Agents" },
  { value: "aria", label: "Aria" },
  { value: "eva", label: "Eva" },
];
const TRANSFERRED_TO_OPTIONS = [
  { value: "anyone", label: "Anyone" },
  { value: "sales", label: "Sales Team" },
];
const AGENT_OPTIONS = [
  { value: "all", label: "All Agents" },
  { value: "priya", label: "Priya Nair" },
  { value: "rohit", label: "Rohit Sharma" },
  { value: "aisha", label: "Aisha Khan" },
];
const DEPARTMENT_OPTIONS = [
  { value: "all", label: "All Department" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "customer-success", label: "Customer Success" },
];

function buildActiveFilterChips(value: CallLogsFilterValue): CallLogsActiveFilterChip[] {
  const chips: CallLogsActiveFilterChip[] = [];
  const pushOption = (
    id: string,
    label: string | undefined,
    optionValue: string,
    options: readonly { value: string; label: string }[]
  ) => {
    if (optionValue === "all") return;
    const optionLabel = options.find((o) => o.value === optionValue)?.label;
    if (optionLabel) chips.push({ id, label, value: optionLabel });
  };

  // Multi-value filters summarize as ONE chip — the first two labels plus a
  // "+N more" count once there are more than two — with the full list passed
  // as `tooltipItems` so hovering the chip reveals every selected value.
  const pushGroupedOption = (
    id: string,
    label: string | undefined,
    optionValues: string[],
    options: readonly { value: string; label: string }[],
    icon?: React.ReactNode
  ) => {
    const labels = optionValues
      .map((v) => options.find((o) => o.value === v)?.label)
      .filter((l): l is string => Boolean(l));
    if (labels.length === 0) return;

    const visible = labels.slice(0, 2);
    const overflow = labels.length - visible.length;
    const summary = overflow > 0 ? `${visible.join(", ")} +${overflow} more` : visible.join(", ");

    chips.push({
      id,
      label,
      value: summary,
      icon,
      tooltipItems: overflow > 0 ? labels : undefined,
    });
  };

  pushGroupedOption("callStatus", "Call Status:", value.callStatus, CALL_STATUS_OPTIONS);
  pushGroupedOption("callDirection", "Call:", value.callDirection, CALL_DIRECTION_OPTIONS);
  pushOption("source", "Source:", value.source, SOURCE_OPTIONS);
  pushOption("duration", "Duration:", value.duration, DURATION_OPTIONS);
  pushGroupedOption("line", "Line:", value.line, FILTER_PANEL_LINE_OPTIONS);
  pushGroupedOption("campaign", "Campaign:", value.campaign, CAMPAIGN_OPTIONS);
  pushGroupedOption("aiHandling", "AI Handling:", value.aiHandling, AI_HANDLING_OPTIONS);
  pushGroupedOption("transferStatus", "Transfer Status:", value.transferStatus, TRANSFER_STATUS_OPTIONS);

  if (value.callMarkers.notes) chips.push({ id: "marker-notes", value: "Notes" });
  if (value.callMarkers.starred) chips.push({ id: "marker-starred", value: "Starred" });

  pushGroupedOption("agent", "Agent:", value.agents, AGENT_OPTIONS);
  pushGroupedOption("department", "Department:", value.departments, DEPARTMENT_OPTIONS);
  pushGroupedOption(
    "aiAgent",
    "AI Agent:",
    value.aiAgent,
    AI_AGENT_OPTIONS,
    <AiSparkIcon className="size-3 shrink-0 text-semantic-text-link" />
  );
  pushGroupedOption("transferredTo", "Transferred to:", value.transferredTo, TRANSFERRED_TO_OPTIONS);

  return chips;
}

function removeActiveFilterChip(value: CallLogsFilterValue, id: string): CallLogsFilterValue {
  if (id === "source") return { ...value, source: "all" };
  if (id === "duration") return { ...value, duration: "all" };
  if (id === "marker-notes") {
    return { ...value, callMarkers: { ...value.callMarkers, notes: false } };
  }
  if (id === "marker-starred") {
    return { ...value, callMarkers: { ...value.callMarkers, starred: false } };
  }
  // Grouped chips summarize a whole multi-select filter, so removing the chip
  // clears every value in that filter, not just one.
  if (id === "callStatus") return { ...value, callStatus: [] };
  if (id === "callDirection") return { ...value, callDirection: [] };
  if (id === "line") return { ...value, line: [] };
  if (id === "campaign") return { ...value, campaign: [] };
  if (id === "aiHandling") return { ...value, aiHandling: [] };
  if (id === "transferStatus") return { ...value, transferStatus: [] };
  if (id === "agent") return { ...value, agents: [] };
  if (id === "department") return { ...value, departments: [] };
  if (id === "aiAgent") return { ...value, aiAgent: [] };
  if (id === "transferredTo") return { ...value, transferredTo: [] };
  return value;
}

const TRANSFER_TARGET_OPTIONS = [
  { value: "sales", label: "Sales Team" },
  { value: "support", label: "Support" },
];

const CALL_JOURNEY_JSON = JSON.stringify(
  {
    status: "success",
    code: 200,
    filters: [
      { id: "1", name: "Source of logs", parent_id: "0" },
      { id: "2", name: "Myoperator IVR", parent_id: "1" },
      { id: "3", name: "Mobile", parent_id: "1" },
      { id: "4", name: "Event of logs", parent_id: "0" },
      { id: "5", name: "Incoming", parent_id: "4" },
      { id: "6", name: "Outgoing", parent_id: "4" },
      { id: "7", name: " Type of logs ", parent_id: "0" },
      { id: "8", name: "Call", parent_id: "7" },
      { id: "9", name: "SMS", parent_id: "7" },
      { id: "11", name: "Status of logs", parent_id: "0" },
      { id: "12", name: "Connected", parent_id: "11" },
      { id: "13", name: "Missed", parent_id: "11" },
      { id: "14", name: "Voicemail", parent_id: "11" },
      { id: "15", name: "Tags", parent_id: "0" },
      { id: "21", name: "Call property", parent_id: "0" },
      { id: "22", name: "Noted", parent_id: "21" },
      { id: "23", name: "Archived", parent_id: "21" },
      { id: "24", name: "Star Marked", parent_id: "21" },
      { id: "25", name: "Two word filters", parent_id: "0" },
      { id: "26", name: "Incoming Myoperator IVR", parent_id: "25" },
      { id: "27", name: "Incoming Mobile", parent_id: "25" },
      { id: "28", name: "Outgoing MyOperator IVR", parent_id: "25" },
      { id: "29", name: "Outgoing Mobile", parent_id: "25" },
      { id: "30", name: "Incoming Call", parent_id: "25" },
      { id: "31", name: "Incoming SMS", parent_id: "25" },
      { id: "33", name: "Outgoing Call ", parent_id: "25" },
      { id: "34", name: "Outgoing SMS", parent_id: "25" },
      { id: "36", name: "Three word filters", parent_id: "0" },
      { id: "37", name: "Incoming Connected Call", parent_id: "36" },
      { id: "38", name: "Incoming Missed Call", parent_id: "36" },
      { id: "39", name: "Unnoted", parent_id: "21" },
      { id: "40", name: "ClickOcalls", parent_id: "15" },
      { id: "41", name: "OBD Calls", parent_id: "15" },
      { id: "42", name: "Callbacks", parent_id: "15" },
    ],
  },
  null,
  2
);

type Drawer = { type: "filters" } | { type: "detail"; rowId: string } | null;

/* ── The composed page ── */

function CallLogsCompletePage() {
  // `customizeViews` is the single source of truth for the view-tab bar: its
  // `pinned` order/flag drives both which views show inline as tabs (via the
  // derived `viewTabs`/`maxVisiblePresets` below) and which show only in the
  // "More" dropdown — pinning/unpinning in CallLogsCustomizeTabsModal changes
  // that directly, rather than a separate, disconnected state.
  const [customizeViews, setCustomizeViews] = React.useState<CallLogsCustomizeTabsView[]>([
    { id: "all", label: "All", count: 23, pinned: true, isDefault: true },
    { id: "missed-by-agent", label: "Missed by Agent", count: 5, pinned: true },
    { id: "connected", label: "Connected", count: 12, pinned: true },
    { id: "ai-handled", label: "AI Handled", count: 20, pinned: true },
    { id: "voicemail", label: "Voicemail", count: 2, pinned: true },
    { id: "incoming", label: "Incoming", count: 20, pinned: false },
    { id: "outgoing", label: "Outgoing", count: 1, pinned: false },
    { id: "starred", label: "Starred", count: 2, pinned: false },
    { id: "with-notes", label: "With Notes", count: 4, pinned: false },
    { id: "recorded", label: "Recorded", count: 12, pinned: false },
  ]);
  // `customizeViews` keeps pinned entries first (see CallLogsCustomizeTabsModal's
  // reorder/pin logic), so capping CallLogsViewTabs' inline count at exactly
  // the pinned, non-default count reproduces "pinned → inline tab,
  // available → More dropdown" using its existing overflow mechanism.
  const viewTabs: CallLogsViewTab[] = customizeViews.map((view) => ({
    id: view.id,
    label: view.label,
    removable: !view.isDefault,
    count: view.count,
  }));
  const pinnedRemovableCount = customizeViews.filter((view) => view.pinned && !view.isDefault).length;
  const [activeViewTabId, setActiveViewTabId] = React.useState("all");
  const [presetToRemove, setPresetToRemove] = React.useState<CallLogsViewTab | null>(null);
  const [showRemovePresetConfirm, setShowRemovePresetConfirm] = React.useState(false);
  const [showCustomizeTabsModal, setShowCustomizeTabsModal] = React.useState(false);

  const [selectedRowIds, setSelectedRowIds] = React.useState<Set<string>>(new Set());
  const [playingRowId, setPlayingRowId] = React.useState<string | null>(null);
  const [liveBannerExpanded, setLiveBannerExpanded] = React.useState(true);
  const [favoriteRowIds, setFavoriteRowIds] = React.useState<Set<string>>(new Set());
  // Overrides ROWS's static `callerName` once a contact is added/edited via
  // the detail panel, so the row/panel switch from "Add Contact" to "Edit
  // Contact" immediately — sanity-checking the full add-contact loop.
  const [contactNamesByRow, setContactNamesByRow] = React.useState<Record<string, string>>({});
  const getCallerName = (row: { id: string; callerName?: string }) =>
    contactNamesByRow[row.id] ?? row.callerName;

  const [drawer, setDrawer] = React.useState<Drawer>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery) return [];
    const seen = new Set<string>();
    return ROWS.filter((row) => {
      if (!row.phoneNumber.includes(searchQuery) || seen.has(row.phoneNumber)) return false;
      seen.add(row.phoneNumber);
      return true;
    }).map((row) => ({ value: row.id, label: row.phoneNumber }));
  }, [searchQuery]);
  const [filterValue, setFilterValue] = React.useState<CallLogsFilterValue>(DEFAULT_FILTER_VALUE);
  const [appliedFilterValue, setAppliedFilterValue] = React.useState<CallLogsFilterValue>(DEFAULT_FILTER_VALUE);
  const activeFilterChips = React.useMemo(
    () => buildActiveFilterChips(appliedFilterValue),
    [appliedFilterValue]
  );
  const [showSavePresetModal, setShowSavePresetModal] = React.useState(false);
  const presetIdCounter = React.useRef(0);
  const [notesByRow, setNotesByRow] = React.useState<Record<string, { author: string; timestamp: string; text: string }[]>>({
    "row-3": [{ author: "Priya Nair", timestamp: "Today, 05:08 PM", text: "Customer reported intermittent login failures since Monday." }],
  });
  const [noteDraft, setNoteDraft] = React.useState("");
  const [detailTab, setDetailTab] = React.useState<"notes" | "call-log">("notes");

  const [dateRange, setDateRange] = React.useState<DateRangeValue>({});
  const [selectedLines, setSelectedLines] = React.useState<string[]>([]);
  const [showEndCallConfirm, setShowEndCallConfirm] = React.useState(false);
  const [showNotesModal, setShowNotesModal] = React.useState(false);
  const [noteRowId, setNoteRowId] = React.useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = React.useState(false);
  const [transferTarget, setTransferTarget] = React.useState("");
  const [showJourneyJsonModal, setShowJourneyJsonModal] = React.useState(false);
  const [showEditContactModal, setShowEditContactModal] = React.useState(false);
  const [showAddContactModal, setShowAddContactModal] = React.useState(false);
  const [showBlockContactModal, setShowBlockContactModal] = React.useState(false);

  const activeDetailRow = drawer?.type === "detail" ? ROWS.find((r) => r.id === drawer.rowId) : undefined;

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-semantic-bg-ui p-6">
      <div className="mx-auto max-w-[1220px] rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary">
        <PageHeader
          title="Call Logs"
          badge={<Badge variant="disabled">21 calls</Badge>}
          showBorder={false}
          layout="responsive"
          actions={
            <CallLogsSearchBar
              wrapperClassName="w-full sm:w-[423px]"
              value={searchQuery}
              onValueChange={setSearchQuery}
              suggestions={searchSuggestions}
              onSelect={(s) => setSearchQuery(s.label)}
              onClear={() => setSearchQuery("")}
            />
          }
        />

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3">
          <CallLogsViewTabs
            tabs={viewTabs}
            activeTabId={activeViewTabId}
            onTabChange={setActiveViewTabId}
            maxVisiblePresets={pinnedRemovableCount}
            onRemoveTab={(id) => {
              const tab = viewTabs.find((t) => t.id === id);
              if (!tab) return;
              setPresetToRemove(tab);
              setShowRemovePresetConfirm(true);
            }}
            onCustomize={() => setShowCustomizeTabsModal(true)}
          />
          <div className="flex flex-wrap items-center gap-[10px]">
            <CallLogsLineSelect
              options={LINE_MULTI_OPTIONS}
              value={selectedLines}
              onValueChange={setSelectedLines}
              // The trigger always reads "All Phone Numbers" regardless of
              // selection (see placeholder/selectAllLabel/summaryLabel below),
              // so it must never fall into MultiSelect's muted placeholder
              // color for the zero-selected state — force the real label color.
              triggerClassName="w-fit [&_span]:!text-semantic-text-secondary"
              placeholder="All Phone Numbers"
              selectAllLabel="All Phone Numbers"
              summaryLabel={() => "All Phone Numbers"}
            />
            <CallLogsDateRangeFilter
              value={dateRange}
              onValueChange={setDateRange}
              className="w-fit"
              triggerClassName="w-fit"
              triggerLabelClassName="sr-only sm:not-sr-only sm:inline"
            />
            <Button
              variant="outline"
              size="control"
              aria-label="More Filters"
              leftIcon={<FilterIcon className="text-semantic-text-muted" />}
              onClick={() => {
                setFilterValue(appliedFilterValue);
                setDrawer({ type: "filters" });
              }}
            >
              <span className="hidden sm:inline">More Filters</span>
            </Button>
          </div>
        </div>

        {activeFilterChips.length > 0 && (
          <CallLogsActiveFiltersBar
            chips={activeFilterChips}
            onRemoveChip={(id) =>
              setAppliedFilterValue((prev) => removeActiveFilterChip(prev, id))
            }
            onSaveAsPreset={() => {
              setFilterValue(appliedFilterValue);
              setShowSavePresetModal(true);
            }}
            onClearAll={() => setAppliedFilterValue(DEFAULT_FILTER_VALUE)}
          />
        )}

        {selectedRowIds.size > 0 && (
          <BulkSelectionToolbar
            selectedCount={selectedRowIds.size}
            actions={[{ label: "Download Recordings", onClick: () => {} }]}
            onClose={() => setSelectedRowIds(new Set())}
          />
        )}
        {playingRowId && drawer === null && (() => {
          const playingRow = ROWS.find((r) => r.id === playingRowId);
          return (
            <RecordingPlaybackBar
              phoneNumber={playingRow?.phoneNumber ?? ""}
              callerName={playingRow?.callerName}
              timestamp={playingRow?.time}
              duration={playingRow?.duration}
              isPlaying
              onTogglePlay={() => setPlayingRowId(null)}
              onClose={() => setPlayingRowId(null)}
            />
          );
        })()}

        {/* Below `sm`, the What/When columns hide (see CallLogs row) so the
            table reads as a single Who column — no horizontal scroll needed.
            From `sm` up it's the full dense multi-column table. */}
        <div className="overflow-x-auto">
          <div className="sm:min-w-[800px]">
            <div className="flex items-center border-b border-solid border-semantic-border-layout bg-[var(--color-neutral-50)]">
              <div className="flex shrink-0 items-center px-4 py-3">
                <Checkbox
                  checked={selectedRowIds.size === ROWS.length}
                  onCheckedChange={(checked) =>
                    setSelectedRowIds(checked ? new Set(ROWS.map((r) => r.id)) : new Set())
                  }
                  size="sm"
                  checkboxClassName="border data-[state=unchecked]:border-[var(--color-neutral-300)]"
                  aria-label="Select all calls"
                />
              </div>
              <span className="min-w-0 flex-[2] px-4 py-3 text-sm font-semibold text-semantic-text-muted">
                Who
              </span>
              <span className="hidden min-w-0 flex-[3] px-4 py-3 text-sm font-semibold text-semantic-text-muted sm:block">
                What
              </span>
              <span className="hidden w-[160px] shrink-0 px-4 py-3 text-sm font-semibold text-semantic-text-muted sm:block">
                When
              </span>
              <div className="hidden flex-1 px-6 sm:block" aria-hidden="true" />
            </div>

            {liveBannerExpanded && (
              <LiveCallsBanner count={2} expanded={liveBannerExpanded} onToggle={() => setLiveBannerExpanded((v) => !v)} />
            )}

            {ROWS.map((row) => (
              <CallLogs
                key={row.id}
                {...row}
                callerName={getCallerName(row)}
                checked={selectedRowIds.has(row.id)}
                onCheckedChange={(checked) => toggleRow(row.id, checked === true)}
                onClick={row.expandable ? () => setDrawer({ type: "detail", rowId: row.id }) : undefined}
                actions={
                  row.actions?.type === "live"
                    ? {
                        type: "live",
                        onTransfer: () => setShowTransferModal(true),
                        onSelectNotes: () => {
                          setNoteRowId(row.id);
                          setShowNotesModal(true);
                        },
                        onSelectEndCall: () => setShowEndCallConfirm(true),
                      }
                    : row.actions
                }
              />
            ))}
          </div>
        </div>

        <div className="p-4">
          <PaginationWidget
            currentPage={2}
            totalPages={7}
            totalItems={21}
            pageSize={3}
            onPageChange={() => {}}
          />
        </div>
      </div>

      {/* Right-side drawer: Filters / Call Detail / Call Journey */}
      {drawer && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setDrawer(null)} />
          <div className="fixed right-0 top-0 z-50 h-full w-full max-w-[606px] shadow-lg" onClick={(e) => e.stopPropagation()}>
            {drawer.type === "filters" && (
              <CallLogsFilterPanel
                resultCount={21}
                value={filterValue}
                onValueChange={setFilterValue}
                lineOptions={FILTER_PANEL_LINE_OPTIONS}
                campaignOptions={CAMPAIGN_OPTIONS}
                aiAgentOptions={AI_AGENT_OPTIONS}
                transferredToOptions={TRANSFERRED_TO_OPTIONS}
                agentOptions={AGENT_OPTIONS}
                departmentOptions={DEPARTMENT_OPTIONS}
                onClose={() => setDrawer(null)}
                onReset={() => setFilterValue(DEFAULT_FILTER_VALUE)}
                onApply={() => {
                  setAppliedFilterValue(filterValue);
                  setDrawer(null);
                }}
                onSaveAsPreset={() => setShowSavePresetModal(true)}
              />
            )}
            {drawer.type === "detail" && activeDetailRow && (
              <CallDetailPanel
                phoneNumber={activeDetailRow.phoneNumber}
                callerName={getCallerName(activeDetailRow)}
                callUid="cn3.1785493923.4087398"
                elapsedTime="1:01"
                totalTime="3:12"
                isFavorite={favoriteRowIds.has(activeDetailRow.id)}
                onToggleFavorite={() =>
                  setFavoriteRowIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(activeDetailRow.id)) next.delete(activeDetailRow.id);
                    else next.add(activeDetailRow.id);
                    return next;
                  })
                }
                isPlaying={playingRowId === activeDetailRow.id}
                onTogglePlay={() =>
                  setPlayingRowId((current) =>
                    current === activeDetailRow.id ? null : activeDetailRow.id
                  )
                }
                playedRatio={0.33}
                aiSummary="Customer confirmed the issue would be resolved within 24 hours. No follow-up escalation is required."
                activeTab={detailTab}
                onTabChange={setDetailTab}
                notes={notesByRow[activeDetailRow.id] ?? []}
                noteDraft={noteDraft}
                onNoteDraftChange={setNoteDraft}
                onSaveNote={() => {
                  if (!noteDraft.trim()) return;
                  setNotesByRow((prev) => ({
                    ...prev,
                    [activeDetailRow.id]: [
                      ...(prev[activeDetailRow.id] ?? []),
                      { author: "You", timestamp: "Just now", text: noteDraft },
                    ],
                  }));
                  setNoteDraft("");
                }}
                logEntries={[
                  { title: "Call Received Entry", timestamp: "10:24:02", duration: "0s" },
                  { title: "Entered Call IVR Flow", timestamp: "10:24:17", duration: "15s" },
                  { title: "Voicebot Session Leg", timestamp: "10:24:32", duration: "102s", current: true },
                  { title: "Call Ended", timestamp: "10:26:14" },
                ]}
                onViewDetailedLogs={() => setShowJourneyJsonModal(true)}
                onEditContact={() => setShowEditContactModal(true)}
                onAddContact={() => setShowAddContactModal(true)}
                onBlockCaller={() => setShowBlockContactModal(true)}
                onClose={() => setDrawer(null)}
              />
            )}
          </div>
        </>
      )}

      <CallJourneyJsonModal
        open={showJourneyJsonModal}
        onOpenChange={setShowJourneyJsonModal}
        json={CALL_JOURNEY_JSON}
      />

      <CallLogsEditContactModal
        open={showEditContactModal}
        onOpenChange={setShowEditContactModal}
        defaultName={activeDetailRow ? getCallerName(activeDetailRow) : undefined}
        defaultPhoneNumber={activeDetailRow?.phoneNumber}
        onSave={() => setShowEditContactModal(false)}
      />

      <CallLogsAddContactModal
        open={showAddContactModal}
        onOpenChange={setShowAddContactModal}
        defaultPhoneNumber={activeDetailRow?.phoneNumber}
        onSave={(values) => {
          if (activeDetailRow) {
            setContactNamesByRow((prev) => ({
              ...prev,
              [activeDetailRow.id]: values.name,
            }));
          }
          setShowAddContactModal(false);
        }}
      />

      <CallLogsBlockContactModal
        open={showBlockContactModal}
        onOpenChange={setShowBlockContactModal}
        phoneNumber={activeDetailRow?.phoneNumber ?? ""}
        defaultName={activeDetailRow ? getCallerName(activeDetailRow) : undefined}
        onBlock={() => setShowBlockContactModal(false)}
      />

      {/* Reused-modal demos: End Call + Transfer Call, composed from existing library modals */}
      <ConfirmationModal
        open={showEndCallConfirm}
        onOpenChange={setShowEndCallConfirm}
        title="End Call"
        description="Are you sure you want to hang up +91 98765 43210?"
        variant="destructive"
        confirmButtonText="Confirm"
        onConfirm={() => setShowEndCallConfirm(false)}
      />

      <ConfirmationModal
        open={showRemovePresetConfirm}
        onOpenChange={setShowRemovePresetConfirm}
        title={`Remove '${presetToRemove?.label ?? ""}' Preset?`}
        description="Are you sure you want to remove this tab? You can always re-add presets anytime from Filters."
        cancelButtonText="Keep Tab"
        confirmButtonText="Yes, Remove"
        onConfirm={() => {
          if (presetToRemove) {
            setCustomizeViews((prev) => prev.filter((v) => v.id !== presetToRemove.id));
            if (activeViewTabId === presetToRemove.id) setActiveViewTabId("all");
          }
          setShowRemovePresetConfirm(false);
        }}
      />

      <CallLogsSavePresetModal
        open={showSavePresetModal}
        onOpenChange={setShowSavePresetModal}
        filterCount={countActiveFilters(filterValue)}
        onCancel={() => setShowSavePresetModal(false)}
        onSave={(name) => {
          presetIdCounter.current += 1;
          const id = `preset-${presetIdCounter.current}`;
          // New presets are pinned by default (immediately visible as a tab) —
          // insert after the existing pinned views, before the available ones,
          // to keep customizeViews' pinned-first ordering invariant intact.
          setCustomizeViews((prev) => {
            const pinned = prev.filter((view) => view.pinned);
            const available = prev.filter((view) => !view.pinned);
            return [...pinned, { id, label: name, pinned: true }, ...available];
          });
          setActiveViewTabId(id);
          // The saved preset is now represented by its own tab — clear the
          // loose active-filters chip bar rather than leaving it showing the
          // same filters, which would look like nothing was saved.
          setAppliedFilterValue(DEFAULT_FILTER_VALUE);
          setShowSavePresetModal(false);
          setDrawer(null);
        }}
      />

      <CallLogsCustomizeTabsModal
        open={showCustomizeTabsModal}
        onOpenChange={setShowCustomizeTabsModal}
        views={customizeViews}
        onViewsChange={setCustomizeViews}
        onDone={() => setShowCustomizeTabsModal(false)}
      />

      <CallLogsAddNoteModal
        open={showNotesModal}
        onOpenChange={setShowNotesModal}
        onSave={(note) => {
          if (noteRowId) {
            setNotesByRow((prev) => ({
              ...prev,
              [noteRowId]: [
                ...(prev[noteRowId] ?? []),
                { author: "You", timestamp: "Just now", text: note },
              ],
            }));
          }
          setShowNotesModal(false);
        }}
      />

      <FormModal
        open={showTransferModal}
        onOpenChange={setShowTransferModal}
        title="Transfer Call"
        description="This call will be transferred from +91 9877665432."
        saveButtonText="Transfer Call"
        onSave={() => setShowTransferModal(false)}
      >
        <SelectField
          label="Transfer to"
          options={TRANSFER_TARGET_OPTIONS}
          value={transferTarget}
          onValueChange={setTransferTarget}
        />
      </FormModal>
    </div>
  );
}

/* ── Story ── */

const meta: Meta<typeof CallLogsCompletePage> = {
  title: "zz Test (delete me)/Call Logs Complete Page",
  component: CallLogsCompletePage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CompletePage: Story = {};
