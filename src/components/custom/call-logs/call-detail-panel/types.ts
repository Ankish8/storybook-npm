import type * as React from "react";

export interface CallDetailNote {
  author: string;
  timestamp: string;
  text: string;
}

export interface CallDetailLogEntry {
  title: string;
  timestamp: string;
  duration?: string;
  /** Highlights this entry's dot in the accent color to mark it as the current/active segment */
  current?: boolean;
  /** Shows a sparkle icon before the title to mark an AI-handled segment (e.g. "AI Agent Welcome message played") */
  isAi?: boolean;
}

export interface CallDetailPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  phoneNumber: string;
  /** Caller's saved contact name. When absent/empty, the footer shows "Add Contact" instead of "Edit Contact". */
  callerName?: string;
  callUid: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClose?: () => void;

  /** Elapsed playback time label, e.g. "1:01" */
  elapsedTime: string;
  /** Total recording duration label, e.g. "3:12" */
  totalTime: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onDownload?: () => void;
  /**
   * Waveform amplitude data as an array of numbers between 0 and 1 (bar heights).
   * Provide real data from the consumer — do NOT hardcode a specific waveform shape
   * in this component. If omitted, render a neutral flat/low-variance placeholder pattern
   * (e.g. derived deterministically from the array index, NOT Math.random — this file must
   * not use Math.random, Date.now, or new Date since those break deterministic testing/story rendering).
   */
  waveform?: number[];
  /** Fraction (0-1) of the waveform considered "played" — drives the played/unplayed bar coloring */
  playedRatio?: number;

  aiSummary?: string;

  activeTab: "notes" | "call-log";
  onTabChange: (tab: "notes" | "call-log") => void;

  notes?: CallDetailNote[];
  noteDraft?: string;
  onNoteDraftChange?: (value: string) => void;
  onSaveNote?: () => void;

  logEntries?: CallDetailLogEntry[];
  onViewDetailedLogs?: () => void;

  onCallback?: () => void;
  /** Called when "Edit Contact" is clicked — shown when `callerName` is set */
  onEditContact?: () => void;
  /** Called when "Add Contact" is clicked — shown when `callerName` is absent/empty */
  onAddContact?: () => void;
  onBlockCaller?: () => void;
}
