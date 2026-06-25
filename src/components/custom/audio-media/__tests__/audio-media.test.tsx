import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AudioMedia } from "../audio-media";

describe("AudioMedia", () => {
  it("renders with default waveform", () => {
    const { container } = render(<AudioMedia />);
    const svg = container.querySelector('[data-testid="waveform-svg"]');
    expect(svg).toBeInTheDocument();
    // Default waveform has 55 bars
    const rects = svg?.querySelectorAll("rect");
    expect(rects?.length).toBe(55);
  });

  it("shows play button initially", () => {
    render(<AudioMedia />);
    const playButton = screen.getByRole("button", { name: "Play" });
    expect(playButton).toBeInTheDocument();
  });

  it("toggles to pause button on click", async () => {
    const user = userEvent.setup();
    render(<AudioMedia />);
    const playButton = screen.getByRole("button", { name: "Play" });
    await user.click(playButton);
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("custom className is applied", () => {
    const { container } = render(<AudioMedia className="custom-class" />);
    const root = container.firstElementChild;
    expect(root).toHaveClass("custom-class");
  });

  it("ref forwarding works", () => {
    const ref = vi.fn();
    render(<AudioMedia ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("data-testid spreads correctly", () => {
    render(<AudioMedia data-testid="audio-player" />);
    expect(screen.getByTestId("audio-player")).toBeInTheDocument();
  });

  it("custom waveform is used", () => {
    const customWaveform = [10, 20, 30];
    const { container } = render(
      <AudioMedia waveform={customWaveform} barCount={3} />
    );
    const svg = container.querySelector('[data-testid="waveform-svg"]');
    const rects = svg?.querySelectorAll("rect");
    expect(rects?.length).toBe(3);
  });

  it("custom playedBars changes SVG fill colors", () => {
    const waveform = [10, 10, 10, 10, 10];
    const { container } = render(
      <AudioMedia
        waveform={waveform}
        barCount={5}
        playedBars={2}
        playedColor="#FF0000"
        unplayedColor="#00FF00"
      />
    );
    const svg = container.querySelector('[data-testid="waveform-svg"]');
    const rects = svg?.querySelectorAll("rect");
    expect(rects?.[0]?.getAttribute("fill")).toBe("#FF0000");
    expect(rects?.[1]?.getAttribute("fill")).toBe("#FF0000");
    expect(rects?.[2]?.getAttribute("fill")).toBe("#00FF00");
    expect(rects?.[3]?.getAttribute("fill")).toBe("#00FF00");
    expect(rects?.[4]?.getAttribute("fill")).toBe("#00FF00");
  });

  it("custom speed options are accepted", () => {
    // Speed options are rendered in the dropdown; verify the speed pill shows default 1x
    render(<AudioMedia speedOptions={[0.5, 1, 2]} />);
    expect(screen.getByText("1x")).toBeInTheDocument();
  });

  it("calls onPlayChange callback", async () => {
    const user = userEvent.setup();
    const onPlayChange = vi.fn();
    render(<AudioMedia onPlayChange={onPlayChange} />);
    const playButton = screen.getByRole("button", { name: "Play" });
    await user.click(playButton);
    expect(onPlayChange).toHaveBeenCalledWith(true);
  });

  it("renders the live current time derived from the duration prop", () => {
    render(<AudioMedia duration="0:30" />);
    expect(screen.getByText("0:00")).toBeInTheDocument();
  });

  it("falls back to raw duration text when it can't be parsed", () => {
    render(<AudioMedia duration="--:--" />);
    expect(screen.getByText("--:--")).toBeInTheDocument();
  });

  it("renders an <audio> element only when src is provided", () => {
    const { rerender } = render(<AudioMedia />);
    expect(screen.queryByTestId("audio-element")).not.toBeInTheDocument();

    rerender(<AudioMedia src="https://example.com/clip.mp3" />);
    const audio = screen.getByTestId("audio-element");
    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute("src", "https://example.com/clip.mp3");
  });

  it("shows a live current/total time label that moves on seek", () => {
    render(<AudioMedia src="clip.mp3" barCount={10} />);
    const audio = screen.getByTestId("audio-element") as HTMLAudioElement;

    // Simulate metadata load with a 60s clip.
    Object.defineProperty(audio, "duration", { value: 60, configurable: true });
    fireEvent.loadedMetadata(audio);
    expect(screen.getByText("0:00")).toBeInTheDocument();

    // Seeking to the end via keyboard should update the displayed time.
    const slider = screen.getByRole("slider");
    slider.focus();
    fireEvent.keyDown(slider, { key: "End" });
    expect(screen.getByText("1:00")).toBeInTheDocument();
  });

  it("moves the time label on seek even without a src (parses duration prop)", () => {
    render(<AudioMedia duration="0:30" barCount={10} />);
    // Total parsed from the prop; current starts at 0.
    expect(screen.getByText("0:00")).toBeInTheDocument();

    const slider = screen.getByRole("slider");
    slider.focus();
    fireEvent.keyDown(slider, { key: "End" });
    expect(screen.getByText("0:30")).toBeInTheDocument();

    fireEvent.keyDown(slider, { key: "Home" });
    expect(screen.getByText("0:00")).toBeInTheDocument();
  });

  it("exposes the waveform as an accessible slider", () => {
    render(<AudioMedia />);
    const slider = screen.getByRole("slider", { name: "Seek audio position" });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  it("seeks to start and end via Home/End keys", async () => {
    const user = userEvent.setup();
    const onSeek = vi.fn();
    render(<AudioMedia onSeek={onSeek} barCount={10} />);
    const slider = screen.getByRole("slider");
    slider.focus();

    await user.keyboard("{End}");
    expect(onSeek).toHaveBeenLastCalledWith(1);
    expect(slider).toHaveAttribute("aria-valuenow", "100");

    await user.keyboard("{Home}");
    expect(onSeek).toHaveBeenLastCalledWith(0);
    expect(slider).toHaveAttribute("aria-valuenow", "0");
  });

  it("steps one bar at a time with arrow keys", async () => {
    const user = userEvent.setup();
    const onSeek = vi.fn();
    render(<AudioMedia onSeek={onSeek} barCount={10} />);
    const slider = screen.getByRole("slider");
    slider.focus();

    await user.keyboard("{ArrowRight}{ArrowRight}");
    // 2 steps of 1/10 each → 20%
    expect(slider).toHaveAttribute("aria-valuenow", "20");
    expect(onSeek).toHaveBeenLastCalledWith(0.2);

    await user.keyboard("{ArrowLeft}");
    expect(slider).toHaveAttribute("aria-valuenow", "10");
  });

  it("seeks to the clicked position via pointer (drag) on the waveform", () => {
    const onSeek = vi.fn();
    const { container } = render(<AudioMedia onSeek={onSeek} barCount={10} />);
    const track = screen.getByTestId("waveform-track");

    // jsdom doesn't implement pointer capture or layout; stub them.
    track.setPointerCapture = vi.fn();
    track.hasPointerCapture = vi.fn(() => true);
    track.releasePointerCapture = vi.fn();
    vi.spyOn(track, "getBoundingClientRect").mockReturnValue({
      left: 0,
      width: 100,
      top: 0,
      height: 32,
      right: 100,
      bottom: 32,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    // jsdom has no PointerEvent, so build MouseEvents typed as pointer events
    // (they carry a real `clientX`) and add the pointerId the handlers read.
    const pointerEvent = (type: string, clientX: number) => {
      const e = new MouseEvent(type, { clientX, bubbles: true });
      Object.defineProperty(e, "pointerId", { value: 1 });
      return e;
    };

    // Click at 75% of the track width.
    fireEvent(track, pointerEvent("pointerdown", 75));
    fireEvent(track, pointerEvent("pointerup", 75));

    expect(onSeek).toHaveBeenCalledWith(0.75);
    const svg = container.querySelector('[data-testid="waveform-svg"]');
    const rects = svg?.querySelectorAll("rect");
    // 75% of 10 bars → first ~8 bars filled (played color).
    expect(rects?.[7]?.getAttribute("fill")).toBe("#27ABB8");
    expect(rects?.[8]?.getAttribute("fill")).toBe("#C0C3CA");
  });
});
