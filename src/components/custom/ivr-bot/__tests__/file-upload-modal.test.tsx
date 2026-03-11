import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FileUploadModal } from "../file-upload-modal";

describe("FileUploadModal", () => {
  it("renders title and buttons when open", () => {
    render(<FileUploadModal open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText("File Upload")).toBeInTheDocument();
    expect(screen.getByText("Upload from device")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(
      <FileUploadModal open={true} onOpenChange={vi.fn()} title="Upload Images" />
    );
    expect(screen.getByText("Upload Images")).toBeInTheDocument();
  });

  it("shows sample download link when onSampleDownload is provided", () => {
    render(
      <FileUploadModal open={true} onOpenChange={vi.fn()} onSampleDownload={vi.fn()} />
    );
    expect(screen.getByText("Download sample file")).toBeInTheDocument();
  });

  it("hides sample download link when not provided", () => {
    render(<FileUploadModal open={true} onOpenChange={vi.fn()} />);
    expect(screen.queryByText("Download sample file")).not.toBeInTheDocument();
  });

  it("calls onSampleDownload when link is clicked", async () => {
    const user = userEvent.setup();
    const onSampleDownload = vi.fn();
    render(
      <FileUploadModal open={true} onOpenChange={vi.fn()} onSampleDownload={onSampleDownload} />
    );
    await user.click(screen.getByText("Download sample file"));
    expect(onSampleDownload).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel and onOpenChange when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <FileUploadModal open={true} onOpenChange={onOpenChange} onCancel={onCancel} />
    );
    await user.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders custom labels", () => {
    render(
      <FileUploadModal
        open={true}
        onOpenChange={vi.fn()}
        uploadButtonLabel="Choose files"
        dropDescription="or drop files here"
        saveLabel="Upload"
        cancelLabel="Dismiss"
        formatDescription="Only PDFs allowed"
      />
    );
    expect(screen.getByText("Choose files")).toBeInTheDocument();
    expect(screen.getByText("or drop files here")).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.getByText("Dismiss")).toBeInTheDocument();
    expect(screen.getByText("Only PDFs allowed")).toBeInTheDocument();
  });

  it("Save button is disabled when no files uploaded", () => {
    render(<FileUploadModal open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText("Save").closest("button")).toBeDisabled();
  });

  it("does not render when closed", () => {
    render(<FileUploadModal open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText("File Upload")).not.toBeInTheDocument();
  });

  it("renders close button with aria-label", () => {
    render(<FileUploadModal open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
  });
});
