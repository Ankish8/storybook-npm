import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { VideoMedia } from "../video-media";

const defaultProps = {
  thumbnailUrl: "https://example.com/thumb.jpg",
};

describe("VideoMedia", () => {
  it("renders thumbnail image", () => {
    render(<VideoMedia {...defaultProps} />);
    const img = screen.getByAltText("Video thumbnail");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/thumb.jpg");
  });

  it("shows play button initially (not playing)", () => {
    const { container } = render(<VideoMedia {...defaultProps} />);
    // Play icon is present — the SVG for lucide Play
    // The center play/pause wrapper should be fully visible (opacity-100)
    const centerOverlay = container.querySelector(
      ".absolute.inset-0.flex.items-center"
    );
    expect(centerOverlay).toHaveClass("opacity-100");
  });

  it("applies custom className", () => {
    const { container } = render(
      <VideoMedia {...defaultProps} className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn() as unknown as React.RefObject<HTMLDivElement>;
    const callbackRef = (node: HTMLDivElement | null) => {
      (ref as unknown as { current: HTMLDivElement | null }).current = node;
    };
    render(<VideoMedia {...defaultProps} ref={callbackRef} />);
    expect(
      (ref as unknown as { current: HTMLDivElement | null }).current
    ).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads data-testid correctly", () => {
    render(<VideoMedia {...defaultProps} data-testid="video-player" />);
    expect(screen.getByTestId("video-player")).toBeInTheDocument();
  });

  it("renders duration text", () => {
    render(<VideoMedia {...defaultProps} duration="2:30" />);
    expect(screen.getByText("2:30")).toBeInTheDocument();
  });

  it("renders default duration when not provided", () => {
    render(<VideoMedia {...defaultProps} />);
    expect(screen.getByText("0:00")).toBeInTheDocument();
  });

  it("accepts custom speed options", () => {
    const { container } = render(
      <VideoMedia {...defaultProps} speedOptions={[0.5, 1, 2]} />
    );
    // The speed button should show default speed 1x
    const speedButton = container.querySelector(
      "button.rounded-full"
    );
    expect(speedButton).toHaveTextContent("1x");
  });

  it("applies progress to seek bar width", () => {
    const { container } = render(
      <VideoMedia {...defaultProps} progress={45} />
    );
    // The progress bar fill div
    const progressFill = container.querySelector(
      ".bg-white\\/30 .bg-white"
    );
    expect(progressFill).toHaveStyle({ width: "45%" });
  });
});
