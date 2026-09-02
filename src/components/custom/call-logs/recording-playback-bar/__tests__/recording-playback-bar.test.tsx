import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RecordingPlaybackBar } from "../recording-playback-bar";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

const defaultProps = {
  phoneNumber: "+91 98201 45632",
};

describe("RecordingPlaybackBar", () => {
  it("renders correctly with required props only", () => {
    render(<RecordingPlaybackBar {...defaultProps} />);
    expect(screen.getByText("+91 98201 45632")).toBeInTheDocument();
  });

  /* ── callerName ── */

  it("renders callerName in parentheses when provided", () => {
    render(<RecordingPlaybackBar {...defaultProps} callerName="Priya Sharma" />);
    expect(screen.getByText("(Priya Sharma)")).toBeInTheDocument();
  });

  it("does not render parentheses/name text when callerName is omitted", () => {
    render(<RecordingPlaybackBar {...defaultProps} />);
    expect(screen.queryByText(/\(.*\)/)).not.toBeInTheDocument();
  });

  /* ── timestamp / duration ── */

  it("renders the timestamp and duration when provided", () => {
    render(
      <RecordingPlaybackBar
        {...defaultProps}
        timestamp="05:00 PM, 04 Aug"
        duration="6m 48s"
      />
    );
    expect(screen.getByText("05:00 PM, 04 Aug")).toBeInTheDocument();
    expect(screen.getByText("6m 48s")).toBeInTheDocument();
  });

  it("does not render timestamp/duration text when omitted", () => {
    const { container } = render(<RecordingPlaybackBar {...defaultProps} />);
    // The "|" separator only renders alongside a timestamp/duration value.
    expect(container.textContent).not.toContain("|");
  });

  /* ── isPlaying ── */

  it("renders a 'Play recording' button when isPlaying is omitted (default)", () => {
    render(<RecordingPlaybackBar {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Play recording" })
    ).toBeInTheDocument();
  });

  it("renders a 'Play recording' button when isPlaying is false", () => {
    render(<RecordingPlaybackBar {...defaultProps} isPlaying={false} />);
    expect(
      screen.getByRole("button", { name: "Play recording" })
    ).toBeInTheDocument();
  });

  it("renders a 'Pause recording' button when isPlaying is true", () => {
    render(<RecordingPlaybackBar {...defaultProps} isPlaying />);
    expect(
      screen.getByRole("button", { name: "Pause recording" })
    ).toBeInTheDocument();
  });

  it("calls onTogglePlay when the play/pause button is clicked", () => {
    const onTogglePlay = vi.fn();
    render(
      <RecordingPlaybackBar {...defaultProps} onTogglePlay={onTogglePlay} />
    );
    fireEvent.click(screen.getByRole("button", { name: "Play recording" }));
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });

  /* ── close button ── */

  it("renders no close button when onClose is omitted", () => {
    render(<RecordingPlaybackBar {...defaultProps} />);
    expect(
      screen.queryByRole("button", { name: "Close" })
    ).not.toBeInTheDocument();
  });

  it("renders a close button when onClose is provided", () => {
    render(<RecordingPlaybackBar {...defaultProps} onClose={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Close" })
    ).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<RecordingPlaybackBar {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* ── className / ref / passthrough ── */

  it("merges custom className onto the root element", () => {
    const { container } = render(
      <RecordingPlaybackBar {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<RecordingPlaybackBar {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional HTML attributes through to the root element", () => {
    render(<RecordingPlaybackBar {...defaultProps} data-testid="playback-bar" />);
    expect(screen.getByTestId("playback-bar")).toBeInTheDocument();
  });

  /* ── Bootstrap compatibility ── */

  it("has no Bootstrap margin bleed on <p> elements", () => {
    // RecordingPlaybackBar currently renders no <p> tags (spans only), so
    // this is trivially satisfied — kept as a regression guard for future
    // changes.
    const { container } = render(<RecordingPlaybackBar {...defaultProps} />);
    assertNoBootstrapMarginBleed(container);
  });
});
