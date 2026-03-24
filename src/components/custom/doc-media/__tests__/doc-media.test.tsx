import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DocMedia } from "../doc-media";

describe("DocMedia", () => {
  it("renders preview variant with thumbnail, filename, and metadata", () => {
    render(
      <DocMedia
        variant="preview"
        thumbnailUrl="https://example.com/thumb.jpg"
        filename="Report.pdf"
        fileType="PDF"
        pageCount={12}
        fileSize="2.4 MB"
      />
    );
    const img = screen.getByAltText("Report.pdf");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/thumb.jpg");
    expect(screen.getByText("Report.pdf")).toBeInTheDocument();
    expect(screen.getByText(/PDF/)).toBeInTheDocument();
    expect(screen.getByText(/12 pages/)).toBeInTheDocument();
    expect(screen.getByText(/2\.4 MB/)).toBeInTheDocument();
  });

  it("renders download variant with image, overlay, and metadata", () => {
    const { container } = render(
      <DocMedia
        variant="download"
        thumbnailUrl="https://example.com/doc.jpg"
        filename="Report.pdf"
        fileType="PDF"
        pageCount={8}
        fileSize="1.5 MB"
        caption="A nice document"
      />
    );
    const img = screen.getByAltText("A nice document");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/doc.jpg");
    // Has gradient overlay like preview variant
    const gradient = container.querySelector(".bg-gradient-to-t");
    expect(gradient).toBeInTheDocument();
    expect(screen.getByText("Report.pdf")).toBeInTheDocument();
    expect(screen.getByText(/PDF/)).toBeInTheDocument();
  });

  it("renders file variant with icon and filetype badge", () => {
    render(
      <DocMedia
        variant="file"
        filename="data.csv"
        fileType="CSV"
      />
    );
    expect(screen.getByText("data.csv")).toBeInTheDocument();
    expect(screen.getByText("CSV")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Download" })
    ).toBeInTheDocument();
  });

  it("file variant detects XLS/XLSX for green accent", () => {
    const { container: xlsContainer } = render(
      <DocMedia variant="file" fileType="XLS" data-testid="xls" />
    );
    const xlsBadge = xlsContainer.querySelector(
      "[style*='background-color']"
    ) as HTMLElement;
    // The icon container should use green light background
    expect(xlsBadge?.style.backgroundColor).toBe("rgb(220, 250, 230)");

    const { container: docContainer } = render(
      <DocMedia variant="file" fileType="DOC" data-testid="doc" />
    );
    const docBadge = docContainer.querySelector(
      "[style*='background-color']"
    ) as HTMLElement;
    // The icon container should use gray background
    expect(docBadge?.style.backgroundColor).toBe("rgb(233, 234, 235)");
  });

  it("custom className is applied", () => {
    const { container } = render(
      <DocMedia variant="preview" className="custom-class" />
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass("custom-class");
  });

  it("ref forwarding works", () => {
    const ref = vi.fn();
    render(<DocMedia ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("data-testid spreads correctly", () => {
    render(<DocMedia data-testid="doc-media" />);
    expect(screen.getByTestId("doc-media")).toBeInTheDocument();
  });

  it("onDownload fires on download button click", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    render(
      <DocMedia variant="file" fileType="PDF" onDownload={onDownload} />
    );
    const downloadButton = screen.getByRole("button", { name: "Download" });
    await user.click(downloadButton);
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it("preview variant shows default filename when none provided", () => {
    render(<DocMedia variant="preview" />);
    expect(screen.getByText("Document")).toBeInTheDocument();
  });

  it("file variant shows default filename when none provided", () => {
    render(<DocMedia variant="file" />);
    expect(screen.getByText("File")).toBeInTheDocument();
  });

  it("file variant shows default FILE label when fileType not provided", () => {
    render(<DocMedia variant="file" />);
    expect(screen.getByText("FILE")).toBeInTheDocument();
  });

  it("defaults to preview variant", () => {
    const { container } = render(
      <DocMedia thumbnailUrl="https://example.com/thumb.jpg" filename="Test.pdf" />
    );
    // Preview variant has the gradient overlay
    const gradient = container.querySelector(".bg-gradient-to-t");
    expect(gradient).toBeInTheDocument();
  });
});
