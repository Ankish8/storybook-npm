import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CallDetailPanel } from "../call-detail-panel";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

const defaultProps = {
  phoneNumber: "+1 (555) 019-3321",
  callUid: "UID-2026-0701-01",
  elapsedTime: "1:01",
  totalTime: "3:12",
  activeTab: "notes" as const,
  onTabChange: vi.fn(),
};

describe("CallDetailPanel", () => {
  it("renders correctly with required props only", () => {
    render(<CallDetailPanel {...defaultProps} />);
    expect(screen.getByText("+1 (555) 019-3321")).toBeInTheDocument();
    expect(screen.getByText("UID: UID-2026-0701-01")).toBeInTheDocument();
  });

  /* ── favorite star ── */

  it("shows the muted star by default (not favorite)", () => {
    const { container } = render(<CallDetailPanel {...defaultProps} />);
    const star = container.querySelector("svg.lucide-star");
    expect(star).toHaveClass("text-semantic-text-muted");
    expect(star).not.toHaveClass("fill-semantic-warning-primary");
  });

  it("shows the filled warning star when isFavorite is true", () => {
    const { container } = render(<CallDetailPanel {...defaultProps} isFavorite />);
    const star = container.querySelector("svg.lucide-star");
    expect(star).toHaveClass("fill-semantic-warning-primary");
    expect(star).toHaveClass("text-semantic-warning-primary");
  });

  it("calls onToggleFavorite when the star button is clicked", () => {
    const onToggleFavorite = vi.fn();
    render(<CallDetailPanel {...defaultProps} onToggleFavorite={onToggleFavorite} />);
    fireEvent.click(screen.getByRole("button", { name: "Toggle favorite" }));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  /* ── close ── */

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<CallDetailPanel {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* ── play / pause ── */

  it("renders a 'Play recording' button when isPlaying is false/omitted", () => {
    render(<CallDetailPanel {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Play recording" })).toBeInTheDocument();
  });

  it("renders a 'Pause recording' button when isPlaying is true", () => {
    render(<CallDetailPanel {...defaultProps} isPlaying />);
    expect(screen.getByRole("button", { name: "Pause recording" })).toBeInTheDocument();
  });

  it("calls onTogglePlay when the play/pause button is clicked", () => {
    const onTogglePlay = vi.fn();
    render(<CallDetailPanel {...defaultProps} onTogglePlay={onTogglePlay} />);
    fireEvent.click(screen.getByRole("button", { name: "Play recording" }));
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });

  /* ── elapsed / total time ── */

  it("renders elapsedTime and totalTime", () => {
    render(<CallDetailPanel {...defaultProps} elapsedTime="1:01" totalTime="3:12" />);
    expect(screen.getByText("1:01")).toBeInTheDocument();
    expect(screen.getByText("/ 3:12")).toBeInTheDocument();
  });

  /* ── download ── */

  it("calls onDownload when the download button is clicked", () => {
    const onDownload = vi.fn();
    render(<CallDetailPanel {...defaultProps} onDownload={onDownload} />);
    fireEvent.click(screen.getByRole("button", { name: "Download recording" }));
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  /* ── AI summary ── */

  it("renders the AI Call Summary card when aiSummary is provided", () => {
    render(
      <CallDetailPanel
        {...defaultProps}
        aiSummary="Customer called about a billing discrepancy."
      />
    );
    expect(screen.getByText("AI Call Summary")).toBeInTheDocument();
    expect(
      screen.getByText("Customer called about a billing discrepancy.")
    ).toBeInTheDocument();
  });

  it("does not render the AI Call Summary card when aiSummary is omitted", () => {
    render(<CallDetailPanel {...defaultProps} />);
    expect(screen.queryByText("AI Call Summary")).not.toBeInTheDocument();
  });

  /* ── tabs ── */

  it("renders Notes tab content when activeTab is 'notes'", () => {
    render(<CallDetailPanel {...defaultProps} activeTab="notes" />);
    expect(
      screen.getByPlaceholderText('Write notes about this call. Press "Enter" to save.')
    ).toBeInTheDocument();
    expect(screen.queryByText("View Detailed Logs")).not.toBeInTheDocument();
  });

  it("renders Call log tab content when activeTab is 'call-log'", () => {
    render(<CallDetailPanel {...defaultProps} activeTab="call-log" />);
    expect(screen.getByText("View Detailed Logs")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Write notes about this call. Press "Enter" to save.')
    ).not.toBeInTheDocument();
  });

  it("calls onTabChange with 'call-log' when the Participants on call tab is clicked", () => {
    const onTabChange = vi.fn();
    render(<CallDetailPanel {...defaultProps} activeTab="notes" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Participants on call" }));
    expect(onTabChange).toHaveBeenCalledWith("call-log");
  });

  it("calls onTabChange with 'notes' when the Notes tab is clicked", () => {
    const onTabChange = vi.fn();
    render(<CallDetailPanel {...defaultProps} activeTab="call-log" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Notes" }));
    expect(onTabChange).toHaveBeenCalledWith("notes");
  });

  /* ── notes tab ── */

  it("renders each note's author, timestamp, and text", () => {
    render(
      <CallDetailPanel
        {...defaultProps}
        activeTab="notes"
        notes={[
          { author: "Rohit Sharma", timestamp: "2 hours ago", text: "Follow up tomorrow." },
          { author: "Priya Sharma", timestamp: "1 day ago", text: "Escalated to billing." },
        ]}
      />
    );
    expect(screen.getByText("Rohit Sharma")).toBeInTheDocument();
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
    expect(screen.getByText("Follow up tomorrow.")).toBeInTheDocument();
    expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
    expect(screen.getByText("1 day ago")).toBeInTheDocument();
    expect(screen.getByText("Escalated to billing.")).toBeInTheDocument();
  });

  it("renders no notes when notes is omitted/empty", () => {
    const { container } = render(<CallDetailPanel {...defaultProps} activeTab="notes" />);
    expect(container.querySelectorAll(".flex.flex-col.gap-0\\.5").length).toBe(0);
  });

  it("calls onNoteDraftChange when typing in the notes textarea", () => {
    const onNoteDraftChange = vi.fn();
    render(
      <CallDetailPanel
        {...defaultProps}
        activeTab="notes"
        noteDraft=""
        onNoteDraftChange={onNoteDraftChange}
      />
    );
    const textarea = screen.getByPlaceholderText(
      'Write notes about this call. Press "Enter" to save.'
    );
    fireEvent.change(textarea, { target: { value: "New note text" } });
    expect(onNoteDraftChange).toHaveBeenCalledWith("New note text");
  });

  it("calls onSaveNote when pressing Enter (without Shift) in the notes textarea", () => {
    const onSaveNote = vi.fn();
    render(
      <CallDetailPanel {...defaultProps} activeTab="notes" onSaveNote={onSaveNote} />
    );
    const textarea = screen.getByPlaceholderText(
      'Write notes about this call. Press "Enter" to save.'
    );
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onSaveNote).toHaveBeenCalledTimes(1);
  });

  it("does not call onSaveNote when pressing Shift+Enter in the notes textarea", () => {
    const onSaveNote = vi.fn();
    render(
      <CallDetailPanel {...defaultProps} activeTab="notes" onSaveNote={onSaveNote} />
    );
    const textarea = screen.getByPlaceholderText(
      'Write notes about this call. Press "Enter" to save.'
    );
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(onSaveNote).not.toHaveBeenCalled();
  });

  it("calls onSaveNote when the Save Notes button is clicked", () => {
    const onSaveNote = vi.fn();
    render(
      <CallDetailPanel {...defaultProps} activeTab="notes" onSaveNote={onSaveNote} />
    );
    fireEvent.click(screen.getByRole("button", { name: "Save Notes" }));
    expect(onSaveNote).toHaveBeenCalledTimes(1);
  });

  /* ── call log tab ── */

  it("renders each log entry's title, timestamp, and duration when present", () => {
    render(
      <CallDetailPanel
        {...defaultProps}
        activeTab="call-log"
        logEntries={[
          { title: "AI Agent Welcome message played", timestamp: "10:24:02", duration: "6m 48s" },
          { title: "Transferred to Support", timestamp: "10:30:50", current: true },
        ]}
      />
    );
    expect(screen.getByText("AI Agent Welcome message played")).toBeInTheDocument();
    expect(screen.getByText("10:24:02")).toBeInTheDocument();
    expect(screen.getByText("6m 48s")).toBeInTheDocument();
    expect(screen.getByText("Transferred to Support")).toBeInTheDocument();
    expect(screen.getByText("10:30:50")).toBeInTheDocument();
  });

  it("does not render a duration pill for an entry without duration", () => {
    const { container } = render(
      <CallDetailPanel
        {...defaultProps}
        activeTab="call-log"
        logEntries={[{ title: "Transferred to Support", timestamp: "10:30:50" }]}
      />
    );
    expect(
      container.querySelector(".bg-\\[var\\(--color-neutral-100\\)\\]")
    ).not.toBeInTheDocument();
  });

  it("renders a sparkle icon before an entry marked isAi", () => {
    render(
      <CallDetailPanel
        {...defaultProps}
        activeTab="call-log"
        logEntries={[
          { title: "AI Agent Welcome message played", timestamp: "10:24:02", isAi: true },
          { title: "Transferred to Support", timestamp: "10:30:50" },
        ]}
      />
    );
    const aiTitle = screen.getByText("AI Agent Welcome message played").closest("span");
    const otherTitle = screen.getByText("Transferred to Support").closest("span");
    expect(aiTitle?.querySelector("svg")).toBeInTheDocument();
    expect(otherTitle?.querySelector("svg")).not.toBeInTheDocument();
  });

  it("calls onViewDetailedLogs when 'View Detailed Logs' is clicked", () => {
    const onViewDetailedLogs = vi.fn();
    render(
      <CallDetailPanel
        {...defaultProps}
        activeTab="call-log"
        onViewDetailedLogs={onViewDetailedLogs}
      />
    );
    fireEvent.click(screen.getByText("View Detailed Logs"));
    expect(onViewDetailedLogs).toHaveBeenCalledTimes(1);
  });

  /* ── footer ── */

  it("calls onCallback when the Callback button is clicked", () => {
    const onCallback = vi.fn();
    render(<CallDetailPanel {...defaultProps} onCallback={onCallback} />);
    fireEvent.click(screen.getByRole("button", { name: "Callback" }));
    expect(onCallback).toHaveBeenCalledTimes(1);
  });

  /* ── contact action: Edit Contact vs Add Contact ── */

  it("shows Add Contact (not Edit Contact) when callerName is not set", () => {
    render(<CallDetailPanel {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Add Contact" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit Contact" })
    ).not.toBeInTheDocument();
  });

  it("shows Edit Contact (not Add Contact) when callerName is set", () => {
    render(<CallDetailPanel {...defaultProps} callerName="Priya Sharma" />);
    expect(
      screen.getByRole("button", { name: "Edit Contact" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add Contact" })
    ).not.toBeInTheDocument();
  });

  it("calls onEditContact when the Edit Contact button is clicked", () => {
    const onEditContact = vi.fn();
    render(
      <CallDetailPanel
        {...defaultProps}
        callerName="Priya Sharma"
        onEditContact={onEditContact}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Edit Contact" }));
    expect(onEditContact).toHaveBeenCalledTimes(1);
  });

  it("calls onAddContact when the Add Contact button is clicked", () => {
    const onAddContact = vi.fn();
    render(<CallDetailPanel {...defaultProps} onAddContact={onAddContact} />);
    fireEvent.click(screen.getByRole("button", { name: "Add Contact" }));
    expect(onAddContact).toHaveBeenCalledTimes(1);
  });

  it("calls onBlockCaller when the Block Caller button is clicked", () => {
    const onBlockCaller = vi.fn();
    render(<CallDetailPanel {...defaultProps} onBlockCaller={onBlockCaller} />);
    fireEvent.click(screen.getByRole("button", { name: "Block Caller" }));
    expect(onBlockCaller).toHaveBeenCalledTimes(1);
  });

  /* ── className / ref / passthrough ── */

  it("merges custom className onto the root element", () => {
    const { container } = render(
      <CallDetailPanel {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CallDetailPanel {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional HTML attributes through to the root element", () => {
    render(<CallDetailPanel {...defaultProps} data-testid="panel-1" />);
    expect(screen.getByTestId("panel-1")).toBeInTheDocument();
  });

  /* ── Bootstrap compatibility ── */

  it("has no Bootstrap margin bleed on <p> elements", () => {
    // CallDetailPanel renders no <p> tags directly (it reuses the real
    // Textarea/Button components, which are already compliant), so this is
    // trivially satisfied — kept as a regression guard for future changes.
    const { container } = render(<CallDetailPanel {...defaultProps} />);
    assertNoBootstrapMarginBleed(container);
  });
});
