import { render, screen } from "@testing-library/react";
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

  it("renders duration when provided", () => {
    render(<AudioMedia duration="0:30" />);
    expect(screen.getByText("0:30")).toBeInTheDocument();
  });
});
