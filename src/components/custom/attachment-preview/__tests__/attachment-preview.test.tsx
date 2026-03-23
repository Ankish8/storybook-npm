import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { AttachmentPreview } from "../attachment-preview";

const createMockFile = (
  name: string,
  type: string,
  size: number = 1024
): File => new File([new ArrayBuffer(size)], name, { type });

beforeAll(() => {
  global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = vi.fn();
});

describe("AttachmentPreview", () => {
  it("renders image preview for image file", () => {
    const file = createMockFile("photo.png", "image/png");
    const { container } = render(
      <AttachmentPreview file={file} onRemove={vi.fn()} />
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "photo.png");
    expect(img).toHaveAttribute("src", "blob:mock-url");
  });

  it("renders video preview for video file", () => {
    const file = createMockFile("clip.mp4", "video/mp4");
    const { container } = render(
      <AttachmentPreview file={file} onRemove={vi.fn()} />
    );
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "blob:mock-url");
    // Should have the 0:00 timestamp
    expect(screen.getByText("0:00")).toBeInTheDocument();
  });

  it("renders audio preview for audio file", () => {
    const file = createMockFile("song.mp3", "audio/mpeg");
    const { container } = render(
      <AttachmentPreview file={file} onRemove={vi.fn()} />
    );
    // Should not have img or video
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeInTheDocument();
    // Should have 0:00 timestamp
    expect(screen.getByText("0:00")).toBeInTheDocument();
  });

  it("renders document preview for PDF file with filename and size", () => {
    const file = createMockFile("report.pdf", "application/pdf", 2621440); // ~2.5 MB
    render(<AttachmentPreview file={file} onRemove={vi.fn()} />);
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByText("2.5 MB")).toBeInTheDocument();
  });

  it("onRemove fires when close button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const file = createMockFile("photo.png", "image/png");
    render(<AttachmentPreview file={file} onRemove={onRemove} />);
    const removeButton = screen.getByRole("button", {
      name: "Remove attachment",
    });
    await user.click(removeButton);
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("custom className is applied", () => {
    const file = createMockFile("photo.png", "image/png");
    const { container } = render(
      <AttachmentPreview
        file={file}
        onRemove={vi.fn()}
        className="custom-class"
      />
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass("custom-class");
  });

  it("ref forwarding works", () => {
    const ref = vi.fn();
    const file = createMockFile("photo.png", "image/png");
    render(<AttachmentPreview file={file} onRemove={vi.fn()} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("data-testid spreads correctly", () => {
    const file = createMockFile("photo.png", "image/png");
    render(
      <AttachmentPreview
        file={file}
        onRemove={vi.fn()}
        data-testid="attachment"
      />
    );
    expect(screen.getByTestId("attachment")).toBeInTheDocument();
  });
});
