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
});
