import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FileUploadModal } from "../file-upload-modal";

const { toastError } = vi.hoisted(() => ({
  toastError: vi.fn(),
}));

vi.mock("../../../ui/toast", () => ({
  toast: Object.assign(vi.fn(), { error: toastError }),
}));

describe("FileUploadModal", () => {
  beforeEach(() => {
    toastError.mockClear();
  });

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

  it("shows error toast and does not upload disallowed file types", () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    render(
      <FileUploadModal
        open={true}
        onOpenChange={vi.fn()}
        onUpload={onUpload}
      />
    );
    const input = document.querySelector(
      "input[type=file]"
    ) as HTMLInputElement;
    const file = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    // fireEvent bypasses host `accept` filtering (drag-and-drop also bypasses it in browsers)
    fireEvent.change(input, { target: { files: [file] } });
    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalledWith({
      title: "Unsupported file type",
      description: "Only files in the supported formats can be uploaded.",
    });
    expect(onUpload).not.toHaveBeenCalled();
    expect(screen.queryByText("photo.jpg")).not.toBeInTheDocument();
  });

  it("shows a single error toast when multiple disallowed file types are selected at once", () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    render(
      <FileUploadModal
        open={true}
        onOpenChange={vi.fn()}
        onUpload={onUpload}
      />
    );
    const input = document.querySelector(
      "input[type=file]"
    ) as HTMLInputElement;
    const files = [
      new File(["a"], "a.jpg", { type: "image/jpeg" }),
      new File(["b"], "b.png", { type: "image/png" }),
      new File(["c"], "c.gif", { type: "image/gif" }),
    ];
    fireEvent.change(input, { target: { files } });
    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalledWith({
      title: "Unsupported file type",
      description:
        "3 files are not in a supported format. Only files in the supported formats can be uploaded.",
    });
    expect(onUpload).not.toHaveBeenCalled();
  });

  it("shows one disallowed-type toast and still processes allowed files in the same batch", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    render(
      <FileUploadModal
        open={true}
        onOpenChange={vi.fn()}
        onUpload={onUpload}
      />
    );
    const input = document.querySelector(
      "input[type=file]"
    ) as HTMLInputElement;
    const valid = new File(["p"], "doc.pdf", { type: "application/pdf" });
    const invalid = new File(["x"], "a.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [invalid, valid] } });
    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalledWith({
      title: "Unsupported file type",
      description: "Only files in the supported formats can be uploaded.",
    });
    await waitFor(() => {
      expect(onUpload).toHaveBeenCalledTimes(1);
    });
    expect(onUpload).toHaveBeenCalledWith(
      valid,
      expect.objectContaining({ onProgress: expect.any(Function), onError: expect.any(Function) })
    );
  });

  it("uses custom disallowed-file-type toast copy", () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    render(
      <FileUploadModal
        open={true}
        onOpenChange={vi.fn()}
        onUpload={onUpload}
        disallowedFileTypeToastTitle="Invalid file"
        disallowedFileTypeToastDescription="Pick a PDF or CSV only."
      />
    );
    const input = document.querySelector(
      "input[type=file]"
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(["x"], "a.png", { type: "image/png" })] },
    });
    expect(toastError).toHaveBeenCalledWith({
      title: "Invalid file",
      description: "Pick a PDF or CSV only.",
    });
  });

  it("builds default format line from allowedFileTypesDescription", () => {
    render(
      <FileUploadModal
        open={true}
        onOpenChange={vi.fn()}
        maxFileSizeMB={50}
        allowedFileTypesDescription="Supported: PDF only"
      />
    );
    expect(
      screen.getByText("Max file size 50 MB (Supported: PDF only)")
    ).toBeInTheDocument();
  });

  it("sets title on file name row for full name on hover", async () => {
    const user = userEvent.setup();
    const longName =
      "Apple_Developer_Program_License_Agreement_CQ4PWZ329Z676678678678687687897897897897897897897897.pdf";
    render(
      <FileUploadModal
        open={true}
        onOpenChange={vi.fn()}
        onUpload={vi.fn().mockResolvedValue(undefined)}
      />
    );
    const input = document.querySelector(
      "input[type=file]"
    ) as HTMLInputElement;
    const file = new File(["x"], longName, { type: "application/pdf" });
    await user.upload(input, file);
    const nameRow = await screen.findByText(longName);
    expect(nameRow).toHaveAttribute("title", longName);
  });
});
