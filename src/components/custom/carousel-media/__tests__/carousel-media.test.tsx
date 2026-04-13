import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CarouselMedia } from "../carousel-media";
import type { CarouselCard } from "../types";

const sampleCards: CarouselCard[] = [
  {
    url: "https://example.com/img1.jpg",
    title: "Card One",
    buttons: [
      { icon: "reply", label: "Quick Reply" },
      { icon: "link", label: "Visit Site" },
    ],
  },
  {
    url: "https://example.com/img2.jpg",
    title: "Card Two",
    buttons: [{ icon: "reply", label: "Reply" }],
  },
  {
    url: "https://example.com/img3.jpg",
    title: "Card Three",
  },
];

describe("CarouselMedia", () => {
  it("renders all cards with images and titles", () => {
    render(<CarouselMedia cards={sampleCards} />);
    expect(screen.getByAltText("Card One")).toBeInTheDocument();
    expect(screen.getByAltText("Card Two")).toBeInTheDocument();
    expect(screen.getByAltText("Card Three")).toBeInTheDocument();
    expect(screen.getByText("Card One")).toBeInTheDocument();
    expect(screen.getByText("Card Two")).toBeInTheDocument();
    expect(screen.getByText("Card Three")).toBeInTheDocument();
  });

  it("card buttons render with correct icons", () => {
    const { container } = render(<CarouselMedia cards={sampleCards} />);
    // "Quick Reply" and "Reply" buttons have reply icon, "Visit Site" has link icon
    expect(screen.getByText("Quick Reply")).toBeInTheDocument();
    expect(screen.getByText("Visit Site")).toBeInTheDocument();
    expect(screen.getByText("Reply")).toBeInTheDocument();
    // Check that lucide icons are rendered (as SVGs inside the buttons)
    const buttons = container.querySelectorAll(
      'button.flex.items-center.justify-center.gap-2'
    );
    expect(buttons.length).toBe(3);
  });

  it("custom className is applied", () => {
    const { container } = render(
      <CarouselMedia cards={sampleCards} className="custom-class" />
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass("custom-class");
  });

  it("ref forwarding works", () => {
    const ref = vi.fn();
    render(<CarouselMedia cards={sampleCards} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("data-testid spreads correctly", () => {
    render(
      <CarouselMedia cards={sampleCards} data-testid="carousel-player" />
    );
    expect(screen.getByTestId("carousel-player")).toBeInTheDocument();
  });

  it("button onClick fires", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const cards: CarouselCard[] = [
      {
        url: "https://example.com/img.jpg",
        title: "Test Card",
        buttons: [{ label: "Click Me", onClick }],
      },
    ];
    render(<CarouselMedia cards={cards} />);
    await user.click(screen.getByText("Click Me"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("custom cardWidth is applied", () => {
    const { container } = render(
      <CarouselMedia cards={sampleCards} cardWidth={300} />
    );
    const card = container.querySelector(".shrink-0") as HTMLElement;
    expect(card.style.width).toBe("300px");
  });

  it("single card does not show right scroll arrow", () => {
    const singleCard: CarouselCard[] = [
      {
        url: "https://example.com/img.jpg",
        title: "Only Card",
      },
    ];
    render(<CarouselMedia cards={singleCard} />);
    expect(
      screen.queryByRole("button", { name: "Scroll right" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Scroll left" })
    ).not.toBeInTheDocument();
  });

  it("renders a <video> element with poster for video cards", () => {
    const videoCards: CarouselCard[] = [
      {
        url: "https://example.com/clip.mp4",
        mediaType: "video",
        thumbnailUrl: "https://example.com/poster.jpg",
        title: "Video Card",
      },
    ];
    const { container } = render(<CarouselMedia cards={videoCards} />);
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video).toBeInTheDocument();
    expect(video.getAttribute("src")).toBe("https://example.com/clip.mp4");
    expect(video.getAttribute("poster")).toBe("https://example.com/poster.jpg");
    expect(screen.getByText("Video Card")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Play video" })
    ).toBeInTheDocument();
  });

  it("video cards toggle play/pause when overlay button clicked", async () => {
    const user = userEvent.setup();
    const videoCards: CarouselCard[] = [
      {
        url: "https://example.com/clip.mp4",
        mediaType: "video",
        title: "Toggle Card",
      },
    ];
    // jsdom doesn't implement HTMLMediaElement.play/pause; stub them
    const playSpy = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockImplementation(function (this: HTMLMediaElement) {
        Object.defineProperty(this, "paused", { value: false, configurable: true });
        return Promise.resolve();
      });
    const pauseSpy = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(function (this: HTMLMediaElement) {
        Object.defineProperty(this, "paused", { value: true, configurable: true });
      });

    render(<CarouselMedia cards={videoCards} />);
    const playBtn = screen.getByRole("button", { name: "Play video" });
    await user.click(playBtn);
    expect(playSpy).toHaveBeenCalledTimes(1);
    // After play, the label should flip to "Pause video"
    expect(
      screen.getByRole("button", { name: "Pause video" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pause video" }));
    expect(pauseSpy).toHaveBeenCalledTimes(1);

    playSpy.mockRestore();
    pauseSpy.mockRestore();
  });

  it("renders mixed image and video cards together", () => {
    const mixed: CarouselCard[] = [
      { url: "https://example.com/1.jpg", mediaType: "image", title: "Img" },
      { url: "https://example.com/2.mp4", mediaType: "video", title: "Vid" },
    ];
    const { container } = render(<CarouselMedia cards={mixed} />);
    expect(screen.getByAltText("Img")).toBeInTheDocument();
    expect(container.querySelector("video")).toBeInTheDocument();
  });

  it("card without mediaType defaults to image (backwards compatible)", () => {
    // Existing consumers that don't set mediaType still get an image
    const { container } = render(<CarouselMedia cards={sampleCards} />);
    expect(container.querySelector("video")).not.toBeInTheDocument();
    expect(container.querySelectorAll("img").length).toBe(sampleCards.length);
  });
});
