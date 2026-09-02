import type * as React from "react";
import type { SelectOption } from "../../../ui/select-field";
import type { MultiSelectOption } from "../../../ui/multi-select";

export interface CallLogsFilterValue {
  callStatus: string[];
  callDirection: string[];
  source: string;
  duration: string;
  line: string[];
  campaign: string[];
  aiHandling: string[];
  transferStatus: string[];
  callMarkers: { notes: boolean; starred: boolean };
  agents: string[];
  departments: string[];
  aiAgent: string[];
  transferredTo: string[];
}

export interface CallLogsFilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Result count shown in the header, e.g. 20 -> "20 calls" */
  resultCount: number;
  /** Current filter selections (fully controlled) */
  value: CallLogsFilterValue;
  /** Called with the next value whenever any field changes */
  onValueChange: (value: CallLogsFilterValue) => void;
  /** Options for the "Phone Number (dialled)" multi-select */
  lineOptions: MultiSelectOption[];
  /** Options for the "Campaign Name" multi-select */
  campaignOptions: MultiSelectOption[];
  /** Options for the "AI Agent" multi-select */
  aiAgentOptions: MultiSelectOption[];
  /** Options for the "Transferred to" multi-select */
  transferredToOptions: MultiSelectOption[];
  /** Options for the "Agent" multi-select */
  agentOptions: MultiSelectOption[];
  /** Options for the "Department" multi-select */
  departmentOptions: MultiSelectOption[];
  /** Called when the close (X) button is clicked */
  onClose?: () => void;
  /** Called when "Reset" is clicked */
  onReset?: () => void;
  /** Called when "Save as New Preset" is clicked */
  onSaveAsPreset?: () => void;
  /** Called when "Apply Filter" is clicked */
  onApply?: () => void;
}

export const CALL_STATUS_OPTIONS: MultiSelectOption[] = [
  { value: "all", label: "All calls" },
  { value: "connected", label: "Connected" },
  { value: "missed", label: "Missed" },
  { value: "voicemail", label: "Voicemail" },
];

export const CALL_DIRECTION_OPTIONS: MultiSelectOption[] = [
  { value: "all", label: "All" },
  { value: "incoming", label: "Incoming" },
  { value: "outgoing", label: "Outgoing" },
];

export const SOURCE_OPTIONS: SelectOption[] = [
  { value: "all", label: "All source" },
  { value: "ivr", label: "IVR" },
  { value: "ai-agent", label: "AI agent" },
  { value: "direct-agent", label: "Direct agent" },
];

export const DURATION_OPTIONS = [
  { value: "all", label: "All duration" },
  { value: "less-than-1-min", label: "Less than 1 min" },
  { value: "1-5-min", label: "1–5 min" },
  { value: "5-10-min", label: "5–10 min" },
  { value: "more-than-10-min", label: "More than 10 min" },
  { value: "custom", label: "Custom" },
] as const;

export const AI_HANDLING_OPTIONS: MultiSelectOption[] = [
  { value: "all", label: "All" },
  { value: "self-served", label: "Self-served" },
  { value: "handoff", label: "Handoff" },
  { value: "escalation", label: "Escalation" },
];

export const TRANSFER_STATUS_OPTIONS: MultiSelectOption[] = [
  { value: "missed-on-transfer", label: "Missed on transfer" },
  { value: "connected-on-transfer", label: "Connected on transfer" },
];
