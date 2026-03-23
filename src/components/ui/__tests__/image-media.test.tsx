import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImageMedia } from "../image-media";

describe("ImageMedia", () => {
  it("renders image with correct src", () => {
    render(<ImageMedia src="https://example.com/photo.jpg" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("uses 'Image' as default alt text", () => {
    render(<ImageMedia src="https://example.com/photo.jpg" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Image");
  });

  it("applies custom alt text", () => {
    render(
      <ImageMedia src="https://example.com/photo.jpg" alt="A sunset" />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "A sunset");
  });

  it("applies custom className to wrapper", () => {
    const { container } = render(
      <ImageMedia src="https://example.com/photo.jpg" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("relative");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<ImageMedia ref={ref} src="https://example.com/photo.jpg" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads data-testid correctly", () => {
    render(
      <ImageMedia
        src="https://example.com/photo.jpg"
        data-testid="image-media"
      />
    );
    expect(screen.getByTestId("image-media")).toBeInTheDocument();
  });

  it("applies default maxHeight of 280px", () => {
    render(<ImageMedia src="https://example.com/photo.jpg" />);
    const img = screen.getByRole("img");
    expect(img).toHaveStyle({ maxHeight: "280px" });
  });

  it("applies custom numeric maxHeight", () => {
    render(
      <ImageMedia src="https://example.com/photo.jpg" maxHeight={400} />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveStyle({ maxHeight: "400px" });
  });

  it("applies custom string maxHeight", () => {
    render(
      <ImageMedia src="https://example.com/photo.jpg" maxHeight="50vh" />
    );
    const img = screen.getByRole("img");
    expect(img).toHaveStyle({ maxHeight: "50vh" });
  });
});
