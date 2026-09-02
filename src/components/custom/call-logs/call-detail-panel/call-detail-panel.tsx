import * as React from "react";
import {
  Ban,
  Clock,
  Download,
  Pause,
  Pencil,
  Phone,
  Play,
  Sparkles,
  Star,
  UserPlus,
  X,
} from "lucide-react";

import { cn } from "../../../../lib/utils";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";
import type { CallDetailLogEntry, CallDetailNote, CallDetailPanelProps } from "./types";

/* ── Waveform ── */

const PLACEHOLDER_WAVEFORM_BAR_COUNT = 40;

/**
 * Deterministic, low-variance placeholder bars for when no real waveform
 * data has been supplied yet. Derived from the bar index only — never
 * Math.random — so Storybook/test renders stay stable.
 */
function buildPlaceholderWaveform(): number[] {
  return Array.from(
    { length: PLACEHOLDER_WAVEFORM_BAR_COUNT },
    (_, index) => 0.35 + (index % 4) * 0.05
  );
}

function Waveform({ amplitudes, playedRatio }: { amplitudes: number[]; playedRatio: number }) {
  const clampedRatio = Math.min(1, Math.max(0, playedRatio));
  const playedCount = Math.round(clampedRatio * amplitudes.length);

  return (
    <div
      role="img"
      aria-label="Waveform"
      className="flex h-[30px] flex-1 items-center gap-0.5 overflow-hidden"
    >
      {amplitudes.map((amplitude, index) => {
        const height = `${Math.min(1, Math.max(0, amplitude)) * 100}%`;
        const isPlayhead = playedCount > 0 && index === playedCount - 1;
        const isPlayed = index < playedCount - 1;

        return (
          <span
            key={index}
            className={cn(
              "w-1 rounded-sm",
              isPlayhead
                ? "bg-semantic-primary-hover"
                : isPlayed
                  ? "bg-semantic-primary"
                  : "bg-[var(--color-neutral-300)]"
            )}
            style={{ height }}
          />
        );
      })}
    </div>
  );
}

/* ── Notes tab ── */

const NOTE_MAX_LENGTH = 100;

function NoteListItem({ note }: { note: CallDetailNote }) {
  return (
    <div className="flex w-full flex-col gap-0.5 rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-semantic-text-muted">{note.author}</span>
        <span className="text-xs text-semantic-text-muted">{note.timestamp}</span>
      </div>
      <span className="text-sm text-semantic-text-primary">{note.text}</span>
    </div>
  );
}

function NotesTabContent({
  notes,
  noteDraft,
  onNoteDraftChange,
  onSaveNote,
}: {
  notes: CallDetailNote[];
  noteDraft: string;
  onNoteDraftChange?: (value: string) => void;
  onSaveNote?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {notes.length > 0 && (
        <div className="flex flex-col gap-3">
          {notes.map((note, index) => (
            <NoteListItem key={`${note.author}-${note.timestamp}-${index}`} note={note} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Textarea
          value={noteDraft}
          onChange={(event) => onNoteDraftChange?.(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSaveNote?.();
            }
          }}
          placeholder='Write notes about this call. Press "Enter" to save.'
          rows={3}
          maxLength={NOTE_MAX_LENGTH}
          showCount
          displayCharCount={noteDraft.length}
          className="text-sm"
        />
        <div className="flex justify-end">
          <Button type="button" variant="default" size="sm" onClick={onSaveNote}>
            Save Notes
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Call log tab ── */

function LogTimelineItem({ entry, isLast }: { entry: CallDetailLogEntry; isLast: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center self-stretch">
        <span
          className={cn(
            "mt-1.5 size-2 shrink-0 rounded-full",
            entry.current ? "bg-semantic-brand" : "bg-[var(--color-neutral-300)]"
          )}
        />
        {!isLast && <span className="w-px flex-1 bg-semantic-border-layout" />}
      </div>

      <div className={cn("flex flex-1 items-start justify-between gap-2", !isLast && "pb-4")}>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 text-sm text-semantic-text-primary">
            {entry.isAi && (
              <Sparkles
                className="size-3.5 shrink-0 text-semantic-text-link"
                aria-hidden="true"
              />
            )}
            {entry.title}
          </span>
          <span className="text-xs text-semantic-text-muted">{entry.timestamp}</span>
        </div>
        {entry.duration && (
          <span className="flex shrink-0 items-center gap-1 rounded bg-[var(--color-neutral-100)] px-1.5 py-0.5 text-xs text-semantic-text-muted">
            <Clock className="size-3" aria-hidden="true" />
            {entry.duration}
          </span>
        )}
      </div>
    </div>
  );
}

function CallLogTabContent({
  entries,
  onViewDetailedLogs,
}: {
  entries: CallDetailLogEntry[];
  onViewDetailedLogs?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {entries.length > 0 && (
        <div className="flex flex-col">
          {entries.map((entry, index) => (
            <LogTimelineItem
              key={`${entry.title}-${index}`}
              entry={entry}
              isLast={index === entries.length - 1}
            />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={onViewDetailedLogs}
        className="self-start text-sm font-semibold text-semantic-text-link hover:underline"
      >
        View Detailed Logs
      </button>
    </div>
  );
}

/* ── Main component ── */

/**
 * CallDetailPanel is a slide-out side panel launched from a call log row.
 * It shows recording playback with a waveform, an AI-generated summary, and
 * two fixed tabs — Notes and Call log (a detailed event timeline). Drop it
 * into a consumer-provided slide-out/drawer container — the panel itself
 * fills the available width and height.
 *
 * This is a different component from `CallJourneyPanel`, which is the full
 * standalone timeline destination reached via the "View Detailed Logs" link
 * inside the Call log tab.
 *
 * The footer's contact action swaps based on `callerName`: "Edit Contact"
 * when a name is already saved for this caller, "Add Contact" when it isn't.
 *
 * @example
 * ```tsx
 * <CallDetailPanel
 *   phoneNumber="+1 (555) 019-3321"
 *   callerName="Priya Sharma"
 *   callUid="UID-2026-0701-01"
 *   elapsedTime="1:01"
 *   totalTime="3:12"
 *   aiSummary="Customer called about a billing discrepancy and was transferred to Support."
 *   activeTab="notes"
 *   onTabChange={() => {}}
 *   notes={[{ author: "Rohit Sharma", timestamp: "2 hours ago", text: "Follow up tomorrow." }]}
 *   logEntries={[
 *     { title: "AI Agent Welcome message played", timestamp: "10:24:02", duration: "6m 48s", isAi: true },
 *     { title: "Transferred to Support", timestamp: "10:30:50", current: true },
 *   ]}
 *   onClose={() => {}}
 * />
 * ```
 */
const CallDetailPanel = React.forwardRef(
  (
    {
      phoneNumber,
      callerName,
      callUid,
      isFavorite = false,
      onToggleFavorite,
      onClose,
      elapsedTime,
      totalTime,
      isPlaying = false,
      onTogglePlay,
      onDownload,
      waveform,
      playedRatio = 0,
      aiSummary,
      activeTab,
      onTabChange,
      notes = [],
      noteDraft = "",
      onNoteDraftChange,
      onSaveNote,
      logEntries = [],
      onViewDetailedLogs,
      onCallback,
      onEditContact,
      onAddContact,
      onBlockCaller,
      className,
      ...props
    }: CallDetailPanelProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const amplitudes = waveform && waveform.length > 0 ? waveform : buildPlaceholderWaveform();

    return (
      <div
        ref={ref}
        className={cn("flex h-full w-full flex-col bg-semantic-bg-primary", className)}
        {...props}
      >
        {/* Header */}
        <div className="flex flex-col gap-1 border-b border-solid border-semantic-border-layout p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-lg font-semibold text-semantic-text-primary">
                {phoneNumber}
              </span>
              <button
                type="button"
                aria-label="Toggle favorite"
                aria-pressed={isFavorite}
                onClick={onToggleFavorite}
                className="flex size-6 shrink-0 items-center justify-center rounded-full hover:bg-semantic-bg-hover"
              >
                <Star
                  className={cn(
                    "size-4",
                    isFavorite
                      ? "fill-semantic-warning-primary text-semantic-warning-primary"
                      : "text-semantic-text-muted"
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full hover:bg-semantic-bg-hover"
            >
              <X className="size-5 text-semantic-text-muted" aria-hidden="true" />
            </button>
          </div>
          <span className="text-sm text-semantic-text-secondary">UID: {callUid}</span>
        </div>

        {/* Scrollable middle */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Recording */}
          <div className="flex flex-col gap-3 border-b border-solid border-semantic-border-layout p-4">
            <span className="text-sm font-semibold text-semantic-text-secondary">Recording</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={isPlaying ? "Pause recording" : "Play recording"}
                onClick={onTogglePlay}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-semantic-primary hover:bg-semantic-primary-hover"
              >
                {isPlaying ? (
                  <Pause
                    className="size-3 fill-semantic-text-inverted text-semantic-text-inverted"
                    aria-hidden="true"
                  />
                ) : (
                  <Play
                    className="size-3 fill-semantic-text-inverted text-semantic-text-inverted"
                    aria-hidden="true"
                  />
                )}
              </button>
              <Waveform amplitudes={amplitudes} playedRatio={playedRatio} />
              <button
                type="button"
                aria-label="Download recording"
                onClick={onDownload}
                className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-semantic-bg-hover"
              >
                <Download className="size-5 text-semantic-text-muted" aria-hidden="true" />
              </button>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-semibold text-semantic-text-primary">
                {elapsedTime}
              </span>
              <span className="text-xs text-semantic-text-muted">/ {totalTime}</span>
            </div>
          </div>

          {/* AI summary */}
          {aiSummary && (
            <div className="border-b border-solid border-semantic-border-layout p-4">
              <div className="flex flex-col gap-1.5 rounded-lg border border-solid border-semantic-border-layout bg-semantic-info-surface p-3">
                <span className="text-sm font-semibold text-semantic-text-primary">
                  AI Call Summary
                </span>
                <span className="text-sm leading-relaxed text-semantic-text-secondary">
                  {aiSummary}
                </span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 border-b border-solid border-semantic-border-layout px-4">
            <button
              type="button"
              aria-pressed={activeTab === "notes"}
              onClick={() => onTabChange("notes")}
              className={cn(
                "h-10 px-3 text-sm font-semibold",
                activeTab === "notes"
                  ? "border-b-2 border-solid border-semantic-border-primary text-semantic-text-secondary"
                  : "text-semantic-text-muted hover:text-semantic-text-secondary"
              )}
            >
              Notes
            </button>
            <button
              type="button"
              aria-pressed={activeTab === "call-log"}
              onClick={() => onTabChange("call-log")}
              className={cn(
                "h-10 px-3 text-sm font-semibold",
                activeTab === "call-log"
                  ? "border-b-2 border-solid border-semantic-border-primary text-semantic-text-secondary"
                  : "text-semantic-text-muted hover:text-semantic-text-secondary"
              )}
            >
              Participants on call
            </button>
          </div>

          {/* Tab content */}
          <div className="flex flex-col gap-4 p-4">
            {activeTab === "notes" ? (
              <NotesTabContent
                notes={notes}
                noteDraft={noteDraft}
                onNoteDraftChange={onNoteDraftChange}
                onSaveNote={onSaveNote}
              />
            ) : (
              <CallLogTabContent entries={logEntries} onViewDetailedLogs={onViewDetailedLogs} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-[18px] border-t border-solid border-semantic-border-layout p-4">
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 [&_svg]:size-[18px]"
            leftIcon={<Phone aria-hidden="true" />}
            onClick={onCallback}
          >
            Callback
          </Button>
          {callerName ? (
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 [&_svg]:size-[18px]"
              leftIcon={<Pencil aria-hidden="true" />}
              onClick={onEditContact}
            >
              Edit Contact
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 [&_svg]:size-[18px]"
              leftIcon={<UserPlus aria-hidden="true" />}
              onClick={onAddContact}
            >
              Add Contact
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 text-semantic-error-primary [&_svg]:size-[18px]"
            leftIcon={<Ban aria-hidden="true" />}
            onClick={onBlockCaller}
          >
            Block Caller
          </Button>
        </div>
      </div>
    );
  }
);
CallDetailPanel.displayName = "CallDetailPanel";

export { CallDetailPanel };
